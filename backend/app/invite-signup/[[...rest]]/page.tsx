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
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (!isLoaded) return;

    // Debug: Log all available information
    const ticket = searchParams.get("__clerk_ticket");
    const allParams = Object.fromEntries(searchParams.entries());

    const debug = {
      ticket,
      allParams,
      signUpStatus: signUp?.status,
      signUpEmail: signUp?.emailAddress,
      signUpData: signUp
        ? {
            id: signUp.id,
            status: signUp.status,
            emailAddress: signUp.emailAddress,
            firstName: signUp.firstName,
            lastName: signUp.lastName,
          }
        : null,
    };

    setDebugInfo(debug);
    console.log("Debug Info:", debug);

    if (signUp?.emailAddress) {
      setEmail(signUp.emailAddress);
    }
  }, [isLoaded, searchParams, signUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      setError("Sign up is not loaded yet");
      return;
    }

    setError("");

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to create sign up with password...");
      console.log("Current signUp status:", signUp.status);

      // For invitation flow, we need to update the existing sign up
      const result = await signUp.update({
        password,
      });

      console.log("Update result:", result);

      // Try to complete the sign up
      const completeResult = await signUp.attemptEmailAddressVerification({
        code: "invitation", // Special code for invitations
      });

      console.log("Complete result:", completeResult);

      if (completeResult.status === "complete") {
        await setActive({ session: completeResult.createdSessionId });
        router.push("/");
      } else {
        console.error("Sign up not complete:", completeResult);
        setError(
          `Sign up status: ${completeResult.status}. Please contact support.`,
        );
      }
    } catch (err: any) {
      console.error("Error completing sign up:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].longMessage || err.errors[0].message);
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-300">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-300 p-4">
      <DisplayBox>
        <div className="flex flex-col gap-y-8">
          <div>
            <h1 className="page-title-text text-jila-400 mb-2">
              Complete Your Registration
            </h1>
            <p className="body1-desktop-text text-type-400">
              You&apos;ve been invited to join. Create your password to get started.
            </p>
          </div>

          {/* Debug Information - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-lg bg-gray-200 p-4 text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <pre className="overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
            <div>
              <label className="components-text text-type-400 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                id="email-input"
                value={email || "No email found"}
                disabled
                placeholder="Your email"
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
              onClick={() => {}}
              defaultClassName="w-full"
            />
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}
