import { z } from "zod";

export enum NotificationType {
  PlatformUpdate = "PlatformUpdate",
  CommonTag = "CommonTag",
  AccessGranted = "AccessGranted",
  JoinWorkspace = "JoinWorkspace",
}

export const NotificationSchema = z.object({
  id: z.string(),
  isRead: z.boolean().default(false),
  imageUrl: z.string().optional(),
  type: z.nativeEnum(NotificationType),
  releaseNumber: z.string().nullish(),
  personName: z.string().nullish(),
});

export type Notification = z.infer<typeof NotificationSchema>;
