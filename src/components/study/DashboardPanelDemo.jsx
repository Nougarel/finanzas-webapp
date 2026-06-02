"use client";

/**
 * DashboardPanelDemo.jsx — Demo aislado del DashboardPanel con datos mock hardcoded.
 *
 * Usado para validar visualmente el DashboardPanel en su contexto de col 2 a 1280px
 * sin necesidad de pasar por el flujo completo de la app.
 *
 * Los datos mock simulan un perfil típico:
 *   - Ingreso: 3.000 €/mes
 *   - Necesidades: 42% (1.260 €)
 *   - Deseos: 10% (300 €)
 *   - Ahorro: 48% (1.440 €) — incluyendo fondo de emergencia, inversión, etc.
 *
 * Solo para uso en rutas de debug/study — no importar desde páginas de producción.
 */
import { DashboardPanel } from "@/components/ui/dashboard-panel";

// ─── Dataset mock ─────────────────────────────────────────────────────────────

const MOCK_DATASET = {
  income: 3000,
  blocks: {
    needs: {
      label: "Necesidades",
      percentage: 42.0,
      amount: 1260,
    },
    wants: {
      label: "Deseos",
      percentage: 10.0,
      amount: 300,
    },
    savings: {
      label: "Ahorro",
      percentage: 48.0,
      amount: 1440,
    },
  },
  categories: {
    // Necesidades
    housing: { id: "housing", label: "Vivienda", block: "needs", percentage: 20.0, amount: 600 },
    utilities: { id: "utilities", label: "Suministros", block: "needs", percentage: 5.0, amount: 150 },
    groceries: { id: "groceries", label: "Alimentación", block: "needs", percentage: 8.5, amount: 255 },
    transport: { id: "transport", label: "Transporte", block: "needs", percentage: 5.5, amount: 165 },
    health: { id: "health", label: "Salud", block: "needs", percentage: 2.0, amount: 60 },
    education: { id: "education", label: "Educación", block: "needs", percentage: 1.0, amount: 30 },
    // Deseos
    dining_out: { id: "dining_out", label: "Restaurantes", block: "wants", percentage: 2.5, amount: 75 },
    travel: { id: "travel", label: "Viajes", block: "wants", percentage: 2.0, amount: 60 },
    clothing: { id: "clothing", label: "Ropa", block: "wants", percentage: 1.5, amount: 45 },
    personal_care: { id: "personal_care", label: "Cuidado personal", block: "wants", percentage: 1.0, amount: 30 },
    entertainment: { id: "entertainment", label: "Entretenimiento", block: "wants", percentage: 1.0, amount: 30 },
    hobbies: { id: "hobbies", label: "Hobbies", block: "wants", percentage: 0.8, amount: 24 },
    subscriptions: { id: "subscriptions", label: "Suscripciones", block: "wants", percentage: 0.7, amount: 21 },
    gifts: { id: "gifts", label: "Regalos", block: "wants", percentage: 0.5, amount: 15 },
    // Ahorro
    life_insurance: { id: "life_insurance", label: "Seguro de vida", block: "savings", percentage: 3.0, amount: 90 },
    emergency_fund: { id: "emergency_fund", label: "Fondo emergencia", block: "savings", percentage: 8.0, amount: 240 },
    short_term_savings: { id: "short_term_savings", label: "Ahorro corto plazo", block: "savings", percentage: 7.0, amount: 210 },
    long_term_savings: { id: "long_term_savings", label: "Ahorro largo plazo", block: "savings", percentage: 10.0, amount: 300 },
    investment: { id: "investment", label: "Inversión", block: "savings", percentage: 15.0, amount: 450 },
    debt_extra: { id: "debt_extra", label: "Amortización deuda", block: "savings", percentage: 5.0, amount: 150 },
  },
  transversal: {
    dti: {
      total: 22.5,
    },
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DashboardPanelDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cabecera de contexto */}
      <div className="bg-primary text-primary-foreground px-6 py-3">
        <p className="text-sm font-mono">
          M37 — DashboardPanel Demo | Datos mock hardcoded | 3 modos
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Modo recommended */}
          <div>
            <h2 className="font-display font-bold text-foreground mb-4" style={{ fontSize: 16 }}>
              Modo: recommended
              <span className="ml-2 text-xs font-sans font-normal text-muted-foreground">
                (/results)
              </span>
            </h2>
            <DashboardPanel
              dataset={MOCK_DATASET}
              mode="recommended"
              secondaryCta={{
                href: "/diagnosis-form",
                label: "Compara tu situación real",
              }}
            />
          </div>

          {/* Modo real */}
          <div>
            <h2 className="font-display font-bold text-foreground mb-4" style={{ fontSize: 16 }}>
              Modo: real
              <span className="ml-2 text-xs font-sans font-normal text-muted-foreground">
                (/diagnosis)
              </span>
            </h2>
            <DashboardPanel
              dataset={MOCK_DATASET}
              mode="real"
              secondaryCta={{
                href: "/calculator",
                label: "Ver distribución ideal",
              }}
            />
          </div>

          {/* Modo inverse */}
          <div>
            <h2 className="font-display font-bold text-foreground mb-4" style={{ fontSize: 16 }}>
              Modo: inverse
              <span className="ml-2 text-xs font-sans font-normal text-muted-foreground">
                (/inverse-results)
              </span>
            </h2>
            <DashboardPanel
              dataset={MOCK_DATASET}
              mode="inverse"
              secondaryCta={{
                href: "/inverse-calculator",
                label: "Calcular de nuevo",
              }}
            />
          </div>
        </div>

        {/* Skeleton demo */}
        <div className="mt-12">
          <h2 className="font-display font-bold text-foreground mb-4" style={{ fontSize: 16 }}>
            Estado skeleton (loading)
          </h2>
          <div className="max-w-sm">
            <DashboardPanel skeleton={true} mode="recommended" />
          </div>
        </div>
      </div>
    </div>
  );
}
