/**
 * transversalIndicators.js — Cálculos de indicadores financieros transversales para el DashboardPanel.
 *
 * Funciones puras que reciben la respuesta de la API (result o diagnosis) + parámetros
 * adicionales y devuelven { value, status } donde status es "ok" | "warning" | "critical".
 *
 * Convenciones:
 *   - Sin efectos secundarios (cero localStorage, cero DOM, cero fetch).
 *   - Todas las funciones son importables de forma individual para facilitar tests futuros.
 *   - Los umbrales siguen fuentes institucionales documentadas en cada función.
 *   - El DTI ya existe en distributionEngine.js — se expone aquí como helper de lectura
 *     para que el DashboardPanel no importe desde server-only.
 */

// ─── Helpers privados ─────────────────────────────────────────────────────────

/**
 * Clamp seguro: devuelve el valor acotado entre min y max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Redondea a N decimales.
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function round(value, decimals = 2) {
  return parseFloat(value.toFixed(decimals));
}

// ─── Tasa de ahorro ───────────────────────────────────────────────────────────

/**
 * Calcula la tasa de ahorro como porcentaje del ingreso mensual.
 *
 * Fuente: Banco de España — umbral de ahorro saludable ≥ 20% del ingreso neto.
 * Referencia: "Encuesta Financiera de las Familias" (BdE, 2022), sección 3.2.
 *
 * @param {Object} params
 * @param {Object} params.amounts           - Mapa { categoryId: amount } con importes mensuales.
 *                                            Se esperan las categorías del bloque savings.
 * @param {number} params.income            - Ingreso mensual neto de referencia (€).
 * @param {string[]} [params.savingsCatIds] - IDs de las categorías del bloque savings.
 *                                            Si no se pasa, se suman todos los amounts.
 *                                            Preferir pasar los IDs explícitamente.
 * @returns {{ value: number, status: "ok"|"warning"|"critical", formatted: string }}
 *   - value: porcentaje de ahorro (0–100).
 *   - status: "ok" si ≥ 20%; "warning" si 10–19.99%; "critical" si < 10%.
 *   - formatted: string listo para mostrar, ej. "20.3%".
 *
 * Umbrales (Banco de España):
 *   ok       → ≥ 20%
 *   warning  → 10% ≤ x < 20%
 *   critical → < 10%
 */
export function calculateSavingsRate({ amounts, income, savingsCatIds }) {
  if (!income || income <= 0) {
    return { value: 0, status: "critical", formatted: "0%" };
  }

  let savingsTotal = 0;
  if (savingsCatIds && savingsCatIds.length > 0) {
    for (const id of savingsCatIds) {
      savingsTotal += amounts[id] ?? 0;
    }
  } else {
    // Fallback: suma todos los amounts disponibles
    savingsTotal = Object.values(amounts).reduce((acc, v) => acc + v, 0);
  }

  const rate = round((savingsTotal / income) * 100);
  const clamped = clamp(rate, 0, 100);

  let status;
  if (clamped >= 20) {
    status = "ok";
  } else if (clamped >= 10) {
    status = "warning";
  } else {
    status = "critical";
  }

  return {
    value: clamped,
    status,
    formatted: `${clamped.toFixed(1)}%`,
  };
}

// ─── Ratio de necesidades ─────────────────────────────────────────────────────

/**
 * Calcula el ratio de necesidades (needs) como porcentaje del ingreso mensual.
 *
 * Referencia: regla 50/30/20 (BdE/CNMV — Finanzas para Todos). El ideal es ≤ 50%.
 * En economías modernas y ciudades de alto coste de vida superar el 50% es habitual y
 * no indica riesgo por sí solo. La regla 60/20/20 reconoce esta realidad.
 * El umbral crítico se fija en > 70%: por encima del 70% apenas queda margen para
 * ahorro y gastos discrecionales, comprometiendo la estabilidad financiera.
 *
 * @param {Object} params
 * @param {Object} params.amounts           - Mapa { categoryId: amount } con importes mensuales.
 * @param {number} params.income            - Ingreso mensual neto de referencia (€).
 * @param {string[]} [params.needsCatIds]   - IDs de las categorías del bloque needs.
 *                                            Si no se pasa, se suma todo.
 * @returns {{ value: number, status: "ok"|"warning"|"critical", formatted: string }}
 *   - value: porcentaje de necesidades (0–100).
 *   - status: "ok" si ≤ 50%; "warning" si 50% < x ≤ 70%; "critical" si > 70%.
 *   - formatted: string listo para mostrar, ej. "41.7%".
 *
 * Umbrales:
 *   ok       → ≤ 50%   (objetivo 50/30/20, BdE/CNMV)
 *   warning  → 50–70%  (rango habitual — regla 60/20/20, alto coste de vida)
 *   critical → > 70%   (margen insuficiente para ahorro y calidad de vida)
 */
export function calculateNeedsRatio({ amounts, income, needsCatIds }) {
  if (!income || income <= 0) {
    return { value: 0, status: "ok", formatted: "0%" };
  }

  let needsTotal = 0;
  if (needsCatIds && needsCatIds.length > 0) {
    for (const id of needsCatIds) {
      needsTotal += amounts[id] ?? 0;
    }
  } else {
    needsTotal = Object.values(amounts).reduce((acc, v) => acc + v, 0);
  }

  const ratio = round((needsTotal / income) * 100);
  const clamped = clamp(ratio, 0, 100);

  let status;
  if (clamped <= 50) {
    status = "ok";
  } else if (clamped <= 70) {
    status = "warning";
  } else {
    status = "critical";
  }

  return {
    value: clamped,
    status,
    formatted: `${clamped.toFixed(1)}%`,
  };
}

// ─── Cobertura de emergencia ──────────────────────────────────────────────────

/**
 * Calcula los meses de cobertura del fondo de emergencia.
 *
 * Estrategia de cálculo:
 *   El cálculo asume que el importe mensual destinado a `emergency_fund` se acumula
 *   durante 6 meses (horizonte estándar del Banco de España para fondo de emergencia).
 *   Los "gastos fijos mensuales" se aproximan como el importe total del bloque needs,
 *   ya que son los gastos irrenunciables en caso de pérdida de ingresos.
 *
 *   fondo_acumulado_6m = emergency_fund_mensual * 6
 *   cobertura_meses    = fondo_acumulado_6m / needs_mensual_total
 *
 * Limitación documentada: esta es una aproximación. El dato real (saldo actual del
 * fondo de emergencia) no está disponible en el perfil. Si en el futuro el perfil
 * incluye `emergencyFundBalance`, usar ese valor directamente.
 *
 * Fuente: Banco de España — recomendación de 3–6 meses de gastos fijos cubiertos
 * por un fondo de emergencia líquido. ("Guía Financiera para Jóvenes", BdE, 2023).
 *
 * @param {Object} params
 * @param {number} params.emergencyFundMonthly - Importe mensual destinado a emergency_fund (€).
 * @param {number} params.needsMonthlyTotal    - Total mensual del bloque needs (€).
 *                                              Si es 0, la función devuelve status "critical".
 * @returns {{ value: number, status: "ok"|"warning"|"critical", formatted: string }}
 *   - value: meses de cobertura estimados (0–∞, truncado a 24 en el display).
 *   - status: "ok" si ≥ 6m; "warning" si 3–5.99m; "critical" si < 3m.
 *   - formatted: string listo para mostrar, ej. "4.2 m".
 *
 * Umbrales (Banco de España):
 *   ok       → ≥ 6 meses   (objetivo óptimo)
 *   warning  → 3 ≤ x < 6   (mínimo aceptable)
 *   critical → < 3 meses   (insuficiente)
 */
export function calculateEmergencyCoverage({ emergencyFundMonthly, needsMonthlyTotal }) {
  if (!needsMonthlyTotal || needsMonthlyTotal <= 0) {
    return { value: 0, status: "critical", formatted: "0 m" };
  }

  if (!emergencyFundMonthly || emergencyFundMonthly <= 0) {
    return { value: 0, status: "critical", formatted: "0 m" };
  }

  // Fondo acumulado en 6 meses (horizonte Banco de España)
  const fundAccumulated6m = emergencyFundMonthly * 6;
  const coverageMonths = round(fundAccumulated6m / needsMonthlyTotal, 1);

  let status;
  if (coverageMonths >= 6) {
    status = "ok";
  } else if (coverageMonths >= 3) {
    status = "warning";
  } else {
    status = "critical";
  }

  return {
    value: coverageMonths,
    status,
    formatted: `${coverageMonths.toFixed(1)} m`,
  };
}

// ─── DTI — helper de lectura (no duplica lógica) ─────────────────────────────

/**
 * Extrae y clasifica el DTI desde el objeto transversal del resultado de la API.
 *
 * El cálculo real del DTI vive en distributionEngine.js (server-only).
 * Este helper solo lee el valor precalculado y devuelve el estado semántico,
 * evitando que el DashboardPanel (client component) importe código server-only.
 *
 * Fuente: Banco de España — DTI saludable < 30%; atención 30–40%; crítico > 40%.
 * ("Informe de Estabilidad Financiera", BdE, 2023, sección 2.1).
 *
 * @param {Object} params
 * @param {number} params.dtiTotal - Valor de DTI total (%) desde result.transversal.dti.total
 *                                   o diagnosis.transversal.dti.total.
 * @returns {{ value: number, status: "ok"|"warning"|"critical", formatted: string }}
 *   - value: porcentaje DTI.
 *   - status: según umbrales Banco de España.
 *   - formatted: string listo para mostrar, ej. "24.5%".
 *
 * Umbrales (Banco de España):
 *   ok       → < 30%
 *   warning  → 30% ≤ x ≤ 40%
 *   critical → > 40%
 */
export function extractDtiStatus({ dtiTotal }) {
  const value = round(dtiTotal ?? 0);

  // Umbrales BdE / CNMV documentados en indicadores-transversales.md:
  //   ok       → < 35%  (umbral prudencial BdE)
  //   warning  → 35–40% (zona de atención, EFF 2024)
  //   critical → > 40%  (sobrecarga, Eurostat EU-SILC / BdE)
  // El >50% tiene rango normativo (RD-ley 6/2012) pero no lo usamos aquí.
  let status;
  if (value < 35) {
    status = "ok";
  } else if (value <= 40) {
    status = "warning";
  } else {
    status = "critical";
  }

  return {
    value,
    status,
    formatted: `${value.toFixed(1)}%`,
  };
}

// ─── Indicadores por categoría ────────────────────────────────────────────────

/**
 * Calcula el estado de una categoría respecto a sus umbrales institucionales.
 *
 * Lee mild.threshold y severe.threshold de CATEGORIES_CATALOG para la categoría
 * indicada. No hardcodea umbrales — los obtiene del catálogo.
 *
 * Fuentes por categoría:
 *   housing    — Banco de España / Eurostat
 *   utilities  — UE pobreza energética (Directiva Boardman)
 *   groceries  — INE EPF 2024
 *   transport  — INE EPF 2024
 *   health     — OMS SDG 3.8.2
 *   education  — INE EPF 2024
 *
 * @param {Object} params
 * @param {string} params.categoryId  - ID de la categoría en CATEGORIES_CATALOG
 * @param {number} params.percentage  - Porcentaje asignado a esa categoría (0–100)
 * @param {import("../models/categories").CatalogCategory[]} params.catalog
 *   - Array CATEGORIES_CATALOG para no importar directamente (evita ciclos)
 * @returns {{ value: number, status: "ok"|"warning"|"critical"|"info", formatted: string }}
 *   - status "info" si la categoría no tiene umbrales definidos.
 */
export function calculateCategoryIndicator({ categoryId, percentage, catalog }) {
  const cat = catalog.find((c) => c.id === categoryId);

  if (!cat || !cat.alerts || !cat.alerts.mild || !cat.alerts.severe) {
    return {
      value: percentage,
      status: "info",
      formatted: `${percentage.toFixed(1)}%`,
    };
  }

  const mildThreshold   = cat.alerts.mild.threshold;
  const severeThreshold = cat.alerts.severe.threshold;

  let status;
  if (percentage >= severeThreshold) {
    status = "critical";
  } else if (percentage >= mildThreshold) {
    status = "warning";
  } else {
    status = "ok";
  }

  return {
    value: percentage,
    status,
    formatted: `${percentage.toFixed(1)}%`,
  };
}

// ─── Helpers de conveniencia para el DashboardPanel ──────────────────────────

/**
 * Derivar el total del bloque savings desde un mapa de amounts y los IDs del bloque.
 * Helper para que DashboardPanel construya los params de calculateSavingsRate sin
 * tener que conocer los IDs internamente.
 *
 * @param {Object} amounts - Mapa { categoryId: amount }
 * @param {string[]} savingsIds - IDs de categorías savings
 * @returns {number}
 */
export function sumBlockAmounts(amounts, catIds) {
  return catIds.reduce((acc, id) => acc + (amounts[id] ?? 0), 0);
}
