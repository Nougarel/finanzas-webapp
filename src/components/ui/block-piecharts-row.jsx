"use client";

/**
 * block-piecharts-row.jsx — Fila de 3 micro-piecharts de bloque (Necesidades / Deseos / Ahorro).
 *
 * Sustituye al BlockPiechart con tabs. Los 3 piecharts se muestran simultáneamente
 * en una fila horizontal, sin tabs, sin leyenda expandida.
 *
 * Cada micro-piechart:
 *   - Donut sin valor central (tamaño ~130px, demasiado pequeño para texto legible)
 *   - Label superior uppercase con el nombre del bloque + porcentaje total
 *   - Color del label coherente con el bloque (chart-1/2/3)
 *   - Tooltip recharts con categoría + importe + %
 *
 * Trade-off aceptado (decisión del usuario): categorías <2% generarán arcos
 * prácticamente invisibles. No se trata de resolver esto aquí.
 *
 * @param {Object} props
 * @param {Object} props.dataByBlock
 *   Estructura: {
 *     needs:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     wants:   Array<{ id: string, label: string, value: number, percentage: number }>,
 *     savings: Array<{ id: string, label: string, value: number, percentage: number }>,
 *   }
 * @param {number} [props.size]      - Diámetro del donut en px. Default: 130.
 * @param {number} [props.thickness] - Grosor del anillo en px. Default: 22.
 */

import { useState, useCallback } from "react";
import { PieChart, Pie, Sector, Tooltip } from "recharts";

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

// Colores principales de cada bloque para el label (coinciden con --chart-1/2/3)
const BLOCK_LABEL_COLORS = {
  needs:   "oklch(0.58 0.18 38)",
  wants:   "oklch(0.52 0.16 300)",
  savings: "oklch(0.58 0.15 155)",
};

const BLOCK_LABELS = {
  needs:   "Necesidades",
  wants:   "Deseos",
  savings: "Ahorro",
};

const BLOCK_ORDER = ["needs", "wants", "savings"];

/**
 * Genera la escala de colores oklch para un bloque dado.
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

// ─── Tooltip personalizado ────────────────────────────────────────────────────

function MicroTooltip({ active, payload }) {
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

// ─── Shape normal y activo ────────────────────────────────────────────────────

function MicroSector({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) {
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

function MicroSectorActive({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={2}
      style={{ transition: "all 150ms ease-out" }}
    />
  );
}

// ─── Micro-piechart individual ────────────────────────────────────────────────

function MicroPiechart({ blockKey, data, size, thickness }) {
  const [activeSegment, setActiveSegment] = useState(null);

  const handleMouseEnter = useCallback((_, index) => setActiveSegment(index), []);
  const handleMouseLeave = useCallback(() => setActiveSegment(null), []);

  const colors = generateColorScale(blockKey, data.length);
  const coloredData = data.map((cat, i) => ({ ...cat, color: colors[i] }));

  const outerRadius = size / 2;
  const innerRadius = outerRadius - thickness;

  // Porcentaje del bloque sobre el total (suma de percentages de las categorías del bloque)
  const blockPct = data.reduce((acc, cat) => acc + cat.percentage, 0);
  const labelColor = BLOCK_LABEL_COLORS[blockKey];

  // aria-label dinámico para accesibilidad
  const ariaLabel = `Distribución ${BLOCK_LABELS[blockKey]}: ${coloredData
    .map((d) => `${d.label} ${d.percentage.toFixed(1)}%`)
    .join(", ")}`;

  return (
    <div className="flex flex-col items-center gap-1.5" style={{ flex: "1 1 0" }}>
      {/* Label del bloque + porcentaje total */}
      <div
        className="font-sans font-bold uppercase text-center leading-none"
        style={{
          fontSize: 11,
          letterSpacing: "0.05em",
          color: labelColor,
        }}
      >
        {BLOCK_LABELS[blockKey]}
        <span
          className="font-sans font-semibold text-muted-foreground ml-1"
          style={{ fontSize: 10 }}
        >
          {blockPct.toFixed(0)}%
        </span>
      </div>

      {/* Donut — tabIndex={-1} para excluir del orden de tabulación (A2/A3) */}
      <div
        role="img"
        aria-label={ariaLabel}
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <PieChart width={size} height={size} tabIndex={-1}>
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
              <MicroSectorActive
                {...props}
                fill={coloredData[props.index]?.color ?? props.fill}
              />
            )}
            shape={(props) => (
              <MicroSector
                {...props}
                fill={coloredData[props.index]?.color ?? props.fill}
              />
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animationDuration={800}
          />
          <Tooltip content={<MicroTooltip />} aria-hidden="true" />
        </PieChart>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function BlockPiechartsRow({ dataByBlock, size = 130, thickness = 22 }) {
  if (!dataByBlock) return null;

  return (
    <div className="flex flex-row gap-3 justify-between items-start">
      {BLOCK_ORDER.map((blockKey) => {
        const data = dataByBlock[blockKey] ?? [];
        return (
          <MicroPiechart
            key={blockKey}
            blockKey={blockKey}
            data={data}
            size={size}
            thickness={thickness}
          />
        );
      })}
    </div>
  );
}
