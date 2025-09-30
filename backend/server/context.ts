import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

const prisma = new PrismaClient();

export const createContext = async (opts?: CreateNextContextOptions) => {
  return {
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
