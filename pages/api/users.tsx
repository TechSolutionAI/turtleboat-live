import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Handle GET request
      getUsers(res);
      break;
    case "POST":
      // Handle POST request
      getUsersByRole(req, res);
      break;
    case "PUT":
      // Handle PUT request
      updateUser(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getUsers(res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("users")
      .find()
      .sort("name", 1)
      .toArray();
    res.status(200).json({ users: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getUsersByRole(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { role } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db.collection("users").find({ role: role }).toArray();
    res.status(200).json({ users: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, data } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: data });
    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      const users = await db.collection("users").find().toArray();
      res.status(200).json({ users: users });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
