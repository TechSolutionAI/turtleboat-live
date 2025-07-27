import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import TurtleBoatInvite from "@/components/email/TurtleBoatInvite";
import { resend } from "@/utils/resend";
import { delay } from "@/utils/utils";
import getDb from "@/utils/getdb";

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
  for (const [idx, invitee] of invitees.entries()) {
    const uniqueId = uuid();
    inviteIds.push(uniqueId);

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
      to: invitee,
      subject: `${session?.user?.name} has invited you to Turtle Boat`,
      react: TurtleBoatInvite({
        type,
        inviteAddress: `${process.env.HOME_URL}/invite?id=${uniqueId}`,
        note,
      }),
      cc: process.env.CC_EMAIL,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ err: SERVER_ERR_MSG });
    }

    await delay(600);

  };
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
