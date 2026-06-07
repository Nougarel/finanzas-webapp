"use client";

import { useRef, useEffect } from "react";

/**
 * WireframeVariantB — 20D Cross-polytope completo
 * 40 vértices en espacio 20D, 760 aristas, proyección 20D→2D con rotación
 * en múltiples planos de Givens. Cloud denso de fondo + ruta activa en primer plano.
 *
 * @param {number}  progress   0..1
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number}  size       px del SVG (cuadrado)
 */
export function WireframeVariantB({ progress, phase, isApiDone, size = 400 }) {
  // ---------------------------------------------------------------------------
  // Geometría estática — calculada una sola vez fuera del componente
  // ---------------------------------------------------------------------------
  const N = 20;

  // 40 vértices: +e_i y -e_i para cada eje
  const VERTICES = [];
  for (let i = 0; i < N; i++) {
    const pos = new Array(N).fill(0); pos[i] = 1; VERTICES.push(pos);
    const neg = new Array(N).fill(0); neg[i] = -1; VERTICES.push(neg);
  }

  // 760 aristas: todos los pares no antipodales
  const EDGES = [];
  for (let a = 0; a < 40; a++) {
    for (let b = a + 1; b < 40; b++) {
      if (Math.floor(a / 2) !== Math.floor(b / 2)) EDGES.push([a, b]);
    }
  }

  // Ruta de visita: 12 vértices
  const VISIT_ORDER = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33];

  // Planos de rotación con velocidades angulares distintas
  // Planos de rotación: deben cubrir las 20 dimensiones.
  // Los primeros 8 cubren dims 0-12. Los últimos 7 activan dims 13-19
  // conectándolos con dims ya activas. Sin esto, los vértices ±e_13..±e_19
  // nunca se mueven y se proyectan todos a (0,0), superponiéndose.
  const ROTATION_PLANES = [
    [0,  1,  1.20],
    [2,  3,  0.70],
    [4,  5,  0.90],
    [6,  7,  0.75],
    [8,  9,  0.52],
    [0,  10, 0.44],
    [1,  11, 0.30],
    [2,  12, 0.36],
    [13, 0,  0.55], // activa dim 13 → mezcla con dim 0
    [14, 2,  0.42], // activa dim 14
    [15, 4,  0.38], // activa dim 15
    [16, 6,  0.48], // activa dim 16
    [17, 8,  0.35], // activa dim 17
    [18, 10, 0.44], // activa dim 18
    [19, 12, 0.32], // activa dim 19
  ];

  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------
  const svgRef           = useRef(null);
  const edgesGroupRef    = useRef(null);
  const verticesGroupRef = useRef(null);
  const glowGroupRef     = useRef(null);
  const rafRef           = useRef(null);
  const anglesRef        = useRef(ROTATION_PLANES.map(() => 0));
  const lastTimeRef      = useRef(null);
  const progressRef      = useRef(progress);
  const phaseRef         = useRef(phase);

  // Set reutilizable — evita crear uno nuevo cada frame
  const visitedSetRef = useRef(new Set());

  // ---------------------------------------------------------------------------
  // Sincronizar props → refs (sin re-render)
  // ---------------------------------------------------------------------------
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ---------------------------------------------------------------------------
  // Funciones matemáticas puras
  // ---------------------------------------------------------------------------
  function applyGivens(v, i, j, theta) {
    const result = [...v];
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    result[i] = v[i] * c - v[j] * s;
    result[j] = v[i] * s + v[j] * c;
    return result;
  }

  function project20d(rotatedVertex, center, radius) {
    // Proyección ortográfica: los vértices del 20D cross-polytope tienen
    // norma 1 y sus componentes varían entre -1 y 1. La perspectiva fuerte
    // (FOCAL alto) aplasta el objeto porque los componentes x,y son pequeños
    // cuando la rotación no los ha llevado a su máximo. Con proyección
    // ortográfica, el radio cubre exactamente el rango [-1, 1].
    const z = rotatedVertex[2];
    // Ligera modulación de profundidad para dar sensación 3D sin deformar
    const depthScale = 1 + z * 0.15;
    return {
      x: center + rotatedVertex[0] * radius * depthScale,
      y: center + rotatedVertex[1] * radius * depthScale,
      z: z,
    };
  }

  // ---------------------------------------------------------------------------
  // Loop principal — montaje, rAF y desmontaje
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // Resolver colores CSS vars (oklch) a RGB
    const computedSvg = window.getComputedStyle(svg);

    function resolveColor(raw) {
      const temp = document.createElement("div");
      const trimmed = raw.trim();
      temp.style.color = trimmed.startsWith("oklch") ? trimmed : `hsl(${trimmed})`;
      document.body.appendChild(temp);
      const resolved = window.getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return resolved || "rgb(0,0,0)";
    }

    const colorPrimary    = resolveColor(computedSvg.getPropertyValue("--primary").trim());
    const colorMuted      = resolveColor(computedSvg.getPropertyValue("--muted-foreground").trim());
    const colorForeground = resolveColor(computedSvg.getPropertyValue("--foreground").trim());

    // Pre-cachear referencias a los elementos SVG
    const edgeEls    = edgesGroupRef.current
      ? Array.from(edgesGroupRef.current.querySelectorAll("line"))
      : [];
    const vertexEls  = verticesGroupRef.current
      ? Array.from(verticesGroupRef.current.querySelectorAll("circle"))
      : [];
    const glowEls    = glowGroupRef.current
      ? Array.from(glowGroupRef.current.querySelectorAll("circle"))
      : [];

    function tick(timestamp) {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000; // segundos
      lastTimeRef.current = timestamp;

      const prog  = progressRef.current;
      const phase = phaseRef.current;

      // Factor de velocidad por fase
      let speedFactor = 1;
      if (phase === "converging") {
        const cp = (prog - 0.6) / 0.35;
        speedFactor = Math.max(0, 1 - cp);
      } else if (phase === "done") {
        speedFactor = 0;
      }

      // Avanzar ángulos de rotación
      const angles = anglesRef.current;
      ROTATION_PLANES.forEach(([, , speed], idx) => {
        angles[idx] += speed * speedFactor * dt;
      });

      // Rotar todos los vértices
      const center = size / 2;
      // 0.40 × 1.15 (depthScale max) ≈ 0.46 — queda dentro del panel con margen
      const radius = size * 0.40;

      const projected = VERTICES.map((v) => {
        let rv = v;
        ROTATION_PLANES.forEach(([i, j], idx) => {
          rv = applyGivens(rv, i, j, angles[idx]);
        });
        return project20d(rv, center, radius);
      });

      // Calcular visitedCount y construir Set
      let visitedCount = 0;
      if (phase === "calculating") {
        visitedCount = Math.floor(prog * VISIT_ORDER.length);
      } else if (phase === "converging") {
        visitedCount = VISIT_ORDER.length;
      } else {
        visitedCount = VISIT_ORDER.length;
      }

      const visitedSet = visitedSetRef.current;
      visitedSet.clear();
      VISIT_ORDER.slice(0, visitedCount).forEach((idx) => visitedSet.add(idx));

      // Factor de opacidad de fondo según fase
      let bgOpacityBoost = 0;
      if (phase === "converging") {
        const cp = (prog - 0.6) / 0.35;
        bgOpacityBoost = cp * 0.2; // sube de 0 a 0.20
      } else if (phase === "done") {
        bgOpacityBoost = 0.01;
      }

      // Actualizar aristas
      EDGES.forEach(([a, b], idx) => {
        const el = edgeEls[idx];
        if (!el) return;

        const pa = projected[a];
        const pb = projected[b];

        el.setAttribute("x1", pa.x.toFixed(1));
        el.setAttribute("y1", pa.y.toFixed(1));
        el.setAttribute("x2", pb.x.toFixed(1));
        el.setAttribute("y2", pb.y.toFixed(1));

        const aVisited = visitedSet.has(a);
        const bVisited = visitedSet.has(b);

        if (aVisited && bVisited) {
          // Arista de la ruta — primer plano brillante
          el.setAttribute("stroke", colorPrimary);
          el.setAttribute("stroke-width", "2");
          el.setAttribute("opacity", "0.85");
        } else if (aVisited || bVisited) {
          // Un extremo visitado — transición
          el.setAttribute("stroke", colorForeground);
          el.setAttribute("stroke-width", "1");
          el.setAttribute("opacity", "0.4");
        } else {
          // Fondo: z-depth para variar opacity
          const avgZ = (pa.z + pb.z) / 2;
          const zNorm = Math.max(0, Math.min(1, (avgZ + 1) / 2));
          // Subida de opacidad base para que la nube densa sea apreciable
          const baseOpacity = 0.14 + zNorm * 0.18 + bgOpacityBoost;
          el.setAttribute("stroke", colorMuted);
          el.setAttribute("stroke-width", "0.5");
          el.setAttribute("opacity", baseOpacity.toFixed(3));
        }
      });

      // Actualizar vértices
      VERTICES.forEach((_, idx) => {
        const el = vertexEls[idx];
        if (!el) return;
        const p = projected[idx];
        el.setAttribute("cx", p.x.toFixed(1));
        el.setAttribute("cy", p.y.toFixed(1));

        if (visitedSet.has(idx)) {
          el.setAttribute("r", "2.5");
          el.setAttribute("fill", colorPrimary);
          el.setAttribute("opacity", "0.85");
        } else {
          el.setAttribute("r", "1.5");
          el.setAttribute("fill", colorMuted);
          el.setAttribute("opacity", "0.18");
        }
      });

      // Glow en el último vértice visitado (solo en done)
      if (phase === "done" && visitedCount > 0) {
        const lastIdx = VISIT_ORDER[visitedCount - 1];
        const p = projected[lastIdx];
        const glowEl = glowEls[lastIdx];
        if (glowEl) {
          glowEl.setAttribute("cx", p.x.toFixed(1));
          glowEl.setAttribute("cy", p.y.toFixed(1));
          glowEl.setAttribute("r", "12");
          glowEl.setAttribute("fill", colorPrimary);
          glowEl.setAttribute("class", "b20d-glow-pulse");
        }
        // Ocultar el resto de glow circles
        glowEls.forEach((el, i) => {
          if (i !== lastIdx) {
            el.setAttribute("r", "0");
            el.setAttribute("opacity", "0");
            el.setAttribute("class", "");
          }
        });
      } else {
        // Ocultar todos los glow circles fuera de done
        glowEls.forEach((el) => {
          el.setAttribute("r", "0");
          el.setAttribute("opacity", "0");
          el.setAttribute("class", "");
        });
      }

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
  }, [size]);

  // ---------------------------------------------------------------------------
  // Render — JSX inicial con elementos placeholder (actualizados por rAF)
  // ---------------------------------------------------------------------------
  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <style>{`
          @keyframes b20d-glow { 0%,100% { opacity: 0.12; } 50% { opacity: 0.45; } }
          .b20d-glow-pulse { animation: b20d-glow 1.4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Glow circles — solo el último visitado en fase done */}
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

      {/* 760 aristas */}
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
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.04"
          />
        ))}
      </g>

      {/* 40 vértices */}
      <g ref={verticesGroupRef}>
        {VERTICES.map((_, idx) => (
          <circle
            key={idx}
            data-vertex={idx}
            cx="0"
            cy="0"
            r="1.5"
            fill="currentColor"
            opacity="0.2"
          />
        ))}
      </g>

      {/* Etiqueta informativa */}
      <text
        x={size * 0.5}
        y={size - 6}
        textAnchor="middle"
        fontSize={size * 0.026}
        fill="var(--muted-foreground)"
        opacity="0.5"
        fontFamily="monospace"
      >
        20D · 40v · 760e
      </text>
    </svg>
  );
}
