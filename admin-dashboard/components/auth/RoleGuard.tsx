"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type UserType = "JilaAdmin" | "CommunityOrgAdmin" | "admin";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserType[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const userType = user?.publicMetadata?.userType as UserType | undefined;
  const isAllowed = userType && allowedRoles.includes(userType);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (!isAllowed) {
      if (userType === "JilaAdmin") {
        router.replace("/dashboard/metrics");
      } else {
        router.replace("/dashboard/home");
      }
    }
  }, [isLoaded, user, userType, isAllowed, router]);

  if (!isLoaded || !isAllowed) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
