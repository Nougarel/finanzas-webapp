import 'server-only';

/**
 * Motor de distribución financiera basado en perfil de usuario.
 *
 * Orquesta el cálculo completo:
 *   1. Targets de necesidades y ahorro desde profileCalculator
 *   2. Solución LP para asignar porcentajes óptimos (lpSolver)
 *   3. Distribución del bloque de deseos con pesos INE normalizados
 *   4. Construcción del objeto de categorías con importes
 *   5. Identificación del modelo financiero más cercano
 *   6. Evaluación de alertas por categoría y bloque
 *   7. Indicadores transversales (DTI, seguros)
 *
 * Garantiza que totalCheck = 100% (restricción presupuestaria del LP).
 */

import { calculateTargets } from './profileCalculator';
import { solveDistribution } from './lpSolver';
import { CATEGORIES_CATALOG } from '../models/categories';

// ─── Modelos de referencia para comparación informativa ──────────────────────

const REFERENCE_MODELS = [
  { id: '50_30_20', label: 'Regla 50/30/20', needs: 50, wants: 30, savings: 20 },
  { id: '60_20_20', label: 'Regla 60/20/20', needs: 60, wants: 20, savings: 20 },
  { id: '70_20_10', label: 'Regla 70/20/10', needs: 70, wants: 10, savings: 20 },
  { id: '80_20',    label: 'Regla 80/20',    needs: 80, wants: 0,  savings: 20 },
];

// ─── Funciones privadas ───────────────────────────────────────────────────────

function findClosestModel(needsPct, wantsPct, savingsPct) {
  let closest = REFERENCE_MODELS[0];
  let minDist = Infinity;
  for (const model of REFERENCE_MODELS) {
    const dist = Math.sqrt(
      Math.pow(needsPct   - model.needs,   2) +
      Math.pow(wantsPct   - model.wants,   2) +
      Math.pow(savingsPct - model.savings,  2)
    );
    if (dist < minDist) { minDist = dist; closest = model; }
  }
  return closest;
}

/**
 * Deriva la fase financiera del usuario a partir del perfil.
 * Combina edad y estado del fondo de emergencia.
 */
function derivePhase(profile) {
  if (profile.ageRange === 'under35') return 'early';
  if (profile.ageRange === 'over50')  return 'consolidation';
  return 'accumulation';
}

/**
 * Evalúa alertas usando los umbrales definidos en CATEGORIES_CATALOG.
 * Recibe un mapa plano { categoryId: percentage } para las categorías de necesidades,
 * y los totales de deseos y ahorro.
 */
function evaluateAlerts(needsDistribution, wantsTotal, savingsTotal) {
  const alerts = {};

  const needsCats = CATEGORIES_CATALOG.filter(c => c.block === 'needs' && c.alerts);
  for (const cat of needsCats) {
    const pct = needsDistribution[cat.id] ?? 0;
    if (cat.alerts.severe && pct > cat.alerts.severe.threshold) {
      alerts[cat.id] = { level: 'severe', message: cat.alerts.severe.message };
    } else if (cat.alerts.mild && pct > cat.alerts.mild.threshold) {
      alerts[cat.id] = { level: 'mild', message: cat.alerts.mild.message };
    }
  }

  if (wantsTotal > 38) {
    alerts._wants_block = { level: 'severe', message: 'Tus gastos discrecionales comprometen necesidades y ahorro' };
  } else if (wantsTotal > 30) {
    alerts._wants_block = { level: 'mild',   message: 'Tus gastos discrecionales superan el límite recomendado' };
  }

  if (savingsTotal < 5) {
    alerts._savings_block = { level: 'severe', message: 'Tu tasa de ahorro es críticamente baja' };
  } else if (savingsTotal < 10) {
    alerts._savings_block = { level: 'mild',   message: 'Tu tasa de ahorro está por debajo de lo recomendado' };
  }

  // Ahorro excesivo — penalización moderada: ahorrar mucho es preferible a no ahorrar,
  // pero por encima del 50% puede comprometer calidad de vida o cubrir necesidades básicas.
  if (savingsTotal > 65) {
    alerts._savings_excess_block = { level: 'severe', message: 'Una tasa de ahorro tan elevada puede comprometer cubrir necesidades básicas. Revisa tu distribución.' };
  } else if (savingsTotal > 50) {
    alerts._savings_excess_block = { level: 'mild',   message: 'Estás destinando más de la mitad de tu ingreso al ahorro. Considera si tu calidad de vida actual es la que deseas.' };
  }

  return alerts;
}

function calculateTransversal(needsDist, savingsDist, income, effectiveIncome, monthlyDebt, profile) {
  const incomeRatio = effectiveIncome / income;

  const pct2 = (v) => parseFloat(v.toFixed(2));
  const eur  = (v) => parseFloat(((v / 100) * income).toFixed(2));

  // ── DTI: deuda externa + hipoteca + vehículo (expresado sobre ingreso total) ─
  const externalDebtPct = (monthlyDebt / income) * 100;
  const housingDebtPct  = profile.housingStatus === 'mortgage'
    ? (needsDist.housing ?? 0) * incomeRatio
    : 0;
  const vehicleDebtPct  = (profile.vehicleStatus === 'financed' || profile.vehicleStatus === 'leasing')
    ? (needsDist.transport ?? 0) * 0.45 * incomeRatio
    : 0;
  const totalDtiPct = externalDebtPct + housingDebtPct + vehicleDebtPct;

  // ── Seguros (expresados sobre ingreso total) ──────────────────────────────
  const lifePct = (savingsDist.life_insurance ?? 0) * incomeRatio;

  const healthFractions = { none: 0, basic: 0.70, complete: 0.85 };
  const healthFraction  = healthFractions[profile.privateHealthInsurance] ?? 0;
  const healthPct       = (needsDist.health ?? 0) * incomeRatio * healthFraction;

  const vehicleFractions = { none: 0, owned_paid: 0.20, financed: 0.22, leasing: 0.22 };
  const vehicleFraction  = vehicleFractions[profile.vehicleStatus] ?? 0;
  const transportPct     = (needsDist.transport ?? 0) * incomeRatio * vehicleFraction;

  const totalInsurancePct = lifePct + healthPct + transportPct;

  return {
    dti: {
      total:   pct2(totalDtiPct),
      amount:  eur(totalDtiPct),
      mild:    35,
      severe:  40,
      breakdown: {
        external: { percentage: pct2(externalDebtPct), amount: eur(externalDebtPct) },
        housing:  { percentage: pct2(housingDebtPct),  amount: eur(housingDebtPct)  },
        vehicle:  { percentage: pct2(vehicleDebtPct),  amount: eur(vehicleDebtPct)  },
      },
    },
    insurance: {
      total:  pct2(totalInsurancePct),
      amount: eur(totalInsurancePct),
      breakdown: {
        life:      { percentage: pct2(lifePct),      amount: eur(lifePct)      },
        health:    { percentage: pct2(healthPct),    amount: eur(healthPct)    },
        transport: { percentage: pct2(transportPct), amount: eur(transportPct) },
      },
    },
  };
}

// ─── Score de salud financiera ───────────────────────────────────────────────

const SAVINGS_IDS_SET = new Set(CATEGORIES_CATALOG.filter(c => c.block === 'savings').map(c => c.id));
const NEEDS_IDS_SET   = new Set(CATEGORIES_CATALOG.filter(c => c.block === 'needs').map(c => c.id));

// Dirección de penalización por categoría:
//   'upper_only'      → solo penalizar si el gasto está POR ENCIMA del target (coste fijo — menos es mejor)
//   'lower_only'      → solo penalizar si el gasto está POR DEBAJO del target (ahorro — más es mejor)
//   'symmetric'       → penalizar en ambas direcciones (resto de necesidades)
//   'block_only'      → sin penalización individual (deseos — solo a nivel de bloque)
//   'floor_sensitive' → penalizar el exceso siempre, y el defecto solo si cae bajo el suelo vital (healthyRange.min)
const SCORING_DIRECTION = {
  // Needs — coste fijo: penalizar solo el exceso
  housing:   'upper_only',
  transport: 'upper_only',
  // Needs — necesidad vital con suelo: penalizar shortfall bajo mínimo Y exceso pronunciado
  groceries: 'floor_sensitive',
  health:    'floor_sensitive',
  // Needs — coste operativo / formación: penalizar solo el exceso (gastar menos es neutro o positivo)
  utilities:  'upper_only',
  education:  'upper_only',
  // Savings — penalizar solo el shortfall
  life_insurance:      'lower_only',
  emergency_fund:      'lower_only',
  short_term_savings:  'lower_only',
  long_term_savings:   'lower_only',
  investment:          'lower_only',
  debt_extra:          'lower_only',
  // Wants — sin penalización individual (solo bloque)
  dining_out:      'block_only',
  travel:          'block_only',
  clothing:        'block_only',
  personal_care:   'block_only',
  entertainment:   'block_only',
  hobbies:         'block_only',
  subscriptions:   'block_only',
  gifts:           'block_only',
};

// Suelos vitales para categorías 'floor_sensitive': mínimo del healthyRange del catálogo.
// Se usa para decidir si un shortfall debe penalizarse (por debajo del suelo) o no.
const FLOOR_SENSITIVE_MIN = Object.fromEntries(
  CATEGORIES_CATALOG
    .filter(c => SCORING_DIRECTION[c.id] === 'floor_sensitive')
    .map(c => {
      const range = c.healthyRange;
      const minVal = Array.isArray(range) ? range[0] : (range?.min ?? range?.low ?? 0);
      return [c.id, minVal];
    })
);

// Penalización base según magnitud de desviación (puntos porcentuales).
function deviationPenalty(absDev) {
  if (absDev < 1.5)  return 0;
  if (absDev < 5)    return 3;
  if (absDev < 10)   return 6;
  return 10;
}

// Penalizaciones por alertas de bloque.
const BLOCK_PENALTY = {
  _wants_block:          { mild: 5,  severe: 10 },
  _savings_block:        { mild: 5,  severe: 10 },
  _savings_excess_block: { mild: 3,  severe: 7  },
  _budget_block:         { severe: 20 },
  _debt_block:           { severe: 15 },
};

/**
 * Calcula un score 0-100 de salud financiera basado en:
 *   - Desviaciones de las categorías respecto a sus targets personalizados,
 *     aplicando la dirección de penalización definida en SCORING_DIRECTION
 *     (upper_only / lower_only / symmetric / floor_sensitive / block_only).
 *   - Alertas de bloque (_wants_block, _savings_block, _savings_excess_block,
 *     _budget_block, _debt_block).
 *
 * Devuelve también una etiqueta cualitativa y el desglose de penalizaciones
 * para que la UI pueda explicarlo al usuario.
 */
function calculateHealthScore(categoryDiagnosis, alerts) {
  const penalties = [];
  let totalPenalty = 0;

  // Desviaciones por categoría (needs + savings, excluye _wants_total)
  for (const [catId, diag] of Object.entries(categoryDiagnosis)) {
    if (catId.startsWith('_')) continue;
    if (diag.target === null) continue;

    const direction = SCORING_DIRECTION[catId] ?? 'symmetric';

    // Deseos: sin penalización individual, solo a nivel de bloque.
    if (direction === 'block_only') continue;

    const deviation = diag.deviation;

    // Coste fijo: solo penalizar si excede el target (gastar menos es bueno).
    if (direction === 'upper_only' && deviation <= 0) continue;

    // Ahorro: solo penalizar si queda por debajo del target (ahorrar más es bueno).
    if (direction === 'lower_only' && deviation >= 0) continue;

    // Necesidad vital con suelo: penalizar exceso siempre; defecto solo si cae bajo el suelo.
    if (direction === 'floor_sensitive' && deviation < 0) {
      const floor = FLOOR_SENSITIVE_MIN[catId] ?? 0;
      if (diag.assigned >= floor) continue;
    }

    const absDev = Math.abs(deviation);
    const base   = deviationPenalty(absDev);
    if (base === 0) continue;

    // Factor por tipo: needs y savings a peso completo (1.0). El antiguo 0.7 para
    // savings era un compromiso por penalizar también el exceso; con 'lower_only'
    // resuelto, el déficit de ahorro merece el mismo peso que el exceso en needs.
    const factor = 1.0;
    const points = Math.round(base * factor);
    if (points === 0) continue;

    const dirLabel = deviation > 0 ? 'por encima' : 'por debajo';
    penalties.push({
      category: catId,
      points: -points,
      reason: `${absDev.toFixed(1)} pp ${dirLabel} del target`,
    });
    totalPenalty += points;
  }

  // Alertas de bloque
  for (const [key, levels] of Object.entries(BLOCK_PENALTY)) {
    const alert = alerts?.[key];
    if (!alert) continue;
    const pts = levels[alert.level] ?? 0;
    if (pts === 0) continue;
    penalties.push({
      category: key,
      points: -pts,
      reason: alert.message,
    });
    totalPenalty += pts;
  }

  const score = Math.max(0, Math.min(100, 100 - totalPenalty));

  let level, label;
  if      (score >= 90) { level = 'excellent';  label = 'Excelente'; }
  else if (score >= 75) { level = 'good';       label = 'Buena';     }
  else if (score >= 60) { level = 'acceptable'; label = 'Aceptable'; }
  else if (score >= 40) { level = 'improvable'; label = 'Mejorable'; }
  else                  { level = 'critical';   label = 'Crítica';   }

  return { score, label, level, penalties };
}

// ─── Función exportada principal ─────────────────────────────────────────────

/**
 * Calcula la distribución financiera completa según perfil e ingreso.
 *
 * @param {object} profile - Perfil del usuario
 * @param {number} income  - Ingreso neto mensual en euros
 * @returns {object} Resultado completo: { income, phase, profile, blocks, categories, closestModel, alerts, transversal, totalCheck }
 */
export function calculateDistribution(profile, income) {
  // 0. Ingreso efectivo (descuenta la cuota fija de deudas de consumo)
  const monthlyDebt     = profile.monthlyDebtPayment ?? 0;
  const rawEffective    = income - monthlyDebt;
  const effectiveIncome = Math.max(rawEffective, 200);
  const incomeRatio     = effectiveIncome / income;

  // 1. Calcular targets por categoría según perfil e ingreso efectivo.
  //    `explanation` recoge los drivers cualitativos que cada calc*Target
  //    disparó al construir su target — viaja tal cual al cliente.
  const { targets: categoryTargets, factibleMaxOverrides, insufficientBudget, explanation } =
    calculateTargets(profile, effectiveIncome);

  // 2. Obtener configuraciones de needs y savings para el solver
  const solverCats = CATEGORIES_CATALOG.filter(c => c.block === 'needs' || c.block === 'savings');

  // 3. Resolver con LP
  const lpWeightOverrides = profile.housingPurchaseGoal === true
    ? { long_term_savings: 35 }
    : {};
  const lpResult = solveDistribution(categoryTargets, solverCats, {
    lpWeightOverrides,
    factibleMaxOverrides,
  });

  if (!lpResult.feasible) {
    throw new Error(lpResult.error ?? 'Error en el motor LP');
  }

  const { distribution } = lpResult;

  // 4. Separar distribuciones por bloque
  const needsCats   = CATEGORIES_CATALOG.filter(c => c.block === 'needs');
  const savingsCats = CATEGORIES_CATALOG.filter(c => c.block === 'savings');
  const wantsCat    = CATEGORIES_CATALOG.filter(c => c.block === 'wants');

  const needsDist   = Object.fromEntries(needsCats.map(c   => [c.id, distribution[c.id]   ?? 0]));
  const savingsDist = Object.fromEntries(savingsCats.map(c => [c.id, distribution[c.id]   ?? 0]));
  const totalWants  = distribution.wants ?? 0;

  // 5. Distribuir el bloque de deseos con pesos INE normalizados
  const totalWeight = wantsCat.reduce((s, c) => s + (c.ineWeight ?? 0), 0);
  const wantsDist   = Object.fromEntries(
    wantsCat.map(c => [c.id, parseFloat(((c.ineWeight / totalWeight) * totalWants).toFixed(4))])
  );

  // 6. Totales por bloque
  const totalNeeds   = Object.values(needsDist).reduce((s, v) => s + v, 0);
  const totalSavings = Object.values(savingsDist).reduce((s, v) => s + v, 0);

  const blocks = {
    needs:   { label: 'Necesidades', percentage: parseFloat((totalNeeds   * incomeRatio).toFixed(2)), amount: parseFloat(((totalNeeds   / 100) * effectiveIncome).toFixed(2)) },
    wants:   { label: 'Deseos',      percentage: parseFloat((totalWants   * incomeRatio).toFixed(2)), amount: parseFloat(((totalWants   / 100) * effectiveIncome).toFixed(2)) },
    savings: { label: 'Ahorro',      percentage: parseFloat((totalSavings * incomeRatio).toFixed(2)), amount: parseFloat(((totalSavings / 100) * effectiveIncome).toFixed(2)) },
  };

  // 7. Mapa plano de todos los porcentajes
  const allPct = { ...needsDist, ...wantsDist, ...savingsDist };

  // 8. Construir objeto de categorías con importe calculado
  const categories = {};
  for (const cat of CATEGORIES_CATALOG) {
    const pct = allPct[cat.id] ?? 0;
    categories[cat.id] = {
      id:                   cat.id,
      label:                cat.label,
      description:          cat.description,
      block:                cat.block,
      isAnchor:             cat.isAnchor,
      isInsurance:          cat.isInsurance,
      isDebt:               cat.isDebt,
      percentage:           parseFloat((pct * incomeRatio).toFixed(2)),
      amount:               parseFloat(((pct / 100) * effectiveIncome).toFixed(2)),
      healthyRange:         cat.healthyRange,
      alertThresholds:      cat.alerts,
      ineReference:         cat.ineReference,
      referenceSource:      cat.referenceSource,
      referenceReliability: cat.referenceReliability,
    };
  }

  // 9. Suma de verificación (porcentajes sobre ingreso total)
  const totalCheck = parseFloat(((totalNeeds + totalWants + totalSavings) * incomeRatio).toFixed(2));

  // 10. Modelo de referencia más cercano (usando porcentajes sobre ingreso total)
  const closestModel = findClosestModel(totalNeeds * incomeRatio, totalWants * incomeRatio, totalSavings * incomeRatio);

  // 11. Alertas
  const alerts = evaluateAlerts(needsDist, totalWants, totalSavings);
  if (insufficientBudget) {
    alerts._budget_block = {
      level: 'severe',
      message: 'Tus necesidades esenciales superan el 95% del ingreso: no queda margen para construir el fondo de emergencia',
    };
  }
  if (rawEffective < 200) {
    alerts._debt_block = {
      level: 'severe',
      message: 'Las cuotas de deuda dejan menos de 200€ disponibles para gestionar tu presupuesto',
    };
  }

  // 12. Indicadores transversales
  const transversal = calculateTransversal(needsDist, savingsDist, income, effectiveIncome, monthlyDebt, profile);

  // 13. Fase financiera
  const phase = derivePhase(profile);

  // 14. Diagnóstico por categoría: comparación asignado vs target personalizado.
  //     Se construye en dos capas:
  //       - internalDiagnosis: incluye target y deviation crudos (frame del LP).
  //         Lo usa calculateHealthScore aquí dentro; NO sale al cliente.
  //       - categoryDiagnosis (público): solo lo cualitativo + assigned. Sin
  //         target ni deviation numéricos — esos son el "vector de
  //         reconstrucción por resta" que M36 retira del payload.
  const targetMap = Object.fromEntries(categoryTargets.map(t => [t.categoryId, t.target]));
  const ON_TARGET_THRESHOLD = 1.5; // puntos porcentuales

  const internalDiagnosis = {};
  const categoryDiagnosis = {};

  // Needs + Savings — diagnóstico individual con target personalizado
  for (const cat of [...needsCats, ...savingsCats]) {
    const assigned = allPct[cat.id] ?? 0;
    const target   = targetMap[cat.id] ?? 0;
    const deviation = assigned - target;

    let status;
    if (Math.abs(deviation) < ON_TARGET_THRESHOLD)      status = 'on_target';
    else if (deviation > 0)                              status = 'above_target';
    else                                                 status = 'below_target';

    // Versión interna (para el score) — con target/deviation numéricos.
    internalDiagnosis[cat.id] = {
      categoryId: cat.id,
      assigned:   parseFloat(assigned.toFixed(2)),
      target:     parseFloat(target.toFixed(2)),
      deviation:  parseFloat(deviation.toFixed(2)),
      status,
    };

    // Versión pública — solo lo cualitativo y el assigned (que ya es público
    // vía categories[id].percentage).
    categoryDiagnosis[cat.id] = {
      categoryId: cat.id,
      assigned:   parseFloat(assigned.toFixed(2)),
      status,
    };
  }

  // Wants — diagnóstico de bloque (no targets individuales, comparación con referencia 30%)
  let wantsStatus;
  if (totalWants > 38)       wantsStatus = 'excessive';
  else if (totalWants > 30)  wantsStatus = 'high';
  else if (totalWants < 10)  wantsStatus = 'low';
  else                       wantsStatus = 'balanced';

  // _wants_total: el `target: null` y la `reference: 30` son públicos y no
  // sensibles (30% es la regla 50/30/20 reconocida, no un parámetro privado
  // del LP). Lo mantenemos idéntico en ambas capas.
  const wantsBlockDiag = {
    categoryId: '_wants_total',
    assigned:   parseFloat(totalWants.toFixed(2)),
    target:     null,
    reference:  30,
    status:     wantsStatus,
  };
  internalDiagnosis._wants_total = wantsBlockDiag;
  categoryDiagnosis._wants_total = wantsBlockDiag;

  // 15. Score de salud financiera (0-100) basado en desviaciones + alertas.
  //     Nota M36: ya no se exporta `rawTargets` al cliente y `categoryDiagnosis`
  //     no incluye target/deviation crudos (son el "vector de reconstrucción
  //     por resta"). El cálculo del score se hace sobre `internalDiagnosis`,
  //     que vive solo en este ámbito.
  const healthScore = calculateHealthScore(internalDiagnosis, alerts);

  // 16. Comparación con la media española (INE) — para categorías con ineReference
  const ineComparison = {};
  for (const cat of CATEGORIES_CATALOG) {
    if (cat.ineReference == null) continue;
    const assignedPct = categories[cat.id].percentage; // % sobre ingreso total (display frame)
    const vsIne = parseFloat((assignedPct - cat.ineReference).toFixed(2));
    ineComparison[cat.id] = {
      categoryId:   cat.id,
      ineReference: cat.ineReference,
      assigned:     assignedPct,
      vsIne,
    };
  }

  return {
    income,
    effectiveIncome: parseFloat(effectiveIncome.toFixed(2)),
    monthlyDebtPayment: parseFloat(monthlyDebt.toFixed(2)),
    phase,
    profile,
    blocks,
    categories,
    closestModel,
    alerts,
    transversal,
    totalCheck,
    categoryDiagnosis,
    healthScore,
    ineComparison,
    explanation,
  };
}

// ─── Diagnóstico: comparación real vs distribución saludable ──────────────────

/**
 * Compara los importes reales del usuario contra la distribución saludable
 * personalizada calculada por el LP para su perfil. Reutiliza `calculateDistribution`
 * como fuente de la distribución saludable, y aplica `evaluateAlerts` y
 * `calculateHealthScore` sobre los importes reales para producir un diagnóstico
 * coherente con el resto del sistema.
 *
 * @param {object} profile      - Perfil del usuario
 * @param {number} income       - Ingreso mensual
 * @param {object} realAmounts  - { [categoryId]: amountInEuros } importes reales
 * @returns {object} Diagnóstico completo
 */
export function diagnoseDistribution(profile, income, realAmounts) {
  // 1. Distribución saludable según perfil + ingreso (la que el sistema recomienda)
  const healthy = calculateDistribution(profile, income);

  // 2. Real distribution por categoría
  const realDistribution = {};
  for (const cat of CATEGORIES_CATALOG) {
    const realAmount = realAmounts?.[cat.id] ?? 0;
    const realPct    = income > 0 ? (realAmount / income) * 100 : 0;
    realDistribution[cat.id] = {
      id:          cat.id,
      label:       cat.label,
      block:       cat.block,
      amount:      parseFloat(realAmount.toFixed(2)),
      percentage:  parseFloat(realPct.toFixed(2)),
    };
  }

  // 3. Comparación categoría a categoría (real vs saludable)
  const ON_TARGET_THRESHOLD = 1.5; // pp
  const comparison = {};
  for (const cat of CATEGORIES_CATALOG) {
    const real    = realDistribution[cat.id];
    const healthyCat = healthy.categories[cat.id];
    const deviation = real.percentage - healthyCat.percentage;
    const absDev    = Math.abs(deviation);

    let status;
    if (absDev < ON_TARGET_THRESHOLD)  status = 'on_target';
    else if (deviation > 0)             status = 'above_healthy';
    else                                status = 'below_healthy';

    comparison[cat.id] = {
      categoryId:         cat.id,
      label:              cat.label,
      block:              cat.block,
      realAmount:         real.amount,
      realPercentage:     real.percentage,
      healthyAmount:      healthyCat.amount,
      healthyPercentage:  healthyCat.percentage,
      diffAmount:         parseFloat((real.amount - healthyCat.amount).toFixed(2)),
      deviation:          parseFloat(deviation.toFixed(2)),
      status,
    };
  }

  // 4. Resumen por bloque
  const blocks = {};
  for (const blockKey of ['needs', 'wants', 'savings']) {
    let realTotal = 0;
    let healthyTotal = 0;
    for (const cat of CATEGORIES_CATALOG.filter(c => c.block === blockKey)) {
      realTotal    += realDistribution[cat.id].amount;
      healthyTotal += healthy.categories[cat.id].amount;
    }
    const deviation = healthyTotal > 0 ? ((realTotal - healthyTotal) / healthyTotal) * 100 : 0;
    blocks[blockKey] = {
      label:       healthy.blocks[blockKey].label,
      realAmount:  parseFloat(realTotal.toFixed(2)),
      healthyAmount: parseFloat(healthyTotal.toFixed(2)),
      diffAmount:  parseFloat((realTotal - healthyTotal).toFixed(2)),
      deviationPct: parseFloat(deviation.toFixed(1)),
    };
  }

  // 5. Alertas basadas en la distribución REAL (umbrales absolutos del catálogo)
  const needsRealDist  = {};
  let wantsRealTotal   = 0;
  let savingsRealTotal = 0;
  for (const cat of CATEGORIES_CATALOG) {
    const pct = realDistribution[cat.id].percentage;
    if      (cat.block === 'needs')   needsRealDist[cat.id] = pct;
    else if (cat.block === 'wants')   wantsRealTotal   += pct;
    else if (cat.block === 'savings') savingsRealTotal += pct;
  }
  const realAlerts = evaluateAlerts(needsRealDist, wantsRealTotal, savingsRealTotal);

  // 6. categoryDiagnosis para el score: deviation real vs saludable por necesidades + ahorro.
  //    Esto reutiliza calculateHealthScore() del flujo directo.
  const realDiagnosis = {};
  for (const cat of CATEGORIES_CATALOG) {
    if (cat.block === 'wants') continue;
    realDiagnosis[cat.id] = {
      categoryId: cat.id,
      assigned:   realDistribution[cat.id].percentage,
      target:     healthy.categories[cat.id].percentage,
      deviation:  comparison[cat.id].deviation,
      status:     comparison[cat.id].status,
    };
  }

  // 7. Score basado en lo real vs saludable + alertas reales
  const healthScore = calculateHealthScore(realDiagnosis, realAlerts);

  return {
    income,
    effectiveIncome:    healthy.effectiveIncome,
    monthlyDebtPayment: healthy.monthlyDebtPayment,
    healthyDistribution: healthy.categories,
    realDistribution,
    blocks,
    comparison,
    alerts: realAlerts,
    healthScore,
    // Drivers cualitativos heredados de la distribución saludable. El panel
    // de detalle del diagnóstico los usa con la misma lógica que ResultsPage.
    explanation: healthy.explanation,
  };
}
