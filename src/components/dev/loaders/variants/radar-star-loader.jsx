"use client";

import { useEffect, useRef } from "react";

const N = 20; // una categoría por eje

// Targets deterministas: simulan distribución realista de las 20 categorías.
// Valores entre 0.35 y 0.82 del radio máximo, variados semánticamente por bloque.
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
 * Efecto 3D mediante CSS perspective + rotateX.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function RadarStarLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const svgRef = useRef(null);
  const innerDivRef = useRef(null);
  const rafRef = useRef(null);

  // Refs para leer progress/phase sin recapturar closure en rAF
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);
  // Ángulo de rotación Z acumulado (giro lento continuo)
  const rotZRef = useRef(0);
  // Timestamp del último frame para delta time independiente del framerate
  const lastTimeRef = useRef(null);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Valores actuales: empiezan en los targets (deterministas, evita hydration mismatch).
  const valuesRef = useRef([...TARGETS]);

  const CENTER = size / 2;
  const MAX_R = size * 0.42;

  useEffect(() => {
    const svg = svgRef.current;
    const innerDiv = innerDivRef.current;
    if (!svg || !innerDiv) return;

    // Referencias a elementos SVG — actualizamos atributos directamente sin re-render
    const valuePolyEl = svg.querySelector("[data-value-poly]");
    const dotEls = Array.from(svg.querySelectorAll("[data-dot]"));
    const axisEls = Array.from(svg.querySelectorAll("[data-axis]"));

    function tick(timestamp) {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;

      // Delta time en segundos para rotación independiente del framerate
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap a 50ms
      lastTimeRef.current = timestamp;

      const now = timestamp; // usar timestamp del rAF, no Date.now()
      const values = valuesRef.current;

      // --- Rotación lenta en Z del SVG (gira el radar como flotando) ---
      if (currentPhase === "calculating") {
        rotZRef.current += 18 * dt; // 18°/segundo
      } else if (currentPhase === "converging") {
        // Decelera progresivamente
        const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
        rotZRef.current += 18 * (1 - cp * 0.9) * dt;
      }
      // done: sin rotación (queda fijo)

      // --- Inclinación rotateX: 18° calculando → 5° done ---
      let rotX;
      if (currentPhase === "calculating") {
        rotX = 18;
      } else if (currentPhase === "converging") {
        const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
        rotX = 18 - cp * 13; // 18° → 5°
      } else {
        rotX = 5;
      }

      innerDiv.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZRef.current.toFixed(2)}deg)`;

      // --- Valores del polígono ---
      for (let i = 0; i < N; i++) {
        if (currentPhase === "calculating") {
          values[i] = TARGETS[i] + 0.15 * Math.sin(now / 400 + i * 0.7);
          values[i] = Math.max(0.10, Math.min(0.97, values[i]));
        } else if (currentPhase === "converging") {
          values[i] = values[i] + (TARGETS[i] - values[i]) * 0.05;
        } else {
          values[i] = TARGETS[i];
        }
      }

      // --- Polígono de valores ---
      if (valuePolyEl) {
        const pts = valuePolygon(values, CENTER, MAX_R);
        valuePolyEl.setAttribute("points", pts);

        if (currentPhase === "calculating") {
          valuePolyEl.setAttribute("fill", `url(#radar-grad-${size}-calc)`);
          valuePolyEl.setAttribute("stroke", "color-mix(in oklch, var(--muted-foreground) 60%, transparent)");
          valuePolyEl.setAttribute("stroke-width", "1.5");
        } else if (currentPhase === "converging") {
          const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
          const strokePct = Math.round(60 + cp * 40);
          valuePolyEl.setAttribute("fill", `url(#radar-grad-${size}-calc)`);
          valuePolyEl.setAttribute("stroke", `color-mix(in oklch, var(--primary) ${strokePct}%, transparent)`);
          valuePolyEl.setAttribute("stroke-width", String(1.5 + cp * 0.5));
        } else {
          valuePolyEl.setAttribute("fill", `url(#radar-grad-${size}-done)`);
          valuePolyEl.setAttribute("stroke", "var(--primary)");
          valuePolyEl.setAttribute("stroke-width", "2");
        }
      }

      // --- Ejes que se construyen con el progreso ---
      // visibleAxes: empieza en 5, llega a 20 conforme progress avanza
      const visibleAxes = currentPhase === "done"
        ? N
        : Math.max(5, Math.floor(currentProgress * N + 5));

      axisEls.forEach((axisEl, i) => {
        const idx = parseInt(axisEl.getAttribute("data-axis"), 10);
        if (idx < visibleAxes) {
          axisEl.setAttribute("opacity", "0.5");
        } else {
          axisEl.setAttribute("opacity", "0");
        }
      });

      // --- Puntos en vértices ---
      dotEls.forEach((dot, i) => {
        if (currentPhase === "done") {
          const p = axisPoint(i, CENTER, MAX_R * values[i]);
          dot.setAttribute("cx", p.x.toFixed(2));
          dot.setAttribute("cy", p.y.toFixed(2));
          // Pulso sinusoidal del radio: oscila entre dotRadius y dotRadius*1.8
          const dotBase = Math.max(2, size * 0.014);
          const pulse = 1 + 0.5 * Math.sin(now / 700 + i * (Math.PI / 4));
          dot.setAttribute("r", (dotBase * pulse).toFixed(2));
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
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CENTER, MAX_R, size]);

  // Puntos iniciales del polígono y dots — calculados a partir de TARGETS (deterministas)
  const initialPoints = valuePolygon(TARGETS, CENTER, MAX_R);
  const dotRadius = Math.max(2, size * 0.014);
  const centerRadius = Math.max(2, size * 0.018);

  // ID único para gradients (evita colisiones si hay varios size distintos en la página)
  const gradIdCalc = `radar-grad-${size}-calc`;
  const gradIdDone = `radar-grad-${size}-done`;

  return (
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size, position: "relative" }}
    >
      {/* Contenedor perspectiva — crea el plano 3D */}
      <div
        style={{
          perspective: `${size * 3}px`,
          perspectiveOrigin: "50% 50%",
          width: size,
          height: size,
        }}
      >
        {/* Div interior inclinado — rotateX + rotateZ actualizados en rAF */}
        <div
          ref={innerDivRef}
          style={{
            transform: `rotateX(${phase === "done" ? 5 : 18}deg) rotateZ(0deg)`,
            transformOrigin: "50% 50%",
            width: size,
            height: size,
          }}
        >
          <svg
            ref={svgRef}
            width={size}
            height={size}
            aria-hidden="true"
          >
            <defs>
              {/* Gradiente radial para fase calculando/convergiendo */}
              <radialGradient id={gradIdCalc} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
              </radialGradient>
              {/* Gradiente radial para fase done — más saturado */}
              <radialGradient id={gradIdDone} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.08" />
              </radialGradient>
            </defs>

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

            {/* Ejes radiales: visibilidad controlada en rAF según progreso */}
            {Array.from({ length: N }, (_, i) => {
              const outer = axisPoint(i, CENTER, MAX_R);
              // Los primeros 5 comienzan visibles; el resto en opacity 0 (rAF los activa)
              return (
                <line
                  key={i}
                  data-axis={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={outer.x.toFixed(2)}
                  y2={outer.y.toFixed(2)}
                  stroke="var(--border)"
                  strokeWidth="0.75"
                  opacity={i < 5 ? "0.5" : "0"}
                />
              );
            })}

            {/* Polígono de valores actuales — actualizado frame a frame en rAF */}
            <polygon
              data-value-poly
              points={initialPoints}
              fill={`url(#${gradIdCalc})`}
              stroke="color-mix(in oklch, var(--muted-foreground) 60%, transparent)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Puntos en vértices — visibles solo en fase "done", con pulso */}
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
      </div>

      {/* Overlay informativo — fuera del div inclinado para que sea siempre legible */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 9,
          color: "var(--muted-foreground)",
          opacity: 0.6,
          fontFamily: "inherit",
          pointerEvents: "none",
          letterSpacing: "0.03em",
        }}
        aria-hidden="true"
      >
        20 dimensiones · espacio de soluciones
      </div>
    </div>
  );
}
