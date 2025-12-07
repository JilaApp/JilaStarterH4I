import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import {
  requireCommunityOrgAdmin,
  requireJilaAdmin,
  getInvitationRedirectUrl,
} from "../utils";
import prisma from "@/lib/prisma";

export const communityRouter = router({
  getMyCommunityOrg: protectedProcedure.query(async ({ ctx }) => {
    await requireCommunityOrgAdmin(ctx.auth.userId!);

    const client = await clerkClient();
    const user = await client.users.getUser(ctx.auth.userId!);
    const communityOrgId = user.publicMetadata?.communityOrgId as
      | string
      | undefined;

    if (!communityOrgId) {
      return null;
    }

    const communityOrg = await prisma.communityOrg.findUnique({
      where: { id: communityOrgId },
    });
    return communityOrg;
  }),

  getAllCommunityOrgs: publicProcedure.query(async () => {
    const communityOrgs = await prisma.communityOrg.findMany({
      orderBy: { name: "asc" },
      include: {
        videos: true,
      },
    });
    return communityOrgs;
  }),

  createCommunityOrg: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      const communityOrg = await prisma.communityOrg.create({
        data: { name: input.name },
      });
      return communityOrg;
    }),

  sendInvitation: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        communityOrgId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      try {
        const client = await clerkClient();
        const invitation = await client.invitations.createInvitation({
          emailAddress: input.email,
          publicMetadata: {
            communityOrgId: input.communityOrgId,
          },
          redirectUrl: getInvitationRedirectUrl(),
          ignoreExisting: true,
        });

        return invitation;
      } catch (error: any) {
        console.error("Clerk invitation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invitation. Please try again.",
        });
      }
    }),

  sendInvitationWithNewCommunity: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        communityName: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      const communityOrg = await prisma.communityOrg.create({
        data: { name: input.communityName },
      });

      try {
        const client = await clerkClient();
        const invitation = await client.invitations.createInvitation({
          emailAddress: input.email,
          publicMetadata: {
            communityOrgId: communityOrg.id,
          },
          redirectUrl: getInvitationRedirectUrl(),
          ignoreExisting: true,
        });

        return { invitation, communityOrg };
      } catch (error: any) {
        console.error("Clerk invitation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invitation. Please try again.",
        });
      }
    }),
});
