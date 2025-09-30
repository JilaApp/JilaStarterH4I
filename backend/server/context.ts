import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const createContext = async (opts: CreateNextContextOptions) => {
  return {
    prisma,
    auth: auth(),
    req: opts.req,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
