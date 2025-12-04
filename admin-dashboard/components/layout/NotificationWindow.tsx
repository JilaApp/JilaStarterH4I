import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BaseSideModal from "@/components/shared/BaseSideModal";
import { Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface NotificationWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get time difference in human-readable format
const getTimeAgo = (date: Date | string) => {
  const now = Date.now();
  const diffMs = now - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export default function NotificationWindow({
  isOpen,
  onClose,
}: NotificationWindowProps) {
  const router = useRouter();
  const [readInSession, setReadInSession] = useState<Set<number>>(new Set());

  const {
    data: pendingJobs,
    isLoading,
    refetch,
  } = trpc.jobs.getPendingJobRequests.useQuery(undefined, {
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const markAsReadMutation = trpc.jobs.markJobRequestsAsRead.useMutation();

  // Mark all unread notifications as read when window opens
  useEffect(() => {
    if (isOpen && pendingJobs) {
      const unreadIds = pendingJobs
        .filter((job) => job.unread)
        .map((job) => job.id);

      if (unreadIds.length > 0) {
        markAsReadMutation.mutateAsync({ ids: unreadIds });
        setReadInSession(new Set(unreadIds));
      }
    } else if (!isOpen) {
      // Reset readInSession when modal closes
      setReadInSession(new Set());
    }
  }, [isOpen, pendingJobs]);

  // Show notifications that are unread OR were marked as read in this session
  const notifications = useMemo(() => {
    if (!pendingJobs) return [];

    return pendingJobs
      .filter((job) => job.unread || readInSession.has(job.id))
      .map((job) => ({
        id: job.id,
        email: job.businessContactEmail,
        jobTitle: job.titleEnglish,
        timestamp: getTimeAgo(job.createdAt),
        createdAt: job.createdAt,
        unread: job.unread && !readInSession.has(job.id),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [pendingJobs, readInSession]);

  const handleNotificationClick = async (id: number) => {
    onClose();
    router.push("/dashboard");
    // Small delay to ensure navigation happens first
    setTimeout(() => {
      const event = new CustomEvent("navigateToJobRequests");
      window.dispatchEvent(event);
    }, 100);
  };

  if (isLoading) {
    return (
      <BaseSideModal isOpen={isOpen} onClose={onClose} title="Notifications">
        <div className="flex items-center justify-center h-full px-[25px] py-[60px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jila-400"></div>
        </div>
      </BaseSideModal>
    );
  }

  return (
    <BaseSideModal isOpen={isOpen} onClose={onClose} title="Notifications">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full px-[25px] py-[60px]">
          <div className="w-[60px] h-[60px] rounded-full bg-gray-200 flex items-center justify-center mb-[20px]">
            <Bell size={30} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-[20px] text-type-400 mb-[8px]">
            No notifications
          </h3>
          <p className="font-normal text-[16px] text-gray-400 text-center">
            You&apos;re all caught up on notifications
          </p>
        </div>
      ) : (
        <div className="flex flex-col px-[25px] py-[20px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className="flex items-start gap-[12px] py-[16px] border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-100 px-[12px] -mx-[12px] rounded-[8px]"
            >
              <div className="flex-shrink-0 mt-[4px]">
                {notification.unread && (
                  <div className="w-[13px] h-[13px] rounded-full bg-error-400" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <div className="font-normal text-[16px] leading-[22px]">
                  <span className="font-bold text-type-400">
                    {notification.email}
                  </span>
                  <span className="text-gray-400"> submitted </span>
                  <span className="font-bold text-type-400">
                    {notification.jobTitle}
                  </span>
                </div>
                <div className="font-normal text-[14px] text-gray-400">
                  {notification.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseSideModal>
  );
}
