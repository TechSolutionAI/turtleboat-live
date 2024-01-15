import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Pusher from 'pusher';
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
    api: {
      responseLimit: '20mb',
    },
}

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
            break
        case 'DELETE':
            break
        case 'POST':
            // Handle POST request
            approveClaimRequest(req, res);
            break
        case 'PUT':
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function approveClaimRequest(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    try {
        const { id } = req.query;
        const { cid, uid, uemail } = req.body;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const rewardId = new ObjectId(id?.toString());
        const userId = new ObjectId(uid.toString());
        const claimId = new ObjectId(cid.toString());
        const result = await db
            .collection("claim_requests")
            .updateOne({
                _id: claimId
            }, {
                $set: {
                    isClaimed: true,
                    updatedAt: new Date()
                }
            });
        
        const rewardInfo = await db
            .collection("rewards")
            .findOne({ _id: rewardId });

        const notification = {
            from: session?.user?.name,
            to: uid.toString(),
            message: `Your Claim Request for Reward ${rewardInfo.name} was accepted!`,
            link: ``,
            isRead: false,
            isFlag: false,
            createdAt: new Date()
        };

        const notify = {
            fromName: session?.user?.name,
            email: uemail.toString(),
        };

        await db.collection("notifications")
                .insertOne(notification);

        await db
            .collection("token_history")
            .insertOne({
                userId: userId,
                createdAt: new Date(),
                amount: rewardInfo.cost,
                isView: false,
                updatedAt: new Date(),
                actionNo: rewardInfo.no,
                type: 'reward'
            });
        pusher.trigger(`user-token-${uid.toString()}`, 'token-history', {
            type: 0,
            name: rewardInfo.name,
            tokenAmount: rewardInfo.cost
        });
        // Update User Tokens
        const userInfo = await db
            .collection("users")
            .findOne({  _id: userId });

        await db.collection("users")
            .updateOne(
                {
                    _id: userId
                },
                {
                    $set: {
                        tokens: userInfo.tokens - rewardInfo.cost
                    }
                }
            );

        
        try {
            await sendgrid.send({
                to: notify.email,
                from: {
                    email: "yCITIES1@gmail.com",
                    name: "Turtle Boat"
                },
                subject: "Redemption Alert",
                cc: process.env.CC_EMAIL,
                templateId: "d-47f6fc1034d4470e98d8a4ead5d1d117",
                dynamicTemplateData: {
                    subject: "Redemption Alert",
                    oldBalance: userInfo.tokens,
                    transactionAmount: rewardInfo.cost,
                    newBalance: userInfo.tokens - rewardInfo.cost,
                    summary: "You claimed Reward Successfully.",
                    redemption: rewardInfo.name
                },
                isMultiple: false,
            });
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({ err: SERVER_ERR_MSG });
        }

        if (!result.matchedCount) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}
