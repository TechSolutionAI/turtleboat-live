import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from 'cloudinary';

const SERVER_ERR_MSG = "Something went wrong in a server.";

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
            break
        case 'POST':
            // Handle POST request
            getCloudinaryConfig(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['POST', 'PUT', 'GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getCloudinaryConfig(req: NextApiRequest, res: NextApiResponse) {
    const timestamp = new Date().getTime();
    const {
        folder,
        publicId,
        overwrite,
        eagerAsync,
        invalidate,
        eager,
        format
    } = req.body;

    console.log({
        timestamp: timestamp,
        eager: eager,
        folder: folder,
        public_id: publicId,
        overwrite: overwrite,
        eager_async: eagerAsync,
        invalidate: invalidate
    })

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        eager: eager,
        folder: folder,
        public_id: publicId,
        overwrite: overwrite,
        eager_async: eagerAsync,
        invalidate: invalidate,
        format: format
    }, process.env.CLOUDINARY_API_SECRET ?? "");

    res.status(200).json({
        timestamp: timestamp,
        signature: signature,
        cloudname: process.env.CLOUDINARY_CLOUD_NAME ?? '',
        apikey: process.env.CLOUDINARY_API_KEY ?? '',
    });
}