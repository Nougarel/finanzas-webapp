# M36 — Diccionario de tokens (borrador para revisión)

> Vocabulario cerrado que el motor emite (`drivers`, `sources`, `direction`) y su
> **traducción legible** en el cliente. El motor solo emite los IDs; el cliente
> tiene este diccionario. Ningún coeficiente, peso ni delta sale del servidor.
>
> ⚠️ Borrador para revisar con Noufel. La asignación token→categoría concreta es
> trabajo de instrumentación de Fase 2 (backend); esto fija el vocabulario.

## 1. `direction` (ternario, sin magnitud)

| Token | Significado | Frase base |
|---|---|---|
| `raised`  | El perfil empuja la categoría por encima de la referencia media | "tu situación eleva esta categoría respecto a la media" |
| `lowered` | El perfil la empuja por debajo | "tu situación reduce esta categoría respecto a la media" |
| `neutral` | El perfil no la mueve significativamente | "esta categoría se mantiene en la referencia para tu perfil" |

## 2. `sources` — fuentes y su traducción semántica

Las fuentes se traducen a **significado**, no a siglas. El nivel de fiabilidad
(ver §3) condiciona el tono: las de respaldo institucional se presentan como
*aval*; las descriptivas, como *referencia observada* (no como prescripción).

| Token | Origen real (catálogo) | Traducción legible (aval) |
|---|---|---|
| `INE`        | INE EPF 2024 | "el organismo oficial de estadística de España (INE), Encuesta de Presupuestos Familiares" |
| `INE_DESC`   | INE EPF 2024 (descriptivo) | "referencia observada del gasto medio de los hogares españoles (INE)" |
| `BDE`        | Banco de España / Finanzas para Todos | "el Banco de España" |
| `BDE_DTI`    | Banco de España (LTV/DTI) | "los criterios de endeudamiento sostenible del Banco de España" |
| `EUROSTAT`   | Eurostat EU-SILC | "la oficina estadística de la Unión Europea (Eurostat)" |
| `OCDE`       | OCDE / Pensions at a Glance | "la escala de equivalencia de hogares de la OCDE" |
| `OMS`        | OMS SDG 3.8.2 | "el umbral de gasto sanitario de la Organización Mundial de la Salud" |
| `UE_ENERGIA` | Directiva UE Eficiencia Energética / Boardman | "la normativa europea de eficiencia energética" |
| `REGLA_2040` | Regla 20/4/10 (vehículo) | "la regla financiera 20/4/10 de compra de vehículo" |
| `FINANCIERO` | Fidelity / Bogleheads / Schwab / Pfau / Ramsey | "principios financieros ampliamente aceptados" |

> Nota de honestidad (TFG): categorías con fuente `*_DESC` o `FINANCIERO` de baja
> fiabilidad NO deben presentarse como "avaladas por una institución". Se
> enmarcan como *referencia observada* o *principio orientativo*. La fiabilidad
> manda sobre el tono.

## 3. `referenceReliability` — niveles y comunicación

Dato **ya existente** en el catálogo. Se traduce a un indicador visual discreto
+ una etiqueta. No es un porcentaje de confianza inventado: es la solidez de la
fuente que respalda el umbral de esa categoría.

| Nivel (catálogo) | Etiqueta legible | Indicador |
|---|---|---|
| `very_high`   | "Respaldo institucional sólido" | ●●●● |
| `high`        | "Respaldo institucional" | ●●●○ |
| `medium_high` | "Base normativa / financiera" | ●●●○ |
| `medium`      | "Base orientativa" | ●●○○ |
| `low`         | "Referencia observada" | ●○○○ |
| `very_low`    | "Referencia descriptiva" | ●○○○ |

## 4. `drivers` — dimensiones del perfil que mueven la categoría

Tokens de las dimensiones del perfil (NO sus valores numéricos ni el efecto
cuantitativo). El cliente compone la frase a partir del token + `direction`.

| Token | Dimensión del perfil | Frase legible |
|---|---|---|
| `HOUSEHOLD_SIZE` | nº de dependientes / tamaño del hogar | "el tamaño de tu hogar" |
| `PARTNER`        | pareja en el hogar | "tener pareja en el hogar" |
| `PARTNER_INCOME` | pareja con ingresos propios | "que tu pareja aporta ingresos" |
| `INCOME_TIER`    | tramo de ingreso (bajo/medio/alto) | "tu nivel de ingresos" |
| `GEOGRAPHIC_ZONE`| zona geográfica | "la zona donde vives" |
| `HOUSING_STATUS` | alquiler / hipoteca / propiedad | "tu situación de vivienda" |
| `HOUSING_GOAL`   | objetivo de comprar vivienda | "tu objetivo de comprar vivienda" |
| `EMPLOYMENT`     | estabilidad laboral | "tu estabilidad laboral" |
| `VEHICLE`        | vehículo (propio/financiado) | "tener vehículo" |
| `HEALTH_INSURANCE`| seguro de salud privado | "tu seguro de salud privado" |
| `OWN_EDUCATION`  | formación propia en curso | "tu formación en curso" |
| `DEBT`           | deuda de consumo | "tu nivel de deuda" |
| `AGE`            | rango de edad | "tu edad" |
| `PENSION_REGIME` | régimen de pensiones | "tu régimen de cotización" |
| `EMERGENCY_PHASE`| fase del fondo de emergencia | "el estado de tu fondo de emergencia" |

### Ejemplo de composición en cliente (ilustrativo)

`{ drivers: ["HOUSING_STATUS","GEOGRAPHIC_ZONE"], direction: "raised", sources: ["BDE_DTI"] }`

→ *"Tu situación de vivienda y la zona donde vives elevan este margen respecto a
la media. El umbral está respaldado por los criterios de endeudamiento
sostenible del Banco de España."*

Nunca: "+2% por dependiente", "peso LP 35", "factibleMax 40%".

## Decisiones abiertas (a cerrar con Noufel)

1. ¿Limitar a un **máximo de drivers por categoría** (p.ej. los 2-3 más
   relevantes) para no saturar la frase ni filtrar umbrales por granularidad?
2. ¿Mostrar el indicador de fiabilidad **siempre** o solo dentro del panel?
3. ¿Tono de las fuentes descriptivas: ocultarlas o mostrarlas con honestidad
   como "referencia observada"?
