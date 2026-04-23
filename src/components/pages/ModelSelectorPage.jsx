"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllFinancialModels } from "@/lib/models/financialModels";

/**
 * Textos de descripción de la página según el flujo activo.
 * Centralizado aquí para no dispersar strings condicionales por el JSX.
 */
const FLOW_DESCRIPTIONS = {
  direct:  "Elige el modelo con el que calcularás cómo distribuir tu ingreso mensual.",
  inverse: "Elige el modelo con el que calcularás el ingreso necesario para tu estilo de vida deseado."
};

/**
 * Subcomponente que contiene la lógica y UI del selector de modelo.
 * Separado para poder usar useSearchParams dentro de Suspense,
 * requisito de Next.js App Router en Client Components.
 */
function ModelSelectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer el flujo activo — fallback a "direct" si no viene el param
  const flow = searchParams.get("flow") || "direct";

  // Obtener todos los modelos desde la fuente de datos — nunca hardcodeados aquí
  const models = getAllFinancialModels();

  // El modelo 50_30_20 aparece seleccionado por defecto al cargar la página
  const [selectedModelId, setSelectedModelId] = useState("50_30_20");

  /**
   * Navega al formulario correspondiente según el flujo activo,
   * pasando el modelo elegido como query param
   */
  const handleContinue = () => {
    if (flow === "direct") {
      router.push(`/calculator?model=${selectedModelId}`);
    } else {
      router.push(`/inverse-calculator?model=${selectedModelId}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Encabezado — descripción adaptada al flujo activo */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Selecciona tu modelo financiero
          </h1>
          <p className="text-muted-foreground">
            {FLOW_DESCRIPTIONS[flow] ?? FLOW_DESCRIPTIONS.direct}
          </p>
        </div>

        {/* Lista de modelos — renderizada dinámicamente desde getAllFinancialModels() */}
        <div className="flex flex-col gap-4">
          {models.map((model) => {
            const isSelected = model.id === selectedModelId;

            return (
              <Card
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/50"
                    : "hover:border-muted-foreground/50"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {model.name}
                    {/* Indicador visual de selección */}
                    {isSelected && (
                      <span className="text-xs font-normal bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Seleccionado
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>

                {/* Distribución de bloques del modelo */}
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {model.blocks.map((block) => (
                      <span
                        key={block.key}
                        className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                      >
                        {block.label}: {(block.percentage * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1"
          >
            Volver
          </Button>

          {/* "Continuar" solo se activa cuando hay un modelo seleccionado */}
          <Button
            onClick={handleContinue}
            disabled={!selectedModelId}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </div>
    </main>
  );
}

/**
 * Componente de la página de selección de modelo financiero.
 * Envuelve ModelSelectorContent en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
export default function ModelSelectorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    }>
      <ModelSelectorContent />
    </Suspense>
  );
}
