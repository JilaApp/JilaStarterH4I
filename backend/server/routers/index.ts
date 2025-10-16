import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";
import { socialServicesRouter } from "./social-services";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
  social_services: socialServicesRouter
});

export type AppRouter = typeof appRouter;
