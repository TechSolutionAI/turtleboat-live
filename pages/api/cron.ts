import type { NextApiRequest, NextApiResponse } from 'next';
import sendgrid from "@sendgrid/mail";
import { ObjectId } from "mongodb";
import getDb from '@/utils/getdb';

const SERVER_ERR_MSG = "Something went wrong in a server.";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const db = await getDb();

        // Remove Expired Ninety Videos
        // const result = await db
        //     .collection("ninetyvideos")
        //     .deleteMany({ expireAt: { $lt: new Date() } })

        // Send Daily Digest Notifications
        const unreadNotifications = await db.collection("notifications")
            .aggregate([
                {
                    $match: {
                        isRead: false
                    }
                },
                {
                    $group: {
                        _id: "$to",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();

        for (var i = 0; i < unreadNotifications.length; i++) {
            try {
                const userId = new ObjectId(unreadNotifications[i]._id.toString());
                const userInfo = await db.collection("users")
                    .findOne({ _id: userId });
                if (userInfo.dailyDigestEnabled) {
                    await sendgrid.send({
                        to: userInfo.email,
                        from: {
                            email: "yCITIES1@gmail.com",
                            name: "Turtle Boat Daily Digest"
                        },
                        subject: 'Here is a summary of notifications from your CORE Community.',
                        cc: process.env.CC_EMAIL,
                        templateId: "d-6298f9b1ccc54fe08e5305c652d221a2",
                        dynamicTemplateData: {
                            subject: 'Here is a summary of notifications from your CORE Community.',
                            link: `${process.env.HOME_URL}/dashboard/messages`,
                            count: unreadNotifications[i].count,
                            name: userInfo.name
                        },
                        isMultiple: false,
                    });
                }
            } catch (err: any) {
                console.log(err);
            }
        }

        // Send Remind Lemonade Invite Emails To Initiators
        let remindedLemonadeIds: ObjectId[] = [];
        const currentDate = new Date();
        const threeDaysAgo = new Date(currentDate.getTime() - (3 * 24 * 60 * 60 * 1000));
        const twoDaysAgo = new Date(currentDate.getTime() - (2 * 24 * 60 * 60 * 1000));

        const remindLemonades = await db
            .collection("lemonades")
            .find({
                createdAt: { $lt: threeDaysAgo },
                isRemind: false,
            })
            .toArray();

        for (var j = 0; j < remindLemonades.length; j++) {
            try {
                let initiatorEmail = '';
                remindLemonades[j].participants.map((participant: any) => {
                    if (participant.isInitiator)
                        initiatorEmail = participant.email;
                })
                await sendgrid.send({
                    to: initiatorEmail,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: 'Reminder: Your Coffee Chat has no participants.',
                    cc: process.env.CC_EMAIL,
                    templateId: "d-ca312bdf0b344d48b2a50e10a9977de6",
                    dynamicTemplateData: {
                        subject: 'Reminder: Your Coffee Chat has no participants.',
                        inviteAddress: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/${remindLemonades[j]._id.toString()}`
                    },
                    isMultiple: false,
                });
                remindedLemonadeIds.push(new ObjectId(remindLemonades[j]._id.toString()));
            } catch (err: any) {
                console.log(err);
            }
        }

        // Send Remind Lemonade Invite Emails To Participants
        let remindedInviteIds: ObjectId[] = [];
        const remindLemonadeInvites = await db
            .collection("lemonade_invites")
            .find({
                time: { $lt: twoDaysAgo },
                isRemind: false,
                isExpired: false
            })
            .toArray();

        for (var k = 0; k < remindLemonadeInvites.length; k++) {
            try {
                await sendgrid.send({
                    to: remindLemonadeInvites[k].to,
                    from: {
                        email: "yCITIES1@gmail.com",
                        name: "Turtle Boat"
                    },
                    subject: 'Reminder: You did not accept invitation of Coffee Chat',
                    cc: process.env.CC_EMAIL,
                    templateId: "d-fe729e80a4e64a18be0907571cfe5e61",
                    dynamicTemplateData: {
                        subject: 'Reminder: You did not accept invitation of Coffee Chat',
                        inviteAddress: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/invite?id=${remindLemonadeInvites[k].inviteId}`
                    },
                    isMultiple: false,
                });
                remindedInviteIds.push(new ObjectId(remindLemonadeInvites[k]._id.toString()));
            } catch (err: any) {
                console.log(err);
            }
        }

        // Update Remind Status
        await db
            .collection("lemonades")
            .updateMany(
                { _id: { $in: remindedLemonadeIds } },
                { $set: { isRemind: true } }
            );

        await db
            .collection("lemonade_invites")
            .updateMany(
                { _id: { $in: remindedInviteIds } },
                { $set: { isRemind: true } }
            );

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(SERVER_ERR_MSG);
        res.status(500).json({ success: false });
    }
}