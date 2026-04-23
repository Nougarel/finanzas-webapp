"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Subcomponente que contiene el formulario
 * Separado en su propio componente para poder usar useSearchParams dentro de Suspense,
 * requisito de Next.js App Router cuando se leen query params en un Client Component
 */
function CalculatorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer el modelo elegido en el paso anterior — fallback a "50_30_20" si no viene en la URL
  const modelId = searchParams.get("model") || "50_30_20";

  // Estado para el ingreso mensual
  const [income, setIncome] = useState("");

  // Estado para errores de validación
  const [error, setError] = useState("");

  /**
   * Maneja el cambio en el input de ingreso
   * Limpia el error si existe
   */
  const handleIncomeChange = (e) => {
    setIncome(e.target.value);
    if (error) {
      setError(""); // Limpiar error al empezar a escribir
    }
  };

  /**
   * Valida y procesa el formulario
   * Navega a la página de resultados si es válido
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir a número
    const incomeNumber = parseFloat(income);

    // Validación básica
    if (!income || isNaN(incomeNumber)) {
      setError("Por favor, introduce un ingreso válido");
      return;
    }

    if (incomeNumber <= 0) {
      setError("El ingreso debe ser mayor que 0");
      return;
    }

    // Navegar a resultados pasando tanto el ingreso como el modelo elegido
    router.push(`/results?income=${incomeNumber}&model=${modelId}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ingreso Mensual</CardTitle>
          <CardDescription>
            Introduce tu ingreso mensual para calcular la distribución ideal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input de ingreso */}
            <div className="space-y-2">
              <Label htmlFor="income">Ingreso mensual (€)</Label>
              <Input
                id="income"
                type="number"
                placeholder="2000"
                value={income}
                onChange={handleIncomeChange}
                min="0"
                step="0.01"
                className={error ? "border-red-500" : ""}
              />
              {/* Mostrar error si existe */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/model-selector`)}
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
 * Componente de la página del formulario de ingreso mensual
 * Envuelve CalculatorForm en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams()
 */
export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    }>
      <CalculatorForm />
    </Suspense>
  );
}
