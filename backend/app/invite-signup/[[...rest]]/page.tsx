"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function InviteSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && signUp) {
      // Get email from the invitation metadata
      const invitationEmail = signUp.emailAddress || "";
      setEmail(invitationEmail);
    }
  }, [isLoaded, signUp]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Create the user with password
      const result = await signUp.create({
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.errors?.[0]?.message || "Failed to complete signup");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <DisplayBox>
          <div className="page-title-text text-jila-400">Loading...</div>
        </DisplayBox>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-300">
      <DisplayBox>
        <div className="flex flex-col gap-y-8">
          <div>
            <h1 className="page-title-text text-jila-400">Complete Setup</h1>
            <p className="body1-desktop-text text-gray-400 mt-2">
              Set your password to complete admin registration
            </p>
          </div>
          
          <form onSubmit={handleSignUp} className="flex flex-col gap-y-5">
            <Input
              type="email"
              id="email"
              placeholder="Email"
              icon="mail"
              value={email}
              disabled
              onChange={() => {}}
            />

            <Input
              type="password"
              id="password"
              placeholder="Enter Password"
              icon="lock"
              showPasswordToggle
              value={password}
              onChange={setPassword}
            />

            <Input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              icon="lock"
              showPasswordToggle
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {error && (
              <div className="text-error-400 text-sm">{error}</div>
            )}

            <Button
              text={loading ? "Creating account..." : "Complete Signup"}
              onClick={handleSignUp}
              defaultClassName={loading ? "opacity-50 cursor-not-allowed" : ""}
            />
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}