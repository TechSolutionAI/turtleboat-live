import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";
import { Session, User, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

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
      udateSummarize(req, res);
      break
    case 'PUT':
      // Handle PUT request
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function udateSummarize(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { vid, mid, summarize } = req.body;
    const moduleId = new ObjectId(mid.toString());
    const ventureId = new ObjectId(vid.toString());

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const result = await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        $or: [
            { "course.modules.module._id": moduleId.toString() },
            { "course.modules.module._id": moduleId },
          ],
      },
      {
        $set: {
          "course.modules.$.module.summarize": summarize,
          "course.modules.$.module.lastUpdated": new Date(),
        }
      },
    );
    console.log(result);
    // If the evaluation doesn't exist, push it
    if (result.matchedCount === 0) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
        res.status(200).json({ success: true, result: summarize });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}