import 'server-only';

import solver from 'javascript-lp-solver';

/**
 * Resuelve la distribución financiera óptima usando programación lineal (Goal Programming).
 *
 * @param {Array<{ categoryId: string, target: number }>} categoryTargets
 * @param {Array<object>} categoryConfigs - Categorías de CATEGORIES_CATALOG (solo needs y savings)
 * @param {object} [options]
 * @param {object} [options.fixedCategories] - { [catId]: percentage } — fija exactamente ese porcentaje
 * @param {number} [options.minWantsPercentage] - mínimo que debe ir a deseos (suma wants especificados)
 * @param {object} [options.lpWeightOverrides] - { [catId]: weight } — sobrescribe el peso lpWeight de la categoría
 * @param {object} [options.factibleMaxOverrides] - { [catId]: max } — sobrescribe el factibleMax estático del catálogo
 * @param {number} [options.wantsFloor=10] - suelo rígido del bloque deseos en %. Default 10 (flujo directo); el flujo inverso pasa 0
 * @returns {{ feasible: boolean, distribution?: object, error?: string }}
 */
export function solveDistribution(categoryTargets, categoryConfigs, options = {}) {
  const {
    fixedCategories      = {},
    minWantsPercentage   = 0,
    lpWeightOverrides    = {},
    factibleMaxOverrides = {},
    wantsFloor           = 10,
  } = options;

  const needs   = categoryConfigs.filter(c => c.block === 'needs');
  const savings = categoryConfigs.filter(c => c.block === 'savings');

  const variables   = {};
  const constraints = {};

  constraints.budget   = { equal: 100 };
  constraints.wants_ub = { max: 80 };
  // Suelo mínimo de deseos: wantsFloor (10% por defecto en el flujo directo), o el
  // mínimo fijado por el usuario si es mayor. El flujo inverso pasa wantsFloor = 0
  // para eliminar el suelo rígido y dejar que el target INE actúe como criterio blando.
  const effectiveWantsMin = Math.max(wantsFloor, minWantsPercentage || 0);
  constraints.wants_lb = { min: effectiveWantsMin };

  // ── Necesidades ──────────────────────────────────────────────────────────────
  for (const cat of needs) {
    const isFixed = cat.id in fixedCategories;
    const rawTarget = isFixed
      ? fixedCategories[cat.id]
      : (categoryTargets.find(ct => ct.categoryId === cat.id)?.target ?? 0);

    // Para categorías fijadas, los límites factibles se reemplazan por el valor exacto
    const effectiveMin = isFixed ? fixedCategories[cat.id] : cat.factibleMin;
    const effectiveMax = isFixed
      ? fixedCategories[cat.id]
      : (factibleMaxOverrides[cat.id] ?? cat.factibleMax);
    const target = Math.min(Math.max(rawTarget, effectiveMin), effectiveMax);

    constraints[`ub_${cat.id}`]  = { max: effectiveMax };
    if (effectiveMin > 0) {
      constraints[`lb_${cat.id}`] = { min: effectiveMin };
    }
    constraints[`dev_${cat.id}`] = { equal: target };

    variables[`x_${cat.id}`] = {
      objective:          0,
      budget:             1,
      [`ub_${cat.id}`]:   1,
      [`dev_${cat.id}`]:  1,
      ...(effectiveMin > 0 ? { [`lb_${cat.id}`]: 1 } : {}),
    };
    variables[`dp_${cat.id}`] = { objective: 100, [`dev_${cat.id}`]: -1 };
    variables[`dm_${cat.id}`] = { objective: 100, [`dev_${cat.id}`]:  1 };
  }

  // ── Ahorro ────────────────────────────────────────────────────────────────────
  for (const cat of savings) {
    const isFixed = cat.id in fixedCategories;
    const rawTarget = isFixed
      ? fixedCategories[cat.id]
      : (categoryTargets.find(ct => ct.categoryId === cat.id)?.target ?? 0);

    const effectiveMin = isFixed ? fixedCategories[cat.id] : cat.factibleMin;
    const effectiveMax = isFixed
      ? fixedCategories[cat.id]
      : (factibleMaxOverrides[cat.id] ?? cat.factibleMax);
    const w = lpWeightOverrides[cat.id] ?? cat.lpWeight ?? 1;
    const target = Math.min(Math.max(rawTarget, effectiveMin), effectiveMax);

    constraints[`ub_${cat.id}`]  = { max: effectiveMax };
    if (effectiveMin > 0) {
      constraints[`lb_${cat.id}`] = { min: effectiveMin };
    }
    constraints[`dev_${cat.id}`] = { equal: target };

    variables[`x_${cat.id}`] = {
      objective:          0,
      budget:             1,
      [`ub_${cat.id}`]:   1,
      [`dev_${cat.id}`]:  1,
      ...(effectiveMin > 0 ? { [`lb_${cat.id}`]: 1 } : {}),
    };
    variables[`sp_${cat.id}`] = { objective: -2,      [`dev_${cat.id}`]: -1 };
    variables[`sm_${cat.id}`] = { objective:  50 * w, [`dev_${cat.id}`]:  1 };
  }

  // ── Deseos (residuo con posible mínimo garantizado) ────────────────────────
  variables.x_wants = {
    objective: -1,
    budget:    1,
    wants_ub:  1,
    wants_lb:  1,
  };

  const model = {
    optimize:    'objective',
    opType:      'min',
    constraints,
    variables,
  };

  const result = solver.Solve(model);

  if (!result.feasible) {
    return { feasible: false, error: 'No se encontró una distribución factible con los parámetros dados' };
  }

  const distribution = {};
  for (const cat of [...needs, ...savings]) {
    distribution[cat.id] = Math.max(0, parseFloat((result[`x_${cat.id}`] ?? 0).toFixed(4)));
  }
  distribution.wants = Math.max(0, parseFloat((result.x_wants ?? 0).toFixed(4)));

  return { feasible: true, distribution };
}
