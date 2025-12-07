"use client";

import { useState } from "react";
import UploadView from "@/components/views/UploadView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function UploadPage() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  return (
    <RoleGuard allowedRoles={["CommunityOrgAdmin", "admin"]}>
      <UploadView
        currentTabIndex={currentTabIndex}
        onTabChange={setCurrentTabIndex}
      />
    </RoleGuard>
  );
}
