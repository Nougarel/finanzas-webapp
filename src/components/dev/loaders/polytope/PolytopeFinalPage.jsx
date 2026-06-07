"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WireframeVariantC } from "./WireframeVariantC";
import { useLoaderClock } from "@/components/dev/loaders/useLoaderClock";

export default function PolytopeFinalPage() {
  const [durationMs, setDurationMs] = useState(8000);
  const { progress, phase, isApiDone, replay } = useLoaderClock({ durationMs, loop: true });

  // Tamaño responsivo de la animación
  const [size, setSize] = useState(500);
  useEffect(() => {
    function calc() {
      const w = window.innerWidth - 64;
      const h = window.innerHeight - 220;
      setSize(Math.min(w, h, 680));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Contador — crece libre cada rAF, se resetea solo en replay manual
  const counterRef = useRef(0);
  const counterElRef = useRef(null); // ref al <span> del número
  const rafCountRef = useRef(null);

  // Reiniciar contador al hacer replay
  const handleReplay = useCallback(() => {
    counterRef.current = 0;
    replay();
  }, [replay]);

  // Loop del contador (rAF independiente del clock de la animación)
  useEffect(() => {
    function tickCounter(ts) {
      // Incremento variable: ~1.2M–2.8M por frame → supera 1M en <0.1s, ≈120M/s
      const increment = Math.floor(2_000_000 + Math.sin(ts / 200) * 800_000);
      counterRef.current += increment;

      if (counterElRef.current) {
        counterElRef.current.textContent =
          counterRef.current.toLocaleString("es-ES");
      }
      rafCountRef.current = requestAnimationFrame(tickCounter);
    }
    rafCountRef.current = requestAnimationFrame(tickCounter);
    return () => {
      if (rafCountRef.current) cancelAnimationFrame(rafCountRef.current);
    };
  }, []); // arranca una vez, nunca para

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 px-8"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      {/* Link de vuelta, muy discreto, top-left */}
      <a
        href="/dev/loaders/polytope"
        className="fixed top-3 left-4 text-xs text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-opacity"
      >
        ← comparación
      </a>

      {/* Controles dev: replay + slider — también discretos */}
      <div className="fixed top-3 right-4 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-xs text-muted-foreground">{(durationMs / 1000).toFixed(0)}s</span>
        <input
          type="range" min={4000} max={16000} step={1000}
          value={durationMs}
          onChange={e => setDurationMs(Number(e.target.value))}
          className="w-20 accent-primary"
        />
        <button onClick={handleReplay} className="p-1 rounded hover:bg-muted" title="Reiniciar">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {/* Animación principal */}
      <WireframeVariantC
        progress={progress}
        phase={phase}
        isApiDone={isApiDone}
        size={size}
      />

      {/* Bloque de texto — todo centrado, tipografía consistente */}
      <div
        className="flex flex-col items-center"
        style={{ gap: 12, maxWidth: Math.min(size, 540), width: "100%" }}
      >
        {/* Label superior — uppercase espaciado */}
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            opacity: 0.45,
            margin: 0,
            fontFamily: "inherit",
          }}
        >
          Analizando
        </p>

        {/* Número grande — estrella del layout */}
        <span
          ref={counterElRef}
          style={{
            fontFamily: "monospace",
            fontSize: Math.max(38, Math.round(size * 0.082)),
            fontWeight: 700,
            color: "var(--primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            display: "block",
            textAlign: "center",
          }}
          aria-live="off"
        >
          0
        </span>

        {/* Descripción fija */}
        <p
          style={{
            fontSize: 13,
            color: "var(--muted-foreground)",
            opacity: 0.6,
            margin: 0,
            lineHeight: 1.6,
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          distribuciones posibles en el espacio<br />
          de 20 dimensiones de tu perfil financiero
        </p>

        {/* Indicador de fase — muy sutil, cambia con la animación */}
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            opacity: 0.30,
            margin: 0,
            fontFamily: "inherit",
          }}
        >
          {phase === "done"
            ? "— distribución óptima encontrada —"
            : phase === "converging"
            ? "— convergiendo —"
            : "— explorando —"}
        </p>
      </div>

      {/* Barra de progreso — 2px, fixed al fondo */}
      <div
        className="fixed inset-x-0 bottom-0"
        style={{ height: 2, backgroundColor: "color-mix(in oklch, var(--foreground) 10%, transparent)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: "var(--primary)",
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}
