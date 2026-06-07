"use client";

import { useMemo } from "react";

/**
 * LpvizLoader — vista isométrica de la superficie de la función objetivo (paraboloide).
 * Un punto desciende desde la esquina hasta el mínimo conforme `progress` avanza.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJA la posición del punto.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function LpvizLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  // Escala vertical del paraboloide elíptico.
  // z_max = (1 + 0.8) * Z_SCALE — altura máxima del paraboloide en unidades lógicas.
  const Z_SCALE = 0.55;

  // Rango de py (coordenada vertical proyectada) para la cuadrícula [-1..1]:
  //   py_min = (-1 + -1) * sin30 - z_max = -1 - (1 + 0.8) * Z_SCALE = -1 - 0.99 = -1.99
  //   py_max = (1 + 1) * sin30 - 0 = 1
  // Rango total en py: 2.99 unidades.
  // Rango en px (horizontal): (-1 - 1) * cos30 a (1 - (-1)) * cos30 → ±1.732 unidades.
  //
  // ISO_SCALE = tamaño disponible / rango — con margen del 10 % a cada lado.
  // Vertical: ISO_SCALE = size * 0.8 / 2.99 ≈ size * 0.268
  // Horizontal: ISO_SCALE = size * 0.8 / (2 * 1.732) ≈ size * 0.231
  // Usamos el mínimo para garantizar que la cuadrícula quepa en ambas dimensiones.
  const ISO_SCALE = size * 0.23;

  // Punto de inicio de la trayectoria.
  // (-0.85, -0.85) es la esquina "trasera" del paraboloide — en proyección isométrica
  // aparece en la parte SUPERIOR del SVG (alejada del visor), lo que da la sensación
  // de descender hacia el mínimo visible en la parte inferior.
  const START_X = -0.85;
  const START_Y = -0.85;

  /**
   * Proyección isométrica estándar.
   * Espacio lógico: x,y en [-1..1], z en [0..~0.99].
   *
   * Origen vertical calculado para centrar el paraboloide en el SVG:
   *   El centroide visual de py está en (py_min + py_max) / 2 = (-1.99 + 1) / 2 = -0.495
   *   Para que el centroide caiga en size/2:
   *     origin_y = size/2 - (-0.495) * ISO_SCALE = size/2 + 0.495 * ISO_SCALE
   */
  function iso(x, y, z) {
    const COS30 = Math.cos(Math.PI / 6);
    const SIN30 = Math.sin(Math.PI / 6);
    const px = (x - y) * COS30;
    const py = (x + y) * SIN30 - z;
    const originY = size / 2 + 0.495 * ISO_SCALE;
    return {
      x: size / 2 + px * ISO_SCALE,
      y: originY + py * ISO_SCALE,
    };
  }

  // ─── Cuadrícula 7×7 ───────────────────────────────────────────────────────
  const GRID_N = 7;
  const gridPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < GRID_N; i++) {
      for (let j = 0; j < GRID_N; j++) {
        const x = -1 + (2 * i) / (GRID_N - 1);
        const y = -1 + (2 * j) / (GRID_N - 1);
        const z = (x * x + 0.8 * y * y) * Z_SCALE;
        pts.push({ x, y, z, i, j, screen: iso(x, y, z) });
      }
    }
    return pts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  /**
   * Líneas de la cuadrícula: dos familias de segmentos paralelos.
   * Opacidad de cada línea basada en su posición en Y del espacio lógico
   * (las más alejadas del visor son más tenues).
   */
  const gridLines = useMemo(() => {
    const lines = [];

    // Familia 1: filas (i constante, j varía)
    for (let i = 0; i < GRID_N; i++) {
      const pts = [];
      for (let j = 0; j < GRID_N; j++) {
        const idx = i * GRID_N + j;
        pts.push(gridPoints[idx].screen);
      }
      // Las filas con i pequeño (esquina alejada) son más tenues (rango 0.6..1.0)
      const opacityFactor = 0.6 + 0.4 * (i / (GRID_N - 1));
      lines.push({ pts, opacityFactor, family: "row", idx: i });
    }

    // Familia 2: columnas (j constante, i varía)
    for (let j = 0; j < GRID_N; j++) {
      const pts = [];
      for (let i = 0; i < GRID_N; i++) {
        const idx = i * GRID_N + j;
        pts.push(gridPoints[idx].screen);
      }
      // Las columnas con j pequeño (esquina alejada) son más tenues (rango 0.6..1.0)
      const opacityFactor = 0.6 + 0.4 * (j / (GRID_N - 1));
      lines.push({ pts, opacityFactor, family: "col", idx: j });
    }

    return lines;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridPoints]);

  // ─── Trayectoria del punto de solución ───────────────────────────────────
  const TRAJ_STEPS = 48;

  const trajectory = useMemo(() => {
    const steps = Math.floor(progress * TRAJ_STEPS);
    if (steps < 1) return "";
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / TRAJ_STEPS;
      const x = (1 - t) * START_X;
      const y = (1 - t) * START_Y;
      const z = (x * x + 0.8 * y * y) * Z_SCALE;
      const p = iso(x, y, z);
      pts.push(`${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    }
    return pts.join(" ");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, size]);

  // ─── Posición actual del punto ────────────────────────────────────────────
  const currentPoint = useMemo(() => {
    const x = (1 - progress) * START_X;
    const y = (1 - progress) * START_Y;
    const z = (x * x + 0.8 * y * y) * Z_SCALE;
    return iso(x, y, z);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, size]);

  // ─── Colores según phase ──────────────────────────────────────────────────
  const isDone = phase === "done";
  const isConverging = phase === "converging";

  // Opacidad base de la cuadrícula aumenta con la fase.
  const gridBaseOpacity = isDone ? 0.9 : isConverging ? 0.75 : 0.6;

  // Colores hardcodeados como fallback para evitar problemas con var() en atributos SVG.
  // navy (#14213D) = primary del proyecto; gris medio para muted-foreground.
  // Los atributos de presentación SVG (stroke, fill) no siempre evalúan CSS variables.
  // Usamos presentationAttributes puros para garantizar que el computed style no sea none.
  const NAVY = "#14213D";
  const MUTED_FG = "#6b7280"; // gris slate-500, cercano a muted-foreground oklch(0.50)

  const gridStroke = isDone ? NAVY : MUTED_FG;
  const pathStroke = isDone ? NAVY : MUTED_FG;
  const dotFill = isDone ? NAVY : MUTED_FG;

  // Opacidad de la trayectoria
  const pathOpacity = isDone ? 0.8 : isConverging ? 0.65 : 0.5;

  // Radio y color del punto de solución
  const dotR = isDone ? 5 : 3.5;
  const dotOpacity = isDone ? 1 : isConverging ? 0.9 : 0.85;

  // Anillo exterior del punto (solo en done y converging avanzado)
  const showRing = isDone || (isConverging && progress > 0.8);

  return (
    <svg
      width={size}
      height={size}
      aria-label="Calculando distribución financiera — optimización de función objetivo"
      aria-busy={phase !== "done"}
      role="img"
    >
      {/* Cuadrícula isométrica del paraboloide */}
      {gridLines.map((line) => {
        const pointsStr = line.pts
          .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          .join(" ");
        const opacity = (gridBaseOpacity * line.opacityFactor).toFixed(3);
        return (
          <polyline
            key={`${line.family}-${line.idx}`}
            points={pointsStr}
            fill="none"
            stroke={gridStroke}
            strokeWidth={isDone ? 1.2 : 0.9}
            strokeOpacity={opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {/* Trayectoria del punto: camino recorrido hasta el progress actual */}
      {trajectory && (
        <polyline
          points={trajectory}
          fill="none"
          stroke={pathStroke}
          strokeWidth="1.4"
          strokeOpacity={pathOpacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Anillo exterior del punto (fase converging avanzada y done) */}
      {showRing && (
        <circle
          cx={currentPoint.x.toFixed(2)}
          cy={currentPoint.y.toFixed(2)}
          r={dotR + 4}
          fill="none"
          stroke={NAVY}
          strokeWidth="1"
          strokeOpacity={isDone ? 0.4 : 0.25}
        />
      )}

      {/* Punto de solución actual */}
      <circle
        cx={currentPoint.x.toFixed(2)}
        cy={currentPoint.y.toFixed(2)}
        r={dotR}
        fill={dotFill}
        fillOpacity={dotOpacity}
      />

      {/* Punto central del mínimo (siempre visible como referencia) */}
      {(() => {
        const center = iso(0, 0, 0);
        return (
          <circle
            cx={center.x.toFixed(2)}
            cy={center.y.toFixed(2)}
            r="2"
            fill={isDone ? NAVY : "#94a3b8"}
            fillOpacity={isDone ? 0.9 : 0.6}
          />
        );
      })()}
    </svg>
  );
}
