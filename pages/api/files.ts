import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import getDb from "@/utils/getdb";
// import multer from 'multer';

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
      break
    case 'PUT':
      // Handle PUT request
      uploadFiles(req, res);
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function uploadFiles(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            const { id } = fields;
            const db = await getDb();
            const moduleId = new ObjectId(id.toString());
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

            for (const file of Object.values(files)) {
                const fileObject: FileObject = file as unknown as FileObject;
                try {
                    const uploadResult = await cloudinary.uploader.upload(fileObject.filepath, {
                        public_id: `ycity_files/${fileObject.originalFilename}`,
                        overwrite: true,
                        timestamp: new Date().getTime(),
                        resource_type: 'auto',
                        folder: 'modules',
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
            res.status(200).json({ success: true, result: fileFields });
        });
    } catch (err) {
        res.status(500).json({ err: SERVER_ERR_MSG });
    }
}