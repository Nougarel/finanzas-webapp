"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useLoaderClock({ durationMs, loop })
 *
 * Hook de timing externo para las variantes de loader.
 * Provee un driver de progreso lineal independiente del reloj interno
 * de cada variante — todas las celdas avanzan sincronizadas con la
 * misma duración configurable desde el slider global.
 *
 * Retorna:
 *   progress  — número 0..1, avanza linealmente durante durationMs ms
 *   phase     — "calculating" (0..0.6) | "converging" (0.6..0.95) | "done" (0.95..1)
 *   isApiDone — true cuando progress >= 1
 *   replay()  — reinicia el clock a 0
 *
 * @param {object}  opts
 * @param {number}  opts.durationMs  — duración total del ciclo en ms (default 4000)
 * @param {boolean} opts.loop        — si true, reinicia automáticamente 600ms después de llegar a done (default true)
 */
export function useLoaderClock({ durationMs = 4000, loop = true } = {}) {
  const [progress, setProgress] = useState(0);

  // Refs para el rAF — se usan refs en lugar de estado para evitar
  // cierres obsoletos dentro del callback de rAF.
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const durationRef = useRef(durationMs);
  const loopRef = useRef(loop);

  // Mantener refs sincronizadas con las props más recientes
  useEffect(() => { durationRef.current = durationMs; }, [durationMs]);
  useEffect(() => { loopRef.current = loop; }, [loop]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (loopTimeoutRef.current !== null) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    startTimeRef.current = null;

    function tick(timestamp) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const next = Math.min(elapsed / durationRef.current, 1);
      setProgress(next);

      if (next < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        // Si loop está activo, programar reinicio tras 600ms en "done"
        if (loopRef.current) {
          loopTimeoutRef.current = setTimeout(() => {
            loopTimeoutRef.current = null;
            setProgress(0);
            // Arrancar de nuevo en el siguiente frame para que React
            // haya procesado el reset a 0 antes de avanzar
            rafRef.current = requestAnimationFrame((ts) => {
              startTimeRef.current = ts;
              rafRef.current = requestAnimationFrame(tick);
            });
          }, 600);
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [stop]);

  // Arrancar al montar; limpiar al desmontar
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Cuando cambia durationMs, reiniciar el ciclo desde el principio
  // para que el slider tenga efecto inmediato
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  const phase =
    progress >= 0.95 ? "done" :
    progress >= 0.6  ? "converging" :
                       "calculating";

  const isApiDone = progress >= 1;

  return { progress, phase, isApiDone, replay: start };
}
