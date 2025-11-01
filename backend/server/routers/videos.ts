import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { VideoTopic } from "@prisma/client";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

const addVideoInput = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  audioFile: z.file(),
  topic: z.enum(VideoTopic),
  url: z.string(),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
});

type AddVideoInput = z.infer<typeof addVideoInput>;

async function addVideo(input: AddVideoInput) {
  console.log(input);
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

  const arrayBuffer = await input.audioFile.arrayBuffer();
  const audioBytes = new Uint8Array(arrayBuffer);

  await prisma.videos.create({
    data: {
      titleEnglish: input.titleEnglish,
      titleQanjobal: input.titleQanjobal,
      audioFile: audioBytes,
      topic: input.topic,
      url: input.url,
      uploadDate: new Date(),
      descriptionEnglish: input.descriptionEnglish,
      descriptionQanjobal: input.descriptionQanjobal,
    },
  });
}

const removeVideoInput = z.object({
  id: z.number().int(),
});

type RemoveVideoInput = z.infer<typeof removeVideoInput>;

async function removeVideo(input: RemoveVideoInput) {
  const existing = await prisma.videos.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Video with id ${input.id} does not exist`,
    });
  }

  await prisma.videos.delete({
    where: {
      id: input.id,
    },
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
});
