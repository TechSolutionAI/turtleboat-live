import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import Pusher from 'pusher';

const SERVER_ERR_MSG = "Something went wrong in a server.";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
    secret: process.env.PUSHER_APP_SECRET ?? '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? '',
    useTLS: true,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { linkId } = req.body;
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);
        const checkJoined = await db
            .collection("lemonade_invites")
            .find({
                inviteId: linkId
            })
            .toArray();
        const result = await db
            .collection("lemonade_invites")
            .find({
                inviteId: linkId,
                isExpired: false
            })
            .toArray();
        if (result.length == 0) {
            if (checkJoined.length == 0) {
                res.status(402).json({ err: "Your invite is invalid!" });
            } else {
                if (checkJoined[0].isExpired && checkJoined[0].isRemind) {
                    res.status(200).json({ from: checkJoined[0].from, image: checkJoined[0].image, isFull: false, lemonadeId: checkJoined[0].lemonadeId.toString() });
                } else {
                    res.status(402).json({ err: "Your invite is invalid!" });
                }
            }
        } else {
            const lemonade = await db
                .collection("lemonades")
                .findOne({
                    _id: result[0].lemonadeId,
                })
            if (lemonade) {
                await db
                    .collection("lemonade_invites")
                    .updateOne({ inviteId: linkId }, {
                        $set: {
                            isExpired: true,
                            isRemind: true
                        }
                    });
                if (lemonade.participants.length >= 5) {
                    res.status(200).json({ from: result[0].from, image: result[0].image, isFull: lemonade.participants.length >= 5, lemonadeId: lemonade._id.toString() });
                } else {
                    // Join Process
                    const userInfo = await db
                        .collection("users")
                        .findOne({ email: result[0].to });
                    await db
                        .collection("lemonades")
                        .updateOne({ _id: new ObjectId(lemonade._id) }, {
                            $addToSet: {
                                participants: {
                                    $each: [
                                        {
                                            email: userInfo.email,
                                            name: userInfo.name,
                                            image: userInfo.image,
                                            _id: userInfo._id.toString(),
                                            isInitiator: false,
                                            commentCount: 0,
                                            hasPitch: false
                                        }
                                    ]
                                }
                            },
                            $set: {
                                updatedAt: new Date()
                            }
                        });

                    // Get Token Action for "Participate in 50 Ways to Lemonade Brainstorm": no is 14
                    const tokenAction = await db
                        .collection("token_actions")
                        .findOne({ no: 14 });

                    await db
                        .collection("token_history")
                        .insertOne({
                            userId: new ObjectId(userInfo._id.toString()),
                            createdAt: new Date(),
                            amount: tokenAction.tokenAmount,
                            isView: false,
                            updatedAt: new Date(),
                            actionNo: 14,
                            type: 'action'
                        });

                    const userId = new ObjectId(userInfo._id.toString());
                    pusher.trigger(`user-token-${userInfo._id.toString()}`, 'token-history', {
                        type: 1,
                        name: tokenAction.name,
                        tokenAmount: tokenAction.tokenAmount
                    });

                    // Update User Tokens
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
                    res.status(200).json({ from: result[0].from, image: result[0].image, isFull: false, lemonadeId: lemonade._id.toString() });
                }
            } else {
                res.status(402).json({ err: "Your invite is invalid!" });
            }
        }
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}
