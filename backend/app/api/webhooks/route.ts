import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    console.log(`\n========== WEBHOOK RECEIVED ==========`);
    console.log(`Event Type: ${eventType}`);

    // Handle user creation
    if (eventType === "user.created") {
      const data = evt.data;

      console.log(`User ID: ${data.id}`);
      console.log(`Email addresses:`, JSON.stringify(data.email_addresses));
      console.log(`Username:`, data.username);
      console.log(`Public Metadata:`, JSON.stringify(data.public_metadata));
      console.log(`Unsafe Metadata:`, JSON.stringify(data.unsafe_metadata));

      // SECURE LOGIC:
      // - Admin users: Invited via Clerk dashboard → have email, username is NULL
      // - App users: Sign up via mobile → have username, no email
      const hasEmail = data.email_addresses && data.email_addresses.length > 0;
      const hasUsername = data.username !== null && data.username !== undefined;

      // Admin = has email AND no username (invited users)
      const isAdmin = hasEmail && !hasUsername;

      console.log(`Has Email: ${hasEmail}`);
      console.log(`Has Username: ${hasUsername}`);
      console.log(`Is Admin: ${isAdmin}`);
      console.log(`======================================\n`);

      if (isAdmin) {
        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
          console.error("Admin user created without email");
          return NextResponse.json(
            { error: "Email required for admin" },
            { status: 400 },
          );
        }

        console.log(`Creating admin user for: ${email}`);

        try {
          // Set userType in Clerk metadata
          const client = await clerkClient();
          await client.users.updateUserMetadata(data.id, {
            publicMetadata: { userType: "admin" },
          });

          console.log(`Set userType=admin for ${data.id}`);

          // Create admin user in database
          await prisma.adminUser.create({
            data: {
              clerkId: data.id,
              email: email,
              communityOrg: "Default Org",
            },
          });

          console.log(`Admin user created in database: ${email}`);
        } catch (error) {
          console.error(`Error creating admin user:`, error);
          throw error;
        }
      } else if (hasUsername) {
        // This is an app user (regular signup from mobile)
        const username = data.username;

        console.log(`Creating app user for: ${username}`);

        const communityOrg = data.unsafe_metadata?.communityOrg as string;
        const language = data.unsafe_metadata?.language as string;
        console.log(`Community Org: ${communityOrg}, Language: ${language}`);

        if (!communityOrg || !language) {
          console.error("App user missing required fields");
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

          console.log(`Set userType=app_user for ${data.id}`);

          // Create app user in database
          await prisma.appUser.create({
            data: {
              clerkId: data.id,
              username: username,
              communityOrg: communityOrg,
              language: language,
            },
          });

          console.log(`App user created in database: ${username}`);
        } catch (error) {
          console.error(`Error creating app user:`, error);
          throw error;
        }
      } else {
        // Edge case: user has neither email nor username
        console.error("User created with neither email nor username", data.id);
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

      console.log(`User updated: ${data.id}, userType: ${userType}`);

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

      console.log(`Attempting to delete user: ${data.id}`);

      try {
        await prisma.adminUser.delete({ where: { clerkId: data.id } });
        console.log(`Deleted admin user: ${data.id}`);
      } catch (e) {
        // Suppress error if user not found
      }

      try {
        await prisma.appUser.delete({ where: { clerkId: data.id } });
        console.log(`Deleted app user: ${data.id}`);
      } catch (e) {
        // Suppress error if user not found
      }
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 400 },
    );
  }
}
