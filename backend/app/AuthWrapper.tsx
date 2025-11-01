"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setVerificationStatus("failed");
      return;
    }

    const checkUserRole = async () => {
      if (user.publicMetadata?.userType === "admin") {
        setVerificationStatus("success");
        return;
      }
      try {
        await user.reload();
        if (user.publicMetadata?.userType === "admin") {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Error reloading user:", error);
        setVerificationStatus("failed");
      }
    };

    checkUserRole();
  }, [isLoaded, user]);

  useEffect(() => {
    if (verificationStatus === "failed") {
      router.push("/sign-in");
    }
  }, [verificationStatus, router]);

  if (verificationStatus !== "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
