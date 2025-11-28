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

const approveJobRequestInput = z.object({
  id: z.union([z.string(), z.number()]),
});

const denyJobRequestInput = z.object({
  id: z.union([z.string(), z.number()]),
});

const bulkApproveJobRequestsInput = z.object({
  ids: z.array(z.union([z.string(), z.number()])),
});

const bulkDenyJobRequestsInput = z.object({
  ids: z.array(z.union([z.string(), z.number()])),
});

type AddJobInput = z.infer<typeof addJobInput>;
type RemoveJobInput = z.infer<typeof removeJobInput>;
type UpdateJobInput = z.infer<typeof updateJobInput>;
type ApproveJobRequestInput = z.infer<typeof approveJobRequestInput>;
type DenyJobRequestInput = z.infer<typeof denyJobRequestInput>;
type BulkApproveJobRequestsInput = z.infer<typeof bulkApproveJobRequestsInput>;
type BulkDenyJobRequestsInput = z.infer<typeof bulkDenyJobRequestsInput>;

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
}

async function getPendingJobRequests() {
  const jobs = await prisma.jobs.findMany({
    where: {
      status: JobStatus.PENDING,
    },
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
}

async function getReviewedJobRequests() {
  const jobs = await prisma.jobs.findMany({
    where: {
      status: {
        in: [JobStatus.ACTIVE, JobStatus.ARCHIVED],
      },
    },
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
}

async function approveJobRequest(input: ApproveJobRequestInput) {
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

  return await prisma.jobs.update({
    where: { id: numericId },
    data: { status: JobStatus.ACTIVE },
  });
}

async function denyJobRequest(input: DenyJobRequestInput) {
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

  // Delete the job request when denied
  await prisma.jobs.delete({
    where: { id: numericId },
  });
}

async function bulkApproveJobRequests(input: BulkApproveJobRequestsInput) {
  const numericIds = input.ids.map((id) =>
    typeof id === "string" ? parseInt(id, 10) : id
  );

  if (numericIds.some((id) => isNaN(id))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid job ID(s) provided`,
    });
  }

  await prisma.jobs.updateMany({
    where: {
      id: { in: numericIds },
    },
    data: { status: JobStatus.ACTIVE },
  });
}

async function bulkDenyJobRequests(input: BulkDenyJobRequestsInput) {
  const numericIds = input.ids.map((id) =>
    typeof id === "string" ? parseInt(id, 10) : id
  );

  if (numericIds.some((id) => isNaN(id))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid job ID(s) provided`,
    });
  }

  // Delete the job requests when denied
  await prisma.jobs.deleteMany({
    where: {
      id: { in: numericIds },
    },
  });
}

export const jobsRouter = router({
  addJob: publicProcedure
    .input(addJobInput)
    .mutation(({ input }) => addJob(input)),
  getAllJobs: publicProcedure.query(getAllJobs),
  getPendingJobRequests: publicProcedure.query(getPendingJobRequests),
  getReviewedJobRequests: publicProcedure.query(getReviewedJobRequests),
  removeJob: publicProcedure
    .input(removeJobInput)
    .mutation(({ input }) => removeJob(input)),
  updateJob: publicProcedure
    .input(updateJobInput)
    .mutation(({ input }) => updateJob(input)),
  approveJobRequest: publicProcedure
    .input(approveJobRequestInput)
    .mutation(({ input }) => approveJobRequest(input)),
  denyJobRequest: publicProcedure
    .input(denyJobRequestInput)
    .mutation(({ input }) => denyJobRequest(input)),
  bulkApproveJobRequests: publicProcedure
    .input(bulkApproveJobRequestsInput)
    .mutation(({ input }) => bulkApproveJobRequests(input)),
  bulkDenyJobRequests: publicProcedure
    .input(bulkDenyJobRequestsInput)
    .mutation(({ input }) => bulkDenyJobRequests(input)),
});
