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
import { Ban } from "lucide-react";

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
        return;
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
          return;
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

    const em = validateEmail(email) || "";
    const p = validatePassword(password) || "";
    setError("");
    if (em != "" || p != "") {
      setEmailError(em);
      setPasswordError(p);
      return;
    }

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
      setError("Invalid email or password");
      setLoading(false);
    }
  };

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
                  value={email}
                  onChange={setEmail}
                >
                  <FormText
                    required
                    validate={validateEmail}
                    error={emailError}
                    onErrorChange={setEmailError}
                  >
                    <EmailInput
                      id="email-input"
                      className="w-[450px] h-[60px]"
                    />
                  </FormText>
                </FormInputWrapper>

                <FormInputWrapper
                  title="Password"
                  required
                  state={passwordError ? "error" : "default"}
                  errorString={passwordError}
                  value={password}
                  onChange={setPassword}
                >
                  <FormText
                    required
                    validate={validatePassword}
                    onErrorChange={setPasswordError}
                    error={passwordError}
                  >
                    <PasswordInput
                      id="password-input"
                      className="w-[450px] h-[60px]"
                    />
                  </FormText>
                </FormInputWrapper>
              </div>
              {error && (
                <div className="!rounded-lg !mt-0 bg-error-200 w-full flex items-center gap-[3px] p-[14px] text-[var(--color-error-400)] text-[18px]">
                  <div className="flex items-center justify-center ">
                    <Ban width={"20px"} height={"20px"} />
                  </div>
                  <span className="font-[500]">{error}</span>
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
