/**
 * Catálogo global de categorías financieras.
 *
 * 20 categorías organizadas en tres bloques: needs, wants, savings.
 * CATEGORIES_CATALOG es un array para permitir iteración y filtrado en el motor.
 * Los helpers getCategoryById y getCategoriesByIds mantienen la interfaz existente.
 *
 * Campos de cada categoría:
 *   id, label, description         — identidad
 *   block                          — 'needs' | 'wants' | 'savings'
 *   isAnchor                       — porcentaje fijado por el motor (no ajustable por residuo)
 *   isInsurance / isDebt           — marcadores para indicadores transversales
 *   healthyRange { min, max }      — % sobre ingreso neto considerado saludable
 *   alerts { mild, severe, critical } — umbrales de alerta (% sobre ingreso neto)
 *   alertDirection                 — 'above' alerta por exceso | 'below' por defecto
 *   referenceSource                — fuente de los umbrales
 *   referenceReliability           — fiabilidad de la fuente
 *   ineReference                   — dato INE EPF 2024 corregido a ingreso neto (×0.86)
 *   ineWeight                      — peso relativo dentro del bloque deseos (null si no es wants)
 *   examples                       — ejemplos concretos para el usuario
 */

export const CATEGORIES_CATALOG = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE NECESIDADES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "housing",
    label: "Vivienda",
    description: "Alquiler o cuota hipotecaria, comunidad, IBI y mantenimiento del hogar",
    block: "needs",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 3, max: 30 },
    alerts: { mild: 35, severe: 40, critical: 40 },
    alertDirection: "above",
    referenceSource: "Banco de España / Finanzas para Todos / Eurostat EU-SILC",
    referenceReliability: "very_high",
    ineReference: 27.9,
    ineWeight: null,
    examples: ["Alquiler mensual", "Cuota hipotecaria", "Comunidad de propietarios", "IBI", "Seguro del hogar"]
  },

  {
    id: "utilities",
    label: "Suministros",
    description: "Electricidad, gas, agua, internet y telefonía móvil",
    block: "needs",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 4, max: 10 },
    alerts: { mild: 10, severe: 13, critical: null },
    alertDirection: "above",
    referenceSource: "Directiva UE Eficiencia Energética / Umbral Boardman",
    referenceReliability: "medium",
    ineReference: 6.7,
    ineWeight: null,
    examples: ["Factura de luz", "Factura de gas", "Agua", "Internet", "Teléfono móvil"]
  },

  {
    id: "groceries",
    label: "Alimentación",
    description: "Compra en supermercado y mercado para consumo en el hogar",
    block: "needs",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 8, max: 20 },
    alerts: { mild: 20, severe: 25, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 / BLS Consumer Expenditure Survey",
    referenceReliability: "medium",
    ineReference: 13.6,
    ineWeight: null,
    examples: ["Supermercado", "Mercado", "Carnicería", "Frutería"]
  },

  {
    id: "transport",
    label: "Transporte",
    description: "Transporte público, combustible, mantenimiento del vehículo y seguro",
    block: "needs",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 3, max: 18 },
    alerts: { mild: 18, severe: 22, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 / Regla 20/4/10",
    referenceReliability: "medium",
    ineReference: 9.8,
    ineWeight: null,
    examples: ["Abono transporte", "Gasolina", "Seguro del vehículo", "ITV y mantenimiento", "Renting o leasing"]
  },

  {
    id: "health",
    label: "Salud",
    description: "Seguro médico privado, farmacia, dental, óptica y copagos",
    block: "needs",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 1, max: 10 },
    alerts: { mild: 10, severe: 13, critical: null },
    alertDirection: "above",
    referenceSource: "OMS SDG 3.8.2 / INE EPF 2024",
    referenceReliability: "high",
    ineReference: 3.4,
    ineWeight: null,
    examples: ["Seguro médico privado", "Farmacia", "Dentista", "Óptica", "Copagos médicos"]
  },

  {
    id: "education",
    label: "Educación",
    description: "Matrículas, libros, material escolar, cursos y formación continua",
    block: "needs",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 20 },
    alerts: { mild: 20, severe: 25, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024",
    referenceReliability: "very_low",
    ineReference: 1.4,
    ineWeight: null,
    examples: ["Matrícula universitaria", "Libros de texto", "Cursos de idiomas", "Actividades extraescolares", "Máster o postgrado"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE DESEOS — los 8 pesos INE suman 101 por redondeo; el motor normaliza
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "dining_out",
    label: "Restaurantes y bares",
    description: "Cenas fuera, cafeterías, bares y comida a domicilio",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 15 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "low",
    ineReference: 4.7,
    ineWeight: 22,
    examples: ["Restaurantes", "Bares y cafeterías", "Delivery y comida a domicilio"]
  },

  {
    id: "travel",
    label: "Viajes y vacaciones",
    description: "Viajes, vacaciones, hoteles y alojamiento turístico",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 15 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "very_low",
    ineReference: 3.8,
    ineWeight: 17,
    examples: ["Vuelos", "Hoteles", "Apartamentos turísticos", "Paquetes vacacionales"]
  },

  {
    id: "clothing",
    label: "Ropa y calzado",
    description: "Ropa, calzado y complementos para toda la familia",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 10 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "low",
    ineReference: 3.4,
    ineWeight: 16,
    examples: ["Ropa", "Calzado", "Accesorios", "Ropa deportiva"]
  },

  {
    id: "personal_care",
    label: "Belleza y cuidado personal",
    description: "Peluquería, cosmética, perfumería y cuidado personal",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 10 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "very_low",
    ineReference: 3.1,
    ineWeight: 14,
    examples: ["Peluquería", "Cosmética y perfumería", "Productos de higiene premium"]
  },

  {
    id: "entertainment",
    label: "Ocio y entretenimiento",
    description: "Cine, teatro, conciertos, eventos y actividades culturales",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 10 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "low",
    ineReference: 2.2,
    ineWeight: 10,
    examples: ["Cine y teatro", "Conciertos", "Museos", "Parques de atracciones"]
  },

  {
    id: "hobbies",
    label: "Hobbies y deporte",
    description: "Equipamiento deportivo, actividades recreativas y aficiones",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 10 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 (descriptivo)",
    referenceReliability: "very_low",
    ineReference: 2.2,
    ineWeight: 10,
    examples: ["Cuota del gimnasio", "Material deportivo", "Equipamiento para hobbies"]
  },

  {
    id: "subscriptions",
    label: "Suscripciones digitales",
    description: "Streaming, aplicaciones, software y servicios digitales",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 5 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 / Deloitte Digital Media Trends (estimado)",
    referenceReliability: "very_low",
    ineReference: 1.3,
    ineWeight: 6,
    examples: ["Netflix, Spotify, Disney+", "Aplicaciones y software", "Servicios en la nube"]
  },

  {
    id: "gifts",
    label: "Regalos y donaciones",
    description: "Regalos, donaciones a ONGs y ayuda a personas del entorno",
    block: "wants",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 5 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "INE EPF 2024 / Ley 49/2002 (estimado)",
    referenceReliability: "low",
    ineReference: 1.3,
    ineWeight: 6,
    examples: ["Regalos de cumpleaños y navidad", "Donaciones a ONGs", "Ayuda a familia o amigos"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE AHORRO
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "life_insurance",
    label: "Seguro de vida",
    description: "Prima mensual del seguro de vida o seguro vinculado a hipoteca",
    block: "savings",
    isAnchor: false,
    isInsurance: true,
    isDebt: false,
    healthyRange: { min: 0.5, max: 3 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "Charles Schwab / Ramsey Solutions",
    referenceReliability: "low",
    ineReference: null,
    ineWeight: null,
    examples: ["Seguro de vida temporal", "Seguro de vida vinculado a hipoteca"]
  },

  {
    id: "emergency_fund",
    label: "Fondo de emergencia",
    description: "Aportación mensual para alcanzar o mantener el colchón de emergencias",
    block: "savings",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 1, max: 10 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "below",
    referenceSource: "Banco de España / Finanzas para Todos / OCDE",
    referenceReliability: "very_high",
    ineReference: null,
    ineWeight: null,
    examples: ["Cuenta de ahorro líquida", "Depósito a la vista"]
  },

  {
    id: "short_term_savings",
    label: "Ahorro a corto plazo",
    description: "Ahorro para objetivos en menos de 2 años: vacaciones, electrodomésticos, reparaciones",
    block: "savings",
    isAnchor: false,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 2, max: 6 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "below",
    referenceSource: "Fidelity 50/15/5",
    referenceReliability: "medium",
    ineReference: null,
    ineWeight: null,
    examples: ["Ahorro para vacaciones", "Fondo para reparaciones del hogar", "Electrónica y electrodomésticos"]
  },

  {
    id: "long_term_savings",
    label: "Ahorro a largo plazo",
    description: "Ahorro para objetivos a más de 2 años, principalmente entrada de vivienda",
    block: "savings",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 0, max: 15 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "below",
    referenceSource: "Banco de España (normativa LTV 80%)",
    referenceReliability: "medium_high",
    ineReference: null,
    ineWeight: null,
    examples: ["Ahorro para entrada de vivienda", "Cuenta ahorro a largo plazo"]
  },

  {
    id: "investment",
    label: "Inversión y jubilación",
    description: "Aportaciones a planes de pensiones, fondos de inversión y otros vehículos a largo plazo",
    block: "savings",
    isAnchor: true,
    isInsurance: false,
    isDebt: false,
    healthyRange: { min: 4, max: 15 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "below",
    referenceSource: "OCDE Pensions at a Glance 2025 / Wade Pfau (JFP 2011)",
    referenceReliability: "medium_high",
    ineReference: null,
    ineWeight: null,
    examples: ["Plan de pensiones", "Fondo de inversión indexado", "ETFs"]
  },

  {
    id: "debt_extra",
    label: "Amortización extra de deuda",
    description: "Pagos adicionales voluntarios para reducir deuda más rápido de lo pactado",
    block: "savings",
    isAnchor: true,
    isInsurance: false,
    isDebt: true,
    healthyRange: { min: 0, max: 5 },
    alerts: { mild: null, severe: null, critical: null },
    alertDirection: "above",
    referenceSource: "Bogleheads (principio financiero)",
    referenceReliability: "medium",
    ineReference: null,
    ineWeight: null,
    examples: ["Amortización anticipada de hipoteca", "Pago adelantado de préstamo personal"]
  }

];

// ─── Funciones de acceso ──────────────────────────────────────────────────────

/**
 * Obtiene una categoría por su ID. Devuelve null si no existe.
 * @param {string} id
 * @returns {object|null}
 */
export function getCategoryById(id) {
  return CATEGORIES_CATALOG.find((c) => c.id === id) || null;
}

/**
 * Hidrata un array de IDs devolviendo los objetos completos del catálogo.
 * Los IDs desconocidos se omiten silenciosamente.
 * @param {string[]} ids
 * @returns {object[]}
 */
export function getCategoriesByIds(ids) {
  return ids.map((id) => CATEGORIES_CATALOG.find((c) => c.id === id)).filter(Boolean);
}
