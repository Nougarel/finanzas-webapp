"use client";

import { CalculationLoader } from "@/components/ui/calculation-loader";

/**
 * BaseLoader — adaptador del loader de producción para la galería.
 *
 * fullChrome=true en el registry: LoaderStage lo envuelve con scale-[0.65]
 * para que encaje en la card sin recortar el chrome completo del componente.
 *
 * CONTRATO (adaptado — este loader no usa progress/phase, tiene su propio reloj):
 * @param {"direct"|"inverse"|"diagnosis"} flow
 * @param {boolean} isApiDone
 */
export function BaseLoader({ flow, isApiDone }) {
  return <CalculationLoader flow={flow} isApiDone={isApiDone} />;
}
