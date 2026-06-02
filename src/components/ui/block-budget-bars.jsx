"use client";

/**
 * block-budget-bars.jsx — Barras horizontales de presupuesto agrupadas por bloque (M37 §12.3).
 *
 * Diferenciador respecto a la tabla de col 1:
 *   1. Agrupación visible por bloque con total de bloque como contexto macro.
 *   2. % mostrado = porcentaje dentro del bloque (no del ingreso total).
 *   3. Lectura comparativa inmediata de los 3 bloques en el mismo espacio.
 *
 * Anatomía por fila de categoría:
 *   [label — 110px fijo, truncado] [barra — flex-1] [% — 32px fijo]
 *
 * No se usa recharts. Layout puro con Tailwind + divs.
 *
 * En modo "inverse" no se renderiza.
 *
 * @param {Object} props
 * @param {Object} props.dataByBlock
 *   Estructura: {
 *     needs:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     wants:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     savings: Array<{ id: string, label: string, value: number, percentage: number }>,
 *   }
 * @param {"recommended"|"real"|"inverse"} [props.mode]
 *   En modo "inverse" el componente devuelve null. Default: "recommended".
 */

import { BLOCK_COLORS } from "@/lib/m37/categoryColors";

// ─── Configuración de bloques ─────────────────────────────────────────────────

const BLOCK_CONFIG = {
  needs:   { label: "Necesidades", color: BLOCK_COLORS.needs },
  wants:   { label: "Deseos",      color: BLOCK_COLORS.wants },
  savings: { label: "Ahorro",      color: BLOCK_COLORS.savings },
};

const BLOCK_ORDER = ["needs", "wants", "savings"];

// ─── Subcomponente: fila de categoría ─────────────────────────────────────────

/**
 * Fila individual de categoría con barra proporcional al bloque.
 * El % mostrado es relativo al bloque, no al ingreso total.
 * El color de la barra es el del bloque (todas las categorías de un bloque
 * comparten color — la distinción es el label, no el color).
 */
function CategoryRow({ cat, blockTotal, blockColor }) {
  const pctOfBlock =
    blockTotal > 0 ? Math.round((cat.value / blockTotal) * 100) : 0;

  const barWidth = `${Math.min(pctOfBlock, 100)}%`;

  const formattedAmount = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cat.value);

  return (
    <div className="flex items-center gap-2">
      {/* Label — ancho fijo, truncado */}
      <span
        className="text-foreground font-normal overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0"
        style={{ fontSize: 12, width: 110 }}
        title={cat.label}
      >
        {cat.label}
      </span>

      {/* Barra proporcional — el ancho es % dentro del bloque */}
      <div
        className="flex-1 min-w-0"
        role="img"
        aria-label={`${cat.label}: ${pctOfBlock}% del bloque — ${formattedAmount}`}
      >
        <div
          className="relative"
          style={{ height: 6 }}
          title={`${formattedAmount} · ${pctOfBlock}% del bloque`}
        >
          {/* Fondo de la barra */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "oklch(0.92 0 0)" }}
          />
          {/* Relleno de la barra — color del bloque (categorías distintas por label) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: barWidth,
              backgroundColor: blockColor,
              transition: "width 400ms ease-out",
            }}
          />
        </div>
      </div>

      {/* Porcentaje dentro del bloque */}
      <span
        className="tabular-nums text-muted-foreground font-medium text-right flex-shrink-0"
        style={{ fontSize: 11, width: 32 }}
      >
        {pctOfBlock}%
      </span>
    </div>
  );
}

// ─── Subcomponente: sección de bloque ─────────────────────────────────────────

/**
 * Sección completa de un bloque: header + barra macro + filas de categorías.
 * Las categorías se ordenan por valor descendente; las de valor 0 se omiten.
 */
function BlockSection({ blockKey, categories, blockPctOfTotal }) {
  const config = BLOCK_CONFIG[blockKey];

  // Ordenar descendente por valor y filtrar valor 0
  const sorted = [...categories]
    .filter((cat) => cat.value > 0)
    .sort((a, b) => b.value - a.value);

  const blockTotal = sorted.reduce((acc, cat) => acc + cat.value, 0);

  return (
    <div>
      {/* Header del bloque */}
      <div className="mb-1">
        <span
          className="font-bold uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.05em",
            color: config.color,
          }}
        >
          {config.label}
        </span>
        <span
          className="text-muted-foreground font-normal ml-1"
          style={{ fontSize: 10 }}
        >
          · {Math.round(blockPctOfTotal)}%
        </span>
      </div>

      {/* Barra total del bloque — ancho proporcional al % sobre el ingreso total */}
      <div
        style={{ height: 3, marginBottom: 8 }}
        className="rounded-sm overflow-hidden"
        aria-hidden="true"
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(blockPctOfTotal, 100)}%`,
            backgroundColor: config.color,
            opacity: 0.4,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Filas de categorías */}
      <div className="flex flex-col gap-y-1.5">
        {sorted.map((cat) => (
          <CategoryRow key={cat.id} cat={cat} blockTotal={blockTotal} blockColor={config.color} />
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function BlockBudgetBars({ dataByBlock, mode = "recommended" }) {
  // En modo inverse no se renderiza
  if (mode === "inverse") return null;
  if (!dataByBlock) return null;

  // Calcular % de bloque sobre el ingreso total a partir de los porcentajes de categoría
  // percentage de cada categoría ya es % sobre el ingreso total
  const blockPcts = {};
  for (const blockKey of BLOCK_ORDER) {
    const cats = dataByBlock[blockKey] ?? [];
    blockPcts[blockKey] = cats.reduce((acc, cat) => acc + (cat.percentage ?? 0), 0);
  }

  return (
    <div aria-label="Distribución por categorías y bloque">
      {BLOCK_ORDER.map((blockKey, idx) => {
        const categories = dataByBlock[blockKey] ?? [];
        const isLast = idx === BLOCK_ORDER.length - 1;

        return (
          <div key={blockKey}>
            <BlockSection
              blockKey={blockKey}
              categories={categories}
              blockPctOfTotal={blockPcts[blockKey]}
            />
            {!isLast && (
              <hr
                className="border-t my-3"
                style={{ borderColor: "oklch(0.85 0 0 / 0.3)" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
