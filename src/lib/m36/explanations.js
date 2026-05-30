/**
 * explanations.js — Módulo puro M36 Fase 2b.
 *
 * Contiene la matriz completa de bullets categoría×driver, fielmente copiada
 * de docs/m36/M36-token-dictionary.md §5, y la función de lookup que devuelve
 * los bullets listos para renderizar dados (catId, drivers[], profile).
 *
 * IMPORTANTE:
 *   - Sin React, sin DOM, sin fetch. Apto para Server Components y tests.
 *   - No expone ningún número del motor (porcentajes, pesos, deltas, targets).
 *   - Solo bullets cualitativos y traducciones de valores de perfil.
 *
 * Fuente de verdad: docs/m36/M36-token-dictionary.md §5 y §6.
 */

// ── Tabla de etiquetas legibles por valor crudo de perfil (§5, al final) ──────
// Usada para interpolar plantillas con {etiqueta} y para seleccionar variantes.

const PROFILE_LABELS = {
  housingStatus: {
    rent:        'alquiler',
    mortgage:    'hipoteca',
    owned:       'propiedad sin deuda',
    family:      'vivienda cedida o familiar',
  },
  geographicZone: {
    expensive_city: 'zona cara',
    rural:          'zona rural',
  },
  vehicleStatus: {
    none:       'sin vehículo',
    owned_paid: 'en propiedad',
    financed:   'financiado',
    leasing:    'en leasing',
  },
  ageRange: {
    under35: 'menos de 35 años',
    '35to50': 'entre 35 y 50',
    over50:  'más de 50 años',
  },
  privateHealthInsurance: {
    basic:    'seguro básico',
    complete: 'seguro completo',
  },
  ownEducation: {
    continuous: 'formación continua',
    formal:     'estudios formales',
  },
  emergencyFundStatus: {
    none:     'sin fondo',
    building: 'construyéndolo',
    partial:  'parcial',
    complete: 'completo',
  },
  employmentStatus: {
    permanent: 'indefinido',
    temporary: 'temporal',
    freelance: 'autónomo',
  },
  pensionRegime: {
    mutual: 'mutualidad profesional',
    none:   'sin régimen de cotización',
  },
  consumerDebt: {
    low:    'baja',
    medium: 'media',
    high:   'alta',
  },
};

// ── Bullets de "Referencia institucional" (§5, patrón "Referencia institucional")
// Presentes siempre para las categorías que los tienen, independientemente
// de los drivers. La lista cerrada está explicitada en §5:
// vivienda, suministros, transporte, salud, fondo de emergencia, inversión.
// (El plan menciona también jubilación, que en el catálogo es 'investment'.)

const INSTITUTIONAL_BULLETS = {
  housing: {
    label: 'Referencia institucional',
    text: 'El Banco de España fija un máximo del 30-35% del ingreso neto destinado a vivienda (hipoteca o alquiler, comunidad y suministros vinculados). El cálculo orienta tu margen dentro de ese rango.',
  },
  utilities: {
    label: 'Referencia institucional',
    text: 'La Comisión Europea define "pobreza energética" como dedicar por encima del 10% del ingreso del hogar a suministros. El cálculo orienta tu margen claramente por debajo de ese umbral.',
  },
  transport: {
    label: 'Referencia institucional',
    text: 'La regla financiera 20/4/10 sugiere no destinar más del 10% del ingreso mensual a transporte (combustible, mantenimiento, seguro y cuota si la hay). El cálculo orienta tu margen alrededor de ese referente.',
  },
  health: {
    label: 'Referencia institucional',
    text: 'La OMS define como "gasto sanitario catastrófico" cualquier desembolso por encima del 10% del ingreso del hogar. El cálculo orienta tu margen claramente por debajo de ese umbral.',
  },
  emergency_fund: {
    label: 'Referencia institucional',
    text: 'El Banco de España recomienda mantener entre 3 y 6 meses de gastos esenciales como fondo de emergencia, con rangos más amplios para situaciones laborales menos estables. El cálculo de esta categoría apunta hacia ese rango según tu fase actual y tu perfil profesional, considerando que es uno de los pilares de la salud financiera personal.',
  },
  investment: {
    label: 'Referencia institucional',
    text: 'La OCDE y consultoras financieras como Wade Pfau o Fidelity coinciden en recomendar dedicar entre el 10% y el 15% del ingreso a la jubilación para mantener un nivel de vida razonable tras retirarse. El cálculo orienta tu inversión hacia ese rango ajustando por tu edad, régimen y estabilidad, considerando que es uno de los pilares estructurales de la salud financiera a largo plazo.',
  },
};

// ── Matriz de bullets por categoría × driver (§5 completo) ────────────────────
//
// Estructura:
//   DRIVER_BULLETS[catId][driverToken] =
//     | { label, text }                       → bullet único (sin variante)
//     | { label, variants: { valor: text } }  → selección por valor de perfil
//
// Los textos con {N} se interpolan en la función de lookup.
// Los textos con {etiqueta} se rellenan desde PROFILE_LABELS.

const DRIVER_BULLETS = {

  // ── VIVIENDA ────────────────────────────────────────────────────────────────
  housing: {
    HOUSING_STATUS: {
      label: 'Tu situación de vivienda',
      variants: {
        rent:        'Tu vivienda en alquiler: gasto mensual con perfil de riesgo propio (subidas de mercado, movimientos del propietario). El Banco de España publica referencias específicas y el cálculo parte de la que aplica.',
        mortgage:    'Tu vivienda con hipoteca: carga mensual estructural durante años. Los criterios del Banco de España incluyen el ratio de endeudamiento (DTI) y orientan el margen aplicado.',
        owned:       'Tu propiedad sin deuda libera la mayor parte del presupuesto que en otros casos absorbe la vivienda. Se reserva una parte para mantenimiento, comunidad e IBI.',
        family:      'Tu vivienda cedida (o sin gasto directo en vivienda) libera el margen que normalmente absorbe esta categoría. Se reserva una parte mínima por si aparecen gastos puntuales.',
      },
    },
    GEOGRAPHIC_ZONE: {
      label: 'Tu zona geográfica',
      variants: {
        expensive_city: 'Vives en una zona cara (gran ciudad o área metropolitana). Eurostat e INE documentan precios sensiblemente por encima de la media nacional, así que el margen se ajusta al alza.',
        rural:          'Vives en una zona rural: el coste de la vivienda baja respecto a la media nacional, en línea con los datos del INE. El margen se ajusta a la baja.',
      },
    },
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes aumenta la necesidad habitacional. El ajuste no es lineal: el peso sube más cuando el hogar exige más cuartos (no es lo mismo dos personas compartiendo que cuatro).',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, la vivienda absorbe una parte mayor del presupuesto a ingresos bajos y proporcionalmente menos a ingresos altos. El cálculo escala el margen según tu tramo.',
    },
  },

  // ── SUMINISTROS ─────────────────────────────────────────────────────────────
  utilities: {
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes en casa eleva el consumo de luz, agua caliente, horas de calefacción y dispositivos conectados a la vez. El cálculo añade un margen por persona sin asumir duplicación: parte del consumo es estructural y se comparte (nevera, termo, calefacción central).',
    },
    EMPLOYMENT: {
      label: 'Tu actividad laboral',
      text: 'Como autónomo es habitual pasar más horas en casa, con efecto directo en luz, climatización, internet y electricidad para equipos. El cálculo añade un margen específico que no aplica a una jornada fuera del hogar.',
    },
    GEOGRAPHIC_ZONE: {
      label: 'Tu zona geográfica',
      text: 'Vives en una zona rural y los suministros suelen encarecerse: acceso limitado a gas ciudad (gasóleo, butano o pellets son más caros), agua de depósito o pozo con mantenimiento propio, internet rural más caro y peor. El cálculo refleja ese sobrecoste estructural.',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, los suministros son un gasto inelástico (la nevera y el termo se mantienen aunque baje el ingreso), así que pesan más en proporción a ingresos bajos. A ingresos altos crece el consumo (climatización, dispositivos, tarifas premium) pero el peso relativo baja. El cálculo lo refleja siguiendo la elasticidad de la EPF del INE.',
    },
  },

  // ── ALIMENTACIÓN ─────────────────────────────────────────────────────────────
  groceries: {
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes incrementa la base de alimentación, pero no se duplica con cada persona: parte del gasto se comparte (compras a granel, comidas conjuntas, aprovechamiento de ingredientes). Lo documenta la OCDE en su metodología de equivalencia de hogares.',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, la alimentación absorbe una parte mayor del presupuesto a ingresos bajos (es de las primeras necesidades) y pesa menos en proporción a ingresos altos, aunque la cifra absoluta tienda a crecer. Es la ley de Engel, observable en la EPF del INE.',
    },
  },

  // ── TRANSPORTE ──────────────────────────────────────────────────────────────
  transport: {
    VEHICLE: {
      label: 'Tu situación de vehículo',
      variants: {
        none:       'No tienes vehículo propio: la base parte baja. Sin gastos fijos de combustible, mantenimiento ni seguro, solo transporte público y servicios bajo demanda. Se reserva margen para ellos.',
        owned_paid: 'Tu vehículo en propiedad sin deuda: el cálculo contempla los gastos sostenidos (combustible, mantenimiento, seguro, ITV, impuestos), sin cuotas mensuales que sumen carga.',
        financed:   'Tu vehículo financiado: cuota mensual sobre el margen sostenido (combustible, mantenimiento, seguro). El Banco de España considera ambos componentes al evaluar el peso del transporte.',
        leasing:    'Tu vehículo en leasing: coste fijo mensual que normalmente incluye mantenimiento y seguro. El cálculo lo trata como gasto estructural durante el contrato.',
      },
    },
    GEOGRAPHIC_ZONE: {
      label: 'Tu zona geográfica',
      text: 'Vives en una zona rural donde el transporte público es limitado o inexistente, así que el vehículo deja de ser opcional para ser infraestructura cotidiana (trabajo, compras, sanidad). El cálculo refleja esa dependencia con un margen mayor.',
    },
    EMPLOYMENT: {
      label: 'Tu actividad laboral',
      text: 'Como autónomo con viajes profesionales habituales, sumas costes recurrentes de desplazamiento (combustible, peajes, kilometraje, mantenimiento por uso intensivo) que una jornada de oficina no tiene. El cálculo añade un margen específico.',
    },
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes incrementa el uso del transporte (rutas al colegio, extraescolares, desplazamientos coordinados): más personas y también más viajes simultáneos. El cálculo lo contempla.',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, el transporte es una necesidad rígida a ingresos bajos (llegar al trabajo es innegociable, y el coste pesa más en proporción) y baja en peso relativo a ingresos altos aunque las opciones se amplíen. El cálculo lo refleja según la EPF del INE.',
    },
  },

  // ── SALUD ────────────────────────────────────────────────────────────────────
  health: {
    AGE: {
      label: 'Tu edad',
      variants: {
        under35: 'A tu edad (menos de 35) la salud suele requerir un margen modesto (revisiones de rutina, alguna especialidad puntual, prevención). La base parte baja, en línea con los patrones de uso que documenta el INE en la EPF.',
        '35to50': 'En tu rango de edad (35 a 50) la salud empieza a pesar más (revisiones más frecuentes, prevención de crónicos, posibles tratamientos puntuales). La base se ajusta al alza, observada en los datos sanitarios por tramo de edad.',
        over50:  'A tu edad (más de 50) la salud requiere un margen claramente mayor (medicación sostenida, más visitas, dental y óptica más frecuentes, prevención de crónicos). La base se eleva alineada con los datos del INE sobre gasto sanitario por edad.',
      },
    },
    HEALTH_INSURANCE: {
      label: 'Tu seguro médico privado',
      variants: {
        basic:    'Tu seguro médico privado básico: prima mensual recurrente más copagos puntuales. El cálculo lo incluye como gasto estructural.',
        complete: 'Tu seguro médico privado completo: prima mensual más alta a cambio de menos copagos. El cálculo incorpora esa carga sostenida.',
      },
    },
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes amplía el margen sanitario. Cada persona aporta revisiones, vacunas, dental, óptica y posibles imprevistos. El cálculo lo contempla sin asumir réplica exacta por cabeza.',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, la salud se ajusta de forma matizada: a ingresos altos crece el gasto en sanidad privada, dental, óptica y servicios fuera del sistema público; a ingresos bajos esos opcionales se reducen. El efecto es menor que en otras categorías por el carácter universal del sistema sanitario público español. El INE lo documenta en la EPF.',
    },
  },

  // ── EDUCACIÓN ────────────────────────────────────────────────────────────────
  education: {
    OWN_EDUCATION: {
      label: 'Tu formación propia',
      variants: {
        continuous: 'Tu formación continua en curso (cursos, idiomas, certificaciones): gasto sostenido para mantenerse al día profesionalmente. El cálculo reserva un colchón realista.',
        formal:     'Tus estudios formales en curso (grado, máster, doctorado): matrícula, tasas, materiales y posibles desplazamientos suman una carga sostenida durante todo el curso. Margen claramente mayor que con formación continua.',
      },
    },
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} hijos amplía el margen educativo: materiales, libros, uniformes, comedor, extraescolares y, en muchos casos, refuerzos o academias. El cálculo no asume coste idéntico por hijo (parte del material se aprovecha en familia).',
    },
    CHILDREN_AT_UNIVERSITY: {
      label: 'Hijos en formación universitaria viviendo en casa',
      text: 'Tienes {N} hijos universitarios viviendo en casa: matrícula, tasas, libros y materiales específicos suman al gasto educativo previo. El peso es claramente superior al escolar, aunque sin la carga de movilidad fuera del hogar.',
    },
    CHILDREN_STUDYING_AWAY: {
      label: 'Hijos estudiando fuera del hogar',
      text: 'Tienes {N} hijos estudiando fuera del hogar: además de matrícula, tasas y materiales, se suma una segunda economía doméstica (alquiler o residencia, manutención, transporte interurbano). Es uno de los modificadores más fuertes del bloque.',
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, la educación se mueve en dos direcciones: a ingresos altos crece el gasto en escolarización privada o concertada, idiomas, refuerzos y actividades enriquecedoras (música, deporte, viajes culturales); a ingresos bajos el sistema público cubre la necesidad básica y el margen baja. El INE lo refleja en la EPF.',
    },
  },

  // ── SEGURO DE VIDA ───────────────────────────────────────────────────────────
  life_insurance: {
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tener {N} dependientes a cargo es la razón económica principal para contratar un seguro de vida: si te ocurriese algo, tu hogar perdería tus ingresos pero seguiría teniendo gastos. El cálculo eleva el margen para reservar prima suficiente y garantizar una cobertura realista para los que dependen de ti.',
    },
    HOUSING_STATUS: {
      label: 'Tu situación de vivienda',
      variants: {
        mortgage: 'Tu vivienda con hipoteca añade peso a esta categoría. Es habitual contratar un seguro de vida vinculado a la hipoteca (muchos bancos lo exigen como condición de financiación), porque cubre el saldo pendiente del préstamo si te ocurre algo y evita que tu familia se quede sin vivienda. El cálculo reserva margen para esa prima específica.',
      },
    },
    AGE: {
      label: 'Tu edad',
      variants: {
        over50: 'A partir de los 50 años las primas de seguro de vida suben significativamente: las aseguradoras incorporan el riesgo actuarial creciente en sus tarifas, y mantener una cobertura comparable a edades anteriores cuesta más. El cálculo ajusta el margen al alza para reflejar esa realidad del mercado asegurador.',
      },
    },
    INCOME_TIER: {
      label: 'Tu tramo de ingreso',
      text: 'En tu tramo de ingreso, el seguro de vida adapta la cobertura. A mayores ingresos tu hogar dependería de una cifra mayor si te faltaras, así que el capital asegurado crece (y con él la prima), aunque proporcionalmente al presupuesto total el peso suele mantenerse moderado. A ingresos más bajos la cobertura básica es la prioridad y el margen baja.',
    },
  },

  // ── FONDO DE EMERGENCIA ──────────────────────────────────────────────────────
  emergency_fund: {
    EMERGENCY_PHASE: {
      label: 'Tu fase del fondo',
      variants: {
        none:     'La construcción de un fondo de emergencia es ahora una prioridad absoluta. Sin colchón ante imprevistos (pérdida de empleo, gasto médico inesperado, avería grave), cualquier sacudida puede empujarte a la deuda. El cálculo dedica un porcentaje sustancial del presupuesto a esta categoría hasta que alcances un nivel funcional.',
        building: 'Estás construyendo activamente tu fondo de emergencia. El cálculo mantiene un peso elevado en esta categoría para que avances rápido hacia un colchón sólido, idealmente alcanzable en pocos meses según tu ingreso y gastos.',
        partial:  'Tu fondo de emergencia está parcialmente formado. La prioridad baja respecto a quien empieza desde cero, pero conviene seguir aportando para llegar al rango recomendado. El cálculo asigna un margen moderado de mantenimiento incremental.',
        complete: 'Tu fondo de emergencia está completo. Llegados a este punto solo necesitas mantenerlo y compensar la inflación; el cálculo reserva un margen mínimo y libera el resto para otros bloques (inversión, vivienda, ahorro a otros plazos).',
      },
    },
    EMPLOYMENT: {
      label: 'Tu estabilidad laboral',
      // La plantilla usa la etiqueta legible del valor de perfil
      text: 'Tu estabilidad laboral ({EMPLOYMENT_LABEL}) condiciona los meses de gasto que conviene tener guardados. Una jornada indefinida permite un colchón más ajustado; el trabajo temporal o autónomo requiere reservas más amplias por la mayor variabilidad de ingresos y menor protección ante el desempleo. El cálculo ajusta el objetivo del fondo en consecuencia.',
    },
    PARTNER_INCOME: {
      label: 'Ingresos de tu pareja',
      text: 'Tu pareja aporta ingresos propios al hogar, lo que reduce ligeramente el ritmo necesario para terminar de construir el fondo. Un hogar de doble ingreso tiene mayor resiliencia ante una pérdida laboral (uno de los dos sigue aportando), así que el colchón compartido no necesita acumularse con la misma urgencia. El cálculo refleja ese matiz.',
    },
  },

  // ── AHORRO A CORTO PLAZO ─────────────────────────────────────────────────────
  short_term_savings: {
    HOUSEHOLD_SIZE: {
      label: 'Composición de tu hogar',
      text: 'Tu hogar con {N} dependientes amplía la importancia del ahorro a corto plazo. Las familias afrontan más imprevistos no catastróficos pero recurrentes (electrodomésticos averiados, reparaciones del coche, vacaciones más caras, gastos escolares puntuales) que un hogar individual. El cálculo añade un margen para que tengas liquidez disponible sin tener que tocar el fondo de emergencia ni recurrir a deuda.',
    },
  },

  // ── AHORRO A LARGO PLAZO ─────────────────────────────────────────────────────
  long_term_savings: {
    HOUSING_GOAL: {
      label: 'Tu objetivo de vivienda',
      text: 'Tienes como objetivo comprar vivienda en los próximos años. Es una decisión que multiplica el peso del ahorro a largo plazo: la entrada típica para una hipoteca en España ronda el 20-30% del precio del inmueble, sumados impuestos de transmisión, notaría, registro y posibles reformas. El cálculo destina un margen significativo a este bloque para que avances de forma realista hacia esa meta sin sacrificar tu salud financiera presente.',
    },
  },

  // ── INVERSIÓN Y JUBILACIÓN ───────────────────────────────────────────────────
  investment: {
    AGE: {
      label: 'Tu edad',
      variants: {
        under35: 'A tu edad la inversión y la jubilación tienen el horizonte temporal más amplio posible, que es la mayor ventaja para construir capital. El interés compuesto trabaja a tu favor durante décadas, así que aportaciones modestas pero constantes ahora valen muchísimo más que aportaciones grandes empezadas tarde. El cálculo arranca con un peso moderado pero firme.',
        '35to50': 'En tu rango de edad la inversión pesa más en el cálculo. Sigues con un horizonte temporal favorable, pero el tiempo restante hasta la jubilación se acorta, y conviene acelerar las aportaciones para compensar etapas anteriores en las que quizá ahorraste menos. El cálculo eleva el margen reflejando esa urgencia creciente.',
        over50:  'A partir de los 50 las aportaciones a la jubilación cobran máxima prioridad. El horizonte temporal restante es menor, las decisiones que tomes ahora tendrán impacto directo en tu calidad de vida tras retirarte, y conviene aprovechar las deducciones fiscales del último tramo profesional. El cálculo destina la asignación más alta de las tres etapas.',
      },
    },
    PENSION_REGIME: {
      label: 'Tu régimen de cotización',
      // La plantilla usa la etiqueta legible del valor de pensionRegime
      text: 'Cotizas en un régimen distinto al de la Seguridad Social ({PENSION_REGIME_LABEL}). Las pensiones futuras serán más bajas o directamente inexistentes en comparación con el régimen general, así que la responsabilidad de cubrir tu jubilación recae más sobre el ahorro privado. El cálculo eleva el margen de inversión para compensar esa menor cobertura institucional.',
    },
    EMPLOYMENT: {
      label: 'Tu estabilidad laboral',
      // La plantilla usa la etiqueta legible del valor de employmentStatus
      text: 'Tu actividad como {EMPLOYMENT_LABEL} dentro de la Seguridad Social acumula menos años de cotización efectiva en promedio (los contratos temporales tienen interrupciones; los autónomos suelen cotizar por bases mínimas). La pensión pública resultante será probablemente menor que la de un trabajador indefinido equivalente, así que el cálculo añade un margen extra a la inversión privada para reducir esa brecha.',
    },
  },

  // ── AMORTIZACIÓN EXTRA DE DEUDA ──────────────────────────────────────────────
  debt_extra: {
    DEBT: {
      label: 'Tu nivel de deuda de consumo',
      // La plantilla usa la etiqueta legible del valor de consumerDebt
      text: 'Tienes deuda de consumo {DEBT_LABEL} (tarjetas, préstamos personales, financiación de bienes duraderos). El cálculo reserva un margen para amortizaciones extra: pagar más de lo pactado cada mes reduce los intereses totales del préstamo, acorta el plazo y libera tu presupuesto antes. A mayor nivel de deuda, mayor es el margen recomendado para acelerar la salida.',
    },
  },
};

// ── Función auxiliar: resolver un bullet dado el driver y el perfil ────────────

/**
 * Dado un token de driver y el objeto de perfil, devuelve { label, text } o null.
 *
 * Gestión de casos:
 *   - Si el bullet tiene `variants`, elige la variante según el campo del perfil.
 *   - Si el bullet tiene `text`, lo usa directamente.
 *   - Interpola {N}, {EMPLOYMENT_LABEL}, {PENSION_REGIME_LABEL}, {DEBT_LABEL}.
 *   - Si no hay variante que coincida con el valor del perfil, devuelve null
 *     (en lugar de crashear) y avisa por consola.
 *
 * @param {string} catId
 * @param {string} driverToken
 * @param {object} profile
 * @returns {{ label: string, text: string } | null}
 */
function resolveBullet(catId, driverToken, profile) {
  const catBullets = DRIVER_BULLETS[catId];
  if (!catBullets) return null;

  const bulletDef = catBullets[driverToken];
  if (!bulletDef) return null;

  let rawText;

  if (bulletDef.variants) {
    // Determinar qué campo del perfil controla la variante para este driver
    const variantKey = getVariantProfileKey(catId, driverToken);
    const profileValue = variantKey ? profile[variantKey] : null;

    if (profileValue == null || !bulletDef.variants[profileValue]) {
      // Valor ausente o sin variante → omitir y avisar
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[M36 explanations] Sin variante para ${catId}/${driverToken} ` +
          `con valor "${profileValue}" (campo: ${variantKey}). Bullet omitido.`
        );
      }
      return null;
    }

    rawText = bulletDef.variants[profileValue];
  } else {
    rawText = bulletDef.text;
  }

  // Interpolación de valores
  const text = interpolate(rawText, profile);

  return { label: bulletDef.label, text };
}

/**
 * Mapea (catId, driverToken) al campo del perfil que controla la selección
 * de variante. Solo los drivers que tienen `variants` necesitan este mapeo.
 *
 * @param {string} catId
 * @param {string} driverToken
 * @returns {string|null}
 */
function getVariantProfileKey(catId, driverToken) {
  const map = {
    // housing
    'housing/HOUSING_STATUS':       'housingStatus',
    'housing/GEOGRAPHIC_ZONE':      'geographicZone',
    // utilities — GEOGRAPHIC_ZONE dispara solo si rural, pero el texto no
    // tiene variante: es texto único. No se necesita aquí.
    // transport
    'transport/VEHICLE':            'vehicleStatus',
    // health
    'health/AGE':                   'ageRange',
    'health/HEALTH_INSURANCE':      'privateHealthInsurance',
    // education
    'education/OWN_EDUCATION':      'ownEducation',
    // life_insurance
    'life_insurance/HOUSING_STATUS': 'housingStatus',
    'life_insurance/AGE':            'ageRange',
    // emergency_fund
    'emergency_fund/EMERGENCY_PHASE': 'emergencyFundStatus',
    // investment
    'investment/AGE':               'ageRange',
  };
  return map[`${catId}/${driverToken}`] ?? null;
}

/**
 * Sustituye los placeholders de texto:
 *   {N}                  → profile.dependents (entero)
 *   {EMPLOYMENT_LABEL}   → etiqueta legible de employmentStatus
 *   {PENSION_REGIME_LABEL} → etiqueta legible de pensionRegime
 *   {DEBT_LABEL}         → etiqueta legible de consumerDebt
 *
 * Casos especiales:
 *   CHILDREN_AT_UNIVERSITY: {N} = childrenAtUniversity - childrenStudyingAway
 *   CHILDREN_STUDYING_AWAY: {N} = childrenStudyingAway
 *   (resueltos antes de llamar a interpolate, por eso {N} ya lleva el valor correcto)
 *
 * @param {string} text
 * @param {object} profile
 * @returns {string}
 */
function interpolate(text, profile) {
  return text
    .replace('{N}', profile.__interpolatedN ?? profile.dependents ?? 0)
    .replace(
      '{EMPLOYMENT_LABEL}',
      PROFILE_LABELS.employmentStatus[profile.employmentStatus] ?? profile.employmentStatus ?? ''
    )
    .replace(
      '{PENSION_REGIME_LABEL}',
      PROFILE_LABELS.pensionRegime[profile.pensionRegime] ?? profile.pensionRegime ?? ''
    )
    .replace(
      '{DEBT_LABEL}',
      PROFILE_LABELS.consumerDebt[profile.consumerDebt] ?? profile.consumerDebt ?? ''
    );
}

// ── Función pública de lookup ─────────────────────────────────────────────────

/**
 * Dado (catId, drivers, profile), devuelve los bullets listos para renderizar.
 *
 * Orden de salida:
 *   1. Bullets por driver (en el orden en que llegan del motor).
 *   2. Bullet de Referencia institucional (si existe para esta categoría).
 *
 * Rationale del orden: los bullets de perfil contextualizan el "por qué"
 * personal de la asignación; la Referencia institucional cierra anclando
 * esa asignación a un marco externo de salud financiera. Ese orden —personal
 * primero, institucional al final— tiene más coherencia narrativa que el orden
 * inverso.
 *
 * @param {string} catId    — ID de la categoría (ej. "housing")
 * @param {string[]} drivers — Tokens de drivers emitidos por el motor
 * @param {object} profile  — Perfil del usuario (de localStorage)
 * @returns {Array<{ label: string, text: string }>}
 */
export function getDriverBullets(catId, drivers, profile) {
  if (!catId || !profile) return [];

  const bullets = [];

  // Si no hay drivers (bloque deseos o categorías sin modificadores),
  // devolver vacío. El panel mostrará el mensaje de flexibilidad de Fase 1.
  if (!drivers || drivers.length === 0) {
    return [];
  }

  for (const driverToken of drivers) {
    // Casos especiales de interpolación de {N}
    let enrichedProfile = profile;

    if (driverToken === 'CHILDREN_AT_UNIVERSITY') {
      const childrenStudyingAway = profile.childrenStudyingAway ?? 0;
      const childrenAtUni = profile.childrenAtUniversity ?? 0;
      enrichedProfile = {
        ...profile,
        __interpolatedN: Math.max(0, childrenAtUni - childrenStudyingAway),
      };
    } else if (driverToken === 'CHILDREN_STUDYING_AWAY') {
      enrichedProfile = {
        ...profile,
        __interpolatedN: profile.childrenStudyingAway ?? 0,
      };
    }
    // Para HOUSEHOLD_SIZE en education, {N} debe ser el total de hijos (no dependientes).
    // El diccionario usa "hijos" explícitamente. Usamos dependents - 1 (pareja) si hasPartner.
    else if (driverToken === 'HOUSEHOLD_SIZE' && catId === 'education') {
      const hasPartner = profile.hasPartner ?? false;
      const adultDependents = hasPartner ? 1 : 0;
      const totalChildren = Math.max(0, (profile.dependents ?? 0) - adultDependents);
      enrichedProfile = { ...profile, __interpolatedN: totalChildren };
    }

    const bullet = resolveBullet(catId, driverToken, enrichedProfile);
    if (bullet) {
      bullets.push(bullet);
    }
  }

  // Bullet de Referencia institucional al final (si aplica)
  const instBullet = INSTITUTIONAL_BULLETS[catId];
  if (instBullet) {
    bullets.push(instBullet);
  }

  return bullets;
}
