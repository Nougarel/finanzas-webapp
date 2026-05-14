"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES_CATALOG } from "@/lib/models/categories";

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

function InverseResultsContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const [loading,   setLoading]   = useState(true);
  const [result,    setResult]    = useState(null);
  const [calcError, setCalcError] = useState(null);

  const amountsParam = searchParams.get("amounts");

  useEffect(() => {
    if (!amountsParam) { setLoading(false); return; }

    let specifiedAmounts;
    try { specifiedAmounts = JSON.parse(decodeURIComponent(amountsParam)); }
    catch { setCalcError("Los importes no son válidos."); setLoading(false); return; }

    const profile = (() => {
      try { return JSON.parse(localStorage.getItem("userProfile") ?? "null"); }
      catch { return null; }
    })();

    if (!profile) {
      setCalcError("No se encontró el perfil. Vuelve a completarlo.");
      setLoading(false);
      return;
    }

    fetch("/api/calculate-inverse", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ profile, specifiedAmounts }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setCalcError(data.error); }
        else            { setResult(data); }
      })
      .catch(() => setCalcError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, [amountsParam]);

  const goBack = () => {
    const suffix = amountsParam ? `?amounts=${amountsParam}` : "";
    router.push(`/inverse-calculator${suffix}`);
  };

  if (!amountsParam) {
    return <ErrorCard title="Sin datos" message="No se han recibido importes." onBack={() => router.push("/inverse-calculator")} />;
  }
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Calculando ingreso mínimo...</p>
      </main>
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
    catsByBlock[block] = CATEGORIES_CATALOG.filter(c => c.block === block);
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
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Saludable</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparison).map(([catId, row]) => {
                    const cat  = CATEGORIES_CATALOG.find(c => c.id === catId);
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
          <Button variant="outline" onClick={() => router.push("/")}>
            Inicio
          </Button>
        </div>

      </div>
    </main>
  );
}

export default function InverseResultsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando resultados...</p>
      </main>
    }>
      <InverseResultsContent />
    </Suspense>
  );
}
