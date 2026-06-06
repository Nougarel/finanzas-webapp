"use client";

// src/components/study/StudyFunnel.jsx
//
// Orquestador del funnel pre-app /study. Switch sobre currentStep que
// renderiza la pantalla correspondiente del state machine PRE_APP_STEPS.

import { useState } from "react";
import { useStudyContext } from "@/lib/research/useStudyContext";
import WelcomeScreen from "@/components/study/screens/WelcomeScreen";
import ConsentScreen from "@/components/study/screens/ConsentScreen";
import DemographicsScreen from "@/components/study/screens/DemographicsScreen";
import FinancialLiteracyScreen from "@/components/study/screens/FinancialLiteracyScreen";
import TransitionToAppScreen from "@/components/study/screens/TransitionToAppScreen";
import ExistingSessionScreen from "@/components/study/screens/ExistingSessionScreen";

// Estados de sesión que indican progreso previo (justifican mostrar
// la pantalla "ya iniciaste el estudio").
const RESUMABLE_STATUSES = new Set(["pretest_done", "app_done", "completed"]);

export default function StudyFunnel() {
  const { currentStep, isLoading, error, sessionStatus } = useStudyContext();
  const [existingResolved, setExistingResolved] = useState(false);

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

  // Sesión preexistente con progreso → ofrecer continuar o reiniciar.
  if (
    !existingResolved &&
    currentStep === "welcome" &&
    RESUMABLE_STATUSES.has(sessionStatus)
  ) {
    return <ExistingSessionScreen onResolved={() => setExistingResolved(true)} />;
  }

  switch (currentStep) {
    case "welcome":
      return <WelcomeScreen />;
    case "consent":
      return <ConsentScreen />;
    case "demographics":
      return <DemographicsScreen />;
    case "pretest_literacy":
      return <FinancialLiteracyScreen />;
    case "transition_to_app":
      return <TransitionToAppScreen />;
    default:
      return (
        <main className="flex min-h-[100dvh] items-center justify-center">
          <p className="text-muted-foreground">Cargando…</p>
        </main>
      );
  }
}
