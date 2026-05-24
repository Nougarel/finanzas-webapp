"use client";

// src/components/study/screens/PretestIntroScreen.jsx

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRETEST_INTRO } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";

/**
 * Pantalla puente entre demografía y las 7 preguntas Big Five (dossier §5).
 * Texto literal de la sección introductoria del pretest.
 */
export default function PretestIntroScreen() {
  const { goToStep } = useStudyContext();
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {PRETEST_INTRO.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {PRETEST_INTRO.intro}
          </p>
          <Button onClick={() => goToStep("pretest_p0")} className="w-full">
            {PRETEST_INTRO.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
