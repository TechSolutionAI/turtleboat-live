import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  api_key: process.env.CLOUDINARY_API_KEY ?? '',
  api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
});

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '10mb'
      }
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'POST':
      // Handle POST request
      saveAudio(req, res)
      break
    case 'PUT':
      // Handle POST request
      uploadAudio(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function saveAudio(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { vid, data } = req.body;
    const binarydata = Buffer.from(data, 'base64');
    const ventureId = new ObjectId(vid.toString());
    const db = await getDb();
    const audioUploadResult = await cloudinary.uploader.upload(`data:audio/ogg;base64,${data}`, { 
        public_id: `elevatorpitch_${ventureId}`,
        overwrite: true,
        timestamp: new Date().getTime(),
        resource_type: 'auto',
        folder: "pitches",
        invalidate: true,
    });
    const result = await db
        .collection("ventures")
        .updateOne({ _id: ventureId }, { $set: { 'audio': audioUploadResult.secure_url } });
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

async function uploadAudio(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, data } = req.body;
    const audioUploadResult = await cloudinary.uploader.upload(`data:audio/ogg;base64,${data}`, { 
        public_id: `elevatorpitch_${id.toString()}`,
        overwrite: true,
        timestamp: new Date().getTime(),
        resource_type: 'auto',
        folder: "pitches",
        invalidate: true,
    });
    res.status(200).json({ success: true, url: audioUploadResult.secure_url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}