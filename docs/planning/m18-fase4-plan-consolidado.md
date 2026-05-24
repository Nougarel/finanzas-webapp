---
title: Plan consolidado Fase 4 M18 — Funnel /study (Modo testing guiado)
type: planning
created: 2026-05-24
phase: M18 Fase 4
status: approved (pendiente implementación)
related:
  - docs/planning/m18-fase4-frontend.md
  - docs/dossier/m18-cuestionario-md1.md
  - KnowledgeBase/01-proyectos/personales/finanzas-webapp/roadmap/plan-m18-supabase-research.md
  - KnowledgeBase/01-proyectos/personales/finanzas-webapp/arquitectura/decisiones-diseno.md
---

# Plan consolidado Fase 4 M18 — Funnel `/study` (Modo testing guiado)

Plan único de referencia para la implementación de Fase 4. Sintetiza las decisiones del arquitecto, del frontend y del usuario tras las iteraciones del 2026-05-24. Es el contrato vinculante para la fase de implementación.

## 1. Visión general — enfoque híbrido

El estudio M-D1 se ejecutará como un **diseño mixto** con dos estudios paralelos complementarios:

| Estudio | N | Modalidad | Mide | Cobertura ISO 9241-11 | Implementación |
|---------|---|-----------|------|------------------------|------------------|
| **A — Asíncrono guiado** | 30-60 | Auto-administrado vía link | Satisfacción percibida (SUS + ad-hoc), demografía, comportamiento agregado | Satisfacción | **Fase 4 (este plan)** |
| **B — Presencial moderado** | 5 | Presencial con tareas estructuradas | Eficacia, eficiencia (tiempo, errores), satisfacción cruzada | **Las 3 dimensiones** | Fase 4.5 (nueva) |

Defensa académica: diseño mixto exploratorio cuantitativo + cualitativo siguiendo recomendaciones de Nielsen (2000) sobre 5 usuarios para detección de problemas y diseño de estudios psicométricos validados (Lusardi & Mitchell, 2014; Brooke, 1996) para estudio masivo.

**Esta fase implementa SOLO el Estudio A.** El Estudio B se diseña por separado (Fase 4.5) y reutiliza la misma infraestructura BBDD con etiqueta de cohorte distinta.

### Invariantes arquitectónicas

- **Aislamiento total** de la app principal: cero modificación de su comportamiento normal fuera de `/study`.
- **Dossier vinculante**: todo el texto del cuestionario viene de `docs/dossier/m18-cuestionario-md1.md`, no se redacta texto nuevo.
- **JS puro** (sin TypeScript).
- **TailwindCSS v4 + shadcn/ui new-york** (sin librerías externas nuevas salvo justificación).
- **Single-session**: el funnel no permite back ni refresh sin reset (limitación declarada en dossier §13.5).

---

## 2. Conceptos técnicos clave (cómo funciona realmente)

### Re-export de componentes en Next.js

La misma `CalculatorPage.jsx` se usa tanto en `/calculator` (modo normal) como en `/study/calculator` (modo guiado). El archivo `app/study/(app)/calculator/page.js` contiene UNA línea: `export { default } from "@/components/pages/CalculatorPage"`. Cero duplicación.

### Layouts en App Router de Next.js

`app/study/layout.js` se aplica automáticamente a todas las rutas hijas (`/study/*`). Cuando un participante visita `/study/calculator`, Next.js monta `RootLayout → StudyLayout → <CalculatorPage />`. El layout incluye el `StudyProvider` (contexto invisible) y el `StudyBar` (barra superior persistente).

### Context API opcional (la pieza más interesante)

Un hook `useStudyContextOptional()` devuelve el contexto si estamos dentro del Provider (modo guiado) o `null` fuera. Las páginas existentes detectan el modo sin acoplarse:

```jsx
// Modificación mínima de ResultsPage.jsx (+3 líneas)
const study = useStudyContextOptional();
useEffect(() => {
  if (study && result) {
    study.notifyCalculation('direct', { profile, input, output });
  }
}, [study, result]);
```

En modo normal devuelve `null` → comportamiento idéntico al actual. En modo guiado notifica al sistema research.

### Route Groups de Next.js

La carpeta `(app)` dentro de `/study/` agrupa rutas sin afectar la URL. Sirve para compartir el `layout.js` de `/study` con las páginas de la app reutilizadas.

---

## 3. Decisiones técnicas consolidadas (aprobadas)

| # | Decisión | Justificación |
|---|----------|---------------|
| **Estado global** | Context API + Provider en `app/study/layout.js` | Aislamiento estructural por routing — fuera de `/study` el contexto no existe. Cero deps externas. |
| **Wrapping de páginas** | Route Group `(app)` + re-export | Las shells re-exportan los componentes originales. Comportamiento guiado se inyecta vía Provider del layout. Cero duplicación. |
| **Routing** | Single route `/study` con state machine para pre-app + rutas reales para uso app + `/study/posttest` para evaluación | Refresh = reset (alineado con dossier §13.5). Las rutas reales (`/study/(app)/calculator` etc.) usan routing Next.js normal porque ahí sí necesitamos navegación entre páginas. |
| **Seguimiento flujos completados** | Estado React local en Provider + escritura paralela a Supabase | UI inmediata, BBDD como fuente offline. Si la escritura falla, no bloquea al participante. |
| **Timeout 60 min** | `setTimeout` en Provider + `router.replace('/study/expired')` al expirar | Sobrevive navegación interna entre rutas `/study/*` (el layout no se desmonta). |
| **Sin contador visible** del timeout | El timer corre pero NO se muestra "Quedan X min" al participante | Decisión usuario: no estresar al participante. Solo se muestra la pantalla al expirar. |
| **Manejo de errores recorder** | Política diferenciada: pretest/posttest BLOQUEAN, app_interactions/events NO bloquean | Pretest y posttest son outcome principal; interactions es enriquecimiento. Pérdida tolerable. |
| **Persistencia local de progreso** | Refresh = reset (alineado dossier) + `ExistingSessionScreen` para casos de sesión preexistente | Si el participante refresca y ya tiene `pretest_done`, mostrar pantalla "¿Continuar o empezar de nuevo?". Reset agresivo silencioso es mala UX. |
| **Validación de inputs** | Extender `lib/validators.js` con `lib/research/studyValidators.js` | Coherente con patrón del proyecto. Sin Zod ni libs externas. La BBDD valida con CHECKs como defense in depth. |
| **Integración con páginas existentes** | Hook `useStudyContextOptional()` invocado en ResultsPage, InverseResultsPage, DiagnosisPage (+3 líneas cada) | Acoplamiento mínimo y explícito. El hook devuelve `null` fuera del funnel, comportamiento idéntico al actual. |
| **Cohortes de estudio** | Query param `?cohort=X` leído por cliente y almacenado en `research_sessions.metadata.cohort` (JSONB) | Sin migración SQL. Distingue 3 cohortes: sin param → masivo asíncrono; `?cohort=pilot` → validación interna; `?cohort=presencial` → estudio B. |

---

## 4. Decisiones UX consolidadas (aprobadas)

| # | Decisión | Justificación |
|---|----------|---------------|
| **Demografía** | Pantalla única con 6 preguntas | Coherencia temática, decisiones afines, sin pagging innecesario. |
| **Big Five** | Una pregunta por pantalla | Cognitivamente exigentes (cálculo mental). Evita comparación entre preguntas. Sin feedback de correcto/incorrecto. |
| **Mensaje de sinceridad** | Texto añadido al dossier antes del consentimiento | Pide al participante responder sinceramente sin buscar la respuesta correcta. |
| **Diferenciación modo guiado** | Banner superior fijo `bg-primary` con indicador de flujos + botón "He terminado" | Diferenciación mínima suficiente. No invade percepción de la app. |
| **Renderizado Likert 1-5** | Radio buttons horizontales con etiquetas verbales solo en extremos (1 = "Totalmente en desacuerdo", 5 = "Totalmente de acuerdo") | Estándar SUS, funciona en móvil táctil, evita connotación de "review" de las estrellas. |
| **Barra de progreso** | Stepper con 6 puntos + barra de fill + etiquetas: "Bienvenida", "Tú", "Conceptos financieros", "Herramienta", "Valoración", "Final" | Comunica estructura semántica además de porcentaje. En móvil solo el punto activo con su etiqueta. |
| **Indicador flujos completados** | Lista con checkmarks en barra superior + "1/3 flujos" + popover en móvil | Permanente, sin interrupción del flujo. |
| **Botón "He terminado" deshabilitado** | Texto siempre visible debajo del botón ("Te falta probar: Inverso, Diagnóstico") | Funciona en táctil sin hover. Accesible. |
| **Mobile-first** | `min-h-[100dvh]` para iOS Safari, áreas táctiles 44×44px, etiquetas del stepper colapsadas en móvil | Estándar accesibilidad WCAG. |
| **Accesibilidad WCAG** | `<fieldset>` + `<legend>` en RadioGroups, `aria-disabled`, `aria-live="polite"` en contadores, foco al `<h1>` al cambiar pantalla | Estándar mínimo WCAG AA. |
| **Animaciones** | `fade-in duration-150` con `tw-animate-css` (ya importado). Spinner solo en operaciones de red reales | Sin libs externas (no `sonner`, no `framer-motion`). |
| **Modo oscuro** | DIFERIDO — se evalúa en una iteración posterior cuando se centre el trabajo de UX | Solo modo claro por ahora. |
| **Toast al completar cada flujo** | DIFERIDO — el indicador de flujos cambia visualmente ("0/3 → 1/3") como feedback suficiente | Sin lib externa. |
| **Modal de confirmación al "He terminado"** | Modal del dossier §11.5 — *"¿Listo para terminar la prueba?"* + 2 botones | Previene clicks accidentales. |
| **ExistingSessionScreen** | Pantalla nueva no contemplada en dossier — *"Ya iniciaste el estudio. ¿Continuar o empezar de nuevo?"* | Refresh accidental no debe borrar progreso silenciosamente. |

---

## 5. Mensaje de sinceridad — texto a integrar en el dossier

Se añadirá al dossier en la pantalla de bienvenida (sección 2) como párrafo final antes del botón "Empezar". Texto sugerido:

> **Importante:** En las preguntas que aparecen a lo largo del estudio, responde lo que **realmente piensas o sabes**, sin tratar de buscar la respuesta "correcta". No estamos evaluándote a ti — el objetivo es adaptar la herramienta lo mejor posible a personas como tú, y eso solo es posible si tus respuestas son sinceras.

Lo edita el agente principal (Claude) directamente en el dossier antes de implementar el funnel.

---

## 6. Cohortes de estudio (query param `?cohort=X`)

Tres cohortes distinguibles para análisis post-hoc, todas bajo `study_phase='tfg_mvp_study'` pero con `metadata.cohort` distinta:

| URL | metadata.cohort | Cohorte |
|-----|-----------------|---------|
| `/study` (sin param) | `'async_masivo'` | **Estudio A** — distribución masiva por WhatsApp/email/LinkedIn |
| `/study?cohort=pilot` | `'pilot'` | **Pilot interno** — 1-2 personas para validar funnel antes del lanzamiento |
| `/study?cohort=presencial` | `'presencial'` | **Estudio B** — 5 usuarios presenciales con tareas (diseño en Fase 4.5) |

**Implementación:**
- El cliente lee `useSearchParams().get('cohort')` al inicializar el funnel.
- Lo pasa a `useStudySession({ cohort })` y de ahí al INSERT inicial de `research_sessions` (en la columna `metadata` JSONB existente).
- Sin migración SQL.

**Distribución de links:**
- Pilot interno: tú envías `/study?cohort=pilot` a 1-2 personas de confianza.
- Estudio A masivo: distribuyes `/study` (sin param) a tu red.
- Estudio B: en sesión presencial el participante entra a `/study?cohort=presencial` desde tu portátil.

---

## 7. Perfil del participante durante el modo guiado

**No se duplica ni se adapta nada.** El `ProfileQuestionnaire` existente es parte natural del flujo de la app (primer paso de cualquier flujo después de elegir directo/inverso/diagnóstico). El participante lo rellena igual que un usuario normal.

Esto implica que el funnel `/study`:
1. Lleva al participante por bienvenida + consentimiento + demografía + Big Five
2. Lo deja entrar a `/study/(app)/...` donde encuentra exactamente la app normal con el wrapping del modo guiado
3. Como primer paso del flujo elegido, rellena el `ProfileQuestionnaire`
4. Continúa con el cálculo
5. El resultado se notifica al sistema research vía `notifyCalculation()`
6. Cuando ha completado los 3 flujos (cada uno con su perfil rellenado), puede pulsar "He terminado"

El `profile_snapshot` que se guarda en `app_interactions` reflejará el perfil real del participante (lo que rellenó en cada flujo). Si rellena distinto en cada flujo (poco probable pero posible), cada `app_interactions` lo registra como estaba en ese momento.

---

## 8. Estructura final de archivos

```
src/
├── app/
│   └── study/
│       ├── layout.js                        ← StudyProvider + StudyBar (cliente)
│       ├── page.js                          ← single-route funnel pre-app (state machine)
│       ├── (app)/
│       │   ├── calculator/page.js           ← re-export CalculatorPage (1 línea)
│       │   ├── results/page.js              ← re-export ResultsPage (1 línea)
│       │   ├── inverse-calculator/page.js   ← re-export InverseCalculatorPage (1 línea)
│       │   ├── inverse-results/page.js      ← re-export InverseResultsPage (1 línea)
│       │   ├── diagnosis-form/page.js       ← re-export DiagnosisFormPage (1 línea)
│       │   └── diagnosis/page.js            ← re-export DiagnosisPage (1 línea)
│       ├── posttest/
│       │   └── page.js                      ← single-route posttest (state machine)
│       └── expired/
│           └── page.js                      ← pantalla de timeout
│
├── components/
│   ├── pages/
│   │   ├── ResultsPage.jsx                  ← +3 líneas (useStudyContextOptional + notify)
│   │   ├── InverseResultsPage.jsx           ← +3 líneas (mismo patrón con flow_type='inverse')
│   │   ├── DiagnosisPage.jsx                ← +3 líneas (mismo patrón con flow_type='diagnosis')
│   │   └── (resto sin tocar)
│   └── study/                               ← NUEVA CARPETA
│       ├── StudyFunnel.jsx                  ← orquestador del single-route /study (state machine pre-app)
│       ├── StudyPosttestFunnel.jsx          ← orquestador del single-route /study/posttest
│       ├── StudyBar.jsx                     ← barra persistente con progreso + "He terminado"
│       ├── StudyNavigationGuard.jsx         ← bloquea navegación a /profile, intercepta back
│       ├── StudyErrorBoundary.jsx           ← captura errores de render
│       ├── screens/                         ← una por pantalla del dossier
│       │   ├── WelcomeScreen.jsx
│       │   ├── ConsentScreen.jsx
│       │   ├── DemographicsScreen.jsx
│       │   ├── PretestIntroScreen.jsx
│       │   ├── PretestQuestionScreen.jsx    ← genérica, parametrizada por questionId
│       │   ├── TransitionToAppScreen.jsx
│       │   ├── SusScreen.jsx
│       │   ├── AdHocScreen.jsx
│       │   ├── QualitativeScreen.jsx
│       │   ├── ClosingScreen.jsx
│       │   ├── ExpiredScreen.jsx
│       │   ├── ExistingSessionScreen.jsx    ← gestión de "ya iniciaste"
│       │   └── FinishConfirmModal.jsx       ← modal §11.5
│       └── controls/                        ← reutilizables del funnel
│           ├── LikertScale.jsx              ← escala 1-5 con anclas verbales
│           └── ProgressStepper.jsx          ← stepper con 6 etapas
│
└── lib/
    └── research/
        ├── useStudySession.js               ← YA EXISTE (acepta argumento cohort opcional)
        ├── recorder.js                      ← YA EXISTE (no se toca)
        ├── StudyContext.js                  ← createContext + Provider
        ├── useStudyContext.js               ← hooks: useStudyContext() y useStudyContextOptional()
        ├── useStudyRecorder.js              ← hook que envuelve recorder con sessionId del contexto
        ├── funnelMachine.js                 ← state machine pura: STEPS, nextStep(), prevStep(), progressOf()
        ├── studyValidators.js               ← validateDemographics, validateBigFive, validateSus...
        ├── studyCopy.js                     ← TODO el texto literal del dossier centralizado
        └── studyConfig.js                   ← TIMEOUT_MS, FLOW_TYPES, MIN_FLOWS_TO_FINISH, COHORTS
```

---

## 9. Componentes shadcn a instalar

Los actuales (Button, Card, Input, Label) son insuficientes. Se añaden 5:

```powershell
npx shadcn add radio-group select checkbox dialog textarea
```

| Componente | Uso |
|------------|-----|
| RadioGroup | Big Five, SUS, ad-hoc, demografía (campos radio) |
| Select | Dropdown `employment_status` |
| Checkbox | Consentimiento RGPD |
| Dialog | Modal de confirmación + modales de error |
| Textarea | Preguntas cualitativas |

---

## 10. Plan paso a paso de implementación

| Paso | Qué se crea | Tiempo | Por qué este orden |
|------|-------------|--------|---------------------|
| **P0** | Proof of concept: `app/study/layout.js` mínimo + `app/study/(app)/calculator/page.js` con re-export, verificar que `/study/calculator` monta CalculatorPage envuelto en StudyLayout | 1h | Validar el patrón Next.js antes de invertir en el resto. Si falla aquí, replantear todo. |
| **P1** | Capa pura: `lib/research/studyConfig.js`, `studyCopy.js`, `funnelMachine.js`, `studyValidators.js` | 3-4h | Sin React, testeable aislada. Copy del dossier centralizado. |
| **P2** | Capa de estado: `StudyContext.js`, `useStudyContext.js`, `useStudyRecorder.js` | 2-3h | Sin UI todavía. Depende de P1, useStudySession existente y recorder existente. |
| **P3** | Esqueleto layout: `app/study/layout.js` completo con Provider + StudyErrorBoundary + Suspense | 1h | Layout base donde luego se montarán las pantallas. |
| **P4** | Primeras pantallas: WelcomeScreen, ConsentScreen + `app/study/page.js` con StudyFunnel | 4-6h | Hito visible. Funnel pre-app empieza a funcionar. |
| **P5** | Resto pre-app: DemographicsScreen, PretestIntro, PretestQuestionScreen (genérica), TransitionToAppScreen | 4-6h | Funnel pre-app completo. |
| **P6** | StudyBar persistente + FinishConfirmModal + StudyNavigationGuard | 2-3h | UI persistente para fase app. Bloqueo de navegación a /profile. |
| **P7** | Re-exports en `app/study/(app)/...` (6 archivos triviales) + modificación mínima de 3 componentes existentes (ResultsPage, InverseResultsPage, DiagnosisPage) con `useStudyContextOptional` | 2-3h | Fase de uso de app instrumentada. |
| **P8** | Posttest: `app/study/posttest/page.js`, StudyPosttestFunnel, SusScreen, AdHocScreen, QualitativeScreen, ClosingScreen, LikertScale | 3-4h | Cierre del funnel. |
| **P9** | Casos de error: `app/study/expired/page.js`, ExpiredScreen, ExistingSessionScreen, timer en Provider | 2h | Edge cases declarados. |
| **P10** | Soporte `?cohort=X`: query param leído en Provider y propagado a useStudySession + metadata.cohort | 30min | Trivial al final. |
| **P11** | Smoke test manual end-to-end con 1 navegador: bienvenida → consent → demo → Big Five → 3 cálculos → posttest → cierre. Verificar inserts en BBDD via SQL Editor | 2-3h | Validación funcional completa. |

**Total: 26-32h efectivas (~1 semana laboral).**

---

## 11. Modificaciones reales al código existente

Para máxima claridad: el cambio en archivos existentes es **mínimo**.

| Archivo existente | Modificación | Tipo |
|-------------------|-------------|------|
| `src/components/pages/CalculatorPage.jsx` | Probablemente nada (notificación va en ResultsPage al recibir el cálculo) | — |
| `src/components/pages/ResultsPage.jsx` | +3 líneas (hook `useStudyContextOptional` + useEffect notify) | Mínima |
| `src/components/pages/InverseResultsPage.jsx` | +3 líneas (mismo patrón con `flow_type='inverse'`) | Mínima |
| `src/components/pages/DiagnosisPage.jsx` | +3 líneas (mismo patrón con `flow_type='diagnosis'`) | Mínima |
| `src/lib/research/useStudySession.js` | Aceptar argumento opcional `{ cohort }` y propagarlo al INSERT | Aditiva |
| Resto del proyecto | **Sin cambios** | — |

Total: ~12 líneas modificadas en 3 componentes + 5-10 líneas extendiendo `useStudySession`. Cero riesgo de romper el modo normal.

---

## 12. Riesgos identificados + mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| R1 | El timer de 60 min se reinicia al recargar | Media | Bajo | Aceptado. La marca temporal real está en `research_sessions.created_at` — el análisis post-hoc aplica el corte verdadero. |
| R2 | `useStudyContextOptional()` devuelve `null` en SSR | Alta | Medio | Las páginas wrapped son client components con `"use client"`. El hook devuelve `null` sin lanzar. Verificar que el `if (study)` siempre proteja. |
| R3 | Layout `/study` no se desmonta entre rutas internas → bien para timer. Si participante navega a `/` por error, Provider se desmonta. | Media | Alto | `StudyNavigationGuard` intercepta links externos + advertencia `beforeunload` (dossier §11.4). Si escapa, al volver `useStudySession` recupera sesión vía localStorage; `ExistingSessionScreen` ofrece continuar o resetear. |
| R4 | `markFlowCompleted` se llama duplicado si Results re-monta sin cambiar `result` | Baja | Bajo | `setCompletedFlows` es idempotente. Para `recordInteraction` añadir guard `useRef` que solo dispare una vez por mount. |
| R5 | Race: usuario pulsa "He terminado" antes de que el último `recordInteraction` complete | Baja | Bajo | El criterio "3 flujos completados" usa estado local, no BBDD. Inserción pendiente sigue en paralelo. |
| R6 | Re-export Server vs Client Component puede no funcionar | Media | Alto | `CalculatorPage` es client (`"use client"`). Validar empíricamente en P0 antes de invertir en el resto. |
| R7 | `useSearchParams` en Provider requiere `<Suspense>` | Alta | Medio | Wrap del Provider en `<Suspense>` dentro del layout. Gotcha conocido (documentado en `CLAUDE.md`). |
| R8 | Conflicto de claves localStorage entre app normal y modo estudio (profile_current) | Resuelta | — | El modo estudio NO usa `STORAGE_KEYS.profileCurrent`. El perfil del participante se rellena en su flujo natural dentro del wrapping de `/study/(app)/...`, no se persiste fuera del funnel. |
| R9 | Validación cliente diverge de CHECKs de BBDD | Baja | Alto | Los enums viven en `studyCopy.js` como constantes; recorder valida estructuralmente; BBDD da último voto. Documentar en `studyCopy.js` que cualquier cambio requiere migración SQL. |
| R10 | `LikertScale` con 10 ítems en una pantalla puede generar re-renders | Baja | Bajo | Estado a nivel de pantalla con `useState({ q1: null, ..., q10: null })`. React 19 batching evita renders excesivos. |

---

## 13. Criterio de cierre de Fase 4

La fase se considera completa cuando:

1. ✅ Un participante recorre el funnel completo desde `/study` (welcome → cierre) sin errores no recuperables.
2. ✅ Tras una sesión completa, la BBDD contiene:
   - 1 fila en `research_sessions` con `status='completed'` y `metadata.cohort='async_masivo'`
   - 1 fila en `pretest_responses` con 6 demographics + 3 big_three + extra_responses con los 2 big_five extra
   - ≥3 filas en `app_interactions` (al menos 1 por `flow_type`: direct, inverse, diagnosis)
   - 1 fila en `posttest_responses` con `sus_responses` array de 10 + `adhoc_responses` con 4 ítems + cualitativo opcional
   - ≥5 filas en `session_events` cubriendo el ciclo de vida (session_started, pretest_completed, app_interaction × N, app_completed, posttest_completed)
3. ✅ El uso normal de la app (acceso a `/calculator` etc. fuera de `/study`) sigue funcionando idénticamente.
4. ✅ Linter pasa limpio (`npm run lint`).
5. ✅ Build de producción (`npm run build`) compila sin warnings críticos.
6. ✅ Manualmente probado en local: timeout, refresh, cierre de pestaña, error de red simulado.
7. ✅ Re-validar los 8 escenarios de `/debug/rls-test` (regression check) tras todos los cambios.

---

## 14. Lo que NO incluye esta fase

- **Estudio B presencial** → Fase 4.5 (nueva). Sin código nuevo, solo protocolo de tareas + plantilla observación.
- **Implementación de cálculo de potencia estadística** para cap. 6 → Fase 6.
- **ADR-07 documentando la decisión arquitectónica de Fase 4** → Fase 6, lo hace `cerebro` al cerrar.
- **Análisis y visualización de datos del estudio** → Fase 6 (views SQL agregadas).
- **Textos legales RGPD completos (política privacidad pública)** → Fase 6.

---

## 15. Reorganización del master plan M18 tras esta fase

| Fase | Estado | Tras Fase 4 |
|------|--------|-------------|
| 0 | ✅ Completada | — |
| 1 | ✅ Completada | — |
| 2 | ✅ Completada | — |
| 3 | ✅ Completada (2026-05-24) | — |
| **4** | ⏳ **Siguiente** | Funnel `/study` Estudio A (este plan) |
| **4.5** | ⏳ Pendiente | **Nueva** — Diseño protocolo Estudio B presencial (~0.5d, sin código) |
| 5 | ⏳ Pendiente | Instrumentación profunda — si Fase 4 no la cubre toda |
| 5.5 | ⏳ Pendiente | Pilot interno reducido (1-2 personas, valida funnel A) |
| **5.6** | ⏳ Pendiente | **Nueva** — Ejecución Estudio B presencial con 5 usuarios (~3-5h presenciales) |
| 6 | ⏳ Pendiente | Views SQL agregadas + RGPD + ADRs cierre (incluyendo ADR-07 y ADR-08 sobre diseño mixto) |

**Tiempo total revisado: ~12 días efectivos + 2-3 semanas calendario para campo (reclutamiento + recogida de datos del Estudio A + sesiones presenciales del Estudio B).**

---

## 16. Próximos pasos inmediatos

1. **Editar el dossier** (`docs/dossier/m18-cuestionario-md1.md`) para añadir el mensaje de sinceridad en la pantalla de bienvenida (sección 2).
2. **Guardar el plan del arquitecto** en `docs/planning/m18-fase4-arquitecto.md` (no se guardó automáticamente al lanzarlo).
3. **Lanzar al backend** para empezar por **P0 — proof of concept de re-export**. Si funciona, continuamos con P1+P2 (capa pura + contexto). Si no, replanteamos.
4. **Tras P0 validado**, decidir si lanzar pasos siguientes en una sola tanda al backend o ir paso a paso con validación incremental.

---

## Referencias

- `docs/planning/m18-fase4-frontend.md` — plan UX/UI detallado del frontend (entrada)
- `docs/planning/m18-fase4-arquitecto.md` — plan arquitectónico detallado (se guardará al confirmar)
- `docs/dossier/m18-cuestionario-md1.md` — contrato vinculante del cuestionario
- `docs/research/m18-fase3-investigacion-bibliografica.md` — material bibliográfico de Fase 3
- `KnowledgeBase/01-proyectos/personales/finanzas-webapp/roadmap/plan-m18-supabase-research.md` — master plan M18
- `KnowledgeBase/01-proyectos/personales/finanzas-webapp/arquitectura/decisiones-diseno.md` — ADR-01 a ADR-06 vigentes
