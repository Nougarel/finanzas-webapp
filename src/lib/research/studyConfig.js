// src/lib/research/studyConfig.js

/**
 * Constantes globales del funnel /study (M18 Fase 4).
 *
 * Cualquier cambio en estos enums debe sincronizarse con:
 *   - studyCopy.js (etiquetas visibles)
 *   - studyValidators.js (validaciones cliente)
 *   - CHECKs en la BBDD (defense in depth)
 */

// Timeout duro de sesión: 60 minutos (dossier §11.1).
export const TIMEOUT_MS = 60 * 60 * 1000;

// Flujos de la app que el participante debe probar en el modo guiado.
export const FLOW_TYPES = Object.freeze(["direct", "inverse", "diagnosis"]);

// Mínimo de flujos completados para habilitar "He terminado".
export const MIN_FLOWS_TO_FINISH = 3;

// Mínimo de flujos por cohorte. Las cohortes async/pilot exigen menos para no
// penalizar la finalización en escenarios sin acompañamiento presencial.
export const MIN_FLOWS_BY_COHORT = Object.freeze({
  presencial: 3,
  async_masivo: 1,
  pilot: 1,
});

export function minFlowsForCohort(cohort) {
  return MIN_FLOWS_BY_COHORT[cohort] ?? MIN_FLOWS_BY_COHORT.async_masivo;
}

// Cohortes de estudio (se almacenan en research_sessions.metadata.cohort).
export const COHORTS = Object.freeze({
  ASYNC_MASIVO: "async_masivo", // sin query param
  PILOT: "pilot",                // ?cohort=pilot
  PRESENCIAL: "presencial",      // ?cohort=presencial
});

export const DEFAULT_COHORT = COHORTS.ASYNC_MASIVO;

// State machine del funnel pre-app (antes de entrar al uso de la herramienta).
export const PRE_APP_STEPS = Object.freeze([
  "welcome",
  "consent",
  "demographics",
  "pretest_literacy",
  "transition_to_app",
]);

// State machine del posttest (tras pulsar "He terminado" en la fase app).
export const POSTTEST_STEPS = Object.freeze([
  "sus",
  "adhoc",
  "qualitative",
  "closing",
]);

// Etapas semánticas de la barra de progreso (dossier §11.6).
export const PROGRESS_STAGES = Object.freeze([
  { id: "welcome", label: "Bienvenida" },
  { id: "demographics", label: "Tú" },
  { id: "pretest", label: "Conceptos financieros" },
  { id: "app", label: "Herramienta" },
  { id: "posttest", label: "Valoración" },
  { id: "closing", label: "Final" },
]);

/**
 * Mapeo step → progress stage para la barra de progreso.
 * Devuelve null si el step no encaja en ninguna etapa visible.
 */
export function getProgressStage(step) {
  if (step === "welcome" || step === "consent") return "welcome";
  if (step === "demographics") return "demographics";
  if (typeof step === "string" && step.startsWith("pretest_")) return "pretest";
  if (step === "transition_to_app" || step === "app") return "app";
  if (step === "sus" || step === "adhoc" || step === "qualitative") return "posttest";
  if (step === "closing") return "closing";
  return null;
}

/**
 * Clave usada para identificar las respuestas demográficas dentro del objeto
 * pretestAnswers (que también contiene respuestas a preguntas de literacia).
 * Se trata como una "pregunta más" para no duplicar estado.
 */
export const DEMOGRAPHICS_KEY = "__demographics";
