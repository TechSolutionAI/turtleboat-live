import { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import sendgrid from "@sendgrid/mail";
import { v4 as uuid } from "uuid";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
    api: {
        responseLimit: '20mb',
    },
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getLemonade(req, res);
            break
        case 'DELETE':
            // Handle DELETE request
            deleteLemonade(req, res);
            break
        case 'POST':
            // Handle POST request
            postMessage(req, res);
            break
        case 'PUT':
            // Handle PUT request
            inviteMembers(req, res);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getLemonade(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const db = await getDb();
        
        const lemonadeId = new ObjectId(id?.toString());
        const result = await db
            .collection("lemonades")
            .findOne({ _id: lemonadeId });
        res.status(200).json({ lemonade: result });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function deleteLemonade(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const db = await getDb();
        
        const lemonadeId = new ObjectId(id?.toString());
        const result = await db
            .collection("lemonades")
            .deleteOne({ _id: lemonadeId });

        // Remove all notifications related with this lemonade
        await db.collection("notifications")
            .deleteMany(
                { link: { $regex: lemonadeId.toString(), $options: 'i' } }
            );

        res.status(200).json({ lemonade: result });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function inviteMembers(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { participants, from, fromEmail, image, fromId } = req.body;
        const db = await getDb();
        
        const lemonadeId = new ObjectId(id?.toString());

        let invites: Array<any> = [];
        let notifications: any[] = [];
        participants.map(async (participant: any, idx: any) => {
            const uniqueId: any = uuid();
            invites.push({
                inviteId: uniqueId,
                from: from,
                fromEmail: fromEmail,
                image: image,
                to: participant.email,
                lemonadeId: lemonadeId,
                time: new Date(),
                isExpired: false,
                isRemind: false
            });

            const notificationForComment = {
                from: fromId.toString(),
                to: participant._id,
                message: `${from} has invited you to Coffee Chat`,
                link: `/dashboard/toolbox/lemonade/${lemonadeId.toString()}`,
                isRead: false,
                isFlag: false,
                createdAt: new Date(),
                type: 'lemonade'
            };
            notifications.push(notificationForComment);
            pusher.trigger(`user-${participant._id.toString()}`, 'comment', notificationForComment);

            try {
                await sendgrid.send({
                    to: participant.email,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: `${from} has invited you to Coffee Chat`,
                    cc: process.env.CC_EMAIL,
                    templateId: "d-fe729e80a4e64a18be0907571cfe5e61",
                    dynamicTemplateData: {
                        subject: `${from} has invited you to Coffee Chat`,
                        inviteAddress: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/invite?id=${uniqueId}`,
                    },
                    isMultiple: false,
                });
            } catch (err: any) {
                return res.status(500).json({ err: SERVER_ERR_MSG });
            }
        });

        const insertResult = await db
            .collection("lemonade_invites")
            .insertMany(invites);
        const insertNotifications = await db
            .collection("notifications")
            .insertMany(notifications);
        if (insertResult.acknowledged && insertNotifications.acknowledged) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function postMessage(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { purpose, focus, content, user } = req.body;
        const db = await getDb();
        
        const lemonadeId = new ObjectId(id?.toString());
        const orgLemonade = await db
            .collection("lemonades")
            .findOne({
                _id: lemonadeId
            });

        let notifications: any[] = [];
        let emailNotifications: any[] = [];

        const comment = {
            user: user,
            purpose: purpose,
            focus: focus,
            content: content,
            createdAt: new Date()
        };

        let countOfCompleted = 0;

        const participants = orgLemonade.participants.map((participant: any) => {
            if (participant.email != user.email) {
                const date = new Date();
                const options: Intl.DateTimeFormatOptions = {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                };
                const formattedDate = date.toLocaleDateString('en-US', options);
                const notificationForComment = {
                    from: user._id,
                    to: participant._id,
                    message: `${user?.name} post messages to Coffee Chat on ${formattedDate}`,
                    link: `/dashboard/toolbox/lemonade/${lemonadeId.toString()}`,
                    isRead: false,
                    isFlag: false,
                    createdAt: date,
                    type: 'lemonade'
                };
                emailNotifications.push({
                    fromName: user?.name,
                    email: participant.email,
                    notificationLink: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/${lemonadeId.toString()}`
                });
                notifications.push(notificationForComment);
                pusher.trigger(`user-${participant._id.toString()}`, 'comment', notificationForComment);
                pusher.trigger(`user-${participant._id.toString()}`, 'lemonade-message', comment);
                if (participant.hasPitch)
                    countOfCompleted++;
            }
            if (participant.email != user.email || purpose == '') {
                if (purpose == '' && participant.email == user.email) {
                    countOfCompleted++;
                    return {
                        ...participant,
                        hasPitch: true
                    }
                } else {
                    return participant;
                }
            } else {
                return {
                    ...participant,
                    commentCount: participant.commentCount + 1
                }
            }
        })

        // Get Token Action for "Post/Comment within a Coffee Chat": no is 15
        const tokenAction = await db
            .collection("token_actions")
            .findOne({ no: 15 });

        await db
            .collection("token_history")
            .insertOne({
                userId: new ObjectId(user._id.toString()),
                createdAt: new Date(),
                amount: tokenAction.tokenAmount,
                isView: false,
                updatedAt: new Date(),
                actionNo: 15,
                type: 'action'
            });

        const userId = new ObjectId(user._id.toString());
        pusher.trigger(`user-token-${user._id.toString()}`, 'token-history', {
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

        emailNotifications.map(async (notify: any, idx: any) => {
            try {
                await sendgrid.send({
                    to: notify.email,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: `${user?.name} post messages to Coffee Chat`,
                    cc: process.env.CC_EMAIL,
                    templateId: "d-a7c7bab476384b6c89207cfc067fc285",
                    dynamicTemplateData: {
                        subject: `${user?.name} post messages to Coffee Chat`,
                        notificationlink: notify.notificationLink,
                        ventureTitle: orgLemonade.name,
                        fromName: notify.fromName
                    },
                    isMultiple: false,
                });
            } catch (err: any) {
                return res.status(500).json({ err: SERVER_ERR_MSG });
            }
        });

        let notificationResult = null;

        if (notifications.length > 0) {
            notificationResult = await db
                .collection("notifications")
                .insertMany(notifications);
        }
        const result = await db
            .collection("lemonades")
            .updateOne({
                _id: lemonadeId
            }, {
                $addToSet: {
                    comments: {
                        $each: [
                            comment
                        ]
                    }
                },
                $set: {
                    updatedAt: new Date(),
                    participants: participants,
                    isCompleted: countOfCompleted == participants.length
                }
            });
        const updatedLemonade = await db
            .collection("lemonades")
            .findOne({
                _id: lemonadeId
            });
        if (!result.matchedCount || notificationResult != null && !notificationResult.acknowledged) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true, result: updatedLemonade });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}
