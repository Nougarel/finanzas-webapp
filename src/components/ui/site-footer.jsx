"use client";

// site-footer.jsx — Pie de página global de flouss.
// Se auto-oculta en rutas /study/* para no interferir con el funnel de investigación.

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  // El funnel /study/* tiene su propio layout — ocultar este footer
  if (pathname?.startsWith("/study")) return null;

  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full border-t border-border bg-background"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            TFG Ingeniería Multimedia · ETSE-UV · {year}
          </p>
          <p className="text-xs text-muted-foreground">
            Esta aplicación no constituye asesoramiento financiero profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
