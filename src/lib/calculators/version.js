// src/lib/calculators/version.js

/**
 * Versión del motor de cálculo. Bumpear cuando cambie cualquiera de:
 *   - Pesos del LP solver (lpSolver.js)
 *   - Constantes de scaling por tramo (categories.js)
 *   - Factibles min/max de categorías (categories.js)
 *   - Lógica de targets por perfil (profileCalculator.js)
 *   - Fórmula del healthScore (evaluator.js)
 *
 * NO bumpear por:
 *   - Cambios de UI
 *   - Refactors sin cambio funcional
 *   - Fixes de bugs que restauran el comportamiento documentado
 *
 * Formato: 'YYYY.MM-vN'. Bump del N en cambios dentro del mismo mes.
 *
 * Esta constante se incluye en cada fila de app_interactions para permitir
 * segmentación de análisis longitudinal cuando el motor evolucione.
 */
export const ENGINE_VERSION = '2026.05-v1';
