import 'server-only';

import { CATEGORIES_CATALOG } from '../models/categories';

/**
 * Calcula el factor de equivalencia OCDE a partir del perfil familiar.
 * Fórmula: 1.0 + (adultDependents × 0.5) + (childrenAtUniversity × 0.5) + (youngerChildren × 0.3)
 *
 * @param {object} profile
 * @returns {number} Factor OCDE >= 1.0
 */
export function calculateOECDFactor(profile) {
  const dependents = profile.dependents ?? 0;

  if (dependents === 0) return 1.0;

  // hasPartner: pareja contada como dependiente (perfil antiguo asume true)
  const hasPartner = profile.hasPartner ?? true;
  // partnerHasIncome: pareja con ingresos propios no contada como dependiente
  const partnerHasIncome = profile.partnerHasIncome ?? false;
  const partnerInHousehold = hasPartner || partnerHasIncome;

  // Solo restar la pareja del conteo de hijos si estaba en dependents
  const adultDependentsInCount = hasPartner ? 1 : 0;
  const totalChildren = Math.max(0, dependents - adultDependentsInCount);
  const childrenAtUniversity = Math.min(profile.childrenAtUniversity ?? 0, totalChildren);
  const youngerChildren = totalChildren - childrenAtUniversity;

  return 1.0 + (partnerInHousehold ? 0.5 : 0) + childrenAtUniversity * 0.5 + youngerChildren * 0.3;
}

/**
 * Aplica la escala por ingreso a un target base.
 * Fórmula: floor + (base - floor) × factor
 * donde factor = (referenceIncome / effectiveIncome) ^ exponent
 *
 * Si bidirectional es false, el factor se frena en 1.0 para ingresos bajos
 * (el target no sube por encima del base). El resultado se recorta al rango
 * factible de la categoría cuando bidirectional es true.
 *
 * @param {number} baseTarget
 * @param {number} income
 * @param {object} scalingParams
 * @param {number} oecdFactor
 * @returns {number}
 */
export function applyIncomeScaling(baseTarget, income, scalingParams, oecdFactor) {
  const { floor, exponent, referenceIncome, useOECD, bidirectional } = scalingParams;

  const effectiveIncome = useOECD ? income / oecdFactor : income;
  let factor = Math.pow(referenceIncome / effectiveIncome, exponent);

  if (!bidirectional) {
    factor = Math.min(factor, 1.0);
  }

  return floor + (baseTarget - floor) * factor;
}

// ─── Calculadores de target por categoría ────────────────────────────────────

/**
 * HOUSING — implementación completa.
 *
 * Para owned/family: target fijo de la tabla, sin escala por ingreso.
 * Para rent/mortgage: target base de la tabla + modificador de dependientes,
 * luego escalado por ingreso según los parámetros de la categoría.
 */
function calcHousingTarget(profile, income, oecdFactor) {
  // owned y family: coste fijo (amortizado o nulo), no escala con ingreso
  if (profile.housingStatus === 'owned' || profile.housingStatus === 'family') {
    const fixedTargets = {
      owned:  { standard: 3, expensive_city: 4, rural: 2 },
      family: { standard: 2, expensive_city: 2, rural: 2 },
    };
    return fixedTargets[profile.housingStatus]?.[profile.geographicZone] ?? 3;
  }

  // rent y mortgage: base según zona
  const baseTable = {
    rent:     { standard: 25, expensive_city: 28, rural: 18 },
    mortgage: { standard: 23, expensive_city: 26, rural: 16 },
  };
  let base = baseTable[profile.housingStatus]?.[profile.geographicZone] ?? 25;

  // Modificador por dependientes: más espacio necesario
  if ((profile.dependents ?? 0) > 0) base += 2;

  const housingConfig = CATEGORIES_CATALOG.find(c => c.id === 'housing');
  return applyIncomeScaling(base, income, housingConfig.scaling, oecdFactor);
}

// ── Placeholders — se reemplazarán uno por uno en prompts sucesivos ──────────

function calcUtilitiesTarget(profile, income) {
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  let base = 7;
  base += effectiveDependentsAtHome * 1;
  if (profile.employmentStatus === 'freelance') base += 1.5;
  if (profile.geographicZone === 'rural') base += 1;

  const utilitiesConfig = CATEGORIES_CATALOG.find(c => c.id === 'utilities');
  return applyIncomeScaling(base, income, utilitiesConfig.scaling, 1);
}
function calcGroceriesTarget(profile, income) {
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  const baseTable = [12, 16, 19, 22];
  const base = baseTable[Math.min(effectiveDependentsAtHome, 3)] + childrenAway * 1;

  const groceriesConfig = CATEGORIES_CATALOG.find(c => c.id === 'groceries');
  return applyIncomeScaling(base, income, groceriesConfig.scaling, 1);
}
function calcTransportTarget(profile, income) {
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  const vehicleBase = {
    none:       4,
    owned_paid: 9,
    financed:   12,
    leasing:    12,
  };
  let base = vehicleBase[profile.vehicleStatus] ?? 4;

  if (profile.geographicZone === 'rural')         base += 4;
  if (profile.freelanceRegularTravel === true)    base += 3;
  if (effectiveDependentsAtHome > 0)              base += 2;

  const transportConfig = CATEGORIES_CATALOG.find(c => c.id === 'transport');
  return applyIncomeScaling(base, income, transportConfig.scaling, 1);
}
function calcHealthTarget(profile, income) {
  const ageBase = { under35: 2, '35to50': 3, over50: 5 };
  let base = ageBase[profile.ageRange] ?? 3;

  if (profile.privateHealthInsurance === 'basic')    base += 2;
  if (profile.privateHealthInsurance === 'complete') base += 4;
  if ((profile.dependents ?? 0) > 0)                base += 1;

  const healthConfig = CATEGORIES_CATALOG.find(c => c.id === 'health');
  return applyIncomeScaling(base, income, healthConfig.scaling, 1);
}
function calcEducationTarget(profile, income) {
  const ownBase = { none: 1, continuous: 3, formal: 6 };
  let base = ownBase[profile.ownEducation] ?? 1;

  const dependents = profile.dependents ?? 0;
  if (dependents > 0) {
    const hasPartner      = profile.hasPartner ?? true;
    const adultDependents = hasPartner ? 1 : 0;
    const totalChildren   = Math.max(0, dependents - adultDependents);

    if (totalChildren > 0) {
      if (profile.childrenAtUniversity != null) {
        const childrenStudyingAway    = profile.childrenStudyingAway ?? 0;
        const childrenAtUniversityHome = (profile.childrenAtUniversity) - childrenStudyingAway;
        const childrenInSchool        = totalChildren - profile.childrenAtUniversity;
        base += childrenInSchool        * 3;
        base += childrenAtUniversityHome * 5;
        base += childrenStudyingAway    * 12;
      } else {
        // Fallback para perfiles sin Q5b/Q5c
        base += totalChildren * 3;
      }
    }
  }

  const educationConfig = CATEGORIES_CATALOG.find(c => c.id === 'education');
  return applyIncomeScaling(base, income, educationConfig.scaling, 1);
}
function calcLifeInsuranceTarget(profile, income) {
  let base = 0.5;
  if ((profile.dependents ?? 0) > 0)         base += 1.0;
  if (profile.housingStatus === 'mortgage')   base += 0.5;
  if (profile.ageRange === 'over50')          base += 0.5;

  const lifeInsuranceConfig = CATEGORIES_CATALOG.find(c => c.id === 'life_insurance');
  return applyIncomeScaling(base, income, lifeInsuranceConfig.scaling, 1);
}
function calcShortTermSavingsTarget(profile) {
  return (profile.dependents ?? 0) > 0 ? 4 : 3;
}
function calcLongTermSavingsTarget(profile) {
  return profile.housingPurchaseGoal === true ? 10 : 2;
}
function calcInvestmentTarget(profile) {
  const ageBase = { under35: 5, '35to50': 8, over50: 10 };
  let base = ageBase[profile.ageRange] ?? 5;

  const pensionMod = { social_security: 0, mutual: 2, none: 4 };
  base += pensionMod[profile.pensionRegime] ?? 0;

  if (profile.pensionRegime === 'social_security') {
    const employmentMod = { permanent: 0, temporary: 1, freelance: 2 };
    base += employmentMod[profile.employmentStatus] ?? 0;
  }

  return base;
}
function calcDebtExtraTarget(profile) {
  const debtTarget = { none: 0, low: 2, medium: 4, high: 6 };
  return debtTarget[profile.consumerDebt] ?? 0;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Calcula el target de porcentaje para cada categoría de necesidades y ahorro.
 * El bloque de deseos no tiene targets individuales: el LP lo trata como residuo.
 *
 * En modo prioridad (fases "none" y "building") el fondo de emergencia recibe un
 * cap dinámico (en lugar del cap estático del catálogo) calculado como
 * 100 - needs - lifeInsurance - 5, recortado a [0, 90]. El cap se propaga al LP
 * vía `factibleMaxOverrides`. Si el cap "rápido" permite completar el fondo en
 * <4 meses, el resto de ahorros recibe sus targets normales; en otro caso se
 * mantienen a 0 para concentrar el ahorro en el fondo.
 *
 * @param {object} profile - Perfil del usuario (de ProfilePage / localStorage)
 * @param {number} income  - Ingreso neto mensual en euros
 * @returns {{
 *   targets: Array<{ categoryId: string, target: number }>,
 *   factibleMaxOverrides: object,
 *   insufficientBudget: boolean,
 * }}
 */
export function calculateTargets(profile, income) {
  const oecdFactor = calculateOECDFactor(profile);

  // 1. Targets de necesidades
  const housingT   = calcHousingTarget(profile, income, oecdFactor);
  const utilitiesT = calcUtilitiesTarget(profile, income);
  const groceriesT = calcGroceriesTarget(profile, income);
  const transportT = calcTransportTarget(profile, income);
  const healthT    = calcHealthTarget(profile, income);
  const educationT = calcEducationTarget(profile, income);
  const totalNeedsPct = housingT + utilitiesT + groceriesT + transportT + healthT + educationT;

  // 2. Seguro de vida — siempre con valor normal, en todas las fases
  const lifeInsuranceT = calcLifeInsuranceTarget(profile, income);

  // 3. Fase del fondo de emergencia y modo monoingreso/biingreso
  const phase       = profile.emergencyFundStatus;
  const isPriority  = phase === 'none' || phase === 'building';
  const isPartial   = phase === 'partial';
  const isBiIngreso = profile.partnerHasIncome === true;

  // 4. Cap dinámico del fondo (solo aplica en modo prioridad)
  //    Tres cotas:
  //      a) raw  = 100 - needs - lifeInsurance - 5 (margen mínimo de wants)
  //      b) maxReasonableCap = (monthsTarget × needs) / 3
  //         → garantiza que el fondo se construya en ≥ 3 meses (no más rápido).
  //         A ingresos altos donde needs baja por scaling, esta cota impide que
  //         el cap se infle a 70-80% del ingreso (lo que llevaría al LP a
  //         asignar absurdos al fondo y a shavear necesidades).
  //      c) 90% (techo absoluto de seguridad).
  //    Si raw < 0: cap = 0 + alerta de presupuesto insuficiente.
  //    monthsTarget se reutiliza más abajo para la decisión modo rápido vs estricto.
  const monthsTarget = { permanent: 3, temporary: 5, freelance: 6 }[profile.employmentStatus] ?? 3;

  let dynamicCap          = null;
  let insufficientBudget  = false;
  if (isPriority) {
    const raw              = 100 - totalNeedsPct - lifeInsuranceT - 5;
    const maxReasonableCap = (monthsTarget * totalNeedsPct) / 3;
    if (raw < 0) {
      dynamicCap = 0;
      insufficientBudget = true;
    } else {
      dynamicCap = Math.min(raw, maxReasonableCap, 90);
    }
  }

  // 5. Target del fondo de emergencia según la fase
  let emergencyT;
  if (isPriority) {
    // Modo prioridad: apunta al cap dinámico (aspiracional)
    emergencyT = dynamicCap;
  } else if (isPartial) {
    // Modo parcial: dinámico proporcional a las necesidades, divisor según monoingreso/biingreso
    const divisor = isBiIngreso ? 15 : 12;
    emergencyT = totalNeedsPct / divisor;
  } else {
    // Modo mantenimiento ('complete' o desconocido)
    emergencyT = 0.5;
  }

  // 6. Decisión modo rápido vs prioridad estricta (solo en fases priority).
  //    En "parcial" y "completo" los otros ahorros siempre se calculan con sus
  //    valores normales — no se altera la lógica existente.
  //    monthsTarget se calculó en el paso 4 (mismo valor por empleo).
  let useNormalOtherSavings;
  if (isPriority) {
    const fondoNecesario     = monthsTarget * (totalNeedsPct / 100) * income;
    const maxAportMensual    = (dynamicCap / 100) * income;
    const mesesParaCompletar = maxAportMensual > 0 ? fondoNecesario / maxAportMensual : Infinity;
    useNormalOtherSavings    = mesesParaCompletar < 4;
  } else {
    useNormalOtherSavings = true;
  }

  // 7. Otros ahorros: normales si parcial/completo o modo rápido; 0 en prioridad estricta
  const shortTermT  = useNormalOtherSavings ? calcShortTermSavingsTarget(profile) : 0;
  const longTermT   = useNormalOtherSavings ? calcLongTermSavingsTarget(profile)  : 0;
  const investmentT = useNormalOtherSavings ? calcInvestmentTarget(profile)       : 0;
  const debtExtraT  = useNormalOtherSavings ? calcDebtExtraTarget(profile)        : 0;

  const targets = [
    { categoryId: 'housing',             target: housingT },
    { categoryId: 'utilities',           target: utilitiesT },
    { categoryId: 'groceries',           target: groceriesT },
    { categoryId: 'transport',           target: transportT },
    { categoryId: 'health',              target: healthT },
    { categoryId: 'education',           target: educationT },
    { categoryId: 'life_insurance',      target: lifeInsuranceT },
    { categoryId: 'emergency_fund',      target: emergencyT },
    { categoryId: 'short_term_savings',  target: shortTermT },
    { categoryId: 'long_term_savings',   target: longTermT },
    { categoryId: 'investment',          target: investmentT },
    { categoryId: 'debt_extra',          target: debtExtraT },
  ];

  const factibleMaxOverrides = dynamicCap !== null
    ? { emergency_fund: dynamicCap }
    : {};
  // Tope dinámico de amortización extra: nunca por encima del target del perfil.
  // Sin deuda → debtExtraT = 0 → el LP no puede asignar nada a amortización inexistente.
  factibleMaxOverrides.debt_extra = debtExtraT;

  return { targets, factibleMaxOverrides, insufficientBudget };
}
