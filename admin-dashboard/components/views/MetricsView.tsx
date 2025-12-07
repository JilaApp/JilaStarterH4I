"use client";

import { Users, Video, Briefcase, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MetricsView() {
  const {
    data: metrics,
    isLoading,
    error,
  } = trpc.metrics.getMetrics.useQuery();

  if (isLoading) {
    return (
      <div className="flex-1 px-10 py-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 px-10 py-6 flex items-center justify-center">
        <p className="text-error-400 text-lg">
          Error loading metrics: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-10 py-6">
      <div className="mb-8">
        <p className="text-lg text-gray-300">
          Track metrics from across all communities using JILA!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Users} title="Users" amount={metrics?.users || 0} />
        <MetricCard
          icon={Video}
          title="Video resources"
          amount={metrics?.videos || 0}
        />
        <MetricCard
          icon={Briefcase}
          title="Job postings"
          amount={metrics?.jobs || 0}
        />
        <MetricCard
          icon={MessageCircle}
          title="Social service resources"
          amount={metrics?.socialServices || 0}
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  amount: number;
}

function MetricCard({ icon: Icon, title, amount }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-6 h-6 text-type-400" />
        <h3 className="text-sm text-type-400">{title}</h3>
      </div>
      <p className="text-3xl font-semibold text-jila-400">
        {amount.toLocaleString()}
      </p>
    </div>
  );
}
