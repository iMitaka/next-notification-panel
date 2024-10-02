import { router } from "./server";
import { notificationRouter } from "./routes/notification";

export const appRouter = router({
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
