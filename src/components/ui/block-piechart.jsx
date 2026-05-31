"use client";

/**
 * block-piechart.jsx — Donut chart de detalle por bloque financiero con tabs.
 *
 * Muestra la distribución interna de un bloque (las N categorías de needs/wants/savings)
 * con tabs para cambiar de bloque activo. Implementa tabs accesibles con ARIA
 * (role="tablist" / role="tab" / role="tabpanel") y navegación por teclado
 * (flecha ←/→ cambia el tab activo con activación automática).
 *
 * NO usa el componente shadcn <Tabs> (padding fijo no compatible con panel compacto).
 *
 * La escala de colores por bloque se genera en tiempo de ejecución interpolando
 * luminosidades en oklch según §3.3 del DESIGN.md:
 *   needs   → oklch(L 0.18 38)  con L de [0.45, 0.52, 0.58, 0.62, 0.66, 0.72]
 *   wants   → oklch(L 0.16 300) con L de [0.40, 0.46, 0.52, 0.56, 0.60, 0.64, 0.67, 0.70]
 *   savings → oklch(L 0.15 155) con L de [0.44, 0.50, 0.58, 0.63, 0.67, 0.70]
 *
 * @param {Object} props
 * @param {Object} props.dataByBlock
 *   Estructura: {
 *     needs:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     wants:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     savings: Array<{ id: string, label: string, value: number, percentage: number }>,
 *   }
 * @param {"needs"|"wants"|"savings"} [props.defaultBlock] - Tab activo por defecto. Default: "needs".
 * @param {number} [props.size]      - Diámetro del donut en px. Default: 140.
 * @param {number} [props.thickness] - Grosor del anillo en px. Default: 22.
 */

import { useState, useCallback, useRef } from "react";
import { PieChart, Pie, Sector, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// ─── Paletas de color por bloque (§3.3 DESIGN.md) ────────────────────────────

const BLOCK_PALETTES = {
  needs: {
    chroma: 0.18,
    hue: 38,
    luminosities: [0.45, 0.52, 0.58, 0.62, 0.66, 0.72],
  },
  wants: {
    chroma: 0.16,
    hue: 300,
    luminosities: [0.40, 0.46, 0.52, 0.56, 0.60, 0.64, 0.67, 0.70],
  },
  savings: {
    chroma: 0.15,
    hue: 155,
    luminosities: [0.44, 0.50, 0.58, 0.63, 0.67, 0.70],
  },
};

/**
 * Genera la escala de colores oklch para un bloque dado.
 * Si hay más categorías que luminosidades definidas, recicla la última.
 * @param {"needs"|"wants"|"savings"} block
 * @param {number} count - Número de categorías
 * @returns {string[]} Array de strings CSS oklch
 */
function generateColorScale(block, count) {
  const palette = BLOCK_PALETTES[block];
  if (!palette) return Array(count).fill("oklch(0.5 0.1 0)");

  const { chroma, hue, luminosities } = palette;
  return Array.from({ length: count }, (_, i) => {
    const L = luminosities[i] ?? luminosities[luminosities.length - 1];
    return `oklch(${L} ${chroma} ${hue})`;
  });
}

// ─── Labels de los tabs ───────────────────────────────────────────────────────

const TAB_LABELS = {
  needs: "Necesidades",
  wants: "Deseos",
  savings: "Ahorro",
};

const TAB_ORDER = ["needs", "wants", "savings"];

// ─── Tooltip personalizado ────────────────────────────────────────────────────

function BlockTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const { label, value, percentage } = payload[0].payload;
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div
      className="bg-card border border-border rounded-md px-3 py-2 shadow-sm"
      style={{ fontSize: 12 }}
      aria-hidden="true"
    >
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">
        {": "}{percentage.toFixed(1)}% · {formatted}
      </span>
    </div>
  );
}

// ─── Shape normal ─────────────────────────────────────────────────────────────

function BlockSector({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={2}
    />
  );
}

function BlockSectorActive({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={2}
      style={{ transition: "all 150ms ease-out" }}
    />
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function BlockPiechart({
  dataByBlock,
  defaultBlock = "needs",
  size = 140,
  thickness = 22,
}) {
  const [activeBlock, setActiveBlock] = useState(defaultBlock);
  const [activeSegment, setActiveSegment] = useState(null);
  const tabListRef = useRef(null);

  const handleMouseEnter = useCallback((_, index) => setActiveSegment(index), []);
  const handleMouseLeave = useCallback(() => setActiveSegment(null), []);

  // Navegación teclado en tabs (flecha ←/→, activación automática)
  const handleKeyDown = useCallback((e, currentBlock) => {
    const idx = TAB_ORDER.indexOf(currentBlock);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = TAB_ORDER[(idx + 1) % TAB_ORDER.length];
      setActiveBlock(next);
      // Mover foco al tab siguiente
      const nextTab = tabListRef.current?.querySelector(`[data-block="${next}"]`);
      nextTab?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length];
      setActiveBlock(prev);
      const prevTab = tabListRef.current?.querySelector(`[data-block="${prev}"]`);
      prevTab?.focus();
    }
  }, []);

  const currentData = dataByBlock?.[activeBlock] ?? [];
  const colors = generateColorScale(activeBlock, currentData.length);

  // Añadir color a cada entrada para el shape y la leyenda
  const coloredData = currentData.map((cat, i) => ({
    ...cat,
    color: colors[i],
  }));

  const outerRadius = size / 2;
  const innerRadius = outerRadius - thickness;

  // Dividir leyenda en 2 columnas si hay 6+ ítems
  const useColumns = coloredData.length >= 6;

  return (
    <div className="flex flex-col gap-3">
      {/* Tab list */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Ver distribución por bloque"
        className="flex gap-0 border-b border-border"
      >
        {TAB_ORDER.map((block) => {
          const isActive = block === activeBlock;
          return (
            <button
              key={block}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${block}`}
              id={`tab-${block}`}
              data-block={block}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveBlock(block)}
              onKeyDown={(e) => handleKeyDown(e, block)}
              className={cn(
                "px-3 py-2 text-xs font-sans transition-colors duration-200",
                "border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
                isActive
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground/80"
              )}
            >
              {TAB_LABELS[block]}
            </button>
          );
        })}
      </div>

      {/* Panel del bloque activo */}
      {TAB_ORDER.map((block) => (
        <div
          key={block}
          role="tabpanel"
          id={`tabpanel-${block}`}
          aria-labelledby={`tab-${block}`}
          hidden={block !== activeBlock}
        >
          {block === activeBlock && (
            <div className="flex flex-col items-center gap-3">
              {/* Donut — sin valor central (demasiado pequeño para texto) */}
              <div style={{ width: size, height: size }}>
                <PieChart width={size} height={size} style={{ outline: "none" }}>
                  <Pie
                    data={coloredData}
                    dataKey="value"
                    cx={outerRadius - 1}
                    cy={outerRadius - 1}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    cornerRadius={2}
                    activeIndex={activeSegment ?? undefined}
                    activeShape={(props) => (
                      <BlockSectorActive
                        {...props}
                        fill={coloredData[props.index]?.color ?? props.fill}
                      />
                    )}
                    shape={(props) => (
                      <BlockSector
                        {...props}
                        fill={coloredData[props.index]?.color ?? props.fill}
                      />
                    )}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    isAnimationActive={true}
                  />
                  <Tooltip content={<BlockTooltip />} aria-hidden="true" />
                </PieChart>
              </div>

              {/* Leyenda — 2 columnas si 6+ ítems */}
              <div
                className={cn(
                  "w-full",
                  useColumns ? "grid grid-cols-2 gap-x-4 gap-y-1.5" : "flex flex-col gap-1.5"
                )}
              >
                {coloredData.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1.5 min-w-0">
                    {/* Bullet 8×8px, radio 1px */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-sans text-foreground truncate"
                      style={{ fontSize: 12 }}
                      title={cat.label}
                    >
                      {cat.label}
                    </span>
                    <span
                      className="font-sans tabular-nums text-muted-foreground ml-auto flex-shrink-0"
                      style={{ fontSize: 11 }}
                    >
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
