import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { bucket_name, s3_client } from "@/s3";
import { NextRequest, NextResponse } from "next/server";
import { streamToBuffer } from "@/lib/s3Utils";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const file_key = searchParams.get("key");

    console.log("[API /audio] Request received for key:", file_key);

    if (!file_key) {
      console.log("[API /audio] Missing file key");
      return NextResponse.json(
        { message: "Missing file key" },
        { status: 400 },
      );
    }

    const params = {
      Bucket: bucket_name,
      Key: file_key,
    };
    console.log("[API /audio] Fetching from S3:", params);
    const command = new GetObjectCommand(params);

    const data = await s3_client.send(command);

    if (!data) {
      console.log("[API /audio] No data returned from S3");
      return NextResponse.json(
        { message: "Audio file not found" },
        { status: 404 },
      );
    }

    console.log(
      "[API /audio] S3 response received, Content-Type:",
      data.ContentType,
    );
    const buffer = await streamToBuffer(data.Body as Readable);
    console.log("[API /audio] Buffer size:", buffer.length);

    const headers = new Headers();

    const contentType = data.ContentType || "audio/mpeg";
    headers.set("Content-Type", contentType);

    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    headers.set(
      "Content-Disposition",
      `inline; filename="${file_key.split("/").pop()}"`,
    );

    console.log(
      "[API /audio] Sending response with content type:",
      contentType,
    );
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("[API /audio] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch audio file from S3" },
      { status: 404 },
    );
  }
}
