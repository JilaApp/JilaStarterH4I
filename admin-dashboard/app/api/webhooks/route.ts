import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    // Handle user creation
    if (eventType === "user.created") {
      const data = evt.data;

      const hasEmail = data.email_addresses && data.email_addresses.length > 0;
      const hasUsername = data.username !== null && data.username !== undefined;

      // Admin = has email AND no username (invited users)
      const isAdmin = hasEmail && !hasUsername;

      if (isAdmin) {
        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
          return NextResponse.json(
            { error: "Email required for admin" },
            { status: 400 },
          );
        }

        try {
          // Set userType in Clerk metadata
          const client = await clerkClient();
          await client.users.updateUserMetadata(data.id, {
            publicMetadata: { userType: "admin" },
          });

          // Create admin user in database
          await prisma.adminUser.create({
            data: {
              clerkId: data.id,
              email: email,
              communityOrg: "Default Org",
            },
          });
        } catch (error) {
          logger.error("[POST] Failed to create admin user", error);
          throw error;
        }
      } else if (hasUsername) {
        // This is an app user (regular signup from mobile)
        const username = data.username;

        const communityOrg = data.unsafe_metadata?.communityOrg as string;
        const language = data.unsafe_metadata?.language as string;

        if (!communityOrg || !language) {
          return NextResponse.json(
            { error: "Community org and language required" },
            { status: 400 },
          );
        }

        try {
          // Set userType in Clerk metadata
          const client = await clerkClient();
          await client.users.updateUserMetadata(data.id, {
            publicMetadata: { userType: "app_user" },
          });

          // Create app user in database
          await prisma.appUser.create({
            data: {
              clerkId: data.id,
              username: username!,
              communityOrg: communityOrg,
              language: language,
            },
          });
        } catch (error) {
          logger.error("[POST] Failed to create app user", error);
          throw error;
        }
      } else {
        // Edge case: user has neither email nor username
        return NextResponse.json(
          { error: "Invalid user data" },
          { status: 400 },
        );
      }
    }

    // Handle user updates
    if (eventType === "user.updated") {
      const data = evt.data;
      const userType = data.public_metadata?.userType;

      if (userType === "admin") {
        await prisma.adminUser.update({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses?.[0]?.email_address || "",
            updatedAt: new Date(),
          },
        });
      } else if (userType === "app_user") {
        await prisma.appUser.update({
          where: { clerkId: data.id },
          data: {
            username: data.username || "",
            updatedAt: new Date(),
          },
        });
      }
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      const data = evt.data;

      try {
        await prisma.adminUser.delete({ where: { clerkId: data.id } });
      } catch (e) {
        // Suppress error if user not found
      }

      try {
        await prisma.appUser.delete({ where: { clerkId: data.id } });
      } catch (e) {
        // Suppress error if user not found
      }
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 400 },
    );
  }
}
