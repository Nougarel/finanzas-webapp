"use client";

// src/lib/research/StudyContext.js

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createStudyClient } from "@/lib/supabase/studyClient";
import { logEvent, recordInteraction, updateSessionStatus } from "@/lib/research/recorder";
import { ENGINE_VERSION } from "@/lib/calculators/version";
import { useStudySession } from "@/lib/research/useStudySession";
import {
  PRE_APP_STEPS,
  POSTTEST_STEPS,
  TIMEOUT_MS,
  DEFAULT_COHORT,
} from "@/lib/research/studyConfig";
import { canFinishApp, progressOf } from "@/lib/research/funnelMachine";

/**
 * Contexto global del funnel /study. Sólo se monta dentro del layout /study,
 * por lo que cualquier componente fuera recibe null al usar useContext.
 *
 * Forma del valor: ver useStudyContext.js para el contrato consumido.
 */
export const StudyContext = createContext(null);

/**
 * Provider del funnel. Recibe la cohorte resuelta desde el layout (query param
 * ?cohort=X validado). Internamente:
 *   - Orquesta la sesión Supabase con useStudySession({ cohort })
 *   - Mantiene el step actual del state machine (pre-app y posttest comparten campo)
 *   - Mantiene completedFlows y respuestas del pretest
 *   - Lanza el timer de timeout (TIMEOUT_MS) — sin contador visible
 *   - Expone notifyCalculation(flowType, ...) para que ResultsPage marque progreso
 */
export function StudyProvider({ children, cohort = DEFAULT_COHORT }) {
  const router = useRouter();
  const supabaseClient = useMemo(() => createStudyClient(), []);

  const { sessionId, userId, status: sessionStatus, isLoading, error, retry } =
    useStudySession({ cohort });

  const [currentStep, setCurrentStep] = useState("welcome");
  const [completedFlows, setCompletedFlows] = useState({
    direct: false,
    inverse: false,
    diagnosis: false,
  });
  const [pretestAnswers, setPretestAnswers] = useState({});
  const [lastRecorderError, setLastRecorderError] = useState(null);
  const timeoutFiredRef = useRef(false);

  // ─── Setters ──────────────────────────────────────────────────────────────

  const goToStep = useCallback((stepId) => {
    setCurrentStep(stepId);
  }, []);

  const markFlowCompleted = useCallback((flowType) => {
    setCompletedFlows((prev) => (prev[flowType] ? prev : { ...prev, [flowType]: true }));
  }, []);

  const setPretestAnswer = useCallback((questionId, value) => {
    setPretestAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const clearError = useCallback(() => {
    setLastRecorderError(null);
  }, []);

  /**
   * Notifica un cálculo realizado en la app (modo guiado). Marca el flujo como
   * completado de forma síncrona y dispara la escritura a app_interactions en
   * paralelo. Errores del recorder se registran pero NO bloquean.
   */
  const notifyCalculation = useCallback(
    (flowType, profileSnapshot, input, output, durationMs = null) => {
      markFlowCompleted(flowType);
      if (!sessionId) return;
      recordInteraction(supabaseClient, sessionId, {
        flowType,
        profileSnapshot: profileSnapshot ?? {},
        input: input ?? {},
        output: output ?? {},
        durationMs,
      }).then(({ error: recErr }) => {
        if (recErr) setLastRecorderError(recErr);
      });
      // logEvent es telemetría secundaria: fire-and-forget, sin bloquear.
      logEvent(supabaseClient, sessionId, "app_interaction", {
        flow_type: flowType,
        engine_version: ENGINE_VERSION,
      }).catch(() => {});
    },
    [markFlowCompleted, sessionId, supabaseClient]
  );

  // ─── Timer de timeout (60 min) ────────────────────────────────────────────

  useEffect(() => {
    if (!sessionId) return undefined;
    // Reset por montaje del Provider — alineado con "refresh = reset" (dossier §13.5).
    timeoutFiredRef.current = false;
    const id = setTimeout(() => {
      if (timeoutFiredRef.current) return;
      timeoutFiredRef.current = true;
      // Telemetría no bloqueante.
      logEvent(supabaseClient, sessionId, "session_abandoned", { reason: "timeout" }).catch(() => {});
      updateSessionStatus(supabaseClient, sessionId, "abandoned").catch(() => {});
      router.replace("/study/expired");
    }, TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [sessionId, supabaseClient, router]);

  // ─── Valor del contexto ───────────────────────────────────────────────────

  const value = useMemo(() => {
    const canFinish = canFinishApp(completedFlows);
    const progressPct = progressOf(currentStep, completedFlows);
    return {
      // Identidad de sesión.
      sessionId,
      userId,
      sessionStatus,
      isLoading,
      error,
      retry,
      cohort,

      // State machine.
      currentStep,
      goToStep,
      progressPct,
      preAppSteps: PRE_APP_STEPS,
      posttestSteps: POSTTEST_STEPS,

      // Flujos.
      completedFlows,
      markFlowCompleted,
      canFinish,
      notifyCalculation,

      // Pretest answers (cliente; se vuelcan al recorder en submitPretest).
      pretestAnswers,
      setPretestAnswer,

      // Errores recuperables.
      lastRecorderError,
      clearError,
    };
  }, [
    sessionId, userId, sessionStatus, isLoading, error, retry, cohort,
    currentStep, goToStep,
    completedFlows, markFlowCompleted, notifyCalculation,
    pretestAnswers, setPretestAnswer,
    lastRecorderError, clearError,
  ]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}
