// import type { NextApiRequest, NextApiResponse } from 'next';
// import formidable from 'formidable';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const form = new formidable.IncomingForm({
//         uploadDir: './public/images',
//         maxFileSize: 10 * 1024 * 1024, // 10MB
//       });

//       console.log('here');

//       const data = await new Promise<any>((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve({ ...fields, files });
//           }
//         });
//       });

//       console.log(data)

//       const { image } = data;

//       if (!image) {
//         return res.status(400).json({ error: 'No image provided' });
//       }

//       // Save the image to MongoDB or any other database
//       const imageUrl = await saveImageToDatabase(image);

//       res.status(200).json({ url: imageUrl });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to upload image' });
//     }
//   } else {
//     res.status(404).send('');
//   }
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import formidable from 'formidable';
// import { Session, getServerSession } from "next-auth";
// import { authOptions } from "./auth/[...nextauth]";
// import clientPromise from "@/utils/mongodb";
// import fs from 'fs';
// import { GridFSBucket } from "mongodb";
// import multer from 'multer';

// const SERVER_ERR_MSG = "Something went wrong in a server.";

// interface CustomNextApiRequest extends NextApiRequest {
//   file: Express.Multer.File;
// }

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { file } = req.body;
//   console.log("ddddddddddddddddddddd")
//   try {
//     const client = await clientPromise;
//     const db = client.db(process.env.MONGODB_NAME);
//     console.log('aaaaaaaa', file)
//     // console.log('aaaaaaaa', req.file)
//     const gfs = new GridFSBucket(db, {
//       chunkSizeBytes: 1024 * 255,
//       bucketName: 'uploads',
//     });

//     // const writeStream = gfs.openUploadStream(file.originalname);
//     // const readStream = fs.createReadStream(file.path);
//     // readStream.pipe(writeStream);

//     // await new Promise<void>((resolve, reject) => {
//     //   writeStream.on('error', (err) => {
//     //     reject(err);
//     //   });
//     //   writeStream.on('finish', () => {
//     //     fs.unlinkSync(file.path);
//     //     resolve();
//     //   });
//     // });

//     // const fileId = writeStream.id;

//     // console.log(fileId)

//     // const url = `/files/${fileId}`;
//     // Send a success response
//     // res.status(200).json({ url: url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error uploading file.' });
//   }
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable from 'formidable';
// import fs from 'fs';
// import mongoose from 'mongoose';
// import clientPromise from "@/utils/mongodb";

// Define a MongoDB schema for your file objects
// const fileSchema = new mongoose.Schema({
//   name: String,
//   data: Buffer,
// });

// const File = mongoose.model('File', fileSchema);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const form = new formidable.IncomingForm({ keepExtensions: true });

//   // Parse the incoming request form data
//   // form.parse(req, async (err, fields, files) => {
//   //   if (err) {
//   //     console.error(err);
//   //     return res.status(500).json({ message: 'Failed to parse form data' });
//   //   }

//   //   // Get the file object from the parsed form data
//   //   const file = files['file'];

//   //   // Read the binary data of the file
//   //   const fileData = await fs.promises.readFile(file.path);

//   //   try {
//   //     const client = await clientPromise;
//   //     const db = client.db(process.env.MONGODB_NAME);
//   //     // Create a new MongoDB document for the uploaded file with the binary data
//   //     const newFile = await db
//   //     .collection("files")
//   //     .create({ name: file.name, data: fileData });

//   //     // Return the URL of the newly saved file object
//   //     return res.status(200).json({ url: `https://example.com/files/${newFile._id}` });
//   //   } catch (err) {
//   //     console.error(err);
//   //     return res.status(500).json({ message: 'Failed to save file to database' });
//   //   }
//   // });
// }
