"use client";

import MetricsView from "@/components/views/MetricsView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MetricsPage() {
  return (
    <RoleGuard allowedRoles={["JilaAdmin"]}>
      <MetricsView />
    </RoleGuard>
  );
}
