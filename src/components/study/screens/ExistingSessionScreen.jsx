"use client";

// src/components/study/screens/ExistingSessionScreen.jsx
//
// Pantalla mostrada cuando useStudySession detecta una sesión preexistente
// con sessionStatus !== 'started' (decisión consolidada §11.5 / D7).
// El participante decide entre continuar (resume) o empezar de nuevo.

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStudyClient } from "@/lib/supabase/studyClient";
import { MESSAGES } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { logEvent, updateSessionStatus } from "@/lib/research/recorder";

/**
 * Resume — empuja al usuario al primer paso que tiene sentido para el
 * sessionStatus existente:
 *   - 'pretest_done' → transition_to_app
 *   - 'app_done'     → ir directamente a /study/posttest
 *   - 'completed'    → ir al cierre
 *   - 'abandoned'    → forzar reset
 */
function nextStepForStatus(status) {
  switch (status) {
    case "pretest_done":
      return { step: "transition_to_app", route: null };
    case "app_done":
      return { step: "sus", route: "/study/posttest" };
    case "completed":
      return { step: "closing", route: "/study/posttest" };
    default:
      return null;
  }
}

export default function ExistingSessionScreen({ onResolved }) {
  const router = useRouter();
  const { sessionId, sessionStatus, goToStep } = useStudyContext();
  const titleRef = useRef(null);
  const client = useMemo(() => createStudyClient(), []);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleContinue = () => {
    const target = nextStepForStatus(sessionStatus);
    if (target) {
      goToStep(target.step);
      if (target.route) router.push(target.route);
    } else {
      // Status no resoluble — tratamos como reset.
      handleRestart();
      return;
    }
    onResolved?.();
  };

  const handleRestart = async () => {
    // Best-effort: marcamos la sesión previa como abandonada antes de cerrar
    // sesión, para no dejar filas en estado 'active' indefinidamente. Si la
    // BBDD falla, continuamos con signOut + reload de todos modos.
    if (sessionId) {
      try {
        await updateSessionStatus(client, sessionId, "abandoned");
      } catch {
        // Telemetría no crítica: ignoramos el fallo y seguimos.
      }
      try {
        await logEvent(client, sessionId, "session_abandoned", { reason: "user_restart" });
      } catch {
        // Telemetría no crítica: ignoramos el fallo y seguimos.
      }
    }
    // signOut elimina el JWT anónimo del localStorage → useStudySession
    // creará una nueva research_session limpia tras el reload.
    try {
      await client.auth.signOut();
    } catch {
      // Si signOut falla, seguimos con el reload de todos modos.
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-xl font-bold tracking-tight outline-none"
          >
            {MESSAGES.existingSessionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {MESSAGES.existingSessionBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleContinue} className="flex-1">
              {MESSAGES.existingSessionContinue}
            </Button>
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              {MESSAGES.existingSessionRestart}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
