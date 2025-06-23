import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";


const SERVER_ERR_MSG = "Something went wrong in a server.";

import { trains } from "@/utils/constant";
import getDb from "@/utils/getdb";

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
            updateStoryTrain(req, res);
            break
        case 'PUT':
            // Handle PUT request
            updateFromW4Puzzle(req, res);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function updateStoryTrain(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { vid, data } = req.body;
        const ventureId = new ObjectId(vid.toString());
        const db = await getDb();
        

        const result = await db
            .collection("ventures")
            .updateOne({
                _id: ventureId
            }, {
                $set: {
                    storyTrain: data,
                    updatedAt: new Date()
                }
            });

        if (!result.matchedCount) {
            res.status(500).json({ err: SERVER_ERR_MSG });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}

async function updateFromW4Puzzle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { vid, isDraft, pillarType, content } = req.body;
        const ventureId = new ObjectId(vid.toString());
        const db = await getDb();
        

        let updateContent: any = {
            "storyTrain.$.value": content,
            "storyTrain.$.draft": ''
        }

        if (isDraft) {
            updateContent = {
                "storyTrain.$.draft": content
            }
        }

        const result = await db
            .collection("ventures")
            .updateOne({
                _id: ventureId,
                "storyTrain.id": pillarType
            }, {
                $set: {
                    ...updateContent,
                    updatedAt: new Date()
                }
            });

        if (!result.matchedCount) {
            const storyTrain = trains.map((trainItem: any) => {
                if (trainItem.id == pillarType) {
                    if (isDraft) {
                        return {
                            ...trainItem,
                            draft: content
                        }
                    } else {
                        return {
                            ...trainItem,
                            value: content
                        }
                    }
                } else {
                    return trainItem;
                }
            })
            const insertResult = await db
                .collection("ventures")
                .updateOne({
                    _id: ventureId
                }, {
                    $set: {
                        storyTrain: storyTrain,
                        updatedAt: new Date()
                    }
                });

            if (!insertResult.matchedCount) {
                res.status(500).json({ err: SERVER_ERR_MSG });
            } else {
                res.status(200).json({ success: true });
            }
        } else {
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}