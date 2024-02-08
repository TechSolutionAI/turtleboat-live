import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import sendgrid from "@sendgrid/mail";
import Pusher from "pusher";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

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
  const form = new formidable.IncomingForm();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_NAME);

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
        type: parseInt(type.toString()),
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
          let notifications: any[] = [];
          admins.map(async (admin: any) => {
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
            pusher.trigger(
              `user-${admin._id.toString()}`,
              "comment",
              notification
            );

            await sendgrid.send({
              to: admin.email,
              from: {
                email: "yCITIES1@gmail.com",
                name: "Turtle Boat",
              },
              subject: `${username} posted a new video.`,
              templateId: "d-77068f2bc41e42efbfc9110a45e2b03d",
              dynamicTemplateData: {
                subject: `${username} posted a new video.`,
                name: username,
                link: `${process.env.HOME_URL}/dashboard/admin/makeninety`,
              },
              isMultiple: false,
            });
          });
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
