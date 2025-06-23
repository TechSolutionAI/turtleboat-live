import { NextApiRequest, NextApiResponse } from "next";
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
            getLevels(res)
            break
        case 'POST':
            // Handle POST request
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getLevels(res: NextApiResponse) {
    try {
        const db = await getDb();

        const levels = await db
            .collection("tokenactivity_levels")
            .find()
            .toArray();
        res.status(200).json({ levels: levels });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}