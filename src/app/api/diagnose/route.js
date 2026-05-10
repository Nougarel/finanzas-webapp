import { NextResponse } from "next/server";
import { calculateDistribution } from "@/lib/calculators/distributionCalculator";
import { evaluateFinancialHealth } from "@/lib/calculators/evaluator";
import { getFinancialModel } from "@/lib/models/financialModels";

export async function POST(request) {
  try {
    const { income, modelId, realAmounts } = await request.json();

    if (typeof income !== "number" || income <= 0) {
      return NextResponse.json(
        { error: "Se requiere un ingreso válido" },
        { status: 400 }
      );
    }

    const model = getFinancialModel(modelId);
    if (!model) {
      return NextResponse.json(
        { error: `Modelo "${modelId}" no encontrado` },
        { status: 400 }
      );
    }

    const idealResult = calculateDistribution({
      calculationType: "direct",
      income,
      model
    });

    const diagnosis = evaluateFinancialHealth({
      idealDistribution: idealResult.distribution,
      realAmounts,
      income,
      model: { id: model.id, name: model.name, description: model.description }
    });

    return NextResponse.json(diagnosis);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en el diagnóstico" },
      { status: 500 }
    );
  }
}
