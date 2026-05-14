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

  // 1. Calcular targets por categoría según perfil e ingreso efectivo
  const { targets: categoryTargets, factibleMaxOverrides, insufficientBudget } =
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
  };
}
