import 'server-only';

/**
 * Motor de cálculo de porcentajes por categoría según perfil de usuario.
 *
 * Recibe el objeto de perfil y devuelve los porcentajes de las 12 categorías
 * de necesidades y ahorro. El bloque de deseos se calcula en distributionEngine
 * como residuo hasta completar el 100%.
 *
 * Cada función interna respeta los límites del healthyRange de su categoría
 * usando Math.min(Math.max(value, min), max).
 *
 * Módulo puro: sin imports de React, Next.js ni UI.
 */

// ─── Utilidades internas ─────────────────────────────────────────────────────

/**
 * Determina la fase del sistema de ahorro según el estado del fondo de emergencia.
 * Fase A: el fondo no está construido todavía — prioridad alta de ahorro.
 * Fase B: el fondo está parcial o completamente formado — ahorro más diversificado.
 */
export function getPhase(profile) {
  return ["none", "building"].includes(profile.emergencyFundStatus) ? "A" : "B";
}

// ─── Necesidades ─────────────────────────────────────────────────────────────

function calcHousing(profile) {
  const base = { rent: 30, mortgage: 28, owned: 3, family: 3 }[profile.housingStatus] ?? 28;
  // Bonus por zona cara solo si el usuario está pagando (alquiler o hipoteca)
  const zoneBonus =
    profile.geographicZone === "expensive_city" &&
    ["rent", "mortgage"].includes(profile.housingStatus)
      ? 2
      : 0;
  return Math.min(Math.max(base + zoneBonus, 3), 30);
}

function calcUtilities(profile) {
  let v = 7;
  if (profile.dependents > 0) v += 1;
  // Freelance usa el hogar como oficina; más consumo de suministros
  if (profile.employmentStatus === "freelance") v += 2;
  if (profile.geographicZone === "rural") v += 1;
  return Math.min(Math.max(v, 4), 10);
}

function calcGroceries(profile) {
  const map = { 0: 10, 1: 13, 2: 15, 3: 17 };
  return Math.min(Math.max(map[Math.min(profile.dependents, 3)] ?? 10, 8), 20);
}

function calcTransport(profile) {
  const base = { none: 4, owned_paid: 9, financed: 12, leasing: 11 }[profile.vehicleStatus] ?? 9;
  let v = base;
  // Zona rural implica mayor dependencia del vehículo y más distancias
  if (profile.geographicZone === "rural") v += 4;
  // Freelance necesita movilidad adicional para clientes y reuniones
  if (profile.employmentStatus === "freelance") v += 3;
  if (profile.dependents > 0) v += 2;
  return Math.min(Math.max(v, 3), 18);
}

function calcHealth(profile) {
  const ageBonus = { under35: -1, "35to50": 0, over50: 2 }[profile.ageRange] ?? 0;
  const insBonus = { none: 0, basic: 2, complete: 4 }[profile.privateHealthInsurance] ?? 0;
  const depBonus = profile.dependents > 0 ? 2 : 0;
  return Math.min(Math.max(3 + ageBonus + insBonus + depBonus, 1), 10);
}

function calcEducation(profile) {
  const ownBonus = { none: 0, continuous: 2, formal: 7 }[profile.ownEducation] ?? 0;
  // Estimación genérica de 3% por dependiente (centro público); sin datos de tipo de centro
  const depBonus = profile.dependents * 3;
  return Math.min(Math.max(1 + ownBonus + depBonus, 0), 20);
}

// ─── Ahorro ──────────────────────────────────────────────────────────────────

function calcLifeInsurance(profile) {
  const hasMortgage = profile.housingStatus === "mortgage";
  const hasDeps = profile.dependents > 0;
  if (hasDeps && hasMortgage) return 3;
  if (hasDeps) return 2.5;
  if (hasMortgage) return 1.5;
  return 1;
}

function calcEmergencyFund(profile, phase) {
  const base = {
    permanent:  { A: 6, B: 1 },
    temporary:  { A: 7, B: 2 },
    freelance:  { A: 8, B: 2 },
    unemployed: { A: 8, B: 2 }
  }[profile.employmentStatus] ?? { A: 6, B: 1 };
  // Más dependientes = colchón más alto, pero menor presión una vez completado (fase B)
  const depBonus = phase === "A" ? profile.dependents * 1 : profile.dependents * 0.5;
  return Math.min(Math.max(base[phase] + depBonus, 1), 10);
}

function calcShortTermSavings(phase) {
  // En fase A el fondo de emergencia es prioritario; ahorro corto plazo es menor
  return phase === "A" ? 3 : 4;
}

function calcLongTermSavings(profile, phase) {
  if (profile.housingPurchaseGoal === true) return phase === "A" ? 8 : 10;
  // Si ya tiene vivienda pagada, no necesita ahorrar para entrada
  if (profile.housingStatus === "owned") return 0;
  return phase === "A" ? 2 : 3;
}

function calcInvestment(profile, phase) {
  const base = {
    under35:  { A: 5, B: 7  },
    "35to50": { A: 6, B: 9  },
    over50:   { A: 9, B: 12 }
  }[profile.ageRange] ?? { A: 6, B: 9 };
  let v = base[phase];
  // Autónomo no tiene pensión pública robusta; mayor necesidad de inversión privada
  if (profile.employmentStatus === "freelance") v += 2;
  // Mutualidades y sin cotización → aún más necesidad de inversión privada
  if (profile.pensionRegime === "mutual" || profile.pensionRegime === "none") v += 4;
  return Math.min(Math.max(v, 4), 15);
}

function calcDebtExtra(profile) {
  const map = { none: 0, low: 0.5, medium: 1.5, high: 4 };
  return Math.min(Math.max(map[profile.consumerDebt] ?? 0, 0), 5);
}

// ─── Función exportada principal ─────────────────────────────────────────────

/**
 * Calcula los porcentajes de las 12 categorías de necesidades y ahorro según el perfil.
 * Los porcentajes de deseos se calculan en distributionEngine como residuo.
 *
 * @param {object} profile - Objeto de perfil del usuario (de ProfilePage)
 * @returns {{ needs: object, savings: object, phase: 'A'|'B' }}
 */
export function calculateCategoryPercentages(profile) {
  const phase = getPhase(profile);

  return {
    needs: {
      housing:   calcHousing(profile),
      utilities: calcUtilities(profile),
      groceries: calcGroceries(profile),
      transport: calcTransport(profile),
      health:    calcHealth(profile),
      education: calcEducation(profile)
    },
    savings: {
      life_insurance:     calcLifeInsurance(profile),
      emergency_fund:     calcEmergencyFund(profile, phase),
      short_term_savings: calcShortTermSavings(phase),
      long_term_savings:  calcLongTermSavings(profile, phase),
      investment:         calcInvestment(profile, phase),
      debt_extra:         calcDebtExtra(profile)
    },
    phase
  };
}
