import { NextResponse } from 'next/server';
import { calculateInverse } from '@/lib/calculators/inverseCalculator';
import { sanitizeAmounts } from '@/lib/validators';

export async function POST(request) {
  try {
    const { profile, specifiedAmounts } = await request.json();

    if (!profile || !specifiedAmounts) {
      return NextResponse.json(
        { error: 'Se requieren los campos profile y specifiedAmounts' },
        { status: 400 }
      );
    }

    if (typeof specifiedAmounts !== 'object' || Array.isArray(specifiedAmounts) || specifiedAmounts === null) {
      return NextResponse.json(
        { error: 'specifiedAmounts debe ser un objeto' },
        { status: 400 }
      );
    }

    const { clean, invalidFields } = sanitizeAmounts(specifiedAmounts);
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: 'Algunos importes son inválidos (negativos o no numéricos)', invalidFields },
        { status: 400 }
      );
    }

    const result = calculateInverse(profile, clean);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno en el cálculo' },
      { status: 500 }
    );
  }
}
