"use client";

import { useId } from "react";

/**
 * AnillosLoader — órbitas CSS 3D como dimensiones del espacio de soluciones.
 *
 * CONTRATO (no cambiar la firma de props):
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo. REFLEJAR en la animación.
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function AnillosLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  // useId genera un ID estable y único por instancia — seguro en SSR y en la galería
  const rawId = useId();
  // useId devuelve algo como ":r3:" — normalizamos para usarlo en @keyframes (sin : ni -)
  const uid = `anillos${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Configuración de cada anillo: inclinación base, velocidad base, radio, opacidad
  const rings = [
    { id: 0, rotX: 75,  rotY: 0,   rotZ: 0,   radius: 0.42, speed: 3.2,  width: 1.5 },
    { id: 1, rotX: 55,  rotY: 20,  rotZ: 15,  radius: 0.34, speed: 4.8,  width: 1.5 },
    { id: 2, rotX: 35,  rotY: 45,  rotZ: 30,  radius: 0.26, speed: 6.5,  width: 1.5 },
    { id: 3, rotX: 70,  rotY: 70,  rotZ: 10,  radius: 0.18, speed: 9.0,  width: 1.5 },
    { id: 4, rotX: 20,  rotY: 60,  rotZ: 50,  radius: 0.11, speed: 12.0, width: 1.5 },
  ];

  // Duración de animación según fase
  // calculating: velocidades normales
  // converging: se ralentizan (multiplicador progresivo)
  // done: se detienen
  function getAnimDuration(baseSpeed) {
    if (phase === "done") return `${baseSpeed * 8}s`;
    if (phase === "converging") {
      // Lerp: cuanto más avanza el progreso, más lento. progress va de ~0.5 a 1 en converging.
      const slowFactor = 1 + (progress * 5);
      return `${baseSpeed * slowFactor}s`;
    }
    return `${baseSpeed}s`;
  }

  // Color del anillo según fase
  function getRingColor(ringIndex) {
    if (phase === "done") return "var(--primary)";
    // Alternar entre primary y muted-foreground según índice y progreso
    const fadeIn = Math.max(0, (progress * rings.length) - ringIndex);
    if (fadeIn >= 1) return "var(--primary)";
    return "var(--muted-foreground)";
  }

  // Opacidad base del anillo según posición (exterior más tenue)
  function getRingOpacity(ringIndex) {
    if (phase === "done") return 1;
    const base = 0.35 + ringIndex * 0.13;
    return Math.min(base + progress * 0.4, 0.95);
  }

  // Alineación "done": todos los anillos comparten el mismo eje visual (solo rotX varía)
  function getDoneTransform(ring) {
    if (phase !== "done") return null;
    const alignedRotX = 65; // plano inclinado unificado
    return `rotateX(${alignedRotX}deg) rotateY(0deg) rotateZ(0deg)`;
  }

  const nodeSize = size * 0.06;

  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${uid}-spin-0 {
          from { transform: rotateX(${rings[0].rotX}deg) rotateY(${rings[0].rotY}deg) rotateZ(0deg); }
          to   { transform: rotateX(${rings[0].rotX}deg) rotateY(${rings[0].rotY}deg) rotateZ(360deg); }
        }
        @keyframes ${uid}-spin-1 {
          from { transform: rotateX(${rings[1].rotX}deg) rotateY(${rings[1].rotY}deg) rotateZ(0deg); }
          to   { transform: rotateX(${rings[1].rotX}deg) rotateY(${rings[1].rotY}deg) rotateZ(360deg); }
        }
        @keyframes ${uid}-spin-2 {
          from { transform: rotateX(${rings[2].rotX}deg) rotateY(${rings[2].rotY}deg) rotateZ(0deg); }
          to   { transform: rotateX(${rings[2].rotX}deg) rotateY(${rings[2].rotY}deg) rotateZ(360deg); }
        }
        @keyframes ${uid}-spin-3 {
          from { transform: rotateX(${rings[3].rotX}deg) rotateY(${rings[3].rotY}deg) rotateZ(0deg); }
          to   { transform: rotateX(${rings[3].rotX}deg) rotateY(${rings[3].rotY}deg) rotateZ(360deg); }
        }
        @keyframes ${uid}-spin-4 {
          from { transform: rotateX(${rings[4].rotX}deg) rotateY(${rings[4].rotY}deg) rotateZ(0deg); }
          to   { transform: rotateX(${rings[4].rotX}deg) rotateY(${rings[4].rotY}deg) rotateZ(360deg); }
        }
        @keyframes ${uid}-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50%       { transform: translate(-50%, -50%) scale(1.35); opacity: 1; }
        }
        @keyframes ${uid}-pulse-done {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
      `}</style>

      {/* Contenedor 3D con perspective */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${size * 2.5}px`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: size * 0.86,
            height: size * 0.86,
            transformStyle: "preserve-3d",
          }}
        >
          {rings.map((ring) => {
            const diameter = size * ring.radius * 2;
            const doneTransform = getDoneTransform(ring);
            const animDuration = getAnimDuration(ring.speed);

            return (
              <div
                key={ring.id}
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
                  animation: doneTransform
                    ? "none"
                    : `${uid}-spin-${ring.id} ${animDuration} linear infinite`,
                  transform: doneTransform || undefined,
                  transition: phase === "done" ? "transform 0.8s ease-out, border-color 0.6s ease, opacity 0.6s ease" : "border-color 0.4s ease, opacity 0.4s ease",
                  boxSizing: "border-box",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Nodo central */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: nodeSize,
          height: nodeSize,
          borderRadius: "50%",
          background: phase === "done"
            ? "var(--primary)"
            : "var(--muted-foreground)",
          animation: phase === "done"
            ? `${uid}-pulse-done 2s ease-in-out infinite`
            : `${uid}-pulse 1.4s ease-in-out infinite`,
          transition: "background 0.5s ease",
        }}
      />
    </div>
  );
}
