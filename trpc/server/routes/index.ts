import { router } from "../server";
import { getNotifications } from "./getNotifications";
import { getNotReadNotificationsCount } from "./getNotReadNotificationsCount";
import { createNotification } from "./createNotification";
import { setNotificationRead } from "./setNotificationRead";

export const notificationRouter = router({
  getNotifications,
  getNotReadNotificationsCount,
  createNotification,
  setNotificationRead,
});

export type NotificationRouter = typeof notificationRouter;
