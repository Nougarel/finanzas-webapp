/**
 * indicator-card.jsx — Card compacta de KPI financiero con badge de estado semántico.
 *
 * Muestra un indicador clave (DTI, tasa de ahorro, etc.) con:
 *   - Label superior en caps tracking-meta
 *   - Valor en font-display bold text-3xl
 *   - Badge de estado (ok/warning/critical/info/na) en esquina superior derecha del valor
 *   - Descripción muted de 1-2 líneas con line-clamp-2
 *   - Estado skeleton mientras llegan los datos
 *
 * El estado semántico lo comunica el badge, no el color del valor
 * (coherente con el sistema de alertas de col 1, que usa colores distintos).
 *
 * NO requiere 'use client' — es puramente presentacional.
 * Si en el futuro se hace cliclable, añadir 'use client' y focus-visible.
 *
 * @param {Object} props
 * @param {string} props.label            - Label del indicador (se muestra en CAPS). Ej: "DTI".
 * @param {string} props.value            - Valor formateado. Ej: "24.5%", "4.2 m".
 * @param {"ok"|"warning"|"critical"|"info"|"na"} props.status
 *   - ok       → badge verde "Saludable"
 *   - warning  → badge ámbar "Atención"
 *   - critical → badge rojo  "Crítico"
 *   - info     → badge azul  "Info"
 *   - na       → badge gris  "Sin dato"
 * @param {string} [props.description]    - Descripción breve (max 2 líneas). Opcional.
 * @param {string} [props.unit]           - Unidad visible junto al valor. Ej: "%", "m". Opcional.
 * @param {boolean} [props.skeleton]      - Si true, renderiza el skeleton de carga.
 * @param {boolean} [props.compact]       - Si true, aplica tipografía reducida para layout 2-col.
 */

import { cn } from "@/lib/utils";

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
      {/* Label */}
      <div className="h-2.5 w-16 bg-muted rounded animate-pulse" />
      {/* Valor */}
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
      {/* Descripción */}
      <div className="h-2 w-full bg-muted rounded animate-pulse" />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function IndicatorCard({
  label,
  value,
  status = "info",
  description,
  unit,
  skeleton = false,
  compact = false,
}) {
  if (skeleton) return <IndicatorCardSkeleton />;

  const badge = BADGE_CONFIG[status] ?? BADGE_CONFIG.na;

  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors duration-200">
      {/* Label superior — caps tracking-meta */}
      <span
        className="font-sans font-medium uppercase text-muted-foreground"
        style={{ fontSize: 11, letterSpacing: "0.05em" }}
      >
        {label}
      </span>

      {/* Fila valor + badge */}
      <div className="flex items-baseline justify-between gap-2">
        {/* Valor: compact reduce a text-xl para que quepa en grid 2-col sin truncar */}
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

        {/* Badge de estado */}
        <span
          className={cn(
            "px-2 py-0.5 rounded-full font-semibold flex-shrink-0",
            badge.className
          )}
          style={{ fontSize: 11 }}
        >
          {badge.label}
        </span>
      </div>

      {/* Descripción — max 2 líneas */}
      {description && (
        <p
          className="font-sans text-muted-foreground leading-snug line-clamp-2"
          style={{ fontSize: compact ? 11 : 12 }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
