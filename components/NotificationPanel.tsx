"use client";

import { trpc } from "@/trpc/client/client";
import { useCallback, useState } from "react";
import { NotificationComponent } from "./NotificationComponent";
import { AppHeader } from "./AppHeader";
import {
  CreateNotificationModal,
  NotificationFormData,
} from "./CreateNotificationModal";

export const NotificationPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trpcUtils = trpc.useUtils();

  const notifications = trpc.notification.getNotifications.useQuery();

  const notReadNotificationsCount =
    trpc.notification.getNotReadNotificationsCount.useQuery();

  const createNotification = trpc.notification.createNotification.useMutation({
    onSuccess: (data) => {
      trpcUtils.notification.getNotReadNotificationsCount.setData(
        undefined,
        (prev) => {
          return Number(prev) + 1;
        }
      );

      trpcUtils.notification.getNotifications.setData(undefined, (prev) => {
        if (!prev) {
          return [];
        }

        return [data, ...prev];
      });
    },
  });

  const handleCreateNotification = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleSubmitModal = useCallback(
    (data: NotificationFormData) => {
      createNotification.mutate(data);
      setIsModalOpen(false);
    },
    [createNotification, setIsModalOpen]
  );

  return (
    <div>
      <AppHeader
        unreadCount={notReadNotificationsCount.data}
        onCreateNotification={handleCreateNotification}
        title="Notifications"
      />

      {notifications.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading notifications...</p>
        </div>
      ) : notifications.data?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No notifications available</p>
        </div>
      ) : (
        notifications.data?.map((notification, index) => (
          <div key={notification.id}>
            <NotificationComponent notification={notification} />
            {index < notifications.data.length - 1 && (
              <hr className="border-t border-gray-50" />
            )}
          </div>
        ))
      )}

      <CreateNotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};
