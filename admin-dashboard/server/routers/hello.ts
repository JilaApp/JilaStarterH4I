import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const helloRouter = router({
  greet: publicProcedure.query(() => {
    return "Hello Jila!";
  }),
});
