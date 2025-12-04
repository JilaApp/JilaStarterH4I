import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3_client, bucket_name } from "@/s3";
import { logger } from "@/lib/logger";
import { Readable } from "stream";

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks as unknown as Uint8Array[]);
}

export async function uploadAudioToS3(
  base64Data: string,
  fileName: string,
  folder: string = "audio",
): Promise<string> {
  try {
    // Convert base64 data to buffer
    const base64Clean = base64Data.split(",")[1] || base64Data;
    const fileBuffer = Buffer.from(base64Clean, "base64");

    // Generate S3 key with timestamp to avoid collisions
    const timestamp = Date.now();
    const s3Key = `${folder}/${timestamp}-${fileName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: bucket_name,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: "audio/mp3",
    };

    await s3_client.send(new PutObjectCommand(uploadParams));

    return s3Key;
  } catch (error) {
    logger.error("[uploadAudioToS3] Failed to upload audio to S3", error);
    throw error;
  }
}

export async function deleteAudioFromS3(s3Key: string): Promise<void> {
  try {
    await s3_client.send(
      new DeleteObjectCommand({
        Bucket: bucket_name,
        Key: s3Key,
      }),
    );
  } catch (error) {
    logger.error("[deleteAudioFromS3] Failed to delete audio from S3", error);
    // Don't throw - allow operation to continue even if S3 deletion fails
  }
}
