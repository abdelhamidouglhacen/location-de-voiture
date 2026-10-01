import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE_TITLE } from "@/lib/constants";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: "%s | AZUR DRIVE" },
  description:
    "Location de voitures à Agadir, 24h/24 et 7j/7. Citadines, SUV, voitures de luxe et vans, livraison à l'aéroport Al Massira et à votre hôtel.",
  openGraph: { locale: "fr_MA", siteName: "AZUR DRIVE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#FAFAF9", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${geist.variable}`}>
      <body className="min-h-dvh">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
