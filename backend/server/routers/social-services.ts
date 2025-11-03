import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SocialServiceCategory } from "@prisma/client";

const addSocialServiceInput = z.object({
  title: z.string(),
  category: z.nativeEnum(SocialServiceCategory),
  phone_number: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
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
});

type AddSocialServiceInput = z.infer<typeof addSocialServiceInput>;
type RemoveSocialServiceInput = z.infer<typeof removeSocialServiceInput>;
type EditSocialServiceInput = z.infer<typeof editSocialServiceInput>;

async function addSocialService(input: AddSocialServiceInput) {
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
}

async function removeSocialService(input: RemoveSocialServiceInput) {
  const existing = await prisma.socialServices.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Social Service with id ${input.id} does not exist`,
    });
  }

  await prisma.socialServices.delete({
    where: {
      id: input.id,
    },
  });
}

async function editSocialService(input: EditSocialServiceInput) {
  const existing = await prisma.socialServices.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Social Service with id ${input.id} does not exist`,
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
}

async function getAllSocialServices() {
  const services = await prisma.socialServices.findMany();
  return services;
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
