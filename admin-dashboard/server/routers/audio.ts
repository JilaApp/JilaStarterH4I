import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { bucket_name, s3_client } from "@/s3";

//promise allows other code to run while waiting for streamtobuffer to complete
//readable means it wont come in all at once and rather piece by piece.
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks as unknown as Uint8Array[]);
}


export default async function audioRouter(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { file_key } = req.body;

    const params = {
      Bucket: bucket_name,
      Key: file_key,
    };
    const command = new GetObjectCommand(params);

    const data = await s3_client.send(command);

    if (!data) {
      return res.status(404).json({ message: "Audio file not found" });
    }

    const buffer = await streamToBuffer(data.Body as Readable);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file_key.split("/").pop()}"`,
    );

    return res.send(buffer);
  } catch (error) {
    // console.error("Error fetching file from S3:", error);
    return res
      .status(404)
      .json({ message: "Failed to fetch audio file from S3" });
  }
}
