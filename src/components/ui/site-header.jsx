"use client";

// site-header.jsx — Cabecera global sticky de flouss.
// Se auto-oculta en rutas /study/* para no interferir con StudyBar.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** SVG inline del símbolo flouss (curva con bifurcación). */
function FlouessSymbol({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-7 shrink-0", className)}
    >
      <path
        d="M4 16 Q12 16 16 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M4 16 Q12 16 16 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="4" cy="16" r="2" fill="currentColor" />
      <circle cx="16" cy="8" r="2" fill="currentColor" />
      <circle cx="16" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  // El funnel /study/* tiene su propio layout (StudyBar) — ocultar este header
  if (pathname?.startsWith("/study")) return null;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl xl:max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="flouss — ir a inicio"
        >
          <FlouessSymbol />
          {/* Wordmark */}
          <span
            className="font-display text-xl font-black tracking-display text-primary select-none"
            aria-hidden="true"
          >
            flouss
          </span>
        </Link>

        {/* Tagline — visible solo en pantallas medianas+ */}
        <p className="hidden sm:block text-xs font-medium text-muted-foreground tracking-meta uppercase select-none">
          Distribuye con criterio
        </p>
      </div>
    </header>
  );
}
