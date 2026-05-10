import 'server-only';

/**
 * Motor de distribución financiera basado en perfil de usuario.
 *
 * Orquesta el cálculo completo:
 *   1. Porcentajes de necesidades y ahorro desde profileCalculator
 *   2. Porcentaje de deseos como residuo (100 - needs - savings)
 *   3. Distribución de deseos con pesos INE normalizados
 *   4. Construcción del objeto de categorías con importes
 *   5. Identificación del modelo financiero más cercano
 *   6. Evaluación de alertas por categoría y bloque
 *   7. Indicadores transversales (DTI, seguros)
 *
 * Garantiza que totalCheck ≈ 100%.
 */

import { calculateCategoryPercentages } from "./profileCalculator";
import { CATEGORIES_CATALOG } from "../models/categories";

// ─── Modelos de referencia para comparación informativa ──────────────────────
// Solo se muestran como dato educativo, no condicionan el cálculo.

const REFERENCE_MODELS = [
  { id: "50_30_20", label: "Regla 50/30/20", needs: 50, wants: 30, savings: 20 },
  { id: "60_20_20", label: "Regla 60/20/20", needs: 60, wants: 20, savings: 20 },
  { id: "70_20_10", label: "Regla 70/20/10", needs: 70, wants: 10, savings: 20 },
  { id: "80_20",    label: "Regla 80/20",    needs: 80, wants: 0,  savings: 20 }
];

// ─── Funciones privadas ───────────────────────────────────────────────────────

/**
 * Encuentra el modelo financiero de referencia más próximo al resultado del usuario.
 * Usa distancia euclidiana en el espacio (needs%, wants%, savings%).
 */
function findClosestModel(needsPct, wantsPct, savingsPct) {
  let closest = REFERENCE_MODELS[0];
  let minDist = Infinity;
  for (const model of REFERENCE_MODELS) {
    const dist = Math.sqrt(
      Math.pow(needsPct   - model.needs,   2) +
      Math.pow(wantsPct   - model.wants,   2) +
      Math.pow(savingsPct - model.savings,  2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = model;
    }
  }
  return closest;
}

/**
 * Evalúa alertas por exceso en necesidades y por exceso o defecto en bloques.
 * Recibe los porcentajes agrupados: { needs: {...}, wants: {...}, savings: {...} }.
 * Devuelve { categoryId: { level, message } } más claves de bloque (_wants_block, etc.).
 */
function evaluateAlerts(groupedPct) {
  const alerts = {};

  const wantsTotal   = Object.values(groupedPct.wants   || {}).reduce((s, v) => s + v, 0);
  const savingsTotal = Object.values(groupedPct.savings  || {}).reduce((s, v) => s + v, 0);

  // Configuración de umbrales y mensajes para categorías de necesidades
  const needsAlertConfig = {
    housing: {
      mild: 35, severe: 40, critical: 40,
      labels: {
        mild:     "Tu gasto en vivienda supera el techo prudencial del Banco de España",
        severe:   "Tu gasto en vivienda supera el techo del BdE",
        critical: "Tu gasto en vivienda supera el umbral de sobrecarga oficial de la UE (Eurostat)"
      }
    },
    utilities: {
      mild: 10, severe: 13,
      labels: {
        mild:   "Tu gasto en suministros roza el umbral de pobreza energética de la UE",
        severe: "Tu gasto en suministros es excesivo para cualquier perfil"
      }
    },
    groceries: {
      mild: 20, severe: 25,
      labels: {
        mild:   "Tu gasto en alimentación supera la media española del INE",
        severe: "Tu gasto en alimentación es significativamente elevado"
      }
    },
    transport: {
      mild: 18, severe: 22,
      labels: {
        mild:   "Tu gasto en transporte supera el rango habitual",
        severe: "Tu gasto en transporte es desproporcionado para cualquier perfil"
      }
    },
    health: {
      mild: 10, severe: 13,
      labels: {
        mild:   "Tu gasto en salud es elevado",
        severe: "Tu gasto en salud supera el umbral de dificultad financiera de la OMS"
      }
    },
    education: {
      mild: 20, severe: 25,
      labels: {
        mild:   "Tu gasto en educación es elevado",
        severe: "Tu gasto en educación compromete otras categorías esenciales"
      }
    }
  };

  for (const [id, cfg] of Object.entries(needsAlertConfig)) {
    const pct = groupedPct.needs?.[id] ?? 0;
    if (cfg.critical && pct > cfg.critical) {
      alerts[id] = { level: "critical", message: cfg.labels.critical };
    } else if (pct > cfg.severe) {
      alerts[id] = { level: "severe",   message: cfg.labels.severe };
    } else if (pct > cfg.mild) {
      alerts[id] = { level: "mild",     message: cfg.labels.mild };
    }
  }

  // Alerta de bloque deseos por exceso
  if (wantsTotal > 38) {
    alerts._wants_block = { level: "severe", message: "Tus gastos discrecionales comprometen necesidades y ahorro" };
  } else if (wantsTotal > 30) {
    alerts._wants_block = { level: "mild",   message: "Tus gastos discrecionales superan el límite recomendado" };
  }

  // Alerta de bloque ahorro por defecto
  if (savingsTotal < 5) {
    alerts._savings_block = { level: "severe", message: "Tu tasa de ahorro es críticamente baja" };
  } else if (savingsTotal < 10) {
    alerts._savings_block = { level: "mild",   message: "Tu tasa de ahorro está por debajo de lo recomendado" };
  }

  return alerts;
}

/**
 * Calcula indicadores transversales: ratio de deuda (DTI proxy) y total de seguros.
 */
function calculateTransversal(groupedPct, income) {
  // DTI proxy: debt_extra como indicador de deuda activa
  // (se expandirá cuando se desglosen subcategorías de deuda)
  const dtiProxy = groupedPct.savings?.debt_extra ?? 0;

  // Seguros: solo life_insurance es explícita ahora; se añadirán más cuando haya desglose
  const insuranceTotal = groupedPct.savings?.life_insurance ?? 0;

  return {
    dti: {
      total:    parseFloat(dtiProxy.toFixed(2)),
      amount:   parseFloat(((dtiProxy / 100) * income).toFixed(2)),
      mild:     35,
      severe:   40,
      critical: 50
    },
    insurance: {
      total:  parseFloat(insuranceTotal.toFixed(2)),
      amount: parseFloat(((insuranceTotal / 100) * income).toFixed(2))
    }
  };
}

// ─── Función exportada principal ─────────────────────────────────────────────

/**
 * Calcula la distribución financiera completa según perfil e ingreso.
 *
 * @param {object} profile - Perfil del usuario (de ProfilePage o TEST_PROFILE)
 * @param {number} income  - Ingreso neto mensual en euros
 * @returns {object} Resultado completo con categories, blocks, closestModel, alerts, transversal
 */
export function calculateDistribution(profile, income) {
  // 1. Porcentajes de necesidades y ahorro según perfil
  const { needs: needsPct, savings: savingsPct, phase } = calculateCategoryPercentages(profile);

  const totalNeeds   = Object.values(needsPct).reduce((s, v) => s + v, 0);
  const totalSavings = Object.values(savingsPct).reduce((s, v) => s + v, 0);

  // 2. El bloque de deseos absorbe el residuo hasta 100%
  let totalWants = parseFloat((100 - totalNeeds - totalSavings).toFixed(4));

  // 3. Rebalanceo de emergencia: si el residuo es negativo, fijamos deseos a 0
  //    (En fases posteriores se recortarán partidas de ahorro no esenciales)
  if (totalWants < 0) totalWants = 0;

  // 4. Distribuir el bloque de deseos con pesos INE normalizados
  const wantsCatalog  = CATEGORIES_CATALOG.filter((c) => c.block === "wants");
  const totalWeight   = wantsCatalog.reduce((s, c) => s + (c.ineWeight ?? 0), 0);
  const wantsPct = {};
  for (const cat of wantsCatalog) {
    wantsPct[cat.id] = parseFloat(((cat.ineWeight / totalWeight) * totalWants).toFixed(4));
  }

  // 5. Mapa plano de todos los porcentajes por categoría
  const allPct = { ...needsPct, ...wantsPct, ...savingsPct };

  // 6. Construir objeto de categorías con importe calculado
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
      percentage:           parseFloat(pct.toFixed(2)),
      amount:               parseFloat(((pct / 100) * income).toFixed(2)),
      healthyRange:         cat.healthyRange,
      alertThresholds:      cat.alerts,        // umbrales del catálogo (no confundir con alerts del resultado)
      ineReference:         cat.ineReference,
      referenceSource:      cat.referenceSource,
      referenceReliability: cat.referenceReliability
    };
  }

  // 7. Totales por bloque
  const blocks = {
    needs:   { label: "Necesidades", percentage: parseFloat(totalNeeds.toFixed(2)),   amount: parseFloat(((totalNeeds   / 100) * income).toFixed(2)) },
    wants:   { label: "Deseos",      percentage: parseFloat(totalWants.toFixed(2)),   amount: parseFloat(((totalWants   / 100) * income).toFixed(2)) },
    savings: { label: "Ahorro",      percentage: parseFloat(totalSavings.toFixed(2)), amount: parseFloat(((totalSavings / 100) * income).toFixed(2)) }
  };

  // 8. Verificación de suma (debería ser 100 ± redondeo)
  const totalCheck = parseFloat((totalNeeds + totalWants + totalSavings).toFixed(2));

  // 9. Modelo de referencia más cercano
  const closestModel = findClosestModel(totalNeeds, totalWants, totalSavings);

  // 10. Alertas por categoría y por bloque
  const groupedPct = { needs: needsPct, wants: wantsPct, savings: savingsPct };
  const alerts = evaluateAlerts(groupedPct);

  // 11. Indicadores transversales
  const transversal = calculateTransversal(groupedPct, income);

  return {
    income,
    phase,
    profile,
    blocks,
    categories,
    closestModel,
    alerts,
    transversal,
    totalCheck
  };
}
