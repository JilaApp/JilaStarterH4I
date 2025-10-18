"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InviteSignUpPage() {
  // Clerk hooks
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Component state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State to prevent running the invitation check multiple times
  const [invitationChecked, setInvitationChecked] = useState(false);

  // This useEffect now correctly processes the invitation ticket
  useEffect(() => {
    // Ensure all dependencies are loaded before proceeding
    if (!isLoaded || !signUp || invitationChecked) {
      return;
    }

    // This async function handles the creation of the sign-up from the ticket
    const processInvitation = async () => {
      try {
        // This is the key step: create the sign-up using the ticket strategy.
        // Clerk automatically finds the __clerk_ticket from the URL.
        await signUp.create({
          strategy: "ticket",
        });

        // After creation, the signUp object is now populated with the invitation data
        if (signUp.emailAddress) {
          setEmail(signUp.emailAddress);
        } else {
          setError("Invitation is invalid or has expired. No email found.");
        }
      } catch (err: any) {
        console.error("Error processing invitation ticket:", err);
        setError(
          err.errors?.[0]?.longMessage ||
            "This invitation is invalid or has expired.",
        );
      } finally {
        // Mark the check as complete to prevent re-running
        setInvitationChecked(true);
      }
    };

    // Only run the process if the sign-up status indicates no process has started
    if (signUp.status === "missing_requirements") {
      processInvitation();
    } else if (signUp.emailAddress) {
      // If the page reloads and a signUp is already active, just set the email
      setEmail(signUp.emailAddress);
      setInvitationChecked(true);
    }
  }, [isLoaded, signUp, invitationChecked]);

  // This handleSubmit now uses the correct flow for completing the sign-up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      setError("Sign up is not loaded yet");
      return;
    }

    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setIsLoading(true);

    try {
      // The invitation flow only requires updating the sign-up with the password.
      const result = await signUp.update({
        password,
      });

      console.log("Sign up update result:", result);

      // Check if the sign-up is complete
      if (result.status === "complete") {
        // If complete, set the session as active and redirect
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        // This case should ideally not be hit in a normal flow
        console.error("Sign up status is not complete:", result);
        setError("Could not complete sign up. Please try again.");
      }
    } catch (err: any) {
      console.error("Error completing sign up:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.longMessage || "An error occurred during sign up.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ... your JSX remains the same, but the email field will now be populated
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-300 p-4">
      <DisplayBox>
        <div className="flex flex-col gap-y-8">
          <div>
            <h1 className="page-title-text text-jila-400 mb-2">
              Complete Your Registration
            </h1>
            <p className="body1-desktop-text text-type-400">
              You&apos;ve been invited to join. Create your password to get
              started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
            <div>
              <label className="components-text text-type-400 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                id="email-input"
                // The value will now be correctly set from the state
                value={email}
                disabled
                placeholder="Loading email..."
              />
            </div>

            {/* ... rest of your form ... */}
            <div>
              <label className="components-text text-type-400 mb-2 block">
                Password
              </label>
              <Input
                type="password"
                id="password-input"
                placeholder="Create a password"
                icon="lock"
                showPasswordToggle
                value={password}
                onChange={setPassword}
              />
            </div>

            <div>
              <label className="components-text text-type-400 mb-2 block">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirm-password-input"
                placeholder="Confirm your password"
                icon="lock"
                showPasswordToggle
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-error-200 p-4 text-error-400">
                {error}
              </div>
            )}

            <Button
              text={isLoading ? "Creating Account..." : "Create Account"}
              type="submit" // Ensure button type is submit for form
              defaultClassName="w-full"
            />
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}
