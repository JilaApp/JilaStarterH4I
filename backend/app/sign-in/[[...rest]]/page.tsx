"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EmailInput, PasswordInput } from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";
import Link from "next/link";
import FormText, {
  validateEmail,
  validatePassword,
} from "@/components/FormTextWrapper";

import FormInputWrapper from "@/components/FormInputWrapper";
import PageBackground from "@/components/PageBackground";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
    <PageBackground>
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <DisplayBox>
          <div className="flex flex-col gap-y-8">
            <form
              onSubmit={handleSignIn}
              className="flex flex-col gap-y-6 items-center justify-center"
            >
              <h1 className="body1-desktop-text text-4xl font-bold">
                Welcome back!
              </h1>
              <p className="body1-desktop-text text-xl text-center font-light">
                Enter your details to get signed into your admin account
              </p>
              <div className="flex flex-col gap-y-2">
                <FormInputWrapper
                  title="Email"
                  required
                  state={emailError ? "error" : "default"}
                  errorString={emailError}
                >
                  <FormText
                    required
                    validate={validateEmail}
                    error={emailError}
                    onErrorChange={setEmailError}
                    value={email}
                    onValueChange={setEmail}
                  >
                    <EmailInput id="email-input" />
                  </FormText>
                </FormInputWrapper>

                <FormInputWrapper
                  title="Password"
                  required
                  state={passwordError ? "error" : "default"}
                  errorString={passwordError}
                >
                  <FormText
                    required
                    validate={validatePassword}
                    onErrorChange={setPasswordError}
                    error={passwordError}
                    value={password}
                    onValueChange={setPassword}
                  >
                    <PasswordInput id="password-input" />
                  </FormText>
                </FormInputWrapper>
              </div>
              {error && (
                <div className="rounded-lg bg-error-200 p-4 text-error-400">
                  {error}
                </div>
              )}
              <div className="w-full flex flex-col gap-y-2">
                <div>
                  <Link
                    href="/forgot-password"
                    className="link-text text-jila-400 hover:underline mb-3"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Button
                  text={loading ? "Signing in..." : "Sign In"}
                  onClick={handleSignIn}
                  defaultClassName={
                    loading ? "opacity-50 cursor-not-allowed w-full" : "w-full"
                  }
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </DisplayBox>
      </div>
    </PageBackground>
  );
}
