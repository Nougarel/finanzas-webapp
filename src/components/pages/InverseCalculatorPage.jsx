"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES_UI } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";

const BLOCK_META = {
  needs:   { label: "Necesidades",  defaultOpen: true },
  wants:   { label: "Deseos",       defaultOpen: false },
  savings: { label: "Ahorro",       defaultOpen: false },
};

const BLOCK_ORDER = ["needs", "wants", "savings"];

function fmt(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

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
  const router = useRouter();

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

  if (profileMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Perfil no encontrado</CardTitle>
            <CardDescription>Necesitas completar tu perfil antes de usar el calculador inverso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/profile")}>Completar perfil</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleChange = (catId, value) => {
    touchedRef.current.add(catId);
    setAmounts(prev => ({ ...prev, [catId]: value }));
  };

  const totalSpecified = Object.values(amounts).reduce((s, v) => {
    const n = parseFloat(v);
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  // Número de categorías con un importe > 0 fijado por el usuario
  const specifiedCount = Object.values(amounts).filter(v => Number(v) > 0).length;

  const handleSubmit = (e) => {
    e.preventDefault();

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
    <main className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg space-y-6">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Calculador inverso</h1>
          <p className="text-sm text-muted-foreground">
            Introduce los importes mensuales que quieres destinar a cada categoría.
            Deja en blanco las que quieres que se calculen automáticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {BLOCK_ORDER.map(block => {
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
                  {isOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <CardContent className="pt-0 space-y-4">
                    {cats.map(cat => (
                      <div key={cat.id} className="space-y-1">
                        <Label htmlFor={cat.id} className="text-sm font-medium">{cat.label}</Label>
                        <Input
                          id={cat.id}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Automático"
                          value={amounts[cat.id] ?? ""}
                          onChange={e => handleChange(cat.id, e.target.value)}
                          className="h-9"
                        />
                        <p className="text-xs text-muted-foreground">{getCategoryNote(cat, profile)}</p>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Total en tiempo real */}
          {totalSpecified > 0 && (
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total especificado</span>
                <span className="font-semibold">{fmt(totalSpecified)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {specifiedCount} de 20 categorías fijadas — el resto se calculará automáticamente
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")} className="flex-1">
              Volver
            </Button>
            <Button type="submit" className="flex-1" disabled={!profile}>
              Calcular ingreso
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
