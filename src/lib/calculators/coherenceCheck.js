import { CATEGORIES_CATALOG } from '../models/categories';
import { calculateTargets } from './profileCalculator';

// ─── Conjuntos de categorías por bloque ────────────────────────────────────
const NEEDS_IDS   = CATEGORIES_CATALOG.filter(c => c.block === 'needs').map(c => c.id);
const SAVINGS_IDS = CATEGORIES_CATALOG.filter(c => c.block === 'savings').map(c => c.id);

// Categorías con target escalado por ingreso (necesidades + algunos savings).
// Para estas, el ingreso implícito se resuelve por mini-binaria sobre income.
// El resto de savings (short_term, long_term, investment, debt_extra) tienen
// target constante en %, así que se calculan directamente.
const SCALED_CAT_IDS = new Set(
  CATEGORIES_CATALOG
    .filter(c => (c.block === 'needs' || c.block === 'savings') && c.scaling != null)
    .map(c => c.id)
);

// Tope físico de cada categoría — sirve para detectar amounts físicamente
// imposibles (mayores que factibleMax × income para cualquier income razonable).
const FACTIBLE_MAX_MAP = Object.fromEntries(
  CATEGORIES_CATALOG.map(c => [c.id, c.factibleMax])
);

// ─── Reglas de inconsistencia perfil↔spec ──────────────────────────────────
// DRY: extraídas de inverseCalculator.js (las 4 reglas con pct dinámico).
// La regla de debt_extra se queda en inverseCalculator porque es binaria
// (no usa pct ni necesita la mediana — el simple hecho de tener debt_extra > 0
// sin deuda en el perfil ya dispara el warning).
export const PROFILE_INCONSISTENCY_RULES = [
  {
    catId: 'housing',
    condition: (profile) => profile.housingStatus === 'owned' || profile.housingStatus === 'family',
    message: 'Has indicado que tu vivienda está pagada o cedida, lo que implica solo gastos de mantenimiento. Si planeas pagar alquiler o hipoteca, actualiza tu perfil para que el cálculo sea preciso.',
    suggestion: 'Revisa tu situación de vivienda en el perfil o reduce el importe.',
  },
  {
    catId: 'transport',
    condition: (profile) => profile.vehicleStatus === 'none',
    message: 'Has indicado que no tienes vehículo. El transporte público en España raramente supera este importe. Si planeas adquirir un vehículo, actualiza tu perfil.',
    suggestion: 'Revisa si tienes o planeas tener vehículo, o reduce el importe.',
  },
  {
    catId: 'education',
    condition: (profile) => {
      const hasPartner = profile.hasPartner ?? false;
      const adultDependents = hasPartner ? 1 : 0;
      const totalChildren = Math.max(0, (profile.dependents ?? 0) - adultDependents);
      return totalChildren === 0 && (profile.ownEducation === 'none' || !profile.ownEducation);
    },
    message: 'Has indicado que no estás en formación ni tienes hijos o dependientes a cargo. Si planeas formarte o tienes dependientes, actualiza tu perfil.',
    suggestion: 'Revisa si tienes hijos o estás en formación, o reduce el importe.',
  },
  {
    catId: 'health',
    condition: (profile) => profile.privateHealthInsurance === 'none' || !profile.privateHealthInsurance,
    message: 'Has indicado que no tienes seguro médico privado. Copagos, farmacia y dental raramente superan este importe con solo la sanidad pública. Si planeas contratar un seguro, actualiza tu perfil.',
    suggestion: 'Revisa si tienes o planeas tener seguro privado, o reduce el importe.',
  },
];

// Mapa rápido por catId para acceso O(1)
const PROFILE_INCONSISTENCY_RULE_MAP = Object.fromEntries(
  PROFILE_INCONSISTENCY_RULES.map(r => [r.catId, r])
);

// Constantes de la mini-binaria
const IMPLIED_INCOME_LOW  = 100;
const IMPLIED_INCOME_HIGH = 1_000_000;
const IMPLIED_INCOME_EPS  = 10;
const REFERENCE_INCOME    = 2000;

/**
 * Resuelve el ingreso implícito para un amount fijado en una categoría.
 *
 * Para savings sin scaling (short_term, long_term, investment, debt_extra):
 *   - El target en % es constante, no depende del income.
 *   - I = amount × 100 / target_pct.
 *   - Si target_pct = 0, devolver null (categoría no aplica al perfil).
 *
 * Para categorías con scaling (needs + life_insurance + emergency_fund):
 *   - Mini-binaria sobre income ∈ [100, 1.000.000] con ε = 10€.
 *   - Para cada candidato I, calcular target_pct(I) y expectedAmount = (target/100) × I.
 *   - Si expectedAmount > amount → I es demasiado alto → bajar high.
 *   - Si expectedAmount < amount → I es demasiado bajo → subir low.
 *
 * Caso límite: si el amount es físicamente imposible (mayor que factibleMax × I
 * para cualquier income razonable), devolver Infinity para que se trate como
 * outlier extremo.
 *
 * Devuelve null si la categoría no tiene target individual (wants) o si el
 * target perfil-dependiente es 0 (categoría inaplicable).
 *
 * @param {object} profile
 * @param {string} catId
 * @param {number} amount
 * @returns {number|null}
 */
export function solveImpliedIncome(profile, catId, amount) {
  // Wants no tienen target individual — no aplica
  if (!NEEDS_IDS.includes(catId) && !SAVINGS_IDS.includes(catId)) return null;
  if (amount <= 0) return null;

  // Caso A — savings sin scaling: target constante en %
  if (!SCALED_CAT_IDS.has(catId)) {
    const { targets } = calculateTargets(profile, REFERENCE_INCOME);
    const targetEntry = targets.find(t => t.categoryId === catId);
    const targetPct   = targetEntry?.target ?? 0;
    if (targetPct <= 0) return null;
    return amount * 100 / targetPct;
  }

  // Caso B — categorías con scaling: mini-binaria
  // Primero, comprobar techo físico: si amount > factibleMax × HIGH, es imposible.
  const factibleMax = FACTIBLE_MAX_MAP[catId] ?? Infinity;
  if (factibleMax > 0 && amount > (factibleMax / 100) * IMPLIED_INCOME_HIGH) {
    return Infinity;
  }

  let low  = IMPLIED_INCOME_LOW;
  let high = IMPLIED_INCOME_HIGH;

  // Comprobación previa: si al ingreso máximo el expectedAmount aún es menor
  // que el amount fijado, el amount es desproporcionado → Infinity.
  const { targets: targetsAtHigh } = calculateTargets(profile, IMPLIED_INCOME_HIGH);
  const targetAtHigh = targetsAtHigh.find(t => t.categoryId === catId)?.target ?? 0;
  if (targetAtHigh > 0 && (targetAtHigh / 100) * IMPLIED_INCOME_HIGH < amount) {
    return Infinity;
  }

  while (high - low > IMPLIED_INCOME_EPS) {
    const mid = (low + high) / 2;
    const { targets } = calculateTargets(profile, mid);
    const targetPct   = targets.find(t => t.categoryId === catId)?.target ?? 0;
    const expectedAmount = (targetPct / 100) * mid;

    if (expectedAmount > amount) {
      // El ingreso candidato sostiene un gasto mayor → bajar
      high = mid;
    } else {
      // El ingreso candidato no llega a soportar el gasto → subir
      low = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Calcula ingresos implícitos para todos los amounts fijados de needs + savings.
 * Los wants se ignoran (no tienen target individual).
 *
 * @param {object} profile
 * @param {object} specifiedAmounts
 * @returns {Object<string, number|null>}
 */
export function computeImpliedIncomes(profile, specifiedAmounts) {
  const result = {};
  for (const [catId, amount] of Object.entries(specifiedAmounts)) {
    if (!NEEDS_IDS.includes(catId) && !SAVINGS_IDS.includes(catId)) continue;
    result[catId] = solveImpliedIncome(profile, catId, amount);
  }
  return result;
}

/**
 * Calcula la mediana de un array de números (ignora null/NaN/Infinity).
 */
function median(values) {
  const filtered = values
    .filter(v => v != null && Number.isFinite(v))
    .sort((a, b) => a - b);
  if (filtered.length === 0) return null;
  const mid = Math.floor(filtered.length / 2);
  return filtered.length % 2 === 0
    ? (filtered[mid - 1] + filtered[mid]) / 2
    : filtered[mid];
}

/**
 * Detecta outliers cruzando:
 *   1. Dispersión estadística respecto a la mediana de ingresos implícitos.
 *      Outlier estadístico: ratio = impliedIncome / medianImplied > outlierFactor.
 *   2. Reglas de inconsistencia perfil↔spec (PROFILE_INCONSISTENCY_RULES).
 *
 * Un amount se considera outlier si:
 *   - ratio > outlierFactor (outlier estadístico), O
 *   - hasProfileInconsistency && amount > target_at_reference × 2
 *     (inconsistencia clara con amount no trivial).
 *
 * Solo los outliers con AMBAS señales (estadística + inconsistencia perfil)
 * son "fuertes" y se devuelven con hasProfileInconsistency = true. Estos son
 * los que requieren confirmación del usuario.
 *
 * Si hay < 2 ingresos implícitos válidos, no hay mediana → no se aplica la
 * regla estadística; solo se evalúa la regla de inconsistencia perfil.
 *
 * @param {object} profile
 * @param {object} specifiedAmounts
 * @param {{ outlierFactor?: number }} options
 * @returns {Array<{
 *   catId: string,
 *   amount: number,
 *   impliedIncome: number,
 *   medianImplied: number|null,
 *   ratio: number,
 *   hasProfileInconsistency: boolean,
 *   inconsistencyMessage?: string,
 *   inconsistencySuggestion?: string,
 * }>}
 */
// outlierFactor alto (15×) porque categorías con scaling agresivo (e.g. education
// con exponent 0.5) tienen impliedIncome que crece cuadráticamente respecto al
// amount. Un factor 3 disparaba a amounts perfectamente razonables (education=100€
// sin hijos → ratio 5.2 → falso positivo). Con 15× solo dispara para amounts
// claramente desproporcionados independientemente del scaling.
export function detectOutliers(profile, specifiedAmounts, { outlierFactor = 15 } = {}) {
  const implied = computeImpliedIncomes(profile, specifiedAmounts);
  const impliedValues = Object.values(implied);

  // Mediana solo sobre ingresos válidos (no null, no Infinity)
  const validValues = impliedValues.filter(v => v != null && Number.isFinite(v));
  const medianImplied = validValues.length >= 2 ? median(validValues) : null;

  // Targets BASE al ingreso de referencia — sirven como umbral para la
  // condición "amount no trivial" en la regla de inconsistencia perfil.
  const { targets: baseTargets } = calculateTargets(profile, REFERENCE_INCOME);
  const baseTargetAmountMap = Object.fromEntries(
    baseTargets.map(t => [t.categoryId, (t.target / 100) * REFERENCE_INCOME])
  );

  const outliers = [];

  for (const [catId, amount] of Object.entries(specifiedAmounts)) {
    if (!NEEDS_IDS.includes(catId) && !SAVINGS_IDS.includes(catId)) continue;

    const impliedIncome = implied[catId];
    if (impliedIncome == null) continue; // no aplica al perfil (target = 0)

    // Ratio frente a la mediana (Infinity → ratio = Infinity)
    let ratio;
    if (!Number.isFinite(impliedIncome)) {
      ratio = Infinity;
    } else if (medianImplied != null && medianImplied > 0) {
      ratio = impliedIncome / medianImplied;
    } else {
      ratio = 1; // sin mediana, no aplica regla estadística
    }

    // Regla de inconsistencia perfil↔spec.
    // Multiplicador alto (10×) para evitar falsos positivos en gastos legítimos
    // de baja cuantía: ej. 50€/mes en educación sin formación formal es plausible
    // (suscripciones tipo Duolingo, Udemy, libros), aunque sea 2,5× el target.
    // Solo dispara cuando el amount es CLARAMENTE desproporcionado para el perfil.
    const rule = PROFILE_INCONSISTENCY_RULE_MAP[catId];
    const hasProfileInconsistency = rule ? rule.condition(profile) : false;
    const baseAmount = baseTargetAmountMap[catId] ?? 0;
    const INCONSISTENCY_MULTIPLIER = 10;
    const inconsistencyTriggersOutlier = hasProfileInconsistency && amount > baseAmount * INCONSISTENCY_MULTIPLIER;

    const isStatisticalOutlier = ratio > outlierFactor;
    const isOutlier = isStatisticalOutlier || inconsistencyTriggersOutlier;

    if (!isOutlier) continue;

    outliers.push({
      catId,
      amount,
      impliedIncome,
      medianImplied,
      ratio,
      hasProfileInconsistency,
      ...(hasProfileInconsistency && rule ? {
        inconsistencyMessage:    rule.message,
        inconsistencySuggestion: rule.suggestion,
      } : {}),
    });
  }

  // Orden descendente por ratio (Infinity primero)
  outliers.sort((a, b) => {
    if (a.ratio === Infinity && b.ratio === Infinity) return 0;
    if (a.ratio === Infinity) return -1;
    if (b.ratio === Infinity) return 1;
    return b.ratio - a.ratio;
  });

  return outliers;
}

/**
 * Filtra los outliers que requieren confirmación del usuario:
 * los que tienen AMBAS señales (estadística + inconsistencia perfil).
 *
 * @param {Array} outliers
 * @returns {Array}
 */
export function requiresUserConfirmation(outliers) {
  return outliers.filter(o => o.hasProfileInconsistency);
}
