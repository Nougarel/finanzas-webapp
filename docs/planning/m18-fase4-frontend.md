---
title: Plan UX/UI Fase 4 — Funnel /study
type: planning
created: 2026-05-24
phase: M18 Fase 4
author_agent: frontend
status: draft
---

# Plan UX/UI Fase 4 — Funnel /study (Modo testing guiado)

---

## 1. Visión general UX

El funnel `/study` es una sesión única de investigación académica, no una página de la app financiera. Esta distinción es clave para todas las decisiones de diseño: el participante no viene a usar la app, viene a colaborar en un estudio. El tono, el ritmo y la estructura visual deben comunicar **seriedad académica + fricción reducida**, no onboarding de producto.

### Principios guía adoptados

**1. Un único hilo de atención.** Cada pantalla tiene una sola acción principal. No hay menú, no hay navegación lateral, no hay distracciones. El participante sabe exactamente qué hacer en cada momento.

**2. Confianza desde el primer segundo.** El consentimiento RGPD no puede parecer un "acepta cookies" genérico. Se diseña con espacio visual suficiente, tipografía legible y checkbox semánticamente correcto. La credibilidad del TFG depende de que el participante entienda que sus datos están protegidos.

**3. Tiempo percibido menor que el real.** El dossier ya gestiona esto declarando "10 minutos". El diseño refuerza la percepción de brevedad: pantallas cortas, progreso visible, preguntas bien agrupadas. Nunca mostrar el número total de pantallas restantes; solo mostrar avance.

**4. Mobile-first por defecto.** El canal principal de reclutamiento es WhatsApp. Diseño base para 375px, adaptado para 768px y 1024px. Todas las interacciones táctiles tienen áreas de toque de mínimo 44×44px.

**5. Coherencia visual con la app, no identidad propia.** El funnel usa los mismos tokens (colores, tipografía, radios, spacing) que la app existente. Esto refuerza la sensación de que el cuestionario y la app son parte de lo mismo. La única diferencia intencional es la barra superior durante el uso guiado (decisión U3).

**6. Sin librería de animaciones externa.** Se usa `tw-animate-css` que ya está importada en `globals.css` para transiciones suaves. Nada más.

### Palette y tokens a usar (del tema actual)

El tema es slate (modo claro). Las variables disponibles del proyecto:

- `bg-background` / `text-foreground` — fondo y texto base
- `bg-card` / `text-card-foreground` — tarjetas
- `text-muted-foreground` — texto secundario
- `bg-primary` / `text-primary-foreground` — botón principal
- `bg-secondary` / `text-secondary-foreground` — botón outline
- `border-border` — bordes
- `bg-destructive` / `text-destructive` — errores
- `bg-muted` — fondos sutiles

Para el banner del modo guiado (único elemento diferenciador): se usa `bg-primary` con `text-primary-foreground` — sin introducir colores nuevos.

---

## 2. Wireframes textuales por pantalla

Las dimensiones "móvil" se entienden como 375px de ancho. "Desktop" es ≥768px.

### 2.1 Bienvenida

**Propósito:** Primer contacto. Comunicar qué es, cuánto dura, qué se pide.

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 1/6]          │  ← sticky top, 4px height
├──────────────────────────────────────────┤
│                                          │
│   [centrado vertical en viewport]        │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Estudio sobre un planificador   │   │
│   │  financiero personal             │   │  h1, font-bold, text-2xl
│   │                                  │   │
│   │  Gracias por participar en este  │   │
│   │  estudio. Vas a probar una       │   │  text-sm, text-muted-foreground
│   │  herramienta web...              │   │  (texto literal dossier §2)
│   │                                  │   │
│   │  El proceso es el siguiente:...  │   │
│   │                                  │   │
│   │  La duración estimada es de unos │   │
│   │  10 minutos...                   │   │
│   │                                  │   │
│   │  [Botón primario: Empezar]  →    │   │  w-full en móvil
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Componentes:** `Card` + `CardHeader` + `CardContent` + `Button` (variant default, w-full).  
**Layout:** `flex min-h-screen items-center justify-center p-4`. Card con `max-w-lg w-full`.  
**Asunción:** no hay logo ni branding adicional — coherente con el resto de la app que tampoco lo tiene.

---

### 2.2 Consentimiento RGPD

**Propósito:** Consentimiento explícito, no premarcado, RGPD. El botón permanece deshabilitado hasta marcar.

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 1/6]          │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Antes de empezar, una nota      │   │
│   │  sobre tus datos                 │   │  h1
│   │                                  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ Este estudio recoge...     │  │   │  ScrollArea o div con
│   │  │ (147 palabras del dossier) │  │   │  max-h-48 overflow-y-auto
│   │  │                            │  │   │  border rounded-md p-4
│   │  │ ...Frankfurt...RGPD...     │  │   │  bg-muted/30
│   │  └────────────────────────────┘  │   │
│   │                                  │   │
│   │  ┌──┐ He leído lo anterior y    │   │
│   │  │  │ acepto participar de      │   │  Checkbox + Label
│   │  └──┘ forma anónima             │   │  (htmlFor vinculado)
│   │                                  │   │
│   │  [Continuar]  ← disabled si !ok │   │  Button full-width
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Componentes:** `Card` + `CardHeader` + `CardContent` + `Checkbox` (shadcn — ver nota) + `Label` + `Button`.  
**Nota sobre Checkbox:** el proyecto actualmente tiene Button, Input, Label y Card en `src/components/ui/`. El Checkbox de shadcn/ui no está instalado. Hay dos opciones:

- Opción A: instalar con `npx shadcn add checkbox` (recomendado — mantiene consistencia con el sistema)
- Opción B: usar `<input type="checkbox">` nativo con estilos Tailwind mínimos

**Recomendación: Opción A.** El Checkbox de shadcn/ui new-york ya tiene focus ring, contraste correcto y es accesible. Una sola instalación para un componente que se usa en un lugar crítico (consentimiento RGPD) justifica la adición.

**Lógica de accesibilidad:** el botón "Continuar" lleva `aria-disabled="true"` cuando no está marcado, no `disabled` puro, para que siga siendo Tab-navigable y el screen reader pueda leer su estado.

**Variante del texto del consentimiento:** el bloque de texto tiene scroll propio en móvil (`max-h-48 overflow-y-auto`) para que el checkbox sea visible sin bajar toda la página. En desktop el texto se puede expandir completo.

---

### 2.3 Demografía

**Decisión U1 aplicada: una sola pantalla scrolleable.**

**Propósito:** 6 preguntas ordenadas. Todas obligatorias. Validación en submit.

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 2/6 "Tú"]    │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Sobre ti               (h1)     │   │
│   │                                  │   │
│   │  Antes de empezar con la         │   │
│   │  herramienta, cuéntanos          │   │  text-sm muted
│   │  brevemente quién eres...        │   │
│   │                                  │   │
│   │  ─────────────────────────────   │   │  <Separator> o border-t
│   │                                  │   │
│   │  ¿En qué rango de edad estás?    │   │  text-sm font-medium
│   │  ○ Menos de 25 años              │   │
│   │  ○ Entre 25 y 34 años            │   │  RadioGroup vertical
│   │  ○ Entre 35 y 44 años            │   │  gap-2
│   │  ...                             │   │
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ¿Con qué género te identificas? │   │
│   │  ○ Hombre  ○ Mujer  ○ Prefiero…  │   │  RadioGroup horizontal (3 opciones)
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ¿Cuál es el nivel de estudios…? │   │
│   │  [Select dropdown ▼]             │   │  Select shadcn
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ¿Cuál es tu situación laboral…? │   │
│   │  Si tienes varias situaciones…   │   │  text-xs muted (texto ayuda)
│   │  [Select dropdown ▼]             │   │
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ¿Cómo describirías la           │   │
│   │  composición de tu hogar?        │   │
│   │  ○ Vivo sola/o                   │   │  RadioGroup vertical
│   │  ○ En pareja, sin hijos          │   │
│   │  ...                             │   │
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ¿Has usado antes alguna app     │   │
│   │  para llevar tus finanzas…?      │   │
│   │  ○ Sí   ○ No                     │   │  RadioGroup horizontal
│   │                                  │   │
│   │  [Continuar al cuestionario      │   │
│   │   financiero]                    │   │  Button full-width
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Componentes nuevos necesarios (shadcn):**
- `RadioGroup` + `RadioGroupItem` — para todas las preguntas de radio
- `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` — para education_level y employment_status

**Separadores visuales:** `border-t border-border` entre preguntas, no `<Separator>` adicional (evitar componente nuevo si hay alternativa CSS directa).

**Validación:** en submit. Si falta alguna obligatoria, scroll hasta la primera con error + `aria-invalid="true"` + texto de error debajo del grupo.

**Género en horizontal:** las 3 opciones de género caben en horizontal (móvil 375px) con `flex gap-4 flex-wrap`. En caso de duda, vertical es la alternativa segura.

**Nota importante:** los 9 valores de employment_status hacen que un RadioGroup sea demasiado largo (>6 opciones → dropdown). Por eso education y employment usan Select, mientras que las preguntas con ≤6 opciones usan RadioGroup.

---

### 2.4 Big Five (pretest de alfabetización financiera)

**Decisión U2 aplicada: una pregunta por pantalla.**

**Propósito:** 7 pantallas (P0, Q1, P0b, Q2, Q3, Q4, Q5). Cada pantalla tiene enunciado + opciones de respuesta + botón "Siguiente".

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 3/6           │
│   "Conceptos financieros"]               │
├──────────────────────────────────────────┤
│                                          │
│  [mini-indicador interno: 2/7]           │  text-xs muted, arriba derecha de la card
│                                          │
│   ┌──────────────────────────────────┐   │
│   │                                  │   │
│   │  Cinco preguntas breves sobre    │   │  text-xs uppercase tracking-wide
│   │  conceptos financieros           │   │  text-muted-foreground (label de sección)
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  Imagine que cinco hermanos      │   │  text-base o text-lg font-medium
│   │  reciben un regalo de 1.000 €…   │   │  (enunciado literal del dossier)
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  ○ Más de lo que podrían…        │   │  RadioGroup — opción A
│   │  ○ La misma cantidad.            │   │  — opción B
│   │  ○ Menos de lo que podrían…      │   │  — opción C
│   │                                  │   │
│   │  [Confirmar respuesta]           │   │  Button full-width
│   │                                  │   │  disabled hasta seleccionar
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Para preguntas numéricas (P0 y P0b):**

```
│   │  Imagine que cinco hermanos…     │   │
│   │                                  │   │
│   │  Tu respuesta (€):               │   │
│   │  [___________]                   │   │  Input type="number"
│   │                                  │   │
│   │  [Confirmar respuesta]           │   │  disabled hasta valor > 0
│   └──────────────────────────────────┘   │
```

**Componentes:** `Card` + `CardContent` + `RadioGroup` + `RadioGroupItem` + `Label` + `Button` + `Input` (para P0 y P0b).

**Sin botón "Volver":** el dossier indica explícitamente que no se permite volver atrás una vez confirmada cada respuesta. El botón de volver no existe en estas pantallas.

**Mini-indicador interno:** texto discreto "Pregunta 2 de 7" en la esquina superior derecha de la card, usando `text-xs text-muted-foreground`. Este indicador es independiente de la barra de progreso principal (que marca la etapa 3/6 del funnel) y da contexto de duración dentro de esta etapa.

**Nota sobre P0 y P0b:** el dossier las llama "previas" y dice que no puntúan. El diseño las trata visualmente igual que las demás (misma card, mismo layout) para no crear confusión. La distinción la gestiona el arquitecto en cómo las almacena.

---

### 2.5 Transición a la app + wrapping durante uso guiado

**Pantalla de transición (brief):**

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 4/6           │
│   "Herramienta"]                         │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │                                  │   │
│   │  Ahora vas a probar la           │   │  h1
│   │  herramienta                     │   │
│   │                                  │   │
│   │  Tómate tu tiempo para           │   │  text-sm muted
│   │  explorarla. Cuando hayas        │   │  (texto literal dossier §6)
│   │  terminado, pulsa el botón       │   │
│   │  "He terminado" para pasar       │   │
│   │  a la valoración final.          │   │
│   │                                  │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │ Tienes que probar los tres │  │   │  Callout/alert sutil
│   │  │ flujos antes de terminar:  │  │   │  bg-muted rounded-md p-3
│   │  │  · Cálculo directo         │  │   │  text-sm
│   │  │  · Cálculo inverso         │  │   │
│   │  │  · Diagnóstico             │  │   │
│   │  └────────────────────────────┘  │   │
│   │                                  │   │
│   │  [Ir a la herramienta]           │   │  Button full-width
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Wrapping durante el uso de la app:**

La app existente se renderiza normalmente debajo de una barra fija superior. No se modifica ninguna pantalla de la app.

```
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  │  ← BARRA FIJA (sticky top-0 z-50)
│  │ bg-primary text-primary-foreground │  │  altura: 56px móvil, 48px desktop
│  │                                    │  │
│  │ Estudio en curso                   │  │  text-sm font-medium (izquierda)
│  │                                    │  │
│  │ [● Directo] [○ Inverso] [○ Diag.]  │  │  indicador de flujos (centro/derecha)
│  │                                    │  │  (ver sección 3.3)
│  │ [He terminado ▸]                   │  │  Button variant="secondary" (derecha)
│  │                                    │  │  o disabled con aria-disabled
│  └────────────────────────────────────┘  │
│                                          │
│  [App existente se renderiza aquí]       │
│  (homepage → profile → calculator → ...) │
│                                          │
└──────────────────────────────────────────┘
```

**Decisión U3 aplicada:** banner superior `bg-primary` con texto y botón. El resto de la app no cambia visualmente. Esta es la diferenciación mínima suficiente: el participante siempre sabe que está en modo estudio porque el banner está presente. Un overlay completo o un cambio de fondo serían invasivos y afectarían la percepción natural de la app (que es lo que se mide).

---

### 2.6 SUS (posttest)

**Decisión U1 aplicada: una sola pantalla con 10 ítems.**

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 5/6           │
│   "Valoración"]                          │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  ¿Cómo ha sido la experiencia?   │   │  h1
│   │                                  │   │
│   │  Por favor, valora las siguientes│   │  text-sm muted (texto dossier §7)
│   │  afirmaciones...                 │   │
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  1. Creo que me gustaría         │   │  text-sm font-medium
│   │     utilizar este sistema        │   │
│   │     con frecuencia.              │   │
│   │                                  │   │
│   │  [1]  [2]  [3]  [4]  [5]         │   │  Likert horizontal (ver U4)
│   │   ↑                    ↑         │   │
│   │  Tot. en           Tot. de       │   │
│   │  desacuerdo        acuerdo       │   │  Etiquetas solo en extremos
│   │                                  │   │
│   │  ─────────────────────────────   │   │
│   │                                  │   │
│   │  2. Encontré el sistema          │   │
│   │     innecesariamente complejo.   │   │
│   │                                  │   │
│   │  [1]  [2]  [3]  [4]  [5]         │   │
│   │                                  │   │
│   │  ... (ítems 3 a 10) ...          │   │
│   │                                  │   │
│   │  [Continuar]                     │   │  Button — disabled hasta 10/10
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Decisión U4 aplicada:** radio buttons con números 1-5, etiquetas verbales solo en extremos. Ver detalle en sección 5.

**Contador de progreso del formulario:** "0/10 respondidas" visible en pequeño sobre el botón, actualizándose en tiempo real. Ayuda a saber cuánto falta sin scroll.

---

### 2.7 Ad-hoc posttest

**Misma estructura que SUS. 4 ítems.**

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 5/6           │
│   "Valoración" — todavía en etapa 5]     │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Sobre las recomendaciones       │   │  h1 (texto dossier §8)
│   │  que has recibido                │   │
│   │                                  │   │
│   │  Estas últimas cuatro            │   │  text-sm muted
│   │  afirmaciones...                 │   │
│   │                                  │   │
│   │  [4 ítems con mismo layout       │   │
│   │   Likert que SUS]                │   │
│   │                                  │   │
│   │  [Continuar]                     │   │  disabled hasta 4/4
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Asunción:** SUS y Ad-hoc son pantallas separadas (dos `page.js` distintas), no un formulario fusionado. Razón: el dossier las trata como bloques independientes con títulos diferentes, y mezclarlas en una sola pantalla de 14 ítems violaría el principio de "un único hilo de atención".

---

### 2.8 Cualitativo (opcional)

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 5/6]          │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  ¿Algún comentario antes         │   │  h1
│   │  de terminar?                    │   │
│   │                                  │   │
│   │  Estas dos preguntas son         │   │  text-sm muted (texto dossier §9)
│   │  opcionales...                   │   │
│   │                                  │   │
│   │  ¿Qué te ha resultado más        │   │  Label
│   │  útil de la herramienta?         │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │                            │  │   │  Textarea
│   │  │                            │  │   │  rows=4, maxlength=500
│   │  └────────────────────────────┘  │   │
│   │  [0/500 caracteres]              │   │  contador text-xs muted text-right
│   │                                  │   │
│   │  ¿Qué cambiarías o qué te ha     │   │  Label
│   │  resultado confuso?              │   │
│   │  ┌────────────────────────────┐  │   │
│   │  │                            │  │   │  Textarea
│   │  └────────────────────────────┘  │   │
│   │  [0/500 caracteres]              │   │
│   │                                  │   │
│   │  [Continuar]                     │   │  Button — SIEMPRE habilitado
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Componente nuevo:** `Textarea` de shadcn/ui — a instalar con `npx shadcn add textarea`. Alternativa: `<textarea>` nativo con clases de Input de Tailwind. Se recomienda el componente shadcn para mantener el focus ring y el estilo consistente.

**Contador de caracteres:** actualización en tiempo real con `value.length` — sin librería adicional.

**Botón siempre habilitado:** el dossier dice que son opcionales. El participante puede pulsar sin escribir.

---

### 2.9 Cierre

```
┌──────────────────────────────────────────┐
│  [barra de progreso: etapa 6/6 "Final"]  │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │                                  │   │
│   │  Gracias por participar    (h1)  │   │
│   │                                  │   │
│   │  Tus respuestas se han           │   │
│   │  registrado correctamente y      │   │  text-sm
│   │  de forma anónima...             │   │  (texto literal dossier §10)
│   │                                  │   │
│   │  Si te ha interesado la          │   │
│   │  herramienta, puedes seguir      │   │
│   │  explorándola desde la página    │   │
│   │  principal...                    │   │
│   │                                  │   │
│   │  [Volver al inicio]              │   │  Button full-width
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Comportamiento al pulsar "Volver al inicio":** redirige a `/` (homepage normal). La barra de progreso desaparece (el funnel ha concluido). El modo estudio termina aquí.

---

## 3. Componentes transversales

### 3.1 Barra de progreso

**Decisión U5 aplicada: stepper con etiquetas + barra de fill.**

Las 6 etapas del dossier (sección 11.6): "Bienvenida", "Tú", "Conceptos financieros", "Herramienta", "Valoración", "Final".

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  ●───────●───────○───────○───────○───────○               │
│  Bien-   Tú     Conc.   Herr.   Valor.  Final            │
│  venida                                                  │
│                                                          │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│  (barra fill proporcional: 2/6 = 33%)                   │
└──────────────────────────────────────────────────────────┘
```

**Implementación CSS con tokens del proyecto:**

```
div.progress-bar            → sticky top-0 z-50 bg-background border-b border-border
div.steps                   → flex justify-between px-4 pt-3 pb-1
span.step-dot               → w-3 h-3 rounded-full (completado: bg-primary, activo: bg-primary/60, pendiente: bg-muted)
div.fill-bar                → h-1 bg-muted rounded-full mx-4 mb-2
div.fill-progress           → h-full bg-primary rounded-full transition-all duration-300
```

**Etiquetas en móvil:** solo se muestran en la etapa actual (espacio insuficiente para 6 etiquetas en 375px). Las demás etapas son solo puntos. En desktop (≥768px) se muestran todas las etiquetas.

**Justificación del stepper sobre barra simple:** la barra simple solo da porcentaje (33% completado). El stepper da contexto semántico (estás en "Conceptos financieros", faltan "Herramienta", "Valoración", "Final"). Para una sesión que mezcla cuestionario + uso real de app, el contexto semántico reduce la ansiedad de "cuánto falta" mejor que un porcentaje.

**Justificación sobre el indicador discreto "Paso X de N":** el stepper con puntos es visualmente más eficiente en móvil porque el eye-tracking va directamente al punto activo, sin necesidad de leer texto.

---

### 3.2 Modal de confirmación "He terminado"

**Texto del dossier §11.5:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  ¿Listo para terminar la prueba?            │  text-lg font-semibold
│                                             │
│  Has probado los tres flujos. A partir de   │  text-sm text-muted-foreground
│  aquí pasarás a la valoración final y no    │
│  podrás volver a usar la herramienta en     │
│  esta sesión.                               │
│                                             │
│  [Seguir probando]  [Sí, ir a la valoración]│
│   ↑ variant="outline"   ↑ variant="default" │
│                                             │
└─────────────────────────────────────────────┘
```

**Componente:** `Dialog` de shadcn/ui + `DialogHeader` + `DialogTitle` + `DialogDescription` + `DialogFooter`.

`Dialog` no está instalado actualmente. Alternativas:
- Opción A: instalar `npx shadcn add dialog` (recomendado)
- Opción B: implementar modal con `role="dialog"` + `aria-modal="true"` sobre un overlay con CSS Tailwind puro

**Recomendación: Opción A.** El Dialog de shadcn maneja focus trap, cierre con Escape, aria-describedby, y overlay correctamente. Implementar todo esto manualmente tiene demasiados vectores de error de accesibilidad para una pantalla crítica.

**Comportamiento en móvil:** el Dialog de shadcn/ui new-york ya tiene un comportamiento responsivo correcto — ocupa ancho razonable con margen lateral.

**Focus management:** al abrir el modal, el foco va al botón "Seguir probando" (la acción segura), no al botón principal. Esto sigue la heurística de Nielsen de prevención de errores.

---

### 3.3 Indicador de flujos completados

**Decisión U6 aplicada: lista en la barra superior con checkmarks + decisión U7 sobre tooltip.**

El indicador vive dentro de la barra superior fija. En móvil se presenta de forma compacta; en desktop se expande.

**Versión desktop (≥768px):**
```
│  [✓ Directo]  [○ Inverso]  [○ Diagnóstico]  [He terminado ▸]  │
```

**Versión móvil (375px):**
```
│  1/3 flujos     [He terminado ▸]  │
│  (tap para ver qué falta)         │  → popover al tocar
```

**Implementación:**
- Cada "flujo pill" es un `span` con icono `CheckCircle` (lucide-react, ya en el proyecto) cuando está completado, y `Circle` cuando está pendiente.
- Colores: completado → `text-primary-foreground` con icono `CheckCircle`, pendiente → `text-primary-foreground/50` con icono `Circle`.
- Dado que la barra es `bg-primary`, todo el texto es `text-primary-foreground`.

**Decisión U7 — botón deshabilitado:** texto explicativo siempre visible debajo del botón en desktop, y popover en móvil al tocar el indicador "1/3 flujos". No tooltip al hover (el hover no existe en táctil). El texto siempre visible ("Te falta probar: Inverso, Diagnóstico") es la opción más accesible y menos frágil.

---

### 3.4 Mensajes auxiliares (timeout, errores, confirmación cierre pestaña)

**Timeout (dossier §11.1):**

Se muestra como pantalla completa (reemplaza el contenido actual), no como modal. Cuando la sesión ha expirado, ya no hay contenido válido que mostrar debajo.

```
┌──────────────────────────────────────────┐
│                                          │
│  [centrado vertical]                     │
│                                          │
│  Tu sesión ha caducado           (h1)    │
│                                          │
│  Han pasado 60 minutos...        (p)     │
│                                          │
│  [Recargar y empezar de nuevo]   (Button)│
│                                          │
└──────────────────────────────────────────┘
```

Componente: Card centrada sin barra de progreso.

**Error de conexión (dossier §11.2):**

Se muestra como `Alert` no modal, persistente arriba del contenido actual (no bloquea el scroll):

```
┌─────────────────────────────────────────────────────┐
│ ⚠  No hemos podido guardar tu respuesta...  [Reintentar] │  bg-destructive/10 border-destructive text-destructive-foreground
└─────────────────────────────────────────────────────┘
```

No se instala un componente `Alert` de shadcn si no existe — se implementa con clases Tailwind directas: `flex gap-3 items-start rounded-md border p-4` con los tokens de color de destructive.

**Error genérico (dossier §11.3):**

Mismo layout que error de conexión, texto diferente.

**Confirmación cierre pestaña (dossier §11.4):**

Es el `beforeunload` nativo del navegador. El texto que muestra el navegador es el del dossier, pero la mayoría de navegadores modernos ignoran el texto personalizado y muestran el suyo propio. Esto es correcto — no necesita diseño adicional. Solo se implementa el listener.

---

## 4. Componentes shadcn a usar (lista detallada)

| Componente | Estado actual | Acción requerida | Uso en el funnel |
|---|---|---|---|
| `Button` | Instalado | — | Todas las pantallas |
| `Card`, `CardHeader`, `CardContent` | Instalado | — | Todas las pantallas |
| `Input` | Instalado | — | P0, P0b (numérico), cualitativo |
| `Label` | Instalado | — | Todas las preguntas |
| `RadioGroup`, `RadioGroupItem` | No instalado | `npx shadcn add radio-group` | Demografía, Big Five, Likert |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | No instalado | `npx shadcn add select` | Demografía (education, employment) |
| `Checkbox` | No instalado | `npx shadcn add checkbox` | Consentimiento RGPD |
| `Dialog`, `DialogHeader`, `DialogTitle`, etc. | No instalado | `npx shadcn add dialog` | Modal "He terminado" |
| `Textarea` | No instalado | `npx shadcn add textarea` | Cualitativo |

**Total: 5 componentes shadcn nuevos** a instalar. Todos son componentes estándar del catálogo shadcn/ui new-york compatible con la configuración actual del proyecto.

**Componente lucide-react a usar:**
- `CheckCircle` — flujo completado en indicador
- `Circle` — flujo pendiente en indicador
- `AlertTriangle` — ya en uso en DiagnosisFormPage, usar igual en errores

---

## 5. Decisiones U1-U10 con recomendaciones

### U1 — Pantalla larga vs paginada (demografía, SUS)

**Recomendación: pantalla única scrolleable, con excepciones.**

- **Demografía (6 preguntas):** una sola pantalla. Justificación: las 6 preguntas tienen lógica temática común ("sobre ti"), son rápidas de responder y la pantalla única permite al participante repasar sus respuestas antes de confirmar. El scroll no es largo — en móvil ocupa aproximadamente 2.5 viewports.

- **SUS (10 ítems):** una sola pantalla. Justificación: el SUS fue diseñado para responderse de un tirón, "rápido, con la primera reacción que tengas" (texto del dossier). Paginar el SUS aumentaría el tiempo de respuesta y podría introducir sesgo de reflexión entre páginas. La investigación HCI sobre SUS (Brooke, 1996) asume respuesta inmediata en formato único.

- **Por qué no el mixto:** dividir SUS en 2×5 no resuelve el problema de scroll (sigue habiendo) y añade una interacción innecesaria. Si se va a paginar, paginar por ítem (U2 del Big Five) es más justificable cognitivamente.

**Trade-off asumido:** en móvil con 10 ítems Likert, el scroll es de ~3 viewports. Se mitiga con el contador "X/10 respondidas" que muestra progreso sin necesidad de scroll.

---

### U2 — Big Five: una pregunta por pantalla

**Recomendación: una pregunta por pantalla.**

Justificación:
1. Las preguntas son cognitivamente exigentes, especialmente P0 (cálculo mental de división) y P0b (interés simple). Mostrar dos o más a la vez compite por la atención de trabajo de memoria.
2. El dossier ya indica "sin permitir volver atrás una vez confirmada cada respuesta" — esto es un diseño intencional de cuestionario psicométrico estándar (evita que el participante cambie respuestas anteriores al ver preguntas posteriores).
3. 7 pantallas de Big Five no aumentan el tiempo real (click + responder es igual de rápido), pero sí la sensación de control.

**Contra-argumento y mitigación:** 7 pantallas pueden sentirse largas. Mitigación: el mini-indicador "Pregunta X de 7" dentro de la etapa 3/6 del stepper principal da contexto de cuánto falta.

---

### U3 — Estilo visual modo guiado vs normal

**Recomendación: banner superior fijo `bg-primary` con indicador de flujos y botón "He terminado".**

**Por qué no overlay con borde de color:** un borde de color perimetral rodea toda la app y es visualmente invasivo. El participante está intentando usar la app con naturalidad — un borde de color constante es un recordatorio intrusivo que podría alterar el comportamiento observado.

**Por qué no cambio de fondo:** la app usa `bg-background` (blanco). Cambiar el fondo durante el modo guiado introduciría un token de color nuevo que no existe en el tema actual.

**Por qué no solo el botón "He terminado":** sin indicador de contexto, el participante podría olvidar que está en modo estudio. Un banner discreto pero permanente establece el contexto sin interferir.

**Por qué `bg-primary` (slate oscuro):** usa los tokens existentes, contrasta bien con el fondo de la app, y es visualmente distinguible del contenido sin introducir colores nuevos.

---

### U4 — Rendimiento Likert 1-5

**Recomendación: 5 radio buttons con números 1-5, etiquetas verbales solo en extremos.**

```
   Tot. en                    Tot. de
   desacuerdo                 acuerdo
   [1]    [2]    [3]    [4]    [5]
```

Justificación basada en literatura HCI:
- Los sliders tienen baja precisión en móvil táctil y alta varianza de respuesta (Couper et al., 2006).
- Las 5 estrellas tienen connotación de "valoración de producto" que puede crear sesgo de aquiescencia en escala de usabilidad.
- Los radio buttons con números son el formato estándar del SUS en todos sus estudios de validación, incluido Castilla et al. (2024) que valida la versión española.
- Etiquetas verbales solo en extremos (no en cada opción) es la práctica recomendada por Brooke (1996) y evita el clutter visual que haría el ítem ilegible en móvil.

**Área de toque:** cada radio button tiene un `label` que envuelve el círculo y el número, con `min-h-[44px] min-w-[44px]` para cumplir el mínimo de accesibilidad táctil.

**Espaciado horizontal:** en 375px, 5 items con padding razonable ocupan `flex justify-between w-full`. No se permite scroll horizontal.

---

### U5 — Barra de progreso

**Recomendación: stepper con puntos + barra de fill + etiquetas contextuales.**

Argumentación detallada en sección 3.1. Resumen:
- El stepper comunica estructura semántica (dónde estoy, qué falta) mejor que un porcentaje.
- La barra de fill añade el componente cuantitativo sin duplicar información.
- Las etiquetas textuales del dossier ("Tú", "Herramienta", etc.) reducen la ansiedad de duración.

**Por qué no "sin barra":** el dossier (sección 11.6) indica explícitamente que debe haber un indicador de progreso con esas 6 etiquetas. No es una decisión discrecional.

---

### U6 — Indicador de estado de flujos

**Recomendación: lista con checkmarks en la barra superior, compacta en móvil.**

Argumentación detallada en sección 3.3. Resumen:
- El indicador permanente en la barra informa sin interrupción. El participante no tiene que abrir nada para saber cuánto le falta.
- En móvil, "1/3 flujos" con popover al tocar es la versión compacta que no satura la barra.
- La alternativa toast/notificación al completar cada flujo es complementaria, no sustitutiva — un toast al completar un flujo ("¡Flujo directo completado!") es un feedback positivo que se puede añadir sin conflicto.

---

### U7 — Tooltip botón deshabilitado

**Recomendación: texto siempre visible debajo del botón en desktop; popover en móvil.**

```
[He terminado]  ← disabled
Te falta probar: Inverso, Diagnóstico   ← text-xs muted debajo del botón
```

**Por qué no tooltip al hover:** el hover no existe en táctil. En desktop el tooltip funciona, pero en móvil el botón está deshabilitado y el participante no recibiría el mensaje. El texto siempre visible funciona en ambas plataformas.

**Por qué no modal al click en botón deshabilitado:** los botones deshabilitados no deberían responder a clicks (viola el modelo mental del usuario). La información tiene que estar disponible antes de que el usuario necesite hacer click.

---

### U8 — Mobile-first

| Elemento | Mobile (375px) | Desktop (≥768px) |
|---|---|---|
| Barra de progreso | Solo punto activo con etiqueta | Todos los puntos con etiquetas |
| Modal "He terminado" | Ancho completo con margen lateral 16px | Ancho fijo max-w-sm centrado |
| Demografía | Una pantalla scrolleable | Una pantalla scrolleable |
| Indicador de flujos | "X/3 flujos" + popover | 3 pills con checkmarks |
| Texto debajo del botón deshabilitado | Texto visible (no tooltip) | Texto visible (no tooltip) |
| RadioGroup Likert | `flex justify-between w-full` | Mismo, con más padding |
| Textarea cualitativo | rows=3 | rows=4 |

**Área de toque mínima:** 44×44px en todos los elementos interactivos (radio buttons, checkbox, botones). Verificado contra WCAG 2.5.5.

---

### U9 — Tiempo entre transiciones y feedback

**Recomendación: transición suave de opacidad (~150ms) sin spinner si la operación es local; spinner solo si hay operación de red.**

**Transiciones entre pantallas del funnel:**

La app usa Next.js App Router. Cada pantalla del funnel puede ser una ruta separada o un componente condicional en `/study`. Esta es una decisión del arquitecto. Independientemente:
- Si se usan rutas: el cambio de página tiene el comportamiento por defecto de Next.js (sin transición — el `tw-animate-css` ya importado permite añadir `animate-in fade-in duration-150` en el wrapper de cada pantalla).
- Si se usa estado interno: una transición de opacidad con CSS puro (`transition-opacity duration-150`) envuelta en el componente padre.

**Feedback en operación de guardado (Supabase):**

Al pulsar "Confirmar respuesta" en Big Five o "Continuar" en cualquier pantalla: el botón muestra estado de carga (spinner o texto "Guardando...") mientras la operación de red se resuelve. Si la operación falla, aparece el mensaje de error (sección 3.4). El botón no navega hasta que la operación confirma éxito.

**Clase CSS para el spinner:** el proyecto importa `tw-animate-css` — la clase `animate-spin` de Tailwind funciona sin librerías adicionales. Un `Loader2` de lucide-react con `animate-spin` es suficiente.

---

### U10 — Accesibilidad WCAG

**Requisitos mínimos verificados:**

| Criterio | Implementación |
|---|---|
| WCAG 1.4.3 — Contraste ≥4.5:1 | Usar solo tokens del tema slate (verificados en el proyecto actual) |
| WCAG 2.4.7 — Foco visible | shadcn/ui new-york ya incluye `outline-ring/50` en `globals.css` línea 121 |
| WCAG 2.1.1 — Navegación por teclado | `RadioGroup` y `Select` de shadcn ya son navegables por teclado |
| WCAG 1.3.1 — Información y relaciones | `htmlFor`/`id` vinculados en todos los inputs; `aria-labelledby` en grupos de radio |
| WCAG 3.3.1 — Identificación de errores | Errores en texto, no solo color; mensajes descriptivos; `aria-invalid="true"` |
| WCAG 2.5.5 — Tamaño del objetivo | Mínimo 44×44px en todos los elementos interactivos |
| WCAG 4.1.3 — Mensajes de estado | `aria-live="polite"` en el contador "X/10 respondidas" |
| Semántica HTML | `<main>`, `<h1>`, `<form>`, `<fieldset>` + `<legend>` para grupos de radio, `<button>` para acciones |

**`<fieldset>` + `<legend>` en grupos de radio:** cada `RadioGroup` se envuelve en `<fieldset>` con `<legend>` que reproduce el texto de la pregunta. Esto es obligatorio para screen readers (sin esto, el usuario de NVDA/JAWS no sabe a qué pregunta corresponde cada opción).

**Contraste del banner `bg-primary` (slate oscuro) sobre `text-primary-foreground`:**
- `--primary`: `oklch(0.208 0.042 265.755)` ≈ slate-900
- `--primary-foreground`: `oklch(98.415% 0.00352 248.585)` ≈ casi blanco
- Ratio ≈ 15:1. Cumple WCAG AAA.

---

## 6. Mobile-first considerations

Ver tabla en U8. Añadido:

**Orden de carga:** el funnel empieza en `/study` — una ruta nueva. El First Contentful Paint crítico es la pantalla de bienvenida. Dado que la app es Next.js App Router, esta pantalla puede ser Server Component (sin `'use client'`) si no tiene estado interactivo. La bienvenida es texto + un botón de navegación → Server Component por defecto.

**Scroll suave:** `scroll-behavior: smooth` en el wrapper de formularios largos (demografía) para que el scroll al primer error sea suave, no abrupto.

**Viewport height en Safari iOS:** el `min-h-screen` con viewport units en iOS Safari puede ser problemático (la barra de herramientas del navegador reduce la altura real). Usar `min-h-[100dvh]` (dynamic viewport height) en lugar de `min-h-screen` para las pantallas centradas verticalmente. Tailwind v4 soporta unidades dinámicas.

---

## 7. Accesibilidad WCAG

Detallada en U10. Puntos adicionales:

**`aria-disabled` vs `disabled` en botones:** el botón "Continuar" deshabilitado hasta marcar el checkbox usa `aria-disabled="true"` pero no el atributo `disabled`. Esto lo mantiene en el tab-order y permite que el screen reader anuncie "Continuar, no disponible". Si se usa `disabled`, el botón desaparece del tab-order y el usuario de teclado no puede descubrir que existe.

**Anuncio de completado de flujo:** al completar un flujo de la app durante el modo guiado, un elemento `aria-live="polite"` anuncia el cambio ("Flujo directo completado. Quedan 2 flujos por probar.") sin interrumpir el flujo actual del usuario.

**Gestión de foco entre pantallas:** al navegar a una nueva pantalla del funnel, el foco debe ir al `<h1>` de la nueva pantalla (o al elemento principal). En Next.js App Router, la gestión de foco entre rutas no es automática — requiere un `useEffect` que llame a `document.querySelector('h1')?.focus()` con `tabIndex={-1}` en el `<h1>`. Esto es crítico para usuarios de teclado.

---

## 8. Animaciones / micro-interacciones

**Principio:** la suite `tw-animate-css` ya está importada. No se introduce ninguna librería adicional.

| Interacción | Implementación |
|---|---|
| Entrada de cada pantalla del funnel | `animate-in fade-in duration-150` en el contenedor raíz del componente |
| Botón al pasar de disabled a enabled | `transition-opacity duration-200` — el botón aparece con 100% opacidad |
| Fill de la barra de progreso | `transition-all duration-300` en el div de fill |
| Apertura del modal Dialog | Comportamiento por defecto de Radix/shadcn (zoom-in ya incluido) |
| Toast al completar flujo (opcional) | Solo si el arquitecto implementa un sistema de toast — no añadir `sonner` sin aprobación |

**Sin animaciones en:**
- Opciones de radio al seleccionarlas (el check nativo es suficiente)
- Scroll entre preguntas de SUS (el scroll nativo es suficiente)
- Transiciones entre preguntas del Big Five (si son rutas separadas, la transición es de Next.js)

---

## 9. Riesgos UX y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| El participante no entiende que tiene que probar los 3 flujos | Alta | Alto | Callout explícito en la pantalla de transición + indicador permanente en la barra |
| El botón "He terminado" deshabilitado genera confusión | Media | Alto | Texto siempre visible debajo del botón con los flujos pendientes |
| Abandono mid-scroll en demografía | Baja | Medio | Las 6 preguntas están bien acotadas; scroll es ~2.5 viewports en móvil |
| El participante hace click en "Seguir probando" en el modal por error | Media | Bajo | El foco va al botón seguro ("Seguir probando"), no al destructivo |
| La barra superior fija tapa contenido de la app | Media | Medio | La app existente usa `py-12` o `p-8` en la mayoría de pantallas; el arquitecto debe añadir `pt-14` al wrapper del contenido para compensar los 56px de la barra |
| El scroll de la barra de progreso en móvil confunde con el scroll de la app | Baja | Bajo | La barra es `sticky top-0 z-50` — no scrollea |
| Preguntas Big Five sin opción de volver generan frustración | Media | Bajo | La intro ("No es un examen, si no sabes marca No lo sé") reduce la presión |
| `beforeunload` ignorado por el navegador | Alta | Bajo | Los navegadores modernos muestran su propio mensaje genérico; el texto del dossier §11.4 es el mensaje de fallback para navegadores que aún lo respetan |

---

## 10. Preguntas pendientes para el usuario

1. **Modo oscuro:** el tema del proyecto define variables para `.dark` en `globals.css`. El funnel, ¿debe soportar modo oscuro o solo modo claro? Si solo modo claro, la barra superior con `bg-primary` (slate oscuro) funciona bien. Si modo oscuro, el contraste de la barra en dark mode requiere revisión (en dark, `--primary` es casi blanco y el texto sería oscuro).

2. **¿Toast al completar cada flujo?** La sección U6 menciona un toast como complemento al indicador permanente. ¿Se implementa? Requeriría instalar `sonner` (ya está en las dependencias de shadcn/ui new-york como recomendado) o un componente de toast custom. Si se aprueba, añadir `npx shadcn add sonner` a la lista de instalaciones.

3. **Big Five — ¿se muestra la respuesta correcta?** El dossier no lo menciona explícitamente. Las preguntas P0 y P0b tienen respuestas correctas conocidas (200 y 102). ¿Se da feedback de "correcto/incorrecto" al participante tras confirmar, o se guarda sin feedback? Si hay feedback, el diseño necesita un estado adicional en la card.

4. **Dirección de acceso al funnel:** ¿el enlace `/study` estará disponible en la homepage normal? ¿O es un enlace separado que no aparece en la navegación principal? Esto afecta si hay que añadir algo a `HomePage.jsx` o si `/study` es completamente independiente.

5. **¿El funnel funciona también en la app existente en producción o es solo para el período de estudio?** Si hay una fecha de cierre, el arquitecto puede gestionar la disponibilidad de la ruta, pero hay que comunicárselo.

---

## 11. Dependencias con el plan del arquitecto

| Decisión UX | Depende del arquitecto |
|---|---|
| Indicador de flujos completados en la barra | El arquitecto define qué señal indica "flujo completado" y cómo se propaga al componente de barra |
| Botón "He terminado" habilitado/deshabilitado | El arquitecto define cuándo se cumplen las condiciones (mínimo 1 cálculo por flujo) |
| `pt-14` en el wrapper de la app existente | El arquitecto decide si el wrapping se hace con layout de Next.js o con componente padre |
| Spinner en botón "Continuar" | El arquitecto expone la promesa/resultado de la operación de guardado para que el componente pueda mostrar el estado de carga |
| Gestión del timeout de 60 minutos | El arquitecto implementa el temporizador; el frontend solo recibe la señal para mostrar la pantalla de timeout (sección 3.4) |
| Rutas del funnel (rutas separadas vs estado interno) | Si son rutas separadas, cada pantalla es un componente independiente. Si es estado interno en `/study`, hay un componente padre que gestiona qué pantalla renderizar. Ambos son compatibles con este plan de UX. |
| `aria-live` para completado de flujo | El arquitecto expone el evento de completado; el frontend añade el anuncio accesible |

---

*Fin del plan UX/UI Fase 4 — frontend agent — 2026-05-24*
