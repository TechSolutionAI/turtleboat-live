import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";
import { Session, User, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Pusher from "pusher";

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
      updateAssessment(req, res);
      break
    case 'PUT':
      // Handle PUT request
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function updateAssessment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uid, vid, assessments, articulates } = req.body;
    const ventureId = new ObjectId(vid.toString());
    const userId = new ObjectId(uid.toString());

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const assessmentData = {
      _id: userId.toString(),
      value: assessments,
      articulates: articulates,
      lastUpdated: new Date(),
    };
    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        "assessments": { $exists: false },
      },
      {
        $set: {
          "assessments": [],
        },
      }
    );

    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        $or: [
          { "assessments._id": userId.toString() },
          { "assessments._id": userId },
        ],
      },
      {
        $pull: {
          "assessments": {
            $or: [
              { _id: userId },
              { _id: userId.toString() }
            ]
          }
        }
      },
    );

    // If the evaluation doesn't exist, push it
    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
      },
      {
        $push: {
          "assessments": assessmentData,
        },
      }
    );

      res.status(200).json({ success: true, result: assessmentData });
    } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}