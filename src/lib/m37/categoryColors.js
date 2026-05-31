/**
 * categoryColors.js — Paleta de 3 colores navy por bloque financiero (M37 §12.2 rev).
 *
 * Estrategia revisada (M37 iteración navy-bars): se abandona la paleta multicolor
 * por bloque y se adopta un único hue navy (264.5°) con 3 niveles de luminosidad.
 * Las categorías dentro de un bloque se distinguen por el label, no por el color.
 *
 * Todos los colores verificados con contraste ≥ 3:1 sobre blanco (--card: oklch(1 0 0))
 * mediante medición empírica WCAG 2.1 en Chromium (canvas getImageData):
 *   - needs   L=0.25 → contraste 16.13:1 (AAA — coincide con --primary)
 *   - savings L=0.48 → contraste  6.59:1 (AA)
 *   - wants   L=0.65 → contraste  3.25:1 (pasa WCAG 1.4.11 ≥ 3:1 para componentes)
 *
 * Nota ADR: la política "un único navy" (ADR-12) aplica a texto importante y elementos
 * de marca (foreground tokens). Los tokens chart son específicamente para visualizaciones
 * de datos y SÍ pueden tener variantes del navy. Estos 3 azules son los únicos colores
 * de datos que se usan en el DashboardPanel.
 *
 * Uso:
 *   import { BLOCK_COLORS } from "@/lib/m37/categoryColors";
 *   const color = BLOCK_COLORS[cat.block] ?? BLOCK_COLORS._fallback;
 */

export const BLOCK_COLORS = {
  // Navy más oscuro — Necesidades (imprescindible). Coincide con --primary y --chart-1.
  needs:   "oklch(0.25 0.055 264.5)",

  // Navy intermedio — Ahorro (crecimiento/futuro). Coincide con --chart-3.
  savings: "oklch(0.48 0.055 264.5)",

  // Navy más claro — Deseos (discrecional). Coincide con --chart-2.
  wants:   "oklch(0.65 0.055 264.5)",

  // Fallback para bloque desconocido
  _fallback: "oklch(0.48 0.055 264.5)",
};
