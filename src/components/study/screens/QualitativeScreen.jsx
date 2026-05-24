"use client";

// src/components/study/screens/QualitativeScreen.jsx

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADHOC_ITEMS,
  MESSAGES,
  QUALITATIVE,
  SUS_ITEMS,
} from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { useStudyRecorder } from "@/lib/research/useStudyRecorder";
import { validateQualitative } from "@/lib/research/studyValidators";

const SUS_KEY = "__sus";
const ADHOC_KEY = "__adhoc";

/**
 * Pantalla cualitativa (dossier §9). Dos textareas opcionales.
 * Al pulsar "Continuar" se hace el submitPosttest final con TODAS las
 * respuestas del posttest (SUS + ad-hoc + cualitativo). Si falla, el
 * botón pasa a "Reintentar".
 */
export default function QualitativeScreen() {
  const { goToStep, pretestAnswers } = useStudyContext();
  const { submitPosttest, logEvent, updateSessionStatus } = useStudyRecorder();
  const titleRef = useRef(null);
  const [positive, setPositive] = useState("");
  const [improvement, setImprovement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validation = validateQualitative(positive, improvement);
  const positiveQ = QUALITATIVE.questions[0];
  const improvementQ = QUALITATIVE.questions[1];

  const buildPayload = () => {
    const susAnswers = pretestAnswers[SUS_KEY] ?? {};
    const adhocAnswers = pretestAnswers[ADHOC_KEY] ?? {};
    return {
      sus_responses: SUS_ITEMS.map((it) => susAnswers[it.id]),
      adhoc_responses: ADHOC_ITEMS.reduce((acc, it) => {
        acc[`q${it.id}`] = adhocAnswers[it.id];
        return acc;
      }, {}),
      // Schema define qualitative_feedback como text único. Serializamos
      // ambas respuestas (positive + improvement) como JSON dentro para
      // preservar la distinción del dossier sin migración SQL.
      qualitative_feedback: positive || improvement
        ? JSON.stringify({ positive: positive || null, improvement: improvement || null })
        : null,
      // No preguntamos "would_recommend" en este estudio (no está en dossier).
      would_recommend: null,
    };
  };

  const handleContinue = async () => {
    if (!validation.valid) return;
    setSubmitting(true);
    setSubmitError(null);
    const payload = buildPayload();
    const { error } = await submitPosttest(payload);
    setSubmitting(false);
    if (error) {
      setSubmitError(error);
      return;
    }
    logEvent("posttest_completed", {}).catch(() => {});
    updateSessionStatus("completed").catch(() => {});
    goToStep("closing");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start p-4 py-8 animate-in fade-in duration-150">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {QUALITATIVE.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {QUALITATIVE.intro}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="qual-positive" className="text-sm font-medium">
              {positiveQ.label}
            </Label>
            <Textarea
              id="qual-positive"
              value={positive}
              onChange={(e) => setPositive(e.target.value)}
              maxLength={positiveQ.maxLength}
              rows={4}
              className="resize-none"
            />
            <p
              className="text-xs text-muted-foreground text-right"
              aria-live="polite"
            >
              {positive.length}/{positiveQ.maxLength} caracteres
            </p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="qual-improvement" className="text-sm font-medium">
              {improvementQ.label}
            </Label>
            <Textarea
              id="qual-improvement"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              maxLength={improvementQ.maxLength}
              rows={4}
              className="resize-none"
            />
            <p
              className="text-xs text-muted-foreground text-right"
              aria-live="polite"
            >
              {improvement.length}/{improvementQ.maxLength} caracteres
            </p>
          </div>

          {submitError && (
            <div className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
              <p className="text-destructive">
                {submitError.code === "NETWORK"
                  ? MESSAGES.networkError
                  : MESSAGES.genericError}
              </p>
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={submitting || !validation.valid}
            aria-disabled={submitting || !validation.valid}
            className="w-full"
          >
            {submitting
              ? "Enviando…"
              : submitError
              ? MESSAGES.networkRetry
              : QUALITATIVE.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
