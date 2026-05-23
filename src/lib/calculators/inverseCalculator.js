import 'server-only';

import { CATEGORIES_CATALOG } from '../models/categories';
import { calculateTargets } from './profileCalculator';
import { solveDistribution } from './lpSolver';

const NEEDS_IDS   = CATEGORIES_CATALOG.filter(c => c.block === 'needs').map(c => c.id);
const SAVINGS_IDS = CATEGORIES_CATALOG.filter(c => c.block === 'savings').map(c => c.id);
const WANTS_IDS   = CATEGORIES_CATALOG.filter(c => c.block === 'wants').map(c => c.id);

const SOLVER_CATS = CATEGORIES_CATALOG.filter(c => c.block === 'needs' || c.block === 'savings');

// Tope físico de cada categoría — el LP nunca puede asignar más que esto.
// Sirve para acotar el target en sub-check (a) cuando el target escalado lo supera.
const FACTIBLE_MAX_MAP = Object.fromEntries(
  CATEGORIES_CATALOG.map(c => [c.id, c.factibleMax])
);

// Marca las categorías cuyo target sube al bajar el ingreso (bidirectional=true).
// Para esas, sub-check (a) y safety check usan el target RAW (sin clamp), que
// actúa como suelo natural: a ingresos muy bajos el LP no puede asignar al
// nivel exigido y la búsqueda binaria sube el ingreso hasta donde el target
// raw cabe dentro del factibleMax. Para las demás, se usa el clamp habitual.
const BIDIRECTIONAL_MAP = Object.fromEntries(
  CATEGORIES_CATALOG.map(c => [c.id, c.scaling?.bidirectional === true])
);

// ─── Constantes de factibilidad ──────────────────────────────────────────────
const TOLERANCE_MULTIPLIER = 1.4;   // Cond. 2: hasta 40% sobre target base
const MIN_NEED_COVERAGE    = 0.80;  // Cond. 1a: necesidades ≥ 80% target escalado
const MIN_SAVINGS_COVERAGE = 0.70;  // Cond. 1b: ahorro total ≥ 70% targets ahorro
const MIN_WANTS_PCT        = 5;     // Cond. 1c: deseos ≥ 5% del ingreso

/**
 * Ejecuta el LP con un ingreso dado y los importes fijados del usuario.
 * Devuelve también los targets para que el caller no tenga que recalcularlos.
 *
 * @returns {{ lpResult: object, targets: Array }}
 */
function runLP(profile, income, specifiedAmounts) {
  const fixedCategories = {};
  for (const [catId, amount] of Object.entries(specifiedAmounts)) {
    if (NEEDS_IDS.includes(catId) || SAVINGS_IDS.includes(catId)) {
      fixedCategories[catId] = parseFloat(((amount / income) * 100).toFixed(6));
    }
  }

  let wantsFixedPct = 0;
  for (const [catId, amount] of Object.entries(specifiedAmounts)) {
    if (WANTS_IDS.includes(catId)) {
      wantsFixedPct += (amount / income) * 100;
    }
  }

  const { targets, factibleMaxOverrides, insufficientBudget } = calculateTargets(profile, income);

  const lpWeightOverrides = profile.housingPurchaseGoal === true
    ? { long_term_savings: 35 }
    : {};

  const lpResult = solveDistribution(targets, SOLVER_CATS, {
    fixedCategories,
    minWantsPercentage: wantsFixedPct > 0 ? wantsFixedPct : 0,
    lpWeightOverrides,
    factibleMaxOverrides,
  });

  return { lpResult, targets, insufficientBudget };
}

/**
 * Test de factibilidad para un ingreso candidato.
 *
 * Flujo:
 *   1. Condición 2 (filtro rápido sin LP): cada necesidad fijada debe
 *      representar ≤ baseTarget × TOLERANCE_MULTIPLIER del ingreso candidato.
 *      Compara contra target BASE (sin escalar), con margen del 40%.
 *      No aplica a ahorro ni deseos.
 *
 *   2. Si la condición 2 pasa, ejecutar el LP a este ingreso.
 *      Si el LP es infactible → return false.
 *
 *   3. Verificar tres criterios sobre el resultado del LP:
 *      (a) Cada necesidad NO fijada recibe ≥ 80% de su target escalado.
 *      (b) El total de ahorro NO fijado representa ≥ 70% de la suma de
 *          targets de ahorro no fijados.
 *      (c) El total de deseos asignado por el LP es ≥ 3% del ingreso.
 *
 * @param {object} profile          — perfil clonado con fase "completo"
 * @param {number} income           — ingreso candidato
 * @param {object} specifiedAmounts — { [catId]: amountInEuros }
 * @param {object} baseTargetMap    — targets BASE (calculados una vez al ingreso de referencia 2.000€)
 * @returns {boolean}
 */
function isIncomeFeasible(profile, income, specifiedAmounts, baseTargetMap) {
  if (income <= 0) return false;

  // ── Condición 2: filtro rápido sin LP ───────────────────────────────────
  for (const [catId, amount] of Object.entries(specifiedAmounts)) {
    if (!NEEDS_IDS.includes(catId)) continue;
    const catPct = (amount / income) * 100;
    const maxAcceptable = (baseTargetMap[catId] ?? 0) * TOLERANCE_MULTIPLIER;
    if (catPct > maxAcceptable) return false;
  }

  // ── Condición 1: ejecutar el LP y verificar el resultado ────────────────
  const { lpResult, targets } = runLP(profile, income, specifiedAmounts);
  if (!lpResult.feasible) return false;

  const { distribution } = lpResult;
  const targetMap = Object.fromEntries(targets.map(t => [t.categoryId, t.target]));

  // (a) Cada necesidad NO fijada recibe ≥ 80% de su target escalado.
  //     - bidireccionales (alimentación): se compara con el target RAW. A ingresos
  //       bajos el target raw se infla por encima del factibleMax y la sub-check
  //       falla — actúa como suelo natural diferenciado por perfil (más deps =
  //       base alimentación mayor = suelo más alto).
  //     - no bidireccionales: se acota al factibleMax (el LP no puede superar
  //       ese techo físico, así que comparar contra raw sería injustamente estricto).
  for (const catId of NEEDS_IDS) {
    if (catId in specifiedAmounts) continue;
    const target          = targetMap[catId] ?? 0;
    const factibleMax     = FACTIBLE_MAX_MAP[catId] ?? Infinity;
    const isBidirectional = BIDIRECTIONAL_MAP[catId] === true;
    const effectiveTarget = isBidirectional ? target : Math.min(target, factibleMax);
    const assigned        = distribution[catId] ?? 0;
    if (effectiveTarget > 0 && assigned < MIN_NEED_COVERAGE * effectiveTarget) return false;
  }

  // (b) Total de ahorro NO fijado ≥ 70% de la suma de targets de ahorro no fijados
  let sumSavingsTarget   = 0;
  let sumSavingsAssigned = 0;
  for (const catId of SAVINGS_IDS) {
    if (catId in specifiedAmounts) continue;
    sumSavingsTarget   += targetMap[catId] ?? 0;
    sumSavingsAssigned += distribution[catId] ?? 0;
  }
  if (sumSavingsTarget > 0 && sumSavingsAssigned < MIN_SAVINGS_COVERAGE * sumSavingsTarget) {
    return false;
  }

  // (c) Total de deseos asignado ≥ 3% del ingreso
  if ((distribution.wants ?? 0) < MIN_WANTS_PCT) return false;

  return true;
}

/**
 * Calcula el ingreso mínimo necesario para una distribución financieramente
 * saludable a largo plazo, dado un conjunto de importes fijos del usuario.
 *
 * Estrategia:
 *   1. Clonar el perfil forzando fase "completo" del fondo de emergencia
 *   2. Calcular los targets BASE (al ingreso de referencia 2.000€) una sola vez
 *   3. Búsqueda binaria sobre [0, 50.000.000] con ε = 1€ usando isIncomeFeasible
 *      (condición 2 como filtro + LP con verificación post — ~25 iteraciones)
 *   4. LP final con el ingreso convergido
 *   5. Safety check: necesidades no fijadas ≥ 95% de su target; si no, +100€
 *      y reintentar (máx 5 reintentos)
 *   6. Si el perfil tiene monthlyDebtPayment > 0, sumarlo al ingreso final
 *
 * @param {object} profile
 * @param {object} specifiedAmounts — { [categoryId]: amountInEuros } (sólo > 0)
 * @returns {{
 *   feasible: boolean,
 *   requiredIncome?: number,
 *   monthlyDebtPayment?: number,
 *   healthyDistribution?: object,
 *   specifiedAmounts: object,
 *   comparison?: object,
 *   warnings?: string[],
 *   error?: string,
 * }}
 */
export function calculateInverse(profile, specifiedAmounts = {}) {
  // 1. Clonar perfil forzando fase "completo" del fondo de emergencia
  const profileForInverse = { ...profile, emergencyFundStatus: 'complete' };

  // 2. Targets BASE (sin escalado) al ingreso de referencia (2.000€).
  //    Se calculan UNA SOLA VEZ — no dependen del ingreso candidato.
  //    Los usa la condición 2 de isIncomeFeasible.
  const { targets: baseTargets } = calculateTargets(profileForInverse, 2000);
  const baseTargetMap = Object.fromEntries(baseTargets.map(t => [t.categoryId, t.target]));

  // 3. Búsqueda binaria [0, 50M] con ε = 1€
  const HI_BOUND = 50_000_000;
  const EPS      = 1;

  // Guard: si el tope superior no es factible, los importes son irrazonables
  if (!isIncomeFeasible(profileForInverse, HI_BOUND, specifiedAmounts, baseTargetMap)) {
    return {
      feasible: false,
      specifiedAmounts,
      error: 'Los importes especificados requieren un ingreso extraordinariamente alto. Revisa los valores introducidos.',
    };
  }

  let low  = 0;
  let high = HI_BOUND;
  while (high - low > EPS) {
    const mid = (low + high) / 2;
    if (isIncomeFeasible(profileForInverse, mid, specifiedAmounts, baseTargetMap)) {
      high = mid;
    } else {
      low = mid;
    }
  }

  let incomeForDistribution = Math.ceil(high);

  // 4. LP final con el ingreso convergido
  let { lpResult, targets, insufficientBudget } = runLP(profileForInverse, incomeForDistribution, specifiedAmounts);

  // 5. Safety check: necesidades no fijadas deben recibir ≥ 95% de su target
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    if (!lpResult.feasible) {
      incomeForDistribution += 100;
      ({ lpResult, targets, insufficientBudget } = runLP(profileForInverse, incomeForDistribution, specifiedAmounts));
      retries++;
      continue;
    }

    const targetMap = Object.fromEntries(targets.map(t => [t.categoryId, t.target]));

    let allOk = true;
    for (const catId of NEEDS_IDS) {
      if (catId in specifiedAmounts) continue;
      const target          = targetMap[catId] ?? 0;
      const factibleMax     = FACTIBLE_MAX_MAP[catId] ?? Infinity;
      const isBidirectional = BIDIRECTIONAL_MAP[catId] === true;
      const effectiveTarget = isBidirectional ? target : Math.min(target, factibleMax);
      const assigned        = lpResult.distribution[catId] ?? 0;
      if (effectiveTarget > 0 && assigned < 0.95 * effectiveTarget) {
        allOk = false;
        break;
      }
    }
    if (allOk) break;

    incomeForDistribution += 100;
    ({ lpResult, targets, insufficientBudget } = runLP(profileForInverse, incomeForDistribution, specifiedAmounts));
    retries++;
  }

  if (!lpResult.feasible) {
    return { feasible: false, specifiedAmounts, error: 'Error interno al calcular la distribución final' };
  }

  const { distribution } = lpResult;

  // 5. Construir distribución saludable completa con importes
  const wantsCats   = CATEGORIES_CATALOG.filter(c => c.block === 'wants');
  const totalWeight = wantsCats.reduce((s, c) => s + (c.ineWeight ?? 0), 0);
  const totalWantsPct = distribution.wants ?? 0;

  // Pre-calcular referencia INE para cada deseo (bloque completo, sin tener en cuenta
  // qué fijó el usuario). Se usa en la comparativa para mostrar la desviación
  // informativa respecto a la media española — no como objetivo a alcanzar.
  const wantsIneReference = {};
  for (const cat of wantsCats) {
    const pct = totalWeight > 0 ? (cat.ineWeight / totalWeight) * totalWantsPct : 0;
    wantsIneReference[cat.id] = {
      amount:     parseFloat(((pct / 100) * incomeForDistribution).toFixed(2)),
      percentage: parseFloat(pct.toFixed(2)),
    };
  }

  // Pre-calcular porcentaje total de deseos especificados por el usuario
  const specifiedWantsPct = Object.entries(specifiedAmounts)
    .filter(([id]) => WANTS_IDS.includes(id))
    .reduce((s, [, amt]) => s + (amt / incomeForDistribution) * 100, 0);

  // Remanente del bloque wants para distribuir entre deseos no especificados
  const remainingWantsPct = Math.max(0, totalWantsPct - specifiedWantsPct);

  // Pesos INE solo de los deseos no especificados (para repartir el remanente)
  const unspecifiedWantsCats = wantsCats.filter(c => !(c.id in specifiedAmounts));
  const unspecifiedWeight    = unspecifiedWantsCats.reduce((s, c) => s + (c.ineWeight ?? 0), 0);

  const healthyDistribution = {};
  for (const cat of CATEGORIES_CATALOG) {
    let pct;
    if (cat.block === 'wants') {
      if (cat.id in specifiedAmounts) {
        // Usar el importe real que el usuario fijó
        pct = (specifiedAmounts[cat.id] / incomeForDistribution) * 100;
      } else {
        // Distribuir el remanente del bloque proportionalmente por peso INE
        pct = unspecifiedWeight > 0
          ? (cat.ineWeight / unspecifiedWeight) * remainingWantsPct
          : 0;
      }
    } else {
      pct = distribution[cat.id] ?? 0;
    }
    healthyDistribution[cat.id] = {
      percentage: parseFloat(pct.toFixed(2)),
      amount:     parseFloat(((pct / 100) * incomeForDistribution).toFixed(2)),
    };
  }

  // 6. Comparación: especificado vs. referencia INE (deseos) o distribución saludable (resto)
  // Para deseos: healthyAmount = referencia INE (informativa, no prescriptiva)
  // Para necesidades y ahorros: healthyAmount = lo que el LP asignó
  const comparison = {};
  for (const [catId, specifiedAmount] of Object.entries(specifiedAmounts)) {
    let healthyAmount, healthyPct;
    if (WANTS_IDS.includes(catId)) {
      // Referencia INE — muestra desviación respecto a la media española
      healthyAmount = wantsIneReference[catId]?.amount     ?? 0;
      healthyPct    = wantsIneReference[catId]?.percentage ?? 0;
    } else {
      const h = healthyDistribution[catId];
      if (!h) continue;
      healthyAmount = h.amount;
      healthyPct    = h.percentage;
    }
    comparison[catId] = {
      specifiedAmount: parseFloat(specifiedAmount.toFixed(2)),
      healthyAmount:   parseFloat(healthyAmount.toFixed(2)),
      healthyPct:      parseFloat(healthyPct.toFixed(2)),
      diff:            parseFloat((specifiedAmount - healthyAmount).toFixed(2)),
    };
  }

  // 7. Advertencias
  const warnings = [];

  for (const [catId, specifiedAmount] of Object.entries(specifiedAmounts)) {
    const cat = CATEGORIES_CATALOG.find(c => c.id === catId);
    if (!cat || !cat.alerts) continue;

    const pct = (specifiedAmount / incomeForDistribution) * 100;
    if (cat.alerts.severe && pct > cat.alerts.severe.threshold) {
      warnings.push(`${cat.label}: ${cat.alerts.severe.message}`);
    } else if (cat.alerts.mild && pct > cat.alerts.mild.threshold) {
      warnings.push(`${cat.label}: ${cat.alerts.mild.message}`);
    }
  }

  if (specifiedWantsPct > 38) {
    warnings.push('Tus gastos discrecionales comprimen el espacio para necesidades y ahorro');
  } else if (specifiedWantsPct > 30) {
    warnings.push('Tus gastos discrecionales superan el límite recomendado del 30%');
  }

  if (Object.keys(specifiedAmounts).length === 0) {
    warnings.push('No has especificado ningún importe. El ingreso mostrado es el mínimo absoluto para una distribución financieramente saludable con tu perfil, pero no representa una situación ideal ni sostenible a largo plazo. Para obtener una recomendación más útil, introduce los importes que deseas destinar a las categorías que te interesen.');
  }

  // 8. Sumar la cuota de deuda al ingreso final
  const monthlyDebt    = profile.monthlyDebtPayment ?? 0;
  const requiredIncome = incomeForDistribution + monthlyDebt;

  return {
    feasible: true,
    requiredIncome,
    monthlyDebtPayment: monthlyDebt,
    healthyDistribution,
    specifiedAmounts,
    comparison,
    warnings,
    insufficientBudget: insufficientBudget === true,
  };
}
