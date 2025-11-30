import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SocialServiceCategory } from "@/lib/types";
import { logger } from "@/lib/logger";

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

async function addSocialService(input: AddSocialServiceInput) {
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

    await prisma.socialServices.create({
      data: {
        title: input.title,
        category: input.category,
        phone_number: input.phone_number,
        address: input.address,
        description: input.description,
        url: input.url,
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

    const removing_undefined_vals = {
      title: input.title,
      category: input.category,
      phone_number: input.phone_number,
      address: input.address,
      description: input.description,
      url: input.url,
    };

    const data = Object.fromEntries(
      Object.entries(removing_undefined_vals).filter(
        ([_, value]) => value !== undefined,
      ),
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

async function getAllSocialServices() {
  try {
    const services = await prisma.socialServices.findMany();
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
  addSocialService: publicProcedure
    .input(addSocialServiceInput)
    .mutation(({ input }) => addSocialService(input)),
  getAllSocialServices: publicProcedure.query(getAllSocialServices),
  removeSocialService: publicProcedure
    .input(removeSocialServiceInput)
    .mutation(({ input }) => removeSocialService(input)),
  editSocialService: publicProcedure
    .input(editSocialServiceInput)
    .mutation(({ input }) => editSocialService(input)),
});
