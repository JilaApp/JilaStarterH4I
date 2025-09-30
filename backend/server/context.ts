import { inferAsyncReturnType } from "@trpc/server";
import prisma from "@/lib/prisma";

export const createContext = async () => {
  return {
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
