"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InviteSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New state to prevent re-running the ticket creation
  const [isTicketProcessed, setIsTicketProcessed] = useState(false);

  useEffect(() => {
    if (!isLoaded || isTicketProcessed) {
      return;
    }

    const ticket = searchParams.get("__clerk_ticket");

    if (!ticket) {
      setError(
        "Invitation ticket is missing. Please use the link provided in your email.",
      );
      return;
    }

    const createSignUpFromTicket = async () => {
      try {
        const createdSignUp = await signUp.create({
          strategy: "ticket",
          ticket: ticket,
        });

        // If sign up is successful and has an email, set it
        if (
          createdSignUp.status === "missing_requirements" &&
          createdSignUp.emailAddress
        ) {
          setEmail(createdSignUp.emailAddress);
        }
      } catch (err: any) {
        console.error(
          "Error processing invitation ticket:",
          JSON.stringify(err, null, 2),
        );
        setError(
          err.errors?.[0]?.longMessage ||
            "This invitation is invalid or has expired.",
        );
      } finally {
        // Mark the ticket as processed regardless of outcome to prevent re-running
        setIsTicketProcessed(true);
      }
    };

    createSignUpFromTicket();
  }, [isLoaded, searchParams, signUp, isTicketProcessed]); // Dependencies are now safer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      return setError(
        "The sign-up component is not ready. Please refresh the page.",
      );
    }

    setError("");
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    setIsLoading(true);

    try {
      const result = await signUp.update({
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign up status is not complete:", result);
        setError("Could not complete your sign up. Please try again.");
      }
    } catch (err: any) {
      console.error("Error completing sign up:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.longMessage ||
          "An unexpected error occurred during sign up.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
                value={email}
                disabled
                placeholder="Loading from invitation..."
              />
            </div>

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
              type="submit"
              defaultClassName="w-full"
              disabled={isLoading || !email}
            />
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}
