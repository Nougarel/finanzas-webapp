"use client";

import { useState, useEffect, useLayoutEffect, useCallback, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Pencil, Info } from "lucide-react";
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
import { BlockBudgetBars } from "@/components/ui/block-budget-bars";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter, useStudyAwareHref } from "@/lib/research/useStudyAwareRouter";
import { useMounted } from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { CalculationLoader } from "@/components/ui/calculation-loader";

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
      mobileClassName: "text-right",
      render: (val) => (
        <span className="tabular-nums text-sm text-muted-foreground">
          {formatPct(val)}
        </span>
      ),
      mobileRender: (val) => (
        <span className="tabular-nums text-[10px] text-muted-foreground/60 leading-none">
          {formatPct(val)}
        </span>
      ),
    },
  ];
}


function ResultsContent() {
  const router = useStudyAwareRouter();
  const calculatorHref = useStudyAwareHref("/calculator");
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
  const [showLoader, setShowLoader] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [calcError, setCalcError] = useState(null);
  const [insolvencyError, setInsolvencyError] = useState(false);

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  // Refs para el count-up animado del ingreso en el hero
  const incomeElRef   = useRef(null);
  const incomeAnimRef = useRef(null);

  // Refs para el pill animado del segmented control (Mejora 1)
  const tabContainerRef = useRef(null);
  const tabDetailedRef  = useRef(null);
  const tabMacroRef     = useRef(null);
  const pillRef         = useRef(null);

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

  // Timer mínimo del loader narrativo: activa minTimeElapsed a los 7000ms.
  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 7000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Dismiss del loader: cuando el tiempo mínimo Y la API han terminado.
  useEffect(() => {
    if (minTimeElapsed && !loading) setShowLoader(false);
  }, [minTimeElapsed, loading]);

  useEffect(() => {
    if (!profile || !income || isNaN(income) || income <= 0) return;

    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, income })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.insolvencyBlock) {
            setInsolvencyError(true);
            return;
          }
          setCalcError(data.error ?? "Error en el cálculo.");
          return;
        }
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

  // Count-up animado del ingreso en el hero — sincronizado con el fade del banner (Mejora 3).
  // delay 80ms: el número empieza a contar cuando el banner ya es visible.
  // duration 420ms: termina cuando el fade-slide-up de 500ms del banner acaba.
  useEffect(() => {
    if (!income || isNaN(income) || income <= 0) return;
    const delay    = 80;
    const duration = 420;
    let rafId;
    const timeout = setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const t      = Math.min((now - start) / duration, 1);
        const eased  = 1 - (1 - t) * (1 - t); // easeOutQuad
        const current = Math.round(eased * income);
        if (incomeElRef.current)
          incomeElRef.current.textContent = current.toLocaleString("es-ES") + " €";
        if (t < 1) rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [income]);

  // Posiciona el pill del segmented control en la tab activa (Mejora 1).
  // useLayoutEffect garantiza que el pill esté posicionado antes del primer paint,
  // evitando el flash de pill sin posición en el render inicial.
  // getBoundingClientRect() en lugar de offsetLeft: la diferencia entre el left del
  // botón y el left del contenedor da siempre la posición correcta relativa al
  // contenedor, independientemente de la jerarquía de `position` de los ancestros.
  // showLoader en deps: cuando el loader desaparece el toggle se monta por primera
  // vez y los refs pasan de null a válidos — sin esta dep el effect no se re-ejecuta
  // porque viewMode no cambia, y el pill queda con width 0 y sin posición.
  useLayoutEffect(() => {
    const activeRef = viewMode === "detailed" ? tabDetailedRef : tabMacroRef;
    const el        = activeRef.current;
    const pill      = pillRef.current;
    const container = tabContainerRef.current;
    if (!el || !pill || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect        = el.getBoundingClientRect();

    pill.style.width     = `${elRect.width}px`;
    pill.style.transform = `translateX(${elRect.left - containerRect.left}px)`;
  }, [viewMode, showLoader]);

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

  if (showLoader) {
    return (
      <CalculationLoader
        flow="direct"
        isApiDone={!loading}
      />
    );
  }

  if (insolvencyError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Card className="border-destructive bg-destructive/5 w-full max-w-lg">
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-destructive h-6 w-6 shrink-0" aria-hidden />
              <h2 className="font-semibold text-destructive">Deuda superior al ingreso</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu cuota de deuda mensual supera tu ingreso neto. No es posible elaborar un presupuesto viable en esta situación.
            </p>
            <p className="text-sm text-muted-foreground">
              Para continuar, reduce la cuota de deuda en tu perfil o introduce un ingreso mensual mayor.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline">
                <Link href="/profile">Editar perfil</Link>
              </Button>
              <Button asChild>
                <Link href={calculatorHref}>Cambiar ingreso</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
              healthScore={result?.healthScore?.score ?? null}
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
                <Alert variant={alertVariantFromLevel(budgetAlert.level)} size="sm" style={{ animation: "fade-in 300ms ease-out both" }}>
                  {budgetAlert.message}
                </Alert>
              )}
              {debtAlert && (
                <Alert variant={alertVariantFromLevel(debtAlert.level)} size="sm" style={{ animation: "fade-in 300ms ease-out both" }}>
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
          <div className="xl:hidden mb-2">
            <MobileResultsSummary
              dataset={dashboardDataset}
              profile={profile}
              mode="direct"
              income={income}
              onEdit={() => router.push("/profile")}
            />
          </div>

          {/* Ingreso mensual — hero invertido (navy) */}
          {/* bannerRef: referencia para calcular la alineación dinámica de col 2 */}
          <div ref={bannerRef} className="relative rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200" style={{ animation: "fade-slide-up 500ms ease-out both" }}>
            {/* Botón icono "Cambiar ingreso" — esquina superior derecha del banner (Mejora 5) */}
            <button
              type="button"
              onClick={() => router.push("/calculator")}
              className="absolute top-3 right-3 p-1.5 rounded-md text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
              aria-label="Cambiar ingreso"
              title="Cambiar ingreso"
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
            {/* Label en blanco puro (sin opacity attenuation) — el /70 anterior
                se percibía azul-grisáceo sobre el navy en lugar de blanco.
                mt-6 sm:mt-0: separa el label del botón en mobile sin afectar desktop. */}
            <p className="mt-6 sm:mt-0 text-xs font-normal uppercase tracking-meta text-primary-foreground">
              Ingreso mensual neto de referencia
            </p>
            {/* span con ref para el count-up animado — reemplaza MoneyValue en el hero.
                Mismas clases que MoneyValue size="hero" + text-5xl + text-primary-foreground.
                aria-label con el valor real para lectores de pantalla. */}
            <span
              ref={incomeElRef}
              className="tabular-nums text-4xl font-black font-display tracking-display text-5xl text-primary-foreground"
              aria-label={`${income.toLocaleString("es-ES")} euros`}
            >
              {income.toLocaleString("es-ES")} €
            </span>
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

          {/* Selector de vista — pill toggle segmented control (Mejora 1: pill animado) */}
          <div className="space-y-2">
            <div role="group" aria-label="Modo de visualización">
              <div
                ref={tabContainerRef}
                className="relative inline-flex rounded-full border border-border bg-muted/40 p-0.5 gap-0.5"
                style={{ position: "relative" }}
              >
                {/* Pill deslizante — se posiciona y anima vía useEffect */}
                <div ref={pillRef} className="tab-pill bg-primary" aria-hidden="true" />
                <button
                  ref={tabDetailedRef}
                  type="button"
                  onClick={() => setViewMode("detailed")}
                  className={cn(
                    "relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    viewMode === "detailed"
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={viewMode === "detailed"}
                >
                  Por categorías
                </button>
                <button
                  ref={tabMacroRef}
                  type="button"
                  onClick={() => setViewMode("macro")}
                  className={cn(
                    "relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    viewMode === "macro"
                      ? "text-primary-foreground"
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

                {/* Hint clicable — solo en vista detallada, desaparece cuando el panel está abierto */}
                {!selectedCategoryId && (
                  <p className="hidden sm:flex items-center gap-1.5 bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
                    <Info size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    Toca cualquier categoría para ver en base a qué se ha calculado.
                  </p>
                )}

                {BLOCK_ORDER.map((blockKey, blockIndex) => {
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
                    <section
                      key={blockKey}
                      aria-labelledby={`block-${blockKey}-heading`}
                      style={{ animation: `fade-slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) ${blockIndex * 80}ms both` }}
                    >
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
                          <span className="text-[10px] font-normal text-primary-foreground/60 tabular-nums">
                            {formatPct(block.percentage)}
                          </span>
                        </div>
                        <MoneyValue amount={block.amount} size="table" className="font-semibold text-primary-foreground" />
                      </div>

                      {/* Alerta de bloque */}
                      {blockAlert && (
                        <div className="mb-3">
                          <Alert
                            variant={alertVariantFromLevel(blockAlert.level)}
                            size="sm"
                            style={{ animation: "fade-in 300ms ease-out both" }}
                          >
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

          {/* Botones de acción — jerarquía primario / secundario / terciario */}
          <div className="flex flex-col gap-3 w-full pt-2">
            {/* Primario */}
            <Button
              onClick={() => router.push(`/diagnosis-form?income=${income}`)}
              className="w-full sm:w-auto"
            >
              Analizar mi situación real
            </Button>
            {/* Secundarios */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => router.push("/calculator")}>
                Calcular de nuevo
              </Button>
              {!study && (
                <Button variant="ghost" onClick={() => router.push("/")}>
                  Volver al inicio
                </Button>
              )}
              {study && (
                <Button variant="ghost" onClick={() => router.push("/study/home")}>
                  Volver al menú del estudio
                </Button>
              )}
            </div>
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
