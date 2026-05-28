"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { HealthGauge } from "@/components/ui/health-gauge";
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

// Clase de color para el DTI usando tokens semánticos del design system.
// Devuelve clases de texto con CSS variables — sin hardcodes amber/green/red.
function dtiColorClass(total) {
  if (total < 35) return "text-[color:var(--success-foreground)]";
  if (total < 40) return "text-[color:var(--warning-foreground)]";
  return "text-destructive";
}

// Referencia INE: media nacional para una categoría.
// Los datos INE son estadísticas descriptivas, no benchmarks de salud financiera —
// se muestran siempre en gris neutro independientemente de la desviación.
function IneReference({ ineData, block }) {
  if (!ineData) return null;
  const { ineReference } = ineData;

  if (block === "wants") {
    return (
      <p className="text-xs text-muted-foreground">
        Media española: {ineReference}% del ingreso
      </p>
    );
  }
  return (
    <p className="text-xs text-muted-foreground">
      Media española (INE): {ineReference}%
    </p>
  );
}

// Columnas para DataTable de categorías dentro de un bloque.
// Las alertas y referencias INE se renderizan debajo del nombre.
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
          {row.ineData && <IneReference ineData={row.ineData} block={blockKey} />}
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
              Tu Distribución Financiera
            </h1>
            <p className="text-muted-foreground font-light">
              Distribución personalizada según tu perfil
            </p>
            {result.closestModel && (
              <span className="inline-block text-xs border rounded-full px-3 py-1 text-muted-foreground mt-1">
                Tu distribución se aproxima al modelo:{" "}
                <strong>{result.closestModel.label}</strong>
              </span>
            )}
          </div>

          {/* Ingreso mensual — hero invertido (navy) */}
          <div className="rounded-2xl bg-primary px-6 py-8 space-y-3 transition-colors duration-200">
            <p className="text-xs font-medium uppercase tracking-meta text-primary-foreground/70">
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

          {/* Salud financiera */}
          {result.healthScore && (
            <HealthGauge
              score={result.healthScore.score}
              level={result.healthScore.level}
              label="Salud financiera"
              penalties={result.healthScore.penalties ?? []}
            />
          )}

          {/* Selector de vista */}
          <div className="space-y-2">
            <div className="flex gap-2" role="group" aria-label="Modo de visualización">
              <button
                type="button"
                onClick={() => setViewMode("detailed")}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  viewMode === "detailed"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
                aria-pressed={viewMode === "detailed"}
              >
                Por categorías
              </button>
              <button
                type="button"
                onClick={() => setViewMode("macro")}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  viewMode === "macro"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
                aria-pressed={viewMode === "macro"}
              >
                Por bloques
              </button>
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

          {/* Vista detallada: bloque → DataTable de categorías */}
          {viewMode === "detailed" && (
            <div className="space-y-8">

              {/* Guía de lectura (J4) */}
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                Cada bloque agrupa categorías relacionadas: <span className="font-medium text-foreground">Necesidades</span> (gastos
                imprescindibles), <span className="font-medium text-foreground">Deseos</span> (calidad de vida) y{" "}
                <span className="font-medium text-foreground">Ahorro</span> (tu futuro financiero). El porcentaje
                indica qué parte de tu ingreso mensual se destina a cada categoría. Las alertas señalan categorías
                donde la distribución se aleja de los umbrales saludables para tu perfil.
              </p>

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
                    {/* Cabecera de bloque */}
                    <div className="flex items-baseline justify-between border-b-2 border-foreground/10 pb-2 mb-3">
                      <div className="flex items-baseline gap-3">
                        <h2
                          id={`block-${blockKey}-heading`}
                          className="text-lg font-bold text-foreground"
                        >
                          {block.label}
                        </h2>
                        <span className="text-sm text-muted-foreground">{formatPct(block.percentage)}</span>
                      </div>
                      <MoneyValue amount={block.amount} size="table" className="text-xl font-bold" />
                    </div>

                    {/* Alerta de bloque */}
                    {blockAlert && (
                      <div className="mb-3">
                        <Alert variant={alertVariantFromLevel(blockAlert.level)}>
                          {block.label}: {blockAlert.message}
                        </Alert>
                      </div>
                    )}

                    <DataTable
                      columns={columns}
                      data={tableData}
                      caption={`Distribución de ${block.label}`}
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
            </div>
          )}

          {/* Indicadores de referencia */}
          <section aria-labelledby="indicators-heading">
            <h2
              id="indicators-heading"
              className="text-sm font-semibold text-muted-foreground uppercase tracking-meta mb-3"
            >
              Indicadores de referencia
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ratio de deuda (DTI)</CardTitle>
                  <CardDescription className="text-xs">
                    Hipoteca, cuotas de vehículo y deudas de consumo sobre el ingreso total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold tabular-nums ${dtiColorClass(result.transversal.dti.total)}`}>
                    {formatPct(result.transversal.dti.total)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <MoneyValue amount={result.transversal.dti.amount} size="inline" className="text-xs" />{" "}
                    / mes ·{" "}
                    {result.transversal.dti.total < result.transversal.dti.mild
                      ? "dentro del rango saludable"
                      : result.transversal.dti.total < result.transversal.dti.severe
                      ? "en zona de atención"
                      : "en zona crítica"}
                  </p>
                  {/* Desglose por componente */}
                  {(result.transversal.dti.breakdown.external.amount > 0 ||
                    result.transversal.dti.breakdown.housing.amount > 0 ||
                    result.transversal.dti.breakdown.vehicle.amount > 0) && (
                    <div className="mt-3 space-y-1 border-t pt-2">
                      {[
                        { label: "Deudas de consumo", key: "external" },
                        { label: "Hipoteca",           key: "housing"  },
                        { label: "Vehículo (cuota)",   key: "vehicle"  },
                      ]
                        .filter(({ key }) => result.transversal.dti.breakdown[key].amount > 0)
                        .map(({ label, key }) => {
                          const item = result.transversal.dti.breakdown[key];
                          return (
                            <div key={key} className="flex justify-between text-xs text-muted-foreground">
                              <span>{label}</span>
                              <MoneyValue amount={item.amount} size="inline" className="text-xs" />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gasto total en seguros</CardTitle>
                  <CardDescription className="text-xs">
                    Estimación sobre los importes asignados (vida + salud + vehículo)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold tabular-nums">{formatPct(result.transversal.insurance.total)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <MoneyValue amount={result.transversal.insurance.amount} size="inline" className="text-xs" />{" "}
                    / mes
                  </p>
                  {/* Desglose por componente */}
                  <div className="mt-3 space-y-1 border-t pt-2">
                    <p className="text-xs text-muted-foreground italic pb-1">
                      Estimación orientativa del gasto mensual en seguros. Los importes de seguro de vehículo y salud se calculan a partir del gasto total en su categoría.
                    </p>
                    {[
                      { label: "Seguro de vida", key: "life" },
                      { label: "Seguro médico",  key: "health" },
                      { label: "Seguro vehículo", key: "transport" },
                    ]
                      .filter(({ key }) => result.transversal.insurance.breakdown[key].amount > 0)
                      .map(({ label, key }) => {
                        const item = result.transversal.insurance.breakdown[key];
                        return (
                          <div key={key} className="flex justify-between text-xs text-muted-foreground">
                            <span>{label}</span>
                            <MoneyValue amount={item.amount} size="inline" className="text-xs" />
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

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

        </div>
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
