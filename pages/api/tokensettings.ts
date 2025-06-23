import getDb from "@/utils/getdb";
import { NextApiRequest, NextApiResponse } from "next";


const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getTokenSettings(res)
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

async function getTokenSettings(res: NextApiResponse) {
    try {
        const db = await getDb();
        

        const tokenItems = await db
            .collection("token_actions")
            .find()
            .sort("no", 1)
            .toArray();
        const feeReductions = await db
            .collection("fee_reductions")
            .find()
            .sort("no", 1)
            .toArray();
        res.status(200).json({ tokens: tokenItems, fees: feeReductions });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}