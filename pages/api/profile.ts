import type { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

import { ObjectId } from "mongodb";
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
      getProfile(req, res)
      break
    case 'PUT':
      // Handle PUT request
      updateAdvancedProfile(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function getProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get session from request
  const session: Session | null = await getServerSession(req, res, authOptions);
  // Access database and update user data
  try {
    const db = await getDb();
    let result = await db
      .collection("users")
      .updateOne({ email: session?.user?.email }, { $set: req.body });
    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateAdvancedProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get session from request
  const session: Session | null = await getServerSession(req, res, authOptions);
  // Access database and update user data
  try {
    const db = await getDb();
    const { uid, basicProfile, advancedProfile, isNewUser, tagsForRemove, tagsForAdd} = req.body
    const userId = new ObjectId(uid.toString());

    // Remove Tagging List
    await db
      .collection("tagging_list")
      .updateMany(
        { tagNo: { $in: tagsForRemove } },
        { $pull: { users: { _id: userId } } }
    );

    // Add Tagging List
    await db
      .collection("tagging_list")
      .updateMany(
        { tagNo: { $in: tagsForAdd } },
        { 
          $addToSet: { 
          users: { 
            $each: [
              {
                _id: userId,
                email: session?.user?.email
              }
            ]  
            } 
          } 
        }
    );

    let result = await db
      .collection("users")
      .updateOne(
        { 
          email: session?.user?.email 
        }, 
        { 
          $set: {
            basicProfile: basicProfile,
            advancedProfile: advancedProfile,
            isNewUser: isNewUser
          } 
        });

    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}