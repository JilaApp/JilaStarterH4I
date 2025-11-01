import { useState } from "react";

interface TabHeader {
  logo: React.ReactNode;
  text: string;
}

interface Tab {
  header: TabHeader;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeIndex: number;
  onTabChange: (index: number) => void;
}

export default function Tabs({ tabs, activeIndex, onTabChange }: TabsProps) {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs[activeIndex];

  return (
    <div className="shadow-lg shadow-gray-400 rounded-xl p-6 mx-10 space-y-5 bg-[linear-gradient(to_bottom,white_0%,rgba(109,15,0,0.07)_30%,rgba(109,15,0,0.07)_70%,white_100%)]">
      <div className="flex flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-semibold ${
              activeIndex === index
                ? "border-b-3 border-jila-400 text-jila-400"
                : "text-gray-400 hover:text-jila-300 cursor-pointer"
            }`}
            onClick={() => onTabChange(index)}
          >
            <div className="flex justify-start gap-2">
              {tab.header.logo}
              <span>{tab.header.text}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-6 pt-5 flex-1 overflow-auto">
        {activeTab.content}
      </div>
    </div>
  );
}
