"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import DisplayBox from "@/components/DisplayBox";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <div className="page-title-text text-jila-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-300 p-4">
      <DisplayBox>
        <div className="flex flex-col gap-y-8">
          <div>
            <h1 className="page-title-text text-jila-400 mb-2">Sign Out</h1>
            <p className="body1-desktop-text text-type-400">
              Are you sure you want to sign out?
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg p-4">
            <p className="body1-desktop-semi-text text-type-400 mb-2">
              Currently signed in as:
            </p>
            <p className="link-text text-gray-400">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              text={isSigningOut ? "Signing out..." : "Yes, Sign Out"}
              onClick={handleSignOut}
              defaultClassName={`flex-1 ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSigningOut}
            />
            <Button
              text="Cancel"
              onClick={handleCancel}
              defaultClassName="flex-1 bg-gray-400 hover:bg-gray-300"
              disabled={isSigningOut}
            />
          </div>
        </div>
      </DisplayBox>
    </div>
  );
}
