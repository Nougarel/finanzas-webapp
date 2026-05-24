"use client";

// src/components/study/screens/SusScreen.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LikertScale from "@/components/study/controls/LikertScale";
import { SUS, SUS_ITEMS } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { validateSusResponses } from "@/lib/research/studyValidators";

/**
 * Pantalla SUS (dossier §7). 10 ítems Likert en una sola pantalla.
 * Las respuestas se almacenan en pretestAnswers.__sus (sin tocar el
 * recorder hasta el submit final del posttest en QualitativeScreen).
 */
const SUS_KEY = "__sus";

export default function SusScreen() {
  const { goToStep, pretestAnswers, setPretestAnswer } = useStudyContext();
  const titleRef = useRef(null);
  const [answers, setAnswers] = useState(() => pretestAnswers[SUS_KEY] ?? {});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const arr = useMemo(
    () => SUS_ITEMS.map((it) => answers[it.id] ?? null),
    [answers]
  );
  const answeredCount = arr.filter((v) => v !== null).length;
  const validation = validateSusResponses(arr);

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    setTouched(true);
    if (!validation.valid) return;
    setPretestAnswer(SUS_KEY, answers);
    goToStep("adhoc");
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
            {SUS.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {SUS.intro}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {SUS_ITEMS.map((item) => (
            <LikertScale
              key={item.id}
              name={`sus-${item.id}`}
              itemNumber={item.id}
              statement={item.text}
              value={answers[item.id] ?? null}
              onChange={(v) => setAnswer(item.id, v)}
            />
          ))}

          <p
            className="text-xs text-muted-foreground text-right"
            aria-live="polite"
          >
            {answeredCount}/{SUS_ITEMS.length} respondidas
          </p>

          {touched && !validation.valid && (
            <p className="text-xs text-destructive text-right">
              {validation.error}
            </p>
          )}

          <Button
            onClick={handleContinue}
            disabled={!validation.valid}
            aria-disabled={!validation.valid}
            className="w-full"
          >
            {SUS.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
