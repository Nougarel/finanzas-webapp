"use client";

/**
 * macro-piechart.jsx — Donut chart macro de 3 segmentos (necesidades / deseos / ahorro).
 *
 * Muestra la distribución porcentual de los 3 bloques financieros con:
 *   - Donut con hueco interior que muestra el valor central (importe o health score)
 *   - Leyenda vertical a la derecha con bullet cuadrado, label y porcentaje
 *   - Hover sobre segmento: eleva outerRadius +6px con transición 150ms
 *   - Tooltip nativo de recharts con formato "{label}: {pct}% · {amount}"
 *   - Accesibilidad: role="img" + aria-label dinámico en el contenedor SVG
 *
 * @param {Object} props
 * @param {Array<{ blockKey: "needs"|"wants"|"savings", label: string, value: number, percentage: number, color: string }>} props.data
 *   - value: importe en euros
 *   - percentage: 0–100
 *   - color: string CSS (ej. "oklch(0.58 0.18 38)") — se pasa desde el padre para no acoplar este
 *     componente a los tokens CSS directamente (recharts usa SVG fill, no CSS variables).
 * @param {string} [props.centerLabel]     - Línea 2 del centro del donut (ej. "ingreso", "gasto real"). Default: "ingreso".
 * @param {string} [props.centerValue]     - Línea 1 del centro del donut (ej. "4.500 €"). Default: primer valor.
 * @param {number} [props.size]            - Diámetro en px. Default: 180 (xl). Reducir a 140 en lg.
 * @param {number} [props.thickness]       - Grosor del anillo en px. Default: 28.
 */

import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useCallback } from "react";

// ─── Tooltip personalizado ────────────────────────────────────────────────────

function MacroTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const { label, value, percentage } = entry.payload;
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
        {": "}
        {percentage.toFixed(1)}% · {formatted}
      </span>
    </div>
  );
}

// ─── Shape activo (hover eleva el segmento) ───────────────────────────────────

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={cornerRadius}
      style={{ transition: "all 150ms ease-out" }}
    />
  );
}

// ─── Shape normal (sin hover) ─────────────────────────────────────────────────

function NormalShape({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius }) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={cornerRadius}
      style={{ transition: "all 150ms ease-out" }}
    />
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function MacroPiechart({
  data,
  centerLabel = "ingreso",
  centerValue,
  size = 180,
  thickness = 28,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = useCallback((_, index) => setActiveIndex(index), []);
  const handleMouseLeave = useCallback(() => setActiveIndex(null), []);

  if (!data || data.length === 0) return null;

  const outerRadius = size / 2;
  const innerRadius = outerRadius - thickness;

  // Valor central: primero el prop, si no suma de importes
  const displayValue =
    centerValue ??
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(data.reduce((acc, d) => acc + d.value, 0));

  // aria-label dinámico para accesibilidad
  const ariaLabel = `Distribución financiera: ${data
    .map((d) => `${d.label} ${d.percentage.toFixed(1)}%`)
    .join(", ")}`;

  return (
    <div
      className="flex items-center gap-6"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Gráfico donut */}
      <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
        {/* tabIndex={-1} saca el SVG del orden de tabulación (A2/A3).
            El contenedor padre ya tiene role="img" + aria-label dinámico. */}
        <PieChart width={size} height={size} tabIndex={-1}>
          <Pie
            data={data}
            dataKey="value"
            cx={outerRadius - 1}
            cy={outerRadius - 1}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            cornerRadius={2}
            activeIndex={activeIndex ?? undefined}
            activeShape={ActiveShape}
            shape={(props) => (
              <NormalShape
                {...props}
                fill={data[props.index]?.color ?? props.fill}
                cornerRadius={2}
              />
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isAnimationActive={false}
          />
          <Tooltip
            content={<MacroTooltip />}
            aria-hidden="true"
          />
        </PieChart>

        {/* Valor central — superpuesto al hueco del donut */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
            width: innerRadius * 2 - 8,
          }}
          aria-hidden="true"
        >
          <div
            className="font-display font-bold text-foreground"
            style={{ fontSize: 16, lineHeight: 1.2 }}
          >
            {displayValue}
          </div>
          {/* C5: centerLabel en text-foreground a 12px para distinguir modo real de recommended */}
          <div
            className="font-sans text-foreground"
            style={{ fontSize: 12, marginTop: 2 }}
          >
            {centerLabel}
          </div>
        </div>
      </div>

      {/* Leyenda vertical */}
      <div className="flex flex-col" style={{ gap: 10 }}>
        {data.map((entry) => (
          <div key={entry.blockKey} className="flex items-center" style={{ gap: 8 }}>
            {/* Bullet cuadrado 10×10px, radio 2px */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: entry.color,
                flexShrink: 0,
              }}
            />
            <span
              className="font-sans font-medium text-foreground"
              style={{ fontSize: 13 }}
            >
              {entry.label}
            </span>
            <span
              className="font-sans tabular-nums text-muted-foreground"
              style={{ fontSize: 12 }}
            >
              {entry.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
