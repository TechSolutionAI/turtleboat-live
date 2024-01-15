// const cors = require('cors');

const express = require('express');
const axios = require('axios');
const formidable = require("formidable");
const { v2: cloudinary } = require("cloudinary");
const Pusher = require("pusher");
const sendgrid = require("@sendgrid/mail");
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const next = require('next');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env.local' });
}
  
const uri = process.env.MONGODB_URL ?? "";
  
async function clientPromise() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return await client.connect();
}
  
sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");
  
const SERVER_ERR_MSG = "Something went wrong in a server.";
  
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
};
  
cloudinary.config(cloudinaryConfig);
  
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? "",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
    secret: process.env.PUSHER_APP_SECRET ?? "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
    useTLS: true,
});

async function getSessionFromNextJsApp(req) {
    const baseUrl = process.env.NEXTAUTH_URL;
    const sessionEndpoint = `${baseUrl}/api/auth/session`;
    const cookies = req.headers.cookie || '';

    try {
        const response = await axios.get(sessionEndpoint, {
            headers: { cookie: cookies },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Start the Next.js server
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
nextApp.prepare().then(() => {
    app.get('/server-api/saveninetyvideo', (req, res) => {
        res.json({ message: 'Hello from custom API endpoint!' });
    });
    
    app.post('/server-api/saveninetyvideo', async (req, res) => {
        const session = await getSessionFromNextJsApp(req);
        const form = new formidable.IncomingForm();
        const client = await clientPromise();
        const db = client.db(process.env.MONGODB_NAME);
    
        try {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err.message);
                }
    
                const { title, uid, username } = fields;
    
                let videoField;
                const file = Object.values(files)[0];
                const fileObject = file;
                console.log("before uploading video");
                try {
                    const uploadResult = await cloudinary.uploader.upload(
                    fileObject.filepath,
                    {
                        public_id: `ycity_files/${fileObject.originalFilename}`,
                        overwrite: true,
                        timestamp: new Date().getTime(),
                        resource_type: "video",
                        quality: "auto:low",
                        eager: [
                            {
                                format: "mp4",
                                transformation: [
                                    { width: 640, height: 360, crop: "limit" },
                                    { audio_codec: "aac", bit_rate: "96k" },
                                    { quality: 60, fps: 30 },
                                ],
                            },
                            {
                                format: "webm",
                                transformation: [
                                    { width: 640, height: 360, crop: "limit" },
                                    { audio_codec: "aac", bit_rate: "96k" },
                                    { quality: 60, fps: 30 },
                                ],
                            },
                            {
                                format: "mov",
                                transformation: [
                                    { width: 640, height: 360, crop: "limit" },
                                    { audio_codec: "aac", bit_rate: "96k" },
                                    { quality: 60, fps: 30 },
                                ],
                            },
                        ],
                        eager_async: true,
                        folder: "ninetyvideos",
                        invalidate: true,
                    });
    
                    videoField = {
                        url: uploadResult.secure_url,
                        assetId: uploadResult.asset_id,
                        name: fileObject.originalFilename,
                        publicId: uploadResult.public_id,
                    };
                    console.log("after uploading video", videoField);
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
                }
    
                var currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 90);
    
                if (videoField != null) {
                    const data = {
                        video: videoField,
                        title: title,
                        author: {
                            email: session?.user?.email,
                            name: username,
                            image: session?.user?.image,
                            _id: uid,
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        expireAt: currentDate,
                        comments: [],
                        status: "private",
                    };
                    const result = await db.collection("ninetyvideos").insertOne(data);
                    console.log(result);
                    if (!result.acknowledged) {
                        return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
                    } else {
                        return res.status(200).json({ success: true });
                    }
                } else {
                    return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
                }
            });
        } catch (err) {
            console.log("Form parse error");
            res.status(500).json({ err: SERVER_ERR_MSG });
        }
    });
    
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    app.post('*', (req, res) => {
        return handle(req, res);
    });

    app.put('*', (req, res) => {
        return handle(req, res);
    });

    app.delete('*', (req, res) => {
        return handle(req, res);
    });

    // Start listening on port 3000
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

// module.exports = async (req, res) => {
//     const session = await getSessionFromNextJsApp(req);
//     const form = new formidable.IncomingForm();
//     const client = await clientPromise();
//     const db = client.db(process.env.MONGODB_NAME);

//     try {
//         form.parse(req, async (err, fields, files) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send(err.message);
//             }

//             const { title, uid, username } = fields;

//             let videoField;
//             const file = Object.values(files)[0];
//             const fileObject = file;
//             console.log("before uploading video");
//             try {
//                 const uploadResult = await cloudinary.uploader.upload(
//                 fileObject.filepath,
//                 {
//                     public_id: `ycity_files/${fileObject.originalFilename}`,
//                     overwrite: true,
//                     timestamp: new Date().getTime(),
//                     resource_type: "video",
//                     quality: "auto:low",
//                     eager: [
//                         {
//                             format: "mp4",
//                             transformation: [
//                                 { width: 640, height: 360, crop: "limit" },
//                                 { audio_codec: "aac", bit_rate: "96k" },
//                                 { quality: 60, fps: 30 },
//                             ],
//                         },
//                         {
//                             format: "webm",
//                             transformation: [
//                                 { width: 640, height: 360, crop: "limit" },
//                                 { audio_codec: "aac", bit_rate: "96k" },
//                                 { quality: 60, fps: 30 },
//                             ],
//                         },
//                         {
//                             format: "mov",
//                             transformation: [
//                                 { width: 640, height: 360, crop: "limit" },
//                                 { audio_codec: "aac", bit_rate: "96k" },
//                                 { quality: 60, fps: 30 },
//                             ],
//                         },
//                     ],
//                     eager_async: true,
//                     folder: "ninetyvideos",
//                     invalidate: true,
//                 });

//                 videoField = {
//                     url: uploadResult.secure_url,
//                     assetId: uploadResult.asset_id,
//                     name: fileObject.originalFilename,
//                     publicId: uploadResult.public_id,
//                 };
//                 console.log("after uploading video", videoField);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
//             }

//             var currentDate = new Date();
//             currentDate.setDate(currentDate.getDate() + 90);

//             if (videoField != null) {
//                 const data = {
//                     video: videoField,
//                     title: title,
//                     author: {
//                         email: session?.user?.email,
//                         name: username,
//                         image: session?.user?.image,
//                         _id: uid,
//                     },
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     expireAt: currentDate,
//                     comments: [],
//                     status: "private",
//                 };
//                 const result = await db.collection("ninetyvideos").insertOne(data);
//                 console.log(result);
//                 if (!result.acknowledged) {
//                     return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
//                 } else {
//                     return res.status(200).json({ success: true });
//                 }
//             } else {
//                 return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
//             }
//         });
//     } catch (err) {
//         console.log("Form parse error");
//         res.status(500).json({ err: SERVER_ERR_MSG });
//     }
// };