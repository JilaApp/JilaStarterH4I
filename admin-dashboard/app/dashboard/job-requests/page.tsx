"use client";

import JobRequestsView from "@/components/views/JobRequestsView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function JobRequestsPage() {
  return (
    <RoleGuard allowedRoles={["CommunityOrgAdmin", "admin"]}>
      <JobRequestsView />
    </RoleGuard>
  );
}
