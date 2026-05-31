"use client";

// DashboardPocClient.jsx — POC de validación del grid + DashboardPanel real en col 2 (M37)
// Incluye:
//   1. Medición del ancho real de col 2 (Paso 0)
//   2. DashboardPanel con datos mock en el contexto real de col 2 (Paso 7)

import { useRef, useEffect, useState } from "react";
import { DashboardPanel } from "@/components/ui/dashboard-panel";

// ─── Dataset mock ─────────────────────────────────────────────────────────────

const MOCK_DATASET = {
  income: 3000,
  blocks: {
    needs:   { label: "Necesidades", percentage: 42.0, amount: 1260 },
    wants:   { label: "Deseos",      percentage: 10.0, amount: 300  },
    savings: { label: "Ahorro",      percentage: 48.0, amount: 1440 },
  },
  categories: {
    housing:            { id: "housing",            label: "Vivienda",          block: "needs",   percentage: 20.0, amount: 600 },
    utilities:          { id: "utilities",          label: "Suministros",       block: "needs",   percentage: 5.0,  amount: 150 },
    groceries:          { id: "groceries",          label: "Alimentación",      block: "needs",   percentage: 8.5,  amount: 255 },
    transport:          { id: "transport",          label: "Transporte",        block: "needs",   percentage: 5.5,  amount: 165 },
    health:             { id: "health",             label: "Salud",             block: "needs",   percentage: 2.0,  amount: 60  },
    education:          { id: "education",          label: "Educación",         block: "needs",   percentage: 1.0,  amount: 30  },
    dining_out:         { id: "dining_out",         label: "Restaurantes",      block: "wants",   percentage: 2.5,  amount: 75  },
    travel:             { id: "travel",             label: "Viajes",            block: "wants",   percentage: 2.0,  amount: 60  },
    clothing:           { id: "clothing",           label: "Ropa",              block: "wants",   percentage: 1.5,  amount: 45  },
    personal_care:      { id: "personal_care",      label: "Cuidado personal",  block: "wants",   percentage: 1.0,  amount: 30  },
    entertainment:      { id: "entertainment",      label: "Entretenimiento",   block: "wants",   percentage: 1.0,  amount: 30  },
    hobbies:            { id: "hobbies",            label: "Hobbies",           block: "wants",   percentage: 0.8,  amount: 24  },
    subscriptions:      { id: "subscriptions",      label: "Suscripciones",     block: "wants",   percentage: 0.7,  amount: 21  },
    gifts:              { id: "gifts",              label: "Regalos",           block: "wants",   percentage: 0.5,  amount: 15  },
    life_insurance:     { id: "life_insurance",     label: "Seguro de vida",    block: "savings", percentage: 3.0,  amount: 90  },
    emergency_fund:     { id: "emergency_fund",     label: "Fondo emergencia",  block: "savings", percentage: 8.0,  amount: 240 },
    short_term_savings: { id: "short_term_savings", label: "Ahorro c/p",        block: "savings", percentage: 7.0,  amount: 210 },
    long_term_savings:  { id: "long_term_savings",  label: "Ahorro l/p",        block: "savings", percentage: 10.0, amount: 300 },
    investment:         { id: "investment",         label: "Inversión",         block: "savings", percentage: 15.0, amount: 450 },
    debt_extra:         { id: "debt_extra",         label: "Amortización deuda",block: "savings", percentage: 5.0,  amount: 150 },
  },
  transversal: {
    dti: { total: 22.5 },
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DashboardPocClient() {
  const col2Ref = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(null);

  useEffect(() => {
    function measure() {
      if (col2Ref.current) {
        setMeasuredWidth(col2Ref.current.getBoundingClientRect().width);
      }
      setViewportWidth(window.innerWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const passTest = measuredWidth !== null && measuredWidth >= 460;
  const failTest = measuredWidth !== null && measuredWidth < 460;

  return (
    <div className="min-h-screen bg-background">
      {/* Cabecera de validación */}
      <div className="bg-primary text-primary-foreground px-6 py-3 flex items-center gap-4">
        <p className="text-sm font-mono flex-1">
          M37 Paso 0 — Grid validation + DashboardPanel real en col 2. Viewport:{" "}
          {viewportWidth !== null ? `${viewportWidth}px` : "—"}.
          Col 2 ancho:{" "}
          <strong data-testid="measured-width">
            {measuredWidth !== null ? `${measuredWidth.toFixed(1)}px` : "midiendo…"}
          </strong>
        </p>
        {passTest && (
          <span className="text-green-300 text-sm font-semibold">✓ PASA (≥ 460px)</span>
        )}
        {failTest && (
          <span className="text-red-300 text-sm font-semibold">✗ FALLA (&lt; 460px)</span>
        )}
      </div>

      {/* Grid principal — idéntico al que usarán las páginas de resultados */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start">

          {/* Col 1 — proxy */}
          <div className="xl:col-span-7 bg-muted/20 min-h-[600px] rounded-lg flex flex-col items-center justify-center gap-2 mb-8 xl:mb-0">
            <p className="text-muted-foreground text-sm font-mono">COL 1 — col-span-7</p>
            <p className="text-muted-foreground text-xs font-mono">
              Contenido de ResultsPage / DiagnosisPage / InverseResultsPage (F3)
            </p>
          </div>

          {/* Col 2 — DashboardPanel real */}
          <div
            ref={col2Ref}
            className="xl:col-span-5"
            data-testid="col2"
          >
            {/* Etiqueta de diagnóstico */}
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
              col-span-5 — ancho real: {measuredWidth !== null ? `${measuredWidth.toFixed(1)}px` : "…"}
            </p>

            {/* DashboardPanel real en modo recommended */}
            <DashboardPanel
              dataset={MOCK_DATASET}
              mode="recommended"
              secondaryCta={{
                href: "/diagnosis-form",
                label: "Compara tu situación real",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
