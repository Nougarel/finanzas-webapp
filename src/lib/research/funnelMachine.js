// src/lib/research/funnelMachine.js

/**
 * State machine pura del funnel /study. Sin React, sin DOM.
 *
 * El funnel se compone de tres tramos:
 *   1. Pre-app (PRE_APP_STEPS): single-route /study con state interno
 *   2. App (rutas reales /study/(app)/...): tramo medido por completedFlows
 *   3. Posttest (POSTTEST_STEPS): single-route /study/posttest con state interno
 */

import { PRE_APP_STEPS, POSTTEST_STEPS, MIN_FLOWS_TO_FINISH } from "./studyConfig";

/**
 * Siguiente step en el funnel pre-app, o null si es el último.
 */
export function nextPreAppStep(currentStep) {
  const idx = PRE_APP_STEPS.indexOf(currentStep);
  if (idx === -1 || idx === PRE_APP_STEPS.length - 1) return null;
  return PRE_APP_STEPS[idx + 1];
}

/**
 * Siguiente step en el posttest, o null si es el último.
 */
export function nextPosttestStep(currentStep) {
  const idx = POSTTEST_STEPS.indexOf(currentStep);
  if (idx === -1 || idx === POSTTEST_STEPS.length - 1) return null;
  return POSTTEST_STEPS[idx + 1];
}

/**
 * Calcula el progreso porcentual del funnel en función del step actual y
 * los flujos completados durante la fase app.
 *
 * Escala:
 *   - Pre-app  → 0-40%
 *   - App      → 40-70% (proporcional a flujos: 0/3 = 40, 1/3 = 50, 2/3 = 60, 3/3 = 70)
 *   - Posttest → 70-100%
 *
 * @param {string} currentStep - id del step actual (puede ser de pre-app, "app" o posttest)
 * @param {{direct:boolean, inverse:boolean, diagnosis:boolean}} completedFlows
 * @returns {number} 0-100
 */
export function progressOf(currentStep, completedFlows) {
  // Tramo pre-app: progreso lineal 0-40 según índice en PRE_APP_STEPS.
  const preIdx = PRE_APP_STEPS.indexOf(currentStep);
  if (preIdx !== -1) {
    const n = PRE_APP_STEPS.length;
    // Mapeo: welcome → 0, ..., transition_to_app → cerca de 40.
    return Math.round((preIdx / (n - 1)) * 40);
  }

  // Tramo posttest: 70-100 según índice en POSTTEST_STEPS.
  const postIdx = POSTTEST_STEPS.indexOf(currentStep);
  if (postIdx !== -1) {
    const n = POSTTEST_STEPS.length;
    // Mapeo: sus → 70, ..., closing → 100.
    return Math.round(70 + (postIdx / (n - 1)) * 30);
  }

  // Tramo app: 40 + 10 puntos por flujo completado.
  if (currentStep === "app" || isAppPhase(currentStep)) {
    const done = countCompletedFlows(completedFlows);
    return 40 + done * 10;
  }

  return 0;
}

/**
 * Indica si el step pertenece a la fase de uso de la app.
 * "transition_to_app" es la última pantalla de pre-app que enlaza a la fase app.
 */
export function isAppPhase(currentStep) {
  return currentStep === "app" || currentStep === "transition_to_app";
}

/**
 * Cuenta cuántos flujos están completados.
 */
export function countCompletedFlows(completedFlows) {
  if (!completedFlows) return 0;
  return (
    (completedFlows.direct ? 1 : 0) +
    (completedFlows.inverse ? 1 : 0) +
    (completedFlows.diagnosis ? 1 : 0)
  );
}

/**
 * ¿Se cumple la condición para habilitar "He terminado"?
 */
export function canFinishApp(completedFlows) {
  return countCompletedFlows(completedFlows) >= MIN_FLOWS_TO_FINISH;
}
