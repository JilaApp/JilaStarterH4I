import { protectedProcedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

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
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          userType: "admin",
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to set user metadata:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to finalize account setup.",
      });
    }
  }),
});
