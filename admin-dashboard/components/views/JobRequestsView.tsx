"use client";

import JobRequests from "@/components/jobs/JobRequests";

export default function JobRequestsView() {
  return (
    <div className="flex-1 px-10 py-6 overflow-hidden flex flex-col min-h-0 mb-7">
      <JobRequests />
    </div>
  );
}
