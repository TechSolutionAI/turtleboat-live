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
            getLevel(req, res)
            break
        case 'POST':
            // Handle POST request
            saveLevel(req, res)
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getLevel(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const levelId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const level = await db
            .collection("tokenactivity_levels")
            .findOne({
                _id: levelId
            })
        res.status(200).json({ level: level });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function saveLevel(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { name, description, tokenAmount } = req.body;
        const levelId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const result = await db
            .collection("tokenactivity_levels")
            .updateOne(
                {
                    _id: levelId
                },
                {
                    $set: {
                        name: name,
                        description: description,
                        tokenAmount: parseInt(tokenAmount)
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