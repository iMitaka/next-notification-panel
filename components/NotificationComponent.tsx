"use client";

import { NotificationType, Notification } from "@/contracts/notification";
import { trpc } from "@/trpc/client/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { GearIcon } from "@radix-ui/react-icons";

interface NotificationProps {
  notification: Notification;
}

export const NotificationComponent: React.FC<NotificationProps> = ({
  notification,
}) => {
  const router = useRouter();

  const trpcUtils = trpc.useUtils();

  const { text, action } = useMemo(() => {
    switch (notification.type) {
      case NotificationType.PlatformUpdate:
        return {
          text: <>New features - see what's new</>,
          action: () => alert(notification.releaseNumber),
        };
      case NotificationType.CommonTag:
        return {
          text: (
            <>
              <strong>{notification.personName}</strong> tagged you in a comment
            </>
          ),
          action: () => router.push("/comments"),
        };
      case NotificationType.AccessGranted:
        return {
          text: (
            <>
              <strong>{notification.personName}</strong> shared a chat with you
            </>
          ),
          action: () => router.push("/chats"),
        };
      case NotificationType.JoinWorkspace:
        return {
          text: (
            <>
              <strong>{notification.personName}</strong> joined your workspace
            </>
          ),
          action: () => router.push("/workspace"),
        };
      default: {
        return {
          text: <>Unknown notification type</>,
          action: () => {},
        };
      }
    }
  }, [router, notification]);

  const borderColor = useMemo(() => {
    switch (notification.type) {
      case NotificationType.PlatformUpdate:
        return "border-blue-500";
      case NotificationType.CommonTag:
        return "border-green-500";
      case NotificationType.AccessGranted:
        return "border-yellow-500";
      case NotificationType.JoinWorkspace:
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  }, [notification.type]);

  const setNotificationRead = trpc.notification.setNotificationRead.useMutation(
    {
      onSuccess: () => {
        trpcUtils.notification.getNotifications.setData(undefined, (prev) => {
          if (!prev) {
            return [];
          }

          return prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          );
        });

        trpcUtils.notification.getNotReadNotificationsCount.setData(
          undefined,
          (prev) => {
            return Math.max(0, Number(prev) - 1);
          }
        );
      },
    }
  );

  const onNotificationClick = useCallback(async () => {
    if (!notification.isRead) {
      await setNotificationRead.mutateAsync({ id: notification.id });
    }

    action();
  }, [notification.id, notification.isRead, setNotificationRead]);

  return (
    <div
      onClick={onNotificationClick}
      className={`relative p-4 shadow-md flex items-center space-x-4 border-l-8 ${borderColor} ${
        notification.isRead ? "bg-white" : "bg-blue-100"
      }`}
    >
      <div className="flex-shrink-0">
        {notification.type === NotificationType.PlatformUpdate ? (
          <GearIcon className="h-12 w-12" />
        ) : (
          <img
            className="h-12 w-12 rounded-full object-contain"
            src={notification.imageUrl}
          />
        )}
      </div>
      <div className="flex-grow">
        <p className="text-sm">{text}</p>
      </div>
      {!notification.isRead && (
        <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
      )}
    </div>
  );
};
