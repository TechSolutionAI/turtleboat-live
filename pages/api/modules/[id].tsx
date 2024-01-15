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
        case 'GET':
            // Handle GET request
            getModule(req, res);
            break
        case 'DELETE':
            // Handle DELETE request
            deleteModule(req, res);
            break
        case 'POST':
            // Handle POST request
            duplicateModule(req, res);
            break
        default:
            res.setHeader('Allow', ['DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function deleteModule(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const moduleId = new ObjectId(id?.toString());
        const result = await db
            .collection("modules")
            .deleteOne({ _id: moduleId });
        if (!result.acknowledged) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function getModule(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const moduleId = new ObjectId(id?.toString());
        const result = await db
            .collection("modules")
            .findOne({ _id: moduleId });
        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function duplicateModule(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const moduleId = new ObjectId(id?.toString());
        const originalModule = await db
            .collection("modules")
            .findOne({ _id: moduleId });

        if (originalModule != null) {
            const result = await db
                .collection("modules")
                .insertOne({ title: originalModule.title, content: originalModule.content, item: originalModule.item, files: originalModule.files });
            if (!result.acknowledged) {
                res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            } else {
                const data = await db
                    .collection("modules")
                    .findOne({ _id: result.insertedId });
                res.status(200).json({ success: true, result: data });
            }
        } else {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}
