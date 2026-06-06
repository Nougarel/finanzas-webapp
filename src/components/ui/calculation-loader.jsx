"use client";

import { useState, useEffect, useRef } from "react";
import { BrainCircuit, CheckCircle2, Circle } from "lucide-react";

// Texto de las fases por flujo.
// El número de iteraciones del inverso viene del comentario del propio algoritmo
// en inverseCalculator.js: "~25 iteraciones" (búsqueda binaria sobre EPS = 1€).
const FLOW_COPY = {
  direct: {
    title: "Calculando tu distribución óptima",
    phases: [
      "Procesando tu perfil financiero",
      "Derivando objetivos personalizados para tu situación",
      "Explorando más de un millón de distribuciones posibles para encontrar la óptima",
      "Evaluando tu puntuación de salud financiera",
    ],
  },
  inverse: {
    title: "Calculando tu ingreso mínimo necesario",
    phases: [
      "Analizando los importes que deseas cubrir",
      "Derivando objetivos financieros para tu perfil",
      "Ejecutando ~25 rondas de optimización para encontrar el ingreso exacto",
      "Verificando la viabilidad financiera del plan",
    ],
  },
  diagnosis: {
    title: "Analizando tu situación financiera",
    phases: [
      "Procesando tu distribución financiera real",
      "Calculando la distribución óptima para tu situación",
      "Comparando con las referencias del Instituto Nacional de Estadística",
      "Evaluando tus indicadores de salud financiera",
    ],
  },
};

// Tiempos en ms en los que cada fase queda completada (desde el montaje).
// Fase 0: inmediata (0ms), fase 1: 500ms, fase 2: 1100ms, fase 3: 1700ms.
const PHASE_TIMINGS = [0, 500, 1100, 1700];

// Icono de estado para cada fase.
function PhaseIcon({ state }) {
  if (state === "done") {
    return (
      <CheckCircle2
        className="shrink-0 text-green-600"
        style={{ width: 18, height: 18 }}
        aria-hidden
      />
    );
  }
  if (state === "active") {
    return (
      <span
        aria-hidden
        className="shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
        style={{ width: 18, height: 18, display: "inline-block" }}
      />
    );
  }
  // pendiente
  return (
    <Circle
      className="shrink-0 text-muted-foreground"
      style={{ width: 18, height: 18 }}
      aria-hidden
    />
  );
}

/**
 * Pantalla de carga narrativa para los 3 flujos de cálculo de flouss.
 *
 * Props:
 *   flow       — "direct" | "inverse" | "diagnosis"
 *   isApiDone  — true cuando la API ya respondió (controla la fase 4)
 *
 * El dismiss (quitar este componente del árbol) lo gestiona el padre:
 * usa un estado `showLoader` combinado con un timer de 2000ms y el fin
 * del fetch (loading === false) para decidir cuándo dejar de renderizar
 * este componente.
 */
export function CalculationLoader({ flow, isApiDone }) {
  // Número de fases completadas (0-4).
  const [phasesDone, setPhasesDone] = useState(0);
  const timersRef = useRef([]);

  const copy = FLOW_COPY[flow] ?? FLOW_COPY.direct;

  // Montar: programar el avance de fases.
  useEffect(() => {
    // Fase 0: completada inmediatamente
    setPhasesDone(1);

    // Fases 1-3: completadas en sus respectivos tiempos
    for (let i = 1; i < PHASE_TIMINGS.length; i++) {
      const phaseIndex = i;
      const t = setTimeout(() => {
        setPhasesDone(phaseIndex + 1);
      }, PHASE_TIMINGS[i]);
      timersRef.current.push(t);
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Estado visual de cada fase según los timers propios del componente.
  // isApiDone no interviene aquí — solo el padre lo usa para controlar el dismiss.
  const progressPct = (phasesDone / 4) * 100;

  function phaseState(index) {
    if (index < phasesDone) return "done";
    if (index === phasesDone) return "active";
    return "pending";
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      aria-label="Calculando resultados"
      aria-live="polite"
      aria-busy={!isApiDone ? "true" : "false"}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card px-8 py-10 space-y-6 shadow-sm">

        {/* Cabecera: icono + título */}
        <div className="flex items-center gap-3">
          <BrainCircuit
            className="shrink-0 text-primary"
            style={{ width: 28, height: 28 }}
            aria-hidden
          />
          <h1 className="text-xl font-semibold text-foreground">
            {copy.title}
          </h1>
        </div>

        {/* Lista de fases */}
        <ol className="space-y-3" aria-label="Fases del cálculo">
          {copy.phases.map((text, index) => {
            const state = phaseState(index);
            return (
              <li key={index} className="flex items-center gap-3">
                <PhaseIcon state={state} />
                <span
                  className={
                    state === "done"
                      ? "text-sm text-foreground"
                      : state === "active"
                      ? "text-sm font-medium text-foreground"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Barra de progreso */}
        <div
          className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del cálculo"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

      </div>
    </main>
  );
}
