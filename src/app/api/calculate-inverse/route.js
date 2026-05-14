import { NextResponse } from 'next/server';
import { calculateInverse } from '@/lib/calculators/inverseCalculator';

export async function POST(request) {
  try {
    const { profile, specifiedAmounts } = await request.json();

    if (!profile || !specifiedAmounts) {
      return NextResponse.json(
        { error: 'Se requieren los campos profile y specifiedAmounts' },
        { status: 400 }
      );
    }

    const result = calculateInverse(profile, specifiedAmounts);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno en el cálculo' },
      { status: 500 }
    );
  }
}
