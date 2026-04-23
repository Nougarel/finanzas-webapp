"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancialModel } from "@/lib/models/financialModels";

/**
 * Subcomponente que contiene el formulario de diagnóstico.
 * Separado para poder usar useSearchParams dentro de Suspense,
 * requisito de Next.js App Router en Client Components.
 */
function DiagnosisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer el ingreso y el modelo de la URL — vienen de la página de resultados
  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);
  const modelId = searchParams.get("model") || "50_30_20";
  const model = getFinancialModel(modelId);

  // Mostrar error si los parámetros de entrada no son válidos
  if (!incomeParam || isNaN(income) || income <= 0 || !model) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Parámetros no válidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Los datos del ingreso o el modelo no son válidos. Por favor, vuelve a los resultados.
            </p>
            <Button onClick={() => router.push("/results")}>
              Volver a resultados
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Inicializar un campo vacío por cada bloque del modelo
  const [amounts, setAmounts] = useState(() =>
    Object.fromEntries(model.blocks.map((block) => [block.key, ""]))
  );

  // Un mensaje de error individual por campo
  const [errors, setErrors] = useState(() =>
    Object.fromEntries(model.blocks.map((block) => [block.key, ""]))
  );

  // Error global del formulario — se activa si la suma total se aleja más de un 30% del ingreso
  const [formError, setFormError] = useState("");

  /**
   * Formatea una cantidad como moneda en euros para las pistas de importe ideal
   */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  /**
   * Actualiza el valor de un campo, limpia su error individual
   * y limpia también el error global si estaba activo
   */
  const handleAmountChange = (key, value) => {
    setAmounts((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
    if (formError) {
      setFormError("");
    }
  };

  /**
   * Valida todos los campos y navega al diagnóstico si son correctos.
   * Los importes reales se pasan como JSON codificado en la URL.
   * Se permite 0 (el usuario puede no estar ahorrando nada en algún bloque).
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasErrors = false;

    for (const block of model.blocks) {
      const raw = amounts[block.key];
      const value = parseFloat(raw);

      if (raw === "" || isNaN(value)) {
        newErrors[block.key] = `Introduce un importe válido para ${block.label}`;
        hasErrors = true;
      } else if (value < 0) {
        newErrors[block.key] = `El importe de ${block.label} no puede ser negativo`;
        hasErrors = true;
      } else {
        newErrors[block.key] = "";
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Construir objeto de importes reales con valores numéricos
    const realAmounts = Object.fromEntries(
      model.blocks.map((block) => [block.key, parseFloat(amounts[block.key])])
    );

    /**
     * Validación global: la suma de los importes reales no debe alejarse más
     * de un 30% del ingreso declarado. El umbral del 30% es deliberado:
     * tolera cifras redondeadas o aproximadas, pero detecta errores evidentes
     * como introducir 3.000€ en ahorro con un ingreso de 2.000€.
     */
    const totalReal = Object.values(realAmounts).reduce((sum, v) => sum + v, 0);
    const deviation = Math.abs(totalReal - income) / income;

    if (deviation > 0.30) {
      setFormError(
        `La suma de tus gastos reales (${formatCurrency(totalReal)}) se aleja considerablemente ` +
        `de tu ingreso mensual declarado (${formatCurrency(income)}). Recuerda que los importes ` +
        `que introduces deben reflejar cómo distribuyes tu ingreso mensual real entre los diferentes ` +
        `bloques. Por favor, revisa las cifras antes de continuar.`
      );
      return;
    }

    // Serializar en la URL — encodeURIComponent para que el JSON sea seguro como query param
    const realParam = encodeURIComponent(JSON.stringify(realAmounts));
    router.push(`/diagnosis?income=${income}&model=${modelId}&real=${realParam}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Cuánto gastas realmente?</CardTitle>
          <CardDescription>
            Introduce tus gastos reales del último mes con el modelo{" "}
            <strong>{model.name}</strong> y un ingreso de{" "}
            <strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(income)}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error global de coherencia — visible solo cuando la suma total se aleja >30% del ingreso */}
            {formError && (
              <div className="flex gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                <AlertTriangle className="shrink-0 size-5 mt-0.5" />
                <p className="text-sm">{formError}</p>
              </div>
            )}

            {/* Campos generados dinámicamente desde model.blocks — nunca hardcodeados */}
            {model.blocks.map((block) => {
              // Importe ideal según el modelo, mostrado como referencia bajo el input
              const idealAmount = income * block.percentage;

              return (
                <div key={block.key} className="space-y-1">
                  <Label htmlFor={block.key}>{block.label} (€)</Label>
                  <Input
                    id={block.key}
                    type="number"
                    placeholder="0"
                    value={amounts[block.key]}
                    onChange={(e) => handleAmountChange(block.key, e.target.value)}
                    min="0"
                    step="0.01"
                    className={errors[block.key] ? "border-red-500" : ""}
                  />
                  {/* Descripción del bloque como texto de ayuda */}
                  <p className="text-xs text-muted-foreground">{block.description}</p>
                  {/* Referencia del importe ideal para que el usuario tenga contexto */}
                  <p className="text-xs text-muted-foreground">
                    El modelo recomienda {formatCurrency(idealAmount)} para este bloque
                  </p>
                  {/* Error individual por campo */}
                  {errors[block.key] && (
                    <p className="text-sm text-red-500">{errors[block.key]}</p>
                  )}
                </div>
              );
            })}

            {/* Botones */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/results?income=${income}&model=${modelId}`)}
                className="flex-1"
              >
                Volver
              </Button>
              <Button type="submit" className="flex-1">
                Ver diagnóstico
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

/**
 * Componente de la página del formulario de diagnóstico.
 * Envuelve DiagnosisForm en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
export default function DiagnosisFormPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    }>
      <DiagnosisForm />
    </Suspense>
  );
}
