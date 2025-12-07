"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MetricsPage() {
  return (
    <RoleGuard allowedRoles={["JilaAdmin"]}>
      <div className="flex-1 px-10 py-6">
        <p>Metrics dashboard coming soon...</p>
      </div>
    </RoleGuard>
  );
}
