import { useState } from "react";
import { Video, MessageCircle } from "lucide-react";

interface TabsProps {
  video_name: string;
  social_name: string;
  video_content: React.ReactNode;
  social_content: React.ReactNode;
}

export default function Tabs({
  video_name,
  social_name,
  video_content,
  social_content,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    {
      id: "tab1",
      label: (
        <div className="flex justify-start gap-2">
          <Video />
          <span>{video_name}</span>
        </div>
      ),
    },
    {
      id: "tab2",
      label: (
        <div className="flex justify-start gap-2">
          <MessageCircle />
          <span>{social_name}</span>
        </div>
      ),
    },
    ,
  ];

  const tabContent = {
    tab1: video_content,
    tab2: social_content,
  };

  return (
    <div className="shadow-lg shadow-gray-400 rounded-xl p-6 mx-10 space-y-5 bg-[linear-gradient(to_bottom,white_0%,rgba(109,15,0,0.07)_30%,rgba(109,15,0,0.07)_70%,white_100%)]">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab!.id}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab!.id
                ? "border-b-3 border-jila-400 text-jila-400"
                : "text-gray-400 hover:text-jila-300 cursor-pointer"
            }`}
            onClick={() => setActiveTab(tab!.id)}
          >
            {tab!.label}
          </button>
        ))}

        {/* Search bar was removed from figma
        <div className="flex justify-end ml-auto">
            <input
            type="string"
            id="search_bar"
            placeholder="search"
            />
        </div> */}
      </div>

      <div>{tabContent[activeTab]}</div>
    </div>
  );
}
