import { useState } from "react";
import Notification, { NotificationType } from "@/components/Notification";

interface NotificationState {
  message: string;
  type?: NotificationType;
  onUndo?: () => void;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const showNotification = (
    message: string,
    type?: NotificationType,
    onUndo?: () => void,
  ) => {
    setNotification({ message, type, onUndo });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const NotificationContainer = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]">
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          onUndo={notification.onUndo}
        />
      </div>
    );
  };

  return {
    showNotification,
    hideNotification,
    NotificationContainer,
  };
}
