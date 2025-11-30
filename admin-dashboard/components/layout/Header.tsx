import { useState } from "react";
import { Bell } from "lucide-react";
import HeaderDropdown from "./HeaderDropdown";
import NotificationWindow from "./NotificationWindow";
import { trpc } from "@/lib/trpc";

interface HeaderProps {
  title: string;
  name: string;
  organization: string;
  onSignOut: () => void;
}

export default function Header({
  title,
  name,
  organization,
  onSignOut,
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { data: pendingJobs } = trpc.jobs.getPendingJobRequests.useQuery();
  const unreadCount = pendingJobs?.filter((job) => job.unread).length || 0;

  return (
    <>
      <div className="flex text-type-400 flex-row h-[80px] items-center justify-between">
        <div className="font-semibold text-2xl whitespace-nowrap">{title}</div>

        <div className="flex flex-row items-center gap-10">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="bg-white-400 hover:bg-[#F8F8F8] h-[72px] w-[64px] flex items-center justify-center rounded-[10px] cursor-pointer relative"
          >
            <Bell />
            {unreadCount > 0 && (
              <div className="absolute top-[16px] right-[14px] w-[13px] h-[13px] rounded-full bg-error-400" />
            )}
          </button>

          <HeaderDropdown
            name={name}
            organization={organization}
            onSignOut={onSignOut}
          />
        </div>
      </div>

      <NotificationWindow
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
