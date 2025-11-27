"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import Table from "@/components/data-display/Table";
import { ColumnDefinition, DataRow, JobFilters } from "@/lib/types";
import SearchBar from "@/components/data-display/SearchBar";
import { trpc } from "@/lib/trpc";
import JobPostingEditModal from "@/components/jobs/JobPostingEditModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { Jobs, JobStatus } from "@prisma/client";
import Link from "@/components/common/Link";
import JobFilter from "@/components/jobs/JobFilter";
import Tabs from "@/components/data-display/Tabs";
import BulkActionBar from "@/components/data-display/BulkActionBar";
import { useNotification } from "@/hooks/useNotification";

type FullJobType = Jobs;

interface JobResourceData extends DataRow {
  id: number | string;
  position: string;
  jobType: string;
  company: string;
  link: string;
}

interface JobPostingsProps {
  onNavigateToUpload?: () => void;
}

export default function JobPostings({
  onNavigateToUpload,
}: JobPostingsProps = {}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<JobFilters | null>(null);

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FullJobType | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDeleteId, setJobToDeleteId] = useState<string | number | null>(
    null,
  );
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const { showNotification, NotificationContainer } = useNotification();

  const {
    data: jobsData,
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = trpc.jobs.getAllJobs.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const deleteJobMutation = trpc.jobs.removeJob.useMutation({
    onSuccess: () => {
      refetchJobs();
      setSelectedRows([]);
    },
    onError: (error) => {
      console.error("Failed to delete job:", error);
      showNotification(`Error: ${error.message}`);
    },
  });

  const updateJobMutation = trpc.jobs.updateJob.useMutation({
    onSuccess: () => {
      refetchJobs();
      setSelectedRows([]);
    },
    onError: (error) => {
      console.error("Failed to update job:", error);
      showNotification(`Error: ${error.message}`);
    },
  });

  useEffect(() => {
    refetchJobs();
  }, [refetchJobs]);

  const jobTypeDisplayMap: Record<string, string> = {
    INTERNSHIP: "Internship",
    FULLTIME: "Full-time",
    PARTTIME: "Part-time",
    TEMPORARY: "Temporary",
    FREELANCE: "Freelance",
    SEASONAL: "Seasonal",
    QANJOBAL: "Q'anjob'al",
  };

  const jobResourcesData: JobResourceData[] = useMemo(
    () =>
      jobsData
        ?.map((job) => ({
          id: job.id,
          position: job.titleEnglish,
          jobType: jobTypeDisplayMap[job.jobType] || job.jobType,
          company: job.companyName,
          link: job.url,
          status: job.status,
        }))
        .sort((a, b) => a.position.localeCompare(b.position)) || [],
    [jobsData],
  );

  const jobColumns: ColumnDefinition<JobResourceData>[] = [
    { header: "Position", accessorKey: "position" },
    { header: "Job type", accessorKey: "jobType" },
    { header: "Company", accessorKey: "company" },
    {
      header: "Application link",
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

  const handleJobRowClick = (id: number | string) => {
    const job = jobsData?.find((j) => j.id === id);
    if (job) {
      setSelectedJob({
        ...job,
        expirationDate: new Date(job.expirationDate),
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      } as FullJobType);
      setIsEditingMode(false);
      setIsJobModalOpen(true);
    }
  };

  const handleJobEdit = (id: number | string) => {
    const job = jobsData?.find((j) => j.id === id);
    if (job) {
      setSelectedJob({
        ...job,
        expirationDate: new Date(job.expirationDate),
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      } as FullJobType);
      setIsEditingMode(true);
      setIsJobModalOpen(true);
    }
  };

  const handleJobDelete = (id: number | string) => {
    setJobToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDeleteId !== null) {
      deleteJobMutation.mutate({ id: jobToDeleteId });
    }
    setIsDeleteModalOpen(false);
    setJobToDeleteId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDeleteId(null);
  };

  const handleAddJobPosting = () => {
    if (onNavigateToUpload) {
      onNavigateToUpload();
    }
  };

  const handleBulkArchive = async () => {
    try {
      await Promise.all(
        selectedRows.map((id) => {
          const numericId = typeof id === "string" ? parseInt(id, 10) : id;
          return updateJobMutation.mutateAsync({
            id: numericId,
            status: JobStatus.ARCHIVED,
          });
        }),
      );
      refetchJobs();
      setSelectedRows([]);
    } catch (error) {
      console.error("Failed to archive jobs:", error);
      showNotification("Error archiving some jobs. Please try again.");
    }
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map((id) => deleteJobMutation.mutateAsync({ id })),
      );
      refetchJobs();
      setSelectedRows([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete jobs:", error);
      showNotification("Error deleting some jobs. Please try again.");
    }
  };

  const handleCloseBulkModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const applyFiltersToData = (data: JobResourceData[]) => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.position.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply advanced filters if they exist
    if (appliedFilters) {
      // Filter by location types (Remote, Hybrid, In person)
      if (
        appliedFilters.locationTypes &&
        appliedFilters.locationTypes.length > 0
      ) {
        filtered = filtered.filter((job) => {
          const jobData = jobsData?.find((j) => j.id === job.id);
          if (!jobData) return false;
          return appliedFilters.locationTypes!.some((type: string) => {
            if (type === "Remote") return jobData.locationType === "REMOTE";
            if (type === "Hybrid") return jobData.locationType === "HYBRID";
            if (type === "In person")
              return jobData.locationType === "INPERSON";
            return false;
          });
        });
      }

      // Filter by job types
      if (appliedFilters.jobTypes && appliedFilters.jobTypes.length > 0) {
        filtered = filtered.filter((job) => {
          const jobData = jobsData?.find((j) => j.id === job.id);
          if (!jobData) return false;
          return appliedFilters.jobTypes!.some((type: string) => {
            const typeMap: Record<string, string> = {
              Internship: "INTERNSHIP",
              "Full-time": "FULLTIME",
              "Part-time": "PARTTIME",
              Temporary: "TEMPORARY",
              Freelance: "FREELANCE",
              Seasonal: "SEASONAL",
            };
            return jobData.jobType === typeMap[type];
          });
        });
      }

      // Filter by speaker tags (accepted languages)
      if (appliedFilters.speakerTags && appliedFilters.speakerTags.length > 0) {
        filtered = filtered.filter((job) => {
          const jobData = jobsData?.find((j) => j.id === job.id);
          if (!jobData) return false;
          return appliedFilters.speakerTags!.some((tag: string) =>
            jobData.acceptedLanguages.includes(tag),
          );
        });
      }

      // Filter by salary range
      if (
        appliedFilters.minSalary !== undefined &&
        appliedFilters.maxSalary !== undefined
      ) {
        filtered = filtered.filter((job) => {
          const jobData = jobsData?.find((j) => j.id === job.id);
          if (!jobData) return false;
          return (
            jobData.salary >= appliedFilters.minSalary! &&
            jobData.salary <= appliedFilters.maxSalary!
          );
        });
      }

      // Filter by location search (city, state, zip)
      if (appliedFilters.locationSearch) {
        filtered = filtered.filter((job) => {
          const jobData = jobsData?.find((j) => j.id === job.id);
          if (!jobData) return false;
          const query = appliedFilters.locationSearch!.toLowerCase();
          const fullLocation =
            `${jobData.city}, ${jobData.state}`.toLowerCase();
          return (
            fullLocation.includes(query) ||
            jobData.city.toLowerCase().includes(query) ||
            jobData.state.toLowerCase().includes(query)
          );
        });
      }
    }

    return filtered;
  };

  const allJobsData = useMemo(
    () => applyFiltersToData(jobResourcesData),
    [jobResourcesData, searchQuery, appliedFilters, jobsData],
  );

  const activeJobsData = useMemo(
    () =>
      applyFiltersToData(
        jobResourcesData.filter((job) => job.status === JobStatus.ACTIVE),
      ),
    [jobResourcesData, searchQuery, appliedFilters, jobsData],
  );

  const archivedJobsData = useMemo(
    () =>
      applyFiltersToData(
        jobResourcesData.filter((job) => job.status === JobStatus.ARCHIVED),
      ),
    [jobResourcesData, searchQuery, appliedFilters, jobsData],
  );

  const tabs = [
    {
      header: {
        logo: <></>,
        text: `All ${allJobsData.length}`,
      },
      content: jobsLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={allJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      ),
    },
    {
      header: {
        logo: <></>,
        text: `Active ${activeJobsData.length}`,
      },
      content: jobsLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={activeJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      ),
    },
    {
      header: {
        logo: <></>,
        text: `Archived ${archivedJobsData.length}`,
      },
      content: jobsLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={archivedJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full w-full gap-0 relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-[5px]">
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full mb-[5px]">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
            defaultClassName="w-[404px] h-[46px]"
          />
          <button
            onClick={handleAddJobPosting}
            className="flex items-center gap-[10px] bg-jila-400 text-white px-[10px] py-[10px] h-[46px] rounded-[10px] hover:bg-type-400 cursor-pointer font-bold text-lg"
          >
            <Plus size={24} />
            Add job posting
          </button>
        </div>

        {/* Tabs Component */}
        <Tabs
          tabs={tabs}
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          rightElement={
            <button
              onClick={() => {
                if (!isFilterOpen) {
                  setSelectedRows([]);
                }
                setIsFilterOpen(!isFilterOpen);
              }}
              className="flex items-center gap-[6px] bg-white border border-gray-200 px-[10px] py-[20px] h-[39.39px] rounded-[10px] hover:bg-gray-100 cursor-pointer"
            >
              <SlidersHorizontal size={24} className="text-gray-300" />
              <span className="font-bold text-lg text-gray-300">Filter</span>
            </button>
          }
        />
      </div>

      {/* Filter Panel Overlay */}
      {isFilterOpen && (
        <JobFilter
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => setAppliedFilters(filters)}
          initialFilters={appliedFilters}
        />
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />

      {/* Modals */}
      <JobPostingEditModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onUpdateComplete={refetchJobs}
        isEditing={isEditingMode}
        jobData={selectedJob}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      <DeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={handleCloseBulkModal}
        onConfirm={handleConfirmBulkDelete}
      />

      {/* Notification */}
      <NotificationContainer />
    </div>
  );
}
