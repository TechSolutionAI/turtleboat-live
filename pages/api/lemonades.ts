import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";
import sendgrid from "@sendgrid/mail";
import { v4 as uuid } from "uuid";
import Pusher from 'pusher';
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
    secret: process.env.PUSHER_APP_SECRET ?? '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
    useTLS: true,
});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getLemonades(req, res)
            break
        case 'POST':
            // Handle POST request
            createLemonade(req, res);
            break
        case 'PUT':
            // Handle PUT request
            updateLemonade(req, res);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function createLemonade(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data } = req.body;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const lemonadeId = new ObjectId();

        let invites: Array<any> = [];
        const lemonade = {
            _id: lemonadeId,
            name: data.name,
            pillar: data.pillar,
            description: data.description,
            participants: [
                {
                    email: data.user.email,
                    name: data.user.name,
                    image: data.user.image,
                    _id: data.user._id,
                    isInitiator: true,
                    commentCount: 0,
                    hasPitch: false
                }
            ],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isCompleted: false,
            pitch: data.pitch,
            isRemind: false
        }
        const result = await db.collection("lemonades").insertOne(lemonade)

        // Get Token Action for "Participate in Coffee Chat": no is 14
        const tokenAction = await db
            .collection("token_actions")
            .findOne({ no: 14 });

        await db
            .collection("token_history")
            .insertOne({
                userId: new ObjectId(data.user._id.toString()),
                createdAt: new Date(),
                amount: tokenAction.tokenAmount,
                isView: false,
                updatedAt: new Date(),
                actionNo: 14,
                type: 'action'
            });

        const userId = new ObjectId(data.user._id.toString());
        pusher.trigger(`user-token-${data.user._id.toString()}`, 'token-history', {
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

        let notifications: any[] = [];
        // Complete Process
        if (!result.acknowledged) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            data.participants.map(async (participant: any, idx: any) => {
                const uniqueId: any = uuid();
                invites.push({
                    inviteId: uniqueId,
                    from: data.user.name,
                    fromEmail: data.user.email,
                    image: data.user.image,
                    to: participant.email,
                    lemonadeId: lemonadeId,
                    time: new Date(),
                    isExpired: false,
                    isRemind: false
                });

                const notificationForComment = {
                    from: data.user._id,
                    to: participant._id,
                    message: `${data.user.name} has invited you to Coffee Chat`,
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
                        subject: `${data.user.name} has invited you to Coffee Chat`,
                        cc: process.env.CC_EMAIL,
                        templateId: "d-fe729e80a4e64a18be0907571cfe5e61",
                        dynamicTemplateData: {
                            subject: `${data.user.name} has invited you to Coffee Chat`,
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
                return res.status(200).json({ success: true, lemonadeId: lemonadeId });
            } else {
                return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function getLemonades(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: Session | null = await getServerSession(req, res, authOptions);
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const ownLemonades = await db
            .collection("lemonades")
            .find({
                participants: {
                    $elemMatch: {
                        email: session?.user?.email,
                        isInitiator: true,
                    },
                },
            })
            .toArray();

        const lemonades = await db
            .collection("lemonades")
            .find()
            .toArray();

        const invitedResult = await db
            .collection("lemonades")
            .find({
                participants: {
                    $elemMatch: {
                        email: session?.user?.email,
                        isInitiator: false,
                    },
                },
            })
            .toArray();

        res.status(200).json({ myLemonades: ownLemonades, invitedLemonades: invitedResult, lemonades: lemonades });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function updateLemonade(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.body;
        const lemonadeId = new ObjectId(id.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const result = await db
            .collection("lemonades")
            .updateOne({
                _id: lemonadeId
            }, {
                $set: {
                    isCompleted: true,
                    updatedAt: new Date()
                }
            });

        const lemonade = await db
            .collection("lemonades")
            .findOne({
                _id: lemonadeId
            });

        lemonade.participants.map(async (participant: any, idx: any) => {
            if (!participant.isInitiator) {
                try {
                    await sendgrid.send({
                        to: participant.email,
                        from: {
                            email: "yCITIES1@gmail.com",
                            name: "Turtle Boat"
                        },
                        subject: `Coffee Chat Completion`,
                        text: 'Thank you for participating in this Coffee Chat of Entrepreneurial Wits. It is now complete, and your input has helped move the needle.',
                        cc: process.env.CC_EMAIL,
                        isMultiple: false,
                    });
                } catch (err: any) {
                    return res.status(500).json({ err: SERVER_ERR_MSG });
                }
            }
        });

        if (!result.matchedCount) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}