import { S3Client } from "@aws-sdk/client-s3";

export const s3_client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const bucket_name = "h4i-jila-audio-files";
