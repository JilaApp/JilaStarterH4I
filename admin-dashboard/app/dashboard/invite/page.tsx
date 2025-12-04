"use client";

import InviteView from "@/components/views/InviteView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function InvitePage() {
  return (
    <RoleGuard allowedRoles={["JilaAdmin"]}>
      <InviteView />
    </RoleGuard>
  );
}
