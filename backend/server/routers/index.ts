import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";
import { socialServicesRouter } from "./social-services";
import { userRouter } from "./user";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
  socialServices: socialServicesRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
