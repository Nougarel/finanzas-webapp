/**
 * Definición de modelos financieros como objetos de datos
 *
 * Cada modelo representa una estrategia de distribución de ingresos.
 * Los modelos se definen como datos, no como lógica, para permitir
 * extensibilidad sin modificar el motor de cálculo.
 */
import { getCategoriesByIds } from "./categories";

/**
 * Modelo financiero 50/30/20
 * - 50% Necesidades (Needs)
 * - 30% Deseos (Wants)
 * - 20% Ahorros e inversiones (Savings)
 */
const model_50_30_20 = {
  // Identificador único del modelo
  id: "50_30_20",

  // Nombre legible del modelo
  name: "Regla 50/30/20",

  // Descripción breve
  description: "Modelo clásico de distribución equilibrada: 50% necesidades, 30% gustos, 20% ahorro",

  // Tipo de modelo (por ahora solo porcentaje, preparado para futuros tipos)
  type: "percentage",

  // Bloques macro de distribución
  blocks: [
    {
      key: "needs",
      label: "Necesidades",
      percentage: 0.5, // 50%
      description: "Gastos esenciales: vivienda, comida, transporte, seguros",
      type: "expense",
      categoryIds: ["housing","utilities","groceries","transport","insurance","health","education","debt_minimum"]
    },
    {
      key: "wants",
      label: "Deseos",
      percentage: 0.3, // 30%
      description: "Gastos no esenciales: entretenimiento, hobbies, lujos",
      type: "expense",
      categoryIds: ["dining_out","entertainment","subscriptions","travel","clothing","hobbies","personal_care","gifts_donations"]
    },
    {
      key: "savings",
      label: "Ahorros",
      percentage: 0.2, // 20%
      description: "Ahorro, inversiones, fondo de emergencia",
      type: "savings",
      categoryIds: ["emergency_fund","short_term_savings","long_term_savings","investment","debt_extra"]
    }
  ]
};

/**
 * Modelo financiero 70/20/10
 * - 70% Gastos de vida (necesidades + discrecional del día a día)
 * - 20% Ahorro e inversiones
 * - 10% Deudas o donaciones
 */
const model_70_20_10 = {
  id: "70_20_10",
  name: "Regla 70/20/10",
  description: "Modelo para quienes tienen gastos fijos elevados: 70% gastos de vida, 20% ahorro, 10% deudas o donaciones",
  type: "percentage",
  blocks: [
    {
      key: "living",
      label: "Gastos de vida",
      percentage: 0.7, // 70%
      description: "Necesidades y gastos discrecionales del día a día",
      type: "expense",
      categoryIds: ["housing","utilities","groceries","transport","insurance","health","education","debt_minimum","dining_out","entertainment","subscriptions","clothing","hobbies","personal_care"]
    },
    {
      key: "savings",
      label: "Ahorro",
      percentage: 0.2, // 20%
      description: "Ahorro, inversiones y fondo de emergencia",
      type: "savings",
      categoryIds: ["emergency_fund","short_term_savings","long_term_savings","investment"]
    },
    {
      key: "debt",
      label: "Deudas / Extras",
      percentage: 0.1, // 10%
      description: "Pago de deudas, donaciones o gastos extraordinarios",
      type: "savings",
      categoryIds: ["debt_extra","gifts_donations"]
    }
  ]
};

/**
 * Modelo financiero 60/20/20
 * Variante conservadora del 50/30/20, pensada para contextos de alto coste de vida
 * - 60% Necesidades
 * - 20% Deseos
 * - 20% Ahorros
 */
const model_60_20_20 = {
  id: "60_20_20",
  name: "Regla 60/20/20",
  description: "Variante conservadora para contextos de alto coste de vida: 60% necesidades, 20% deseos, 20% ahorro",
  type: "percentage",
  blocks: [
    {
      key: "needs",
      label: "Necesidades",
      percentage: 0.6, // 60%
      description: "Gastos esenciales: vivienda, comida, transporte, seguros y pagos mínimos de deuda",
      type: "expense",
      categoryIds: ["housing","utilities","groceries","transport","insurance","health","education","debt_minimum"]
    },
    {
      key: "wants",
      label: "Deseos",
      percentage: 0.2, // 20%
      description: "Gastos no esenciales: entretenimiento, hobbies, compras discrecionales",
      type: "expense",
      categoryIds: ["dining_out","entertainment","subscriptions","travel","clothing","hobbies","personal_care","gifts_donations"]
    },
    {
      key: "savings",
      label: "Ahorros",
      percentage: 0.2, // 20%
      description: "Ahorro, inversiones y fondo de emergencia",
      type: "savings",
      categoryIds: ["emergency_fund","short_term_savings","long_term_savings","investment","debt_extra"]
    }
  ]
};

/**
 * Modelo financiero 80/20 — Pay Yourself First (Págate primero)
 * Filosofía de ahorro automático: el 20% se aparta nada más cobrar
 * y el 80% restante se gestiona con libertad total
 * - 80% Gastos (necesidades + deseos combinados)
 * - 20% Ahorros prioritarios
 */
const model_80_20 = {
  id: "80_20",
  name: "Regla 80/20 — Págate primero",
  description: "Prioriza el ahorro automático: aparta el 20% nada más cobrar y gasta el 80% restante con libertad",
  type: "percentage",
  blocks: [
    {
      key: "expenses",
      label: "Gastos",
      percentage: 0.8, // 80%
      description: "Necesidades y deseos combinados: el usuario decide cómo distribuir este bloque internamente",
      type: "expense",
      categoryIds: ["housing","utilities","groceries","transport","insurance","health","education","debt_minimum","dining_out","entertainment","subscriptions","travel","clothing","hobbies","personal_care","gifts_donations"]
    },
    {
      key: "savings",
      label: "Ahorros",
      percentage: 0.2, // 20%
      description: "Ahorro e inversión prioritario, transferido automáticamente antes de cualquier gasto",
      type: "savings",
      categoryIds: ["emergency_fund","short_term_savings","long_term_savings","investment","debt_extra"]
    }
  ]
};

/**
 * Modelo financiero Solución del 60% (método de Richard Jenkins)
 * Alta resiliencia financiera mediante cinco bloques diferenciados
 * Separa el ahorro a corto y largo plazo para cubrir imprevistos sin desequilibrar el sistema
 * - 60% Gastos comprometidos (fijos e ineludibles)
 * - 10% Retiro (largo plazo)
 * - 10% Ahorro largo plazo (grandes metas)
 * - 10% Ahorro corto plazo (gastos irregulares)
 * - 10% Ocio y extras (gasto libre)
 */
const model_60_solution = {
  id: "60_solution",
  name: "Solución del 60%",
  description: "Modelo de alta resiliencia con cinco bloques que separa el ahorro a corto y largo plazo para evitar imprevistos",
  type: "percentage",
  blocks: [
    {
      key: "committed",
      label: "Gastos comprometidos",
      percentage: 0.6, // 60%
      description: "Vivienda, comida, transporte, seguros, impuestos y cualquier gasto fijo ineludible",
      type: "expense",
      categoryIds: ["housing","utilities","groceries","transport","insurance","health","education","debt_minimum"]
    },
    {
      key: "retirement",
      label: "Retiro",
      percentage: 0.1, // 10%
      description: "Aportaciones a planes de pensiones, fondos de inversión a largo plazo",
      type: "savings",
      categoryIds: ["investment"]
    },
    {
      key: "long_term",
      label: "Ahorro largo plazo",
      percentage: 0.1, // 10%
      description: "Fondo para grandes compras futuras: vivienda, vehículo, estudios",
      type: "savings",
      categoryIds: ["long_term_savings","debt_extra"]
    },
    {
      key: "short_term",
      label: "Ahorro corto plazo",
      percentage: 0.1, // 10%
      description: "Gastos irregulares previsibles: vacaciones, reparaciones, regalos, revisiones médicas",
      type: "savings",
      categoryIds: ["emergency_fund","short_term_savings"]
    },
    {
      key: "fun",
      label: "Ocio y extras",
      percentage: 0.1, // 10%
      description: "Gasto puramente discrecional sin seguimiento ni restricción",
      type: "expense",
      categoryIds: ["dining_out","entertainment","subscriptions","travel","clothing","hobbies","personal_care","gifts_donations"]
    }
  ]
};

/**
 * Registro de todos los modelos disponibles
 * Centraliza el acceso a modelos financieros
 */
const FINANCIAL_MODELS = {
  "50_30_20":    model_50_30_20,
  "70_20_10":    model_70_20_10,
  "60_20_20":    model_60_20_20,
  "80_20":       model_80_20,
  "60_solution": model_60_solution
};

/**
 * Obtiene un modelo financiero por su ID
 * Devuelve null si el modelo no existe, sin lanzar excepción,
 * para que el llamador pueda decidir cómo manejar el caso
 * @param {string} modelId - Identificador del modelo
 * @returns {object|null} Modelo financiero, o null si no existe
 */
export function getFinancialModel(modelId) {
  return FINANCIAL_MODELS[modelId] || null;
}

/**
 * Obtiene el modelo financiero por defecto
 * @returns {object} Modelo financiero por defecto (50/30/20)
 */
export function getDefaultFinancialModel() {
  return model_50_30_20;
}

/**
 * Obtiene la lista de todos los modelos disponibles
 * @returns {Array} Array de modelos financieros
 */
export function getAllFinancialModels() {
  return Object.values(FINANCIAL_MODELS);
}

/**
 * Devuelve el modelo con cada bloque hidratado: el campo `categories` contiene
 * los objetos completos del catálogo correspondientes a los IDs del bloque.
 * Devuelve null si el modelo no existe.
 * @param {string} modelId
 * @returns {object|null}
 */
export function getModelWithCategories(modelId) {
  const model = FINANCIAL_MODELS[modelId];
  if (!model) return null;

  return {
    ...model,
    blocks: model.blocks.map((block) => ({
      ...block,
      categories: getCategoriesByIds(block.categoryIds || [])
    }))
  };
}

/**
 * Valida que un modelo financiero tenga la estructura correcta
 * @param {object} model - Modelo a validar
 * @returns {boolean} true si es válido
 * @throws {Error} Si el modelo no es válido
 */
export function validateFinancialModel(model) {
  if (!model.id || !model.name || !model.type || !model.blocks) {
    throw new Error("Modelo financiero incompleto");
  }

  if (!Array.isArray(model.blocks) || model.blocks.length === 0) {
    throw new Error("El modelo debe tener al menos un bloque");
  }

  // Validar que los porcentajes sumen 1 (100%)
  const totalPercentage = model.blocks.reduce((sum, block) => sum + block.percentage, 0);
  if (Math.abs(totalPercentage - 1) > 0.001) { // Tolerancia para errores de punto flotante
    throw new Error(`Los porcentajes deben sumar 100% (actual: ${totalPercentage * 100}%)`);
  }

  return true;
}
