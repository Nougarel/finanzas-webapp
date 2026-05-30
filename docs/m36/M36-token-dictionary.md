# M36 — Diccionario de tokens y plantillas (borrador v2)

> Vocabulario cerrado que el motor emite (`drivers`) y diccionarios estáticos
> que vive en el cliente (`relevance`, `sources`, plantillas por categoría×driver).
> El motor solo emite los IDs de los drivers que han disparado para el perfil;
> el resto se compone en cliente desde el catálogo (que ya se envía) y este
> diccionario. **Ningún coeficiente, peso ni delta sale del servidor.**

## Cambios respecto a la v1 (2026-05-29)

1. **Se elimina `direction` ternario** del contrato del motor. Cada driver lleva
   su propio efecto en su bullet — el "sube/baja" global era redundante.
2. **`reliability` se renombra a `relevance`** ("relevancia para la salud
   financiera") con tres niveles más honestos. El INE descriptivo no es "menos
   fiable", es *contextual* — su rol es distinto.
3. **Bullet por driver** (no una frase única). Cada modificador directo del
   target tiene su propia explicación con HOW y WHY.
4. **Categorías `CONTEXTUAL`** llevan mensaje explícito de flexibilidad: el
   usuario puede mover libremente el gasto dentro del bloque de deseos.

## 1. Contrato simplificado del motor

```
// Emite SOLO drivers dinámicos (los condicionales que han disparado).
// relevance y sources se derivan en cliente desde el catálogo.
explanation: {
  housing:  { drivers: ["HOUSING_STATUS", "HOUSEHOLD_SIZE", "GEOGRAPHIC_ZONE", "INCOME_TIER"] },
  clothing: { drivers: ["INCOME_TIER"] },
  ...
}
```

**Regla de inclusión:** un driver entra si su condición fire dentro de la
función `calc<Categoria>Target` de esa categoría — es decir, si **modifica
directamente el target de esa categoría**. Las dinámicas indirectas del LP
(ahorro inexistente que comprime vivienda, etc.) NO son drivers de vivienda:
no tocan su target.

## 2. `relevance` — Relevancia para la salud financiera (3 niveles)

| Token | Significado | Etiqueta en panel | Catálogo (`referenceReliability`) |
|---|---|---|---|
| `THRESHOLD`  | Umbral definido por una institución *de* salud financiera | "Umbral de salud financiera" | `very_high`, `high` |
| `NORMATIVE`  | Principio normativo o financiero consolidado | "Referencia normativa / financiera" | `medium_high`, `medium` |
| `CONTEXTUAL` | Estadística descriptiva (no prescriptiva) del comportamiento real | "Referencia contextual" | `low`, `very_low` |

**Por qué este reframing:** una referencia del INE descriptivo no es "menos
fiable" — es estadísticamente sólida. Lo que pasa es que no fue diseñada como
*umbral de salud financiera*; es un retrato del comportamiento real. Llamarlo
"contextual" honra esa distinción y refuerza la credibilidad de los `THRESHOLD`
por contraste.

## 3. `sources` — Fuentes y su traducción semántica

Las fuentes se traducen a **significado**, no a siglas. La etiqueta de
`relevance` ya marca el peso; aquí va el *qué es esa fuente*.

| Token | Origen real | Traducción legible |
|---|---|---|
| `INE`        | INE EPF 2024 (categorías con `THRESHOLD`/`NORMATIVE`) | "el organismo oficial de estadística de España (INE)" |
| `INE_DESC`   | INE EPF 2024 (descriptivo) | "los datos del INE sobre el gasto medio observado de los hogares" |
| `BDE`        | Banco de España / Finanzas para Todos | "el Banco de España" |
| `BDE_DTI`    | Banco de España (LTV/DTI) | "los criterios de endeudamiento sostenible del Banco de España" |
| `EUROSTAT`   | Eurostat EU-SILC | "la oficina estadística de la Unión Europea (Eurostat)" |
| `OCDE`       | OCDE / Pensions at a Glance | "el marco de la OCDE" |
| `OMS`        | OMS SDG 3.8.2 | "el umbral de gasto sanitario de la Organización Mundial de la Salud" |
| `UE_ENERGIA` | Directiva UE Eficiencia Energética / Boardman | "la normativa europea de eficiencia energética" |
| `REGLA_2040` | Regla 20/4/10 | "la regla financiera 20/4/10 de compra de vehículo" |
| `FINANCIERO` | Fidelity / Pfau / Bogleheads / Schwab / Ramsey | "principios financieros ampliamente aceptados" |

## 4. `drivers` — dimensiones del perfil que tocan el target

Solo se emiten cuando su condición ha disparado dentro del `calc*Target` de la
categoría. El cliente tiene el valor del perfil (no lo emite el motor, ya está
en localStorage) y lo interpola en la plantilla.

| Token | Dimensión del perfil |
|---|---|
| `HOUSEHOLD_SIZE`  | nº de dependientes |
| `CHILDREN_AT_UNIVERSITY` | hijos cursando estudios universitarios viviendo en el hogar |
| `CHILDREN_STUDYING_AWAY` | hijos estudiando fuera del hogar familiar |
| `PARTNER`         | pareja en el hogar |
| `PARTNER_INCOME`  | pareja con ingresos propios |
| `INCOME_TIER`     | tramo de ingreso (bajo/medio/alto) |
| `GEOGRAPHIC_ZONE` | zona geográfica |
| `HOUSING_STATUS`  | alquiler / hipoteca / propiedad |
| `HOUSING_GOAL`    | objetivo de comprar vivienda |
| `EMPLOYMENT`      | estabilidad laboral |
| `VEHICLE`         | vehículo (propio/financiado/sin) |
| `HEALTH_INSURANCE`| seguro privado de salud |
| `OWN_EDUCATION`   | formación propia en curso |
| `DEBT`            | deuda de consumo |
| `AGE`             | rango de edad |
| `PENSION_REGIME`  | régimen de cotización |
| `EMERGENCY_PHASE` | fase del fondo de emergencia |

## 5. Plantillas completas por categoría (Fase 2b, cerradas con Noufel)

Esta sección contiene el copy redactado para cada combinación válida de
categoría × driver, más los bullets de "Referencia institucional" para las
categorías con umbral prescriptivo asentado. Es la fuente de verdad para el
módulo de explicaciones que consume el panel de detalle.

Criterio aplicado en todas las plantillas: explicar la lógica real (qué pasa
en la vida del hogar, qué razona el motor) sin revelar coeficientes, umbrales
internos ni el orden exacto de aplicación. Los valores de perfil del usuario
({N}, situación de vivienda, edad, etc.) se interpolan en el cliente desde
los datos del propio perfil (que ya viajan en localStorage), no los emite el
motor.

### Patrón de "Referencia institucional"

Algunas categorías tienen un umbral prescriptivo asentado (Banco de España,
OMS, UE, OCDE). En esas, además de los bullets por driver, el panel cierra
con un bullet adicional de tipo "Referencia institucional" que aparece
siempre, independientemente del perfil. Su función es contextualizar el
cálculo dentro de un marco institucional de salud financiera.

Categorías con Referencia institucional: vivienda, transporte, salud,
suministros, fondo de emergencia, inversión y jubilación.

---

### Vivienda

Drivers: HOUSING_STATUS, GEOGRAPHIC_ZONE (si no es estándar), HOUSEHOLD_SIZE
(si hay dependientes y la situación es alquiler o hipoteca), INCOME_TIER
(solo en alquiler/hipoteca). Más Referencia institucional siempre presente.

**Tu situación de vivienda.** (HOUSING_STATUS, variantes por valor)

- *alquiler*: Tu vivienda en alquiler es un gasto mensual sostenido con un perfil de riesgo propio (depende del mercado, posibles subidas y movimientos del propietario). El Banco de España publica referencias específicas para esta situación y el cálculo partió de la que aplica a tu caso.
- *hipoteca*: Tu vivienda con hipoteca implica una carga mensual estructural durante años. Los criterios del Banco de España para hipoteca incluyen el ratio de endeudamiento (DTI) y son los que orientan el margen aplicado a tu caso.
- *propiedad sin deuda*: Tu propiedad sin deuda libera la mayor parte del presupuesto que en otros casos absorbe la vivienda, así que el margen aplicado es notablemente menor. Aun así se reserva una parte para mantenimiento, comunidad e IBI.
- *vivienda cedida o familiar*: Vivir en una vivienda cedida por familia o sin gasto directo en vivienda libera el margen que normalmente absorbe esta categoría. El cálculo reserva una parte mínima por si aparecen gastos puntuales relacionados.

**Tu zona geográfica.** (GEOGRAPHIC_ZONE, variantes por valor; solo dispara si no es estándar)

- *zona cara*: Vives en una zona cara (gran ciudad o área metropolitana). Eurostat e INE documentan que el precio de la vivienda en estas zonas se aleja bastante de la media nacional, así que el margen se ajusta hacia arriba para reflejar la realidad de tu mercado.
- *zona rural*: Vivir en una zona rural baja sensiblemente el coste de la vivienda respecto a la media nacional. El cálculo ajusta el margen hacia abajo, en línea con los datos del INE sobre diferencias regionales en España.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes aumenta la necesidad habitacional. El ajuste no es lineal: el peso crece más cuando el hogar empieza a necesitar más cuartos (no es lo mismo dos personas compartiendo que cuatro). Esa relación entre composición y espacio es la que guía el aumento aplicado.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, la vivienda no pesa igual como porcentaje del total. A ingresos bajos suele absorber una parte mayor del presupuesto; a ingresos altos, proporcionalmente menos. El cálculo escala el margen de acuerdo a tu tramo, así que no te aplica la misma referencia que a alguien con un ingreso muy distinto.

**Referencia institucional.**

> El Banco de España fija como referencia de endeudamiento sostenible un ratio máximo del 30-35% del ingreso neto del hogar destinado a vivienda (incluyendo hipoteca, alquiler, comunidad y suministros vinculados). El cálculo orienta tu margen de vivienda dentro de ese rango para preservar la salud financiera del conjunto, considerando tu perfil completo.

---

### Suministros

Drivers: HOUSEHOLD_SIZE (si hay dependientes en casa), EMPLOYMENT (solo si autónomo), GEOGRAPHIC_ZONE (solo rural), INCOME_TIER. Más Referencia institucional.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes en casa incrementa el consumo de suministros. Más personas significa más luz, más agua caliente, más horas de calefacción y más dispositivos conectados a la vez. El cálculo añade un margen por persona sin asumir duplicación exacta, porque parte del consumo es estructural y se comparte (la nevera, el termo, la calefacción central).

**Tu actividad laboral.** (EMPLOYMENT, solo si autónomo)

> Como autónomo es habitual pasar más horas en casa a la semana, con efecto directo en los suministros: más luz, más climatización (verano e invierno), más internet de alto consumo, más electricidad para equipos. El cálculo añade un margen específico que no existe en una jornada de oficina fuera del hogar.

**Tu zona geográfica.** (GEOGRAPHIC_ZONE, solo rural)

> Vivir en una zona rural suele encarecer los suministros. El acceso a gas ciudad es limitado y muchas viviendas calefactan con gasóleo, butano o pellets (sensiblemente más caros). El agua puede depender de depósitos o pozos con mantenimiento propio, y el internet rural sigue siendo más caro y peor que en ciudad. El cálculo refleja ese sobrecoste estructural.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, los suministros tienen un comportamiento mixto. Son un gasto bastante inelástico (la nevera y el termo se mantienen aunque baje el ingreso), así que a ingresos bajos pesan proporcionalmente más en el presupuesto; a ingresos altos suele crecer el consumo (más climatización, más dispositivos, tarifas premium) pero el peso relativo baja. El cálculo escala el margen reconociendo esa elasticidad observada en la EPF del INE.

**Referencia institucional.**

> El concepto de "pobreza energética", adoptado por la Comisión Europea como indicador de vulnerabilidad, se asocia con hogares que dedican una proporción excesiva de su ingreso a suministros (la referencia habitual sitúa esa frontera por encima del 10% del ingreso del hogar). El cálculo orienta tu margen claramente por debajo de ese umbral considerando el conjunto de tu perfil.

---

### Alimentación

Drivers: HOUSEHOLD_SIZE (si hay dependientes en casa o hijos estudiando fuera), INCOME_TIER. Sin Referencia institucional (no existe un umbral prescriptivo asentado para gasto en alimentación familiar como % del presupuesto).

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes incrementa la base de alimentación, pero no se duplica con cada persona adicional. Parte del gasto se comparte (compras a granel, comidas conjuntas, aprovechamiento de ingredientes), por eso el aumento es menor del que sugeriría la simple suma de bocas. Este principio está documentado en la metodología de la OCDE sobre equivalencia de hogares.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, la alimentación pesa diferente como porcentaje del total. A ingresos más bajos suele absorber una parte mayor del presupuesto (es de las primeras necesidades cubiertas); a ingresos altos, proporcionalmente menos, aunque la cifra absoluta tienda a crecer. Es lo que la economía conoce como ley de Engel, y el INE lo refleja en su Encuesta de Presupuestos Familiares.

---

### Transporte

Drivers: VEHICLE, GEOGRAPHIC_ZONE (solo rural), EMPLOYMENT (solo si autónomo con viajes profesionales habituales), HOUSEHOLD_SIZE (si hay dependientes en casa), INCOME_TIER. Más Referencia institucional.

**Tu situación de vehículo.** (VEHICLE, variantes por valor)

- *sin vehículo*: No tienes vehículo propio. La base del cálculo es la más baja porque te apoyas principalmente en transporte público y servicios bajo demanda, sin gastos fijos de combustible, mantenimiento ni seguro. Se reserva un margen para esos servicios.
- *en propiedad*: Tienes vehículo en propiedad sin deuda asociada. El cálculo contempla los gastos sostenidos que conlleva (combustible, mantenimiento, seguro, ITV, impuestos), pero sin cuotas mensuales que sumen carga.
- *financiado*: Tu vehículo financiado añade una cuota mensual al margen sostenido (combustible, mantenimiento, seguro). El Banco de España considera ambos componentes al evaluar el peso del transporte en el presupuesto.
- *en leasing*: Tu vehículo en leasing implica un coste fijo mensual que normalmente cubre mantenimiento y seguro dentro de la cuota. El cálculo trata esa cuota como gasto estructural durante el contrato.

**Tu zona geográfica.** (GEOGRAPHIC_ZONE, solo rural)

> Vivir en una zona rural eleva el peso del transporte. Cuando el transporte público es limitado o inexistente, el vehículo deja de ser opcional para convertirse en parte de la infraestructura cotidiana (trabajo, compras, sanidad), y el cálculo refleja esa dependencia con un margen mayor.

**Tu actividad laboral.** (EMPLOYMENT, solo si autónomo con viajes profesionales habituales)

> Como autónomo con viajes profesionales habituales, sumas costes recurrentes de desplazamiento que no aparecen en una jornada de oficina (combustible, peajes, kilometraje, mantenimiento por uso intensivo). El cálculo añade un margen específico para reconocer esa carga sostenida.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes incrementa el uso del transporte (rutas al colegio, actividades extraescolares, desplazamientos coordinados). No es solo más personas moviéndose, también más viajes simultáneos que el cálculo contempla en el margen.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, el transporte ocupa un papel distinto en el presupuesto. A ingresos más bajos suele ser una necesidad rígida (llegar al trabajo es innegociable, y el coste pesa más en proporción); a ingresos altos, el peso relativo baja aunque las opciones se amplíen. El cálculo escala el margen reconociendo esa elasticidad observada en la EPF del INE.

**Referencia institucional.**

> La regla financiera 20/4/10 (consolidada en educación financiera anglosajona y aplicable al contexto español) sugiere no destinar más del 10% del ingreso mensual a transporte (combustible, mantenimiento, seguro y cuota si la hay). El cálculo orienta tu margen alrededor de ese referente, ajustando por tu perfil concreto.

---

### Salud

Drivers: AGE, HEALTH_INSURANCE (si tienes seguro privado), HOUSEHOLD_SIZE (si hay dependientes), INCOME_TIER. Más Referencia institucional.

**Tu edad.** (AGE, variantes por valor)

- *menos de 35 años*: A tu edad la salud suele requerir un margen modesto (revisiones de rutina, alguna especialidad puntual, prevención). La base del cálculo arranca baja, en línea con los patrones de uso del sistema sanitario que documenta el INE en la EPF.
- *entre 35 y 50*: En tu rango de edad la salud empieza a pesar algo más (revisiones más frecuentes, prevención de problemas crónicos, posibles tratamientos puntuales). La base se ajusta hacia arriba para reflejar ese cambio de etapa, observado en los datos sanitarios por tramo de edad.
- *más de 50 años*: A partir de los 50 la salud requiere un margen claramente mayor (medicación sostenida, más visitas médicas, dental y óptica con mayor frecuencia, prevención de enfermedades crónicas). La base se eleva reconociendo esa realidad biológica, alineada con los datos del INE sobre gasto sanitario por tramo de edad.

**Tu seguro médico privado.** (HEALTH_INSURANCE, variantes por valor)

- *seguro básico*: Tu seguro médico privado básico añade una prima mensual recurrente al margen sanitario, además de copagos puntuales. El cálculo incluye esa carga sostenida como parte estructural del bloque.
- *seguro completo*: Tu seguro médico privado completo añade una prima mensual más alta a cambio de menos copagos. El cálculo reconoce esa carga sostenida y la incorpora al margen del bloque.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes amplía el margen sanitario. Cada persona aporta sus revisiones, vacunas, tratamientos dentales, ópticos y posibles imprevistos, y el cálculo contempla ese gasto sostenido sin asumir que se replique de forma exacta por cabeza.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, la salud se ajusta de forma matizada: a ingresos altos suele crecer el gasto en sanidad privada, dental, óptica y servicios fuera del sistema público; a ingresos más bajos esos gastos opcionales se reducen y el margen baja. El INE documenta esa elasticidad en la EPF, aunque el efecto es menor que en otras categorías por el carácter universal del sistema sanitario público español.

**Referencia institucional.**

> La OMS define como "gasto sanitario catastrófico" cualquier desembolso superior al 10% del ingreso del hogar. El cálculo orienta tu margen sanitario claramente por debajo de ese umbral, considerando el conjunto de tu perfil. Este es el suelo de fiabilidad de toda la categoría, independientemente de tus drivers personales.

---

### Educación

Drivers: OWN_EDUCATION (si estás formándote), HOUSEHOLD_SIZE (si tienes hijos), CHILDREN_AT_UNIVERSITY (si tienes hijos cursando estudios universitarios viviendo en casa), CHILDREN_STUDYING_AWAY (si tienes hijos estudiando fuera del hogar), INCOME_TIER. Sin Referencia institucional.

**Tu formación propia.** (OWN_EDUCATION, variantes por valor)

- *formación continua*: Tu formación continua en curso (cursos, idiomas, certificaciones, especializaciones) añade un gasto sostenido al margen educativo. El cálculo contempla la inversión recurrente que implica mantenerse al día profesionalmente, sin asumir importes catastróficos pero reservando un colchón realista.
- *estudios formales*: Tus estudios formales en curso (grado, máster, doctorado o equivalente) implican un margen claramente mayor en educación. Matrícula, tasas, materiales y posibles desplazamientos suman una carga sostenida durante todo el curso académico, y el cálculo la incorpora como parte estructural del bloque.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} hijos amplía el margen educativo. Materiales escolares, libros, uniformes, comedor, actividades extraescolares y, en muchos casos, refuerzos o academias suman un gasto sostenido durante toda la etapa educativa. El cálculo lo reconoce sin asumir que sea idéntico por hijo, porque parte del material y los recursos se aprovechan en familia.

**Hijos en formación universitaria viviendo en casa.** (CHILDREN_AT_UNIVERSITY)

> Tienes {N} hijos cursando estudios universitarios sin haberse mudado del hogar familiar. La universidad añade matrícula, tasas, libros y materiales específicos sobre el gasto educativo previo, y aunque sigan en casa el peso es claramente superior al de etapas escolares. El cálculo refleja ese salto sin asumir movilidad fuera del hogar.

**Hijos estudiando fuera del hogar.** (CHILDREN_STUDYING_AWAY)

> Tienes {N} hijos estudiando fuera del hogar familiar. Esto cambia radicalmente el peso del bloque educativo: además de matrícula, tasas y materiales, se suma una segunda economía doméstica (alquiler o residencia, manutención, transporte interurbano para visitas). Es uno de los modificadores más fuertes del cálculo, y por eso aparece como bullet propio en lugar de mezclarse con el resto.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, la educación se mueve en dos direcciones distintas. A ingresos altos suele crecer el gasto en escolarización privada o concertada, idiomas, refuerzos y actividades enriquecedoras (música, deporte, viajes culturales); a ingresos más bajos el sistema educativo público cubre buena parte de la necesidad básica y el margen baja. El INE lo refleja en la EPF, con diferencias notables entre tramos.

---

### Seguro de vida

Drivers: HOUSEHOLD_SIZE (si hay dependientes), HOUSING_STATUS (solo hipoteca), AGE (solo más de 50), INCOME_TIER. Sin Referencia institucional (las recomendaciones del sector se expresan como múltiplo del ingreso anual en capital asegurado, no como % del presupuesto mensual).

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tener {N} dependientes a cargo es la razón económica principal para contratar un seguro de vida: si te ocurriese algo, tu hogar perdería tus ingresos pero seguiría teniendo gastos. El cálculo eleva el margen para reservar prima suficiente y garantizar una cobertura realista para los que dependen de ti.

**Tu situación de vivienda.** (HOUSING_STATUS, solo hipoteca)

> Tu vivienda con hipoteca añade peso a esta categoría. Es habitual contratar un seguro de vida vinculado a la hipoteca (muchos bancos lo exigen como condición de financiación), porque cubre el saldo pendiente del préstamo si te ocurre algo y evita que tu familia se quede sin vivienda. El cálculo reserva margen para esa prima específica.

**Tu edad.** (AGE, solo más de 50)

> A partir de los 50 años las primas de seguro de vida suben significativamente: las aseguradoras incorporan el riesgo actuarial creciente en sus tarifas, y mantener una cobertura comparable a edades anteriores cuesta más. El cálculo ajusta el margen al alza para reflejar esa realidad del mercado asegurador.

**Tu tramo de ingreso.** (INCOME_TIER)

> En tu tramo de ingreso, el seguro de vida adapta la cobertura. A mayores ingresos tu hogar dependería de una cifra mayor si te faltaras, así que el capital asegurado crece (y con él la prima), aunque proporcionalmente al presupuesto total el peso suele mantenerse moderado. A ingresos más bajos la cobertura básica es la prioridad y el margen baja.

---

### Fondo de emergencia

Drivers: EMERGENCY_PHASE, EMPLOYMENT (solo en fases sin fondo o construyendo), PARTNER_INCOME (solo en fase parcial cuando la pareja aporta ingresos). Más Referencia institucional.

**Tu fase del fondo.** (EMERGENCY_PHASE, variantes por valor)

- *sin fondo*: La construcción de un fondo de emergencia es ahora una prioridad absoluta. Sin colchón ante imprevistos (pérdida de empleo, gasto médico inesperado, avería grave), cualquier sacudida puede empujarte a la deuda. El cálculo dedica un porcentaje sustancial del presupuesto a esta categoría hasta que alcances un nivel funcional.
- *construyéndolo*: Estás construyendo activamente tu fondo de emergencia. El cálculo mantiene un peso elevado en esta categoría para que avances rápido hacia un colchón sólido, idealmente alcanzable en pocos meses según tu ingreso y gastos.
- *parcial*: Tu fondo de emergencia está parcialmente formado. La prioridad baja respecto a quien empieza desde cero, pero conviene seguir aportando para llegar al rango recomendado. El cálculo asigna un margen moderado de mantenimiento incremental.
- *completo*: Tu fondo de emergencia está completo. Llegados a este punto solo necesitas mantenerlo y compensar la inflación; el cálculo reserva un margen mínimo y libera el resto para otros bloques (inversión, vivienda, ahorro a otros plazos).

**Tu estabilidad laboral.** (EMPLOYMENT, solo en fases sin fondo o construyendo)

> Tu estabilidad laboral ({indefinido/temporal/autónomo}) condiciona los meses de gasto que conviene tener guardados. Una jornada indefinida permite un colchón más ajustado; el trabajo temporal o autónomo requiere reservas más amplias por la mayor variabilidad de ingresos y menor protección ante el desempleo. El cálculo ajusta el objetivo del fondo en consecuencia.

**Ingresos de tu pareja.** (PARTNER_INCOME, solo en fase parcial cuando tu pareja aporta ingresos propios)

> Tu pareja aporta ingresos propios al hogar, lo que reduce ligeramente el ritmo necesario para terminar de construir el fondo. Un hogar de doble ingreso tiene mayor resiliencia ante una pérdida laboral (uno de los dos sigue aportando), así que el colchón compartido no necesita acumularse con la misma urgencia. El cálculo refleja ese matiz.

**Referencia institucional.**

> El Banco de España recomienda mantener entre 3 y 6 meses de gastos esenciales como fondo de emergencia, con rangos más amplios para situaciones laborales menos estables. El cálculo de esta categoría apunta hacia ese rango según tu fase actual y tu perfil profesional, considerando que es uno de los pilares de la salud financiera personal.

---

### Ahorro a corto plazo

Driver: HOUSEHOLD_SIZE (si hay dependientes). Sin Referencia institucional.

**Composición de tu hogar.** (HOUSEHOLD_SIZE)

> Tu hogar con {N} dependientes amplía la importancia del ahorro a corto plazo. Las familias afrontan más imprevistos no catastróficos pero recurrentes (electrodomésticos averiados, reparaciones del coche, vacaciones más caras, gastos escolares puntuales) que un hogar individual. El cálculo añade un margen para que tengas liquidez disponible sin tener que tocar el fondo de emergencia ni recurrir a deuda.

---

### Ahorro a largo plazo

Driver: HOUSING_GOAL (si tienes objetivo de compra de vivienda). Sin Referencia institucional.

**Tu objetivo de vivienda.** (HOUSING_GOAL)

> Tienes como objetivo comprar vivienda en los próximos años. Es una decisión que multiplica el peso del ahorro a largo plazo: la entrada típica para una hipoteca en España ronda el 20-30% del precio del inmueble, sumados impuestos de transmisión, notaría, registro y posibles reformas. El cálculo destina un margen significativo a este bloque para que avances de forma realista hacia esa meta sin sacrificar tu salud financiera presente.

---

### Inversión y jubilación

Drivers: AGE, PENSION_REGIME (solo si no es Seguridad Social), EMPLOYMENT (solo en Seguridad Social con trabajo no indefinido). Más Referencia institucional.

**Tu edad.** (AGE, variantes por valor)

- *menos de 35 años*: A tu edad la inversión y la jubilación tienen el horizonte temporal más amplio posible, que es la mayor ventaja para construir capital. El interés compuesto trabaja a tu favor durante décadas, así que aportaciones modestas pero constantes ahora valen muchísimo más que aportaciones grandes empezadas tarde. El cálculo arranca con un peso moderado pero firme.
- *entre 35 y 50*: En tu rango de edad la inversión pesa más en el cálculo. Sigues con un horizonte temporal favorable, pero el tiempo restante hasta la jubilación se acorta, y conviene acelerar las aportaciones para compensar etapas anteriores en las que quizá ahorraste menos. El cálculo eleva el margen reflejando esa urgencia creciente.
- *más de 50 años*: A partir de los 50 las aportaciones a la jubilación cobran máxima prioridad. El horizonte temporal restante es menor, las decisiones que tomes ahora tendrán impacto directo en tu calidad de vida tras retirarte, y conviene aprovechar las deducciones fiscales del último tramo profesional. El cálculo destina la asignación más alta de las tres etapas.

**Tu régimen de cotización.** (PENSION_REGIME, solo si no cotizas en la Seguridad Social)

> Cotizas en un régimen distinto al de la Seguridad Social ({mutualidad profesional/sin régimen de cotización}). Las pensiones futuras serán más bajas o directamente inexistentes en comparación con el régimen general, así que la responsabilidad de cubrir tu jubilación recae más sobre el ahorro privado. El cálculo eleva el margen de inversión para compensar esa menor cobertura institucional.

**Tu estabilidad laboral.** (EMPLOYMENT, solo en Seguridad Social y trabajo no indefinido)

> Tu actividad como {asalariado temporal/autónomo} dentro de la Seguridad Social acumula menos años de cotización efectiva en promedio (los contratos temporales tienen interrupciones; los autónomos suelen cotizar por bases mínimas). La pensión pública resultante será probablemente menor que la de un trabajador indefinido equivalente, así que el cálculo añade un margen extra a la inversión privada para reducir esa brecha.

**Referencia institucional.**

> La OCDE y consultoras financieras como Wade Pfau o Fidelity coinciden en recomendar dedicar entre el 10% y el 15% del ingreso a la jubilación para mantener un nivel de vida razonable tras retirarse. El cálculo orienta tu inversión hacia ese rango ajustando por tu edad, régimen y estabilidad, considerando que es uno de los pilares estructurales de la salud financiera a largo plazo.

---

### Amortización extra de deuda

Driver: DEBT (solo si tienes deuda de consumo). Sin Referencia institucional.

**Tu nivel de deuda de consumo.** (DEBT)

> Tienes deuda de consumo {baja/media/alta} (tarjetas, préstamos personales, financiación de bienes duraderos). El cálculo reserva un margen para amortizaciones extra: pagar más de lo pactado cada mes reduce los intereses totales del préstamo, acorta el plazo y libera tu presupuesto antes. A mayor nivel de deuda, mayor es el margen recomendado para acelerar la salida.

---

### Bloque deseos (8 categorías: restaurantes, viajes, ropa, ocio, hobbies, suscripciones, cuidado personal, regalos)

Estas categorías no tienen `calc*Target` propio: el LP las trata como bloque residual y reparte el espacio sobrante según pesos descriptivos del INE. Por eso `explanation[catId].drivers = []` para todas ellas.

El panel para cualquiera muestra solo cabecera + relevance ●●○○ + procedencia INE descriptiva + comparación con la media + mensaje de flexibilidad (ya redactado en Fase 1):

> "Estas categorías del bloque deseos son intercambiables entre sí. La distribución que proponemos es una guía equilibrada, pero puedes redistribuir dentro del bloque según tus prioridades sin afectar a la salud financiera del conjunto."

No necesitan bullets adicionales por driver.

---

### Etiquetas legibles por valor de perfil

Para que los bullets con variantes interpolen correctamente, el cliente
traduce los valores crudos del perfil a etiquetas legibles. Lista de
traducciones cerradas con Noufel:

| Campo perfil | Valor crudo | Etiqueta visible |
|---|---|---|
| housingStatus | rent | alquiler |
| housingStatus | mortgage | hipoteca |
| housingStatus | owned | propiedad sin deuda |
| housingStatus | family | vivienda cedida o familiar |
| geographicZone | expensive_city | zona cara |
| geographicZone | rural | zona rural |
| vehicleStatus | none | sin vehículo |
| vehicleStatus | owned_paid | en propiedad |
| vehicleStatus | financed | financiado |
| vehicleStatus | leasing | en leasing |
| ageRange | under35 | menos de 35 años |
| ageRange | 35to50 | entre 35 y 50 |
| ageRange | over50 | más de 50 años |
| privateHealthInsurance | basic | seguro básico |
| privateHealthInsurance | complete | seguro completo |
| ownEducation | continuous | formación continua |
| ownEducation | formal | estudios formales |
| emergencyFundStatus | none | sin fondo |
| emergencyFundStatus | building | construyéndolo |
| emergencyFundStatus | partial | parcial |
| emergencyFundStatus | complete | completo |
| employmentStatus | permanent | indefinido |
| employmentStatus | temporary | temporal |
| employmentStatus | freelance | autónomo |
| pensionRegime | mutual | mutualidad profesional |
| pensionRegime | none | sin régimen de cotización |
| consumerDebt | low | baja |
| consumerDebt | medium | media |
| consumerDebt | high | alta |

Las variantes de bullet ({alquiler/hipoteca/...}) son selecciones, no
interpolaciones. El cliente elige el bullet correspondiente al valor del
perfil. Las interpolaciones reales son `{N}` (un número) y los nombres
internos de fases laborales/educativas, que se sustituyen por la etiqueta
visible de la tabla anterior.

## 6. Tono — checklist de lo que SÍ y lo que NO

**SÍ:**
- Hablar de la *lógica del mundo real* (espacio que necesita una familia,
  carga financiera de una hipoteca, salud nutricional en cierta edad).
- Mencionar los nombres de las instituciones cuando aplique.
- Reconocer no-linealidades conceptualmente ("hay un salto cuando…").
- En CONTEXTUAL: comunicar flexibilidad explícitamente.

**NO (frontera de secreto):**
- Porcentajes / pesos / deltas / coeficientes.
- Umbrales numéricos exactos del modelo.
- Nombres de variables internas ni del LP (`factibleMax`, `lpWeight`).
- Valor objetivo del LP ni iteraciones del símplex.
- Indicar el ORDEN exacto de aplicación de modificadores.

## Decisiones cerradas con Noufel (2026-05-29)

1. **Drivers**: TODOS los modificadores **directos** del target de la categoría
   (los que toca `calc*Target`). Las dinámicas indirectas del LP no se incluyen.
2. **Indicador de `relevance`**: solo dentro del panel, no en la tabla.
3. **Fuentes débiles**: mostrarse con honestidad como `CONTEXTUAL`, con
   mensaje de flexibilidad.
4. **`direction` ternario**: eliminado del contrato. Cada bullet expresa su
   propio efecto en lenguaje natural.
