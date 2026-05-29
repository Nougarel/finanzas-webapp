# M35 — Crítica visual a fondo
**Fecha:** 2026-05-28  
**Scope:** 10 capturas post-migración (shell header+footer, componentes nuevos: DataTable, Alert, MoneyValue, PageShell, estados)  
**Metodología:** 6 ejes (jerarquía, color, tipografía, espaciado, consistencia, identidad) + contraste con decisiones cerradas M35  
**Autor:** agente `diseñador`

---

## Fortalezas (lo que ya funciona y hay que conservar)

**1. La tipografía de display hace el trabajo que le toca.**  
El salto Geist 900 en títulos vs Inter Light en body ya se percibe como sistema, no como accidente. Pantallas como `m35-coherence.png` o `m35-profile-inverse.png` demuestran que la jerarquía funciona incluso sin color.

**2. El shell (header + footer) unifica la experiencia sin ruido.**  
El header minimal con "flouss + tagline" y el footer con disclaimer son exactamente lo que el Bloque F prescribía. No compiten con el contenido.

---

## Problemas por impacto

### CRITICO — corregir antes de continuar

#### 1. Home: las dos cards son visualmente iguales cuando la diferencia es el punto de entrada

**Qué:** En `m35-home-v2.png` el botón "Cálculo directo" está relleno en navy y el de "Cálculo inverso" es outline. Sin embargo, las dos cards son blancas, del mismo tamaño, el mismo peso de texto, el mismo radio. El botón primario/secundario es el único diferenciador, y es muy débil para dos flujos que son equivalentes en importancia pero distintos en propósito.

**Por qué es un problema:** El usuario no entiende de un vistazo qué flujo le conviene. La jerarquía del botón (primario navy vs outline) insinúa que "Cálculo directo" es la opción "correcta" cuando son alternativas de mismo peso. Además, el ojo lee las dos cards como gemelas y no para a distinguirlas.

**Cómo resolverlo:** Dar a cada card un elemento diferenciador más fuerte. Opciones dentro del arquetipo:
- Una de las cards con fondo navy (`bg-[#14213D]` texto blanco) — inversión bicromía que el Bloque B pide explícitamente y que aún no se ha usado en ninguna pantalla.
- O bien: icono más grande y prominente (ahora es 24px inline; podría ser 48px centrado arriba de la card). El icono hace el trabajo de diferenciación sin tocar el color.
- El título de la card podría ser text-xl Geist 700 en lugar de Inter 500 para darle más presencia.

**Marca:** ✅ coherente con el modelo (inversión bicromía estaba en Bloque B como decisión pendiente de aplicar).  
**Prioridad:** Alto impacto visual / esfuerzo bajo.

---

#### 2. La hero number de resultados inversos pesa poco para ser el dato más importante de la app

**Qué:** En `m35-inverse-results.png`, "2001 €" aparece en la card superior en lo que parece ser text-4xl Geist 900, pero la card tiene borde muy fino y fondo blanco idéntico al resto del contenido. El número se pierde en el contexto de la página.

**Por qué es un problema:** Este número es la respuesta a la pregunta central del flujo. El usuario ha llenado 4 pasos de perfil + 20 campos de importes para llegar a este número. Que aparezca en una card sin énfasis especial es un fallo de jerarquía de primer orden. Revolut y N26 (moodboard) tratan este tipo de número con el área más oscura de la pantalla, texto invertido, sin competencia visual alrededor.

**Cómo resolverlo:** El bloque de resultado principal (el número) debería tener:
- Fondo navy invertido (banner/hero section oscura, texto blanco).
- El número en text-5xl o text-6xl, Geist 900, `tabular-nums`, tracking negativo `-0.02em`.
- Subtítulo en Inter Light 300 blanco/70% debajo del número.
- La card de fondo blanco actual pasa a ser el "detalle técnico", no el protagonista.

**Marca:** ✅ coherente con el modelo (hero numbers + inversión bicromía son decisiones del Bloque B/D explícitas).  
**Prioridad:** Alto impacto visual / esfuerzo bajo-medio (solo cambio de estilos en InverseResultsPage).

---

#### 3. ResultsPage: el health score visualmente no comunica "evaluación"

**Qué:** En `m35-results.png` (comprimida pero legible) el bloque "SALUD FINANCIERA / 97/100 / Excelente" es una barra verde horizontal con el número superpuesto. El fondo del bloque es verde claro, que es el único uso del color semántico success en toda la pantalla.

**Por qué es un problema:** El health score es el segundo dato más importante de la pantalla (el primero es el ingreso). Pero la barra de progreso verde es un patrón genérico que no tiene personalidad. Peor: el bloque verde en medio de una página blanca parece una alerta de éxito, no un indicador de puntuación. Se confunde semánticamente con `<Alert variant="success">`.

**Cómo resolverlo:** Separar visualmente el score de las alertas semánticas:
- El score podría ser un número grande en Geist 900 (text-5xl) con la puntuación como protagonista, sin barra de progreso, con un ring circular o simplemente el número solo en un bloque navy invertido. La barra es una convención de formularios, no de dashboards.
- Si se quiere mantener la barra: sacarla del fondo verde (que se asocia a `--success`) y ponerla sobre fondo blanco con la barra en navy, sin el bloque coloreado de fondo. El color green se reserva exclusivamente para alertas semánticas.
- La label "SALUD FINANCIERA" en Inter 500 uppercase con tracking es correcta. El problema es el contenedor.

**Marca:** ⚠️ tensiona el modelo. El Bloque C decide no usar color por bloque de categorías, pero el health score usa `--success` para su fondo. Si se elimina el verde del score block, se gana consistencia semántica del sistema de color. Si se mantiene, la regla "verde = éxito semántico" queda contaminada. Recomendación: eliminar el verde del contenedor del score y reservarlo solo para alertas.  
**Prioridad:** Alto impacto / esfuerzo bajo.

---

### IMPORTANTE — corregir en esta iteración

#### 4. El fondo blanco total crea "pantallas vacías" en todos los estados de formulario

**Qué:** Todas las pantallas de formulario (m35-calculator.png, m35-inverse-calc.png, m35-diagnosis-form.png, ProfilePage) tienen fondo blanco #FFFFFF en toda la ventana. Las cards y el contenido flotan sobre ese blanco.

**Por qué es un problema:** El blanco total es correcto para páginas de resultados (mucho contenido, no puede haber más ruido). Para páginas de formulario con poco contenido, el blanco vacío no da sensación de "aplicación" — se siente como una página HTML en blanco con una card encima. Stripe, N26, Linear usan un gris muy sutil (`#F8F9FA`, `#F5F5F5`) como fondo de app para que las cards blancas tengan algo contra lo que destacar.

**Cómo resolverlo:** Aplicar `bg-[#F8F8F8]` o `bg-slate-50` al `<body>`/shell en pantallas de formulario. Las cards mantienen `bg-white` y adquieren presencia automáticamente. No requiere sombras agresivas — con un fondo ligeramente diferente al blanco, la card se lee como "contenido" y no como "página".

**Marca:** ✅ coherente con el modelo. No se introduce ningún color nuevo, solo un neutro muy suave. Los neutros de shadcn/slate están cerrados como base y `slate-50` es `#F8FAFC` — dentro del sistema.  
**Prioridad:** Alto impacto visual / esfuerzo mínimo (1 línea de CSS en el shell o en globals.css).

---

#### 5. ProfilePage: las cards de opción seleccionable no tienen estado "selected" visible

**Qué:** En `m35-profile-direct.png` y `m35-profile-inverse.png` los botones de opción (tipo "Asalariado indefinido", "Menos de 35 años"…) son cards con borde gris y fondo blanco. No hay ningún estado visual de selección en las capturas.

**Por qué es un problema:** Este es el componente con mayor uso en toda la app (aparece en 4 pasos × múltiples preguntas = ~15-20 instancias). Si el estado "selected" no es claro, el usuario no sabe con certeza qué ha seleccionado. En términos de jerarquía, la respuesta elegida debería dominar visualmente sobre las no elegidas.

**Cómo resolverlo:** El estado selected debería tener:
- Borde navy (`border-[#14213D]` 2px) — diferencia clara respecto al borde gris actual.
- Fondo `bg-[#14213D]/5` (navy al 5% de opacidad) — tinte muy sutil que no rompe la legibilidad pero marca la selección.
- El texto del título podría pasar a Inter Medium 500 o Geist 500 en estado selected (weight shift).
- El icono podría colorear en navy en estado selected.
- No usar un checkmark — rompe la lectura limpia.

**Marca:** ✅ coherente con el modelo. El navy como color de estado activo es el uso canónico del primario.  
**Prioridad:** Alto impacto / esfuerzo bajo-medio.

---

#### 6. Acordeón del calculador inverso: el interior de la sección abierta no se diferencia del cerrado

**Qué:** En `m35-inverse-calc.png`, el acordeón "Necesidades" está abierto con sus 6 campos visibles. Las secciones "Deseos" y "Ahorro" están cerradas. El diferenciador visual entre abierto y cerrado es solo el chevron (arriba/abajo). El fondo de la sección abierta y el de las cerradas es el mismo blanco.

**Por qué es un problema:** La sección abierta mezcla visualmente con las cerradas. El usuario no percibe de inmediato que "Necesidades" está activa y las otras no. En un formulario largo de 20 campos esto puede causar que el usuario no sepa dónde está.

**Cómo resolverlo:** La sección activa podría tener:
- Borde izquierdo de 3px en navy (`border-l-4 border-[#14213D]`) — patrón común en acordeones tech.
- O un fondo levemente distinto en el header del acordeón activo (navy/5%).
- No hace falta animar el fondo — el borde ya da suficiente señal.
El título del bloque activo ("Necesidades") podría estar en navy en lugar de negro neutro.

**Marca:** ✅ coherente con el modelo.  
**Prioridad:** Medio impacto / esfuerzo bajo.

---

#### 7. DiagnosisPage: la tabla es densa pero el label de estado ("Adecuado", "Por debajo") no tiene suficiente jerarquía

**Qué:** En `m35-diagnosis.png` (comprimida pero legible) hay una cuarta columna "ESTADO" con textos tipo "Adecuado" / "Por debajo" / "Sin ahorrar". El texto es pequeño y sin diferenciación visual clara entre variantes.

**Por qué es un problema:** El estado es la información más útil para el usuario en esta pantalla (le dice qué está bien y qué no). Pero textualmente se lee al mismo peso que "Tu gasto" o "Recomendado". El ojo no va directamente al estado — va a los números primero. Invertir esto es simple con un badge/pill.

**Cómo resolverlo:** Convertir los estados en badges pequeños usando los tokens semánticos del Bloque C:
- "Adecuado" → pill verde (--success-subtle fondo, --success texto).
- "Por debajo" / "Sin ahorrar" → pill warning o destructive según severidad.
- Tamaño text-xs, Inter Medium 500, padding `px-2 py-0.5`, border-radius pill (9999).
No cambiar el texto, solo el contenedor. El badge rompe el patrón de "muro de texto" de la tabla.

**Marca:** ✅ coherente con el modelo. Los tokens semánticos del Bloque C fueron diseñados exactamente para este uso.  
**Prioridad:** Medio-alto impacto / esfuerzo bajo (es solo CSS sobre texto ya existente).

---

#### 8. La coherence warning screen desaprovecha su momento de atención

**Qué:** En `m35-coherence.png` la pantalla tiene el título correcto en Geist 900 y la alerta warning funciona bien. Pero los tres CTAs ("Editar perfil" / "Editar importes" / "Calcular igualmente") están en la misma fila con el mismo peso visual. "Editar importes" y "Editar perfil" deberían ser secundarios; "Calcular igualmente" es la acción de bypass (la más arriesgada) y visualmente es el que más destaca por ser el único navy filled.

**Por qué es un problema:** La jerarquía de los CTAs invierte la prioridad recomendada de acciones. Las acciones de corrección ("Editar perfil", "Editar importes") deberían ser las más visibles porque son las que llevan al usuario al camino correcto. "Calcular igualmente" es un bypass y debería ser el menos visible — ghost o link, no outline negro. Actualmente los tres tienen el mismo peso de contenedor.

**Cómo resolverlo:** 
- "Editar perfil" → botón primario navy (acción principal de corrección).
- "Editar importes" → botón secundario outline navy.
- "Calcular igualmente" → texto plano azul claro (link con flecha) o variante ghost con texto gris. Que sea accesible pero no invitador.

**Marca:** ✅ coherente con el modelo (regla F4: max 1 primario + 1 secundario por página; aquí hay 3 — viola la regla documentada en el Bloque F).  
**Prioridad:** Medio impacto / esfuerzo mínimo.

---

### MEJORA — considerar cuando el diseño esté estable

#### 9. Ausencia total de momentos de "deleite contenido"

**Qué:** El arquetipo moderno/tech sobrio no significa frío o inexpresivo. El Bloque B abre explícitamente la puerta a "espacio para personalidad en los detalles". Actualmente no hay ningún detalle de deleite: no hay microinteracción en las cards de Home al hacer hover, no hay confetti/celebración cuando el health score es Excelente, no hay ningún momento que haga al usuario sentir que la app está viva.

**Cómo resolverlo (dentro del arquetipo):**
- Hover en las cards de Home: `translate-y-[-2px] shadow-md` en 200ms (el Bloque F ya tiene transiciones 200ms ease-out definidas).
- Cuando el health score es >= 90: un breve fade-in del número con color navy sobre fondo más brillante, o simplemente el número en Geist 900 con `transition-all` al aparecer.
- El botón "Calcular" podría mostrar un spinner inline durante 200-400ms incluso si el cálculo es instantáneo — señaliza que "algo está pasando" (microinteracción de feedback).

**Marca:** ✅ coherente con el modelo. El Bloque F7 ya tiene microinteracciones 200ms y fade-in para resultados. Este consejo es simplemente aplicarlas consistentemente.  
**Prioridad:** Bajo impacto crítico / esfuerzo bajo, pero alta diferenciación percibida.

---

#### 10. Las tablas de resultados: los encabezados de columna y los subtotales por bloque podrían tener más presencia

**Qué:** En `m35-results.png` y `m35-inverse-results.png`, los headers de bloque ("Necesidades", "Deseos", "Ahorro") son text-base en Inter Medium — correcto según el sistema — pero el total monetario del bloque ("720 €", "200 €", "1080 €") en resultados directos aparece alineado a la derecha al nivel del header. Esta cifra es valiosa pero se pierde en el bloque de texto.

**Cómo resolverlo:** El subtotal de bloque podría tener:
- Tamaño text-lg o text-xl, Geist 700 o 900, alineado a la derecha del header de bloque.
- Una línea separadora más gruesa (border-t-2 en lugar de border-t) entre bloques.
Con esto el ojo puede hacer un escaneo rápido: "Necesidades: 720 €, Deseos: 200 €, Ahorro: 1080 €" sin leer cada fila.

**Marca:** ✅ coherente con el modelo. Geist en números importantes está en Bloque D. Separadores son espaciado, no color.  
**Prioridad:** Medio impacto / esfuerzo bajo.

---

#### 11. CalculatorPage: demasiado espacio vacío alrededor de un formulario de 1 campo

**Qué:** En `m35-calculator.png` hay un 60% de espacio blanco por encima y por debajo de la card del formulario. Con un solo campo (ingreso) y dos botones, la pantalla se siente como un placeholder a medio hacer.

**Cómo resolverlo (dos opciones, no acumulables):**
- Opción A (más impacto): añadir un bloque contextual encima de la card en navy invertido con un microcopy de una línea: "Paso final — dinos cuánto ingresas." Rompe el vacío y hace de transición narrativa entre el perfil y el cálculo. El layout pasa de 1 bloque a 2 bloques — dirección vertical, no horizontal, dentro del max-w-2xl.
- Opción B (más conservadora): simplemente reducir el padding vertical del contenedor para que la card quede más centrada en el tercio superior en lugar del centro absoluto. El espacio abajo se siente menos vacío que el espacio distribuido simétricamente.

**Marca:** ✅ coherente con el modelo (la opción A usa la inversión bicromía del Bloque B, pendiente de aplicar).  
**Prioridad:** Medio impacto / esfuerzo bajo.

---

#### 12. DiagnosisForm y InverseCalc: el texto de descripción de cada categoría usa el mismo azul que los links

**Qué:** En `m35-inverse-calc.png` y `m35-diagnosis-form.png`, el texto descriptivo bajo cada campo ("Electricidad, gas, agua, internet y telefonía.", "Tu alquiler mensual…") está en azul. Es el mismo color usado para links. Visualmente sugiere que es clickeable cuando no lo es.

**Cómo resolverlo:** El texto descriptivo auxiliar debería ser `text-slate-500` o `text-slate-400` — gris neutro. El azul se reserva para links reales y el texto info de las alertas. Esta distinción está en el espíritu del Bloque C (limitar los colores cromáticos a funciones específicas).

**Marca:** ✅ coherente con el modelo. El azul actual parece heredado del shadcn default sin haber sido revisado.  
**Prioridad:** Bajo impacto pero es un error de consistencia semántica del color.

---

## Patrones transversales

### Jerarquía visual
El sistema de jerarquía tipográfica funciona a nivel de título de página. Falla a nivel de subestructura dentro de las páginas de resultados: los números de resultado principal no tienen el peso visual que su importancia merece. Las tablas se leen de arriba a abajo en lugar de permitir un escaneo rápido de los datos clave.

### Color
La bicromía navy/blanco está declarada en el Bloque B pero no se ha aplicado aún en ninguna pantalla. Todas las pantallas son blanco + texto navy/negro. La inversión (fondo navy, texto blanco) está pendiente y es el cambio de mayor impacto visual disponible. No rompe el sistema — lo completa.

El azul descriptivo en forms es un residuo del shadcn default que necesita limpieza.

### Espaciado
El ritmo vertical es consistente dentro de cada pantalla pero el blanco total de fondo hace que las páginas de formulario se vean vacías. `slate-50` como fondo de app resuelve esto sin introducir ningún token nuevo.

### Densidad
La decisión de densidad híbrida (aire en forms, denso en resultados) está bien aplicada. Las tablas de resultados son suficientemente densas sin ser ilegibles. No hay nada que corregir aquí.

### Consistencia del sistema
El radio de borde de las cards y los inputs parece consistente (aprox. 8px). El mayor problema de consistencia es el azul descriptivo y la falta de estados selected en ProfilePage.

### Identidad
La identidad visual de "Flouss" ya se percibe como un sistema distinto al shadcn genérico, gracias al header minimal, la tipografía Geist en títulos y el navy. Sin embargo, el producto todavía no tiene "momentos propios" — escenas visuales que solo podrían ser Flouss. La aplicación de la inversión bicromía en los heros de resultados sería el momento que cierra esa brecha.

---

## Lo que NO hay que tocar

Estas decisiones están bien ejecutadas. No tocarlas:

1. **El header minimal.** No agregar navegación ni menú — la app es de flujo único y el header cumple su función exactamente.
2. **La ausencia de color secundario.** El sistema funciona sin acento cromático adicional. No añadir ningún otro color.
3. **La jerarquía tipográfica Geist 900 / Inter 300.** El contraste de peso en títulos vs body es lo más distinctivo de la app. No suavizarlo.
4. **La densidad de las tablas en desktop.** Las tablas de resultados son densas por decisión, no por descuido. Un usuario que usa una app de planificación financiera tolera y necesita densidad.
5. **El footer con disclaimer.** Correcto, necesario y bien ubicado.
6. **Los botones CTAs navy sólidos.** El estilo navy filled con texto blanco es correcto y consistente con el primario.
7. **Los iconos de ProfilePage.** Los iconos lucide inline en las cards de opción son discretos y funcionales. Solo falta el estado selected (ver problema 5).
8. **El acordeón de 3 bloques en InverseCalc y DiagnosisForm.** La organización en Necesidades/Deseos/Ahorro es correcta. El problema es solo el estado activo del acordeón, no la estructura.

---

## Separación objetiva / preferencia estética

Las siguientes observaciones son preferencia estética, no problemas:
- El radio de borde actual (~8px en cards) podría ser 12px para un look más "moderno" — pero 8px tampoco está mal. No es un error.
- La barra de progreso del health score como elemento visual: podría ser un ring circular en lugar de una barra horizontal. Ambos son válidos; la barra es más legible en mobile.
- El interlineado del body en InverseCalc podría ser relaxed (1.75) en las descripciones de categoría para facilitar la lectura en scrolling. Actualmente parece normal (1.5). Ambos son aceptables.
