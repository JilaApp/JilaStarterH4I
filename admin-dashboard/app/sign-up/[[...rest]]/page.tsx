"use client";

import { useEffect, useState, useCallback } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { EmailInput, PasswordInput } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DisplayBox from "@/components/shared/DisplayBox";
import FormField from "@/components/forms/FormField";
import PageBackground from "@/components/layout/PageBackground";
import Link from "@/components/shared/Link";
import { trpc } from "@/lib/trpc";
import { useForm, createField } from "@/hooks/useForm";
import { validatePassword } from "@/lib/validators";

export default function InviteSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const finalizeSignUpMutation = trpc.user.finalizeSignUp.useMutation();

  const { fields, setFieldValue, setFieldError, validateAllFields } = useForm({
    email: createField(""),
    password: createField(""),
    confirmPassword: createField(""),
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailApproved, setEmailApproved] = useState(false);
  const [isTicketProcessed, setIsTicketProcessed] = useState(false);

  useEffect(() => {
    if (isLoaded && user && user.publicMetadata?.userType === "admin") {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

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

        if (
          createdSignUp.status === "missing_requirements" &&
          createdSignUp.emailAddress
        ) {
          setFieldValue("email", createdSignUp.emailAddress);
        }
      } catch (err: any) {
        setError(
          err.errors?.[0]?.longMessage ||
            "This invitation is invalid or has expired.",
        );
      } finally {
        setIsTicketProcessed(true);
      }
    };

    createSignUpFromTicket();
  }, [isLoaded, searchParams, signUp, isTicketProcessed]);

  const validateConfirmPassword = useCallback(
    (value: string): string | null => {
      if (value !== fields.password.value) {
        return "Passwords do not match.";
      }
      return null;
    },
    [fields.password.value],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      return setError(
        "The sign-up component is not ready. Please refresh the page.",
      );
    }

    setError("");

    setFieldError("password", "");
    setFieldError("confirmPassword", "");

    const isValid = validateAllFields({
      password: validatePassword,
      confirmPassword: validateConfirmPassword,
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
      const result = await signUp.update({
        password: fields.password.value,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await finalizeSignUpMutation.mutateAsync();
        router.push("/dashboard");
      } else {
        setError("Could not complete your sign up. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "An unexpected error occurred during sign up.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (finalizeSignUpMutation.isPending) return "Finalizing setup...";
    if (isLoading) return "Creating Account...";
    return "Sign Up";
  };

  return (
    <PageBackground>
      <div className="flex min-h-screen items-center justify-center bg-cream-300 p-4">
        <DisplayBox>
          {!emailApproved ? (
            <div className="flex flex-col gap-y-7 justify-center items-center">
              <h1 className="body1-desktop-text text-4xl font-bold">
                Welcome to JILA!
              </h1>
              <p className="body1-desktop-text text-xl text-center font-light">
                We&apos;ve approved the following email for creating your admin
                account
              </p>
              <div>
                <EmailInput
                  id="email-input"
                  name="email"
                  value={fields.email.value}
                  onChange={() => {}}
                  disabled
                  placeholder="Loading from invitation..."
                  className="w-[450px] h-[60px]"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-error-200 p-4 text-error-400">
                  {error}
                </div>
              )}
              <div className="flex flex-col w-full">
                <label className="components-text text-type-400 mb-2 block">
                  Have an account? <Link href="/sign-in">Sign in</Link>
                </label>
                <Button
                  text="Sign up"
                  type="button"
                  defaultClassName="w-full"
                  onClick={() => {
                    setError("");
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
                autoComplete="off"
              >
                <h1 className="body1-desktop-text text-4xl font-bold">
                  Set up your password
                </h1>
                <p className="body1-desktop-text text-xl text-center font-light">
                  Create a secure password for your account
                </p>
                <div className="flex flex-col gap-y-2">
                  <FormField
                    title="Password"
                    required
                    state={fields.password.state}
                    errorString={fields.password.error}
                    value={fields.password.value}
                    onChange={(val) => setFieldValue("password", val)}
                  >
                    {(props) => (
                      <PasswordInput
                        {...props}
                        id="password-input"
                        name="password"
                        autoComplete="new-password"
                        className="w-[450px] h-[60px]"
                      />
                    )}
                  </FormField>
                  <FormField
                    title="Confirm Password"
                    required
                    state={fields.confirmPassword.state}
                    errorString={fields.confirmPassword.error}
                    value={fields.confirmPassword.value}
                    onChange={(val) => setFieldValue("confirmPassword", val)}
                  >
                    {(props) => (
                      <PasswordInput
                        {...props}
                        id="confirm-password-input"
                        name="confirmPassword"
                        autoComplete="new-password"
                        className="w-[450px] h-[60px]"
                      />
                    )}
                  </FormField>
                </div>
                {error && (
                  <div className="rounded-lg bg-error-200 p-4 text-error-400">
                    {error}
                  </div>
                )}
                <Button
                  text={getButtonText()}
                  type="submit"
                  defaultClassName="w-full"
                  disabled={isLoading || finalizeSignUpMutation.isPending}
                />
              </form>
            </div>
          )}
        </DisplayBox>
      </div>
    </PageBackground>
  );
}
