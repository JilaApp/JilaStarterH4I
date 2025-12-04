import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket_name, s3_client } from "@/s3";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export async function POST(
  req: NextRequest,
) {


  try {
    const { fileName, fileType, fileData } = await req.json();

    if (!fileData) {
      return NextResponse.json({ message: "No file data provided" }, {status: 400});
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
      ContentType: fileType || "audio/mp3",
    };

    const data = await s3_client.send(new PutObjectCommand(uploadParams));
    // console.log("S3 upload response:", data);

    return NextResponse.json({success: true, key}, {status: 200});
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json({message: "Failed to upload audio file to S3"}, {status: 500});
  }
}
