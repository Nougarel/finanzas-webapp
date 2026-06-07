"use client";

import { useRef, useEffect } from "react";

const PARTICLE_COUNT = 200;

/**
 * ParticlesLoader — partículas dispersas que convergen al centro conforme avanza
 * `progress`. Representan el espacio de soluciones financieras posibles colapsando
 * hacia la distribución óptima.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function ParticlesLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const canvasRef = useRef(null);
  // Ref de color helper invisible — div con class text-primary para leer RGB resuelto
  const colorProbeRef = useRef(null);
  const particlesRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);
  // Colores cacheados tras leerlos del DOM (se leen una sola vez al montar)
  const colorsRef = useRef({ primary: null, muted: null });

  // Mantener refs actualizados sin recapturar closure en rAF
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Inicializar partículas y arrancar el loop de animación
  useEffect(() => {
    const canvas = canvasRef.current;
    const colorProbe = colorProbeRef.current;
    if (!canvas || !colorProbe) return;

    const cx = size / 2;
    const cy = size / 2;

    // Leer colores del tema vía elementos proxy con clases Tailwind.
    // getComputedStyle devuelve rgb(...) — Canvas entiende ese formato.
    const primaryProbe = colorProbe.querySelector("[data-probe='primary']");
    const mutedProbe = colorProbe.querySelector("[data-probe='muted']");
    colorsRef.current = {
      primary: getComputedStyle(primaryProbe).color,
      muted: getComputedStyle(mutedProbe).color,
    };

    // Inicializar partículas: posición aleatoria + destino cerca del centro
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x0: Math.random() * size,
      y0: Math.random() * size,
      xDest: cx + (Math.random() - 0.5) * 10,
      yDest: cy + (Math.random() - 0.5) * 10,
      // Frecuencias y fases únicas por partícula para wiggle independiente
      freqX: 0.002 + Math.random() * 0.003,
      freqY: 0.002 + Math.random() * 0.003,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      r: 1.2 + Math.random() * 1.3,
    }));

    let startTime = null;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = timestamp - startTime;

      const ctx = canvas.getContext("2d");
      const p = progressRef.current;
      const ph = phaseRef.current;
      const { primary, muted } = colorsRef.current;

      ctx.clearRect(0, 0, size, size);

      // easeInOutQuad para suavizar la interpolación de posición
      const easedP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      // Amplitud del wiggle decrece conforme progress avanza → convergencia limpia
      const amplitude = 10 * (1 - p);

      for (const pt of particlesRef.current) {
        // Posición interpolada desde origen hasta destino + wiggle sinusoidal
        const x =
          pt.x0 +
          (pt.xDest - pt.x0) * easedP +
          amplitude * Math.sin(t * pt.freqX + pt.phaseX);
        const y =
          pt.y0 +
          (pt.yDest - pt.y0) * easedP +
          amplitude * Math.sin(t * pt.freqY + pt.phaseY);

        // Color: muted en calculating → primary en converging/done
        // Transición en la mitad del recorrido (progress > 0.5)
        const usesPrimary = ph === "done" || p > 0.5;
        const baseColor = usesPrimary ? primary : muted;

        // Opacidad sube con progress: 0.35 → 0.85
        const alpha = 0.35 + p * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, pt.r, 0, Math.PI * 2);

        // Pintar con la opacidad calculada.
        // ctx.globalAlpha afecta a todo; se resetea tras cada partícula.
        ctx.globalAlpha = alpha;
        ctx.fillStyle = baseColor;
        ctx.fill();
      }

      // Destello central en fase "done" — halo sobre el punto de convergencia
      if (ph === "done") {
        ctx.globalAlpha = 0.25;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.18);
        grad.addColorStop(0, primary);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    // El div externo actúa como región de accesibilidad
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size, position: "relative" }}
    >
      {/* Elementos proxy invisibles para leer colores del tema vía CSS.
          text-primary y text-muted-foreground resuelven las CSS vars oklch
          a valores rgb que Canvas 2D sí entiende. */}
      <div
        ref={colorProbeRef}
        aria-hidden="true"
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
      >
        <span data-probe="primary" className="text-primary" />
        <span data-probe="muted" className="text-muted-foreground" />
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        aria-hidden="true"
      />
    </div>
  );
}
