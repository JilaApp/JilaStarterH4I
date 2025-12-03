import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";
import { socialServicesRouter } from "./social-services";
import { userRouter } from "./user";
import { jobsRouter } from "./jobs";
import audio from "./audio";
import audioUpload from "./audioUpload";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
  socialServices: socialServicesRouter,
  user: userRouter,
  jobs: jobsRouter,
});

export type AppRouter = typeof appRouter;
