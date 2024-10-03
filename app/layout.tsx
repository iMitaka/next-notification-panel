import type { Metadata } from "next";
import "./globals.css";
import { TrpcClientProvider } from "@/components/TrpcClientProvider";

export const metadata: Metadata = {
  title: "Notification Panel",
  description: "Your Cool Notifications will be shown here...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TrpcClientProvider>{children}</TrpcClientProvider>
      </body>
    </html>
  );
}
