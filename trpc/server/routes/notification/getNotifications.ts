import {
  NotificationSchema,
  NotificationType,
  Notification,
} from "@/contracts/notification";
import { z } from "zod";
import { procedure } from "../../server";
import { prisma } from "../../prisma";
import { USER_AVATAR_URL } from "../../constants/user";

export const getNotifications = procedure
  .output(z.array(NotificationSchema))
  .query(async () => {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });

    return notifications.map<Notification>((notification) => {
      return {
        ...notification,
        type: notification.type as NotificationType,
        imageUrl:
          notification.type !== NotificationType.PlatformUpdate
            ? USER_AVATAR_URL
            : undefined,
        personName: String(notification.personName),
      };
    });
  });
