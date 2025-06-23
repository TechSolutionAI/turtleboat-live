import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";
import { v4 as uuid } from "uuid";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import getDb from "@/utils/getdb";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let inviteIds: string[] = [];
  const { invitees, courseId, note, type } = req.body;
  // Get session from request
  const session: Session | null = await getServerSession(req, res, authOptions);
  // Send invite emails to invitees
  invitees.map(async (invitee: any, idx: any) => {
    const uniqueId: any = uuid();
    inviteIds.push(uniqueId);

    try {
      await sendgrid.send({
        to: invitee,
        from: {
          email: "yCITIES1@gmail.com",
          name: "Turtle Boat"
        },
        subject: `${session?.user?.name} has invited you to Turtle Boat`,
        cc: process.env.CC_EMAIL,
        templateId: "d-b1188b9523e949e3af6589ec3921efe0",
        dynamicTemplateData: {
          subject: `${session?.user?.name} has invited you to Turtle Boat`,
          inviteAddress: `${process.env.HOME_URL}/invite?id=${uniqueId}`,
          type: type,
          note: note
        },
        isMultiple: false,
      });
    } catch (err: any) {
      return res.status(500).json({ err: SERVER_ERR_MSG });
    }
  });
  // Prepare data to input into database
  let invites: Array<any> = [];
  const db = await getDb();
  const userInfo = await db
    .collection("users")
    .findOne({ email: session?.user?.email });
  invitees.map((invitee: any, idx: number) => {
    invites.push({
      inviteId: inviteIds[idx],
      from: session?.user?.name,
      image: userInfo.image,
      to: invitee,
      courseId: courseId,
      time: new Date(),
      isExpired: false,
    });
  });
  // Access database and input invites data
  try {
    const db = await getDb();
    const result = await db
      .collection("invites")
      .insertMany(invites);
    if (result.acknowledged) {
      return res.status(200).json({});
    } else {
      return res.status(500).json({ err: SERVER_ERR_MSG });
    }
  } catch (err) {
    return res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
