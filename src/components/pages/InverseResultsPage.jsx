"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDistribution } from "@/lib/calculators/distributionCalculator";
import { getFinancialModel } from "@/lib/models/financialModels";

/**
 * Componente de error reutilizable dentro de esta página.
 */
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

/**
 * Subcomponente que contiene la lógica y UI de los resultados del cálculo inverso.
 * Separado para poder usar useSearchParams dentro de Suspense.
 */
function InverseResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer parámetros de la URL — son la única fuente de verdad entre páginas
  const modelId = searchParams.get("model") || "50_30_20";
  const amountsParam = searchParams.get("amounts");
  const mode = searchParams.get("mode") || "manual";

  // Deserializar los importes deseados desde el JSON codificado en la URL
  let desiredAmounts = null;
  if (amountsParam) {
    try {
      desiredAmounts = JSON.parse(decodeURIComponent(amountsParam));
    } catch {
      desiredAmounts = null;
    }
  }

  if (!amountsParam || !desiredAmounts) {
    return (
      <ErrorCard
        title="Error"
        message="Los importes deseados no son válidos. Por favor, rellena el formulario de nuevo."
        onBack={() => router.push(`/inverse-calculator?model=${modelId}`)}
      />
    );
  }

  const model = getFinancialModel(modelId);
  if (!model) {
    return (
      <ErrorCard
        title="Modelo no encontrado"
        message={`El modelo "${modelId}" no existe. Por favor, selecciona un modelo válido.`}
        onBack={() => router.push("/model-selector?flow=inverse")}
      />
    );
  }

  // Ejecutar el cálculo inverso pasando el modo al motor
  let result;
  try {
    result = calculateDistribution({
      calculationType: "inverse",
      desiredAmounts: desiredAmounts,
      model: model,
      mode: mode
    });
  } catch (error) {
    return (
      <ErrorCard
        title="Error en el cálculo"
        message={error.message}
        onBack={() => router.push(`/inverse-calculator?model=${modelId}`)}
      />
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  const formatPercentage = (percentage) =>
    `${(percentage * 100).toFixed(0)}%`;

  // Frase explicativa y advertencia de desproporción solo tienen sentido en modo manual
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
            {/* Frase explicativa — diferente según el modo */}
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

        {/* Desglose por bloque — generado dinámicamente desde result.distribution */}
        <div className="grid gap-4 md:grid-cols-3">
          {result.distribution.map((block) => {
            const blockType = model.blocks.find((b) => b.key === block.key)?.type;

            return (
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
                    blockType === "savings" ? (
                      /* Ahorro en modo auto: solo el importe calculado */
                      <div>
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mb-2">
                          Calculado automáticamente
                        </span>
                        <p className="text-xl font-bold">{formatCurrency(block.recommendedAmount)}</p>
                      </div>
                    ) : (
                      /* Gasto en modo auto: solo el importe deseado */
                      <div>
                        <p className="text-xs text-muted-foreground">Deseado</p>
                        <p className="text-xl font-semibold">{formatCurrency(block.desiredAmount)}</p>
                      </div>
                    )
                  ) : (
                    /* Modo manual: comportamiento completo */
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
            );
          })}
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

/**
 * Componente de la página de resultados del cálculo inverso.
 * Envuelve InverseResultsContent en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
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
