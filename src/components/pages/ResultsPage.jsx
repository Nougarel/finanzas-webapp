"use client";

import { useState, useEffect, useLayoutEffect, useCallback, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { DetailPanelLayout } from "@/components/ui/detail-panel-layout";
import { CategoryDetail } from "@/components/ui/category-detail";
import { DashboardPanel } from "@/components/ui/dashboard-panel";
import { ProfilePanel } from "@/components/ui/profile-panel";
import { MobileResultsSummary } from "@/components/ui/mobile-results-summary";
import { CollapsibleHint } from "@/components/ui/collapsible-hint";
import { BlockBudgetBars } from "@/components/ui/block-budget-bars";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import { useMounted } from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";

const BLOCK_ORDER = ["needs", "wants", "savings"];

// Construye el objeto dataByBlock que espera BlockBudgetBars desde result.categories.
// Misma lógica que buildBlockData en dashboard-panel.jsx, pero operando sobre result.categories.
function buildBlockDataFromResult(categories) {
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

// Mapeo de nivel de alerta del backend a variante del componente Alert.
// - severe → error (rojo destructivo)
// - mild   → warning (ámbar)
function alertVariantFromLevel(level) {
  return level === "severe" ? "error" : "warning";
}

// Columnas para DataTable de categorías dentro de un bloque.
// Las alertas se renderizan debajo del nombre de categoría.
// La referencia INE se omite de las filas — visible en el panel de detalle al clicar.
function buildCategoryColumns(result, blockKey, formatPct) {
  return [
    {
      key: "label",
      header: "Categoría",
      render: (val, row) => (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{val}</p>
          {row.description && (
            <p className="text-xs text-muted-foreground">{row.description}</p>
          )}
          {row.alert && (
            <div className="mt-1.5">
              <Alert
                variant={alertVariantFromLevel(row.alert.level)}
                size="compact"
              >
                {row.alert.message}
              </Alert>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Importe",
      className: "text-right align-top",
      render: (val) => <MoneyValue amount={val} size="table" />,
    },
    {
      key: "percentage",
      header: "% ingreso",
      className: "text-right align-top",
      mobileClassName: "text-right text-[10px] text-muted-foreground tabular-nums",
      render: (val) => (
        <span className="tabular-nums text-sm text-muted-foreground">
          {formatPct(val)}
        </span>
      ),
    },
  ];
}


function ResultsContent() {
  const router = useStudyAwareRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const [viewMode, setViewMode] = useState("detailed");
  // Estado efímero del panel de detalle (ADR-11 — no en URL)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.profileCurrent);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const profileMissing = profile === null;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEYS.profileCurrent);
  });
  const [calcError, setCalcError] = useState(null);

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  // Refs para alineación dinámica col 2 con el banner navy (Fix M37).
  // bannerRef      → div navy de ingreso en col 1.
  // col2Ref        → aside de col 2 (DashboardPanel).
  // profileColRef  → aside de col 0 (ProfilePanel).
  // col2PaddingTop → offset calculado; se reutiliza para ambas columnas laterales
  //                  porque los asides arrancan al mismo top en el grid.
  const bannerRef     = useRef(null);
  const col2Ref       = useRef(null);
  const profileColRef = useRef(null);
  const [col2PaddingTop, setCol2PaddingTop] = useState(0);

  // Modo testing guiado (M18 Fase 4): si el contexto /study está activo,
  // notificamos el cálculo completado para marcar el flujo como probado.
  const study = useStudyContextOptional();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (study && result && profile && !notifiedRef.current) {
      notifiedRef.current = true;
      study.notifyCalculation("direct", profile, { income }, result);
    }
  }, [study, result, profile, income]);

  useEffect(() => {
    if (!profile || !income || isNaN(income) || income <= 0) return;

    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, income })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setCalcError(data.error);
        } else {
          setResult(data);
        }
      })
      .catch(() => {
        setCalcError("Error al conectar con el servidor. Inténtalo de nuevo.");
      })
      .finally(() => setLoading(false));
  }, [profile, income]);

  // ── Dataset para DashboardPanel ──────────────────────────────────────────────
  // Construye la estructura unificada que espera DashboardPanel a partir de
  // la respuesta de la API. Debe estar antes de los early returns para cumplir
  // las reglas de hooks (no condicional). Cuando result es null devuelve null
  // y el panel renderiza en modo skeleton.
  const dashboardDataset = useMemo(() => {
    if (!result) return null;
    const categories = {};
    for (const [catId, cat] of Object.entries(result.categories)) {
      categories[catId] = {
        id: catId,
        label: cat.label,
        block: cat.block,
        percentage: cat.percentage,
        amount: cat.amount,
      };
    }
    return {
      income,
      blocks: {
        needs:   { label: result.blocks.needs.label,   percentage: result.blocks.needs.percentage,   amount: result.blocks.needs.amount   },
        wants:   { label: result.blocks.wants.label,   percentage: result.blocks.wants.percentage,   amount: result.blocks.wants.amount   },
        savings: { label: result.blocks.savings.label, percentage: result.blocks.savings.percentage, amount: result.blocks.savings.amount },
      },
      categories,
      transversal: {
        dti: { total: result.transversal?.dti?.total ?? 0 },
        insurance: {
          amount: result.transversal?.insurance?.amount ?? 0,
          total:  result.transversal?.insurance?.total  ?? 0,
        },
      },
      // D2: modelo más cercano para mostrar en DashboardPanel
      modelClosest: result.closestModel ?? null,
    };
  }, [result, income]);

  // Alineación dinámica col 2 — useLayoutEffect para evitar flash visual.
  // Se recalcula cuando result cambia (alertas pueden aparecer/desaparecer)
  // y en resize (breakpoint puede cruzar xl).
  const recalcCol2Alignment = useCallback(() => {
    if (!bannerRef.current || !col2Ref.current) return;
    // Solo aplica en xl+ (≥1280px). Por debajo, paddingTop = 0.
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

  if (!incomeParam || isNaN(income) || income <= 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Ingreso no válido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No se pudo calcular la distribución. Por favor, introduce un ingreso válido.
            </p>
            <Button onClick={() => router.push("/calculator")}>Volver al formulario</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (profileMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-semibold">Perfil no encontrado</h2>
        <p className="text-muted-foreground max-w-sm">
          Para calcular tu distribución personalizada necesitamos conocer tu situación.
          Completa el cuestionario de perfil primero.
        </p>
        <Button onClick={() => router.push("/profile")}>Completar cuestionario</Button>
      </main>
    );
  }

  if (loading || (!result && !calcError)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Calculando tu distribución...</p>
      </main>
    );
  }

  if (calcError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-semibold">Error en el cálculo</h2>
        <p className="text-muted-foreground max-w-sm">{calcError}</p>
        <Button onClick={() => router.push("/calculator")}>Volver al formulario</Button>
      </main>
    );
  }

  const formatPct = (pct) => `${pct.toFixed(1)}%`;

  // Alertas críticas de sistema (presupuesto insuficiente, deuda asfixiante)
  const budgetAlert = result.alerts?._budget_block;
  const debtAlert   = result.alerts?._debt_block;

  return (
    <main className="flex min-h-screen flex-col">
      <PageShell variant="dashboard">
        {/* Col 0: perfil del usuario (2/12 en xl+, oculto en inferiores).
            xl:order-first posiciona visualmente a la izquierda sin alterar el orden DOM.
            profileColRef + paddingTop: mismo offset que col2 para alinear con el banner navy. */}
        <aside ref={profileColRef} className="hidden xl:block xl:col-span-2 xl:order-first xl:sticky xl:top-16" aria-label="Tu perfil">
          <div style={{ paddingTop: col2PaddingTop > 0 ? col2PaddingTop : undefined }}>
            <ProfilePanel
              profile={profile}
              mode="direct"
              onEdit={() => router.push("/profile")}
            />
          </div>
        </aside>

        {/* Col 1: contenido principal (6/12 en xl+, ancho completo en inferiores) */}
        <div className="col-span-12 xl:col-span-6">
          <div className="space-y-8">

          {/* Alertas críticas de sistema — siempre en lo más alto */}
          {(budgetAlert || debtAlert) && (
            <div className="space-y-2">
              {budgetAlert && (
                <Alert variant={alertVariantFromLevel(budgetAlert.level)} size="sm">
                  {budgetAlert.message}
                </Alert>
              )}
              {debtAlert && (
                <Alert variant={alertVariantFromLevel(debtAlert.level)} size="sm">
                  {debtAlert.message}
                </Alert>
              )}
            </div>
          )}

          {/* Encabezado */}
          <div className="space-y-1">
            <h1 className="font-display font-black tracking-display text-2xl sm:text-3xl text-foreground">
              Tu Distribución Financiera
            </h1>
            <p className="text-muted-foreground font-light">
              Distribución personalizada según tu perfil
            </p>
          </div>

          {/* Franja de resumen mobile — visible solo en < xl */}
          <div className="xl:hidden">
            <MobileResultsSummary
              dataset={dashboardDataset}
              profile={profile}
              mode="direct"
              income={income}
            />
          </div>

          {/* Ingreso mensual — hero invertido (navy) */}
          {/* bannerRef: referencia para calcular la alineación dinámica de col 2 */}
          <div ref={bannerRef} className="relative rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200">
            {/* Botón discreto "Cambiar ingreso" — esquina superior derecha del banner */}
            <button
              type="button"
              onClick={() => router.push("/calculator")}
              className="absolute top-3 right-4 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
            >
              Cambiar ingreso →
            </button>
            {/* Label en blanco puro (sin opacity attenuation) — el /70 anterior
                se percibía azul-grisáceo sobre el navy en lugar de blanco. */}
            <p className="text-xs font-normal uppercase tracking-meta text-primary-foreground">
              Ingreso mensual neto de referencia
            </p>
            <MoneyValue
              amount={income}
              size="hero"
              className="text-5xl text-primary-foreground"
            />
            {result.monthlyDebtPayment > 0 && (
              <div className="mt-1 space-y-1 border-t border-primary-foreground/20 pt-3">
                <div className="flex justify-between text-sm text-primary-foreground/80">
                  <span>Ingreso neto</span>
                  <MoneyValue amount={income} size="inline" className="text-primary-foreground/80" />
                </div>
                <div className="flex justify-between text-sm text-primary-foreground/80">
                  <span>Cuota fija de deuda</span>
                  <span>
                    −<MoneyValue amount={result.monthlyDebtPayment} size="inline" className="text-primary-foreground/80" />{" "}
                    ({formatPct(result.monthlyDebtPayment / income * 100)})
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t border-primary-foreground/20 pt-2 mt-1">
                  <span className="text-primary-foreground">Disponible para distribuir</span>
                  <MoneyValue amount={result.effectiveIncome} size="inline" className="font-medium text-primary-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* HealthGauge eliminado de /results (M37 mejora 8).
              El score de salud financiera se mantiene solo en /diagnosis donde
              la comparación real vs. recomendado aporta contexto interpretativo.
              Las alertas estructurales (_budget_block, _debt_block) ya se muestran
              en la sección de alertas críticas de sistema al inicio de col 1. */}

          {/* Selector de vista — pill toggle segmented control */}
          <div className="space-y-2">
            <div role="group" aria-label="Modo de visualización">
              <div className="inline-flex rounded-full border border-border bg-muted/40 p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("detailed")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    viewMode === "detailed"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={viewMode === "detailed"}
                >
                  Por categorías
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("macro")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    viewMode === "macro"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={viewMode === "macro"}
                >
                  Por bloques
                </button>
              </div>
            </div>
            {viewMode === "detailed" && (
              <p className="text-xs text-muted-foreground">
                Los importes por categoría están calculados en base a tu perfil. Úsalos como referencia orientativa.
              </p>
            )}
            {result.monthlyDebtPayment > 0 && (
              <p className="text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
                Los porcentajes son sobre tu ingreso bruto de{" "}
                <MoneyValue amount={income} size="inline" className="text-xs" />.
                El {formatPct(result.monthlyDebtPayment / income * 100)} restante
                ({" "}
                <MoneyValue amount={result.monthlyDebtPayment} size="inline" className="text-xs" />
                ) corresponde a tu cuota fija de deuda.
              </p>
            )}
          </div>

          {/* Vista detallada: bloque → DataTable de categorías + panel de detalle M36 */}
          {viewMode === "detailed" && (
            <DetailPanelLayout
              selectedCategoryId={selectedCategoryId}
              onClose={() => setSelectedCategoryId(null)}
              panelContent={
                selectedCategoryId && result.categories[selectedCategoryId]
                  ? (
                    <CategoryDetail
                      category={result.categories[selectedCategoryId]}
                      ineData={result.ineComparison?.[selectedCategoryId] ?? null}
                      income={income}
                      onClose={() => setSelectedCategoryId(null)}
                      drivers={result.explanation?.[selectedCategoryId]?.drivers ?? []}
                      profile={profile}
                    />
                  )
                  : null
              }
            >
              <div className="space-y-8">

                {/* Guía de lectura (J4) */}
                <CollapsibleHint>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    Cada bloque agrupa categorías relacionadas: <span className="font-medium text-foreground">Necesidades</span> (gastos
                    imprescindibles), <span className="font-medium text-foreground">Deseos</span> (calidad de vida) y{" "}
                    <span className="font-medium text-foreground">Ahorro</span> (tu futuro financiero). El porcentaje
                    indica qué parte de tu ingreso mensual se destina a cada categoría. Las alertas señalan categorías
                    donde la distribución se aleja de los umbrales saludables para tu perfil.
                  </p>
                </CollapsibleHint>

                {/* Hint clicable — solo en vista detallada, desaparece cuando el panel está abierto */}
                {!selectedCategoryId && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span aria-hidden="true">›</span>
                    Toca cualquier categoría para ver el respaldo institucional de su cálculo.
                  </p>
                )}

                {BLOCK_ORDER.map((blockKey) => {
                  const block = result.blocks[blockKey];
                  const cats = Object.values(result.categories).filter((c) => c.block === blockKey);
                  const blockAlert = result.alerts?.[`_${blockKey}_block`];

                  // Construir filas para DataTable
                  const tableData = cats.map((cat) => ({
                    id: cat.id,
                    label: cat.label,
                    description: cat.description,
                    amount: cat.amount,
                    percentage: cat.percentage,
                    ineData: result.ineComparison?.[cat.id] ?? null,
                    alert: result.alerts[cat.id] ?? null,
                  }));

                  const columns = buildCategoryColumns(result, blockKey, formatPct);

                  return (
                    <section key={blockKey} aria-labelledby={`block-${blockKey}-heading`}>
                      {/* Banner navy de bloque — reemplaza la cabecera anterior.
                          rounded-t-lg en el banner + DataTable sin margen superior
                          → visualmente se leen como una unidad. */}
                      <div className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h2
                            id={`block-${blockKey}-heading`}
                            className="text-sm font-bold uppercase tracking-meta text-primary-foreground"
                          >
                            {block.label}
                          </h2>
                          <span className="text-sm font-medium text-primary-foreground/85 tabular-nums">
                            {formatPct(block.percentage)}
                          </span>
                        </div>
                        <MoneyValue amount={block.amount} size="table" className="font-semibold text-primary-foreground" />
                      </div>

                      {/* Alerta de bloque */}
                      {blockAlert && (
                        <div className="mb-3">
                          <Alert variant={alertVariantFromLevel(blockAlert.level)} size="sm">
                            {block.label}: {blockAlert.message}
                          </Alert>
                        </div>
                      )}

                      <DataTable
                        columns={columns}
                        data={tableData}
                        caption={`Distribución de ${block.label}`}
                        rowKey="id"
                        flushTop
                        mobileMode="rows"
                        mobileRowOrder={[0, 2, 1]}
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
                  );
                })}

                {/* Nota al pie sobre datos INE */}
                <p className="text-xs text-muted-foreground italic border-t pt-3">
                  Datos de referencia del INE (Instituto Nacional de Estadística). Los porcentajes medios
                  pueden variar según la composición del hogar y la comunidad autónoma.
                </p>
              </div>
            </DetailPanelLayout>
          )}

          {/* Vista macro: cards de bloque */}
          {viewMode === "macro" && (
            <div className="space-y-4">
              {/* Alertas de bloque en vista macro */}
              {BLOCK_ORDER.map((blockKey) => {
                const blockAlert = result.alerts?.[`_${blockKey}_block`];
                if (!blockAlert) return null;
                return (
                  <Alert
                    key={`alert-${blockKey}`}
                    variant={alertVariantFromLevel(blockAlert.level)}
                    size="sm"
                  >
                    {result.blocks[blockKey].label}: {blockAlert.message}
                  </Alert>
                );
              })}
              <div className="grid gap-4 md:grid-cols-3">
                {BLOCK_ORDER.map((blockKey) => {
                  const block = result.blocks[blockKey];
                  return (
                    <Card key={blockKey} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {block.label}
                          <span className="text-sm font-normal text-muted-foreground">
                            {formatPct(block.percentage)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex items-end">
                        <MoneyValue amount={block.amount} size="hero" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desglose por categoría — visible solo en < xl (en xl+ lo muestra DashboardPanel) */}
              <div className="xl:hidden bg-card border border-border rounded-lg px-4 py-5 card-elevated">
                <p className="font-sans font-medium uppercase text-muted-foreground mb-3" style={{ fontSize: 11, letterSpacing: "0.05em" }}>
                  Detalle por categoría
                </p>
                <BlockBudgetBars dataByBlock={buildBlockDataFromResult(result.categories)} />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => router.push("/calculator")}>
              Calcular de nuevo
            </Button>
            {!study && (
              <Button variant="outline" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
            )}
            {study && (
              <Button variant="outline" onClick={() => router.push("/study/home")}>
                Volver al menú del estudio
              </Button>
            )}
            <Button
              onClick={() => router.push(`/diagnosis-form?income=${income}`)}
            >
              Analizar mi situación real
            </Button>
          </div>

          </div>{/* fin space-y-8 de col 1 */}
        </div>{/* fin col 1 */}

        {/* Col 2: DashboardPanel (solo xl+, oculto en viewports menores).
            Sin sticky ni scroll interno — col 2 scrollea con la página (M37 F3).
            paddingTop dinámico: useLayoutEffect mide la distancia entre el top del banner
            navy (col 1) y el top del aside (col 2) y aplica ese valor como paddingTop.
            Esto garantiza alineación exacta con el banner independientemente del número
            de alertas, del chip del modelo o de cualquier otro elemento variable en col 1. */}
        <aside
          ref={col2Ref}
          className="hidden xl:block xl:col-span-4 xl:sticky xl:top-16"
          aria-label="Dashboard resumen financiero"
        >
          <div style={{ paddingTop: col2PaddingTop > 0 ? col2PaddingTop : undefined }}>
            <DashboardPanel
              dataset={dashboardDataset}
              mode="recommended"
              secondaryCta={{ href: `/diagnosis-form?income=${income}`, label: "Compara tu situación real" }}
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

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p>Cargando resultados...</p>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
