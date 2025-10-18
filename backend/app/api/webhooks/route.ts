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
      console.log(`Public Metadata:`, data.public_metadata);
      console.log(`Unsafe Metadata:`, data.unsafe_metadata);
      console.log(`======================================\n`);

      const isAdmin = data.public_metadata?.invitation_accepted === true;
      console.log(`Is Admin: ${isAdmin}`);

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

        // Set userType in Clerk metadata
        const client = await clerkClient(); // Correctly get the client instance
        await client.users.updateUserMetadata(data.id, {
          publicMetadata: { userType: "admin" },
        });

        console.log(`Set userType=admin for ${data.id}`);

        await prisma.adminUser.create({
          data: {
            clerkId: data.id,
            email: email,
            communityOrg: "Default Org",
          },
        });

        console.log(`Admin user created in database: ${email}`);
      } else {
        const username = data.username;

        if (!username) {
          console.error("App user created without username");
          return NextResponse.json(
            { error: "Username required for app user" },
            { status: 400 },
          );
        }

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

        // Set userType in Clerk metadata
        const client = await clerkClient(); // Correctly get the client instance
        await client.users.updateUserMetadata(data.id, {
          publicMetadata: { userType: "app_user" },
        });

        console.log(`Set userType=app_user for ${data.id}`);

        await prisma.appUser.create({
          data: {
            clerkId: data.id,
            username: username,
            communityOrg: communityOrg,
            language: language,
          },
        });

        console.log(`App user created in database: ${username}`);
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

      // Note: public_metadata is not available in the webhook payload for user.deleted events.
      // We must try to delete from both tables. One will succeed, the other will fail gracefully.
      console.log(`Attempting to delete user: ${data.id}`);

      try {
        await prisma.adminUser.delete({ where: { clerkId: data.id } });
        console.log(`Deleted admin user: ${data.id}`);
      } catch (e) {
        // Suppress error if user not found, as they might be an app_user
      }

      try {
        await prisma.appUser.delete({ where: { clerkId: data.id } });
        console.log(`Deleted app user: ${data.id}`);
      } catch (e) {
        // Suppress error if user not found, as they might have been an admin_user
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
