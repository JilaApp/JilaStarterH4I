import { CircleCheck, CircleX, AlertTriangle, Info, X } from "lucide-react";
import { NOTIFICATION_TYPES, type NotificationType } from "@/lib/constants";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

const notificationStyles = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    icon: CircleCheck,
    iconClass: "stroke-green-400",
    bgClass: "bg-white",
  },
  [NOTIFICATION_TYPES.ERROR]: {
    icon: CircleX,
    iconClass: "stroke-error-400",
    bgClass: "bg-white",
  },
  [NOTIFICATION_TYPES.WARNING]: {
    icon: AlertTriangle,
    iconClass: "stroke-orange-400",
    bgClass: "bg-white",
  },
  [NOTIFICATION_TYPES.INFO]: {
    icon: Info,
    iconClass: "stroke-jila-400",
    bgClass: "bg-white",
  },
};

export default function Notification({
  message,
  type = NOTIFICATION_TYPES.SUCCESS,
  onClose,
}: NotificationProps) {
  const { icon: Icon, iconClass, bgClass } = notificationStyles[type];

  return (
    <div
      className={`flex font-[300] body1-desktop-text items-center justify-between p-3 rounded-[10px] shadow-md w-max gap-2 ${bgClass}`}
    >
      <div className="flex items-center">
        <Icon size={20} className={iconClass} />
      </div>
      <span>{message}</span>

      <button
        onClick={onClose}
        className="cursor-pointer"
        aria-label="Close notification"
      >
        <X size={20} />
      </button>
    </div>
  );
}
