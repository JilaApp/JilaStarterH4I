import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { requireCommunityOrgAdmin, getUserCommunityOrgId } from "../utils";
import { SocialServiceCategory } from "@/lib/types";
import { logger } from "@/lib/logger";
import { uploadAudioToS3, deleteAudioFromS3 } from "@/lib/s3Utils";
import prisma from "@/lib/prisma";

const addSocialServiceInput = z.object({
  title: z.string(),
  category: z.nativeEnum(SocialServiceCategory),
  phone_number: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  titleAudioFile: z.string().optional(),
  titleAudioFilename: z.string().optional(),
  titleAudioFileSize: z.number().optional(),
  descriptionAudioFile: z.string().optional(),
  descriptionAudioFilename: z.string().optional(),
  descriptionAudioFileSize: z.number().optional(),
});

const removeSocialServiceInput = z.object({
  id: z.number().int(),
});

const editSocialServiceInput = z.object({
  id: z.number().int(),
  title: z.string().optional(),
  category: z.nativeEnum(SocialServiceCategory).optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  titleAudioFile: z.string().optional(),
  titleAudioFilename: z.string().optional(),
  titleAudioFileSize: z.number().optional(),
  descriptionAudioFile: z.string().optional(),
  descriptionAudioFilename: z.string().optional(),
  descriptionAudioFileSize: z.number().optional(),
});

type AddSocialServiceInput = z.infer<typeof addSocialServiceInput>;
type RemoveSocialServiceInput = z.infer<typeof removeSocialServiceInput>;
type EditSocialServiceInput = z.infer<typeof editSocialServiceInput>;

async function addSocialService(
  input: AddSocialServiceInput,
  communityOrgId: string | null,
) {
  try {
    const existing = await prisma.socialServices.findUnique({
      where: { phone_number: input.phone_number },
      select: { id: true },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Social Service with phone number ${input.phone_number} already exists`,
      });
    }

    // Upload audio files to S3 if provided
    let titleAudioS3Key: string | undefined;
    let descriptionAudioS3Key: string | undefined;

    if (input.titleAudioFile && input.titleAudioFilename) {
      titleAudioS3Key = await uploadAudioToS3(
        input.titleAudioFile,
        input.titleAudioFilename,
        "social-services/titles",
      );
    }

    if (input.descriptionAudioFile && input.descriptionAudioFilename) {
      descriptionAudioS3Key = await uploadAudioToS3(
        input.descriptionAudioFile,
        input.descriptionAudioFilename,
        "social-services/descriptions",
      );
    }

    await prisma.socialServices.create({
      data: {
        title: input.title,
        category: input.category,
        phone_number: input.phone_number,
        address: input.address,
        description: input.description,
        url: input.url,
        titleAudioFilename: input.titleAudioFilename,
        titleAudioFileSize: input.titleAudioFileSize,
        titleAudioFileS3Key: titleAudioS3Key,
        descriptionAudioFilename: input.descriptionAudioFilename,
        descriptionAudioFileSize: input.descriptionAudioFileSize,
        descriptionAudioFileS3Key: descriptionAudioS3Key,
        communityOrgId: communityOrgId,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[addSocialService] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add social service. Please try again.",
    });
  }
}

async function removeSocialService(input: RemoveSocialServiceInput) {
  try {
    const existing = await prisma.socialServices.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }

    // Delete audio files from S3 if they exist
    if (existing.titleAudioFileS3Key) {
      await deleteAudioFromS3(existing.titleAudioFileS3Key);
    }
    if (existing.descriptionAudioFileS3Key) {
      await deleteAudioFromS3(existing.descriptionAudioFileS3Key);
    }

    await prisma.socialServices.delete({
      where: {
        id: input.id,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[removeSocialService] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to remove social service. Please try again.",
    });
  }
}

async function editSocialService(input: EditSocialServiceInput) {
  try {
    const existing = await prisma.socialServices.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }

    const dataToUpdate: Record<string, any> = {
      title: input.title,
      category: input.category,
      phone_number: input.phone_number,
      address: input.address,
      description: input.description,
      url: input.url,
    };

    // Handle title audio file
    if (input.titleAudioFile !== undefined) {
      if (input.titleAudioFile === "") {
        // Delete old file from S3
        if (existing.titleAudioFileS3Key) {
          await deleteAudioFromS3(existing.titleAudioFileS3Key);
        }
        dataToUpdate.titleAudioFileS3Key = null;
        dataToUpdate.titleAudioFilename = null;
        dataToUpdate.titleAudioFileSize = null;
      } else {
        // Upload new file to S3
        const s3Key = await uploadAudioToS3(
          input.titleAudioFile,
          input.titleAudioFilename!,
          "social-services/titles",
        );

        // Delete old file from S3
        if (existing.titleAudioFileS3Key) {
          await deleteAudioFromS3(existing.titleAudioFileS3Key);
        }

        dataToUpdate.titleAudioFileS3Key = s3Key;
        dataToUpdate.titleAudioFilename = input.titleAudioFilename;
        dataToUpdate.titleAudioFileSize = input.titleAudioFileSize;
      }
    }

    // Handle description audio file
    if (input.descriptionAudioFile !== undefined) {
      if (input.descriptionAudioFile === "") {
        // Delete old file from S3
        if (existing.descriptionAudioFileS3Key) {
          await deleteAudioFromS3(existing.descriptionAudioFileS3Key);
        }
        dataToUpdate.descriptionAudioFileS3Key = null;
        dataToUpdate.descriptionAudioFilename = null;
        dataToUpdate.descriptionAudioFileSize = null;
      } else {
        // Upload new file to S3
        const s3Key = await uploadAudioToS3(
          input.descriptionAudioFile,
          input.descriptionAudioFilename!,
          "social-services/descriptions",
        );

        // Delete old file from S3
        if (existing.descriptionAudioFileS3Key) {
          await deleteAudioFromS3(existing.descriptionAudioFileS3Key);
        }

        dataToUpdate.descriptionAudioFileS3Key = s3Key;
        dataToUpdate.descriptionAudioFilename = input.descriptionAudioFilename;
        dataToUpdate.descriptionAudioFileSize = input.descriptionAudioFileSize;
      }
    }

    const data = Object.fromEntries(
      Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined),
    );

    await prisma.socialServices.update({
      where: {
        id: input.id,
      },
      data,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("[editSocialService] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to edit social service. Please try again.",
    });
  }
}

async function getAllSocialServices(communityOrgId: string | null) {
  try {
    const services = await prisma.socialServices.findMany({
      where: communityOrgId ? { communityOrgId } : undefined,
    });
    return services;
  } catch (error) {
    logger.error("[getAllSocialServices] Database error", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch social services. Please try again.",
    });
  }
}

export const socialServicesRouter = router({
  addSocialService: protectedProcedure
    .input(addSocialServiceInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
      return addSocialService(input, communityOrgId);
    }),
  getAllSocialServices: protectedProcedure.query(async ({ ctx }) => {
    await requireCommunityOrgAdmin(ctx.auth.userId!);
    const communityOrgId = await getUserCommunityOrgId(ctx.auth.userId!);
    return getAllSocialServices(communityOrgId);
  }),
  removeSocialService: protectedProcedure
    .input(removeSocialServiceInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return removeSocialService(input);
    }),
  editSocialService: protectedProcedure
    .input(editSocialServiceInput)
    .mutation(async ({ input, ctx }) => {
      await requireCommunityOrgAdmin(ctx.auth.userId!);
      return editSocialService(input);
    }),
});
