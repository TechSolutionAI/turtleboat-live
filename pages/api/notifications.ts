import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Handle GET request
      getNewNotification(req, res);
      break;
    case "POST":
      // Handle POST request
      getUserNotifications(req, res);
      break;
    case "PUT":
      // Handle PUT request
      const { _, isFlag } = req.body;
      if (typeof isFlag === "undefined") {
        setNotificationRead(req, res);
      } else {
        setNotificationFlag(req, res);
      }
      break;
    case "DELETE":
      // Handle PUT request
      deleteNotification(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getNewNotification(req: NextApiRequest, res: NextApiResponse) {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
  res.writeHead(200, headers);

  const db = await getDb();
  const notificationStream = db.collection("notifications").watch();

  notificationStream.on("change", async (change: any) => {
    if (change.operationType === "insert") {
      const notification = change.fullDocument;
      const data = `data: ${JSON.stringify(notification)}\n\n`;

      res.write(data);
    }
    if (change.operationType === "update") {
      const notification = await db.collection("notifications").findOne({
        _id: change.documentKey._id,
      });
      const data = `data: ${JSON.stringify(notification)}\n\n`;
      res.write(data);
    }
  });

  req.on("close", () => {
    notificationStream.close();
    res.end();
  });
}

async function deleteNotification(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nid } = req.body;
    const notificationId = new ObjectId(nid.toString());
    const db = await getDb();
    const result = await db
      .collection("notifications")
      .deleteOne({ _id: notificationId });
    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getUserNotifications(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, type } = req.body;
    const db = await getDb();
    if (type == "roadside" || type == "lemonade") {
      let result = await db
        .collection("notifications")
        .find({
          type: type,
          $or: [{ to: userId.toString() }, { to: userId }],
        })
        .sort({
          createdAt: -1,
        })
        .toArray();
      res.status(200).json({ notifications: result, sTime: new Date() });
    } else if (type == "all") {
      let result = await db
        .collection("notifications")
        .find({
          $or: [{ to: userId.toString() }, { to: userId }],
        })
        .sort({
          createdAt: -1,
        })
        .toArray();
      res.status(200).json({ notifications: result, sTime: new Date() });
    } else if (type == "") {
      let result = await db
        .collection("notifications")
        .find({
          $and: [
            { type: { $ne: "roadside" } },
            { type: { $ne: "lemonade" } },
            { $or: [{ to: userId.toString() }, { to: userId }] },
          ],
        })
        .sort({
          createdAt: -1,
        })
        .toArray();
      res.status(200).json({ notifications: result, sTime: new Date() });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function setNotificationRead(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nid } = req.body;
    const notificationId = new ObjectId(nid.toString());
    const db = await getDb();
    const result = await db.collection("notifications").updateOne(
      { _id: notificationId },
      {
        $set: {
          isRead: true,
        },
      }
    );

    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function setNotificationFlag(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nid, isFlag } = req.body;
    const notificationId = new ObjectId(nid.toString());
    const db = await getDb();
    const result = await db.collection("notifications").updateOne(
      { _id: notificationId },
      {
        $set: {
          isFlag: isFlag,
        },
      },
      {
        upsert: true,
      }
    );
    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
