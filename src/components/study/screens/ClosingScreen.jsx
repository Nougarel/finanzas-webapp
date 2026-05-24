"use client";

// src/components/study/screens/ClosingScreen.jsx

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLOSING } from "@/lib/research/studyCopy";

/**
 * Pantalla de cierre (dossier §10). El funnel termina aquí; el botón
 * redirige a la home normal de la app.
 */
export default function ClosingScreen() {
  const router = useRouter();
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
            {CLOSING.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {CLOSING.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {p}
            </p>
          ))}
          <Button onClick={() => router.push("/")} className="w-full">
            {CLOSING.cta}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
