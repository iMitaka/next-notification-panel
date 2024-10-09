import { createNotificationSchema } from "@/contracts/createNotification";
import { NotificationSchema, NotificationType } from "@/contracts/notification";
import { USER_AVATAR_URL } from "../../constants/user";
import { prisma } from "../../prisma";
import { procedure } from "../../server";
import { revalidatePath } from "next/cache";

export const createNotification = procedure
  .input(createNotificationSchema)
  .output(NotificationSchema)
  .mutation(async ({ input }) => {
    if (
      input.type === NotificationType.PlatformUpdate &&
      !input.releaseNumber
    ) {
      throw new Error("Release number is required for PlatformUpdate");
    }

    if (input.type !== NotificationType.PlatformUpdate && !input.personName) {
      throw new Error("Person name is required for other notification types");
    }

    const notification = await prisma.notification.create({
      data: {
        type: input.type,
        ...(input.type === NotificationType.PlatformUpdate
          ? {
              releaseNumber: input.releaseNumber,
            }
          : {
              personName: input.personName,
            }),
      },
    });

    revalidatePath("/");

    return {
      ...notification,
      imageUrl:
        notification.type !== NotificationType.PlatformUpdate
          ? USER_AVATAR_URL
          : undefined,
      type: notification.type as NotificationType,
    };
  });
