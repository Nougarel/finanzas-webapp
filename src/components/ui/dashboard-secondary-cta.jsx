/**
 * dashboard-secondary-cta.jsx — CTA secundario contextual al pie de col 2 del DashboardPanel.
 *
 * Diseñado para no competir con los CTAs primarios de col 1.
 * Usa estilo outline: borde gris en idle, borde primary/40 en hover.
 * Texto text-foreground en idle, text-primary en hover.
 * Sin sombra ni elevación.
 *
 * Posicionamiento sticky:
 *   El sticky bottom-0 con bg-card es opt-in vía prop `sticky`.
 *   En F2 (demo/POC), sticky=false — el CTA va al pie del flujo normal.
 *   En F3 (/results etc.), F3 activa sticky=true cuando el aside tiene overflow-y-auto.
 *   Un div de gradiente encima da el efecto de fade-out antes del CTA cuando hay scroll.
 *
 * NO requiere 'use client' — el Link es navegación nativa.
 *
 * @param {Object} props
 * @param {string} props.href             - URL de destino.
 * @param {string} props.children         - Texto del botón (label descriptivo).
 * @param {string} [props.ariaLabel]      - aria-label explícito si el label visual es ambiguo.
 * @param {boolean} [props.sticky]        - Activa sticky bottom-0 + bg-card. Default: false.
 *                                          F3 lo activa cuando col 2 tiene overflow-y-auto.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSecondaryCta({ href, children, ariaLabel, sticky = false }) {
  return (
    <div className={cn(sticky && "sticky bottom-0 bg-card")}>
      {/* Gradiente de fade-out — solo visible cuando hay scroll (sticky=true) */}
      {sticky && (
        <div
          aria-hidden="true"
          className="h-3 bg-gradient-to-t from-card to-transparent pointer-events-none"
        />
      )}

      <div className={cn(sticky ? "pt-1 pb-2" : "pt-0 pb-0")}>
        <Link
          href={href}
          aria-label={ariaLabel}
          className="
            flex items-center justify-center gap-2
            w-full px-4 py-2
            border border-border rounded-md
            font-sans text-sm font-medium
            text-foreground
            transition-colors duration-200
            hover:border-primary/40 hover:text-primary
            focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2
          "
        >
          <span>{children}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
