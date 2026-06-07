"use client";

import { useState, useEffect } from "react";
import { WireframeVariantA } from "./WireframeVariantA";
import { WireframeVariantB } from "./WireframeVariantB";
import { WireframeVariantC } from "./WireframeVariantC";
import { useLoaderClock } from "@/components/dev/loaders/useLoaderClock";

const VARIANTS = [
  {
    Component: WireframeVariantA,
    label: "A",
    title: "7D Cross-polytope",
    desc: "14 vértices · 84 aristas · rotación en planos del espacio 7D",
  },
  {
    Component: WireframeVariantB,
    label: "B",
    title: "20D Completo",
    desc: "40 vértices · 760 aristas · proyección 20D→2D",
  },
  {
    Component: WireframeVariantC,
    label: "C",
    title: "Grand Tour 20D",
    desc: "40 vértices · plano de proyección rotatorio continuo",
  },
];

export default function PolytopeComparisonPage() {
  const [durationMs, setDurationMs] = useState(8000);
  const { progress, phase, isApiDone, replay } = useLoaderClock({ durationMs, loop: true });

  const [size, setSize] = useState(400);

  useEffect(() => {
    function calc() {
      const panelW = Math.floor(window.innerWidth / 3) - 48;
      const panelH = window.innerHeight - 100; // restar header
      setSize(Math.min(panelW, panelH, 560));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border h-12 flex items-center px-4 gap-4 shrink-0">
        <a
          href="/dev/loaders"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Galería
        </a>
        <span className="text-muted-foreground text-xs">/</span>
        <a
          href="/dev/loaders/wireframe"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Wireframe
        </a>
        <h1 className="flex-1 text-sm font-medium text-center">
          Comparación de politopos
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Dur: {(durationMs / 1000).toFixed(0)}s
          </span>
          <input
            type="range"
            min={4000}
            max={12000}
            step={1000}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
            className="w-24 accent-primary"
            aria-label="Duración del ciclo de animación"
          />
          <button
            onClick={replay}
            className="p-1 rounded hover:bg-muted"
            title="Reiniciar"
            aria-label="Reiniciar animación"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex flex-1 divide-x divide-border overflow-hidden">
        {VARIANTS.map(({ Component, label, title, desc }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-4 min-w-0"
          >
            <div className="text-center">
              <div className="text-xs font-mono text-muted-foreground mb-1">
                {label}
              </div>
              <div className="text-sm font-medium text-foreground">{title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </div>
            <Component
              progress={progress}
              phase={phase}
              isApiDone={isApiDone}
              size={size}
            />
            <div className="w-full" style={{ maxWidth: size }}>
              <div className="h-0.5 w-full bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-primary rounded"
                  style={{ width: `${progress * 100}%`, transition: "none" }}
                />
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
