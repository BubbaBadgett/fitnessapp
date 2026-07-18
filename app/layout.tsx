import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { PwaRegister } from "@/components/PwaRegister";
import { ReminderCheck } from "@/components/ReminderCheck";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background">
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
