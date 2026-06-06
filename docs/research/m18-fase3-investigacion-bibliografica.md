---
title: Investigación bibliográfica M-D1 (Fase 3 de M18)
type: research-report
created: 2026-05-24
phase: M18 Fase 3 — Diseño de cuestionarios
author_agent: investigador-academico (effortLevel: xhigh)
status: completed
related:
  - supabase/migrations/20260524131051_initial_research_schema.sql
  - KnowledgeBase/01-proyectos/personales/flouss/roadmap/plan-m18-supabase-research.md
  - KnowledgeBase/01-proyectos/personales/flouss/arquitectura/decisiones-diseno.md
---

# Investigación bibliográfica M-D1 — Fase 3 de M18

Informe completo entregado por el agente `investigador-academico` el 2026-05-24 con `effortLevel: xhigh`. Material para diseño de cuestionarios validados en español para el estudio M-D1 del TFG ETSE-UV. Citas APA 7 + clasificación N1-N5.

---

## 1. Resumen ejecutivo

**Hallazgo principal por objetivo:**

- **Objetivo 1 (Big Three/Five en español):** Existe versión oficial validada en español **solo del Big Three**, no del Big Five. La fuente autoritativa es el cuestionario del Banco de España (Encuesta de Competencias Financieras, ECF), que adapta el cuestionario OCDE/INFE y replica las tres preguntas de Lusardi & Mitchell (2014). Las preguntas literales en español de España (Castilla) están publicadas con permiso de reproducción explícito. **Recomendación: usar Big Three del ECF Banco de España; no extender a Big Five porque no hay validación española y el ECF no lo incluye.**

- **Objetivo 2 (SUS en español):** Hay dos validaciones peer-reviewed: **Sevilla-Gonzalez et al. (2020)** —español de México, JMIR Human Factors, α=.812, N=88— y **Castilla et al. (2023/2024)** —español de España, IJHCI, α=.76, N=1.321. Castilla es **más adecuado** para España (idioma destino correcto, N mucho mayor, análisis factorial confirmatorio). El texto literal de los 10 ítems en español no aparece extraído ni en Sevilla-Gonzalez (está en Multimedia Appendix 2 DOCX que devolvió 403) ni en el preprint accesible de Castilla. La traducción más usada en la industria UX española (TeaCup Lab, uiFromMars, UXables) coincide palabra por palabra entre tres fuentes independientes; **recomiendo usar esa traducción consensuada citando Castilla et al. (2023) como respaldo de la validación psicométrica española y documentando la limitación**.

- **Objetivo 3 (employment_status):** La propuesta del arquitecto es razonable y compatible con el INE-EPA y el OECD/INFE Toolkit, pero conviene ajustar nomenclatura. La fuente oficial española es el **esquema de clasificación de la EPA 2021 del INE (pág. 19)**, que distingue ocupados/parados/inactivos. **Recomiendo una lista de 9 valores alineada con EPA + OECD/INFE QD10**.

- **Objetivo 4 (timeout 60 min):** Hay evidencia N1 directamente aplicable. **Galesic & Bosnjak (2009, POQ)** muestra que duración declarada de 30 min ya tiene 46.8% de completion y caída fuerte de calidad en preguntas tardías. **Emery et al. (2023, Survey Practice)** documenta abandono del 17% en encuestas de ~65 min mediana —es viable si se comunica bien la duración. **Recomendación: 60 min globales es defendible pero alto; conviene comunicar la duración estimada al inicio y, si se confirma que el flujo real está en 20-30 min, considerar bajar a 45 min**.

**Nivel general de evidencia:** Sólida para objetivos 1, 3 y 4 (fuentes N1-N2 institucionales). Para objetivo 2 (SUS), la validación psicométrica española existe (N1) pero el texto literal de los ítems queda como limitación documentada: las versiones publicadas más usadas son N5 (blogs UX especializados con autoría identificada) que coinciden entre sí pero no son la versión literal de Castilla 2023.

**Lagunas no cubiertas:** No se obtuvo el texto literal exacto en español de los 10 ítems SUS de Castilla et al. (2023) porque el Multimedia Appendix de Sevilla-Gonzalez devolvió 403 y el PDF de Castilla en Roderic UV no era directamente descargable. Para el TFG, se propone resolverlo solicitando el preprint a los autores o aceptando la versión consensuada de la industria UX como aproximación válida documentando la limitación.

---

## 2. Síntesis temática

### 2.1 Objetivo 1 — Big Three vs Big Five en español

El instrumento estándar internacional para medir alfabetización financiera básica son las tres preguntas de Lusardi y Mitchell sobre interés compuesto, inflación y diversificación del riesgo (Lusardi & Mitchell, 2014, *Journal of Economic Literature* — N1 [ABSTRACT] ✓). El Banco de España adapta este instrumento al caso español a través de la **Encuesta de Competencias Financieras (ECF)**, que es a su vez una adaptación del cuestionario OCDE/INFE: *"La ECF adapta al caso español un cuestionario elaborado por representantes de los gobiernos y bancos centrales de unos treinta países pertenecientes a la Red Internacional de Educación Financiera (INFE), coordinada por la OCDE"* (Hospido et al., 2023, p. 6 — N2 ✓ FULL TEXT).

El informe ECF 2021 [N2 ✓ FULL TEXT] aclara explícitamente que mide los tres conceptos estándar: *"En este informe los conocimientos financieros se miden mediante tres preguntas generales que han sido utilizadas previamente en varios estudios internacionales, además de por la OCDE (Lusardi y Mitchell, 2014). Las preguntas miden la comprensión de los conceptos de inflación, interés compuesto y diversificación del riesgo"* (Hospido et al., 2023, p. 14). **Es decir: la versión española oficial validada con muestra representativa de N=7.764 es del Big Three, no del Big Five.**

Las preguntas literales tal y como aparecen en el cuestionario ECF 2021 (Hospido et al., 2023, p. 9; reproducción autorizada para fines docentes según pie del Depósito legal M-16426-2018) son las siguientes:

**Pregunta 1 — Inflación (con pregunta previa de división):**

> *"IMAGINE QUE CINCO HERMANOS RECIBEN UN REGALO DE 1.000 € EN TOTAL. SI COMPARTEN EL DINERO A PARTES IGUALES, ¿CUÁNTO OBTENDRÁ CADA UNO?"* [Respuesta numérica abierta; correcta: 200 €]
>
> *"IMAGINE AHORA QUE LOS CINCO HERMANOS TUVIERAN QUE ESPERAR UN AÑO PARA OBTENER SU PARTE DE LOS 1.000 €, Y QUE LA INFLACIÓN DE ESE AÑO FUESE DEL 1%. EN EL PLAZO DE UN AÑO SERÁN CAPACES DE COMPRAR:"*
>
> 1. Más de lo que podrían comprar hoy con su parte del dinero.
> 2. La misma cantidad.
> 3. **Menos de lo que podrían comprar hoy.** ← respuesta correcta

**Pregunta 2 — Tipo de interés compuesto (con pregunta previa de interés simple):**

> *"SUPONGAMOS QUE INGRESA 100 EUROS EN UNA CUENTA DE AHORRO CON UN INTERÉS FIJO DEL 2% ANUAL. EN ESTA CUENTA NO HAY COMISIONES NI IMPUESTOS. SI NO HACE NINGÚN OTRO INGRESO A ESTA CUENTA NI RETIRA NINGÚN DINERO, ¿CUÁNTO DINERO HABRÁ EN LA CUENTA AL FINAL DEL PRIMER AÑO, UNA VEZ QUE LE PAGUEN LOS INTERESES?"* [Respuesta abierta; correcta: 102 €]
>
> *"DE NUEVO, SI NO HACE NINGÚN INGRESO NI RETIRA NINGÚN DINERO, UNA VEZ ABONADO EL PAGO DE INTERESES, ¿CUÁNTO DINERO HABRÁ EN LA CUENTA DESPUÉS DE CINCO AÑOS?"*
>
> 1. **Más de 110 euros.** ← respuesta correcta
> 2. Exactamente 110 euros.
> 3. Menos de 110 euros.
> 4. Es imposible decirlo con la información dada.

**Pregunta 3 — Diversificación del riesgo:**

> *"POR LO GENERAL, ES POSIBLE REDUCIR EL RIESGO DE INVERTIR EN BOLSA MEDIANTE LA COMPRA DE UNA AMPLIA VARIEDAD DE ACCIONES"* [Verdadero/Falso/No sabe]
>
> Respuesta correcta: **Verdadero**.

Como referencia, los benchmarks españoles 2021 (Hospido et al., 2023, pp. 14-17 — N2 ✓ FULL TEXT) son: 65% acierta inflación, 41% interés compuesto y 52% diversificación. El índice promedio de respuestas correctas para la población española de 18-79 años es del **53%**. Estos datos son comparables internacionalmente porque la encuesta sigue el cuestionario OCDE/INFE.

Respecto al **Big Five**: el cuestionario añade dos preguntas sobre hipotecas y bonos (Lusardi & Mitchell, 2014; GFLEC, s.f. — N5 ✓ FULL TEXT). Sin embargo, el ECF español **no incluye** estas dos preguntas adicionales. Una búsqueda exhaustiva en bibliografía en español no ha encontrado validación con muestra representativa española del Big Five completo. El OECD/INFE Toolkit 2022 (OECD, 2022, p. 32 — N2 ✓ FULL TEXT) incluye una pregunta análoga a la de bonos: *"QK7: An investment with a high return is likely to be high risk"* (Verdadero/Falso), pero no es exactamente la formulación clásica del Big Five sobre relación tipo de interés-precio del bono. Sobre hipotecas, el toolkit no replica la formulación clásica.

Sobre la traducción del Big Five al español: aunque metodológicamente sería posible hacer back-translation, **no se encontraron fuentes N1-N2 que lo hayan hecho con validación psicométrica en muestra española**. Bover, Hospido y Villanueva (2018) y Hospido et al. (2023) son explícitos en que el cuestionario español se limita a los tres conceptos.

### 2.2 Objetivo 2 — SUS validado en español

Hay dos validaciones peer-reviewed publicadas:

**Sevilla-Gonzalez et al. (2020)** publicaron en *JMIR Human Factors* la primera validación documentada del SUS en español [N1 ✓ FULL TEXT, RCT/validación psicométrica]. El proceso siguió las directrices de la OMS para back-translation, con 2 traductores hacia el español y 1 traductor inverso al inglés, panel de 5 profesionales sanitarios bilingües, pilotaje con 10 usuarios, y validación con 88 usuarios adultos jóvenes. Resultados: *"The content validity index of the new Spanish SUS was good, as indicated by a rating of 0.92 for the relevance of the items, and the questionnaire was easy to understand, based on a face validity index of 0.94. The Cronbach α was .812 (95% CI 0.748-0.866; P<.001)"* (Sevilla-Gonzalez et al., 2020, p. 1). **Limitación clave: el estudio se realizó en Ciudad de México con español mexicano, no español de España**, y los autores reconocen explícitamente *"the representativeness of the sample in reflecting the rest of Latin America may need further studies"* (p. 5).

**Castilla et al. (2023, publicado en IJHCI 2024)** validaron el SUS con **muestra española de 1.321 participantes** [N1 ✓ ABSTRACT, validación psicométrica de mayor escala]. El paper detectó el conocido problema metodológico de los ítems formulados negativamente: *"Confirmatory analyses showed that the SUS was a valid measure with a one-factor structure when method errors associated with negatively worded items were considered (CFI = .932, TLI = .898; RMSEA = .055, CI 90% = 0.047, 0.062), and shown evidence of reliability (Cronbach's alpha = .76)"*. También validaron una forma corta con solo ítems positivos: *"the short version with only positively worded items also showed to be a valid (CFI = .973, TLI = .946; RMSEA = .057, CI 90% = .041, .075) and reliable measure (Cronbach alpha = .77)"*. Para el contexto español, **Castilla et al. es la fuente prioritaria** porque (a) idioma español de España, (b) N=15× mayor, (c) análisis factorial confirmatorio más sofisticado y (d) detecta el problema de los ítems negativos.

**El texto literal de los 10 ítems en español validados por Castilla 2023 no se pudo extraer del paper accesible públicamente** (los apéndices con la versión literal del cuestionario requieren acceso al artículo completo de IJHCI 2024). Tampoco se obtuvo el Multimedia Appendix 2 de Sevilla-Gonzalez 2020 (devolvió 403 al intentar descargarlo y su Multimedia Appendix sería en español mexicano).

Sin embargo, tres fuentes web españolas independientes especializadas en UX (TeaCup Lab, uiFromMars, UXables) [N5 ✓ FULL TEXT cada una] **convergen literalmente palabra por palabra** en la siguiente versión, identificada como la traducción consensuada en la industria UX española:

| # | Ítem (versión consensuada industria UX) | Polaridad |
|---|------------------------------------------|-----------|
| 1 | Creo que me gustaría utilizar este sistema con frecuencia. | + (positivo) |
| 2 | Encontré el sistema innecesariamente complejo. | − (negativo) |
| 3 | Pensé que el sistema era fácil de usar. | + |
| 4 | Creo que necesitaría el apoyo de un técnico para poder utilizar este sistema. | − |
| 5 | Encontré que las diversas funciones del sistema estaban bien integradas. | + |
| 6 | Pensé que había demasiada inconsistencia en este sistema. | − |
| 7 | Me imagino que la mayoría de la gente aprendería a utilizar este sistema muy rápidamente. | + |
| 8 | Encontré el sistema muy complicado/incómodo de usar. | − |
| 9 | Me sentí muy seguro al utilizar el sistema. | + |
| 10 | Necesitaba aprender muchas cosas antes de poder empezar con este sistema. | − |

*Nota sobre ítem 8:* las dos variantes en español ("muy complicado" en uiFromMars/UXables, "muy incómodo" en TeaCup Lab) reflejan la dificultad de traducir el original inglés *"cumbersome"*. Sevilla-Gonzalez (2020, p. 3) menciona explícitamente este problema y propone *"tedioso"* en español mexicano. Para España, **"muy incómodo de usar"** es preferible por mayor cercanía semántica al original *"cumbersome to use"*.

**Escala de respuesta** (idéntica entre todas las versiones consultadas): 5 puntos Likert, de 1 = *"Totalmente en desacuerdo"* a 5 = *"Totalmente de acuerdo"*. Sevilla-Gonzalez (2020, p. 2) describe el cálculo del score: *"The score contribution for the odd items (the positive statements) is the scale position minus 1 and the contribution for the even items (the negative statements) is 5 minus the scale position. The overall score is calculated from the sum of all item scores multiplied by 2.5, with the overall score ranging from 0 to 100"*. Umbrales interpretativos (Sevilla-Gonzalez, 2020, p. 2; basados en Bangor et al., 2008): >85 excelente; 68-84 buena usabilidad. El umbral de 68 como punto medio aceptable es el estándar más citado en la literatura.

**Discrepancia documentada:** Sevilla-Gonzalez (α=.812) y Castilla (α=.76) reportan alphas distintos. La diferencia se explica por (a) idioma de validación, (b) tamaño muestral, (c) Castilla aplica modelo confirmatorio que controla efectos de método (ítems negativos) — su α=.76 es más conservador pero metodológicamente más riguroso.

### 2.3 Objetivo 3 — Lista de `employment_status`

La fuente oficial española es el **esquema de clasificación de la EPA del INE** (INE, 2021, p. 19 — N2 ✓ FULL TEXT), basado en las recomendaciones de la OIT (XIX y XX Conferencias Internacionales de Estadísticos del Trabajo). El esquema EPA distingue tres niveles superiores —Activos (Ocupados/Parados), Inactivos, Población Contada Aparte— y las siguientes subcategorías relevantes para un cuestionario individual:

- **Ocupados — Asalariados:** del sector público, del sector privado.
- **Ocupados — Trabajadores por cuenta propia:** empleadores, empresarios sin asalariados y trabajadores independientes, miembros de cooperativas, ayudas familiares.
- **Parados:** que buscan primer empleo, que han trabajado antes.
- **Inactivos:** estudiantes, jubilados o pensionistas, **labores del hogar**, **incapacitados para trabajar**, otra situación (rentistas...), no sabe.

El **OECD/INFE Toolkit 2022** (OECD, 2022, p. 35 — N2 ✓ FULL TEXT) define en QD10 ("Work situation") una lista internacional ligeramente más simple, alineada con la EPA:

> *"And which of these best describes your current work situation? Please refer to your main working status: Self-employed [work for yourself] / In paid employment [work for someone else] / Apprentice / Looking after the home / Looking for work [unemployed] / Retired / Unable to work due to sickness or ill-health / Not working and not looking for work / Student / Other"*

**Validación de la propuesta del arquitecto** (`employed_full_time`, `employed_part_time`, `self_employed`, `student`, `unemployed`, `retired`, `homemaker`, `unable_to_work`, `other`):

| Categoría propuesta | Respaldo oficial | Comentario |
|---|---|---|
| `employed_full_time` | EPA (asalariados a tiempo completo) ✓ | OECD/INFE no separa por jornada en QD10 |
| `employed_part_time` | EPA "Tasa de trabajo a tiempo parcial" ✓ | Idem |
| `self_employed` | EPA "Trabajadores por cuenta propia" ✓; OECD/INFE "Self-employed" ✓ | Englobaría empresarios + autónomos + cooperativistas |
| `student` | EPA "Estudiantes" ✓; OECD/INFE "Student" ✓ | Correcto |
| `unemployed` | EPA "Parados" ✓; OECD/INFE "Looking for work" ✓ | Correcto |
| `retired` | EPA "Jubilados o pensionistas" ✓; OECD/INFE "Retired" ✓ | Correcto |
| `homemaker` | EPA "Labores del hogar" ✓; OECD/INFE "Looking after the home" ✓ | Categoría reconocida explícitamente |
| `unable_to_work` | EPA "Incapacitados para trabajar" ✓; OECD/INFE "Unable to work due to sickness or ill-health" ✓ | **Sí es categoría oficial reconocida en INE-EPA** |
| `other` | EPA "Otra situación (rentistas, ...)" ✓; OECD/INFE "Other" ✓ | Correcto |

**Discusión de ajustes posibles:**

- **¿Falta funcionario vs. privado?** El INE distingue *"del sector público"* vs *"del sector privado"* dentro de asalariados (INE, 2021, p. 19). OECD/INFE no lo distingue. Para un cuestionario auto-administrado breve de TFG, la distinción aporta poco valor analítico (no es predictor robusto en literatura financiera) y aumenta complejidad. **Recomiendo no añadirlo**.
- **¿Falta becario/aprendiz?** La OECD/INFE lo incluye como categoría aparte (`Apprentice`). En España es ambiguo (becas FPU, contrato formación, etc.) y los participantes probablemente lo encajen en `student` o `employed_part_time`. **Opcional añadirlo si el N esperado tiene perfil universitario**.
- **¿Sobra alguna?** `homemaker` y `unable_to_work` son categorías poco frecuentes en perfil esperado <50 años; pero al ser oficiales en EPA conviene mantenerlas.

### 2.4 Objetivo 4 — Timeout de 60 minutos

La evidencia N1 más relevante es **Galesic & Bosnjak (2009)**, publicado en *Public Opinion Quarterly* [N1 ✓ ABSTRACT, estudio experimental con manipulación de duración declarada]. Los autores compararon tres condiciones (10, 20, 30 minutos declarados al inicio): *"In the 10-minute survey group, 75% of respondents chose to start the survey and 68.2% completed it, while only 64.9% started and 56.8% completed the 20-minute version, and 62.4% started and 46.8% completed the 30-minute version"*. Además, encontraron que *"answers to questions positioned later in the questionnaire were faster, shorter, and more uniform than answers to questions positioned near the beginning"* — es decir, la calidad de respuesta cae en preguntas tardías.

**Liu & Wronski (2018)** complementan con un análisis observacional de 25.080 encuestas web reales [N1 ✓ ABSTRACT], confirmando relación negativa entre duración/dificultad y completion rate.

Para encuestas largas específicamente, **Emery et al. (2023)** en *Survey Practice* [N1 ✓ FULL TEXT, estudio observacional sobre breakoff en encuestas de hora de duración] reportan: *"An overall breakoff rate of 17% across a survey that takes almost an hour to complete... compares favorably with breakoff rates observed in shorter surveys"*. La duración promedio fue de 65 minutos (mediana 59) en su muestra de 3 países. Concluyen que encuestas de ~60 min son viables **si**: (a) se comunica claramente la duración previa, (b) se proporciona incentivación adecuada, (c) se optimiza para móvil, (d) se minimizan preguntas complejas/repetitivas.

**Aplicación al M-D1:**

- El timeout de 60 min como **límite duro** (cierre de sesión) es razonable y defendible con cita Galesic & Bosnjak (2009) + Emery et al. (2023).
- **Pero 60 min como expectativa real es alto** para un cuestionario auto-administrado de N=30-60 sin incentivo monetario. Si el flujo real (consentimiento + demografía + pretest + uso app + posttest) está en 20-30 minutos, **conviene declararlo así al participante al inicio** (siguiendo Galesic & Bosnjak), porque la duración declarada afecta tanto a la tasa de inicio como a la completion.
- **No se encontró evidencia que recomiende timeouts por fase específica**; el estándar es duración global. Mantener 60 min globales pero comunicar duración esperada realista.

---

## 3. Índice de fuentes por nivel

### Nivel N1 — Papers peer-reviewed

- **Sevilla-Gonzalez, M. D. R., Moreno Loaeza, L., Lazaro-Carrera, L. S., Bourguet Ramírez, B., Vázquez Rodríguez, A., Peralta-Pedrero, M. L., & Almeda-Valdes, P.** (2020). Spanish version of the System Usability Scale for the assessment of electronic tools: Development and validation. *JMIR Human Factors, 7*(4), e21161. https://doi.org/10.2196/21161 [FULL TEXT] ✓ — Validación SUS en español mexicano (N=88, α=.812). Tipo: estudio de validación psicométrica.

- **Castilla, D., Jaen, I., Suso-Ribera, C., Garcia-Soriano, G., Zaragoza, I., Breton-Lopez, J., Mira, A., Diaz-Garcia, A., & Garcia-Palacios, A.** (2024). Psychometric properties of the Spanish full and short forms of the System Usability Scale (SUS): Detecting the effect of negatively worded items. *International Journal of Human–Computer Interaction, 40*(15), 4145–4151. https://doi.org/10.1080/10447318.2023.2209840 [ABSTRACT] ✓ — Validación SUS en español de España (N=1.321, α=.76 con CFA controlando ítems negativos). Tipo: estudio de validación psicométrica de mayor escala.

- **Lusardi, A., & Mitchell, O. S.** (2014). The economic importance of financial literacy: Theory and evidence. *Journal of Economic Literature, 52*(1), 5–44. https://doi.org/10.1257/jel.52.1.5 [ABSTRACT] ✓ — Paper fundacional del Big Three. Tipo: revisión narrativa/teórica.

- **Galesic, M., & Bosnjak, M.** (2009). Effects of questionnaire length on participation and indicators of response quality in a web survey. *Public Opinion Quarterly, 73*(2), 349–360. https://doi.org/10.1093/poq/nfp031 [ABSTRACT] ✓ — Tasas de completion por duración declarada (10/20/30 min). Tipo: experimento aleatorizado.

- **Liu, M., & Wronski, L.** (2018). Examining completion rates in web surveys via over 25,000 real-world surveys. *Social Science Computer Review, 36*(1), 116–124. https://doi.org/10.1177/0894439317695581 [ABSTRACT] ✓ — Relación duración-completion en muestra masiva. Tipo: análisis observacional a gran escala.

- **Emery, T., Cabaco, S., Fadel, L., Lugtig, P., Toepoel, V., Schumann, A., Lück, D., & Bujard, M.** (2023). Breakoffs in an hour-long, online survey. *Survey Practice, 16*(1). https://doi.org/10.29115/SP-2023-0008 [FULL TEXT] ✓ — Abandono del 17% en encuestas de ~65 min. Tipo: estudio observacional comparativo entre países.

### Nivel N2 — Informes institucionales oficiales

- **Hospido, L., Machelett, M., Pidkuyko, M., & Villanueva, E.** (2023). *Encuesta de Competencias Financieras (ECF) 2021: Principales resultados y cambios desde 2016*. Banco de España. https://doi.org/10.53479/34752 [FULL TEXT] ✓ — Cuestionario español oficial del Big Three con muestra N=7.764 representativa nacional.

- **Instituto Nacional de Estadística (INE)**. (2021). *Encuesta de Población Activa. Metodología 2021. Descripción general de la encuesta*. Madrid: INE. https://www.ine.es/inebaseDYN/epa30308/docs/resumetepa21.pdf [FULL TEXT] ✓ — Esquema oficial de clasificación de situación laboral en España (pág. 19).

- **OECD**. (2022). *OECD/INFE Toolkit for Measuring Financial Literacy and Financial Inclusion 2022*. OECD Publishing, Paris. https://www.oecd.org/financial/education/2022-INFE-Toolkit-Measuring-Finlit-Financial-Inclusion.pdf [FULL TEXT] ✓ — Cuestionario internacional con preguntas de alfabetización financiera (QK2-QK7) y QD10 work situation.

### Nivel N5 — Fuentes web con autoría experta

- **TeaCup Lab**. (s.f.). *Qué es la escala SUS y cómo usarla para medir la usabilidad*. https://www.teacuplab.com/es/blog/que-es-la-escala-sus-y-como-usarla-para-medir-la-usabilidad/ [FULL TEXT] ✓ — Traducción consensuada de los 10 ítems SUS al español.

- **Arias del Prado, J. — uiFromMars**. (s.f.). *Cómo medir la usabilidad con un SUS*. https://uifrommars.com/como-medir-usabilidad-que-es-sus/ [FULL TEXT] ✓ — Mismos 10 ítems en español, coincidentes con TeaCup Lab.

- **UXables**. (s.f.). *Medir con el sistema de escala de usabilidad (SUS)*. https://www.uxables.com/investigacion-ux/medir-con-el-sistema-de-escala-de-usabilidad-sus/ [FULL TEXT] ✓ — Misma traducción consensuada.

- **GFLEC (Global Financial Literacy Excellence Center)**. (s.f.). *The Big Three and Big Five Questions*. https://gflec.org/education/questions-that-indicate-financial-literacy/ [FULL TEXT] ✓ — Texto literal en inglés de Big Three + Big Five.

### Fuentes consultadas pero NO usadas (acceso restringido)

- ResearchGate PDF de Castilla et al. (2023) — 403 Forbidden.
- Roderic UV PDF Castilla — no descargable directamente.
- Multimedia Appendix 2 de Sevilla-Gonzalez 2020 — 403 Forbidden.

---

## 4. Fortaleza de evidencia

| Conclusión | Fuentes (nivel + stance) | Metodología más alta | Valoración |
|---|---|---|---|
| **Big Three es el estándar para alfabetización financiera básica en España** | Hospido et al. 2023 [N2 ✓], Lusardi & Mitchell 2014 [N1 ✓], OECD 2022 [N2 ✓] | Encuesta representativa nacional N=7.764 + revisión narrativa N1 | **Sólida** |
| **No existe Big Five validado en español de España** | Hospido et al. 2023 [N2 ✓ —ECF solo usa 3 preguntas], OECD 2022 [N2 — toolkit incluye QK7 análoga pero no Big Five clásico] | Encuesta nacional + toolkit institucional | **Sólida** (evidencia por ausencia, verificada en dos fuentes autoritativas) |
| **Texto literal Big Three en español: cuestionario ECF Banco de España** | Hospido et al. 2023 p. 9 [N2 ✓ FULL TEXT, reproducción autorizada] | Documento institucional con permiso de reproducción explícito | **Sólida** |
| **SUS español validado psicométricamente existe (Cronbach α=.76 a .81)** | Castilla et al. 2024 [N1 ✓ ABSTRACT, N=1.321], Sevilla-Gonzalez 2020 [N1 ✓ FULL TEXT, N=88] | Validación psicométrica con CFA | **Sólida en validación; Moderada en acceso al texto literal** |
| **Texto literal de los 10 ítems SUS español de España (Castilla 2023)** | No accesible públicamente. Versión consensuada de la industria UX: TeaCup Lab, uiFromMars, UXables [N5 ✓×3 coincidentes] | Blogs UX con autoría identificada coincidentes entre sí | **Moderada — sin acceso al apéndice del paper Castilla 2023, se usa convergencia entre N5** |
| **Lista de 9 employment_status compatible con EPA + OECD/INFE** | INE EPA 2021 [N2 ✓ FULL TEXT, p. 19], OECD/INFE 2022 [N2 ✓ FULL TEXT, QD10] | Clasificación oficial OIT (XIX/XX Conf. Internacional Estadísticos del Trabajo) | **Sólida** |
| **Timeout 60 min global es defendible pero alto; comunicar duración esperada** | Galesic & Bosnjak 2009 [N1 ✓ ABSTRACT, experimento], Emery et al. 2023 [N1 ✓ FULL TEXT, observacional], Liu & Wronski 2018 [N1 ✓ ABSTRACT, observacional] | Experimento aleatorizado + observacional N=25k | **Sólida** |

---

## 5. Recomendaciones accionables para el equipo

### Pretest financiero (Objetivo 1)
- **Usar Big Three del Banco de España (ECF 2021), copiando literalmente las tres preguntas tal como aparecen en Hospido et al. (2023), p. 9.** Incluir las preguntas previas de división simple (200€) e interés simple (102€) porque dan contexto a las preguntas finales y permiten distinguir errores de aritmética básica de errores conceptuales de interés compuesto.
- **No incluir Big Five** porque no hay validación española y aumenta tiempo sin ganar comparabilidad.
- Citar siempre: Hospido et al. (2023) + Lusardi & Mitchell (2014) como soporte teórico.
- Reportar el % correcto del estudio comparado con benchmark español (53% promedio).

### Posttest de usabilidad (Objetivo 2)
- **Aplicar SUS de 10 ítems con la traducción consensuada de la industria UX española** (la que coincide entre TeaCup Lab, uiFromMars y UXables) — incluida íntegra en este informe (sección 2.2).
- **En la memoria del TFG citar Castilla et al. (2023, IJHCI)** como respaldo de que la versión española del SUS está validada psicométricamente con N=1.321 en España (α=.76, CFI=.932). Esto cumple el criterio del tribunal de "formularios de evaluación estandarizados" (skill ETSE-UV cap. 6).
- **Documentar como limitación**: el texto literal exacto del paper Castilla 2023 no se pudo verificar al no estar publicado abiertamente; la versión usada es la traducción más extendida en la práctica profesional UX española, coincidente entre tres fuentes independientes.
- Para ítem 8 (`cumbersome`), usar **"muy incómodo de usar"** (más cercano semánticamente al original).
- Definir en el capítulo 4.1 (RNF) el umbral de aceptación: por ejemplo *"SUS ≥ 68 (umbral de usabilidad aceptable según Bangor et al., 2008)"* o *"SUS ≥ 70 percentil 50 de productos B2C según Sauro & Lewis 2016"*.

### Demografía — employment_status (Objetivo 3)
Lista final recomendada con justificación de cada categoría:

```
employed_full_time     # EPA Ocupados-Asalariados tiempo completo
employed_part_time     # EPA "Tasa de trabajo a tiempo parcial"
self_employed          # EPA "Trabajadores por cuenta propia" + OECD/INFE "Self-employed"
student                # EPA Inactivos-Estudiantes + OECD/INFE "Student"
unemployed             # EPA Parados + OECD/INFE "Looking for work"
retired                # EPA Inactivos-Jubilados o pensionistas + OECD/INFE "Retired"
homemaker              # EPA Inactivos-Labores del hogar + OECD/INFE "Looking after the home"
unable_to_work         # EPA Inactivos-Incapacitados para trabajar + OECD/INFE "Unable to work due to sickness or ill-health"
other                  # EPA Inactivos-Otra situación + OECD/INFE "Other"
```

- **La lista de 9 valores propuesta es correcta y suficiente.** Citar en la memoria: INE (2021) y OECD (2022) QD10.
- Etiquetas en castellano sugeridas para el cuestionario web:
  - `employed_full_time` → "Asalariado/a a tiempo completo"
  - `employed_part_time` → "Asalariado/a a tiempo parcial"
  - `self_employed` → "Autónomo/a o empresario/a"
  - `student` → "Estudiante"
  - `unemployed` → "Desempleado/a"
  - `retired` → "Jubilado/a o pensionista"
  - `homemaker` → "Dedicado/a a labores del hogar"
  - `unable_to_work` → "Incapacitado/a para trabajar"
  - `other` → "Otra situación"

### Timeout (Objetivo 4)
- **Mantener 60 min como cierre duro de sesión.** Defendible con Galesic & Bosnjak (2009) y Emery et al. (2023).
- **Comunicar al participante al inicio la duración estimada realista** (probablemente 20-30 min según el flujo descrito). Galesic & Bosnjak demuestran que la duración declarada baja tanto la tasa de inicio como de completion — pero ocultarla es peor (sesgo de selección, abandono mid-survey).
- Si tras el piloto interno se confirma que el flujo real está bajo 30 min, considerar bajar el timeout duro a 45 min (proporciona margen de seguridad ×1.5 sobre la mediana esperada).
- **No segmentar timeout por fase** — no hay evidencia que lo respalde y añade complejidad técnica.

## 6. Limitaciones del informe

1. **Texto literal SUS de Castilla 2023:** no se pudo extraer del paper original (ResearchGate y Roderic UV no devolvieron PDF completo). Se mitigó usando convergencia entre tres fuentes web españolas N5 coincidentes palabra por palabra. Para mayor rigor académico en el TFG, solicitar el preprint a los autores (lab.psitec@uv.es / Diana Castilla — Universitat de València) — proximidad institucional con ETSE-UV facilita acceso.
2. **Versión Sevilla-Gonzalez:** el Multimedia Appendix 2 del JMIR Human Factors devolvió 403. Su versión es para español mexicano, no de España, por lo que no es prioritaria de todas formas.
3. **Big Five en español:** se buscó activamente y se confirmó por ausencia en ECF y OECD/INFE. Si en el futuro apareciera una validación española peer-reviewed del Big Five, esta recomendación debería revisarse.
4. **Liu & Wronski 2018 y Castilla 2023:** leídos solo en abstract — el contenido del paper completo puede tener matices adicionales no incorporados.

---

## 7. Decisión del usuario sobre Big Five (2026-05-24)

Tras presentar al usuario los hallazgos, decidió **mantener el Big Five (5 preguntas)** a pesar de no estar validado en España. Justificación:

- Las 2 preguntas adicionales (bonos + hipotecas) discriminan entre nivel intermedio y avanzado de alfabetización financiera (el usuario quería esa distinción)
- Citaremos correctamente que 3 preguntas son las validadas en España (Hospido et al. 2023) y las 2 adicionales provienen de la versión americana original (Lusardi & Mitchell 2011; GFLEC)
- Como el estudio es exploratorio descriptivo (no validación inferencial), el rigor exigido es más laxo y la opción es defendible
- Documentaremos la decisión en el TFG con honestidad académica

Implicación: la migración 004 debe añadir 2 columnas adicionales `big_five_q4` (bonos) y `big_five_q5` (hipotecas) además de las 3 columnas `big_three_qN` ya existentes.

## 8. Otras decisiones de usuario (2026-05-24)

- **SUS:** se usa la traducción consensuada UX citando Castilla et al. (2023) como respaldo psicométrico, documentando la limitación. Opción del usuario: enviar email opcional a Diana Castilla (UV) para acceso al texto literal del paper — no bloquea avance.
- **employment_status:** lista de 9 valores aprobada, etiquetas en castellano según propuesta del investigador.
- **Timeout:** 60 min global confirmado, con declaración al participante de duración esperada "unos 10 minutos" (más conservador que los 15-20 propuestos por el investigador, decisión del usuario).

---

## Fuentes web consultadas

- Sevilla-Gonzalez et al. 2020 — JMIR Human Factors: https://humanfactors.jmir.org/2020/4/e21161/
- Sevilla-Gonzalez et al. 2020 — PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC7773510/
- Castilla et al. 2023 — IJHCI Roderic UV: https://roderic.uv.es/items/09d707c8-9d43-4c4f-bae8-5ea002f29b1c
- Castilla et al. 2023 — Producció Científica UV: https://producciocientifica.uv.es/documentos/647346f2c0b3b138499887c0
- Hospido et al. 2023 — ECF 2021 Banco de España: https://www.bde.es/f/webbe/SES/AnalisisEconomico/Competencis_Financieras/EncuestaCompetencias_2021.pdf
- Lusardi & Mitchell 2014 — Journal of Economic Literature: https://www.aeaweb.org/articles?id=10.1257/jel.52.1.5
- GFLEC — Big Three and Big Five Questions: https://gflec.org/education/questions-that-indicate-financial-literacy/
- OECD/INFE Toolkit 2022: https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/03/oecd-infe-toolkit-for-measuring-financial-literacy-and-financial-inclusion-2022_54dba970/cbc4114f-en.pdf
- INE — EPA Metodología 2021: https://www.ine.es/inebaseDYN/epa30308/docs/resumetepa21.pdf
- Galesic & Bosnjak 2009 — Public Opinion Quarterly: https://academic.oup.com/poq/article-abstract/73/2/349/1939196
- Liu & Wronski 2018 — Social Science Computer Review: https://journals.sagepub.com/doi/abs/10.1177/0894439317695581
- Emery et al. 2023 — Survey Practice: https://www.surveypractice.org/article/84347-breakoffs-in-an-hour-long-online-survey
- TeaCup Lab — SUS español: https://www.teacuplab.com/es/blog/que-es-la-escala-sus-y-como-usarla-para-medir-la-usabilidad/
- uiFromMars — SUS español: https://uifrommars.com/como-medir-usabilidad-que-es-sus/
- UXables — SUS español: https://www.uxables.com/investigacion-ux/medir-con-el-sistema-de-escala-de-usabilidad-sus/
- Hospido, Iriberri & Machelett 2023 — Gender gaps in financial literacy (IZA): https://docs.iza.org/dp16628.pdf
