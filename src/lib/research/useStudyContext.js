"use client";

// src/lib/research/useStudyContext.js

import { useContext } from "react";
import { StudyContext } from "@/lib/research/StudyContext";

/**
 * Hook que devuelve el contexto del funnel /study.
 * Lanza error si se usa fuera del Provider (uso obligado dentro de /study/*).
 */
export function useStudyContext() {
  const ctx = useContext(StudyContext);
  if (ctx === null) {
    throw new Error(
      "useStudyContext debe usarse dentro de StudyProvider (rutas /study/*)"
    );
  }
  return ctx;
}

/**
 * Hook opcional. Devuelve el contexto o null si no estamos en el Provider.
 *
 * Pensado para componentes compartidos (ResultsPage, InverseResultsPage,
 * DiagnosisPage) que se montan dentro y fuera del funnel.
 */
export function useStudyContextOptional() {
  return useContext(StudyContext); // null fuera del Provider
}
