---
title: Plan arquitectónico Fase 4 — Funnel /study
type: planning
created: 2026-05-24
phase: M18 Fase 4
author_agent: arquitecto
status: input para plan consolidado
related:
  - docs/planning/m18-fase4-plan-consolidado.md
  - docs/planning/m18-fase4-frontend.md
  - docs/dossier/m18-cuestionario-md1.md
---

# Plan arquitectónico — Fase 4 M18 (funnel `/study`)

Plan entregado por el agente `arquitecto` el 2026-05-24 como input para el plan consolidado. Cubre decisiones estructurales (estado global, routing, integración con app existente, lógica de seguimiento, timeout, validación, errores). El plan UX/UI lo cubre el agente `frontend` por separado.

## Problema entendido

Construir el **funnel single-session** del estudio M-D1 sobre la app existente sin acoplar el sistema de research a las páginas principales de la app (calculator, results, etc.). El funnel encadena 9 pantallas (bienvenida, consentimiento, demografía, Big Five, **uso instrumentado de la app**, SUS, ad-hoc, cualitativo, cierre) con:

- Barra de progreso persistente
- Botón "He terminado" deshabilitado hasta probar los 3 flujos (direct + inverse + diagnosis)
- Timeout duro de 60 min
- Sin posibilidad de volver atrás ni refrescar (declarado en dossier §13.5)
- Persistencia mínima en Supabase vía recorder ya existente

**Requisitos no funcionales clave que condicionan el diseño:**

| Requisito | Implicación arquitectónica |
|---|---|
| Aislamiento total con la app normal | No tocar páginas existentes excepto via mecanismo opt-in |
| Single-session (Galesic & Bosnjak) | No persistir progreso del funnel; refresh = reset |
| Datos académicos (TFG) | Mensajes de error claros pero NO bloquear avance ante fallos de red |
| JS puro, sin libs extra | Descartar Zustand, Jotai, Redux Toolkit |
| Recorder ya validado | No reescribir, integrar como dependencia |
| Texto literal vinculante | Centralizar copy del dossier en un único módulo |
| `studyMode` invariante | Único punto de verdad, propagación cero-prop-drilling |

**Impacto global:** Alto — se introduce un subsistema completo (~15-20 archivos nuevos), un Provider global, un timer crítico y un wrapping no invasivo de 6 páginas existentes. Pero **el diseño debe ser cerrado**: ninguna decisión del funnel debe filtrarse al uso normal de la app.

---

## D1 — Gestión de estado `studyMode` global

### Alternativas evaluadas

| Opción | Pros | Contras |
|---|---|---|
| A. Context API + Provider en `app/study/layout.js` | Cero deps externas. Provider montado solo en rutas `/study/*` → fuera del funnel el contexto no existe, garantía estructural de aislamiento. React 19 lo soporta nativamente. | Cada componente que necesita el estado lee con `useContext(StudyContext)`. Verboso si hay muchos consumidores, pero hay pocos. |
| B. Zustand | API limpia, sin Provider, selectores granulares. | Dependencia externa nueva (contra preferencia del proyecto). Estado global "vivo" incluso fuera de `/study` salvo cleanup explícito → riesgo de fugas. |
| C. Prop drilling explícito | Cero magia. | Inviable: el estado debe llegar al wrapper de cada página y a sub-componentes a 3-4 niveles. |
| D. Query param `?study=1` + hook | Estado en la URL, fácil de debug. | Frágil: cualquier `router.push("/calculator")` interno pierde el flag. Pollución de URLs. |
| E. localStorage flag | Persistente, sobrevive a navegación. | **Contradice el ADR de aislamiento**: una sesión rota puede dejar la flag pegada y romper el modo normal. Cross-tab leak. |

### Recomendación: **A. Context API + Provider en `app/study/layout.js`**

**Justificación:**

1. **Aislamiento estructural por routing** — el Provider solo se monta cuando el path empieza por `/study`. Si el usuario navega a `/calculator` fuera del funnel, el contexto literalmente no existe y `useStudyContext()` devuelve `null`. Esto es la garantía más fuerte de la invariante "studyMode solo activo dentro del funnel".
2. **Zero deps**, alineado con CLAUDE.md.
3. **Pocos consumidores** (calculator/results/inverse-*/diagnosis-* wrapped + componentes del funnel) → el verboso de `useContext` no es problema.
4. La opción E (localStorage) es **anti-patrón aquí**: persistir el flag puede dejar la app principal en modo research si una sesión se rompe.

**Forma del contexto:**

```js
{
  // identidad de sesión (vienen de useStudySession)
  sessionId, userId, sessionStatus,

  // estado del funnel
  currentStep,                   // 'welcome' | 'consent' | ... | 'closing'
  progressPct,                   // 0-100, derivado de currentStep
  goToStep(stepId),              // único setter de navegación interna

  // tracking de flujos
  completedFlows,                // { direct: bool, inverse: bool, diagnosis: bool }
  markFlowCompleted(flowType),   // llamado desde el wrapping de calculator/results
  canFinish,                     // derivado: las tres completedFlows true

  // timeout
  timeRemainingMs,
  isExpired,

  // errores (sin bloquear)
  lastRecorderError,             // último error reportado, para UI no bloqueante
  clearError,
}
```

**Detalle clave:** el contexto NO expone el cliente Supabase. Las llamadas al recorder se hacen desde un hook intermedio (`useStudyRecorder`) que internamente crea el cliente con `createStudyClient()` y reutiliza `sessionId` del contexto. Esto evita que cualquier componente del funnel pueda hacer queries arbitrarias.

---

## D2 — Wrapping de páginas existentes en modo guiado

Aquí está la decisión arquitectónica más delicada porque toca código existente que **no se debe modificar**.

### Alternativas evaluadas

| Opción | Pros | Contras |
|---|---|---|
| A. Route Group `app/study/(app)/calculator/page.js` que re-exporta | Cada ruta `/study/calculator` monta el layout `/study` + el componente original. Aislamiento total. | Hay que crear 6 archivos `page.js` shells (uno por página app). Duplicación mínima (1 línea de import + render). |
| B. HOC `withStudyShell(CalculatorPage)` | Reutiliza componente. | Mismo número de shells. HOC es anti-patrón en React moderno (preferir composición). |
| C. Detector dentro de cada CalculatorPage (`if (studyMode)`) | Cero shells nuevos. | **Acopla la app a research**: rompe el principio "calculators puros, páginas independientes". Filtra `useContext(StudyContext)` a componentes que nunca debieron conocerlo. Si rompo el contexto, rompo el modo normal. |
| D. Duplicar páginas dentro de `/study/app/` | Aislamiento total. | Duplica ~1500 líneas de JSX. Anti-patrón flagrante. |
| E. Hijack del Router (interceptar `router.push` en el funnel) | Cero cambios. | Acoplamiento implícito invisible. Pesadilla de debugging. Imposible mantener. |

### Recomendación: **A. Route Group `app/study/(app)/...` re-exportando los componentes existentes**

**Justificación:**

1. **Aislamiento estructural por convención de Next.js**: el route group `(app)` no afecta a la URL pero permite que las rutas `/study/calculator`, `/study/results`, etc., compartan el `layout.js` de `/study`. Las URLs reales son `/study/calculator` (no `/calculator`), lo que evita colisión con la app normal.
2. **Los componentes originales (`CalculatorPage.jsx`, etc.) NO se modifican**. Las shells `/study/(app)/calculator/page.js` simplemente hacen:
   ```js
   import CalculatorPage from "@/components/pages/CalculatorPage";
   export default CalculatorPage;
   ```
3. **El comportamiento "modo guiado" se inyecta vía el layout `/study/layout.js`**, que monta:
   - El `StudyProvider`
   - Una `StudyBar` persistente (botón "He terminado", estado de flujos, progreso, timer)
   - Un `<StudyNavigationGuard>` que intercepta intentos de navegar a rutas no permitidas

4. **Las páginas originales detectan el modo guiado de forma desacoplada vía hook opcional**:
   ```js
   // dentro de ResultsPage.jsx, NO se modifica el componente principal
   // pero se añade UN solo punto de integración:
   const study = useStudyContextOptional();  // devuelve null fuera de /study
   // Cuando confirma cálculo:
   if (study) study.notifyCalculation('direct', { profile, input, output });
   ```

   **Aquí sí hay UNA modificación mínima en ResultsPage/InverseResultsPage/DiagnosisPage.** Pero es:
   - 3 líneas por componente
   - Sin lógica condicional intrusiva (el hook devuelve `null` fuera del funnel)
   - El "notify" es fire-and-forget, no bloquea el flujo normal

**Trade-off aceptado:** introduzco un acoplamiento mínimo (las páginas conocen que existe `useStudyContextOptional`), pero a cambio gano: cero duplicación, cero detección en runtime de URLs, cero hijack del router. Es un acoplamiento **honesto y explícito**.

---

## D3 — Routing dentro del funnel

### Recomendación: **B. Single route `/study` con state machine interna**

**Justificación:**

1. **El dossier exige single-session sin posibilidad de back ni refresh**. Si uso rutas separadas, el browser back navega a pantallas anteriores incluso aunque las "bloquee" con guards — la UX se vuelve confusa.
2. **Refresh = reset es el comportamiento deseado** (dossier §13.5). Con state machine interna, esto es gratis: refresh recarga `/study` → vuelve a `welcome`. Con rutas separadas, tendría que detectar "estoy en `/study/sus` pero no he pasado por `/study/welcome`" y redirigir manualmente.
3. **Las fases del uso de la app (`/study/(app)/calculator`...) sí son rutas separadas** porque ahí necesito el routing real de Next.js para navegar entre calculator → results → diagnosis-form etc. Esto convive con el single-route del funnel: el funnel "delega" a las rutas `(app)` durante la fase 5, y vuelve al single-route para el posttest.

**Estructura de routing resultante:**

```
/study                     → single-route con state machine (welcome → consent → demo → pretest → "ir a app")
/study/calculator          → ruta real (re-export de CalculatorPage)
/study/results             → ruta real
/study/inverse-calculator  → ruta real
/study/inverse-results     → ruta real
/study/diagnosis-form      → ruta real
/study/diagnosis           → ruta real
/study/posttest            → vuelta al single-route con state machine (sus → adhoc → qualitative → closing)
```

---

## D4 — Seguimiento de flujos completados

### Recomendación: **A. Estado React local + side-effect de escritura en `app_interactions`**

**Justificación:**

1. El recorder ya garantiza que cada cálculo persiste en `app_interactions`. **La BBDD es la fuente de verdad para análisis offline.**
2. Para la UI en tiempo real, el estado local del Provider es suficiente porque el funnel es single-session: el usuario no abre dos pestañas.
3. Si la escritura a Supabase falla, el cliente igualmente marca el flujo como completado (no bloqueamos al participante por fallos de red). En BBDD faltaría la fila → la sesión saldrá del análisis con menos `flow_type` registrados, pero no es bloqueante.
4. El criterio del dossier §6 ("al menos un cálculo en cada flow_type") se chequea contra `completedFlows` en memoria.

**Flujo concreto:**
1. Usuario confirma cálculo en `ResultsPage` (modo estudio activo).
2. `useStudyContextOptional()` devuelve el contexto → llama a `study.notifyCalculation('direct', payload)`.
3. `notifyCalculation` hace 2 cosas en paralelo:
   - `setCompletedFlows(prev => ({ ...prev, direct: true }))` (síncrono, instantáneo)
   - `recordInteraction(client, sessionId, payload)` (asíncrono, no espera)
4. La UI se actualiza inmediatamente. Si la escritura falla, se registra en `lastRecorderError` pero no se revierte el flag local.

---

## D5 — Timeout global de 60 min

### Recomendación: **A. `setTimeout` al montar el Provider**

El Provider está montado en `app/study/layout.js`, que persiste a lo largo de TODAS las rutas `/study/*` (esto es comportamiento de layouts en App Router de Next.js — el layout no se desmonta al navegar entre páginas hijas). El timer sobrevive las navegaciones internas del funnel.

Si el usuario refresca, el timer se reinicia. Alineado con "refresh = reset".

**Decisión del usuario aprobada:** NO mostrar contador visible al participante (puede generar ansiedad/prisa).

**Cuando expira:**
1. Se navega vía `router.replace('/study/expired')` a una pantalla específica.
2. Se llama a `logEvent(client, sessionId, 'session_abandoned', { reason: 'timeout' })` y `updateSessionStatus(client, sessionId, 'abandoned')`.
3. La pantalla `/study/expired` muestra el mensaje del dossier §11.1 con botón "Recargar y empezar de nuevo".

---

## D6 — Manejo de errores del recorder

### Recomendación: **Política diferenciada por criticidad de la operación**

| Operación | Si falla |
|---|---|
| `submitPretest` | **Bloquear avance**. Mostrar modal de error con botón "Reintentar". Sin pretest no hay análisis válido. |
| `submitPosttest` | **Bloquear avance**. Igual razón. Posttest es el outcome principal. |
| `recordInteraction` (cada cálculo en fase app) | **NO bloquear**. Registrar en `lastRecorderError` para diagnóstico. El participante sigue probando. Pérdida tolerable (perdemos un punto de datos de uso). |
| `logEvent` | **NO bloquear**. Telemetría secundaria. Si falla, log a consola y seguir. |
| `updateSessionStatus` | **NO bloquear**. El status puede recuperarse post-hoc desde `session_events` (vista `v_session_timeline`). |

---

## D7 — Persistencia local de progreso

### Recomendación: **A — refresh = vuelta a pantalla 1, datos parciales se pierden**

Es lo que dice el dossier §13.5. **Decisión del usuario aprobada:** SÍ añadir `ExistingSessionScreen` que detecte si la sesión ya tiene `pretest_done` y ofrezca al participante "continuar o empezar de nuevo".

---

## D8 — Validación de inputs

### Recomendación: **Validación manual extendiendo `lib/validators.js` con funciones específicas del funnel**

Sin Zod ni libs externas. La BBDD valida con CHECKs como defense in depth.

---

## D9 — Integración con calculator/results existentes

### Recomendación: **Hook opcional `useStudyContextOptional()` invocado en los componentes que confirman cálculos**

Modificación de ResultsPage/InverseResultsPage/DiagnosisPage con 3-5 líneas cada una.

---

## D10 — Flag de cohorte (decisión actualizada por el usuario)

**Decisión actualizada (2026-05-24):** En lugar de `?pilot=1` boolean, usar **`?cohort=X`** con valores:
- (sin param) → `'async_masivo'` (Estudio A)
- `?cohort=pilot` → validación interna pre-lanzamiento
- `?cohort=presencial` → Estudio B presencial con tareas

Implementación: cliente lee `searchParams.get('cohort')`, lo pasa a `useStudySession({ cohort })`, se almacena en `research_sessions.metadata.cohort` (JSONB, sin migración SQL).

---

## D11 — Estructura de archivos propuesta

Ver sección 8 del plan consolidado (`docs/planning/m18-fase4-plan-consolidado.md`).

---

## D12 — Riesgos arquitectónicos + mitigaciones

Ver sección 12 del plan consolidado.

---

## Plan paso a paso (orden de implementación)

Ver sección 10 del plan consolidado (11 pasos P0-P11, total 26-32h).

---

## Decisión adicional del usuario sobre el enfoque del estudio

El usuario propuso (y se aprobó) un **diseño mixto** con dos estudios paralelos:
- **Estudio A** (este plan): masivo asíncrono guiado con SUS + ad-hoc
- **Estudio B** (Fase 4.5 nueva): presencial con 5 usuarios y tareas estructuradas

Esto no afecta a la arquitectura de Fase 4 (Estudio A), pero introduce la necesidad del flag `?cohort=X` para distinguir cohortes.
