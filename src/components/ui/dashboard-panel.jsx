"use client";

/**
 * dashboard-panel.jsx — Panel lateral de resumen del DashboardPanel (col 2).
 *
 * Componente envolvente que F3 insertará en col 2 de las 3 páginas de resultados.
 * Compone MacroPiechart + BlockBudgetBars + IndicatorCards + DashboardSecondaryCta
 * según el modo y la estructura de datos.
 *
 * Modos:
 *   "recommended" — /results: distribución ideal calculada para el ingreso del usuario.
 *   "real"        — /diagnosis: distribución real introducida por el usuario.
 *   "inverse"     — /inverse-results: distribución hipotética del ingreso mínimo calculado.
 *                   Modo reducido: solo MacroPiechart + 2 IndicatorCards (DTI hipotético + tasa ahorro).
 *
 * Estructura de `dataset` esperada:
 *   {
 *     income: number,             — ingreso de referencia (real o calculado)
 *     blocks: {
 *       needs:   { label, percentage, amount },
 *       wants:   { label, percentage, amount },
 *       savings: { label, percentage, amount },
 *     },
 *     categories: {               — mapa plano categoryId → { label, block, percentage, amount }
 *       [categoryId]: { id, label, block, percentage, amount },
 *     },
 *     transversal: {
 *       dti: { total: number },   — DTI precalculado (%) desde el motor LP
 *     },
 *   }
 *
 * Colores de los bloques en el MacroPiechart — se pasan como strings CSS porque
 * recharts usa SVG fill y no tiene acceso a CSS variables directamente.
 * Los valores coinciden con los tokens --chart-1/2/3 definidos en globals.css.
 *
 * @param {Object} props
 * @param {Object} props.dataset                    - Estructura unificada descrita arriba.
 * @param {"recommended"|"real"|"inverse"} props.mode - Modo de operación.
 * @param {{ href: string, label: string }} props.secondaryCta - CTA secundario al pie.
 * @param {boolean} [props.skeleton]                - Renderiza skeletons de carga si true.
 * En modo "inverse" el bloque "Detalle por bloque" no se renderiza.
 */

import { useMemo } from "react";
import { MacroPiechart } from "./macro-piechart";
import { BlockBudgetBars } from "./block-budget-bars";
import { IndicatorCard } from "./indicator-card";
import { DashboardSecondaryCta } from "./dashboard-secondary-cta";
import {
  calculateSavingsRate,
  calculateNeedsRatio,
  calculateEmergencyCoverage,
  extractDtiStatus,
} from "@/lib/calculators/transversalIndicators";
import { BLOCK_COLORS } from "@/lib/m37/categoryColors";

// IDs de categorías por bloque — usados para sumar importes en los indicadores
const NEEDS_IDS   = ["housing", "utilities", "groceries", "transport", "health", "education"];
const SAVINGS_IDS = ["life_insurance", "emergency_fund", "short_term_savings", "long_term_savings", "investment", "debt_extra"];

// ─── Helpers de mapeo ─────────────────────────────────────────────────────────

/**
 * Construye el array de datos para el MacroPiechart desde blocks.
 */
function buildMacroData(blocks) {
  return [
    {
      blockKey: "needs",
      label: blocks.needs.label,
      value: blocks.needs.amount,
      percentage: blocks.needs.percentage,
      color: BLOCK_COLORS.needs,
    },
    {
      blockKey: "wants",
      label: blocks.wants.label,
      value: blocks.wants.amount,
      percentage: blocks.wants.percentage,
      color: BLOCK_COLORS.wants,
    },
    {
      blockKey: "savings",
      label: blocks.savings.label,
      value: blocks.savings.amount,
      percentage: blocks.savings.percentage,
      color: BLOCK_COLORS.savings,
    },
  ];
}

/**
 * Construye dataByBlock para el BlockBudgetBars desde el mapa de categorías.
 */
function buildBlockData(categories) {
  const groupByBlock = { needs: [], wants: [], savings: [] };
  for (const cat of Object.values(categories)) {
    if (groupByBlock[cat.block]) {
      groupByBlock[cat.block].push({
        id: cat.id,
        label: cat.label,
        value: cat.amount,
        percentage: cat.percentage,
      });
    }
  }
  return groupByBlock;
}

/**
 * Construye el mapa de amounts { categoryId: amount } desde categories.
 */
function buildAmountsMap(categories) {
  return Object.fromEntries(
    Object.values(categories).map((cat) => [cat.id, cat.amount])
  );
}

/**
 * Formatea un importe en EUR para el centro del donut.
 */
function formatEur(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DashboardPanel({ dataset, mode = "recommended", secondaryCta, skeleton = false }) {
  // Si faltan datos, renderiza skeletons
  const showSkeleton = skeleton || !dataset;

  // Memoizar los derivados para evitar recálculos en re-renders
  const macroData = useMemo(
    () => (dataset ? buildMacroData(dataset.blocks) : null),
    [dataset]
  );

  const blockData = useMemo(
    () => (dataset ? buildBlockData(dataset.categories) : null),
    [dataset]
  );

  const amounts = useMemo(
    () => (dataset ? buildAmountsMap(dataset.categories) : {}),
    [dataset]
  );

  // ── Indicadores calculados ─────────────────────────────────────────────────

  const dtiIndicator = useMemo(() => {
    if (!dataset) return null;
    return extractDtiStatus({ dtiTotal: dataset.transversal?.dti?.total ?? 0 });
  }, [dataset]);

  const savingsIndicator = useMemo(() => {
    if (!dataset) return null;
    return calculateSavingsRate({
      amounts,
      income: dataset.income,
      savingsCatIds: SAVINGS_IDS,
    });
  }, [amounts, dataset]);

  const needsIndicator = useMemo(() => {
    if (!dataset) return null;
    // En modo inverse, el ratio de necesidades se omite (confunde con ideal, no real — §6)
    if (mode === "inverse") return null;
    return calculateNeedsRatio({
      amounts,
      income: dataset.income,
      needsCatIds: NEEDS_IDS,
    });
  }, [amounts, dataset, mode]);

  const emergencyIndicator = useMemo(() => {
    if (!dataset) return null;
    // En modo real (/diagnosis): no hay dato de fondo de emergencia → "sin dato"
    if (mode === "real") return null;
    // En modo inverse: omitido (ingreso hipotético — §6)
    if (mode === "inverse") return null;

    const emergencyMonthly = amounts["emergency_fund"] ?? 0;
    const needsTotal = NEEDS_IDS.reduce((acc, id) => acc + (amounts[id] ?? 0), 0);
    return calculateEmergencyCoverage({
      emergencyFundMonthly: emergencyMonthly,
      needsMonthlyTotal: needsTotal,
    });
  }, [amounts, mode, dataset]);

  // ── Valor central del donut ────────────────────────────────────────────────

  const centerValue = dataset ? formatEur(dataset.income) : null;
  const centerLabel =
    mode === "real" ? "gasto real" : "ingreso";

  // ── DTI label contextual en modo inverse ──────────────────────────────────

  const dtiLabel = mode === "inverse" ? "DTI HIPOTÉTICO" : "DTI";
  const dtiDescription =
    mode === "inverse"
      ? "Deuda/ingreso con el ingreso calculado. < 30% saludable (BdE)"
      : "Deuda/ingreso. < 30% saludable (BdE)";

  return (
    <div className="flex flex-col gap-3">
      {/* ── MacroPiechart ────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg px-6 pt-6 pb-4 card-elevated">
        <p
          className="font-sans font-medium uppercase text-muted-foreground mb-2"
          style={{ fontSize: 11, letterSpacing: "0.05em" }}
        >
          Distribución por bloque
        </p>
        {showSkeleton ? (
          <div className="flex items-center gap-6">
            {/* C3: skeleton como anillo, no disco sólido */}
            <div
              className="rounded-full border-[28px] border-muted animate-pulse flex-shrink-0"
              style={{ width: 180, height: 180 }}
            />
            <div className="flex flex-col gap-3 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* C4: MacroPiechart responsive — lg: 140px/22px, xl: 180px/28px */}
            {/* Instancia lg (oculta en xl+) */}
            <div className="block xl:hidden">
              <MacroPiechart
                data={macroData}
                centerValue={centerValue}
                centerLabel={centerLabel}
                size={140}
                thickness={22}
              />
            </div>
            {/* Instancia xl (oculta en lg) */}
            <div className="hidden xl:block">
              <MacroPiechart
                data={macroData}
                centerValue={centerValue}
                centerLabel={centerLabel}
                size={180}
                thickness={28}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Detalle por bloque: piecharts o barras (oculto en lg y md) ───── */}
      {/* En modo inverse no se renderiza. */}
      {mode !== "inverse" && (
        <div className="bg-card border border-border rounded-lg px-4 py-5 card-elevated hidden xl:block">
          <p
            className="font-sans font-medium uppercase text-muted-foreground mb-2"
            style={{ fontSize: 11, letterSpacing: "0.05em" }}
          >
            Detalle por bloque
          </p>
          {showSkeleton ? (
            /* Skeleton: 3 filas de barra (referencia visual de barras) */
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="h-2 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-1.5 w-full bg-muted rounded animate-pulse" />
                  <div className="h-1.5 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <BlockBudgetBars dataByBlock={blockData} mode={mode} />
          )}
        </div>
      )}

      {/* ── IndicatorCards ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* DTI — presente en todos los modos */}
        <IndicatorCard
          label={dtiLabel}
          value={showSkeleton ? "—" : `${dtiIndicator?.value?.toFixed(1)}%`}
          status={showSkeleton ? "info" : (dtiIndicator?.status ?? "info")}
          description={dtiDescription}
          skeleton={showSkeleton}
        />

        {/* Tasa de ahorro — presente en todos los modos */}
        <IndicatorCard
          label="TASA DE AHORRO"
          value={showSkeleton ? "—" : savingsIndicator?.formatted ?? "—"}
          status={showSkeleton ? "info" : (savingsIndicator?.status ?? "info")}
          description="Porcentaje del ingreso al ahorro. ≥ 20% recomendado (BdE)"
          skeleton={showSkeleton}
        />

        {/* Ratio necesidades — omitido en modo inverse */}
        {mode !== "inverse" && (
          <IndicatorCard
            label="RATIO NECESIDADES"
            value={showSkeleton ? "—" : needsIndicator?.formatted ?? "—"}
            status={showSkeleton ? "info" : (needsIndicator?.status ?? "info")}
            description="Ingreso en gastos esenciales. Saludable: ≤ 50% (Eurostat)"
            skeleton={showSkeleton}
          />
        )}

        {/* Cobertura emergencia — solo en modo recommended */}
        {mode === "recommended" && (
          <IndicatorCard
            label="COBERTURA EMERGENCIA"
            value={showSkeleton ? "—" : emergencyIndicator?.formatted ?? "—"}
            status={showSkeleton ? "info" : (emergencyIndicator?.status ?? "info")}
            description="Gastos cubiertos por emergencia. ≥ 6 m (BdE)"
            skeleton={showSkeleton}
          />
        )}

        {/* Cobertura emergencia — modo real: sin dato disponible */}
        {mode === "real" && (
          <IndicatorCard
            label="COBERTURA EMERGENCIA"
            value="N/A"
            status="na"
            description="Sin dato — introduce tu fondo en el perfil para calcularlo."
            skeleton={false}
          />
        )}
      </div>

      {/* ── SecondaryCTA ─────────────────────────────────────────────────── */}
      {secondaryCta && (
        <DashboardSecondaryCta href={secondaryCta.href}>
          {secondaryCta.label}
        </DashboardSecondaryCta>
      )}
    </div>
  );
}
