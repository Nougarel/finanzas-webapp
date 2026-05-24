"use client";

// src/components/study/screens/FinishConfirmModal.jsx

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FINISH_CONFIRM } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { useStudyRecorder } from "@/lib/research/useStudyRecorder";

/**
 * Modal de confirmación al pulsar "He terminado" (dossier §11.5).
 * Foco al botón seguro ("Seguir probando"). Si el usuario confirma:
 *   - Marca sesión como app_done (no bloqueante)
 *   - Emite evento app_completed (no bloqueante)
 *   - Navega a /study/posttest y resetea step a "sus"
 */
export default function FinishConfirmModal({ open, onOpenChange }) {
  const router = useRouter();
  const { goToStep } = useStudyContext();
  const { logEvent, updateSessionStatus } = useStudyRecorder();

  const handleConfirm = () => {
    onOpenChange(false);
    logEvent("app_completed", {}).catch(() => {});
    updateSessionStatus("app_done").catch(() => {});
    goToStep("sus");
    router.push("/study/posttest");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{FINISH_CONFIRM.title}</DialogTitle>
          <DialogDescription>{FINISH_CONFIRM.body}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          {/* Foco al botón seguro (heurística Nielsen). */}
          <Button
            variant="outline"
            autoFocus
            onClick={() => onOpenChange(false)}
          >
            {FINISH_CONFIRM.cancel}
          </Button>
          <Button onClick={handleConfirm}>{FINISH_CONFIRM.confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
