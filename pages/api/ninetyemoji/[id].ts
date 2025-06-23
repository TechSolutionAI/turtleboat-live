import { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "mongodb";
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
            break
        case 'DELETE':
            // Handle DELETE request
            break
        case 'POST':
            // Handle POST request
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
                .collection("ninetyvideos")
                .updateMany(
                    {
                        _id: videoId,
                        'comments.user.email': comment.user.email,
                        type: { $ne: 1 }
                    },
                    { $pull: { comments: { 'user.email': comment.user.email } } }
                );
        } else {
            updateResult = await db.collection("ninetyvideos")
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
                .collection("ninetyvideos")
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
            success = addResult.acknowledged;
        } else {
            success = true;
        }
        if (!success) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            // Get Token Action for "Emoji Feedback on Inside Mind of Investor Video": no is 11
            const tokenAction = await db
                .collection("token_actions")
                .findOne({ no: 11 });

            await db
                .collection("token_history")
                .insertOne({
                    userId: new ObjectId(comment.user._id.toString()),
                    createdAt: new Date(),
                    amount: tokenAction.tokenAmount,
                    isView: false,
                    updatedAt: new Date(),
                    actionNo: 11,
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