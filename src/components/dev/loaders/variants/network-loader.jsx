"use client";

import { useMemo } from "react";

/**
 * NetworkLoader — 20 nodos (uno por categoría financiera) distribuidos en dos
 * circunferencias concéntricas. Los nodos se iluminan secuencialmente conforme
 * `progress` avanza, representando cómo el solver calcula cada categoría.
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function NetworkLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size * 0.18;
  const outerR = size * 0.40;

  // ─── Layout: 6 nodos interiores + 14 exteriores ──────────────────────────
  const nodes = useMemo(() => {
    const result = [];
    const inner = 6;
    const outer = 14;

    // Anillo interior — 6 nodos
    for (let i = 0; i < inner; i++) {
      const a = (i / inner) * Math.PI * 2 - Math.PI / 2;
      result.push({
        id: i,
        x: cx + innerR * Math.cos(a),
        y: cy + innerR * Math.sin(a),
        ring: "inner",
      });
    }

    // Anillo exterior — 14 nodos
    for (let i = 0; i < outer; i++) {
      const a = (i / outer) * Math.PI * 2 - Math.PI / 2;
      result.push({
        id: inner + i,
        x: cx + outerR * Math.cos(a),
        y: cy + outerR * Math.sin(a),
        ring: "outer",
      });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // ─── Orden de iluminación (fijo, predeterminado al montar) ────────────────
  // Los nodos exteriores se iluminan primero (14 primeros steps), luego los
  // interiores (steps 14–19). El último nodo iluminado es el 0 (housing,
  // en lo alto del anillo interior) — el más importante.
  const illuminationOrder = useMemo(() => {
    // Exteriores: índices 6..19, en orden de distribución espacial
    const exterior = Array.from({ length: 14 }, (_, i) => 6 + i);
    // Interiores: índices 1..5, luego el 0 (housing) al final
    const interior = [1, 2, 3, 4, 5, 0];
    return [...exterior, ...interior];
  }, []);

  // ─── Conexiones: cada nodo exterior conecta con el interior más cercano
  //     y con sus vecinos exteriores inmediatos ──────────────────────────────
  const edges = useMemo(() => {
    if (nodes.length < 20) return [];

    const result = [];
    const seen = new Set();

    const addEdge = (a, b) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push([a, b]);
      }
    };

    // Vecinos exteriores: cada exterior conecta con el siguiente
    for (let i = 0; i < 14; i++) {
      const curr = 6 + i;
      const next = 6 + ((i + 1) % 14);
      addEdge(curr, next);
    }

    // Cada exterior conecta con el interior más cercano (por ángulo)
    for (let i = 0; i < 14; i++) {
      const extNode = nodes[6 + i];
      // Ángulo del nodo exterior
      const extAngle = Math.atan2(extNode.y - cy, extNode.x - cx);
      // Encontrar el nodo interior más cercano en ángulo
      let closestInner = 0;
      let minDiff = Infinity;
      for (let j = 0; j < 6; j++) {
        const innNode = nodes[j];
        const innAngle = Math.atan2(innNode.y - cy, innNode.x - cx);
        let diff = Math.abs(extAngle - innAngle);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff < minDiff) {
          minDiff = diff;
          closestInner = j;
        }
      }
      addEdge(6 + i, closestInner);
    }

    // Conexiones adicionales entre interiores (anillo interior cerrado)
    for (let i = 0; i < 6; i++) {
      addEdge(i, (i + 1) % 6);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  // ─── Estado derivado de progress ─────────────────────────────────────────
  const activeCount = Math.floor(progress * 20);

  // Conjunto de IDs activos (iluminados)
  const activeSet = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < activeCount; i++) {
      if (illuminationOrder[i] !== undefined) {
        set.add(illuminationOrder[i]);
      }
    }
    return set;
  }, [activeCount, illuminationOrder]);

  // ID del nodo actualmente siendo calculado (el siguiente en la secuencia)
  const pulsingNodeId =
    phase !== "done" && activeCount < 20
      ? illuminationOrder[activeCount]
      : null;

  // ─── Colores según fase ────────────────────────────────────────────────────
  const isDone = phase === "done";
  const isConverging = phase === "converging";

  // Radio de nodo — crece ligeramente en "done"
  const nodeR = Math.max(3, size * 0.022);
  const nodeRDone = Math.max(3.5, size * 0.026);

  // Keyframe único para el pulso — inyectado como <style> para evitar rAF
  const pulseKeyframe = `
    @keyframes nw-pulse {
      0%   { r: ${(nodeR * 1).toFixed(2)}; opacity: 1; }
      50%  { r: ${(nodeR * 1.6).toFixed(2)}; opacity: 0.5; }
      100% { r: ${(nodeR * 1).toFixed(2)}; opacity: 1; }
    }
    @keyframes nw-done-pulse {
      0%   { opacity: 0.7; }
      50%  { opacity: 1; }
      100% { opacity: 0.7; }
    }
  `;

  return (
    <div
      aria-label="Calculando distribución financiera — activando categorías"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size }}
    >
      <style>{pulseKeyframe}</style>
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {/* ── Conexiones (edges) ─────────────────────────────────────────── */}
        {edges.map(([a, b]) => {
          const na = nodes[a];
          const nb = nodes[b];
          if (!na || !nb) return null;

          const bothActive = activeSet.has(a) && activeSet.has(b);
          const eitherActive = activeSet.has(a) || activeSet.has(b);

          let stroke, strokeOpacity, strokeWidth;

          if (bothActive) {
            stroke = "hsl(var(--primary))";
            strokeOpacity = isDone ? 0.55 : isConverging ? 0.45 : 0.35;
            strokeWidth = isDone ? 1.2 : 0.9;
          } else if (eitherActive) {
            stroke = "hsl(var(--muted-foreground))";
            strokeOpacity = 0.25;
            strokeWidth = 0.7;
          } else {
            stroke = "hsl(var(--border))";
            strokeOpacity = 0.3;
            strokeWidth = 0.6;
          }

          return (
            <line
              key={`${a}-${b}`}
              x1={na.x.toFixed(2)}
              y1={na.y.toFixed(2)}
              x2={nb.x.toFixed(2)}
              y2={nb.y.toFixed(2)}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Nodos ──────────────────────────────────────────────────────── */}
        {nodes.map((node) => {
          const isActive = activeSet.has(node.id);
          const isPulsing = pulsingNodeId === node.id;
          const isDoneNode = isDone && isActive;

          let fill, opacity, r, style;

          if (isPulsing) {
            // Nodo actualmente siendo calculado: pulsa con keyframe CSS
            fill = "hsl(var(--primary))";
            opacity = 0.9;
            r = nodeR;
            style = { animation: "nw-pulse 0.9s ease-in-out infinite" };
          } else if (isDoneNode) {
            // Fase done: todos los activos pulsan suavemente
            fill = "hsl(var(--primary))";
            opacity = 1;
            r = nodeRDone;
            style = {
              animation: `nw-done-pulse ${1.4 + (node.id % 5) * 0.2}s ease-in-out infinite`,
              animationDelay: `${(node.id * 0.07) % 0.6}s`,
            };
          } else if (isActive) {
            // Nodo iluminado (ya calculado): primary fijo
            fill = "hsl(var(--primary))";
            opacity = isConverging ? 0.85 : 0.75;
            r = nodeR;
            style = {};
          } else {
            // Nodo inactivo: muted-foreground tenue
            fill = "hsl(var(--muted-foreground))";
            opacity = 0.25;
            r = nodeR * 0.7;
            style = {};
          }

          return (
            <circle
              key={node.id}
              cx={node.x.toFixed(2)}
              cy={node.y.toFixed(2)}
              r={r}
              fill={fill}
              opacity={opacity}
              style={style}
            />
          );
        })}

        {/* ── Halo exterior del nodo pulsante ────────────────────────────── */}
        {pulsingNodeId !== null && nodes[pulsingNodeId] && (
          <circle
            cx={nodes[pulsingNodeId].x.toFixed(2)}
            cy={nodes[pulsingNodeId].y.toFixed(2)}
            r={nodeR * 2.2}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.8"
            opacity="0.2"
            style={{ animation: "nw-pulse 0.9s ease-in-out infinite" }}
          />
        )}

        {/* ── Punto central de referencia ────────────────────────────────── */}
        <circle
          cx={cx.toFixed(2)}
          cy={cy.toFixed(2)}
          r={Math.max(2, size * 0.015)}
          fill={isDone ? "hsl(var(--primary))" : "hsl(var(--border))"}
          opacity={isDone ? 0.8 : 0.5}
        />
      </svg>
    </div>
  );
}
