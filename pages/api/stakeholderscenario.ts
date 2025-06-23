import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/types/user.type";
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
            updateStakeholderScenario(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function updateStakeholderScenario(req: NextApiRequest, res: NextApiResponse) {

    const session: Session | null = await getServerSession(req, res, authOptions);
    const user = session?.user as User;
    const userId = user._id;

        
    try {
        const { vid, data } = req.body;
        const ventureId = new ObjectId(vid.toString());
        const db = await getDb();
        
        const result = await db
            .collection("ventures")
            .updateOne({
                _id: ventureId
            }, {
                $set: {
                    stakeholderScenario: data,
                    updatedAt: new Date()
                }
            });

        // Get Token Action for "Brainstorm": no is 18
        const tokenAction = await db
        .collection("token_actions")
        .findOne({ no: 18 });

        await db.collection("token_history").insertOne({
            userId: userId,
            createdAt: new Date(),
            amount: tokenAction.tokenAmount,
            isView: false,
            updatedAt: new Date(),
            actionNo: 18,
            type: "action",
        });

        pusher.trigger(`user-token-${userId}`, "token-history", {
            type: 1,
            name: tokenAction.name,
            tokenAmount: tokenAction.tokenAmount,
        });
        // Update User Tokens
        const userInfo = await db.collection("users").findOne({ _id: userId });

        await db.collection("users").updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    tokens: userInfo.tokens + tokenAction.tokenAmount,
                    totalEarnedTokens:
                        userInfo.totalEarnedTokens + tokenAction.tokenAmount,
                },
            }
        );

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