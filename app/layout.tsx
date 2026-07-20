import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import { PwaRegister } from "@/components/PwaRegister";
import { ReminderCheck } from "@/components/ReminderCheck";
import "./globals.css";

export const metadata: Metadata = {
  title: "IronPath",
  description:
    "Back-friendly strength and Zone 2 coaching that remembers everything, so you don't have to.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IronPath",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <ReminderCheck />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <main className="flex-1 px-4 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
