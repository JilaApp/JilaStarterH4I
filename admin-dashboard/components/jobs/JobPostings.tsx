"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import Table from "@/components/shared/Table";
import { ColumnDefinition, DataRow, JobFilters } from "@/lib/types";
import SearchBar from "@/components/forms/SearchBar";
import { trpc } from "@/lib/trpc";
import JobPostingEditModal from "@/components/jobs/JobPostingEditModal";
import DeleteModal from "@/components/shared/DeleteModal";
import { Jobs, JobStatus } from "@prisma/client";
import Link from "@/components/shared/Link";
import JobFilter from "@/components/jobs/JobFilter";
import Tabs from "@/components/shared/Tabs";
import BulkActionBar from "@/components/shared/BulkActionBar";
import { useNotification } from "@/hooks/useNotification";
import Pagination from "@/components/shared/Pagination";
import { logger } from "@/lib/logger";
import { FullJobType } from "@/lib/types";
import EmptyState from "@/components/shared/EmptyState";
import AddButton from "@/components/shared/AddButton";

interface JobResourceData extends DataRow {
  id: number;
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

  const [allJobsCurrentPage, setAllJobsCurrentPage] = useState(1);
  const [activeJobsCurrentPage, setActiveJobsCurrentPage] = useState(1);
  const [archivedJobsCurrentPage, setArchivedJobsCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FullJobType | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDeleteId, setJobToDeleteId] = useState<number | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
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
      logger.error("[deleteJobMutation] Failed to delete job", error);
      showNotification("Failed to delete job. Please try again.");
    },
  });

  const updateJobMutation = trpc.jobs.updateJob.useMutation({
    onSuccess: () => {
      refetchJobs();
      setSelectedRows([]);
    },
    onError: (error) => {
      logger.error("[updateJobMutation] Failed to update job", error);
      showNotification("Failed to update job. Please try again.");
    },
  });

  const jobResourcesData: JobResourceData[] = useMemo(() => {
    const jobTypeDisplayMap: Record<string, string> = {
      INTERNSHIP: "Internship",
      FULLTIME: "Full-time",
      PARTTIME: "Part-time",
      TEMPORARY: "Temporary",
      FREELANCE: "Freelance",
      SEASONAL: "Seasonal",
      QANJOBAL: "Q'anjob'al",
    };

    return (
      jobsData
        ?.map((job: NonNullable<typeof jobsData>[number]) => ({
          id: job.id,
          position: job.titleEnglish,
          jobType: jobTypeDisplayMap[job.jobType] || job.jobType,
          company: job.companyName,
          link: job.url,
          status: job.status,
        }))
        .sort((a: JobResourceData, b: JobResourceData) =>
          a.position.localeCompare(b.position),
        ) || []
    );
  }, [jobsData]);

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

  const handleJobRowClick = (id: number) => {
    const job = jobsData?.find(
      (j: NonNullable<typeof jobsData>[number]) => j.id === id,
    );
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

  const handleJobEdit = (id: number) => {
    const job = jobsData?.find(
      (j: NonNullable<typeof jobsData>[number]) => j.id === id,
    );
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

  const handleJobDelete = (id: number) => {
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
          return updateJobMutation.mutateAsync({
            id: id,
            status: JobStatus.ARCHIVED,
          });
        }),
      );
      refetchJobs();
      setSelectedRows([]);
    } catch (error) {
      logger.error("[handleBulkArchive] Failed to archive jobs", error);
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
      logger.error("[handleConfirmBulkDelete] Failed to delete jobs", error);
      showNotification("Error deleting some jobs. Please try again.");
    }
  };

  const handleCloseBulkModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const applyFiltersToData = useCallback(
    (data: JobResourceData[]) => {
      let filtered = data;

      if (searchQuery) {
        filtered = filtered.filter((item) =>
          item.position.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (appliedFilters) {
        if (
          appliedFilters.locationTypes &&
          appliedFilters.locationTypes.length > 0
        ) {
          filtered = filtered.filter((job) => {
            const jobData = jobsData?.find(
              (j: NonNullable<typeof jobsData>[number]) => j.id === job.id,
            );
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

        if (appliedFilters.jobTypes && appliedFilters.jobTypes.length > 0) {
          filtered = filtered.filter((job) => {
            const jobData = jobsData?.find(
              (j: NonNullable<typeof jobsData>[number]) => j.id === job.id,
            );
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

        if (
          appliedFilters.speakerTags &&
          appliedFilters.speakerTags.length > 0
        ) {
          filtered = filtered.filter((job) => {
            const jobData = jobsData?.find(
              (j: NonNullable<typeof jobsData>[number]) => j.id === job.id,
            );
            if (!jobData) return false;
            return appliedFilters.speakerTags!.some((tag: string) =>
              jobData.acceptedLanguages.includes(tag),
            );
          });
        }

        if (
          appliedFilters.minSalary !== undefined &&
          appliedFilters.maxSalary !== undefined
        ) {
          filtered = filtered.filter((job) => {
            const jobData = jobsData?.find(
              (j: NonNullable<typeof jobsData>[number]) => j.id === job.id,
            );
            if (!jobData) return false;
            return (
              jobData.salary >= appliedFilters.minSalary! &&
              jobData.salary <= appliedFilters.maxSalary!
            );
          });
        }

        if (appliedFilters.locationSearch) {
          filtered = filtered.filter((job) => {
            const jobData = jobsData?.find(
              (j: NonNullable<typeof jobsData>[number]) => j.id === job.id,
            );
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
    },
    [searchQuery, appliedFilters, jobsData],
  );

  const allJobsData = useMemo(
    () => applyFiltersToData(jobResourcesData),
    [jobResourcesData, applyFiltersToData],
  );

  const activeJobsData = useMemo(
    () =>
      applyFiltersToData(
        jobResourcesData.filter((job) => job.status === JobStatus.ACTIVE),
      ),
    [jobResourcesData, applyFiltersToData],
  );

  const archivedJobsData = useMemo(
    () =>
      applyFiltersToData(
        jobResourcesData.filter((job) => job.status === JobStatus.ARCHIVED),
      ),
    [jobResourcesData, applyFiltersToData],
  );

  const allJobsTotalPages = Math.ceil(allJobsData.length / itemsPerPage);
  const paginatedAllJobsData = useMemo(
    () =>
      allJobsData.slice(
        (allJobsCurrentPage - 1) * itemsPerPage,
        allJobsCurrentPage * itemsPerPage,
      ),
    [allJobsData, allJobsCurrentPage],
  );

  const activeJobsTotalPages = Math.ceil(activeJobsData.length / itemsPerPage);
  const paginatedActiveJobsData = useMemo(
    () =>
      activeJobsData.slice(
        (activeJobsCurrentPage - 1) * itemsPerPage,
        activeJobsCurrentPage * itemsPerPage,
      ),
    [activeJobsData, activeJobsCurrentPage],
  );

  const archivedJobsTotalPages = Math.ceil(
    archivedJobsData.length / itemsPerPage,
  );
  const paginatedArchivedJobsData = useMemo(
    () =>
      archivedJobsData.slice(
        (archivedJobsCurrentPage - 1) * itemsPerPage,
        archivedJobsCurrentPage * itemsPerPage,
      ),
    [archivedJobsData, archivedJobsCurrentPage],
  );

  useEffect(() => {
    setAllJobsCurrentPage(1);
    setActiveJobsCurrentPage(1);
    setArchivedJobsCurrentPage(1);
  }, [searchQuery, appliedFilters]);

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
          data={paginatedAllJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          emptyState={
            <EmptyState
              heading="No job postings added"
              subtext="Get started by adding a new job"
              showButton={true}
              buttonLabel="Add job posting"
              onButtonClick={handleAddJobPosting}
            />
          }
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
          data={paginatedActiveJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          emptyState={
            <EmptyState
              heading="No job postings added"
              subtext="Get started by adding a new job"
              showButton={true}
              buttonLabel="Add job posting"
              onButtonClick={handleAddJobPosting}
            />
          }
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
          data={paginatedArchivedJobsData}
          columns={jobColumns}
          handleEdit={handleJobEdit}
          handleDelete={handleJobDelete}
          handleRowClick={handleJobRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          emptyState={
            <EmptyState
              heading="No job postings added"
              subtext="Get started by adding a new job"
              showButton={true}
              buttonLabel="Add job posting"
              onButtonClick={handleAddJobPosting}
            />
          }
        />
      ),
    },
  ];

  return (
    <div className="flex h-full w-full gap-0 relative">
      <div className="flex-1 flex flex-col gap-[5px]">
        <div className="flex items-center justify-between w-full mb-[5px]">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
            defaultClassName="w-[404px] h-[46px]"
          />
          <AddButton onClick={handleAddJobPosting} label="Add job posting" />
        </div>

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

        {activeTabIndex === 0 && allJobsTotalPages > 0 && (
          <div className="mt-4">
            <Pagination
              numOptions={allJobsTotalPages}
              selectedOption={allJobsCurrentPage}
              onChange={setAllJobsCurrentPage}
            />
          </div>
        )}
        {activeTabIndex === 1 && activeJobsTotalPages > 0 && (
          <div className="mt-4">
            <Pagination
              numOptions={activeJobsTotalPages}
              selectedOption={activeJobsCurrentPage}
              onChange={setActiveJobsCurrentPage}
            />
          </div>
        )}
        {activeTabIndex === 2 && archivedJobsTotalPages > 0 && (
          <div className="mt-4">
            <Pagination
              numOptions={archivedJobsTotalPages}
              selectedOption={archivedJobsCurrentPage}
              onChange={setArchivedJobsCurrentPage}
            />
          </div>
        )}
      </div>

      {isFilterOpen && (
        <JobFilter
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => setAppliedFilters(filters)}
          initialFilters={appliedFilters}
        />
      )}

      <BulkActionBar
        selectedCount={selectedRows.length}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />

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

      <NotificationContainer />
    </div>
  );
}
