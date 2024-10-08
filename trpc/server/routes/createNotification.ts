import { createNotificationSchema } from "@/contracts/createNotification";
import { NotificationSchema, NotificationType } from "@/contracts/notification";
import { USER_AVATAR_URL } from "../constants/user";
import { prisma } from "../prisma";
import { procedure } from "../server";

export const createNotification = procedure
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
  });
