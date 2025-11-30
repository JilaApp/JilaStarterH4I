"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthWrapper from "../AuthWrapper";
import DashboardView from "@/components/views/DashboardView";
import UploadView from "@/components/views/UploadView";
import JobPostingsView from "@/components/views/JobPostingsView";
import JobRequestsView from "@/components/views/JobRequestsView";
import JobAddView from "@/components/views/JobAddView";

export default function DashboardDev() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // Listen for notification clicks to navigate to job requests
  useEffect(() => {
    const handleNavigateToJobRequests = () => {
      setActiveView("job-requests");
    };

    window.addEventListener(
      "navigateToJobRequests",
      handleNavigateToJobRequests,
    );

    return () => {
      window.removeEventListener(
        "navigateToJobRequests",
        handleNavigateToJobRequests,
      );
    };
  }, []);

  // Map views to their corresponding sidebar button
  const viewToSidebarButton: Record<string, string> = {
    dashboard: "dashboard",
    upload: "upload",
    jobs: "jobs",
    "job-add": "jobs", // job-add should highlight jobs in sidebar
    "job-requests": "job-requests",
    metrics: "metrics",
  };

  const getPageTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Your JILA! Dashboard";
      case "upload":
        return "Upload";
      case "jobs":
        return "Job board management";
      case "job-add":
        return "Job board management";
      case "job-requests":
        return "Job requests";
      case "metrics":
        return "Metrics";
      default:
        return "Your JILA! Dashboard";
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "upload":
        return (
          <UploadView
            currentTabIndex={currentTabIndex}
            onTabChange={setCurrentTabIndex}
          />
        );
      case "jobs":
        return (
          <JobPostingsView
            onNavigateToUpload={() => setActiveView("job-add")}
          />
        );
      case "job-add":
        return <JobAddView onBack={() => setActiveView("jobs")} />;
      case "job-requests":
        return <JobRequestsView />;
      case "metrics":
        return (
          <div className="flex-1 px-10 py-6">
            <p>metrics</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen overflow-hidden bg-[linear-gradient(348deg,_#7E0601_51.81%,_#E8965B_130.16%)]">
        <div className="fixed left-0 top-0 h-screen z-50">
          <Sidebar
            activeButton={viewToSidebarButton[activeView]}
            setActiveButton={setActiveView}
          />
        </div>
        <div className="flex-1 ml-[196px] flex flex-col bg-cream-300 rounded-tl-[60px] overflow-hidden">
          <div className="flex-shrink-0 px-10 mt-6">
            <Header
              name={user?.emailAddresses[0]?.emailAddress || "User"}
              organization="Hack4Impact"
              title={getPageTitle()}
              onSignOut={() => signOut({ redirectUrl: "/sign-in" })}
            />
          </div>
          {renderContent()}
        </div>
      </div>
    </AuthWrapper>
  );
}
