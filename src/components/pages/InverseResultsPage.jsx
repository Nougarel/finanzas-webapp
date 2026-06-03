"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { DetailPanelLayout } from "@/components/ui/detail-panel-layout";
import { CategoryDetail } from "@/components/ui/category-detail";
import { DashboardPanel } from "@/components/ui/dashboard-panel";
import { ProfilePanel } from "@/components/ui/profile-panel";
import { CATEGORIES_UI, CATEGORIES_META, CATEGORIES_CATALOG } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import CoherenceWarningScreen from "@/components/pages/CoherenceWarningScreen";
import { useMounted } from "@/lib/hooks/useMounted";

const BLOCK_LABELS = { needs: "Necesidades", wants: "Deseos", savings: "Ahorro" };
const BLOCK_ORDER  = ["needs", "wants", "savings"];

function fmtPct(n) {
  return `${n.toFixed(1)} %`;
}

function ErrorCard({ title, message, onBack }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{message}</p>
          <Button onClick={onBack}>Volver al formulario</Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default function InverseResultsPage() {
  const router = useStudyAwareRouter();
  const mounted = useMounted();

  const [amountsMissing] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(STORAGE_KEYS.specifiedAmounts);
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEYS.specifiedAmounts);
  });
  const [result,    setResult]    = useState(null);
  const [calcError, setCalcError] = useState(null);
  const [coherenceOutliers, setCoherenceOutliers] = useState(null);
  // Estado efímero del panel de detalle (ADR-11 — no en URL)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // Perfil del usuario para los bullets de drivers (M36)
  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.profileIdeal);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // Refs para alineación dinámica col 2 con el banner navy (Fix M37).
  const bannerRef = useRef(null);
  const col2Ref   = useRef(null);
  const [col2PaddingTop, setCol2PaddingTop] = useState(0);

  // Modo testing guiado (M18 Fase 4): notificar cálculo completado al
  // sistema research si el contexto /study está activo.
  const study = useStudyContextOptional();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (study && result && !notifiedRef.current) {
      notifiedRef.current = true;
      // El profile y specifiedAmounts viven en localStorage; los leemos solo
      // para el snapshot que se persiste en app_interactions.
      let profileSnapshot = {};
      let inputPayload = {};
      try {
        profileSnapshot = JSON.parse(localStorage.getItem(STORAGE_KEYS.profileIdeal) ?? "{}");
      } catch { /* snapshot vacío si falla parse */ }
      try {
        inputPayload = { specifiedAmounts: JSON.parse(localStorage.getItem(STORAGE_KEYS.specifiedAmounts) ?? "{}") };
      } catch { /* input vacío si falla parse */ }
      study.notifyCalculation("inverse", profileSnapshot, inputPayload, result);
    }
  }, [study, result]);

  // Función de cálculo reutilizable: se llama al montar y de nuevo cuando el
  // usuario pulsa "Calcular igualmente" (con force = true).
  // Toda la lógica vive dentro de un microtask (Promise.resolve().then) para
  // evitar setState síncrono dentro de useEffect — patrón ya usado antes del
  // refactor para satisfacer react-hooks/set-state-in-effect.
  const runCalculation = useCallback((force = false) => {
    const stored = localStorage.getItem(STORAGE_KEYS.specifiedAmounts);
    if (!stored) return;

    Promise.resolve().then(() => {
      setLoading(true);
      setCalcError(null);
      if (force) setCoherenceOutliers(null);

      let specifiedAmounts;
      try { specifiedAmounts = JSON.parse(stored); }
      catch { setCalcError("Los importes no son válidos."); setLoading(false); return; }

      let profile;
      try { profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profileIdeal) ?? "null"); }
      catch { profile = null; }

      if (!profile) {
        setCalcError("No se encontró el perfil. Vuelve a completarlo.");
        setLoading(false);
        return;
      }

      fetch("/api/calculate-inverse", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ profile, specifiedAmounts, force }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) {
            setCalcError(data.error);
          } else if (data.requiresConfirmation) {
            setCoherenceOutliers(data.outliers ?? []);
          } else {
            setResult(data);
          }
        })
        .catch(() => setCalcError("Error al conectar con el servidor."))
        .finally(() => setLoading(false));
    });
  }, []);

  useEffect(() => {
    runCalculation(false);
  }, [runCalculation]);

  // ── Dataset para DashboardPanel (mode="inverse") ──────────────────────────────
  // Construye la estructura unificada desde healthyDistribution del resultado
  // inverso. El ingreso de referencia es requiredIncome (el calculado, no real).
  // Los bloques se calculan sumando las categorías por bloque desde CATEGORIES_UI.
  // El DTI hipotético se deriva como monthlyDebtPayment / requiredIncome * 100.
  // Debe estar antes de los early returns para cumplir las reglas de hooks.
  const dashboardDataset = useMemo(() => {
    if (!result) return null;
    const { requiredIncome, monthlyDebtPayment, healthyDistribution } = result;

    // Mapa bloque → { label, totalAmount }
    const BLOCK_LABELS_MAP = { needs: "Necesidades", wants: "Deseos", savings: "Ahorro" };
    const blockTotals = { needs: 0, wants: 0, savings: 0 };

    // Mapa plano de categorías con label y bloque desde CATEGORIES_UI
    const categories = {};
    for (const cat of CATEGORIES_UI) {
      const h = healthyDistribution[cat.id];
      if (!h) continue;
      categories[cat.id] = {
        id: cat.id,
        label: cat.label,
        block: cat.block,
        percentage: h.percentage,
        amount: h.amount,
      };
      if (blockTotals[cat.block] !== undefined) {
        blockTotals[cat.block] += h.amount;
      }
    }

    // Calcular porcentaje de bloque sobre requiredIncome
    const needsPct   = requiredIncome > 0 ? (blockTotals.needs   / requiredIncome) * 100 : 0;
    const wantsPct   = requiredIncome > 0 ? (blockTotals.wants   / requiredIncome) * 100 : 0;
    const savingsPct = requiredIncome > 0 ? (blockTotals.savings / requiredIncome) * 100 : 0;

    // DTI hipotético: cuota fija mensual / ingreso requerido
    const dtiHypothetical = requiredIncome > 0 ? (monthlyDebtPayment / requiredIncome) * 100 : 0;

    return {
      income: requiredIncome,
      blocks: {
        needs:   { label: BLOCK_LABELS_MAP.needs,   percentage: parseFloat(needsPct.toFixed(2)),   amount: parseFloat(blockTotals.needs.toFixed(2))   },
        wants:   { label: BLOCK_LABELS_MAP.wants,   percentage: parseFloat(wantsPct.toFixed(2)),   amount: parseFloat(blockTotals.wants.toFixed(2))   },
        savings: { label: BLOCK_LABELS_MAP.savings, percentage: parseFloat(savingsPct.toFixed(2)), amount: parseFloat(blockTotals.savings.toFixed(2)) },
      },
      categories,
      transversal: {
        dti: { total: parseFloat(dtiHypothetical.toFixed(2)) },
      },
    };
  }, [result]);

  const goBack = () => router.push("/inverse-calculator");

  // Alineación dinámica col 2 (Fix M37).
  const recalcCol2Alignment = useCallback(() => {
    if (!bannerRef.current || !col2Ref.current) return;
    if (!window.matchMedia("(min-width: 1280px)").matches) {
      Promise.resolve().then(() => setCol2PaddingTop(0));
      return;
    }
    const bannerTop = bannerRef.current.getBoundingClientRect().top;
    const col2Top   = col2Ref.current.getBoundingClientRect().top;
    const offset    = Math.max(0, Math.round(bannerTop - col2Top));
    // Microtask para evitar setState directo dentro del layout effect (react-hooks/set-state-in-effect).
    // La medición DOM ya está completa antes del microtask.
    Promise.resolve().then(() => setCol2PaddingTop(offset));
  }, []);

  useLayoutEffect(() => {
    recalcCol2Alignment();
  }, [result, recalcCol2Alignment]);

  useEffect(() => {
    window.addEventListener("resize", recalcCol2Alignment);
    return () => window.removeEventListener("resize", recalcCol2Alignment);
  }, [recalcCol2Alignment]);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground font-light">Cargando…</p>
      </main>
    );
  }

  if (amountsMissing) {
    return <ErrorCard title="Sin datos" message="No se han recibido importes." onBack={() => router.push("/inverse-calculator")} />;
  }
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Calculando ingreso mínimo...</p>
      </main>
    );
  }
  if (coherenceOutliers && coherenceOutliers.length > 0) {
    return (
      <CoherenceWarningScreen
        outliers={coherenceOutliers}
        onEditProfile={() => router.push("/profile")}
        onEditAmounts={() => router.push("/inverse-calculator")}
        onForceCalculate={() => runCalculation(true)}
      />
    );
  }
  if (calcError) {
    return <ErrorCard title="Error en el cálculo" message={calcError} onBack={goBack} />;
  }
  if (!result) return null;

  const { requiredIncome, monthlyDebtPayment, healthyDistribution, specifiedAmounts, comparison, warnings } = result;

  // Agrupar categorías por bloque para las tablas de distribución saludable
  const catsByBlock = {};
  for (const block of BLOCK_ORDER) {
    catsByBlock[block] = CATEGORIES_UI.filter(c => c.block === block);
  }

  // Columnas y datos para la tabla comparativa
  const comparisonColumns = [
    {
      key: "label",
      header: "Categoría",
    },
    {
      key: "specifiedAmount",
      header: "Especificado",
      className: "text-right",
      render: (val) => <MoneyValue amount={val} size="table" />,
    },
    {
      key: "targetAmount",
      header: "Target",
      className: "text-right",
      render: (val, row) => {
        // null para wants — no tienen target de perfil independiente
        if (val == null) {
          return <span className="inline-flex justify-end text-muted-foreground/50 tabular-nums text-sm">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1.5 justify-end">
            <MoneyValue amount={val} size="table" />
            <span className="text-xs text-muted-foreground tabular-nums">({fmtPct(row.targetPct)})</span>
          </span>
        );
      },
    },
    {
      key: "healthyAmount",
      header: "Ref. INE",
      className: "text-right",
      render: (val, row) => {
        // null para savings — sin referencia INE
        if (val == null) {
          return <span className="inline-flex justify-end text-muted-foreground/50 tabular-nums text-sm">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1.5 justify-end">
            <MoneyValue amount={val} size="table" className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground tabular-nums">({fmtPct(row.healthyPct)})</span>
          </span>
        );
      },
    },
    {
      key: "diff",
      header: "Diferencia",
      className: "text-right",
      render: (diff) => {
        if (diff === 0) {
          return (
            <span className="inline-flex items-center gap-1 text-muted-foreground justify-end">
              <Minus className="size-3" aria-hidden />
              <span>—</span>
            </span>
          );
        }
        if (diff > 0) {
          return (
            <span className="inline-flex items-center gap-1 text-[color:var(--warning-foreground)] justify-end">
              <TrendingUp className="size-3" aria-hidden />
              <MoneyValue amount={diff} size="table" className="text-[color:var(--warning-foreground)]" />
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[color:var(--success-foreground)] justify-end">
            <TrendingDown className="size-3" aria-hidden />
            <MoneyValue amount={Math.abs(diff)} size="table" className="text-[color:var(--success-foreground)]" />
          </span>
        );
      },
    },
  ];

  const BLOCK_PRIORITY = { needs: 0, wants: 1, savings: 2 };

  const comparisonData = comparison
    ? Object.entries(comparison)
        .map(([catId, row]) => {
          const cat = CATEGORIES_UI.find(c => c.id === catId);
          return {
            id: catId,
            label: cat?.label ?? catId,
            block: cat?.block ?? "wants",
            specifiedAmount: row.specifiedAmount,
            targetAmount:    row.targetAmount,      // NUEVO
            targetPct:       row.targetPct,         // NUEVO
            healthyAmount:   row.healthyAmount,     // ahora puede ser null
            healthyPct:      row.healthyPct,        // ahora puede ser null
            diff:            row.diff,
          };
        })
        .sort((a, b) => (BLOCK_PRIORITY[a.block] ?? 1) - (BLOCK_PRIORITY[b.block] ?? 1))
    : [];

  // Construye columnas para la tabla de distribución saludable de un bloque.
  function buildDistributionColumns() {
    return [
      {
        key: "label",
        header: "Categoría",
        render: (val, row) => (
          <span className="inline-flex items-center gap-2">
            {val}
            {row.isSpecified && (
              <span className="text-xs rounded-full bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                fijado
              </span>
            )}
          </span>
        ),
      },
      {
        key: "percentage",
        header: "% del ingreso",
        className: "text-right",
        render: (val) => (
          <span className="tabular-nums text-sm text-muted-foreground">{fmtPct(val)}</span>
        ),
      },
      {
        key: "amount",
        header: "Importe",
        className: "text-right",
        render: (val) => <MoneyValue amount={val} size="table" />,
      },
    ];
  }

  return (
    <main className="flex min-h-screen flex-col">
      <PageShell variant="dashboard">
        {/* Col 0: perfil del usuario (2/12 en xl+, oculto en inferiores).
            xl:order-first posiciona visualmente a la izquierda sin alterar el orden DOM. */}
        <aside className="hidden xl:block xl:col-span-2 xl:order-first" aria-label="Tu perfil">
          <ProfilePanel
            profile={profile}
            mode="inverse"
            onEdit={() => router.push("/profile")}
          />
        </aside>

        {/* Col 1: contenido principal (6/12 en xl+, ancho completo en inferiores) */}
        <div className="col-span-12 xl:col-span-6">
          <div className="space-y-8">

          {/* Encabezado */}
          <div className="space-y-1">
            <h1 className="font-display font-black tracking-display text-2xl sm:text-3xl text-foreground">
              Ingreso mínimo necesario
            </h1>
            <p className="text-muted-foreground font-light">
              Ingreso neto mensual para sostener los importes que has especificado
            </p>
          </div>

          {/* Hero: ingreso requerido — bloque invertido (navy) */}
          {/* bannerRef: referencia para calcular la alineación dinámica de col 2 */}
          <div ref={bannerRef} className="rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200">
            {/* Label blanco puro — el /70 anterior daba sensación gris-azulada */}
            <p className="text-xs font-normal uppercase tracking-meta text-primary-foreground">
              Ingreso mínimo necesario
            </p>
            <MoneyValue
              amount={requiredIncome}
              size="hero"
              className="text-5xl text-primary-foreground"
            />
            <p className="text-sm text-primary-foreground/80 font-light">
              Con este ingreso neto mensual, los importes que has fijado son financieramente sostenibles.
            </p>
            {monthlyDebtPayment > 0 && (
              <p className="text-sm text-primary-foreground/80 font-light">
                Incluye{" "}
                <MoneyValue amount={monthlyDebtPayment} size="inline" className="font-medium text-primary-foreground" />
                /mes de cuotas de deuda fija.
              </p>
            )}
          </div>

          {/* Advertencias */}
          {warnings && warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <Alert key={i} variant="warning">
                  {w}
                </Alert>
              ))}
            </div>
          )}

          {/* Panel de detalle M36: comparativa + distribución saludable, filas clicables */}
          <DetailPanelLayout
            selectedCategoryId={selectedCategoryId}
            onClose={() => setSelectedCategoryId(null)}
            panelContent={
              selectedCategoryId && CATEGORIES_META[selectedCategoryId]
                ? (() => {
                    // Construir objeto `category` para CategoryDetail combinando
                    // metadatos del catálogo con los importes de healthyDistribution.
                    const meta       = CATEGORIES_META[selectedCategoryId];
                    const h          = healthyDistribution[selectedCategoryId] ?? { percentage: 0, amount: 0 };
                    const catalogCat = CATEGORIES_CATALOG.find(c => c.id === selectedCategoryId);
                    const ineRef     = catalogCat?.ineReference ?? null;
                    const ineData    = ineRef != null
                      ? {
                          ineReference: ineRef,
                          assigned:     parseFloat(h.percentage.toFixed(1)),
                          vsIne:        parseFloat((h.percentage - ineRef).toFixed(1)),
                        }
                      : null;
                    const categoryObj = {
                      id:                   meta.id,
                      label:                meta.label,
                      block:                meta.block,
                      description:          meta.description,
                      referenceSource:      meta.referenceSource,
                      referenceReliability: meta.referenceReliability,
                      percentage:           h.percentage,
                      amount:               h.amount,
                    };
                    return (
                      <CategoryDetail
                        category={categoryObj}
                        ineData={ineData}
                        income={requiredIncome}
                        onClose={() => setSelectedCategoryId(null)}
                        drivers={result.explanation?.[selectedCategoryId]?.drivers ?? []}
                        profile={profile}
                      />
                    );
                  })()
                : null
            }
          >
            <div className="space-y-8">

              {/* Hint clicable — desaparece cuando el panel está abierto */}
              {!selectedCategoryId && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span aria-hidden="true">›</span>
                  Toca cualquier categoría para ver el respaldo institucional de su cálculo.
                </p>
              )}

              {/* Comparativa: especificado vs. saludable */}
              {comparisonData.length > 0 && (
                <section aria-labelledby="comparison-heading">
                  <div className="mb-4 space-y-1">
                    <h2 id="comparison-heading" className="font-display font-black tracking-display text-xl text-foreground">
                      Comparativa
                    </h2>
                    <p className="text-sm text-muted-foreground font-light">
                      Tus importes frente a la distribución saludable con el ingreso calculado
                    </p>
                  </div>
                  {/* Guía de lectura (J4) */}
                  <p className="text-sm font-light text-muted-foreground mb-4 leading-relaxed">
                    La columna <span className="font-medium text-foreground">Especificado</span> recoge
                    los importes que fijaste. <span className="font-medium text-foreground">Target</span>{" "}
                    es lo que nuestro motor recomienda para tu perfil con el ingreso calculado, y es la
                    referencia de acción. <span className="font-medium text-foreground">Ref. INE</span>{" "}
                    es la media española, solo informativa (muestra «—» en ahorro, porque el INE no
                    publica una referencia de ahorro). La <span className="font-medium text-foreground">Diferencia</span>{" "}
                    es Especificado − Target: positiva <span className="text-[color:var(--warning-foreground)] font-medium">(↑)</span>{" "}
                    indica que gastas o ahorras más de lo recomendado;
                    negativa <span className="text-[color:var(--success-foreground)] font-medium">(↓)</span>, menos.
                  </p>
                  <DataTable
                    columns={comparisonColumns}
                    data={comparisonData}
                    caption="Comparativa de importes especificados frente a distribución saludable"
                    rowKey="id"
                    onRowClick={(row) => {
                      // Clic en fila activa = no-op (el drawer permanece abierto).
                      // Clic en fila distinta = cambia el contenido del drawer.
                      if (row.id !== selectedCategoryId) {
                        setSelectedCategoryId(row.id);
                      }
                    }}
                    activeRowKey={selectedCategoryId}
                  />
                </section>
              )}

              {/* Distribución saludable completa */}
              <section aria-labelledby="distribution-heading">
                <div className="mb-4 space-y-1">
                  <h2 id="distribution-heading" className="font-display font-black tracking-display text-xl text-foreground">
                    Distribución saludable completa
                  </h2>
                  {/* Guía de lectura (J4) */}
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    Esta es la distribución óptima para el ingreso calculado. Las categorías marcadas
                    como <span className="font-medium text-primary">fijado</span> respetan exactamente
                    los importes que indicaste; el resto se calcula automáticamente para mantener la
                    salud financiera del conjunto.
                  </p>
                </div>
                <div className="space-y-6">
                  {BLOCK_ORDER.map(block => {
                    const blockData = catsByBlock[block]
                      .map(cat => {
                        const h = healthyDistribution[cat.id];
                        if (!h) return null;
                        return {
                          id: cat.id,
                          label: cat.label,
                          percentage: h.percentage,
                          amount: h.amount,
                          isSpecified: cat.id in (specifiedAmounts ?? {}),
                        };
                      })
                      .filter(Boolean);

                    return (
                      <div key={block}>
                        {/* Banner navy de bloque — rounded-t-lg pegado a la DataTable
                            para que se lean como una unidad visual. */}
                        <h3 className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-meta text-primary-foreground">
                          {BLOCK_LABELS[block]}
                        </h3>
                        <DataTable
                          columns={buildDistributionColumns()}
                          data={blockData}
                          caption={`Distribución saludable — ${BLOCK_LABELS[block]}`}
                          rowKey="id"
                          flushTop
                          onRowClick={(row) => {
                            // Clic en fila activa = no-op (el drawer permanece abierto).
                            // Clic en fila distinta = cambia el contenido del drawer.
                            if (row.id !== selectedCategoryId) {
                              setSelectedCategoryId(row.id);
                            }
                          }}
                          activeRowKey={selectedCategoryId}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          </DetailPanelLayout>

          {/* Acciones */}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={goBack}>
              Volver y ajustar
            </Button>
            {!study && (
              <Button variant="outline" onClick={() => router.push("/")}>
                Inicio
              </Button>
            )}
            {study && (
              <Button variant="outline" onClick={() => router.push("/study/home")}>
                Volver al menú del estudio
              </Button>
            )}
          </div>

          </div>{/* fin space-y-8 de col 1 */}
        </div>{/* fin col 1 */}

        {/* Col 2: DashboardPanel en mode="inverse" (solo xl+, oculto en viewports menores).
            Sin sticky ni scroll interno — col 2 scrollea con la página (M37 F3).
            paddingTop dinámico: calculado por useLayoutEffect para alinear con el banner
            navy de col 1, independientemente de los elementos variables por encima del banner.
            Indicadores: DTI hipotético, tasa de ahorro, ratio necesidades, cobertura emergencia,
            vivienda y salud. Sin seguros (dato no disponible en dataset inverse).
            Sin BlockBudgetBars en modo inverse (DashboardPanel lo omite).
            Fuente: healthyDistribution del ingreso calculado. */}
        <aside
          ref={col2Ref}
          className="hidden xl:block xl:col-span-4"
          aria-label="Dashboard resumen ingreso mínimo calculado"
        >
          <div style={{ paddingTop: col2PaddingTop > 0 ? col2PaddingTop : undefined }}>
            <DashboardPanel
              dataset={dashboardDataset}
              mode="inverse"
              secondaryCta={{ href: "/inverse-calculator", label: "Calcular de nuevo" }}
            />
            {/* Colofón tipográfico — puramente decorativo, excluido del árbol de accesibilidad */}
            <div className="mt-8 border-t border-border/20 py-3 text-center" aria-hidden="true">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
                flouss
              </span>
            </div>
          </div>
        </aside>

      </PageShell>
    </main>
  );
}
