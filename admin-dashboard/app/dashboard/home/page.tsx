"use client";

import DashboardView from "@/components/views/DashboardView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function HomePage() {
  return (
    <RoleGuard allowedRoles={["CommunityOrgAdmin", "admin"]}>
      <DashboardView />
    </RoleGuard>
  );
}
