import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";
import { ComicPanel } from "@/types/comicstrip.type";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const SERVER_ERR_MSG = "Something went wrong in a server.";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? ''
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
}

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
            updateComicStrip(req, res);
            break
        case 'PUT':
            // Handle PUT request
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function updateComicStrip(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { vid, data, comicType } = req.body;
        const ventureId = new ObjectId(vid.toString());
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_NAME);

        const ventureData = await db.collection("ventures").findOne({
            _id: ventureId,
        });

        let panels: ComicPanel[] = [];
        let stripThumbnail = '';

        let firstThumbnailIndex = -1;
        for (var i = 0; i < data.panels.length; i++) {
            let panelItem = data.panels[i];
            if (panelItem.nodes.length > 0) {
                let thumbnail = panelItem.thumbnail;
                let thumbPubId = panelItem.thumbPubId;
                if (panelItem.thumbnail.includes('data:image') && !panelItem.thumbnail.includes('http')) {
                    const timestamp = Date.now();
                    const uploadResult = await cloudinary.uploader.upload(panelItem.thumbnail, {
                        public_id: panelItem.thumbPubId == '' ? `ycity_files/comicstrip_image_${ventureId}_${comicType}_${i}_${timestamp}` : panelItem.thumbPubId,
                        overwrite: true,
                        timestamp: new Date().getTime(),
                        resource_type: 'auto',
                        folder: "comicstrips",
                        invalidate: true,
                    });
                    thumbnail = uploadResult.secure_url;
                    thumbPubId = uploadResult.public_id;
                }

                if (firstThumbnailIndex == -1) {
                    firstThumbnailIndex = i;
                }

                for (var j = 0; j < panelItem.nodes.length; j++) {
                    let parsedItem = JSON.parse(panelItem.nodes[j]);
                    if (parsedItem.className == 'Image') {
                        const timestamp = Date.now();
                        const nodeImgUploadResult = await cloudinary.uploader.upload(parsedItem.src, {
                            public_id: `ycity_files/comicstrip_image_${ventureId}_${comicType}_${i}_${j}_${timestamp}`,
                            overwrite: true,
                            timestamp: new Date().getTime(),
                            resource_type: 'auto',
                            folder: "comicstrips",
                            invalidate: true,
                        });
                        parsedItem.src = nodeImgUploadResult.secure_url;
                    }
                    panelItem.nodes[j] = JSON.stringify(parsedItem);
                };

                panels.push({
                    thumbnail: thumbnail,
                    thumbPubId: thumbPubId,
                    nodes: panelItem.nodes,
                    comments: panelItem?.comments ?? []
                });

            } else {
                panels.push({
                    thumbnail: '',
                    thumbPubId: '',
                    nodes: panelItem.nodes,
                    comments: panelItem?.comments ?? []
                });
            }

            if (firstThumbnailIndex != -1) {
                stripThumbnail = panels[firstThumbnailIndex].thumbnail;
            }
        }
        /* Upload One file per Panel */
        // for(var i = 0 ; i < data.panels.length; i++) {
        //     let panelItem = data.panels[i];
        //     if (panelItem.thumbnail != '') {
        //         const uploadResult = await cloudinary.uploader.upload(panelItem.thumbnail, { 
        //             public_id: `ycity_files/comicstrip_image_${ventureId}_${comicType}_${i}`,
        //             overwrite: true,
        //             timestamp: new Date().getTime(),
        //             resource_type: 'auto',
        //             folder: "comicstrips",
        //             invalidate: true,
        //         });

        //         if (firstThumbnailIndex == -1) {
        //             firstThumbnailIndex = i;
        //         }
        //         panels.push({
        //             thumbnail: uploadResult.secure_url,
        //             thumbPubId: uploadResult.public_id,
        //             nodes: panelItem.nodes
        //         });
        //     } else {
        //         panels.push(panelItem);
        //     }

        //     // panels.push(panelItem);

        //     if (firstThumbnailIndex != -1) {
        //         stripThumbnail = panels[firstThumbnailIndex].thumbnail;
        //     }
        // }
        /* Upload One file per Panel */

        let result;

        if (comicType == 0) {
            result = await db
                .collection("ventures")
                .updateOne({
                    _id: ventureId
                }, {
                    $set: {
                        problemComicStrip: {
                            title: data.title.toLowerCase(),
                            panels: panels,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            thumbnail: stripThumbnail
                        },
                        updatedAt: new Date()
                    }
                });
        } else if (comicType == 1) {
            result = await db
                .collection("ventures")
                .updateOne({
                    _id: ventureId
                }, {
                    $set: {
                        solutionComicStrip: {
                            title: data.title.toLowerCase(),
                            panels: panels,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            thumbnail: stripThumbnail
                        },
                        updatedAt: new Date()
                    }
                });
        }

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