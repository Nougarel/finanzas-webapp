/**
 * relevance.js — Utilidad pura M36 Fase 1.
 *
 * Mapea los campos del catálogo (`referenceReliability`, `referenceSource`)
 * a los tokens semánticos del diccionario M36-token-dictionary.md:
 *   - relevance: "THRESHOLD" | "NORMATIVE" | "CONTEXTUAL"
 *   - label: etiqueta legible para el panel
 *   - dots: indicador visual (1-4 puntos rellenos sobre 4)
 *   - sources: array de frases en lenguaje natural (sin siglas crudas)
 *
 * IMPORTANTE: sin lógica de UI, sin importaciones de React, sin efectos.
 * Puede usarse en Server Components y en tests.
 *
 * Fuente del vocabulario: docs/m36/M36-token-dictionary.md §2 y §3.
 */

// ── §2 Mapeo referenceReliability → token de relevance ────────────────────

/**
 * @param {"very_high"|"high"|"medium_high"|"medium"|"low"|"very_low"} reliability
 * @returns {"THRESHOLD"|"NORMATIVE"|"CONTEXTUAL"}
 */
export function getRelevanceToken(reliability) {
  switch (reliability) {
    case "very_high":
    case "high":
      return "THRESHOLD";
    case "medium_high":
    case "medium":
      return "NORMATIVE";
    case "low":
    case "very_low":
    default:
      return "CONTEXTUAL";
  }
}

// ── Etiquetas y puntos por token ────────────────────────────────────────────

const RELEVANCE_CONFIG = {
  THRESHOLD: {
    label: "Umbral de salud financiera",
    // 4 puntos rellenos — máxima relevancia
    filled: 4,
  },
  NORMATIVE: {
    label: "Referencia normativa / financiera",
    // 3 puntos rellenos
    filled: 3,
  },
  CONTEXTUAL: {
    label: "Referencia contextual",
    // 2 puntos rellenos
    filled: 2,
  },
};

/**
 * Devuelve la config de etiqueta y puntos para un token de relevance.
 * @param {"THRESHOLD"|"NORMATIVE"|"CONTEXTUAL"} token
 * @returns {{ label: string, filled: number, total: number }}
 */
export function getRelevanceConfig(token) {
  return { ...RELEVANCE_CONFIG[token] ?? RELEVANCE_CONFIG.CONTEXTUAL, total: 4 };
}

// ── §3 Mapeo de tokens de fuente a frases legibles ──────────────────────────

/**
 * Tabla de detección: subcadena (en minúsculas) → frase legible.
 * Se aplica en orden; la primera coincidencia "gana" para ese token.
 * Una misma fuente puede contener varios tokens separados por " / ".
 */
const SOURCE_TOKEN_MAP = [
  { match: "banco de españa",            phrase: "el Banco de España" },
  { match: "finanzas para todos",        phrase: "el Banco de España" },           // alias institucional
  { match: "eurostat",                   phrase: "la oficina estadística de la Unión Europea (Eurostat)" },
  { match: "ocde",                       phrase: "el marco de la OCDE" },
  { match: "oms",                        phrase: "el umbral de gasto sanitario de la Organización Mundial de la Salud" },
  { match: "directiva ue",              phrase: "la normativa europea de eficiencia energética" },
  { match: "boardman",                   phrase: "la normativa europea de eficiencia energética" },
  { match: "regla 20/4/10",             phrase: "la regla financiera 20/4/10 de compra de vehículo" },
  { match: "ine epf",                    phrase: null },  // distinguido por contexto más abajo
  { match: "ine",                        phrase: null },  // ídem
  { match: "bls consumer",              phrase: "los datos de gasto medio de los hogares" },
  { match: "fidelity",                   phrase: "principios financieros ampliamente aceptados" },
  { match: "pfau",                       phrase: "principios financieros ampliamente aceptados" },
  { match: "bogleheads",                phrase: "principios financieros ampliamente aceptados" },
  { match: "schwab",                    phrase: "principios financieros ampliamente aceptados" },
  { match: "ramsey",                    phrase: "principios financieros ampliamente aceptados" },
  { match: "charles schwab",            phrase: "principios financieros ampliamente aceptados" },
  { match: "deloitte",                   phrase: "estudios de consumo digital" },
  { match: "ley 49/2002",              phrase: "la normativa fiscal española sobre donaciones" },
];

/**
 * Determina si una referenceSource corresponde a uso descriptivo (CONTEXTUAL)
 * o prescriptivo (THRESHOLD/NORMATIVE) del INE.
 * Las fuentes que contienen "(descriptivo)" son siempre descriptivas.
 * @param {string} rawSource
 * @param {"THRESHOLD"|"NORMATIVE"|"CONTEXTUAL"} relevance
 * @returns {string}
 */
function resolveInePhrase(rawSource, relevance) {
  const lower = rawSource.toLowerCase();
  if (lower.includes("descriptivo")) {
    return "los datos del INE sobre el gasto medio observado de los hogares";
  }
  if (relevance === "CONTEXTUAL") {
    return "los datos del INE sobre el gasto medio observado de los hogares";
  }
  return "el organismo oficial de estadística de España (INE)";
}

/**
 * Convierte un string de fuente cruda en un array de frases legibles únicas.
 * Ej: "Banco de España / Finanzas para Todos / Eurostat EU-SILC"
 *     → ["el Banco de España", "la oficina estadística de la Unión Europea (Eurostat)"]
 *
 * @param {string|null} rawSource  — campo referenceSource del catálogo
 * @param {"THRESHOLD"|"NORMATIVE"|"CONTEXTUAL"} relevance
 * @returns {string[]}
 */
export function parseSources(rawSource, relevance) {
  if (!rawSource) return [];

  const lower = rawSource.toLowerCase();
  const phrases = new Set();

  for (const { match, phrase } of SOURCE_TOKEN_MAP) {
    if (!lower.includes(match)) continue;

    // INE: la frase depende del contexto de relevance
    if (match === "ine epf" || match === "ine") {
      phrases.add(resolveInePhrase(rawSource, relevance));
      continue;
    }

    if (phrase) phrases.add(phrase);
  }

  // Si no se reconoció nada, devolver array vacío (no inventar)
  return [...phrases];
}

// ── Función principal de composición ────────────────────────────────────────

/**
 * Devuelve toda la información de relevance y fuentes que necesita el panel.
 *
 * @param {{ referenceReliability: string, referenceSource: string|null }} catEntry
 *   — un elemento de CATEGORIES_CATALOG
 * @returns {{
 *   relevance: "THRESHOLD"|"NORMATIVE"|"CONTEXTUAL",
 *   label: string,
 *   filled: number,
 *   total: number,
 *   sources: string[],
 *   isContextual: boolean
 * }}
 */
export function getRelevanceInfo({ referenceReliability, referenceSource }) {
  const relevance = getRelevanceToken(referenceReliability);
  const config    = getRelevanceConfig(relevance);
  const sources   = parseSources(referenceSource, relevance);

  return {
    relevance,
    label: config.label,
    filled: config.filled,
    total: config.total,
    sources,
    isContextual: relevance === "CONTEXTUAL",
  };
}

// ── Mensaje de flexibilidad (§5 del diccionario) ─────────────────────────────

/**
 * Mensaje estático que acompaña a las categorías CONTEXTUAL.
 * Solo debe mostrarse cuando `isContextual === true`.
 */
export const CONTEXTUAL_FLEXIBILITY_MESSAGE =
  "Estas categorías del bloque deseos son intercambiables entre sí. " +
  "La distribución que proponemos es una guía equilibrada, pero puedes " +
  "redistribuir dentro del bloque según tus prioridades sin afectar a " +
  "la salud financiera del conjunto.";
