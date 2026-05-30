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
//
// Cada calc*Target devuelve { target, drivers }.
// Los drivers son tokens del diccionario M36-token-dictionary.md §4 y se
// emiten ÚNICAMENTE cuando una rama del cuerpo modifica el target. Condición
// y push del token viven juntos en el mismo if para que un futuro cambio de
// modificador arrastre su token (o lo deje huérfano de forma evidente).
//
// Reglas:
//   - Solo modificadores DIRECTOS del target de esta categoría.
//   - Sin valores ni magnitudes: solo el token.
//   - Sin duplicados (el caller puede usar Set si fuera necesario; aquí cada
//     rama emite a lo sumo un token y no se solapan).

/**
 * HOUSING — implementación completa.
 *
 * Para owned/family: target fijo de la tabla, sin escala por ingreso.
 * Para rent/mortgage: target base de la tabla + modificador de dependientes,
 * luego escalado por ingreso según los parámetros de la categoría.
 */
function calcHousingTarget(profile, income, oecdFactor) {
  const drivers = [];

  // owned y family: coste fijo (amortizado o nulo), no escala con ingreso.
  // La rama depende de housingStatus → emite HOUSING_STATUS.
  // La tabla varía por zona → emite GEOGRAPHIC_ZONE si la zona no es estándar.
  if (profile.housingStatus === 'owned' || profile.housingStatus === 'family') {
    drivers.push('HOUSING_STATUS');
    if (profile.geographicZone && profile.geographicZone !== 'standard') {
      drivers.push('GEOGRAPHIC_ZONE');
    }
    const fixedTargets = {
      owned:  { standard: 3, expensive_city: 4, rural: 2 },
      family: { standard: 2, expensive_city: 2, rural: 2 },
    };
    const target = fixedTargets[profile.housingStatus]?.[profile.geographicZone] ?? 3;
    return { target, drivers };
  }

  // rent y mortgage: base según zona. Status decide qué tabla y zona qué columna.
  const baseTable = {
    rent:     { standard: 25, expensive_city: 28, rural: 18 },
    mortgage: { standard: 23, expensive_city: 26, rural: 16 },
  };
  drivers.push('HOUSING_STATUS');
  if (profile.geographicZone && profile.geographicZone !== 'standard') {
    drivers.push('GEOGRAPHIC_ZONE');
  }
  let base = baseTable[profile.housingStatus]?.[profile.geographicZone] ?? 25;

  // Modificador por dependientes: más espacio necesario.
  if ((profile.dependents ?? 0) > 0) {
    base += 2;
    drivers.push('HOUSEHOLD_SIZE');
  }

  // Escalado por ingreso (rama que siempre toca el target en rent/mortgage).
  const housingConfig = CATEGORIES_CATALOG.find(c => c.id === 'housing');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, housingConfig.scaling, oecdFactor);
  return { target, drivers };
}

function calcUtilitiesTarget(profile, income) {
  const drivers = [];
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  let base = 7;
  // Dependientes en casa: cada uno suma al consumo del hogar.
  if (effectiveDependentsAtHome > 0) {
    base += effectiveDependentsAtHome * 1;
    drivers.push('HOUSEHOLD_SIZE');
  }
  if (profile.employmentStatus === 'freelance') {
    base += 1.5;
    drivers.push('EMPLOYMENT');
  }
  if (profile.geographicZone === 'rural') {
    base += 1;
    drivers.push('GEOGRAPHIC_ZONE');
  }

  const utilitiesConfig = CATEGORIES_CATALOG.find(c => c.id === 'utilities');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, utilitiesConfig.scaling, 1);
  return { target, drivers };
}

function calcGroceriesTarget(profile, income) {
  const drivers = [];
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  const baseTable = [12, 16, 19, 22];
  // Solo si hay dependientes (en casa o fuera) el lookup deja de devolver el
  // valor "soltero base" — entonces HOUSEHOLD_SIZE modifica el target.
  if (effectiveDependentsAtHome > 0 || childrenAway > 0) {
    drivers.push('HOUSEHOLD_SIZE');
  }
  const base = baseTable[Math.min(effectiveDependentsAtHome, 3)] + childrenAway * 1;

  const groceriesConfig = CATEGORIES_CATALOG.find(c => c.id === 'groceries');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, groceriesConfig.scaling, 1);
  return { target, drivers };
}

function calcTransportTarget(profile, income) {
  const drivers = [];
  const childrenAway = profile.childrenStudyingAway ?? 0;
  const effectiveDependentsAtHome = Math.max(0, (profile.dependents ?? 0) - childrenAway);

  const vehicleBase = {
    none:       4,
    owned_paid: 9,
    financed:   12,
    leasing:    12,
  };
  // El base depende SIEMPRE de vehicleStatus (el lookup decide el punto de partida).
  let base = vehicleBase[profile.vehicleStatus] ?? 4;
  drivers.push('VEHICLE');

  if (profile.geographicZone === 'rural') {
    base += 4;
    drivers.push('GEOGRAPHIC_ZONE');
  }
  if (profile.freelanceRegularTravel === true) {
    base += 3;
    drivers.push('EMPLOYMENT');
  }
  if (effectiveDependentsAtHome > 0) {
    base += 2;
    drivers.push('HOUSEHOLD_SIZE');
  }

  const transportConfig = CATEGORIES_CATALOG.find(c => c.id === 'transport');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, transportConfig.scaling, 1);
  return { target, drivers };
}

function calcHealthTarget(profile, income) {
  const drivers = [];
  const ageBase = { under35: 2, '35to50': 3, over50: 5 };
  // El base SIEMPRE depende de la edad (cualquier ageRange escoge un valor distinto).
  let base = ageBase[profile.ageRange] ?? 3;
  drivers.push('AGE');

  if (profile.privateHealthInsurance === 'basic') {
    base += 2;
    drivers.push('HEALTH_INSURANCE');
  }
  if (profile.privateHealthInsurance === 'complete') {
    base += 4;
    drivers.push('HEALTH_INSURANCE');
  }
  if ((profile.dependents ?? 0) > 0) {
    base += 1;
    drivers.push('HOUSEHOLD_SIZE');
  }

  const healthConfig = CATEGORIES_CATALOG.find(c => c.id === 'health');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, healthConfig.scaling, 1);
  return { target, drivers };
}

function calcEducationTarget(profile, income) {
  const drivers = [];
  const ownBase = { none: 1, continuous: 3, formal: 6 };
  let base = ownBase[profile.ownEducation] ?? 1;
  // Solo cuando el usuario está formándose se modifica el base por su propia
  // formación. 'none' es el valor neutro de partida, no un modificador.
  if (profile.ownEducation === 'continuous' || profile.ownEducation === 'formal') {
    drivers.push('OWN_EDUCATION');
  }

  const dependents = profile.dependents ?? 0;
  if (dependents > 0) {
    const hasPartner      = profile.hasPartner ?? true;
    const adultDependents = hasPartner ? 1 : 0;
    const totalChildren   = Math.max(0, dependents - adultDependents);

    if (totalChildren > 0) {
      drivers.push('HOUSEHOLD_SIZE');
      if (profile.childrenAtUniversity != null) {
        const childrenStudyingAway     = profile.childrenStudyingAway ?? 0;
        const childrenAtUniversityHome = (profile.childrenAtUniversity) - childrenStudyingAway;
        const childrenInSchool         = totalChildren - profile.childrenAtUniversity;
        base += childrenInSchool         * 3;
        base += childrenAtUniversityHome * 5;
        base += childrenStudyingAway     * 12;
        // Estos dos drivers van separados de HOUSEHOLD_SIZE porque las ramas
        // que disparan tienen pesos muy distintos (5 vs 12) y las implicaciones
        // para el usuario son cualitativamente diferentes (matrícula
        // universitaria en casa vs. segunda economía doméstica).
        if (childrenAtUniversityHome > 0) drivers.push('CHILDREN_AT_UNIVERSITY');
        if (childrenStudyingAway     > 0) drivers.push('CHILDREN_STUDYING_AWAY');
      } else {
        // Fallback para perfiles sin Q5b/Q5c
        base += totalChildren * 3;
      }
    }
  }

  const educationConfig = CATEGORIES_CATALOG.find(c => c.id === 'education');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, educationConfig.scaling, 1);
  return { target, drivers };
}

function calcLifeInsuranceTarget(profile, income) {
  const drivers = [];
  let base = 0.5;
  if ((profile.dependents ?? 0) > 0) {
    base += 1.0;
    drivers.push('HOUSEHOLD_SIZE');
  }
  if (profile.housingStatus === 'mortgage') {
    base += 0.5;
    drivers.push('HOUSING_STATUS');
  }
  if (profile.ageRange === 'over50') {
    base += 0.5;
    drivers.push('AGE');
  }

  const lifeInsuranceConfig = CATEGORIES_CATALOG.find(c => c.id === 'life_insurance');
  drivers.push('INCOME_TIER');
  const target = applyIncomeScaling(base, income, lifeInsuranceConfig.scaling, 1);
  return { target, drivers };
}

function calcShortTermSavingsTarget(profile) {
  const drivers = [];
  // El valor cambia 3 ↔ 4 según haya dependientes: HOUSEHOLD_SIZE es el único modificador.
  if ((profile.dependents ?? 0) > 0) {
    drivers.push('HOUSEHOLD_SIZE');
    return { target: 4, drivers };
  }
  return { target: 3, drivers };
}

function calcLongTermSavingsTarget(profile) {
  const drivers = [];
  // El objetivo de comprar vivienda multiplica el target (2 → 10).
  if (profile.housingPurchaseGoal === true) {
    drivers.push('HOUSING_GOAL');
    return { target: 10, drivers };
  }
  return { target: 2, drivers };
}

function calcInvestmentTarget(profile) {
  const drivers = [];
  const ageBase = { under35: 5, '35to50': 8, over50: 10 };
  // El base SIEMPRE depende del rango de edad.
  let base = ageBase[profile.ageRange] ?? 5;
  drivers.push('AGE');

  const pensionMod = { social_security: 0, mutual: 2, none: 4 };
  const pensionAdd = pensionMod[profile.pensionRegime] ?? 0;
  // Regímenes que no son la Seguridad Social añaden carga al ahorro privado.
  if (pensionAdd > 0) {
    base += pensionAdd;
    drivers.push('PENSION_REGIME');
  }

  if (profile.pensionRegime === 'social_security') {
    const employmentMod = { permanent: 0, temporary: 1, freelance: 2 };
    const employmentAdd = employmentMod[profile.employmentStatus] ?? 0;
    // Solo asalariados/temporales/autónomos cubiertos por SS reciben este ajuste.
    if (employmentAdd > 0) {
      base += employmentAdd;
      drivers.push('EMPLOYMENT');
    }
  }

  return { target: base, drivers };
}

function calcDebtExtraTarget(profile) {
  const drivers = [];
  const debtTarget = { none: 0, low: 2, medium: 4, high: 6 };
  // Solo se modifica el target si hay deuda de consumo.
  if (profile.consumerDebt && profile.consumerDebt !== 'none') {
    drivers.push('DEBT');
    return { target: debtTarget[profile.consumerDebt] ?? 0, drivers };
  }
  return { target: 0, drivers };
}

// ─── Helper para añadir drivers únicos al mapa de explicación ────────────────

function pushDrivers(explanation, catId, ...tokens) {
  if (!explanation[catId]) explanation[catId] = { drivers: [] };
  const set = new Set(explanation[catId].drivers);
  for (const t of tokens) set.add(t);
  explanation[catId].drivers = Array.from(set);
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
 *   explanation: { [categoryId: string]: { drivers: string[] } },
 * }}
 */
export function calculateTargets(profile, income) {
  const oecdFactor = calculateOECDFactor(profile);

  // 1. Targets de necesidades (cada uno devuelve { target, drivers })
  const housingR   = calcHousingTarget(profile, income, oecdFactor);
  const utilitiesR = calcUtilitiesTarget(profile, income);
  const groceriesR = calcGroceriesTarget(profile, income);
  const transportR = calcTransportTarget(profile, income);
  const healthR    = calcHealthTarget(profile, income);
  const educationR = calcEducationTarget(profile, income);
  const totalNeedsPct =
    housingR.target + utilitiesR.target + groceriesR.target +
    transportR.target + healthR.target + educationR.target;

  // 2. Seguro de vida — siempre con valor normal, en todas las fases
  const lifeInsuranceR = calcLifeInsuranceTarget(profile, income);

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
    const raw              = 100 - totalNeedsPct - lifeInsuranceR.target - 5;
    const maxReasonableCap = (monthsTarget * totalNeedsPct) / 3;
    if (raw < 0) {
      dynamicCap = 0;
      insufficientBudget = true;
    } else {
      dynamicCap = Math.min(raw, maxReasonableCap, 90);
    }
  }

  // 5. Target del fondo de emergencia según la fase + drivers asociados.
  //    La rama por fase ES un modificador directo del target → EMERGENCY_PHASE
  //    siempre se emite. En modo prioridad, monthsTarget depende de EMPLOYMENT
  //    (toca el cap), y la rama parcial usa PARTNER_INCOME para el divisor.
  let emergencyT;
  const emergencyDrivers = ['EMERGENCY_PHASE'];
  if (isPriority) {
    // Modo prioridad: apunta al cap dinámico (aspiracional).
    // monthsTarget depende del estatus laboral → EMPLOYMENT toca el cap.
    emergencyDrivers.push('EMPLOYMENT');
    emergencyT = dynamicCap;
  } else if (isPartial) {
    // Modo parcial: divisor según monoingreso/biingreso.
    const divisor = isBiIngreso ? 15 : 12;
    if (isBiIngreso) emergencyDrivers.push('PARTNER_INCOME');
    emergencyT = totalNeedsPct / divisor;
  } else {
    // Modo mantenimiento ('complete' o desconocido): valor fijo, sin más drivers.
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
  const shortTermR  = useNormalOtherSavings ? calcShortTermSavingsTarget(profile) : { target: 0, drivers: [] };
  const longTermR   = useNormalOtherSavings ? calcLongTermSavingsTarget(profile)  : { target: 0, drivers: [] };
  const investmentR = useNormalOtherSavings ? calcInvestmentTarget(profile)       : { target: 0, drivers: [] };
  const debtExtraR  = useNormalOtherSavings ? calcDebtExtraTarget(profile)        : { target: 0, drivers: [] };

  const targets = [
    { categoryId: 'housing',             target: housingR.target },
    { categoryId: 'utilities',           target: utilitiesR.target },
    { categoryId: 'groceries',           target: groceriesR.target },
    { categoryId: 'transport',           target: transportR.target },
    { categoryId: 'health',              target: healthR.target },
    { categoryId: 'education',           target: educationR.target },
    { categoryId: 'life_insurance',      target: lifeInsuranceR.target },
    { categoryId: 'emergency_fund',      target: emergencyT },
    { categoryId: 'short_term_savings',  target: shortTermR.target },
    { categoryId: 'long_term_savings',   target: longTermR.target },
    { categoryId: 'investment',          target: investmentR.target },
    { categoryId: 'debt_extra',          target: debtExtraR.target },
  ];

  // 8. Ensamblar el objeto explanation con los drivers únicos por categoría.
  //    Las categorías de wants se incluyen con drivers:[] para que el cliente
  //    pueda iterar sobre todas sin checks extra.
  const explanation = {};
  pushDrivers(explanation, 'housing',            ...housingR.drivers);
  pushDrivers(explanation, 'utilities',          ...utilitiesR.drivers);
  pushDrivers(explanation, 'groceries',          ...groceriesR.drivers);
  pushDrivers(explanation, 'transport',          ...transportR.drivers);
  pushDrivers(explanation, 'health',             ...healthR.drivers);
  pushDrivers(explanation, 'education',          ...educationR.drivers);
  pushDrivers(explanation, 'life_insurance',     ...lifeInsuranceR.drivers);
  pushDrivers(explanation, 'emergency_fund',     ...emergencyDrivers);
  pushDrivers(explanation, 'short_term_savings', ...shortTermR.drivers);
  pushDrivers(explanation, 'long_term_savings',  ...longTermR.drivers);
  pushDrivers(explanation, 'investment',         ...investmentR.drivers);
  pushDrivers(explanation, 'debt_extra',         ...debtExtraR.drivers);

  // Wants no tienen calc*Target individual (bloque tratado como residuo por el LP).
  for (const cat of CATEGORIES_CATALOG) {
    if (cat.block === 'wants' && !explanation[cat.id]) {
      explanation[cat.id] = { drivers: [] };
    }
  }

  const factibleMaxOverrides = dynamicCap !== null
    ? { emergency_fund: dynamicCap }
    : {};
  // Tope dinámico de amortización extra: nunca por encima del target del perfil.
  // Sin deuda → debtExtraT = 0 → el LP no puede asignar nada a amortización inexistente.
  factibleMaxOverrides.debt_extra = debtExtraR.target;

  return { targets, factibleMaxOverrides, insufficientBudget, explanation };
}
