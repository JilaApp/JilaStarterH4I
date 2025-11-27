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
      className={`relative bg-[#F5F5F5] rounded-[20px] shadow-lg flex flex-col h-full overflow-hidden ${containerClassName}`}
    >
      <div className="flex flex-row items-center justify-between pr-4 flex-shrink-0">
        <div className="relative z-0 flex-shrink-0 flex items-center justify-between px-6 pt-4">
          <div className="flex gap-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => onTabChange(index)}
                className={`relative flex items-center gap-2 pt-2 pb-6 transition-colors cursor-pointer ${
                  activeIndex === index
                    ? "text-type-400"
                    : "text-gray-400 hover:text-gray-500"
                }`}
              >
                {tab.header.logo}
                <span className="body2-desktop-text font-semibold whitespace-nowrap">
                  {tab.header.text}
                </span>

                {activeIndex === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-jila-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>

      <div className="relative z-10 flex-1 overflow-auto bg-[#F5F5F5] mt-[-5px] flex flex-col">
        {activeTab.content}
      </div>
    </div>
  );
}
