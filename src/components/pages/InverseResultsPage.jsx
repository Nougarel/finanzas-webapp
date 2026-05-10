"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ErrorCard({ title, message, onBack }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{message}</p>
          <Button onClick={onBack}>Volver al formulario</Button>
        </CardContent>
      </Card>
    </main>
  );
}

function InverseResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [calcError, setCalcError] = useState(null);

  const modelId = searchParams.get("model") || "50_30_20";
  const amountsParam = searchParams.get("amounts");
  const mode = searchParams.get("mode") || "manual";

  useEffect(() => {
    if (!amountsParam) return;

    let desiredAmounts;
    try {
      desiredAmounts = JSON.parse(decodeURIComponent(amountsParam));
    } catch {
      setCalcError("Los importes deseados no son válidos. Por favor, rellena el formulario de nuevo.");
      return;
    }

    if (!desiredAmounts || typeof desiredAmounts !== "object") {
      setCalcError("Los importes deseados no son válidos. Por favor, rellena el formulario de nuevo.");
      return;
    }

    setLoading(true);
    setCalcError(null);

    fetch("/api/calculate-inverse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelId, desiredAmounts, mode })
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
  }, [amountsParam, modelId, mode]);

  if (!amountsParam) {
    return (
      <ErrorCard
        title="Error"
        message="Los importes deseados no son válidos. Por favor, rellena el formulario de nuevo."
        onBack={() => router.push(`/inverse-calculator?model=${modelId}`)}
      />
    );
  }

  if (loading || (!result && !calcError)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Calculando...</p>
      </main>
    );
  }

  if (calcError) {
    return (
      <ErrorCard
        title="Error en el cálculo"
        message={calcError}
        onBack={() => router.push(`/inverse-calculator?model=${modelId}`)}
      />
    );
  }

  if (!result) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  const formatPercentage = (percentage) =>
    `${(percentage * 100).toFixed(0)}%`;

  const mostRestrictiveItem = mode === "manual"
    ? result.distribution.find((b) => b.key === result.summary.mostRestrictiveBlock)
    : null;

  let incomeWithoutRestrictive = null;
  let showWarning = false;

  if (mode === "manual") {
    try {
      const otherBlocks = result.distribution.filter(
        (b) => b.key !== result.summary.mostRestrictiveBlock
      );
      if (otherBlocks.length > 0) {
        incomeWithoutRestrictive = Math.max(
          ...otherBlocks.map((b) => b.desiredAmount / b.percentage)
        );
        if (incomeWithoutRestrictive > 0) {
          const disproportion = result.summary.requiredIncome / incomeWithoutRestrictive;
          showWarning = disproportion > 1.30;
        }
      }
    } catch {
      showWarning = false;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Tu ingreso mensual necesario
          </h1>
          <p className="text-muted-foreground">
            Basado en el modelo {result.model.name}
          </p>
        </div>

        {/* Resultado principal */}
        <Card>
          <CardHeader>
            <CardTitle>Ingreso necesario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-5xl font-bold">
              {formatCurrency(result.summary.requiredIncome)}
            </p>
            {mode === "auto" ? (
              <p className="text-muted-foreground">
                Para sostener este estilo de vida de forma financieramente saludable,
                necesitas un ingreso mensual de{" "}
                <strong>{formatCurrency(result.summary.requiredIncome)}</strong>.
              </p>
            ) : mostRestrictiveItem ? (
              <p className="text-muted-foreground">
                Para que tu bloque de <strong>{mostRestrictiveItem.label}</strong> represente
                el <strong>{formatPercentage(mostRestrictiveItem.percentage)}</strong> de tu ingreso,
                necesitas ingresar al menos <strong>{formatCurrency(result.summary.requiredIncome)}</strong> al mes.
              </p>
            ) : null}
          </CardContent>
        </Card>

        {/* Advertencia de desproporción — solo en modo manual */}
        {showWarning && mostRestrictiveItem && (
          <div className="flex gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
            <AlertTriangle className="shrink-0 size-5 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Importe desproporcionado detectado</p>
              <p className="text-sm">
                El importe que has indicado para <strong>{mostRestrictiveItem.label}</strong> es
                proporcionalmente más alto que el resto de bloques. Esto ha elevado el ingreso
                necesario a <strong>{formatCurrency(result.summary.requiredIncome)}</strong>.
                Sin ese bloque como limitante, el ingreso necesario sería
                de <strong>{formatCurrency(incomeWithoutRestrictive)}</strong>. Ajusta ese importe
                si quieres un resultado más representativo de tu estilo de vida.
              </p>
            </div>
          </div>
        )}

        {/* Desglose por bloque */}
        <div className="grid gap-4 md:grid-cols-3">
          {result.distribution.map((block) => (
            <Card key={block.key} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {block.label}
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatPercentage(block.percentage)}
                  </span>
                </CardTitle>
                <CardDescription>{block.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {mode === "auto" ? (
                  block.isAutoCalculated ? (
                    <div>
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mb-2">
                        Calculado automáticamente
                      </span>
                      <p className="text-xl font-bold">{formatCurrency(block.recommendedAmount)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground">Deseado</p>
                      <p className="text-xl font-semibold">{formatCurrency(block.desiredAmount)}</p>
                    </div>
                  )
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Deseado</p>
                      <p className="text-xl font-semibold">{formatCurrency(block.desiredAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recomendado</p>
                      <p className="text-xl font-bold">{formatCurrency(block.recommendedAmount)}</p>
                    </div>
                    {block.difference > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Extra disponible</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          +{formatCurrency(block.difference)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/inverse-calculator?model=${modelId}`)}
          >
            Calcular de nuevo
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Volver al inicio
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
        <p>Cargando resultados...</p>
      </main>
    }>
      <InverseResultsContent />
    </Suspense>
  );
}
