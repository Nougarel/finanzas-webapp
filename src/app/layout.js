import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/ui/site-header";
import SiteFooter from "@/components/ui/site-footer";

// Geist (variable font) — títulos vía --font-display
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Inter (variable font) — body/secundario/terciario/botones vía --font-sans
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "flouss · Distribuye con criterio",
  description:
    "Planificador financiero personal para España. Calcula cómo distribuir tus ingresos mensuales de forma saludable.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased flex min-h-screen flex-col`}
      >
        {/* Shell global — SiteHeader/SiteFooter se auto-ocultan en /study/* */}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
