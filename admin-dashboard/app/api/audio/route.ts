import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { bucket_name, s3_client } from "@/s3";
import { NextRequest, NextResponse } from "next/server";

//promise allows other code to run while waiting for streamtobuffer to complete
//readable means it wont come in all at once and rather piece by piece.
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks as unknown as Uint8Array[]);
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const file_key = searchParams.get("key");

    if (!file_key) {
      return NextResponse.json(
        { message: "Missing file key" },
        { status: 400 },
      );
    }

    const params = {
      Bucket: bucket_name,
      Key: file_key,
    };
    const command = new GetObjectCommand(params);

    const data = await s3_client.send(command);

    if (!data) {
      return NextResponse.json(
        { message: "Audio file not found" },
        { status: 404 },
      );
    }

    const buffer = await streamToBuffer(data.Body as Readable);

    const headers = new Headers();

    const contentType = data.ContentType || "application/octet-stream";
    headers.set("Content-Type", contentType);

    headers.set(
      "Content-Disposition",
      `attachment; filename="${file_key.split("/").pop()}"`,
    );

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    // console.error("Error fetching file from S3:", error);
    return NextResponse.json(
      { message: "Failed to fetch audio file from S3" },
      { status: 404 },
    );
  }
}
