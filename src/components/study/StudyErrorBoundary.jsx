"use client";

// src/components/study/StudyErrorBoundary.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MESSAGES } from "@/lib/research/studyCopy";

/**
 * Error Boundary del funnel /study. Captura errores de render de cualquier
 * componente descendiente y muestra el mensaje genérico del dossier §11.3.
 *
 * No es Server Component (los Error Boundaries de React requieren clase).
 */
export default class StudyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Telemetría mínima a consola del navegador; no se envía al backend porque
    // el error puede haber ocurrido antes de tener sessionId disponible.
    console.error("[StudyErrorBoundary]", error);
  }

  handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/study";
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Algo ha ido mal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{MESSAGES.genericError}</p>
            <Button onClick={this.handleRetry} className="w-full">
              {MESSAGES.genericRetry}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
}
