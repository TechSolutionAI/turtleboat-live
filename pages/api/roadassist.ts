import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import Pusher from 'pusher';
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from 'cloudinary';
import sendgrid from "@sendgrid/mail";

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
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
});

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
    secret: process.env.PUSHER_APP_SECRET ?? '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
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
    const form = new formidable.IncomingForm();
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
        
        const ventureId = new ObjectId(vid.toString());
        const specificMembers = JSON.parse(memberList.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const folks = await db
            .collection("tagging_list")
            .findOne({ tagNo: parseInt(type.toString()) });

        const ventureData = await db
                .collection("ventures")
                .findOne({ _id: ventureId });

        let fileFields = [];

        for (const file of Object.values(files)) {
            const fileObject: FileObject = file as unknown as FileObject;
            try {
                const uploadResult = await cloudinary.uploader.upload(fileObject.filepath, {
                    public_id: `ycity_files/${fileObject.originalFilename}`,
                    overwrite: true,
                    timestamp: new Date().getTime(),
                    resource_type: 'auto',
                    folder: 'ERA Files',
                    invalidate: true
                });
                fileFields.push({
                    url: uploadResult.secure_url,
                    assetId: uploadResult.asset_id,
                    name: fileObject.originalFilename,
                    publicId: uploadResult.public_id
                })
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            }
        }

        let notifications: any[] = [];

        let members = ventureData.mentors;

        if (assistanceType == '0') {
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

        members.map(async (item: any) => {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            };
            const formattedDate = date.toLocaleDateString('en-US', options);
            try {
                await sendgrid.send({
                    to: item.email,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: `Entrepreneurial Roadside Assistance Request`,
                    cc: process.env.CC_EMAIL,
                    templateId: "d-62f92175b5284e78b7876e418b539606",
                    dynamicTemplateData: {
                        subject: `Entrepreneurial Roadside Assistance Request`,
                        link: `${process.env.HOME_URL}/dashboard/messages/roadassistances/${vid}`,
                        specificHelpRequest: specificHelpRequest,
                        whatYouDid: whatYouDid
                    },
                    isMultiple: false,
                });
            } catch (err: any) {
                console.log(err);
                return res.status(500).json({ err: SERVER_ERR_MSG });
            }
        })

        members.map(async (item: any) => {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const notificationForComment = {
                from: uid.toString(),
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
                        userId: new ObjectId(uid.toString()),
                        createdAt: new Date(),
                        amount: tokenAction.tokenAmount,
                        isView: false,
                        updatedAt: new Date(),
                        actionNo: 1,
                        type: 'action'
                    });

                const userId = new ObjectId(uid.toString());
                pusher.trigger(`user-token-${uid.toString()}`, 'token-history', {
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
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        } 

        const { helpers, vid, responseContent, isTextResponse, email, fromUid, toUid } = fields;
        const ventureId = new ObjectId(vid.toString());

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
    
        // Send forward emails
        if (Array.isArray(helpers)) {
            helpers.map(async (item: any) => {
                try {
                    await sendgrid.send({
                        to: item,
                        from: {
                            email: "yCITIES1@gmail.com",
                            name: "Turtle Boat"
                        },
                        subject: `${session?.user?.name} requests Entrepreneurial Advice For Their Mentee`,
                        cc: process.env.CC_EMAIL,
                        templateId: "d-8017b2f779494a9289a2b0fe7e778595",
                        dynamicTemplateData: {
                            subject: `${session?.user?.name} requests Entrepreneurial Advice For Their Mentee`,
                            summary: `${session?.user?.name} feels that you are experienced in an area that their mentee needs some quick advice for. Below is a summary of the Entrepreneurial Roadside Assistance(ERA) ask.`,
                            replyEmail: session?.user?.email != undefined ? session?.user?.email?.toString() : "",
                            type: type,
                            specificHelpRequest: specificHelpRequest,
                            whatYouDid: whatYouDid,
                            note: responseContent,
                            name: session?.user?.name
                        },
                        isMultiple: false,
                    });
                } catch (err: any) {
                    console.log(err);
                    return res.status(500).json({ err: SERVER_ERR_MSG });
                }
            })
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
        const message = isTextResponse ? `${session?.user?.name} replied to your request on ${formattedDate}. ` + responseContent : `${session?.user?.name} forwarded your request to others on ${formattedDate}. <br/> ` + responseContent
        try {
            if (isTextResponse) {
                await sendgrid.send({
                    to: email,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: `Entrepreneurial advice for mentee`,
                    cc: process.env.CC_EMAIL,
                    templateId: "d-271429d35637479ea4786b95867f1270",
                    dynamicTemplateData: {
                        subject: `Entrepreneurial advice for mentee`,
                        link: `${process.env.HOME_URL}/dashboard/messages/roadassistances/${vid}`,
                        note: responseContent
                    },
                    isMultiple: false,
                });
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
                    userId: new ObjectId(fromUid.toString()),
                    createdAt: new Date(),
                    amount: tokenAction.tokenAmount,
                    isView: false,
                    updatedAt: new Date(),
                    actionNo: 2,
                    type: 'action'
                });

            const userId = new ObjectId(fromUid.toString());
            pusher.trigger(`user-token-${fromUid.toString()}`, 'token-history', {
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