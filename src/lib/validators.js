/**
 * validators.js — funciones puras de validación de inputs numéricos.
 * Sin efectos secundarios. Compartible entre cliente y servidor.
 */

/**
 * Valida un importe numérico de categoría.
 *
 * @param {string|number} value — valor raw del input
 * @param {{ allowEmpty?: boolean, fieldLabel?: string }} opts
 *   allowEmpty: true  → campo vacío es válido (InverseCalculator: "calcular auto"; DiagnosisForm: "0€")
 *   allowEmpty: false → campo vacío es error (CalculatorPage: ingreso requerido)
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateAmount(value, { allowEmpty = true, fieldLabel = "El importe" } = {}) {
  if (value === "" || value === null || value === undefined) {
    if (allowEmpty) return { valid: true, error: null };
    return { valid: false, error: `${fieldLabel} es obligatorio` };
  }
  const n = parseFloat(value);
  if (isNaN(n))            return { valid: false, error: `${fieldLabel} debe ser un número válido` };
  if (!Number.isFinite(n)) return { valid: false, error: `${fieldLabel} debe ser un número válido` };
  if (n < 0)               return { valid: false, error: `${fieldLabel} no puede ser negativo` };
  return { valid: true, error: null };
}

/**
 * Valida el ingreso mensual o anual.
 */
export function validateIncome(value) {
  if (value === "" || value === null || value === undefined) {
    return { valid: false, error: "Por favor, introduce un ingreso válido" };
  }
  const n = parseFloat(value);
  if (isNaN(n) || !Number.isFinite(n)) return { valid: false, error: "Por favor, introduce un ingreso válido" };
  if (n <= 0) return { valid: false, error: "El ingreso debe ser mayor que 0" };
  return { valid: true, error: null };
}

/**
 * Sanitiza un objeto { catId: value } para los API routes.
 * Elimina entradas negativas, no numéricas, Infinity y tipos inesperados.
 * NO clampea en silencio: las entradas inválidas se descartan y se registran.
 *
 * @param {object} amounts
 * @returns {{ clean: object, invalidFields: string[] }}
 */
export function sanitizeAmounts(amounts) {
  const clean = {};
  const invalidFields = [];
  for (const [id, val] of Object.entries(amounts)) {
    // Guard: solo aceptar string o number
    if (typeof val !== "number" && typeof val !== "string") {
      invalidFields.push(id);
      continue;
    }
    const n = parseFloat(val);
    if (isNaN(n) || !Number.isFinite(n)) { invalidFields.push(id); continue; }
    if (n < 0) { invalidFields.push(id); continue; }
    clean[id] = n;
  }
  return { clean, invalidFields };
}
