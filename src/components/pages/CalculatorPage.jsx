"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateIncome } from "@/lib/validators";

/**
 * Subcomponente del formulario separado para mantener la compatibilidad con Suspense.
 */
const HELP_TEXT = {
  monthly: "Ingreso neto mensual tras impuestos. Si recibes pagas extra, usa el modo anual.",
  annual:  "Total neto recibido en el año. Se convierte automáticamente a mensual.",
};

function CalculatorForm() {
  const router = useStudyAwareRouter();

  const [income, setIncome]         = useState("");
  const [incomeMode, setIncomeMode] = useState("monthly"); // "monthly" | "annual"
  const [error, setError]           = useState("");

  const handleIncomeChange = (e) => {
    setIncome(e.target.value);
    if (error) setError("");
  };

  const handleModeChange = (mode) => {
    setIncomeMode(mode);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateIncome(income);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const raw = parseFloat(income);
    const monthlyIncome = incomeMode === "annual" ? raw / 12 : raw;
    router.push(`/results?income=${monthlyIncome}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tu ingreso</CardTitle>
          <CardDescription>
            Introduce tu ingreso para calcular la distribución ideal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {/* Fila label + toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="income">
                  {incomeMode === "monthly" ? "Ingreso mensual (€)" : "Ingreso anual (€)"}
                </Label>
                <div className="flex rounded-md border overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => handleModeChange("monthly")}
                    className={`px-3 py-1 transition-colors ${
                      incomeMode === "monthly"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("annual")}
                    className={`px-3 py-1 transition-colors border-l ${
                      incomeMode === "annual"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Anual
                  </button>
                </div>
              </div>

              <Input
                id="income"
                type="number"
                placeholder={incomeMode === "monthly" ? "2000" : "24000"}
                value={income}
                onChange={handleIncomeChange}
                min="0"
                step="0.01"
                className={error ? "border-red-500" : ""}
              />

              {/* Texto de ayuda contextual */}
              <p className="text-xs text-muted-foreground">{HELP_TEXT[incomeMode]}</p>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
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
