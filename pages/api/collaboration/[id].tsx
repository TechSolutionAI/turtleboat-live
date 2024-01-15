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
      getCollaboration(req, res);
      break;
    case "DELETE":
      // Handle DELETE request
      break;
    case "POST":
      // Handle POST request
      break;
    case "PUT":
      // Handle PUT request
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getCollaboration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    let cid = "",
      vid = "";
    if (typeof id === "string" && id !== "") {
      cid = id.split("-")[0];
      vid = id.split("-")[1];
    }
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const collabId = new ObjectId(cid?.toString());
    const ventureId = new ObjectId(vid?.toString());
    if (vid == undefined) {
      const result = await db
        .collection("collaborations")
        .findOne({ _id: collabId });
      res.status(200).json({
        collaboration: result,
        serverTime: new Date(),
        ventureTitle: "",
      });
    } else {
      const ventureResult = await db
        .collection("ventures")
        .findOne({ _id: ventureId });
      const result = await db
        .collection("collaborations")
        .findOne({ _id: collabId });
      res.status(200).json({
        collaboration: result,
        serverTime: new Date(),
        ventureTitle: ventureResult.title,
      });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
