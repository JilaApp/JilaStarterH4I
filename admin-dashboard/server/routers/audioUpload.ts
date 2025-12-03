import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket_name, s3_client } from "@/s3";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function audioUploadRouter(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fileName, fileType, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ message: "No file data provided" });
    }

    // Convert base64 data to buffer
    // Remove header if present (e.g., "data:audio/wav;base64,")
    const base64Data = fileData.split(",")[1] || fileData;
    const fileBuffer = Buffer.from(base64Data, "base64");

    // Generate a unique key for the file
    const key = fileName;

    // Upload to S3
    const uploadParams = {
      Bucket: bucket_name,
      Key: key,
      Body: fileBuffer,
      ContentType: fileType || "audio/wav",
    };

    const data = await s3_client.send(new PutObjectCommand(uploadParams));
    // console.log("S3 upload response:", data);

    return res.status(200).json({ success: true, key });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return res
      .status(500)
      .json({ message: "Failed to upload audio file to S3" });
  }
}
