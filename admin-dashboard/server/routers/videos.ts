import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { VideoTopic } from "@prisma/client";
import { router, protectedProcedure } from "../trpc";
import { requireCommunityOrgAdmin, getUserCommunityOrgId } from "../utils";
import { logger } from "@/lib/logger";
import { uploadAudioToS3, deleteAudioFromS3 } from "@/lib/s3Utils";
import prisma from "@/lib/prisma";
import { GoogleAuth } from "google-auth-library";

const addVideoInput = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  audioFile: z.string(),
  audioFilename: z.string(),
  audioFileSize: z.number(),
  topic: z.nativeEnum(VideoTopic),
  urls: z.array(z.string()),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
});

const removeVideoInput = z.object({
  id: z.number(),
});

const updateVideoInput = z.object({
  id: z.number(),
  titleEnglish: z.string().optional(),
  titleQanjobal: z.string().optional(),
  topic: z.nativeEnum(VideoTopic).optional(),
  urls: z.array(z.string()).optional(),
  descriptionEnglish: z.string().optional(),
  descriptionQanjobal: z.string().optional(),
  audioFile: z.string().optional(),
  audioFilename: z.string().optional(),
  audioFileSize: z.number().optional(),
});

type AddVideoInput = z.infer<typeof addVideoInput>;
type RemoveVideoInput = z.infer<typeof removeVideoInput>;
type UpdateVideoInput = z.infer<typeof updateVideoInput>;

function extractYoutubeId(url: string) {
  var regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    console.log(`error for url ${url}`);
    return url;
  }
}

function extractDriveId(url: string): string {
  const match =
    url.match(/\/file\/d\/([^\/]+)\//) || url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : url;
}

async function getYoutubeDuration(url: string) {
  let id = extractYoutubeId(url);
  let result = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${process.env.GOOGLE_API_KEY}`
  );
  let r = await result.json();
  let str = r.items[0].contentDetails.duration.substring(2);
  let secs = 0;
  if (str.includes("H")) {
    secs += +str.split("H")[0] * 60 * 60;
    str = str.split("H")[1];
  }
  if (str.includes("M")) {
    secs += +str.split("M")[0] * 60;
    str = str.split("M")[1];
  }
  if (str.includes("S")) {
    secs += +str.split("S")[0];
  }
  return secs;
}

async function getAuthClient() {
  const auth = new GoogleAuth({
    keyFile: process.env.DRIVE_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const client = await auth.getClient();
  return client;
}

async function getDriveDuration(url: string): Promise<number> {
  let id = extractDriveId(url);
  const fields = encodeURIComponent("videoMediaMetadata");
  const client = await getAuthClient();
  const res = await client.request({
    url: `https://www.googleapis.com/drive/v3/files/${id}?fields=${fields}`,
    method: "GET",
  });
  // @ts-ignore
  return +res.data.videoMediaMetadata.durationMillis / 1000;
}

async function processUrlList(urls: string[]): Promise<number[]> {
  let videoDurations = [];
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].includes("google")) {
      videoDurations.push(await getDriveDuration(urls[i]));
    } else {
      videoDurations.push(await getYoutubeDuration(urls[i]));
    }
  }
  return videoDurations;
}

async function addVideo(input: AddVideoInput, communityOrgId: string | null) {
  try {
    const s3Key = await uploadAudioToS3(
      input.audioFile,
      input.audioFilename,
      "videos"
    );

    let videoDurations = await processUrlList(input.urls);

    await prisma.videos.create({
      data: {
        titleEnglish: input.titleEnglish,
        titleQanjobal: input.titleQanjobal,
        audioFileS3Key: s3Key,
        audioFilename: input.audioFilename,
        audioFileSize: input.audioFileSize,
        topic: input.topic,
        urls: input.urls,
        durations: videoDurations,
        uploadDate: new Date(),
        descriptionEnglish: input.descriptionEnglish,
        descriptionQanjobal: input.descriptionQanjobal,
        communityOrgId: communityOrgId,
      },
    });
  } catch (err: any) {
    logger.error("[addVideo] Failed to add video", err);
    throw err;
  }
}

async function removeVideo(input: RemoveVideoInput) {
  try {
    const existing = await prisma.videos.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found",
      });
    }

    // Delete audio file from S3 if it exists
    if (existing.audioFileS3Key) {
      await deleteAudioFromS3(existing.audioFileS3Key);
    }

    await prisma.videos.delete({
      where: {
        id: input.id,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[removeVideo] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete video. Please try again.",
    });
  }
}

async function updateVideo(input: UpdateVideoInput) {
  try {
    const { id, audioFile, audioFilename, audioFileSize, ...rest } = input;
    const existing = await prisma.videos.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found",
      });
    }

    const dataToUpdate: {
      titleEnglish?: string;
      titleQanjobal?: string;
      topic?: VideoTopic;
      urls?: string[];
      durations?: number[];
      descriptionEnglish?: string;
      descriptionQanjobal?: string;
      audioFileS3Key?: string | null;
      audioFilename?: string | null;
      audioFileSize?: number | null;
    } = { ...rest, durations: await processUrlList(rest.urls || []) };

    if (audioFile !== undefined) {
      if (audioFile === "") {
        // Delete old file from S3 if it exists
        if (existing.audioFileS3Key) {
          await deleteAudioFromS3(existing.audioFileS3Key);
        }
        dataToUpdate.audioFileS3Key = null;
        dataToUpdate.audioFilename = null;
        dataToUpdate.audioFileSize = null;
      } else {
        // Upload new file to S3
        const s3Key = await uploadAudioToS3(
          audioFile,
          audioFilename!,
          "videos"
        );

        // Delete old file from S3 if it exists
        if (existing.audioFileS3Key) {
          await deleteAudioFromS3(existing.audioFileS3Key);
        }

        dataToUpdate.audioFileS3Key = s3Key;
        dataToUpdate.audioFilename = audioFilename;
        dataToUpdate.audioFileSize = audioFileSize;
      }
    }

    return await prisma.videos.update({
      where: { id },
      data: dataToUpdate,
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[updateVideo] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update video. Please try again.",
    });
  }
}

async function getAllVideos(communityOrgId: string | null) {
  try {
    const videos = await prisma.videos.findMany({
      where: communityOrgId ? { communityOrgId } : undefined,
      select: {
        id: true,
        titleEnglish: true,
        titleQanjobal: true,
        topic: true,
        urls: true,
        durations: true,
        uploadDate: true,
        descriptionEnglish: true,
        descriptionQanjobal: true,
        audioFilename: true,
        audioFileSize: true,
        audioFileS3Key: true,
        communityOrgId: true,
      },
    });
    return videos;
  } catch (error) {
    logger.error("[getAllVideos] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch videos. Please try again.",
    });
  }
}

export const videosRouter = router({
  addVideo: protectedProcedure
    .input(addVideoInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
      return addVideo(input, communityOrgId);
    }),
  getAllVideos: protectedProcedure.query(async ({ ctx }) => {
    await requireCommunityOrgAdmin(ctx.auth.userId!);
    const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
    return getAllVideos(communityOrgId);
  }),
  removeVideo: protectedProcedure
    .input(removeVideoInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return removeVideo(input);
    }),
  updateVideo: protectedProcedure
    .input(updateVideoInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return updateVideo(input);
    }),
});
