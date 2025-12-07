import { router } from "../trpc";
import { communityRouter } from "./community";
import { helloRouter } from "./hello";
import { jobsRouter } from "./jobs";
import { socialServicesRouter } from "./social-services";
import { userRouter } from "./user";
import { videosRouter } from "./videos";

export const appRouter = router({
  community: communityRouter,
  hello: helloRouter,
  jobs: jobsRouter,
  socialServices: socialServicesRouter,
  user: userRouter,
  videos: videosRouter,
});

export type AppRouter = typeof appRouter;
