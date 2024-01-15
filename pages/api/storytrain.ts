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
            break
        case 'POST':
            // Handle POST request
            updateStoryTrain(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function updateStoryTrain(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { vid, data } = req.body;
        const ventureId = new ObjectId(vid.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        
        const result = await db
            .collection("ventures")
            .updateOne({
            _id: ventureId
            }, {
                $set: {
                    storyTrain: data,
                    updatedAt: new Date()
                }
            });

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