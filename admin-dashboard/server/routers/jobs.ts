import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { JobType, LocationType, JobStatus } from "@prisma/client";

const addJobInput = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  companyName: z.string(),
  businessContactEmail: z.union([z.string().email(), z.literal("")]).optional(),
  jobType: z.nativeEnum(JobType),
  acceptedLanguages: z.array(z.string()).default([]),
  locationType: z.nativeEnum(LocationType),
  city: z.string(),
  state: z.string(),
  url: z.string(),
  salary: z.number(),
  expirationDate: z.coerce.date(),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
  status: z.nativeEnum(JobStatus).optional().default(JobStatus.ACTIVE),
});

const removeJobInput = z.object({
  id: z.union([z.string(), z.number()]),
});

const updateJobInput = z.object({
  id: z.number(),
  titleEnglish: z.string().optional(),
  titleQanjobal: z.string().optional(),
  companyName: z.string().optional(),
  businessContactEmail: z.union([z.string().email(), z.literal("")]).optional(),
  jobType: z.nativeEnum(JobType).optional(),
  acceptedLanguages: z.array(z.string()).optional(),
  locationType: z.nativeEnum(LocationType).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  url: z.string().optional(),
  salary: z.number().optional(),
  expirationDate: z.coerce.date().optional(),
  descriptionEnglish: z.string().optional(),
  descriptionQanjobal: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
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
        message: "A job with this URL already exists",
      });
    }

    const job = await prisma.jobs.create({
      data: {
        titleEnglish: input.titleEnglish,
        titleQanjobal: input.titleQanjobal,
        companyName: input.companyName,
        businessContactEmail: input.businessContactEmail || "",
        jobType: input.jobType,
        acceptedLanguages: input.acceptedLanguages,
        locationType: input.locationType,
        city: input.city,
        state: input.state,
        url: input.url,
        salary: input.salary,
        expirationDate: input.expirationDate,
        descriptionEnglish: input.descriptionEnglish,
        descriptionQanjobal: input.descriptionQanjobal,
        status: input.status || JobStatus.ACTIVE,
      },
    });

    return job;
  } catch (err: any) {
    if (err instanceof TRPCError) {
      throw err;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create job posting",
    });
  }
}

async function removeJob(input: RemoveJobInput) {
  try {
    const numericId =
      typeof input.id === "string" ? parseInt(input.id, 10) : input.id;

    if (isNaN(numericId)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid job ID",
      });
    }

    const existing = await prisma.jobs.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Job posting not found",
      });
    }

    await prisma.jobs.delete({
      where: {
        id: numericId,
      },
    });
  } catch (err: any) {
    if (err instanceof TRPCError) {
      throw err;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete job posting",
    });
  }
}

async function updateJob(input: UpdateJobInput) {
  try {
    const { id, ...rest } = input;
    const existing = await prisma.jobs.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Job posting not found",
      });
    }

    return await prisma.jobs.update({
      where: { id },
      data: rest,
    });
  } catch (err: any) {
    if (err instanceof TRPCError) {
      throw err;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update job posting",
    });
  }
}

async function getAllJobs() {
  try {
    const jobs = await prisma.jobs.findMany({
      select: {
        id: true,
        titleEnglish: true,
        titleQanjobal: true,
        companyName: true,
        businessContactEmail: true,
        jobType: true,
        acceptedLanguages: true,
        locationType: true,
        city: true,
        state: true,
        url: true,
        salary: true,
        expirationDate: true,
        descriptionEnglish: true,
        descriptionQanjobal: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return jobs;
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch job postings",
    });
  }
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
