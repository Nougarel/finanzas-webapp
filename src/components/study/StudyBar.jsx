"use client";

// src/components/study/StudyBar.jsx
//
// Barra superior fija visible solo durante la fase de uso de la app
// (rutas /study/(app)/...). Muestra el estado de flujos completados y
// el botón "He terminado" condicionalmente habilitado.

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { FLOW_LABELS, MESSAGES } from "@/lib/research/studyCopy";
import { FLOW_TYPES } from "@/lib/research/studyConfig";
import FinishConfirmModal from "@/components/study/screens/FinishConfirmModal";

// Rutas dentro de /study donde NO se debe mostrar la barra.
const PATHS_WITHOUT_BAR = new Set([
  "/study",
  "/study/posttest",
  "/study/expired",
]);

/**
 * Determina si en el pathname actual debe mostrarse la barra.
 */
function shouldShowBar(pathname) {
  if (!pathname || !pathname.startsWith("/study")) return false;
  if (PATHS_WITHOUT_BAR.has(pathname)) return false;
  return true;
}

export default function StudyBar() {
  const pathname = usePathname();
  const { completedFlows, canFinish } = useStudyContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pendingLabels = useMemo(
    () =>
      FLOW_TYPES.filter((f) => !completedFlows[f]).map((f) => FLOW_LABELS[f]),
    [completedFlows]
  );

  if (!shouldShowBar(pathname)) return null;

  const doneCount = FLOW_TYPES.reduce(
    (n, f) => n + (completedFlows[f] ? 1 : 0),
    0
  );

  return (
    <>
      <div
        className="sticky top-0 z-50 bg-primary text-primary-foreground border-b border-primary/30"
        role="region"
        aria-label="Barra del modo testing guiado"
      >
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="text-sm font-medium hidden sm:block shrink-0">
            Estudio en curso
          </p>

          {/* Indicador de flujos: pills en desktop, contador en móvil */}
          <div className="hidden md:flex items-center gap-3 flex-1">
            {FLOW_TYPES.map((f) => {
              const done = completedFlows[f];
              const Icon = done ? CheckCircle : Circle;
              return (
                <span
                  key={f}
                  className={`inline-flex items-center gap-1.5 text-xs ${
                    done ? "" : "opacity-60"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {FLOW_LABELS[f]}
                </span>
              );
            })}
          </div>

          <p className="text-xs md:hidden flex-1" aria-live="polite">
            {doneCount}/{FLOW_TYPES.length} flujos
          </p>

          <div className="flex flex-col items-stretch sm:items-end gap-1">
            <Button
              size="sm"
              variant="secondary"
              disabled={!canFinish}
              aria-disabled={!canFinish}
              onClick={() => setConfirmOpen(true)}
              className="min-h-[44px]"
            >
              He terminado
            </Button>
            {!canFinish && (
              <p className="text-xs text-primary-foreground/80">
                {MESSAGES.pendingFlowsPrefix} {pendingLabels.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <FinishConfirmModal open={confirmOpen} onOpenChange={setConfirmOpen} />
    </>
  );
}
