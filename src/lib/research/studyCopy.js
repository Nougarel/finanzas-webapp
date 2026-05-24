// src/lib/research/studyCopy.js

/**
 * Textos literales del cuestionario M-D1 — vinculantes (dossier
 * docs/dossier/m18-cuestionario-md1.md). NO reescribir aquí sin
 * editar antes el dossier; cualquier cambio en enums requiere
 * mantener sincronizados los CHECKs de la BBDD.
 */

// ─── Bienvenida (dossier §2) ────────────────────────────────────────────────

export const WELCOME = Object.freeze({
  title: "Estudio sobre un planificador financiero personal",
  paragraphs: [
    "Gracias por participar en este estudio. Vas a probar una herramienta web que te sugiere cómo distribuir tu presupuesto mensual entre 20 categorías de gasto y ahorro. Forma parte de un Trabajo de Fin de Grado en Ingeniería Multimedia en la Universitat de València.",
    "El proceso es el siguiente: primero te haremos unas preguntas breves sobre ti y sobre conceptos financieros generales; después usarás la herramienta libremente; al terminar, te pediremos que valores la experiencia. Todo se hace en esta misma pestaña, sin registro y sin recoger datos personales identificativos.",
    "La duración estimada es de unos 10 minutos. Te recomendamos hacerlo de una sentada y sin prisa.",
  ],
  sincerityNote: {
    leadIn: "Una nota importante:",
    body: "en las preguntas que aparecen a lo largo del estudio, responde lo que realmente piensas o sabes, sin tratar de buscar la respuesta “correcta”. No estamos evaluándote a ti — el objetivo es adaptar la herramienta lo mejor posible a personas como tú, y eso solo es posible si tus respuestas son sinceras.",
  },
  cta: "Empezar",
});

// ─── Consentimiento RGPD (dossier §3) ───────────────────────────────────────

export const CONSENT = Object.freeze({
  title: "Antes de empezar, una nota sobre tus datos",
  paragraphs: [
    "Este estudio recoge respuestas anónimas con fines exclusivamente académicos para un Trabajo de Fin de Grado (Ingeniería Multimedia, ETSE-UV).",
    "Se asigna a tu sesión un identificador técnico interno que permite enlazar tus respuestas entre fases, pero no recogemos tu nombre, correo electrónico, dirección IP ni ningún otro dato que permita identificarte. Tampoco se utilizan cookies de seguimiento ni se comparten los datos con terceros. Los datos se almacenan en Supabase (servidores en la Unión Europea, Frankfurt) y se conservan únicamente durante el periodo de análisis del TFG.",
    "El tratamiento se ampara en el considerando 26 del Reglamento (UE) 2016/679 (RGPD), aplicable a datos seudonimizados sin posibilidad razonable de reidentificación. La participación es voluntaria y puedes cerrar la pestaña en cualquier momento.",
  ],
  checkboxLabel: "He leído lo anterior y acepto participar de forma anónima en este estudio.",
  cta: "Continuar",
});

// ─── Demografía (dossier §4) ────────────────────────────────────────────────

export const AGE_RANGES = Object.freeze([
  { value: "under_25", label: "Menos de 25 años" },
  { value: "25_34", label: "Entre 25 y 34 años" },
  { value: "35_44", label: "Entre 35 y 44 años" },
  { value: "45_54", label: "Entre 45 y 54 años" },
  { value: "55_64", label: "Entre 55 y 64 años" },
  { value: "65_plus", label: "65 años o más" },
]);

export const GENDERS = Object.freeze([
  { value: "male", label: "Hombre" },
  { value: "female", label: "Mujer" },
  { value: "prefer_not_to_say", label: "Prefiero no decirlo" },
]);

export const EDUCATION_LEVELS = Object.freeze([
  { value: "no_formal_education", label: "Sin estudios reglados" },
  { value: "primary", label: "Estudios primarios (EGB, primaria)" },
  { value: "secondary", label: "Estudios secundarios (ESO, bachillerato, FP grado medio)" },
  { value: "higher_secondary", label: "Bachillerato superior o FP grado superior" },
  { value: "university", label: "Estudios universitarios (grado, licenciatura, diplomatura)" },
  { value: "postgraduate", label: "Posgrado (máster, doctorado)" },
]);

export const EMPLOYMENT_STATUSES = Object.freeze([
  { value: "employed_full_time", label: "Asalariado/a a tiempo completo" },
  { value: "employed_part_time", label: "Asalariado/a a tiempo parcial" },
  { value: "self_employed", label: "Autónomo/a o empresario/a" },
  { value: "student", label: "Estudiante" },
  { value: "unemployed", label: "Desempleado/a" },
  { value: "retired", label: "Jubilado/a o pensionista" },
  { value: "homemaker", label: "Dedicado/a a labores del hogar" },
  { value: "unable_to_work", label: "Incapacitado/a para trabajar" },
  { value: "other", label: "Otra situación" },
]);

export const HOUSEHOLD_COMPOSITIONS = Object.freeze([
  { value: "living_alone", label: "Vivo sola/o" },
  { value: "couple_no_children", label: "En pareja, sin hijos" },
  { value: "couple_with_children", label: "En pareja, con hijos a cargo" },
  { value: "single_parent", label: "Familia monoparental con hijos a cargo" },
  { value: "shared_housing", label: "Compartiendo piso (compañeros, no familia)" },
  { value: "with_parents_or_family", label: "Con padres u otros familiares" },
]);

export const DEMOGRAPHICS = Object.freeze({
  title: "Sobre ti",
  intro: "Antes de empezar con la herramienta, cuéntanos brevemente quién eres. Esta información se usa solo para describir el perfil de las personas participantes en el estudio.",
  questions: {
    age_range: {
      label: "¿En qué rango de edad estás?",
      options: AGE_RANGES,
    },
    gender: {
      label: "¿Con qué género te identificas?",
      options: GENDERS,
    },
    education_level: {
      label: "¿Cuál es el nivel de estudios más alto que has completado?",
      options: EDUCATION_LEVELS,
    },
    employment_status: {
      label: "¿Cuál es tu situación laboral actual?",
      helpText: "Si tienes varias situaciones a la vez (por ejemplo, estudias y trabajas a tiempo parcial), elige la que mejor describa tu actividad principal.",
      options: EMPLOYMENT_STATUSES,
    },
    household_composition: {
      label: "¿Cómo describirías la composición de tu hogar?",
      options: HOUSEHOLD_COMPOSITIONS,
    },
    prior_financial_app_use: {
      label: "¿Has usado antes alguna aplicación para llevar tus finanzas personales (presupuesto, ahorro, inversión, etc.)?",
      options: Object.freeze([
        { value: true, label: "Sí" },
        { value: false, label: "No" },
      ]),
    },
  },
  cta: "Continuar al cuestionario financiero",
});

// ─── Pretest: Big Five (dossier §5) ─────────────────────────────────────────

export const PRETEST_INTRO = Object.freeze({
  title: "Cinco preguntas breves sobre conceptos financieros",
  intro: "A continuación te haremos cinco preguntas sobre conceptos financieros generales. No es un examen y los resultados son anónimos. Si alguna respuesta no la sabes, marca la opción “No lo sé” o “No sabe” (donde aparezca); es preferible eso a contestar al azar.",
  cta: "Empezar",
});

/**
 * Big Five — preguntas literales del dossier §5.
 *   - type: "numeric"  → input numérico (no se reporta correcto/incorrecto)
 *   - type: "single"   → radio; cada opción tiene { value, label, correct? }
 *
 * Los identificadores (p0, q1, p0b, q2, q3, q4, q5) coinciden con los steps
 * de PRE_APP_STEPS para que la pantalla genérica pueda parametrizarse.
 */
export const BIG_FIVE_QUESTIONS = Object.freeze({
  p0: {
    type: "numeric",
    label: "Pregunta previa (no puntúa)",
    statement: "Imagine que cinco hermanos reciben un regalo de 1.000 € en total. Si comparten el dinero a partes iguales, ¿cuánto obtendrá cada uno?",
    inputLabel: "Tu respuesta (€)",
    correctValue: 200,
    scoreField: "arithmetic_division_correct",
  },
  q1: {
    type: "single",
    label: "Pregunta 1 — Inflación",
    statement: "Imagine ahora que los cinco hermanos tuvieran que esperar un año para obtener su parte de los 1.000 €, y que la inflación de ese año fuese del 1%. En el plazo de un año serán capaces de comprar:",
    options: [
      { value: "more", label: "Más de lo que podrían comprar hoy con su parte del dinero.", correct: false },
      { value: "same", label: "La misma cantidad.", correct: false },
      { value: "less", label: "Menos de lo que podrían comprar hoy.", correct: true },
    ],
    scoreField: "big_three_q1",
  },
  p0b: {
    type: "numeric",
    label: "Pregunta previa (no puntúa)",
    statement: "Supongamos que ingresa 100 € en una cuenta de ahorro con un interés fijo del 2% anual. En esta cuenta no hay comisiones ni impuestos. Si no hace ningún otro ingreso a esta cuenta ni retira ningún dinero, ¿cuánto dinero habrá en la cuenta al final del primer año, una vez que le paguen los intereses?",
    inputLabel: "Tu respuesta (€)",
    correctValue: 102,
    scoreField: "arithmetic_simple_interest_correct",
  },
  q2: {
    type: "single",
    label: "Pregunta 2 — Interés compuesto",
    statement: "De nuevo, si no hace ningún ingreso ni retira ningún dinero, una vez abonado el pago de intereses, ¿cuánto dinero habrá en la cuenta después de cinco años?",
    options: [
      { value: "more_than_110", label: "Más de 110 euros.", correct: true },
      { value: "exactly_110", label: "Exactamente 110 euros.", correct: false },
      { value: "less_than_110", label: "Menos de 110 euros.", correct: false },
      { value: "cannot_say", label: "Es imposible decirlo con la información dada.", correct: false },
    ],
    scoreField: "big_three_q2",
  },
  q3: {
    type: "single",
    label: "Pregunta 3 — Diversificación del riesgo",
    statement: "Por lo general, es posible reducir el riesgo de invertir en bolsa mediante la compra de una amplia variedad de acciones.",
    options: [
      { value: "true", label: "Verdadero.", correct: true },
      { value: "false", label: "Falso.", correct: false },
      { value: "dont_know", label: "No lo sé.", correct: false },
    ],
    scoreField: "big_three_q3",
  },
  q4: {
    type: "single",
    label: "Pregunta 4 — Tipos de interés y bonos",
    statement: "Si los tipos de interés suben, ¿qué ocurre normalmente con el precio de los bonos?",
    options: [
      { value: "up", label: "Sube.", correct: false },
      { value: "down", label: "Baja.", correct: true },
      { value: "same", label: "Se mantiene igual.", correct: false },
      { value: "no_relation", label: "No hay relación entre el precio de los bonos y los tipos de interés.", correct: false },
      { value: "dont_know", label: "No lo sé.", correct: false },
    ],
    scoreField: "big_five_q4",
  },
  q5: {
    type: "single",
    label: "Pregunta 5 — Hipoteca a 15 vs 30 años",
    statement: "Una hipoteca a 15 años suele exigir cuotas mensuales más altas que una hipoteca a 30 años, pero los intereses totales pagados a lo largo de la vida del préstamo serán menores.",
    options: [
      { value: "true", label: "Verdadero.", correct: true },
      { value: "false", label: "Falso.", correct: false },
      { value: "dont_know", label: "No lo sé.", correct: false },
    ],
    scoreField: "big_five_q5",
  },
});

// Orden de presentación de las preguntas Big Five (coincide con PRE_APP_STEPS).
export const BIG_FIVE_ORDER = Object.freeze(["p0", "q1", "p0b", "q2", "q3", "q4", "q5"]);

// ─── Transición a la app (dossier §5 fin + §6) ─────────────────────────────

export const TRANSITION_TO_APP = Object.freeze({
  title: "Ahora vas a probar la herramienta",
  paragraphs: [
    "Has terminado el cuestionario inicial. Tómate tu tiempo para explorar la herramienta.",
    "Cuando hayas terminado, pulsa el botón “He terminado” para pasar a la valoración final.",
  ],
  flowsListTitle: "Tienes que probar los tres flujos antes de terminar:",
  flowsList: [
    "Cálculo directo",
    "Cálculo inverso",
    "Diagnóstico",
  ],
  cta: "Ir a la herramienta",
});

// ─── Escala Likert (SUS + ad-hoc) ──────────────────────────────────────────

export const LIKERT_SCALE = Object.freeze([
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Ni de acuerdo ni en desacuerdo" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
]);

// ─── SUS (dossier §7) ──────────────────────────────────────────────────────

export const SUS = Object.freeze({
  title: "¿Cómo ha sido la experiencia?",
  intro: "Por favor, valora las siguientes afirmaciones sobre la herramienta que acabas de usar. No hay respuestas correctas o incorrectas: lo que nos interesa es tu impresión sincera. Responde rápido, con la primera reacción que tengas.",
  cta: "Continuar",
});

export const SUS_ITEMS = Object.freeze([
  { id: 1, polarity: "positive", text: "Creo que me gustaría utilizar este sistema con frecuencia." },
  { id: 2, polarity: "negative", text: "Encontré el sistema innecesariamente complejo." },
  { id: 3, polarity: "positive", text: "Pensé que el sistema era fácil de usar." },
  { id: 4, polarity: "negative", text: "Creo que necesitaría el apoyo de un técnico para poder utilizar este sistema." },
  { id: 5, polarity: "positive", text: "Encontré que las diversas funciones del sistema estaban bien integradas." },
  { id: 6, polarity: "negative", text: "Pensé que había demasiada inconsistencia en este sistema." },
  { id: 7, polarity: "positive", text: "Me imagino que la mayoría de la gente aprendería a utilizar este sistema muy rápidamente." },
  { id: 8, polarity: "negative", text: "Encontré el sistema muy incómodo de usar." },
  { id: 9, polarity: "positive", text: "Me sentí muy seguro al utilizar el sistema." },
  { id: 10, polarity: "negative", text: "Necesitaba aprender muchas cosas antes de poder empezar con este sistema." },
]);

// ─── Ad-hoc (dossier §8) ───────────────────────────────────────────────────

export const ADHOC = Object.freeze({
  title: "Sobre las recomendaciones que has recibido",
  intro: "Estas últimas cuatro afirmaciones se refieren específicamente a las recomendaciones de distribución del presupuesto que la herramienta te ha mostrado. Sigue el mismo criterio que en las preguntas anteriores: lo que nos interesa es tu impresión sincera.",
  cta: "Continuar",
});

export const ADHOC_ITEMS = Object.freeze([
  { id: 1, dimension: "comprension", text: "He entendido cómo la herramienta ha calculado las recomendaciones." },
  { id: 2, dimension: "confianza", text: "Confío en los importes que la herramienta me ha sugerido." },
  { id: 3, dimension: "utilidad", text: "Las recomendaciones que he recibido son útiles para mi situación personal." },
  { id: 4, dimension: "intencion", text: "Aplicaría estas recomendaciones a mi presupuesto real." },
]);

// ─── Cualitativo (dossier §9) ──────────────────────────────────────────────

export const QUALITATIVE = Object.freeze({
  title: "¿Algún comentario antes de terminar?",
  intro: "Estas dos preguntas son opcionales. Si no quieres responder, puedes saltarlas pulsando “Continuar” sin escribir nada. Cualquier comentario nos resulta útil para mejorar la herramienta.",
  questions: [
    { id: "positive", label: "¿Qué te ha resultado más útil de la herramienta?", maxLength: 500 },
    { id: "improvement", label: "¿Qué cambiarías o qué te ha resultado confuso?", maxLength: 500 },
  ],
  cta: "Continuar",
});

// ─── Cierre (dossier §10) ──────────────────────────────────────────────────

export const CLOSING = Object.freeze({
  title: "Gracias por participar",
  paragraphs: [
    "Tus respuestas se han registrado correctamente y de forma anónima. Tu participación contribuye directamente a la evaluación de un Trabajo de Fin de Grado de Ingeniería Multimedia en la Universitat de València.",
    "Si te ha interesado la herramienta, puedes seguir explorándola desde la página principal. No hace falta que vuelvas a rellenar el cuestionario.",
  ],
  cta: "Volver al inicio",
});

// ─── Pantalla "He terminado" (dossier §11.5) ───────────────────────────────

export const FINISH_CONFIRM = Object.freeze({
  title: "¿Listo para terminar la prueba?",
  body: "Has probado los tres flujos. A partir de aquí pasarás a la valoración final y no podrás volver a usar la herramienta en esta sesión.",
  cancel: "Seguir probando",
  confirm: "Sí, ir a la valoración",
});

// ─── Mensajes auxiliares (dossier §11) ─────────────────────────────────────

export const MESSAGES = Object.freeze({
  timeoutTitle: "Tu sesión ha caducado",
  timeoutBody: "Han pasado 60 minutos desde que empezaste y la sesión se ha cerrado automáticamente. Si quieres volver a participar, recarga la página y empieza de nuevo.",
  timeoutCta: "Recargar y empezar de nuevo",

  networkError: "No hemos podido guardar tu respuesta por un problema de conexión. Comprueba que tienes internet y vuelve a intentarlo en unos segundos.",
  networkRetry: "Reintentar",

  genericError: "Algo no ha funcionado como esperábamos. Si el problema se repite, cierra la pestaña y vuelve a abrir el enlace.",
  genericRetry: "Reintentar",

  beforeUnload: "Si cierras la pestaña ahora, perderás los datos y tendrás que empezar de nuevo.",

  // Tooltip/texto bajo el botón "He terminado" cuando aún faltan flujos.
  pendingFlowsPrefix: "Te falta probar:",

  // ExistingSessionScreen (no en dossier, decisión consolidada §11.5 / D7).
  existingSessionTitle: "Ya iniciaste el estudio anteriormente",
  existingSessionBody: "¿Quieres continuar donde lo dejaste, o empezar uno nuevo?",
  existingSessionContinue: "Continuar",
  existingSessionRestart: "Empezar de nuevo",
});

// Etiquetas castellano para los flow_type del modo guiado.
export const FLOW_LABELS = Object.freeze({
  direct: "Directo",
  inverse: "Inverso",
  diagnosis: "Diagnóstico",
});
