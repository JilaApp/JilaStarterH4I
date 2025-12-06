import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { logger } from "@/lib/logger";

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
});
