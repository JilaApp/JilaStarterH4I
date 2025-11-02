import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { VideoTopic } from "@prisma/client";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

const addVideoInput = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  audioFile: z.string(),
  audioFilename: z.string(),
  audioFileSize: z.number(),
  topic: z.nativeEnum(VideoTopic),
  url: z.string(),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
});

type AddVideoInput = z.infer<typeof addVideoInput>;

export async function addVideo(input: AddVideoInput) {
  try {
    const existing = await prisma.videos.findUnique({
      where: { url: input.url },
      select: { id: true },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Video with url ${input.url} already exists`,
      });
    }

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
        url: input.url,
        uploadDate: new Date(),
        descriptionEnglish: input.descriptionEnglish,
        descriptionQanjobal: input.descriptionQanjobal,
      },
    });
  } catch (err: any) {
    throw err;
  }
}

const removeVideoInput = z.object({
  id: z.union([z.string(), z.number()]),
});

type RemoveVideoInput = z.infer<typeof removeVideoInput>;

async function removeVideo(input: RemoveVideoInput) {
  const numericId =
    typeof input.id === "string" ? parseInt(input.id, 10) : input.id;

  if (isNaN(numericId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid video ID provided: ${input.id}`,
    });
  }

  const existing = await prisma.videos.findUnique({
    where: { id: numericId },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Video with id ${numericId} does not exist`,
    });
  }

  await prisma.videos.delete({
    where: {
      id: numericId,
    },
  });
}

const updateVideoInput = z.object({
  id: z.number(),
  titleEnglish: z.string().optional(),
  titleQanjobal: z.string().optional(),
  topic: z.nativeEnum(VideoTopic).optional(),
  url: z.string().optional(),
  descriptionEnglish: z.string().optional(),
  descriptionQanjobal: z.string().optional(),
  audioFile: z.string().optional(),
  audioFilename: z.string().optional(),
  audioFileSize: z.number().optional(),
});

type UpdateVideoInput = z.infer<typeof updateVideoInput>;

async function updateVideo(input: UpdateVideoInput) {
  const { id, audioFile, audioFilename, audioFileSize, ...rest } = input;
  const existing = await prisma.videos.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Video with id ${id} does not exist`,
    });
  }

  const dataToUpdate: any = { ...rest };

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
}

async function getAllVideos() {
  const videos = await prisma.videos.findMany();
  return videos;
}

export const videosRouter = router({
  addVideo: publicProcedure
    .input(addVideoInput)
    .mutation(({ input }) => addVideo(input)),
  getAllVideos: publicProcedure.query(getAllVideos),
  removeVideo: publicProcedure
    .input(removeVideoInput)
    .mutation(({ input }) => removeVideo(input)),
  updateVideo: publicProcedure
    .input(updateVideoInput)
    .mutation(({ input }) => updateVideo(input)),
});
