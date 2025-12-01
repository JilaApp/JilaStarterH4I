"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EmailInput, PasswordInput } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DisplayBox from "@/components/shared/DisplayBox";
import Link from "@/components/shared/Link";
import FormField from "@/components/forms/FormField";
import PageBackground from "@/components/layout/PageBackground";
import { Ban } from "lucide-react";
import { useForm, createField } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/validators";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  const { fields, setFieldValue, setFieldError, validateAllFields } = useForm({
    email: createField(""),
    password: createField(""),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWaitingForMetadata, setIsWaitingForMetadata] = useState(false);

  useEffect(() => {
    if (isUserLoaded && user) {
      const userType = user.publicMetadata?.userType;

      if (userType === "admin") {
        router.push("/dashboard");
        return;
      } else if (userType) {
        setError("This account does not have admin access.");
      }
    }
  }, [isUserLoaded, user, router]);

  useEffect(() => {
    if (isWaitingForMetadata && user) {
      const checkMetadata = setInterval(() => {
        const userType = user.publicMetadata?.userType;

        if (userType === "admin") {
          clearInterval(checkMetadata);
          router.push("/dashboard");
          return;
        } else if (userType) {
          clearInterval(checkMetadata);
          setError("This account does not have admin access.");
          setIsWaitingForMetadata(false);
          setLoading(false);
        }
      }, 500);

      const timeout = setTimeout(() => {
        clearInterval(checkMetadata);
        if (!user.publicMetadata?.userType) {
          router.push("/dashboard");
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
    setFieldError("email", "");
    setFieldError("password", "");

    const isValid = validateAllFields({
      email: validateEmail,
      password: validatePassword,
    });

    if (!isValid) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: fields.email.value,
        password: fields.password.value,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
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
                      className="w-[450px] h-[60px]"
                    />
                  )}
                </FormField>

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
                      className="w-[450px] h-[60px]"
                    />
                  )}
                </FormField>
              </div>
              {error && (
                <div className="!rounded-lg !mt-0 bg-error-200 w-full flex items-center gap-[3px] p-[14px] text-error-400 text-lg">
                  <div className="flex items-center justify-center">
                    <Ban width={"20px"} height={"20px"} />
                  </div>
                  <span className="font-[500]">{error}</span>
                </div>
              )}
              <div className="w-full flex flex-col gap-y-2">
                <div>
                  <Link href="/forgot-password">Forgot your password?</Link>
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
