import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            // Handle GET request
            getClaimRequests(res)
            break
        case 'POST':
            // Handle POST request
            sendClaimRequest(req, res);
            break
        case 'PUT':
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getClaimRequests(res: NextApiResponse) {
    try {
        const db = await getDb();
  
        const result = await db
            .collection("claim_requests")
            .find({
                isClaimed: false
            })
            .toArray();
        res.status(200).json({ claimList: result });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function sendClaimRequest(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }

        const {
            uid,
            dates, 
            content,
            rewardNo,
            username
        } = fields;

        const availableDates = JSON.parse(dates?.toString() ?? "");
        const db = await getDb();
        const rewardInfo = await db.collection("rewards").findOne({
            no: parseInt(rewardNo?.toString() ?? "")
        })

        const userInfo = await db
            .collection("users")
            .findOne({ email: session?.user?.email });

        const result = await db
            .collection("claim_requests")
            .insertOne({
                userId: new ObjectId(uid?.toString()),
                createdAt: new Date(),
                rewardInfo: rewardInfo,
                isClaimed: false,
                updatedAt: new Date(),
                dates: availableDates,
                content: content,
                user: {
                    email: session?.user?.email,
                    name: username,
                    image: userInfo.image,
                    _id: uid,
                },
            });
        if (!result.acknowledged) {
            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            return res.status(200).json({ success: true });
        }
    });
}