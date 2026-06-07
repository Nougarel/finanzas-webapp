"use client";

import { useEffect, useRef } from "react";

/**
 * WireframeLoader — proyección wireframe SVG de un politopo de alta dimensión
 * rotando. 14 vértices (cross-polytope 3D + hipercubo inscrito), aristas densas,
 * rotación 3D continua proyectada en perspectiva.
 *
 * Nota de implementación:
 * - hsl(var(--x)) en style.stroke no se resuelve en Chromium con TailwindCSS v4
 *   (oklch/lab color spaces). Solución: stroke/fill = "currentColor" heredan de
 *   la propiedad CSS `color` del SVG padre, que sí resuelve correctamente.
 * - Los círculos de vértices usan fill="currentColor" también.
 * - Para la transición de color al primary, se usa un grupo <g> para las líneas
 *   y otro para los vértices, cambiando su style.color en el rAF.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function WireframeLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const svgRef = useRef(null);
  const edgesGroupRef = useRef(null);
  const verticesGroupRef = useRef(null);
  const rafRef = useRef(null);
  const angleXRef = useRef(0.45);
  const angleYRef = useRef(0.3);

  // Refs para leer phase/progress dentro del rAF sin closures obsoletas
  const phaseRef = useRef(phase);
  const progressRef = useRef(progress);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // Vértices del cross-polytope 3D: (±1,0,0), (0,±1,0), (0,0,±1) → 6 vértices
  // + vértices del hipercubo inscrito: (±1,±1,±1)/√3 → 8 vértices
  // Total: 14 vértices con alta densidad de aristas cruzadas
  const SQRT3 = Math.sqrt(3);
  const VERTICES = [
    // Cross-polytope 3D
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1],
    // Hipercubo inscrito (radio = 1/√3 ≈ 0.577)
    [1 / SQRT3,  1 / SQRT3,  1 / SQRT3],
    [1 / SQRT3,  1 / SQRT3, -1 / SQRT3],
    [1 / SQRT3, -1 / SQRT3,  1 / SQRT3],
    [1 / SQRT3, -1 / SQRT3, -1 / SQRT3],
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

  // Radio de proyección: escala los vértices para que quepan bien en size
  const RADIUS = size * 0.42;
  const CENTER = size / 2;
  // Distancia focal para perspectiva (mayor = menos distorsión)
  const FOCAL = 3;

  /**
   * Proyecta un vértice 3D (rotado por angleX/Y actuales) a coordenadas SVG 2D.
   * Devuelve { x, y, z } donde z es la profundidad tras rotación (para opacidad).
   */
  function project(vx, vy, vz, rotX, rotY) {
    // Rotación en Y
    const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
    const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
    // Rotación en X
    const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
    // Proyección perspectiva
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
    if (!svg || !edgesGroup || !verticesGroup) return;

    // Obtener referencias a elementos SVG una sola vez tras montaje
    const edgeLines = Array.from(edgesGroup.querySelectorAll("line[data-edge]"));
    const vertexCircles = Array.from(verticesGroup.querySelectorAll("circle[data-vertex]"));

    // Leer los colores resueltos del tema UNA vez, desde el elemento SVG.
    // Se hace dentro del useEffect para que el DOM esté montado y los tokens CSS disponibles.
    // getComputedStyle resuelve correctamente las custom properties del tema.
    const computedSvg = window.getComputedStyle(svg);
    const rawForeground = computedSvg.getPropertyValue("--foreground").trim();
    const rawPrimary = computedSvg.getPropertyValue("--primary").trim();

    // El tema usa oklch: --foreground: oklch(0.145 0 0), --primary: oklch(0.205 0 0)
    // Construir el valor CSS resolvible — aplicamos a un elemento temporal para obtener RGB
    function resolveColor(rawValue) {
      const temp = document.createElement("div");
      temp.style.color = rawValue.startsWith("oklch") || rawValue.startsWith("lab")
        ? rawValue
        : `hsl(${rawValue})`;
      document.body.appendChild(temp);
      const resolved = window.getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return resolved || "rgb(0,0,0)";
    }

    const colorForeground = resolveColor(rawForeground);
    const colorPrimary = resolveColor(rawPrimary);

    function tick() {
      const currentPhase = phaseRef.current;
      const currentProgress = progressRef.current;

      // Velocidad de rotación según phase
      let speedY = 0.012;
      let speedX = 0.007;

      if (currentPhase === "converging") {
        // convergingProgress: 0..1 dentro de la fase 0.6..0.95
        const convergingProgress = Math.min((currentProgress - 0.6) / 0.35, 1);
        speedY *= (1 - convergingProgress);
        speedX *= (1 - convergingProgress);
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

      // Color según phase — se aplica vía style.color en los grupos;
      // los elementos usan stroke/fill = "currentColor" para heredarlo
      let themeColor;
      if (currentPhase === "done") {
        themeColor = colorPrimary;
      } else if (currentPhase === "converging") {
        const cp = Math.min((currentProgress - 0.6) / 0.35, 1);
        themeColor = cp > 0.5 ? colorPrimary : colorForeground;
      } else {
        themeColor = colorForeground;
      }

      edgesGroup.style.color = themeColor;
      verticesGroup.style.color = themeColor;

      // Actualizar aristas
      edgeLines.forEach((line, idx) => {
        const [ai, bi] = EDGES[idx];
        const a = projected[ai];
        const b = projected[bi];

        // Profundidad media de la arista → opacidad
        const zMid = (a.z + b.z) / 2;
        // zMid está en ~[-1, 1]; mapear a opacidad 0.30..0.95
        const opacity = Math.max(0.30, Math.min(0.95, 0.35 + 0.60 * ((zMid + 1.5) / 3)));

        line.setAttribute("x1", a.x.toFixed(1));
        line.setAttribute("y1", a.y.toFixed(1));
        line.setAttribute("x2", b.x.toFixed(1));
        line.setAttribute("y2", b.y.toFixed(1));
        line.setAttribute("opacity", opacity.toFixed(3));
      });

      // Actualizar vértices
      vertexCircles.forEach((circle, idx) => {
        const pt = projected[idx];

        circle.setAttribute("cx", pt.x.toFixed(1));
        circle.setAttribute("cy", pt.y.toFixed(1));

        // Vértices más cercanos (z más positivo) son más grandes y opacos
        const zNorm = Math.max(0, Math.min(1, (pt.z + 1.5) / 3));
        const r = (1.5 + zNorm * 2).toFixed(1);
        const opacity = (0.40 + zNorm * 0.60).toFixed(3);

        circle.setAttribute("r", r);
        circle.setAttribute("opacity", opacity);
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
      {/* Grupo de aristas — stroke: currentColor hereda el color resuelto del grupo */}
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
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.40"
          />
        ))}
      </g>

      {/* Grupo de vértices — fill: currentColor hereda el color del grupo */}
      <g ref={verticesGroupRef}>
        {VERTICES.map((_, idx) => (
          <circle
            key={idx}
            data-vertex={idx}
            cx="0"
            cy="0"
            r="2"
            fill="currentColor"
            opacity="0.50"
          />
        ))}
      </g>
    </svg>
  );
}
