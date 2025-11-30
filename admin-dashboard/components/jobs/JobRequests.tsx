"use client";

import { useState, useEffect, useMemo } from "react";
import Table from "@/components/shared/Table";
import { ColumnDefinition, DataRow } from "@/lib/types";
import SearchBar from "@/components/forms/SearchBar";
import { trpc } from "@/lib/trpc";
import { Jobs, JobStatus } from "@prisma/client";
import Link from "@/components/shared/Link";
import Tabs from "@/components/shared/Tabs";
import JobRequestBulkBar from "@/components/jobs/JobRequestBulkBar";
import JobRequestModal from "@/components/jobs/JobRequestModal";
import { useNotification } from "@/hooks/useNotification";
import { logger } from "@/lib/logger";
import { FullJobType } from "@/lib/types";

interface JobRequestTableData extends DataRow {
  id: number;
  position: string;
  dateSubmitted: string;
  company: string;
  link: string;
  status: JobStatus;
}

export default function JobRequests() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobRequest, setSelectedJobRequest] =
    useState<FullJobType | null>(null);

  const { showNotification, NotificationContainer } = useNotification();

  const {
    data: pendingJobsData,
    isLoading: pendingJobsLoading,
    refetch: refetchPendingJobs,
  } = trpc.jobs.getPendingJobRequests.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const {
    data: reviewedJobsData,
    isLoading: reviewedJobsLoading,
    refetch: refetchReviewedJobs,
  } = trpc.jobs.getReviewedJobRequests.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const approveJobMutation = trpc.jobs.approveJobRequest.useMutation({
    onSuccess: () => {
      refetchPendingJobs();
      refetchReviewedJobs();
      setSelectedRows([]);
      showNotification("Job postings approved", "success");
    },
    onError: (error) => {
      logger.error("[approveJobMutation] Failed to approve job request", error);
      showNotification(
        "Failed to approve job request. Please try again.",
        "error",
      );
    },
  });

  const denyJobMutation = trpc.jobs.denyJobRequest.useMutation({
    onSuccess: () => {
      refetchPendingJobs();
      refetchReviewedJobs();
      setSelectedRows([]);
      showNotification("Job posting deleted", "error");
    },
    onError: (error) => {
      logger.error("[denyJobMutation] Failed to deny job request", error);
      showNotification(
        "Failed to deny job request. Please try again.",
        "error",
      );
    },
  });

  const bulkApproveJobsMutation = trpc.jobs.bulkApproveJobRequests.useMutation({
    onSuccess: () => {
      refetchPendingJobs();
      refetchReviewedJobs();
      setSelectedRows([]);
      showNotification("Job postings approved", "success");
    },
    onError: (error) => {
      logger.error(
        "[bulkApproveJobsMutation] Failed to bulk approve job requests",
        error,
      );
      showNotification(
        "Failed to approve job requests. Please try again.",
        "error",
      );
    },
  });

  const bulkDenyJobsMutation = trpc.jobs.bulkDenyJobRequests.useMutation({
    onSuccess: () => {
      refetchPendingJobs();
      refetchReviewedJobs();
      setSelectedRows([]);
      showNotification("Job posting deleted", "error");
    },
    onError: (error) => {
      logger.error(
        "[bulkDenyJobsMutation] Failed to bulk deny job requests",
        error,
      );
      showNotification(
        "Failed to deny job requests. Please try again.",
        "error",
      );
    },
  });

  useEffect(() => {
    refetchPendingJobs();
    refetchReviewedJobs();
  }, [refetchPendingJobs, refetchReviewedJobs]);

  const jobRequestColumns: ColumnDefinition<JobRequestTableData>[] = [
    { header: "Position", accessorKey: "position" },
    { header: "Date submitted", accessorKey: "dateSubmitted" },
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

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const pendingJobsResourcesData: JobRequestTableData[] = useMemo(
    () =>
      pendingJobsData
        ?.map((job) => ({
          id: job.id,
          position: job.titleEnglish,
          dateSubmitted: formatDate(job.createdAt),
          company: job.companyName,
          link: job.url,
          status: job.status,
        }))
        .sort(
          (a, b) =>
            new Date(b.dateSubmitted).getTime() -
            new Date(a.dateSubmitted).getTime(),
        ) || [],
    [pendingJobsData],
  );

  const reviewedJobsResourcesData: JobRequestTableData[] = useMemo(
    () =>
      reviewedJobsData
        ?.map((job) => ({
          id: job.id,
          position: job.titleEnglish,
          dateSubmitted: formatDate(job.createdAt),
          company: job.companyName,
          link: job.url,
          status: job.status,
        }))
        .sort(
          (a, b) =>
            new Date(b.dateSubmitted).getTime() -
            new Date(a.dateSubmitted).getTime(),
        ) || [],
    [reviewedJobsData],
  );

  const filteredPendingJobs = useMemo(
    () =>
      pendingJobsResourcesData.filter((item) =>
        item.position.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [pendingJobsResourcesData, searchQuery],
  );

  const filteredReviewedJobs = useMemo(
    () =>
      reviewedJobsResourcesData.filter((item) =>
        item.position.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [reviewedJobsResourcesData, searchQuery],
  );

  const handleJobRequestRowClick = (id: number) => {
    const job =
      activeTabIndex === 0
        ? pendingJobsData?.find((j) => j.id === id)
        : reviewedJobsData?.find((j) => j.id === id);
    if (job) {
      setSelectedJobRequest({
        ...job,
        expirationDate: new Date(job.expirationDate),
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      } as FullJobType);
      setIsModalOpen(true);
    }
  };

  const handleJobRequestApprove = (id: number) => {
    approveJobMutation.mutate({ id });
  };

  const handleJobRequestDeny = (id: number) => {
    denyJobMutation.mutate({ id });
  };

  const handleBulkApprove = () => {
    bulkApproveJobsMutation.mutate({ ids: selectedRows });
  };

  const handleBulkDeny = () => {
    bulkDenyJobsMutation.mutate({ ids: selectedRows });
  };

  const handleModalApprove = () => {
    if (selectedJobRequest) {
      approveJobMutation.mutate({ id: selectedJobRequest.id });
    }
  };

  const handleModalDeny = () => {
    if (selectedJobRequest) {
      denyJobMutation.mutate({ id: selectedJobRequest.id });
    }
  };

  const tabs = [
    {
      header: {
        logo: <></>,
        text: "Pending review",
      },
      content: pendingJobsLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={filteredPendingJobs}
          columns={jobRequestColumns}
          handleApprove={handleJobRequestApprove}
          handleDeny={handleJobRequestDeny}
          handleRowClick={handleJobRequestRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
        />
      ),
    },
    {
      header: {
        logo: <></>,
        text: "Reviewed",
      },
      content: reviewedJobsLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      ) : (
        <Table
          data={filteredReviewedJobs}
          columns={jobRequestColumns}
          handleRowClick={handleJobRequestRowClick}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
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
            placeholder={
              activeTabIndex === 0
                ? "Search pending requests"
                : "Search reviewed requests"
            }
            defaultClassName="w-[404px] h-[46px]"
          />
        </div>

        <Tabs
          tabs={tabs}
          activeIndex={activeTabIndex}
          onTabChange={(index) => {
            setActiveTabIndex(index);
            setSelectedRows([]);
          }}
        />
      </div>

      {activeTabIndex === 0 && (
        <JobRequestBulkBar
          selectedCount={selectedRows.length}
          onApprove={handleBulkApprove}
          onDeny={handleBulkDeny}
        />
      )}

      <JobRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleModalApprove}
        onDeny={handleModalDeny}
        onUpdateComplete={() => {
          refetchPendingJobs();
          refetchReviewedJobs();
        }}
        jobData={selectedJobRequest}
      />

      <NotificationContainer />
    </div>
  );
}
