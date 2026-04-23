"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDistribution } from "@/lib/calculators/distributionCalculator";
import { getModelWithCategories } from "@/lib/models/financialModels";

/**
 * Componente que muestra los resultados del cálculo directo.
 * Separado para manejar Suspense con useSearchParams.
 */
function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Vista activa: "detailed" (categorías, por defecto) o "macro" (bloques)
  const [viewMode, setViewMode] = useState("detailed");

  // Obtener ingreso y modelo de los parámetros de URL
  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);
  const modelId = searchParams.get("model") || "50_30_20";

  // Validar ingreso
  if (!incomeParam || isNaN(income) || income <= 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Ingreso inválido</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No se pudo calcular la distribución. Por favor, introduce un ingreso válido.
            </p>
            <Button onClick={() => router.push("/calculator")}>
              Volver al formulario
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Obtener el modelo hidratado con sus categorías
  const model = getModelWithCategories(modelId);

  if (!model) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Modelo financiero no encontrado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              El modelo "{modelId}" no existe. Por favor, selecciona un modelo válido.
            </p>
            <Button onClick={() => router.push("/model-selector")}>
              Volver a la selección
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Calcular la distribución usando el motor de cálculo
  let result;
  try {
    result = calculateDistribution({
      calculationType: "direct",
      income: income,
      model: model
    });
  } catch (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Error en el cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => router.push("/calculator")}>
              Volver al formulario
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  const formatPercentage = (percentage) =>
    `${(percentage * 100).toFixed(0)}%`;

  // Combinar los bloques del modelo (con categorías) con los importes calculados
  // result.distribution tiene los importes; model.blocks tiene las categorías
  const blocksWithAmounts = model.blocks.map((block) => {
    const calculated = result.distribution.find((d) => d.key === block.key);
    return { ...block, amount: calculated?.formattedAmount ?? 0 };
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Tu Distribución Financiera
          </h1>
          <p className="text-muted-foreground">
            Basado en el modelo {result.model.name}
          </p>
        </div>

        {/* Card con resumen de ingreso */}
        <Card>
          <CardHeader>
            <CardTitle>Ingreso Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {formatCurrency(result.summary.totalIncome)}
            </p>
          </CardContent>
        </Card>

        {/* Selector de vista — dos tabs */}
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
          {/* Texto de ayuda — solo visible en la vista detallada */}
          {viewMode === "detailed" && (
            <p className="text-xs text-muted-foreground">
              Los importes por categoría son orientativos. Te muestran cómo podría distribuirse
              tu presupuesto dentro de cada bloque.
            </p>
          )}
        </div>

        {/* Vista detallada: cabecera de bloque + lista de categorías */}
        {viewMode === "detailed" && (
          <div className="space-y-6">
            {blocksWithAmounts.map((block) => {
              const categoryCount = block.categories.length;
              // Reparto equitativo del importe del bloque entre sus categorías
              const amountPerCategory = categoryCount > 0
                ? block.amount / categoryCount
                : 0;

              return (
                <div key={block.key}>
                  {/* Cabecera del bloque — actúa como separador visual prominente */}
                  <div className="flex items-baseline justify-between border-b-2 border-foreground/10 pb-2 mb-3">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-bold">{block.label}</h2>
                      <span className="text-sm text-muted-foreground">
                        {formatPercentage(block.percentage)}
                      </span>
                    </div>
                    <span className="text-xl font-bold">
                      {formatCurrency(block.amount)}
                    </span>
                  </div>

                  {/* Lista de categorías del bloque */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {block.categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-start justify-between rounded-lg bg-muted/40 px-4 py-3"
                      >
                        <div className="space-y-0.5 pr-4">
                          <p className="text-sm font-medium">{category.label}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                        <p className="text-sm font-semibold shrink-0">
                          {formatCurrency(amountPerCategory)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Vista macro: cards de bloque, comportamiento original sin cambios */}
        {viewMode === "macro" && (
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
                <CardContent className="flex-1 flex items-end">
                  <p className="text-3xl font-bold">
                    {formatCurrency(block.formattedAmount)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button variant="outline" onClick={() => router.push("/calculator")}>
            Calcular de nuevo
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
          <Button onClick={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}>
            Analizar mi situación real
          </Button>
        </div>
      </div>
    </main>
  );
}

/**
 * Componente de la página de resultados.
 * Envuelve ResultsContent en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando resultados...</p>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
