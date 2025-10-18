"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendInvitation = trpc.invitations.sendInvitation.useMutation({
    onSuccess: () => {
      setSuccessMessage(`Invitation sent successfully to ${email}!`);
      setErrorMessage("");
      setEmail("");
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage("");
    },
  });

  const handleSendInvitation = () => {
    if (!email) {
      setErrorMessage("Please enter an email address");
      return;
    }
    sendInvitation.mutate({ email });
  };

  return (
    <div className="min-h-screen bg-cream-300 flex items-center justify-center p-8">
      <DisplayBox>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="page-title-text text-jila-400 mb-4">
              Send Invitation
            </h1>
            <p className="body1-desktop-text text-type-400">
              Invite someone to join as an admin
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              type="email"
              id="invitation-email"
              placeholder="Enter email address"
              icon="mail"
              value={email}
              onChange={setEmail}
            />

            {errorMessage && (
              <div className="text-error-400 body1-desktop-text">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-green-400 body1-desktop-text">
                {successMessage}
              </div>
            )}

            <Button
              text={sendInvitation.isPending ? "Sending..." : "Send Invitation"}
              onClick={handleSendInvitation}
              defaultClassName="w-full"
            />
          </div>
        </div>
      </DisplayBox>
    </div>
  );
}