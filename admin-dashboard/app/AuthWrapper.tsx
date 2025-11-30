"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { logger } from "@/lib/logger";

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
        logger.error("[AuthWrapper] Failed to verify admin status", error);
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
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
