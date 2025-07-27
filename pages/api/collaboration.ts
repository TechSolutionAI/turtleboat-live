import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/types/user.type";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      // Handle POST request
      saveComment(req, res);
      break;
    case "PUT":
      // Handle PUT request
      break;
    default:
      res.setHeader("Allow", ["POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function saveComment(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);
  const user = session?.user as User;
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }

    const { cid, uid, vid, content, type } = fields;
    const collabId = new ObjectId(cid?.toString());
    const ventureId = new ObjectId(vid?.toString());

    let fileFields = [];

    for (const key of Object.keys(files)) {
      const fileEntry = files[key];

      // Handle single or multiple file uploads
      const fileArray = Array.isArray(fileEntry) ? fileEntry : [fileEntry];

      for (const file of fileArray) {
        if (file && typeof file === "object" && "filepath" in file && "originalFilename" in file) {
          const { filepath, originalFilename } = file;

          try {
            const uploadResult = await cloudinary.uploader.upload(filepath, {
              public_id: `ycity_files/${originalFilename}`,
              overwrite: true,
              timestamp: new Date().getTime(),
              resource_type: "auto",
              folder: "collaborations",
              invalidate: true,
            });

            fileFields.push({
              url: uploadResult.secure_url,
              assetId: uploadResult.asset_id,
              name: originalFilename,
              publicId: uploadResult.public_id,
            });
          } catch (error) {
            console.error("File upload error:", error);
            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
          }
        } else {
          console.error("File object missing required properties", file);
          return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        }
      }
    }

    const db = await getDb();

    const userInfo = await db
      .collection("users")
      .findOne({ email: user.email });
    const commentData = {
      files: fileFields,
      content: content,
      user: {
        email: user?.email,
        name: user?.name,
        image: userInfo.image,
        _id: uid?.toString(),
      },
      createdAt: new Date(),
      type: parseInt(type?.toString() ?? ""),
    };
    await db.collection("collaborations").updateOne(
      {
        _id: collabId,
        comments: { $exists: false },
      },
      {
        $set: {
          comments: [],
        },
      }
    );
    const result = await db.collection("collaborations").updateOne(
      {
        _id: collabId,
      },
      {
        $push: {
          comments: {
            $each: [commentData],
          },
        },
      }
    );
    if (!result.matchedCount) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      const collabData = await db.collection("collaborations").findOne({
        _id: collabId,
      });
      let notifications: any[] = [];
      let emailNotifications: any[] = [];
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      const venture = await db
        .collection("ventures")
        .findOne({ _id: ventureId });

      collabData.mentees.map((mentee: any) => {
        if (mentee._id.toString() != uid?.toString()) {
          const notificationForComment = {
            from: uid?.toString(),
            to: mentee._id.toString(),
            message: `${user?.name} posted comment in collaboration on ${formattedDate}`,
            link: `/dashboard/myventures/collaboration/${collabId}-${ventureId}?type=${type?.toString()}`,
            isRead: false,
            isFlag: false,
            ventureTitle: venture.title,
            ventureId: vid,
            collaborationId: cid,
            tabId: type?.toString(),
            createdAt: date,
          };

          notifications.push(notificationForComment);
          pusher.trigger(
            `user-${mentee._id.toString()}`,
            "comment",
            notificationForComment
          );
        }
      });

      collabData.mentors.map((mentor: any) => {
        if (mentor._id.toString() != uid?.toString()) {
          const notificationForComment = {
            from: uid?.toString(),
            to: mentor._id.toString(),
            message: `${user?.name} posted comment in collaboration on ${formattedDate}`,
            link: `/dashboard/myventures/collaboration/${collabId}-${ventureId}?type=${type?.toString()}`,
            isRead: false,
            isFlag: false,
            ventureTitle: venture.title,
            ventureId: vid,
            collaborationId: cid,
            tabId: type?.toString(),
            createdAt: date,
          };

          notifications.push(notificationForComment);
          pusher.trigger(
            `user-${mentor._id.toString()}`,
            "comment",
            notificationForComment
          );
        }
      });

      const notificationResult = await db
        .collection("notifications")
        .insertMany(notifications);
      if (!notificationResult.acknowledged) {
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      } else {
        res.status(200).json({ success: true, result: commentData });
      }
    }
  });
}
