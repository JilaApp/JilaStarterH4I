"use client";

import { Video, MessageCircle, Search, X } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Table, { ColumnDefinition, DataRow } from "@/components/Table";
import TopicTag, { TopicVariant } from "@/components/TopicTag";

interface VideoResourceData extends DataRow {
  id: number | string;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

interface SocialServiceData extends DataRow {
  id: number | string;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

export default function DashboardDev() {
  const [selectedOptions, setSelectedOptions] = useState([
    "Career",
    "Legal",
    "Medical",
    "Transport",
  ]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const videoResourcesData: VideoResourceData[] = [
    {
      id: "loans",
      title: "How to Take Out a Loan",
      topic: "Legal",
      phoneNumber: "217-403-6150",
      link: "https://www.google.com/",
    },
    {
      id: "use-bus-system",
      title: "How to Use the Bus System",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.mtd.com/",
    },
    {
      id: "driver-license",
      title: "How to Get a Driver's License",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://mckinley.illinois.edu/",
    },
    {
      id: "health-insurance",
      title: "How to Get Health Insurance",
      topic: "Medical",
      phoneNumber: "217-403-6150",
      link: "https://www.safe.com/",
    },
  ];

  const socialServicesData: SocialServiceData[] = [
    {
      id: "strides-shelter",
      title: "Strides Low Barrier Shelter",
      topic: "Food",
      phoneNumber: "217-403-6150",
      link: "https://www.google.com/",
    },
    {
      id: "cu-at-home",
      title: "C-U at Home",
      topic: "Food",
      phoneNumber: "217-819-4569",
      link: "https://www.google.com/",
    },
    {
      id: "emergency-shelter",
      title: "Emergency Shelter for Families",
      topic: "Transport",
      phoneNumber: "217-328-3313",
      link: "https://www.google.com/",
    },
    {
      id: "daily-bread",
      title: "Daily Bread Soup Kitchen",
      topic: "Transport",
      phoneNumber: "217-369-9344",
      link: "https://www.google.com/",
    },
    {
      id: "ride-bus-1",
      title: "How to Ride the Bus",
      topic: "Transport",
      phoneNumber: "2:44",
      link: "https://www.google.com/",
    },
    {
      id: "ride-bus-2",
      title: "How to Ride the Bus",
      topic: "Transport",
      phoneNumber: "2:44",
      link: "https://www.google.com/",
    },
    {
      id: "ride-bus-3",
      title: "How to Ride the Bus",
      topic: "Transport",
      phoneNumber: "2:44",
      link: "https://www.google.com/",
    },
    {
      id: "ride-bus-4",
      title: "How to Ride the Bus",
      topic: "Transport",
      phoneNumber: "2:44",
      link: "https://www.google.com/",
    },
    {
      id: "ride-bus-5",
      title: "How to Ride the Bus",
      topic: "Transport",
      phoneNumber: "2:44",
      link: "https://www.google.com/",
    },
  ];

  const videoColumns: ColumnDefinition<VideoResourceData>[] = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    {
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Link",
      accessorKey: "link",
      cell: (value) => (
        <a
          className="text-jila-400"
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          google.com
        </a>
      ),
    },
  ];

  const socialColumns: ColumnDefinition<SocialServiceData>[] = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    {
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Link",
      accessorKey: "link",
      cell: (value) => (
        <a
          className="text-jila-400"
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          google.com
        </a>
      ),
    },
  ];

  const handleVideoRowClick = (id: number | string) => {
    console.log("Video Row Clicked:", id);
  };

  const handleVideoEdit = (id: number | string) => {
    console.log("Editing Video:", id);
  };

  const handleVideoDelete = (id: number | string) => {
    console.log("Deleting Video:", id);
  };

  const handleSocialRowClick = (id: number | string) => {
    console.log("Social Service Row Clicked:", id);
  };

  const handleSocialEdit = (id: number | string) => {
    console.log("Editing Social Service:", id);
  };

  const handleSocialDelete = (id: number | string) => {
    console.log("Deleting Social Service:", id);
  };

  const handleClearFilters = () => {
    setSelectedOptions([]);
  };

  const handleFilterClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const tabs = [
    {
      id: "video-resources",
      icon: <Video size={20} />,
      label: "Video resources",
      data: videoResourcesData,
      columns: videoColumns,
      onEdit: handleVideoEdit,
      onDelete: handleVideoDelete,
      onRowClick: handleVideoRowClick,
    },
    {
      id: "social-services",
      icon: <MessageCircle size={20} />,
      label: "Social services",
      data: socialServicesData,
      columns: socialColumns,
      onEdit: handleSocialEdit,
      onDelete: handleSocialDelete,
      onRowClick: handleSocialRowClick,
    },
  ];

  const currentTab = tabs[currentTabIndex];

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(348deg,_#7E0601_51.81%,_#E8965B_130.16%)]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar activeButton="dashboard" setActiveButton={() => {}} />
      </div>
      <div className="flex-1 ml-[196px] flex flex-col bg-cream-300 rounded-tl-[60px] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-10 mt-6">
          <Header
            name="Sophia Kim"
            organization="Hack4Impact"
            title="Your JILA! Dashboard"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex-shrink-0 px-10 mt-6">
          <div className="flex items-center gap-3">
            {["Career", "Legal", "Medical", "Transport"].map((option) => (
              <button
                key={option}
                onClick={() => handleFilterClick(option)}
                className={`flex items-center gap-2 px-4 h-10 rounded-lg font-bold body2-desktop-text transition-colors ${
                  selectedOptions.includes(option)
                    ? "bg-jila-400 text-white hover:bg-type-400"
                    : "bg-white text-gray-400 hover:bg-gray-200"
                }`}
              >
                {option}
                {selectedOptions.includes(option) && (
                  <X size={16} strokeWidth={3} />
                )}
              </button>
            ))}
            {selectedOptions.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-jila-400 underline body2-desktop-text font-semibold whitespace-nowrap ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0">
          <div className="bg-[#F5F5F5] rounded-[20px] shadow-lg flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-3">
              <div className="flex gap-8">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTabIndex(index)}
                    className={`flex items-center gap-2 pb-2 border-b-[3px] transition-colors ${
                      currentTabIndex === index
                        ? "border-jila-400 text-type-400"
                        : "border-transparent text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    {tab.icon}
                    <span className="body2-desktop-text font-semibold whitespace-nowrap">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg w-96 bg-white">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none flex-1 body2-desktop-text placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#F5F5F5]">
              <Table
                data={currentTab.data}
                columns={currentTab.columns}
                handleEdit={currentTab.onEdit}
                handleDelete={currentTab.onDelete}
                handleRowClick={currentTab.onRowClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
