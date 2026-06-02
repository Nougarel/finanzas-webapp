"use client";

/**
 * indicator-card.jsx — Card compacta de KPI financiero.
 *
 * Layout:
 *   - Grupo absoluto top-right: botón "?" + badge de estado (fijos siempre).
 *   - Label en CAPS (10px para que labels largos como "COBERTURA EMERGENCIA"
 *     quepan en 1 línea dentro del pr-20 reservado para el grupo).
 *   - Valor en font-display bold.
 *   - Umbral de referencia → absolute bottom-left (al nivel del fuente stamp anterior).
 *   - Source stamp eliminado — el umbral ya incluye la fuente (ej: "< 30% BdE").
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
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * @param {Object} props
 * @param {string} props.label            - Nombre del indicador (se muestra en CAPS).
 * @param {string} props.value            - Valor formateado. Ej: "24.5%".
 * @param {"ok"|"warning"|"critical"|"info"|"na"} props.status
 * @param {string} [props.description]    - Umbral corto visible bottom-left. Ej: "< 30% BdE".
 * @param {string} [props.tooltip]        - Texto explicativo completo para el botón "?".
 * @param {string} [props.unit]           - Unidad visible junto al valor.
 * @param {boolean} [props.skeleton]      - Si true, renderiza skeleton de carga.
 * @param {boolean} [props.compact]       - Layout reducido para grid 2-col.
 * @param {{ text: string, title: string }} [props.abbr]
 *   - Mantenido por compatibilidad pero ya no renderiza el sello visual.
 *     El umbral de description ya incluye la fuente (ej: "< 20% INE").
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
  abbr, // eslint-disable-line no-unused-vars
}) {
  if (skeleton) return <IndicatorCardSkeleton />;

  const badge = BADGE_CONFIG[status] ?? BADGE_CONFIG.na;

  return (
    <div className="relative bg-card border border-border rounded-lg px-4 pt-2 pb-6 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors duration-200">

      {/* Grupo absoluto top-right: botón "?" + badge.
          Ambos fijos — el label puede wrappear sin arrastrar ninguno. */}
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

      {/* Label — span directo en el flex-col para eliminar el strut del div padre
          (div hereda font-size:16px→line-height:24px que desplaza el texto 9px).
          Como flex item el span no tiene strut; leading-none lo fija a 10px. */}
      <span
        className="pr-16 font-sans font-medium uppercase text-muted-foreground leading-none"
        style={{ fontSize: 10, letterSpacing: "0.05em" }}
      >
        {label}
      </span>

      {/* Valor principal — separado del umbral bottom por el pb-6 del card */}
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

      {/* Umbral de referencia — absolute bottom-left, alineado con la base del card.
          Mismo nivel donde estaban las siglas de fuente (eliminadas por redundancia). */}
      {description && (
        <span
          className="absolute bottom-1.5 left-4 text-muted-foreground/60 font-normal"
          style={{ fontSize: 10 }}
        >
          {description}
        </span>
      )}
    </div>
  );
}
