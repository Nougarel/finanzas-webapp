"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { MoneyValue } from "@/components/ui/money-value";
import { PageShell } from "@/components/ui/page-shell";
import { CATEGORIES_UI } from "@/lib/models/categories";
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

  const goBack = () => router.push("/inverse-calculator");

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
      key: "healthyAmount",
      header: "Ref. INE",
      className: "text-right",
      render: (val, row) => (
        <span className="inline-flex items-center gap-1.5 justify-end">
          <MoneyValue amount={val} size="table" className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground/70 tabular-nums">({fmtPct(row.healthyPct)})</span>
        </span>
      ),
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

  const comparisonData = comparison
    ? Object.entries(comparison).map(([catId, row]) => {
        const cat = CATEGORIES_UI.find(c => c.id === catId);
        return {
          label: cat?.label ?? catId,
          specifiedAmount: row.specifiedAmount,
          healthyAmount: row.healthyAmount,
          healthyPct: row.healthyPct,
          diff: row.diff,
        };
      })
    : [];

  // Columnas para las tablas de distribución saludable por bloque
  const distributionColumns = [
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

  return (
    <main className="flex min-h-screen flex-col">
      <PageShell variant="table">
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

          {/* Hero: ingreso requerido */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <MoneyValue amount={requiredIncome} size="hero" />
                <p className="text-sm text-muted-foreground font-light">
                  Con este ingreso neto mensual, los importes que has fijado son financieramente sostenibles.
                </p>
                {monthlyDebtPayment > 0 && (
                  <p className="text-sm text-muted-foreground font-light">
                    Incluye{" "}
                    <MoneyValue amount={monthlyDebtPayment} size="inline" className="font-medium" />
                    /mes de cuotas de deuda fija.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

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
                los importes que fijaste. <span className="font-medium text-foreground">Ref. INE</span>{" "}
                es lo que correspondería en una distribución saludable para el ingreso calculado.
                Una diferencia positiva <span className="text-[color:var(--warning-foreground)] font-medium">(↑)</span>{" "}
                indica que estás gastando más de lo recomendado en esa categoría;
                negativa <span className="text-[color:var(--success-foreground)] font-medium">(↓)</span>, menos.
              </p>
              <DataTable
                columns={comparisonColumns}
                data={comparisonData}
                caption="Comparativa de importes especificados frente a distribución saludable"
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
                      label: cat.label,
                      percentage: h.percentage,
                      amount: h.amount,
                      isSpecified: cat.id in (specifiedAmounts ?? {}),
                    };
                  })
                  .filter(Boolean);

                return (
                  <div key={block}>
                    <h3 className="text-base font-medium text-foreground mb-2">
                      {BLOCK_LABELS[block]}
                    </h3>
                    <DataTable
                      columns={distributionColumns}
                      data={blockData}
                      caption={`Distribución saludable — ${BLOCK_LABELS[block]}`}
                    />
                  </div>
                );
              })}
            </div>
          </section>

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

        </div>
      </PageShell>
    </main>
  );
}
