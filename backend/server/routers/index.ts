import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
});

export type AppRouter = typeof appRouter;
