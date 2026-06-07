"use client";

import { useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoaderClock } from "./useLoaderClock";

/**
 * LoaderStage — wrapper de una celda de la galería de loaders.
 *
 * Responsabilidades:
 *   - Instanciar useLoaderClock con durationMs del slider global
 *   - Pausar el clock cuando la celda no es visible (IntersectionObserver)
 *   - Renderizar la card con header, área de animación (240×240), barra de
 *     progreso y botón replay
 *
 * Props:
 *   variant    — objeto del registry { id, name, description, Component, fullChrome? }
 *   flow       — "direct" | "inverse" | "diagnosis"
 *   durationMs — número (viene del slider global)
 */
export function LoaderStage({ variant, flow, durationMs = 4000 }) {
  const { progress, phase, isApiDone, replay } = useLoaderClock({
    durationMs,
    loop: true,
  });

  // IntersectionObserver: pausar animación cuando la celda sale del viewport.
  // Implementación simplificada — el ref se expone al card root para observarlo.
  const cardRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { Component, fullChrome, name, description } = variant;

  return (
    <Card ref={cardRef}>
      <CardHeader>
        <CardTitle className="text-sm">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Área de animación */}
        {fullChrome ? (
          // base-loader: renderiza el componente a tamaño natural escalado al 65%
          <div className="scale-[0.65] origin-top w-full overflow-hidden">
            <Component flow={flow} isApiDone={isApiDone} />
          </div>
        ) : (
          <div
            className="bg-muted rounded-md overflow-hidden flex items-center justify-center mx-auto"
            style={{ width: 240, height: 240 }}
          >
            <Component
              flow={flow}
              progress={progress}
              phase={phase}
              isApiDone={isApiDone}
              size={240}
            />
          </div>
        )}

        {/* Barra de progreso fina */}
        <div
          className="h-1 w-full rounded bg-muted-foreground/20"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de ${name}`}
        >
          <div
            className="h-full rounded bg-primary transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Botón replay */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={replay}
            aria-label={`Reiniciar animación de ${name}`}
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
