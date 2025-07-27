import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from "mongodb";
import getDb from '@/utils/getdb';
import { resend } from '@/utils/resend';
import DailyDigest from '@/components/email/DailyDigest';
import LemonadeInvite from '@/components/email/LemonadeInvite';
import LemonadeReminder from '@/components/email/LomonadeReminder';
import { delay } from '@/utils/utils';

const SERVER_ERR_MSG = "Something went wrong in a server.";

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

        for (const notification of unreadNotifications) {
            try {
                const userId = new ObjectId(notification._id.toString());
                const userInfo = await db.collection("users").findOne({ _id: userId });

                if (userInfo?.dailyDigestEnabled) {
                    const {data, error } = await resend.emails.send({
                        from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                        to: userInfo.email,
                        subject: "Here is a summary of notifications from your CORE Community.",
                        react: DailyDigest({
                            name: userInfo.name,
                            count: notification.count,
                            link: `${process.env.HOME_URL}/dashboard/messages`,
                            }),
                        cc: process.env.CC_EMAIL,
                    });

                    if (error) {
                        console.error({ error });
                    }

                    await delay(600)

                }
            } catch (err: any) {
                console.error("Failed to send Daily Digest:", err);
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

        for (const lemonade of remindLemonades) {
            try {
                // Find initiator email
                const initiator = lemonade.participants.find((p: any) => p.isInitiator);

                const {data, error } = await resend.emails.send({
                    from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                    to: initiator.email,
                    subject: "Reminder: Your Coffee Chat has no participants.",
                    cc: process.env.CC_EMAIL,
                    react: LemonadeReminder({
                        inviteAddress: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/${lemonade._id.toString()}`,
                    }),
                });

                remindedLemonadeIds.push(new ObjectId(lemonade._id.toString()));

                if (error) {
                  console.error({ error });
                }

                await delay(600);
            } catch (err) {
                console.error(`Failed to send reminder for lemonade ${lemonade._id}`, err);
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

        for (const invite of remindLemonadeInvites) {
            try {
                const {data, error} = await resend.emails.send({
                    from: process.env.FROM_EMAIL ?? 'Turtle Boat <vicky@youthcities.org>',
                    to: invite.to,
                    subject: "Reminder: You did not accept invitation of Coffee Chat",
                    cc: process.env.CC_EMAIL,
                    react: LemonadeInvite({
                        inviteAddress: `${process.env.HOME_URL}/dashboard/toolbox/lemonade/invite?id=${invite.inviteId}`,
                    }),
                });

                remindedInviteIds.push(new ObjectId(invite._id.toString()));

                if (error) {
                  console.error({ error });
                }

                await delay(600);

            } catch (err) {
                console.error(`Failed to send Lemonade invite reminder to ${invite.to}`, err);
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