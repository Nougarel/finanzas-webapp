"use client";

// src/components/study/screens/AdHocScreen.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LikertScale from "@/components/study/controls/LikertScale";
import { ADHOC, ADHOC_ITEMS } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { validateAdHocResponses } from "@/lib/research/studyValidators";

const ADHOC_KEY = "__adhoc";

/**
 * Pantalla ad-hoc (dossier §8). 4 ítems Likert. Las respuestas se
 * almacenan en pretestAnswers.__adhoc; el submit definitivo se hace
 * en QualitativeScreen.
 */
export default function AdHocScreen() {
  const { goToStep, pretestAnswers, setPretestAnswer } = useStudyContext();
  const titleRef = useRef(null);
  const [answers, setAnswers] = useState(() => pretestAnswers[ADHOC_KEY] ?? {});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const arr = useMemo(
    () => ADHOC_ITEMS.map((it) => answers[it.id] ?? null),
    [answers]
  );
  const answeredCount = arr.filter((v) => v !== null).length;
  const validation = validateAdHocResponses(arr);

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    setTouched(true);
    if (!validation.valid) return;
    setPretestAnswer(ADHOC_KEY, answers);
    goToStep("qualitative");
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
            {ADHOC.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {ADHOC.intro}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {ADHOC_ITEMS.map((item) => (
            <LikertScale
              key={item.id}
              name={`adhoc-${item.id}`}
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
            {answeredCount}/{ADHOC_ITEMS.length} respondidas
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
            {ADHOC.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
