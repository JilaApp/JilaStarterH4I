"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userType = user.publicMetadata?.userType;

    if (userType === "JilaAdmin") {
      router.replace("/dashboard/metrics");
    } else {
      router.replace("/dashboard/home");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
