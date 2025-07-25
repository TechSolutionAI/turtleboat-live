import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Pusher from "pusher";
import { User } from "@/types/user.type";
import getDb from "@/utils/getdb";

const SERVER_ERR_MSG = "Something went wrong in a server.";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
  secret: process.env.PUSHER_APP_SECRET ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
  useTLS: true,
});

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
      updateSummarize(req, res);
      break
    case 'PUT':
      // Handle PUT request
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function updateSummarize(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { vid, mid, uid, summarize } = req.body;
    const moduleId = new ObjectId(mid.toString());
    const ventureId = new ObjectId(vid.toString());
    const userId = new ObjectId(uid.toString());
    const session: Session | null = await getServerSession(req, res, authOptions);
    const user = session?.user as User;

    const db = await getDb();

    const result = await db.collection("ventures").updateOne(
      {
        _id: ventureId,
        $or: [
          { "course.modules.module._id": moduleId.toString() },
          { "course.modules.module._id": moduleId },
        ],
      },
      {
        $set: {
          "course.modules.$.module.summarize": summarize,
          "course.modules.$.module.lastUpdated": new Date(),
          "course.modules.$.isFlip": true,
          "course.modules.$.lastUpdated": new Date(),
        }
      },
    );
    // If the evaluation doesn't exist, push it
    if (result.matchedCount === 0) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      const ventureData = await db.collection("ventures").findOne({
        _id: ventureId,
      });
      let notifications: any[] = [];
      let emailNotifications: any[] = [];
      let userIds: any[] = [];
      if (
        ventureData.mentee != null &&
        ventureData.mentee._id.toString() != uid.toString()
      ) {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          month: "long",
          day: "numeric",
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        const notificationForComment = {
          from: uid.toString(),
          to: ventureData.mentee._id.toString(),
          message: `${user?.name} contributed to "${ventureData.title}" on ${formattedDate}`,
          link: `/dashboard/myventures/module/${ventureId}-${mid}`,
          isRead: false,
          isFlag: false,
          ventureTitle: ventureData.title,
          ventureId: vid,
          moduleId: mid,
          createdAt: date,
        };
        // emailNotifications.push({
        //     fromName: session?.user?.name,
        //     email: ventureData.mentee.email,
        //     ventureTitle: ventureData.title,
        //     notificationLink: `${process.env.HOME_URL}/dashboard/myventures/module/${ventureId}-${mid}`
        // });
        notifications.push(notificationForComment);
        userIds.push(ventureData.mentee._id.toString());
        pusher.trigger(
          `user-${ventureData.mentee._id.toString()}`,
          "comment",
          notificationForComment
        );
      }
      ventureData.mentors.map((mentor: any) => {
        if (mentor._id.toString() != uid.toString()) {
          const date = new Date();
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
          };
          const formattedDate = date.toLocaleDateString("en-US", options);
          const notificationForComment = {
            from: uid.toString(),
            to: mentor._id.toString(),
            message: `${user?.name} contributed to "${ventureData.title}" on ${formattedDate}`,
            link: `/dashboard/myventures/module/${ventureId}-${mid}`,
            isRead: false,
            isFlag: false,
            ventureTitle: ventureData.title,
            ventureId: vid,
            moduleId: mid,
            createdAt: date,
          };
          // emailNotifications.push({
          //     fromName: session?.user?.name,
          //     email: mentor.email,
          //     ventureTitle: ventureData.title,
          //     notificationLink: `${process.env.HOME_URL}/dashboard/myventures/module/${ventureId}-${mid}`
          // });
          notifications.push(notificationForComment);
          userIds.push(mentor._id.toString());
          pusher.trigger(
            `user-${mentor._id.toString()}`,
            "comment",
            notificationForComment
          );
        }
      });

      // Send Notifications to Team Collaborators if this is team venture
      if (ventureData.isTeam) {
        const collabData = await db.collection("collaborations").findOne({
          _id: ventureData.collabId,
        });

        const allCollaborators = [...collabData.mentors, ...collabData.mentees];

        allCollaborators.map((collaborator: any) => {
          if (
            collaborator._id.toString() != uid.toString() &&
            userIds.find((item) => item === collaborator._id.toString()) ==
            undefined
          ) {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };
            const formattedDate = date.toLocaleDateString("en-US", options);
            const notificationForComment = {
              from: uid.toString(),
              to: collaborator._id.toString(),
              message: `${user?.name} contributed to "${ventureData.title}" on ${formattedDate}`,
              link: `/dashboard/myventures/module/${ventureId}-${mid}`,
              isRead: false,
              isFlag: false,
              ventureTitle: ventureData.title,
              ventureId: vid,
              moduleId: mid,
              createdAt: date,
            };
            // emailNotifications.push({
            //     fromName: session?.user?.name,
            //     email: collaborator.email,
            //     ventureTitle: ventureData.title,
            //     notificationLink: `${process.env.HOME_URL}/dashboard/myventures/module/${ventureId}-${mid}`
            // });
            notifications.push(notificationForComment);
            userIds.push(collaborator._id.toString());
            pusher.trigger(
              `user-${collaborator._id.toString()}`,
              "comment",
              notificationForComment
            );
          }
        });
      }
      // Send Notifications to Team Collaborators if this is team venture

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

      // Get Token Action for "Post/Comment within a Wonder Square": no is 3
      const tokenAction = await db
        .collection("token_actions")
        .findOne({ no: 3 });

      const tokenHistory = await db.collection("token_history").insertOne({
        userId: new ObjectId(uid.toString()),
        createdAt: new Date(),
        amount: tokenAction.tokenAmount,
        isView: false,
        updatedAt: new Date(),
        actionNo: 3,
        type: "action",
      });

      pusher.trigger(`user-token-${uid.toString()}`, "token-history", {
        type: 1,
        name: tokenAction.name,
        tokenAmount: tokenAction.tokenAmount,
      });
      // Update User Tokens
      const userInfo = await db.collection("users").findOne({ _id: userId });

      await db.collection("users").updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            tokens: userInfo.tokens + tokenAction.tokenAmount,
            totalEarnedTokens:
              userInfo.totalEarnedTokens + tokenAction.tokenAmount,
          },
        }
      );

      if (!notificationResult.acknowledged && !tokenHistory.acknowledged) {
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      } else {
        res.status(200).json({ success: true, result: summarize });
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}