"use client";

/**
 * profile-panel.jsx — Panel lateral con el resumen del perfil del usuario.
 *
 * Un único Card que agrupa las 4 secciones del cuestionario. Cada sección
 * tiene un divider superior (salvo la primera), barra izquierda navy y
 * filas de texto compactas. Sin pill de health score.
 *
 * @param {Object} props
 * @param {Object|null} props.profile      - Objeto de perfil de localStorage (profileData).
 * @param {"direct"|"inverse"} [props.mode="direct"] - Modo del cuestionario.
 * @param {Function} [props.onEdit]        - Callback al pulsar "Editar".
 */

import {
  User,
  Pencil,
} from "lucide-react";
import { buildProfileSummary } from "@/lib/profile/profileSummary";

export function ProfilePanel({ profile, mode = "direct", onEdit }) {
  if (!profile) return null;

  const sections = buildProfileSummary(profile, { mode });

  return (
    <div className="bg-card border border-border rounded-lg card-elevated overflow-hidden">
      {/* Cabecera de identidad */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User size={15} className="text-primary" aria-hidden />
        </div>
        <p
          className="font-sans font-semibold uppercase tracking-meta text-primary flex-1 min-w-0"
          style={{ fontSize: 11 }}
        >
          Tu perfil
        </p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Editar perfil"
            className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil size={12} aria-hidden />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* Secciones — borde izquierdo en primary, filas compactas */}
      {sections.map(({ sectionTitle, chips }, sectionIndex) => (
        <div key={sectionTitle} className="px-4 py-3 border-t border-border/60 first:border-t-0">
          <div className="border-l-2 border-primary pl-3">
            {/* Meta-label de sección */}
            <p
              className="font-semibold uppercase tracking-meta text-muted-foreground mb-1.5"
              style={{ fontSize: 10 }}
            >
              {sectionTitle}
            </p>

            {chips.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Sin datos</p>
            ) : (
              <ul className="flex flex-col gap-0">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="text-xs text-foreground leading-snug py-0.5"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
