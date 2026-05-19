"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES_UI } from "@/lib/models/categories";

const BLOCK_META = {
  needs:   { label: "Necesidades", defaultOpen: true  },
  wants:   { label: "Deseos",      defaultOpen: false },
  savings: { label: "Ahorro",      defaultOpen: false },
};
const BLOCK_ORDER = ["needs", "wants", "savings"];

function fmtCurrency(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

function DiagnosisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem("userProfile");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const profileMissing = profile === null;

  // amounts: { [categoryId]: stringValue }
  const [amounts, setAmounts] = useState({});
  const [formError, setFormError] = useState("");
  const [openBlocks, setOpenBlocks] = useState({ needs: true, wants: false, savings: false });

  // Estados de carga / error
  if (!incomeParam || isNaN(income) || income <= 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-lg font-semibold mb-2">Ingreso no válido</p>
            <p className="text-muted-foreground mb-4">Vuelve a la pantalla de resultados.</p>
            <Button onClick={() => router.push("/")}>Inicio</Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  if (profileMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-lg font-semibold mb-2">Perfil no encontrado</p>
            <p className="text-muted-foreground mb-4">
              Necesitas completar el cuestionario antes de diagnosticar tu situación.
            </p>
            <Button onClick={() => router.push("/profile")}>Completar perfil</Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  const handleChange = (catId, value) => {
    setAmounts((prev) => ({ ...prev, [catId]: value }));
    if (formError) setFormError("");
  };

  const toggleBlock = (block) =>
    setOpenBlocks((prev) => ({ ...prev, [block]: !prev[block] }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir realAmounts (0 si vacío)
    const realAmounts = {};
    for (const cat of CATEGORIES_UI) {
      const raw = amounts[cat.id];
      const n = parseFloat(raw);
      realAmounts[cat.id] = isNaN(n) || n < 0 ? 0 : n;
    }

    // Validación global: suma de reales no debe alejarse >30% del ingreso
    const totalReal = Object.values(realAmounts).reduce((s, v) => s + v, 0);
    if (totalReal > 0 && income > 0) {
      const deviation = Math.abs(totalReal - income) / income;
      if (deviation > 0.30) {
        setFormError(
          `La suma de tus gastos reales (${fmtCurrency(totalReal)}) se aleja considerablemente ` +
          `de tu ingreso mensual (${fmtCurrency(income)}). Revisa las cifras antes de continuar.`
        );
        return;
      }
    }

    // Persistimos los importes reales en localStorage para evitar inflar la URL
    // (la URL solo conserva `income`, que es coherente con el resto del flujo).
    localStorage.setItem("diagnosisAmounts", JSON.stringify(realAmounts));
    router.push(`/diagnosis?income=${income}`);
  };

  const catsByBlock = {};
  for (const block of BLOCK_ORDER) {
    catsByBlock[block] = CATEGORIES_UI.filter((c) => c.block === block);
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg space-y-6">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Tu gasto real</h1>
          <p className="text-sm text-muted-foreground">
            Introduce tus importes reales del último mes para cada categoría. Si dejas una casilla
            vacía se considerará 0€.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {formError && (
            <div className="flex gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <AlertTriangle className="shrink-0 size-5 mt-0.5" />
              <p className="text-sm">{formError}</p>
            </div>
          )}

          {BLOCK_ORDER.map((block) => {
            const meta = BLOCK_META[block];
            const cats = catsByBlock[block];
            const isOpen = openBlocks[block];

            return (
              <Card key={block}>
                <button
                  type="button"
                  onClick={() => toggleBlock(block)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold">{meta.label}</span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <CardContent className="pt-0 space-y-4">
                    {cats.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <Label htmlFor={cat.id} className="text-sm font-medium">{cat.label}</Label>
                        <Input
                          id={cat.id}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={amounts[cat.id] ?? ""}
                          onChange={(e) => handleChange(cat.id, e.target.value)}
                          className="h-9"
                        />
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/results?income=${income}`)}
              className="flex-1"
            >
              Volver
            </Button>
            <Button type="submit" className="flex-1">
              Ver diagnóstico
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function DiagnosisFormPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    }>
      <DiagnosisForm />
    </Suspense>
  );
}
