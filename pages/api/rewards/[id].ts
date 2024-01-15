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
            getReward(req, res)
            break
        case 'POST':
            // Handle POST request
            saveReward(req, res)
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getReward(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const rewardId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const reward = await db
            .collection("rewards")
            .findOne({
                _id: rewardId
            })
        res.status(200).json({ reward: reward });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function saveReward(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { name, description, cost } = req.body;
        const rewardId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const result = await db
            .collection("rewards")
            .updateOne(
                {
                    _id: rewardId
                },
                {
                    $set: {
                        name: name,
                        description: description,
                        cost: parseInt(cost)
                    }
                }
            )
        if (!result.matchedCount) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}