import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      // Handle GET request
      getCourses(res)
      break
    case 'POST':
      // Handle POST request
      createCourse(req, res);
      break
    case 'PUT':
      // Handle PUT request
      updateCourse(req, res);
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("courses")
      .insertOne(data);
    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      const course = await db
        .collection("courses")
        .findOne({ _id: result.insertedId });
      res.status(200).json({ success: true, course: course });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getCourses(res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const result = await db
      .collection("courses")
      .find()
      .toArray();
    res.status(200).json({ courses: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, data } = req.body;
    const courseId = new ObjectId(id.toString());
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("courses")
      .updateOne({ _id: courseId }, { $set: data });
    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      const course = await db
        .collection("courses")
        .findOne({ _id: courseId });

      const matchedVentures = await db.collection("ventures")
        .find({
          $or: [
            { 'course._id': courseId.toString() },
            { 'course._id': courseId },
          ]
        }).toArray();

      matchedVentures.map(async (ventureItem: any) => {
        let updatedModules: any[] = [];
        ventureItem.course.modules.map((moduleItem: any) => {
          const matchedModule = course.modules.find((m: any) => m.module._id == moduleItem.module._id);
          let temp = moduleItem;
          temp.isCheck = matchedModule.isCheck;
          temp.isLock = matchedModule.isLock;
          temp.module = matchedModule.module;
          updatedModules.push(temp);
        });

        const updatedCourse = {
          _id: course._id,
          title: course.title,
          modules: updatedModules,
          description: course.description,
          ventures: course.ventures
        }

        await db.collection("ventures")
          .updateOne(
            {
              $or: [
                { _id: ventureItem._id.toString() },
                { _id: ventureItem._id },
              ]
            },
            { $set: { 'course': updatedCourse } }
          );
      });
      res.status(200).json({ success: true, course: course });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}