import { z } from "zod";
import { NotificationSchema } from "./notification";

export const createNotificationSchema = NotificationSchema.omit({
  id: true,
  imageUrl: true,
});

export type CreateNotification = z.infer<typeof createNotificationSchema>;
