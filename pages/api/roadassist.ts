import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import { pusher } from "@/utils/pusher-server";
import getDb from "@/utils/getdb";
import { resend } from "@/utils/resend";
import RequestERA from "@/components/email/RequestERA";
import ResponseERA from "@/components/email/ReponseERA";
import ForwardRequest from "@/components/email/ForwardRequest";
import { delay } from "@/utils/utils";

const SERVER_ERR_MSG = "Something went wrong in a server.";

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
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
            createRequestERA(req, res);
            break
        case 'PUT':
            // Handle PUT request
            saveResponseERA(req, res);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function createRequestERA(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }

        const { 
            type, 
            typeLabel,
            specificHelpRequest, 
            assistanceType, 
            vid,
            uid,
            memberList, 
            whatYouDid, 
            elevatorType,
            opening, 
            problem, 
            setting, 
            character, 
            solution, 
            closing, 
        } = fields;
        
        const ventureId = new ObjectId(vid?.toString());
        const specificMembers = JSON.parse(memberList?.toString() ?? "");
        const db = await getDb();

        const folks = await db
            .collection("tagging_list")
            .findOne({ tagNo: parseInt(type?.toString() ?? "") });

        const ventureData = await db
                .collection("ventures")
                .findOne({ _id: ventureId });

        let fileFields = [];

        for (const key of Object.keys(files)) {
            const fileEntry = files[key];

            // Handle single or multiple file uploads
            const fileArray = Array.isArray(fileEntry) ? fileEntry : [fileEntry];

            for (const file of fileArray) {
                if (
                    file &&
                    typeof file === "object" &&
                    "filepath" in file &&
                    "originalFilename" in file
                ) {
                    const { filepath, originalFilename } = file;
                        try {
                            const uploadResult = await cloudinary.uploader.upload(filepath, {
                                public_id: `ycity_files/${originalFilename}`,
                                overwrite: true,
                                timestamp: new Date().getTime(),
                                resource_type: 'auto',
                                folder: 'ERA Files',
                                invalidate: true
                            });
                            fileFields.push({
                                url: uploadResult.secure_url,
                                assetId: uploadResult.asset_id,
                                name: originalFilename,
                                publicId: uploadResult.public_id
                            })
                        } catch (error) {
                            console.error(error);
                            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
                        }
                    }  else {
                        console.error("File object missing required properties", file);
                        return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
                    }
                } 
        }

        let notifications: any[] = [];

        let members = ventureData.mentors;

        if (assistanceType?.toString() === '0') {
            let memberList: any[] = [];

            specificMembers.map((item: any) => {
                if (!memberList.some(obj => obj.email === item.email || item.email == session?.user?.email )) {
                    memberList.push(item);
                }
            })

            if(folks.users != undefined) {
                folks.users.map((item: any) => {
                    if (!memberList.some(obj => obj.email === item.email || item.email == session?.user?.email )) {
                        memberList.push(item);
                    }
                })
            }
            members = memberList;
        }

        for (const item of members) {
            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                to: item.email,
                subject: `Entrepreneurial Roadside Assistance Request`,
                react: RequestERA({
                    specificHelpRequest,
                    whatYouDid,
                    link: `${process.env.HOME_URL}/dashboard/messages/roadassistances/${vid}`,
                    }),
                cc: process.env.CC_EMAIL,
            });

            if (error) {
                console.error({ error });
                return res.status(500).json({ err: SERVER_ERR_MSG });
            }

            // Respect Resend rate limit (2 emails/sec)
            await new Promise((resolve) => setTimeout(resolve, 600));
        }

        members.map(async (item: any) => {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const notificationForComment = {
                from: uid?.toString(),
                to: item._id.toString(),
                message: `${session?.user?.name} requested your assistance on ${formattedDate}`,
                link: `/dashboard/messages/roadassistances/${vid}`,
                isRead: false,
                isFlag: false,
                createdAt: date,
                type: 'roadside'
            };
            notifications.push(notificationForComment);
            pusher.trigger(`user-${item._id.toString()}`, 'comment', notificationForComment);
        })

        const notificationResult = await db
            .collection("notifications")
            .insertMany(notifications);

        if (!notificationResult.acknowledged) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            const result = await db
                .collection("ventures")
                .updateOne(
                {
                    _id: ventureId
                }, 
                {
                    $set: {
                        era: {
                            request: {
                                type: {
                                    value: type,
                                    label: typeLabel
                                }, 
                                specificHelpRequest: specificHelpRequest,
                                members: members, 
                                whatYouDid: whatYouDid, 
                                elevatorType: elevatorType,
                                opening: opening, 
                                problem: problem, 
                                setting: setting, 
                                character: character, 
                                solution: solution, 
                                closing: closing,
                                files: fileFields
                            }
                        },
                        updatedAt: new Date()
                    }
                });
            if (!result.acknowledged) {
                res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            } else {
                const data = await db
                    .collection("modules")
                    .findOne({ _id: result.insertedId });

                // Get Token Action for "ERA Request": no is 1
                const tokenAction = await db
                    .collection("token_actions")
                    .findOne({ no: 1 });

                await db
                    .collection("token_history")
                    .insertOne({
                        userId: new ObjectId(uid?.toString()),
                        createdAt: new Date(),
                        amount: tokenAction.tokenAmount,
                        isView: false,
                        updatedAt: new Date(),
                        actionNo: 1,
                        type: 'action'
                    });

                const userId = new ObjectId(uid?.toString());
                pusher.trigger(`user-token-${uid?.toString()}`, 'token-history', {
                    type: 1,
                    name: tokenAction.name,
                    tokenAmount: tokenAction.tokenAmount
                });
                // Update User Tokens
                const userInfo = await db
                    .collection("users")
                    .findOne({  _id: userId });

                await db.collection("users")
                    .updateOne(
                        {
                            _id: userId
                        },
                        {
                            $set: {
                                tokens: userInfo.tokens + tokenAction.tokenAmount,
                                totalEarnedTokens: userInfo.totalEarnedTokens + tokenAction.tokenAmount
                            }
                        }
                    );
                res.status(200).json({ success: true, result: data });
            }
        }
    });
}

async function saveResponseERA(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    const db = await getDb();
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        } 

        const { helpers, vid, responseContent, isTextResponse, email, fromUid, toUid } = fields;
        const ventureId = new ObjectId(vid?.toString());

        const venture = await db.collection("ventures")
            .findOne(
                {
                    _id: ventureId
                }
            );
        
        let specificHelpRequest = '';
        let whatYouDid = '';
        let type = '';

        if (venture.era != undefined && venture.era != null) {
            if (venture.era.request != null && venture.era.request != undefined) {
                type = venture.era.request.type.label;
                specificHelpRequest = venture.era.request.specificHelpRequest;
                whatYouDid = venture.era.request.whatYouDid;
            }
        }
        
    if (Array.isArray(helpers)) {
        for (const helperEmail of helpers) {
            try {
            await resend.emails.send({
                from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                to: helperEmail,
                subject: `${session?.user?.name} requests Entrepreneurial Advice For Their Mentee`,
                cc: process.env.CC_EMAIL,
                react: ForwardRequest({
                    summary: `${session?.user?.name} feels that you are experienced in an area that their mentee needs some quick advice for. Below is a summary of the Entrepreneurial Roadside Assistance(ERA) ask.`,
                    replyEmail: session?.user?.email ?? "",
                    type,
                    specificHelpRequest,
                    whatYouDid,
                    note: responseContent,
                    name: session?.user?.name ?? "",
                }),
            });

            await delay(600);

            } catch (err) {
                console.error(`Failed to send to ${helperEmail}:`, err);
                return res.status(500).json({ err: SERVER_ERR_MSG });
            }
        }
    }
        let notifications: any[] = [];
    
        // Send email to mentee who requested help
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        try {
            if (isTextResponse) {

                const { data, error } = await resend.emails.send({
                      from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                      to: email ?? "",
                      subject: `Entrepreneurial advice for mentee`,
                      react: ResponseERA({subject: "Entrepreneurial advice for mentee", note: responseContent, link: `${process.env.HOME_URL}/dashboard/messages/roadassistances/${vid}`}),
                      cc: process.env.CC_EMAIL,
                });
                
                if (error) {
                    console.error({ error });
                }
            }
            const notificationForComment = {
                from: fromUid,
                to: toUid,
                message: `${session?.user?.name} replied to your request on ${formattedDate}`,
                link: `/dashboard/messages/roadassistances/${vid}`,
                isRead: false,
                isFlag: false,
                createdAt: date,
                type: 'roadside'
            };
            notifications.push(notificationForComment);
            pusher.trigger(`user-${toUid}`, 'comment', notificationForComment);
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({ err: SERVER_ERR_MSG });
        }
    
        const notificationResult = await db
            .collection("notifications")
            .insertMany(notifications);
    
        await db.collection("ventures")
            .updateOne(
                {
                    _id: ventureId,
                    "era.response": { $exists: false }
                },
                {
                    $set: {
                        'era.response': []
                    }
                }
            );
        const userInfo = await db
            .collection("users")
            .findOne({ email: session?.user?.email });
        const result = await db.collection("ventures")
            .updateOne(
                {
                    _id: ventureId,
                },
                {
                    $push: {
                        'era.response': {
                            $each: [{
                                user: {
                                    email: session?.user?.email,
                                    _id: fromUid,
                                    name: session?.user?.name,
                                    image: userInfo.image
                                },
                                text: responseContent,
                                isForward: !isTextResponse
                            }]
                        }
                    }
                }
            );
    
        if (!notificationResult.acknowledged && !result.matchedCount) {
            res.status(500).json({ success: false, err: SERVER_ERR_MSG });
        } else {
            // Get Token Action for "ERA Response": no is 2
            const tokenAction = await db
                .collection("token_actions")
                .findOne({ no: 2 });

            await db
                .collection("token_history")
                .insertOne({
                    userId: new ObjectId(fromUid?.toString()),
                    createdAt: new Date(),
                    amount: tokenAction.tokenAmount,
                    isView: false,
                    updatedAt: new Date(),
                    actionNo: 2,
                    type: 'action'
                });

            const userId = new ObjectId(fromUid?.toString());
            pusher.trigger(`user-token-${fromUid?.toString()}`, 'token-history', {
                type: 1,
                name: tokenAction.name,
                tokenAmount: tokenAction.tokenAmount
            });
            // Update User Tokens
            const userInfo = await db
                .collection("users")
                .findOne({  _id: userId });

            await db.collection("users")
                .updateOne(
                    {
                        _id: userId
                    },
                    {
                        $set: {
                            tokens: userInfo.tokens + tokenAction.tokenAmount,
                            totalEarnedTokens: userInfo.totalEarnedTokens + tokenAction.tokenAmount
                        }
                    }
                );
            res.status(200).json({ success: true });
        }
    });
}