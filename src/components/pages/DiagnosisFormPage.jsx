"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { PageShell } from "@/components/ui/page-shell";
import { MoneyValue } from "@/components/ui/money-value";
import { CATEGORIES_UI } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { validateAmount } from "@/lib/validators";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import { useMounted } from "@/lib/hooks/useMounted";

const BLOCK_META = {
  needs:   { label: "Necesidades", defaultOpen: true  },
  wants:   { label: "Deseos",      defaultOpen: false },
  savings: { label: "Ahorro",      defaultOpen: false },
};
const BLOCK_ORDER = ["needs", "wants", "savings"];

function DiagnosisForm() {
  const router = useStudyAwareRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  // Modo testing guiado (M18 Fase 4): si el contexto /study está activo,
  // ocultamos los botones de escape al home para no romper el funnel.
  const study = useStudyContextOptional();

  const incomeParam = searchParams.get("income");
  const income = parseFloat(incomeParam);

  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.profileCurrent);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const profileMissing = profile === null;

  // amounts: { [categoryId]: stringValue }
  const [amounts, setAmounts] = useState({});
  const [formError, setFormError] = useState("");
  // Errores por campo (validación de cada importe)
  const [fieldErrors, setFieldErrors] = useState({});
  const [openBlocks, setOpenBlocks] = useState({ needs: true, wants: false, savings: false });

  // Estados de carga / error
  if (!incomeParam || isNaN(income) || income <= 0) {
    return (
      <main className="flex flex-1 items-center">
        <PageShell variant="form">
          <Alert
            variant="error"
            title="Ingreso no válido"
          >
            <p className="mt-2">
              Vuelve a la pantalla de resultados para acceder al diagnóstico.
            </p>
            {!study && (
              <Button
                size="sm"
                onClick={() => router.push("/")}
                className="mt-4 transition-colors duration-200"
              >
                Inicio
              </Button>
            )}
          </Alert>
        </PageShell>
      </main>
    );
  }

  if (!mounted) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground font-light">Cargando…</p>
      </main>
    );
  }

  if (profileMissing) {
    return (
      <main className="flex flex-1 items-center">
        <PageShell variant="form">
          <Alert
            variant="error"
            title="Perfil no encontrado"
          >
            <p className="mt-2">
              Necesitas completar el cuestionario antes de diagnosticar tu situación.
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/profile")}
              className="mt-4 transition-colors duration-200"
            >
              Completar perfil
            </Button>
          </Alert>
        </PageShell>
      </main>
    );
  }

  const handleChange = (catId, value) => {
    setAmounts((prev) => ({ ...prev, [catId]: value }));
    if (formError) setFormError("");
    if (fieldErrors[catId]) {
      setFieldErrors((prev) => {
        const { [catId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (catId, value) => {
    const { valid, error } = validateAmount(value, { allowEmpty: true });
    setFieldErrors((prev) => {
      if (valid) {
        const { [catId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [catId]: error };
    });
  };

  const toggleBlock = (block) =>
    setOpenBlocks((prev) => ({ ...prev, [block]: !prev[block] }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Re-validar todos los campos antes de enviar
    const newFieldErrors = {};
    for (const cat of CATEGORIES_UI) {
      const value = amounts[cat.id] ?? "";
      const { valid, error } = validateAmount(value, { allowEmpty: true });
      if (!valid) newFieldErrors[cat.id] = error;
    }
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Construir realAmounts (0 si vacío) — los negativos ya fueron capturados arriba
    const realAmounts = {};
    for (const cat of CATEGORIES_UI) {
      const raw = amounts[cat.id];
      const n = parseFloat(raw);
      realAmounts[cat.id] = isNaN(n) ? 0 : n;
    }

    // Validación global: suma de reales no debe alejarse >30% del ingreso
    const totalReal = Object.values(realAmounts).reduce((s, v) => s + v, 0);
    if (totalReal > 0 && income > 0) {
      const deviation = Math.abs(totalReal - income) / income;
      if (deviation > 0.30) {
        const totalFormatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(totalReal);
        const incomeFormatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(income);
        setFormError(
          `La suma de tus gastos reales (${totalFormatted}) se aleja considerablemente ` +
          `de tu ingreso mensual (${incomeFormatted}). Revisa las cifras antes de continuar.`
        );
        return;
      }
    }

    // Persistimos los importes reales en localStorage para evitar inflar la URL
    // (la URL solo conserva `income`, que es coherente con el resto del flujo).
    localStorage.setItem(STORAGE_KEYS.diagnosisAmounts, JSON.stringify(realAmounts));
    router.push(`/diagnosis?income=${income}`);
  };

  const catsByBlock = {};
  for (const block of BLOCK_ORDER) {
    catsByBlock[block] = CATEGORIES_UI.filter((c) => c.block === block);
  }

  // Total introducido en tiempo real
  const totalEntered = Object.values(amounts).reduce((s, v) => {
    const n = parseFloat(v);
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <main className="flex flex-1 flex-col">
      <PageShell variant="profile">
        <div className="space-y-6">

          {/* Encabezado */}
          <div className="space-y-2">
            <h1 className="font-display font-black tracking-display text-3xl sm:text-4xl text-foreground">
              Tu gasto real
            </h1>
            <p className="text-base font-light text-muted-foreground">
              Introduce tus importes reales del último mes para cada categoría.
              Si dejas una casilla vacía se considerará 0 €.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pb-24 sm:pb-0">

            {formError && (
              <Alert variant="error">
                {formError}
              </Alert>
            )}

            {BLOCK_ORDER.map((block) => {
              const meta = BLOCK_META[block];
              const cats = catsByBlock[block];
              const isOpen = openBlocks[block];

              return (
                <Card key={block} className="overflow-hidden">
                  {/* Header del bloque — botón accesible con teclado */}
                  <button
                    type="button"
                    onClick={() => toggleBlock(block)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-muted/50"
                  >
                    <span className="text-base font-medium text-foreground">{meta.label}</span>
                    {isOpen
                      ? <ChevronUp className="size-4 text-muted-foreground" aria-hidden />
                      : <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
                    }
                  </button>

                  {isOpen && (
                    <CardContent className="pt-0 pb-5 space-y-5 border-t border-border">
                      {cats.map((cat) => (
                        <div key={cat.id} className="space-y-1.5 pt-5 first:pt-5">
                          <Label
                            htmlFor={cat.id}
                            className="text-sm font-medium text-foreground"
                          >
                            {cat.label}
                          </Label>
                          <Input
                            id={cat.id}
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={amounts[cat.id] ?? ""}
                            onChange={(e) => handleChange(cat.id, e.target.value)}
                            onBlur={(e) => handleBlur(cat.id, e.target.value)}
                            className={`h-9 tabular-nums transition-colors duration-200${fieldErrors[cat.id] ? " border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                          {fieldErrors[cat.id] && (
                            <Alert variant="error" size="compact">
                              {fieldErrors[cat.id]}
                            </Alert>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {/* Total en tiempo real */}
            {totalEntered > 0 && (
              <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-muted-foreground">Total introducido</span>
                  <MoneyValue amount={totalEntered} size="table" />
                </div>
                <p className="text-xs font-light text-muted-foreground mt-1.5">
                  Ingreso mensual de referencia:{" "}
                  <MoneyValue amount={income} size="table" className="font-medium" />
                </p>
              </div>
            )}

            {/* Botones CTA — sticky en móvil para formulario largo */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-3 pb-4 -mx-4 px-4 sm:static sm:bg-transparent sm:backdrop-blur-none sm:pt-2 sm:pb-0 sm:mx-0 sm:px-0 border-t border-border sm:border-0 mt-2">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/results?income=${income}`)}
                  className="flex-1 transition-colors duration-200"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  className="flex-1 transition-colors duration-200"
                >
                  Ver diagnóstico
                </Button>
              </div>
            </div>
          </form>

        </div>
      </PageShell>
    </main>
  );
}

export default function DiagnosisFormPage() {
  return (
    <Suspense fallback={
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground font-light">Cargando…</p>
      </main>
    }>
      <DiagnosisForm />
    </Suspense>
  );
}
