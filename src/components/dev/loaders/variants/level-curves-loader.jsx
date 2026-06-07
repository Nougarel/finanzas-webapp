"use client";

import { useEffect, useRef } from "react";

/**
 * LevelCurvesLoader — isocurvas de la función objetivo acercándose al óptimo.
 *
 * Visualiza el descenso del LP solver: elipses concéntricas (curvas de nivel
 * de la función objetivo) y un punto que recorre una trayectoria espiral
 * desde la periferia hasta el centro óptimo, sincronizado con `progress`.
 *
 * La pulsación de "calculating" se implementa con CSS animation pura para
 * evitar ciclos de re-render vía setState en rAF.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. Refleja posición del punto.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function LevelCurvesLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const cx = size / 2;
  const cy = size / 2;

  // Refs para manipulación directa del DOM — evita re-renders de estado
  const svgRef = useRef(null);
  const trajectoryRef = useRef([]); // Array de {x, y}
  const polylineRef = useRef(null);
  const pointRef = useRef(null);
  const arrivalGroupRef = useRef(null);

  // ── Actualizar posición del punto y trayectoria sin re-render ────────────
  useEffect(() => {
    const theta = progress * Math.PI * 4; // 2 vueltas espiral
    const r = (1 - progress) * size * 0.38;
    const px = cx + r * Math.cos(theta);
    const py = cy + r * Math.sin(theta);

    // Acumular trayectoria: solo si hay desplazamiento significativo
    const pts = trajectoryRef.current;
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(px - last.x, py - last.y) > 1.5) {
      pts.push({ x: px, y: py });
    }

    // Actualizar polyline directamente en el DOM
    if (polylineRef.current && pts.length > 1) {
      const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
      polylineRef.current.setAttribute("points", pointsStr);
    }

    // Mover el punto de solución
    if (pointRef.current) {
      if (phase === "done") {
        pointRef.current.setAttribute("cx", cx);
        pointRef.current.setAttribute("cy", cy);
        pointRef.current.setAttribute("r", "4");
        pointRef.current.setAttribute("opacity", "1");
      } else {
        pointRef.current.setAttribute("cx", px);
        pointRef.current.setAttribute("cy", py);
        pointRef.current.setAttribute("r", "3");
        pointRef.current.setAttribute("opacity", "0.85");
      }
    }
  }, [progress, phase, cx, cy, size]);

  // ── Reiniciar trayectoria cuando el flujo se reinicia ────────────────────
  useEffect(() => {
    if (progress === 0) {
      trajectoryRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.setAttribute("points", "");
      }
    }
  }, [progress]);

  // ── Definición de elipses (exterior → interior) ───────────────────────────
  const ellipses = [
    { rx: size * 0.42, ry: size * 0.36, rotate: -15 },
    { rx: size * 0.35, ry: size * 0.30, rotate: -10 },
    { rx: size * 0.28, ry: size * 0.24, rotate: -5 },
    { rx: size * 0.21, ry: size * 0.18, rotate: 0 },
    { rx: size * 0.15, ry: size * 0.13, rotate: 3 },
    { rx: size * 0.10, ry: size * 0.08, rotate: 5 },
    { rx: size * 0.05, ry: size * 0.04, rotate: 5 },
  ];

  // ── Opacidad base de cada elipse según fase e índice ─────────────────────
  // index 0 = más exterior (más tenue), 6 = más interior (más opaca)
  const getEllipseOpacity = (index) => {
    const baseFade = 0.15 + (index / (ellipses.length - 1)) * 0.55;
    if (phase === "calculating") return baseFade * 0.55;
    if (phase === "converging") return baseFade * (0.7 + progress * 0.3);
    return baseFade; // done: opacidad completa
  };

  const getStrokeWidth = (index) => {
    if (phase === "done") return 0.8 + (index / (ellipses.length - 1)) * 0.8;
    return 0.6 + (index / (ellipses.length - 1)) * 0.6;
  };

  // Opacidad de la trayectoria según fase
  const trajectoryOpacity =
    phase === "calculating" ? 0.35 : phase === "converging" ? 0.55 : 0.7;

  // Posición inicial del punto para SSR (progress=0)
  const initTheta = 0;
  const initR = size * 0.38;
  const initPx = cx + initR * Math.cos(initTheta);
  const initPy = cy + initR * Math.sin(initTheta);

  // Clases de animación CSS según fase
  const ellipsesGroupClass =
    phase === "calculating" ? "lcl-pulse-group" : "";

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <style>{`
        /* Pulsación sutil de las curvas de nivel durante "calculating" */
        @keyframes lcl-pulse {
          0%, 100% { transform: translate(${cx}px, ${cy}px) scale(1) translate(-${cx}px, -${cy}px); }
          50%       { transform: translate(${cx}px, ${cy}px) scale(1.015) translate(-${cx}px, -${cy}px); }
        }
        .lcl-pulse-group {
          animation: lcl-pulse 1.2s ease-in-out infinite;
          transform-origin: ${cx}px ${cy}px;
        }

        /* Pulse de llegada cuando phase=done */
        @keyframes lcl-arrival-outer {
          0%   { r: 4; opacity: 0.65; }
          100% { r: ${size * 0.14}; opacity: 0; }
        }
        @keyframes lcl-arrival-inner {
          0%   { r: 4; opacity: 0.45; }
          100% { r: ${size * 0.07}; opacity: 0; }
        }
        .lcl-ring-outer {
          animation: lcl-arrival-outer 1.1s ease-out forwards;
        }
        .lcl-ring-inner {
          animation: lcl-arrival-inner 0.85s ease-out 0.12s forwards;
        }
      `}</style>

      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* ── Grupo de elipses — con clase de pulsación en "calculating" ── */}
        <g className={ellipsesGroupClass}>
          {ellipses.map((el, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={el.rx}
              ry={el.ry}
              transform={`rotate(${el.rotate}, ${cx}, ${cy})`}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={getStrokeWidth(i)}
              opacity={getEllipseOpacity(i)}
              strokeDasharray={i < 3 ? "3 4" : undefined}
            />
          ))}
        </g>

        {/* ── Punto de referencia en el centro (óptimo) ── */}
        <circle
          cx={cx}
          cy={cy}
          r={1.5}
          fill="var(--primary)"
          opacity={phase === "done" ? 0 : 0.18}
        />

        {/* ── Trayectoria del punto (camino recorrido) ── */}
        <polyline
          ref={polylineRef}
          points=""
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1}
          opacity={trajectoryOpacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Punto de solución actual ── */}
        <circle
          ref={pointRef}
          cx={initPx}
          cy={initPy}
          r={3}
          fill="var(--primary)"
          opacity={0.85}
        />

        {/* ── Anillos de llegada — solo en phase=done ── */}
        {phase === "done" && (
          <>
            <circle
              className="lcl-ring-outer"
              cx={cx}
              cy={cy}
              r={4}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.5}
            />
            <circle
              className="lcl-ring-inner"
              cx={cx}
              cy={cy}
              r={4}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1}
            />
          </>
        )}
      </svg>
    </div>
  );
}
