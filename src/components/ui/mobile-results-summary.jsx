"use client";

/**
 * mobile-results-summary.jsx — Franja de resumen para viewports < xl (< 1280px).
 *
 * Visible únicamente en móvil y tablet: su uso se envuelve en `xl:hidden` en las
 * páginas que lo insertan.
 *
 * Props:
 *   dataset  — estructura unificada idéntica a la que recibe DashboardPanel.
 *   profile  — objeto de perfil del usuario (localStorage["userProfile"]).
 *   mode     — "direct" | "real" | "inverse"; controla visibilidad del chip emergencia.
 *   income   — ingreso de referencia en € (number).
 *   onEdit   — callback opcional para el botón Editar dentro del ProfilePanel.
 */

import { useState } from "react";
import { User } from "lucide-react";
import { Dialog } from "radix-ui";
import { ProfilePanel } from "@/components/ui/profile-panel";

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * @param {Object} props
 * @param {Object|null} props.dataset        — estructura unificada del DashboardPanel.
 * @param {Object|null} props.profile        — objeto de perfil del usuario.
 * @param {"direct"|"real"|"inverse"} props.mode
 * @param {number} props.income              — ingreso de referencia en €.
 * @param {Function} [props.onEdit]          — callback del botón Editar del perfil (opcional).
 */
export function MobileResultsSummary({ dataset, profile, mode, income, onEdit }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="space-y-3">

      {/* Botón "Tu perfil" que abre bottom sheet */}
      {profile && (
        <Dialog.Root open={profileOpen} onOpenChange={setProfileOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-full px-3 py-1.5 bg-card hover:bg-muted/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <User size={14} className="text-primary" aria-hidden="true" />
              <span>Tu perfil</span>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setProfileOpen(false)}
            />
            <Dialog.Content
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl bg-background border-t border-border p-4 max-h-[75vh] overflow-y-auto outline-none"
              onPointerDownOutside={(e) => e.preventDefault()}
              aria-describedby={undefined}
            >
              <Dialog.Title className="sr-only">Tu perfil</Dialog.Title>

              {/* Indicador visual de arrastre */}
              <div className="mx-auto w-10 h-1 rounded-full bg-muted mb-4" aria-hidden="true" />

              <ProfilePanel
                profile={profile}
                mode={mode}
                onEdit={onEdit ? () => { setProfileOpen(false); onEdit(); } : undefined}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

    </div>
  );
}
