import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { logger } from "@/lib/logger";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const userRouter = router({
  finalizeSignUp: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User must be signed in to finalize sign up.",
      });
    }

    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      const existingUserType = user.publicMetadata?.userType;
      if (
        existingUserType === "JilaAdmin" ||
        existingUserType === "CommunityOrgAdmin"
      ) {
        return { success: true };
      }

      const communityOrgId = user.publicMetadata?.communityOrgId as
        | string
        | undefined;
      const userType = communityOrgId ? "CommunityOrgAdmin" : "JilaAdmin";

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          userType,
          ...(communityOrgId && { communityOrgId }),
        },
      });
      return { success: true };
    } catch (error) {
      logger.error("[finalizeSignUp] Failed to set user metadata", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to finalize account setup.",
      });
    }
  }),

  getTTSPreference: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User must be signed in.",
      });
    }

    try {
      const appUser = await prisma.appUser.findUnique({
        where: { clerkId: userId },
        select: { ttsEnabled: true },
      });

      if (!appUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      return { ttsEnabled: appUser.ttsEnabled };
    } catch (error) {
      logger.error("[getTTSPreference] Failed to get TTS preference", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get TTS preference.",
      });
    }
  }),

  updateTTSPreference: protectedProcedure
    .input(z.object({ ttsEnabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be signed in.",
        });
      }

      try {
        const updatedUser = await prisma.appUser.update({
          where: { clerkId: userId },
          data: { ttsEnabled: input.ttsEnabled },
          select: { ttsEnabled: true },
        });

        return { ttsEnabled: updatedUser.ttsEnabled };
      } catch (error) {
        logger.error(
          "[updateTTSPreference] Failed to update TTS preference",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update TTS preference.",
        });
      }
    }),
});
