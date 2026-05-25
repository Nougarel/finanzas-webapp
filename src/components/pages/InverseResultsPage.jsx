"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES_UI } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import CoherenceWarningScreen from "@/components/pages/CoherenceWarningScreen";

const BLOCK_LABELS = { needs: "Necesidades", wants: "Deseos", savings: "Ahorro" };
const BLOCK_ORDER  = ["needs", "wants", "savings"];

function fmt(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}
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

  // Agrupar categorías por bloque para la tabla de distribución saludable
  const catsByBlock = {};
  for (const block of BLOCK_ORDER) {
    catsByBlock[block] = CATEGORIES_UI.filter(c => c.block === block);
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl space-y-6">

        {/* Encabezado */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Resultado</h1>
          <p className="text-sm text-muted-foreground">
            Ingreso mínimo mensual necesario para sostener los importes especificados
          </p>
        </div>

        {/* Ingreso requerido */}
        <Card>
          <CardHeader>
            <CardTitle>Ingreso mínimo necesario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold tracking-tight">{fmt(requiredIncome)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Con este ingreso neto mensual, los importes que has fijado son financieramente sostenibles.
            </p>
            {monthlyDebtPayment > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Incluye {fmt(monthlyDebtPayment)}/mes de cuotas de deuda fija.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Advertencias */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className="flex gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
                <AlertTriangle className="shrink-0 size-5 mt-0.5" />
                <p className="text-sm">{w}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comparativa: especificado vs. saludable */}
        {comparison && Object.keys(comparison).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Comparativa</CardTitle>
              <CardDescription>Tus importes frente a la distribución saludable con el ingreso calculado</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Categoría</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Especificado</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Ref. INE</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparison).map(([catId, row]) => {
                    const cat  = CATEGORIES_UI.find(c => c.id === catId);
                    const diff = row.diff; // positivo = especificado > saludable
                    return (
                      <tr key={catId} className="border-b last:border-0">
                        <td className="px-4 py-2">{cat?.label ?? catId}</td>
                        <td className="text-right px-4 py-2 font-medium">{fmt(row.specifiedAmount)}</td>
                        <td className="text-right px-4 py-2 text-muted-foreground">
                          {fmt(row.healthyAmount)}
                          <span className="ml-1 text-xs text-muted-foreground/70">({fmtPct(row.healthyPct)})</span>
                        </td>
                        <td className="text-right px-4 py-2">
                          {diff === 0 ? (
                            <span className="inline-flex items-center gap-1 text-muted-foreground"><Minus className="size-3" /> —</span>
                          ) : diff > 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <TrendingUp className="size-3" />{fmt(diff)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <TrendingDown className="size-3" />{fmt(Math.abs(diff))}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Distribución saludable completa */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Distribución saludable completa</h2>
          {BLOCK_ORDER.map(block => (
            <Card key={block}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{BLOCK_LABELS[block]}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <tbody>
                    {catsByBlock[block].map(cat => {
                      const h = healthyDistribution[cat.id];
                      if (!h) return null;
                      const isSpecified = catId => catId in (specifiedAmounts ?? {});
                      return (
                        <tr key={cat.id} className="border-b last:border-0">
                          <td className="px-4 py-2">
                            {cat.label}
                            {isSpecified(cat.id) && (
                              <span className="ml-2 text-xs rounded-full bg-primary/10 text-primary px-1.5 py-0.5">fijado</span>
                            )}
                          </td>
                          <td className="text-right px-4 py-2 text-muted-foreground">{fmtPct(h.percentage)}</td>
                          <td className="text-right px-4 py-2 font-medium">{fmt(h.amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>

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
    </main>
  );
}
