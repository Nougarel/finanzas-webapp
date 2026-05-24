---
title: Dossier de cuestionarios M-D1
type: research-dossier
created: 2026-05-24
phase: M18 Fase 3 — Diseño de cuestionarios
author_agent: redactor-academico (skill etse-uv-tfg)
status: completed
related:
  - docs/research/m18-fase3-investigacion-bibliografica.md
  - KnowledgeBase/01-proyectos/personales/finanzas-webapp/roadmap/plan-m18-supabase-research.md
---

# Dossier de cuestionarios M-D1 — TFG Ingeniería Multimedia ETSE-UV

Este dossier recoge los textos literales de todas las pantallas del funnel `/study` del estudio de aceptación M-D1, así como la trazabilidad de cada instrumento a su fuente bibliográfica. Es el material de referencia para que el agente `frontend` implemente la Fase 4 (funnel single-session) sin necesidad de redactar texto adicional, y para que los anexos del TFG puedan citar directamente los ítems aplicados.

El estudio se enmarca como exploratorio descriptivo (no validación inferencial), conforme a la decisión documentada en ADR-02 y al cálculo de potencia previsto para el capítulo 6 de la memoria. La población objetivo es de 30 a 60 participantes adultos hispanohablantes residentes en España, reclutados de forma asíncrona por canales personales del autor (WhatsApp, correo electrónico y LinkedIn). El idioma del cuestionario es español de España.

## 1. Visión general del cuestionario

El funnel se diseña como una única sesión continua en la misma pestaña del navegador. Si el participante cierra la pestaña, pierde la sesión (limitación declarada en la memoria). El tiempo total estimado para el participante es de 15 a 20 minutos en condiciones normales, aunque al inicio se comunica una expectativa más conservadora de "unos 10 minutos" siguiendo la lógica de Galesic y Bosnjak (2009) sobre el efecto de la duración declarada en las tasas de inicio y de completion.

| # | Bloque | Pantallas | Ítems | Tiempo estimado |
|---|--------|-----------|-------|-----------------|
| 1 | Bienvenida | 1 | — | <1 min |
| 2 | Consentimiento informado RGPD | 1 | 1 checkbox | <1 min |
| 3 | Demografía | 1 | 6 | 2-3 min |
| 4 | Pretest: Big Five de alfabetización financiera | 1 | 5 (+2 ítems previos de aritmética) | 4-5 min |
| 5 | Uso libre de la herramienta (instrumentado) | — | — | 5-10 min |
| 6 | Posttest: SUS | 1 | 10 | 2-3 min |
| 7 | Posttest: bloque ad-hoc | 1 | 4 | 1-2 min |
| 8 | Posttest: cualitativo opcional | 1 | 2 (opcionales) | 0-2 min |
| 9 | Cierre y agradecimiento | 1 | — | <1 min |

Tiempo total estimado: 15 a 20 minutos. Timeout duro de sesión: 60 minutos (Galesic y Bosnjak, 2009; Emery et al., 2023).

## 2. Pantalla de bienvenida

**Título:** Estudio sobre un planificador financiero personal

**Cuerpo:**

> Gracias por participar en este estudio. Vas a probar una herramienta web que te sugiere cómo distribuir tu presupuesto mensual entre 20 categorías de gasto y ahorro. Forma parte de un Trabajo de Fin de Grado en Ingeniería Multimedia en la Universitat de València.
>
> El proceso es el siguiente: primero te haremos unas preguntas breves sobre ti y sobre conceptos financieros generales; después usarás la herramienta libremente; al terminar, te pediremos que valores la experiencia. Todo se hace en esta misma pestaña, sin registro y sin recoger datos personales identificativos.
>
> La duración estimada es de unos 10 minutos. Te recomendamos hacerlo de una sentada y sin prisa.
>
> **Una nota importante:** en las preguntas que aparecen a lo largo del estudio, responde lo que **realmente piensas o sabes**, sin tratar de buscar la respuesta "correcta". No estamos evaluándote a ti — el objetivo es adaptar la herramienta lo mejor posible a personas como tú, y eso solo es posible si tus respuestas son sinceras.

**Botón principal:** "Empezar"

## 3. Pantalla de consentimiento informado RGPD

**Título:** Antes de empezar, una nota sobre tus datos

**Cuerpo (147 palabras):**

> Este estudio recoge respuestas anónimas con fines exclusivamente académicos para un Trabajo de Fin de Grado (Ingeniería Multimedia, ETSE-UV).
>
> Se asigna a tu sesión un identificador técnico interno que permite enlazar tus respuestas entre fases, pero no recogemos tu nombre, correo electrónico, dirección IP ni ningún otro dato que permita identificarte. Tampoco se utilizan cookies de seguimiento ni se comparten los datos con terceros. Los datos se almacenan en Supabase (servidores en la Unión Europea, Frankfurt) y se conservan únicamente durante el periodo de análisis del TFG.
>
> El tratamiento se ampara en el considerando 26 del Reglamento (UE) 2016/679 (RGPD), aplicable a datos seudonimizados sin posibilidad razonable de reidentificación. La participación es voluntaria y puedes cerrar la pestaña en cualquier momento.

**Checkbox (NO premarcada):**

> [ ] He leído lo anterior y acepto participar de forma anónima en este estudio.

**Botón principal:** "Continuar" (deshabilitado hasta marcar la casilla)

**Nota de implementación:** la casilla debe permanecer sin marcar por defecto, conforme al considerando 26 del RGPD y a las directrices del Comité Europeo de Protección de Datos sobre consentimiento explícito.

## 4. Pantalla de demografía

**Título:** Sobre ti

**Texto introductorio:**

> Antes de empezar con la herramienta, cuéntanos brevemente quién eres. Esta información se usa solo para describir el perfil de las personas participantes en el estudio.

Las preguntas se presentan en una única pantalla, en el orden que sigue. Todas son obligatorias salvo que se indique lo contrario.

### 4.1. Rango de edad (`age_range`)

**Pregunta:** ¿En qué rango de edad estás?

**Tipo de input:** radio (selección única)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `under_25` | Menos de 25 años |
| `25_34` | Entre 25 y 34 años |
| `35_44` | Entre 35 y 44 años |
| `45_54` | Entre 45 y 54 años |
| `55_64` | Entre 55 y 64 años |
| `65_plus` | 65 años o más |

**Validación:** obligatorio.

### 4.2. Género (`gender`)

**Pregunta:** ¿Con qué género te identificas?

**Tipo de input:** radio (selección única)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `male` | Hombre |
| `female` | Mujer |
| `prefer_not_to_say` | Prefiero no decirlo |

**Validación:** obligatorio.

### 4.3. Nivel educativo (`education_level`)

**Pregunta:** ¿Cuál es el nivel de estudios más alto que has completado?

**Tipo de input:** dropdown (selección única)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `no_formal_education` | Sin estudios reglados |
| `primary` | Estudios primarios (EGB, primaria) |
| `secondary` | Estudios secundarios (ESO, bachillerato, FP grado medio) |
| `higher_secondary` | Bachillerato superior o FP grado superior |
| `university` | Estudios universitarios (grado, licenciatura, diplomatura) |
| `postgraduate` | Posgrado (máster, doctorado) |

**Validación:** obligatorio.

### 4.4. Situación laboral (`employment_status`)

**Pregunta:** ¿Cuál es tu situación laboral actual?

**Texto de ayuda:** Si tienes varias situaciones a la vez (por ejemplo, estudias y trabajas a tiempo parcial), elige la que mejor describa tu actividad principal.

**Tipo de input:** dropdown (selección única)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `employed_full_time` | Asalariado/a a tiempo completo |
| `employed_part_time` | Asalariado/a a tiempo parcial |
| `self_employed` | Autónomo/a o empresario/a |
| `student` | Estudiante |
| `unemployed` | Desempleado/a |
| `retired` | Jubilado/a o pensionista |
| `homemaker` | Dedicado/a a labores del hogar |
| `unable_to_work` | Incapacitado/a para trabajar |
| `other` | Otra situación |

**Validación:** obligatorio.

**Fuente:** lista compatible con el esquema oficial de la Encuesta de Población Activa del INE (INE, 2021, p. 19) y con la pregunta QD10 del OECD/INFE Toolkit (OECD, 2022, p. 35).

### 4.5. Composición del hogar (`household_composition`)

**Pregunta:** ¿Cómo describirías la composición de tu hogar?

**Tipo de input:** radio (selección única)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `living_alone` | Vivo sola/o |
| `couple_no_children` | En pareja, sin hijos |
| `couple_with_children` | En pareja, con hijos a cargo |
| `single_parent` | Familia monoparental con hijos a cargo |
| `shared_housing` | Compartiendo piso (compañeros, no familia) |
| `with_parents_or_family` | Con padres u otros familiares |

**Validación:** obligatorio.

### 4.6. Experiencia previa con apps financieras (`prior_financial_app_use`)

**Pregunta:** ¿Has usado antes alguna aplicación para llevar tus finanzas personales (presupuesto, ahorro, inversión, etc.)?

**Tipo de input:** radio (selección única, booleano)

**Opciones:**

| Valor | Etiqueta visible |
|-------|------------------|
| `true` | Sí |
| `false` | No |

**Validación:** obligatorio.

**Botón al pie de la pantalla:** "Continuar al cuestionario financiero"

## 5. Pretest: Big Five (alfabetización financiera)

**Título:** Cinco preguntas breves sobre conceptos financieros

**Texto introductorio:**

> A continuación te haremos cinco preguntas sobre conceptos financieros generales. No es un examen y los resultados son anónimos. Si alguna respuesta no la sabes, marca la opción "No lo sé" o "No sabe" (donde aparezca); es preferible eso a contestar al azar.

Las preguntas se presentan una a una, sin permitir volver atrás una vez confirmada cada respuesta. El orden es el indicado.

### 5.1. Sub-bloque — Tres preguntas validadas en España (Big Three)

Las tres preguntas siguientes están reproducidas literalmente del cuestionario de la Encuesta de Competencias Financieras 2021 del Banco de España (Hospido et al., 2023, p. 9), que adapta al caso español el cuestionario OCDE/INFE y replica las tres preguntas clásicas de Lusardi y Mitchell (2014). La reproducción se realiza con fines docentes conforme al pie de Depósito legal M-16426-2018 del informe original.

Las dos preguntas de aritmética simple (división de 200 € e interés simple a 102 €) se incluyen porque dan contexto a las preguntas finales y permiten distinguir errores de aritmética básica de errores conceptuales de inflación o de interés compuesto, tal como recomienda el propio ECF.

#### Pregunta previa P0 — División simple (no puntúa)

**Enunciado literal:**

> Imagine que cinco hermanos reciben un regalo de 1.000 € en total. Si comparten el dinero a partes iguales, ¿cuánto obtendrá cada uno?

**Tipo de input:** numérico (entero, en euros)

**Respuesta correcta:** 200

**Marcador interno:** `arithmetic_division_correct` (boolean derivado al guardar; no se reporta al participante).

#### Pregunta 1 — Inflación (`big_three_q1`)

**Enunciado literal:**

> Imagine ahora que los cinco hermanos tuvieran que esperar un año para obtener su parte de los 1.000 €, y que la inflación de ese año fuese del 1%. En el plazo de un año serán capaces de comprar:

**Tipo de input:** radio (selección única)

**Opciones:**

1. Más de lo que podrían comprar hoy con su parte del dinero.
2. La misma cantidad.
3. Menos de lo que podrían comprar hoy. *(correcta)*

#### Pregunta previa P0b — Interés simple (no puntúa)

**Enunciado literal:**

> Supongamos que ingresa 100 € en una cuenta de ahorro con un interés fijo del 2% anual. En esta cuenta no hay comisiones ni impuestos. Si no hace ningún otro ingreso a esta cuenta ni retira ningún dinero, ¿cuánto dinero habrá en la cuenta al final del primer año, una vez que le paguen los intereses?

**Tipo de input:** numérico (entero o decimal, en euros)

**Respuesta correcta:** 102

**Marcador interno:** `arithmetic_simple_interest_correct` (boolean derivado al guardar).

#### Pregunta 2 — Interés compuesto (`big_three_q2`)

**Enunciado literal:**

> De nuevo, si no hace ningún ingreso ni retira ningún dinero, una vez abonado el pago de intereses, ¿cuánto dinero habrá en la cuenta después de cinco años?

**Tipo de input:** radio (selección única)

**Opciones:**

1. Más de 110 euros. *(correcta)*
2. Exactamente 110 euros.
3. Menos de 110 euros.
4. Es imposible decirlo con la información dada.

#### Pregunta 3 — Diversificación del riesgo (`big_three_q3`)

**Enunciado literal:**

> Por lo general, es posible reducir el riesgo de invertir en bolsa mediante la compra de una amplia variedad de acciones.

**Tipo de input:** radio (selección única)

**Opciones:**

1. Verdadero. *(correcta)*
2. Falso.
3. No lo sé.

**Fuente literal:** Hospido, L., Machelett, M., Pidkuyko, M., & Villanueva, E. (2023). *Encuesta de Competencias Financieras (ECF) 2021: Principales resultados y cambios desde 2016*, p. 9. Banco de España. Reproducción autorizada para fines docentes.

**Benchmark español 2021 (Hospido et al., 2023, pp. 14-17):** 65% acierta inflación, 41% interés compuesto y 52% diversificación. El índice promedio para la población española de 18 a 79 años es del 53%.

### 5.2. Sub-bloque — Dos preguntas adicionales (versión americana, traducidas)

Las dos preguntas siguientes completan el Big Five clásico de Lusardi y Mitchell sobre alfabetización financiera. No están validadas psicométricamente en español de España (el ECF del Banco de España no las incluye) y se traducen aquí desde la versión original en inglés publicada por el Global Financial Literacy Excellence Center (GFLEC, s.f.), siguiendo un procedimiento de traducción directa con criterio semántico al español de España. La inclusión de estas dos preguntas responde al interés del estudio por discriminar el nivel intermedio o avanzado de alfabetización financiera, más allá del umbral básico que cubre el Big Three.

Esta limitación se documenta explícitamente en la sección 13 del presente dossier y se trasladará al apartado de limitaciones del capítulo 6 de la memoria.

#### Pregunta 4 — Relación tipo de interés y precio de los bonos (`big_five_q4`)

**Enunciado:**

> Si los tipos de interés suben, ¿qué ocurre normalmente con el precio de los bonos?

**Tipo de input:** radio (selección única)

**Opciones:**

1. Sube.
2. Baja. *(correcta)*
3. Se mantiene igual.
4. No hay relación entre el precio de los bonos y los tipos de interés.
5. No lo sé.

#### Pregunta 5 — Coste total de hipoteca a 15 vs 30 años (`big_five_q5`)

**Enunciado:**

> Una hipoteca a 15 años suele exigir cuotas mensuales más altas que una hipoteca a 30 años, pero los intereses totales pagados a lo largo de la vida del préstamo serán menores.

**Tipo de input:** radio (selección única)

**Opciones:**

1. Verdadero. *(correcta)*
2. Falso.
3. No lo sé.

**Fuente:** Lusardi, A., & Mitchell, O. S. (2011). Financial literacy and planning: Implications for retirement wellbeing. NBER Working Paper 17078; redacción literal en inglés disponible en GFLEC (s.f.).

**Transición a la fase de uso de la app:**

> Has terminado el cuestionario inicial. A continuación vas a probar la herramienta. Tómate tu tiempo para explorarla. Cuando hayas terminado, pulsa el botón "He terminado" para pasar a la valoración final.

## 6. Pantallas durante el uso de la app

La interfaz del uso libre de la herramienta queda fuera del alcance de este dossier: se diseña en Fase 4 por el agente `frontend` siguiendo el flujo ya existente (perfil, calculadora directa o inversa, resultados, diagnóstico). El único requisito de copy para este bloque es el mensaje guía que enmarca la transición:

> Ahora vas a probar la herramienta. Tómate tu tiempo. Cuando termines, pulsa "He terminado".

El botón "He terminado" debe estar visible de forma persistente durante el uso de la app (por ejemplo, en una barra superior fija) pero se mantiene **deshabilitado hasta que el participante haya completado al menos un cálculo en cada uno de los tres flujos disponibles** (directo, inverso y diagnóstico). Este requisito refuerza el carácter guiado de la prueba, evita que el participante envíe el posttest tras explorar un único flujo (lo que distorsionaría tanto el tiempo total como la cobertura del análisis de `flow_type` previsto para el capítulo 6) y garantiza datos completos en `app_interactions` para la comparación entre flujos.

La interfaz debe indicar visualmente el estado de progreso de cada flujo (por ejemplo, una lista con etiquetas de estado: "Directo: completado / Inverso: pendiente / Diagnóstico: pendiente"), de forma que el participante sepa en todo momento qué le falta por probar antes de poder finalizar. El criterio de "completado" se cumple cuando el cliente registra al menos una fila en `app_interactions` con el `flow_type` correspondiente y la respuesta del cálculo se ha mostrado al participante.

## 7. Posttest: SUS (System Usability Scale)

**Título:** ¿Cómo ha sido la experiencia?

**Texto introductorio:**

> Por favor, valora las siguientes afirmaciones sobre la herramienta que acabas de usar. No hay respuestas correctas o incorrectas: lo que nos interesa es tu impresión sincera. Responde rápido, con la primera reacción que tengas.

Los 10 ítems se presentan en una única pantalla. Cada ítem usa una escala Likert de 5 puntos con anclas verbales:

| Valor | Etiqueta |
|-------|----------|
| 1 | Totalmente en desacuerdo |
| 2 | En desacuerdo |
| 3 | Ni de acuerdo ni en desacuerdo |
| 4 | De acuerdo |
| 5 | Totalmente de acuerdo |

Todos los ítems son obligatorios. El orden es fijo y los ítems impares son afirmaciones positivas, los pares son negativas, conforme al diseño original del SUS.

### 7.1. Ítems literales

| # | Polaridad | Enunciado |
|---|-----------|-----------|
| 1 | + | Creo que me gustaría utilizar este sistema con frecuencia. |
| 2 | − | Encontré el sistema innecesariamente complejo. |
| 3 | + | Pensé que el sistema era fácil de usar. |
| 4 | − | Creo que necesitaría el apoyo de un técnico para poder utilizar este sistema. |
| 5 | + | Encontré que las diversas funciones del sistema estaban bien integradas. |
| 6 | − | Pensé que había demasiada inconsistencia en este sistema. |
| 7 | + | Me imagino que la mayoría de la gente aprendería a utilizar este sistema muy rápidamente. |
| 8 | − | Encontré el sistema muy incómodo de usar. |
| 9 | + | Me sentí muy seguro al utilizar el sistema. |
| 10 | − | Necesitaba aprender muchas cosas antes de poder empezar con este sistema. |

**Nota sobre el ítem 8:** se selecciona la formulación "muy incómodo de usar" por su mayor cercanía semántica al original inglés *"cumbersome to use"* (Brooke, 1996), preferida sobre la variante alternativa "muy complicado" presente en otras versiones consensuadas de la industria UX.

### 7.2. Fórmula de cálculo del score SUS (0-100)

Para cada respuesta del participante en la escala 1 a 5:

- En los ítems impares (1, 3, 5, 7, 9), positivos: la contribución es `valor − 1`.
- En los ítems pares (2, 4, 6, 8, 10), negativos: la contribución es `5 − valor`.

El score final se calcula como:

```
SUS = (Σ contribuciones de los 10 ítems) × 2.5
```

El rango resultante es 0 a 100. Umbrales interpretativos de referencia (Bangor et al., 2008; recopilados en Sevilla-Gonzalez et al., 2020): SUS ≥ 68 se considera usabilidad aceptable; SUS ≥ 85 se considera excelente.

### 7.3. Fuentes y limitaciones

**Fuente del instrumento original:** Brooke, J. (1996). *SUS: A "quick and dirty" usability scale*. En P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability Evaluation in Industry* (pp. 189-194). Taylor & Francis.

**Respaldo de la validación psicométrica en español de España:** Castilla, D., Jaen, I., Suso-Ribera, C., Garcia-Soriano, G., Zaragoza, I., Breton-Lopez, J., Mira, A., Diaz-Garcia, A., & Garcia-Palacios, A. (2024). Psychometric properties of the Spanish full and short forms of the System Usability Scale (SUS): Detecting the effect of negatively worded items. *International Journal of Human–Computer Interaction, 40*(15), 4145-4151. N = 1.321, α = .76 (forma completa, CFA controlando ítems negativos).

**Traducción literal aplicada:** versión consensuada en la industria UX española, coincidente palabra por palabra entre tres fuentes independientes (TeaCup Lab, s.f.; uiFromMars, s.f.; UXables, s.f.).

**Limitación documentada:** el texto literal exacto de los 10 ítems en la versión psicométricamente validada por Castilla et al. (2024) no fue accesible públicamente durante la elaboración del estudio (los apéndices del paper en IJHCI requieren acceso restringido). Se opta por la traducción consensuada de la industria UX española como aproximación válida, citando Castilla et al. (2024) como respaldo de la existencia de una validación psicométrica del SUS en español de España. La limitación se traslada a la sección 13 y a la memoria del TFG.

## 8. Posttest: bloque ad-hoc (4 ítems Likert)

**Título:** Sobre las recomendaciones que has recibido

**Texto introductorio:**

> Estas últimas cuatro afirmaciones se refieren específicamente a las recomendaciones de distribución del presupuesto que la herramienta te ha mostrado. Sigue el mismo criterio que en las preguntas anteriores: lo que nos interesa es tu impresión sincera.

Los cuatro ítems se presentan en una única pantalla, con la misma escala Likert de 5 puntos de la sección 7. Todos los ítems están formulados en positivo (sin inversiones) y son obligatorios.

| # | Dimensión | Enunciado |
|---|-----------|-----------|
| 1 | Comprensión | He entendido cómo la herramienta ha calculado las recomendaciones. |
| 2 | Confianza | Confío en los importes que la herramienta me ha sugerido. |
| 3 | Utilidad percibida | Las recomendaciones que he recibido son útiles para mi situación personal. |
| 4 | Intención conductual | Aplicaría estas recomendaciones a mi presupuesto real. |

**Escala (idéntica a la del SUS):**

| Valor | Etiqueta |
|-------|----------|
| 1 | Totalmente en desacuerdo |
| 2 | En desacuerdo |
| 3 | Ni de acuerdo ni en desacuerdo |
| 4 | De acuerdo |
| 5 | Totalmente de acuerdo |

**Fundamento:** el bloque ad-hoc se diseña específicamente para la herramienta y no se reclama validación psicométrica. Cada ítem mide una dimensión distinta del modelo de aceptación tecnológica (comprensión de la lógica subyacente, confianza en la recomendación, utilidad percibida e intención conductual) adaptada al dominio de la planificación financiera personal. Se reporta como evidencia descriptiva complementaria al SUS y al pretest.

## 9. Posttest: cualitativo (2 preguntas opcionales)

**Título:** ¿Algún comentario antes de terminar?

**Texto introductorio:**

> Estas dos preguntas son opcionales. Si no quieres responder, puedes saltarlas pulsando "Continuar" sin escribir nada. Cualquier comentario nos resulta útil para mejorar la herramienta.

| # | Pregunta | Tipo de input |
|---|----------|---------------|
| 1 | ¿Qué te ha resultado más útil de la herramienta? | textarea (texto libre, máx. 500 caracteres, opcional) |
| 2 | ¿Qué cambiarías o qué te ha resultado confuso? | textarea (texto libre, máx. 500 caracteres, opcional) |

**Botón al pie de la pantalla:** "Continuar"

## 10. Pantalla de cierre y agradecimiento

**Título:** Gracias por participar

**Cuerpo:**

> Tus respuestas se han registrado correctamente y de forma anónima. Tu participación contribuye directamente a la evaluación de un Trabajo de Fin de Grado de Ingeniería Multimedia en la Universitat de València.
>
> Si te ha interesado la herramienta, puedes seguir explorándola desde la página principal. No hace falta que vuelvas a rellenar el cuestionario.

**Botón principal:** "Volver al inicio"

## 11. Mensajes auxiliares de UI

Los mensajes que siguen cubren los estados excepcionales del funnel. Todos se redactan en tuteo, breves y sin tecnicismos.

### 11.1. Timeout de sesión (60 minutos)

Se muestra cuando se alcanza el timeout duro de sesión sin haber completado el funnel.

> **Tu sesión ha caducado**
>
> Han pasado 60 minutos desde que empezaste y la sesión se ha cerrado automáticamente. Si quieres volver a participar, recarga la página y empieza de nuevo.
>
> [Botón] "Recargar y empezar de nuevo"

### 11.2. Error de conexión (al guardar respuestas)

Se muestra cuando una operación de guardado contra Supabase falla por motivos de red. El recorder ya implementa un reintento automático a los 2 segundos; este mensaje aparece solo si el reintento también falla.

> No hemos podido guardar tu respuesta por un problema de conexión. Comprueba que tienes internet y vuelve a intentarlo en unos segundos.
>
> [Botón] "Reintentar"

### 11.3. Error genérico (errores no previstos)

Se muestra ante errores no clasificados (códigos `UNKNOWN` del recorder).

> Algo no ha funcionado como esperábamos. Si el problema se repite, cierra la pestaña y vuelve a abrir el enlace.
>
> [Botón] "Reintentar"

### 11.4. Confirmación al cerrar pestaña durante el uso de la app

Listener `beforeunload` activo entre la pantalla de uso de la app y el envío del posttest.

> Si cierras la pestaña ahora, perderás los datos y tendrás que empezar de nuevo.

### 11.5. Confirmación al pulsar "He terminado" en la fase de uso de la app

Modal de confirmación antes de pasar al posttest, dado que no se permite volver atrás. El botón "He terminado" solo se habilita cuando el participante ha completado al menos un cálculo en cada uno de los tres flujos (directo, inverso, diagnóstico), conforme a lo descrito en la sección 6; hasta entonces el botón aparece deshabilitado con un tooltip que indica qué flujos quedan pendientes (por ejemplo: "Te falta probar: Inverso, Diagnóstico").

Una vez habilitado y pulsado, se muestra este modal de confirmación:

> **¿Listo para terminar la prueba?**
>
> Has probado los tres flujos. A partir de aquí pasarás a la valoración final y no podrás volver a usar la herramienta en esta sesión.
>
> [Botón secundario] "Seguir probando"
> [Botón principal] "Sí, ir a la valoración"

### 11.6. Indicador de progreso

Barra de progreso visible durante todo el funnel con etiquetas escuetas: "Bienvenida", "Tú", "Conceptos financieros", "Herramienta", "Valoración", "Final". El progreso se actualiza al completar cada pantalla.

## 12. Tabla resumen instrumento → fuente → cita

| Bloque | Instrumento | Fuente | Cita APA 7 | Nº ítems | Validación |
|--------|-------------|--------|------------|----------|------------|
| 4 | Demografía (`age_range`, `gender`, `education_level`, `household_composition`, `prior_financial_app_use`) | Diseño propio | — | 5 | No requiere |
| 4.4 | `employment_status` (9 valores) | Esquema EPA + OECD/INFE | INE (2021); OECD (2022) | 1 | Compatible con clasificación oficial OIT |
| 5.1 | Big Three (inflación, interés compuesto, diversificación) | ECF Banco de España 2021 | Hospido et al. (2023, p. 9) | 3 (+2 aritméticas previas) | Validada en muestra representativa española N=7.764 |
| 5.2 | Big Five preguntas 4-5 (bonos, hipoteca) | Versión americana original | Lusardi & Mitchell (2011); GFLEC (s.f.) | 2 | No validada en español de España (limitación documentada) |
| 7 | SUS (System Usability Scale) | Brooke (1996); traducción consensuada UX española | Brooke (1996); Castilla et al. (2024) como respaldo psicométrico; TeaCup Lab (s.f.), uiFromMars (s.f.), UXables (s.f.) como fuente literal de la traducción | 10 | Validación psicométrica española N=1.321, α=.76 (Castilla et al., 2024); texto literal del paper no accesible (limitación documentada) |
| 8 | Bloque ad-hoc Likert | Diseño propio | — | 4 | No reclama validación psicométrica; reportado como evidencia descriptiva |
| 9 | Cualitativo abierto | Diseño propio | — | 2 (opcionales) | No requiere |

**Referencias completas (APA 7):**

- Bangor, A., Kortum, P. T., & Miller, J. T. (2008). An empirical evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction, 24*(6), 574-594. https://doi.org/10.1080/10447310802205776
- Brooke, J. (1996). SUS: A "quick and dirty" usability scale. En P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability Evaluation in Industry* (pp. 189-194). Taylor & Francis.
- Castilla, D., Jaen, I., Suso-Ribera, C., Garcia-Soriano, G., Zaragoza, I., Breton-Lopez, J., Mira, A., Diaz-Garcia, A., & Garcia-Palacios, A. (2024). Psychometric properties of the Spanish full and short forms of the System Usability Scale (SUS): Detecting the effect of negatively worded items. *International Journal of Human–Computer Interaction, 40*(15), 4145-4151. https://doi.org/10.1080/10447318.2023.2209840
- Emery, T., Cabaco, S., Fadel, L., Lugtig, P., Toepoel, V., Schumann, A., Lück, D., & Bujard, M. (2023). Breakoffs in an hour-long, online survey. *Survey Practice, 16*(1). https://doi.org/10.29115/SP-2023-0008
- Galesic, M., & Bosnjak, M. (2009). Effects of questionnaire length on participation and indicators of response quality in a web survey. *Public Opinion Quarterly, 73*(2), 349-360. https://doi.org/10.1093/poq/nfp031
- Global Financial Literacy Excellence Center (GFLEC). (s.f.). *The Big Three and Big Five Questions*. Recuperado de https://gflec.org/education/questions-that-indicate-financial-literacy/
- Hospido, L., Machelett, M., Pidkuyko, M., & Villanueva, E. (2023). *Encuesta de Competencias Financieras (ECF) 2021: Principales resultados y cambios desde 2016*. Banco de España. https://doi.org/10.53479/34752
- Instituto Nacional de Estadística (INE). (2021). *Encuesta de Población Activa. Metodología 2021. Descripción general de la encuesta*. INE.
- Lusardi, A., & Mitchell, O. S. (2011). *Financial literacy and planning: Implications for retirement wellbeing* (NBER Working Paper No. 17078). National Bureau of Economic Research. https://doi.org/10.3386/w17078
- Lusardi, A., & Mitchell, O. S. (2014). The economic importance of financial literacy: Theory and evidence. *Journal of Economic Literature, 52*(1), 5-44. https://doi.org/10.1257/jel.52.1.5
- OECD. (2022). *OECD/INFE Toolkit for Measuring Financial Literacy and Financial Inclusion 2022*. OECD Publishing.
- Sevilla-Gonzalez, M. D. R., Moreno Loaeza, L., Lazaro-Carrera, L. S., Bourguet Ramírez, B., Vázquez Rodríguez, A., Peralta-Pedrero, M. L., & Almeda-Valdes, P. (2020). Spanish version of the System Usability Scale for the assessment of electronic tools: Development and validation. *JMIR Human Factors, 7*(4), e21161. https://doi.org/10.2196/21161
- TeaCup Lab. (s.f.). *Qué es la escala SUS y cómo usarla para medir la usabilidad*. Recuperado de https://www.teacuplab.com/es/blog/que-es-la-escala-sus-y-como-usarla-para-medir-la-usabilidad/
- uiFromMars. (s.f.). *Cómo medir la usabilidad con un SUS*. Recuperado de https://uifrommars.com/como-medir-usabilidad-que-es-sus/
- UXables. (s.f.). *Medir con el sistema de escala de usabilidad (SUS)*. Recuperado de https://www.uxables.com/investigacion-ux/medir-con-el-sistema-de-escala-de-usabilidad-sus/

## 13. Limitaciones documentadas

Esta sección recoge las limitaciones académicas conocidas del diseño del cuestionario y del estudio, con la mitigación aplicada en cada caso. Todas se trasladarán al apartado correspondiente del capítulo 6 de la memoria del TFG.

**13.1. Texto literal del SUS validado en español de España no accesible.** El paper de Castilla et al. (2024), que valida psicométricamente el SUS en español de España con N=1.321, no fue accesible públicamente en su versión completa durante la fase de diseño del cuestionario. *Mitigación:* se usa la traducción consensuada en la industria UX española, coincidente palabra por palabra entre TeaCup Lab, uiFromMars y UXables, y se cita Castilla et al. (2024) como respaldo de la existencia de una validación psicométrica española. Cabe considerar que la traducción aplicada y la del paper podrían no coincidir exactamente; el respaldo psicométrico se aporta sobre el instrumento, no sobre la formulación literal exacta.

**13.2. Big Five preguntas 4 y 5 sin validación psicométrica en español de España.** Las preguntas sobre bonos e hipotecas se traducen desde la versión americana original (Lusardi & Mitchell, 2011; GFLEC, s.f.) y no existe, hasta donde alcanza la búsqueda bibliográfica realizada, una validación con muestra representativa española. *Mitigación:* las dos preguntas se reportan como análisis exploratorio adicional, no como medida validada. Las tres preguntas del Big Three (Hospido et al., 2023) se mantienen como núcleo del pretest.

**13.3. Tamaño muestral pequeño (N = 30-60) y estudio exploratorio descriptivo.** Con N ≈ 30-60 segmentado por nivel del Big Five y rango de edad, las celdas demográficas tendrían pocos casos, lo que impide aplicar tests inferenciales (chi-cuadrado, ANOVA) con potencia adecuada. *Mitigación:* el estudio se enmarca desde el principio como exploratorio descriptivo (ADR-02 del proyecto), con un cálculo de potencia previo en la memoria que justifica explícitamente la renuncia a la inferencia confirmatoria.

**13.4. Sesgo de muestra por canal de reclutamiento.** La distribución asíncrona por WhatsApp, correo electrónico y LinkedIn implica un sesgo hacia la red social del autor (perfil universitario, edad 25-40, residencia en España). *Mitigación:* la variable `referrer`/`utm_source` se registra para describir el canal de procedencia de cada participante; la limitación se declara explícitamente en la memoria.

**13.5. Funnel single-session: pérdida si el participante cierra la pestaña.** El diseño exige completar el funnel en una única sesión continua. Si el participante cierra la pestaña antes de terminar, los datos parciales se conservan pero la sesión no se considera completa. *Mitigación:* se declara la duración estimada al inicio (sección 2) siguiendo Galesic y Bosnjak (2009); se incluyen confirmaciones al cerrar pestaña (sección 11.4); se monitoriza el drop-off por fase en el análisis del capítulo 6.

**13.6. Identificador técnico persistente en `auth.users`.** El uso de Anonymous Sign-Ins de Supabase (ADR-02) crea un identificador anónimo persistente en el navegador del participante, ligado al JWT en `localStorage`. *Mitigación:* se trata como seudonimización conforme al considerando 26 del RGPD, sin recogida de PII (nombre, correo electrónico, dirección IP); la información se comunica al participante en la pantalla de consentimiento (sección 3) y se documenta en el apartado 4.6 de la memoria.

**13.7. Duración declarada al participante más conservadora que la real.** Se comunica "unos 10 minutos" cuando la duración real estimada es de 15 a 20 minutos. *Mitigación:* la decisión se ampara en la evidencia experimental de Galesic y Bosnjak (2009), que muestra que duraciones declaradas más altas reducen tanto la tasa de inicio como la de completion. La declaración no es engañosa por defecto: el participante puede cerrar la pestaña en cualquier momento sin coste; el efecto buscado es maximizar la tasa de inicio. No obstante, se reconoce como decisión metodológica controvertida y se declara explícitamente en la memoria.

**13.8. Bloque ad-hoc sin validación psicométrica.** Los cuatro ítems de la sección 8 se diseñan específicamente para la herramienta y no se ha realizado un proceso de validación de constructo. *Mitigación:* se reportan como evidencia descriptiva complementaria al SUS y al pretest, sin reclamar validez psicométrica.
