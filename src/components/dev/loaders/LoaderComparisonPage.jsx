"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderStage } from "./LoaderStage";
import { LOADER_VARIANTS } from "./registry";

/**
 * LoaderComparisonPage — galería de las 9 variantes de loader en paralelo.
 *
 * Controles globales:
 *   - Selector de flujo (direct / inverse / diagnosis)
 *   - Slider de duración 1000–8000ms
 *
 * Todos los LoaderStage reciben los mismos flow y durationMs para que el
 * comportamiento de cada variante sea comparable en igualdad de condiciones.
 */
export default function LoaderComparisonPage() {
  const [flow, setFlow] = useState("direct");
  const [durationMs, setDurationMs] = useState(4000);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Comparador de loaders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ruta de desarrollo — {LOADER_VARIANTS.length} variantes en paralelo
          </p>
          <div className="flex gap-3 flex-wrap text-sm mt-2">
            <a href="/dev/loaders/barras" className="text-primary hover:underline">→ Barras</a>
            <a href="/dev/loaders/wireframe" className="text-primary hover:underline">→ Wireframe</a>
            <a href="/dev/loaders/radar" className="text-primary hover:underline">→ Radar</a>
            <a href="/dev/loaders/polytope" className="text-primary hover:underline">→ Politopos</a>
          </div>
        </div>

        {/* Controles globales */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Selector de flujo */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="flow-select"
              className="text-sm font-medium text-foreground whitespace-nowrap"
            >
              Flujo
            </label>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger id="flow-select" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Directo</SelectItem>
                <SelectItem value="inverse">Inverso</SelectItem>
                <SelectItem value="diagnosis">Diagnóstico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Slider de duración */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="duration-slider"
              className="text-sm font-medium text-foreground whitespace-nowrap"
            >
              Duración:{" "}
              <span className="font-mono">
                {(durationMs / 1000).toFixed(1)}s
              </span>
            </label>
            <input
              id="duration-slider"
              type="range"
              min={1000}
              max={8000}
              step={500}
              value={durationMs}
              onChange={(e) => setDurationMs(Number(e.target.value))}
              className="w-32 accent-primary"
              aria-label="Duración del ciclo de animación"
            />
          </div>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {LOADER_VARIANTS.map((variant) => (
            <LoaderStage
              key={variant.id}
              variant={variant}
              flow={flow}
              durationMs={durationMs}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
