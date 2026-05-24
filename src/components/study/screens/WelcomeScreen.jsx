"use client";

// src/components/study/screens/WelcomeScreen.jsx

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WELCOME } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";

/**
 * Pantalla 1: bienvenida (dossier §2).
 * Texto literal del dossier; la nota de sinceridad destaca con bg-amber.
 */
export default function WelcomeScreen() {
  const { goToStep } = useStudyContext();
  const titleRef = useRef(null);

  // Foco al h1 al montar (WCAG 2.4.7 / 4.1.3).
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
            {WELCOME.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {WELCOME.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {p}
            </p>
          ))}

          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="leading-relaxed">
              <strong>{WELCOME.sincerityNote.leadIn}</strong> {WELCOME.sincerityNote.body}
            </p>
          </div>

          <Button onClick={() => goToStep("consent")} className="w-full">
            {WELCOME.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
