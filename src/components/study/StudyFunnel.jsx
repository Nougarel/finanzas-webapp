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
import PretestIntroScreen from "@/components/study/screens/PretestIntroScreen";
import PretestQuestionScreen from "@/components/study/screens/PretestQuestionScreen";
import TransitionToAppScreen from "@/components/study/screens/TransitionToAppScreen";
import ExistingSessionScreen from "@/components/study/screens/ExistingSessionScreen";

const PRETEST_STEP_TO_QUESTION = {
  pretest_p0: "p0",
  pretest_q1: "q1",
  pretest_p0b: "p0b",
  pretest_q2: "q2",
  pretest_q3: "q3",
  pretest_q4: "q4",
  pretest_q5: "q5",
};

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
    case "pretest_intro":
      return <PretestIntroScreen />;
    case "pretest_p0":
    case "pretest_q1":
    case "pretest_p0b":
    case "pretest_q2":
    case "pretest_q3":
    case "pretest_q4":
    case "pretest_q5":
      return <PretestQuestionScreen questionId={PRETEST_STEP_TO_QUESTION[currentStep]} />;
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
