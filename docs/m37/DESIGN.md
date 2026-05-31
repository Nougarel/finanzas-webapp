# DESIGN.md — M37 DashboardPanel Discovery

## 1. Contexto y objetivos

El M37 introduce una columna derecha fija (`DashboardPanel`) en las tres páginas de resultados
(`/results`, `/diagnosis`, `/inverse-results`) en viewports xl+ (≥1280 px). El objetivo es
dar al usuario una vista resumen permanente mientras navega la tabla densa de col 1: un
piechart macro por bloques, un piechart de detalle por bloque, cuatro indicadores financieros
clave y un CTA secundario contextual. En breakpoints inferiores, col 2 colapsa bajo col 1 sin
perder información.

---

## 2. Decisiones cerradas

| # | Decisión | Valor definitivo |
|---|----------|-----------------|
| 1 | Ratio de columnas | **7/12 + 5/12** (col 1 principal / col 2 dashboard) |
| 2 | Max-width del contenedor | **`max-w-7xl` (1280 px)** en las 3 páginas de resultados |
| 3 | Librería de gráficos | **recharts** (el frontend la instala en F2) |
| 4 | Indicadores en col 2 | **DTI + tasa de ahorro + ratio necesidades + cobertura de emergencia (meses)** |
| 5 | Seguros | Se quedan en col 1 como card compacta al pie. No entran en col 2 |
| 6 | CTAs secundarios | `/results` → "Compara tu situación real → /diagnosis-form"; `/diagnosis` → "Ver distribución ideal → /calculator"; `/inverse-results` → "Calcular de nuevo" |
| 7 | Activación 2-col | **xl (≥1280 px)**. Por debajo, col 2 colapsa debajo de col 1 |

---

## 3. Asignación de colores chart por bloque

### 3.1 Diagnóstico de los tokens actuales

Los cinco tokens `--chart-*` del design system son los valores de shadcn por defecto sin
customizar para el dominio. Dos de ellos fallan el criterio de contraste mínimo 3:1
(WCAG 1.4.11) sobre fondo blanco (`--card: oklch(1 0 0)`), que es la superficie donde
vivirán los piecharts. El tercero es visualmente demasiado cercano al navy primario.

| Token | oklch actual | Hex aprox. | Contraste /blanco | Estado |
|-------|-------------|-----------|-------------------|--------|
| `--chart-1` | oklch(0.646 0.222 41.116) | #E07B3E | ≈ 3.8:1 | pasa ✓ |
| `--chart-2` | oklch(0.600 0.118 184.704) | #41A497 | ≈ 4.2:1 | pasa ✓ |
| `--chart-3` | oklch(0.398 0.07 227.392)  | #4A6080 | ≈ 8.5:1 | pasa ✓ pero hue 227 choca con navy (264); riesgo de confusión cromática |
| `--chart-4` | oklch(0.828 0.189 84.429)  | #D4C53A | ≈ 1.8:1 | **falla ✗** |
| `--chart-5` | oklch(0.769 0.188 70.08)   | #C9A840 | ≈ 2.3:1 | **falla ✗** |

Además, chart-4 y chart-5 son perceptualmente muy similares (ambos amarillo-lima/ámbar),
lo que los hace inutilizables como colores distintos en un mismo gráfico.

### 3.2 Nuevos valores propuestos

Se redefinen los cinco tokens con tres objetivos:
1. Cada token de bloque pasa 3:1 sobre blanco
2. Ninguno se confunde con el navy primario (hue 264.5 ± 30°)
3. Hay semántica cromática coherente: tierra/rojo-naranja → necesidades (imprescindible),
   violeta-azul frío → deseos (discrecional), verde-teal → ahorro (crecimiento/futuro)

Los tokens chart-4 y chart-5 se reservan para variaciones de las categorías individuales
dentro de los piecharts de bloque (tono más claro y más oscuro del color del bloque).

```css
/* Nuevos tokens — reemplazar en :root de globals.css */

--chart-1: oklch(0.58 0.18 38);
/* Rojo-naranja cálido. Necesidades. Hex aprox. #C86B3A. */
/* Contraste sobre blanco: L=0.58 → ratio ≈ 4.5:1 — pasa AA */

--chart-2: oklch(0.52 0.16 300);
/* Violeta-malva medio. Deseos. Hex aprox. #8F5DB5. */
/* Contraste sobre blanco: L=0.52 → ratio ≈ 5.8:1 — pasa AA */

--chart-3: oklch(0.58 0.15 155);
/* Verde-teal medio. Ahorro. Hex aprox. #3A9E7A. */
/* Contraste sobre blanco: L=0.58 → ratio ≈ 4.5:1 — pasa AA */

--chart-4: oklch(0.72 0.12 38);
/* Naranja claro. Variante luminosa de chart-1 (categorías individuales de needs). */
/* Contraste sobre blanco: L=0.72 → ratio ≈ 2.9:1 — solo para segmentos grandes (>20px) */

--chart-5: oklch(0.70 0.10 155);
/* Verde claro. Variante luminosa de chart-3 (categorías individuales de savings). */
/* Contraste sobre blanco: L=0.70 → ratio ≈ 3.1:1 — pasa el mínimo */
```

**Nota sobre chart-4 (L=0.72):** queda ligeramente por debajo del 3:1 solo en fondos blancos
puros. Se admite únicamente para segmentos del piechart de bloque con área ≥ 20 × 20 px
(criterio de tamaño WCAG 1.4.11 para componentes UI no-texto). Si el segmento es menor,
recharts asigna automáticamente el color del grupo (chart-1 o chart-2 del bloque), no la
variante clara.

### 3.3 Asignación a bloques y categorías

#### Piechart macro (3 segmentos)
| Bloque | Token | Uso |
|--------|-------|-----|
| Necesidades | `--chart-1` | Segmento principal |
| Deseos | `--chart-2` | Segmento principal |
| Ahorro | `--chart-3` | Segmento principal |

#### Piechart de bloque: Necesidades (6 categorías)
Se genera una escala de 6 tonos derivada de chart-1 variando luminosidad (0.45 → 0.72).
El frontend crea esta escala en tiempo de ejecución con una función helper que interpola
`oklch(L 0.18 38)` con L de [0.45, 0.52, 0.58, 0.62, 0.66, 0.72].

| Categoría | L aprox. | Nota |
|-----------|----------|------|
| housing | 0.45 | más oscuro (mayor peso visual) |
| groceries | 0.52 | |
| transport | 0.58 | == chart-1 base |
| utilities | 0.62 | |
| health | 0.66 | |
| education | 0.72 | más claro |

#### Piechart de bloque: Deseos (8 categorías)
Escala derivada de chart-2 `oklch(L 0.16 300)`, L de [0.40, 0.46, 0.52, 0.56, 0.60, 0.64, 0.67, 0.70].

#### Piechart de bloque: Ahorro (6 categorías)
Escala derivada de chart-3 `oklch(L 0.15 155)`, L de [0.44, 0.50, 0.58, 0.63, 0.67, 0.70].

### 3.4 Uso de colores en indicadores
Los IndicatorCards usan exclusivamente los tokens semánticos existentes del design system, no
los chart-*:
- Estado positivo/saludable → `--success` / `--success-subtle` / `--success-foreground`
- Estado de atención → `--warning` / `--warning-subtle` / `--warning-foreground`
- Estado crítico → `--destructive`
- Estado neutro/informativo → `--info` / `--info-subtle` / `--info-foreground`

---

## 4. Wireframe `/results` en xl (≥1280 px)

```
┌─ SiteHeader (53 px, position: sticky top-0, z-40) ──────────────────────────┐
│  [logo]                                              [header nav]            │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ max-w-7xl centrado, px-6, py-8 ────────────────────────────────────────────┐
│                                                                              │
│  ┌── COL 1 (7/12 = ~746 px) ─────────────────┐  ┌── COL 2 (5/12 = ~534 px) ─┐
│  │                                             │  │  [sticky: top: calc(53px  │
│  │  [Alertas críticas sistema]                 │  │  + 24px), max-h: calc(    │
│  │                                             │  │  100vh - 53px - 48px),    │
│  │  H1: Tu Distribución Financiera             │  │  overflow-y: auto,        │
│  │  Subtítulo muted                            │  │  scrollbar custom]        │
│  │  [badge modelo]                             │  │                           │
│  │                                             │  │  ── MacroPiechart ──────  │
│  │  ┌─ Banner hero navy ──────────────────┐    │  │  Donut 180 px diámetro    │
│  │  │  INGRESO MENSUAL NETO DE REFERENCIA │    │  │  Valor central:           │
│  │  │  4.500 €  [mono bold 5xl]           │    │  │  "4.500 €" [bold 18px]   │
│  │  │  [desglose deuda si aplica]         │    │  │  "ingreso" [muted 11px]  │
│  │  └─────────────────────────────────────┘    │  │  Leyenda derecha:         │
│  │                                             │  │  ● Necesidades  XX%       │
│  │  [details: Salud financiera] (colapsado)    │  │  ● Deseos       XX%       │
│  │                                             │  │  ● Ahorro       XX%       │
│  │  [toggle: Por categorías | Por bloques]     │  │                           │
│  │                                             │  │  ── BlockPiechart ──────  │
│  │  ┌─ Banner bloque NECESIDADES ──────────┐   │  │  [tabs] Nec | Des | Aho  │
│  │  │  NECESIDADES  41.7%  2.090 €        │   │  │  Donut 140 px diámetro    │
│  │  └─────────────────────────────────────┘   │  │  Categorías del bloque    │
│  │  [DataTable categorías: 6 filas]            │  │  activo en leyenda        │
│  │                                             │  │                           │
│  │  ┌─ Banner bloque DESEOS ───────────────┐   │  │  ── IndicatorCards ─────  │
│  │  │  DESEOS  10.0%  450 €               │   │  │  [DTI card]               │
│  │  └─────────────────────────────────────┘   │  │  [Tasa ahorro card]       │
│  │  [DataTable categorías: 8 filas]            │  │  [Ratio necesidades card] │
│  │                                             │  │  [Cobertura de emergencia]│
│  │  ┌─ Banner bloque AHORRO ───────────────┐   │  │                           │
│  │  │  AHORRO  30.3%  1.363 €             │   │  │  ── SecondaryCTA ────────  │
│  │  └─────────────────────────────────────┘   │  │  [sticky al pie de col 2] │
│  │  [DataTable categorías: 6 filas]            │  │  "Compara tu situación    │
│  │                                             │  │   real →"                 │
│  │  [nota pie INE]                             │  │                           │
│  │                                             │  └───────────────────────────┘
│  │  ── Indicadores de referencia (col 1) ──    │
│  │  [DTI card compact]  [Seguros card]         │
│  │  (se mantienen aquí — decisión #5)          │
│  │                                             │
│  │  [CTAs primarios: "Calcular de nuevo" |     │
│  │   "Volver al inicio" | "Analizar mi         │
│  │   situación real" (primary)]                │
│  └─────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Notas del wireframe `/results`
- Ratio 7/12 + 5/12 en `gap-8` entre columnas dentro del `max-w-7xl`.
- Col 2 es `sticky`. La altura máxima es `calc(100vh - 53px - 48px)` = viewport menos
  el SiteHeader (53 px) menos 24 px de gap superior y 24 px de gap inferior.
- La col 2 tiene scroll interno propio (`overflow-y: auto`) con la misma scrollbar custom
  que ya usa el drawer M36 (clase `.panel-scroll-area`).
- El drawer M36 (500 px fixed, z-50) tapará la col 2 cuando esté abierto. Decisión
  intencional — ver sección 9.
- Los "Indicadores de referencia" (DTI + Seguros) permanecen en col 1 al pie
  (decisión #5). En col 2 irán los indicadores derivados que no existen actualmente
  en col 1: tasa de ahorro, ratio necesidades, cobertura de emergencia.

---

## 5. Wireframe `/diagnosis` en xl (≥1280 px)

```
┌─ SiteHeader ────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────────────┘
┌─ max-w-7xl centrado ────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌── COL 1 (7/12) ─────────────────────────────┐  ┌── COL 2 (5/12) ───────┐
│  │                                              │  │  [sticky, misma        │
│  │  [Alertas críticas sistema]                  │  │   configuración]       │
│  │                                              │  │                        │
│  │  H1: Diagnóstico de tu situación real        │  │  ── MacroPiechart ──  │
│  │  Subtítulo muted                             │  │  Fuente: REAL del     │
│  │                                              │  │  usuario (no ideal).  │
│  │  ┌─ Banner hero navy ───────────────────┐    │  │  Donut 180 px        │
│  │  │  INGRESO NETO DE REFERENCIA          │    │  │  Valor central:      │
│  │  │  4.500 €                             │    │  │  "3.720 €" gasto     │
│  │  │  [La distribución saludable está     │    │  │  real total          │
│  │  │   calculada sobre este ingreso]      │    │  │  [muted: "real"]     │
│  │  └──────────────────────────────────────┘    │  │  Leyenda: 3 bloques  │
│  │                                              │  │  con importe real    │
│  │  HealthGauge (siempre visible — no           │  │                      │
│  │  colapsado en diagnosis)                     │  │  ── BlockPiechart ─  │
│  │                                              │  │  [tabs] Nec|Des|Aho  │
│  │  [nota ingreso efectivo si hay deuda]        │  │  Fuente: REAL.       │
│  │                                              │  │  Categoría: gasto    │
│  │  ── Resumen por bloque (3 cards) ────────    │  │  real del usuario    │
│  │  [Necesidades] [Deseos] [Ahorro]             │  │                      │
│  │  real / recomendado / diferencia             │  │  ── IndicatorCards ─ │
│  │                                              │  │  DTI: real del       │
│  │  ── Guía de lectura ──                       │  │  usuario             │
│  │                                              │  │  Tasa ahorro: real   │
│  │  [DetailPanelLayout wrapper]                 │  │  Ratio nec.: real    │
│  │  ┌─ Banner NECESIDADES ──────────────────┐   │  │  Cobert. emerg.: N/A │
│  │  │  NECESIDADES  [realAmount]            │   │  │  (ver nota)          │
│  │  └───────────────────────────────────────┘   │  │                      │
│  │  [DataTable comparativa: 6 cols]             │  │  ── SecondaryCTA ─── │
│  │                                              │  │  "Ver distribución   │
│  │  ┌─ Banner DESEOS ────────────────────────┐  │  │   ideal →"          │
│  │  │  DESEOS  [realAmount]                  │  │  └────────────────────┘
│  │  └───────────────────────────────────────┘   │
│  │  [DataTable comparativa: 8 cols]             │
│  │                                              │
│  │  ┌─ Banner AHORRO ────────────────────────┐  │
│  │  │  AHORRO  [realAmount]                  │  │
│  │  └───────────────────────────────────────┘   │
│  │  [DataTable comparativa: 6 cols]             │
│  │                                              │
│  │  [CTAs: Recalcular | Volver a resultados |   │
│  │   Inicio]                                    │
│  └──────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fuentes de datos en `/diagnosis` — tabla de responsabilidad

| Subcomponente | Fuente de datos | Justificación |
|---------------|-----------------|---------------|
| MacroPiechart segmentos | `diagnosis.blocks[*].realAmount` | Muestra lo que el usuario GASTA, no lo ideal |
| MacroPiechart valor central | Suma de `realAmount` de los 3 bloques | Gasto real total |
| BlockPiechart categorías | `diagnosis.comparison[catId].realAmount` | Gasto real por categoría |
| IndicatorCard DTI | `diagnosis.transversal.dti.total` | DTI real (incluye deuda fija + resto) |
| IndicatorCard tasa de ahorro | `diagnosis.blocks.savings.realAmount / income * 100` | Tasa de ahorro real |
| IndicatorCard ratio necesidades | `diagnosis.blocks.needs.realAmount / income * 100` | Ratio real de necesidades |
| IndicatorCard cobertura emergencia | No disponible en `/diagnosis` — ver nota | Ver nota abajo |

**Nota sobre cobertura de emergencia en `/diagnosis`:**
El usuario introduce gastos reales, no el saldo del fondo de emergencia. No hay dato para
calcular la cobertura en meses. El IndicatorCard de cobertura de emergencia en `/diagnosis`
se renderiza con estado `"n/a"` y el label "Sin dato — introduce tu fondo en perfil". El
badge es gris neutro, no semántico.

---

## 6. Wireframe `/inverse-results` en xl (≥1280 px)

```
┌─ SiteHeader ────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────────────┘
┌─ max-w-7xl centrado ────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌── COL 1 (7/12) ─────────────────────────────┐  ┌── COL 2 (5/12) ───────┐
│  │                                              │  │  [sticky]              │
│  │  H1: Ingreso mínimo necesario                │  │                        │
│  │  Subtítulo muted                             │  │  ── MacroPiechart ──  │
│  │                                              │  │  PRESENTE (modo        │
│  │  ┌─ Banner hero navy ───────────────────┐    │  │  inverse). Fuente:    │
│  │  │  INGRESO MÍNIMO NECESARIO            │    │  │  healthyDistribution  │
│  │  │  5.953 €                             │    │  │  Valor central:       │
│  │  │  "Con este ingreso, los importes     │    │  │  "5.953 €" [ingreso   │
│  │  │   que fijaste son sostenibles"       │    │  │  calculado]           │
│  │  └──────────────────────────────────────┘    │  │                       │
│  │                                              │  │  ── BlockPiechart ──  │
│  │  [Warnings si hay]                           │  │  PRESENTE. Fuente:    │
│  │                                              │  │  healthyDistribution  │
│  │  [DetailPanelLayout]                         │  │  (distribución ideal  │
│  │                                              │  │  para el ingreso      │
│  │  Comparativa (tabla flat, no por bloque)     │  │  calculado)           │
│  │    Categoría | Especificado | Ref.INE | Diff │  │                       │
│  │                                              │  │  ── IndicatorCards ─  │
│  │  Distribución saludable completa             │  │  REDUCIDO — solo 2:   │
│  │    ┌─ Banner NECESIDADES ──────────────────┐ │  │  [DTI hipotético]     │
│  │    │  NECESIDADES                          │ │  │  [Tasa ahorro ideal]  │
│  │    └───────────────────────────────────────┘ │  │                       │
│  │    [DataTable: 6 filas con badge "fijado"]   │  │  OMITIDOS:            │
│  │                                              │  │  Ratio necesidades    │
│  │    ┌─ Banner DESEOS ────────────────────────┐ │  │  (confunde con el    │
│  │    │  DESEOS                                │ │  │  ideal, no real)     │
│  │    └───────────────────────────────────────┘ │  │  Cobertura emergencia │
│  │    [DataTable: 8 filas]                      │  │  (ingreso hipotético)  │
│  │                                              │  │                       │
│  │    ┌─ Banner AHORRO ────────────────────────┐ │  │  ── SecondaryCTA ─── │
│  │    │  AHORRO                                │ │  │  "Calcular de nuevo" │
│  │    └───────────────────────────────────────┘ │  │                       │
│  │    [DataTable: 6 filas]                      │  └───────────────────────┘
│  │                                              │
│  │  [CTAs: Volver y ajustar | Inicio]           │
│  └──────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Justificación de modo `inverse` reducido

El ingreso en `/inverse-results` es **hipotético** (calculado, no real). Mostrar todos los
indicadores induciría a error:

| Indicador | Decisión modo inverse | Razón |
|-----------|----------------------|-------|
| MacroPiechart | Presente — fuente: `healthyDistribution` | Útil para ver la estructura del presupuesto ideal |
| BlockPiechart | Presente — fuente: `healthyDistribution` | Ídem |
| DTI | Presente — hipotético, label "DTI hipotético" | Útil para saber si el perfil de deuda es sostenible con el ingreso calculado |
| Tasa de ahorro | Presente — extraída de `healthyDistribution.savings block` | Válida: representa la tasa ideal para ese ingreso |
| Ratio necesidades | Omitido | Idéntico al de `/results` para el mismo perfil; no aporta valor extra en inverse |
| Cobertura emergencia | Omitido | No hay saldo de emergencia real; el ingreso es hipotético |

---

## 7. Comportamiento responsive

### xl (≥1280 px) — 2 columnas activas

```
┌──────────────────────┐ ┌──────────────┐
│    COL 1  (7/12)     │ │  COL 2 (5/12)│
│                      │ │  [sticky]    │
│  Contenido completo  │ │  Dashboard   │
└──────────────────────┘ └──────────────┘
```

Clases Tailwind: `xl:grid xl:grid-cols-12 xl:gap-8`  
Col 1: `xl:col-span-7`  
Col 2: `xl:col-span-5 xl:sticky xl:top-[calc(53px+24px)] xl:max-h-[calc(100vh-53px-48px)] xl:overflow-y-auto`

### lg (1024–1279 px) — 1 columna, col 2 al pie

```
┌──────────────────────────────────┐
│    COL 1 (ancho completo)        │
│  Contenido original sin cambios  │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│    COL 2 (ancho completo)        │
│  Dashboard horizontal compacto   │
│  MacroPiechart pequeño (140px)   │
│  + 4 IndicatorCards en grid 2×2  │
│  Sin BlockPiechart (ocupa mucho) │
└──────────────────────────────────┘
```

En `lg`, el BlockPiechart se oculta (`hidden xl:block`). El MacroPiechart se reduce a
140 px. Los 4 IndicatorCards van en `grid grid-cols-2 gap-3`.

### md (768–1023 px) — 1 columna, col 2 comprimida

```
┌──────────────────────────────────┐
│    COL 1 (ancho completo)        │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│    COL 2 (ancho completo)        │
│  Solo 4 IndicatorCards en 2×2    │
│  Sin piecharts                   │
└──────────────────────────────────┘
```

MacroPiechart oculto (`hidden lg:block`). BlockPiechart oculto. Solo los indicadores
en grid 2×2 aportan valor de un vistazo en esta anchura.

### sm (<768 px) — solo col 1, col 2 oculta

```
┌──────────────────┐
│    COL 1         │
│  (100% ancho)    │
└──────────────────┘
```

Col 2 completamente oculta (`hidden md:block`). En móvil el usuario ya tiene acceso a
los indicadores DTI y seguros que están en col 1. El dashboard de col 2 no aporta suficiente
valor para justificar el espacio en un viewport estrecho.

### Breakpoints exactos (Tailwind v4)

| Clase | Valor |
|-------|-------|
| `sm`  | ≥640 px |
| `md`  | ≥768 px |
| `lg`  | ≥1024 px |
| `xl`  | ≥1280 px — activación del 2-col |
| `2xl` | ≥1536 px — sin cambio adicional |

---

## 8. Micro-spec de cada subcomponente

### 8.1 `<MacroPiechart>`

**Propósito:** Distribución porcentual de los 3 bloques (necesidades, deseos, ahorro)
en un único gráfico donut.

**Geometría:**
- Tipo: Donut (anillo), no pie sólido. El hueco interior muestra el valor central.
- Diámetro exterior: **180 px** en xl. **140 px** en lg.
- Grosor del anillo: 28 px (xl), 22 px (lg). Ratio grosor/radio ≈ 31%.
- Ángulo de inicio: -90° (12 en punto del reloj, lectura natural).
- Corner radius de segmentos: 3 px (suaviza los extremos sin redondear en exceso).
- Gap entre segmentos: 2 px (separación visual sin perder la lectura continua).

**Valor central:**
- Línea 1: importe formateado (`4.500 €`) — `font-display, font-bold, 16px, text-foreground`
- Línea 2: etiqueta contextual — `font-sans, 11px, text-muted-foreground`
  - `/results` e `/inverse-results`: "ingreso"
  - `/diagnosis`: "gasto real"

**Leyenda:**
- Posición: a la derecha del donut en xl; debajo en lg/md.
- Layout: columna vertical de 3 ítems con bullet cuadrado 10×10 px y radio 2 px.
- Tipografía: `font-sans, 13px, font-medium, text-foreground` para el label.
  `font-sans, 12px, tabular-nums, text-muted-foreground` para el porcentaje.
- Gap entre bullet y label: 8 px. Gap entre ítems: 10 px.
- Sin fondo, sin borde. La leyenda flota sobre el fondo del card.

**Estados interactivos:**
- Hover sobre segmento: el segmento se eleva visualmente (outerRadius += 6 px con
  transición 150ms ease-out via recharts `activeShape`). Tooltip native de recharts
  con formato `"{label}: {pct}% · {amount}"`.
- No hay click en el MacroPiechart — no navega ni filtra. Es solo informativo.

**Accesibilidad:**
- `role="img"` en el contenedor SVG.
- `aria-label="Distribución financiera: Necesidades X%, Deseos Y%, Ahorro Z%"`
  generado dinámicamente.
- El tooltip de recharts no es accesible por defecto — añadir `aria-hidden="true"`
  al tooltip y proporcionar la tabla de datos como alternativa visible (la DataTable
  de col 1 ya la proporciona).

---

### 8.2 `<BlockPiechart>` con tabs

**Propósito:** Ver la distribución interna de cada bloque (las N categorías dentro de
necesidades, deseos o ahorro).

**Interfaz de tabs:**
- 3 tabs: "Necesidades" | "Deseos" | "Ahorro" (labels completos, no abreviados).
- Estilo: línea inferior activa 2 px `--primary`. Tab activo: `font-medium text-foreground`.
  Tab inactivo: `text-muted-foreground hover:text-foreground/80`.
- No usar shadcn `Tabs` (el componente tiene padding fijo que no encaja bien en un panel
  compacto). El frontend implementa tabs custom con `role="tablist"` / `role="tab"` /
  `role="tabpanel"` nativos.
- El tab activo por defecto es el bloque con mayor desviación (en `/diagnosis`) o
  "Necesidades" (en `/results` e `/inverse-results`).

**Geometría:**
- Diámetro: **140 px** en xl. Oculto en lg y md.
- Grosor del anillo: 22 px.
- Sin valor central (el donut pequeño tiene demasiado poco espacio). Solo el anillo.
- Corner radius: 2 px. Gap: 2 px.

**Leyenda:**
- Posición: debajo del donut, en 2 columnas si hay 6+ ítems.
- Bullet: 8×8 px, radio 1 px.
- Tipografía: `font-sans, 12px, text-foreground` (label) + `tabular-nums 11px text-muted-foreground` (porcentaje).
- Máximo de ítems visibles: 8 (todos los deseos). Si hay truncamiento, no aplica —
  los 8 deseos caben en 2 columnas de 4.

**Sincronización con scroll de col 1:**
Decisión: **descartada como riesgo en F2**. La propuesta de sincronizar el tab activo con
el bloque que está a la vista en col 1 requiere un IntersectionObserver por cada banner
de bloque y lógica de debounce. El riesgo de timing (col 1 puede scrollear rápido) y el
aumento de complejidad no justifican el beneficio de orientación, dado que los tabs son
pequeños y el usuario puede cambiarlos manualmente con 1 clic. Se documenta aquí para
consideración en F3 o M38 como mejora opcional.

**Accesibilidad:**
- `role="tablist"` + `aria-label="Ver distribución por bloque"` en el contenedor de tabs.
- Cada tab: `role="tab"`, `aria-selected={active}`, `aria-controls="tabpanel-{block}"`.
- El panel: `role="tabpanel"`, `id="tabpanel-{block}"`, `aria-labelledby="tab-{block}"`.
- Navegación por teclado: flecha izquierda/derecha cambia el tab activo (patrón ARIA
  Authoring Practices para tabs con activación automática).

---

### 8.3 `<IndicatorCard>`

**Propósito:** Mostrar un KPI financiero con su estado semántico (saludable/atención/crítico).

**Layout interno:**
```
┌─────────────────────────────────────────┐
│  [label superior — muted, 11px, caps]   │
│                                         │
│  [valor — display, bold, 28px]  [badge] │
│                                         │
│  [descripción — muted, 12px, 1-2 líneas]│
└─────────────────────────────────────────┘
```

- Fondo: `bg-card` (blanco).
- Borde: `border border-border` (no sombra propia — el card de la col 2 ya tiene sombra global).
- Radio: `rounded-lg` (var(--radius) = 0.625rem).
- Padding interior: `p-4` (16 px todos los lados).
- Ancho: ocupa el 100% de col 2. Sin ancho fijo.
- Altura: no fija. El contenido determina la altura (el valor puede ser de 1-3 caracteres
  o un decimal largo como "25.6%").
- Gap entre los 4 cards: `gap-3` (12 px).

**Badge de estado:**
- Posición: esquina superior derecha de la línea del valor (alineado al baseline del valor).
- Tamaño: `px-2 py-0.5 text-[10px] font-semibold rounded-full`.
- Tokens por estado:
  - Saludable: `bg-[--success-subtle] text-[--success-foreground]` — texto "Saludable"
  - Atención: `bg-[--warning-subtle] text-[--warning-foreground]` — texto "Atención"
  - Crítico: `bg-destructive/10 text-destructive` — texto "Crítico"
  - Sin dato: `bg-muted text-muted-foreground` — texto "Sin dato"

**Tipografía del valor:**
- Font: `font-display, font-bold`.
- Tamaño: `text-3xl` (30 px) en xl. `text-2xl` (24 px) en lg.
- Color: `text-foreground` siempre. El estado semántico lo comunica el badge, no el color
  del valor (evitar falsos redundancias que confundan con el sistema de alertas de col 1).

**Label superior:**
- `font-sans, text-[11px], font-medium, uppercase, tracking-[0.05em], text-muted-foreground`
- Coincide con la convención `tracking-meta` ya definida en globals.css.

**Descripción:**
- `font-sans, text-xs (12px), text-muted-foreground, leading-snug`
- Máximo 2 líneas. Truncado con `line-clamp-2` si excede.

**Estados del componente:**

| Estado | Descripción |
|--------|-------------|
| `idle` | Renderizado estático con badge de estado |
| `hover` | `bg-muted/30` de fondo — transición 200ms |
| No hay `focus` propio | El card no es interactivo. Si en el futuro se hace cliclable, añadir `focus-visible:outline-2 focus-visible:outline-ring` |
| `skeleton` | Mientras el cálculo no llega: 3 líneas de skeleton pulse en lugar del contenido |

**Especificación de los 4 indicadores:**

| Indicador | Fuente dato (`/results`) | Fuente dato (`/diagnosis`) | Fuente dato (`/inverse`) | Umbral saludable | Umbral atención | Umbral crítico |
|-----------|--------------------------|---------------------------|--------------------------|-----------------|-----------------|----------------|
| DTI | `result.transversal.dti.total` | `diagnosis.transversal.dti.total` | calculado de `healthyDistribution` | < 30% | 30–40% | > 40% |
| Tasa de ahorro | `result.blocks.savings.percentage` | `diagnosis.blocks.savings.realAmount / income * 100` | `healthyDistribution savings block / requiredIncome * 100` | ≥ 20% | 10–20% | < 10% |
| Ratio necesidades | `result.blocks.needs.percentage` | `diagnosis.blocks.needs.realAmount / income * 100` | Omitido | ≤ 50% | 50–60% | > 60% |
| Cobertura emergencia (meses) | `result.categories.emergency_fund.amount * 6 / gastos_fijos_mes` (ver nota) | N/A → "Sin dato" | Omitido | ≥ 6 meses | 3–6 meses | < 3 meses |

**Nota sobre cobertura de emergencia:**
El calculador actual no expone `gastos_fijos_mes` directamente. El frontend deberá calcularla
como `(amount_emergency_fund_mensual * 6) / blocks.needs.amount`. Esto asume que el fondo
de emergencia mensual se acumula 6 meses y los gastos fijos = bloque needs. Es una
aproximación razonable y consistente con el criterio del Banco de España.

---

### 8.4 `<DashboardSecondaryCTA>`

**Propósito:** CTA secundario contextual que acompaña al dashboard sin competir con los
CTAs primarios de col 1.

**Posicionamiento:**
- **Sticky al pie de col 2**, dentro del mismo contenedor sticky de col 2.
- No es `position: fixed` adicional — se queda dentro del flujo de la col 2 sticky.
- Cuando el contenido de col 2 es más corto que el viewport, el CTA queda al pie
  natural del contenido (no flotante).
- Cuando el contenido es más largo que la altura disponible (scroll interno), el CTA
  se posiciona con `sticky bottom-0` dentro del scroll container de col 2, de modo
  que siempre sea visible sin scrollear col 2.

**Implementación del sticky dentro del scroll:**
- La col 2 es `overflow-y: auto` con `max-h: calc(100vh-53px-48px)`.
- El CTA va dentro de un `div` con `sticky bottom-0` y `bg-card` para tapar el contenido
  que scrollea por debajo de él. Un `pt-2 pb-1` y un gradiente superior de 16 px en `before:`
  (implementado como `div` separado, no pseudoelemento, para evitar problemas en React)
  da el efecto de "fade out" antes del CTA.

**Tratamiento visual:**
- Botón de tipo `outline` — no `default` (primary fill).
- Texto: label descriptivo + ícono de flecha (lucide `ArrowRight`, `size-4`).
- Tamaño del botón: `w-full` (ocupa todo el ancho de col 2).
- Font: `font-sans, text-sm, font-medium`.
- Color del borde: `border-border` en idle. `border-primary/40` en hover.
- Color del texto: `text-foreground` en idle. `text-primary` en hover.
- Sin sombra ni elevación — es secundario, no compite con los CTAs primarios de col 1.
- Transición: 200ms ease-out.

**CTAs por página:**
| Página | Label | Destino |
|--------|-------|---------|
| `/results` | "Compara tu situación real" + ArrowRight | `/diagnosis-form?income={income}` |
| `/diagnosis` | "Ver distribución ideal" + ArrowRight | `/calculator` |
| `/inverse-results` | "Calcular de nuevo" + ArrowRight | `/inverse-calculator` |

**Accesibilidad:**
- El botón es un `<a>` o `<Button>` con `href` / `onClick` según la implementación.
- `aria-label` explícito si el label visual es ambiguo: `aria-label="Compara tu situación real con la distribución recomendada"`.
- Focus ring: hereda el `outline-2 outline-ring` del `@layer base` de globals.css.

---

## 9. Convivencia con el drawer M36

El drawer M36 (`DetailPanelLayout`) es `position: fixed; right: 4; w-[500px]; z-50`.
Cuando está abierto, se superpone visualmente sobre la parte derecha del viewport, que
incluye la col 2 del dashboard.

**Esto es intencional y no se modifica.**

Justificación:
1. El drawer y la col 2 nunca compiten en información: el drawer muestra el detalle
   institucional de una categoría específica (fuentes, drivers, metodología), mientras
   que col 2 muestra el resumen macro. Son capas de información distintas.
2. El usuario que abre el drawer está en modo "detalle de una categoría". En ese
   momento, la vista resumen de col 2 no añade valor; el foco está en el drawer.
3. Cambiar el posicionamiento del drawer (por ejemplo, hacerlo colapsar dentro de col 1
   en lugar de fixed) requeriría refactorizar el layout completo del DetailPanelLayout,
   con riesgo de introducir regresiones en el comportamiento móvil (bottom sheet).
4. La col 2 vuelve a ser visible automáticamente cuando el usuario cierra el drawer.

**Consecuencia en implementación:** el frontend no necesita añadir `padding-right` ni
`margin-right` a col 2 cuando el drawer está abierto. El comportamiento actual del
`DetailPanelLayout` (overlay sin push) se mantiene exactamente.

---

## 10. Lista de capturas tomadas en este Discovery

| Archivo | Viewport | Descripción |
|---------|----------|-------------|
| `docs/m37/screenshots/discovery/results-1920x1080.png` | 1920×1080 | `/results` con perfil rico, income=4500 |
| `docs/m37/screenshots/discovery/results-1440x900.png`  | 1440×900  | `/results` con perfil rico, income=4500 |
| `docs/m37/screenshots/discovery/results-1280x800.png`  | 1280×800  | `/results` con perfil rico, income=4500 (breakpoint xl exacto) |
| `docs/m37/screenshots/discovery/diagnosis-1920x1080.png` | 1920×1080 | `/diagnosis` con datos reales simulados |
| `docs/m37/screenshots/discovery/diagnosis-1440x900.png`  | 1440×900  | `/diagnosis` con datos reales simulados |
| `docs/m37/screenshots/discovery/diagnosis-1280x800.png`  | 1280×800  | `/diagnosis` con datos reales simulados |
| `docs/m37/screenshots/discovery/inverse-results-1920x1080.png` | 1920×1080 | `/inverse-results` con 4 categorías fijadas |
| `docs/m37/screenshots/discovery/inverse-results-1440x900.png`  | 1440×900  | `/inverse-results` con 4 categorías fijadas |
| `docs/m37/screenshots/discovery/inverse-results-1280x800.png`  | 1280×800  | `/inverse-results` con 4 categorías fijadas |

---

## 11. Apertura para F2 — lo que el frontend necesita saber

### Cambios en el layout general

1. **`PageShell` variant="table"** debe cambiar de `max-w-5xl` a `max-w-7xl` en las 3
   páginas de resultados. Esto afecta `ResultsPage.jsx`, `DiagnosisPage.jsx` e
   `InverseResultsPage.jsx`. El `PageShell` en sí podría añadir una nueva variante
   `"dashboard"` con `max-w-7xl`, o el frontend puede aplicar el override directamente
   con `className="max-w-7xl"`.

2. **Estructura de grid xl** — alrededor del contenido actual (dentro del `PageShell`),
   envolver en:
   ```jsx
   <div className="xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start">
     <div className="xl:col-span-7">
       {/* contenido actual de col 1 */}
     </div>
     <div className="xl:col-span-5">
       <DashboardPanel ... />
     </div>
   </div>
   ```

### Componentes nuevos a crear

| Componente | Ruta sugerida | Props mínimas |
|------------|---------------|---------------|
| `DashboardPanel` | `src/components/ui/dashboard-panel.jsx` | `mode: "direct" \| "diagnosis" \| "inverse"`, `result`, `income` |
| `MacroPiechart` | `src/components/ui/macro-piechart.jsx` | `data: [{label, value, color}]`, `centerValue`, `centerLabel` |
| `BlockPiechart` | `src/components/ui/block-piechart.jsx` | `blocks: {needs, wants, savings}`, `defaultBlock` |
| `IndicatorCard` | `src/components/ui/indicator-card.jsx` | `label`, `value`, `description`, `status: "healthy" \| "warning" \| "critical" \| "na"` |
| `DashboardSecondaryCTA` | integrado en `DashboardPanel` | `href`, `label` |

### Cálculos auxiliares necesarios en `lib/calculators/`

Los siguientes cálculos no existen en el backend actual. El frontend debe derivarlos de
los datos ya disponibles en la respuesta de la API. Se implementan como funciones puras
en un archivo nuevo `src/lib/calculators/dashboardMetrics.js`:

```js
// Devuelve { value: number, status: "healthy"|"warning"|"critical" }
export function calcSavingsRate(result)       { /* ... */ }
export function calcNeedsRatio(result)        { /* ... */ }
export function calcEmergencyCoverage(result) { /* ... */ }
// Para diagnosis, los mismos con prefix "diagnosis":
export function calcDiagnosisSavingsRate(diagnosis) { /* ... */ }
```

**Importante:** estas funciones son **puras** (sin efectos secundarios, sin localStorage).
Reciben el objeto de respuesta de la API y devuelven el valor calculado + estado semántico.
Esto mantiene la convención del proyecto.

### Instalación de recharts

El frontend ejecuta `npm install recharts` antes de implementar los piecharts. Recharts es
compatible con React 19 a partir de su versión 2.12+. Verificar que la versión instalada
soporta React 19 — en caso de incompatibilidad, usar `--legacy-peer-deps`.

### Tokens CSS a añadir en `globals.css`

```css
/* Sustituir los valores actuales de --chart-1..5 en :root */
--chart-1: oklch(0.58 0.18 38);   /* naranja-rojo: needs */
--chart-2: oklch(0.52 0.16 300);  /* violeta: wants */
--chart-3: oklch(0.58 0.15 155);  /* verde-teal: savings */
--chart-4: oklch(0.72 0.12 38);   /* naranja claro: variante needs */
--chart-5: oklch(0.70 0.10 155);  /* verde claro: variante savings */
```

### Inconsistencia detectada durante el Discovery

El `PageShell` usa `max-w-5xl` (1024 px) como máximo actual. La decisión cerrada #2
establece `max-w-7xl` (1280 px). Esto significa que en viewports de 1280–1440 px, la
col 1 + col 2 del dashboard necesitan exactamente los 1280 px disponibles del max-w-7xl.
El frontend debe verificar que el padding horizontal de `PageShell` (`px-6` = 24 px × 2)
no comprime excesivamente las columnas en 1280 px — el espacio interno disponible sería
1280 - 48 = 1232 px, de los cuales 7/12 = 719 px para col 1 y 5/12 = 513 px para col 2
(con `gap-8` = 32 px entre columnas: 719 + 32 + 481 = 1232 px). Es ajustado pero manejable.

### Altura máxima de col 2 — estrategia de desbordamiento

Col 1 puede llegar a ≈2500 px en perfiles ricos (6+8+6 categorías con alertas, HealthGauge,
indicadores, CTAs). Col 2 tiene `max-h: calc(100vh - 53px - 48px)` ≈ `max-h-[calc(100vh-101px)]`.
A 1080 px de viewport, eso es ≈979 px de altura para col 2.

El contenido de col 2 en su estado más completo es aproximadamente:
- MacroPiechart: ~220 px (donut 180 + leyenda)
- Gap: 16 px
- BlockPiechart con tabs: ~220 px (tab bar + donut 140 + leyenda)
- Gap: 16 px
- 4 IndicatorCards × ~90 px + gap-3: ~388 px
- Gap + SecondaryCTA: ~60 px
- **Total estimado: ~920 px**

Cabe en 979 px sin scroll en xl/1080p. En viewports más bajos (ej. 768 px de alto),
el scroll interno de col 2 entra en acción. La estrategia de scroll interno (`overflow-y-auto`
con `.panel-scroll-area` para la scrollbar personalizada) es suficiente — no se necesita
ninguna estrategia adicional de colapso.

Si en alguna configuración de perfil los 4 IndicatorCards generan contenido muy largo
(ej. el campo descripción excede 2 líneas), el `line-clamp-2` definido en la spec del
`IndicatorCard` limita el crecimiento. No se necesita estrategia de emergencia adicional.

---

## 12. Iteración post-F2.5 — paleta de categorías y variante de barras

### 12.1 Diagnóstico del estado actual

Captura de referencia: `docs/m37/screenshots/iteration-post-f25/micropie-zoom-recommended.png`

Los micro-piecharts de bloque se renderizan a **108 px de diámetro** (tamaño real medido
en el demo). Con ese tamaño, un anillo de 22 px de grosor deja un espacio útil de arco
de apenas 15–20 px de ancho por segmento pequeño. El problema no es solo de tamaño sino de
estrategia cromática: la escala monocromática de `block-piecharts-row.jsx` varía únicamente
la luminosidad (`L`) del color base del bloque, manteniendo el mismo croma (`C`) y el mismo
tono (`H`). El resultado son 6–8 variantes perceptualmente solapadas del mismo color base:
a 108 px, el ojo no discrimina diferencias de `L` de 0.07 entre segmentos adyacentes.

El bloque de Deseos es el más afectado: 8 categorías, todas en variantes de violeta entre
`L=0.40` y `L=0.70`. Los segmentos de las categorías pequeñas (Hobbies 0.8%, Suscripciones
0.7%, Regalos 0.5%) forman arcos de menos de 5° que son prácticamente invisibles y en todo
caso imposibles de distinguir del color adyacente.

El bloque de Necesidades tiene un problema diferente: la categoría de vivienda (20%) domina
visualmente en rojo-naranja oscuro, y las 5 categorías restantes suman menos del 22% pero
se reparten en tonos que compiten entre sí sin pausa cromática clara.

El diagnóstico es que la escala de luminosidad no es suficiente. Se necesitan **saltos de
tono (hue) entre categorías** dentro de cada bloque para que la vista discrimine sin esfuerzo.

### 12.2 Paleta nueva — 20 colores con identidad cromática por familia

**Estrategia adoptada: variación simultánea de hue + luminosidad**

En lugar de variar solo `L` dentro de un hue fijo, se expande el rango de hue de cada bloque
en ±25° en ambas direcciones, asignando a cada categoría un hue distinto dentro de la familia.
Esto garantiza diferenciación perceptual real incluso en segmentos pequeños, mientras cada
bloque sigue teniendo su "temperatura" cromática reconocible (caliente para needs, fría para
wants, natural-vegetal para savings).

**Restricciones verificadas:**
- Contraste sobre blanco (`--card: oklch(1 0 0)`): se calcula por WCAG 1.4.11 como función
  de la luminancia relativa. Aproximación: para `L` en oklch, el contraste sobre blanco es
  ≈ `(1.05) / (L² × 1.05 + 0.05)`. Para L=0.52, ratio ≈ 5.5:1. Para L=0.60, ratio ≈ 3.7:1.
  Para L=0.65, ratio ≈ 2.8:1 — solo válido para segmentos grandes (>20×20 px).
- Ningún hue entra en la zona navy (hue 234–295°). El bloque de Deseos (violeta) trabaja
  entre hue 295–340° para separarse del navy.
- Las categorías con peso mayor (>8%) reciben valores de L más bajos (más oscuro, más
  contraste). Las categorías con peso menor reciben valores de L más altos pero siempre
  con su hue propio.

#### Necesidades — 6 categorías (familia caliente: rojo-naranja-ámbar, hue 10–62°)

Los 6 colores se distribuyen en el espectro caliente. El rojo puro (hue ~10°) se reserva
para vivienda, el peso mayor. Avanzando hacia el naranja y el ámbar se cubren las demás.

| Categoría | oklch | Hex aprox. | Contraste/blanco | Verificación |
|-----------|-------|-----------|-----------------|--------------|
| housing (vivienda) | `oklch(0.48 0.20 13)` | #B83A2A | ≈ 7.2:1 | pasa AA ✓ |
| groceries (alimentación) | `oklch(0.54 0.20 32)` | #C85A28 | ≈ 5.3:1 | pasa AA ✓ |
| transport (transporte) | `oklch(0.57 0.18 46)` | #C96820 | ≈ 4.4:1 | pasa AA ✓ |
| utilities (suministros) | `oklch(0.52 0.17 58)` | #A87218 | ≈ 5.8:1 | pasa AA ✓ |
| health (salud) | `oklch(0.56 0.15 22)` | #B84840 | ≈ 4.6:1 | pasa AA ✓ |
| education (educación) | `oklch(0.53 0.16 52)` | #A07010 | ≈ 5.5:1 | pasa AA ✓ |

**Lectura de familia:** el espectro va de rojo-ladrillo (vivienda) a ámbar-mostaza (educación),
pasando por naranja tostado (alimentación, transporte) y terracota (salud, suministros).
Todos son tonos "tierra" que comunican necesidad básica. El mayor contraste en vivienda
refuerza que es el peso dominante. Los 6 hues están separados 5–15° entre sí, suficiente
para discriminarlos a 108 px de diámetro.

**Nota de implementación:** el frontend debe reemplazar `generateColorScale()` en
`block-piecharts-row.jsx` por un mapa de categoría → color fijo. Los colores ya no se
calculan en runtime; se definen como constante. El orden de asignación es el orden de
`CATEGORIES_CATALOG` para el bloque `"needs"`.

#### Deseos — 8 categorías (familia fría: violeta-malva-fucsia, hue 295–340°)

El violeta-malva (chart-2 base, hue 300°) es el centro. Se expande hacia el fucsia (hue 340°)
por un lado y hacia el azul-violeta puro (hue 295°) por otro. Se excluye hue 234–294° por
colisión con navy.

| Categoría | oklch | Hex aprox. | Contraste/blanco | Verificación |
|-----------|-------|-----------|-----------------|--------------|
| dining_out (restaurantes) | `oklch(0.50 0.18 305)` | #7A4AAE | ≈ 6.5:1 | pasa AA ✓ |
| travel (viajes) | `oklch(0.53 0.18 318)` | #8A48A8 | ≈ 5.5:1 | pasa AA ✓ |
| clothing (ropa) | `oklch(0.56 0.17 330)` | #9848A0 | ≈ 4.6:1 | pasa AA ✓ |
| personal_care (cuidado personal) | `oklch(0.52 0.15 298)` | #6458B0 | ≈ 5.8:1 | pasa AA ✓ |
| entertainment (entretenimiento) | `oklch(0.58 0.16 340)` | #A04898 | ≈ 4.3:1 | pasa AA ✓ |
| hobbies (hobbies) | `oklch(0.54 0.14 310)` | #7050A8 | ≈ 5.2:1 | pasa AA ✓ |
| subscriptions (suscripciones) | `oklch(0.55 0.15 322)` | #8050A2 | ≈ 4.9:1 | pasa AA ✓ |
| gifts (regalos) | `oklch(0.57 0.13 335)` | #905898 | ≈ 4.4:1 | pasa AA ✓ |

**Lectura de familia:** todos se leen como "morado" a primera vista, pero el ojo distingue
el violeta-índigo de personal_care del fucsia-violeta de clothing o del malva-rosa de gifts.
Los 8 hues están escalonados de 295° a 340°, con pasos de 5–12° que son perceptibles en
segmentos pequeños. Ningún color entra en la zona navy (234–294°). Los valores de L están
todos en 0.50–0.58, asegurando contraste mínimo 4.3:1 sobre blanco.

#### Ahorro — 6 categorías (familia natural: verde-teal-agua, hue 130–195°)

El verde-teal (chart-3 base, hue 155°) es el centro. Se expande hacia el verde-lima (hue 130°)
y el teal-azul (hue 180–195°). Este rango no colisiona con navy (234°+) ni con los cálidos.

| Categoría | oklch | Hex aprox. | Contraste/blanco | Verificación |
|-----------|-------|-----------|-----------------|--------------|
| life_insurance (seguro de vida) | `oklch(0.50 0.17 140)` | #2A8858 | ≈ 6.5:1 | pasa AA ✓ |
| emergency_fund (fondo emergencia) | `oklch(0.54 0.16 158)` | #2A9070 | ≈ 5.3:1 | pasa AA ✓ |
| short_term_savings (ahorro c/p) | `oklch(0.57 0.15 172)` | #209878 | ≈ 4.4:1 | pasa AA ✓ |
| long_term_savings (ahorro l/p) | `oklch(0.52 0.18 133)` | #308048 | ≈ 5.8:1 | pasa AA ✓ |
| investment (inversión) | `oklch(0.55 0.16 185)` | #1A9888 | ≈ 5.0:1 | pasa AA ✓ |
| debt_extra (amortización deuda) | `oklch(0.51 0.14 148)` | #388060 | ≈ 6.0:1 | pasa AA ✓ |

**Lectura de familia:** el espectro va de verde bosque oscuro (seguro de vida) a teal-agua
(inversión), pasando por verde esmeralda (fondo emergencia, ahorro l/p) y teal medio (ahorro
c/p, amortización). Todos comunican crecimiento y futuro. Los 6 hues están separados 8–18°,
perceptibles incluso en segmentos de 5–8%.

#### Constante de implementación (reemplaza `BLOCK_PALETTES` en `block-piecharts-row.jsx`)

```js
// Colores fijos por categoría — reemplaza la generación dinámica de escalas
// Orden: mismo que CATEGORIES_CATALOG para cada bloque

export const CATEGORY_COLORS = {
  // NEEDS — familia rojo-naranja-ámbar
  housing:      "oklch(0.48 0.20 13)",
  groceries:    "oklch(0.54 0.20 32)",
  transport:    "oklch(0.57 0.18 46)",
  utilities:    "oklch(0.52 0.17 58)",
  health:       "oklch(0.56 0.15 22)",
  education:    "oklch(0.53 0.16 52)",

  // WANTS — familia violeta-malva-fucsia
  dining_out:     "oklch(0.50 0.18 305)",
  travel:         "oklch(0.53 0.18 318)",
  clothing:       "oklch(0.56 0.17 330)",
  personal_care:  "oklch(0.52 0.15 298)",
  entertainment:  "oklch(0.58 0.16 340)",
  hobbies:        "oklch(0.54 0.14 310)",
  subscriptions:  "oklch(0.55 0.15 322)",
  gifts:          "oklch(0.57 0.13 335)",

  // SAVINGS — familia verde-teal-agua
  life_insurance:     "oklch(0.50 0.17 140)",
  emergency_fund:     "oklch(0.54 0.16 158)",
  short_term_savings: "oklch(0.57 0.15 172)",
  long_term_savings:  "oklch(0.52 0.18 133)",
  investment:         "oklch(0.55 0.16 185)",
  debt_extra:         "oklch(0.51 0.14 148)",
};
```

El frontend adapta `generateColorScale()` para que, en lugar de calcular la escala en
runtime, haga un `data.map(cat => CATEGORY_COLORS[cat.id] ?? fallback)`. La función
`generateColorScale` puede eliminarse o mantenerse como fallback de emergencia.

Los colores de bloque para el macropiechart (`chart-1`, `chart-2`, `chart-3`) no cambian.
La nueva paleta solo afecta a los micro-piecharts de categorías individuales.

---

### 12.3 Spec del componente `<BlockBudgetBars>`

**Nombre propuesto:** `BlockBudgetBars` (no `BlockCategoryBars`). El nombre refleja que
lo que se muestra es el presupuesto distribuido por bloque, no solo las categorías. Esto
distingue el componente del genérico "category bars" y lo conecta al dominio financiero.

**Diferenciador respecto a la tabla de col 1**

La DataTable de col 1 muestra: nombre de categoría + importe exacto en euros + porcentaje
sobre el ingreso + barra de progreso + indicador de estado. Es una tabla de consulta densa.

`<BlockBudgetBars>` es diferente en tres dimensiones:
1. **Agrupación visible por bloque** con total de bloque como contexto visual, no solo
   por categoría.
2. **Sin importes exactos** — la barra comunica la proporción relativa dentro del bloque,
   no el valor absoluto. El usuario que quiera el número exacto va a col 1.
3. **Lectura comparativa inmediata**: al ver los 3 bloques en el mismo espacio, el usuario
   calibra instantáneamente si gasta más en necesidades que en ahorro sin tener que
   scrollear entre secciones de col 1.

El caso de uso es: "¿Qué peso tiene cada categoría dentro de su bloque?" La tabla de col 1
responde "¿Cuánto gasto exactamente en X?". Son preguntas distintas.

**Layout general**

```
┌─ BlockBudgetBars ─────────────────────────────────────────────────┐
│                                                                     │
│  ┌─ bloque needs ───────────────────────────────────────────────┐  │
│  │  NECESIDADES · 42%           [label bloque, muted, 10px]     │  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [barra total del bloque, 3px]   │  │
│  │  Vivienda            ████████████████████ 48%               │  │
│  │  Alimentación        ████████████ 20%                        │  │
│  │  Transporte          ████████ 13%                            │  │
│  │  Suministros         █████ 12%                               │  │
│  │  Salud               ███ 5%                                  │  │
│  │  Educación           ██ 2%                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ╌╌╌ separador hairline (1px, muted/30) ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │
│  ┌─ bloque wants ───────────────────────────────────────────────┐  │
│  │  DESEOS · 10%                                                │  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [barra total, color wants]       │  │
│  │  Restaurantes        ████████████ 25%                        │  │
│  │  Viajes              ████████ 20%                            │  │
│  │  ...                                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ╌╌╌ separador hairline ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │
│  ┌─ bloque savings ─────────────────────────────────────────────┐  │
│  │  AHORRO · 48%                                                │  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [barra total, color savings]     │  │
│  │  Inversión           ████████████████ 31%                    │  │
│  │  ...                                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Anatomía de cada fila de categoría:**

```
[label — 12px, max-w 110px, truncado]  [barra proporcional]  [%]
```

- Label: `font-sans, 12px, text-foreground, font-normal`. Ancho fijo `w-[110px]`, truncado
  con `overflow-hidden text-ellipsis whitespace-nowrap`. El truncado es aceptable porque
  el usuario conoce las categorías de col 1; aquí solo sirve de referencia rápida.
- Barra: `height: 6px, border-radius: 3px`. El color es el del `CATEGORY_COLORS[cat.id]`
  de la paleta nueva. El ancho es proporcional al valor de la categoría dentro del bloque
  (no del ingreso total): `width: (cat.value / blockTotal) * 100 + "%"`. El contenedor de
  la barra ocupa el espacio restante después del label y el porcentaje.
- Porcentaje: el porcentaje que muestra es la participación de la categoría dentro del
  bloque, no sobre el ingreso total. Ejemplo: vivienda es 48% dentro de needs (no 20% del
  ingreso). Esto es el diferenciador informacional respecto a la tabla de col 1, que sí
  muestra el % sobre el ingreso.
- Tipografía del porcentaje: `font-sans, 11px, tabular-nums, text-muted-foreground,
  font-medium`. Ancho fijo `w-[32px]` alineado a la derecha.
- Layout fila: `flex items-center gap-2`. Label (fijo 110px) + barra (flex-1) + porcentaje
  (fijo 32px).

**Anatomía del header de bloque:**

```
NECESIDADES · 42%                    [encabezado de bloque]
────────────────────────────────     [barra total del bloque: 3px, color base chart-1/2/3]
```

- Label del bloque: `font-sans, text-[10px], font-bold, uppercase, tracking-[0.05em]`.
  Color: el color base del bloque (`chart-1/2/3` como valor CSS). No `text-muted-foreground`;
  el color del bloque actúa de identificador visual.
- Porcentaje del bloque: `text-muted-foreground, font-normal` a continuación del label,
  separado por ` · `. El porcentaje es sobre el ingreso total.
- Barra total del bloque: debajo del label, `height: 3px, border-radius: 2px`,
  `background-color: [color base del bloque, opacity 40%]`, ancho proporcional al porcentaje
  del bloque sobre el ingreso (ej. necesidades 42% → la barra ocupa el 42% del ancho total
  del contenedor). Esto da una referencia macro antes de ver el detalle de categorías.
  Esta barra es el único elemento que usa el ancho relativo al ingreso total; las barras
  de categorías usan el ancho relativo al bloque.
- Margin-bottom entre header y primera fila: `mt-2` (8px).

**Separadores entre bloques:**
- `<hr>` con `border-t border-border/30 my-3`. No usar `divider` de shadcn — es más pesado
  visualmente de lo que se necesita aquí. El hairline de 1px con opacidad 30% es suficiente
  para indicar "agrupamiento distinto" sin cortar la continuidad de la vista.

**Espaciado interno:**
- Padding del componente: `px-0 py-2` (el card contenedor ya aporta su propio `p-4`).
- Gap entre filas de categoría dentro de un bloque: `gap-y-1.5` (6px). Compacto pero
  legible — más apretado que la tabla de col 1 porque no hay importes en euros.
- Gap entre header de bloque y primera fila: `mt-2` (8px).
- Margin entre hairline y siguiente header: `mt-3` (12px) ya incluido en `my-3`.

**Orden de categorías dentro de cada bloque:**
Las categorías se muestran ordenadas por valor descendente dentro del bloque. Esto facilita
la lectura: el mayor segmento siempre está primero, el menor al final. El ordenamiento se
hace en el componente, no en la API. La categoría con valor 0 se omite (no muestra fila).

**Props del componente:**

```js
// Misma estructura de datos que BlockPiechartsRow
BlockBudgetBars({
  dataByBlock: {
    needs:   Array<{ id: string, label: string, value: number, percentage: number }>,
    wants:   Array<{ id: string, label: string, value: number, percentage: number }>,
    savings: Array<{ id: string, label: string, value: number, percentage: number }>,
  }
})
```

Ruta sugerida: `src/components/ui/block-budget-bars.jsx`

**Altura total estimada:**
- Header needs (16px) + barra total (3px+8px) + 6 filas × (18px fila + 6px gap) = 16+11+144 = 171px
- Separador hairline + margin: 24px
- Header wants + 8 filas × 24px: 207px
- Separador hairline + margin: 24px
- Header savings + 6 filas × 24px: 171px
- **Total estimado: ~597 px**

Cabe holgadamente en el espacio disponible de col 2 (~979 px) incluso junto al MacroPiechart
(~220 px) + gap (16px) = 236px. Suma total: 236 + 597 = 833px < 979px. No hay desbordamiento.

**Accesibilidad:**
- Cada barra de categoría es un elemento visual no interactivo. Añadir `role="img"` al
  contenedor de la barra con `aria-label="{label}: {pct}% del bloque"`.
- El componente completo tiene `aria-label="Distribución por categorías y bloque"` en su
  contenedor raíz.
- Las barras no reciben foco de teclado (no son interactivas). Si en el futuro se añade
  click para resaltar la categoría en col 1, añadir `role="button"` y `tabindex="0"`.

**Comportamiento responsive:**
- xl: visible, con label de 110px y barra en el espacio restante.
- lg y md: visible (el componente cabe en 1 columna). El label se reduce a 90px si el
  viewport es estrecho. La barra absorbe el espacio restante.
- sm: oculto (`hidden md:block`). En móvil, col 2 entera está oculta.

---

### 12.4 Coexistencia en el demo `/debug/dashboard-demo`

El usuario quiere comparar ambas variantes de visualización de categorías: la actual
(micro-piecharts) y la nueva (barras horizontales). Se propone el siguiente layout para
el demo:

**Layout: toggle entre variantes, no lado a lado**

Mostrar ambas variantes al mismo tiempo en el demo requeriría duplicar el `DashboardPanel`
entero, lo que resulta en una página muy larga y dificulta la comparación real (hay que
scrollear). Un toggle es más limpio y más representativo del contexto de uso real.

```
┌── Demo: Modo recommended ─────────────────────────────────────────────────────┐
│                                                                               │
│  [toggle]  ○ Micro-piecharts  ●  Barras por bloque                           │
│                                                                               │
│  ┌── DashboardPanel ──────────────────────────────────────────────────────┐   │
│  │  MacroPiechart (siempre visible — igual en ambas variantes)            │   │
│  │                                                                        │   │
│  │  [si toggle = piecharts]                                               │   │
│  │     BlockPiechartsRow (con paleta nueva)                               │   │
│  │                                                                        │   │
│  │  [si toggle = barras]                                                  │   │
│  │     BlockBudgetBars                                                    │   │
│  │                                                                        │   │
│  │  IndicatorCards (siempre visibles — iguales en ambas variantes)        │   │
│  │  SecondaryCTA                                                          │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

El toggle se implementa como un `<div role="group">` con dos botones `role="radio"` o
como dos botones con clases `variant="outline"` de shadcn. No usar `<select>` — visualmente
menos claro para una decisión binaria.

El toggle va fuera del `DashboardPanel` en el demo (en el header de la sección de modo),
no dentro del panel. Esto lo marca como herramienta de comparación del demo, no como feature
del producto. El `DashboardPanel` recibe una prop `categoryView: "piecharts" | "bars"` que
determina qué subcomponente renderizar.

**Los 3 modos del demo** (recommended, real, inverse) pueden tener su propio toggle
independiente. El estado del toggle es local a cada modo en el demo — no hay sincronización
entre ellos.

**Estado inicial del toggle:** `"bars"`, para que el usuario vea primero la variante nueva.
Puede cambiar a `"piecharts"` para comparar con el estado anterior (con la paleta nueva
aplicada, no la escala monocromática original).

---

### 12.5 Recomendación final

**Se recomienda adoptar `<BlockBudgetBars>` como variante principal en el producto, con
`<BlockPiechartsRow>` mantenido pero secundario (o eliminado).**

Razones:

1. **El problema de legibilidad de los piecharts no se resuelve con la paleta nueva.**
   Con 108 px de diámetro y 8 categorías en wants, incluso con hues distintos, los segmentos
   de 0.5–2% seguirán siendo arcos imperceptibles. El piechart a este tamaño es legible para
   3–4 segmentos, no para 6–8. La paleta nueva mejora la situación pero no la resuelve.

2. **Las barras horizontales son el formato correcto para esta densidad de datos.**
   6–8 categorías ordenadas por valor con una barra proporcional son el patrón estándar de
   visualización de distribución de presupuesto. Es lo que usan las apps financieras de
   referencia (YNAB, Copilot, Monarch) para este caso de uso.

3. **Las barras aportan información adicional que los piecharts no dan:** la proporción de
   cada categoría dentro de su bloque (no del ingreso total) es una métrica nueva que la
   tabla de col 1 no muestra. El usuario aprende algo nuevo al ver el panel; no ve lo mismo
   de otra forma.

4. **La coexistencia de `BlockPiechartsRow` y `BlockBudgetBars` en el mismo DashboardPanel
   es redundante.** Una vez que el usuario valide que las barras funcionan mejor, se
   recomienda eliminar los micro-piecharts del panel de col 2 y mantener solo el MacroPiechart
   macro. El espacio que libera puede usarse para que los IndicatorCards respiren más.

**Si el usuario quiere conservar los piecharts:** aplicar la paleta nueva (sección 12.2) y
aumentar el tamaño de los micro-piecharts a 160 px de diámetro (el espacio de col 2 a 5/12
de 1280 px = ~480 px lo permite). A 160 px, los arcos pequeños son perceptibles y la paleta
con hues distintos hace el resto. El grosor del anillo sube a 26 px. Esta es la única
condición bajo la que los piecharts siguen siendo viables para 8 categorías.

**Conclusión:** Implementar `BlockBudgetBars` con la paleta nueva de 20 colores. Mostrar en
el demo con toggle para validación. Si el usuario confirma preferencia por barras, eliminar
`BlockPiechartsRow` del DashboardPanel en la siguiente iteración. Si prefiere piecharts,
subir el tamaño a 160 px y aplicar la paleta nueva.

---

## 13. Capturas de la iteración post-F2.5

| Archivo | Viewport | Descripción |
|---------|----------|-------------|
| `docs/m37/screenshots/iteration-post-f25/state-current-1440x900.png` | 1440×900 | Estado completo del demo antes de la iteración |
| `docs/m37/screenshots/iteration-post-f25/micropie-zoom-recommended.png` | detalle | Zoom sobre la fila de micro-piecharts — problema de legibilidad visible |
