"use client";

// src/components/study/StudyPosttestFunnel.jsx
//
// Orquestador del funnel posttest /study/posttest. Switch sobre currentStep
// que renderiza la pantalla correspondiente de POSTTEST_STEPS.
//
// Si el participante llega aquí sin haber pasado por la fase app (currentStep
// no es uno de los posttest), forzamos goToStep("sus") al montar para
// estabilizar el state machine.

import { useEffect } from "react";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { POSTTEST_STEPS } from "@/lib/research/studyConfig";
import SusScreen from "@/components/study/screens/SusScreen";
import AdHocScreen from "@/components/study/screens/AdHocScreen";
import QualitativeScreen from "@/components/study/screens/QualitativeScreen";
import ClosingScreen from "@/components/study/screens/ClosingScreen";

export default function StudyPosttestFunnel() {
  const { currentStep, goToStep, isLoading, error } = useStudyContext();

  // Si llegan a /study/posttest con un step de pre-app, normalizamos a "sus".
  useEffect(() => {
    if (!isLoading && !POSTTEST_STEPS.includes(currentStep)) {
      goToStep("sus");
    }
  }, [currentStep, isLoading, goToStep]);

  if (isLoading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-muted-foreground">Cargando…</p>
      </main>
    );
  }

  if (error && !error.code) {
    throw new Error(error.message ?? "Error de sesión");
  }

  switch (currentStep) {
    case "sus":
      return <SusScreen />;
    case "adhoc":
      return <AdHocScreen />;
    case "qualitative":
      return <QualitativeScreen />;
    case "closing":
      return <ClosingScreen />;
    default:
      return (
        <main className="flex min-h-[100dvh] items-center justify-center">
          <p className="text-muted-foreground">Cargando…</p>
        </main>
      );
  }
}
