/**
 * Motor de evaluación de salud financiera
 *
 * Módulo completamente independiente de la UI.
 * No conoce React, Next.js, formularios ni componentes.
 * Solo recibe datos y devuelve el diagnóstico.
 */

/**
 * Claves de bloques que se consideran de ahorro.
 *
 * NOTA TÉCNICA: Esta es una solución provisional basada en convención de nomenclatura.
 * En el futuro, los modelos financieros tendrán un campo `blockType: "savings" | "spending"`
 * explícito en su definición en financialModels.js, eliminando la necesidad de esta heurística.
 */
const SAVINGS_BLOCK_KEYS = ["saving", "retirement", "long_term", "short_term"];

/**
 * Determina si un bloque es de ahorro según la convención de nomenclatura de su key.
 * @param {string} key - Clave del bloque (ej: "savings", "retirement", "needs")
 * @returns {boolean}
 */
function isSavingsBlock(key) {
  return SAVINGS_BLOCK_KEYS.some((savingsKey) => key.includes(savingsKey));
}

/**
 * Clasifica el estado de salud de un bloque según su desviación respecto al ideal.
 *
 * La lógica difiere según el tipo de bloque:
 * - Gasto:  superar el ideal es negativo (warning/critical si deviation > 0)
 * - Ahorro: quedar por debajo del ideal es negativo (warning/critical si deviation < 0)
 *
 * @param {number} deviation - Desviación relativa (realAmount - idealAmount) / idealAmount
 * @param {boolean} isBlockSavings - Si el bloque es de tipo ahorro
 * @returns {{ status: string, statusLabel: string, direction: string }}
 */
function classifyBlockStatus(deviation, isBlockSavings) {
  const HEALTHY_THRESHOLD = 0.05;  // ±5%
  const WARNING_THRESHOLD = 0.15;  // ±15%

  // Dirección de la desviación — independiente del tipo de bloque
  let direction;
  if (deviation > HEALTHY_THRESHOLD) {
    direction = "over";   // gasta/ahorra más de lo ideal
  } else if (deviation < -HEALTHY_THRESHOLD) {
    direction = "under";  // gasta/ahorra menos de lo ideal
  } else {
    direction = "balanced";
  }

  // Estado de salud — depende del tipo de bloque
  let status, statusLabel;

  if (direction === "balanced") {
    status = "healthy";
    statusLabel = "Saludable";
  } else if (isBlockSavings) {
    // Para ahorro: "under" (ahorra menos) es negativo; "over" (ahorra más) es positivo
    if (direction === "under") {
      status = deviation < -WARNING_THRESHOLD ? "critical" : "warning";
      statusLabel = deviation < -WARNING_THRESHOLD ? "Crítico" : "Atención";
    } else {
      // Ahorrar más de lo recomendado no es un problema
      status = "healthy";
      statusLabel = "Saludable";
    }
  } else {
    // Para gasto: "over" (gasta más) es negativo; "under" (gasta menos) no es un problema
    if (direction === "over") {
      status = deviation > WARNING_THRESHOLD ? "critical" : "warning";
      statusLabel = deviation > WARNING_THRESHOLD ? "Crítico" : "Atención";
    } else {
      // Gastar menos de lo presupuestado en un bloque de gasto no es negativo
      status = "healthy";
      statusLabel = "Saludable";
    }
  }

  return { status, statusLabel, direction };
}

/**
 * Evalúa la salud financiera del usuario comparando su distribución real
 * con la distribución ideal según el modelo financiero activo.
 *
 * @param {object} params
 * @param {Array}  params.idealDistribution - Array de bloques del resultado de calculateDistribution (directo)
 * @param {object} params.realAmounts - Objeto { [block.key]: number } con importes reales del usuario
 * @param {number} params.income - Ingreso mensual del usuario
 * @param {object} params.model - Modelo financiero activo { id, name, description }
 * @returns {object} Diagnóstico completo de salud financiera
 */
export function evaluateFinancialHealth({ idealDistribution, realAmounts, income, model }) {
  // Validar parámetros de entrada
  if (!idealDistribution || !Array.isArray(idealDistribution)) {
    throw new Error("Se requiere la distribución ideal calculada");
  }
  if (!realAmounts || typeof realAmounts !== "object") {
    throw new Error("Se requieren los importes reales por bloque");
  }
  if (!income || typeof income !== "number" || income <= 0) {
    throw new Error("Se requiere un ingreso mensual válido");
  }

  // Validar que realAmounts contiene un valor por cada bloque y que son números no negativos
  for (const block of idealDistribution) {
    if (!(block.key in realAmounts)) {
      throw new Error(`Falta el importe real para el bloque "${block.label}"`);
    }
    const value = realAmounts[block.key];
    if (typeof value !== "number" || isNaN(value) || value < 0) {
      throw new Error(`El importe real para "${block.label}" debe ser un número no negativo`);
    }
  }

  // Evaluar cada bloque individualmente
  const blocks = idealDistribution.map((idealBlock) => {
    const idealAmount = idealBlock.amount; // valor exacto, no redondeado
    const realAmount = realAmounts[idealBlock.key];

    // Desviación relativa: positivo = gasta/ahorra más; negativo = gasta/ahorra menos
    const deviation = (realAmount - idealAmount) / idealAmount;

    // Redondear a un decimal para mostrar en la UI (ej: 12.3%)
    const deviationPercentage = Math.round(deviation * 1000) / 10;

    const blockIsSavings = isSavingsBlock(idealBlock.key);
    const { status, statusLabel, direction } = classifyBlockStatus(deviation, blockIsSavings);

    return {
      key: idealBlock.key,
      label: idealBlock.label,
      description: idealBlock.description,
      percentage: idealBlock.percentage,
      idealAmount: idealAmount,
      realAmount: realAmount,
      deviation: deviation,
      deviationPercentage: deviationPercentage,
      status: status,
      statusLabel: statusLabel,
      direction: direction,
      // Campo adicional para que la UI pueda construir mensajes contextuales
      // sin reimplementar la lógica de identificación de bloques de ahorro
      blockType: blockIsSavings ? "savings" : "spending"
    };
  });

  // Estado global: el peor estado de todos los bloques determina el estado general
  const STATUS_PRIORITY = { critical: 3, warning: 2, healthy: 1 };
  const overallStatus = blocks.reduce((worst, block) => {
    return STATUS_PRIORITY[block.status] > STATUS_PRIORITY[worst] ? block.status : worst;
  }, "healthy");

  // Contadores por estado
  const healthyBlocks = blocks.filter((b) => b.status === "healthy").length;
  const warningBlocks = blocks.filter((b) => b.status === "warning").length;
  const criticalBlocks = blocks.filter((b) => b.status === "critical").length;

  // Totales para referencia
  const totalReal = Object.values(realAmounts).reduce((sum, v) => sum + v, 0);
  const totalIdeal = idealDistribution.reduce((sum, b) => sum + b.amount, 0);

  // Tasa de ahorro real: suma de todos los bloques de tipo ahorro / ingreso
  const totalRealSavings = blocks
    .filter((b) => b.blockType === "savings")
    .reduce((sum, b) => sum + b.realAmount, 0);
  const savingsRate = income > 0 ? Math.round((totalRealSavings / income) * 1000) / 1000 : 0;

  return {
    model: model,
    income: income,
    blocks: blocks,
    summary: {
      overallStatus: overallStatus,
      healthyBlocks: healthyBlocks,
      warningBlocks: warningBlocks,
      criticalBlocks: criticalBlocks,
      totalReal: totalReal,
      totalIdeal: totalIdeal,
      savingsRate: savingsRate,
      calculatedAt: new Date().toISOString()
    }
  };
}
