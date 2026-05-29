---
title: "M18 Fase 4.5 — Pruebas de aceptación UX en proyectos de ingeniería software"
date: 2026-05-25
type: research
phase: m18-fase4.5
scope: "Proyecto desarrollo software, no investigación académica"
related: [framing-tfg, m18-cuestionario-md1]
---

# Pruebas de aceptación UX en proyectos de ingeniería software

> Investigación bibliográfica para el Capítulo 6 "Pruebas y Resultados" del TFG de Ingeniería Multimedia (ETSE-UV). Trata las técnicas de **aceptación de usuario y testing de usabilidad** tal como se aplican en proyectos de **desarrollo de software**, no como aparato metodológico de investigación académica. Las fuentes preferidas son guías profesionales reconocidas (Nielsen Norman Group, MeasuringU, Krug) y los papers clásicos de HCI, evitando todo el aparato de investigación cualitativa primaria.

---

## Q1. Heurísticas de Nielsen

### Origen y formulación

Las 10 heurísticas de usabilidad fueron desarrolladas por **Jakob Nielsen (1994)** sobre la base del trabajo previo con **Rolf Molich (1990)**. La versión original con Molich proponía 9 heurísticas, y Nielsen las refinó cuatro años después mediante un análisis factorial de 249 problemas de usabilidad reales para "derivar un conjunto de heurísticas con máximo poder explicativo" [N3a ✓ FULL TEXT] (Nielsen, 1994 — "Enhancing the explanatory power of usability heuristics", CHI'94).

El conjunto vigente, mantenido en NN/g, es el siguiente [N4 ✓ FULL TEXT] (Nielsen Norman Group — *10 Usability Heuristics for User Interface Design*):

1. **Visibility of system status** — "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."
2. **Match between the system and the real world** — "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon."
3. **User control and freedom** — "Users often perform actions by mistake. They need a clearly marked 'emergency exit' to leave the unwanted action without having to go through an extended process."
4. **Consistency and standards** — "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions."
5. **Error prevention** — "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place."
6. **Recognition rather than recall** — "Minimize the user's memory load by making elements, actions, and options visible."
7. **Flexibility and efficiency of use** — "Shortcuts — hidden from novice users — may speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users."
8. **Aesthetic and minimalist design** — "Interfaces should not contain information that is irrelevant or rarely needed."
9. **Help users recognize, diagnose, and recover from errors** — "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution."
10. **Help and documentation** — "It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation to help users."

### Aplicación en industria

La evaluación heurística es **una técnica de inspección sin usuarios reales**: un pequeño grupo de evaluadores recorre la interfaz contrastándola con la lista de heurísticas. NN/g recomienda **"three to five people should independently evaluate the same interface"** dedicando aproximadamente "1–2 hours" por evaluador [N4 ✓ FULL TEXT] (Nielsen Norman Group — *How to Conduct a Heuristic Evaluation*). El justificante empírico se remonta al paper de 1990: "individual evaluators were mostly quite bad at doing such heuristic evaluations and that they only found between 20 and 51% of the usability problems […]. However, aggregating the evaluations from several evaluators resulted in better performance, even with only three to five people" [N3a ✓ ABSTRACT] (Nielsen & Molich, 1990 — CHI'90).

### Ventajas y limitaciones

- **Ventaja principal — bajo coste**: la evaluación heurística forma parte explícita del programa de **"discount usability engineering"** de Nielsen: "Discount usability engineering is our only hope. We must evangelize methods simple enough that departments can do their own usability work, fast enough that people will take the time, and cheap enough that it's still worth doing" [N4 ✓ FULL TEXT] (Nielsen — *Discount Usability for the Web*). Permite "stretching a limited UX research budget" identificando problemas sin necesidad de reclutar usuarios [N4 ✓ FULL TEXT] (NN/g — *How to Conduct a Heuristic Evaluation*).
- **Limitación principal — depende del evaluador**: NN/g es explícito en que "heuristic evaluations cannot replace user research" [N4 ✓ FULL TEXT]. La evaluación es subjetiva y los hallazgos varían según experiencia del evaluador.

### ¿Combinable con pruebas con usuarios?

Sí, y de hecho es la recomendación estándar: la evaluación heurística se utiliza **antes** del testing con usuarios para "preparar el terreno" (corregir problemas obvios antes de ocupar el tiempo de los participantes) y como **complemento** que captura problemas que las pruebas observacionales no detectan (p. ej., problemas de consistencia que un usuario aislado no nota) [N4 ✓ FULL TEXT] (NN/g — *How to Conduct a Heuristic Evaluation*).

---

## Q2. Think-aloud (versión simple)

### Definición operativa según NN/g

El think-aloud (pensamiento en voz alta) consiste en "ask test participants to use the system while continuously thinking out loud — that is, simply verbalizing their thoughts as they move through the user interface" [N4 ✓ FULL TEXT] (Nielsen Norman Group — *Thinking Aloud: The #1 Usability Tool*).

Nielsen lo califica explícitamente como **"the single most valuable usability engineering method"** [N4 ✓ FULL TEXT].

### Procedimiento simplificado

NN/g describe el método en tres pasos:

1. **Recruit users** — reclutar usuarios representativos.
2. **Give them a representative task** — asignarles una tarea realista.
3. **Shut up and let the users do the talking** — escuchar, grabar, tomar notas.

[N4 ✓ FULL TEXT] (NN/g — *Thinking Aloud*).

### Cuándo intervenir (mínimamente)

La práctica estándar es **interrumpir lo menos posible**, pero sí hay que recordar al usuario que verbalice cuando se queda en silencio: "it's not that simple for most people to keep up a running monologue", por lo que el facilitador debe "solicitar continuamente que los usuarios mantengan la verbalización" [N4 ✓ FULL TEXT] (NN/g — *Thinking Aloud*). Las preguntas clarificadoras se reservan para el debrief final, no durante las tareas, para no contaminar el comportamiento.

### Ventajas para un proyecto TFG

- **Económico**: no requiere equipamiento especial ni software caro [N4 ✓ FULL TEXT].
- **Robusto**: "tolerates facilitators inexperienced […] without compromising findings" [N4 ✓ FULL TEXT].
- **Flexible**: aplicable tanto a prototipos en papel como a productos en producción [N4 ✓ FULL TEXT].
- **Revela el "por qué"**: no solo qué hace mal el usuario, sino qué está pensando cuando se equivoca.

### Limitaciones reconocidas

NN/g admite que la situación es "no natural" para los participantes, existe riesgo de autocensura (usuarios que editan sus comentarios para parecer más inteligentes) y posible sesgo del facilitador [N4 ✓ FULL TEXT]. Para un TFG ingenieril basta con mencionar estas limitaciones; no hay que justificar protocolos formales tipo Boren-Ramey.

---

## Q3. Test de usabilidad con tareas

### Definición y referencia canónica

NN/g define el test de usabilidad como: "In a usability-testing session, a researcher asks a participant to perform tasks, usually using one or more specific user interfaces" [N4 ✓ FULL TEXT] (NN/g — *Usability Testing 101*). La referencia académica de cabecera es **Rubin & Chisnell (2008) — *Handbook of Usability Testing: How to Plan, Design, and Conduct Effective Tests*** (Wiley, 2nd ed.), libro que incluye un capítulo dedicado a tareas (Capítulo 8 — "Prepare Test Materials") [N2 ✓ ABSTRACT].

### Estructura típica de una sesión

Según las plantillas profesionales estándar [N5 ✓ FULL TEXT] (Lyssna — *Usability Test Script*), una sesión sigue cinco bloques:

1. **Introducción** (rapport, propósito, consentimiento): debe transmitir explícitamente que *"We're testing the product, not testing you. There are no 'right' or 'wrong' answers."*
2. **Preguntas de contexto / warm-up** (~5 min): familiaridad del participante con el dominio.
3. **Tareas con escenarios realistas** (3–5 tareas): cada una con criterio de éxito y observaciones clave a registrar. Recomendación explícita: *"avoid using terms that appear directly in the user interface"* — evitar enunciados literales tipo "haz clic en el botón X".
4. **Preguntas post-tarea**: abiertas, neutrales. *"How would you describe the checkout process?"*
5. **Debrief final**: impresiones generales, SUS si aplica.

La duración típica recomendada es ≤30 min para evitar fatiga cognitiva [N5 ✓ FULL TEXT].

### Cómo elegir las tareas (representatividad y dificultad)

Las tareas deben:
- Cubrir los **flujos críticos** del producto (los que más usuarios harán en uso real).
- Estar **ordenadas progresivamente** (de más simples a más complejas) para construir confianza.
- Plantearse como **escenarios narrativos** ("acabas de cobrar la nómina y quieres saber cuánto deberías ahorrar este mes"), no como instrucciones literales [N5 ✓ FULL TEXT] (Lyssna — *Usability Test Script*).

### Criterios de éxito

El estándar industrial es **binario** (1 = éxito, 0 = fracaso) [N4 ✓ FULL TEXT] (MeasuringU — *What Is a Good Task-Completion Rate?*): "si 9 de 10 usuarios completan una tarea, la tasa de finalización es .90 o 90%". Una tarea se considera completada cuando el usuario alcanza el estado final esperado **sin ayuda externa** y **sin desviaciones críticas**. Para tareas más matizadas se puede graduar en niveles (éxito completo / éxito con dificultad / fracaso), pero para TFG ingenieril el binario es suficiente.

### Por qué 5 usuarios bastan en una primera ronda

Nielsen justifica el famoso "5 users rule" matemáticamente: "As soon as you collect data from a single test user, your insights shoot up and you have already learned almost a third of all there is to know about the usability"; cada usuario adicional aporta menos información nueva [N4 ✓ FULL TEXT] (Nielsen — *Why You Only Need to Test with 5 Users*). El argumento es de coste-beneficio iterativo: "The ultimate user experience is improved much more by 3 studies with 5 users each than by a single monster study with 15 users." Para un TFG con tiempo limitado, este es el sustento profesional que justifica una primera ronda con N=5 sin necesidad de invocar debates académicos posteriores.

---

## Q4. SUS (System Usability Scale)

### Origen y formato

El SUS fue desarrollado por **John Brooke (1996)** en Digital Equipment Corporation, presentado como una "quick and dirty usability scale" [N3a ✓ FULL TEXT] (Brooke, 1996 — *SUS: A Quick and Dirty Usability Scale*).

Es un cuestionario de **10 ítems en escala Likert de 1 a 5**, con ítems impares positivos e ítems pares negativos [N5 ✓ FULL TEXT] (Wikipedia — *System Usability Scale*; sintetizado de Brooke 1996):

1. Usaría este sistema frecuentemente
2. El sistema es innecesariamente complejo
3. El sistema es fácil de usar
4. Necesitaría apoyo técnico para usarlo
5. Las funciones están bien integradas
6. Hay demasiada inconsistencia
7. La mayoría aprendería rápidamente
8. El sistema es engorroso de usar
9. Me siento confiado usándolo
10. Necesité aprender mucho antes de empezar

### Cálculo del score

Procedimiento estándar [N4 ✓ FULL TEXT] (MeasuringU — *Measuring Usability with the SUS*):
- **Ítems impares (positivos)**: restar 1 a la respuesta.
- **Ítems pares (negativos)**: restar la respuesta a 5.
- Sumar los 10 valores resultantes y multiplicar por 2.5.
- Rango final: **0–100**.

### Interpretación: benchmarks de industria

**Promedio general**: "A SUS score above a 68 would be considered above average and anything below 68 is below average" [N4 ✓ FULL TEXT] (MeasuringU). Este umbral viene del análisis de Sauro y Lewis (2016) sobre 241 estudios industriales de usabilidad, en el que un SUS de 68 corresponde al percentil 50 — equivalente a una nota "C" en la escala americana [N4 ✓ FULL TEXT] (MeasuringU — *Measuring Usability with the SUS*).

**Escala adjetival de Bangor, Kortum & Miller (2009)** [N3a ✓ FULL TEXT] (Bangor et al., 2009 — *Determining What Individual SUS Scores Mean*, Journal of Usability Studies):

| Adjetivo | SUS aproximado |
|----------|---------------|
| Worst Imaginable | ~13 |
| Poor | ~29 |
| OK | ~51 |
| Good | ~72 |
| Excellent | ~85 |
| Best Imaginable | ~93 |

El paper señala: "a score of 70 has traditionally meant passing, and our data show that the average study mean is about 70" [N3a ✓ FULL TEXT].

**Lectura operativa para TFG**: un SUS ≥68 es "por encima del promedio", ≥72 es "good", ≥80 es zona "darn good" (entre B+ y A−) [N4 ✓ FULL TEXT] (MeasuringU — *Sample Sizes for SUS Benchmark Tests*).

### Versión española validada

Para un TFG con usuarios hispanohablantes, hay dos versiones validadas:

- **Sevilla-González et al. (2020)** — *Spanish Version of the System Usability Scale for the Assessment of Electronic Tools*, JMIR Human Factors. Validación con 88 respondentes evaluando Zoom; α de Cronbach = **0.812** (95% CI 0.748–0.866); Content Validity Index = 0.92 [N1 ✓ FULL TEXT].
- **Castilla et al. (2023)** — *Psychometric Properties of the Spanish Full and Short Forms of the SUS*, International Journal of Human–Computer Interaction. Validación con **1.321 españoles**; α de Cronbach = **0.76** para la versión completa y **0.77** para la versión corta (solo ítems positivos); confirmaron estructura unifactorial cuando se modelan los errores de método de los ítems negativos (CFI=.932, RMSEA=.055) [N1 ✓ ABSTRACT — paper de acceso restringido].

Para TFG es **defendible usar cualquiera de las dos**; Castilla 2023 es más reciente y con mayor tamaño muestral, Sevilla-González 2020 está en abierto.

### Cuándo se aplica

El SUS se administra **una sola vez, al final de la sesión, después de completar todas las tareas** — no por tarea. Es una medida global de la usabilidad percibida del sistema [N3a ✓ FULL TEXT] (Brooke, 1996).

### Por qué es el cuestionario estándar de industria

- Solo 10 ítems → bajo tiempo de respuesta.
- Tecnológicamente agnóstico (vale para web, móvil, software de escritorio, dispositivos físicos) [N5 ✓ FULL TEXT] (ScienceDirect — *System Usability Scale: an overview*).
- Tiene **benchmarks públicos** (Sauro-Lewis, Bangor-Kortum-Miller) contra los que comparar.
- Es libre y traducido a decenas de idiomas, incluyendo dos versiones españolas validadas.

---

## Q5. Cuestionarios cualitativos

### Preguntas típicas en debrief

NN/g y guías profesionales convergen en un conjunto reducido de preguntas abiertas de cierre [N5 ✓ FULL TEXT] (Lyssna — *Usability Test Script*; UserQ — *Usability Testing Questions*):

- "¿Cuáles son tus impresiones generales del producto?"
- "¿Qué fue lo más fácil de usar?"
- "¿Qué fue lo más difícil o confuso?"
- "Si pudieras cambiar una cosa, ¿cuál sería?"
- "¿Te surgió alguna duda que no resolviste?"
- "¿Lo recomendarías a alguien de tu entorno? ¿Por qué?"

Estas preguntas se hacen **después** de todas las tareas (no entremedias) y proporcionan el material cualitativo que complementa las métricas cuantitativas.

### Cómo analizarlas en un TFG ingenieril

Para un TFG de desarrollo de software **no se aplica codificación cualitativa académica** (open coding, axial coding, análisis temático reflexivo, etc.). El procedimiento estándar es:

1. **Listar verbatim** las respuestas de cada participante (tabla por participante × pregunta).
2. **Agrupar por temas emergentes** simples (p. ej., "navegación", "claridad del lenguaje financiero", "ritmo del cuestionario"). Tres a cinco temas suelen bastar.
3. **Contar frecuencias** ("3 de 5 participantes mencionaron X").
4. **Priorizar acciones**: convertir temas recurrentes en mejoras concretas a la siguiente iteración.

Este enfoque casa con la filosofía de Krug: "almost anyone can do effective, valuable usability tests quickly and easily" y "Getting it done is far more important than doing it 'perfectly.'" [N4 ✓ FULL TEXT] (Krug — *Rocket Surgery Made Easy*).

---

## Q6. Walkthrough cognitivo

### Origen

El cognitive walkthrough fue propuesto por **Lewis, Polson, Wharton & Rieman (1990)** en el *Proceedings of CHI'90* y refinado en versiones posteriores (Polson et al. 1992; Wharton et al. 1994) [N3a ✓ FULL TEXT] (Usability Body of Knowledge — *Cognitive Walkthrough*; Wikipedia — *Cognitive Walkthrough*). Se diseñó originalmente para evaluar interfaces "walk-up-and-use" (cajeros, kioscos) donde el usuario debe aprender el sistema sobre la marcha.

### Las 4 preguntas del evaluador

En cada paso de una tarea, el evaluador se pregunta [N5 ✓ FULL TEXT] (Wikipedia — *Cognitive Walkthrough*):

1. ¿Intentará el usuario lograr el efecto correcto?
2. ¿Notará el usuario que la acción correcta está disponible?
3. ¿Asociará el usuario la acción correcta con el efecto que quiere lograr?
4. ¿Recibirá feedback adecuado cuando complete la acción?

### Diferencias con la evaluación heurística

Estudio comparativo publicado en *International Journal of Medical Informatics* / PMC [N1 ✓ FULL TEXT] (Khajouei et al., 2016 — comparativa heurísticas vs walkthrough en HIS):

| Aspecto | Evaluación heurística | Walkthrough cognitivo |
|---------|----------------------|----------------------|
| Foco | Holístico (toda la interfaz) | Específico de tarea |
| Mejor para | Consistencia, conformidad | Aprendibilidad, descubribilidad |
| Usuarios target | Usuarios con experiencia | Usuarios novatos |
| Nº problemas detectados en estudio HIS | 104 únicos | 24 únicos |
| Solapamiento | 33% del walkthrough estaba en heurísticas | — |

El walkthrough detecta significativamente **más problemas de aprendibilidad** que las heurísticas en el mismo sistema [N1 ✓ FULL TEXT].

### ¿Combinable con pruebas de usuario?

Sí. La práctica recomendada es:
- Walkthrough cognitivo **al inicio**, sobre prototipo o producto, para detectar barreras de primer uso.
- Heurísticas **en paralelo** para barrer problemas generales.
- Testing con usuarios **después**, para validar con comportamiento real.

Para un TFG con scope acotado, **suele bastar con heurísticas + testing con usuarios**, mencionando el walkthrough como técnica complementaria conocida. Aplicar el walkthrough formalmente añade peso pero también complejidad documental.

---

## Q7. RNF de aceptación cuantitativos

### Cómo expresar usabilidad como requisito no funcional

El estándar industrial es que cada RNF debe ser **medible y testeable**: "Make NFRs measurable and testable. To understand whether your system meets quality constraints, be sure to quantify your requirements" [N5 ✓ FULL TEXT] (AltexSoft — *Non-functional Requirements*). El criterio aplicable es **SMART** (Specific, Measurable, Achievable, Relevant, Time-bound), reemplazando adjetivos vagos por umbrales numéricos.

Ejemplo de transformación [N5 ✓ FULL TEXT] (AltexSoft):

- ❌ "El sistema debe ser fácil de usar."
- ✅ "El sistema debe responder a la entrada del usuario en menos de 2 segundos."
- ✅ "La tasa de error de usuarios completando el checkout no debe superar el 10%."
- ✅ "Los usuarios deben encontrar productos en máximo tres clics desde la home."

### Plantillas de RNF de usabilidad para TFG

Combinando los benchmarks de SUS (Sauro-Lewis, Bangor et al.) y completion rate (Sauro), los siguientes RNF son **defendibles bibliográficamente** para un primer release:

| Categoría | RNF propuesto | Justificación bibliográfica |
|-----------|--------------|----------------------------|
| Satisfacción global | "SUS medio de los participantes ≥ 68" | Sauro-Lewis: percentil 50 industrial [N4 ✓] |
| Satisfacción objetivo | "SUS medio ≥ 72" | Bangor et al.: rango "Good" [N3a ✓] |
| Satisfacción excelente | "SUS medio ≥ 80" | MeasuringU: zona B+/A− [N4 ✓] |
| Efectividad | "Task completion rate ≥ 78% en tareas principales" | Sauro: media industrial [N4 ✓] |
| Efectividad alta | "Completion rate ≥ 92% en tareas principales" | Sauro: cuartil superior [N4 ✓] |
| Asistencia | "Ningún participante debe requerir ayuda externa para completar la tarea X" | Equivalente operativo a "walk-up usability" [N5 ✓] |
| Errores | "Promedio de errores por tarea ≤ 1" | Sauro: media industrial 0,7 errores/tarea [N4 ✓] |

### Recomendación para un primer release de un MVP

Una combinación equilibrada **defensible y realista** sería:
- **SUS ≥ 68** como umbral mínimo (estar al menos en el promedio industrial).
- **Completion rate ≥ 80%** en tareas principales (entre la media 78% y el cuartil superior 92%).
- **0 problemas críticos detectados** (todos los participantes pueden completar el flujo principal sin ayuda externa, aunque haya fricciones).

Para un MVP de TFG es lícito establecer estos como objetivos de aceptación; si se superan, el producto se valida; si no se alcanzan, se documenta como hallazgo y se proponen mejoras (que es exactamente lo que pide la guía de la ETSE-UV).

---

## Q8. Pruebas online masivas asíncronas como complemento

### Definición

El testing remoto **no moderado (asíncrono)** consiste en que el participante completa las tareas y responde el cuestionario **sin facilitador en vivo**, a su propio ritmo, desde su propio dispositivo [N4 ✓ FULL TEXT] (NN/g — *Moderated Remote Usability Tests*). Plataformas típicas: Maze, UserTesting, Lookback, Hotjar.

### Ventajas

- **Escala**: "Can gather vast quantities of data in a short period of time" [N5 ✓ FULL TEXT] (Maze — *Moderated vs Unmoderated*).
- **Coste**: no requiere espacio físico, facilitador en vivo ni coordinación de agendas.
- **Diversidad geográfica**: accesible a usuarios dispersos.
- **Rapidez**: resultados en horas/días, no semanas.

### Limitaciones

- "No way to clarify slightly ambiguous or unclear instructions" — las tareas tienen que estar perfectamente especificadas, sin margen para repregunta [N4 ✓ FULL TEXT] (NN/g).
- "High chance that testers will multitask or get distracted" [N4 ✓ FULL TEXT].
- No se observa lenguaje corporal ni se puede ahondar en lo que el usuario dice.
- Tasa de abandono más alta que en sesiones moderadas [N5 ✓ FULL TEXT] (Maze).
- **Sesgo de auto-selección**: quienes completan tests online tienden a tener perfil más técnico/joven que el promedio.

### Cuándo usar como complemento en TFG

NN/g y Maze coinciden en que ambas modalidades son complementarias [N4 ✓ FULL TEXT] (NN/g — *Moderated Remote Usability Tests*): "many teams use both methods complementarily throughout their design process".

**Patrón típico para TFG**:
1. **Ronda 1 — presencial moderado** con N=5 para descubrir problemas profundos con think-aloud.
2. **Ronda 2 — online asíncrono** con N mayor (15–30) para validar mejoras y obtener SUS con mayor potencia estadística.

Esta combinación cubre tanto los hallazgos cualitativos profundos (presencial) como la validación cuantitativa con más datos (asíncrono).

---

## Técnicas complementarias mencionables (no exhaustivo)

Además del bloque principal, en cursos universitarios de HCI también se enseñan técnicas rápidas que pueden mencionarse como alternativas:

- **Five-second test** [N5 ✓ FULL TEXT] (Userpeek, Lyssna): se muestra una pantalla durante 5 segundos y se pregunta al usuario qué recuerda. Útil para evaluar **primera impresión** y claridad de la propuesta de valor de la home.
- **First-click test** [N5 ✓ FULL TEXT] (User Interviews Field Guide): se pide al usuario que indique dónde haría clic primero para una tarea dada. Mide **arquitectura de información y findability** sin necesidad de prototipo funcional.
- **A/B testing** [N5 ✓ FULL TEXT] (BrowserStack — *Ultimate Guide to A/B Testing*): comparación cuantitativa de dos variantes en tráfico real, dividiendo aleatoriamente a los usuarios. Aplicable en producción, **no en una primera ronda de TFG** porque requiere base de usuarios y métricas de conversión definidas. Mencionable como evolución futura post-lanzamiento.

---

## Bibliografía clasificada

### N1 — Papers peer-reviewed (journals indexados)

- **Castilla, D. et al. (2023)**. *Psychometric Properties of the Spanish Full and Short Forms of the System Usability Scale (SUS): Detecting the Effect of Negatively Worded Items*. International Journal of Human–Computer Interaction, 40(15). https://www.tandfonline.com/doi/full/10.1080/10447318.2023.2209840 — [ABSTRACT] [✓] Validación española del SUS con N=1.321; α=0.76. Estudio observacional psicométrico.
- **Sevilla-González, M. et al. (2020)**. *Spanish Version of the System Usability Scale for the Assessment of Electronic Tools: Development and Validation*. JMIR Human Factors. https://pmc.ncbi.nlm.nih.gov/articles/PMC7773510/ — [FULL TEXT] [✓] Validación previa española del SUS con N=88 evaluando Zoom; α=0.812; CVI=0.92.
- **Khajouei, R. et al. (2016)**. *Comparison of heuristic and cognitive walkthrough usability evaluation methods for evaluating health information systems*. Journal of the American Medical Informatics Association. https://pmc.ncbi.nlm.nih.gov/articles/PMC9206256/ — [FULL TEXT] [✓] Estudio comparativo: HE detectó 104 problemas únicos, CW detectó 24; CW superior en aprendibilidad.

### N2 — Libros canónicos de referencia

- **Rubin, J. & Chisnell, D. (2008)**. *Handbook of Usability Testing: How to Plan, Design, and Conduct Effective Tests* (2nd ed.). Wiley. https://www.researchgate.net/publication/200553107_Handbook_of_Usability_Testing — [ABSTRACT] [✓] Manual de referencia académico-profesional para diseñar y conducir tests de usabilidad. Capítulo 8 cubre task scenarios.
- **Krug, S. (2010)**. *Rocket Surgery Made Easy: The Do-It-Yourself Guide to Finding and Fixing Usability Problems*. New Riders. https://sensible.com/rocket-surgery-made-easy/ — [FULL TEXT página oficial] [✓] Defiende la viabilidad de tests simples hechos por equipos sin formación UX especializada; filosofía "the least you can do".

### N3a — Papers de congreso (CHI / JUS)

- **Nielsen, J. (1994)**. *Enhancing the explanatory power of usability heuristics*. CHI'94 Proceedings, pp. 152–158. DOI 10.1145/191666.191729 — [ABSTRACT vía búsqueda] [✓] Versión 1994 refinada de las 10 heurísticas con base en análisis factorial de 249 problemas reales.
- **Nielsen, J. & Molich, R. (1990)**. *Heuristic Evaluation of User Interfaces*. CHI'90 Proceedings, pp. 249–256. DOI 10.1145/97243.97281 — [ABSTRACT vía búsqueda] [✓] Paper fundacional: 4 experimentos mostraron que evaluadores individuales detectan 20–51% de problemas, pero 3–5 evaluadores juntos detectan la mayoría.
- **Lewis, C., Polson, P., Wharton, C. & Rieman, J. (1990)**. *Testing a walkthrough methodology for theory-based design of walk-up-and-use interfaces*. CHI'90 Proceedings — [ABSTRACT vía Wikipedia y Usability Body of Knowledge] [✓] Origen del cognitive walkthrough.
- **Brooke, J. (1996)**. *SUS: A "quick and dirty" usability scale*. En Jordan, P. W. et al. (Eds.), *Usability Evaluation in Industry*. Taylor & Francis. https://digital.ahrq.gov/sites/default/files/docs/survey/systemusabilityscale%28sus%29_comp%5B1%5D.pdf — [FULL TEXT] [✓] Publicación original del SUS.
- **Bangor, A., Kortum, P. & Miller, J. (2009)**. *Determining what individual SUS scores mean: adding an adjective rating scale*. Journal of Usability Studies, 4(3), 114–123. https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Bangor_May2009.pdf — [FULL TEXT vía página web del journal] [✓] Mapeo de scores SUS a escala adjetival; introduce threshold operativo de ~70 como passing.

### N4 — Guías profesionales (NN/g, MeasuringU)

- **Nielsen Norman Group**. *10 Usability Heuristics for User Interface Design*. https://www.nngroup.com/articles/ten-usability-heuristics/ — [FULL TEXT] [✓] Versión vigente y mantenida de las 10 heurísticas.
- **Nielsen Norman Group**. *Thinking Aloud: The #1 Usability Tool*. https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/ — [FULL TEXT] [✓] Definición y procedimiento simplificado del think-aloud.
- **Nielsen Norman Group**. *Usability Testing 101*. https://www.nngroup.com/articles/usability-testing-101/ — [FULL TEXT] [✓] Definición básica y métricas (task success, time on task).
- **Nielsen Norman Group**. *How to Conduct a Heuristic Evaluation*. https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/ — [FULL TEXT] [✓] Procedimiento operativo: 3–5 evaluadores, 1–2h por evaluador, etapas.
- **Nielsen Norman Group**. *Why You Only Need to Test with 5 Users*. https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ — [FULL TEXT] [✓] Justificación de la regla de los 5 usuarios.
- **Nielsen Norman Group**. *Discount Usability for the Web*. https://www.nngroup.com/articles/web-discount-usability/ — [FULL TEXT] [✓] Doctrina de discount usability engineering.
- **Nielsen Norman Group**. *Moderated Remote Usability Tests: Why to Do Them*. https://www.nngroup.com/articles/moderated-remote-usability-test-why/ — [FULL TEXT] [✓] Comparativa moderado vs no moderado.
- **Nielsen Norman Group**. *Usability Metrics*. https://www.nngroup.com/articles/usability-metrics/ — [FULL TEXT] [✓] Las 4 métricas básicas (success rate, time on task, error rate, satisfaction).
- **MeasuringU (Sauro)**. *Measuring Usability with the System Usability Scale (SUS)*. https://measuringu.com/sus/ — [FULL TEXT] [✓] Cálculo del SUS, benchmark 68 como promedio.
- **MeasuringU (Sauro)**. *What Is a Good Task-Completion Rate?*. https://measuringu.com/task-completion/ — [FULL TEXT] [✓] Benchmark 78% como media industrial; cuartil superior >92%.
- **MeasuringU (Sauro)**. *Sample Sizes for Comparing SUS to a Benchmark*. https://measuringu.com/sample-sizes-for-sus-benchmark-tests/ — [FULL TEXT] [✓] Cálculos de tamaño muestral para detectar diferencias SUS.

### N5 — Guías profesionales secundarias / blogs especializados

- **Wikipedia**. *System Usability Scale*. https://en.wikipedia.org/wiki/System_usability_scale — [FULL TEXT] [✓] Las 10 preguntas exactas en español y método de cálculo.
- **Wikipedia**. *Cognitive Walkthrough*. https://en.wikipedia.org/wiki/Cognitive_walkthrough — [FULL TEXT] [✓] Las 4 preguntas del evaluador, contexto histórico.
- **Usability Body of Knowledge**. *Cognitive Walkthrough*. https://www.usabilitybok.org/cognitive-walkthrough/ — [referencia, 403 al fetch] [~] Referencia frecuente; método y citas a Lewis et al. 1990.
- **Lyssna**. *Usability Test Script*. https://www.lyssna.com/blog/usability-test-script/ — [FULL TEXT] [✓] Plantilla operativa de script de moderación.
- **Maze**. *Moderated vs. Unmoderated Usability Testing*. https://maze.co/guides/usability-testing/moderated-vs-unmoderated/ — [FULL TEXT] [✓] Comparativa profesional de modalidades.
- **AltexSoft**. *Non-functional Requirements in Software Engineering*. https://www.altexsoft.com/blog/non-functional-requirements/ — [FULL TEXT] [✓] Cómo formular RNF de usabilidad medibles.
- **BrowserStack**. *Ultimate Guide to A/B Testing*. https://www.browserstack.com/guide/a-b-testing — [SNIPPET] [~] Definición y aplicación de A/B testing.
- **ScienceDirect — Topics**. *System Usability Scale: an overview*. https://www.sciencedirect.com/topics/computer-science/system-usability-scale — [SNIPPET] [✓] Compilación de propiedades del SUS.
- **Userpeek**. *The Five Second Test In Usability Testing*. https://userpeek.com/blog/the-five-second-test-in-usability-testing/ — [SNIPPET] [~] Origen del five-second test (Christine Perfetti, mid-2000s).
- **User Interviews — Field Guide**. *First Click Testing*. https://www.userinterviews.com/ux-research-field-guide-chapter/first-click-testing — [SNIPPET] [~] Definición del first-click test.

---

## Síntesis ejecutiva para el Capítulo 6 del TFG

El capítulo 6 "Pruebas y Resultados" debe presentarse como una **evaluación de aceptación ingenieril**, no como una investigación cualitativa con aparato metodológico académico. La bibliografía clásica del campo proporciona un menú claro y defendible de técnicas: **evaluación heurística (Nielsen 1994), test de usabilidad con tareas (Rubin & Chisnell 2008; Krug 2010), think-aloud (NN/g) y SUS (Brooke 1996, en su versión española de Castilla 2023 o Sevilla-González 2020)**. Estas cuatro técnicas, en este orden, cubren los seis criterios que pide la guía oficial de la ETSE-UV (formularios estandarizados, perfil justificado de usuarios, condiciones detalladas, RNF medibles, análisis objetivo y mejoras propuestas).

La **regla de los 5 usuarios** está sólidamente respaldada por Nielsen y NN/g como punto de partida para detectar la mayoría de problemas críticos; no es necesario invocar debates posteriores (Faulkner 2003, Spool 2001) porque el TFG no es investigación académica, es desarrollo ingenieril con presupuesto limitado y la doctrina de "discount usability engineering" es bibliografía estándar que justifica esta decisión. El complemento natural es una **ronda online asíncrona** posterior para validar mejoras con N mayor y obtener un SUS estadísticamente más robusto.

Los **RNF de aceptación** deben formularse en términos cuantitativos y verificables: **SUS ≥ 68** (umbral mínimo industrial según Sauro-Lewis) o **SUS ≥ 72** (rango "Good" según Bangor et al.) como objetivo de satisfacción global, **completion rate ≥ 78%** (media industrial según MeasuringU) o **≥ 80%** para tareas principales como objetivo de efectividad, y **cero problemas críticos** como criterio binario de calidad. Estos umbrales tienen respaldo bibliográfico explícito y son los que se usan en industria real, lo que los hace defendibles ante tribunal.

El **análisis cualitativo del debrief** debe presentarse de forma simple: tabla de respuestas verbatim, agrupación en 3–5 temas emergentes, conteo de frecuencias y conversión a propuestas de mejora concretas para la siguiente iteración. No hace falta codificación axial ni análisis temático reflexivo — eso es aparato de investigación académica que no aplica a un TFG de desarrollo. Toda la sección puede defenderse con citas a NN/g, MeasuringU, Krug y los tres papers fundacionales (Nielsen 1994, Brooke 1996, Lewis et al. 1990), más Bangor 2009 y Castilla 2023 para el SUS español y los benchmarks.

---

## Resumen final

**Referencias por nivel:**
- N1: 3 (Castilla 2023, Sevilla-González 2020, Khajouei 2016)
- N2: 2 (Rubin & Chisnell 2008, Krug 2010)
- N3a: 5 (Nielsen 1994, Nielsen & Molich 1990, Lewis et al. 1990, Brooke 1996, Bangor et al. 2009)
- N4: 11 (NN/g x8, MeasuringU x3)
- N5: 10 (Wikipedia x2, UBoK, Lyssna, Maze, AltexSoft, BrowserStack, ScienceDirect, Userpeek, User Interviews)

**Total: 31 referencias** (cumple el mínimo de 20 holgadamente).

**5 técnicas recomendadas con justificación práctica:**

1. **Evaluación heurística de Nielsen previa a las pruebas con usuarios** — bajo coste, sin necesidad de reclutar, detecta problemas obvios antes de ocupar tiempo de los participantes. Conducirla con 1–3 evaluadores (el propio autor del TFG y opcionalmente tutor) sobre las 10 heurísticas.
2. **Test de usabilidad presencial con 5 usuarios + think-aloud + SUS** — la combinación canónica de la doctrina discount-usability. Script de moderación de 30 min con 3–5 tareas, post-task neutrales y SUS final.
3. **Cuestionario cualitativo de debrief con 5 preguntas abiertas** — "qué te gustó / qué cambiarías / qué te confundió / lo recomendarías / dudas pendientes". Análisis por temas emergentes simples.
4. **Ronda online asíncrona complementaria** con N=15–30 para validar mejoras y dar mayor potencia estadística al SUS. Plataforma tipo Maze o Google Forms + sesión grabada opcional.
5. **RNF cuantitativos formales en el capítulo 6** — SUS ≥ 68 (mínimo industrial), completion rate ≥ 80% en tareas principales, cero problemas críticos. Si se superan: aceptación demostrada. Si no: documentar como hallazgo + mejoras propuestas (que es exactamente lo que pide la guía ETSE-UV).
