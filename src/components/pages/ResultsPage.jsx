"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BLOCK_ORDER = ["needs", "wants", "savings"];

function AlertDot({ level }) {
  if (!level) return null;
  const color = level === "mild" ? "bg-amber-400" : "bg-red-500";
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${color}`} title={level} />;
}

function dtiColorClass(total) {
  if (total < 35) return "text-green-700";
  if (total < 40) return "text-amber-600";
  return "text-red-600";
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState("detailed");
  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calcError, setCalcError] = useState(null);

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        setProfileMissing(true);
      }
    } else {
      setProfileMissing(true);
    }
  }, []);

  useEffect(() => {
    if (!profile || !income || isNaN(income) || income <= 0) return;

    setLoading(true);
    setCalcError(null);

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

  if (!profile && !profileMissing) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando tu perfil...</p>
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  const formatPct = (pct) => `${pct.toFixed(1)}%`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu Distribución Financiera</h1>
          <p className="text-muted-foreground">Distribución personalizada según tu perfil</p>
          <span className="inline-block text-xs border rounded-full px-3 py-1 text-muted-foreground">
            Tu distribución se aproxima al modelo:{" "}
            <strong>{result.closestModel.label}</strong>
          </span>
        </div>

        {/* Ingreso mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Ingreso Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(income)}</p>
            {result.monthlyDebtPayment > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Cuota fija de deudas: {formatCurrency(result.monthlyDebtPayment)}/mes · Ingreso disponible: {formatCurrency(result.effectiveIncome)}/mes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Selector de vista */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("detailed")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "detailed"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Por categorías
            </button>
            <button
              type="button"
              onClick={() => setViewMode("macro")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "macro"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Por bloques
            </button>
          </div>
          {viewMode === "detailed" && (
            <p className="text-xs text-muted-foreground">
              Los importes por categoría están calculados en base a tu perfil. Úsalos como referencia orientativa.
            </p>
          )}
        </div>

        {/* Vista detallada: bloque → categorías */}
        {viewMode === "detailed" && (
          <div className="space-y-8">
            {BLOCK_ORDER.map((blockKey) => {
              const block = result.blocks[blockKey];
              const cats = Object.values(result.categories).filter((c) => c.block === blockKey);

              return (
                <div key={blockKey}>
                  <div className="flex items-baseline justify-between border-b-2 border-foreground/10 pb-2 mb-3">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-bold">{block.label}</h2>
                      <span className="text-sm text-muted-foreground">{formatPct(block.percentage)}</span>
                    </div>
                    <span className="text-xl font-bold">{formatCurrency(block.amount)}</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {cats.map((cat) => {
                      const alert = result.alerts[cat.id];
                      return (
                        <div
                          key={cat.id}
                          className="flex items-start justify-between rounded-lg bg-muted/40 px-4 py-3"
                        >
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium">{cat.label}</p>
                              {alert && <AlertDot level={alert.level} />}
                            </div>
                            <p className="text-xs text-muted-foreground">{cat.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">{formatCurrency(cat.amount)}</p>
                            <p className="text-xs text-muted-foreground">{formatPct(cat.percentage)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Vista macro: cards de bloque */}
        {viewMode === "macro" && (
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
                    <p className="text-3xl font-bold">{formatCurrency(block.amount)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Indicadores de referencia */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
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
                <p className={`text-2xl font-bold ${dtiColorClass(result.transversal.dti.total)}`}>
                  {formatPct(result.transversal.dti.total)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(result.transversal.dti.amount)} / mes ·{" "}
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
                            <span>{formatCurrency(item.amount)}</span>
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
                <p className="text-2xl font-bold">{formatPct(result.transversal.insurance.total)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(result.transversal.insurance.amount)} / mes
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
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/calculator")}>
            Calcular de nuevo
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
          <Button
            onClick={() =>
              router.push(`/diagnosis-form?income=${income}&model=${result.closestModel.id}`)
            }
          >
            Analizar mi situación real
          </Button>
        </div>
      </div>
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
