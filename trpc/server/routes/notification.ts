import { createNotificationSchema } from "@/contracts/createNotification";
import { procedure, router } from "../server";
import { z } from "zod";
import {
  Notification,
  NotificationSchema,
  NotificationType
} from "@/contracts/notification";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_AVATAR_URL =
  "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg";

const SYSTEM_ICON_IMAGE_URL =
  "https://cdn-icons-png.flaticon.com/512/3247/3247987.png";

export const notificationRouter = router({
  getNotifications: procedure
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
            notification.type === NotificationType.PlatformUpdate
              ? SYSTEM_ICON_IMAGE_URL
              : USER_AVATAR_URL,
          personName: String(notification.personName),
        };
      });
    }),
  getNotReadNotificationsCount: procedure.output(z.number()).query(async () => {
    return await prisma.notification.count({
      where: { isRead: false },
    });
  }),
  createNotification: procedure
    .input(createNotificationSchema)
    .output(NotificationSchema)
    .mutation(async ({ input }) => {
      if (input.type === NotificationType.PlatformUpdate) {
        if (!input.releaseNumber) {
          throw new Error("Release number is required for PlatformUpdate");
        }

        const notification = await prisma.notification.create({
          data: {
            type: input.type,
            releaseNumber: input.releaseNumber,
          },
        });

        return {
          ...notification,
          type: notification.type as NotificationType,
          imageUrl: "https://cdn-icons-png.flaticon.com/512/3247/3247987.png",
        };
      }

      if (!input.personName) {
        throw new Error("Person name is required for other notification types");
      }

      const notification = await prisma.notification.create({
        data: {
          type: input.type,
          personName: input.personName,
        },
      });

      return {
        ...notification,
        imageUrl: USER_AVATAR_URL,
        type: notification.type as NotificationType,
      };
    }),
  setNotificationRead: procedure
    .output(z.boolean())
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const notification = await prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });

      return notification.isRead;
    }),
});

export type NotificationRouter = typeof notificationRouter;
