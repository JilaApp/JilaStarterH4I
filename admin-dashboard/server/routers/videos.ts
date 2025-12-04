import { router, protectedProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { VideoTopic } from "@prisma/client";
import { logger } from "@/lib/logger";
import { clerkClient } from "@clerk/nextjs/server";

// Helper to get user's communityOrgId
const getUserCommunityOrgId = async (
  userId: string,
): Promise<string | null> => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.communityOrgId as string) || null;
};

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

async function addVideo(input: AddVideoInput, communityOrgId: string | null) {
  try {
    const buffer = Buffer.from(input.audioFile, "base64");
    const audioBytes = new Uint8Array(buffer);

    await prisma.videos.create({
      data: {
        titleEnglish: input.titleEnglish,
        titleQanjobal: input.titleQanjobal,
        audioFile: audioBytes,
        audioFilename: input.audioFilename,
        audioFileSize: input.audioFileSize,
        topic: input.topic,
        urls: input.urls,
        uploadDate: new Date(),
        descriptionEnglish: input.descriptionEnglish,
        descriptionQanjobal: input.descriptionQanjobal,
        communityOrgId: communityOrgId,
      },
    });
  } catch (err: any) {
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
      descriptionEnglish?: string;
      descriptionQanjobal?: string;
      audioFile?: Uint8Array | null;
      audioFilename?: string | null;
      audioFileSize?: number | null;
    } = { ...rest };

    if (audioFile !== undefined) {
      if (audioFile === "") {
        dataToUpdate.audioFile = null;
        dataToUpdate.audioFilename = null;
        dataToUpdate.audioFileSize = null;
      } else {
        const buffer = Buffer.from(audioFile, "base64");
        dataToUpdate.audioFile = new Uint8Array(buffer);
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
        uploadDate: true,
        descriptionEnglish: true,
        descriptionQanjobal: true,
        audioFilename: true,
        audioFileSize: true,
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
      const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
      return addVideo(input, communityOrgId);
    }),
  getAllVideos: protectedProcedure.query(async ({ ctx }) => {
    const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
    return getAllVideos(communityOrgId);
  }),
  removeVideo: protectedProcedure
    .input(removeVideoInput)
    .mutation(({ input }) => removeVideo(input)),
  updateVideo: protectedProcedure
    .input(updateVideoInput)
    .mutation(({ input }) => updateVideo(input)),
});
