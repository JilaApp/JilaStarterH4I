"use client";

import { useState } from "react";
import { Video, MessageCircle } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Table, { ColumnDefinition, DataRow } from "@/components/Table";
import TopicTag, { TopicVariant } from "@/components/TopicTag";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import VideoUploadForm from "@/components/VideoUploadForm";
import AuthWrapper from "../AuthWrapper";

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
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
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
          {new URL(String(value)).hostname}
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
          {new URL(String(value)).hostname}
        </a>
      ),
    },
  ];

  const handleSocialRowClick = (id: number | string) => {
    console.log("Social Service Row Clicked:", id);
  };

  const handleSocialEdit = (id: number | string) => {
    console.log("Editing Social Service:", id);
  };

  const handleSocialDelete = (id: number | string) => {
    console.log("Deleting Social Service:", id);
  };

  const dashboardTabs = [
    {
      header: {
        logo: <Video size={20} />,
        text: "Video resources",
      },
      content: (
        <Table
          data={videoResourcesData}
          columns={videoColumns}
          handleEdit={handleVideoEdit}
          handleDelete={handleVideoDelete}
          handleRowClick={handleVideoRowClick}
        />
      ),
    },
    {
      header: {
        logo: <MessageCircle size={20} />,
        text: "Social services",
      },
      content: (
        <Table
          data={socialServicesData}
          columns={socialColumns}
          handleEdit={handleSocialEdit}
          handleDelete={handleSocialDelete}
          handleRowClick={handleSocialRowClick}
        />
      ),
    },
  ];

  const uploadTabs = [
    {
      header: {
        logo: <Video size={20} />,
        text: "Video upload",
      },
      content: <VideoUploadForm />,
    },
    {
      header: {
        logo: <MessageCircle size={20} />,
        text: "Social services upload",
      },
      content: (
        <div>
          <span>Eepy</span>
          <VideoUploadForm />
        </div>
      ),
    },
  ];

  const getPageTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Your JILA! Dashboard";
      case "upload":
        return "Upload";
      case "jobs":
        return "Job board management";
      case "metrics":
        return "Metrics";
      default:
        return "Your JILA! Dashboard";
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div className="flex-shrink-0 px-10 mt-6">
              <FilterBar
                options={["Career", "Legal", "Medical", "Transport"]}
                selectedOptions={selectedFilters}
                setSelectedOptions={setSelectedFilters}
              />
            </div>

            <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
              <Tabs
                tabs={dashboardTabs}
                activeIndex={currentTabIndex}
                onTabChange={setCurrentTabIndex}
                rightElement={
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                }
              />
            </div>
          </>
        );
      case "upload":
        return (
          <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
            <Tabs
              tabs={uploadTabs}
              activeIndex={currentTabIndex}
              onTabChange={setCurrentTabIndex}
              rightElement={
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              }
            />
          </div>
        );
      case "jobs":
        return (
          <div className="flex-1 px-10 py-6">
            <p>jobs</p>
          </div>
        );
      case "metrics":
        return (
          <div className="flex-1 px-10 py-6">
            <p>metrics</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen overflow-hidden bg-[linear-gradient(348deg,_#7E0601_51.81%,_#E8965B_130.16%)]">
        <div className="fixed left-0 top-0 h-screen z-50">
          <Sidebar activeButton={activeView} setActiveButton={setActiveView} />
        </div>

        <div className="flex-1 ml-[196px] flex flex-col bg-cream-300 rounded-tl-[60px] overflow-hidden">
          <div className="flex-shrink-0 px-10 mt-6">
            <Header
              name={user?.emailAddresses[0]?.emailAddress || "User"}
              organization="Hack4Impact"
              title={getPageTitle()}
              onSignOut={() => signOut({ redirectUrl: "/sign-in" })}
            />
          </div>

          {renderContent()}
        </div>
      </div>
    </AuthWrapper>
  );
}
