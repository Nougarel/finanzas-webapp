// Diagnóstico personalizado: compara importes reales del usuario contra la
// distribución saludable que el LP genera para su perfil.
import { NextResponse } from "next/server";
import { diagnoseDistribution } from "@/lib/calculators/distributionEngine";
import { sanitizeAmounts } from "@/lib/validators";

export async function POST(request) {
  try {
    const { profile, income, realAmounts } = await request.json();

    if (!profile || typeof profile !== "object") {
      return NextResponse.json(
        { error: "Se requiere un perfil válido" },
        { status: 400 }
      );
    }
    if (typeof income !== "number" || income <= 0) {
      return NextResponse.json(
        { error: "Se requiere un ingreso válido" },
        { status: 400 }
      );
    }
    if (!realAmounts || typeof realAmounts !== "object" || Array.isArray(realAmounts)) {
      return NextResponse.json(
        { error: "Se requieren los importes reales por categoría" },
        { status: 400 }
      );
    }

    const { clean, invalidFields } = sanitizeAmounts(realAmounts);
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: "Algunos importes son inválidos (negativos o no numéricos)", invalidFields },
        { status: 400 }
      );
    }

    const diagnosis = diagnoseDistribution(profile, income, clean);
    return NextResponse.json(diagnosis);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en el diagnóstico" },
      { status: 500 }
    );
  }
}
