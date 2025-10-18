import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

const sendInvitationInput = z.object({
  email: z.string().email(),
});

type SendInvitationInput = z.infer<typeof sendInvitationInput>;

async function sendInvitation(input: SendInvitationInput) {
  try {
    const client = await clerkClient();
    
    // Create invitation through Clerk
    const invitation = await client.invitations.createInvitation({
      emailAddress: input.email,
      redirectUrl: `${process.env.JILA_BACKEND_BASE_URL || "http://localhost:3000"}/invite-signup`,
      publicMetadata: {
        role: "ADMIN",
      },
    });

    return {
      success: true,
      invitationId: invitation.id,
      status: invitation.status,
    };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Failed to send invitation",
    });
  }
}

export const invitationsRouter = router({
  sendInvitation: publicProcedure
    .input(sendInvitationInput)
    .mutation(({ input }) => sendInvitation(input)),
});