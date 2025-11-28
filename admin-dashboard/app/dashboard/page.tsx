"use client";

import { useState, useEffect, useMemo } from "react";
import { Video, MessageCircle } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Table from "@/components/Table";
import { ColumnDefinition, DataRow } from "@/lib/types";
import TopicTag from "@/components/TopicTag";
import type { TopicVariant } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import VideoUploadForm from "@/components/VideoUploadForm";
import SocialServiceForm from "@/components/SocialServiceForm";
import JobPostingForm from "@/components/JobPostingForm";
import AuthWrapper from "../AuthWrapper";
import { trpc } from "@/lib/trpc";
import VideoEditModal from "@/components/VideoEditModal";
import Link from "@/components/Link";
import DeleteModal from "@/components/DeleteModal";
import { Videos } from "@prisma/client";
import { TOPIC_MAP } from "@/lib/constants";
import SocialServiceEditModal from "@/components/SocialServiceModal";
import JobPostings from "@/components/JobPostings";
import { useNotification } from "@/hooks/useNotification";
import Pagination from "@/components/Pagination";

type FullVideoType = Omit<Videos, "audioFile">;

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
  const { showNotification, NotificationContainer } = useNotification();

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [videoCurrentPage, setVideoCurrentPage] = useState(1);
  const [socialCurrentPage, setSocialCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<FullVideoType | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDeleteId, setVideoToDeleteId] = useState<
    string | number | null
  >(null);

  const [isSocialServiceModalOpen, setIsSocialServiceModalOpen] =
    useState(false);
  const [isEditingSocialService, setIsEditingSocialService] = useState(false);
  const [selectedSocialService, setSelectedSocialService] = useState<
    any | null
  >(null);
  const [socialServiceToDeleteId, setSocialServiceToDeleteId] = useState<
    number | null
  >(null);

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

  const deleteVideoMutation = trpc.videos.removeVideo.useMutation({
    onSuccess: () => {
      refetchVideos();
    },
    onError: (error) => {
      console.error("Failed to delete video:", error);
      showNotification(`Error: ${error.message}`);
    },
  });

  const deleteSocialServiceMutation =
    trpc.socialServices.removeSocialService.useMutation({
      onSuccess: () => {
        refetchSocialServices();
      },
      onError: (error) => {
        console.error("Failed to delete social service:", error);
        showNotification(`Error: ${error.message}`);
      },
    });

  useEffect(() => {
    if (activeView === "dashboard") {
      refetchVideos();
      refetchSocialServices();
    }
  }, [activeView, refetchVideos, refetchSocialServices]);

  useEffect(() => {
    setVideoCurrentPage(1);
    setSocialCurrentPage(1);
  }, [selectedFilters, searchQuery]);

  const videoResourcesData: VideoResourceData[] = useMemo(
    () =>
      videosData
        ?.map((video) => ({
          id: video.id,
          title: video.titleEnglish,
          topic: TOPIC_MAP[video.topic] || "Other",
          phoneNumber: "N/A",
          link: video.urls[0],
        }))
        .sort((a, b) => a.title.localeCompare(b.title)) || [],
    [videosData]
  );

  const socialServicesResourcesData: SocialServiceData[] = useMemo(
    () =>
      socialServicesData
        ?.map((service) => ({
          id: service.id,
          title: service.title,
          topic: TOPIC_MAP[service.category] || "Other",
          phoneNumber: service.phone_number,
          link: service.url || "N/A",
        }))
        .sort((a, b) => a.title.localeCompare(b.title)) || [],
    [socialServicesData]
  );

  const filteredVideoData = useMemo(
    () =>
      videoResourcesData
        .filter(
          (item) =>
            selectedFilters.length === 0 || selectedFilters.includes(item.topic)
        )
        .filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [videoResourcesData, selectedFilters, searchQuery]
  );

  const filteredSocialServicesData = useMemo(
    () =>
      socialServicesResourcesData
        .filter(
          (item) =>
            selectedFilters.length === 0 || selectedFilters.includes(item.topic)
        )
        .filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [socialServicesResourcesData, selectedFilters, searchQuery]
  );

  const videoTotalPages = Math.ceil(filteredVideoData.length / itemsPerPage);
  const paginatedVideoData = useMemo(
    () =>
      filteredVideoData.slice(
        (videoCurrentPage - 1) * itemsPerPage,
        videoCurrentPage * itemsPerPage
      ),
    [filteredVideoData, videoCurrentPage]
  );

  const socialTotalPages = Math.ceil(
    filteredSocialServicesData.length / itemsPerPage
  );
  const paginatedSocialData = useMemo(
    () =>
      filteredSocialServicesData.slice(
        (socialCurrentPage - 1) * itemsPerPage,
        socialCurrentPage * itemsPerPage
      ),
    [filteredSocialServicesData, socialCurrentPage]
  );

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
        <Link
          href={String(value)}
          external
          onClick={(e) => e.stopPropagation()}
        >
          {String(value)}
        </Link>
      ),
    },
  ];

  const handleVideoRowClick = (id: number | string) => {
    const video = videosData?.find((v) => v.id === id);
    if (video) {
      setSelectedVideo({
        ...video,
        uploadDate: new Date(video.uploadDate),
      });
      setIsEditingMode(false);
      setIsVideoModalOpen(true);
    }
  };

  const handleVideoEdit = (id: number | string) => {
    const video = videosData?.find((v) => v.id === id);
    if (video) {
      setSelectedVideo({
        ...video,
        uploadDate: new Date(video.uploadDate),
      });
      setIsEditingMode(true);
      setIsVideoModalOpen(true);
    }
  };

  const handleVideoDelete = (id: number | string) => {
    setVideoToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (videoToDeleteId !== null) {
      deleteVideoMutation.mutate({ id: videoToDeleteId });
    }
    if (socialServiceToDeleteId !== null) {
      deleteSocialServiceMutation.mutate({ id: socialServiceToDeleteId });
    }
    setIsDeleteModalOpen(false);
    setVideoToDeleteId(null);
    setSocialServiceToDeleteId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVideoToDeleteId(null);
    setSocialServiceToDeleteId(null);
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
        <Link
          href={String(value)}
          external
          onClick={(e) => e.stopPropagation()}
        >
          {String(value)}
        </Link>
      ),
    },
  ];

  const handleSocialRowClick = (id: number | string) => {
    const service = socialServicesData?.find((s) => s.id === id);
    if (service) {
      setSelectedSocialService(service);
      setIsEditingSocialService(false);
      setIsSocialServiceModalOpen(true);
    }
  };

  const handleSocialEdit = (id: number | string) => {
    const service = socialServicesData?.find((s) => s.id === id);
    if (service) {
      setSelectedSocialService(service);
      setIsEditingSocialService(true);
      setIsSocialServiceModalOpen(true);
    }
  };

  const handleSocialDelete = (id: string | number) => {
    const numericId = typeof id === "string" ? parseInt(id) : id;
    setSocialServiceToDeleteId(numericId);
    setIsDeleteModalOpen(true);
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
          data={paginatedVideoData}
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
          data={paginatedSocialData}
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
      case "job-add":
        return "Job board management";
      case "job-requests":
        return "Job requests";
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
            <div className="flex-shrink-0 px-10">
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
              {currentTabIndex === 0 && videoTotalPages > 0 && (
                <div className="mt-4">
                  <Pagination
                    numOptions={videoTotalPages}
                    selectedOption={videoCurrentPage}
                    onChange={setVideoCurrentPage}
                  />
                </div>
              )}
              {currentTabIndex === 1 && socialTotalPages > 0 && (
                <div className="mt-4">
                  <Pagination
                    numOptions={socialTotalPages}
                    selectedOption={socialCurrentPage}
                    onChange={setSocialCurrentPage}
                  />
                </div>
              )}
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
          <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
            <JobPostings
              onNavigateToUpload={() => {
                setActiveView("job-add");
              }}
            />
          </div>
        );
      case "job-add":
        return (
          <div className="flex-1 px-10 py-6 overflow-y-auto">
            <JobPostingForm
              onBack={() => {
                setActiveView("jobs");
              }}
            />
          </div>
        );
      case "job-requests":
        return (
          <div className="flex-1 px-10 py-6">
            <p>job requests</p>
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
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUpdateComplete={refetchVideos}
        isEditing={isEditingMode}
        videoData={selectedVideo}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      <SocialServiceEditModal
        isOpen={isSocialServiceModalOpen}
        onClose={() => setIsSocialServiceModalOpen(false)}
        onUpdateComplete={refetchSocialServices}
        isEditing={isEditingSocialService}
        serviceData={selectedSocialService}
      />

      {/* Notification */}
      <NotificationContainer />
    </AuthWrapper>
  );
}
