"use client";

import { useEffect, useRef } from "react";

/**
 * WireframeLoader — proyección wireframe SVG de un politopo de alta dimensión.
 * 14 vértices (cross-polytope 3D + hipercubo inscrito), aristas densas,
 * rotación 3D con perspectiva.
 *
 * Animación de resolución: simula el recorrido del método simplex por los
 * vértices del politopo. Conforme `progress` avanza, los vértices se "visitan"
 * en una secuencia fija (VISIT_ORDER). Las aristas entre vértices visitados se
 * iluminan. El último vértice visitado es el "óptimo actual".
 *
 * Arquitectura de rendering:
 * - Todo el estado visual se actualiza directamente via setAttribute en rAF.
 *   Sin useState para coordenadas ni colores — evita re-renders en cada frame.
 * - Los colores del tema se resuelven una vez al montar (getComputedStyle).
 * - Para colores individuales por elemento (no por grupo), se usa setAttribute
 *   directamente en stroke/fill de cada elemento SVG.
 * - El glow del vértice óptimo usa @keyframes inline en el SVG (no globals.css).
 *
 * Nota sobre oklch y currentColor:
 * - hsl(var(--x)) no se resuelve en Chromium con TailwindCSS v4 (oklch/lab).
 * - Se resuelven los colores con getComputedStyle una vez al montar y se aplican
 *   como valores RGB directos en setAttribute.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */

// Secuencia de visitas predeterminada (simula recorrido simplex — fija para
// evitar hydration mismatch y asegurar determinismo)
const VISIT_ORDER = [0, 7, 3, 11, 5, 13, 1, 8, 4, 10, 2, 9, 6, 12];

const SQRT3 = Math.sqrt(3);

// Vértices del cross-polytope 3D: (±1,0,0), (0,±1,0), (0,0,±1) → 6 vértices
// + vértices del hipercubo inscrito: (±1,±1,±1)/√3 → 8 vértices
const VERTICES = [
  // Cross-polytope 3D
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1],
  // Hipercubo inscrito (radio = 1/√3 ≈ 0.577)
  [ 1 / SQRT3,  1 / SQRT3,  1 / SQRT3],
  [ 1 / SQRT3,  1 / SQRT3, -1 / SQRT3],
  [ 1 / SQRT3, -1 / SQRT3,  1 / SQRT3],
  [ 1 / SQRT3, -1 / SQRT3, -1 / SQRT3],
  [-1 / SQRT3,  1 / SQRT3,  1 / SQRT3],
  [-1 / SQRT3,  1 / SQRT3, -1 / SQRT3],
  [-1 / SQRT3, -1 / SQRT3,  1 / SQRT3],
  [-1 / SQRT3, -1 / SQRT3, -1 / SQRT3],
];

// Aristas: pares de índices donde la distancia euclidiana 3D ≤ 1.45
const EDGES = [];
const EDGE_THRESHOLD = 1.45;
for (let i = 0; i < VERTICES.length; i++) {
  for (let j = i + 1; j < VERTICES.length; j++) {
    const [ax, ay, az] = VERTICES[i];
    const [bx, by, bz] = VERTICES[j];
    const dist = Math.sqrt(
      (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
    );
    if (dist <= EDGE_THRESHOLD) {
      EDGES.push([i, j]);
    }
  }
}

// Construir índice: para cada vértice, qué aristas lo contienen
const VERTEX_EDGES = Array.from({ length: VERTICES.length }, () => []);
EDGES.forEach(([ai, bi], edgeIdx) => {
  VERTEX_EDGES[ai].push(edgeIdx);
  VERTEX_EDGES[bi].push(edgeIdx);
});

export function WireframeLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const svgRef = useRef(null);
  const edgesGroupRef = useRef(null);
  const verticesGroupRef = useRef(null);
  const glowGroupRef = useRef(null);
  const jumpLineRef = useRef(null);
  const rafRef = useRef(null);
  const angleXRef = useRef(0.45);
  const angleYRef = useRef(0.3);

  // Refs para leer phase/progress dentro del rAF sin closures obsoletas
  const phaseRef = useRef(phase);
  const progressRef = useRef(progress);

  // Seguimiento del último visitedCount para detectar cambios de vértice
  const lastVisitedCountRef = useRef(0);
  // Timestamp del último salto para fade-out de la jump line
  const jumpStartTimeRef = useRef(null);
  const JUMP_DURATION = 350; // ms que dura el trazo de salto

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const RADIUS = size * 0.42;
  const CENTER = size / 2;
  const FOCAL = 3;

  function project(vx, vy, vz, rotX, rotY) {
    const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
    const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
    const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
    const scale = RADIUS / (z2 + FOCAL);
    return {
      x: x1 * scale + CENTER,
      y: y2 * scale + CENTER,
      z: z2,
    };
  }

  useEffect(() => {
    const svg = svgRef.current;
    const edgesGroup = edgesGroupRef.current;
    const verticesGroup = verticesGroupRef.current;
    const glowGroup = glowGroupRef.current;
    const jumpLine = jumpLineRef.current;
    if (!svg || !edgesGroup || !verticesGroup || !glowGroup || !jumpLine) return;

    const edgeLines = Array.from(edgesGroup.querySelectorAll("line[data-edge]"));
    const vertexCircles = Array.from(verticesGroup.querySelectorAll("circle[data-vertex]"));
    const glowCircles = Array.from(glowGroup.querySelectorAll("circle[data-glow]"));

    // Resolver colores del tema una vez al montar
    const computedSvg = window.getComputedStyle(svg);
    const rawForeground = computedSvg.getPropertyValue("--foreground").trim();
    const rawPrimary = computedSvg.getPropertyValue("--primary").trim();
    const rawMuted = computedSvg.getPropertyValue("--muted-foreground").trim();

    function resolveColor(rawValue) {
      const temp = document.createElement("div");
      temp.style.color = (rawValue.startsWith("oklch") || rawValue.startsWith("lab"))
        ? rawValue
        : `hsl(${rawValue})`;
      document.body.appendChild(temp);
      const resolved = window.getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return resolved || "rgb(0,0,0)";
    }

    const colorForeground = resolveColor(rawForeground);
    const colorPrimary = resolveColor(rawPrimary);
    const colorMuted = resolveColor(rawMuted);

    // Parsear RGB para poder interpolar opacity en el glow
    function parseRGB(rgbStr) {
      const m = rgbStr.match(/(\d+(?:\.\d+)?)/g);
      return m ? m.map(Number) : [0, 0, 0];
    }
    const [pr, pg, pb] = parseRGB(colorPrimary);

    function tick(timestamp) {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;

      // --- Velocidad de rotación ---
      let speedY = 0.012;
      let speedX = 0.007;

      if (currentPhase === "converging") {
        const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
        speedY *= (1 - cp);
        speedX *= (1 - cp);
      } else if (currentPhase === "done") {
        speedY = 0;
        speedX = 0;
      }

      angleYRef.current += speedY;
      angleXRef.current += speedX;

      const rotX = angleXRef.current;
      const rotY = angleYRef.current;

      // Proyectar todos los vértices
      const projected = VERTICES.map(([vx, vy, vz]) =>
        project(vx, vy, vz, rotX, rotY)
      );

      // --- Estado de visitas ---
      const visitedCount = Math.floor(currentProgress * VISIT_ORDER.length);
      const visitedSet = new Set(VISIT_ORDER.slice(0, visitedCount));
      const optimalIdx = (currentPhase === "done" && visitedCount > 0)
        ? VISIT_ORDER[visitedCount - 1]
        : null;
      const currentVertexIdx = visitedCount > 0 ? VISIT_ORDER[visitedCount - 1] : null;

      // Detectar nuevo salto de vértice
      if (visitedCount > lastVisitedCountRef.current && visitedCount >= 2) {
        // Se visitó un nuevo vértice — iniciar jump line
        const prevIdx = VISIT_ORDER[visitedCount - 2];
        const newIdx = VISIT_ORDER[visitedCount - 1];
        const prev = projected[prevIdx];
        const next = projected[newIdx];

        jumpLine.setAttribute("x1", prev.x.toFixed(1));
        jumpLine.setAttribute("y1", prev.y.toFixed(1));
        jumpLine.setAttribute("x2", next.x.toFixed(1));
        jumpLine.setAttribute("y2", next.y.toFixed(1));
        jumpLine.setAttribute("opacity", "1");
        jumpStartTimeRef.current = timestamp;
      }
      lastVisitedCountRef.current = visitedCount;

      // Fade-out de la jump line
      if (jumpStartTimeRef.current !== null) {
        const elapsed = timestamp - jumpStartTimeRef.current;
        if (elapsed >= JUMP_DURATION) {
          jumpLine.setAttribute("opacity", "0");
          jumpStartTimeRef.current = null;
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

        const zMid = (a.z + b.z) / 2;
        const zOpacity = Math.max(0.15, Math.min(0.95, 0.35 + 0.60 * ((zMid + 1.5) / 3)));

        const bothVisited = visitedSet.has(ai) && visitedSet.has(bi);

        if (bothVisited) {
          // Arista activa: color primary, más gruesa, opacidad por profundidad
          line.setAttribute("stroke", colorPrimary);
          line.setAttribute("stroke-width", "1.8");
          line.setAttribute("opacity", (zOpacity * 0.9).toFixed(3));
        } else if (visitedSet.has(ai) || visitedSet.has(bi)) {
          // Un extremo visitado: color intermedio (foreground tenue)
          line.setAttribute("stroke", colorForeground);
          line.setAttribute("stroke-width", "1.2");
          line.setAttribute("opacity", (zOpacity * 0.45).toFixed(3));
        } else {
          // Arista inactiva: muted, tenue
          line.setAttribute("stroke", colorMuted);
          line.setAttribute("stroke-width", "0.8");
          line.setAttribute("opacity", (zOpacity * 0.25).toFixed(3));
        }

        line.setAttribute("x1", a.x.toFixed(1));
        line.setAttribute("y1", a.y.toFixed(1));
        line.setAttribute("x2", b.x.toFixed(1));
        line.setAttribute("y2", b.y.toFixed(1));
      });

      // --- Actualizar vértices ---
      vertexCircles.forEach((circle, idx) => {
        const pt = projected[idx];

        circle.setAttribute("cx", pt.x.toFixed(1));
        circle.setAttribute("cy", pt.y.toFixed(1));

        const zNorm = Math.max(0, Math.min(1, (pt.z + 1.5) / 3));

        if (idx === optimalIdx) {
          // Vértice óptimo (solo en done): grande, primary 100%
          circle.setAttribute("r", "5.5");
          circle.setAttribute("fill", colorPrimary);
          circle.setAttribute("opacity", "1");
        } else if (visitedSet.has(idx)) {
          // Vértice visitado: mediano, primary 60%
          const r = (3 + zNorm * 0.8).toFixed(1);
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

      // --- Actualizar círculos de glow (solo visible en vértice óptimo) ---
      glowCircles.forEach((glow, idx) => {
        const pt = projected[idx];

        glow.setAttribute("cx", pt.x.toFixed(1));
        glow.setAttribute("cy", pt.y.toFixed(1));

        if (idx === optimalIdx) {
          // Glow activo: anillo exterior con opacidad pulsante (via CSS class)
          glow.setAttribute("r", "11");
          glow.setAttribute("fill", `rgba(${pr},${pg},${pb},0.18)`);
          glow.setAttribute("opacity", "1");
          glow.setAttribute("class", "wireframe-glow-pulse");
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
      aria-label="Calculando distribución financiera — proyección de politopo"
      aria-busy={phase !== "done"}
      aria-hidden="false"
      role="img"
    >
      {/* Keyframes para el glow del vértice óptimo — inline para no tocar globals.css */}
      <defs>
        <style>{`
          @keyframes wireframe-glow {
            0%, 100% { opacity: 0.18; }
            50%       { opacity: 0.55; }
          }
          .wireframe-glow-pulse {
            animation: wireframe-glow 1.4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Círculos de glow — se renderizan debajo de aristas y vértices */}
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
        {EDGES.map(([ai, bi], idx) => (
          <line
            key={idx}
            data-edge={idx}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.20"
          />
        ))}
      </g>

      {/* Línea de salto — trazo temporal entre vértice anterior y nuevo visitado */}
      <line
        ref={jumpLineRef}
        x1="0"
        y1="0"
        x2="0"
        y2="0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
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
            opacity="0.40"
          />
        ))}
      </g>
    </svg>
  );
}
