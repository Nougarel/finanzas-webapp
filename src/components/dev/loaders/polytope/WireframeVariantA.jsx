"use client";

import { useEffect, useRef } from "react";

/**
 * WireframeVariantA — 7D Cross-polytope
 * 14 vértices (±e_i para i=0..6), 84 aristas, proyección 7D→2D con rotaciones
 * Givens en múltiples planos del espacio 7D.
 *
 * Arquitectura de rendering:
 * - Todo el estado visual se actualiza directamente via setAttribute en rAF.
 *   Sin useState para coordenadas ni colores — evita re-renders en cada frame.
 * - Los colores del tema se resuelven una vez al montar (getComputedStyle).
 * - El glow del vértice óptimo usa @keyframes inline en el SVG.
 *
 * @param {number}  progress   0..1
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number}  size       px del SVG (cuadrado)
 */

// --- Geometría 7D Cross-polytope ---

const N = 7;

// 14 vértices: ±e_i para i = 0..6
// VERTICES[2i] = +e_i, VERTICES[2i+1] = -e_i
const VERTICES = [];
for (let i = 0; i < N; i++) {
  const pos = new Array(N).fill(0); pos[i] =  1; VERTICES.push(pos);
  const neg = new Array(N).fill(0); neg[i] = -1; VERTICES.push(neg);
}

// 84 aristas: todos los pares no antipodales
// Dos vértices son antipodales si Math.floor(a/2) === Math.floor(b/2)
const EDGES = [];
for (let a = 0; a < 14; a++) {
  for (let b = a + 1; b < 14; b++) {
    if (Math.floor(a / 2) !== Math.floor(b / 2)) {
      EDGES.push([a, b]);
    }
  }
}
// Resultado: 84 aristas

// Secuencia de visitas — simula recorrido simplex (determinista)
const VISIT_ORDER = [0, 3, 6, 9, 12, 1, 4, 7, 10, 13, 2, 5, 8, 11];

// Planos de rotación Givens y sus velocidades angulares (rad/s)
const ROTATION_PLANES = [
  [0, 1, 1.20],
  [2, 3, 0.70],
  [4, 5, 0.90],
  [0, 3, 0.75],
  [1, 4, 0.52],
  [0, 6, 0.30],
];

// --- Funciones matemáticas ---

// Aplica una rotación de Givens en el plano (i, j) con ángulo theta
function applyGivens(v, i, j, theta) {
  const result = [...v];
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  result[i] = v[i] * c - v[j] * s;
  result[j] = v[i] * s + v[j] * c;
  return result;
}

// Proyecta un vértice 7D rotado al plano 2D del SVG con perspectiva.
// Toma las coords 0 y 1 como (x, y) y la coord 2 como profundidad (z).
// Los vértices del cross-polytope 7D tienen norma 1 (un único componente ±1).
// Tras las rotaciones Givens ese radio unitario se distribuye entre dimensiones,
// por lo que coords[0] y coords[1] tienen amplitud ~1/√7 ≈ 0.38 en promedio.
// Para llenar bien el panel multiplicamos por SPREAD_FACTOR que compensa esto.
function project7d(rotated, center, radius) {
  const FOCAL        = 3;
  // Factor de escala extra: compensa que los vértices 7D proyectados tienen
  // amplitud media ~1/√7; SPREAD_FACTOR ≈ √7 ≈ 2.65 lleva el radio medio a ~radius
  const SPREAD_FACTOR = 2.6;
  const z = rotated[2];
  const scale = (radius * SPREAD_FACTOR) / (z + FOCAL);
  return {
    x: center + rotated[0] * scale,
    y: center + rotated[1] * scale,
    z: z,
  };
}

export function WireframeVariantA({ progress, phase, isApiDone, size = 400 }) {
  const svgRef           = useRef(null);
  const edgesGroupRef    = useRef(null);
  const verticesGroupRef = useRef(null);
  const glowGroupRef     = useRef(null);
  const jumpLineRef      = useRef(null);
  const rafRef           = useRef(null);
  // Ángulos acumulados — uno por plano de rotación
  const anglesRef        = useRef(ROTATION_PLANES.map(() => 0));
  const lastTimeRef      = useRef(null);
  const lastVisitedRef   = useRef(0);
  const jumpStartRef     = useRef(null);
  // Refs para leer phase/progress dentro del rAF sin closures obsoletas
  const progressRef      = useRef(progress);
  const phaseRef         = useRef(phase);

  const JUMP_DURATION = 350; // ms que dura el trazo de salto

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const svg           = svgRef.current;
    const edgesGroup    = edgesGroupRef.current;
    const verticesGroup = verticesGroupRef.current;
    const glowGroup     = glowGroupRef.current;
    const jumpLine      = jumpLineRef.current;
    if (!svg || !edgesGroup || !verticesGroup || !glowGroup || !jumpLine) return;

    const edgeLines     = Array.from(edgesGroup.querySelectorAll("line[data-edge]"));
    const vertexCircles = Array.from(verticesGroup.querySelectorAll("circle[data-vertex]"));
    const glowCircles   = Array.from(glowGroup.querySelectorAll("circle[data-glow]"));

    // Resolver colores del tema una vez al montar
    const computedSvg = window.getComputedStyle(svg);

    function resolveColor(raw) {
      if (!raw) return "rgb(0,0,0)";
      const temp = document.createElement("div");
      temp.style.color = (raw.startsWith("oklch") || raw.startsWith("lab"))
        ? raw
        : `hsl(${raw})`;
      document.body.appendChild(temp);
      const resolved = window.getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return resolved || "rgb(0,0,0)";
    }

    const colorPrimary    = resolveColor(computedSvg.getPropertyValue("--primary").trim());
    const colorForeground = resolveColor(computedSvg.getPropertyValue("--foreground").trim());
    const colorMuted      = resolveColor(computedSvg.getPropertyValue("--muted-foreground").trim());

    // Parsear RGB para poder construir rgba() en el glow
    function parseRGB(rgbStr) {
      const m = rgbStr.match(/(\d+(?:\.\d+)?)/g);
      return m ? m.map(Number) : [0, 0, 0];
    }
    const [pr, pg, pb] = parseRGB(colorPrimary);

    const center = size / 2;
    const radius = size * 0.42;

    function tick(timestamp) {
      // Calcular dt en segundos
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap 50ms
      lastTimeRef.current = timestamp;

      const currentPhase    = phaseRef.current;
      const currentProgress = progressRef.current;

      // --- Factor de velocidad según phase ---
      let speedFactor = 1.0;
      if (currentPhase === "converging") {
        const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
        speedFactor = Math.max(0, 1 - cp);
      } else if (currentPhase === "done") {
        speedFactor = 0;
      }

      // --- Actualizar ángulos Givens ---
      const angles = anglesRef.current;
      for (let k = 0; k < ROTATION_PLANES.length; k++) {
        angles[k] += ROTATION_PLANES[k][2] * speedFactor * dt;
      }

      // --- Proyectar vértices: rotar en 7D y luego proyectar a 2D ---
      const projected = VERTICES.map((v) => {
        let rotated = v;
        for (let k = 0; k < ROTATION_PLANES.length; k++) {
          const [pi, pj] = ROTATION_PLANES[k];
          rotated = applyGivens(rotated, pi, pj, angles[k]);
        }
        return project7d(rotated, center, radius);
      });

      // --- Estado de visitas ---
      const visitedCount = Math.floor(currentProgress * VISIT_ORDER.length);
      const visitedSet   = new Set(VISIT_ORDER.slice(0, visitedCount));
      const optimalIdx   = (currentPhase === "done" && VISIT_ORDER.length > 0)
        ? VISIT_ORDER[VISIT_ORDER.length - 1]
        : null;

      // Detectar nuevo salto de vértice para activar jump line
      if (visitedCount > lastVisitedRef.current && visitedCount >= 2) {
        const prevIdx = VISIT_ORDER[visitedCount - 2];
        const newIdx  = VISIT_ORDER[visitedCount - 1];
        const prev    = projected[prevIdx];
        const next    = projected[newIdx];

        jumpLine.setAttribute("x1", prev.x.toFixed(1));
        jumpLine.setAttribute("y1", prev.y.toFixed(1));
        jumpLine.setAttribute("x2", next.x.toFixed(1));
        jumpLine.setAttribute("y2", next.y.toFixed(1));
        jumpLine.setAttribute("opacity", "1");
        jumpStartRef.current = timestamp;
      }
      lastVisitedRef.current = visitedCount;

      // Fade-out de la jump line
      if (jumpStartRef.current !== null) {
        const elapsed = timestamp - jumpStartRef.current;
        if (elapsed >= JUMP_DURATION) {
          jumpLine.setAttribute("opacity", "0");
          jumpStartRef.current = null;
        } else {
          const fadeOpacity = (1 - elapsed / JUMP_DURATION).toFixed(3);
          jumpLine.setAttribute("opacity", fadeOpacity);
        }
      }

      // --- Actualizar aristas ---
      edgeLines.forEach((line, idx) => {
        const [ai, bi] = EDGES[idx];
        const a = projected[ai];
        const b = projected[bi];

        // Opacidad basada en profundidad (coord z en [-1..1] aprox tras rotación)
        const zMid    = (a.z + b.z) / 2;
        const zOpacity = Math.max(0.15, Math.min(0.95, 0.35 + 0.60 * ((zMid + 1) / 2)));

        const bothVisited   = visitedSet.has(ai) && visitedSet.has(bi);
        const oneVisited    = !bothVisited && (visitedSet.has(ai) || visitedSet.has(bi));

        if (bothVisited) {
          line.setAttribute("stroke", colorPrimary);
          line.setAttribute("stroke-width", "1.8");
          line.setAttribute("opacity", (zOpacity * 0.9).toFixed(3));
        } else if (oneVisited) {
          line.setAttribute("stroke", colorForeground);
          line.setAttribute("stroke-width", "1.2");
          line.setAttribute("opacity", (zOpacity * 0.45).toFixed(3));
        } else {
          line.setAttribute("stroke", colorMuted);
          line.setAttribute("stroke-width", "0.6");
          // Rango 0.15..0.30 según z
          const inactiveOpacity = Math.max(0.15, Math.min(0.30, zOpacity * 0.30));
          line.setAttribute("opacity", inactiveOpacity.toFixed(3));
        }

        line.setAttribute("x1", a.x.toFixed(1));
        line.setAttribute("y1", a.y.toFixed(1));
        line.setAttribute("x2", b.x.toFixed(1));
        line.setAttribute("y2", b.y.toFixed(1));
      });

      // --- Actualizar vértices ---
      vertexCircles.forEach((circle, idx) => {
        const pt   = projected[idx];
        const zNorm = Math.max(0, Math.min(1, (pt.z + 1) / 2));

        circle.setAttribute("cx", pt.x.toFixed(1));
        circle.setAttribute("cy", pt.y.toFixed(1));

        if (idx === optimalIdx) {
          // Vértice óptimo final: grande, primary 100%
          circle.setAttribute("r", "5.5");
          circle.setAttribute("fill", colorPrimary);
          circle.setAttribute("opacity", "1");
        } else if (visitedSet.has(idx)) {
          // Visitado: mediano, primary
          const r = (2.5 + zNorm * 1.0).toFixed(1);
          circle.setAttribute("r", r);
          circle.setAttribute("fill", colorPrimary);
          circle.setAttribute("opacity", "0.65");
        } else {
          // Inactivo: pequeño, muted
          const r = (1.2 + zNorm * 0.8).toFixed(1);
          circle.setAttribute("r", r);
          circle.setAttribute("fill", colorMuted);
          circle.setAttribute("opacity", (0.25 + zNorm * 0.25).toFixed(3));
        }
      });

      // --- Actualizar círculos de glow (solo en vértice óptimo en phase done) ---
      glowCircles.forEach((glow, idx) => {
        const pt = projected[idx];

        glow.setAttribute("cx", pt.x.toFixed(1));
        glow.setAttribute("cy", pt.y.toFixed(1));

        if (idx === optimalIdx) {
          glow.setAttribute("r", "14");
          glow.setAttribute("fill", `rgba(${pr},${pg},${pb},0.18)`);
          glow.setAttribute("opacity", "1");
          glow.setAttribute("class", "a7d-glow-pulse");
        } else {
          glow.setAttribute("r", "0");
          glow.setAttribute("opacity", "0");
          glow.setAttribute("class", "");
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
  }, []);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes a7d-glow {
            0%, 100% { opacity: 0.15; }
            50%       { opacity: 0.50; }
          }
          .a7d-glow-pulse {
            animation: a7d-glow 1.4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Círculos de glow — debajo de todo */}
      <g ref={glowGroupRef}>
        {VERTICES.map((_, idx) => (
          <circle
            key={idx}
            data-glow={idx}
            cx="0"
            cy="0"
            r="0"
            opacity="0"
          />
        ))}
      </g>

      {/* Grupo de aristas */}
      <g ref={edgesGroupRef}>
        {EDGES.map(([a, b], idx) => (
          <line
            key={idx}
            data-edge={idx}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.2"
          />
        ))}
      </g>

      {/* Línea de salto — trazo temporal entre penúltimo y último visitado */}
      <line
        ref={jumpLineRef}
        x1="0"
        y1="0"
        x2="0"
        y2="0"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        opacity="0"
        style={{ color: "var(--primary)" }}
      />

      {/* Grupo de vértices — encima de aristas */}
      <g ref={verticesGroupRef}>
        {VERTICES.map((_, idx) => (
          <circle
            key={idx}
            data-vertex={idx}
            cx="0"
            cy="0"
            r="2"
            fill="currentColor"
            opacity="0.4"
          />
        ))}
      </g>

      {/* Etiqueta informativa */}
      <text
        x={size * 0.5}
        y={size - 6}
        textAnchor="middle"
        fontSize={size * 0.028}
        fill="var(--muted-foreground)"
        opacity="0.5"
        fontFamily="monospace"
      >
        7D · 14v · 84e
      </text>
    </svg>
  );
}
