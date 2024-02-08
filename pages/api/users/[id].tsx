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
      // Handle DELETE request
      getUser(req, res);
      break;
    case "POST":
      // Handle POST request
      getUserVentures(req, res);
      break;
    case "PUT":
      // Handle POST request
      updateUser(req, res);
      break;
    case "DELETE":
      // Handle DELETE request
      deleteUser(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id?.toString()) });
    if (!result.acknowledged) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      const users = await db.collection("users").find().toArray();
      res.status(200).json({ users: users });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id?.toString()) });
    res.status(200).json({ user: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { data } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id?.toString()) },
      { $set: data },
      {
        upsert: true,
      }
    );
    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id?.toString()) });
      res.status(200).json({ user: user });
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getUserVentures(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    // console.log(user);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id?.toString()) });

    const ventureIds = user.ventures.map(
      (venture: any) => new ObjectId(venture.ventureId?.toString())
    );
    const ventures = await db
      .collection("ventures")
      .find({
        _id: { $in: ventureIds },
      })
      .sort({
        title: 1,
        updatedAt: -1,
      })
      .toArray();

    let filteredVentures: any[] = [];
    let teamVentures: any[] = [];
    let collabIds: any[] = [];

    // ventures.map(async (ventureItem: any, i: number) => {
    // for(var i = 0; i < ventures.length; i++) {
    //     const ventureItem = ventures[i];
    //     if (!ventureItem.isTeam) {
    //         filteredVentures.push({
    //             title: ventureItem.title,
    //             description: ventureItem.description,
    //             _id: ventureItem._id,
    //             course: {
    //                 title: ventureItem.course.title,
    //             },
    //             mentee: ventureItem.mentee,
    //             mentors: ventureItem.mentors,
    //             createdAt: ventureItem.createdAt,
    //             updatedAt: ventureItem.updatedAt,
    //             isArchive: ventureItem.isArchive,
    //             isTeam: ventureItem.isTeam
    //         })
    //     } else {
    //         const collabId = ventureItem.collabId;
    //         const found = collabIds.find(item => item === collabId.toString());

    //         if (found == undefined) {
    //             collabIds.push(collabId.toString());
    //             const collabVentures = await db.collection('ventures')
    //                 .find(
    //                     {
    //                         collabId: collabId
    //                     },
    //                     {
    //                         title: 1,
    //                         description: 1,
    //                         _id: 1,
    //                         course: 1,
    //                         mentee: 1,
    //                         mentors: 1,
    //                         createdAt: 1,
    //                         updatedAt: 1,
    //                         isArchive: 1,
    //                         isTeam: 1
    //                     }
    //                 ).toArray();
    //             teamVentures.push(...collabVentures);
    //         }
    //     }
    // }

    await Promise.all(
      ventures.map(async (ventureItem: any) => {
        if (!ventureItem.isTeam) {
          filteredVentures.push({
            title: ventureItem.title,
            description: ventureItem.description,
            _id: ventureItem._id,
            course: {
              title: ventureItem.course.title,
            },
            mentee: ventureItem.mentee,
            mentors: ventureItem.mentors,
            createdAt: ventureItem.createdAt,
            updatedAt: ventureItem.updatedAt,
            isArchive: ventureItem.isArchive,
            isTeam: ventureItem.isTeam,
          });
        } else {
          const collabId = ventureItem.collabId;
          const found = collabIds.find((item) => item === collabId.toString());

          if (found == undefined) {
            collabIds.push(collabId.toString());
            const collabVentures = await db
              .collection("ventures")
              .find(
                { collabId: collabId },
                {
                  title: 1,
                  description: 1,
                  _id: 1,
                  course: 1,
                  mentee: 1,
                  mentors: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  isArchive: 1,
                  isTeam: 1,
                }
              )
              .toArray();
            teamVentures.push(...collabVentures);
          }
        }
      })
    );

    res.status(200).json({
      ventures: filteredVentures,
      userVentures: user.ventures,
      teamVentureList: teamVentures,
      userInfo: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
