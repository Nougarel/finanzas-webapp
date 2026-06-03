"use client";

/**
 * profile-panel.jsx — Panel lateral con el resumen del perfil del usuario.
 *
 * Muestra las 4 secciones del cuestionario de perfil como pills compactas,
 * con la misma familia de cards que DashboardPanel. Diseñado para ocupar
 * col-span-2 en el grid de 12 columnas de PageShell variant="dashboard".
 *
 * @param {Object} props
 * @param {Object|null} props.profile  - Objeto de perfil de localStorage (profileData).
 * @param {"direct"|"inverse"} [props.mode="direct"] - Modo del cuestionario.
 * @param {Function} [props.onEdit]   - Callback al pulsar "Editar perfil".
 */

import { buildProfileSummary } from "@/lib/profile/profileSummary";

export function ProfilePanel({ profile, mode = "direct", onEdit }) {
  if (!profile) return null;

  const sections = buildProfileSummary(profile, { mode });

  return (
    <div className="flex flex-col gap-3">
      {sections.map(({ sectionTitle, chips }) => (
        <div
          key={sectionTitle}
          className="bg-card border border-border rounded-lg px-4 py-4 card-elevated"
        >
          {/* Label de sección — mismo tratamiento que DashboardPanel */}
          <p
            className="font-sans font-medium uppercase text-muted-foreground mb-2"
            style={{ fontSize: 11, letterSpacing: "0.05em" }}
          >
            {sectionTitle}
          </p>

          {chips.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Sin datos</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* CTA de edición */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors w-full text-center pt-1"
        >
          Editar perfil
        </button>
      )}
    </div>
  );
}
