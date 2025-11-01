"use client";

import { Video, MessageCircle } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeaderDropdown from "@/components/HeaderDropdown";
import FilterBar from "@/components/FilterBar";
import Tabs from "@/components/Tabs";

export default function DashboardDev() {
  const [selectedOptions, setSelectedOptions] = useState([
    "Career",
    "Legal",
    "Medical",
    "Transport",
  ]);

  const tabs = [
    {
      header: { logo: <Video />, text: "Video Resources" },
      content: <p>Hello</p>,
    },
    {
      header: { logo: <MessageCircle />, text: "Social Services" },
      content: <p>Bye</p>,
    },
  ];

  // This starts on index 1 (second tab)
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  return (
    <div className="flex min-h-screen bg-cream-300 flex justify-start">
      <Sidebar />
      <div className="flex flex-col">
        <div className="items-center">
          <Header
            name="Sophia Kim"
            organization="Hack4Impact"
            title="Your JILA! Dashboard"
          />
        </div>

        <div className="flex flex-row justfy-start mt-10 ml-10">
          <FilterBar
            options={["Career", "Legal", "Medical", "Transport"]}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        </div>

        <div className="mt-10">
          <Tabs
            tabs={tabs}
            activeIndex={currentTabIndex}
            onTabChange={setCurrentTabIndex}
          />
        </div>
      </div>
    </div>
  );
}
