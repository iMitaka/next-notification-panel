import { createNotificationSchema } from "@/contracts/createNotification";
import { NotificationSchema, NotificationType } from "@/contracts/notification";
import { USER_AVATAR_URL } from "../constants/user";
import { prisma } from "../prisma";
import { procedure } from "../server";
import { Notification as PrismaNotification } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createNotification = procedure
  .input(createNotificationSchema)
  .output(NotificationSchema)
  .mutation(async ({ input }) => {
    let notification: PrismaNotification;

    if (input.type === NotificationType.PlatformUpdate) {
      if (!input.releaseNumber) {
        throw new Error("Release number is required for PlatformUpdate");
      }

      notification = await prisma.notification.create({
        data: {
          type: input.type,
          releaseNumber: input.releaseNumber,
        },
      });
    }

    if (!input.personName) {
      throw new Error("Person name is required for other notification types");
    }

    notification = await prisma.notification.create({
      data: {
        type: input.type,
        personName: input.personName,
      },
    });

    revalidatePath('/')

    return {
      ...notification,
      imageUrl:
        notification.type !== NotificationType.PlatformUpdate
          ? USER_AVATAR_URL
          : undefined,
      type: notification.type as NotificationType,
    };
  });
