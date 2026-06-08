"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, UserX } from "lucide-react";
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
import { useStudyAwareRouter } from "@/lib/research/useStudyAwareRouter";
import { useMounted } from "@/lib/hooks/useMounted";

const BLOCK_META = {
  needs:   { label: "Necesidades",  defaultOpen: true },
  wants:   { label: "Deseos",       defaultOpen: false },
  savings: { label: "Ahorro",       defaultOpen: false },
};

const BLOCK_ORDER = ["needs", "wants", "savings"];

// ─── Nota contextual por categoría según el perfil ───────────────────────────
function getCategoryNote(cat, profile) {
  if (!profile) return cat.description;

  switch (cat.id) {
    case "housing": {
      if (profile.housingStatus === "owned" || profile.housingStatus === "family")
        return "Gastos de mantenimiento (comunidad, IBI, reparaciones). Si quieres ahorrar para comprar una vivienda, usa 'Ahorro a largo plazo' o cambia tu perfil a 'Hipoteca'.";
      if (profile.housingStatus === "rent")
        return "Tu alquiler mensual incluyendo comunidad y gastos asociados.";
      if (profile.housingStatus === "mortgage")
        return "Cuota hipotecaria mensual incluyendo comunidad e IBI.";
      return cat.description;
    }
    case "transport": {
      if (profile.vehicleStatus === "none")
        return "Transporte público, taxi y desplazamientos. Si planeas adquirir un vehículo, cambia tu perfil a 'Coche propio' o 'Financiado'.";
      if (profile.vehicleStatus === "owned_paid")
        return "Combustible, seguro, mantenimiento y parking.";
      if (profile.vehicleStatus === "financed" || profile.vehicleStatus === "leasing")
        return "Cuota del vehículo, combustible, seguro y mantenimiento.";
      return cat.description;
    }
    case "groceries":
      return "Compra en supermercado y mercado para consumo del hogar.";
    case "utilities":
      return "Electricidad, gas, agua, internet y telefonía.";
    case "health": {
      if (profile.privateHealthInsurance === "none")
        return "Copagos, farmacia, óptica y dental. Si planeas contratar seguro privado, actualiza tu perfil.";
      return "Prima del seguro más copagos, farmacia, óptica y dental.";
    }
    case "education": {
      const adultDependents = profile.hasPartner ? 1 : 0;
      const hasChildren = (profile.dependents ?? 0) > adultDependents;
      const hasOwnEdu = profile.ownEducation && profile.ownEducation !== "none";
      if (hasOwnEdu && hasChildren) return "Tu formación más la de tus hijos si los tienes.";
      if (hasOwnEdu) return "Tu formación continua, máster, postgrado o cursos.";
      if (hasChildren) return "Matrículas, material escolar y formación de los hijos.";
      return "Cursos o formación continua que planees realizar. Si planeas tener hijos, actualiza tu perfil con dependientes.";
    }
    case "long_term_savings":
      return "Importe mensual que deseas destinar a esta categoría de ahorro. Incluye ahorro para entrada de vivienda, vehículo u otros objetivos a más de 2 años.";
    default:
      if (cat.block === "wants") return "Importe mensual que deseas destinar a esta categoría.";
      if (cat.block === "savings") return "Importe mensual que deseas destinar a esta categoría de ahorro.";
      return cat.description;
  }
}

export default function InverseCalculatorPage() {
  const router = useStudyAwareRouter();
  const mounted = useMounted();

  const [profile] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.profileIdeal);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const profileMissing = profile === null;

  // touched: Set de categoryIds que el usuario ha escrito algo (incluso "0")
  // Inicializado desde localStorage si hay importes previos guardados
  const touchedRef = useRef((() => {
    if (typeof window === "undefined") return new Set();
    try {
      const s = localStorage.getItem(STORAGE_KEYS.specifiedAmounts);
      if (!s) return new Set();
      return new Set(Object.keys(JSON.parse(s)));
    } catch { return new Set(); }
  })());

  // amounts: { [categoryId]: string }  — cadena para permitir campo vacío
  // Rehidratados desde localStorage si el usuario vuelve desde la pantalla de resultados
  const [amounts, setAmounts] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const s = localStorage.getItem(STORAGE_KEYS.specifiedAmounts);
      if (!s) return {};
      const parsed = JSON.parse(s);
      return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
    } catch { return {}; }
  });

  const [openBlocks, setOpenBlocks] = useState({ needs: true, wants: false, savings: false });

  // Errores de validación por categoría: { [catId]: string }
  const [errors, setErrors] = useState({});

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
              Necesitas completar tu perfil antes de usar el calculador inverso.
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
    touchedRef.current.add(catId);
    setAmounts(prev => ({ ...prev, [catId]: value }));
    // Limpiar error mientras el usuario corrige
    if (errors[catId]) {
      setErrors(prev => {
        const { [catId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (catId, value) => {
    const { valid, error } = validateAmount(value, { allowEmpty: true });
    setErrors(prev => {
      if (valid) {
        const { [catId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [catId]: error };
    });
  };

  const totalSpecified = Object.values(amounts).reduce((s, v) => {
    const n = parseFloat(v);
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  // Número de categorías con un importe > 0 fijado por el usuario
  const specifiedCount = Object.values(amounts).filter(v => Number(v) > 0).length;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Re-validar todos los campos con valor antes de enviar
    const newErrors = {};
    for (const [catId, value] of Object.entries(amounts)) {
      const { valid, error } = validateAmount(value, { allowEmpty: true });
      if (!valid) newErrors[catId] = error;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Solo las categorías tocadas con valor > 0
    const specifiedAmounts = {};
    for (const [catId, raw] of Object.entries(amounts)) {
      if (!touchedRef.current.has(catId)) continue;
      const n = parseFloat(raw);
      if (!isNaN(n) && n > 0) specifiedAmounts[catId] = n;
    }

    // Persistimos los importes deseados en localStorage para mantener la URL limpia
    // y permitir rehidratar el formulario al volver desde los resultados.
    localStorage.setItem(STORAGE_KEYS.specifiedAmounts, JSON.stringify(specifiedAmounts));
    router.push("/inverse-results");
  };

  const toggleBlock = (block) =>
    setOpenBlocks(prev => ({ ...prev, [block]: !prev[block] }));

  const catsByBlock = {};
  for (const block of BLOCK_ORDER) {
    catsByBlock[block] = CATEGORIES_UI.filter(c => c.block === block);
  }

  return (
    <main className="flex flex-1 flex-col">
      <PageShell variant="profile">
        <div className="space-y-6">

          {/* Encabezado */}
          <div className="space-y-2">
            <h1 className="font-display font-black tracking-display text-3xl sm:text-4xl text-foreground">
              Calculador inverso
            </h1>
            <p className="text-base font-light text-muted-foreground">
              Introduce los importes mensuales que quieres destinar a cada categoría.
              Deja en blanco las que quieres que se calculen automáticamente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pb-24 sm:pb-0">

            {BLOCK_ORDER.map(block => {
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
                      {cats.map(cat => (
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
                            placeholder="Automático"
                            value={amounts[cat.id] ?? ""}
                            onChange={e => handleChange(cat.id, e.target.value)}
                            onBlur={e => handleBlur(cat.id, e.target.value)}
                            className={`h-9 tabular-nums transition-colors duration-200${errors[cat.id] ? " border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                          {errors[cat.id] && (
                            <Alert variant="error" size="compact">
                              {errors[cat.id]}
                            </Alert>
                          )}
                          <p className="text-xs font-light text-muted-foreground leading-relaxed">
                            {getCategoryNote(cat, profile)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {/* Total en tiempo real */}
            {totalSpecified > 0 && (
              <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-muted-foreground">Total especificado</span>
                  <MoneyValue amount={totalSpecified} size="table" />
                </div>
                <p className="text-xs font-light text-muted-foreground mt-1.5">
                  <span className="font-medium tabular-nums">{specifiedCount}</span>
                  {" "}de 20 categorías fijadas — el resto se calculará automáticamente
                </p>
              </div>
            )}

            {/* Botones CTA — sticky en móvil para formulario largo */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-3 pb-4 -mx-4 px-4 sm:static sm:bg-transparent sm:backdrop-blur-none sm:pt-2 sm:pb-0 sm:mx-0 sm:px-0 border-t border-border sm:border-0 mt-2">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="flex-1 transition-colors duration-200"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  className="flex-1 transition-colors duration-200"
                  disabled={!profile}
                >
                  Calcular ingreso
                </Button>
              </div>
            </div>
          </form>

        </div>
      </PageShell>
    </main>
  );
}
