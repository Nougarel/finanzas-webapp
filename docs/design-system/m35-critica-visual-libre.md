# Crítica visual libre — flouss (M35)
**Director de arte / diseñador UI senior — criterio sin restricciones**
Fecha: 2026-05-28

---

## 1. Primera impresión honesta

La UI transmite: **aplicación académica bien hecha**. No transmite producto. Está limpia, funciona, no molesta. Pero tampoco convence. Hay una frialdad clínica que no encaja con el tono aspiracional que el copy sí tiene ("distribuye con criterio", "estilo de vida que deseo"). Es un formulario de gobierno vestido con ropa de startup.

Palabras que la describen ahora: competente, neutral, anodina, sin carácter, segura pero olvidable.

Lo que debería transmitir: confianza técnica + claridad + aspiración financiera. Un producto que sabe más que tú de finanzas pero no te hace sentir inferior.

El mayor problema no es ningún componente concreto. Es que no hay ningún momento de diseño con intención. Todo está resuelto, nada está pensado.

---

## 2. Crítica por pantalla

### 2.1 Home (m35-home-v2)

**Qué veo:** Título grande en negro, dos cards idénticas en layout, dos botones "Comenzar". Un footer de TFG.

**Problema 1 — jerarquía falsa:** Las dos cards tienen exactamente el mismo peso visual salvo por el botón (uno primario, uno outline). Eso genera una ilusión de que "Cálculo directo" es la opción recomendada, pero no hay ningún elemento que realmente explique por qué alguien debería elegir una u otra. El usuario que llega sin contexto no sabe qué flujo le corresponde. El diseño debería guiarlo, no solo presentarle dos opciones simétricas.

**Problema 2 — vacío extremo:** La pantalla está literalmente al 30% de su capacidad. El espacio restante es aire muerto. En una landing de selección de flujo, ese espacio se puede usar para anclar la propuesta de valor, reducir ansiedad del usuario ("es gratis", "no necesitas registrarte", "tarda 2 minutos"), o crear una jerarquía visual que haga la pantalla memorable.

**Problema 3 — el logo no trabaja:** "flouss" en lowercase + "DISTRIBUYE CON CRITERIO" en versalitas grises. El contraste del tagline es insuficiente (gris claro sobre blanco). El logo no tiene símbolo, solo wordmark tipográfico en bold — no está mal, pero no se distingue del título de la página. La marca no tiene presencia real.

**Oportunidad:** Esta pantalla debería ser la más memorable de toda la app. Es la que el usuario recuerda si vuelve. Ahora mismo es invisible.

---

### 2.2 Calculadora de ingreso (m35-calculator)

**Qué veo:** Un card flotante centrado en pantalla con un input de número, toggle mensual/anual, y dos botones.

**Problema 1 — vacío aplastante:** Un card de 600px de ancho en una pantalla de 1440px, con ~400px de aire por encima y por debajo. Esto no es "clean", es una pantalla que no sabe qué hacer con su espacio.

**Problema 2 — el input es el protagonista y no lo parece:** El input de ingreso es el único elemento de esta pantalla que importa. Debería ser gigante, prominente, tratado como el número más importante del formulario. En cambio es un input estándar de 44px de altura igual que cualquier otro campo en cualquier app. El número que el usuario teclea aquí determinará toda la experiencia posterior — ese peso no se transmite.

**Problema 3 — toggle mal integrado:** El toggle Mensual/Anual está alineado a la derecha del label, pero visualmente parece un elemento flotante sin conexión clara con el input. No hay una jerarquía que diga "primero elige el modo, luego introduce el número".

**Oportunidad:** Tratamiento de pantalla-calculadora: input enorme (tipografía 48-64px), símbolo € integrado, selección de modo como primer elemento. Puede ser una pantalla extraordinariamente limpia y poderosa con 4 elementos bien diseñados.

---

### 2.3 Calculador inverso / formulario de importes (m35-inverse-calc)

**Qué veo:** Acordeón de tres bloques (Necesidades abierto, Deseos y Ahorro cerrados). Inputs de ancho completo con placeholder "Automático". Bug visual: hay un chip rojo "1 Issue ×" superpuesto sobre el contenido (probablemente herramienta de desarrollo).

**Problema 1 — densidad sin ritmo:** Seis inputs apilados verticalmente con el mismo espaciado entre todos. No hay agrupación visual interna dentro del bloque de Necesidades. Todo tiene el mismo peso. El ojo no sabe qué inputs son prioritarios (vivienda, alimentación) versus cuáles son secundarios (educación en un usuario sin hijos).

**Problema 2 — el placeholder "Automático" es información crítica presentada como placeholder:** El placeholder desaparece en cuanto el usuario hace click. Si el usuario no entiende qué significa "Automático" en este contexto (que se calculará por el solver), es confuso. El estado vacío debería ser más explícito visualmente — quizás un chip/badge de estado que diga "se calculará" en lugar de un placeholder.

**Problema 3 — los tres acordeones cerrados ocultan el alcance:** El usuario ve "Necesidades" expandido pero no sabe cuántas categorías hay en "Deseos" y "Ahorro". Esto genera incertidumbre: ¿cuánto tiempo me llevará esto? Un indicador del número de categorías en el header del acordeón ("Deseos — 8 categorías") reduciría esa ansiedad.

**Oportunidad:** Separar visualmente las categorías por importancia dentro de cada bloque. Usar chips de estado para los campos automáticos. Mostrar en el header del acordeón cuántas categorías tiene cada bloque.

---

### 2.4 Aviso de coherencia (m35-coherence)

**Qué veo:** Pantalla de interrupción con título grande, un alert amarillo con la incoherencia detectada, y tres botones de acción.

**Esto funciona bien.** Es la pantalla más pensada de toda la app. El alert tiene color diferenciado, el texto explica exactamente el problema y la acción recomendada, y los tres CTAs dan opciones reales sin forzar al usuario. El contraste entre el fondo blanco y el alert amarillo crea un momento de atención genuino.

**Problema menor — los tres botones tienen el mismo peso tipográfico:** "Editar perfil" (outline), "Editar importes" (outline), "Calcular igualmente" (primario). La distinción visual entre los dos outline es insuficiente. En móvil, los tres botones en fila se comprimirán y perderán legibilidad.

**Problema de fondo (no es de esta pantalla):** El aviso interrumpe el flujo con una pantalla entera. Para una sola incoherencia, quizás un modal o un inline warning en el formulario anterior sería menos disruptivo. Pero esto es UX, no UI estrictamente.

---

### 2.5 Formulario de gasto real — diagnóstico (m35-diagnosis-form)

**Idéntico al calculador inverso en estructura.** Todo lo dicho allí aplica aquí.

**Problema adicional específico:** Los inputs muestran "0" como valor por defecto. Esto crea un formulario que visualmente parece ya lleno, cuando en realidad está vacío. El usuario tiene que ir campo por campo borrando el 0 para introducir su valor real. Psicológicamente es mucho mejor mostrar el input vacío con un placeholder contextual ("¿Cuánto gastaste?") que un 0 que hay que sobreescribir.

---

### 2.6 Cuestionarios de perfil — versión A y B (m35-profile-direct / m35-profile-inverse)

**Qué veo:** Step indicator arriba, badge de contexto (azul para "Perfil actual", amarillo/dorado para "Perfil ideal futuro"), título de sección, preguntas con opciones en grid de tarjetas.

**Lo que funciona:** El badge de contexto diferenciando "perfil actual" vs "perfil ideal futuro" es una solución inteligente. El grid 2×2 para opciones de 4 elementos es correcto. El step indicator da orientación temporal.

**Problema 1 — el step indicator está débilmente implementado:** Es una barra fina de progreso con texto "Paso 1 de 4". No hay indicadores individuales de cada paso, no hay nombres de sección en cada segmento. En un cuestionario de 4 pasos es razonable mostrar los 4 nodos con etiqueta para que el usuario sepa qué le queda por responder.

**Problema 2 — las tarjetas de opción no tienen estado seleccionado visible en el screenshot:** No se aprecia si hay un estado "selected" con color o solo un borde. En un cuestionario donde el usuario va eligiendo respuestas y luego hace scroll, necesita ver de un vistazo qué ha respondido ya. Sin estado seleccionado claro, el usuario no puede revisar sus respuestas.

**Problema 3 — el botón "Siguiente" está desactivado (gris) pero no hay feedback de por qué:** El usuario no sabe si falta responder algo o si hay un error. En formularios multi-step, el CTA deshabilitado sin indicación de cuántas preguntas quedan por responder genera frustración.

**Problema 4 — densidad vertical excesiva:** Hay demasiadas preguntas visibles a la vez en el scroll. Tres preguntas distintas en la misma vista, con sus grids de opciones, crean una pantalla sobrecargada que parece más larga de lo que es.

**Oportunidad:** One-question-at-a-time (tipo Typeform) o secciones claramente separadas con separadores visuales fuertes. Mostrar el estado "respondido" con un checkmark o color de acento en cada tarjeta seleccionada. Animar la transición entre preguntas para dar ritmo.

---

### 2.7 Resultados: distribución directa (m35-results)

Esta es la pantalla más importante de toda la app y la que más trabajo necesita.

**Qué veo** (en la captura comprimida): Número grande de ingreso (2000€), barra verde de health score con "97/100 Excelente", tabs "Por categorías / Por bloques", tres tablas verticales (Necesidades, Deseos, Ahorro) con categorías, importes y porcentajes. Abajo, indicadores de referencia (DTI, gasto total en seguro) en formato pequeño. CTAs de acción final.

**Problema 1 — el health score no merece celebración:** Un 97/100 con una barra verde plana no transmite la importancia de ese dato. Esta puntuación es el resultado de toda la sesión del usuario. Debería ser el momento de mayor peso visual de la app: tipografía grande, animación de entrada, color que comunique emoción (no solo "verde = ok"). Ahora es una barra que parece la barra de descarga de un archivo.

**Problema 2 — las tablas son tablas HTML con formato texto:** Tres columnas: Categoría / Importe / % del ingreso. La información es correcta pero completamente plana. En una app de finanzas donde el porcentaje es la métrica crítica, ese dato debería estar visualizado, no solo impreso. Una barra de progreso proporcional junto al importe, o un mini indicador de color según si está en rango saludable o no, transformaría tablas de texto en datos comprensibles de un vistazo.

**Problema 3 — la jerarquía entre bloques es inexistente:** Necesidades (720€), Deseos (200€), Ahorro (1080€) son tres bloques con pesos completamente distintos. Visualmente tienen el mismo tratamiento tipográfico, el mismo espaciado, el mismo borde. No hay ninguna indicación de qué bloque es más importante o cuál tiene mayor margen de ajuste.

**Problema 4 — los "indicadores de referencia" están al final, en letra pequeña:** El ratio de deuda (DTI) y el gasto en seguros son datos institucionales valiosos. Están tratados como footnotes cuando deberían tener presencia propia como "contexto normativo" o "validación institucional".

**Problema 5 — los CTAs finales son poco motivantes:** "Calcular de nuevo / Volver al inicio / Analizar mi situación real" en texto plano al pie de una página larga. Después de un resultado de 97/100, el usuario está en su punto de mayor satisfacción — ese es el momento para invitarlo al flujo de diagnóstico con un CTA celebratorio.

---

### 2.8 Resultados: ingreso mínimo necesario (m35-inverse-results)

**Qué veo:** Número grande "2001 €" en un card, tabla comparativa de las categorías especificadas vs referencia INE, luego la distribución completa en tres tablas.

**Problema 1 — el número protagonista podría ser más poderoso:** "2001 €" es el resultado de todo el flujo inverso. Está en tamaño razonable pero en un card con borde neutral. Sin color, sin contexto inmediato de si es alcanzable o no. Un tratamiento que dijera "con este sueldo neto sostienes tu estilo de vida deseado" + un indicador visual de proximidad a salarios medios en España lo haría más útil.

**Problema 2 — la tabla comparativa mezcla datos en una sola columna confusa:** La columna "REF. INE" muestra "700 € (35,0%)" — el importe y el porcentaje juntos en el mismo texto. Esto obliga al ojo a parsear el dato en lugar de leerlo directamente. Separar en dos columnas o usar el porcentaje como dato secundario con estilo visual diferenciado lo resolvería.

**Problema 3 — las categorías con 0 € en Deseos:** Toda la sección de Deseos tiene importes 0 € porque no se especificaron. Esto crea filas vacías que ocupan espacio sin aportar nada. Mostrar solo las categorías con importe > 0 en la tabla principal, y colapsar las vacías bajo un "Ver categorías no especificadas (X)", reduciría el ruido.

**Problema 4 — el badge "fijado" en las categorías:** Los chips "fijado" en verde/azul sobre las categorías especificadas es una buena idea de diseño — señala qué impuso el usuario y qué calculó el solver. Pero el chip tiene un estilo que no pertenece al mismo sistema visual que el resto de la página (borde redondeado, fondo coloreado, texto pequeño). Parece importado de otra librería o iteración anterior.

---

### 2.9 Diagnóstico comparativo (m35-diagnosis)

**Qué veo** (captura comprimida): Score 57/100 en rojo, resumen de bloques con comparativa (Real vs Recomendado), tabla detallada por categoría con columnas Tu gasto / Recomendado / Diferencia / Estado.

**Lo que funciona:** La columna "Estado" con texto ("Bien", "Por debajo", "No ahorra") es más accesible que solo colores. El alert amarillo sobre la sección de Ahorro que avisa del riesgo es correcto.

**Problema 1 — el score negativo no tiene suficiente peso emocional:** Un 57/100 es el dato que define si el usuario tiene un problema financiero real. Está mostrado con el mismo formato que el 97/100 de resultados, solo cambiando el color de verde a rojo. El impacto emocional de "tienes un problema" requiere más que un cambio de color — requiere un tratamiento visual distinto, un momento de atención diferente.

**Problema 2 — la tabla de diferencias mezcla positivo/negativo sin suficiente color semántico:** La columna "Diferencia" muestra valores como "+124 €" o "-486 €". En la captura comprimida no puedo verificar con certeza si hay diferenciación de color entre positivo y negativo más allá del signo. Si no la hay, es un problema grave: en una tabla financiera comparativa, verde/rojo con iconos de dirección es el mínimo para que el usuario entienda de un vistazo su situación.

**Problema 3 — las filas de "Estado: Bien" y "Estado: Por debajo" necesitan más contraste visual:** En una tabla de 20 filas, el usuario debería poder ver de un vistazo dónde están sus problemas sin leer cada fila. Un tratamiento de fila con fondo de color suave (verde muy claro para Bien, rojo muy claro para Por debajo) haría la tabla escaneable en 2 segundos.

**Problema 4 — los CTAs finales pierden el momento:** "Recalcular / Volver a resultados / Inicio" después de un diagnóstico negativo. Si el score es bajo, el usuario necesita un CTA que lo lleve a entender qué cambiar, no solo a recalcular. Un CTA como "¿Qué puedo ajustar?" o un enlace al flujo de planificación directo sería más útil.

---

## 3. Visión del rediseño — dirección completa

### 3.1 Personalidad y tono visual

**Propuesta: "asesor financiero de confianza con criterio técnico visible".**

El usuario objetivo de flouss no es un experto financiero, pero tampoco quiere que le traten como a un niño. Quiere entender. Quiere datos reales. Quiere que la app le haga sentir que está tomando el control, no que está siendo evaluado por una institución.

La dirección visual correcta para esto no es la de una fintech de consumo (colorida, gamificada, Revolut-style) ni la de un banco (gris corporativo, sobria, intimidante). Es un tercer espacio que yo llamaría **"rigor accesible"**:

- Profesional sin ser frío
- Basado en datos sin ser árido
- Aspiracional sin ser pretencioso
- Confiable sin ser institucional

Referencia de personalidad: la forma en que Notion convierte lo complejo en simple sin perder profundidad. O como Linear da sensación de herramienta profesional sin ser intimidante.

**Por qué no fintech colorida:** flouss maneja finanzas del hogar, no inversión de alta frecuencia. El usuario está pensando en si puede permitirse unas vacaciones o cuánto ahorrar para la jubilación. Ese contexto pide seriedad, no confeti.

**Por qué no banco corporativo:** El usuario ya tiene un banco. Si flouss se parece a un banco, no hay razón para usarlo. La diferencia competitiva debe ser visual también: más humana, más directa, más inteligente en cómo presenta los datos.

---

### 3.2 Paleta de color propuesta

La paleta actual usa `#0F172A` (slate-900) como color primario y azules grises para acentos. Es segura pero sin carácter.

**Propuesta: base oscura sofisticada + acento verde mineral**

El verde es el color universal de las finanzas personales saludables, pero la clave está en qué verde. No el verde neón de apps de cripto, no el verde corporativo de Excel. Un verde con presencia, ligeramente desaturado, que diga "crecimiento" y "estabilidad" simultáneamente.

```
/* Paleta propuesta */

/* Base — fondo y estructura */
--color-background:     #FAFAF9   /* warm off-white, no blanco puro */
--color-surface:        #FFFFFF   /* cards y elevación */
--color-surface-raised: #F5F5F3   /* hover states, alternating rows */
--color-border:         #E5E5E2   /* bordes neutros cálidos */
--color-border-strong:  #C7C7C2   /* bordes con énfasis */

/* Textos */
--color-text-primary:   #1A1916   /* casi negro, ligeramente cálido */
--color-text-secondary: #6B6B62   /* neutro medio cálido */
--color-text-tertiary:  #9C9C92   /* labels, hints */
--color-text-inverse:   #FAFAF9   /* texto sobre fondos oscuros */

/* Acento principal — verde mineral */
--color-accent:         #1A7A4A   /* verde oscuro principal */
--color-accent-light:   #22A05A   /* hover y estados activos */
--color-accent-pale:    #E8F5EE   /* fondos suaves de acento */
--color-accent-text:    #0F5934   /* texto sobre pale */

/* Primario — para CTAs y acciones principales */
--color-primary:        #1C1C1C   /* negro cálido — autoridad */
--color-primary-hover:  #333330
--color-primary-fg:     #FAFAF9

/* Semánticos */
--color-success:        #1A7A4A
--color-success-pale:   #E8F5EE
--color-warning:        #C47A1A
--color-warning-pale:   #FEF3DC
--color-error:          #C4291A
--color-error-pale:     #FEE8E6
--color-info:           #1A5AC4
--color-info-pale:      #E8EFFE

/* Score tiers — health score visual */
--color-score-excellent: #1A7A4A  /* 80-100 */
--color-score-good:      #5A9A2A  /* 60-79 */
--color-score-fair:      #C47A1A  /* 40-59 */
--color-score-poor:      #C4291A  /* 0-39 */
```

**Por qué esta paleta:**
- El off-white cálido (`#FAFAF9`) es más suave que el blanco puro — reduce la fatiga visual en pantallas largas de datos.
- El negro primario para CTAs (`#1C1C1C`) tiene más peso y confianza que el azul slate actual. Las apps financieras que más me convencen (YNAB, Monarch Money) usan negro o muy oscuro para los botones principales.
- El verde mineral (`#1A7A4A`) es distinguible del verde de WhatsApp, Revolut, y los bancos. Tiene personalidad propia.
- Los semánticos son cromáticamente distintos unos de otros, lo que los hace accesibles para daltonismo parcial.

---

### 3.3 Tipografía propuesta

**Propuesta: Instrument Serif (display) + Inter (UI) + Roboto Mono (números)**

La combinación que más le conviene a flouss es la que muchas apps de datos premium usan: serif de display para los titulares emocionales + sans-serif neutro para la interfaz + monoespaciada para los números.

**Por qué serif en los titulares:** "Tu Distribución Financiera", "Ingreso mínimo necesario", "Diagnóstico de tu situación real". Estos títulos tienen peso semántico real. Un serif bien elegido los hace sentir más importantes, más considerados, más como el output de algo serio. No es decoración — es señal de que el producto se toma en serio lo que dice.

**Por qué Roboto Mono para números:** Los importes monetarios son los protagonistas del producto. Una monoespaciada los hace visualmente distintos del texto, los alinea perfectamente en columnas de tablas, y da una sensación de precisión técnica que el sans-serif genérico no puede igualar. Es la diferencia entre un resultado que parece "calculado" y uno que parece "impreso".

```
/* Tipografía */

--font-display:  'Instrument Serif', Georgia, serif
--font-body:     'Inter', system-ui, sans-serif
--font-numeric:  'Roboto Mono', 'Courier New', monospace

/* Escala */
--text-xs:    12px / 1.5
--text-sm:    14px / 1.5
--text-base:  16px / 1.6
--text-lg:    18px / 1.5
--text-xl:    20px / 1.4
--text-2xl:   24px / 1.3
--text-3xl:   30px / 1.25
--text-4xl:   36px / 1.2
--text-5xl:   48px / 1.1  /* números protagonistas */
--text-6xl:   64px / 1.0  /* hero numbers */

/* Pesos */
400 — body text
500 — labels, navegación activa
600 — subtítulos, datos importantes
700 — titulares, CTAs
```

**Aplicación específica:**
- El ingreso "2000 €" en la pantalla de resultados: `--font-numeric`, `--text-6xl`, peso 700
- El health score "97/100": `--font-numeric`, `--text-5xl`, peso 700, color del tier correspondiente
- Los títulos de sección ("Tu Distribución Financiera"): `--font-display`, `--text-4xl`, peso 400 (el serif no necesita bold para tener presencia)
- Los importes en tablas: `--font-numeric`, `--text-base`, tabular-nums, alineados a la derecha

---

### 3.4 Tratamiento de datos y tablas

Este es el eje más importante del rediseño. flouss es fundamentalmente una app de datos. Las tablas no son un detalle — son el producto.

**Principios para las tablas de resultados:**

1. **Los importes en monoespaciada, alineados a la derecha, siempre.** Esto no es opcional. Permite comparación vertical instantánea.

2. **Los porcentajes como barras de progreso, no como texto.** Una barra proporcional junto al importe dice más en 0.1 segundos que "35,0 %" en texto. La barra puede ir de 0 al máximo de la categoría, coloreada por el bloque (needs / wants / savings en tonos distintos).

3. **Código de color semántico en las filas de diagnóstico.** Filas con fondo `--color-success-pale` para categorías bien, `--color-error-pale` para categorías problemáticas. No solo en la columna de estado — en toda la fila, con baja saturación para no abrumar.

4. **Separadores de bloque con peso real.** Los tres bloques (Necesidades / Deseos / Ahorro) deberían estar claramente separados, con un header de bloque que muestre el total del bloque y su porcentaje del ingreso de forma prominente. No un label pequeño — un verdadero separador visual.

5. **El health score como visualización circular.** Una barra lineal es la visualización más genérica posible para una puntuación. Un gauge circular o un arc chart daría al score identidad visual propia y haría que el momento de revelación fuera memorable. La animación de entrada (el arco "creciendo" hasta el valor) es el momento de mayor engagement de toda la app.

6. **Diferencias con flechas direccionales.** En la tabla de diagnóstico, la diferencia "+124 €" debería ir acompañada de una flecha de subida en verde o bajada en rojo. El cerebro procesa iconos 3x más rápido que texto.

---

### 3.5 Uso del espacio, profundidad, foco

**Problema sistémico actual:** La app trata todo el espacio de la misma manera. No hay profundidad, no hay jerarquía espacial.

**Dirección propuesta:**

- **Fondo base `#FAFAF9`, cards `#FFFFFF`.** Usar la diferencia de tono entre fondo y card para crear profundidad sin sombras pesadas. Actualmente todo es blanco sobre blanco.

- **Máximo ancho de contenido: 720px centrado.** Actualmente algunos formularios van a ~820px. Para formularios y resultados de lectura lineal, 720px es el ancho óptimo de legibilidad. Para las tablas comparativas, se puede expandir a 960px con justificación.

- **La pantalla de input (calculadora de ingreso) debería ser una pantalla de "momento único".** Centrado vertical, número gigante, sin card container — el input flotando directamente sobre el fondo. Es el mismo patrón que usan los mejores onboarding de apps financieras: un campo, un número, todo el foco.

- **Sombras solo para elementos que flotan realmente.** Ahora las cards tienen sombra sutil. Está bien. Pero el sistema debería ser consistente: shadow-sm para cards en página, shadow-md para modals/popovers, shadow-lg para elementos que se superponen al contenido.

- **Color de acento para momentos de éxito.** Cuando el usuario completa el perfil, cuando recibe resultados con score alto, cuando calcula exitosamente — introducir el verde de acento como fondo de un elemento hero. No en toda la pantalla — en el número protagonista, en el header del card de resultados. Estos momentos crean la identidad emocional del producto.

---

### 3.6 Diferenciación frente a apps financieras genéricas

**Por qué flouss puede diferenciarse:**

La mayoría de las apps de finanzas personales que existen (BBVA, Imagin, Fintonic, etc.) presentan los datos como lo haría un banco: tablas heredadas de Excel, colores corporativos, sin carácter. Las apps de nueva generación (Revolut, N26) van al extremo opuesto: minimalismo extremo, sin contexto, orientadas a la transacción.

flouss tiene algo que ninguna tiene: **un motor de LP que calcula distribuciones óptimas con datos institucionales reales** (INE, Banco de España, Eurostat). Eso es genuinamente valioso y completamente invisible en la UI actual.

**Estrategia de diferenciación visual:**

1. **Hacer visible el "criterio" del tagline.** La pantalla de resultados debería mostrar las fuentes institucionales de forma prominente, no como footnote. Un pequeño badge "Ref. INE 2023" junto a los datos de referencia, o una cita breve de la fuente usada para el umbral de DTI. Esto comunica que el cálculo no es arbitrario.

2. **La tipografía serif en los momentos de verdad.** Usar Instrument Serif solo en los titulares más importantes ("Tu distribución óptima", "Ingreso mínimo para tu estilo de vida") crea una voz editorial que ninguna app financiera española tiene. Es la diferencia entre un informe y un producto que habla.

3. **Micro-detalles que revelan cuidado.** El badge "fijado" en las categorías del inverso es una idea excelente — pero ejecutada con más cuidado de estilo. Los tooltips que explican el cálculo de cada categoría. El momento de animación cuando el score aparece. Estos detalles no los pone alguien que solo quiere que funcione.

---

## 4. Referencias de dirección visual

### 4.1 Monarch Money — tratamiento de datos financieros personales
**Por qué:** Es el referente más cercano en términos de producto. Tablas limpias con barras de progreso, jerarquía clara entre categorías, health indicators con color semántico consistente. La paleta oscura de acento sobre fondo blanco cálido. No copiar — entender por qué cada decisión funciona.
**Qué tomar:** El tratamiento de la tabla de categorías con barras proporcionales. El uso del espacio en las pantallas de resumen.

### 4.2 Linear — interfaz profesional sin intimidar
**Por qué:** Linear ha resuelto el problema de hacer una herramienta técnica visualmente elegante sin sacrificar densidad de información. Su tipografía, el spacing generoso dentro de componentes densos, el color de acento muy escaso pero muy presente.
**Qué tomar:** El sistema tipográfico (label → valor → contexto en tres niveles de peso). La economía de color (95% neutros, 5% acento).

### 4.3 Stripe Dashboard — tablas financieras como diseño
**Por qué:** Stripe ha redefinido cómo presentar datos financieros. Sus tablas con columnas de importe en monoespaciada, el uso de badges de estado, la jerarquía entre filas importantes y filas de soporte.
**Qué tomar:** La tipografía numérica. El sistema de badges de estado. La alineación derecha en columnas monetarias.

### 4.4 YNAB — tone-of-voice visual para finanzas personales
**Por qué:** You Need A Budget tiene una personalidad visual que comunica "esto es serio pero no da miedo". Usa ilustraciones simples, tipografía bold con mucho carácter, y un sistema de color basado en verde que no es el verde de los bancos.
**Qué tomar:** El tono aspiracional del color. La confianza tipográfica. La forma en que los "momentos de éxito" están diseñados para ser memorables.

### 4.5 Fey (app de portfolio de inversión) — visualización numérica premium
**Por qué:** Fey es quizás la app de finanzas personales más hermosa que existe. Su tratamiento de los números como elementos de diseño de primer nivel, la tipografía monoespaciada para datos, los micro-gráficos inline dentro de tablas.
**Qué tomar:** La jerarquía número grande / dato secundario / contexto terciario. El uso de la monoespaciada para crear ritmo visual en columnas.

---

## 5. Problemas por impacto — priorización

### Críticos — mayor retorno visual por esfuerzo

**P1. Tipografía numérica.** Todos los importes monetarios y porcentajes en `Roboto Mono` (o similar). Esto requiere añadir la fuente y aplicar `font-family: var(--font-numeric)` a los valores monetarios. Impacto inmediato, esfuerzo bajo.

**P2. Health score como visualización circular.** Reemplazar la barra lineal por un arc chart / gauge con animación de entrada y color por tier. Es el momento más importante de la app — merece el tratamiento más cuidado. Impacto altísimo, esfuerzo medio.

**P3. Barras de progreso proporcionales en las tablas de resultados.** Añadir una barra visual junto a cada importe que muestre el porcentaje del ingreso de forma visual. Hace las tablas escaneables en lugar de legibles. Impacto alto, esfuerzo medio.

**P4. Fondo off-white cálido.** Cambiar el fondo de `#FFFFFF` a `#FAFAF9`. Esto crea profundidad inmediata con los cards blancos, reduce la dureza visual de pantallas largas de datos, y da carácter cálido sin ningún otro cambio. Impacto medio-alto, esfuerzo mínimo.

**P5. Input de ingreso protagonista.** En la pantalla de calculadora, el input debería tener tipografía grande (48px), sin card container, centrado en pantalla. Quitar el ruido alrededor del único elemento que importa en esa pantalla. Impacto alto en percepción de calidad, esfuerzo bajo.

**P6. Color semántico de filas en el diagnóstico.** En la tabla de diagnóstico, aplicar `background: var(--color-error-pale)` / `background: var(--color-success-pale)` a las filas según estado. El usuario debe ver su situación de un vistazo sin leer. Impacto alto en usabilidad, esfuerzo muy bajo.

**P7. Serif en titulares de resultados.** Solo en "Tu Distribución Financiera", "Ingreso mínimo necesario" y "Diagnóstico de tu situación real". Tres líneas de CSS. Diferenciación inmediata frente a cualquier app financiera española. Impacto en percepción de calidad, esfuerzo mínimo.

---

## 6. Anti-patrones a evitar en el rediseño

- No usar el verde de acento en botones primarios. Los botones de acción principal van en negro (`--color-primary`). El verde se reserva para datos positivos y estados de éxito.
- No añadir ilustraciones. El producto es serio y técnico. Las ilustraciones lo infantilizarían.
- No introducir sombras pesadas. El sistema de profundidad se resuelve con variaciones de tono de fondo, no con `box-shadow` decorativo.
- No romper el sistema tipográfico. El serif solo en H1/H2 de páginas de resultados. Nunca en formularios, nunca en tablas, nunca en navegación.
- No usar más de 3 pesos tipográficos por pantalla. La variedad de pesos en la UI actual (thin, regular, medium, bold mezclados) diluye la jerarquía.
- No colorear los headers de tabla. Los headers de columna van siempre en `--color-text-tertiary` sin fondo coloreado. El color va en los datos, no en la estructura.

---

## Checklist de validación

- [x] He evaluado los 6 ejes para cada pantalla
- [x] Cada problema tiene qué + por qué + cómo
- [x] Los problemas están ordenados por impacto real en el usuario
- [x] He separado problemas de sistema visual de problemas de decisión de diseño
- [x] La crítica da información suficiente para la siguiente iteración sin aclaraciones adicionales
- [x] He distinguido mejoras objetivas de preferencias de autor donde corresponde
