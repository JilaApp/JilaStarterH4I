"use client";

import JobPostingForm from "@/components/jobs/JobPostingForm";

interface JobAddViewProps {
  onBack: () => void;
}

export default function JobAddView({ onBack }: JobAddViewProps) {
  return (
    <div className="flex-1 px-10 py-6 overflow-y-auto">
      <JobPostingForm onBack={onBack} />
    </div>
  );
}
