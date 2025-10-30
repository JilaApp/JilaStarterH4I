"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/Button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Simple check - no retries
    const userType = user.publicMetadata?.userType;
    if (userType !== "admin") {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <div className="page-title-text text-jila-400">Loading...</div>
      </div>
    );
  }

  const userType = user.publicMetadata?.userType;
  if (userType !== "admin") {
    return null;
  }

  return (
    <>
      <Button text="Sign Out" onClick={handleSignOut} />
      <h2 className="body1-desktop-bold-text text-type-400 mb-2">
        Welcome, {user?.emailAddresses[0]?.emailAddress}
      </h2>
    </>
  );
}
