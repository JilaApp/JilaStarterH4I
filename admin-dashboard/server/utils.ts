import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

export const getUserCommunityOrgId = async (
  userId: string,
): Promise<string | null> => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.communityOrgId as string) || null;
};

export const requireCommunityOrgAdmin = async (userId: string) => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata?.userType !== "CommunityOrgAdmin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only Community Org Admins can perform this action",
    });
  }
};

export const requireJilaAdmin = async (userId: string) => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata?.userType !== "JilaAdmin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only Jila Admins can perform this action",
    });
  }
};

export const getInvitationRedirectUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    `http://localhost:${process.env.PORT || 3000}`;
  return `${baseUrl}/sign-up`;
};
