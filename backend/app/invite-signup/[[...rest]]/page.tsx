"use client";

import { useEffect, useState } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InviteSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForWebhook, setIsWaitingForWebhook] = useState(false);

  const [emailApproved, setEmailApproved] = useState(false);

  // New state to prevent re-running the ticket creation
  const [isTicketProcessed, setIsTicketProcessed] = useState(false);

  // Check if webhook has completed by polling user metadata
  useEffect(() => {
    if (isWaitingForWebhook && user) {
      const checkMetadata = setInterval(() => {
        const userType = user.publicMetadata?.userType;
        console.log("Checking metadata:", userType);

        if (userType === "admin") {
          clearInterval(checkMetadata);
          router.push("/dashboard");
        }
      }, 500); // Check every 500ms

      // Timeout after 30 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkMetadata);
        if (!user.publicMetadata?.userType) {
          setError(
            "Account setup is taking longer than expected. Please refresh the page."
          );
          setIsWaitingForWebhook(false);
        }
      }, 30000);

      return () => {
        clearInterval(checkMetadata);
        clearTimeout(timeout);
      };
    }
  }, [isWaitingForWebhook, user, router]);

  useEffect(() => {
    if (!isLoaded || isTicketProcessed) {
      return;
    }

    const ticket = searchParams.get("__clerk_ticket");

    if (!ticket) {
      setError(
        "Invitation ticket is missing. Please use the link provided in your email."
      );
      return;
    }

    const createSignUpFromTicket = async () => {
      try {
        const createdSignUp = await signUp.create({
          strategy: "ticket",
          ticket: ticket,
        });

        if (
          createdSignUp.status === "missing_requirements" &&
          createdSignUp.emailAddress
        ) {
          setEmail(createdSignUp.emailAddress);
        }
      } catch (err: any) {
        console.error(
          "Error processing invitation ticket:",
          JSON.stringify(err, null, 2)
        );
        setError(
          err.errors?.[0]?.longMessage ||
            "This invitation is invalid or has expired."
        );
      } finally {
        setIsTicketProcessed(true);
      }
    };

    createSignUpFromTicket();
  }, [isLoaded, searchParams, signUp, isTicketProcessed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      return setError(
        "The sign-up component is not ready. Please refresh the page."
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

        // Now wait for webhook to complete
        setIsLoading(false);
        setIsWaitingForWebhook(true);
      } else {
        console.error("Sign up status is not complete:", result);
        setError("Could not complete your sign up. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Error completing sign up:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.longMessage ||
          "An unexpected error occurred during sign up."
      );
      setIsLoading(false);
    }
  };

  if (isWaitingForWebhook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-300 p-4">
        <DisplayBox>
          <div className="flex flex-col gap-y-8 items-center">
            <h1 className="page-title-text text-jila-400 text-center">
              Setting Up Your Account
            </h1>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
              <p className="body1-desktop-text text-type-400 text-center">
                Please wait while we finalize your account...
              </p>
            </div>
          </div>
        </DisplayBox>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-300 p-4">
      <DisplayBox>
        {!emailApproved ? (
          <div className="flex flex-col gap-y-7 justify-center items-center">
            <h1 className="body1-desktop-text text-4xl font-bold">
              Welcome to JILA!
            </h1>
            <p className="body1-desktop-text text-xl text-center font-light">
              We've approved the following email for creating your admin account
            </p>
            <div>
              <Input
                type="email"
                id="email-input"
                value={email}
                disabled
                placeholder="Loading from invitation..."
              />
            </div>
            {error && (
              <div className="rounded-lg bg-error-200 p-4 text-error-400">
                {error}
              </div>
            )}
            <div className="flex flex-col w-full">
              <label className="components-text text-type-400 mb-2 block">
                Have an account?{" "}
                <a href="/sign-in" className="text-jila-400">
                  Sign in
                </a>
              </label>
              <Button
                text="Sign up"
                type="button"
                defaultClassName="w-full"
                disabled={isLoading}
                onClick={() => {
                  setEmailApproved(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-6 items-center justify-center"
            >
              <h1 className="body1-desktop-text text-4xl font-bold">
                Set up your password
              </h1>
              <p className="body1-desktop-text text-xl text-center font-light">
                Create a secure password for your account
              </p>
              <div className="flex flex-col gap-y-2">
                <Input
                  type="password"
                  id="password-input"
                  placeholder="Enter password"
                  icon="lock"
                  showPasswordToggle
                  value={password}
                  onChange={setPassword}
                />

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
              <Button
                text="Sign up"
                type="button"
                defaultClassName="w-full"
                disabled={isLoading}
                onClick={() => {
                  setEmailApproved(true);
                }}
              />
            </form>
          </div>
        )}
      </DisplayBox>
    </div>
  );
}
