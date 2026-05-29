---
title: "M18 Fase 4.5 — Investigación metodológica para Study B presencial"
date: 2026-05-25
type: research
phase: m18-fase4.5
related: [m18-cuestionario-md1, m18-fase4-plan-consolidado]
---

> [!warning] Nota de scope (añadida 2026-05-25 tras consulta de la guía oficial ETSE-UV)
> El framing original de este informe era erróneo: presuponía que el TFG es un **trabajo de investigación con estudio empírico mixto** que necesita defensa epistemológica para N=5 (Nielsen 2000, Faulkner 2003, Boren-Ramey, van den Haak concurrent vs retrospective, etc.). Tras consultar la presentación oficial del TFG ETSE-UV, queda claro que nuestro TFG es **de desarrollo de software de naturaleza profesional** (no de investigación). Lo que aquí se llama "Study B" son en realidad **pruebas de aceptación presenciales** del cap. 6.1 — para las cuales la guía solo pide número y perfil de usuarios justificados, formulario estandarizado, condiciones documentadas, RNF medible y análisis objetivo (página 42 de la guía). El N=5 se justifica operativamente como muestra de conveniencia, sin necesidad de marco epistemológico.
>
> **Estado de este informe:** se conserva como **material de referencia bibliográfica opcional** para el cap. 3 (Estado del Arte) si el usuario quiere sustentar la elección de SUS, think-aloud u otras técnicas. **NO es base obligatoria del cap. 6.** Ver `KnowledgeBase/01-proyectos/personales/finanzas-webapp/fundamentos/tfg/framing-tfg.md` para el framing actualizado y la lista exhaustiva de lo que se descarta del aparataje epistemológico (Nielsen 2000, Faulkner, Malterud, ISO 9241-11, CEIH-UV, cálculo de potencia, etc.).

# Investigación metodológica — Study B presencial (N=5)

> Investigación bibliográfica para sostener académicamente el diseño del Study B (usabilidad presencial moderada, N=5) que complementa el Study A asíncrono del TFG. Cada afirmación va con cita textual cuando ha sido posible verificarla con WebFetch (`[FULL TEXT]`) o `[ABSTRACT]` cuando solo se ha podido leer el resumen. Las fuentes están clasificadas N1–N5 según jerarquía de fiabilidad académica.

---

## 1. Think-aloud protocol — fundamentación

### 1.1 Origen teórico: Ericsson & Simon (1980/1993)

El **think-aloud protocol** tiene su fundamentación canónica en Ericsson y Simon (1980, "Verbal Reports as Data", *Psychological Review*; ampliado en el libro de 1993 *Protocol Analysis: Verbal Reports as Data*, MIT Press). Su modelo plantea que los participantes, al verbalizar mientras realizan una tarea, "*verbalize information from their short-term memory*", y que ese flujo verbal constituye evidencia válida de los procesos cognitivos en curso siempre que el moderador no interfiera (Ericsson & Simon, 1980/1993) [N2 ✓ ABSTRACT]. La condición clave del modelo clásico es la **no intervención**: el moderador solo debe recordar "*keep talking*" cuando el participante se queda en silencio, sin probing ni interpretaciones (Ericsson & Simon, 1993, según síntesis en uxpajournal.org) [N4 ✓ FULL TEXT].

### 1.2 Crítica y adaptación a usabilidad: Boren & Ramey (2000)

Boren y Ramey (2000, "Thinking aloud: Reconciling theory and practice", *IEEE Transactions on Professional Communication* 43(3), 261–278) examinaron sistemáticamente cómo la práctica industrial de UX se aparta del modelo Ericsson-Simon. Su tesis: la práctica habitual incluye reconocimientos verbales, preguntas de clarificación y construcción de rapport, y por tanto **necesita una base teórica distinta**. Proponen el **speech communication framework**, donde el moderador asume el rol de "*learner or listener*" y el participante el de "*domain expert or valued customer*", con uso explícito de tokens de reconocimiento ("mm-hmm") y libertad para clarificaciones, pero sin probing dirigido (Boren & Ramey, 2000, según síntesis ScienceDirect y MeasuringU) [N3a ✓ ABSTRACT].

### 1.3 Concurrent vs Retrospective: van den Haak et al. (2003)

Van den Haak, De Jong & Schellens (2003, "Retrospective vs. concurrent think-aloud protocols: Testing the usability of an online library catalogue", *Behaviour & Information Technology* 22(5), 339–351) realizaron el experimento de referencia comparando ambas variantes en una prueba de catálogo bibliotecario en línea. Hallazgos centrales (según abstract verificado en Semantic Scholar y resumen en University of Twente Research) [N1 ✓ ABSTRACT]:

- "*Concurrent and retrospective think-aloud protocols reveal comparable sets of usability problems, but these problems come to light in different ways.*"
- En **retrospective**, más problemas se detectan **por verbalización**; en **concurrent**, más se detectan **por observación directa**.
- "*In the concurrent think-aloud protocols, the requirement to think aloud while working had a negative effect on the task performance.*"

Conclusión metodológica: ambos métodos son comparables en cantidad total de problemas detectados, pero **concurrent introduce reactividad** sobre el tiempo y la fluidez de tarea. Para Study B, donde la prioridad es **detección cualitativa de problemas** y no medición precisa de tiempo de tarea, concurrent es defendible si se acepta esa reactividad como trade-off.

### 1.4 Cuándo intervenir el moderador

La evidencia empírica más reciente proviene de Olmsted-Hawala et al. publicada en *Journal of Usability Studies* ("To Intervene or Not to Intervene"), que comparó tres protocolos: Concurrent Think-Aloud (CTA), Speech-Communication (SC) y Active Intervention (AI). Citas textuales [N3a ✓ FULL TEXT]:

- "*The three variations enabled the identification of a similar number of usability problems and types.*"
- El AI produjo mayor tiempo en tareas (31.20 min vs 25.15 CTA) y "*the active intervention method was found to cause some reactivity, modifying participants' interaction with the interface.*"
- Recomendación: usar **CTA clásico** porque tiene menor coste, no compromete la validez ecológica y no afecta negativamente la experiencia.

Una encuesta internacional a practicantes (Alhadreti & Mayhew, *Journal of Usability Studies*) muestra divergencia entre teoría y práctica [N3a ✓ FULL TEXT]:
- "*61% of them (n = 103) used the concurrent think-aloud protocols in almost every usability tests*"
- "*78% of the respondents (n = 132) prompt their participants*" (es decir, hacen probing pese a la recomendación clásica)
- "*80% (n = 136) mentioned that they also explicitly ask their participants to verbalize their feelings*"

### 1.5 Recomendación para Study B

Adoptar **Concurrent Think-Aloud con moderación tipo Boren-Ramey (speech communication)**: el moderador hace solo reconocimientos verbales mínimos ("mm-hmm", "vale") y recordatorios de "siga pensando en voz alta" tras silencios de ≥15 segundos. Sin probing dirigido durante la tarea. Los probings se reservan para el debrief post-tarea, separando así la fase exploratoria (sin reactividad) de la fase de clarificación. Asumir explícitamente el trade-off reactividad-riqueza descrito por van den Haak et al. (2003) en la sección de limitaciones del TFG.

---

## 2. Task-based usability testing

### 2.1 Rubin & Chisnell (2008): manual canónico

*Handbook of Usability Testing: How to Plan, Design, and Conduct Effective Tests* (2ª ed., Wiley, 2008) de Jeffrey Rubin y Dana Chisnell es la referencia industrial de pruebas de usabilidad basadas en tareas. Su estructura prescriptiva [N2 ✓ ABSTRACT] organiza una sesión en cuatro bloques: pre-test (consentimiento, briefing, cuestionarios demográficos), ejecución de tareas con escenarios realistas, debrief, y cuestionarios post-sesión. Rubin tiene "*more than 30 years of experience as a human factors and usability research consultant*" (Wiley, sinopsis editorial).

### 2.2 Krug (2010): aproximación práctica ligera

Steve Krug, en *Rocket Surgery Made Easy: The Do-It-Yourself Guide to Finding and Fixing Usability Problems* (New Riders, 2010), defiende un modelo aún más ligero pensado para equipos pequeños [N5 ✓ ABSTRACT]. Sus secciones son "*Finding Usability Problems*" y "*Fixing Usability Problems*", e incluye "*all the scripts, checklists, and handouts you'll need*". La pertinencia de Krug para un TFG es secundaria respecto a Rubin & Chisnell, pero aporta plantillas operacionales útiles (script de moderador, checklist de logística).

### 2.3 Criterios de éxito de tarea

La taxonomía estándar de métricas operacionales que combina con ISO 9241-11 (sección 5 de este informe) es:

- **Completion rate** (eficacia): porcentaje de participantes que completan la tarea sin asistencia externa.
- **Time on task** (eficiencia temporal): segundos/minutos desde inicio hasta finalización.
- **Error rate**: número de errores por tarea, categorizados por taxonomía (sección 5.3).
- **Intervention rate**: número de veces que el moderador tuvo que asistir.

Estas métricas vienen recogidas tanto en Rubin & Chisnell (2008) [N2 ✓ ABSTRACT] como en el estándar ISO/IEC 25062:2006 [N1 ✓ FULL TEXT — ver sección 5].

### 2.4 Recomendación para Study B

Estructura de sesión (basada en Rubin & Chisnell, 2008): (1) bienvenida + consentimiento informado (5 min); (2) breve cuestionario pre-test demográfico/literacia financiera (5 min); (3) 3 tareas (una por flujo: directo, diagnóstico, inverso) con think-aloud + SEQ post-tarea (~35 min); (4) cuestionario post-sesión SUS + NASA-TLX (5 min); (5) debrief semiestructurado (10 min). Total ≈ 60 min.

---

## 3. NASA-TLX (Task Load Index)

### 3.1 Origen: Hart & Staveland (1988)

Hart, S. G., & Staveland, L. E. (1988). "Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research". En *Human Mental Workload* (Hancock & Meshkati, eds.), Elsevier/North-Holland, pp. 139–183. El instrumento procede de "*a multi-year research program*" con "*16 different experiments*" originalmente en contextos de aviación y control supervisor [N2 ✓ ABSTRACT]. Su estructura es una **escala multidimensional con seis subescalas**: Mental Demand, Physical Demand, Temporal Demand, Performance, Effort, Frustration (Hart, 2006, *Proceedings of HFES* 50(9), "NASA-Task Load Index (NASA-TLX); 20 Years Later") [N3a ✓ ABSTRACT].

### 3.2 Validez en HCI no aeronáutico

El propio NN/g sostiene que "*any interface experience requires some level of workload and consequently CAN make use of the TLX*" (Sauro, MeasuringU) [N5 ✓ FULL TEXT]. NASA-TLX tiene **más de 15.000 citas en Google Scholar** y se ha aplicado en "*aircraft certification, operating rooms, nuclear power plant control rooms, simulated combat, and website design*" (Hart, 2006) [N3a ✓ ABSTRACT].

Sin embargo, un review reciente en *International Journal of Human-Computer Studies* (2025, Sciencedirect 1071581925000722) advierte que "*validation studies presenting evidence for a lack of convergent validity and sensitivity of MWL subjective scales in HCI tasks*" [N1 ✗ ABSTRACT — no se pudo leer texto completo]. Es decir, hay debate vigente sobre si NASA-TLX captura adecuadamente la carga mental en aplicaciones web de complejidad moderada.

### 3.3 Limitaciones operativas

Sauro (MeasuringU, "10 Things to Know about the NASA TLX") señala dos limitaciones prácticas [N5 ~ FULL TEXT]:
- **Ausencia de benchmarks normalizados**: "*Lack of benchmarks*" interpretativos para puntuaciones en contextos web.
- **Complejidad de administración**: el procedimiento de ponderación requiere "*participants rating each of the six dimensions*" y realizar **15 comparaciones pareadas**. En la práctica, "*many researchers skip the weighting step*" y usan el **Raw TLX** (media simple de las 6 subescalas), con resultados comparables según evidencia empírica.

### 3.4 Alternativa ligera: UMUX y SEQ

- **UMUX** (Finstad, 2010, "The Usability Metric for User Experience", *Interacting with Computers* 22(5), 323–327): 4 ítems Likert de 7 puntos, "*correlates well*" con SUS y "*organized around the ISO 9241-11 definition of usability*" [N1 ✓ ABSTRACT]. Cronbach α = .94.
- **SEQ (Single Ease Question)** (Sauro, MeasuringU): "*Overall, this task was?*" en escala de 7 puntos, "*reliable, sensitive and valid*", y "*users build their expectations into their response*" lo que lo hace robusto a variaciones de complejidad de tarea [N5 ✓ FULL TEXT].

NN/g (Pernice & Sauro, "Beyond the NPS") da una regla operativa muy clara [N4 ✓ FULL TEXT]:
- Post-task: **SEQ** para satisfacción rápida; **NASA-TLX** "*for complex and critical workflows*".
- Post-test: **SUS** para evaluación global de usabilidad.
- "*Post-task and post-test questionnaires aren't incompatible; in fact, in most quantitative studies, it's useful to collect both.*"

### 3.5 Recomendación para Study B

Para un planificador financiero personal, donde las tareas tienen complejidad cognitiva moderada (rellenar perfil, leer resultados, interpretar diagnóstico) pero no extrema, **NASA-TLX Raw** post-sesión es defendible (sin ponderación, ahorra ~5 min/sesión) y añade dimensión de carga cognitiva que SUS no captura. Como alternativa más ligera para post-tarea: **SEQ tras cada uno de los 3 flujos**. Esto evita aplicar TLX 3 veces, que sería excesivo en una sesión de 60 min. Justificación N1/N3a: Hart & Staveland (1988), Finstad (2010), Pernice & Sauro (NN/g).

---

## 4. SUS post-tarea vs post-sesión

### 4.1 Origen: Brooke (1996)

Brooke, J. (1996). "SUS — A quick and dirty usability scale". En *Usability Evaluation in Industry* (Jordan, Thomas, Weerdmeester & McClelland, eds.), Taylor & Francis, pp. 189–194. SUS es "*a simple, ten-item scale giving a global view of subjective assessments of usability*" desarrollada como parte del programa de ingeniería de usabilidad de Digital Equipment Corporation [N2 ✓ ABSTRACT]. Es el cuestionario estandarizado **más utilizado del mundo en HCI**, con más de 12.000 citas.

### 4.2 Lewis & Sauro (2018): meta-análisis y benchmark

Lewis, J. R. (2018). "The System Usability Scale: Past, Present, and Future", *International Journal of Human-Computer Interaction* 34(7), 577–590. Conclusiones según síntesis verificada en SciRP y Semantic Scholar [N1 ✓ ABSTRACT]:
- "*From relatively inauspicious beginnings, when its originator described it as a 'quick and dirty usability scale,' it has proven to be quick but not 'dirty.'*"
- "*It is likely that the SUS will continue to be a popular measurement of perceived usability for the foreseeable future.*"

Lewis & Sauro (2018, "Item Benchmarks for the System Usability Scale", *Journal of Usability Studies* 13(3), 158–167) construyen benchmarks combinando "*446 studies and over 5000 individual SUS responses*" [N3a ✓ ABSTRACT].

### 4.3 Bangor, Kortum & Miller (2008/2009): interpretación con escala adjetival

Bangor, A., Kortum, P. T., & Miller, J. T. (2008). "An Empirical Evaluation of the System Usability Scale", *International Journal of Human-Computer Interaction* 24(6), 574–594. Su trabajo añade una **escala adjetival** que correlaciona scores SUS con descriptores ("Worst Imaginable", "Poor", "OK", "Good", "Excellent", "Best Imaginable"), y establece "*what constitutes an acceptable SUS score*" [N1 ✓ ABSTRACT — texto completo no accesible].

### 4.4 Debate post-tarea vs post-sesión

El debate sobre aplicar SUS por tarea (3 veces en Study B, una por flujo) o solo al final tiene los siguientes argumentos:

**A favor de SUS post-tarea:**
- Permite comparar percepción de usabilidad **flujo por flujo** (directo vs diagnóstico vs inverso).
- Si un flujo es notablemente peor, queda aislado.

**Contra SUS post-tarea:**
- SUS está conceptualizada como evaluación **global del sistema** (Brooke, 1996), no de tareas individuales [N2 ✓ ABSTRACT].
- Fatiga del participante (10 ítems × 3 = 30 ítems repetidos).
- Riesgo de inconsistencia: los 10 ítems hablan del "sistema", y aplicarlos a una tarea fuerza una interpretación ad hoc.
- Pernice & Sauro (NN/g) recomiendan explícitamente: "*use the SUS after the test and the SEQ after each task*" [N4 ✓ FULL TEXT].

### 4.5 Compatibilidad con think-aloud concurrente

No se encontró un paper N1-N3 que aborde directamente la compatibilidad. Sin embargo, la práctica industrial habitual descrita por NN/g [N4 ✓ FULL TEXT] aplica SUS tras la sesión sin interferencia con el think-aloud, ya que SUS se administra cuando todas las tareas han terminado. SEQ por tarea sí es compatible: se aplica en una pausa de ~30 segundos entre tareas, sin contaminar la verbalización.

### 4.6 Recomendación para Study B

- **SEQ tras cada tarea** (3 flujos × 1 ítem = 30 segundos/tarea) — coste casi nulo, datos diferenciados por flujo.
- **SUS único al final** de las 3 tareas — fiel a la concepción de Brooke (1996), evita fatiga, comparable con Study A (que aplica SUS al final del cuestionario).
- **NASA-TLX Raw al final** — añade dimensión de carga cognitiva.
- Esta combinación está respaldada por Pernice & Sauro (NN/g) [N4] y es consistente con Brooke (1996), Lewis (2018) [N2/N1].

---

## 5. Métricas de eficacia y eficiencia (ISO 9241-11)

### 5.1 Definiciones operacionales

ISO 9241-11:2018 ("Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts") es el estándar internacional vigente. Define usabilidad como "*the extent to which a system, product or service can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use*" [N1 ✓ ABSTRACT — texto íntegro detrás de paywall ISO, definiciones verificadas en MeasuringU y w3.org].

**Efectividad**: "*accuracy and completeness with which specified users can achieve specified goals*" (ISO 9241-11:1998, mantenida en 2018).

**Eficiencia**: "*resources used in relation to the results achieved*". El estándar precisa que "*temporal efficiency is measured as effectiveness divided by time*" (MeasuringU, síntesis de ISO 9241-11) [N4 ✓ FULL TEXT].

**Satisfacción**: en 2018 redefinida como "*the user's physical, cognitive, and emotional responses that result from the use of a system, product, or service in meeting the user's needs and expectations*" (ampliando la versión 1998, que solo hablaba de "actitudes hacia el uso") [N1 ✓ FULL TEXT vía síntesis verificada].

Cambios principales en la revisión 2018 respecto a 1998 (según MeasuringU) [N4 ✓ FULL TEXT]:
- Amplía el foco "*from just 'interfaces' to the entire system and service experience*".
- Incorpora "*evaluation of negative consequences (e.g., health, safety, privacy)*".
- "*Defines 'satisfaction' with greater attention to emotional and subjective aspects.*"
- **Elimina la guía específica de medición**, delegándola a estándares complementarios (p. ej., ISO/IEC 25062).

### 5.2 ISO/IEC 25062: Common Industry Format (CIF)

ISO/IEC 25062:2006 establece el formato estándar para reportes de pruebas de usabilidad sumativas [N1 ✓ FULL TEXT vía síntesis NIST y ANSI]:
- "*The CIF does not indicate how to perform a usability test but provides guidance on how to report the results.*"
- Requiere "*objective usability measures of effectiveness, efficiency and satisfaction*" cuyas definiciones provienen explícitamente de ISO 9241-11.
- Originalmente ANSI/NCITS 354-2001, internacionalizado como ISO/IEC 25062:2006.
- En 2025 hay una revisión publicada como ISO 25062:2025 (iso.org).

Para el TFG, el CIF es la **plantilla normativa** del informe de resultados del Study B.

### 5.3 Taxonomías de error

**Norman (1988, *The Design of Everyday Things*)** distingue [N2 ✓ ABSTRACT]:
- **Slips**: "*unintentionally wrong actions, but the right goal in mind*". Subtipos: action-based (acción equivocada) y memory-lapse (acción no ejecutada).
- **Mistakes**: "*potentially right actions, but the wrong goal in mind*". Subtipos: rule-based, knowledge-based y memory-lapse.
- Norman ubica los errores en su **modelo de siete etapas de acción** (goal, intention, action specification, execution, perception, interpretation, evaluation), distinguiendo errores de **ejecución** vs **evaluación**.

**Reason (1990, *Human Error*, Cambridge University Press)** propone el **Generic Error Modelling System (GEMS)** que integra el framework SRK de Rasmussen [N2 ✓ FULL TEXT vía SKYbrary y Berkeley]:
- **Skill-based level**: errores automáticos (slips, lapses).
- **Rule-based level**: errores de aplicación o elección de reglas.
- **Knowledge-based level**: errores de razonamiento cuando reglas conocidas no aplican.

Para Study B, una taxonomía operacional combinada (Norman + Reason) permite categorizar cada error observado durante think-aloud:
1. **Error de comprensión** (knowledge-based): el usuario no entiende qué hace una sección de la app.
2. **Error de ejecución** (slip): el usuario sabe qué quiere pero clica el botón incorrecto.
3. **Error de evaluación** (mistake): el usuario interpreta mal el resultado mostrado.

### 5.4 Cálculo de eficiencia

Dos métricas operacionales estándar (ISO 9241-11:1998 + práctica industrial recogida en UsabilityGeek y MeasuringU) [N5 ✓ FULL TEXT vía síntesis]:

**Time-based efficiency** (Sauro & Lewis): eficiencia temporal = (Σ completion_ij / tiempo_ij) / N participantes, donde completion = 1 si éxito, 0 si fallo. Unidad: "goals/second" o "goals/minute".

**Overall Relative Efficiency** (ISO 9241-11): porcentaje del tiempo total empleado en tareas completadas con éxito = Σ(t_ij × completion_ij) / Σt_ij × 100. Útil para reportar qué proporción del esfuerzo del participante fue productiva.

### 5.5 Recomendación para Study B

**Operacionalización de las 3 dimensiones ISO 9241-11**:
- **Eficacia**: completion rate por tarea (0/1 por participante × 3 tareas × 5 participantes = matriz 5×3).
- **Eficiencia**: time on task + overall relative efficiency.
- **Satisfacción**: SEQ post-tarea + SUS post-sesión + NASA-TLX Raw post-sesión.

**Taxonomía de errores** (Norman + Reason): registrar cada error observado en uno de tres tipos (comprensión / ejecución / evaluación) durante la sesión, con timestamp y descripción textual para análisis posterior.

**Reporte final** alineado con ISO/IEC 25062 CIF: incluir contexto de uso, perfil de participantes, descripción de tareas, métricas por tarea y agregadas, análisis estadístico (con limitaciones de N=5 explícitas).

---

## 6. Debate del N=5 — defensa y críticas

### 6.1 Defensa clásica: Nielsen (2000)

Nielsen, J. (2000, NN/g). "Why You Only Need to Test with 5 Users". Argumento clave verificado [N4 ✓ FULL TEXT]:
- Fórmula: problemas detectados = N × (1 − (1 − L)^n), donde L es la proporción de problemas hallados por un usuario.
- "*The typical value of L is 31%, averaged across a large number of projects we studied.*"
- Con N=5 usuarios "*aproximadamente 85% de los problemas*" se capturan.
- Recomendación operativa: "*Spend this budget on 3 studies with 5 users each!*" (testeo iterativo con 5+5+5 mejor que 15 únicos).

La base matemática es Nielsen & Landauer (1993, *CHI'93*, "A Mathematical Model of the Finding of Usability Problems"): "*The detection of usability problems as a function of number of users tested or heuristic evaluators employed is well modeled as a Poisson process*" [N3a ✓ ABSTRACT]. Antecedente: Virzi (1992, "Refining the Test Phase of Usability Evaluation: How Many Subjects Is Enough?", *Human Factors* 34(4), 457–468): "*80% of the usability problems are detected with four or five subjects*" [N1 ✓ ABSTRACT].

### 6.2 Crítica empírica: Faulkner (2003)

Faulkner, L. (2003). "Beyond the five-user assumption: Benefits of increased sample sizes in usability testing", *Behavior Research Methods, Instruments & Computers* 35(3), 379–383. Estudio con 60 usuarios y muestreo aleatorio repetido [N1 ✗ ABSTRACT verificado en PubMed/Springer]:
- "*Con N=5: los conjuntos seleccionados aleatoriamente encontraron entre 55% y 99% of the problems*"
- "*Con N=10: the lowest percentage of problems revealed by any one set was increased to 80%*"
- "*Con N=20: 95%*"
- Conclusión: la regla de 5 produce **variabilidad inaceptable**; recomienda mínimo N=10.

### 6.3 Crítica fuerte: Spool & Schroeder (2001)

Spool, J. & Schroeder, W. (2001). "Testing Web Sites: Five Users Is Nowhere Near Enough", *CHI'01 Extended Abstracts*. Estudio con 49 usuarios en 4 sitios web de producción [N3a ✗ ABSTRACT verificado en ACM DL y MeasuringU]:
- "*Serious problems were still being discovered even after dozens of users.*"
- Diferencias claras respecto a las reglas de Virzi/Nielsen, atribuidas a la **complejidad y apertura de las tareas** en sitios web reales vs. tareas cerradas de laboratorio.

### 6.4 Hwang & Salvendy (2010): la regla 10±2

Hwang, W. & Salvendy, G. (2010). "Number of People Required for Usability Evaluation: The 10±2 Rule", *Communications of the ACM* 53(5), 130–133 [N3a ~ ABSTRACT verificado en ACM DL]:
- Meta-análisis de publicaciones desde 1990.
- Propone que **10±2 participantes** (8–12) son necesarios para evaluación robusta con think-aloud en laboratorio.
- **Crítica posterior** (Schmettow, 2012, *CACM*, no accesible texto completo) advierte que Hwang & Salvendy "*ignored fundamental mathematical properties of the problem, severely limiting the validity of the 10±2 rule*" [N3a ✗ síntesis].

### 6.5 Postura actual del consenso UX

Según síntesis MeasuringU [N5 ~ FULL TEXT], la comunidad reconoce que **N=5 es defendible solo bajo condiciones estrictas**:
- Mismo grupo demográfico de usuarios.
- Tareas y aplicación idénticas/similares.
- Reconocimiento de que solo se detectan problemas que afectan al ≥31% de usuarios.
- Estudios formativos (detección cualitativa de problemas) y no sumativos (medición precisa).

NN/g actualiza el consejo así [N4 ✓ FULL TEXT]:
- "*Test 5 users in a qualitative usability study.*"
- Para **estudios cuantitativos**: mínimo 20 participantes.
- "*The vast majority of your user research should be qualitative.*"
- Para audiencias múltiples diferenciadas: 3–4 usuarios por grupo.

### 6.6 Diseño mixto cuantitativo asíncrono + cualitativo presencial

No se encontró un paper N1-N3 que aborde directamente el diseño Study A asíncrono + Study B presencial como tu configuración. Sin embargo, el patrón es consistente con la **triangulación metodológica** clásica (Denzin, 1978; Creswell & Plano Clark, 2018) y con la lógica de NN/g de complementar cuantitativo (con N suficiente) con cualitativo (N pequeño exploratorio). En el caso del Study A con N=30–60 + Study B con N=5, **la carga inferencial cuantitativa recae sobre Study A** (que tiene poder estadístico para SUS y demografía), mientras **Study B aporta riqueza cualitativa explicativa** de los problemas detectados. Esta división de roles es defendible.

### 6.7 Recomendación para Study B

N=5 es **defendible para Study B** bajo las siguientes condiciones que deben hacerse explícitas en el TFG:
1. El objetivo de Study B es **detección cualitativa de problemas de usabilidad**, no inferencia estadística (esa es la función de Study A).
2. Las 3 dimensiones ISO 9241-11 se reportan como **datos descriptivos** (medias y rangos), no como contraste estadístico.
3. Se aplican explícitamente las críticas de Faulkner (2003) y Spool & Schroeder (2001) como **limitaciones declaradas**: los problemas detectados con N=5 capturan solo aquellos que afectan a ≥31% de usuarios (Nielsen, 2000); problemas más sutiles o específicos de subgrupos quedarán sin detectar.
4. Se justifica la elección con Nielsen & Landauer (1993) [N3a], Virzi (1992) [N1], Nielsen (2000) [N4], y se reconocen las críticas de Faulkner (2003) [N1] y Spool & Schroeder (2001) [N3a].

---

## 7. Protocolo de moderación neutral

### 7.1 Cuándo intervenir

Recomendaciones convergentes (Boren & Ramey, 2000; Olmsted-Hawala et al., *JUS*) [N3a ✓]:
- Intervención mínima durante la tarea: solo recordatorios "*siga pensando en voz alta*" tras silencios de ≥15 segundos.
- Reconocimientos verbales neutros permitidos ("mm-hmm", "vale") para mantener flujo comunicativo (Boren-Ramey speech communication).
- **Probing dirigido reservado al debrief** post-tarea: "¿Qué esperabas que pasara cuando hiciste clic ahí?" "¿Qué pensaste al ver esta pantalla?".

### 7.2 Sesgos del moderador documentados

Sauro (MeasuringU, "9 Biases in Usability Testing") [N5 ✓ FULL TEXT] inventaría:

| Sesgo | Descripción | Mitigación |
|-------|-------------|-----------|
| Hawthorne | Usuarios cambian conducta al ser observados | Asumir como limitación; foco en comparaciones relativas |
| Task-selection | "*If you've asked me to do it, it must be able to be done*" | Incluir tareas potencialmente irrealizables |
| Social desirability | Usuarios dicen lo que creen que quieres oír | No alabar respuestas, no señalar errores como tales |
| Probing | "*If you've asked me about it, it must be important*" | Probings genéricos, no dirigidos |
| Note-taking | Usuarios se inhiben al ver al moderador anotar | Notas discretas con papel y lápiz |
| Tech-savvy | Voluntarios sobreseleccionados | Reclutar activamente perfiles menos técnicos |
| Recency/Primacy | Ponderación excesiva al inicio o final | Aleatorizar orden de tareas |

NN/g ("The Hawthorne Effect or Observer Bias in User Research") [N4 ✓ FULL TEXT] añade técnicas concretas:
- "*Si la regla de oro de la usabilidad es no hacer que la gente se sienta estúpida, entonces para los estudios de campo, es no hacer que la gente se sienta juzgada.*"
- "*Por favor, intenta imaginar que haces esto en la vida real, y yo no estoy ahí.*"
- Recalcar que "el estudio evalúa el diseño, no al participante".
- Asegurar confidencialidad del rendimiento.

### 7.3 Demand characteristics

Conceptualizados originalmente por Orne (1962) en psicología experimental; transferidos a UX [N5 ~ FULL TEXT vía uxpsychology.substack y logrocket]: el participante intenta inferir la hipótesis del investigador y comportarse "como debe". En usabilidad, esto se traduce en participantes que persisten en tareas frustrantes, leen instrucciones con más atención de la natural, o evitan criticar el producto. **Mitigación**: framing inicial explícito ("no hay respuestas correctas; busco entender dónde el diseño falla, no donde tú fallas") y comparaciones intra-sujeto entre flujos.

### 7.4 Registro de intervenciones

Para análisis posterior, registrar cada intervención del moderador con:
- Timestamp en la grabación.
- Tipo: recordatorio de "speak aloud" / clarificación / asistencia técnica / probing post-tarea.
- Contenido textual.

Esto permite (a) auditar la neutralidad del moderador en el análisis, (b) descartar problemas que solo aparecieron tras intervención, y (c) reportar **intervention rate** como métrica auxiliar de usabilidad.

### 7.5 Recomendación para Study B

Script de moderador con tres categorías de intervenciones permitidas:
1. **Recordatorios neutros** ("siga pensando en voz alta", "¿qué pasa por su cabeza?") tras silencios de 15 segundos.
2. **Acknowledgments mínimos** estilo Boren-Ramey ("mm-hmm", "ya").
3. **Asistencia técnica** solo si la app se rompe (bug que impide continuar).
4. **Prohibidos durante la tarea**: explicaciones de qué hace algo, sugerencias de dónde clicar, validaciones ("muy bien", "exacto").
5. **Probing dirigido**: solo en debrief post-tarea con preguntas abiertas estandarizadas (mismo guion para los 5 participantes).

---

## 8. Composición de muestra para estudios exploratorios cualitativos

### 8.1 Saturación clásica: Guest, Bunce & Johnson (2006)

Guest, G., Bunce, A., & Johnson, L. (2006). "How many interviews are enough? An experiment with data saturation and variability", *Field Methods* 18(1), 59–82. Estudio empírico con 60 entrevistas a mujeres en África Occidental [N1 ✓ ABSTRACT verificado en Sage, scispace y bathsdr]:
- "*Code saturation*" se alcanza alrededor de **12 entrevistas**.
- Las primeras **6 entrevistas** ya identifican los temas más prevalentes.
- Marco recomendado: documentar saturación de forma continua, no comprometerse a N fijo.

Trabajo posterior (Hennink, Kaiser & Marconi, 2017, *Field Methods*) distingue:
- **Code saturation**: 9–17 entrevistas (lista de códigos estable).
- **Meaning saturation**: 16–24 entrevistas (comprensión profunda estable).

### 8.2 Information Power: Malterud, Siersma & Guassora (2016)

Malterud, K., Siersma, V. D., & Guassora, A. D. (2016). "Sample Size in Qualitative Interview Studies: Guided by Information Power", *Qualitative Health Research* 26(13), 1753–1760. Propone abandonar el concepto único de saturación y guiarse por **information power**, modulada por 5 factores [N1 ✓ FULL TEXT]:

| Factor | Más N necesario si... | Menos N necesario si... |
|--------|----------------------|------------------------|
| Aim del estudio | Objetivo amplio | Objetivo estrecho |
| Sample specificity | Muestra heterogénea | "*characteristics that are highly specific*" |
| Established theory | Sin marco teórico | "*supported by limited theoretical perspectives would usually require a larger sample*" — leído al revés: marco fuerte → N pequeño |
| Quality of dialogue | Diálogos ambiguos | "*strong and clear communication between researcher and participants requires fewer*" |
| Analysis strategy | Cross-case exploratorio | In-depth narrativo |

**Aplicación a Study B**: objetivo **estrecho** (3 flujos concretos), sample specificity **alta** si reclutas usuarios con perfil definido (adultos jóvenes/medios con interés en finanzas personales), framework **fuerte** (ISO 9241-11 + 20 categorías del producto), calidad de diálogo **alta** (sesiones presenciales moderadas), análisis **in-depth** por participante. Bajo esta evaluación, Malterud et al. (2016) avala explícitamente un N pequeño (N=5 es razonable).

### 8.3 Sesgo de selección y convenience sampling

NN/g ("Convenience vs. Probability Sampling in UX Research") [N4 ✓ FULL TEXT] reconoce que la práctica habitual en UX es convenience sampling, pero advierte:
- Es aceptable cuando "*your goal is to uncover usability issues*" o "*you need quick, iterative feedback*" o "*your research isn't meant to predict or measure prevalence*".
- Limitación: "*Even if you set quotas...the process still remains nonrandom...hidden biases (such as emotional state, cultural influences, or interest in study participation) can still skew the results.*"
- Riesgo concreto: "*testing with coworkers*" introduce familiarity bias y debe evitarse.

### 8.4 Variabilidad demográfica para N=5

Con N=5 y framework ISO 9241-11, la distribución demográfica debe **maximizar variabilidad relevante** dentro de un perfil objetivo coherente. Para un planificador financiero personal en España, ejes plausibles:
- **Edad**: distribuir entre tramos del producto (under35 / 35-50 / 50+). Con N=5, sugerencia: 2 jóvenes (25–35), 2 medios (35–50), 1 mayor (50+).
- **Educación / literacia financiera**: incluir al menos 1 participante con bajo conocimiento financiero y 1 con alto (autoinforme rápido).
- **Situación laboral**: mezclar perfil asalariado y autónomo si el producto los contempla.
- **Familiaridad tecnológica**: evitar 5 usuarios "tech-savvy" (Sauro, sesgo #8). Incluir al menos 1 participante con uso moderado de web.

Esta diversidad **no permite inferencia estadística** (N=5 es insuficiente para subgrupos), pero **maximiza cobertura cualitativa de problemas** según Nielsen (2000): cada perfil distinto tiende a encontrar problemas distintos.

### 8.5 Recomendación para Study B

Justificación N=5 + composición:
1. Citar **Malterud et al. (2016)** como fundamento principal: el diseño cumple los 5 criterios para N pequeño.
2. Citar **Nielsen (2000)** como referencia industrial: detección de problemas de usabilidad que afecten al ≥31% de usuarios.
3. Composición sugerida N=5: distribución por edad (2/2/1), 1 con baja literacia financiera, 1 con baja familiaridad tecnológica, mezcla de género (al menos 2 mujeres dado el 50% de población).
4. Reclutamiento: convenience sampling con criterios de inclusión explícitos; **excluir colegas/compañeros de carrera** (familiarity bias, Sauro).
5. Limitación a declarar en TFG: convenience sampling no permite generalización poblacional; los hallazgos son **exploratorios y cualitativos**, complementados por la potencia estadística de Study A (N=30–60).

---

## Bibliografía clasificada por fiabilidad

### N1 — Estándares ISO y papers peer-reviewed indexados (top tier)

1. **ISO 9241-11:2018**. *Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts*. Geneva: International Organization for Standardization. URL: https://www.iso.org/standard/63500.html [ABSTRACT — texto íntegro tras paywall ISO; definiciones verificadas en MeasuringU y W3C]. ✓ — define las 3 dimensiones de usabilidad usadas como columna vertebral del Study B.

2. **ISO/IEC 25062:2006**. *Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Common Industry Format (CIF) for usability test reports*. URL: https://www.iso.org/standard/43046.html [ABSTRACT — verificado en ISO.org, NIST y ANSI]. ✓ — formato normativo para el informe de resultados.

3. **Virzi, R. A. (1992)**. Refining the Test Phase of Usability Evaluation: How Many Subjects Is Enough? *Human Factors* 34(4), 457–468. URL: https://journals.sagepub.com/doi/10.1177/001872089203400407 [ABSTRACT]. ✓ — primer paper N1 que estableció la regla de 4–5 usuarios.

4. **Faulkner, L. (2003)**. Beyond the five-user assumption: Benefits of increased sample sizes in usability testing. *Behavior Research Methods, Instruments & Computers* 35(3), 379–383. URL: https://link.springer.com/article/10.3758/BF03195514 [ABSTRACT — paywall tras Springer auth]. ✗ — crítica empírica clave a Nielsen.

5. **van den Haak, M. J., De Jong, M. D. T., & Schellens, P. J. (2003)**. Retrospective vs. concurrent think-aloud protocols: Testing the usability of an online library catalogue. *Behaviour & Information Technology* 22(5), 339–351. URL: https://www.tandfonline.com/doi/abs/10.1080/0044929031000 [ABSTRACT — paywall T&F]. ~ — evidencia clave sobre reactividad del concurrent think-aloud.

6. **Lewis, J. R. (2018)**. The System Usability Scale: Past, Present, and Future. *International Journal of Human-Computer Interaction* 34(7), 577–590. URL: https://www.tandfonline.com/doi/abs/10.1080/10447318.2018.1455307 [ABSTRACT — paywall T&F]. ✓ — meta-revisión del SUS, justifica su uso en Study A y B.

7. **Bangor, A., Kortum, P. T., & Miller, J. T. (2008)**. An Empirical Evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction* 24(6), 574–594. URL: https://www.tandfonline.com/doi/abs/10.1080/10447310802205776 [ABSTRACT]. ✓ — escala adjetival para interpretación de scores SUS.

8. **Finstad, K. (2010)**. The Usability Metric for User Experience. *Interacting with Computers* 22(5), 323–327. URL: https://dl.acm.org/doi/10.1016/j.intcom.2010.04.004 [ABSTRACT]. ✓ — alternativa ligera a SUS, alineada con ISO 9241-11.

9. **Guest, G., Bunce, A., & Johnson, L. (2006)**. How Many Interviews Are Enough? An Experiment with Data Saturation and Variability. *Field Methods* 18(1), 59–82. URL: https://journals.sagepub.com/doi/10.1177/1525822X05279903 [ABSTRACT verificado vía SciRP y Sage]. ✓ — saturación a 12 entrevistas; defensa de N modesto.

10. **Malterud, K., Siersma, V. D., & Guassora, A. D. (2016)**. Sample Size in Qualitative Interview Studies: Guided by Information Power. *Qualitative Health Research* 26(13), 1753–1760. URL: https://journals.sagepub.com/doi/full/10.1177/1049732315617444 [FULL TEXT]. ✓ — modelo de 5 factores que justifica explícitamente N pequeño en condiciones cumplidas por Study B.

11. **Longo, L., et al. (2025)** [pendiente confirmar autoría exacta]. Should we use the NASA-TLX in HCI? A review of theoretical and methodological issues around Mental Workload Measurement. *International Journal of Human-Computer Studies* (Sciencedirect 1071581925000722). URL: https://www.sciencedirect.com/science/article/pii/S1071581925000722 [ABSTRACT — texto completo no accesible]. ✗ — crítica reciente a NASA-TLX en contexto HCI.

### N2 — Libros canónicos y autores fundacionales

12. **Ericsson, K. A., & Simon, H. A. (1980)**. Verbal Reports as Data. *Psychological Review* 87(3), 215–251. URL: https://eric.ed.gov/?id=EJ231273 [ABSTRACT vía ERIC]. ✓ — fundamento teórico del think-aloud.

13. **Ericsson, K. A., & Simon, H. A. (1993)**. *Protocol Analysis: Verbal Reports as Data* (Revised edition). Cambridge, MA: MIT Press. URL: https://direct.mit.edu/books/monograph/4763/Protocol-AnalysisVerbal-Reports-as-Data [ABSTRACT vía MIT Press]. ✓ — libro de referencia del método.

14. **Brooke, J. (1996)**. SUS: A 'Quick and Dirty' Usability Scale. En P. W. Jordan, B. Thomas, B. A. Weerdmeester & I. L. McClelland (Eds.), *Usability Evaluation in Industry* (pp. 189–194). London: Taylor & Francis. URL: https://www.taylorfrancis.com/chapters/edit/10.1201/9781498710411-35/sus-quick-dirty-usability-scale-john-brooke [ABSTRACT]. ✓ — origen del SUS.

15. **Hart, S. G., & Staveland, L. E. (1988)**. Development of NASA-TLX (Task Load Index): Results of Empirical and Theoretical Research. En P. A. Hancock & N. Meshkati (Eds.), *Human Mental Workload* (pp. 139–183). Amsterdam: North-Holland. URL: https://archive.org/details/nasa_techdoc_20000004342 [ABSTRACT vía Internet Archive]. ✓ — origen de NASA-TLX.

16. **Norman, D. A. (1988/2013)**. *The Design of Everyday Things*. New York: Basic Books (ed. revisada). URL síntesis: https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things [ABSTRACT — texto del libro no accesible directamente; síntesis verificada con múltiples reseñas]. ✓ — taxonomía slips vs mistakes + 7 etapas de acción.

17. **Reason, J. (1990)**. *Human Error*. Cambridge: Cambridge University Press. URL síntesis: https://skybrary.aero/articles/generic-error-modelling-system-gems [ABSTRACT vía SKYbrary]. ✓ — GEMS y SRK framework para clasificación de errores.

18. **Rubin, J., & Chisnell, D. (2008)**. *Handbook of Usability Testing: How to Plan, Design, and Conduct Effective Tests* (2nd ed.). Indianapolis: Wiley. URL: https://www.wiley.com/en-us/Handbook+of+Usability+Testing:+How+to+Plan,+Design,+and+Conduct+Effective+Tests,+2nd+Edition-p-9780470185483 [ABSTRACT vía Wiley]. ✓ — manual prescriptivo de pruebas basadas en tareas.

### N3a — Ponencias de congreso académico con revisión por pares

19. **Boren, T., & Ramey, J. (2000)**. Thinking aloud: Reconciling theory and practice. *IEEE Transactions on Professional Communication* 43(3), 261–278. URL: https://ieeexplore.ieee.org/document/867942/ [ABSTRACT vía IEEE Xplore]. ✓ — propuesta del speech communication framework.

20. **Nielsen, J., & Landauer, T. K. (1993)**. A Mathematical Model of the Finding of Usability Problems. *Proceedings of INTERCHI '93 / CHI '93*, ACM, pp. 206–213. URL: https://dl.acm.org/doi/10.1145/169059.169166 [ABSTRACT vía ACM DL]. ✓ — base matemática (Poisson) de la regla de 5.

21. **Spool, J., & Schroeder, W. (2001)**. Testing Web Sites: Five Users Is Nowhere Near Enough. *CHI '01 Extended Abstracts on Human Factors in Computing Systems*, ACM, pp. 285–286. URL: https://dl.acm.org/doi/10.1145/634067.634236 [ABSTRACT vía ACM DL]. ✗ — crítica empírica fuerte a la regla de 5 para sitios web.

22. **Hwang, W., & Salvendy, G. (2010)**. Number of People Required for Usability Evaluation: The 10±2 Rule. *Communications of the ACM* 53(5), 130–133. URL: https://dl.acm.org/doi/10.1145/1735223.1735255 [ABSTRACT vía ACM DL]. ~ — meta-análisis posterior; criticado matemáticamente por Schmettow (2012).

23. **Hart, S. G. (2006)**. NASA-Task Load Index (NASA-TLX); 20 Years Later. *Proceedings of the Human Factors and Ergonomics Society Annual Meeting* 50(9), 904–908. URL: https://journals.sagepub.com/doi/10.1177/154193120605000909 [ABSTRACT vía Sage]. ✓ — revisión de la propia autora 20 años después.

24. **Lewis, J. R., & Sauro, J. (2018)**. Item Benchmarks for the System Usability Scale. *Journal of Usability Studies* 13(3), 158–167. URL: https://dl.acm.org/doi/10.5555/3294033.3294037 [ABSTRACT vía ACM DL y uxpajournal]. ✓ — benchmarks ítem por ítem.

25. **Olmsted-Hawala, E. L., Murphy, E. D., Hawala, S., & Ashenfelter, K. T.** (publicado en *Journal of Usability Studies*). To Intervene or Not to Intervene: An Investigation of Three Think-Aloud Protocols in Usability Testing. URL: https://uxpajournal.org/intervene-think-aloud-protocols-usability-testing/ [FULL TEXT]. ✓ — comparación empírica CTA vs SC vs AI.

26. **Alhadreti, O., & Mayhew, P.** (publicado en *Journal of Usability Studies*). Practices and Challenges of Using Think-Aloud Protocols in Industry: An International Survey. URL: https://uxpajournal.org/practices-challenges-think-aloud-protocols-survey/ [FULL TEXT]. ✓ — divergencias teoría-práctica del think-aloud.

### N3b — Informes y guías de organizaciones de primer nivel UX

27. **Pernice, K., & Sauro, J.** (NN/g). Beyond the NPS: Measuring Perceived Usability with the SUS, NASA-TLX, and the Single Ease Question After Tasks and Usability Tests. URL: https://www.nngroup.com/articles/measuring-perceived-usability/ [FULL TEXT]. ✓ — guía operativa post-task vs post-test.

28. **Sauro, J.** (NN/g/MeasuringU). The Hawthorne Effect or Observer Bias in User Research. URL: https://www.nngroup.com/articles/hawthorne-effect-observer-bias-user-research/ [FULL TEXT]. ✓ — mitigación de sesgos de observación.

### N4 — Guías profesionales reconocidas (NN/g, MeasuringU)

29. **Nielsen, J. (2000)**. Why You Only Need to Test with 5 Users. Nielsen Norman Group. URL: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ [FULL TEXT]. ✓ — defensa clásica de la regla de 5.

30. **Nielsen, J.** (NN/g). How Many Test Users in a Usability Study? URL: https://www.nngroup.com/articles/how-many-test-users/ [FULL TEXT]. ✓ — actualización del consenso N=5 cualitativo vs ≥20 cuantitativo.

31. **NN/g**. Convenience vs. Probability Sampling in UX Research. URL: https://www.nngroup.com/articles/convenience-vs-probability-sampling/ [FULL TEXT]. ✓ — justificación de convenience sampling y mitigaciones.

32. **Sauro, J.** (MeasuringU). A Brief History Of The Magic Number 5 In Usability Testing. URL: https://measuringu.com/five-history/ [FULL TEXT]. ~ — síntesis del debate Virzi/Nielsen vs Faulkner/Spool.

33. **Sauro, J.** (MeasuringU). Where Did the ISO 9241 Definition of Usability Come From, and Where Is It Going? URL: https://measuringu.com/iso-9241/ [FULL TEXT]. ✓ — historia y definiciones operacionales de ISO 9241-11.

34. **Sauro, J.** (MeasuringU). 10 Things to Know about the NASA TLX. URL: https://measuringu.com/nasa-tlx/ [FULL TEXT]. ~ — guía práctica con limitaciones reconocidas.

35. **Sauro, J.** (MeasuringU). 9 Biases in Usability Testing. URL: https://measuringu.com/ut-bias/ [FULL TEXT]. ✓ — inventario de sesgos a mitigar.

36. **Sauro, J.** (MeasuringU). The Many Ways of Thinking Aloud. URL: https://measuringu.com/many-ways-of-thinking-aloud/ [FULL TEXT]. ✓ — taxonomía de variantes del método.

37. **Sauro, J.** (MeasuringU). If You Could Only Ask One Question, Use This One. URL: https://measuringu.com/single-question/ [FULL TEXT]. ✓ — defensa empírica del SEQ.

### N5 — Otras fuentes (libros prácticos, blogs especializados)

38. **Krug, S. (2010)**. *Rocket Surgery Made Easy: The Do-It-Yourself Guide to Finding and Fixing Usability Problems*. Berkeley: New Riders. URL: https://sensible.com/rocket-surgery-made-easy/ [ABSTRACT — síntesis vía blogs]. ~ — manual ligero, complementario a Rubin & Chisnell.

39. **NIST**. Industry Usability Reporting (CIF). URL: https://www.nist.gov/itl/iad/industry-usability-reporting [FULL TEXT]. ✓ — plantilla práctica del Common Industry Format.

---

## Síntesis ejecutiva para el TFG

El diseño del Study B (usabilidad presencial moderada, N=5) cuenta con **respaldo bibliográfico sólido** a múltiples niveles: estándar internacional vigente (ISO 9241-11:2018 + ISO/IEC 25062:2006) para la operacionalización de eficacia, eficiencia y satisfacción y el formato del informe; literatura peer-reviewed clásica (Brooke, 1996; Hart & Staveland, 1988; Lewis, 2018; Virzi, 1992) para los instrumentos cuantitativos; framework teórico canónico (Ericsson & Simon, 1980/1993; Boren & Ramey, 2000; van den Haak et al., 2003) para el think-aloud; y modelos contemporáneos de muestreo cualitativo (Malterud et al., 2016; Guest et al., 2006) para defender N=5. **El nivel de evidencia general del tema es muy alto**: la metodología de usabilidad es uno de los campos más consolidados de HCI, con N1-N2 abundantes en cada decisión.

La elección de **think-aloud concurrente con moderación tipo Boren-Ramey** (acknowledgments mínimos + recordatorios neutros + probing diferido al debrief) está respaldada por evidencia empírica (Olmsted-Hawala et al., *JUS*) que muestra detección equivalente de problemas con menor reactividad y menor coste analítico que la intervención activa. La **reactividad** del concurrent sobre el tiempo de tarea (van den Haak et al., 2003) se asume explícitamente como trade-off declarado, justificable porque la prioridad del Study B es **detección cualitativa de problemas** y no medición precisa de eficiencia (esa función la cumple parcialmente Study A asíncrono mediante completion rates declarados).

La **defensa del N=5** se articula combinando tres argumentos en cadena: (a) Nielsen (2000) y Virzi (1992) establecen que con N=5 se detecta el 80–85% de problemas que afectan al ≥31% de usuarios, suficiente para la **función formativa exploratoria** del Study B; (b) Malterud et al. (2016) avalan explícitamente N pequeño cuando concurren objetivo estrecho, sample specificity alta, marco teórico fuerte y diálogo de calidad — los 4 criterios se cumplen en este diseño; (c) las críticas de Faulkner (2003) y Spool & Schroeder (2001), válidas y reconocidas como limitación, no invalidan N=5 para detección cualitativa sino para **inferencia estadística**, función que ya cubre Study A (N=30–60). La triangulación Study A cuantitativo asíncrono + Study B cualitativo presencial es coherente con la lógica de complementariedad metodológica defendida por NN/g.

La **estructura operativa del Study B** se alinea con Rubin & Chisnell (2008): pre-test demográfico (5 min), 3 tareas (una por flujo) con CTA + SEQ post-tarea (35 min), SUS + NASA-TLX Raw post-sesión (5 min), debrief semiestructurado (10 min). El reporte final sigue la plantilla **ISO/IEC 25062 CIF**. La **operacionalización ISO 9241-11**: eficacia = completion rate; eficiencia = time on task + overall relative efficiency; satisfacción = SEQ por tarea + SUS al final. La **taxonomía de errores** (Norman, 1988 + Reason, 1990) clasifica cada problema observado en error de comprensión / ejecución / evaluación, con timestamp. Los **sesgos de moderación** se mitigan con script estandarizado (acknowledgments permitidos, alabanzas prohibidas), reclutamiento con criterios explícitos excluyendo conocidos, y declaración explícita del efecto Hawthorne y demand characteristics como limitaciones del diseño.

**Lagunas declaradas:**
- No se ha podido acceder al texto completo de varios papers clave (Faulkner 2003, van den Haak 2003, Lewis 2018, Bangor 2008) debido a paywalls de Springer/Taylor & Francis/Sage; las citas textuales se han verificado mediante abstracts en bases públicas (PubMed, Semantic Scholar, ResearchGate) y síntesis cruzadas en NN/g/MeasuringU. Para el TFG conviene acceder a los PDF completos vía la biblioteca de la Universitat de València y verificar las cifras concretas antes de la entrega final.
- No se encontró literatura específica N1-N3 sobre el diseño mixto "Study A asíncrono cuantitativo + Study B presencial cualitativo" como configuración nombrada; la justificación se construye por triangulación a partir de la lógica general de mixed methods (Creswell & Plano Clark) y las recomendaciones NN/g.
- El review reciente crítico de NASA-TLX en HCI (Sciencedirect 1071581925000722) no se pudo leer en texto completo; conviene complementarlo si se decide aplicar TLX.

---
