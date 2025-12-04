"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { logger } from "@/lib/logger";

const isValidAdminType = (userType: unknown): boolean => {
  return (
    userType === "admin" ||
    userType === "JilaAdmin" ||
    userType === "CommunityOrgAdmin"
  );
};

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed" | "not_signed_in"
  >("verifying");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setVerificationStatus("not_signed_in");
      return;
    }

    const checkUserRole = async () => {
      if (isValidAdminType(user.publicMetadata?.userType)) {
        setVerificationStatus("success");
        return;
      }
      try {
        await user.reload();
        if (isValidAdminType(user.publicMetadata?.userType)) {
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
    if (verificationStatus === "not_signed_in") {
      router.replace("/sign-in");
    } else if (verificationStatus === "failed") {
      signOut({ redirectUrl: "/sign-in" });
    }
  }, [verificationStatus, signOut, router]);

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
