"use client";

import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InviteSignUpPage() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invitationToken, setInvitationToken] = useState("");

  useEffect(() => {
    // Get invitation token from URL
    const token = searchParams.get("__clerk_ticket");
    if (token) {
      setInvitationToken(token);
    }

    // Get email from invitation if available
    const invitationEmail = searchParams.get("__clerk_email");
    if (invitationEmail) {
      setEmail(decodeURIComponent(invitationEmail));
    }
  }, [searchParams]);

  const handleSignUp = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!signUp) {
        throw new Error("Sign up not initialized");
      }

      // Create the sign up with invitation ticket
      await signUp.create({
        strategy: "ticket",
        ticket: invitationToken,
        password: password,
      });

      // Set the session active
      if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setErrorMessage(err.errors?.[0]?.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-300 flex items-center justify-center p-8">
      <DisplayBox>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="page-title-text text-jila-400 mb-4">
              Welcome to Jila
            </h1>
            <p className="body1-desktop-text text-type-400">
              Complete your account setup
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px] border-gray-300 bg-gray-200">
              <div className="mr-[8px]">
                <Mail color="var(--color-gray-300)" />
              </div>
              <div className="link-text text-type-400">
                {email || "Loading..."}
              </div>
            </div>

            <Input
              type="password"
              id="password-input"
              placeholder="Create Password"
              icon="lock"
              showPasswordToggle
              value={password}
              onChange={setPassword}
            />

            <Input
              type="password"
              id="confirm-password-input"
              placeholder="Confirm Password"
              icon="lock"
              showPasswordToggle
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {errorMessage && (
              <div className="text-error-400 body1-desktop-text">
                {errorMessage}
              </div>
            )}

            <Button
              text={isLoading ? "Creating Account..." : "Create Account"}
              onClick={handleSignUp}
              defaultClassName="w-full"
            />
          </div>
        </div>
      </DisplayBox>
    </div>
  );
}