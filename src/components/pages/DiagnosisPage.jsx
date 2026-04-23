"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDistribution } from "@/lib/calculators/distributionCalculator";
import { evaluateFinancialHealth } from "@/lib/calculators/evaluator";
import { getFinancialModel } from "@/lib/models/financialModels";

/**
 * Estilos visuales del banner de estado global según el resultado del diagnóstico
 */
const OVERALL_STATUS_STYLES = {
  healthy: {
    wrapper: "bg-green-50 border border-green-200 text-green-800 rounded-lg p-6",
    label: "Saludable",
    message: "Tu distribución financiera es saludable. Estás gestionando bien tus ingresos."
  },
  warning: {
    wrapper: "bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-6",
    label: "Necesita atención",
    message: "Tu distribución financiera necesita ajustes. Revisa los bloques marcados."
  },
  critical: {
    wrapper: "bg-red-50 border border-red-200 text-red-800 rounded-lg p-6",
    label: "Crítico",
    message: "Tu distribución financiera presenta desviaciones importantes. Actúa sobre los bloques en rojo."
  }
};

/**
 * Clases de color del badge de estado por bloque
 */
const BLOCK_STATUS_STYLES = {
  healthy: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700"
};

/**
 * Genera un mensaje en lenguaje natural explicando la desviación del bloque.
 * Distingue entre bloques de ahorro y de gasto para dar contexto correcto.
 *
 * @param {object} block - Bloque del diagnóstico con direction, blockType y deviationPercentage
 * @returns {string} Mensaje explicativo
 */
function getDirectionMessage(block) {
  if (block.direction === "balanced") {
    return "Este bloque está dentro del rango saludable.";
  }

  const pct = Math.abs(block.deviationPercentage).toFixed(1);

  if (block.blockType === "savings") {
    return block.direction === "under"
      ? `Estás ahorrando un ${pct}% menos de lo recomendado.`
      : `Estás ahorrando un ${pct}% más de lo recomendado.`;
  }

  // Bloque de gasto
  return block.direction === "over"
    ? `Estás gastando un ${pct}% más de lo recomendado en este bloque.`
    : `Estás gastando un ${pct}% menos de lo recomendado en este bloque.`;
}

/**
 * Componente de error reutilizable para los distintos estados de error de la página
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
 * Subcomponente que contiene la lógica y UI del diagnóstico.
 * Separado para poder usar useSearchParams dentro de Suspense.
 */
function DiagnosisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer parámetros de la URL — única fuente de verdad entre páginas
  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);
  const modelId = searchParams.get("model") || "50_30_20";
  const realParam = searchParams.get("real");

  // Validar income
  if (!incomeParam || isNaN(income) || income <= 0) {
    return (
      <ErrorCard
        title="Ingreso inválido"
        message="No se pudo leer el ingreso. Por favor, vuelve al formulario."
        onBack={() => router.push(`/diagnosis-form?income=${incomeParam}&model=${modelId}`)}
      />
    );
  }

  // Deserializar los importes reales desde el JSON codificado en la URL
  let realAmounts = null;
  if (realParam) {
    try {
      realAmounts = JSON.parse(decodeURIComponent(realParam));
    } catch {
      realAmounts = null;
    }
  }

  if (!realAmounts) {
    return (
      <ErrorCard
        title="Datos inválidos"
        message="Los importes reales no son válidos. Por favor, rellena el formulario de nuevo."
        onBack={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}
      />
    );
  }

  // Cargar el modelo financiero
  const model = getFinancialModel(modelId);
  if (!model) {
    return (
      <ErrorCard
        title="Modelo no encontrado"
        message={`El modelo "${modelId}" no existe.`}
        onBack={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}
      />
    );
  }

  // Calcular la distribución ideal (flujo directo) para obtener los importes de referencia
  let idealResult;
  try {
    idealResult = calculateDistribution({
      calculationType: "direct",
      income: income,
      model: model
    });
  } catch (error) {
    return (
      <ErrorCard
        title="Error en el cálculo"
        message={error.message}
        onBack={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}
      />
    );
  }

  // Evaluar la salud financiera comparando ideal vs real
  let diagnosis;
  try {
    diagnosis = evaluateFinancialHealth({
      idealDistribution: idealResult.distribution,
      realAmounts: realAmounts,
      income: income,
      model: { id: model.id, name: model.name, description: model.description }
    });
  } catch (error) {
    return (
      <ErrorCard
        title="Error en el diagnóstico"
        message={error.message}
        onBack={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}
      />
    );
  }

  const overallStyle = OVERALL_STATUS_STYLES[diagnosis.summary.overallStatus];

  /**
   * Formatea una cantidad como moneda en euros
   */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  /**
   * Formatea un porcentaje desde decimal (0.5 → "50%")
   */
  const formatPercentage = (percentage) =>
    `${(percentage * 100).toFixed(0)}%`;

  /**
   * Formatea la desviación con signo explícito (ej: "+12.3%" o "-5.0%")
   */
  const formatDeviation = (deviationPct) => {
    const sign = deviationPct > 0 ? "+" : "";
    return `${sign}${deviationPct.toFixed(1)}%`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Diagnóstico de salud financiera
          </h1>
          <p className="text-muted-foreground">
            Basado en el modelo {model.name} con un ingreso de {formatCurrency(income)}
          </p>
        </div>

        {/* Banner de estado global — semáforo principal */}
        <div className={overallStyle.wrapper}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold">{overallStyle.label}</p>
            </div>
            <p>{overallStyle.message}</p>
            {/* Contadores de bloques por estado */}
            <div className="flex gap-6 pt-1">
              <span className="text-sm font-medium">
                ✓ {diagnosis.summary.healthyBlocks} saludable{diagnosis.summary.healthyBlocks !== 1 ? "s" : ""}
              </span>
              {diagnosis.summary.warningBlocks > 0 && (
                <span className="text-sm font-medium">
                  ⚠ {diagnosis.summary.warningBlocks} en atención
                </span>
              )}
              {diagnosis.summary.criticalBlocks > 0 && (
                <span className="text-sm font-medium">
                  ✗ {diagnosis.summary.criticalBlocks} crítico{diagnosis.summary.criticalBlocks !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detalle por bloque — generado dinámicamente desde diagnosis.blocks */}
        <div className="grid gap-4 md:grid-cols-3">
          {diagnosis.blocks.map((block) => (
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
              <CardContent className="flex-1 space-y-3">
                {/* Importes ideal vs real */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Ideal</p>
                    <p className="text-lg font-semibold">{formatCurrency(block.idealAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Real</p>
                    <p className="text-lg font-bold">{formatCurrency(block.realAmount)}</p>
                  </div>
                </div>

                {/* Badge de estado + desviación */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BLOCK_STATUS_STYLES[block.status]}`}>
                    {block.statusLabel}
                  </span>
                  {block.direction !== "balanced" && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatDeviation(block.deviationPercentage)}
                    </span>
                  )}
                </div>

                {/* Mensaje explicativo en lenguaje natural */}
                <p className="text-xs text-muted-foreground">
                  {getDirectionMessage(block)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/diagnosis-form?income=${income}&model=${modelId}`)}
          >
            Recalcular
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/calculator?model=${modelId}`)}
          >
            Cambiar ingreso
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
 * Componente de la página de diagnóstico de salud financiera.
 * Envuelve DiagnosisContent en Suspense, requerido por Next.js cuando
 * un Client Component usa useSearchParams().
 */
export default function DiagnosisPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando diagnóstico...</p>
      </main>
    }>
      <DiagnosisContent />
    </Suspense>
  );
}
