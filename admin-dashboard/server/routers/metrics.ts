import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { requireJilaAdmin } from "../utils";
import prisma from "@/lib/prisma";

export const metricsRouter = router({
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    await requireJilaAdmin(ctx.auth.userId!);

    try {
      const [usersCount, videosCount, jobsCount, socialServicesCount] =
        await Promise.all([
          prisma.appUser.count(),
          prisma.videos.count(),
          prisma.jobs.count(),
          prisma.socialServices.count(),
        ]);

      return {
        users: usersCount,
        videos: videosCount,
        jobs: jobsCount,
        socialServices: socialServicesCount,
      };
    } catch (error) {
      console.error("[getMetrics] Database error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch metrics. Please try again.",
      });
    }
  }),
});
