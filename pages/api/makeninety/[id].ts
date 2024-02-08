import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Pusher from "pusher";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
  api: {
    responseLimit: "20mb",
  },
};

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
      getVideo(req, res);
      break;
    case "DELETE":
      // Handle DELETE request
      deleteVideo(req, res);
      break;
    case "POST":
      // Handle POST request
      updateVideoStatus(req, res);
      break;
    case "PUT":
      // Handle PUT request
      updateComments(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function deleteVideo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const videoId = new ObjectId(id?.toString());
    const result = await db
      .collection("ninetyvideos")
      .deleteOne({ _id: videoId });
    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, err: SERVER_ERR_MSG });
  }
}

async function updateComments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { comment, type } = req.body;
    // type 0: delete, type 1: add
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const videoId = new ObjectId(id?.toString());
    if (type == 1) {
      let username = comment.user.name;
      if (
        !comment.user.isNewUser &&
        comment.user.basicProfile &&
        comment.user.basicProfile.firstName &&
        comment.user.basicProfile.lastName
      ) {
        username =
          comment.user.basicProfile?.firstName +
          " " +
          comment.user.basicProfile?.lastName;
      }
      const commentData = {
        problem: comment.problem,
        helpee: comment.helpee,
        reason: comment.reason,
        solution: comment.solution,
        user: {
          email: comment.user.email,
          name: username,
          image: comment.user.image,
          _id: comment.user._id,
        },
        createdAt: new Date(),
      };
      const result = await db.collection("ninetyvideos").updateOne(
        { _id: videoId },
        {
          $addToSet: { comments: { $each: [commentData] } },
          $set: {
            updatedAt: new Date(),
          },
        }
      );
      if (!result.matchedCount) {
        res.status(500).json({ err: SERVER_ERR_MSG });
      } else {
        // Get Token Action for "Provide Feedback on 90 Second Kid Care Video": no is 10
        const tokenAction = await db
          .collection("token_actions")
          .findOne({ no: 10 });

        await db.collection("token_history").insertOne({
          userId: new ObjectId(comment.user._id.toString()),
          createdAt: new Date(),
          amount: tokenAction.tokenAmount,
          isView: false,
          updatedAt: new Date(),
          actionNo: 10,
          type: "action",
        });

        const userId = new ObjectId(comment.user._id.toString());
        pusher.trigger(
          `user-token-${comment.user._id.toString()}`,
          "token-history",
          {
            type: 1,
            name: tokenAction.name,
            tokenAmount: tokenAction.tokenAmount,
          }
        );

        // Send notification to the Auther
        const video = await db
          .collection("ninetyvideos")
          .findOne({ _id: videoId });
        if (video.author._id.toString() !== userId.toString()) {
          const date = new Date();
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
          };
          const formattedDate = date.toLocaleDateString("en-US", options);
          const notificationForComment = {
            from: userId.toString(),
            to: video.author._id.toString(),
            message: `${username} posted comment in 90 Second Kid Care Video on ${formattedDate}`,
            link: `/dashboard/core/makeninety/${id}`,
            isRead: false,
            isFlag: false,
            videoId: id,
            videoTitle: video.title,
            createdAt: date,
          };

          await db
            .collection("notifications")
            .insertOne(notificationForComment);
          pusher.trigger(
            `user-${video.author._id.toString()}`,
            "comment",
            notificationForComment
          );
        }

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

        res.status(200).json({ success: true });
      }
    } else {
      const result = await db.collection("ninetyvideos").updateOne(
        { _id: videoId },
        {
          $set: {
            comments: comment,
            updatedAt: new Date(),
          },
        }
      );
      if (!result.matchedCount) {
        res.status(500).json({ err: SERVER_ERR_MSG });
      } else {
        res.status(200).json({ success: true });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getVideo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const videoId = new ObjectId(id?.toString());
    const result = await db
      .collection("ninetyvideos")
      .findOne({ _id: videoId });
    const authorId = result.author._id;
    const moreVideos = await db
      .collection("ninetyvideos")
      .find({
        "author._id": authorId,
        _id: { $ne: videoId },
        status: "public",
      })
      .toArray();
    res.status(200).json({ video: result, moreVideos: moreVideos });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateVideoStatus(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);
  try {
    const { id } = req.query;
    const { status } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const videoId = new ObjectId(id?.toString());
    const result = await db.collection("ninetyvideos").updateOne(
      {
        _id: videoId,
      },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      }
    );

    var message =
      status == "public"
        ? "Your 90 second sound bite has been approved and posted onto CORE tab.  Videos will be deleted after 180 days."
        : "Your 90 second sound bite was not approved.  The most likely reason is that your video is over 95 seconds long.";

    const videoResult = await db
      .collection("ninetyvideos")
      .findOne({ _id: videoId });

    const notification = {
      from: session?.user?.name,
      to: videoResult.author._id.toString(),
      message: message,
      link: `/dashboard/core/makeninety`,
      isRead: false,
      isFlag: false,
      createdAt: new Date(),
    };
    const notify = {
      fromName: session?.user?.name,
      email: videoResult.author.email,
      notificationLink: `${process.env.HOME_URL}/dashboard/core/makeninety`,
    };
    try {
      await sendgrid.send({
        to: notify.email,
        from: {
          email: "yCITIES1@gmail.com",
          name: "Turtle Boat",
        },
        subject:
          status == "public"
            ? "Your 90 second sound bite has been approved"
            : "Your 90 second sound bite was not approved.",
        cc: process.env.CC_EMAIL,
        text: message,
        isMultiple: false,
      });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: SERVER_ERR_MSG });
    }
    await db.collection("notifications").insertOne(notification);
    pusher.trigger(
      `user-${videoResult.author._id.toString()}`,
      "comment",
      notification
    );

    if (!result.matchedCount) {
      res.status(500).json({ err: SERVER_ERR_MSG });
    } else {
      // Get Token Action for "Upload an approved 90 Second Kid Care Video": no is 4
      // Get Token Action for "Upload an approved 90 Inside Mind of Investor Video": no is 5
      // Get Token Action for "Upload an approved 90 Second "And Then This Happened..." Video": no is 6
      let actionNo = 0;
      switch (videoResult.type) {
        case 1:
          actionNo = 4;
          break;
        case 2:
          actionNo = 5;
          break;
        case 3:
          actionNo = 6;
          break;
      }
      if (actionNo != 0 && status == "public") {
        const tokenAction = await db
          .collection("token_actions")
          .findOne({ no: actionNo });

        await db.collection("token_history").insertOne({
          userId: new ObjectId(videoResult.author._id.toString()),
          createdAt: new Date(),
          amount: tokenAction.tokenAmount,
          isView: false,
          updatedAt: new Date(),
          actionNo: 4,
          type: "action",
        });

        const userId = new ObjectId(videoResult.author._id.toString());
        pusher.trigger(
          `user-token-${videoResult.author._id.toString()}`,
          "token-history",
          {
            type: 1,
            name: tokenAction.name,
            tokenAmount: tokenAction.tokenAmount,
          }
        );
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
      }

      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}
