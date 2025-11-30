"use client";

import JobPostings from "@/components/jobs/JobPostings";

interface JobPostingsViewProps {
  onNavigateToUpload: () => void;
}

export default function JobPostingsView({
  onNavigateToUpload,
}: JobPostingsViewProps) {
  return (
    <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
      <JobPostings onNavigateToUpload={onNavigateToUpload} />
    </div>
  );
}
