import { CircleCheck, X } from "lucide-react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
  return (
    <div className="flex font-[300] body1-desktop-text items-center justify-between p-3 rounded-[10px] shadow-md w-max gap-2 bg-white">
      <div className="flex items-center">
        <CircleCheck size={20} className="stroke-green-400" />
      </div>
      <span>{message}</span>

      <button onClick={onClose} className="cursor-pointer">
        <X size={20} />
      </button>
    </div>
  );
}
