"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancialModel } from "@/lib/models/financialModels";

/**
 * Devuelve las claves de los campos activos según el modo seleccionado.
 * En auto solo los bloques de gasto; en manual todos.
 */
function getActiveBlocks(model, savingsMode) {
  if (savingsMode === "auto") {
    return model.blocks.filter((b) => b.type === "expense");
  }
  return model.blocks;
}

/**
 * Subcomponente que contiene el formulario del cálculo inverso.
 * Separado para poder usar useSearchParams dentro de Suspense,
 * requisito de Next.js App Router en Client Components.
 */
function InverseCalculatorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer el modelo elegido en el paso anterior — fallback a "50_30_20" si no viene en la URL
  const modelId = searchParams.get("model") || "50_30_20";
  const model = getFinancialModel(modelId);

  // Modo de ahorro: "auto" (los ahorros se calculan solos) o "manual" (el usuario los introduce)
  const [savingsMode, setSavingsMode] = useState("auto");

  // Un campo vacío por bloque — se reinicia al cambiar de modo para evitar valores huérfanos
  const [amounts, setAmounts] = useState(() =>
    model ? Object.fromEntries(model.blocks.map((b) => [b.key, ""])) : {}
  );

  // Un mensaje de error individual por campo
  const [errors, setErrors] = useState(() =>
    model ? Object.fromEntries(model.blocks.map((b) => [b.key, ""])) : {}
  );

  // Mostrar error si el modelo no existe en el registro
  if (!model) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Modelo no encontrado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              El modelo "{modelId}" no existe. Por favor, selecciona un modelo válido.
            </p>
            <Button onClick={() => router.push("/profile")}>
              Volver a la selección
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * Cambia el modo y reinicia todos los campos para evitar valores inconsistentes
   */
  const handleModeChange = (newMode) => {
    setSavingsMode(newMode);
    setAmounts(Object.fromEntries(model.blocks.map((b) => [b.key, ""])));
    setErrors(Object.fromEntries(model.blocks.map((b) => [b.key, ""])));
  };

  /**
   * Actualiza el valor de un campo y limpia su error si lo tenía
   */
  const handleAmountChange = (key, value) => {
    setAmounts((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  /**
   * Valida los campos activos y navega a los resultados.
   * En modo auto solo se validan y envían los bloques de gasto.
   * Los importes se pasan serializados como JSON en la URL.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const activeBlocks = getActiveBlocks(model, savingsMode);
    const newErrors = {};
    let hasErrors = false;

    for (const block of activeBlocks) {
      const value = parseFloat(amounts[block.key]);

      if (!amounts[block.key] || isNaN(value)) {
        newErrors[block.key] = `Introduce un importe válido para ${block.label}`;
        hasErrors = true;
      } else if (value <= 0) {
        newErrors[block.key] = `El importe de ${block.label} debe ser mayor que 0`;
        hasErrors = true;
      } else {
        newErrors[block.key] = "";
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // En modo auto, solo los bloques de gasto van en la URL
    const desiredAmounts = Object.fromEntries(
      activeBlocks.map((block) => [block.key, parseFloat(amounts[block.key])])
    );

    const amountsParam = encodeURIComponent(JSON.stringify(desiredAmounts));
    router.push(`/inverse-results?model=${modelId}&amounts=${amountsParam}&mode=${savingsMode}`);
  };

  const activeBlocks = getActiveBlocks(model, savingsMode);
  const savingsBlocks = model.blocks.filter((b) => b.type === "savings");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Cuánto quieres en cada bloque?</CardTitle>
          <CardDescription>
            Indica el importe mensual deseado para cada categoría del modelo {model.name}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Selector de modo — dos botones estilo tab */}
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium">¿Cómo quieres calcular el ahorro?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("auto")}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  savingsMode === "auto"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="text-sm font-semibold">Automático</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Solo introduces tus gastos; el ahorro se calcula solo
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("manual")}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  savingsMode === "manual"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="text-sm font-semibold">Manual</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Introduces tú mismo el importe de cada bloque, incluido el ahorro
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campos activos según el modo */}
            {activeBlocks.map((block) => (
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
                <p className="text-xs text-muted-foreground">{block.description}</p>
                {errors[block.key] && (
                  <p className="text-sm text-red-500">{errors[block.key]}</p>
                )}
              </div>
            ))}

            {/* En modo auto, mostrar los bloques de ahorro como solo lectura */}
            {savingsMode === "auto" && savingsBlocks.length > 0 && (
              <div className="space-y-3 rounded-lg bg-muted/50 border border-dashed p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Se calculará automáticamente
                </p>
                {savingsBlocks.map((block) => (
                  <div key={block.key} className="space-y-0.5">
                    <p className="text-sm font-medium">{block.label}</p>
                    <p className="text-xs text-muted-foreground">{block.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="flex-1"
              >
                Volver
              </Button>
              <Button type="submit" className="flex-1">
                Calcular
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

/**
 * Componente de la página del formulario de cálculo inverso.
 * Envuelve InverseCalculatorForm en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
export default function InverseCalculatorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    }>
      <InverseCalculatorForm />
    </Suspense>
  );
}
