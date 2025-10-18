import { router } from "../trpc";
import { helloRouter } from "./hello";
import { videosRouter } from "./videos";
import { invitationsRouter } from "./invitations";

export const appRouter = router({
  hello: helloRouter,
  videos: videosRouter,
  invitations: invitationsRouter,
});

export type AppRouter = typeof appRouter;
