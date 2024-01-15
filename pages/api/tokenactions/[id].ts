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
            getToken(req, res)
            break
        case 'POST':
            // Handle POST request
            saveToken(req, res)
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getToken(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const tokenId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const tokenItem = await db
            .collection("token_actions")
            .findOne({
                _id: tokenId
            })
        res.status(200).json({ tokenItem: tokenItem });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function saveToken(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { name, description, tokenAmount } = req.body;
        const tokenId = new ObjectId(id?.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const result = await db
            .collection("token_actions")
            .updateOne(
                {
                    _id: tokenId
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