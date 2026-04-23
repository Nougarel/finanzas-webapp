/**
 * Motor de cálculo de distribución financiera
 *
 * Este módulo es completamente independiente de la UI.
 * No conoce React, Next.js, formularios ni componentes.
 * Solo recibe datos y devuelve resultados.
 *
 * Soporta dos tipos de cálculo:
 * - Directo: Dado un ingreso, calcula la distribución
 * - Inverso: Dadas cantidades deseadas, calcula el ingreso necesario (futuro)
 */

/**
 * Calcula la distribución financiera según el modelo y tipo de cálculo
 *
 * @param {object} params - Parámetros de cálculo
 * @param {string} params.calculationType - Tipo: "direct" | "inverse"
 * @param {number} [params.income] - Ingreso mensual (requerido para cálculo directo)
 * @param {object} [params.desiredAmounts] - Cantidades deseadas por bloque (requerido para inverso)
 * @param {object} params.model - Modelo financiero a usar
 * @param {string} [params.mode] - Modo inverso: "auto" | "manual" (solo relevante para inverse)
 * @returns {object} Resultado del cálculo
 */
export function calculateDistribution({
  calculationType,
  income,
  desiredAmounts,
  model,
  mode
}) {
  // Validar parámetros básicos
  if (!calculationType) {
    throw new Error("Se requiere especificar el tipo de cálculo");
  }

  if (!model || !model.blocks) {
    throw new Error("Se requiere un modelo financiero válido");
  }

  // Enrutar al tipo de cálculo correspondiente
  switch (calculationType) {
    case "direct":
      return calculateDirectDistribution(income, model);

    case "inverse":
      return calculateInverseDistribution(desiredAmounts, model, mode || "manual");

    default:
      throw new Error(`Tipo de cálculo desconocido: ${calculationType}`);
  }
}

/**
 * Cálculo directo: Ingreso → Distribución
 *
 * Dado un ingreso mensual, calcula cuánto debe asignarse a cada bloque
 * según los porcentajes del modelo financiero.
 *
 * @param {number} income - Ingreso mensual
 * @param {object} model - Modelo financiero
 * @returns {object} Distribución calculada
 */
function calculateDirectDistribution(income, model) {
  // Validar ingreso
  if (income === undefined || income === null) {
    throw new Error("Se requiere especificar el ingreso");
  }

  if (typeof income !== 'number' || income <= 0) {
    throw new Error("El ingreso debe ser un número mayor que 0");
  }

  // Calcular cantidad para cada bloque
  const distribution = model.blocks.map(block => {
    const amount = income * block.percentage;

    return {
      key: block.key,
      label: block.label,
      description: block.description,
      percentage: block.percentage,
      amount: amount,
      // Formatear para mostrar en UI (redondeado a 2 decimales)
      formattedAmount: Math.round(amount * 100) / 100
    };
  });

  // Calcular total asignado (debería ser igual al ingreso)
  const totalAssigned = distribution.reduce((sum, block) => sum + block.amount, 0);

  // Preparar resultado completo
  const result = {
    // Información de entrada
    input: {
      income: income,
      calculationType: "direct"
    },

    // Modelo usado
    model: {
      id: model.id,
      name: model.name,
      description: model.description
    },

    // Distribución calculada
    distribution: distribution,

    // Resumen
    summary: {
      totalIncome: income,
      totalAssigned: totalAssigned,
      // Diferencia por redondeos (debería ser cercana a 0)
      difference: income - totalAssigned
    },

    // Metadata
    calculatedAt: new Date().toISOString()
  };

  return result;
}

/**
 * Cálculo inverso: Distribución deseada → Ingreso necesario
 *
 * Soporta dos modos:
 *
 * Modo "auto": el usuario solo introduce los gastos (bloques type="expense").
 *   fórmula: requiredIncome = totalExpenseDesired / (1 - totalSavingsPercentage)
 *   Los bloques de ahorro se derivan automáticamente y se marcan con isAutoCalculated=true.
 *
 * Modo "manual": el usuario introduce todos los bloques.
 *   fórmula clásica: requiredIncome = max(desiredAmount / percentage) para todos los bloques.
 *
 * @param {object} desiredAmounts - Objeto { [block.key]: number } con el importe deseado
 * @param {object} model - Modelo financiero
 * @param {string} mode - "auto" | "manual"
 * @returns {object} Resultado con ingreso necesario y distribución recomendada
 */
function calculateInverseDistribution(desiredAmounts, model, mode) {
  if (!desiredAmounts || typeof desiredAmounts !== "object") {
    throw new Error("Se requieren los importes deseados por bloque");
  }

  if (mode === "auto") {
    return calculateInverseAuto(desiredAmounts, model);
  }

  return calculateInverseManual(desiredAmounts, model);
}

/**
 * Modo auto: el usuario solo introduce gastos; los ahorros se derivan matemáticamente.
 */
function calculateInverseAuto(desiredAmounts, model) {
  const expenseBlocks = model.blocks.filter((b) => b.type === "expense");
  const savingsBlocks = model.blocks.filter((b) => b.type === "savings");

  // Validar solo los bloques de gasto
  for (const block of expenseBlocks) {
    if (!(block.key in desiredAmounts)) {
      throw new Error(`Falta el importe para el bloque "${block.label}"`);
    }
    const value = desiredAmounts[block.key];
    if (typeof value !== "number" || isNaN(value) || value <= 0) {
      throw new Error(`El importe para "${block.label}" debe ser un número mayor que 0`);
    }
  }

  const totalExpenseDesired = expenseBlocks.reduce(
    (sum, b) => sum + desiredAmounts[b.key],
    0
  );
  const totalSavingsPercentage = savingsBlocks.reduce((sum, b) => sum + b.percentage, 0);

  if (totalSavingsPercentage >= 1) {
    throw new Error("La suma de porcentajes de ahorro no puede ser igual o mayor al 100%");
  }

  const requiredIncome = totalExpenseDesired / (1 - totalSavingsPercentage);

  const distribution = model.blocks.map((block) => {
    const recommendedAmount = Math.round(requiredIncome * block.percentage * 100) / 100;
    const isAutoCalculated = block.type === "savings";
    const desiredAmount = isAutoCalculated ? recommendedAmount : desiredAmounts[block.key];
    const difference = Math.round((recommendedAmount - desiredAmount) * 100) / 100;

    return {
      key: block.key,
      label: block.label,
      description: block.description,
      percentage: block.percentage,
      desiredAmount: desiredAmount,
      recommendedAmount: recommendedAmount,
      difference: difference,
      isAutoCalculated: isAutoCalculated
    };
  });

  const totalDesired = expenseBlocks.reduce((sum, b) => sum + desiredAmounts[b.key], 0);

  return {
    input: { desiredAmounts, calculationType: "inverse", mode: "auto" },
    model: { id: model.id, name: model.name, description: model.description },
    distribution,
    summary: {
      requiredIncome: Math.round(requiredIncome * 100) / 100,
      totalDesired,
      mostRestrictiveBlock: null,
      mode: "auto",
      calculatedAt: new Date().toISOString()
    }
  };
}

/**
 * Modo manual: el usuario introduce todos los bloques; se usa el máximo como ingreso necesario.
 */
function calculateInverseManual(desiredAmounts, model) {
  for (const block of model.blocks) {
    if (!(block.key in desiredAmounts)) {
      throw new Error(`Falta el importe para el bloque "${block.label}"`);
    }
    const value = desiredAmounts[block.key];
    if (typeof value !== "number" || isNaN(value) || value <= 0) {
      throw new Error(`El importe para "${block.label}" debe ser un número mayor que 0`);
    }
  }

  let maxRequiredIncome = 0;
  let mostRestrictiveBlock = null;

  const blocksWithIncome = model.blocks.map((block) => {
    const requiredIncomeForBlock = desiredAmounts[block.key] / block.percentage;

    if (requiredIncomeForBlock > maxRequiredIncome) {
      maxRequiredIncome = requiredIncomeForBlock;
      mostRestrictiveBlock = block.key;
    }

    return { block, requiredIncomeForBlock };
  });

  const requiredIncome = maxRequiredIncome;

  const distribution = blocksWithIncome.map(({ block }) => {
    const desiredAmount = desiredAmounts[block.key];
    const recommendedAmount = Math.round(requiredIncome * block.percentage * 100) / 100;
    const difference = Math.round((recommendedAmount - desiredAmount) * 100) / 100;

    return {
      key: block.key,
      label: block.label,
      description: block.description,
      percentage: block.percentage,
      desiredAmount: desiredAmount,
      recommendedAmount: recommendedAmount,
      difference: difference,
      isAutoCalculated: false
    };
  });

  const totalDesired = Object.values(desiredAmounts).reduce((sum, v) => sum + v, 0);

  return {
    input: { desiredAmounts, calculationType: "inverse", mode: "manual" },
    model: { id: model.id, name: model.name, description: model.description },
    distribution,
    summary: {
      requiredIncome: Math.round(requiredIncome * 100) / 100,
      totalDesired,
      mostRestrictiveBlock,
      mode: "manual",
      calculatedAt: new Date().toISOString()
    }
  };
}

/**
 * Valida que un resultado de cálculo sea coherente
 * Útil para testing y debugging
 *
 * @param {object} result - Resultado del cálculo
 * @returns {boolean} true si es válido
 */
export function validateCalculationResult(result) {
  if (!result || !result.distribution || !result.summary) {
    return false;
  }

  // Verificar que la suma de cantidades sea coherente
  const calculatedTotal = result.distribution.reduce(
    (sum, block) => sum + block.amount,
    0
  );

  const difference = Math.abs(calculatedTotal - result.summary.totalIncome);

  // Tolerancia de 1 centavo por errores de redondeo
  return difference < 0.01;
}
