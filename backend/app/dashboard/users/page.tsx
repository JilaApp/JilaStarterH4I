"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

export default function UsersListPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }

    // Check if user is admin
    if (isLoaded && user) {
      const userType = user.publicMetadata?.userType;
      if (userType !== "admin") {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, user, router]);

  const { data: adminUsers, isLoading: loadingAdmins } =
    trpc.users.getAllAdminUsers.useQuery();
  const { data: appUsers, isLoading: loadingAppUsers } =
    trpc.users.getAllAppUsers.useQuery();

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
    <div className="min-h-screen bg-cream-300 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="link-text text-jila-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="page-title-text text-jila-400 mb-8">All Users</h1>

          {/* Admin Users */}
          <div className="mb-10">
            <h2 className="body1-desktop-bold-text text-type-400 mb-4">
              Admin Users ({loadingAdmins ? "..." : adminUsers?.length || 0})
            </h2>

            {loadingAdmins ? (
              <div className="text-gray-400">Loading admin users...</div>
            ) : adminUsers && adminUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="text-left p-3 border border-gray-300">
                        Email
                      </th>
                      <th className="text-left p-3 border border-gray-300">
                        Community Org
                      </th>
                      <th className="text-left p-3 border border-gray-300">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-100">
                        <td className="p-3 border border-gray-300">
                          {admin.email}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {admin.communityOrg}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-400">No admin users found</div>
            )}
          </div>

          {/* App Users */}
          <div>
            <h2 className="body1-desktop-bold-text text-type-400 mb-4">
              App Users ({loadingAppUsers ? "..." : appUsers?.length || 0})
            </h2>

            {loadingAppUsers ? (
              <div className="text-gray-400">Loading app users...</div>
            ) : appUsers && appUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="text-left p-3 border border-gray-300">
                        Username
                      </th>
                      <th className="text-left p-3 border border-gray-300">
                        Community Org
                      </th>
                      <th className="text-left p-3 border border-gray-300">
                        Language
                      </th>
                      <th className="text-left p-3 border border-gray-300">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appUsers.map((appUser) => (
                      <tr key={appUser.id} className="hover:bg-gray-100">
                        <td className="p-3 border border-gray-300">
                          {appUser.username}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {appUser.communityOrg}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {appUser.language}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {new Date(appUser.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-400">No app users found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
