import { NextResponse } from "next/server";
import { calculateDistribution } from "@/lib/calculators/distributionEngine";

export async function POST(request) {
  try {
    const { profile, income } = await request.json();

    if (!profile || typeof income !== "number" || income <= 0) {
      return NextResponse.json(
        { error: "Se requieren perfil e ingreso válidos" },
        { status: 400 }
      );
    }

    const result = calculateDistribution(profile, income);

    if (result.insolvencyBlock) {
      return NextResponse.json(
        { error: result.error, insolvencyBlock: true },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en el cálculo" },
      { status: 500 }
    );
  }
}
