import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'POST':
            // Handle POST request
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

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
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