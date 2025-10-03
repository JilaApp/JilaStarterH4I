import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { VideoCategory, VideoSource } from "@prisma/client";
import prisma from "../../lib/prisma";
import { TRPCError } from "@trpc/server";

const addVideoInput = z.object({
  title: z.string(),
  category: z.enum(VideoCategory),
  source: z.enum(VideoSource),
  length: z.number().int(),
  url: z.string(),
  description: z.string(),
  language: z.string(),
});

type AddVideoInput = z.infer<typeof addVideoInput>;

async function addVideo(input: AddVideoInput) {
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

  await prisma.videos.create({
    data: {
      title: input.title,
      category: input.category,
      source: input.source,
      length: input.length,
      url: input.url,
      uploadDate: new Date(),
      description: input.description,
      likes: 0,
      dislikes: 0,
      language: input.language,
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
});
