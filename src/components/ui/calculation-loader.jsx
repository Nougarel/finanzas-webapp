"use client";

import { useState, useEffect, useRef } from "react";
import { WireframeVariantC } from "@/components/dev/loaders/polytope/WireframeVariantC";
import { useLoaderClock } from "@/components/dev/loaders/useLoaderClock";

const FLOW_COPY = {
  direct: {
    label: "Calculando tu distribución óptima",
    sub:   "en el espacio de 20 dimensiones de tu perfil financiero",
  },
  inverse: {
    label: "Calculando tu ingreso mínimo necesario",
    sub:   "explorando combinaciones posibles en 20 dimensiones",
  },
};

export function CalculationLoader({ flow, isApiDone }) {
  const copy = FLOW_COPY[flow] ?? FLOW_COPY.direct;

  // Clock interno: 7s por ciclo, en bucle hasta que el padre desmonte
  const { progress, phase } = useLoaderClock({ durationMs: 7000, loop: true });

  // Tamaño responsivo de la animación
  const [size, setSize] = useState(400);
  useEffect(() => {
    function calc() {
      const w = window.innerWidth  - 48;
      const h = window.innerHeight - 210;
      setSize(Math.min(w, h, 520));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Contador basado en tiempo transcurrido — independiente del framerate
  // ~400M/s de base con variación orgánica. Supera 1M en <3ms.
  const counterElRef  = useRef(null);
  const rafCountRef   = useRef(null);
  const startTsRef    = useRef(null);

  useEffect(() => {
    function tickCounter(ts) {
      if (startTsRef.current === null) startTsRef.current = ts;
      const elapsed = ts - startTsRef.current; // ms desde el montaje
      const value = Math.floor(
        elapsed * 400_000 + Math.sin(elapsed / 600) * 120_000_000
      );
      if (counterElRef.current) {
        counterElRef.current.textContent =
          Math.max(0, value).toLocaleString("es-ES");
      }
      rafCountRef.current = requestAnimationFrame(tickCounter);
    }
    rafCountRef.current = requestAnimationFrame(tickCounter);
    return () => {
      if (rafCountRef.current) cancelAnimationFrame(rafCountRef.current);
    };
  }, []);

  const phaseLabel = (phase === "converging" || phase === "done")
    ? "convergiendo"
    : progress < 0.15
    ? "aplicando restricciones basadas en tu perfil"
    : "explorando distribuciones posibles";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 px-6"
      style={{ paddingBottom: 20 }}
      role="main"
      aria-label="Calculando resultados"
      aria-live="polite"
      aria-busy={!isApiDone ? "true" : "false"}
    >
      {/* Animación principal */}
      <WireframeVariantC
        progress={progress}
        phase={phase}
        isApiDone={isApiDone}
        size={size}
      />

      {/* Bloque de texto */}
      <div
        className="flex flex-col items-center"
        style={{ gap: 12, maxWidth: Math.min(size, 540), width: "100%" }}
      >
        {/* Label "ANALIZANDO" */}
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

        {/* Contador */}
        <span
          ref={counterElRef}
          style={{
            fontFamily: "monospace",
            fontSize: Math.max(32, Math.round(size * 0.078)),
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

        {/* Descripción del flujo */}
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
          {copy.label}
          <br />
          <span style={{ fontSize: 12 }}>{copy.sub}</span>
        </p>

        {/* Indicador de fase */}
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
          {phaseLabel}
        </p>
      </div>

      {/* Barra de progreso — 2px al fondo */}
      <div
        className="fixed inset-x-0 bottom-0"
        style={{
          height: 2,
          backgroundColor: "color-mix(in oklch, var(--foreground) 8%, transparent)",
        }}
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
