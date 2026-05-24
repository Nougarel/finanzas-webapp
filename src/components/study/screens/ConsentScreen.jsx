"use client";

// src/components/study/screens/ConsentScreen.jsx

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CONSENT } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { validateConsent } from "@/lib/research/studyValidators";

/**
 * Pantalla 2: consentimiento RGPD (dossier §3).
 * Checkbox NO premarcada por defecto, botón deshabilitado hasta marcar.
 */
export default function ConsentScreen() {
  const { goToStep } = useStudyContext();
  const [accepted, setAccepted] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleContinue = () => {
    const { valid } = validateConsent(accepted);
    if (!valid) return;
    // session_started ya se registra en useStudySession al crear la sesión.
    goToStep("demographics");
  };

  const isDisabled = !accepted;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 animate-in fade-in duration-150">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {CONSENT.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-72 overflow-y-auto rounded-md border bg-muted/30 p-4 space-y-3">
            {CONSENT.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent-accept"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
              className="mt-1"
            />
            <Label htmlFor="consent-accept" className="text-sm leading-snug cursor-pointer">
              {CONSENT.checkboxLabel}
            </Label>
          </div>

          <Button
            onClick={handleContinue}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className="w-full"
          >
            {CONSENT.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
