"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import AuthWrapper from "../AuthWrapper";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <>
      <AuthWrapper>
        <Button text="Sign Out" onClick={handleSignOut} />
        <h2 className="body1-desktop-bold-text text-type-400 mb-2">
          Welcome, {user?.emailAddresses[0]?.emailAddress}
        </h2>
      </AuthWrapper>
    </>
  );
}
