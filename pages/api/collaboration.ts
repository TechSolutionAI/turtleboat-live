import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Pusher from "pusher";
import sendgrid from "@sendgrid/mail";
import { User } from "@/types/user.type";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FileObject {
  originalFilename: string;
  mimeType: string;
  filepath: string;
  size: number;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
  secret: process.env.PUSHER_APP_SECRET ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
  useTLS: true,
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
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }

    const { cid, uid, vid, content, type } = fields;
    const collabId = new ObjectId(cid.toString());
    const ventureId = new ObjectId(vid.toString());

    let fileFields = [];

    for (const file of Object.values(files)) {
      const fileObject: FileObject = file as unknown as FileObject;
      try {
        const uploadResult = await cloudinary.uploader.upload(
          fileObject.filepath,
          {
            public_id: `ycity_files/${fileObject.originalFilename}`,
            overwrite: true,
            timestamp: new Date().getTime(),
            resource_type: "auto",
            folder: "collaborations",
            invalidate: true,
          }
        );
        fileFields.push({
          url: uploadResult.secure_url,
          assetId: uploadResult.asset_id,
          name: fileObject.originalFilename,
          publicId: uploadResult.public_id,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      }
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

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
        _id: uid.toString(),
      },
      createdAt: new Date(),
      type: parseInt(type.toString()),
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
        if (mentee._id.toString() != uid.toString()) {
          const notificationForComment = {
            from: uid.toString(),
            to: mentee._id.toString(),
            message: `${user?.name} posted comment in collaboration on ${formattedDate}`,
            link: `/dashboard/myventures/collaboration/${collabId}-${ventureId}?type=${type.toString()}`,
            isRead: false,
            isFlag: false,
            ventureTitle: venture.title,
            ventureId: vid,
            collaborationId: cid,
            tabId: type.toString(),
            createdAt: date,
          };
          // emailNotifications.push({
          //     fromName: session?.user?.name,
          //     email: mentee.email,
          //     ventureTitle: ventureData.title,
          //     notificationLink: `${process.env.HOME_URL}/dashboard/myventures/collaboration/${collabId}`
          // });
          notifications.push(notificationForComment);
          pusher.trigger(
            `user-${mentee._id.toString()}`,
            "comment",
            notificationForComment
          );
        }
      });

      collabData.mentors.map((mentor: any) => {
        if (mentor._id.toString() != uid.toString()) {
          const notificationForComment = {
            from: uid.toString(),
            to: mentor._id.toString(),
            message: `${user?.name} posted comment in collaboration on ${formattedDate}`,
            link: `/dashboard/myventures/collaboration/${collabId}-${ventureId}?type=${type.toString()}`,
            isRead: false,
            isFlag: false,
            ventureTitle: venture.title,
            ventureId: vid,
            collaborationId: cid,
            tabId: type.toString(),
            createdAt: date,
          };
          // emailNotifications.push({
          //     fromName: session?.user?.name,
          //     email: mentor.email,
          //     ventureTitle: ventureData.title,
          //     notificationLink: `${process.env.HOME_URL}/dashboard/myventures/collaboration/${collabId}`
          // });
          notifications.push(notificationForComment);
          pusher.trigger(
            `user-${mentor._id.toString()}`,
            "comment",
            notificationForComment
          );
        }
      });

      // emailNotifications.map(async (notify: any, idx: any) => {
      //     try {
      //         await sendgrid.send({
      //             to: notify.email,
      //             from: "yCITIES1@gmail.com",
      //             subject: `${session?.user?.name} commented in Venture "${notify.ventureTitle}"`,
      //             cc: process.env.CC_EMAIL,
      //             templateId: " d-6fd81650d7ad4fe9a43dee40f8502051",
      //             dynamicTemplateData: {
      //                 subject: `${session?.user?.name} commented in Venture "${notify.ventureTitle}"`,
      //                 notificationlink: notify.notificationLink,
      //                 ventureTitle: notify.ventureTitle,
      //                 fromName: notify.fromName
      //             },
      //             isMultiple: false,
      //         });
      //     } catch (err: any) {
      //         return res.status(500).json({ err: SERVER_ERR_MSG });
      //     }
      // });

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
