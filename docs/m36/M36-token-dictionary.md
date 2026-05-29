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

## 5. Plantillas categoría × driver (ejemplares)

> Estos son **ejemplares de tono y forma**, no la lista completa. La población
> exhaustiva (20 categorías × N drivers cada una) es trabajo de copy en Fase 2,
> con este formato como guía y este criterio: explicar la *lógica real* (qué
> pasa en la vida del hogar) sin revelar coeficientes del modelo.

### Vivienda (relevance THRESHOLD · sources BDE_DTI, EUROSTAT)

- **`HOUSEHOLD_SIZE`** (cuando dependientes > 0)
  > "Tu hogar con {N} dependientes incrementa la necesidad habitacional. El
  > ajuste no es lineal: el peso aumenta más cuando el hogar exige más cuartos
  > (no es lo mismo dos personas que cinco compartiendo el espacio)."

- **`HOUSING_STATUS`**
  > "Estás en {alquiler / hipoteca / propiedad sin deuda}. El Banco de España
  > fija referencias separadas para cada situación porque la carga financiera
  > sobre la vivienda funciona distinta en cada caso; el cálculo partió de la
  > que aplica a la tuya."

- **`GEOGRAPHIC_ZONE`** (cuando zona ≠ estándar)
  > "Vivir en una zona {tensionada / barata} cambia significativamente el
  > coste de mercado de la vivienda. INE y Eurostat reportan diferencias
  > marcadas entre zonas españolas, y el margen se ajustó a la tuya."

- **`INCOME_TIER`**
  > "En tu tramo de ingreso, la vivienda pesa diferente como porcentaje del
  > total: en ingresos bajos suele absorber más; en altos, proporcionalmente
  > menos. El motor escala el objetivo de acuerdo a tu tramo."

### Alimentación (relevance NORMATIVE/THRESHOLD · sources INE, OMS)

- **`HOUSEHOLD_SIZE`**
  > "Con {N} dependientes en casa, la base de alimentación crece, aunque no se
  > duplica con cada persona adicional: parte del gasto se comparte. Este
  > principio está documentado en la metodología de la OCDE para hogares."

- **`AGE`** (cuando edad > 50)
  > "A partir de cierta edad, la calidad nutricional adquiere más peso en la
  > salud financiera y se contempla en la calibración."

### Ropa (relevance CONTEXTUAL · sources INE_DESC)

- **`INCOME_TIER`**
  > "La ropa es una categoría flexible. El INE observa que el gasto medio
  > crece con el ingreso, pero no es un umbral de salud financiera: es
  > estadística descriptiva. Si prefieres priorizar otras opciones del bloque
  > deseos (restaurantes, ocio, regalos), es perfectamente válido mientras
  > respetes el espacio total de ese bloque."

### Ocio / Restaurantes / Suscripciones / Regalos (relevance CONTEXTUAL)

Estas categorías comparten el mismo encuadre de flexibilidad. El bullet
estándar incluye al final:

> "*Estas categorías del bloque deseos son intercambiables entre sí. La
> distribución que proponemos es una guía equilibrada, pero puedes redistribuir
> dentro del bloque según tus prioridades sin afectar a la salud financiera del
> conjunto.*"

### Fondo de emergencia (relevance THRESHOLD · sources BDE)

- **`EMPLOYMENT`**
  > "Tu estabilidad laboral ({fija / temporal / autónomo}) condiciona cuántos
  > meses de gasto debes mantener guardados. El Banco de España recomienda
  > rangos más amplios para situaciones menos estables."

- **`EMERGENCY_PHASE`**
  > "Estás en fase {sin fondo / construyendo / parcial / completo}. La
  > prioridad del fondo cambia drásticamente entre fases: cuando no existe
  > absorbe muchísimo más; cuando está completo, basta con mantenerlo."

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
