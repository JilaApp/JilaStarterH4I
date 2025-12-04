import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

// Helper to check if user is a JilaAdmin
const requireJilaAdmin = async (userId: string) => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata?.userType !== "JilaAdmin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only Jila Admins can perform this action",
    });
  }
};

export const communityRouter = router({
  // Get all community orgs
  getAllCommunityOrgs: protectedProcedure.query(async () => {
    const communityOrgs = await prisma.communityOrg.findMany({
      orderBy: { name: "asc" },
    });
    return communityOrgs;
  }),

  // Create a new community org (JilaAdmin only)
  createCommunityOrg: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      const communityOrg = await prisma.communityOrg.create({
        data: { name: input.name },
      });
      return communityOrg;
    }),

  // Send invitation to a community org admin (JilaAdmin only)
  sendInvitation: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        communityOrgId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      const client = await clerkClient();

      // Create invitation with community org metadata
      const invitation = await client.invitations.createInvitation({
        emailAddress: input.email,
        publicMetadata: {
          communityOrgId: input.communityOrgId,
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard"}`,
      });

      return invitation;
    }),

  // Send invitation with a new community org (JilaAdmin only)
  sendInvitationWithNewCommunity: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        communityName: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireJilaAdmin(ctx.auth.userId!);

      // Create the community org first
      const communityOrg = await prisma.communityOrg.create({
        data: { name: input.communityName },
      });

      const client = await clerkClient();

      // Create invitation with community org metadata
      const invitation = await client.invitations.createInvitation({
        emailAddress: input.email,
        publicMetadata: {
          communityOrgId: communityOrg.id,
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard"}`,
      });

      return { invitation, communityOrg };
    }),
});
