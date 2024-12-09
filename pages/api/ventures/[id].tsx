import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
  api: {
    responseLimit: "20mb",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Handle GET request
      getVenture(req, res);
      break;
    case "DELETE":
      // Handle DELETE request
      deleteVenture(req, res);
      break;
    case "POST":
      // Handle POST request
      archiveVenture(req, res);
      break;
    case "PUT":
      // Handle PUT request
      getVentureModule(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function deleteVenture(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const ventureId = new ObjectId(id?.toString());
    const ventureInfo = await db
      .collection("ventures")
      .findOne({ _id: ventureId });

    if (ventureInfo != null) {
      const oldCourseData = await db
        .collection("courses")
        .findOne({ _id: ventureInfo.course._id });
      const users = [...ventureInfo.mentors, ventureInfo.mentee];
      const userIds = users.map((user) => new ObjectId(user._id));

      // Remove venture info on users
      await db
        .collection("users")
        .updateMany(
          { _id: { $in: userIds } },
          { $pull: { ventures: { ventureId: ventureId } } }
        );

      // Remove venture info on notifications
      await db
        .collection("notifications")
        .deleteMany({ link: { $regex: ventureId.toString(), $options: "i" } });

      // Update venture count on courses
      await db.collection("courses").updateOne(
        {
          _id: ventureInfo.course._id,
        },
        {
          $set: {
            ventures:
              oldCourseData.ventures > 0 ? oldCourseData.ventures - 1 : 0,
          },
        }
      );
    }
    const result = await db
      .collection("ventures")
      .deleteOne({ _id: ventureId });
    if (!result.acknowledged) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getVenture(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const ventureId = new ObjectId(id?.toString());
    const result = await db.collection("ventures").findOne({ _id: ventureId });
    res.status(200).json({ venture: result, serverTime: new Date() });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getVentureModule(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { mid } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const ventureId = new ObjectId(id?.toString());
    const moduleId = new ObjectId(mid?.toString());
    const result = await db
      .collection("ventures")
      .aggregate([
        {
          $match: {
            _id: ventureId,
          },
        },
        {
          $project: {
            mentee: 1,
            mentors: -1,
            title: 1,
            matchedModules: {
              $filter: {
                input: "$course.modules",
                as: "mod",
                cond: {
                  $or: [
                    { $eq: ["$$mod.module._id", moduleId.toString()] },
                    { $eq: ["$$mod.module._id", moduleId] },
                  ],
                },
              },
            },
          },
        },
      ])
      .toArray();
    if (result.length > 0 && result[0].matchedModules.length > 0) {
      if (result[0].matchedModules[0].module.item == 'Starting Point') {
        await db.collection("ventures").updateOne(
          {
            _id: ventureId,
            $or: [
              { "course.modules.module._id": moduleId.toString() },
              { "course.modules.module._id": moduleId },
            ],
          },
          {
            $set: {
              "course.modules.$.isFlip": true,
              "course.modules.$.lastUpdated": new Date(),
            },
          }
        );
      }
    }
    res.status(200).json({ venture: result, serverTime: new Date() });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function archiveVenture(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const ventureId = new ObjectId(id?.toString());
    const result = await db.collection("ventures").updateOne(
      {
        _id: ventureId,
      },
      {
        $set: {
          isArchive: true,
          updatedAt: new Date(),
        },
      }
    );
    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
