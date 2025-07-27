import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { Session, User, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { pusher } from "@/utils/pusher-server";
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
      break
    case 'POST':
      // Handle POST request
      udateEvaluation(req, res);
      break
    case 'PUT':
      // Handle PUT request
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function udateEvaluation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session: Session | null = await getServerSession(req, res, authOptions);
    const user = session?.user as User;
    const { uid, vid, mid, value } = req.body;
    const moduleId = new ObjectId(mid.toString());
    const ventureId = new ObjectId(vid.toString());
    const userId = new ObjectId(uid.toString());

    const db = await getDb();

    const evaluationData = {
      _id: userId.toString(),
      value: value,
      lastUpdated: new Date(),
    };
    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        "course.modules.module._id": moduleId.toString(),
        "course.modules.evaluations": { $exists: false },
      },
      {
        $set: {
          "course.modules.$.evaluations": [],
        },
      }
    );

    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        $or: [
          { "course.modules.module._id": moduleId.toString() },
          { "course.modules.module._id": moduleId },
        ],
      },
      {
        $pull: {
          "course.modules.$.evaluations": {
            $or: [
              { _id: userId },
              { _id: userId.toString() }
            ]
          }
        }
      },
    );
    // add new evaluation
    await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        $or: [
          { "course.modules.module._id": moduleId.toString() },
          { "course.modules.module._id": moduleId },
        ],
      },
      {
        $push: {
          "course.modules.$.evaluations": evaluationData
        },
        $set: {
          "course.modules.$.isFlip": true,
          "course.modules.$.lastUpdated": new Date(),
        },
      }
    );

    const ventureData = await db.collection("ventures").findOne({
      _id: ventureId,
    });
    let notifications: any[] = [];
    let userIds: any[] = [];
    if (
      ventureData.mentee != null &&
      ventureData.mentee._id.toString() != uid.toString()
    ) {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      const notificationForEvaluation = {
        from: uid.toString(),
        to: ventureData.mentee._id.toString(),
        message: `${user?.name} evaluated to "${ventureData.title}" on ${formattedDate}`,
        link: `/dashboard/myventures/module/${ventureId}-${mid}`,
        isRead: false,
        isFlag: false,
        ventureTitle: ventureData.title,
        ventureId: vid,
        moduleId: mid,
        createdAt: date,
      };

      notifications.push(notificationForEvaluation);
      userIds.push(ventureData.mentee._id.toString());
      pusher.trigger(
        `user-${ventureData.mentee._id.toString()}`,
        "evaluation",
        notificationForEvaluation
      );

      res.status(200).json({ success: true, result: evaluationData });
    }

  } catch (err) {
    debugger;
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}