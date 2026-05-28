"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { HealthGauge } from "@/components/ui/health-gauge";
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
          <span className="text-xs text-muted-foreground/70 tabular-nums">
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
        <div className="inline-flex items-center gap-1 justify-center">
          <StatusIcon status={val} />
          <span className="text-xs text-muted-foreground">{statusText(val)}</span>
        </div>
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
      <PageShell variant="table">
        <div className="space-y-8">

          {/* Alertas críticas de sistema — siempre en lo más alto */}
          {(budgetAlert || debtAlert) && (
            <div className="space-y-2">
              {budgetAlert && (
                <Alert variant={alertVariantFromLevel(budgetAlert.level)}>
                  {budgetAlert.message}
                </Alert>
              )}
              {debtAlert && (
                <Alert variant={alertVariantFromLevel(debtAlert.level)}>
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

          {/* Ingreso de referencia — hero invertido (navy) */}
          <div className="rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200">
            <p className="text-xs font-medium uppercase tracking-meta text-primary-foreground/70">
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

          {/* Score de salud */}
          {diagnosis.healthScore && (
            <HealthGauge
              score={diagnosis.healthScore.score}
              level={diagnosis.healthScore.level}
              label="Salud financiera de tu situación real"
              penalties={diagnosis.healthScore.penalties ?? []}
              categoryLabels={categoryLabels}
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

          {/* Comparativa por categoría, agrupada por bloque */}
          <div className="space-y-8">

            {/* Guía de lectura J4 — cómo interpretar la tabla */}
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              La tabla compara lo que gastas realmente en cada categoría frente a la distribución
              saludable calculada para tu perfil e ingreso. El campo{" "}
              <span className="font-medium text-foreground">Estado</span> indica si tu gasto está{" "}
              <span className="font-medium text-[color:var(--success-foreground)]">Alineado</span>{" "}
              con el rango saludable,{" "}
              <span className="font-medium text-[color:var(--warning-foreground)]">Por encima</span>{" "}
              (riesgo de desajuste) o{" "}
              <span className="font-medium text-[color:var(--info-foreground)]">Por debajo</span>{" "}
              (margen de mejora). El{" "}
              <span className="font-medium text-foreground">score de salud financiera</span> resume
              el conjunto: cuantas más categorías estén alineadas, mayor será la puntuación.
            </p>

            {BLOCK_ORDER.map((blockKey) => {
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
                <section key={blockKey} aria-labelledby={`block-${blockKey}-heading`}>
                  {/* Cabecera de bloque */}
                  <div className="flex items-baseline justify-between border-b-2 border-foreground/10 pb-2 mb-3">
                    <div className="flex items-baseline gap-3">
                      <h2
                        id={`block-${blockKey}-heading`}
                        className="text-lg font-bold text-foreground"
                      >
                        {diagnosis.blocks[blockKey].label}
                      </h2>
                    </div>
                    <MoneyValue
                      amount={diagnosis.blocks[blockKey].realAmount}
                      size="table"
                      className="text-muted-foreground"
                    />
                  </div>

                  {/* Alerta de bloque */}
                  {blockAlert && (
                    <div className="mb-3">
                      <Alert variant={alertVariantFromLevel(blockAlert.level)}>
                        {diagnosis.blocks[blockKey].label}: {blockAlert.message}
                      </Alert>
                    </div>
                  )}

                  <DataTable
                    columns={comparisonColumns}
                    data={tableData}
                    caption={`Comparativa de ${diagnosis.blocks[blockKey].label}`}
                  />
                </section>
              );
            })}
          </div>

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

        </div>
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
