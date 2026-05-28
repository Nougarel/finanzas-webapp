"use client";

/**
 * HealthGauge — gauge circular SVG para el health score (0-100).
 *
 * Implementación: arco de 270° (abierto 45° abajo-izquierda / abajo-derecha).
 * El arco va de las 7 en punto a las 5 en punto pasando por las 12.
 * La animación usa stroke-dashoffset con transition CSS ~700ms ease-out.
 * Respeta prefers-reduced-motion: si está activo, sin animación.
 *
 * Props:
 *   score        {number}  — 0-100
 *   level        {string}  — "excellent" | "good" | "acceptable" | "improvable" | "critical"
 *   label        {string}  — texto de la etiqueta principal (ej. "Salud financiera")
 *   levelLabel   {string}  — texto del nivel (ej. "Excelente")
 *   penalties    {Array}   — array de { category, reason, points } (puede ser vacío)
 *   categoryLabels {Object} — mapa id → label para penalties (opcional)
 */

import { useEffect, useRef, useState } from "react";

// Mapeo nivel → tokens semánticos del design system.
// Consistente con el mapeo anterior de ResultsPage y DiagnosisPage.
const LEVEL_CONFIG = {
  excellent: {
    stroke: "var(--success)",
    text:   "var(--success-foreground)",
    label:  "Excelente",
  },
  good: {
    stroke: "var(--success)",
    text:   "var(--success-foreground)",
    label:  "Buena",
  },
  acceptable: {
    stroke: "var(--warning)",
    text:   "var(--warning-foreground)",
    label:  "Aceptable",
  },
  improvable: {
    stroke: "var(--warning)",
    text:   "var(--warning-foreground)",
    label:  "Mejorable",
  },
  critical: {
    stroke: "var(--destructive)",
    text:   "var(--destructive)",
    label:  "Crítica",
  },
};

function getLevelConfig(level) {
  return LEVEL_CONFIG[level] ?? LEVEL_CONFIG.acceptable;
}

// Geometría del arco SVG.
// Arco de 270° centrado en (cx,cy), con un hueco de 90° abierto en la parte inferior.
// El arco arranca en 135° (abajo-izquierda) y termina en 45° (abajo-derecha),
// girando en sentido horario pasando por la cima (270° de recorrido).
const CX = 60;
const CY = 60;
const R  = 48;
const STROKE_WIDTH = 8;
const ARC_DEGREES  = 270;

// Convierte ángulo en grados (0° = derecha, sentido horario) a coordenadas SVG.
function polarToXY(angleDeg, r = R) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

// Construye el atributo `d` de un arco SVG.
// startDeg → endDeg en sentido horario.
function arcPath(startDeg, endDeg) {
  const start    = polarToXY(startDeg);
  const end      = polarToXY(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

// El arco de fondo va de 135° a 405° (= 135° + 270°).
const TRACK_PATH  = arcPath(135, 405);
// Circunferencia parcial del arco de 270° para stroke-dasharray.
const ARC_LENGTH  = (ARC_DEGREES / 360) * (2 * Math.PI * R);

export function HealthGauge({
  score,
  level,
  label      = "Salud financiera",
  levelLabel,
  penalties  = [],
  categoryLabels = {},
}) {
  const cfg        = getLevelConfig(level);
  const displayLabel = levelLabel ?? cfg.label;
  const clampedScore = Math.min(Math.max(score ?? 0, 0), 100);

  // El dashoffset controla qué fracción del arco se pinta.
  // dashoffset = ARC_LENGTH * (1 - score/100)  →  0 = arco completo, ARC_LENGTH = arco vacío.
  const targetOffset = ARC_LENGTH * (1 - clampedScore / 100);

  // Arrancamos con el arco vacío (dashoffset = ARC_LENGTH) y animamos a targetOffset.
  const [offset, setOffset] = useState(ARC_LENGTH);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Comprueba prefers-reduced-motion en el cliente.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Sin animación: valor final inmediato.
      setOffset(targetOffset);
    } else {
      // Un frame de margen para que el CSS transition se aplique desde el estado inicial.
      const id = requestAnimationFrame(() => {
        setOffset(targetOffset);
      });
      return () => cancelAnimationFrame(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labelFor = (k) => categoryLabels[k] ?? k;

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      {/* Etiqueta superior */}
      <p className="text-xs font-medium uppercase tracking-meta text-muted-foreground">
        {label}
      </p>

      {/* Gauge SVG + número centrado */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* SVG del gauge */}
        <div className="relative shrink-0">
          <svg
            width={CX * 2}
            height={CY * 2}
            viewBox={`0 0 ${CX * 2} ${CY * 2}`}
            role="img"
            aria-label={`Puntuación de salud financiera: ${clampedScore} de 100`}
            overflow="visible"
          >
            {/* Track (fondo del arco) */}
            <path
              d={TRACK_PATH}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
            />
            {/* Arco activo — animado */}
            <path
              d={TRACK_PATH}
              fill="none"
              stroke={cfg.stroke}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 700ms ease-out",
              }}
            />
          </svg>

          {/* Número del score superpuesto en el centro del SVG */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="font-display font-black tracking-display tabular-nums leading-none"
              style={{ fontSize: "2rem", color: cfg.text }}
            >
              {clampedScore}
            </span>
            <span className="text-xs font-medium text-muted-foreground leading-none mt-0.5">
              /100
            </span>
          </div>
        </div>

        {/* Texto de nivel y descripción secundaria */}
        <div className="text-center sm:text-left space-y-1">
          <p
            className="text-lg font-bold font-display leading-tight"
            style={{ color: cfg.text }}
          >
            {displayLabel}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Basado en la desviación de tu distribución respecto a los rangos saludables para tu perfil.
          </p>
        </div>
      </div>

      {/* Desglose de penalizaciones */}
      {penalties.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
            Ver desglose ({penalties.length}{" "}
            {penalties.length === 1 ? "factor resta" : "factores restan"} puntos)
          </summary>
          <ul className="mt-2 space-y-1 pl-2">
            {penalties.map((p, i) => (
              <li
                key={i}
                className="flex justify-between gap-2 text-muted-foreground"
              >
                <span>
                  <strong>{labelFor(p.category)}:</strong> {p.reason}
                </span>
                <span className="font-mono font-medium shrink-0">{p.points}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
