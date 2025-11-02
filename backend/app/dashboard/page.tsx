"use client";

import { useState, useEffect } from "react";
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
import SocialServiceForm from "@/components/SocialServiceForm";
import AuthWrapper from "../AuthWrapper";
import { trpc } from "@/lib/trpc";
import VideoEditModal from "@/components/VideoEditModal";

type FullVideoType = NonNullable<
  ReturnType<typeof trpc.videos.getAllVideos.useQuery>["data"]
>[0];

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

const topicMap: { [key: string]: TopicVariant } = {
  TRANSPORT: "Transport",
  TRANSPORTATION: "Transportation",
  LEGAL: "Legal",
  MEDICAL: "Medical",
  CAREER: "Career",
  EDUCATION: "Other",
  OTHER: "Other",
  EMERGENCIA: "Emergencia",
  SHELTERS: "Shelters",
  FOOD: "Food",
};

export default function DashboardDev() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<FullVideoType | null>(
    null,
  );

  const {
    data: videosData,
    isLoading: videosLoading,
    refetch: refetchVideos,
  } = trpc.videos.getAllVideos.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  const {
    data: socialServicesData,
    isLoading: socialServicesLoading,
    refetch: refetchSocialServices,
  } = trpc.socialServices.getAllSocialServices.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (activeView === "dashboard") {
      refetchVideos();
      refetchSocialServices();
    }
  }, [activeView, refetchVideos, refetchSocialServices]);

  const videoResourcesData: VideoResourceData[] =
    videosData?.map((video) => ({
      id: video.id,
      title: video.titleEnglish,
      topic: topicMap[video.topic] || "Other",
      phoneNumber: "N/A",
      link: video.url,
    })) || [];

  const socialServicesResourcesData: SocialServiceData[] =
    socialServicesData?.map((service) => ({
      id: service.id,
      title: service.title,
      topic: topicMap[service.category] || "Other",
      phoneNumber: service.phone_number,
      link: service.url || "N/A",
    })) || [];

  const videoColumns: ColumnDefinition<VideoResourceData>[] = [
    { header: "Title", accessorKey: "title" },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    { header: "Phone number", accessorKey: "phoneNumber" },
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
          {String(value)}
        </a>
      ),
    },
  ];

  const handleVideoRowClick = (id: number | string) => {
    const video = videosData?.find((v) => v.id === id);
    if (video) {
      setSelectedVideo(video);
      setIsEditingMode(false);
      setIsModalOpen(true);
    }
  };

  const handleVideoEdit = (id: number | string) => {
    const video = videosData?.find((v) => v.id === id);
    if (video) {
      setSelectedVideo(video);
      setIsEditingMode(true);
      setIsModalOpen(true);
    }
  };

  const handleVideoDelete = (id: number | string) => {
    console.log("Deleting Video:", id);
  };

  const socialColumns: ColumnDefinition<SocialServiceData>[] = [
    { header: "Title", accessorKey: "title" },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    { header: "Phone number", accessorKey: "phoneNumber" },
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
          {String(value)}
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
      header: { logo: <Video size={20} />, text: "Video resources" },
      content: videosLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
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
      header: { logo: <MessageCircle size={20} />, text: "Social services" },
      content: socialServicesLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={socialServicesResourcesData}
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
      <VideoEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateComplete={refetchVideos}
        isEditing={isEditingMode}
        videoData={selectedVideo}
      />
    </AuthWrapper>
  );
}
