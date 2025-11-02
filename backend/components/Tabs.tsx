import { ReactNode } from "react";

interface TabHeader {
  logo: ReactNode;
  text: string;
}

interface Tab {
  header: TabHeader;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export default function Tabs({
  tabs,
  activeIndex,
  onTabChange,
  rightElement,
  containerClassName = "",
}: TabsProps) {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs[activeIndex];

  return (
    <div
      className={`bg-[#F5F5F5] rounded-[20px] shadow-lg flex flex-col flex-1 overflow-hidden min-h-0 ${containerClassName}`}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-3">
        <div className="flex gap-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`flex items-center gap-2 pb-2 border-b-[3px] transition-colors ${
                activeIndex === index
                  ? "border-jila-400 text-type-400"
                  : "border-transparent text-gray-400 hover:text-gray-500"
              }`}
            >
              {tab.header.logo}
              <span className="body2-desktop-text font-semibold whitespace-nowrap">
                {tab.header.text}
              </span>
            </button>
          ))}
        </div>

        {rightElement && <div>{rightElement}</div>}
      </div>

      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        {activeTab.content}
      </div>
    </div>
  );
}
