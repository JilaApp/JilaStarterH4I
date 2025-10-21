"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";
import Link from "next/link";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWaitingForMetadata, setIsWaitingForMetadata] = useState(false);

  // If user is already signed in with admin role, redirect
  useEffect(() => {
    if (isUserLoaded && user) {
      const userType = user.publicMetadata?.userType;

      if (userType === "admin") {
        router.push("/dashboard");
      } else if (userType) {
        // Has userType but not admin
        setError("This account does not have admin access.");
      }
    }
  }, [isUserLoaded, user, router]);

  // Poll for metadata after sign-in
  useEffect(() => {
    if (isWaitingForMetadata && user) {
      const checkMetadata = setInterval(() => {
        const userType = user.publicMetadata?.userType;
        console.log("Checking metadata:", userType);

        if (userType === "admin") {
          clearInterval(checkMetadata);
          router.push("/dashboard");
        } else if (userType) {
          // Has userType but not admin
          clearInterval(checkMetadata);
          setError("This account does not have admin access.");
          setIsWaitingForMetadata(false);
          setLoading(false);
        }
      }, 500);

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkMetadata);
        if (!user.publicMetadata?.userType) {
          router.push("/dashboard"); // Let dashboard handle the check
        }
      }, 10000);

      return () => {
        clearInterval(checkMetadata);
        clearTimeout(timeout);
      };
    }
  }, [isWaitingForMetadata, user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Wait for metadata to be populated
        setIsWaitingForMetadata(true);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  if (isWaitingForMetadata) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <DisplayBox>
          <div className="flex flex-col gap-y-8 items-center">
            <h1 className="page-title-text text-jila-400">Signing In</h1>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
              <p className="body1-desktop-text text-type-400">Please wait...</p>
            </div>
          </div>
        </DisplayBox>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-300">
      <DisplayBox>
        <div className="flex flex-col gap-y-8">
          <h1 className="page-title-text text-jila-400">Admin Sign In</h1>

          <form onSubmit={handleSignIn} className="flex flex-col gap-y-5">
            <Input
              type="email"
              id="email"
              placeholder="Enter Email"
              icon="mail"
              value={email}
              onChange={setEmail}
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

            {error && <div className="text-error-400 text-sm">{error}</div>}

            <Button
              text={loading ? "Signing in..." : "Sign In"}
              onClick={handleSignIn}
              defaultClassName={loading ? "opacity-50 cursor-not-allowed" : ""}
              disabled={loading}
            />

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="link-text text-jila-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}
