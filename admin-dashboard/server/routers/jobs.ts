import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PrismaClient, JobType, LocationType, JobStatus } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { requireCommunityOrgAdmin, getUserCommunityOrgId } from "../utils";
import { logger } from "@/lib/logger";

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
  communityOrgId: z.string().optional(), // For job requests submitted by businesses
});

const removeJobInput = z.object({
  id: z.number(),
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
  id: z.number(),
});

const denyJobRequestInput = z.object({
  id: z.number(),
});

const bulkApproveJobRequestsInput = z.object({
  ids: z.array(z.number()),
});

const bulkDenyJobRequestsInput = z.object({
  ids: z.array(z.number()),
});

const markJobRequestsAsReadInput = z.object({
  ids: z.array(z.number()),
});

type AddJobInput = z.infer<typeof addJobInput>;
type RemoveJobInput = z.infer<typeof removeJobInput>;
type UpdateJobInput = z.infer<typeof updateJobInput>;
type ApproveJobRequestInput = z.infer<typeof approveJobRequestInput>;
type DenyJobRequestInput = z.infer<typeof denyJobRequestInput>;
type BulkApproveJobRequestsInput = z.infer<typeof bulkApproveJobRequestsInput>;
type BulkDenyJobRequestsInput = z.infer<typeof bulkDenyJobRequestsInput>;
type MarkJobRequestsAsReadInput = z.infer<typeof markJobRequestsAsReadInput>;

async function addJob(
  input: AddJobInput,
  prisma: PrismaClient,
  communityOrgId?: string | null,
) {
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

    // Use communityOrgId from input (for job requests) or from user context
    const finalCommunityOrgId = input.communityOrgId || communityOrgId;

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
        communityOrgId: finalCommunityOrgId || null,
      },
    });
  } catch (err: unknown) {
    throw err;
  }
}

async function removeJob(input: RemoveJobInput, prisma: PrismaClient) {
  try {
    const existing = await prisma.jobs.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Job not found",
      });
    }

    await prisma.jobs.delete({
      where: {
        id: input.id,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[removeJob] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete job. Please try again.",
    });
  }
}

async function updateJob(input: UpdateJobInput, prisma: PrismaClient) {
  try {
    const { id, ...rest } = input;
    const existing = await prisma.jobs.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Job not found",
      });
    }

    return await prisma.jobs.update({
      where: { id },
      data: rest,
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[updateJob] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update job. Please try again.",
    });
  }
}

async function getAllJobs(communityOrgId: string | null, prisma: PrismaClient) {
  try {
    const jobs = await prisma.jobs.findMany({
      where: communityOrgId ? { communityOrgId } : undefined,
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
        communityOrgId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return jobs;
  } catch (error) {
    logger.error("[getAllJobs] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch jobs. Please try again.",
    });
  }
}

async function getPendingJobRequests(
  communityOrgId: string | null,
  prisma: PrismaClient,
) {
  try {
    const jobs = await prisma.jobs.findMany({
      where: {
        status: JobStatus.PENDING,
        ...(communityOrgId && { communityOrgId }),
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
        unread: true,
        createdAt: true,
        updatedAt: true,
        communityOrgId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return jobs;
  } catch (error) {
    logger.error("[getPendingJobRequests] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch pending job requests. Please try again.",
    });
  }
}

async function approveJobRequest(
  input: ApproveJobRequestInput,
  prisma: PrismaClient,
) {
  try {
    const existing = await prisma.jobs.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }

    return await prisma.jobs.update({
      where: { id: input.id },
      data: { status: JobStatus.ACTIVE },
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[approveJobRequest] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to approve job request. Please try again.",
    });
  }
}

async function denyJobRequest(
  input: DenyJobRequestInput,
  prisma: PrismaClient,
) {
  try {
    const existing = await prisma.jobs.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }

    await prisma.jobs.delete({
      where: { id: input.id },
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[denyJobRequest] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to deny job request. Please try again.",
    });
  }
}

async function bulkApproveJobRequests(
  input: BulkApproveJobRequestsInput,
  prisma: PrismaClient,
) {
  try {
    await prisma.jobs.updateMany({
      where: {
        id: { in: input.ids },
      },
      data: { status: JobStatus.ACTIVE },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[bulkApproveJobRequests] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to approve job requests. Please try again.",
    });
  }
}

async function bulkDenyJobRequests(
  input: BulkDenyJobRequestsInput,
  prisma: PrismaClient,
) {
  try {
    await prisma.jobs.deleteMany({
      where: {
        id: { in: input.ids },
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[bulkDenyJobRequests] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to deny job requests. Please try again.",
    });
  }
}

async function markJobRequestsAsRead(
  input: MarkJobRequestsAsReadInput,
  prisma: PrismaClient,
) {
  try {
    await prisma.jobs.updateMany({
      where: {
        id: { in: input.ids },
      },
      data: { unread: false },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[markJobRequestsAsRead] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark job requests as read. Please try again.",
    });
  }
}

export const jobsRouter = router({
  addJob: publicProcedure
    .input(addJobInput)
    .mutation(({ input, ctx }) => addJob(input, ctx.prisma)),

  addJobAsAdmin: protectedProcedure
    .input(addJobInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
      return addJob(input, ctx.prisma, communityOrgId);
    }),

  getAllJobs: protectedProcedure.query(async ({ ctx }) => {
    await requireCommunityOrgAdmin(ctx.auth.userId!);
    const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
    return getAllJobs(communityOrgId, ctx.prisma);
  }),
  getPendingJobRequests: protectedProcedure.query(async ({ ctx }) => {
    await requireCommunityOrgAdmin(ctx.auth.userId!);
    const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
    return getPendingJobRequests(communityOrgId, ctx.prisma);
  }),
  removeJob: protectedProcedure
    .input(removeJobInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return removeJob(input, ctx.prisma);
    }),
  updateJob: protectedProcedure
    .input(updateJobInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return updateJob(input, ctx.prisma);
    }),
  approveJobRequest: protectedProcedure
    .input(approveJobRequestInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return approveJobRequest(input, ctx.prisma);
    }),
  denyJobRequest: protectedProcedure
    .input(denyJobRequestInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return denyJobRequest(input, ctx.prisma);
    }),
  bulkApproveJobRequests: protectedProcedure
    .input(bulkApproveJobRequestsInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return bulkApproveJobRequests(input, ctx.prisma);
    }),
  bulkDenyJobRequests: protectedProcedure
    .input(bulkDenyJobRequestsInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return bulkDenyJobRequests(input, ctx.prisma);
    }),
  markJobRequestsAsRead: protectedProcedure
    .input(markJobRequestsAsReadInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return markJobRequestsAsRead(input, ctx.prisma);
    }),
});
