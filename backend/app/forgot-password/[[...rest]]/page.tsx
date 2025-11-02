"use client";

import { useSignIn, useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { EmailInput, PasswordInput, TextInput } from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";
import Notification from "@/components/Notification";
import Link from "next/link";
import FormText, {
  validateEmail,
  validatePassword,
} from "@/components/FormTextWrapper";
import FormInputWrapper from "@/components/FormInputWrapper";
import PageBackground from "@/components/PageBackground";
import { router } from "@/server/trpc";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const { setActive } = useClerk();
  const { user } = useUser();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    if (user && user.publicMetadata.userType === "admin") {
      router.push("/dashboard");
      return;
    }
  }, [router, user]);

  // Step 1: Request password reset
  // Step 2: Verify code and reset password
  const [step, setStep] = useState<"request" | "reset">("request");

  const resetErrorStates = () => {
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    resetErrorStates();
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccessMessage("Reset code sent to your email!");
      setShowNotification(true);
      setStep("reset");
    } catch (err: any) {
      console.error("Password reset request error:", err);
      setEmailError(
        err.errors?.[0]?.message ||
          "Failed to send reset code. Please check your email address.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    resetErrorStates();
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setSuccessMessage(
          "Password reset successful! Redirecting to dashboard",
        );
        setShowNotification(true);

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "Invalid code or failed to reset password.",
      );
      if (error === "is incorrect") setError("Reset code is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccessMessage("Reset code resent to your email!");
      setShowNotification(true);
    } catch (err: any) {
      console.error("Resend code error:", err);
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream-300 p-4">
        {showNotification && (
          <div className="fixed top-5 z-50">
            <Notification
              message={successMessage}
              onClose={() => setShowNotification(false)}
            />
          </div>
        )}

        <DisplayBox>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col items-center justify-center">
              <h1 className="body1-desktop-text text-4xl font-bold mb-8">
                {step === "request" ? "Forgot Password?" : "Check your email!"}
              </h1>
              <p className="body1-desktop-text text-type-400 text-center">
                {step === "request"
                  ? "Don't worry! Enter your account's email and we'll send you a reset code."
                  : `Enter the code sent to ${email} and your new password.`}
              </p>
            </div>

            {step === "request" ? (
              <form
                onSubmit={handleRequestReset}
                className="flex flex-col gap-y-5"
              >
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
                      name="email"
                      className="w-[450px] h-[60px]"
                    />
                  </FormText>
                </FormInputWrapper>

                <Button
                  text={loading ? "Sending..." : "Send Reset Code"}
                  type="submit"
                  defaultClassName={
                    loading ? "opacity-50 cursor-not-allowed w-full" : "w-full"
                  }
                  disabled={loading}
                />

                <div className="text-center">
                  <Link
                    href="/sign-in"
                    className="link-text text-jila-400 hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleResetPassword}
                className="flex flex-col gap-y-5"
                autoComplete="off"
              >
                <div>
                  <FormInputWrapper
                    title="Reset Code"
                    required
                    state={error ? "error" : "default"}
                    errorString={error}
                    value={code}
                    onChange={setCode}
                  >
                    <FormText required onErrorChange={setError} error={error}>
                      <TextInput
                        id="code"
                        name="code"
                        placeholder="Enter 6-digit code"
                        className="w-[450px] h-[60px]"
                      />
                    </FormText>
                  </FormInputWrapper>
                </div>

                <FormInputWrapper
                  title="New Password"
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
                      id="new-password"
                      name="new-password"
                      autoComplete="new-password"
                      className="w-[450px] h-[60px]"
                    />
                  </FormText>
                </FormInputWrapper>

                <Button
                  text={loading ? "Resetting..." : "Reset Password"}
                  type="submit"
                  defaultClassName={
                    loading ? "opacity-50 cursor-not-allowed w-full" : "w-full"
                  }
                  disabled={loading}
                />

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="link-text text-jila-400 hover:underline"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                  <Link
                    href="/sign-in"
                    className="link-text text-gray-400 hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </DisplayBox>
      </div>
    </PageBackground>
  );
}
