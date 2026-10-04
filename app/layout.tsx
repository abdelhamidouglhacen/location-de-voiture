import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE_TITLE } from "@/lib/constants";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: "%s | AZUR DRIVE" },
  description:
    "Car rental in Agadir, 24/7. City cars, SUVs, luxury cars and vans, delivered to Al Massira airport and to your hotel.",
  openGraph: { locale: "en_US", siteName: "AZUR DRIVE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#FAFAF9", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${geist.variable}`}>
      <body className="min-h-dvh">
        <ToastProvider>{children}<Toaster position="top-center" /></ToastProvider>
      </body>
    </html>
  );
}
