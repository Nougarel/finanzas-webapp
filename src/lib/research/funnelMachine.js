// src/lib/research/funnelMachine.js

/**
 * State machine pura del funnel /study. Sin React, sin DOM.
 *
 * El funnel se compone de tres tramos:
 *   1. Pre-app (PRE_APP_STEPS): single-route /study con state interno
 *   2. App (rutas reales /study/(app)/...): tramo medido por completedFlows
 *   3. Posttest (POSTTEST_STEPS): single-route /study/posttest con state interno
 */

import { PRE_APP_STEPS, POSTTEST_STEPS, minFlowsForCohort } from "./studyConfig";

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
 *   - App      → 40-70% (proporcional a flujos sobre minFlowsForCohort(cohort))
 *   - Posttest → 70-100%
 *
 * @param {string} currentStep - id del step actual (puede ser de pre-app, "app" o posttest)
 * @param {{direct:boolean, inverse:boolean, diagnosis:boolean}} completedFlows
 * @param {string} cohort - cohorte de estudio que determina el mínimo de flujos
 * @returns {number} 0-100
 */
export function progressOf(currentStep, completedFlows, cohort) {
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

  // Tramo app: 40-70 proporcional a flujos completados sobre el mínimo de la cohorte.
  if (currentStep === "app" || isAppPhase(currentStep)) {
    const done = countCompletedFlows(completedFlows);
    const minFlows = minFlowsForCohort(cohort);
    const ratio = minFlows > 0 ? Math.min(done / minFlows, 1) : 1;
    return Math.round(40 + ratio * 30);
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
export function canFinishApp(completedFlows, cohort) {
  return countCompletedFlows(completedFlows) >= minFlowsForCohort(cohort);
}
