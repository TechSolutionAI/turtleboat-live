import { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "mongodb";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sendgrid from "@sendgrid/mail";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
    api: {
        responseLimit: '20mb',
    },
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getVideo(req, res);
            break
        case 'DELETE':
            // Handle DELETE request
            deleteVideo(req, res);
            break
        case 'POST':
            // Handle POST request
            updateVideoStatus(req, res);
            break
        case 'PUT':
            // Handle PUT request
            updateComments(req, res);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function deleteVideo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const db = await getDb();
        
        const videoId = new ObjectId(id?.toString());
        const result = await db
            .collection("nanotalkvideos")
            .deleteOne({ _id: videoId });
        if (!result.acknowledged) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    }
}

async function updateComments(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { comment } = req.body;
        const db = await getDb();
        
        const videoId = new ObjectId(id?.toString());
        let username = comment.user.name;
        if (!comment.user.isNewUser && comment.user.basicProfile && comment.user.basicProfile.firstName && comment.user.basicProfile.lastName) {
            username = comment.user.basicProfile?.firstName + ' ' + comment.user.basicProfile?.lastName;
        }
        const commentData = {
            emotion: comment.emotion,
            user: {
                email: comment.user.email,
                name: username,
                image: comment.user.image,
                _id: comment.user._id
            },
            createdAt: new Date(),
        }

        let updateResult: any = {
            matchedCount: false
        };

        if (comment.emotion == -1) {
            updateResult = await db
                .collection("nanotalkvideos")
                .updateMany(
                    {
                        _id: videoId,
                        'comments.user.email': comment.user.email,
                        type: { $ne: 1 }
                    },
                    { $pull: { comments: { 'user.email': comment.user.email } } }
                );
        } else {
            updateResult = await db.collection("nanotalkvideos")
                .updateMany(
                    {
                        _id: videoId,
                        'comments.user.email': comment.user.email,
                        type: { $ne: 1 }
                    },
                    {
                        $set: {
                            'comments.$.emotion': comment.emotion,
                            'comments.$.createdAt': new Date()
                        }
                    }
                );
        }

        let addResult = null;
        let success = false;
        if (!updateResult.acknowledged || comment.emotion != -1) {
            addResult = await db
                .collection("nanotalkvideos")
                .updateOne(
                    { _id: videoId },
                    {
                        $addToSet: { comments: { $each: [commentData] } },
                        $set: {
                            updatedAt: new Date()
                        }
                    }
                );
        }
        if (addResult != null) {
            success = addResult.matchedCount;
        } else {
            success = true;
        }
        if (!success) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            // Get Token Action for "Emoji Feedback on NanoTalk": no is 12
            const tokenAction = await db
                .collection("token_actions")
                .findOne({ no: 12 });

            await db
                .collection("token_history")
                .insertOne({
                    userId: new ObjectId(comment.user._id.toString()),
                    createdAt: new Date(),
                    amount: tokenAction.tokenAmount,
                    isView: false,
                    updatedAt: new Date(),
                    actionNo: 12,
                    type: 'action'
                });

            const userId = new ObjectId(comment.user._id.toString());
            pusher.trigger(`user-token-${comment.user._id.toString()}`, 'token-history', {
                type: 1,
                name: tokenAction.name,
                tokenAmount: tokenAction.tokenAmount
            });
            // Update User Tokens
            const userInfo = await db
                .collection("users")
                .findOne({ _id: userId });

            await db.collection("users")
                .updateOne(
                    {
                        _id: userId
                    },
                    {
                        $set: {
                            tokens: userInfo.tokens + tokenAction.tokenAmount,
                            totalEarnedTokens: userInfo.totalEarnedTokens + tokenAction.tokenAmount
                        }
                    }
                );

            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function getVideo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const db = await getDb();
        
        const videoId = new ObjectId(id?.toString());
        const result = await db
            .collection("nanotalkvideos")
            .findOne({ _id: videoId });
        const authorId = result.author._id;
        const moreVideos = await db
            .collection("nanotalkvideos")
            .find({
                'author._id': authorId,
                _id: { $ne: videoId },
                status: 'public'
            })
            .toArray();
        res.status(200).json({ video: result, moreVideos: moreVideos });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function updateVideoStatus(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    try {
        const { id } = req.query;
        const { status } = req.body;
        const db = await getDb();
        
        const videoId = new ObjectId(id?.toString());
        const result = await db
            .collection("nanotalkvideos")
            .updateOne({
                _id: videoId
            }, {
                $set: {
                    status: status,
                    updatedAt: new Date()
                }
            });

        var message = status == 'public' ? 'Your 3 min Nanotalk has been approved and posted onto CORE tab.' : 'Your 3 min Nanotalk was not approved. The most likely reason is that your video is over 3 min long.';

        const videoResult = await db
            .collection("nanotalkvideos")
            .findOne({ _id: videoId });

        const notification = {
            from: session?.user?.name,
            to: videoResult.author._id.toString(),
            message: message,
            link: `/dashboard/core/makeninety`,
            isRead: false,
            isFlag: false,
            createdAt: new Date()
        };
        const notify = {
            fromName: session?.user?.name,
            email: videoResult.author.email,
            notificationLink: `${process.env.HOME_URL}/dashboard/core/makeninety`
        };
        try {
            await sendgrid.send({
                to: notify.email,
                from: {
                    email: "yCITIES1@gmail.com",
                    name: "Turtle Boat"
                },
                subject: status == 'public' ? 'Your 3 min NanoTalk has been approved' : 'Your 3 min NanoTalk was not approved.',
                cc: process.env.CC_EMAIL,
                text: message,
                isMultiple: false,
            });
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({ err: SERVER_ERR_MSG });
        }
        await db.collection("notifications")
            .insertOne(notification);
        pusher.trigger(`user-${videoResult.author._id.toString()}`, 'comment', notification);

        if (!result.matchedCount) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            // Get Token Action for "Upload an NanoTalk": no is 4
            // let actionNo = 0;
            // switch (videoResult.type) {
            //     case 1:
            //         actionNo = 4;
            //         break;
            //     case 2:
            //         actionNo = 5;
            //         break;
            //     case 3:
            //         actionNo = 6;
            //         break;
            // }
            // if (actionNo != 0 && status == 'public') {
            //     const tokenAction = await db
            //         .collection("token_actions")
            //         .findOne({ no: actionNo });

            //     await db
            //         .collection("token_history")
            //         .insertOne({
            //             userId: new ObjectId(videoResult.author._id.toString()),
            //             createdAt: new Date(),
            //             amount: tokenAction.tokenAmount,
            //             isView: false,
            //             updatedAt: new Date(),
            //             actionNo: 4,
            //             type: 'action'
            //         });

            //     const userId = new ObjectId(videoResult.author._id.toString());
            //     pusher.trigger(`user-token-${videoResult.author._id.toString()}`, 'token-history', {
            //         type: 1,
            //         name: tokenAction.name,
            //         tokenAmount: tokenAction.tokenAmount
            //     });
            //     // Update User Tokens
            //     const userInfo = await db
            //         .collection("users")
            //         .findOne({  _id: userId });

            //     await db.collection("users")
            //         .updateOne(
            //             {
            //                 _id: userId
            //             },
            //             {
            //                 $set: {
            //                     tokens: userInfo.tokens + tokenAction.tokenAmount,
            //                     totalEarnedTokens: userInfo.totalEarnedTokens + tokenAction.tokenAmount
            //                 }
            //             }
            //         );
            // }

            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}