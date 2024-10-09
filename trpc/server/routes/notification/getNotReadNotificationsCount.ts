import { z } from "zod";
import { prisma } from "../../prisma";
import { procedure } from "../../server";

export const getNotReadNotificationsCount = procedure
  .output(z.number())
  .query(async () => {
    return await prisma.notification.count({
      where: { isRead: false },
    });
  });
