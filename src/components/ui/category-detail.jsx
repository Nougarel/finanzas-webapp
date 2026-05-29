/**
 * CategoryDetail — Panel de detalle de categoría (M36 Fase 1, capa 1).
 *
 * Muestra la procedencia semántica de una categoría sin revelar lógica interna.
 * Solo necesita los datos que ya viajan en la API (categories[id] + ineComparison[id]).
 *
 * Props:
 *   category   {object}  — entrada de result.categories[catId]
 *   ineData    {object|null} — entrada de result.ineComparison[catId], puede ser null
 *   income     {number}  — ingreso mensual para formatear importes
 *   onClose    {function} — callback para cerrar el panel
 */

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoneyValue } from "@/components/ui/money-value";
import {
  getRelevanceInfo,
  CONTEXTUAL_FLEXIBILITY_MESSAGE,
} from "@/lib/m36/relevance";

// ── Indicador de puntos de relevance ────────────────────────────────────────

function RelevanceDots({ filled, total, label }) {
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Relevancia: ${filled} de ${total} — ${label}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            i < filled ? "bg-primary" : "bg-muted-foreground/30"
          )}
        />
      ))}
    </span>
  );
}

// ── Comparación INE ─────────────────────────────────────────────────────────

function IneComparison({ ineData, block }) {
  if (!ineData) return null;

  const { ineReference, assigned, vsIne } = ineData;

  // vsIne positivo → por encima de la media; negativo → por debajo
  const diffLabel =
    vsIne > 0
      ? `${Math.abs(vsIne).toFixed(1)} p.p. por encima de la media`
      : vsIne < 0
      ? `${Math.abs(vsIne).toFixed(1)} p.p. por debajo de la media`
      : "en la media española";

  return (
    <div className="rounded-md bg-muted/40 px-3 py-2.5 space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-meta">
        Comparación con la media española
      </p>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-muted-foreground">
          {block === "wants" ? "Media (INE, gasto observado)" : "Media española (INE)"}
        </span>
        <span className="font-medium tabular-nums">{ineReference}%</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tu distribución</span>
        <span className="font-medium tabular-nums">{assigned.toFixed(1)}%</span>
      </div>
      <p className="text-xs text-muted-foreground pt-0.5">{diffLabel}</p>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export function CategoryDetail({ category, ineData, income, onClose }) {
  if (!category) return null;

  const relevanceInfo = getRelevanceInfo({
    referenceReliability: category.referenceReliability,
    referenceSource: category.referenceSource,
  });

  const { label, filled, total, sources, isContextual } = relevanceInfo;

  // Frase de procedencia compuesta desde las fuentes traducidas
  const sourceSentence = buildSourceSentence(sources);

  return (
    <div className="flex flex-col h-full" data-slot="category-detail">
      {/* ── Cabecera del panel ── */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-0.5 min-w-0">
          <h2 className="text-base font-bold text-foreground leading-tight truncate">
            {category.label}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <MoneyValue
              amount={category.amount}
              size="table"
              className="text-lg font-bold"
            />
            <span className="text-sm text-muted-foreground tabular-nums">
              ({category.percentage.toFixed(1)}%)
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Cerrar panel de detalle"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Cuerpo scrollable ── */}
      <div className="flex-1 overflow-y-auto space-y-5 pt-4">

        {/* Etiqueta de relevance + puntos */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-meta">
            Relevancia para la salud financiera
          </p>
          <div className="flex items-center gap-2">
            <RelevanceDots filled={filled} total={total} label={label} />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        </div>

        {/* Procedencia semántica */}
        {sourceSentence && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-meta">
              Respaldo institucional
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {sourceSentence}
            </p>
          </div>
        )}

        {/* Comparación INE */}
        <IneComparison ineData={ineData} block={category.block} />

        {/* Mensaje de flexibilidad — solo en CONTEXTUAL */}
        {isContextual && (
          <div
            className="rounded-md border border-border bg-muted/20 px-3 py-3 space-y-1"
            role="note"
            aria-label="Nota sobre flexibilidad de la categoría"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-meta">
              Nota sobre flexibilidad
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {CONTEXTUAL_FLEXIBILITY_MESSAGE}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Utilidad interna: construir frase de procedencia ────────────────────────

/**
 * Convierte un array de frases de fuentes a una oración legible.
 * Ej: ["el Banco de España", "Eurostat"]
 *   → "Este umbral está respaldado por el Banco de España y la oficina estadística de la Unión Europea (Eurostat)."
 */
function buildSourceSentence(sources) {
  if (!sources || sources.length === 0) return null;

  const unique = [...new Set(sources)];

  if (unique.length === 1) {
    return `Esta referencia está respaldada por ${unique[0]}.`;
  }

  const last = unique[unique.length - 1];
  const rest = unique.slice(0, -1);
  return `Esta referencia está respaldada por ${rest.join(", ")} y ${last}.`;
}
