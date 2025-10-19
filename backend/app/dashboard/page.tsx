"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Check if user is admin
    const userType = user.publicMetadata?.userType;
    console.log("User type:", userType, "Retry count:", retryCount);

    if (userType === "admin") {
      setIsChecking(false);
    } else if (retryCount < 5) {
      // Retry up to 5 times (5 seconds total)
      // This gives the webhook time to set the metadata
      console.log("Metadata not ready, retrying in 1 second...");
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        // Force a refetch of user data
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // After 5 retries, redirect to sign-in
      console.log("Not an admin after retries, redirecting to sign-in");
      router.push("/sign-in");
    }
  }, [isLoaded, user, router, retryCount]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  // Show loading state while checking auth
  if (!isLoaded || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-300">
        <div className="page-title-text text-jila-400">
          {retryCount > 0 ? "Setting up your account..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-cream-300 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="page-title-text text-jila-400">Admin Dashboard</h1>
            <Button text="Sign Out" onClick={handleSignOut} />
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="body1-desktop-bold-text text-type-400 mb-2">
                Welcome, {user?.emailAddresses[0]?.emailAddress}
              </h2>
              <p className="text-gray-400">Role: Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/users">
                <div className="bg-jila-300 hover:bg-jila-400 transition-colors p-6 rounded-lg cursor-pointer">
                  <h3 className="components-text text-white-400">
                    View All Users
                  </h3>
                  <p className="text-white-400 text-sm mt-2">
                    See all admin and app users
                  </p>
                </div>
              </Link>

              <div className="bg-orange-300 hover:bg-orange-400 transition-colors p-6 rounded-lg cursor-pointer">
                <h3 className="components-text text-white-400">
                  Video Management
                </h3>
                <p className="text-white-400 text-sm mt-2">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
