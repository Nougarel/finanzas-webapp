// src/lib/research/studyValidators.js

/**
 * Validadores específicos del funnel /study. Extienden el patrón de
 * src/lib/validators.js — funciones puras, sin libs externas, sin Zod.
 *
 * Los enums (AGE_RANGES, etc.) viven en studyCopy.js; aquí solo se valida
 * la coherencia con esa fuente de verdad. La BBDD valida con CHECKs como
 * defense in depth (R9 del plan consolidado).
 */

import {
  AGE_RANGES,
  GENDERS,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  HOUSEHOLD_COMPOSITIONS,
  BIG_FIVE_QUESTIONS,
  QUALITATIVE,
} from "./studyCopy";

/**
 * Consentimiento RGPD: el participante debe marcar el checkbox.
 */
export function validateConsent(accepted) {
  if (accepted !== true) {
    return { valid: false, error: "Debes aceptar para continuar" };
  }
  return { valid: true, error: null };
}

/**
 * Demografía: las 6 preguntas son obligatorias.
 * Devuelve { valid, errors } con errors keyed por campo.
 */
export function validateDemographics(state) {
  const errors = {};
  const s = state ?? {};

  if (!AGE_RANGES.some((r) => r.value === s.age_range)) {
    errors.age_range = "Selecciona un rango";
  }
  if (!GENDERS.some((g) => g.value === s.gender)) {
    errors.gender = "Selecciona una opción";
  }
  if (!EDUCATION_LEVELS.some((e) => e.value === s.education_level)) {
    errors.education_level = "Selecciona tu nivel";
  }
  if (!EMPLOYMENT_STATUSES.some((e) => e.value === s.employment_status)) {
    errors.employment_status = "Selecciona tu situación";
  }
  if (!HOUSEHOLD_COMPOSITIONS.some((h) => h.value === s.household_composition)) {
    errors.household_composition = "Selecciona una opción";
  }
  if (typeof s.prior_financial_app_use !== "boolean") {
    errors.prior_financial_app_use = "Indica sí o no";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Big Five: valida una respuesta puntual.
 *   - P0 y P0b son numéricas (no negativas, no exigen un valor exacto)
 *   - q1-q5 son selección entre opciones definidas en studyCopy
 */
export function validateBigFiveAnswer(questionId, value) {
  const q = BIG_FIVE_QUESTIONS[questionId];
  if (!q) {
    return { valid: false, error: "Pregunta no reconocida" };
  }

  if (q.type === "numeric") {
    if (value === "" || value === null || value === undefined) {
      return { valid: false, error: "Introduce un número" };
    }
    const n = parseFloat(value);
    if (isNaN(n) || !Number.isFinite(n)) {
      return { valid: false, error: "Introduce un número válido" };
    }
    if (n < 0) {
      return { valid: false, error: "No puede ser negativo" };
    }
    return { valid: true, error: null };
  }

  // type "single": value debe coincidir con una opción definida.
  if (value === null || value === undefined || value === "") {
    return { valid: false, error: "Selecciona una opción" };
  }
  if (!q.options.some((opt) => opt.value === value)) {
    return { valid: false, error: "Opción no válida" };
  }
  return { valid: true, error: null };
}

/**
 * SUS: 10 ítems Likert 1-5 enteros.
 */
export function validateSusResponses(arr) {
  if (!Array.isArray(arr) || arr.length !== 10) {
    return { valid: false, error: "Debes responder los 10 ítems" };
  }
  if (arr.some((v) => !Number.isInteger(v) || v < 1 || v > 5)) {
    return { valid: false, error: "Valores fuera de rango (1-5)" };
  }
  return { valid: true, error: null };
}

/**
 * Ad-hoc: 4 ítems Likert 1-5 enteros.
 */
export function validateAdHocResponses(arr) {
  if (!Array.isArray(arr) || arr.length !== 4) {
    return { valid: false, error: "Debes responder los 4 ítems" };
  }
  if (arr.some((v) => !Number.isInteger(v) || v < 1 || v > 5)) {
    return { valid: false, error: "Valores fuera de rango (1-5)" };
  }
  return { valid: true, error: null };
}

/**
 * Cualitativo: ambos campos opcionales, longitud máxima 500.
 */
export function validateQualitative(positive, improvement) {
  const max = QUALITATIVE.questions[0].maxLength;
  if (typeof positive === "string" && positive.length > max) {
    return { valid: false, error: `Máximo ${max} caracteres` };
  }
  if (typeof improvement === "string" && improvement.length > max) {
    return { valid: false, error: `Máximo ${max} caracteres` };
  }
  return { valid: true, error: null };
}

/**
 * Helper para derivar el booleano "correcto" en una respuesta single de Big Five.
 * Devuelve false si la pregunta es numérica o no existe.
 */
export function isBigFiveAnswerCorrect(questionId, value) {
  const q = BIG_FIVE_QUESTIONS[questionId];
  if (!q || q.type !== "single") return false;
  const opt = q.options.find((o) => o.value === value);
  return Boolean(opt?.correct);
}

/**
 * Helper para derivar el booleano "correcto" en una respuesta numérica.
 * Comparación exacta contra correctValue (el dossier permite entero o decimal,
 * pero las respuestas son 200 y 102 — se admite tolerancia de 0.01).
 */
export function isBigFiveNumericCorrect(questionId, value) {
  const q = BIG_FIVE_QUESTIONS[questionId];
  if (!q || q.type !== "numeric") return false;
  const n = parseFloat(value);
  if (isNaN(n) || !Number.isFinite(n)) return false;
  return Math.abs(n - q.correctValue) < 0.01;
}
