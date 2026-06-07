"use client";

import { useEffect, useRef } from "react";

const NUM_BARS = 20;
const COUNTER_MAX = 1048576; // 2^20

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

  // Ref al progress y phase actuales para leerlos dentro del rAF sin closures
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Dimensiones derivadas del size
  const svgHeight = size * 0.78;
  const paddingTop = size * 0.05;
  const paddingBottom = size * 0.04;
  const paddingX = size * 0.03;
  const availableWidth = size - paddingX * 2;
  const barAreaHeight = svgHeight - paddingTop - paddingBottom;

  // Ancho de barra + gap
  const gap = availableWidth * 0.018;
  const barWidth = (availableWidth - gap * (NUM_BARS - 1)) / NUM_BARS;

  useEffect(() => {
    const svg = svgRef.current;
    const counter = counterRef.current;
    if (!svg || !counter) return;

    // Obtener referencias a los rects una sola vez
    const rects = Array.from(svg.querySelectorAll("rect[data-bar]"));

    function tick() {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;
      const now = Date.now();

      rects.forEach((rect, i) => {
        const target = targetHeightsRef.current[i];
        const current = currentHeightsRef.current[i];

        let next;

        if (currentPhase === "calculating") {
          // Fluctuación orgánica: wobble sinusoidal con frecuencia única por barra
          const wobble = Math.sin(now / 300 + i * 0.7) * 0.15;
          next = target + wobble;
          next = Math.max(0.05, Math.min(0.97, next));
        } else if (currentPhase === "converging") {
          // Convergencia progresiva al target. El wobble se reduce linealmente.
          // convergingProgress: qué tan avanzado está en la fase 0.6..0.95
          const convergingProgress = Math.min(
            (currentProgress - 0.6) / 0.35,
            1
          );
          const wobbleScale = 1 - convergingProgress; // 1→0 durante convergencia
          const wobble =
            Math.sin(now / 300 + i * 0.7) * 0.15 * wobbleScale;
          // lerp hacia el target
          next = current + (target + wobble - current) * 0.08;
        } else {
          // "done": fijadas exactamente al target
          next = target;
        }

        currentHeightsRef.current[i] = next;

        const barH = Math.round(next * barAreaHeight);
        const y = paddingTop + barAreaHeight - barH;

        rect.setAttribute("y", y);
        rect.setAttribute("height", barH);

        // Color según fase
        if (currentPhase === "done") {
          rect.setAttribute("fill", "hsl(var(--primary))");
          rect.setAttribute("opacity", "1");
        } else if (currentPhase === "converging") {
          // Transición de muted-foreground/40 a primary según convergingProgress
          const convergingProgress = Math.min(
            (currentProgress - 0.6) / 0.35,
            1
          );
          if (convergingProgress > 0.5) {
            rect.setAttribute("fill", "hsl(var(--primary))");
            rect.setAttribute("opacity", String(0.6 + convergingProgress * 0.4));
          } else {
            rect.setAttribute("fill", "hsl(var(--muted-foreground))");
            rect.setAttribute("opacity", "0.45");
          }
        } else {
          rect.setAttribute("fill", "hsl(var(--muted-foreground))");
          rect.setAttribute("opacity", "0.4");
        }
      });

      // Contador numérico — sincronizado con progress
      const count = Math.round(currentProgress * COUNTER_MAX);
      // Formato español: separador de miles con punto
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
  }, [barAreaHeight, paddingTop]);

  return (
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size }}
      className="flex flex-col items-center"
    >
      {/* Barras SVG */}
      <svg
        ref={svgRef}
        width={size}
        height={svgHeight}
        aria-hidden="true"
      >
        {Array.from({ length: NUM_BARS }, (_, i) => {
          const x = paddingX + i * (barWidth + gap);
          return (
            <rect
              key={i}
              data-bar={i}
              x={Math.round(x)}
              y={paddingTop + barAreaHeight}
              width={Math.round(barWidth)}
              height={0}
              rx={Math.max(1, Math.round(barWidth * 0.18))}
              fill="hsl(var(--muted-foreground))"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* Contador */}
      <div
        className="flex flex-col items-center gap-0.5"
        style={{ marginTop: size * 0.01 }}
      >
        <span
          ref={counterRef}
          className="font-mono text-foreground"
          style={{ fontSize: Math.round(size * 0.068) }}
          aria-live="polite"
          aria-atomic="true"
        >
          0
        </span>
        <span
          className="text-muted-foreground"
          style={{ fontSize: Math.round(size * 0.046) }}
        >
          distribuciones comprobadas
        </span>
      </div>
    </div>
  );
}
