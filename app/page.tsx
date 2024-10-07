import { HydrateClient, trpc } from "@/trpc/client/server-client";
import { NotificationPanel } from "../components/NotificationPanel";

export const dynamic = 'force-dynamic'

export default function Home() {
  void trpc.notification.getNotifications.prefetch();
  void trpc.notification.getNotReadNotificationsCount.prefetch();

  return (
    <HydrateClient>
      <NotificationPanel />
    </HydrateClient>
  );
}
