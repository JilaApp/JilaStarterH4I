"use client";

import { useRouter } from "next/navigation";
import JobPostingsView from "@/components/views/JobPostingsView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function JobsPage() {
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={["CommunityOrgAdmin", "admin"]}>
      <JobPostingsView
        onNavigateToUpload={() => router.push("/dashboard/jobs/add")}
      />
    </RoleGuard>
  );
}
