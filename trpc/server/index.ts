import { router } from "./server";
import { notificationRouter } from "./routes";

export const appRouter = router({
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
