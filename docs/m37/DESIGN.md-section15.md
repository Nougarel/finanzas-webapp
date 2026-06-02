
---

## 15. Iteración compactación e indicadores extendidos

Capturas de referencia: `results-1280x800.png` y `results-1920x1080.png` (scroll=0 y scroll=800).
Viewport: 1280×800 y 1920×1080. Perfil: over50, mortgage, expensive_city, freelance, 4 dependientes,
2 hijos en universidad, 1 estudia fuera, income=2000.

Estado observado: 1 alerta global de sistema (necesidades 88.5% crítico), 2 alertas inline en tabla
(suministros warning, alimentación warning, educación critical), 3 alertas de bloque visibles,
4 IndicatorCards (DTI saludable, tasa de ahorro crítico, ratio necesidades crítico, cobertura
emergencia crítico). El panel de col 2 queda completamente vacío a partir de scroll≈1000px.

---

### 15.1 Punto A — Layout 2 columnas para IndicatorCards

#### Diagnóstico de viabilidad

El `IndicatorCard` actual tiene `px-4 py-3`. A 244px de ancho (col 2 a 5/12 de 1232px = 486px,
dividida en 2 con gap-2 = (486-8)/2 ≈ 239px), el contenido mínimo es:

- Label: 11px uppercase — cabe sin problemas hasta 120px de contenido
- Valor: `text-2xl tabular-nums` — "88.5%" = 5 chars × ~15px = ~75px. Cabe.
- Badge: "Crítico" a 11px = ~52px de ancho con px-2
- Fila valor+badge en 239px: 75px + 52px + gap-2 (8px) = 135px → sobran 104px. Cabe con holgura.
- Descripción: "Ingreso en gastos esenciales. Saludable: ≤ 50% (BdE/CNMV)" a 12px
  en 239px de ancho → ~3 líneas sin line-clamp. Con `line-clamp-2` se trunca en 2.
  El truncado no es crítico: el label ya identifica el indicador.

**Veredicto: viable.** 239px es ancho suficiente para los 4 indicadores existentes.
No hay colisión de contenido.

#### Caso del indicador de seguros (full-width)

El estimado de seguros se mantiene en col 1 (decisión #5 del DESIGN.md). No entra en col 2.
Si en el futuro se decide moverlo a col 2, va en una fila separada full-width, no en el grid 2-col.
Esto se marca como restricción: cualquier indicador que tenga desglose por componente (varios
sub-valores) no puede ir en el grid 2-col — necesita full-width para que el desglose respire.

#### Spec del IndicatorCard a 239px (variante compacta)

```
┌─ 239px ────────────────────────────────────────────┐
│  DTI                              [badge 11px caps] │  ← label 11px + badge alineado derecha
│                                                     │
│  10.3%                           [Saludable]        │  ← valor text-2xl + badge px-2 py-0.5
│                                                     │
│  Deuda/ingreso. < 35%            [2 líneas máx]     │  ← desc 12px line-clamp-2
│  saludable (BdE)                                    │
└─────────────────────────────────────────────────────┘
```

Cambios respecto al card actual:
- `py-3` se mantiene (12px arriba/abajo). No reducir — con 2 filas de contenido el card ya es compacto.
- `px-4` se mantiene. Reducir a `px-3` si el valor largo ("88.5%") presiona el badge.
- El valor mantiene `text-2xl`. No bajar a `text-xl` — la legibilidad es el propósito del número.
- `line-clamp-2` ya está aplicado. No cambiar.

#### Grid de indicadores

```
┌─ col 2 (486px) ──────────────────────────────────────────────────┐
│  ┌─ 239px ─────────────┐  gap-2  ┌─ 239px ─────────────┐        │
│  │  DTI                │         │  TASA DE AHORRO      │        │
│  │  10.3%  [Saludable] │         │  1.5%  [Crítico]     │        │
│  │  Deuda/ingreso...   │         │  % ingreso al ahorro │        │
│  └─────────────────────┘         └─────────────────────┘        │
│  ┌─ 239px ─────────────┐  gap-2  ┌─ 239px ─────────────┐        │
│  │  RATIO NECESIDADES  │         │  COBERTURA EMERG.    │        │
│  │  88.5%  [Crítico]   │         │  0 m  [Crítico]      │        │
│  │  Gastos esenciales  │         │  Gastos cubiertos... │        │
│  └─────────────────────┘         └─────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

Clases Tailwind: `grid grid-cols-2 gap-2` en el contenedor de IndicatorCards.

#### Indicadores por categoría en grid 2-col

Los 6 indicadores de categoría (vivienda, suministros, alimentación, transporte, salud, educación)
van en el mismo grid 2-col cuando estén presentes. Con 11 indicadores totales (4 transversales + 6
de categoría + 1 seguros full-width) la distribución es:

- Seguros: full-width (ya está en col 1, pero si se mueve a col 2 es full-width)
- Transversales: grid 2-col → 2 filas × 2 cols = 4 cards
- Por categoría: grid 2-col → 3 filas × 2 cols = 6 cards
- Total: 5 filas de 2 = 10 cards en grid + 1 full-width opcional

Altura estimada del grid 2-col con 5 filas:
- Cada card a 239px: ~90px de alto (label 14px + valor 32px + desc 2 líneas×16px + gaps internos)
- 5 filas × 90px + 4 gaps × 8px = 450 + 32 = 482px

Con MacroPiechart (245px) + gap (12px) + BlockBudgetBars (597px) + gap (12px) + grid indicadores
(482px) + CTA (52px) = **~1400px** de contenido en col 2.

**Alerta:** esto excede con creces el panel actual (~920px). Con los 11 indicadores, el panel de
col 2 sería más largo que col 1 en perfiles sin muchas alertas. Se impone una decisión de alcance
(ver Punto B antes de implementar).

---

### 15.2 Punto B — Indicadores por categoría: política de visibilidad

#### Los tres enfoques y sus trade-offs

**Opción 1 — Mostrar siempre los 6:** el usuario ve todos los indicadores de categoría
en cualquier sesión. Ventaja: transparencia total, sensación de sistema completo.
Problema: con 6 cards verdes sobre un presupuesto de 2000€ (donde vivienda=4% por la
hipoteca, alimentación=23% dentro del límite, etc.) el panel se convierte en un tablero
de luces verdes que no comunica nada accionable. A 2000€ con este perfil, el problema
es macro (88.5% en necesidades) — no que vivienda esté mal. Los 6 cards verdes diluyen
la señal crítica.

**Opción 2 — Mostrar solo warning/critical:** el panel es reactivo. Solo aparece contenido
en categorías cuando hay algo que resolver. Ventaja: señal/ruido máximo.
Problema: en perfiles sanos (income=4000€, sin deudas) el panel podría tener 0 indicadores
de categoría, lo que da la impresión de que el sistema no tiene nada que decir.

**Opción 3 — Siempre presentes pero visualmente diferenciados según estado:** los 6 cards
siempre visibles, pero los "ok" se renderizan en modo reducido (sin descripción, valor en
`text-sm` en lugar de `text-2xl`, sin badge visible — solo un dot verde 6px). Los
warning/critical mantienen la presentación completa.

#### Decisión: Opción 3 con umbral dinámico

Se adopta la Opción 3 con una variante adicional de IndicatorCard: `variant="compact-ok"`.

Razones:
1. La presencia permanente de los 6 indicadores da al usuario la lectura "todo en verde =
   distribución saludable" sin necesidad de narración — eso es más valioso que el silencio.
2. El modo reducido para los "ok" permite mantener los 6 sin que el panel se infle visualmente.
   Un card en modo `compact-ok` ocupa ~40px de alto (dot + label + valor sm) vs ~90px normal.
3. Los warning/critical emergen visualmente al estar en tamaño completo mientras los ok son
   pequeños. La jerarquía de atención funciona por contraste de tamaño, no solo de color.

#### Spec del IndicatorCard en modo `compact-ok`

```
┌─ 239px ────────────────────────────────┐
│  ● VIVIENDA    4.0%                    │  ← dot verde 6px + label 11px + valor 13px tabular
└────────────────────────────────────────┘
```

- Altura: `py-2 px-3` = 8+8+contenido ≈ 36–40px
- Dot: `w-1.5 h-1.5 rounded-full bg-success` (6px)
- Label: `text-[11px] uppercase tracking-meta text-muted-foreground font-medium`
- Valor: `text-[13px] tabular-nums text-foreground font-semibold` — al lado del label, separado por gap-2
- Sin badge, sin descripción, sin borde prominente: `border border-border/50 bg-card/60`
- Layout: `flex items-center gap-2` (todo en una sola línea)

Con 6 cards en `compact-ok` en grid 2-col: 3 filas × 40px + 2 gaps × 8px = 136px vs 3 filas × 90px = 270px. Ahorro de 134px.

#### Altura revisada del panel con Opción 3

Escenario A (perfil crítico — como el perfil de prueba): 4 indicadores transversales en
tamaño completo (todos critical) + 6 categorías, de las que ~3 están en warning/critical y
~3 en ok. Altura:
- MacroPiechart card: 245px
- BlockBudgetBars card: 597px
- 4 transversales en grid 2-col completo: 2 filas × 90px + 1 gap × 8px = 188px
- 3 categorías critical en grid 2-col (2 filas, 1 podría quedar sola): ~188px
- 3 categorías ok en compact-ok en grid 2-col: ~136px
- CTA: 52px
- Gaps entre secciones (gap-3 × 5): 60px
- **Total: ~1466px**

Esto sigue siendo excesivo para un panel lateral. El BlockBudgetBars ya muestra la distribución
de categorías en detalle — añadir 6 IndicatorCards por categoría encima es redundancia de información.

**Corrección de alcance para F4:** los 6 indicadores de categoría NO van en col 2. Van en la
DataTable de col 1 como extensión del sistema de alertas existente (ya están parcialmente
implementados como `row.alert`). El panel de col 2 mantiene solo los 4 indicadores transversales
en grid 2-col. Los umbrales de categoría (vivienda %, suministros %, etc.) se comunican vía
las alertas inline de la tabla de col 1, no como cards adicionales en col 2.

Esta es la única decisión que mantiene el panel de col 2 en proporciones manejables.

---

### 15.3 Punto C — Alertas globales más sutiles

#### Estado actual (medido en código)

`alert.jsx` — variante `default`: `p-4` (16px todos los lados), `text-sm` (14px), icono `size-5`
(20px). Total altura aproximada de la alerta del perfil de prueba (texto de 2 líneas): ~72px.

La alerta ocupa casi toda la anchura de col 1 (746px en 1280px viewport) y tiene el mismo peso
visual que el banner navy del ingreso. En el perfil de prueba, la alerta se ve antes del título H1.

#### Problema real

El tamaño de la alerta no es el problema principal — el problema es que compite en jerarquía
visual con el H1 y el banner navy. Una alerta de sistema crítica DEBE tener presencia. Lo que
no debe hacer es tener el mismo padding y el mismo font-size que el contenido principal cuando
el usuario ya tiene el IndicatorCard "Ratio Necesidades: 88.5% Crítico" en col 2 que dice lo mismo.

#### Spec de la nueva talla "subtle" (intermedia entre default y compact)

Se propone una tercera variante de tamaño: `size="subtle"`.

| Propiedad | `default` (actual) | `compact` (existe) | `subtle` (nuevo) |
|-----------|-------------------|--------------------|------------------|
| padding | `p-4` (16px) | `p-2.5` (10px) | `px-3 py-2` (8px vert, 12px horiz) |
| font-size | `text-sm` (14px) | `text-xs` (12px) | `text-[13px]` |
| line-height | `leading-normal` (1.5) | `leading-snug` (1.375) | `leading-snug` (1.375) |
| icono | `size-5` (20px) | `size-4` (16px) | `size-4` (16px) |
| gap interior | `gap-3` (12px) | `gap-3` | `gap-2.5` (10px) |
| alto estimado (1 línea) | ~52px | ~40px | ~40px |
| alto estimado (2 líneas) | ~72px | ~56px | ~54px |

La variante `subtle` mantiene `border` y `bg-*-subtle` como en `default` — el color semántico
no cambia. Solo se reduce el espacio. El color+icono siguen comunicando la urgencia; el tamaño
deja de competir con el banner navy.

#### Cuándo usar cada tamaño

- `default` (p-4): alertas fuera del contexto de resultados — páginas de error, onboarding,
  mensajes de estado del sistema donde el usuario no tiene otro contexto visual.
- `subtle` (px-3 py-2): alertas globales en col 1 de `/results`, `/diagnosis`, `/inverse-results`.
  Estas alertas coexisten con el H1, el banner navy y el panel de col 2 que ya repite la información.
- `compact` (p-2.5): alertas inline dentro de la DataTable (ya en uso — correcto).

En `ResultsPage.jsx`, las alertas `budgetAlert` y `debtAlert` pasan de `size="default"` (implícito)
a `size="subtle"`.

---

### 15.4 Punto D — Redundancia alertas globales vs indicadores de col 2

#### El argumento a favor de eliminar la alerta cuando hay indicador equivalente

La alerta "Tus necesidades esenciales superan el 95% del ingreso: no queda margen para
construir el fondo de emergencia" repite exactamente lo que el IndicatorCard "RATIO NECESIDADES
88.5% Crítico" ya dice en col 2. En 1920px, ambas están visibles simultáneamente en la primera
pantalla. Esto es redundancia de señal.

#### El argumento a favor de mantener ambas

La alerta global añade **narrativa causal** que el IndicatorCard no tiene: "no queda margen para
construir el fondo de emergencia". El IndicatorCard dice el qué (88.5%, Crítico). La alerta dice
el por qué importa (consecuencia en el fondo de emergencia). Son capas de información distintas,
no duplicados exactos.

Además, en viewports < 1280px la col 2 no existe — la alerta es el único lugar donde se
muestra este estado crítico de forma prominente.

#### Decisión: mantener alertas globales, aplicar tamaño `subtle`

Las alertas globales se conservan porque aportan narrativa causal irreemplazable por el badge.
La redundancia perceptual se resuelve en Punto C: reduciendo el tamaño de la alerta a `subtle`,
el IndicatorCard pasa a ser la lectura primaria (tamaño completo, valor en `text-2xl`) y la
alerta pasa a ser contexto narrativo secundario (más pequeña, debajo del fold en 1280px cuando
hay título+H1+banner navy antes).

No se elimina ninguna alerta. No se condiciona su visibilidad a la existencia de un indicador
equivalente. Esta lógica de condicionalidad crearía acoplamiento entre dos sistemas (alertas y
panel) que deben ser independientes para funcionar en viewports donde el panel no existe.

---

### 15.5 Punto E — Toggle compacto Por categorías / Por bloques

#### Estado actual (medido en código)

Dos `<button>` con `rounded-lg border px-4 py-2 text-sm font-medium`. Mismo tamaño, mismo peso.
"Por bloques" es el modo secundario pero tiene idéntica presencia que "Por categorías".

#### Análisis de opciones

**Opción A — Mismo toggle, reducir "Por bloques":** `text-xs px-3 py-1.5` en "Por bloques".
Problema: dos botones del mismo tipo con distinto tamaño en el mismo grupo se leen como
error de diseño, no como jerarquía intencional.

**Opción B — "Por categorías" como botón activo, "Por bloques" como enlace-texto:**
"Por categorías" mantiene su botón. "Por bloques" se convierte en texto plano con cursor-pointer,
`text-xs text-muted-foreground underline-offset-2 hover:underline`. Más limpio. Señala claramente
que es una opción alternativa y no el flujo principal.

**Opción C — "Por categorías" prominente, "Por bloques" como toggle desplegable:**
Sobre-engineered para lo que es una vista secundaria que el usuario usa raramente.

**Opción D — Un solo botón que activa "Por bloques" cuando estás en "Por categorías":**
Un botón `variant="ghost" size="sm"` que solo aparece en el modo principal: "Ver por bloques →".
Desaparece cuando estás en modo bloques; en su lugar aparece "← Volver al detalle".

#### Decisión: Opción D — botón fantasma unidireccional

La Opción D es la más honesta respecto al uso real: "Por bloques" es una vista alternativa
temporal, no un estado de igual jerarquía. Un solo botón fantasma que cambia de label según el
modo activo comunica esta jerarquía sin ambigüedad.

**Spec:**

```
[Modo Por categorías — estado por defecto]
──────────────────────────────────────────────────────────────────
  Por categorías                    [Ver resumen por bloques →]
  [subtítulo "Los importes..."]

  [ghost button: sin borde visible, text-sm text-muted-foreground,
   hover:text-foreground, padding px-0 py-0 (sin caja visual)]

[Modo Por bloques — estado alternativo]
──────────────────────────────────────────────────────────────────
  [← Volver al detalle por categorías]

  [mismo ghost button, label distinto]
```

- El ghost button no tiene `border` ni `bg`. Solo texto con hover de color.
- `text-[13px] text-muted-foreground font-normal hover:text-foreground transition-colors`
- Icono: `ArrowRight` (lucide, `size-3.5`) inline al final del label. En el modo vuelta: `ArrowLeft`.
- Accesibilidad: `aria-pressed` no aplica (no es toggle dual). En su lugar `aria-label` descriptivo.

El `role="group"` del contenedor actual se elimina — ya no hay grupo de opciones, solo un botón
de acción.

---

### 15.6 Punto F — Barras en la DataTable de col 1

#### Estado actual

Cada fila de la DataTable tiene una `<PercentBar>` de `h-1` (4px) normalizada al máximo del bloque.
El panel de col 2 tiene `<BlockBudgetBars>` con barras de `h-1.5` (6px) también normalizadas, pero
al total del bloque (porcentaje dentro del bloque, no sobre el ingreso).

Son escalas distintas: col 1 muestra "% sobre el ingreso total normalizado al máximo del bloque",
col 2 muestra "% dentro del bloque". Son lecturas complementarias, no duplicadas.

Sin embargo, en la práctica el usuario no hace esa distinción. Ve una barra proporcional en col 1
y otra barra proporcional en col 2 para la misma categoría y asume que miden lo mismo. Esto
introduce confusión cognitiva, no información adicional.

#### Decisión: eliminar las barras de la DataTable de col 1

**La tabla es la fuente numérica precisa: importes en € y porcentajes tabulados.** Ese es su
propósito. Las barras añaden ruido visual sin añadir información que el número no dé — el
porcentaje "23.0%" ya comunica la proporción. La barra es decorativa en este contexto.

El panel de col 2 es la fuente de lectura visual: el MacroPiechart para bloques, el BlockBudgetBars
para categorías. Esa división de responsabilidades es más clara sin barras en col 1.

**Spec de la columna "% ingreso" sin barras:**

```jsx
// Antes
render: (val) => (
  <div className="flex flex-col items-end gap-0">
    <span className="tabular-nums text-sm text-muted-foreground">{formatPct(val)}</span>
    <PercentBar pct={val} maxPct={maxBlockPct} />
  </div>
)

// Después
render: (val) => (
  <span className="tabular-nums text-sm text-muted-foreground">{formatPct(val)}</span>
)
```

El `<PercentBar>` y la función `buildCategoryColumns` que recibe `maxBlockPct` se simplifican.
`maxBlockPct` deja de calcularse. La columna "% ingreso" queda como celda de texto alineada a la
derecha, igual que "Importe".

**Excepción:** en `/diagnosis`, donde la DataTable tiene una columna de desviación (real vs
recomendado), puede tener sentido una barra de diferencial. Esa decisión se toma en la iteración
de DiagnosisPage, fuera del alcance de este punto.

---

### 15.7 Mockup global del nuevo /results

```
┌─ SiteHeader (sticky) ────────────────────────────────────────────────────────────────┐
│  [logo]                                                                [nav]          │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌─ max-w-7xl centrado, px-6, py-8 ────────────────────────────────────────────────────┐
│                                                                                       │
│  ┌── COL 1 (7/12 ≈ 746px) ──────────────────────────────┐  ┌── COL 2 (5/12 ≈ 486px)┐
│  │                                                        │  │                        │
│  │  ┌─ Alerta global subtle (px-3 py-2) ──────────────┐  │  │  ┌─ Card MacroPie ───┐ │
│  │  │  ⚠  Tus necesidades superan el 95%...           │  │  │  │  DISTRIBUCIÓN      │ │
│  │  └──────────────────────────────────────────────────┘  │  │  │  [Donut 180px]     │ │
│  │                                                        │  │  │  Nec 88.5%         │ │
│  │  Tu Distribución Financiera  [h1 bold]                 │  │  │  Des 10.0%         │ │
│  │  Distribución personalizada según tu perfil [muted]    │  │  │  Aho  1.5%         │ │
│  │  [badge modelo: Regla 80/20]                           │  │  └──────────────────┘ │
│  │                                                        │  │                        │
│  │  ┌─ Banner navy ────────────────────────────────────┐  │  │  ┌─ Card Barras ────┐ │
│  │  │  INGRESO MENSUAL NETO DE REFERENCIA              │  │  │  │  DETALLE BLOQUE  │ │
│  │  │  2000 €  [bold 5xl]                              │  │  │  │  NECESIDADES 89% │ │
│  │  └──────────────────────────────────────────────────┘  │  │  │  Educación  ████ │ │
│  │                                                        │  │  │  Alimentación ███ │ │
│  │  [Salud financiera 70/100 — colapsado]                 │  │  │  ...              │ │
│  │                                                        │  │  │  DESEOS · 10%     │ │
│  │  Por categorías  [Ver resumen por bloques →]           │  │  │  ...              │ │
│  │  [subtítulo xs muted]                                  │  │  │  AHORRO · 1.5%    │ │
│  │                                                        │  │  │  ...              │ │
│  │  [guía de lectura]                                     │  │  └──────────────────┘ │
│  │  [hint clicable]                                       │  │                        │
│  │                                                        │  │  ┌─ grid 2-col ──────┐ │
│  │  ┌─ Banner NECESIDADES ──────────────────────────────┐ │  │  │ DTI      T.AHORRO │ │
│  │  │  NECESIDADES  88.5%                     1770 €   │ │  │  │ 10.3%    1.5%     │ │
│  │  └──────────────────────────────────────────────────┘ │  │  │ [Salu.]  [Crít.]  │ │
│  │                                                        │  │  │──────────────────│ │
│  │  [DataTable — sin barras]                              │  │  │ R.NEC.   COB.EME. │ │
│  │    Vivienda        80€    4.0%                         │  │  │ 88.5%    0 m      │ │
│  │    Suministros    230€   11.5%                         │  │  │ [Crít.]  [Crít.]  │ │
│  │      ⚠ Tu gasto roza umbral pobreza energética        │  │  └──────────────────┘ │
│  │    Alimentación   460€   23.0%                         │  │                        │
│  │      ⚠ Supera media INE                                │  │  ┌─ CTA outline ────┐  │
│  │    ...                                                 │  │  │  Compara tu       │  │
│  │                                                        │  │  │  situación real → │  │
│  │  ┌─ Banner DESEOS ──────────────────────────────────┐  │  │  └──────────────────┘  │
│  │  │  DESEOS  10.0%                           200 €   │  │  │                        │
│  │  └──────────────────────────────────────────────────┘  │  │  ─── flouss ───────    │
│  │  [DataTable — sin barras]                              │  └────────────────────────┘
│  │    Restaurantes y bares  44€  2.2%                     │
│  │    ...                                                 │
│  │                                                        │
│  │  ┌─ Banner AHORRO ──────────────────────────────────┐  │
│  │  │  AHORRO  1.5%                              30 €  │  │
│  │  └──────────────────────────────────────────────────┘  │
│  │  ┌─ Alerta bloque subtle → NO: sigue siendo            │
│  │  │  compact (ya es inline de la tabla)                 │
│  │  └──────────────────────────────────────────────────┘  │
│  │  [DataTable — sin barras]                              │
│  │                                                        │
│  │  [nota INE pie]                                        │
│  │                                                        │
│  │  ── Seguros (col 1, decisión #5) ─                     │
│  │  [Card seguros estimados — sin cambio]                 │
│  │                                                        │
│  │  [CTAs: Calcular de nuevo | Volver | Analizar →]       │
│  └────────────────────────────────────────────────────────┘
│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 15.8 Tabla de implementación — qué cambia en F4

| Elemento | Cambio | Componente afectado |
|----------|--------|---------------------|
| Alertas globales sistema | `size="subtle"` (px-3 py-2, text-13px, icon-4) | `alert.jsx` nueva variante `size` + `ResultsPage.jsx` |
| Toggle de vista | Reemplazar 2 botones por 1 ghost button con label dinámico | `ResultsPage.jsx` (el toggle es local, no componente propio) |
| Barras en DataTable | Eliminar `<PercentBar>` y `maxBlockPct` de `buildCategoryColumns` | `ResultsPage.jsx` |
| IndicatorCards grid | `grid grid-cols-2 gap-2` en el contenedor de cards del DashboardPanel | `dashboard-panel.jsx` |
| IndicatorCard compact-ok | Nueva variante de presentación para status="ok" en grid 2-col | `indicator-card.jsx` — nueva prop `compact` |
| Indicadores por categoría | NO van en col 2 — quedan en col 1 como alertas inline (ya implementadas) | Sin cambio en F4 |

### 15.9 Red flags

1. **Altura del panel con indicadores de categoría:** si el usuario decide en el futuro añadir
   los 6 indicadores de categoría en col 2, el panel alcanzará ~1400px de contenido. En viewports
   de 1080px de alto, eso es más largo que col 1 en perfiles sin muchas alertas. El BlockBudgetBars
   ya da esa información visualmente. Añadir los cards de categoría es redundancia costosa.

2. **`compact-ok` en grid 2-col a 239px:** el valor en `text-[13px]` de la variante compacta es
   legible pero está en el límite inferior de confort. Si el valor tiene unidades largas ("meses",
   "€/mes") hay que verificar que no se trunca con el label en una sola línea.

3. **Ghost button del toggle y accesibilidad del patrón:** eliminar `role="group"` requiere que el
   ghost button tenga `aria-label` completo que describa la acción y el estado actual, porque ya
   no hay un grupo semántico que lo contextualice.
