"use client";

/**
 * profile-panel.jsx — Panel lateral con el resumen del perfil del usuario.
 *
 * Muestra un card de cabecera (avatar + título + botón editar) seguido de
 * las 4 secciones del cuestionario como filas icono+texto. Diseñado para
 * ocupar col-span-2 en el grid de 12 columnas de PageShell variant="dashboard".
 *
 * @param {Object} props
 * @param {Object|null} props.profile      - Objeto de perfil de localStorage (profileData).
 * @param {"direct"|"inverse"} [props.mode="direct"] - Modo del cuestionario.
 * @param {Function} [props.onEdit]        - Callback al pulsar "Editar".
 * @param {number|null} [props.healthScore] - Puntuación 0–100 de salud financiera (opcional).
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

/**
 * Devuelve variante de color para la pill del health score según el valor.
 * - 75+: success (verde)
 * - 50–74: warning (ámbar)
 * - <50: error (rojo)
 */
function getScoreVariant(score) {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "error";
}

const SCORE_STYLES = {
  success: {
    bg: "var(--success-subtle)",
    color: "var(--success-foreground)",
  },
  warning: {
    bg: "var(--warning-subtle)",
    color: "var(--warning-foreground)",
  },
  error: {
    bg: "oklch(0.97 0.02 25)",
    color: "var(--destructive)",
  },
};

export function ProfilePanel({ profile, mode = "direct", onEdit, healthScore }) {
  if (!profile) return null;

  const sections = buildProfileSummary(profile, { mode });

  const scoreVariant = healthScore != null ? getScoreVariant(healthScore) : null;
  const scoreStyle   = scoreVariant ? SCORE_STYLES[scoreVariant] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Card 1 — Cabecera de identidad */}
      <div className="bg-card border border-border rounded-lg px-4 py-4 card-elevated">
        <div className="flex items-center gap-3">
          {/* Avatar circular */}
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="font-sans font-semibold uppercase tracking-meta text-primary"
              style={{ fontSize: 11 }}
            >
              Tu perfil
            </p>
            {/* Pill de health score — solo si se pasa el valor */}
            {healthScore != null && scoreStyle && (
              <div
                className="inline-flex items-center rounded-full px-2 py-0.5 mt-1"
                style={{
                  backgroundColor: scoreStyle.bg,
                  color: scoreStyle.color,
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                Score {healthScore}/100
              </div>
            )}
          </div>

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
      </div>

      {/* Secciones 2-5 — borde izquierdo en primary, filas compactas */}
      {sections.map(({ sectionTitle, chips }, sectionIndex) => (
        <div
          key={sectionTitle}
          className="border-l-2 border-primary pl-3"
        >
          {/* Meta-label de sección */}
          <p
            className="font-semibold uppercase tracking-meta text-muted-foreground mb-2"
            style={{ fontSize: 10 }}
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
                    className="flex items-start gap-2 py-1"
                  >
                    <span className="text-muted-foreground mt-0.5 flex-shrink-0">
                      <IconComponent size={13} aria-hidden />
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
