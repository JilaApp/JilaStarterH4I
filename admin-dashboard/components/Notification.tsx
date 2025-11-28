import { CircleCheck, X, Trash2 } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
  onUndo?: () => void;
}

export default function Notification({
  message,
  type = "info",
  onClose,
  onUndo,
}: NotificationProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CircleCheck size={24} className="text-green-400" />;
      case "error":
        return <Trash2 size={24} className="text-error-400" />;
      default:
        return <CircleCheck size={24} className="text-green-400" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 flex items-center justify-center gap-[10px] p-[15px] rounded-[14px] shadow-md">
      {getIcon()}
      <p className="font-normal text-[24px] leading-[30px] text-black">
        {message}
      </p>
      {onUndo && (
        <div className="pl-[30px]">
          <button
            onClick={onUndo}
            className="font-bold text-[18px] leading-[25px] text-jila-400 cursor-pointer hover:opacity-80"
          >
            Undo
          </button>
        </div>
      )}
      <button onClick={onClose} className="cursor-pointer hover:opacity-80">
        <X size={12} />
      </button>
    </div>
  );
}
