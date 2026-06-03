"use client";

/**
 * profile-panel.jsx — Panel lateral con el resumen del perfil del usuario.
 *
 * Muestra un card de cabecera (avatar + título + botón editar) seguido de
 * las 4 secciones del cuestionario como filas icono+texto. Diseñado para
 * ocupar col-span-2 en el grid de 12 columnas de PageShell variant="dashboard".
 *
 * @param {Object} props
 * @param {Object|null} props.profile  - Objeto de perfil de localStorage (profileData).
 * @param {"direct"|"inverse"} [props.mode="direct"] - Modo del cuestionario.
 * @param {Function} [props.onEdit]   - Callback al pulsar "Editar".
 */

import {
  User,
  Pencil,
  Briefcase,
  Calendar,
  Users,
  Home,
  MapPin,
  Car,
  Heart,
  BookOpen,
  PiggyBank,
  Target,
  CreditCard,
  Shield,
  CircleDot,
} from "lucide-react";
import { buildProfileSummary } from "@/lib/profile/profileSummary";

// Iconos por sección (índice de chip → componente icono).
// Si hay más chips que iconos definidos, se usa el último como fallback.
const SECTION_ICONS = [
  // Sección 0 — Sobre ti: empleo, edad, dependientes/pareja (varios)
  [Briefcase, Calendar, Users, Users, Users, Users],
  // Sección 1 — Tu vivienda: vivienda, zona geográfica
  [Home, MapPin],
  // Sección 2 — Movilidad, salud y formación: vehículo, seguro, educación
  [Car, Heart, BookOpen],
  // Sección 3 — Tu ahorro y deuda: fondo emergencia, objetivo vivienda, deuda consumo, pensión, cuota
  [PiggyBank, Target, CreditCard, Shield, CreditCard],
];

/**
 * Devuelve el icono correspondiente a un chip dado su sección e índice.
 * Si el índice supera el array definido, usa el último disponible.
 * Si la sección no está definida, usa CircleDot como genérico.
 */
function getChipIcon(sectionIndex, chipIndex) {
  const icons = SECTION_ICONS[sectionIndex];
  if (!icons || icons.length === 0) return CircleDot;
  return icons[Math.min(chipIndex, icons.length - 1)];
}

export function ProfilePanel({ profile, mode = "direct", onEdit }) {
  if (!profile) return null;

  const sections = buildProfileSummary(profile, { mode });

  return (
    <div className="flex flex-col gap-3">
      {/* Card 1 — Cabecera de identidad */}
      <div className="bg-card border border-border rounded-lg px-4 py-4 card-elevated">
        <div className="flex items-center gap-3">
          {/* Avatar circular */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="font-sans font-medium uppercase text-primary"
              style={{ fontSize: 11, letterSpacing: "0.05em" }}
            >
              Tu perfil
            </p>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil size={12} />
              <span>Editar</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards 2-5 — Secciones con filas icono+texto */}
      {sections.map(({ sectionTitle, chips }, sectionIndex) => (
        <div
          key={sectionTitle}
          className="bg-card border border-border rounded-lg px-4 py-4 card-elevated"
        >
          {/* Label de sección */}
          <p
            className="font-sans font-medium uppercase text-muted-foreground mb-2"
            style={{ fontSize: 11, letterSpacing: "0.05em" }}
          >
            {sectionTitle}
          </p>

          {chips.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Sin datos</p>
          ) : (
            <div className="flex flex-col gap-0">
              {chips.map((chip, chipIndex) => {
                const IconComponent = getChipIcon(sectionIndex, chipIndex);
                return (
                  <div
                    key={chip}
                    className="flex items-start gap-2 py-0.5"
                  >
                    <span className="text-muted-foreground mt-0.5 flex-shrink-0">
                      <IconComponent size={13} />
                    </span>
                    <span className="text-xs text-foreground leading-snug">
                      {chip}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
