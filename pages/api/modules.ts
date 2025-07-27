import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import getDb from "@/utils/getdb";

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
      getModules(res)
      break
    case 'POST':
      // Handle POST request
      createModule(req, res);
      break
    case 'PUT':
      // Handle PUT request
      updateModule(req, res);
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function getModules(res: NextApiResponse) {
  try {
    const db = await getDb();
    const result = await db
      .collection("modules")
      .find()
      .toArray();
    res.status(200).json({ result: result });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateModule(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable();
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err.message);
      }

      const { id, title, content, item } = fields;
      const db = await getDb();
      const moduleId = new ObjectId(id?.toString());
      const currentModule = await db
        .collection("modules")
        .findOne({ _id: moduleId })

      let fileFields: any[] = [];

      Object.entries(fields).filter((field) => {
        if (field[0].startsWith('prevFileIds') && currentModule != null) {
          currentModule.files.map((fileItem: any) => {
            if (fileItem.assetId == field[1]) {
              fileFields.push(fileItem);
            }
          })
        }
      });

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
                resource_type: "auto",
                folder: "modules", // <-- Updated folder
                invalidate: true,
              });

              fileFields.push({
                url: uploadResult.secure_url,
                assetId: uploadResult.asset_id,
                name: originalFilename,
                publicId: uploadResult.public_id,
              });
            } catch (error) {
              console.error("File upload error:", error);
              return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            }
          } else {
            console.error("File object missing required properties", file);
            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
          }
        }
      }

      const result = await db
        .collection("modules")
        .updateOne({ _id: moduleId }, { $set: { title: title, content: content, item: item, files: fileFields } });
      if (!result.acknowledged) {
        res.status(500).json({ success: false, err: SERVER_ERR_MSG });
      } else {
        const data = await db
          .collection("modules")
          .findOne({ _id: moduleId });

        // Change all modules in courses and ventures section
        // await db.collection("courses")
        //   .updateMany(
        //     {
        //       $or: [
        //         { 'modules.module._id': moduleId.toString() },
        //         { 'modules.module._id': moduleId },
        //       ]
        //     },
        //     { $set: { 'modules.$.module': data } }
        //   );
        // await db.collection("ventures")
        //   .updateMany(
        //     {
        //       $or: [
        //         { 'course.modules.module._id': moduleId.toString() },
        //         { 'course.modules.module._id': moduleId },
        //       ]
        //     },
        //     { $set: { 'course.modules.$.module': data } }
        //   );
        res.status(200).json({ success: true, result: data });
      }
    });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function createModule(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }

    const { title, content, item } = fields;

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
                resource_type: "auto",
                folder: "modules", // <-- Updated folder
                invalidate: true,
              });

              fileFields.push({
                url: uploadResult.secure_url,
                assetId: uploadResult.asset_id,
                name: originalFilename,
                publicId: uploadResult.public_id,
              });
            } catch (error) {
              console.error("File upload error:", error);
              return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
            }
          } else {
            console.error("File object missing required properties", file);
            return res.status(500).json({ success: false, err: SERVER_ERR_MSG });
          }
        }
      }

    const db = await getDb();
    const result = await db
      .collection("modules")
      .insertOne({ title: title, content: content, item: item, files: fileFields });
    if (!result.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      const data = await db
        .collection("modules")
        .findOne({ _id: result.insertedId });
      res.status(200).json({ success: true, result: data });
    }
  });
}