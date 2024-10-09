import { z } from "zod";
import { prisma } from "../../prisma";
import { procedure } from "../../server";
import { revalidatePath } from "next/cache";

export const setNotificationRead = procedure
  .output(z.boolean())
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const notification = await prisma.notification.update({
      where: { id: input.id },
      data: { isRead: true },
    });

    revalidatePath('/')

    return notification.isRead;
  });
