"use client";

// src/app/study/layout.js — layout del funnel de research /study (M18 Fase 4).
//
// Lee el query param ?cohort=X (validado contra COHORTS) y monta el
// StudyProvider envuelto en un Error Boundary. El Provider sobrevive a la
// navegación entre /study/* gracias al routing de Next.js App Router
// (el layout no se desmonta entre rutas hijas).

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { StudyProvider } from "@/lib/research/StudyContext";
import StudyErrorBoundary from "@/components/study/StudyErrorBoundary";
import StudyBar from "@/components/study/StudyBar";
import StudyNavigationGuard from "@/components/study/StudyNavigationGuard";
import { COHORTS, DEFAULT_COHORT } from "@/lib/research/studyConfig";

function StudyLayoutInner({ children }) {
  const searchParams = useSearchParams();
  const cohortParam = searchParams.get("cohort");
  const cohort = Object.values(COHORTS).includes(cohortParam) ? cohortParam : DEFAULT_COHORT;

  return (
    <StudyProvider cohort={cohort}>
      <StudyErrorBoundary>
        <StudyNavigationGuard />
        <StudyBar />
        {children}
      </StudyErrorBoundary>
    </StudyProvider>
  );
}

export default function StudyLayout({ children }) {
  // useSearchParams requiere Suspense en Next.js App Router (gotcha documentado).
  return (
    <Suspense fallback={null}>
      <StudyLayoutInner>{children}</StudyLayoutInner>
    </Suspense>
  );
}
