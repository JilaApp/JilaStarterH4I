"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthWrapper from "../AuthWrapper";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { trpc } from "@/lib/trpc";

const pageTitles: Record<string, string> = {
  "/dashboard/home": "Your JILA! Dashboard",
  "/dashboard/upload": "Upload",
  "/dashboard/jobs": "Job board management",
  "/dashboard/jobs/add": "Job board management",
  "/dashboard/job-requests": "Job requests",
  "/dashboard/metrics": "Metrics",
  "/dashboard/invite": "Invite",
};

const pathToSidebarButton: Record<string, string> = {
  "/dashboard/home": "dashboard",
  "/dashboard/upload": "upload",
  "/dashboard/jobs": "jobs",
  "/dashboard/jobs/add": "jobs",
  "/dashboard/job-requests": "job-requests",
  "/dashboard/metrics": "metrics",
  "/dashboard/invite": "invite",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: myCommunityOrg } = trpc.community.getMyCommunityOrg.useQuery();
  const userType = user?.publicMetadata?.userType;
  const organizationName =
    userType === "JilaAdmin" ? "JILA" : myCommunityOrg?.name || "";

  const activeButton = pathToSidebarButton[pathname] || "";
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut({ redirectUrl: "/sign-in" });
  };

  if (isSigningOut) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen overflow-hidden bg-[linear-gradient(348deg,_#7E0601_51.81%,_#E8965B_130.16%)]">
        <div className="fixed left-0 top-0 h-screen z-50">
          <Sidebar activeButton={activeButton} />
        </div>
        <div className="flex-1 ml-[196px] flex flex-col bg-cream-300 rounded-tl-[60px] overflow-hidden">
          <div className="flex-shrink-0 px-10 mt-6">
            <Header
              name={user?.emailAddresses[0]?.emailAddress || "User"}
              organization={organizationName}
              title={pageTitle}
              onSignOut={handleSignOut}
            />
          </div>
          {children}
        </div>
      </div>
    </AuthWrapper>
  );
}
