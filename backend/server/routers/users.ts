import { router, protectedProcedure } from "../trpc";
import prisma from "../../lib/prisma";

async function getAllAdminUsers() {
  const adminUsers = await prisma.adminUser.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return adminUsers;
}

async function getAllAppUsers() {
  const appUsers = await prisma.appUser.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return appUsers;
}

export const usersRouter = router({
  getAllAdminUsers: protectedProcedure.query(getAllAdminUsers),
  getAllAppUsers: protectedProcedure.query(getAllAppUsers),
});