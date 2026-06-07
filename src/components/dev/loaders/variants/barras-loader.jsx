"use client";

import { useEffect, useRef } from "react";

const NUM_BARS = 20;
const COUNTER_MAX = 1048576; // 2^20

// Abreviaturas de las 20 categorías en orden
const BAR_LABELS = [
  "Viv", "Svc", "Alim", "Trns", "Sal",
  "Edu", "Rest", "Viaj", "Ropa", "Cuida",
  "Ocio", "Hob", "Subs", "Reg", "Seg",
  "Emrg", "C.Plz", "L.Plz", "Inv", "Deuda",
];

/**
 * BarrasLoader — 20 barras verticales fluctuando con ruido orgánico mientras
 * se calculan, convergiendo a sus alturas target cuando phase === "converging"
 * o "done". Contador inferior sincronizado con progress (0 → 1.048.576).
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function BarrasLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  // Refs del DOM — actualizadas directamente para no provocar re-renders en rAF
  const svgRef = useRef(null);
  const counterRef = useRef(null);
  const rafRef = useRef(null);

  // Alturas target fijas — calculadas una sola vez al montar (0.2..0.9)
  const targetHeightsRef = useRef(
    Array.from({ length: NUM_BARS }, () => 0.2 + Math.random() * 0.7)
  );

  // Alturas actuales de cada barra — evolucionan frame a frame
  const currentHeightsRef = useRef(
    targetHeightsRef.current.map((h) => h)
  );

  // Timestamps de inicio del rebote por barra (se rellenan al entrar en "done")
  const bounceTimesRef = useRef(Array(NUM_BARS).fill(0));

  // Ref al progress y phase actuales para leerlos dentro del rAF sin closures
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    // Detectar entrada en "done" para disparar el rebote
    if (phase === "done" && phaseRef.current !== "done") {
      const now = Date.now();
      // Delay escalonado: cada barra empieza su rebote 30ms después de la anterior
      bounceTimesRef.current = Array.from({ length: NUM_BARS }, (_, i) => now + i * 30);
    }
    phaseRef.current = phase;
  }, [phase]);

  // Dimensiones derivadas del size
  const labelAreaHeight = Math.round(size * 0.14); // espacio para etiquetas rotadas
  const svgHeight = Math.round(size * 0.72);
  const paddingTop = Math.round(size * 0.06);
  const paddingBottom = Math.round(size * 0.03);
  const paddingX = Math.round(size * 0.03);
  const refLineX = Math.round(size * 0.055); // donde arranca la línea de referencia
  const availableWidth = size - paddingX - refLineX;
  const barAreaHeight = svgHeight - paddingTop - paddingBottom;

  // Ancho de barra + gap
  const gap = availableWidth * 0.016;
  const barWidth = (availableWidth - gap * (NUM_BARS - 1)) / NUM_BARS;
  const barRadius = Math.max(1, Math.round(barWidth * 0.22));

  // Posición Y de la línea de referencia (50% de barAreaHeight desde el fondo)
  const refLineY = paddingTop + barAreaHeight * 0.5;

  // Tamaños de texto escalados
  const counterFontSize = Math.round(size * 0.082);
  const labelFontSize = Math.round(size * 0.044);

  useEffect(() => {
    const svg = svgRef.current;
    const counter = counterRef.current;
    if (!svg || !counter) return;

    // Referencias a los rects una sola vez
    const rects = Array.from(svg.querySelectorAll("rect[data-bar]"));

    function tick() {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;
      const now = Date.now();

      // Barra activa en fase "calculating" — la que "está siendo calculada"
      const activeBar = currentPhase === "calculating"
        ? Math.floor(currentProgress * NUM_BARS) % NUM_BARS
        : -1;

      rects.forEach((rect, i) => {
        const target = targetHeightsRef.current[i];
        const current = currentHeightsRef.current[i];

        let next;
        let fillColor;
        let opacity;

        if (currentPhase === "calculating") {
          // Fluctuación orgánica: wobble sinusoidal con frecuencia única por barra
          const wobble = Math.sin(now / 300 + i * 0.7) * 0.15;
          next = target + wobble;
          next = Math.max(0.05, Math.min(0.97, next));

          if (i === activeBar) {
            // Barra activa: color primario con glow
            fillColor = "url(#grad-active-" + i + ")";
            opacity = "1";
            rect.setAttribute("filter", "url(#bar-glow)");
          } else {
            fillColor = "url(#grad-" + i + ")";
            opacity = "0.42";
            rect.removeAttribute("filter");
          }

        } else if (currentPhase === "converging") {
          // Convergencia con delay por índice: cada barra empieza a converger
          // escalonada de izquierda a derecha
          const overallConverge = Math.min((currentProgress - 0.6) / 0.35, 1);
          // Delay: barra i empieza cuando overallConverge > i/NUM_BARS * 0.6
          const barDelay = (i / NUM_BARS) * 0.55;
          const barConverge = Math.max(0, Math.min((overallConverge - barDelay) / 0.45, 1));

          const wobbleScale = 1 - barConverge;
          const wobble = Math.sin(now / 300 + i * 0.7) * 0.15 * wobbleScale;
          next = current + (target + wobble - current) * (0.06 + barConverge * 0.1);

          // Color ondulatoria: cada barra transiciona a primary en su propio tiempo
          rect.removeAttribute("filter");
          if (barConverge > 0.4) {
            fillColor = "url(#grad-" + i + "-primary)";
            opacity = String(0.55 + barConverge * 0.45);
          } else {
            fillColor = "url(#grad-" + i + ")";
            opacity = String(0.42 + barConverge * 0.3);
          }

        } else {
          // "done": rebote de asentamiento
          const bounceStartTime = bounceTimesRef.current[i];
          const elapsed = now - bounceStartTime;
          let bounceY = 0;

          if (elapsed >= 0 && elapsed < 400) {
            // Función de rebote: sube (overshoot) y vuelve con amortiguación
            const t = elapsed / 400;
            // Overshoot exponencialmente amortiguado: sube 8% y rebota
            bounceY = Math.sin(t * Math.PI * 2.2) * Math.exp(-t * 3.5) * 0.08;
          }

          next = target + bounceY;
          fillColor = "url(#grad-" + i + "-primary)";
          opacity = "1";
          rect.removeAttribute("filter");
        }

        currentHeightsRef.current[i] = next;

        const barH = Math.round(next * barAreaHeight);
        const y = paddingTop + barAreaHeight - barH;

        rect.setAttribute("y", y);
        rect.setAttribute("height", barH);
        rect.setAttribute("fill", fillColor);
        rect.setAttribute("opacity", opacity);
      });

      // Contador numérico — sincronizado con progress
      const count = Math.round(currentProgress * COUNTER_MAX);
      counter.textContent = count.toLocaleString("es-ES");

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barAreaHeight, paddingTop, refLineX]);

  return (
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size }}
      className="flex flex-col items-center"
    >
      {/* Barras SVG */}
      <svg
        ref={svgRef}
        width={size}
        height={svgHeight}
        aria-hidden="true"
        overflow="visible"
      >
        <defs>
          {/* Filtro glow para barra activa */}
          <filter id="bar-glow" x="-40%" y="-20%" width="180%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradientes por barra — neutro (muted) y primary */}
          {Array.from({ length: NUM_BARS }, (_, i) => (
            <g key={i}>
              {/* Gradiente neutro: base sólida (abajo=y2=1), punta etérea (arriba=y1=0) */}
              <linearGradient
                id={`grad-${i}`}
                x1="0" y1="0" x2="0" y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  offset="0%"
                  stopColor="var(--foreground)"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="var(--foreground)"
                  stopOpacity="0.58"
                />
              </linearGradient>

              {/* Gradiente primary — para convergencia y done */}
              <linearGradient
                id={`grad-${i}-primary`}
                x1="0" y1="0" x2="0" y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.65"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="1"
                />
              </linearGradient>

              {/* Gradiente active — barra siendo calculada */}
              <linearGradient
                id={`grad-active-${i}`}
                x1="0" y1="0" x2="0" y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="40%"
                  stopColor="var(--primary)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="1"
                />
              </linearGradient>
            </g>
          ))}
        </defs>

        {/* Línea de referencia al 50% */}
        <line
          x1={refLineX - 2}
          y1={refLineY}
          x2={size - paddingX + 2}
          y2={refLineY}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        {/* Etiqueta "50%" */}
        <text
          x={refLineX - 4}
          y={refLineY}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={Math.round(size * 0.038)}
          fill="var(--muted-foreground)"
          opacity="0.6"
        >
          50%
        </text>

        {/* Barras */}
        {Array.from({ length: NUM_BARS }, (_, i) => {
          const x = refLineX + i * (barWidth + gap);
          return (
            <rect
              key={i}
              data-bar={i}
              x={Math.round(x)}
              y={paddingTop + barAreaHeight}
              width={Math.round(barWidth)}
              height={0}
              rx={barRadius}
              fill={`url(#grad-${i})`}
              opacity="0.42"
            />
          );
        })}
      </svg>

      {/* Etiquetas de categoría bajo las barras */}
      <div
        aria-hidden="true"
        style={{
          width: size,
          height: labelAreaHeight,
          paddingLeft: refLineX,
          paddingRight: paddingX,
          overflow: "hidden",
        }}
        className="flex items-start"
      >
        {Array.from({ length: NUM_BARS }, (_, i) => {
          const slotWidth = barWidth + (i < NUM_BARS - 1 ? gap : 0);
          return (
            <div
              key={i}
              style={{
                width: Math.round(slotWidth),
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 3,
              }}
            >
              <span
                style={{
                  fontSize: Math.max(6, Math.round(size * 0.034)),
                  color: "var(--muted-foreground)",
                  opacity: 0.55,
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  lineHeight: 1,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {BAR_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contador */}
      <div
        className="flex flex-col items-center"
        style={{ gap: Math.round(size * 0.012), marginTop: Math.round(size * 0.01) }}
      >
        <span
          ref={counterRef}
          className="font-mono tabular-nums"
          style={{
            fontSize: counterFontSize,
            color: "var(--primary)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          0
        </span>
        <span
          style={{
            fontSize: labelFontSize,
            color: "var(--muted-foreground)",
            opacity: 0.7,
            letterSpacing: "0.01em",
          }}
        >
          distribuciones posibles analizadas
        </span>
      </div>
    </div>
  );
}
