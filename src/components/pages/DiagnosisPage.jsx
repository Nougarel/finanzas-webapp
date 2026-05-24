"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, Check, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES_UI } from "@/lib/models/categories";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { useStudyContextOptional } from "@/lib/research/useStudyContext";

const BLOCK_ORDER = ["needs", "wants", "savings"];

// ─── Subcomponentes compartidos (mismos del flujo directo) ──────────────────

function AlertBanner({ level, message, size = "sm" }) {
  const colors = level === "severe"
    ? "bg-red-50 border-red-200 text-red-800"
    : "bg-amber-50 border-amber-200 text-amber-800";
  const padding = size === "md" ? "px-4 py-3 text-sm" : "px-3 py-2 text-xs";
  const iconSize = size === "md" ? "size-5" : "size-4";
  return (
    <div className={`flex gap-2 rounded-md border ${padding} ${colors}`}>
      <AlertTriangle className={`shrink-0 ${iconSize} mt-0.5`} />
      <p className="leading-snug">{message}</p>
    </div>
  );
}

const HEALTH_SCORE_COLORS = {
  excellent:  { text: "text-green-700",  bar: "bg-green-600",  bg: "bg-green-50 border-green-200"  },
  good:       { text: "text-green-600",  bar: "bg-green-500",  bg: "bg-green-50 border-green-200"  },
  acceptable: { text: "text-amber-600",  bar: "bg-amber-500",  bg: "bg-amber-50 border-amber-200"  },
  improvable: { text: "text-orange-600", bar: "bg-orange-500", bg: "bg-orange-50 border-orange-200" },
  critical:   { text: "text-red-600",    bar: "bg-red-500",    bg: "bg-red-50 border-red-200"      },
};

function HealthScoreCard({ healthScore, categoryLabels }) {
  if (!healthScore) return null;
  const { score, label, level, penalties } = healthScore;
  const colors = HEALTH_SCORE_COLORS[level] ?? HEALTH_SCORE_COLORS.acceptable;
  const labelFor = (k) => categoryLabels[k] ?? k;

  return (
    <Card className={colors.bg}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Salud financiera de tu situación real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-3">
          <p className={`text-5xl font-bold ${colors.text}`}>
            {score}<span className="text-2xl opacity-60">/100</span>
          </p>
          <p className={`text-xl font-semibold ${colors.text}`}>{label}</p>
        </div>
        <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
          <div className={`h-full ${colors.bar} transition-all`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          Basado en la desviación de tu gasto real respecto a la distribución saludable para tu perfil.
        </p>
        {penalties.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Ver desglose ({penalties.length} {penalties.length === 1 ? "factor resta" : "factores restan"} puntos)
            </summary>
            <ul className="mt-2 space-y-1 pl-2">
              {penalties.map((p, i) => (
                <li key={i} className="flex justify-between gap-2 text-muted-foreground">
                  <span><strong>{labelFor(p.category)}:</strong> {p.reason}</span>
                  <span className="font-mono font-medium shrink-0">{p.points}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Indicador por categoría: estado del gasto real vs saludable ────────────

function StatusIcon({ status }) {
  if (status === "on_target") return <Check className="size-4 text-green-600 shrink-0" />;
  if (status === "above_healthy") return <ArrowUp className="size-4 text-amber-600 shrink-0" />;
  if (status === "below_healthy") return <ArrowDown className="size-4 text-blue-600 shrink-0" />;
  return null;
}

function statusText(status) {
  if (status === "on_target") return "Alineado";
  if (status === "above_healthy") return "Por encima";
  if (status === "below_healthy") return "Por debajo";
  return "—";
}

// ─── Componente principal ──────────────────────────────────────────────────

function DiagnosisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const [realAmounts] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.diagnosisAmounts);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const amountsMissing = realAmounts === null;

  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEYS.profileCurrent) && !!localStorage.getItem(STORAGE_KEYS.diagnosisAmounts);
  });
  const [calcError, setCalcError] = useState(null);

  // Modo testing guiado (M18 Fase 4): notificar diagnóstico completado al
  // sistema research si el contexto /study está activo.
  const study = useStudyContextOptional();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (study && diagnosis && profile && !notifiedRef.current) {
      notifiedRef.current = true;
      study.notifyCalculation(
        "diagnosis",
        profile,
        { income, realAmounts },
        diagnosis
      );
    }
  }, [study, diagnosis, profile, income, realAmounts]);

  useEffect(() => {
    if (!profile || !income || isNaN(income) || income <= 0 || !realAmounts) return;

    fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, income, realAmounts }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setCalcError(data.error);
        else setDiagnosis(data);
      })
      .catch(() => setCalcError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, [profile, income, realAmounts]);

  if (!incomeParam || isNaN(income) || income <= 0 || amountsMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Datos inválidos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Vuelve al formulario para introducir tus importes reales.</p>
            <Button onClick={() => router.push(`/diagnosis-form?income=${income}`)}>Volver al formulario</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (profileMissing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Perfil no encontrado</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Necesitas completar el cuestionario antes de diagnosticar.</p>
            <Button onClick={() => router.push("/profile")}>Completar perfil</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading || (!diagnosis && !calcError)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Analizando tu situación...</p>
      </main>
    );
  }

  if (calcError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Error en el diagnóstico</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{calcError}</p>
            <Button onClick={() => router.push(`/diagnosis-form?income=${income}`)}>Volver al formulario</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const formatCurrency = (n) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
  const formatPct = (n) => `${n.toFixed(1)}%`;
  const formatSignedAmount = (n) => {
    const sign = n > 0 ? "+" : "";
    return `${sign}${formatCurrency(n)}`;
  };

  // Construir mapa label para HealthScoreCard y banners
  const categoryLabels = {
    ...Object.fromEntries(CATEGORIES_UI.map((c) => [c.id, c.label])),
    _wants_block:   "Bloque de deseos",
    _savings_block: "Bloque de ahorro",
    _budget_block:  "Presupuesto insuficiente",
    _debt_block:    "Carga de deuda alta",
  };

  const budgetAlert = diagnosis.alerts?._budget_block;
  const debtAlert   = diagnosis.alerts?._debt_block;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Diagnóstico de tu situación real</h1>
          <p className="text-muted-foreground">
            Comparación de tu gasto real contra la distribución saludable para tu perfil (ingreso {formatCurrency(income)})
          </p>
        </div>

        {/* Alertas críticas del sistema */}
        {budgetAlert && <AlertBanner level={budgetAlert.level} message={budgetAlert.message} size="md" />}
        {debtAlert   && <AlertBanner level={debtAlert.level}   message={debtAlert.message}   size="md" />}

        {/* Score de salud */}
        <HealthScoreCard healthScore={diagnosis.healthScore} categoryLabels={categoryLabels} />

        {/* Resumen por bloque */}
        {diagnosis.monthlyDebtPayment > 0 && (
          <div className="rounded-md bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            La distribución saludable está calculada sobre{" "}
            <strong className="text-foreground">{formatCurrency(diagnosis.effectiveIncome)}</strong>/mes —
            tu ingreso disponible tras descontar los{" "}
            <strong className="text-foreground">{formatCurrency(diagnosis.monthlyDebtPayment)}</strong>/mes
            de cuotas de deuda fija.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          {BLOCK_ORDER.map((blockKey) => {
            const b = diagnosis.blocks[blockKey];
            const isOver = b.diffAmount > 0;
            const sign = isOver ? "+" : "";
            const overUnderColor = blockKey === "savings"
              ? (isOver ? "text-green-700" : "text-amber-600")     // ahorro: más es bueno
              : (isOver ? "text-amber-600" : "text-green-700");    // gasto: menos es bueno
            return (
              <Card key={blockKey}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{b.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Real: <strong className="text-foreground">{formatCurrency(b.realAmount)}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recomendado: {formatCurrency(b.healthyAmount)}
                  </p>
                  <p className={`text-sm font-medium ${overUnderColor}`}>
                    {sign}{formatCurrency(b.diffAmount)} ({sign}{b.deviationPct.toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabla comparativa por categoría */}
        {BLOCK_ORDER.map((blockKey) => {
          const cats = CATEGORIES_UI.filter((c) => c.block === blockKey);
          const blockAlert = diagnosis.alerts?.[`_${blockKey}_block`];
          return (
            <div key={blockKey} className="space-y-3">
              <div className="flex items-baseline justify-between border-b-2 border-foreground/10 pb-2">
                <h2 className="text-lg font-bold">{diagnosis.blocks[blockKey].label}</h2>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(diagnosis.blocks[blockKey].realAmount)} reales
                </span>
              </div>

              {blockAlert && (
                <AlertBanner
                  level={blockAlert.level}
                  message={`${diagnosis.blocks[blockKey].label}: ${blockAlert.message}`}
                />
              )}

              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Categoría</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground">Tu gasto</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground">Recomendado</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground">Diferencia</th>
                        <th className="text-center px-4 py-2 font-medium text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cats.map((cat) => {
                        const c = diagnosis.comparison[cat.id];
                        const catAlert = diagnosis.alerts?.[cat.id];
                        return (
                          <tr key={cat.id} className="border-b last:border-0 align-top">
                            <td className="px-4 py-2">
                              <p className="font-medium">{cat.label}</p>
                              {catAlert && (
                                <div className="mt-1">
                                  <AlertBanner level={catAlert.level} message={catAlert.message} />
                                </div>
                              )}
                            </td>
                            <td className="text-right px-4 py-2 font-medium">{formatCurrency(c.realAmount)}</td>
                            <td className="text-right px-4 py-2 text-muted-foreground">
                              {formatCurrency(c.healthyAmount)}
                              <span className="ml-1 text-xs">({formatPct(c.healthyPercentage)})</span>
                            </td>
                            <td className="text-right px-4 py-2">{formatSignedAmount(c.diffAmount)}</td>
                            <td className="text-center px-4 py-2">
                              <div className="inline-flex items-center gap-1">
                                <StatusIcon status={c.status} />
                                <span className="text-xs text-muted-foreground">{statusText(c.status)}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/diagnosis-form?income=${income}`)}
          >
            Recalcular
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/results?income=${income}`)}
          >
            Volver a resultados
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>Inicio</Button>
        </div>
      </div>
    </main>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando diagnóstico...</p>
      </main>
    }>
      <DiagnosisContent />
    </Suspense>
  );
}
