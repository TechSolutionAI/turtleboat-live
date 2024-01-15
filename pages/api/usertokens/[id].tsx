import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getTokenInfo(req, res)
            break
        case 'POST':
            // Handle POST request
            markAsView(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getTokenInfo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const userId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const userInfo = await db
            .collection("users")
            .findOne({ _id: userId });
        
        const levels = await db
            .collection("tokenactivity_levels")
            .find()
            .toArray();

        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();

        const quarter = Math.floor(month / 3);

        const startMonth = quarter * 3 + 1;
        const endMonth = (startMonth + 3) % 12;
        let endYear = year;
        if (quarter == 3) {
            endYear = year + 1;
        }

        const startMonthString = startMonth < 10 ? "0" + startMonth.toString() : startMonth.toString();
        const endMonthString = endMonth < 10 ? "0" + endMonth.toString() : endMonth.toString();
        const startDateString = year.toString() + "-" + startMonthString + "-01";
        const endDateString = endYear + "-" + endMonthString + "-01";
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const latestHistory = await db.collection("token_history").findOne({ isView: false, userId: userId }, {sort: {$natural: -1}});

        let actionInfo: any = null;

        if (latestHistory != null) {
            if (latestHistory.type == 'action') {
                const tokenActionInfo = await db
                    .collection("token_actions")
                    .findOne({ no: latestHistory.actionNo });
                actionInfo = {
                    type: 1,
                    name: tokenActionInfo.name,
                    tokenAmount: tokenActionInfo.tokenAmount
                }
            } else if (latestHistory.type == 'reward'){
                const rewardInfo = await db
                    .collection("rewards")
                    .findOne({ no: latestHistory.actionNo });
                actionInfo = {
                    type: 0,
                    name: rewardInfo.name,
                    tokenAmount: rewardInfo.cost
                }
            }
        }

        let tokensEarnedQuarter = 0;

        db.collection("token_history").aggregate([
            {
                $match: {
                    userId: userId,
                    type: 'action',
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]).toArray().then((result: any[]) => {
            if (result.length > 0) {
                tokensEarnedQuarter = result[0].totalAmount;
            }
            res.status(200).json({ 
                tokens: userInfo.tokens, 
                totalEarnedTokens: userInfo.totalEarnedTokens, 
                tokensEarnedQuarter: tokensEarnedQuarter, 
                latestAction: actionInfo,
                levels: levels
            });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ err: SERVER_ERR_MSG });
        });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function markAsView(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const userId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        await db.collection("token_history")
            .updateMany(
                {
                userId: userId
                },
                { $set: { isView: true } }
            );
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}