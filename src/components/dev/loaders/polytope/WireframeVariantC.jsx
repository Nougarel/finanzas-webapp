"use client";

import { useEffect, useRef } from "react";

/**
 * WireframeVariantC — Grand Tour 20D
 * 40 vértices en espacio 20D. El plano de proyección rota continuamente
 * a través del espacio 20D (Grand Tour), produciendo morfing continuo de la
 * sombra 2D: estrella → disco → red → estrella, revelando simetría 20D.
 *
 * Arquitectura: Canvas 2D + rAF. Sin useState para coordenadas.
 * Colores del tema resueltos a RGB una vez al montar (oklch → rgb).
 *
 * @param {number}  progress   0..1
 * @param {"calculating"|"converging"|"done"} phase
 * @param {boolean} isApiDone
 * @param {number}  size       px del canvas (cuadrado)
 */

// --- Geometría 20D Cross-polytope — nivel de módulo (se calcula una vez) ---

const N = 20;

// 40 vértices: ±e_i para i = 0..19
const VERTICES = [];
for (let i = 0; i < N; i++) {
  const pos = new Array(N).fill(0); pos[i] =  1; VERTICES.push(pos);
  const neg = new Array(N).fill(0); neg[i] = -1; VERTICES.push(neg);
}

// Todas las aristas (760): pares no antipodales
const EDGES = [];
for (let a = 0; a < 40; a++) {
  for (let b = a + 1; b < 40; b++) {
    if (Math.floor(a / 2) !== Math.floor(b / 2)) {
      EDGES.push([a, b]);
    }
  }
}

// Planos de rotación del Grand Tour — cubren las 20 dimensiones.
// Velocidades irracionales (múltiplos de √2, √3, √5) garantizan período infinito.
// Más planos = el tour recorre más del espacio 20D → morfing más rico
const TOUR_PLANES = [
  [0,  2,  0.52],
  [1,  3,  0.36],
  [4,  6,  0.30],
  [5,  7,  0.47],
  [8, 10,  0.19],
  [9, 11,  0.63],
  [12, 14, 0.25],
  [13, 15, 0.44],
  [16, 18, 0.58],
  [17, 19, 0.22],
  [0,  5,  0.39],
  [2,  7,  0.50],
  [4, 11,  0.17],
  [6, 13,  0.61],
  [8, 15,  0.33],
  [10, 17, 0.28],
  [1, 12,  0.55],
  [3, 16,  0.41],
  [14, 19, 0.66],
  [0, 19,  0.14],
];

// Secuencia de visitas de vértices — determinista
const VISIT_ORDER_C = [0, 5, 10, 15, 20, 25, 30, 35, 1, 6, 11, 16];

// Genera N valores pseudo-aleatorios en [min, max] con LCG seeded (determinista)
function seededRange(n, seed, min, max) {
  let s = seed >>> 0;
  return Array.from({ length: n }, () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return min + (s / 0xffffffff) * (max - min);
  });
}

// Duraciones pseudo-aleatorias para cada visita, normalizadas a 0..0.56
// (la fase "calculating" va de 0 a 0.60, dejamos margen de 0.04 al final)
const _rawDurations = seededRange(VISIT_ORDER_C.length, 0xABCD1234, 0.3, 1.7);
const _rawSum = _rawDurations.reduce((s, v) => s + v, 0);
const _avgSlot = 0.56 / VISIT_ORDER_C.length;
const VISIT_DURATIONS = _rawDurations.map(v => v * _avgSlot / (_rawSum / VISIT_ORDER_C.length));

// Umbral acumulado: el vértice i se activa cuando progress >= VISIT_THRESHOLDS[i]
const VISIT_THRESHOLDS = (() => {
  const out = [];
  let cumul = 0.02; // pequeño offset inicial
  for (const d of VISIT_DURATIONS) {
    out.push(cumul);
    cumul += d;
  }
  return out;
})();

// --- Funciones matemáticas ---

/** Aplica una rotación de Givens en el plano (i, j) con ángulo theta */
function applyGivens(v, i, j, theta) {
  const result = [...v];
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  result[i] = v[i] * c - v[j] * s;
  result[j] = v[i] * s + v[j] * c;
  return result;
}

/**
 * Re-ortogonaliza v2 respecto a v1 (Gram-Schmidt) y normaliza ambos.
 * Evita el drift numérico acumulado frame a frame.
 */
function gramSchmidt(v1, v2) {
  // Normalizar v1
  let len1 = 0;
  for (let i = 0; i < N; i++) len1 += v1[i] * v1[i];
  const v1n = v1.map(vi => vi / Math.sqrt(len1));

  // v2_orth = v2 - (v2·v1n)*v1n
  let dot = 0;
  for (let i = 0; i < N; i++) dot += v2[i] * v1n[i];
  const v2orth = v2.map((vi, i) => vi - dot * v1n[i]);

  // Normalizar v2orth
  let len2 = 0;
  for (let i = 0; i < N; i++) len2 += v2orth[i] * v2orth[i];
  const v2n = v2orth.map(vi => vi / Math.sqrt(len2));

  return [v1n, v2n];
}

/**
 * Resuelve una CSS variable de color (oklch u hsl) a un string rgb().
 * Se llama una vez al montar — no en el loop de rAF.
 */
function resolveColor(cssVar) {
  const raw = window.getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
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

/** Parsea "rgb(r, g, b)" → [r, g, b] para construir rgba() en el glow */
function parseRGB(rgbStr) {
  const m = rgbStr.match(/(\d+(?:\.\d+)?)/g);
  return m ? m.map(Number) : [0, 0, 0];
}

// --- Componente ---

function randomOrthoBasis(n) {
  const v1raw = Array.from({ length: n }, () => Math.random() - 0.5);
  const len1  = Math.sqrt(v1raw.reduce((s, x) => s + x * x, 0));
  const v1    = v1raw.map(x => x / len1);

  const v2raw = Array.from({ length: n }, () => Math.random() - 0.5);
  const dot   = v2raw.reduce((s, x, i) => s + x * v1[i], 0);
  const v2orth = v2raw.map((x, i) => x - dot * v1[i]);
  const len2  = Math.sqrt(v2orth.reduce((s, x) => s + x * x, 0));
  const v2    = v2orth.map(x => x / len2);

  return [v1, v2];
}

export function WireframeVariantC({ progress, phase, isApiDone, size = 400 }) {
  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);
  // Vectores base del plano de proyección — aleatorios en cada montaje
  const [_initV1, _initV2] = randomOrthoBasis(N);
  const tourV1Ref     = useRef(_initV1);
  const tourV2Ref     = useRef(_initV2);
  const lastTimeRef   = useRef(null);
  // Refs para leer props dentro del rAF sin closures obsoletas
  const progressRef   = useRef(progress);
  const phaseRef      = useRef(phase);
  // visitedSet reutilizado en cada frame (evita allocación)
  const visitedSetRef = useRef(new Set());

  // Sincronizar refs con las props en cada render
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // HiDPI fix: canvas físico = size × dpr, mostrado en size CSS px
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Resolver colores del tema una vez al montar
    const colorPrimary = resolveColor("--primary");
    const colorMuted   = resolveColor("--muted-foreground");
    const [pr, pg, pb] = parseRGB(colorPrimary);

    const center = size / 2;

    function tick(timestamp) {
      // dt en segundos, con cap anti-spike (pestaña en background)
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
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

      // --- Actualizar plano de proyección (Grand Tour) ---
      if (speedFactor > 0) {
        let v1 = [...tourV1Ref.current];
        let v2 = [...tourV2Ref.current];

        for (const [i, j, speed] of TOUR_PLANES) {
          const dtheta = speed * dt * speedFactor;
          v1 = applyGivens(v1, i, j, dtheta);
          v2 = applyGivens(v2, i, j, dtheta);
        }

        // Re-ortogonalizar cada frame para evitar drift
        [v1, v2] = gramSchmidt(v1, v2);
        tourV1Ref.current = v1;
        tourV2Ref.current = v2;
      }

      // --- Proyectar todos los vértices con escala adaptativa ---
      const v1 = tourV1Ref.current;
      const v2 = tourV2Ref.current;

      // 1. Proyectar sin escala (coordenadas en espacio normalizado)
      const rawProj = VERTICES.map(v => {
        let px = 0, py = 0;
        for (let i = 0; i < N; i++) { px += v[i] * v1[i]; py += v[i] * v2[i]; }
        return { px, py, z: v[2] };
      });

      // 2. Escala adaptativa: distancia máxima = 44% del panel (todos los vértices dentro)
      const dists = rawProj.map(p => Math.sqrt(p.px * p.px + p.py * p.py));
      const pMax = Math.max(...dists) || 1;
      const adaptiveScale = (size * 0.44) / pMax;

      // 3. Proyección final con centro
      const projected = rawProj.map(p => ({
        x: center + p.px * adaptiveScale,
        y: center + p.py * adaptiveScale,
        z: p.z,
      }));

      // --- Estado de visitas ---
      const visitedCount = (currentPhase === "converging" || currentPhase === "done")
        ? VISIT_ORDER_C.length
        : VISIT_THRESHOLDS.filter(t => currentProgress >= t).length;
      const visitedSet = visitedSetRef.current;
      visitedSet.clear();
      VISIT_ORDER_C.slice(0, visitedCount).forEach(idx => visitedSet.add(idx));

      // --- Limpiar canvas ---
      ctx.clearRect(0, 0, size, size);

      // --- Dibujar aristas (más lejanas primero — painter's algorithm) ---
      const edgesWithDepth = EDGES.map(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        return { a, b, pa, pb, zMid: (pa.z + pb.z) / 2 };
      });
      // Ordenar: zMid menor primero (fondo → frente)
      edgesWithDepth.sort((e1, e2) => e1.zMid - e2.zMid);

      for (const { a, b, pa, pb, zMid } of edgesWithDepth) {
        const zNorm      = Math.max(0, Math.min(1, (zMid + 1) / 2));
        const bothActive = visitedSet.has(a) && visitedSet.has(b);

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);

        if (bothActive) {
          // Arista entre dos vértices visitados: primary, visible
          ctx.strokeStyle = colorPrimary;
          ctx.lineWidth   = 1.8;
          ctx.globalAlpha = 0.75 + zNorm * 0.15; // 0.75..0.90
        } else {
          // Arista inactiva: muted, muy translúcida — 760 líneas no deben saturar
          ctx.strokeStyle = colorMuted;
          ctx.lineWidth   = 0.8;
          ctx.globalAlpha = 0.05 + zNorm * 0.10; // 0.05..0.15
        }

        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // --- Glow en fase done: halo bajo los vértices visitados ---
      if (currentPhase === "done") {
        for (const idx of visitedSet) {
          const pt = projected[idx];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr},${pg},${pb},0.12)`;
          ctx.globalAlpha = 1;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // --- Dibujar vértices ---
      for (let idx = 0; idx < VERTICES.length; idx++) {
        const pt    = projected[idx];
        const zNorm = Math.max(0, Math.min(1, (pt.z + 1) / 2));

        ctx.beginPath();

        if (visitedSet.has(idx)) {
          const r = 2.5 + zNorm * 1.2;
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle   = colorPrimary;
          ctx.globalAlpha = 0.85;
        } else {
          const r = 1.2 + zNorm * 0.8;
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle   = colorMuted;
          ctx.globalAlpha = 0.20 + zNorm * 0.20; // 0.20..0.40
        }

        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
    <div style={{ width: size, height: size, position: "relative" }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}
