import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { JobType, LocationType } from "@prisma/client";

const addJobInput = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  companyName: z.string(),
  jobType: z.nativeEnum(JobType),
  locationType: z.nativeEnum(LocationType),
  city: z.string(),
  state: z.string(),
  url: z.string(),
  salary: z.number(),
  expirationDate: z.date(),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
});

const removeJobInput = z.object({
  id: z.union([z.string(), z.number()]),
});

const updateJobInput = z.object({
  id: z.number(),
  titleEnglish: z.string().optional(),
  titleQanjobal: z.string().optional(),
  companyName: z.string().optional(),
  jobType: z.nativeEnum(JobType).optional(),
  locationType: z.nativeEnum(LocationType).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  url: z.string().optional(),
  salary: z.number().optional(),
  expirationDate: z.date().optional(),
  descriptionEnglish: z.string().optional(),
  descriptionQanjobal: z.string().optional(),
});

type AddJobInput = z.infer<typeof addJobInput>;
type RemoveJobInput = z.infer<typeof removeJobInput>;
type UpdateJobInput = z.infer<typeof updateJobInput>;

async function addJob(input: AddJobInput) {
  try {
    const existing = await prisma.jobs.findUnique({
      where: { url: input.url },
      select: { id: true },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Job with url ${input.url} already exists`,
      });
    }

    await prisma.jobs.create({
      data: {
        titleEnglish: input.titleEnglish,
        titleQanjobal: input.titleQanjobal,
        companyName: input.companyName,
        jobType: input.jobType,
        locationType: input.locationType,
        city: input.city,
        state: input.state,
        url: input.url,
        salary: input.salary,
        expirationDate: input.expirationDate,
        descriptionEnglish: input.descriptionEnglish,
        descriptionQanjobal: input.descriptionQanjobal,
      },
    });
  } catch (err: any) {
    throw err;
  }
}

async function removeJob(input: RemoveJobInput) {
  const numericId =
    typeof input.id === "string" ? parseInt(input.id, 10) : input.id;

  if (isNaN(numericId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid job ID provided: ${input.id}`,
    });
  }

  const existing = await prisma.jobs.findUnique({
    where: { id: numericId },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Job with id ${numericId} does not exist`,
    });
  }

  await prisma.jobs.delete({
    where: {
      id: numericId,
    },
  });
}

async function updateJob(input: UpdateJobInput) {
  const { id, ...rest } = input;
  const existing = await prisma.jobs.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Job with id ${id} does not exist`,
    });
  }

  return await prisma.jobs.update({
    where: { id },
    data: rest,
  });
}

async function getAllJobs() {
  const jobs = await prisma.jobs.findMany({
    select: {
      id: true,
      titleEnglish: true,
      titleQanjobal: true,
      companyName: true,
      jobType: true,
      locationType: true,
      city: true,
      state: true,
      url: true,
      salary: true,
      expirationDate: true,
      descriptionEnglish: true,
      descriptionQanjobal: true,
    },
  });
  return jobs;
}

export const jobsRouter = router({
  addJob: publicProcedure
    .input(addJobInput)
    .mutation(({ input }) => addJob(input)),
  getAllJobs: publicProcedure.query(getAllJobs),
  removeJob: publicProcedure
    .input(removeJobInput)
    .mutation(({ input }) => removeJob(input)),
  updateJob: publicProcedure
    .input(updateJobInput)
    .mutation(({ input }) => updateJob(input)),
});