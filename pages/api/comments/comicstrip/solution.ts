import { NextApiRequest, NextApiResponse } from "next";

import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import sendgrid from "@sendgrid/mail";
import { User } from "@/types/user.type";
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SERVER_ERR_MSG = "Something went wrong in a server.";
const EMPTY_ERR_MSG = "You need to save comicstrip first.";

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

        const { vid, uid, content, pid } = fields;
        const ventureId = new ObjectId(vid.toString());
        const userId = new ObjectId(uid.toString());
        const panelIndex = parseInt(pid.toString());

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
                        folder: "comments",
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

        const db = await getDb();
        

        const userInfo = await db
            .collection("users")
            .findOne({ email: user?.email });

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
        };
        
        const result = await db.collection("ventures").updateOne(
            {
                _id: ventureId,
                "solutionComicStrip.panels": { $exists: true },
            },
            {
                $push: {
                    [`solutionComicStrip.panels.${panelIndex}.comments`]: commentData,
                },
            }
        );
        if (!result.matchedCount) {
            res.status(500).json({ success: false, err: EMPTY_ERR_MSG });
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
                    link: `/dashboard/toolbox/comicstrip/${ventureId}`,
                    isRead: false,
                    isFlag: false,
                    ventureTitle: ventureData.title,
                    ventureId: vid,
                    moduleId: "",
                    createdAt: date,
                };
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
                        link: `/dashboard/toolbox/comicstrip/${ventureId}`,
                        isRead: false,
                        isFlag: false,
                        ventureTitle: ventureData.title,
                        ventureId: vid,
                        moduleId: "",
                        createdAt: date,
                    };
                    // emailNotifications.push({
                    //     fromName: session?.user?.name,
                    //     email: mentor.email,
                    //     ventureTitle: ventureData.title,
                    //     notificationLink: `${process.env.HOME_URL}/dashboard/toolbox/storytrain/${ventureId}`
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
                            link: `/dashboard/toolbox/comicstrip/${ventureId}`,
                            isRead: false,
                            isFlag: false,
                            ventureTitle: ventureData.title,
                            ventureId: vid,
                            moduleId: "",
                            createdAt: date,
                        };
                        // emailNotifications.push({
                        //     fromName: session?.user?.name,
                        //     email: collaborator.email,
                        //     ventureTitle: ventureData.title,
                        //     notificationLink: `${process.env.HOME_URL}/dashboard/toolbox/storytrain/${ventureId}`
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

            const notificationResult = await db
                .collection("notifications")
                .insertMany(notifications);

            // Get Token Action for "Post/Comment within a Comic Stripes": no is 17
            const tokenAction = await db
                .collection("token_actions")
                .findOne({ no: 17 });

            const tokenHistory = await db.collection("token_history").insertOne({
                userId: new ObjectId(uid.toString()),
                createdAt: new Date(),
                amount: tokenAction.tokenAmount,
                isView: false,
                updatedAt: new Date(),
                actionNo: 17,
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
                res.status(200).json({ success: true, result: commentData });
            }
        }
    });
}