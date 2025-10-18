"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

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

            {error && (
              <div className="text-error-400 text-sm">{error}</div>
            )}

            <Button
              text={loading ? "Signing in..." : "Sign In"}
              onClick={handleSignIn}
              defaultClassName={loading ? "opacity-50 cursor-not-allowed" : ""}
            />
          </form>
        </div>
      </DisplayBox>
    </div>
  );
}