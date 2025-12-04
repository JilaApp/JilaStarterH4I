"use client";

import { useRouter } from "next/navigation";
import JobAddView from "@/components/views/JobAddView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function JobAddPage() {
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={["CommunityOrgAdmin", "admin"]}>
      <JobAddView onBack={() => router.push("/dashboard/jobs")} />
    </RoleGuard>
  );
}
