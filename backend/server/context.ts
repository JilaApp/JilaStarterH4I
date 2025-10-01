import { inferAsyncReturnType } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const createContext = async () => {
  return {
    prisma,
    auth: await auth(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
