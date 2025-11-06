import { useState } from "react";
import Notification from "@/components/Notification";

export function useNotification() {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const NotificationContainer = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]">
        <Notification message={notification} onClose={hideNotification} />
      </div>
    );
  };

  return {
    showNotification,
    hideNotification,
    NotificationContainer,
  };
}
