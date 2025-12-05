import { router, publicProcedure } from "../trpc";

export const helloRouter = router({
  greet: publicProcedure.query(() => {
    return "Hello Jila!";
  }),
});
