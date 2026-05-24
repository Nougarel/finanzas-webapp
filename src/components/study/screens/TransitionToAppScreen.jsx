"use client";

// src/components/study/screens/TransitionToAppScreen.jsx

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRANSITION_TO_APP } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";

/**
 * Pantalla puente entre el cuestionario inicial y la fase de uso de la app
 * (dossier §5 final y §6). Al pulsar el botón se navega a /study/calculator
 * (primera pantalla del flujo directo) y se marca currentStep como "app".
 */
export default function TransitionToAppScreen() {
  const router = useRouter();
  const { goToStep } = useStudyContext();
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleStart = () => {
    // Mover el state machine a la fase app (afecta a la barra de progreso).
    goToStep("app");
    router.push("/study/calculator");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {TRANSITION_TO_APP.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {TRANSITION_TO_APP.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {p}
            </p>
          ))}

          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <p className="font-medium mb-2">{TRANSITION_TO_APP.flowsListTitle}</p>
            <ul className="space-y-1 text-muted-foreground">
              {TRANSITION_TO_APP.flowsList.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>

          <Button onClick={handleStart} className="w-full">
            {TRANSITION_TO_APP.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
