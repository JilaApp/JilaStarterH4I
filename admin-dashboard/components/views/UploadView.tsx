"use client";

import { useState } from "react";
import { Video, MessageCircle } from "lucide-react";
import Tabs from "@/components/shared/Tabs";
import VideoUploadForm from "@/components/videos/VideoUploadForm";
import SocialServiceForm from "@/components/social-services/SocialServiceForm";

interface UploadViewProps {
  currentTabIndex?: number;
  onTabChange?: (index: number) => void;
}

export default function UploadView({
  currentTabIndex: externalTabIndex,
  onTabChange: externalOnTabChange,
}: UploadViewProps) {
  const [internalTabIndex, setInternalTabIndex] = useState(0);

  const currentTabIndex = externalTabIndex ?? internalTabIndex;
  const onTabChange = externalOnTabChange ?? setInternalTabIndex;

  const uploadTabs = [
    {
      header: { logo: <Video size={20} />, text: "Video upload" },
      content: <VideoUploadForm />,
    },
    {
      header: {
        logo: <MessageCircle size={20} />,
        text: "Social services upload",
      },
      content: <SocialServiceForm />,
    },
  ];

  return (
    <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
      <Tabs
        tabs={uploadTabs}
        activeIndex={currentTabIndex}
        onTabChange={onTabChange}
      />
    </div>
  );
}
