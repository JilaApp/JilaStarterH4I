"use client";

import { useState, useEffect, useMemo } from "react";
import { Video, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Table from "@/components/shared/Table";
import { ColumnDefinition, DataRow } from "@/lib/types";
import TopicTag from "@/components/shared/TopicTag";
import type { TopicVariant } from "@/lib/types";
import FilterBar from "@/components/shared/FilterBar";
import SearchBar from "@/components/forms/SearchBar";
import Tabs from "@/components/shared/Tabs";
import Link from "@/components/shared/Link";
import { Videos, SocialServices } from "@prisma/client";
import { TOPIC_MAP } from "@/lib/constants";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { trpc } from "@/lib/trpc";
import VideoEditModal from "@/components/videos/VideoEditModal";
import DeleteModal from "@/components/shared/DeleteModal";
import SocialServiceEditModal from "@/components/social-services/SocialServiceModal";
import { useNotification } from "@/hooks/useNotification";
import { logger } from "@/lib/logger";
import EmptyState from "@/components/shared/EmptyState";

type FullVideoType = Videos;

interface VideoResourceData extends DataRow {
  id: number;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

interface SocialServiceData extends DataRow {
  id: number;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

export default function DashboardView() {
  const router = useRouter();
  const { showNotification, NotificationContainer } = useNotification();

  // Tab and filter state
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [socialSearchQuery, setSocialSearchQuery] = useState("");

  // Pagination state
  const [videoCurrentPage, setVideoCurrentPage] = useState(1);
  const [socialCurrentPage, setSocialCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<FullVideoType | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDeleteId, setVideoToDeleteId] = useState<number | null>(null);

  const [isSocialServiceModalOpen, setIsSocialServiceModalOpen] =
    useState(false);
  const [isEditingSocialService, setIsEditingSocialService] = useState(false);
  const [selectedSocialService, setSelectedSocialService] =
    useState<SocialServices | null>(null);
  const [socialServiceToDeleteId, setSocialServiceToDeleteId] = useState<
    number | null
  >(null);

  // Data fetching
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

  // Mutations
  const deleteVideoMutation = trpc.videos.removeVideo.useMutation({
    onSuccess: () => {
      refetchVideos();
    },
    onError: (error) => {
      logger.error("[deleteVideoMutation] Failed to delete video", error);
      showNotification("Failed to delete video. Please try again.");
    },
  });

  const deleteSocialServiceMutation =
    trpc.socialServices.removeSocialService.useMutation({
      onSuccess: () => {
        refetchSocialServices();
      },
      onError: (error) => {
        logger.error(
          "[deleteSocialServiceMutation] Failed to delete social service",
          error,
        );
        showNotification("Failed to delete social service. Please try again.");
      },
    });

  useEffect(() => {
    setVideoCurrentPage(1);
  }, [selectedFilters, videoSearchQuery]);

  useEffect(() => {
    setSocialCurrentPage(1);
  }, [selectedFilters, socialSearchQuery]);

  useEffect(() => {
    setSelectedFilters([]);
  }, [currentTabIndex]);

  const filterOptions = useMemo(() => {
    if (currentTabIndex === 0) {
      return ["Career", "Legal", "Medical", "Transport", "Other"];
    } else {
      return ["Food", "Emergencia", "Transportation", "Shelters", "Other"];
    }
  }, [currentTabIndex]);

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
    [videosData],
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
    [socialServicesData],
  );

  const filteredVideoData = useMemo(
    () =>
      videoResourcesData
        .filter(
          (item) =>
            selectedFilters.length === 0 ||
            selectedFilters.includes(item.topic),
        )
        .filter((item) =>
          item.title.toLowerCase().includes(videoSearchQuery.toLowerCase()),
        ),
    [videoResourcesData, selectedFilters, videoSearchQuery],
  );

  const filteredSocialServicesData = useMemo(
    () =>
      socialServicesResourcesData
        .filter(
          (item) =>
            selectedFilters.length === 0 ||
            selectedFilters.includes(item.topic),
        )
        .filter((item) =>
          item.title.toLowerCase().includes(socialSearchQuery.toLowerCase()),
        ),
    [socialServicesResourcesData, selectedFilters, socialSearchQuery],
  );

  const videoTotalPages = Math.ceil(filteredVideoData.length / itemsPerPage);
  const paginatedVideoData = useMemo(
    () =>
      filteredVideoData.slice(
        (videoCurrentPage - 1) * itemsPerPage,
        videoCurrentPage * itemsPerPage,
      ),
    [filteredVideoData, videoCurrentPage],
  );

  const socialTotalPages = Math.ceil(
    filteredSocialServicesData.length / itemsPerPage,
  );
  const paginatedSocialData = useMemo(
    () =>
      filteredSocialServicesData.slice(
        (socialCurrentPage - 1) * itemsPerPage,
        socialCurrentPage * itemsPerPage,
      ),
    [filteredSocialServicesData, socialCurrentPage],
  );

  // Handlers
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

  const handleVideoDelete = (id: number) => {
    setVideoToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

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

  const handleSocialDelete = (id: number) => {
    setSocialServiceToDeleteId(id);
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

  const hasFilters = Boolean(
    videoSearchQuery || socialSearchQuery || selectedFilters.length > 0,
  );
  const isVideoFiltered =
    hasFilters &&
    filteredVideoData.length === 0 &&
    videoResourcesData.length > 0;
  const isSocialFiltered =
    hasFilters &&
    filteredSocialServicesData.length === 0 &&
    socialServicesResourcesData.length > 0;

  const getEmptyState = (isFiltered: boolean) => (
    <EmptyState
      heading="No items added"
      subtext="Add social services and video resources through the upload forms"
      showButton={true}
      buttonLabel="Add resource"
      onButtonClick={() => router.push("/dashboard/upload")}
      isFiltered={isFiltered}
    />
  );

  const dashboardTabs = [
    {
      header: { logo: <Video size={20} />, text: "Video resources" },
      content: videosLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={paginatedVideoData}
          columns={videoColumns}
          handleEdit={handleVideoEdit}
          handleDelete={handleVideoDelete}
          handleRowClick={handleVideoRowClick}
          emptyState={getEmptyState(isVideoFiltered)}
        />
      ),
    },
    {
      header: { logo: <MessageCircle size={20} />, text: "Social services" },
      content: socialServicesLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          data={paginatedSocialData}
          columns={socialColumns}
          handleEdit={handleSocialEdit}
          handleDelete={handleSocialDelete}
          handleRowClick={handleSocialRowClick}
          emptyState={getEmptyState(isSocialFiltered)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex-shrink-0 px-10">
        <FilterBar
          options={filterOptions}
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
            <SearchBar
              value={
                currentTabIndex === 0 ? videoSearchQuery : socialSearchQuery
              }
              onChange={
                currentTabIndex === 0
                  ? setVideoSearchQuery
                  : setSocialSearchQuery
              }
            />
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

      {/* Modals */}
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
      <NotificationContainer />
    </>
  );
}
