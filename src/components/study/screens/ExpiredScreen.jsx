"use client";

// src/components/study/screens/ExpiredScreen.jsx

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MESSAGES } from "@/lib/research/studyCopy";

/**
 * Pantalla de timeout (dossier §11.1). Reemplaza el contenido del funnel
 * cuando la sesión ha caducado. El botón fuerza un reload completo a
 * /study para resetear el state machine y el timer del Provider.
 */
export default function ExpiredScreen() {
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleRestart = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/study";
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {MESSAGES.timeoutTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {MESSAGES.timeoutBody}
          </p>
          <Button onClick={handleRestart} className="w-full">
            {MESSAGES.timeoutCta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
