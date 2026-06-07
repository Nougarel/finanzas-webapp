"use client";

import { useRef, useEffect } from "react";

const PARTICLE_COUNT = 60;

/**
 * ParticlesLoader — representa el espacio de soluciones del LP solver colapsando
 * hacia la distribución óptima.
 *
 * Cada partícula = una distribución candidata del espacio de soluciones (2^20 combinaciones).
 * Las malas distribuciones se descartan progresivamente; las buenas convergen al centro.
 *
 * Calidades:
 *   bad  (70%) — rojo suave,   se elimina durante `calculating` (0..0.6)
 *   ok   (20%) — amber suave,  se elimina durante `converging`  (0.6..0.9)
 *   good (10%) — primary navy, llega al final y converge al centro
 *
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {number}  progress   0..1 — driver externo
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number=} size       lado del área de dibujo en px (default 240)
 */
export function ParticlesLoader({ flow, progress, phase, isApiDone, size = 240 }) {
  const canvasRef = useRef(null);
  const colorProbeRef = useRef(null);
  const particlesRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(progress);
  const phaseRef = useRef(phase);
  // Colores resueltos del tema vía getComputedStyle
  const colorsRef = useRef({ primary: null, bad: null, ok: null });
  // Destellos de eliminación activos: { x, y, alpha, radius }
  const flashesRef = useRef([]);
  // Timestamp del último frame para animar el ripple en done
  const rippleRef = useRef({ startTime: null, active: false });

  // Mantener refs actualizados sin recapturar closure en rAF
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    const prev = phaseRef.current;
    phaseRef.current = phase;
    // Al entrar en done, arrancar ripple
    if (prev !== "done" && phase === "done") {
      rippleRef.current = { startTime: null, active: true };
    }
  }, [phase]);

  // Inicializar partículas y arrancar el loop de animación
  useEffect(() => {
    const canvas = canvasRef.current;
    const colorProbe = colorProbeRef.current;
    if (!canvas || !colorProbe) return;

    const cx = size / 2;
    const cy = size / 2;

    // Resolver colores del tema vía probes con clases Tailwind
    const primaryProbe = colorProbe.querySelector("[data-probe='primary']");
    const badProbe     = colorProbe.querySelector("[data-probe='bad']");
    const okProbe      = colorProbe.querySelector("[data-probe='ok']");
    colorsRef.current = {
      primary: getComputedStyle(primaryProbe).color,
      bad:     getComputedStyle(badProbe).color,
      ok:      getComputedStyle(okProbe).color,
    };

    // Inicializar partículas con calidad asignada
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const rand = Math.random();
      const quality = rand < 0.70 ? "bad" : rand < 0.90 ? "ok" : "good";

      // Progreso al que esta partícula desaparece (se elimina)
      const eliminatedAt =
        quality === "bad"  ? 0.05 + Math.random() * 0.55 :   // 0.05..0.60
        quality === "ok"   ? 0.60 + Math.random() * 0.30 :   // 0.60..0.90
                             2.0;                              // good: nunca se elimina

      return {
        // Posición inicial aleatoria en el canvas
        x: Math.random() * size,
        y: Math.random() * size,
        // Velocidad errática para la fase calculating
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        // Destino cerca del centro para la fase converging
        xDest: cx + (Math.random() - 0.5) * 8,
        yDest: cy + (Math.random() - 0.5) * 8,
        // Frecuencias de wiggle únicas por partícula
        freqX: 0.0015 + Math.random() * 0.002,
        freqY: 0.0015 + Math.random() * 0.002,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        radius: 2 + Math.random() * 2,
        quality,
        eliminatedAt,
        alpha: 1,
        // Estado interno: si ya lanzó el destello de eliminación
        flashedOut: false,
      };
    });

    flashesRef.current = [];
    let startTime = null;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = timestamp - startTime;

      const ctx = canvas.getContext("2d");
      const p = progressRef.current;
      const ph = phaseRef.current;
      const { primary, bad, ok } = colorsRef.current;

      ctx.clearRect(0, 0, size, size);

      // Color por calidad de distribución
      const colorOf = (quality) =>
        quality === "bad" ? bad : quality === "ok" ? ok : primary;

      // ── Partículas ────────────────────────────────────────────────────────
      for (const pt of particlesRef.current) {
        const alive = p < pt.eliminatedAt;

        // Detectar transición alive→muerta: lanzar destello rojo
        if (!alive && !pt.flashedOut) {
          pt.flashedOut = true;
          flashesRef.current.push({
            x: pt.x,
            y: pt.y,
            alpha: 0.8,
            radius: pt.radius * 3,
          });
        }

        if (!alive) continue;

        let x, y;

        if (ph === "calculating") {
          // Movimiento errático: posición actual + wiggle + drift lento
          pt.x += pt.vx * 0.4;
          pt.y += pt.vy * 0.4;
          // Rebotar en bordes
          if (pt.x < 0 || pt.x > size) pt.vx *= -1;
          if (pt.y < 0 || pt.y > size) pt.vy *= -1;
          pt.x = Math.max(0, Math.min(size, pt.x));
          pt.y = Math.max(0, Math.min(size, pt.y));
          x = pt.x + 6 * Math.sin(t * pt.freqX + pt.phaseX);
          y = pt.y + 6 * Math.sin(t * pt.freqY + pt.phaseY);
        } else {
          // converging / done: interpolar hacia el destino central
          // Remapear p a rango 0.6..1 → 0..1 para la convergencia
          const convergenceP = Math.max(0, (p - 0.6) / 0.4);
          const eased = convergenceP < 0.5
            ? 2 * convergenceP * convergenceP
            : 1 - Math.pow(-2 * convergenceP + 2, 2) / 2;

          // Amplitud de wiggle se apaga al converger
          const amp = 5 * (1 - eased);
          x = pt.x + (pt.xDest - pt.x) * eased + amp * Math.sin(t * pt.freqX + pt.phaseX);
          y = pt.y + (pt.yDest - pt.y) * eased + amp * Math.sin(t * pt.freqY + pt.phaseY);
        }

        // Opacidad sube con progress para las good, estable para las demás
        const alpha = pt.quality === "good" ? 0.5 + p * 0.5 : 0.6;

        ctx.beginPath();
        ctx.arc(x, y, pt.radius, 0, Math.PI * 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colorOf(pt.quality);
        ctx.fill();
      }

      // ── Destellos de eliminación ─────────────────────────────────────────
      flashesRef.current = flashesRef.current.filter((fl) => fl.alpha > 0.02);
      for (const fl of flashesRef.current) {
        ctx.beginPath();
        ctx.arc(fl.x, fl.y, fl.radius, 0, Math.PI * 2);
        ctx.globalAlpha = fl.alpha;
        ctx.fillStyle = bad; // destello usa el color "bad"
        ctx.fill();
        fl.alpha *= 0.82;    // fade rápido
        fl.radius *= 1.06;   // expande ligeramente al morir
      }

      // ── Halo ripple en done ──────────────────────────────────────────────
      if (ph === "done" && rippleRef.current.active) {
        if (rippleRef.current.startTime === null) {
          rippleRef.current.startTime = timestamp;
        }
        const elapsed = (timestamp - rippleRef.current.startTime) / 1000; // segundos
        // Ripple: ciclo de 1.6s, se repite
        const cycle = (elapsed % 1.6) / 1.6; // 0..1
        const rippleRadius = cycle * size * 0.38;
        const rippleAlpha = (1 - cycle) * 0.35;

        ctx.beginPath();
        ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
        ctx.globalAlpha = rippleAlpha;
        ctx.strokeStyle = primary;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Punto central sólido
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = primary;
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // ── Texto overlay ────────────────────────────────────────────────────
      const TOTAL_COMBINATIONS = 1048576;
      let overlayText = "";

      if (ph === "calculating") {
        const evaluated = Math.floor(p * TOTAL_COMBINATIONS);
        overlayText = `Evaluando ${evaluated.toLocaleString("es-ES")} distribuciones…`;
      } else if (ph === "converging") {
        overlayText = "Convergiendo hacia el óptimo…";
      } else if (ph === "done") {
        overlayText = "Distribución óptima encontrada";
      }

      if (overlayText) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = primary;
        ctx.font = `${Math.round(size * 0.048)}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(overlayText, cx, size - 8, size - 16);
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div
      aria-label="Calculando distribución financiera"
      aria-busy={phase !== "done"}
      style={{ width: size, height: size, position: "relative" }}
    >
      {/* Probes invisibles para resolver colores del tema vía getComputedStyle.
          - text-primary    → navy del design system
          - text-red-400    → distribución mala (bad)
          - text-amber-400  → distribución aceptable (ok) */}
      <div
        ref={colorProbeRef}
        aria-hidden="true"
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
      >
        <span data-probe="primary" className="text-primary" />
        <span data-probe="bad"     className="text-red-400" />
        <span data-probe="ok"      className="text-amber-400" />
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        aria-hidden="true"
      />
    </div>
  );
}
