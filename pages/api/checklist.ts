import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'POST':
            // Handle POST request
            updateToken(req, res);
            break
        case 'PUT':
            // Handle PUT request
            updateCheckStatus(req, res);
            break
        default:
            res.setHeader('Allow', ['POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function updateCheckStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { mid, vid, checkList } = req.body;
        const moduleId = new ObjectId(mid.toString());
        const ventureId = new ObjectId(vid.toString());

        const db = await getDb();
        const result = await db.collection("ventures")
            .updateOne(
                {
                    _id: ventureId,
                    $or: [
                        { "course.modules.module._id": moduleId.toString() },
                        { "course.modules.module._id": moduleId }
                    ]
                },
                {
                    $set: {
                        'course.modules.$.checkList': checkList
                    }
                }
            );
        if (!result.matchedCount) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function updateToken(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { uid, mid, vid, index, checked } = req.body;
        const userId = new ObjectId(uid);
        const moduleId = new ObjectId(mid.toString());
        const ventureId = new ObjectId(vid.toString());

        const db = await getDb();
   
        const tokenAnctionNo = 20 + index;

        const tokenAction = await db
        .collection("token_actions")
        .findOne({ no: tokenAnctionNo });

        const tokenAmount = checked ? tokenAction.tokenAmount : -tokenAction.tokenAmount

        await db.collection("token_history").insertOne({
            userId: userId,
            createdAt: new Date(),
            amount: tokenAmount,
            isView: false,
            updatedAt: new Date(),
            actionNo: tokenAnctionNo,
            type: "action",
        });

        pusher.trigger(`user-token-${uid}`, "token-history", {
            type: 1,
            name: tokenAction.name,
            tokenAmount: tokenAmount,
        });
        // Update User Tokens
        const userInfo = await db.collection("users").findOne({ _id: userId });

        const result = await db.collection("users").updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    tokens: userInfo.tokens + tokenAmount,
                    totalEarnedTokens:
                        userInfo.totalEarnedTokens + tokenAmount,
                },
            }
        );
        if (!result.matchedCount) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}