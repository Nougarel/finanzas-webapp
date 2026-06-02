"use client";

/**
 * indicator-card.jsx — Card compacta de KPI financiero.
 *
 * Layout:
 *   - Grupo absoluto top-right: botón "?" + badge de estado — siempre fijos,
 *     independientemente de cuántas líneas ocupe el label.
 *   - Label en CAPS (puede wrappear libremente) con pr-20 para no solapar el grupo.
 *   - Valor en font-display bold.
 *   - Descripción corta (umbral, ej: "< 30% BdE") → texto secundario bajo el valor.
 *   - Sello de fuente (BdE, OMS…) → esquina inferior derecha, absoluta, terciario.
 */

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Configuración de badges por estado ──────────────────────────────────────

const BADGE_CONFIG = {
  ok: {
    label: "Saludable",
    className: "bg-success-subtle text-success-foreground",
  },
  warning: {
    label: "Atención",
    className: "bg-warning-subtle text-warning-foreground",
  },
  critical: {
    label: "Crítico",
    className: "bg-destructive/10 text-destructive",
  },
  info: {
    label: "Info",
    className: "bg-info-subtle text-info-foreground",
  },
  na: {
    label: "Sin dato",
    className: "bg-muted text-muted-foreground",
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function IndicatorCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col gap-2">
      <div className="h-2.5 w-16 bg-muted rounded animate-pulse" />
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
      <div className="h-2 w-20 bg-muted rounded animate-pulse" />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * @param {Object} props
 * @param {string} props.label            - Nombre del indicador (se muestra en CAPS).
 * @param {string} props.value            - Valor formateado. Ej: "24.5%".
 * @param {"ok"|"warning"|"critical"|"info"|"na"} props.status
 * @param {string} [props.description]    - Umbral corto visible bajo el valor. Ej: "< 30% BdE".
 * @param {string} [props.tooltip]        - Texto explicativo completo para el botón "?".
 * @param {string} [props.unit]           - Unidad visible junto al valor.
 * @param {boolean} [props.skeleton]      - Si true, renderiza skeleton de carga.
 * @param {boolean} [props.compact]       - Layout reducido para grid 2-col.
 * @param {{ text: string, title: string }} [props.abbr]
 *   - abbr.text: sello terciario en esquina inferior derecha (BdE, OMS…).
 *   - abbr.title: atributo title para accesibilidad.
 */
export function IndicatorCard({
  label,
  value,
  status = "info",
  description,
  tooltip,
  unit,
  skeleton = false,
  compact = false,
  abbr,
}) {
  if (skeleton) return <IndicatorCardSkeleton />;

  const badge = BADGE_CONFIG[status] ?? BADGE_CONFIG.na;

  return (
    <div className="relative bg-card border border-border rounded-lg px-4 pt-3 pb-5 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors duration-200">

      {/* Grupo absoluto top-right: botón "?" + badge de estado.
          Ambos fijos en la esquina — el label puede wrappear sin arrastrar ninguno. */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {tooltip && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-3 h-3 min-w-[12px] rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ fontSize: 9 }}
                  aria-label={`Información sobre ${label}`}
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs leading-snug">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full font-semibold",
            badge.className
          )}
          style={{ fontSize: 9 }}
        >
          {badge.label}
        </span>
      </div>

      {/* Label — pr-20 (80px) reserva espacio para el grupo absoluto [?][badge] */}
      <div className="pr-20">
        <span
          className="font-sans font-medium uppercase text-muted-foreground"
          style={{ fontSize: 11, letterSpacing: "0.05em" }}
        >
          {label}
        </span>
      </div>

      {/* Valor principal */}
      <span
        className={cn(
          "font-display font-bold text-foreground tabular-nums leading-none",
          compact ? "text-xl" : "text-2xl"
        )}
      >
        {value}
        {unit && (
          <span
            className={cn(
              "font-normal text-muted-foreground ml-1",
              compact ? "text-sm" : "text-base"
            )}
          >
            {unit}
          </span>
        )}
      </span>

      {/* Descripción corta — umbral de referencia visible (ej: "< 30% BdE") */}
      {description && (
        <p
          className="font-sans text-muted-foreground/70 leading-snug"
          style={{ fontSize: compact ? 10 : 11 }}
        >
          {description}
        </p>
      )}

      {/* Sello de fuente — esquina inferior derecha, terciario */}
      {abbr && (
        <span
          className="absolute bottom-1.5 right-2.5 text-muted-foreground/40 font-medium"
          style={{ fontSize: 9 }}
          title={abbr.title}
        >
          {abbr.text}
        </span>
      )}
    </div>
  );
}
