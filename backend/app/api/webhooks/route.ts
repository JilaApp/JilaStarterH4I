import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id: clerkId, type } = evt;
    const eventType = evt.type;

    console.log(`Received webhook with ID ${clerkId} and event type of ${eventType}`);

    // Handle user creation
    if (eventType === "user.created") {
      const data = evt.data;
      
      // Check if this is an admin (invited user)
      const isAdmin = data.public_metadata?.invitation_accepted === true;
      
      if (isAdmin) {
        // Create Admin User
        const email = data.email_addresses?.[0]?.email_address;
        
        if (!email) {
          console.error("Admin user created without email");
          return NextResponse.json({ error: "Email required for admin" }, { status: 400 });
        }

        // Set userType in Clerk metadata
        await clerkClient.users.updateUserMetadata(data.id, {
          publicMetadata: { userType: "admin" }
        });

        // Create in database
        await prisma.adminUser.create({
          data: {
            clerkId: data.id,
            email: email,
            communityOrg: "Default Org", // Will be updated by admin later
          },
        });

        console.log(`Admin user created: ${email}`);
      } else {
        // Create App User (mobile user)
        const username = data.username;
        
        if (!username) {
          console.error("App user created without username");
          return NextResponse.json({ error: "Username required for app user" }, { status: 400 });
        }

        // Get community org and language from unsafe metadata (set during signup)
        const communityOrg = data.unsafe_metadata?.communityOrg as string;
        const language = data.unsafe_metadata?.language as string;

        if (!communityOrg || !language) {
          console.error("App user missing required fields");
          return NextResponse.json({ error: "Community org and language required" }, { status: 400 });
        }

        // Set userType in Clerk metadata
        await clerkClient.users.updateUserMetadata(data.id, {
          publicMetadata: { userType: "app_user" }
        });

        // Create in database
        await prisma.appUser.create({
          data: {
            clerkId: data.id,
            username: username,
            communityOrg: communityOrg,
            language: language,
          },
        });

        console.log(`App user created: ${username}`);
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
      const userType = data.public_metadata?.userType;

      if (userType === "admin") {
        await prisma.adminUser.delete({
          where: { clerkId: data.id },
        });
      } else if (userType === "app_user") {
        await prisma.appUser.delete({
          where: { clerkId: data.id },
        });
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ error: "Error processing webhook" }, { status: 400 });
  }
}