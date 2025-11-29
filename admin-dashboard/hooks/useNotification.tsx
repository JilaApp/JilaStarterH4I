import { useState, useEffect, useRef } from "react";
import Notification, {
  NotificationType,
} from "@/components/shared/Notification";
import { NOTIFICATION_AUTO_DISMISS_MS } from "@/lib/constants";

interface NotificationState {
  message: string;
  type?: NotificationType;
  onUndo?: () => void;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (
    message: string,
    type?: NotificationType,
    onUndo?: () => void,
  ) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ message, type, onUndo });

    // Auto-dismiss after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, NOTIFICATION_AUTO_DISMISS_MS);
  };

  const hideNotification = () => {
    // Clear timeout when manually closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
