import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";
import { usersRouter } from "./users";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
