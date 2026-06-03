"use client";

import { useState, useEffect, useLayoutEffect, useCallback, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CollapsibleHint } from "@/components/ui/collapsible-hint";
import { Check, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { HealthGauge } from "@/components/ui/health-gauge";
import { DetailPanelLayout } from "@/components/ui/detail-panel-layout";
import { CategoryDetail } from "@/components/ui/category-detail";
import { DashboardPanel } from "@/components/ui/dashboard-panel";
import { ProfilePanel } from "@/components/ui/profile-panel";
import { MobileResultsSummary } from "@/components/ui/mobile-results-summary";
import { CATEGORIES_UI } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import { useMounted } from "@/lib/hooks/useMounted";

const BLOCK_ORDER = ["needs", "wants", "savings"];

// Mapeo de nivel de alerta del backend a variante del componente Alert.
// - severe → error (rojo destructivo)
// - mild   → warning (ámbar)
function alertVariantFromLevel(level) {
  return level === "severe" ? "error" : "warning";
}

// ─── StatusIcon + statusText ───────────────────────────────────────────────────
// Mapeo a tokens semánticos:
//   on_target     → success  (alineado con lo saludable)
//   above_healthy → warning  (gasto superior al recomendado)
//   below_healthy → info     (gasto inferior al recomendado; antes blue hardcodeado)

function StatusIcon({ status }) {
  if (status === "on_target") {
    return (
      <Check
        className="size-4 shrink-0 text-[color:var(--success-foreground)]"
        aria-hidden
      />
    );
  }
  if (status === "above_healthy") {
    return (
      <ArrowUp
        className="size-4 shrink-0 text-[color:var(--warning-foreground)]"
        aria-hidden
      />
    );
  }
  if (status === "below_healthy") {
    return (
      <ArrowDown
        className="size-4 shrink-0 text-[color:var(--info-foreground)]"
        aria-hidden
      />
    );
  }
  return null;
}

function statusText(status) {
  if (status === "on_target")     return "Alineado";
  if (status === "above_healthy") return "Por encima";
  if (status === "below_healthy") return "Por debajo";
  return "—";
}

// Clases del pill de estado según el token semántico correspondiente.
function statusPillClass(status) {
  if (status === "on_target")     return "bg-[color:var(--success-subtle)] text-[color:var(--success-foreground)]";
  if (status === "above_healthy") return "bg-[color:var(--warning-subtle)] text-[color:var(--warning-foreground)]";
  if (status === "below_healthy") return "bg-[color:var(--info-subtle)] text-[color:var(--info-foreground)]";
  return "bg-muted text-muted-foreground";
}

// ─── Resumen de bloque (tarjeta) ──────────────────────────────────────────────
// Usa tokens semánticos para la desviación: para gasto (needs/wants) menos es
// mejor → positivo es warning, negativo es success. Para ahorro es al revés.

function blockDiffClass(blockKey, diffAmount) {
  const isOver = diffAmount > 0;
  if (blockKey === "savings") {
    // Ahorro: más es mejor
    return isOver
      ? "text-[color:var(--success-foreground)]"
      : "text-[color:var(--warning-foreground)]";
  }
  // Gasto: menos es mejor
  return isOver
    ? "text-[color:var(--warning-foreground)]"
    : "text-[color:var(--success-foreground)]";
}

// ─── Columnas DataTable para comparativa por categoría ────────────────────────

function buildComparisonColumns(formatPct) {
  return [
    {
      key: "label",
      header: "Categoría",
      render: (val, row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{val}</p>
          {row.catAlert && (
            <div className="mt-1.5">
              <Alert
                variant={alertVariantFromLevel(row.catAlert.level)}
                size="compact"
              >
                {row.catAlert.message}
              </Alert>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "realAmount",
      header: "Tu gasto",
      className: "text-right align-top",
      render: (val) => <MoneyValue amount={val} size="table" />,
    },
    {
      key: "healthyAmount",
      header: "Recomendado",
      className: "text-right align-top",
      render: (val, row) => (
        <span className="inline-flex flex-col items-end gap-0.5">
          <MoneyValue amount={val} size="table" className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground tabular-nums">
            ({formatPct(row.healthyPercentage)})
          </span>
        </span>
      ),
    },
    {
      key: "diffAmount",
      header: "Diferencia",
      className: "text-right align-top",
      render: (val) => <MoneyValue amount={val} size="table" showSign />,
    },
    {
      key: "status",
      header: "Estado",
      className: "text-center align-top",
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-200 ${statusPillClass(val)}`}
        >
          <StatusIcon status={val} />
          {statusText(val)}
        </span>
      ),
    },
  ];
}

// ─── Componente principal ──────────────────────────────────────────────────────

function DiagnosisContent() {
  const router = useStudyAwareRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.profileCurrent);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const profileMissing = profile === null;

  const [realAmounts] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.diagnosisAmounts);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const amountsMissing = realAmounts === null;

  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      !!localStorage.getItem(STORAGE_KEYS.profileCurrent) &&
      !!localStorage.getItem(STORAGE_KEYS.diagnosisAmounts)
    );
  });
  const [calcError, setCalcError] = useState(null);
  // Estado efímero del panel de detalle (ADR-11 — no en URL)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Refs para alineación dinámica col 2 con el banner navy (Fix M37).
  // profileColRef: aside de col 0 (ProfilePanel) — reutiliza el mismo offset.
  const bannerRef     = useRef(null);
  const col2Ref       = useRef(null);
  const profileColRef = useRef(null);
  const [col2PaddingTop, setCol2PaddingTop] = useState(0);

  // Modo testing guiado (M18 Fase 4): notificar diagnóstico completado al
  // sistema research si el contexto /study está activo.
  const study = useStudyContextOptional();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (study && diagnosis && profile && !notifiedRef.current) {
      notifiedRef.current = true;
      study.notifyCalculation(
        "diagnosis",
        profile,
        { income, realAmounts },
        diagnosis
      );
    }
  }, [study, diagnosis, profile, income, realAmounts]);

  useEffect(() => {
    if (!profile || !income || isNaN(income) || income <= 0 || !realAmounts) return;

    fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, income, realAmounts }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setCalcError(data.error);
        else setDiagnosis(data);
      })
      .catch(() => setCalcError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, [profile, income, realAmounts]);

  // ── Dataset para DashboardPanel (mode="real") ─────────────────────────────────
  // Construye la estructura unificada que espera DashboardPanel desde los datos
  // REALES del usuario (diagnosis.realDistribution + diagnosis.blocks.*.realAmount).
  // Debe estar antes de los early returns para cumplir las reglas de hooks.
  //
  // Decisión de diseño: dataset.income = ingreso de referencia (no el gasto real total).
  // El DashboardPanel en mode="real" muestra dataset.income como valor central con
  // label "gasto real" — la discrepancia respecto a spec §5 es aceptada porque
  // garantiza que los indicadores (tasa de ahorro, ratio necesidades, DTI) usan
  // el denominador correcto (income, no gasto total). Modificar DashboardPanel
  // para aceptar un centerValue independiente está fuera del scope de F3.
  const dashboardDataset = useMemo(() => {
    if (!diagnosis) return null;
    // Mapa plano de categorías desde realDistribution (fuente: gasto real)
    const categories = {};
    for (const [catId, cat] of Object.entries(diagnosis.realDistribution)) {
      categories[catId] = {
        id: catId,
        label: cat.label,
        block: cat.block,
        percentage: cat.percentage,         // % real sobre ingreso
        amount: cat.amount,                 // importe real en €
      };
    }
    // Bloques: porcentaje calculado como realAmount / income * 100
    const needsPct  = income > 0 ? (diagnosis.blocks.needs.realAmount  / income) * 100 : 0;
    const wantsPct  = income > 0 ? (diagnosis.blocks.wants.realAmount  / income) * 100 : 0;
    const savingsPct = income > 0 ? (diagnosis.blocks.savings.realAmount / income) * 100 : 0;
    return {
      income,                               // denominador para indicadores
      blocks: {
        needs:   { label: diagnosis.blocks.needs.label,   percentage: parseFloat(needsPct.toFixed(2)),   amount: diagnosis.blocks.needs.realAmount   },
        wants:   { label: diagnosis.blocks.wants.label,   percentage: parseFloat(wantsPct.toFixed(2)),   amount: diagnosis.blocks.wants.realAmount   },
        savings: { label: diagnosis.blocks.savings.label, percentage: parseFloat(savingsPct.toFixed(2)), amount: diagnosis.blocks.savings.realAmount },
      },
      categories,
      transversal: {
        dti: { total: diagnosis.transversal?.dti?.total ?? 0 },
      },
    };
  }, [diagnosis, income]);

  // ── Alineación dinámica col 2 (Fix M37) ──────────────────────────────────────

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
  }, [diagnosis, recalcCol2Alignment]);

  useEffect(() => {
    window.addEventListener("resize", recalcCol2Alignment);
    return () => window.removeEventListener("resize", recalcCol2Alignment);
  }, [recalcCol2Alignment]);

  // ── Guards de estado ─────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground font-light">Cargando…</p>
      </main>
    );
  }

  if (!incomeParam || isNaN(income) || income <= 0 || amountsMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Datos inválidos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Vuelve al formulario para introducir tus importes reales.
            </p>
            <Button onClick={() => router.push(`/diagnosis-form?income=${income}`)}>
              Volver al formulario
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (profileMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Perfil no encontrado</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Necesitas completar el cuestionario antes de diagnosticar.
            </p>
            <Button onClick={() => router.push("/profile")}>Completar perfil</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading || (!diagnosis && !calcError)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Analizando tu situación...</p>
      </main>
    );
  }

  if (calcError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Error en el diagnóstico</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{calcError}</p>
            <Button onClick={() => router.push(`/diagnosis-form?income=${income}`)}>
              Volver al formulario
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ── Helpers de formato ───────────────────────────────────────────────────────

  const formatPct = (n) => `${n.toFixed(1)}%`;

  // Mapa label para HealthGauge (penalties) y banners
  const categoryLabels = {
    ...Object.fromEntries(CATEGORIES_UI.map((c) => [c.id, c.label])),
    _wants_block:   "Bloque de deseos",
    _savings_block: "Bloque de ahorro",
    _budget_block:  "Presupuesto insuficiente",
    _debt_block:    "Carga de deuda alta",
  };

  const budgetAlert = diagnosis.alerts?._budget_block;
  const debtAlert   = diagnosis.alerts?._debt_block;

  const comparisonColumns = buildComparisonColumns(formatPct);

  // ── Render principal ─────────────────────────────────────────────────────────

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
              Diagnóstico de tu situación real
            </h1>
            <p className="text-muted-foreground font-light">
              Comparación de tu gasto real contra la distribución saludable para tu perfil
            </p>
          </div>

          {/* Franja de resumen mobile — visible solo en < xl */}
          <div className="xl:hidden">
            <MobileResultsSummary
              dataset={dashboardDataset}
              profile={profile}
              mode="real"
              income={income}
            />
          </div>

          {/* Ingreso de referencia — hero invertido (navy) */}
          {/* bannerRef: referencia para calcular la alineación dinámica de col 2 */}
          <div ref={bannerRef} className="rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200">
            {/* Label blanco puro — el /70 anterior daba sensación gris-azulada */}
            <p className="text-xs font-normal uppercase tracking-meta text-primary-foreground">
              Ingreso neto de referencia
            </p>
            <MoneyValue
              amount={income}
              size="hero"
              className="text-5xl text-primary-foreground"
            />
            <p className="text-sm text-primary-foreground/80 font-light">
              La distribución saludable está calculada sobre este ingreso mensual neto.
            </p>
          </div>

          {/* Score de salud — card protagonista, elevación sutil (M36) */}
          {diagnosis.healthScore && (
            <HealthGauge
              score={diagnosis.healthScore.score}
              level={diagnosis.healthScore.level}
              label="Salud financiera de tu situación real"
              penalties={diagnosis.healthScore.penalties ?? []}
              categoryLabels={categoryLabels}
              className="card-elevated"
            />
          )}

          {/* Nota de ingreso efectivo (deuda fija) */}
          {diagnosis.monthlyDebtPayment > 0 && (
            <p className="text-sm text-muted-foreground bg-muted/40 rounded-md px-4 py-3 font-light">
              La distribución saludable está calculada sobre{" "}
              <MoneyValue
                amount={diagnosis.effectiveIncome}
                size="inline"
                className="font-medium text-foreground"
              />
              /mes — tu ingreso disponible tras descontar los{" "}
              <MoneyValue
                amount={diagnosis.monthlyDebtPayment}
                size="inline"
                className="font-medium text-foreground"
              />
              /mes de cuotas de deuda fija.
            </p>
          )}

          {/* Resumen por bloque */}
          <div className="grid gap-4 md:grid-cols-3">
            {BLOCK_ORDER.map((blockKey) => {
              const b = diagnosis.blocks[blockKey];
              const isOver = b.diffAmount > 0;
              const sign = isOver ? "+" : "";
              const diffClass = blockDiffClass(blockKey, b.diffAmount);
              return (
                <Card key={blockKey}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{b.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Real:{" "}
                      <MoneyValue
                        amount={b.realAmount}
                        size="inline"
                        className="font-medium text-foreground"
                      />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recomendado:{" "}
                      <MoneyValue amount={b.healthyAmount} size="inline" />
                    </p>
                    <p className={`text-sm font-medium tabular-nums ${diffClass}`}>
                      {sign}
                      <MoneyValue amount={b.diffAmount} size="inline" showSign={false} />{" "}
                      ({sign}{b.deviationPct.toFixed(1)}%)
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparativa por categoría, agrupada por bloque — con panel de detalle M36 */}
          <DetailPanelLayout
            selectedCategoryId={selectedCategoryId}
            onClose={() => setSelectedCategoryId(null)}
            panelContent={
              selectedCategoryId && diagnosis.healthyDistribution?.[selectedCategoryId]
                ? (
                  <CategoryDetail
                    category={diagnosis.healthyDistribution[selectedCategoryId]}
                    ineData={null}
                    income={income}
                    onClose={() => setSelectedCategoryId(null)}
                    drivers={diagnosis.explanation?.[selectedCategoryId]?.drivers ?? []}
                    profile={profile}
                  />
                )
                : null
            }
          >
            <div className="space-y-8">

              {/* Mini-leyenda de estados — oculta en mobile, visible en sm+ */}
              <p className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="text-[color:var(--success-foreground)] font-medium">✓ Alineado</span>
                <span className="text-[color:var(--warning-foreground)] font-medium">↑ Por encima</span>
                <span className="text-[color:var(--info-foreground)] font-medium">↓ Por debajo</span>
              </p>

              {/* Hint clicable — desaparece cuando el panel está abierto */}
              {!selectedCategoryId && (
                <p className="hidden sm:flex text-xs text-muted-foreground items-center gap-1.5">
                  <span aria-hidden="true">›</span>
                  Toca cualquier categoría para ver el respaldo institucional de su cálculo.
                </p>
              )}

              {BLOCK_ORDER.map((blockKey, blockIndex) => {
                const cats = CATEGORIES_UI.filter((c) => c.block === blockKey);
                const blockAlert = diagnosis.alerts?.[`_${blockKey}_block`];

                // Construir filas para DataTable
                const tableData = cats.map((cat) => {
                  const c = diagnosis.comparison[cat.id];
                  return {
                    id: cat.id,
                    label: cat.label,
                    realAmount: c.realAmount,
                    healthyAmount: c.healthyAmount,
                    healthyPercentage: c.healthyPercentage,
                    diffAmount: c.diffAmount,
                    status: c.status,
                    catAlert: diagnosis.alerts?.[cat.id] ?? null,
                  };
                });

                return (
                  <section
                    key={blockKey}
                    aria-labelledby={`block-${blockKey}-heading`}
                    className={blockIndex > 0 ? "border-t border-border/40 pt-6" : undefined}
                  >
                    {/* Banner navy de bloque — reemplaza la cabecera anterior.
                        rounded-t-lg en el banner + DataTable sin margen superior
                        → visualmente se leen como una unidad. */}
                    <div className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-3">
                      <h2
                        id={`block-${blockKey}-heading`}
                        className="text-sm font-bold uppercase tracking-meta text-primary-foreground"
                      >
                        {diagnosis.blocks[blockKey].label}
                      </h2>
                      <MoneyValue
                        amount={diagnosis.blocks[blockKey].realAmount}
                        size="table"
                        className="font-semibold text-primary-foreground"
                      />
                    </div>

                    {/* Alerta de bloque */}
                    {blockAlert && (
                      <div className="mb-3">
                        <Alert variant={alertVariantFromLevel(blockAlert.level)} size="sm">
                          {diagnosis.blocks[blockKey].label}: {blockAlert.message}
                        </Alert>
                      </div>
                    )}

                    <DataTable
                      columns={comparisonColumns}
                      data={tableData}
                      caption={`Comparativa de ${diagnosis.blocks[blockKey].label}`}
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
                  </section>
                );
              })}

            </div>
          </DetailPanelLayout>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/diagnosis-form?income=${income}`)}
            >
              Recalcular
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/results?income=${income}`)}
            >
              Volver a resultados
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

        {/* Col 2: DashboardPanel en mode="real" (solo xl+, oculto en viewports menores).
            Sin sticky ni scroll interno — col 2 scrollea con la página (M37 F3).
            paddingTop dinámico: calculado por useLayoutEffect para alinear con el banner
            navy de col 1, independientemente del número de alertas u otros elementos
            variables por encima del banner. */}
        <aside
          ref={col2Ref}
          className="hidden xl:block xl:col-span-4 xl:sticky xl:top-16"
          aria-label="Dashboard resumen de situación real"
        >
          <div style={{ paddingTop: col2PaddingTop > 0 ? col2PaddingTop : undefined }}>
            <DashboardPanel
              dataset={dashboardDataset}
              mode="real"
              secondaryCta={{ href: "/calculator", label: "Ver distribución ideal" }}
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

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p>Cargando diagnóstico...</p>
        </main>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
