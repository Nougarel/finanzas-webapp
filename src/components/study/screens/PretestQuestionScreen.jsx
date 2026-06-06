"use client";

// src/components/study/screens/PretestQuestionScreen.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BIG_FIVE_QUESTIONS,
  BIG_FIVE_ORDER,
  MESSAGES,
} from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { useStudyRecorder } from "@/lib/research/useStudyRecorder";
import {
  validateBigFiveAnswer,
  isBigFiveAnswerCorrect,
  isBigFiveNumericCorrect,
} from "@/lib/research/studyValidators";
import { nextPreAppStep } from "@/lib/research/funnelMachine";
import { DEMOGRAPHICS_KEY } from "@/lib/research/studyConfig";

/**
 * Pantalla genérica de pregunta del Big Five (dossier §5).
 * Parametrizada por `questionId`. Sin botón volver atrás, sin feedback de
 * correcto/incorrecto (decisión consolidada). Al terminar q5 (última pregunta)
 * arma el payload de pretest_responses y lo envía al recorder; si falla
 * bloquea el avance (política diferenciada D6).
 */
export default function PretestQuestionScreen({ questionId }) {
  const { goToStep, currentStep, pretestAnswers, setPretestAnswer } = useStudyContext();
  const { submitPretest, logEvent, updateSessionStatus } = useStudyRecorder();
  const titleRef = useRef(null);
  const [localValue, setLocalValue] = useState(pretestAnswers[questionId] ?? "");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const question = BIG_FIVE_QUESTIONS[questionId];

  // Índice 0-based en el orden del Big Five (para barra de progreso).
  const positionIndex = useMemo(() => BIG_FIVE_ORDER.indexOf(questionId), [questionId]);
  const total = BIG_FIVE_ORDER.length;

  useEffect(() => {
    titleRef.current?.focus();
    // Restaurar valor previo si el participante volvió por refresh (no debería
    // pasar pero por completitud — los answers se guardan en estado del Provider).
    setLocalValue(pretestAnswers[questionId] ?? "");
    setTouched(false);
    setSubmitError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const validation = validateBigFiveAnswer(questionId, localValue);
  const isLastQuestion = questionId === BIG_FIVE_ORDER[BIG_FIVE_ORDER.length - 1];

  /**
   * Construye el payload final de pretest_responses fusionando demographics
   * del Provider con todas las respuestas Big Five (incluyendo la pregunta
   * actual que aún no está en pretestAnswers).
   */
  const buildPretestPayload = (allAnswers) => {
    // Demographics se almacenó implícitamente con logEvent — pero la BBDD las
    // exige en pretest_responses. Las leemos del estado del Provider si están
    // disponibles (decisión: el Provider las recibe del DemographicsScreen
    // mediante setPretestAnswer con keys especiales, pero aquí no las tenemos
    // de momento — se completarán en el siguiente refactor).
    // De momento las demographics se persisten en extra_responses como respaldo.
    const demographics = allAnswers[DEMOGRAPHICS_KEY] ?? {};
    return {
      age_range: demographics.age_range,
      gender: demographics.gender,
      education_level: demographics.education_level,
      employment_status: demographics.employment_status,
      household_composition: demographics.household_composition,
      prior_financial_app_use: demographics.prior_financial_app_use,
      big_three_q1: isBigFiveAnswerCorrect("q1", allAnswers.q1),
      big_three_q2: isBigFiveAnswerCorrect("q2", allAnswers.q2),
      big_three_q3: isBigFiveAnswerCorrect("q3", allAnswers.q3),
      big_five_q4: isBigFiveAnswerCorrect("q4", allAnswers.q4),
      big_five_q5: isBigFiveAnswerCorrect("q5", allAnswers.q5),
      extra_responses: {
        arithmetic_division_correct: isBigFiveNumericCorrect("p0", allAnswers.p0),
        arithmetic_simple_interest_correct: isBigFiveNumericCorrect("p0b", allAnswers.p0b),
        raw_answers: {
          p0: allAnswers.p0,
          q1: allAnswers.q1,
          p0b: allAnswers.p0b,
          q2: allAnswers.q2,
          q3: allAnswers.q3,
          q4: allAnswers.q4,
          q5: allAnswers.q5,
        },
      },
    };
  };

  const handleContinue = async () => {
    setTouched(true);
    if (!validation.valid) return;

    // Guardar respuesta en el contexto.
    setPretestAnswer(questionId, localValue);

    if (!isLastQuestion) {
      // currentStep es "pretest_p0", "pretest_q1"... (los IDs reales del state
      // machine). questionId es la versión corta ("p0", "q1"...) usada como
      // clave en BIG_FIVE_QUESTIONS y pretestAnswers — no coincide con el
      // step y por eso no puede usarse para avanzar el funnel.
      const next = nextPreAppStep(currentStep);
      if (next) goToStep(next);
      return;
    }

    // Última pregunta: armar payload y enviar al recorder. Bloqueante.
    setSubmitting(true);
    setSubmitError(null);
    const allAnswers = { ...pretestAnswers, [questionId]: localValue };
    const payload = buildPretestPayload(allAnswers);

    const { error: submitErr } = await submitPretest(payload);
    setSubmitting(false);
    if (submitErr) {
      setSubmitError(submitErr);
      return;
    }
    // Telemetría y status update no bloqueantes.
    logEvent("pretest_completed", {
      big_three_score:
        (payload.big_three_q1 ? 1 : 0) +
        (payload.big_three_q2 ? 1 : 0) +
        (payload.big_three_q3 ? 1 : 0),
    }).catch(() => {});
    updateSessionStatus("pretest_done").catch(() => {});

    goToStep("transition_to_app");
  };

  if (!question) {
    // Pregunta no reconocida — caso defensivo, no debería pasar si el state
    // machine está bien definido.
    return (
      <main className="flex min-h-[100dvh] items-center justify-center p-4">
        <p className="text-destructive">Pregunta no reconocida.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      {positionIndex !== -1 && (
        <div
          className="w-full max-w-lg mb-3 h-1.5 rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round((positionIndex / total) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Pregunta ${positionIndex + 1} de ${total}`}
        >
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(positionIndex / total) * 100}%` }}
          />
        </div>
      )}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Conceptos financieros
            </p>
            {positionIndex !== -1 && (
              <span className="text-xs text-muted-foreground shrink-0" aria-hidden="true">
                {positionIndex + 1} / {total}
              </span>
            )}
          </div>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-base font-medium leading-relaxed outline-none mt-3"
          >
            {question.statement}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === "numeric" && (
            <div className="space-y-2">
              <Label htmlFor={`pretest-${questionId}`}>{question.inputLabel}</Label>
              <Input
                id={`pretest-${questionId}`}
                type="number"
                step="0.01"
                min="0"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                aria-invalid={touched && !validation.valid}
              />
              {touched && !validation.valid && (
                <p className="text-xs text-destructive">{validation.error}</p>
              )}
            </div>
          )}

          {question.type === "single" && (
            <fieldset
              className="space-y-2"
              aria-invalid={touched && !validation.valid}
            >
              <legend className="sr-only">{question.statement}</legend>
              <RadioGroup
                value={localValue}
                onValueChange={(v) => setLocalValue(v)}
                className="gap-2"
              >
                {question.options.map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-start gap-2 min-h-[44px] py-1"
                  >
                    <RadioGroupItem
                      id={`${questionId}-${opt.value}`}
                      value={opt.value}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`${questionId}-${opt.value}`}
                      className="cursor-pointer leading-snug"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {touched && !validation.valid && (
                <p className="text-xs text-destructive">{validation.error}</p>
              )}
            </fieldset>
          )}

          {submitError && (
            <div className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
              <p className="text-destructive">
                {submitError.code === "NETWORK" ? MESSAGES.networkError : MESSAGES.genericError}
              </p>
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!validation.valid || submitting}
            aria-disabled={!validation.valid || submitting}
            className="w-full"
          >
            {submitting
              ? "Guardando…"
              : submitError
              ? MESSAGES.networkRetry
              : isLastQuestion
              ? "Listo, ir a la herramienta →"
              : "Confirmar respuesta"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
