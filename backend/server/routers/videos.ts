import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { VideoCategory, VideoSource } from "@prisma/client";
import prisma from "../../lib/prisma";

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
  const video = await prisma.videos.upsert({
    where: { url: input.url },
    update: {},
    create: {
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

  return video;
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
