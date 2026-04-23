/**
 * Catálogo global de categorías de gasto e inversión.
 *
 * Las categorías son datos puros: no conocen React ni Next.js.
 * Cada categoría pertenece a un bloque macro sugerido (suggestedBlock),
 * aunque cada modelo puede asignarlas libremente según su lógica.
 *
 * Estructura de cada categoría:
 *   id            — identificador único
 *   label         — nombre legible para la UI
 *   description   — qué incluye la categoría
 *   suggestedBlock — bloque macro al que pertenece típicamente
 *   examples      — ejemplos concretos para orientar al usuario
 */

// ─── Necesidades ────────────────────────────────────────────────────────────

const housing = {
  id: "housing",
  label: "Vivienda",
  description: "Alquiler o hipoteca mensual",
  suggestedBlock: "needs",
  examples: ["Alquiler del piso", "Cuota hipoteca"]
};

const utilities = {
  id: "utilities",
  label: "Suministros",
  description: "Electricidad, gas, agua e internet",
  suggestedBlock: "needs",
  examples: ["Factura de luz", "Gas", "Internet y móvil"]
};

const groceries = {
  id: "groceries",
  label: "Alimentación",
  description: "Compra del supermercado y alimentación básica del hogar",
  suggestedBlock: "needs",
  examples: ["Supermercado", "Mercado"]
};

const transport = {
  id: "transport",
  label: "Transporte",
  description: "Transporte público y gastos del vehículo propio",
  suggestedBlock: "needs",
  examples: ["Abono transporte", "Gasolina", "Seguro del coche"]
};

const insurance = {
  id: "insurance",
  label: "Seguros",
  description: "Seguros de salud, hogar y vida",
  suggestedBlock: "needs",
  examples: ["Seguro médico", "Seguro del hogar"]
};

const health = {
  id: "health",
  label: "Salud",
  description: "Farmacia, médico y copagos no cubiertos por seguro",
  suggestedBlock: "needs",
  examples: ["Farmacia", "Dentista"]
};

const education = {
  id: "education",
  label: "Educación",
  description: "Matrículas, libros y formación",
  suggestedBlock: "needs",
  examples: ["Matrícula", "Libros", "Cursos"]
};

const debt_minimum = {
  id: "debt_minimum",
  label: "Pagos mínimos de deuda",
  description: "Cuotas mínimas de préstamos y tarjetas",
  suggestedBlock: "needs",
  examples: ["Cuota mínima tarjeta", "Cuota préstamo"]
};

// ─── Deseos ─────────────────────────────────────────────────────────────────

const dining_out = {
  id: "dining_out",
  label: "Restaurantes y bares",
  description: "Cenas fuera, cafeterías y comida a domicilio",
  suggestedBlock: "wants",
  examples: ["Restaurantes", "Cafeterías", "Delivery"]
};

const entertainment = {
  id: "entertainment",
  label: "Ocio y entretenimiento",
  description: "Actividades de tiempo libre y cultura",
  suggestedBlock: "wants",
  examples: ["Cine", "Conciertos", "Museos"]
};

const subscriptions = {
  id: "subscriptions",
  label: "Suscripciones digitales",
  description: "Streaming, música y apps",
  suggestedBlock: "wants",
  examples: ["Netflix", "Spotify", "Amazon Prime"]
};

const travel = {
  id: "travel",
  label: "Viajes y vacaciones",
  description: "Vuelos, hoteles y gastos de viaje",
  suggestedBlock: "wants",
  examples: ["Vuelos", "Hotel", "Airbnb"]
};

const clothing = {
  id: "clothing",
  label: "Ropa y calzado",
  description: "Compras de moda y accesorios",
  suggestedBlock: "wants",
  examples: ["Ropa de temporada", "Zapatillas"]
};

const hobbies = {
  id: "hobbies",
  label: "Hobbies y deporte",
  description: "Aficiones, equipamiento y gimnasio",
  suggestedBlock: "wants",
  examples: ["Gimnasio", "Material de hobbies"]
};

const personal_care = {
  id: "personal_care",
  label: "Belleza y cuidado personal",
  description: "Peluquería, cosmética y bienestar",
  suggestedBlock: "wants",
  examples: ["Peluquería", "Cosmética"]
};

const gifts_donations = {
  id: "gifts_donations",
  label: "Regalos y donaciones",
  description: "Regalos y donaciones a causas",
  suggestedBlock: "wants",
  examples: ["Regalos", "Donaciones ONG"]
};

// ─── Ahorro ─────────────────────────────────────────────────────────────────

const emergency_fund = {
  id: "emergency_fund",
  label: "Fondo de emergencia",
  description: "Colchón equivalente a 3-6 meses de gastos fijos",
  suggestedBlock: "savings",
  examples: ["Cuenta de ahorro de emergencia"]
};

const short_term_savings = {
  id: "short_term_savings",
  label: "Ahorro a corto plazo",
  description: "Objetivos financieros en menos de 2 años",
  suggestedBlock: "savings",
  examples: ["Vacaciones grandes", "Electrodoméstico"]
};

const long_term_savings = {
  id: "long_term_savings",
  label: "Ahorro a largo plazo",
  description: "Objetivos financieros en más de 2 años",
  suggestedBlock: "savings",
  examples: ["Entrada para vivienda", "Coche"]
};

const investment = {
  id: "investment",
  label: "Inversión y jubilación",
  description: "Fondos de inversión y planes de pensiones",
  suggestedBlock: "savings",
  examples: ["Plan de pensiones", "Fondos indexados"]
};

const debt_extra = {
  id: "debt_extra",
  label: "Amortización extra de deuda",
  description: "Pagos adicionales para liquidar deuda antes",
  suggestedBlock: "savings",
  examples: ["Amortización anticipada hipoteca"]
};

// ─── Registro global ─────────────────────────────────────────────────────────

/**
 * Catálogo completo de categorías indexado por ID.
 * Usar esta estructura para búsquedas O(1) por clave.
 */
export const CATEGORIES_CATALOG = {
  housing,
  utilities,
  groceries,
  transport,
  insurance,
  health,
  education,
  debt_minimum,
  dining_out,
  entertainment,
  subscriptions,
  travel,
  clothing,
  hobbies,
  personal_care,
  gifts_donations,
  emergency_fund,
  short_term_savings,
  long_term_savings,
  investment,
  debt_extra
};

/**
 * Obtiene una categoría por su ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getCategoryById(id) {
  return CATEGORIES_CATALOG[id] || null;
}

/**
 * Hidrata un array de IDs devolviendo los objetos completos del catálogo.
 * Los IDs desconocidos se omiten silenciosamente.
 * @param {string[]} ids
 * @returns {object[]}
 */
export function getCategoriesByIds(ids) {
  return ids.map((id) => CATEGORIES_CATALOG[id]).filter(Boolean);
}
