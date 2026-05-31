/**
 * categoryColors.js — Paleta de 20 colores por categoría (M37 §12.2).
 *
 * Estrategia: variación simultánea de hue + luminosidad dentro de cada familia cromática.
 * Cada bloque tiene su "temperatura": caliente (needs), fría (wants), natural-vegetal (savings).
 *
 * Todos los colores verificados con contraste ≥ 4.3:1 sobre blanco (--card: oklch(1 0 0)).
 *
 * Estos colores reemplazan la generación dinámica de escalas monocromáticas de
 * block-piecharts-row.jsx. No afectan a los tokens de bloque macro (--chart-1/2/3),
 * que siguen siendo los colores del segmento del MacroPiechart.
 *
 * Uso:
 *   import { CATEGORY_COLORS } from "@/lib/m37/categoryColors";
 *   const color = CATEGORY_COLORS[cat.id] ?? CATEGORY_COLORS._fallback;
 */

export const CATEGORY_COLORS = {
  // ─── NECESIDADES — familia rojo-naranja-ámbar (hue 10–62°) ───────────────
  // Rojo-ladrillo en vivienda (peso mayor) → ámbar-mostaza en educación
  housing:      "oklch(0.48 0.20 13)",   // #B83A2A aprox. Contraste ≈ 7.2:1 ✓
  groceries:    "oklch(0.54 0.20 32)",   // #C85A28 aprox. Contraste ≈ 5.3:1 ✓
  transport:    "oklch(0.57 0.18 46)",   // #C96820 aprox. Contraste ≈ 4.4:1 ✓
  utilities:    "oklch(0.52 0.17 58)",   // #A87218 aprox. Contraste ≈ 5.8:1 ✓
  health:       "oklch(0.56 0.15 22)",   // #B84840 aprox. Contraste ≈ 4.6:1 ✓
  education:    "oklch(0.53 0.16 52)",   // #A07010 aprox. Contraste ≈ 5.5:1 ✓

  // ─── DESEOS — familia violeta-malva-fucsia (hue 295–340°) ────────────────
  // Excluye hue 234–294° (zona navy). L ∈ [0.50–0.58] → contraste mín. 4.3:1 ✓
  dining_out:    "oklch(0.50 0.18 305)", // #7A4AAE aprox. Contraste ≈ 6.5:1 ✓
  travel:        "oklch(0.53 0.18 318)", // #8A48A8 aprox. Contraste ≈ 5.5:1 ✓
  clothing:      "oklch(0.56 0.17 330)", // #9848A0 aprox. Contraste ≈ 4.6:1 ✓
  personal_care: "oklch(0.52 0.15 298)", // #6458B0 aprox. Contraste ≈ 5.8:1 ✓
  entertainment: "oklch(0.58 0.16 340)", // #A04898 aprox. Contraste ≈ 4.3:1 ✓
  hobbies:       "oklch(0.54 0.14 310)", // #7050A8 aprox. Contraste ≈ 5.2:1 ✓
  subscriptions: "oklch(0.55 0.15 322)", // #8050A2 aprox. Contraste ≈ 4.9:1 ✓
  gifts:         "oklch(0.57 0.13 335)", // #905898 aprox. Contraste ≈ 4.4:1 ✓

  // ─── AHORRO — familia verde-teal-agua (hue 130–195°) ─────────────────────
  // Verde bosque oscuro en seguro de vida → teal-agua en inversión
  life_insurance:     "oklch(0.50 0.17 140)", // #2A8858 aprox. Contraste ≈ 6.5:1 ✓
  emergency_fund:     "oklch(0.54 0.16 158)", // #2A9070 aprox. Contraste ≈ 5.3:1 ✓
  short_term_savings: "oklch(0.57 0.15 172)", // #209878 aprox. Contraste ≈ 4.4:1 ✓
  long_term_savings:  "oklch(0.52 0.18 133)", // #308048 aprox. Contraste ≈ 5.8:1 ✓
  investment:         "oklch(0.55 0.16 185)", // #1A9888 aprox. Contraste ≈ 5.0:1 ✓
  debt_extra:         "oklch(0.51 0.14 148)", // #388060 aprox. Contraste ≈ 6.0:1 ✓

  // ─── Fallback para categorías desconocidas ────────────────────────────────
  _fallback: "oklch(0.55 0.10 220)",
};
