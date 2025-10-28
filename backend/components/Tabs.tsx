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
  tab1: Tab;
  tab2: Tab;
}

export default function Tabs({ tab1, tab2 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabDict = [
    {
      id: 0,
      header_logo: tab1.header.logo,
      header_text: tab1.header.text,
      content: tab1.content,
    },
    {
      id: 1,
      header_logo: tab2.header.logo,
      header_text: tab2.header.text,
      content: tab2.content,
    },
  ];

  const active = tabDict.find((t) => t.id === activeTab);

  return (
    <div className="shadow-lg shadow-gray-400 rounded-xl p-6 mx-10 space-y-5 bg-[linear-gradient(to_bottom,white_0%,rgba(109,15,0,0.07)_30%,rgba(109,15,0,0.07)_70%,white_100%)]">
      <div className="flex flex-wrap">
        {tabDict.map((tab) => (
          // styling for active tab
          <button
            key={tab!.id}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab!.id
                ? "border-b-3 border-jila-400 text-jila-400"
                : "text-gray-400 hover:text-jila-300 cursor-pointer"
            }`}
            onClick={() => setActiveTab(tab!.id)}
          >
            <div className="flex justify-start gap-2">
              {tab!.header_logo}
              <span>{tab!.header_text}</span>
            </div>
          </button>
        ))}
      </div>
      {/* display active tab content */}
      <div>{active?.content}</div>

      {/* Search Bar
      <div className="flex justify-end ml-auto">
          <input
          type="string"
          id="search_bar"
          placeholder="search"
          />
      </div> */}
    </div>
  );
}
