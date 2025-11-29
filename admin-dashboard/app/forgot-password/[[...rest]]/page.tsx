"use client";

import { useSignIn, useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { EmailInput, PasswordInput, TextInput } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DisplayBox from "@/components/shared/DisplayBox";
import Notification from "@/components/shared/Notification";
import Link from "@/components/shared/Link";
import FormField from "@/components/forms/FormField";
import PageBackground from "@/components/layout/PageBackground";
import { useRouter } from "next/navigation";
import { useForm, createField } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/validators";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const { setActive } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const { fields, setFieldValue, setFieldError, validateAllFields } = useForm({
    email: createField(""),
    password: createField(""),
    code: createField(""),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [step, setStep] = useState<"request" | "reset">("request");

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

  const resetErrorStates = () => {
    setError("");
    setFieldError("email", "");
    setFieldError("password", "");
    setFieldError("code", "");
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    resetErrorStates();

    const isValid = validateAllFields({
      email: validateEmail,
    });
    if (!isValid) return;

    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: fields.email.value,
      });

      setSuccessMessage("Reset code sent to your email!");
      setShowNotification(true);
      resetErrorStates(); // Clear all errors before moving to next step
      setStep("reset");
    } catch (err: any) {
      console.error("Password reset request error:", err);
      setFieldError(
        "email",
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

    resetErrorStates();

    const isValid = validateAllFields({
      password: validatePassword,
    });
    if (!isValid) return;

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: fields.code.value,
        password: fields.password.value,
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
        identifier: fields.email.value,
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
                  : `Enter the code sent to ${fields.email.value} and your new password.`}
              </p>
            </div>

            {step === "request" ? (
              <form
                onSubmit={handleRequestReset}
                className="flex flex-col gap-y-5"
              >
                <FormField
                  title="Email"
                  required
                  state={fields.email.state}
                  errorString={fields.email.error}
                  value={fields.email.value}
                  onChange={(val) => setFieldValue("email", val)}
                >
                  {(props) => (
                    <EmailInput
                      {...props}
                      id="email-input"
                      name="email"
                      className="w-[450px] h-[60px]"
                    />
                  )}
                </FormField>

                <Button
                  text={loading ? "Sending..." : "Send Reset Code"}
                  type="submit"
                  defaultClassName={
                    loading ? "opacity-50 cursor-not-allowed w-full" : "w-full"
                  }
                  disabled={loading}
                />

                <div className="text-center">
                  <Link href="/sign-in">Back to Sign In</Link>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleResetPassword}
                className="flex flex-col gap-y-5"
                autoComplete="off"
              >
                <div>
                  <FormField
                    title="Reset Code"
                    required
                    state={error ? "error" : "default"}
                    errorString={error}
                    value={fields.code.value}
                    onChange={(val) => setFieldValue("code", val)}
                  >
                    {(props) => (
                      <TextInput
                        {...props}
                        id="code"
                        name="code"
                        placeholder="Enter 6-digit code"
                        className="w-[450px] h-[60px]"
                      />
                    )}
                  </FormField>
                </div>

                <FormField
                  title="New Password"
                  required
                  state={fields.password.state}
                  errorString={fields.password.error}
                  value={fields.password.value}
                  onChange={(val) => setFieldValue("password", val)}
                >
                  {(props) => (
                    <PasswordInput
                      {...props}
                      id="new-password"
                      name="new-password"
                      autoComplete="new-password"
                      className="w-[450px] h-[60px]"
                    />
                  )}
                </FormField>

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
                  <Link href="/sign-in" className="text-gray-400">
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
