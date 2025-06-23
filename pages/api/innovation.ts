import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            break
        case 'POST':
            // Handle POST request
            sendInnovationRequest(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function sendInnovationRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: Session | null = await getServerSession(req, res, authOptions);
        const { uid, note } = req.body;
        const db = await getDb();
        const admins = await db
            .collection("users")
            .find({ role: "admin" })
            .toArray();

        let notifications: any[] = [];

        admins.map((admin: any) => {
            const date = new Date();
            const notification = {
                from: uid.toString(),
                to: admin._id.toString(),
                message: `${session?.user?.name} requested New Innovation Journal. Note: ${note}`,
                link: ``,
                isRead: false,
                isFlag: false,
                createdAt: date
            };
            notifications.push(notification);
            pusher.trigger(`user-${admin._id.toString()}`, 'comment', notification);
        });

        const notificationResult = await db
            .collection("notifications")
            .insertMany(notifications);

        if (!notificationResult.acknowledged) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true, err: '' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}