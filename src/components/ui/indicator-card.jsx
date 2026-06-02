"use client";

/**
 * indicator-card.jsx — Card compacta de KPI financiero.
 *
 * Layout:
 *   - Badge de estado (mini insignia) → esquina superior derecha, absoluta.
 *   - Label en CAPS + botón "?" circular navy → línea superior.
 *   - Valor en font-display bold.
 *   - Descripción corta (umbral, ej: "< 30% BdE") → texto secundario bajo el valor.
 *   - Sello de fuente (BdE, OMS…) → esquina inferior derecha, absoluta, terciario.
 *
 * El botón "?" abre un tooltip con la explicación completa del indicador.
 * El estado semántico lo comunica el badge, no el color del valor.
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
 * @param {string} [props.description]    - Texto corto visible bajo el valor (umbral de referencia).
 *                                          Ej: "< 30% BdE". Opcional.
 * @param {string} [props.tooltip]        - Texto explicativo completo para el botón "?". Opcional.
 * @param {string} [props.unit]           - Unidad visible junto al valor. Opcional.
 * @param {boolean} [props.skeleton]      - Si true, renderiza el skeleton de carga.
 * @param {boolean} [props.compact]       - Layout reducido para grid 2-col.
 * @param {{ text: string, title: string }} [props.abbr]
 *   - Si se pasa, `abbr.text` se renderiza como sello terciario en esquina inferior derecha.
 *     `abbr.title` se usa como atributo title para accesibilidad.
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

      {/* Badge insignia — esquina superior derecha, absoluta, mini */}
      <span
        className={cn(
          "absolute top-2 right-2 px-1.5 py-0.5 rounded-full font-semibold",
          badge.className
        )}
        style={{ fontSize: 9 }}
      >
        {badge.label}
      </span>

      {/* Fila: Label + botón "?" tooltip.
          items-start: el botón se ancla a la primera línea del label aunque
          el texto desborde a 2 líneas (ej: "COBERTURA EMERGENCIA"). */}
      <div className="flex items-start gap-1.5 pr-16">
        <span
          className="font-sans font-medium uppercase text-muted-foreground"
          style={{ fontSize: 11, letterSpacing: "0.05em" }}
        >
          {label}
        </span>

        {tooltip && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* mt-0.5: compensación óptica para alinear el centro del círculo
                    con la línea de caps del label (11px uppercase) */}
                <button
                  type="button"
                  className="w-3 h-3 min-w-[12px] rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
