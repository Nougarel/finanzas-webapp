// Módulo puro: deriva el resumen del perfil del usuario en 4 secciones con
// labels legibles. Extraído de ProfilePage.jsx (SECTION_QUESTIONS, LABEL_MAP,
// SUMMARY_SECTIONS, renderSummary) para ser consumido por ProfilePanel sin
// duplicar la lógica del cuestionario.
//
// Función pura: no importa React, no accede a localStorage, sin efectos
// secundarios. Recibe el objeto de perfil tal como lo guarda profileData en
// ProfilePage.jsx.

import { PROFILE_COPY } from "@/lib/copy/profileCopy";

// ─── Definición de campos por sección ────────────────────────────────────────
// Réplica reducida de SECTION_QUESTIONS de ProfilePage.jsx: solo { field, value,
// label } por opción, que es lo único que necesita el resumen. Los valores son
// exactamente los que almacena profileData (string | number | boolean).
//
// El atributo `modes` (cuando existe) restringe la visibilidad del campo a una
// lista de modos, igual que en ProfilePage.jsx. Los campos sin `modes` son
// visibles en todos los modos.

const SECTION_FIELDS = [
  // ── Sección 0: Sobre ti ──────────────────────────────────────────────────
  [
    {
      field: "employmentStatus",
      options: [
        { value: "permanent",  label: "Asalariado indefinido" },
        { value: "temporary",  label: "Asalariado temporal o parcial" },
        { value: "freelance",  label: "Autónomo o freelance" },
        { value: "unemployed", label: "Sin ingresos laborales regulares" },
      ],
    },
    {
      field: "ageRange",
      options: [
        { value: "under35", label: "Menos de 35 años" },
        { value: "35to50",  label: "Entre 35 y 50 años" },
        { value: "over50",  label: "Más de 50 años" },
      ],
    },
    {
      field: "dependents",
      options: [
        { value: 0, label: "No tengo dependientes" },
        { value: 1, label: "1 dependiente" },
        { value: 2, label: "2 dependientes" },
        { value: 3, label: "3 dependientes" },
        { value: 4, label: "4 dependientes" },
        { value: 5, label: "5 o más dependientes" },
      ],
    },
  ],

  // ── Sección 1: Tu vivienda ───────────────────────────────────────────────
  [
    {
      field: "housingStatus",
      options: [
        { value: "rent",     label: "Vivo de alquiler" },
        { value: "mortgage", label: "Tengo hipoteca activa" },
        { value: "owned",    label: "Tengo vivienda propia pagada" },
        { value: "family",   label: "Vivo con familia o sin coste" },
      ],
    },
    {
      field: "geographicZone",
      options: [
        { value: "expensive_city", label: "Ciudad con alto coste de vida" },
        { value: "standard",       label: "Ciudad o zona urbana estándar" },
        { value: "rural",          label: "Zona rural o municipio pequeño" },
      ],
    },
  ],

  // ── Sección 2: Movilidad, salud y formación ──────────────────────────────
  [
    {
      field: "vehicleStatus",
      options: [
        { value: "none",       label: "Sin vehículo propio" },
        { value: "owned_paid", label: "Vehículo propio ya pagado" },
        { value: "financed",   label: "Vehículo con préstamo activo" },
        { value: "leasing",    label: "Renting o leasing" },
      ],
    },
    {
      field: "privateHealthInsurance",
      options: [
        { value: "none",     label: "No, solo sanidad pública" },
        { value: "basic",    label: "Sí, complementario básico" },
        { value: "complete", label: "Sí, seguro privado completo" },
      ],
    },
    {
      field: "ownEducation",
      options: [
        { value: "none",       label: "Sin formación activa ahora mismo" },
        { value: "continuous", label: "Formación continua o cursos puntuales" },
        { value: "formal",     label: "Máster, postgrado o carrera" },
      ],
    },
  ],

  // ── Sección 3: Tu ahorro y deuda ─────────────────────────────────────────
  [
    {
      field: "emergencyFundStatus",
      modes: ["direct"], // oculto en modo inverso
      options: [
        { value: "none",     label: "Todavía no tengo" },
        { value: "building", label: "Lo estoy construyendo" },
        { value: "partial",  label: "Parcialmente completado" },
        { value: "complete", label: "Completado o superado" },
      ],
    },
    {
      field: "housingPurchaseGoal",
      options: [
        { value: false, label: "No es un objetivo actual" },
        { value: true,  label: "Sí, es un objetivo activo" },
      ],
    },
    {
      field: "consumerDebt",
      modes: ["direct"], // oculto en modo inverso
      options: [
        { value: "none",   label: "No tengo deudas de consumo" },
        { value: "low",    label: "Sí, a tipo bajo" },
        { value: "medium", label: "Sí, a tipo medio" },
        { value: "high",   label: "Sí, a tipo alto" },
      ],
    },
    {
      field: "pensionRegime",
      options: [
        { value: "social_security", label: "Seguridad Social general" },
        { value: "mutual",          label: "Mutualidad profesional" },
        { value: "none",            label: "No cotizo actualmente" },
      ],
    },
  ],
];

// Mapa { field → { value → label } } para el resumen, construido desde
// SECTION_FIELDS. Equivalente a LABEL_MAP en ProfilePage.jsx.
const LABEL_MAP = (() => {
  const map = {};
  for (const section of SECTION_FIELDS) {
    for (const question of section) {
      map[question.field] = {};
      for (const opt of question.options) {
        map[question.field][opt.value] = opt.label;
      }
    }
  }
  return map;
})();

// Agrupación de campos estándar por sección para el resumen. Equivalente a
// SUMMARY_SECTIONS en ProfilePage.jsx. Los campos condicionales (pareja, hijos,
// cuota de deuda) se añaden aparte en buildProfileSummary.
const SUMMARY_SECTIONS = [
  { sectionIndex: 0, fields: ["employmentStatus", "ageRange", "dependents"] },
  { sectionIndex: 1, fields: ["housingStatus", "geographicZone"] },
  { sectionIndex: 2, fields: ["vehicleStatus", "privateHealthInsurance", "ownEducation"] },
  { sectionIndex: 3, fields: ["emergencyFundStatus", "housingPurchaseGoal", "consumerDebt", "pensionRegime"] },
];

// Devuelve la definición de un campo desde SECTION_FIELDS (o null si no existe).
function findFieldDef(fieldId) {
  for (const section of SECTION_FIELDS) {
    for (const q of section) {
      if (q.field === fieldId) return q;
    }
  }
  return null;
}

// Indica si un campo está visible en el modo actual según su restricción
// `modes`. Equivalente a isFieldVisibleInMode en ProfilePage.jsx.
function isFieldVisibleInMode(fieldDef, currentMode) {
  if (!fieldDef?.modes) return true; // sin restricción = visible en todos los modos
  return fieldDef.modes.includes(currentMode);
}

/**
 * Deriva el resumen del perfil en 4 secciones con sus chips legibles.
 *
 * @param {Object} profile - Objeto de perfil tal como lo guarda profileData en
 *   ProfilePage.jsx (campos string | number | boolean | null).
 * @param {Object} [opts]
 * @param {"direct"|"inverse"} [opts.mode="direct"] - Modo del cuestionario;
 *   determina los títulos de sección y la visibilidad de campos restringidos.
 * @returns {{ sectionTitle: string, chips: string[] }[]} Una entrada por
 *   sección, en orden, con los chips de las respuestas (estándar + condicionales).
 */
export function buildProfileSummary(profile, { mode = "direct" } = {}) {
  const currentMode = mode === "inverse" ? "inverse" : "direct";
  // Los títulos vienen de PROFILE_COPY[mode].sections, igual que en el resumen
  // del cuestionario (copy.sections[sectionIndex].title). Dependen del modo.
  const sectionsCopy = PROFILE_COPY[currentMode].sections;
  const safeProfile = profile ?? {};

  return SUMMARY_SECTIONS.map(({ sectionIndex, fields }) => {
    const chips = [];

    // Chips estándar — excluyendo campos ocultos en el modo actual y sin valor.
    for (const field of fields) {
      if (!isFieldVisibleInMode(findFieldDef(field), currentMode)) continue;
      const value = safeProfile[field];
      if (value === null || value === undefined) continue;
      const label = LABEL_MAP[field]?.[value] ?? String(value);
      chips.push(label);
    }

    // Chips condicionales de la sección 0 (subpreguntas de dependientes).
    if (sectionIndex === 0) {
      if (safeProfile.dependents > 0 && safeProfile.hasPartner === true) {
        chips.push("Incluye pareja");
      }
      if (
        safeProfile.dependents > 0 &&
        safeProfile.hasPartner !== null &&
        safeProfile.hasPartner !== undefined &&
        safeProfile.partnerHasIncome === true
      ) {
        chips.push("Pareja con ingresos");
      }
      if ((safeProfile.childrenAtUniversity ?? 0) > 0) {
        chips.push(`${safeProfile.childrenAtUniversity} en universidad`);
      }
      if ((safeProfile.childrenStudyingAway ?? 0) > 0) {
        chips.push(`${safeProfile.childrenStudyingAway} fuera de casa`);
      }
    }

    // Chip condicional de la sección 3 (cuota de deuda, solo modo directo).
    if (
      sectionIndex === 3 &&
      currentMode === "direct" &&
      safeProfile.monthlyDebtPayment > 0
    ) {
      chips.push(`Cuota deuda: ${safeProfile.monthlyDebtPayment}€/mes`);
    }

    return {
      sectionTitle: sectionsCopy[sectionIndex].title,
      chips,
    };
  });
}
