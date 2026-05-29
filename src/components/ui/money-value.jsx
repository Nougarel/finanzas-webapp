// money-value.jsx — Muestra importes monetarios en euros con formato es-ES.
//
// Aplica tabular-nums para alineación correcta en columnas numéricas.
//
// Props:
//   amount:   number — el importe en euros
//   size:     "hero" | "table" | "inline" (default: "inline")
//   showSign: boolean — muestra + en positivos (útil para diferencias)
//   className: string

import * as React from "react";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  // Número grande en portada/hero — Geist 900
  hero: "text-4xl font-black font-display tracking-display",
  // Dentro de tablas — Inter 500
  table: "text-sm font-medium",
  // Inline en texto — Inter 400
  inline: "text-base",
};

/** Formatea un número como moneda euro en locale es-ES. */
function formatEuro(amount, showSign = false) {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  if (showSign && amount > 0) return `+${formatted}`;
  if (amount < 0) return `−${formatted}`;
  return formatted;
}

/**
 * Importe monetario con formato es-ES y tabular-nums.
 *
 * @param {Object} props
 * @param {number} props.amount
 * @param {"hero"|"table"|"inline"} [props.size]
 * @param {boolean} [props.showSign]
 * @param {string} [props.className]
 */
function MoneyValue({ amount = 0, size = "inline", showSign = false, className }) {
  return (
    <span
      className={cn("tabular-nums", SIZE_CLASSES[size] ?? SIZE_CLASSES.inline, className)}
      aria-label={`${amount.toLocaleString("es-ES")} euros`}
    >
      {formatEuro(amount, showSign)}
    </span>
  );
}

export { MoneyValue, formatEuro };
