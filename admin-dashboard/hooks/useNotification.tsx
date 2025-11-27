import { useState, useEffect } from "react";
import Notification from "@/components/common/Notification";
import {
  TIMINGS,
  Z_INDEX,
  type NotificationType,
  NOTIFICATION_TYPES,
} from "@/lib/constants";

interface NotificationState {
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const showNotification = (
    message: string,
    type: NotificationType = NOTIFICATION_TYPES.SUCCESS,
  ) => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, TIMINGS.NOTIFICATION_AUTO_CLOSE);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const NotificationContainer = () => {
    if (!notification) return null;

    return (
      <div
        className="fixed top-10 left-1/2 transform -translate-x-1/2"
        style={{ zIndex: Z_INDEX.NOTIFICATION }}
      >
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
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
