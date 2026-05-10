import { NextResponse } from "next/server";
import { calculateDistribution } from "@/lib/calculators/distributionCalculator";
import { getFinancialModel } from "@/lib/models/financialModels";

export async function POST(request) {
  try {
    const { modelId, desiredAmounts, mode } = await request.json();

    const model = getFinancialModel(modelId);
    if (!model) {
      return NextResponse.json(
        { error: `Modelo "${modelId}" no encontrado` },
        { status: 400 }
      );
    }

    const result = calculateDistribution({
      calculationType: "inverse",
      desiredAmounts,
      model,
      mode: mode || "manual"
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en el cálculo" },
      { status: 500 }
    );
  }
}
