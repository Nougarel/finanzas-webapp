"use client";

import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLoaderClock } from "./useLoaderClock";
import { BarrasLoader } from "./variants/barras-loader";
import { WireframeLoader } from "./variants/wireframe-loader";
import { RadarStarLoader } from "./variants/radar-star-loader";

const LOADER_MAP = {
  barras: BarrasLoader,
  wireframe: WireframeLoader,
  radar: RadarStarLoader,
};

const FLOW_LABELS = {
  direct: "Cálculo directo",
  inverse: "Ingreso mínimo",
  diagnosis: "Diagnóstico",
};

/**
 * SingleLoaderPage — página de pantalla completa para iterar sobre
 * una única variante de loader en tamaño grande.
 *
 * Props:
 *   variantId — "barras" | "wireframe" | "radar"
 *   title     — nombre legible de la variante
 */
export default function SingleLoaderPage({ variantId, title }) {
  const [flow, setFlow] = useState("direct");
  const [durationMs, setDurationMs] = useState(6000);

  // Tamaño responsivo calculado en cliente (SSR-safe: default 480)
  const [size, setSize] = useState(480);

  useEffect(() => {
    function calcSize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Descontar header (56px) + footer (48px) + padding vertical (48px)
      const availableH = h - 56 - 48 - 48;
      if (w >= 768) {
        return Math.min(w * 0.6, availableH * 0.9, 600);
      }
      return Math.min(w - 48, availableH * 0.85, 400);
    }

    setSize(Math.round(calcSize()));

    function handleResize() {
      setSize(Math.round(calcSize()));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { progress, phase, isApiDone, replay } = useLoaderClock({
    durationMs,
    loop: true,
  });

  const LoaderComponent = LOADER_MAP[variantId];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header fijo */}
      <header className="h-14 flex items-center gap-4 px-4 border-b border-border flex-shrink-0">
        {/* Link volver */}
        <a
          href="/dev/loaders"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          ← Galería
        </a>

        {/* Título */}
        <h1 className="text-sm font-semibold text-foreground flex-1 truncate">
          {title}
        </h1>

        {/* Controles */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Selector de flujo */}
          <div className="hidden sm:flex items-center gap-2">
            <label
              htmlFor="flow-select-single"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Flujo
            </label>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger id="flow-select-single" className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Cálculo directo</SelectItem>
                <SelectItem value="inverse">Ingreso mínimo</SelectItem>
                <SelectItem value="diagnosis">Diagnóstico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Slider de duración */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="duration-slider-single"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              <span className="hidden sm:inline">Duración: </span>
              <span className="font-mono">{(durationMs / 1000).toFixed(1)}s</span>
            </label>
            <input
              id="duration-slider-single"
              type="range"
              min={2000}
              max={10000}
              step={500}
              value={durationMs}
              onChange={(e) => setDurationMs(Number(e.target.value))}
              className="w-24 sm:w-32 accent-primary"
              aria-label="Duración del ciclo de animación"
            />
          </div>

          {/* Botón replay */}
          <Button
            variant="ghost"
            size="sm"
            onClick={replay}
            aria-label="Reiniciar animación"
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      {/* Área principal — animación centrada */}
      <main
        className="flex-1 flex items-center justify-center overflow-hidden"
        aria-label={`Animación: ${title}`}
      >
        {LoaderComponent ? (
          <LoaderComponent
            flow={flow}
            progress={progress}
            phase={phase}
            isApiDone={isApiDone}
            size={size}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Variante no encontrada: {variantId}
          </p>
        )}
      </main>

      {/* Footer — barra de progreso + estado */}
      <footer className="flex-shrink-0 border-t border-border">
        {/* Barra de progreso h-1 */}
        <div
          className="h-1 w-full bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de ${title}`}
        >
          <div
            className="h-full bg-primary transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Texto de estado */}
        <div className="h-11 flex items-center px-4">
          <span className="text-xs text-muted-foreground font-mono">
            {phase} · {Math.round(progress * 100)}%
          </span>
          <span className="text-xs text-muted-foreground ml-4">
            {FLOW_LABELS[flow]}
          </span>
        </div>
      </footer>
    </div>
  );
}
