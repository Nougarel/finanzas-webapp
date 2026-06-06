"use client";

// src/components/study/screens/FinancialLiteracyScreen.jsx

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINANCIAL_LITERACY, MESSAGES } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { useStudyRecorder } from "@/lib/research/useStudyRecorder";
import { validateFinancialLiteracyLevel } from "@/lib/research/studyValidators";
import { DEMOGRAPHICS_KEY } from "@/lib/research/studyConfig";

/**
 * Última pantalla del pretest: autoevaluación de literacia financiera.
 * Al confirmar, construye el payload completo con las respuestas de demografía
 * y el nivel de literacia, llama submitPretest y avanza a transition_to_app.
 */

// ─── Tarjeta de opción sin icono (texto largo) ──────────────────────────────

function LiteracyOptionCard({ option, selected, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative flex items-start gap-3 rounded-xl p-4 cursor-pointer transition-colors duration-200 select-none
        ${
          selected
            ? "border-2 border-primary bg-primary/8"
            : "border border-border hover:border-primary/40 hover:bg-muted/50"
        }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            selected ? "font-semibold text-primary" : "font-medium text-foreground"
          }`}
        >
          {option.label}
        </p>
        <p className="text-xs font-light text-muted-foreground mt-1 leading-snug">
          {option.description}
        </p>
      </div>
      {selected && (
        <div className="shrink-0 mt-0.5 text-primary" aria-hidden>
          <Check size={16} strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function FinancialLiteracyScreen() {
  const { goToStep, setPretestAnswer, pretestAnswers } = useStudyContext();
  const { submitPretest, logEvent, updateSessionStatus } = useStudyRecorder();
  const titleRef = useRef(null);

  const [selectedLevel, setSelectedLevel] = useState(
    pretestAnswers["financial_literacy_level"] ?? null
  );
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validation = validateFinancialLiteracyLevel(selectedLevel);

  /**
   * Construye el payload de pretest_responses con datos de demografía
   * y el nivel de literacia financiera autoevaluado.
   */
  const buildPretestPayload = (level) => {
    const demographics = pretestAnswers[DEMOGRAPHICS_KEY] ?? {};
    return {
      age_range: demographics.age_range,
      gender: demographics.gender,
      education_level: demographics.education_level,
      employment_status: demographics.employment_status,
      household_composition: demographics.household_composition,
      prior_financial_app_use: demographics.prior_financial_app_use,
      financial_literacy_level: level,
    };
  };

  const handleConfirm = async () => {
    setTouched(true);
    if (!validation.valid) return;

    // Persistir en el contexto antes de hacer submit.
    setPretestAnswer("financial_literacy_level", selectedLevel);

    setSubmitting(true);
    setSubmitError(null);

    const payload = buildPretestPayload(selectedLevel);
    const { error: submitErr } = await submitPretest(payload);

    setSubmitting(false);
    if (submitErr) {
      setSubmitError(submitErr);
      return;
    }

    // Telemetría y status update no bloqueantes.
    logEvent("pretest_completed", {
      financial_literacy_level: selectedLevel,
    }).catch(() => {});
    updateSessionStatus("pretest_done").catch(() => {});

    goToStep("transition_to_app");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      {/* Barra de progreso — pantalla única de pretest */}
      <div
        className="w-full max-w-lg mb-3 h-1.5 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={80}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Última pregunta del cuestionario inicial"
      >
        <div className="h-full bg-primary transition-all duration-300" style={{ width: "80%" }} />
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Conceptos financieros
            </p>
          </div>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-base font-medium leading-relaxed outline-none mt-3"
          >
            {FINANCIAL_LITERACY.question}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {FINANCIAL_LITERACY.subtitle}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2" role="group" aria-label={FINANCIAL_LITERACY.question}>
            {FINANCIAL_LITERACY.options.map((option) => (
              <LiteracyOptionCard
                key={option.value}
                option={option}
                selected={selectedLevel === option.value}
                onSelect={() => {
                  setSelectedLevel(option.value);
                  setTouched(false);
                }}
              />
            ))}
          </div>

          {touched && !validation.valid && (
            <p className="text-xs text-destructive">{validation.error}</p>
          )}

          {submitError && (
            <div className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
              <p className="text-destructive">
                {submitError.code === "NETWORK" ? MESSAGES.networkError : MESSAGES.genericError}
              </p>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={submitting}
            aria-disabled={submitting}
            className="w-full"
          >
            {submitting
              ? "Guardando…"
              : submitError
              ? MESSAGES.networkRetry
              : "Listo, ir a la herramienta →"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
