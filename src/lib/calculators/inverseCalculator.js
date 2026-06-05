import 'server-only';

import { CATEGORIES_CATALOG } from '../models/categories';
import { calculateTargets } from './profileCalculator';
import { solveDistribution } from './lpSolver';
import {
  detectOutliers,
  requiresUserConfirmation,
  PROFILE_INCONSISTENCY_RULES,
} from './coherenceCheck';

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
// Cond. 2: cada necesidad fijada debe representar ≤ factibleMax de la categoría
// (techo físico del modelo; FACTIBLE_MAX_MAP, definido arriba).
const MIN_NEED_COVERAGE    = 0.80;  // Cond. 1a: necesidades ≥ 80% target escalado
const MIN_SAVINGS_COVERAGE = 0.70;  // Cond. 1b: ahorro total ≥ 70% targets ahorro

// Target blando del bloque deseos: suma de ineReference de las 8 categorías wants
// (datos INE). Reemplaza el suelo rígido del 10% en el flujo inverso. La cobertura
// se mide sobre el RESIDUO (target − lo que el usuario ya fijó en wants), de modo
// que si el usuario ya cubre buena parte del bloque, el LP no necesita inflar más.
const WANTS_BLOCK_TARGET_INE = 22;  // Σ ineReference de las 8 categorías wants
const MIN_WANTS_COVERAGE     = 0.60; // cobertura mínima del target residual; calibrable

// ─── Constantes de la búsqueda del ingreso mínimo ────────────────────────────
// El predicado isIncomeFeasible NO es monótono sobre todo el rango de ingreso:
// es infactible con ingresos bajos (los importes fijados pesan un % demasiado
// alto), factible en una franja media, e infactible de nuevo con ingresos
// altísimos (los fijados tienden a ~0% y las categorías libres + el techo de
// wants no alcanzan el 100% que exige el solver, que impone budget = 100). Por
// eso no se puede aplicar una binaria sobre todo el dominio: primero hay que
// localizar la franja factible (galopante) y luego afinar el mínimo en ella
// (binaria, segura porque dentro de la franja el predicado sí es monótono).
const EPS                   = 1;          // Precisión en € (1€ ⇒ céntimos)
const MAX_INCOME            = 1_000_000;  // Tope absoluto de la galopante
const MAX_GALLOP_ITERATIONS = 40;         // Salvaguarda de iteraciones
const GALLOP_FACTOR         = 1.5;        // Doblado moderado: reduce el riesgo
                                          // de saltarse una franja estrecha (×2
                                          // tiene más punto ciego que ×1.5)

// Techo colectivo de deseos (wants_ub) que impone el solver. Debe coincidir con
// lpSolver.js, porque el pre-check estructural replica esa restricción sin
// llamar al solver.
const WANTS_CAP_PCT = 80;

// Pre-check estructural (puramente aritmético, sin llamar al solver).
// El solver exige budget = 100: las categorías deben sumar EXACTAMENTE el 100%
// del ingreso. El máximo % que el presupuesto puede alcanzar es la suma de los
// techos (factibleMax) de needs + savings, más los wants topados al WANTS_CAP_PCT
// colectivo. Si ese máximo absoluto no llega al 100%, es imposible cuadrar el
// presupuesto para CUALQUIER ingreso (importes estructuralmente indistribuibles).
//
// Se usa el factibleMax estático del catálogo como techo: factibleMaxOverrides
// solo puede REBAJAR un techo, nunca elevarlo, así que el estático es la cota
// más permisiva — la correcta para un test de imposibilidad (sin falsos negativos).
function isStructurallyDistributable() {
  // Techo acumulado de needs + savings (los wants no tienen factibleMax
  // individual: aportan como mucho el WANTS_CAP_PCT colectivo).
  let nonWantsCap = 0;
  for (const cat of CATEGORIES_CATALOG) {
    if (cat.block !== 'wants') {
      nonWantsCap += cat.factibleMax ?? 0;
    }
  }

  const maxBudgetPct = nonWantsCap + WANTS_CAP_PCT;
  return maxBudgetPct >= 100;
}

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

  const { targets, factibleMaxOverrides, insufficientBudget, explanation } =
    calculateTargets(profile, income);

  const lpWeightOverrides = profile.housingPurchaseGoal === true
    ? { long_term_savings: 35 }
    : {};

  const lpResult = solveDistribution(targets, SOLVER_CATS, {
    fixedCategories,
    minWantsPercentage: wantsFixedPct > 0 ? wantsFixedPct : 0,
    lpWeightOverrides,
    factibleMaxOverrides,
    // En el inverso no hay suelo rígido del 10%: solo lo que el usuario fije en
    // wants actúa como mínimo. La cobertura del target INE se comprueba aparte
    // en isIncomeFeasible (criterio d).
    wantsFloor: 0,
  });

  return { lpResult, targets, wantsFixedPct, insufficientBudget, explanation };
}

/**
 * Test de factibilidad para un ingreso candidato.
 *
 * Flujo:
 *   1. Condición 2 (filtro rápido sin LP): cada necesidad fijada debe
 *      representar ≤ factibleMax de su categoría sobre el ingreso candidato.
 *      Compara contra el techo físico del modelo (FACTIBLE_MAX_MAP), no contra
 *      el target estadístico de perfil. No aplica a ahorro ni deseos.
 *
 *   2. Si la condición 2 pasa, ejecutar el LP a este ingreso.
 *      Si el LP es infactible → return false.
 *
 *   3. Verificar tres criterios sobre el resultado del LP:
 *      (a) Cada necesidad NO fijada recibe ≥ 80% de su target escalado.
 *      (b) El total de ahorro NO fijado representa ≥ 70% de la suma de
 *          targets de ahorro no fijados.
 *      (d) El bloque deseos cubre ≥ 60% del target INE residual (target del
 *          bloque − lo ya fijado en wants por el usuario). Sustituye al antiguo
 *          suelo rígido del 10%, que inflaba el ingreso cuando los wants fijados
 *          sumaban poco.
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
    const maxAcceptable = FACTIBLE_MAX_MAP[catId] ?? Infinity;
    if (catPct > maxAcceptable) return false;
  }

  // ── Condición 1: ejecutar el LP y verificar el resultado ────────────────
  const { lpResult, targets, wantsFixedPct } = runLP(profile, income, specifiedAmounts);
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

  // (d) El bloque deseos alcanza suficiente cobertura del target INE ajustado.
  //     Se trabaja sobre el residuo (target − fijado por el usuario) para no
  //     penalizar a quien ya cubre parte del bloque con sus importes fijados.
  const wantsResidualTarget = Math.max(0, WANTS_BLOCK_TARGET_INE - (wantsFixedPct || 0));
  const wantsResidualActual = Math.max(0, (distribution.wants ?? 0) - (wantsFixedPct || 0));
  if (wantsResidualActual < MIN_WANTS_COVERAGE * wantsResidualTarget) return false;

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
 * @param {object} [options]
 * @param {boolean} [options.force=false] — si true, salta la detección de
 *   incoherencias perfil↔spec y ejecuta el cálculo siempre. Pensado para
 *   cuando el usuario confirma desde la pantalla intermedia de coherencia.
 * @returns {{
 *   feasible: boolean,
 *   requiredIncome?: number,
 *   monthlyDebtPayment?: number,
 *   healthyDistribution?: object,
 *   specifiedAmounts: object,
 *   comparison?: object,
 *   warnings?: string[],
 *   error?: string,
 *   requiresConfirmation?: boolean,
 *   outliers?: Array,
 * }}
 */
export function calculateInverse(profile, specifiedAmounts = {}, options = {}) {
  const { force = false } = options;

  // 1. Clonar perfil forzando fase "completo" del fondo de emergencia
  const profileForInverse = { ...profile, emergencyFundStatus: 'complete' };

  // 2. Targets BASE (sin escalado) al ingreso de referencia (2.000€).
  //    Se calculan UNA SOLA VEZ — no dependen del ingreso candidato.
  //    Los usa la condición 2 de isIncomeFeasible.
  const { targets: baseTargets } = calculateTargets(profileForInverse, 2000);
  const baseTargetMap = Object.fromEntries(baseTargets.map(t => [t.categoryId, t.target]));

  // 2.bis Detección de incoherencias perfil↔spec (no bloqueante).
  //       Si se detectan outliers con AMBAS señales (estadística + inconsistencia
  //       de perfil), se devuelve un response especial para que el frontend
  //       muestre la pantalla intermedia de coherencia. El usuario puede
  //       revisar perfil/importes o forzar el cálculo con force = true.
  if (!force) {
    const outliers = detectOutliers(profileForInverse, specifiedAmounts);
    const blocking = requiresUserConfirmation(outliers);
    if (blocking.length > 0) {
      return {
        feasible: false,
        requiresConfirmation: true,
        outliers: blocking,
        specifiedAmounts,
      };
    }
  }

  // 3. Búsqueda del ingreso mínimo factible (3 piezas que se complementan).
  //
  // 3.a Pre-check estructural — sin tocar el solver.
  //     Si el presupuesto no puede sumar el 100% ni en su mejor caso, no existe
  //     ningún ingreso que resuelva el problema. Mensaje honesto: es una
  //     imposibilidad real, no el falso "ingreso extraordinariamente alto"
  //     que devolvía el guard a 50M (con un ingreso enorme los importes fijados
  //     valen ~0% y el LP es infactible aunque el caso sea perfectamente normal).
  const STRUCTURAL_ERROR =
    'Estos importes no pueden distribuirse en un presupuesto válido. Revisa los valores.';

  if (!isStructurallyDistributable()) {
    return { feasible: false, specifiedAmounts, error: STRUCTURAL_ERROR };
  }

  // 3.b Búsqueda galopante — localiza la franja factible.
  //     Suelo natural: la suma de importes fijados (el ingreso no puede ser
  //     menor que lo ya comprometido). Si el suelo ya es factible, la franja
  //     empieza ahí. Si no, se sube doblando (×GALLOP_FACTOR) hasta el primer
  //     ingreso factible, guardando el último infactible como cota izquierda.
  const fixedSum = Object.values(specifiedAmounts).reduce(
    (acc, val) => acc + (val > 0 ? val : 0),
    0
  );
  const floor = Math.max(fixedSum, EPS);

  let lastInfeasible = null; // mayor ingreso infactible conocido (cota izquierda)
  let firstFeasible  = null; // menor ingreso factible conocido (cota derecha)

  if (isIncomeFeasible(profileForInverse, floor, specifiedAmounts, baseTargetMap)) {
    firstFeasible = floor; // el mínimo no puede estar por debajo del suelo
  } else {
    lastInfeasible = floor;
    let income     = floor;
    let iterations = 0;

    while (iterations < MAX_GALLOP_ITERATIONS && income < MAX_INCOME) {
      income = Math.min(income * GALLOP_FACTOR, MAX_INCOME);
      if (isIncomeFeasible(profileForInverse, income, specifiedAmounts, baseTargetMap)) {
        firstFeasible = income;
        break;
      }
      lastInfeasible = income;
      iterations++;
    }
  }

  // La galopante agotó el tope sin hallar franja factible. El pre-check pasó,
  // así que es un caso patológico de franja inalcanzable: infactible honesto.
  if (firstFeasible === null) {
    return { feasible: false, specifiedAmounts, error: STRUCTURAL_ERROR };
  }

  // 3.c Búsqueda binaria — afina el mínimo dentro de la franja acotada.
  //     Entre lastInfeasible y firstFeasible el predicado es monótono, así que
  //     la binaria localiza con seguridad el borde izquierdo (ingreso mínimo).
  let low  = lastInfeasible ?? floor; // si el suelo era factible, low = floor
  let high = firstFeasible;
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
  let { lpResult, targets, insufficientBudget, explanation } =
    runLP(profileForInverse, incomeForDistribution, specifiedAmounts);

  // 5. Safety check: necesidades no fijadas deben recibir ≥ 95% de su target
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    if (!lpResult.feasible) {
      incomeForDistribution += 100;
      ({ lpResult, targets, insufficientBudget, explanation } =
        runLP(profileForInverse, incomeForDistribution, specifiedAmounts));
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
    ({ lpResult, targets, insufficientBudget, explanation } =
      runLP(profileForInverse, incomeForDistribution, specifiedAmounts));
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

  // 6. Comparación: Especificado vs Target recomendado (motor) vs Ref. INE (INE).
  // - Target: profile target × ingreso calculado. Disponible para todas las categorías.
  //   diff = Especificado − Target (referencia de acción).
  // - Ref. INE: solo needs + wants (ineReference != null). null para savings → UI muestra "—".
  // - Savings reincluidas: tienen Target pero no Ref. INE.
  const targetPctMap = Object.fromEntries(targets.map(t => [t.categoryId, t.target]));

  const comparison = {};
  for (const [catId, specifiedAmount] of Object.entries(specifiedAmounts)) {
    // — Ref. INE (puede ser null para savings) —
    let healthyAmount = null;
    let healthyPct    = null;
    if (WANTS_IDS.includes(catId)) {
      healthyAmount = wantsIneReference[catId]?.amount     ?? null;
      healthyPct    = wantsIneReference[catId]?.percentage ?? null;
    } else {
      const cat = CATEGORIES_CATALOG.find(c => c.id === catId);
      if (cat?.ineReference != null) {
        healthyPct    = cat.ineReference;
        healthyAmount = parseFloat(((cat.ineReference / 100) * incomeForDistribution).toFixed(2));
      }
      // savings: healthyAmount y healthyPct quedan null — se muestra "—" en UI
    }

    // — Target recomendado —
    // wants: no tienen target de perfil — su distribución es la referencia INE proporcional,
    //        así que no hay una recomendación independiente. Target = null → UI muestra "—".
    //        diff vuelve a ser Especificado − INE (healthyAmount) para wants.
    // needs/savings: target del profileCalculator × ingreso calculado.
    let targetPct    = null;
    let targetAmount = null;
    if (!WANTS_IDS.includes(catId)) {
      targetPct    = targetPctMap[catId] ?? 0;
      targetAmount = parseFloat(((targetPct / 100) * incomeForDistribution).toFixed(2));
    }

    // diff: Especificado − Target para needs/savings; Especificado − INE para wants
    const diffBase = targetAmount !== null ? targetAmount : (healthyAmount ?? specifiedAmount);
    const diff     = parseFloat((specifiedAmount - diffBase).toFixed(2));

    comparison[catId] = {
      specifiedAmount: parseFloat(specifiedAmount.toFixed(2)),
      targetAmount,                                           // null para wants
      targetPct:       targetPct !== null ? parseFloat(targetPct.toFixed(2)) : null,
      healthyAmount,                                          // null para savings
      healthyPct,                                             // null para savings
      diff,
    };
  }

  // 7. Advertencias
  const warnings = [];

  // ── A) Inconsistencias perfil↔spec (warnings de perfil) ──────────────────────
  // Se ejecutan primero. Las categorías que producen un warning de perfil
  // se añaden a suppressCatalogWarningFor para no duplicar mensajes.
  //
  // Refactor: las 4 reglas con umbral dinámico (housing, transport, education,
  // health) se iteran desde PROFILE_INCONSISTENCY_RULES (DRY con la detección
  // pre-binaria). El umbral en % se deriva de baseTargetMap[catId] × 3: si el
  // amount fijado supera tres veces el target base de su perfil, se dispara el
  // warning. La regla de debt_extra se queda hardcodeada porque es binaria.
  const suppressCatalogWarningFor = new Set();

  for (const rule of PROFILE_INCONSISTENCY_RULES) {
    const { catId, condition, message } = rule;
    if (!(catId in specifiedAmounts)) continue;
    if (!condition(profile)) continue;
    const pct = (specifiedAmounts[catId] / incomeForDistribution) * 100;
    const baseTargetPct = baseTargetMap[catId] ?? 0;
    const threshold = baseTargetPct * 3;
    if (pct > threshold) {
      const cat = CATEGORIES_CATALOG.find(c => c.id === catId);
      const label = cat?.label ?? catId;
      warnings.push(`${label}: ${message}`);
      suppressCatalogWarningFor.add(catId);
    }
  }

  // 5. Debt extra — sin deuda con importe > 0 (caso binario)
  if (
    'debt_extra' in specifiedAmounts &&
    specifiedAmounts.debt_extra > 0 &&
    (profile.consumerDebt === 'none' || !profile.consumerDebt)
  ) {
    warnings.push(
      'Amortización extra: has indicado que no tienes deuda de consumo. ' +
      'Si has contraído deuda, actualiza tu perfil. ' +
      'Si quieres reservar este importe para otro fin, considera usar Ahorro a corto plazo o Inversión.'
    );
    suppressCatalogWarningFor.add('debt_extra');
  }

  // ── B) Warnings del catálogo (umbrales de alerts) — respetan supresión ────────
  for (const [catId, specifiedAmount] of Object.entries(specifiedAmounts)) {
    if (suppressCatalogWarningFor.has(catId)) continue;
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
    // Drivers cualitativos del LP final (mismo contrato que las otras dos APIs).
    explanation,
  };
}
