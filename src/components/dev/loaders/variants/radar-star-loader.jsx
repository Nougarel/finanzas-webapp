"use client";

import { useEffect, useRef } from "react";

const N = 20; // una categoría por eje

// Targets deterministas: simulan distribución realista de las 20 categorías.
// Valores entre 0.35 y 0.82 del radio máximo, variados semánticamente por bloque.
// Declarado fuera del componente para ser constante de módulo (no se recrea en cada render).
const TARGETS = [
  0.80, 0.55, 0.70, 0.60, 0.50, // housing..education (needs)
  0.45, 0.40, 0.42, 0.38, 0.48, // dining_out..entertainment (wants)
  0.43, 0.39, 0.36, 0.35,        // hobbies..gifts (wants)
  0.55, 0.72, 0.65, 0.78, 0.82, // life_insurance..investment (savings)
  0.50,                           // debt_extra
];

// Calcula el punto (x, y) en el eje i a radio r
function axisPoint(i, center, r) {
  const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
}

// Genera el atributo `points` para un polígono radar dado un radio uniforme (grilla)
function gridPolygon(center, maxR, fraction) {
  return Array.from({ length: N }, (_, i) => {
    const p = axisPoint(i, center, maxR * fraction);
    return `${p.x},${p.y}`;
  }).join(" ");
}

// Genera el atributo `points` para el polígono de valores actuales (values: array 0..1 por eje)
function valuePolygon(values, center, maxR) {
  return values
    .map((v, i) => {
      const p = axisPoint(i, center, maxR * v);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

/**
 * RadarStarLoader — gráfico de radar con 20 ejes (uno por categoría financiera).
 * Los valores fluctúan durante el cálculo y convergen a los targets finales.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function RadarStarLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  // Refs para leer progress/phase sin recapturar closure en rAF
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Valores actuales: empiezan en los targets (deterministas, evita hydration mismatch).
  // El rAF los modifica en el primer frame añadiendo fluctuación.
  const valuesRef = useRef([...TARGETS]);

  const CENTER = size / 2;
  const MAX_R = size * 0.42;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Referencias a elementos SVG — actualizamos atributos directamente sin re-render
    const valuePolyEl = svg.querySelector("[data-value-poly]");
    const dotEls = Array.from(svg.querySelectorAll("[data-dot]"));

    function tick() {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;
      const now = Date.now();

      const values = valuesRef.current;

      for (let i = 0; i < N; i++) {
        if (currentPhase === "calculating") {
          // Fluctuación orgánica: ruido sinusoidal único por eje
          values[i] = TARGETS[i] + 0.15 * Math.sin(now / 400 + i * 0.7);
          values[i] = Math.max(0.10, Math.min(0.97, values[i]));
        } else if (currentPhase === "converging") {
          // Lerp hacia el target — converge suavemente
          values[i] = values[i] + (TARGETS[i] - values[i]) * 0.05;
        } else {
          // "done": fijado exactamente al target
          values[i] = TARGETS[i];
        }
      }

      // Actualizar polígono de valores
      if (valuePolyEl) {
        const pts = valuePolygon(values, CENTER, MAX_R);
        valuePolyEl.setAttribute("points", pts);

        // Color y relleno según fase
        if (currentPhase === "calculating") {
          valuePolyEl.setAttribute("fill", "color-mix(in oklch, var(--primary) 15%, transparent)");
          valuePolyEl.setAttribute("stroke", "color-mix(in oklch, var(--muted-foreground) 60%, transparent)");
          valuePolyEl.setAttribute("stroke-width", "1.5");
        } else if (currentPhase === "converging") {
          // Transición progresiva hacia primary
          const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
          const fillPct = Math.round((15 + cp * 10));
          const strokePct = Math.round((60 + cp * 40));
          valuePolyEl.setAttribute("fill", `color-mix(in oklch, var(--primary) ${fillPct}%, transparent)`);
          valuePolyEl.setAttribute("stroke", `color-mix(in oklch, var(--primary) ${strokePct}%, transparent)`);
          valuePolyEl.setAttribute("stroke-width", String(1.5 + cp * 0.5));
        } else {
          // "done"
          valuePolyEl.setAttribute("fill", "color-mix(in oklch, var(--primary) 30%, transparent)");
          valuePolyEl.setAttribute("stroke", "var(--primary)");
          valuePolyEl.setAttribute("stroke-width", "2");
        }
      }

      // Puntos en vértices — visibles solo en "done"
      dotEls.forEach((dot, i) => {
        if (currentPhase === "done") {
          const p = axisPoint(i, CENTER, MAX_R * values[i]);
          dot.setAttribute("cx", p.x.toFixed(2));
          dot.setAttribute("cy", p.y.toFixed(2));
          dot.setAttribute("opacity", "1");
        } else {
          dot.setAttribute("opacity", "0");
        }
      });

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
  }, [CENTER, MAX_R]);

  // Puntos iniciales del polígono y dots — calculados a partir de TARGETS (deterministas)
  const initialPoints = valuePolygon(TARGETS, CENTER, MAX_R);
  const dotRadius = Math.max(2, size * 0.014);
  const centerRadius = Math.max(2, size * 0.018);

  return (
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        aria-hidden="true"
      >
        {/* Grilla radar: 4 polígonos concéntricos de referencia (25%, 50%, 75%, 100%) */}
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <polygon
            key={fraction}
            points={gridPolygon(CENTER, MAX_R, fraction)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={fraction === 1 ? "1" : "0.75"}
            opacity={fraction === 1 ? "0.6" : "0.4"}
          />
        ))}

        {/* Ejes radiales: líneas tenues desde el centro a la periferia */}
        {Array.from({ length: N }, (_, i) => {
          const outer = axisPoint(i, CENTER, MAX_R);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={outer.x.toFixed(2)}
              y2={outer.y.toFixed(2)}
              stroke="var(--border)"
              strokeWidth="0.75"
              opacity="0.5"
            />
          );
        })}

        {/* Polígono de valores actuales — actualizado frame a frame en rAF */}
        <polygon
          data-value-poly
          points={initialPoints}
          fill="color-mix(in oklch, var(--primary) 15%, transparent)"
          stroke="color-mix(in oklch, var(--muted-foreground) 60%, transparent)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Puntos en vértices — visibles solo en fase "done", posición actualizada en rAF */}
        {Array.from({ length: N }, (_, i) => {
          const p = axisPoint(i, CENTER, MAX_R * TARGETS[i]);
          return (
            <circle
              key={i}
              data-dot={i}
              cx={p.x.toFixed(2)}
              cy={p.y.toFixed(2)}
              r={dotRadius}
              fill="var(--primary)"
              opacity="0"
            />
          );
        })}

        {/* Punto central */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={centerRadius}
          fill="var(--primary)"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
