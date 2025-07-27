import { NextApiRequest, NextApiResponse } from "next";

import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";
import { resend } from "@/utils/resend";
import PostCoreVideo from "@/components/email/PostCoreVideo";
import { delay } from "@/utils/utils";

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
    case "GET":
      // Handle GET request
      break;
    case "POST":
      // Handle POST request
      saveNanoTalkVideo(req, res);
      break;
    case "PUT":
      // Handle PUT request
      break;
    default:
      res.setHeader("Allow", ["POST", "PUT", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function saveNanoTalkVideo(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);
  const form = formidable();
  const db = await getDb();

  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err.message);
      }

      const {
        title,
        uid,
        username,
        secure_url,
        asset_id,
        original_filename,
        public_id,
        type,
        description,
      } = fields;

      let videoField;

      videoField = {
        url: secure_url,
        assetId: asset_id,
        name: original_filename,
        publicId: public_id,
      };

      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 180);
      const userInfo = await db
        .collection("users")
        .findOne({ email: session?.user?.email });
      const data = {
        video: videoField,
        title: title,
        description: description,
        author: {
          email: session?.user?.email,
          name: username,
          image: userInfo.image,
          _id: uid,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        expireAt: currentDate,
        comments: [],
        type: parseInt(type?.toString() ?? ""),
        status: "private",
      };
      const result = await db.collection("nanotalkvideos").insertOne(data);
      if (!result.acknowledged) {
        return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      } else {
        const admins = await db
          .collection("users")
          .find({ role: "admin" })
          .toArray();

        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          month: "long",
          day: "numeric",
        };
        const formattedDate = date.toLocaleDateString("en-US", options);

        if (admins.length > 0) {
          const notifications: any[] = [];

          for (const admin of admins) {
            const notification = {
              from: uid,
              to: admin._id.toString(),
              message: `${username} posted a new video on ${formattedDate}.`,
              link: `/dashboard/admin/makeninety`,
              isRead: false,
              isFlag: false,
              createdAt: new Date(),
              type: "video",
            };
            notifications.push(notification);
            pusher.trigger(`user-${admin._id.toString()}`, "comment", notification);

            try {
              const { data, error } = await resend.emails.send({
                  from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                  to: admin.email,
                  subject: `${username} posted a new video.`,
                  react: PostCoreVideo({
                    name: username,
                    link: `${process.env.HOME_URL}/dashboard/admin/makeninety`,
                  }),
                  cc: process.env.CC_EMAIL,
              });
              
              if (error) {
                  console.error({ error });
              }

              await delay(600);

            } catch (err) {
              console.error(`Failed to send video post notification to ${admin.email}`, err);
              // Optionally decide if you want to continue or break here
            }
          }

          await db.collection("notifications").insertMany(notifications);
        }

        return res.status(200).json({ success: true });
      }
    });
  } catch (err) {
    console.log("Form parse error");
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
