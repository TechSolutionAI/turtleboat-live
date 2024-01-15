import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Handle GET request
      getCourse(req, res);
      break;
    case "DELETE":
      // Handle DELETE request
      deleteCourse(req, res);
      break;
    case "POST":
      // Handle POST request
      duplicateCourse(req, res);
      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function deleteCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const courseId = new ObjectId(id?.toString());
    const result = await db.collection("courses").deleteOne({ _id: courseId });
    if (!result.acknowledged) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const courseId = new ObjectId(id?.toString());
    const result = await db.collection("courses").findOne({ _id: courseId });
    res.status(200).json({ course: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function duplicateCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const courseId = new ObjectId(id?.toString());
    const originalCourse = await db
      .collection("courses")
      .findOne({ _id: courseId });

    if (originalCourse != null) {
      const result = await db.collection("courses").insertOne({
        title: originalCourse.title + " - Duplicated",
        modules: originalCourse.modules,
        ventures: 0,
        description: originalCourse.description,
      });
      if (!result.acknowledged) {
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      } else {
        const course = await db
          .collection("courses")
          .findOne({ _id: result.insertedId });
        res.status(200).json({ success: true, course: course });
      }
    } else {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
