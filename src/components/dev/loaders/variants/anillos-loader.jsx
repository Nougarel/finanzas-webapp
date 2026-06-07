"use client";

import { useEffect, useRef } from "react";

/**
 * AnillosLoader — órbitas animadas vía requestAnimationFrame.
 *
 * Por qué rAF en lugar de @keyframes CSS:
 * El contenedor padre (LoaderStage) tiene overflow:hidden. Según la spec CSS,
 * overflow:hidden fuerza transformStyle:flat en todos los descendientes, lo que
 * aplasta cualquier contexto 3D. Los @keyframes con rotateX/Y siguen corriendo
 * (el browser los aplica) pero como el contexto es flat, los anillos parecen
 * elipses estáticas. Con rAF construimos explícitamente la matrix3d final sin
 * depender de preserve-3d.
 *
 * CONTRATO (no cambiar la firma de props):
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function AnillosLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  // Configuración de cada anillo: inclinación visual, radio, velocidad angular (ciclos/s)
  const RINGS = [
    { id: 0, rotX: 75, rotY: 0,  rotZ: 0,  radius: 0.42, speed: 0.28, width: 1.5 },
    { id: 1, rotX: 55, rotY: 20, rotZ: 15, radius: 0.34, speed: 0.44, width: 1.5 },
    { id: 2, rotX: 35, rotY: 45, rotZ: 30, radius: 0.26, speed: 0.62, width: 1.5 },
    { id: 3, rotX: 70, rotY: 70, rotZ: 10, radius: 0.18, speed: 0.85, width: 1.5 },
    { id: 4, rotX: 20, rotY: 60, rotZ: 50, radius: 0.11, speed: 1.10, width: 1.5 },
  ];

  const DONE_ROT_X = 65; // plano convergido en fase "done"
  const DONE_ROT_Y = 0;

  // Refs al DOM — uno por anillo + nodo central
  const ringRefs = useRef([]);
  const nodeRef = useRef(null);

  // Estado mutable del loop — fuera del ciclo React para no causar re-renders
  const animState = useRef({
    angles: RINGS.map(() => 0), // ángulo Z acumulado de cada anillo (rad)
    nodePhase: 0,               // fase del pulso del nodo (rad, 0..2π)
    lastTs: null,
  });

  // Snapshot de props para que el loop rAF siempre lea los valores actuales
  // sin necesidad de reiniciar el loop al cambiar fase/progress
  const propsRef = useRef({ phase, progress });
  useEffect(() => {
    propsRef.current = { phase, progress };
  });

  // Construir matrix3d equivalente a rotateX(rXdeg) rotateY(rYdeg) rotateZ(rZrad)
  // Calculado explícitamente para evitar depender de transformStyle:preserve-3d
  function buildMatrix(rXDeg, rYDeg, rZRad) {
    const rX = (rXDeg * Math.PI) / 180;
    const rY = (rYDeg * Math.PI) / 180;

    const cX = Math.cos(rX), sX = Math.sin(rX);
    const cY = Math.cos(rY), sY = Math.sin(rY);
    const cZ = Math.cos(rZRad), sZ = Math.sin(rZRad);

    // Composición RX * RY * RZ (mismo orden que CSS transform)
    // Resultado final columna a columna (CSS matrix3d es column-major):
    const a00 = cY * cZ;
    const a10 = cY * (-sZ);
    const a20 = sY;

    const a01 = sX * sY * cZ + cX * sZ;
    const a11 = sX * sY * (-sZ) + cX * cZ;
    const a21 = -sX * cY;

    const a02 = -cX * sY * cZ + sX * sZ;
    const a12 = -cX * sY * (-sZ) + sX * cZ;
    const a22 = cX * cY;

    // matrix3d(col0row0, col0row1, col0row2, 0,  col1row0, ...)
    return `matrix3d(${a00},${a01},${a02},0, ${a10},${a11},${a12},0, ${a20},${a21},${a22},0, 0,0,0,1)`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * Math.min(Math.max(t, 0), 1);
  }

  useEffect(() => {
    const state = animState.current;

    function tick(ts) {
      const dt = state.lastTs !== null ? Math.min((ts - state.lastTs) / 1000, 0.1) : 0;
      state.lastTs = ts;

      const { phase: p, progress: prog } = propsRef.current;
      const isDone = p === "done";
      const isConverging = p === "converging";

      // Factor de velocidad: 1 en calculating, decrece en converging, 0 en done
      let speedFactor;
      if (isDone) {
        speedFactor = 0;
      } else if (isConverging) {
        const t = Math.max(0, (prog - 0.5) * 2); // 0..1 dentro de la fase converging
        speedFactor = lerp(1, 0.04, t);
      } else {
        speedFactor = 1;
      }

      // Actualizar y aplicar transform de cada anillo
      RINGS.forEach((ring, i) => {
        state.angles[i] += ring.speed * speedFactor * dt * 2 * Math.PI;

        const el = ringRefs.current[i];
        if (!el) return;

        // Inclinación: en converging y done se aproxima al plano unificado
        let curRotX, curRotY;
        if (isDone) {
          curRotX = DONE_ROT_X;
          curRotY = DONE_ROT_Y;
        } else if (isConverging) {
          const t = Math.max(0, (prog - 0.5) * 2);
          curRotX = lerp(ring.rotX, DONE_ROT_X, t * 0.6);
          curRotY = lerp(ring.rotY, DONE_ROT_Y, t * 0.6);
        } else {
          curRotX = ring.rotX;
          curRotY = ring.rotY;
        }

        el.style.transform = buildMatrix(curRotX, curRotY, state.angles[i]);
      });

      // Pulso del nodo central
      const nodeEl = nodeRef.current;
      if (nodeEl) {
        const pulseSpeed = isDone ? 0.5 : 0.9; // ciclos/s
        const minS = isDone ? 1.0 : 1.0;
        const maxS = isDone ? 1.12 : 1.38;
        state.nodePhase += pulseSpeed * dt * 2 * Math.PI;
        const scale = minS + (maxS - minS) * (0.5 + 0.5 * Math.sin(state.nodePhase));
        const opacity = isDone ? 1 : 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(state.nodePhase));
        nodeEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
        nodeEl.style.opacity = opacity;
      }

      rafHandle = requestAnimationFrame(tick);
    }

    let rafHandle = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafHandle);
      state.lastTs = null;
    };
    // El loop no depende de props — las lee via propsRef en cada frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Color del anillo — calculado en render para que React actualice el border-color
  function getRingColor(ringIndex) {
    if (phase === "done") return "var(--primary)";
    const fadeIn = Math.max(0, progress * RINGS.length - ringIndex);
    if (fadeIn >= 1) return "var(--primary)";
    return "var(--muted-foreground)";
  }

  function getRingOpacity(ringIndex) {
    if (phase === "done") return 1;
    const base = 0.35 + ringIndex * 0.13;
    return Math.min(base + progress * 0.4, 0.95);
  }

  const nodeSize = size * 0.06;

  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      aria-hidden="true"
    >
      {/* Contenedor centrado — sin transformStyle:preserve-3d (incompatible con overflow:hidden padre) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: size * 0.86,
            height: size * 0.86,
          }}
        >
          {RINGS.map((ring, i) => {
            const diameter = size * ring.radius * 2;
            return (
              <div
                key={ring.id}
                ref={(el) => { ringRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: diameter,
                  height: diameter,
                  marginTop: -(diameter / 2),
                  marginLeft: -(diameter / 2),
                  borderRadius: "50%",
                  border: `${ring.width}px solid ${getRingColor(ring.id)}`,
                  opacity: getRingOpacity(ring.id),
                  // transform inicial — rAF lo sobreescribe en el primer frame
                  transform: `rotateX(${ring.rotX}deg) rotateY(${ring.rotY}deg) rotateZ(0deg)`,
                  transition: "border-color 0.4s ease, opacity 0.4s ease",
                  boxSizing: "border-box",
                  willChange: "transform",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Nodo central — transform y opacity gestionados por rAF */}
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: nodeSize,
          height: nodeSize,
          borderRadius: "50%",
          background: phase === "done" ? "var(--primary)" : "var(--muted-foreground)",
          transform: "translate(-50%, -50%) scale(1)",
          transition: "background 0.5s ease",
          willChange: "transform",
        }}
      />
    </div>
  );
}
