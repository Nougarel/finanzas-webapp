---
title: "M18 Fase 4.5 — Investigación contextual ETSE-UV / España"
date: 2026-05-25
type: research
phase: m18-fase4.5
related: [m18-fase4.5-investigacion-metodologica, m18-cuestionario-md1]
---

> [!warning] Nota de scope (añadida 2026-05-25 tras consulta de la guía oficial ETSE-UV)
> El framing original de este informe era erróneo: presuponía que el TFG es un **trabajo de investigación** y por tanto le aplica la revisión ética del CEIH-UV, marcos ISO 9241-11, validación psicométrica formal, etc. Tras consultar la presentación oficial del TFG ETSE-UV, queda claro que nuestro TFG es **de desarrollo de software de naturaleza profesional**. Las pruebas con usuarios son **pruebas de aceptación** del cap. 6.1, no un estudio empírico. No aplica CEIH-UV (su propia FAQ confirma que no requieren evaluación los TFG no vinculados a programas de doctorado ni encuestas sin información psicológica/sanitaria); basta con respetar el RGPD (consentimiento informado y anonimización), ya cubierto por el diseño.
>
> **Estado de este informe:** se conserva como **material de referencia bibliográfica opcional** para el cap. 3 (Estado del Arte) si el usuario quiere sustentar la elección de SUS o citar el contexto institucional español de HCI (AIPO, GRIHO, etc.). **NO es base obligatoria del cap. 6.** Lo único directamente útil que sobrevive a la corrección de framing son las validaciones psicométricas españolas de los instrumentos que efectivamente usamos (SUS Castilla 2023) — el resto es contexto enriquecedor pero no necesario. Ver `KnowledgeBase/01-proyectos/personales/finanzas-webapp/fundamentos/tfg/framing-tfg.md` para el framing actualizado.

# Investigación contextual — Aplicabilidad ETSE-UV / España

## Resumen ejecutivo

Esta investigación cubre 8 frentes para anclar el Study B presencial del TFG en el contexto institucional español. La evidencia disponible es heterogénea: **muy fuerte en marco ético-legal y validaciones psicométricas** (SUS, NASA-TLX, UEQ tienen versiones españolas peer-reviewed), **suficiente en grupos HCI españoles y comunidad AIPO** (revista propia con peer-review doble ciego ISSN 2695-6578, 25 ediciones del congreso Interacción), y **débil en TFGs concretos de la ETSE-UV con metodología de testing de usabilidad** — RODERIC permite búsqueda libre pero no devuelve un listado fácilmente filtrable por metodología, y solo se han podido identificar 2 tesis doctorales UV explícitamente sobre usabilidad (Broz Lofiego 2017, Díaz Suárez 2020), ninguna sobre app financiera.

**Hallazgo crítico para el TFG**: el FAQ del Comité de Ética en Investigación en Humanos de la UV (CEIH-UV) declara explícitamente que **NO requieren evaluación los TFG/tesis "no vinculados a títulos y programas de doctorado de la Universitat de València"**, y excluye también las encuestas de opinión sin información psicológica/sanitaria. Esto significa que un Study B con N=5 estudiantes, sin captura de datos de salud, **probablemente no requiere dictamen formal del CEIH**, pero sí debe respetar el RGPD/LOPDGDD 3/2018 con consentimiento informado, anonimización y conservación reglada. La interpretación literal del FAQ deja zona gris para TFG con interacción humana cualitativa; lo prudente es consultar al tutor antes de iniciar el trabajo de campo, y en todo caso utilizar el modelo de consentimiento genérico del CEIH-UV (`consentimiento_generico.doc`) como plantilla.

**Hallazgo crítico para validación**: existen al menos **dos validaciones españolas peer-reviewed del SUS** (Castilla et al. 2023 con N=1321 y Sevilla-Gonzalez et al. 2020 con N=88) y una validación psicométrica española del NASA-TLX (Díaz-Ramiro et al. 2010, N=398). La versión española del UEQ existe desde Rauschenberger et al. 2013. AttrakDiff carece de validación española peer-reviewed publicada — solo traducciones informales. Esto define qué instrumentos puede defender el TFG con mayor rigor académico.

**Hallazgo crítico de comunidad académica**: la conferencia AIPO Interacción y la Revista Interacción (ISSN 2695-6578) son los foros de referencia en castellano. El libro fundacional "La interacción persona-ordenador" (Lorés et al. 2002, AIPO) sigue siendo cita estándar para TFGs españoles. GRIHO (Lleida, Granollers), MadHCILab (UPM) e ISSI (UPV) son los grupos consolidados nacionales. Esto da bibliografía sólida para el capítulo de Metodología.

**Lagunas**: (i) no se han encontrado TFGs/TFMs concretos de Ingeniería Multimedia de la ETSE-UV en RODERIC con la metodología que propone el Study B — RODERIC tiene 136 resultados al filtrar "usabilidad" pero su buscador no permite acotar fácilmente por titulación; (ii) no existe tesis española conocida sobre app de planificación financiera personal con evaluación UX; (iii) varios PDF institucionales clave (instrucciones TFG ETSE-UV, ECF 2021, guía CRUE DPDs) son ilegibles vía WebFetch por estar comprimidos — se conocen vía búsquedas, no se ha podido extraer texto literal.

---

## 1. Guías oficiales UV / ETSE-UV para TFG

La **normativa marco** vigente es el **Reglamento de TFG y TFM de la Universitat de València, ACGUV 206/2024 de 2 de julio**, aprobado conforme al Real Decreto 822/2021 (UV, 2024) [N2 ✓ FULL TEXT]. La página oficial de la UV indica que el TFG debe materializarse en un *"written report"* y admite modalidades: *"academic works of bibliographic review and research, experimental or theoretical works, professional application works"* (Universitat de València, 2024) [N2 ✓ FULL TEXT]. La defensa es pública ante tribunal de tres doctores y se levanta acta con fecha y nota. Cada comisión académica puede establecer *"basic rules of style, length and structure of the TFG"* — es decir, la ETSE-UV tiene autonomía para fijar criterios propios.

La **ETSE-UV** publica instrucciones específicas en PDF (`https://www.uv.es/graus/TFG/ETSE/Instrucciones.pdf`) y guías docentes individuales por titulación (módulo 35303 para GII curso 2024-25; módulo 34844 para GIM curso 2020-21) (Universitat de València, 2024) [N2 ~ FULL TEXT — los PDF binarios no se han podido extraer vía WebFetch; se confirma su existencia pero no se ha podido citar contenido literal]. La página de información para estudiantes confirma que: *"Information is only available in Spanish and Valencian"* y describe el protocolo para TFG con confidencialidad: *"Students must submit password-protected PDF files... Committee members must sign confidentiality commitments before accessing materials"* (Universitat de València, 2024) [N2 ✓ FULL TEXT]. La ETSE-UV ofrece TFG en GII, GIM (Multimedia), GCD (Ciencia de Datos), GIT, GIET, GIEI y GIQ.

**Aplicabilidad al TFG**: el reglamento UV permite explícitamente la modalidad de "trabajos experimentales" — el Study B encaja. La ETSE-UV no publica rúbrica detallada accesible vía web abierta; **el TFGista debe pedir al tutor la rúbrica concreta** que aplicará el tribunal. Las propuestas temáticas por titulación están enlazadas desde la página de "Temáticas TFG" pero no se especifica si incluyen HCI/usabilidad.

---

## 2. TFGs/TFMs previos relevantes en RODERIC

RODERIC es el repositorio institucional UV en DSpace 7.6, gestionado por el Servei de Biblioteques (Universitat de València, 2025) [N2 ✓ FULL TEXT]. Permite búsqueda por título, palabra clave y autor. Una búsqueda por "usabilidad" devuelve **136 resultados totales**, lo que sugiere un cuerpo significativo de trabajos UV sobre el tema, aunque el filtrado por titulación no es trivial.

Referencias verificadas en RODERIC (lectura del bitstream de metadatos):

1. **Broz Lofiego, A. R. (2017)** — *Aceptación del pago móvil en España: análisis de la conveniencia y la usabilidad en el contexto de una batalla generacional*. Tesis doctoral, Departament de Comercialització i Investigació de Mercats, UV. URL: https://roderic.uv.es/items/530151c3-04ab-46b7-8317-f899d000e06f [N2 ✓ ABSTRACT — solo título y metadatos básicos accesibles vía WebFetch].

2. **Díaz Suárez, J. E. (2020)** — *EduBPMN: Un método Basado en Reglas de Transformación para Generar Interfaces Gráficas de Usuario a partir de Modelos de Procesos de Negocio (BPMN)*. Tesis doctoral, Departament d'Informàtica, UV. URL: https://roderic.uv.es/items/189eff82-22d0-4b16-9f70-3cf92b3ecc1e [N2 ✓ ABSTRACT].

3. **Recurso docente sobre proceso de TFG** — *La elección del tema y la elaboración del proyecto de TFG. Principios esenciales*. URL: http://roderic.uv.es/handle/10550/57599 [N2 ✓ ABSTRACT].

4. **Evaluación de innovación docente en GIT-UV** — *Evaluación de experiencias de innovación docente en el Grado de Ingeniería Telemática de la Universitat de València*. URL: https://roderic.uv.es/items/c1ccdee0-a4f0-406f-a25c-9c00d5fecfca [N2 ~ ABSTRACT — registro accesible pero sin metadatos completos].

Como referencia comparable de otra universidad valenciana, en la **UPM** se ha identificado **Ye, B. (2024)** — *Aplicación Web para la Gestión de finanzas personales*, Máster en Ingeniería Web, dir. Santiago Alonso Villaverde (UPM, 2024) [N2 ✓ FULL TEXT] — pero **sigue metodología RUP de software clásica, sin testing de usabilidad con usuarios**, lo que confirma el hueco de evaluación UX en este nicho. URL: https://oa.upm.es/83052/.

**Aplicabilidad al TFG**: las referencias UV de usabilidad existen pero son mayormente tesis doctorales, no TFGs de Ingeniería Multimedia con metodología de testing N pequeño. **No se ha encontrado precedente directo aplicable** en RODERIC; el TFG operará sin precedente exacto institucional, lo que aumenta la importancia de justificar la metodología con literatura externa sólida. Recomendación: el TFGista debería intentar búsqueda directa en RODERIC con términos como "test usuarios", "evaluación heurística", "experiencia de usuario", filtrando por departamento si la interfaz lo permite.

---

## 3. Grupos de investigación HCI en España

Tres grupos académicos consolidados destacan en el panorama español:

**GRIHO (Universitat de Lleida)** — Grupo de Recerca en Interacció Persona-Ordinador i Integració de Dades. Dirigido por **Toni Granollers**, profesor del Departament d'Informàtica i Enginyeria Industrial de la UdL (UdL, 2024) [N2 ✓ FULL TEXT]. Granollers es autor del **modelo MPIu+a (Modelo de Proceso de la Ingeniería de la usabilidad y de la accesibilidad)** y coautor del libro *"Diseño de sistemas interactivos centrados en el usuario"* (UOC). Granollers fue *"member and current director of the GRIHO HCI research group"* y *"involved in the first Spanish-speaking HCI Master"* (Universitat de Lleida, 2024) [N2 ✓ FULL TEXT]. GRIHO organizó Interacción 2023 en Lleida e Igualada.

**MadHCILab (UPM)** — Madrid HCI Lab, fundado en 1986 como Laboratorio Decoroso Crespo de la Escuela Técnica Superior de Ingenieros Informáticos UPM. Es *"a research, teaching, and development laboratory that specializes in Human-Computer Interaction and Advanced Interactive Systems"* (MadHCILab, 2024) [N2 ~ ABSTRACT — el sitio devolvió ECONNREFUSED en el WebFetch, datos extraídos de búsqueda]. Reconocido por UPM como **GIE-SINUA** (Grupo de Innovación en Sistemas Interactivos Usables y Accesibles).

**ISSI (UPV)** — Software Engineering and Information Systems Research Group del Departament de Sistemes Informàtics i Computació de la Universitat Politècnica de València. Mantienen sección de publicaciones en https://issi.dsic.upv.es/publications/ (UPV, 2024) [N5 ~ ABSTRACT — solo confirmación de existencia vía búsqueda].

**AIPO (Asociación Interacción Persona-Ordenador)** — Asociación científica española fundada el 19 de junio de 2000 en la Facultad de Psicología de la Universidad de Granada, con primera junta presidida por Jesús Lorés (AIPO, 2024) [N4 ✓ FULL TEXT]. Mantiene la conferencia anual **Interacción** (XXV edición en 2025 en Valladolid, organizada por ECA-SIMM de UVa, con auspicio del capítulo español ACM SIGCHI "CHISPA") y la **Revista Interacción** (ISSN 2695-6578, semestral, peer-review doble ciego, acceso abierto sin APC, en español, Vol. 7 Nº1 2026) (Revista AIPO, 2026) [N4 ✓ FULL TEXT]. El editorial confirma: *"sistema de revisión por pares, doble ciego, siguiendo las prácticas de las buenas revistas académicas"* (Revista AIPO, 2026) [N4 ✓ FULL TEXT].

**Aplicabilidad al TFG**: GRIHO/MPIu+a es la referencia obligada en castellano para el modelo de proceso de evaluación. El libro de Lorés et al. 2002 editado por AIPO es cita canónica. Para publicación derivada del TFG, la Revista Interacción es vía natural (peer-review, abierta, en español).

---

## 4. Adaptaciones culturales de instrumentos UX en España

**SUS — System Usability Scale**: existen dos validaciones españolas peer-reviewed independientes:

- **Castilla, D., Jaen, I., Suso-Ribera, C., Garcia-Soriano, G., Zaragoza, I., Breton-Lopez, J., Mira, A., Diaz-Garcia, A., & Garcia-Palacios, A. (2023)**. *Psychometric Properties of the Spanish Full and Short Forms of the System Usability Scale (SUS): Detecting the Effect of Negatively Worded Items*. International Journal of Human–Computer Interaction, Vol. 40, No. 15. DOI: 10.1080/10447318.2023.2209840 [N1 ✓ ABSTRACT — paper completo es paywall, datos de search results]. N=1321 participantes españoles. *"Confirmatory analyses showed that the SUS was a valid measure with a one-factor structure... CFI = .932, TLI = .898; RMSEA = .055... Cronbach's alpha = .76"*. La versión corta solo con ítems positivos también mostró ser válida (α = .77). **Es la validación más rigurosa por N y diseño**.

- **Sevilla-Gonzalez, M. R., Moreno Loaeza, L., Lazaro-Carrera, L. S., Bourguet Ramirez, B., Vázquez Rodríguez, A., Peralta-Pedrero, M. L., & Almeda-Valdes, P. (2020)**. *Spanish Version of the System Usability Scale for the Assessment of Electronic Tools: Development and Validation*. JMIR Human Factors, 7(4), e21161 [N1 ✓ FULL TEXT]. N=88 (validación sobre Zoom). Cronbach α=0.812 (95% CI 0.748-0.866); CVI=0.92; FVI=0.94. Conclusión textual: *"The new Spanish version of the SUS is a valid and reliable version of the original English version"*. URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7773510/. **Es validación clínica con muestra menor pero accesible en abierto**.

**NASA-TLX**: validación española peer-reviewed en **Díaz-Ramiro, E., Rubio-Valdehita, S., Martín-García, J., & Luceño-Moreno, L. (2010)**. *Estudio Psicométrico del Índice de Carga Mental NASA-TLX con una Muestra de Trabajadores Españoles*. Revista de Psicología del Trabajo y de las Organizaciones, Vol. 26, Nº 3. ISSN 1576-5962. N=398 trabajadores españoles de 7 sectores. Cronbach α=0.69, estructura bifactorial (59.15% varianza). Conclusión textual: *"La evaluación mediante el NASA-TLX no sólo proporciona información acerca del nivel global de carga, sino que permite detectar de manera válida y fiable, las fuentes de carga"* (Díaz-Ramiro et al., 2010) [N1 ✓ FULL TEXT]. URL: https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1576-59622010000300003. Adicionalmente, el **INSST (Instituto Nacional de Seguridad y Salud en el Trabajo)** publicó la **NTP 544 (2001)**: *"Estimación de la carga mental de trabajo: el método NASA-TLX"* como referencia técnica oficial (INSST, 2001) [N2 ✓ ABSTRACT — confirmada vía búsqueda].

**UEQ — User Experience Questionnaire**: la versión española fue desarrollada por **Rauschenberger, M., Schrepp, M., Cota, M. P., Olschner, S., & Thomaschewski, J. (2013)**. *Efficient measurement of the user experience of interactive products. How to use the User Experience Questionnaire (UEQ). Example: Spanish Language Version*. International Journal of Interactive Multimedia and Artificial Intelligence, 2(1), 39-45 [N1 ✓ ABSTRACT — el artículo en revista UNIR (IJIMAI) devolvió HTTP 403 al WebFetch, datos vía search]. Coeficientes Cronbach Alpha de 0.85 para Atractividad y 0.71 para Novedad. Disponible vía https://www.ueq-online.org/ en >30 idiomas.

**AttrakDiff**: **no existe validación española peer-reviewed conocida**. El instrumento oficial solo está disponible en alemán e inglés en www.attrakdiff.de. La traducción de Gaeta, E. (2012) circula entre investigadores pero no está publicada formalmente. Esto baja la confianza de su uso defendido académicamente en un TFG español [N5 ✗ — gap identificado].

**Aplicabilidad al TFG**: para el Study B, **SUS-ES (Castilla 2023) es la opción óptima** por N grande, validación reciente y consideración explícita del efecto de ítems negativos. NASA-TLX puede defenderse con Díaz-Ramiro 2010 + NTP 544. UEQ es defendible con Rauschenberger 2013. AttrakDiff debería evitarse o, si se usa, marcar limitación explícita.

---

## 5. Protocolos éticos universitarios españoles

**Marco normativo nacional**:
- **Reglamento (UE) 2016/679 (RGPD)** — base europea.
- **Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)**. Publicada en BOE-A-2018-16673 (BOE, 2018) [N1 ✓ ABSTRACT — vía búsqueda]. Modifica la Ley Orgánica 6/2001 de Universidades para incorporar garantías de derechos digitales.
- **CRUE (Conferencia de Rectores de Universidades Españolas)** publica guía específica *"Doc. 4 — Guía Proyectos Invest. DPDs"* dirigida a Delegados de Protección de Datos en proyectos de investigación universitaria (CRUE, 2024) [N2 ~ ABSTRACT — PDF binario ilegible vía WebFetch, existencia confirmada].

**Comité de Ética en Investigación en Humanos de la Universitat de València (CEIH-UV)**:

URL principal: https://www.uv.es/uvetica/ (alias) y https://www.uv.es/ethical-commission-experimental-research/

Tipos de estudio que **requieren** dictamen favorable (Comité de Ética UV, 2024) [N2 ✓ FULL TEXT]:
- *"Interventions on human beings"*
- *"Use of biological samples of human origin"*
- *"Use of personal data"*
- *"interacción con seres humanos o intervenciones sociales"*

Plazo crítico: *"Requests for a report to the CEIH must be submitted at least two months prior to the start of the research"* y *"The Committee... does not pronounce itself on studies that have already begun the intervention phase with participants at the time of submitting the request"* (CEIH-UV, 2024) [N2 ✓ FULL TEXT].

Estudios **excluidos** de evaluación CEIH-UV según el FAQ oficial:
- *"If an opinion survey is to be conducted on any topic or issue... as long as it does not include psychological or health information, authorization from the Ethics Committee is not required"* (CEIH-UV FAQ, 2024) [N2 ✓ FULL TEXT].
- *"Final projects or doctoral theses not linked to degrees and doctoral programs of the Universitat de València"* (CEIH-UV FAQ, 2024) [N2 ✓ FULL TEXT].

**Formularios oficiales CEIH-UV** disponibles para descarga (CEIH-UV, 2024) [N2 ✓ FULL TEXT]:
- Consentimiento genérico: https://www.uv.es/uvetica/docs/ceih/consentimiento_generico.doc
- Consentimiento muestras biológicas: https://www.uv.es/uvetica/docs/ceih/consentimiento_muestras.doc
- Consentimiento datos clínicos: https://www.uv.es/uvetica/docs/ceih/consentimiento_RD.doc
- Autorización imágenes: https://www.uv.es/uvetica/docs/ceih/autorizacion_imagenes.pdf
- Formulario EH-1 (solicitud de informe): https://www.uv.es/uvetica/docs/ceih/formulario_eh1.pdf

El **modelo genérico de consentimiento** del CEIH-UV está estructurado en tres bloques: (1) Información al participante (objetivos, metodología, riesgos, beneficios, derecho de retirada *"en cualquier momento"*, financiación), (2) Compromiso de confidencialidad citando LOPDGDD 3/2018 y procedimientos de anonimización, (3) Firmas — incluye versiones para adultos, menores y personas con apoyo. Garantiza al participante *"derecho a acceder a la información generada sobre usted en el estudio"* (CEIH-UV, modelo de consentimiento) [N2 ✓ FULL TEXT vía .doc]. Conservación: *"medidas para asegurar el respeto a la vida privada"*; los consentimientos firmados deben mantenerse separados del material de estudio cuando éste es anonimizado.

**Comparación con otras universidades españolas**: la UGR (UGR Secretaría General, 2023) [N2 ~ ABSTRACT — PDF ilegible vía WebFetch pero existencia y URL confirmadas], UCM (UCM DPD, 2024) [N2 ✓ ABSTRACT], UNIZAR (UNIZAR Protección de Datos, 2024) [N2 ✓ ABSTRACT] y USPCEU publican modelos análogos de consentimiento informado y guías RGPD para TFG/TFM/tesis. URLs:
- https://www.ucm.es/dpd/investigacion
- https://escuelaposgrado.ugr.es/pages/masteres_oficiales/tramites_admin_alumnos_master/docs_bioetica/modelo_hoja_informacio_y_consentimiento
- https://protecciondatos.unizar.es/sites/protecciondatos.unizar.es/files/users/documentos/consentimiento_papel_trabajos_academicos.doc

**Aplicabilidad al TFG ETSE-UV**: ver sección final "Trámites éticos a verificar".

---

## 6. Casos publicados de N pequeño en contexto español

**Justificación teórica del N=5** — referencia canónica: **Nielsen, J. (2000)**. *Why You Only Need to Test with 5 Users*. Nielsen Norman Group. Demostración matemática basada en distribución logarítmica: con 5 usuarios se detecta ≈85% de problemas de usabilidad importantes; añadir más usuarios da rendimientos decrecientes (Aguayo Blog, 2024) [N5 ✓ FULL TEXT — fuente secundaria divulgativa; el artículo original Nielsen 2000 está cubierto por la investigación metodológica paralela]. La fórmula de Nielsen-Landauer: *"el número de problemas de usabilidad encontrados al testear N usuarios... con un valor común de L del 31%"* (Aguayo, 2024) [N5 ✓ FULL TEXT].

**Contraargumento documentado**: **Faulkner, L. (2003)** mostró que aunque con N=5 se detecta en promedio 85% de problemas, *"los grupos de 5 usuarios se mueven en un rango de hallazgo de problemas entre un 55% y un 100%"* (cita vía Aguayo, 2024) [N5 ✓ FULL TEXT — referencia secundaria; Faulkner original = N1 a verificar en investigación paralela].

**Casos en tesis españolas**: en la **Universidad de Granada**, hay tesis doctoral sobre *"Modelo de evaluación de la usabilidad de entornos web basado en metodologías de Computing with Words y Design Thinking"* (UGR Digibug, 2024) [N2 ~ ABSTRACT — PDF binario ilegible vía WebFetch, existencia y URL confirmadas en https://digibug.ugr.es/bitstream/handle/10481/94970/75168.pdf]. La existencia de tesis UGR con enfoque metodológico de evaluación de usabilidad respalda la legitimidad del enfoque para producción académica española.

**Aplicabilidad al TFG**: la cita Nielsen 2000 es prácticamente obligatoria para defender N=5. Conviene complementar con Faulkner 2003 para mostrar consciencia crítica del rango de variabilidad. El TFG debe argumentar que el Study B es **complemento cualitativo** al Study A (N=30-60) y no sustituto — esto neutraliza la crítica más habitual al N pequeño.

---

## 7. Educación financiera en España — estudios académicos

**Plan de Educación Financiera (PEF)** — iniciativa conjunta Banco de España + CNMV + Ministerio de Economía + Ministerio de Educación. El **Plan 2022-2025** está disponible en https://cnmv.es/DocPortal/Publicaciones/PlanEducacion/Planeducacionfinanciera_22_25es.pdf (CNMV/BdE, 2022) [N2 ✓ ABSTRACT]. El convenio se renovó en enero de 2026 (Ministerio Educación FP y Deportes, 2026) [N2 ✓ FULL TEXT]. El portal de difusión es **finanzasparatodos.es**. El programa de Educación Financiera en ESO ha sido evaluado: *"se ha impartido en más de medio millar de centros educativos en todas las comunidades autónomas en varias ediciones desde 2010, y ha sido evaluado"* y *"basado en un enfoque por competencias usando OECD PISA 2012 Financial Literacy Assessment como referencia"* (CNMV, 2024) [N2 ✓ FULL TEXT].

**Encuesta de Competencias Financieras (ECF)** — operación estadística incluida en el Plan Estadístico Nacional, ejecutada por Banco de España + INE. Adapta a España el cuestionario de la International Network for Financial Education de la OCDE (BdE Cliente Bancario, 2024) [N2 ✓ FULL TEXT]. Ediciones 2016 y 2021. Población objetivo: 18-79 años. Mide *"comprensión de conceptos financieros básicos y el grado de conocimiento, tenencia, adquisición y uso de distintos instrumentos financieros"* (BdE, 2024) [N2 ✓ FULL TEXT]. Hallazgo: educación universitaria correlaciona con 64% de respuestas correctas vs 43% en quienes no llegaron a bachillerato. Informe principal: **Hospido, L. y colaboradores (2023)** — *Encuesta de Competencias Financieras 2021* (BdE, 2023) [N2 ~ ABSTRACT — PDF ilegible vía WebFetch, datos vía búsqueda]. URL: https://www.bde.es/f/webbe/SES/AnalisisEconomico/Competencis_Financieras/EncuestaCompetencias_2021.pdf.

**Investigación universitaria sobre educación financiera**: **Funcas (2021)** publicó *"Evaluación para la mejora de la formación en educación financiera para universitarios"* sobre un programa Universidad de Extremadura + Universidad de Valencia, evaluado en 2021 con grupos de tratamiento y control (Funcas, 2021) [N4 ✓ FULL TEXT — vía búsqueda]. URL: https://www.funcas.es/articulos/evaluacion-para-la-mejora-de-la-formacion-en-educacion-financiera-para-universitarios/. Dialnet ID: 8253612.

**Herramientas digitales del BdE**: el portal *"Cliente Bancario"* del Banco de España ofrece simuladores de hipoteca, préstamo y rentabilidad accesibles vía app gratuita iOS/Android. Existen también herramientas en finanzasparatodos.es (BdE, 2024) [N2 ✓ FULL TEXT].

**Vacío identificado**: **no se ha encontrado tesis doctoral española conocida sobre evaluación UX de app de planificación financiera personal**. El TFG de UPM de Ye (2024) construye una app sin evaluación de usabilidad. **El TFG ETSE-UV ocupa un nicho académico real**.

**Aplicabilidad al TFG**: la ECF, el PEF y Hospido (2023) son fundamentales para el cap. 2 (Marco) — establecen la magnitud del problema de competencias financieras en España. Como herramientas digitales públicas comparables están los simuladores del BdE.

---

## 8. Manuales de UX research en castellano

**Libro fundacional AIPO**: **Lorés, J. (ed.) et al. (2002)**. *La interacción persona-ordenador*. AIPO. Autores: Julio Abascal, Ignacio Aedo, José Cañas, Miguel Gea, Ana Belén Gil, Jesús Lorés, Ana Belén Martínez, Manuel Ortega, Pedro Valero y Manuel Vélez (AIPO, 2002) [N4 ✓ ABSTRACT — el PDF completo excedió maxContentLength en WebFetch; estructura del libro confirmada vía búsqueda]. Capítulos: 1) Introducción IPO, 2) Factor humano, 3) Metáforas/estilos/paradigmas, **4) Evaluación**, 5) Diseño, 6) Dispositivos, 7) Accesibilidad, 8) Internacionalización, además de evaluación heurística, estándares y guías, diseño gráfico y trabajo cooperativo soportado por ordenador. PDF abierto: https://aipo.es/wp-content/uploads/2022/02/LibroAIPO.pdf. **Es la referencia canónica en castellano para HCI en TFGs españoles**.

**Manual moderno en castellano**: **Hassan-Montero, Y. (2017)**. *Experiencia de Usuario: Principios y Métodos*. Edición de autor, ISBN 978-1520368221 (Hassan-Montero, 2017) [N4 ✓ ABSTRACT — el PDF en yusef.es es binario ilegible vía WebFetch; metadatos confirmados vía Amazon y reseñas]. El autor es Doctor por la Universidad de Granada, dirige la revista *No Solo Usabilidad*, es consultor UX y dirige el Máster en Diseño de UX en UNIR. *"Cubre los principales principios de diseño para tomar decisiones de diseño, así como las principales técnicas y métodos de diseño centrado en el usuario: prototipado, investigación, evaluación, monitorización"* (Hassan-Montero, 2017) [N4 ✓ ABSTRACT]. PDF disponible públicamente: https://yusef.es/Experiencia_de_Usuario.pdf.

**Otras obras de Granollers y GRIHO**:
- Granollers, T. et al. *Diseño de sistemas interactivos centrados en el usuario*. Editorial UOC.
- Granollers, T. (2022). *Perspectivas en la Interacción Humano-Tecnología*. Editorial vinculada a GRIHO/UdL.
- Granollers, T. (2022). *Preproducción de Sistemas Multimedia*.
(Universitat de Lleida portal recerca, 2024) [N2 ✓ ABSTRACT].

**Comunidad profesional**:
- **UX Spain** — encuentro anual de profesionales UX, organizado por César García, Yusef Hassan, Sergio Ortega y Sergi Sánchez. URL: https://uxspain.com/ (UX Spain, 2024) [N5 ✓ ABSTRACT].
- **UXRES (Comunidad de UX Research en Español)** — grupo iberoamericano de investigadores en UX y ResearchOps. URL: https://uxres.org/ (UXRES, 2024) [N5 ✓ ABSTRACT].
- **UOC** ofrece Diploma de Experto Online en UX Research con materiales en español (UOC, 2024) [N5 ✓ ABSTRACT].

**Aplicabilidad al TFG**: Lorés et al. 2002 y Hassan-Montero 2017 son las dos referencias básicas en castellano que **todo TFG español de HCI debería citar** en el capítulo metodológico. Granollers/MPIu+a aporta marco procesual. UX Spain/UXRES son útiles como contexto pero no como cita académica primaria.

---

## Bibliografía clasificada por fiabilidad

### N1 — Papers peer-reviewed

1. **Castilla, D., Jaen, I., Suso-Ribera, C., Garcia-Soriano, G., Zaragoza, I., Breton-Lopez, J., Mira, A., Diaz-Garcia, A., & Garcia-Palacios, A. (2023)**. *Psychometric Properties of the Spanish Full and Short Forms of the System Usability Scale (SUS): Detecting the Effect of Negatively Worded Items*. International Journal of Human–Computer Interaction, 40(15). DOI: 10.1080/10447318.2023.2209840. URL: https://www.tandfonline.com/doi/full/10.1080/10447318.2023.2209840. [ABSTRACT] ✓. Aporta: validación SUS español con N=1321, recomendable como cita principal para uso de SUS en el Study B.

2. **Sevilla-Gonzalez, M. R., Moreno Loaeza, L., Lazaro-Carrera, L. S., Bourguet Ramirez, B., Vázquez Rodríguez, A., Peralta-Pedrero, M. L., & Almeda-Valdes, P. (2020)**. *Spanish Version of the System Usability Scale for the Assessment of Electronic Tools: Development and Validation*. JMIR Human Factors, 7(4), e21161. URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7773510/. [FULL TEXT] ✓. Aporta: segunda validación SUS español (N=88, Cronbach α=0.812), acceso abierto.

3. **Díaz-Ramiro, E., Rubio-Valdehita, S., Martín-García, J., & Luceño-Moreno, L. (2010)**. *Estudio Psicométrico del Índice de Carga Mental NASA-TLX con una Muestra de Trabajadores Españoles*. Revista de Psicología del Trabajo y de las Organizaciones, 26(3). ISSN 1576-5962. URL: https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1576-59622010000300003. [FULL TEXT] ✓. Aporta: validación NASA-TLX español (N=398).

4. **Rauschenberger, M., Schrepp, M., Cota, M. P., Olschner, S., & Thomaschewski, J. (2013)**. *Efficient Measurement of the User Experience of Interactive Products. How to Use the User Experience Questionnaire (UEQ). Example: Spanish Language Version*. International Journal of Interactive Multimedia and Artificial Intelligence, 2(1), 39-45. URL: https://revistas.unir.net/index.php/ijimai/article/view/354. [ABSTRACT] ✓. Aporta: versión española oficial del UEQ.

### N2 — Informes institucionales oficiales / universidades / TFGs

5. **Universitat de València. Reglamento de TFG y TFM ACGUV 206/2024**, de 2 de julio. Conforme a RD 822/2021. URL: https://www.uv.es/uvweb/college/en/undergraduate-studies/academic-information/undergraduate-degree-final-project-1286396270635.html. [FULL TEXT] ✓. Aporta: marco normativo TFG UV.

6. **ETSE-UV. Instrucciones para los Trabajos de Fin de Grado en la ETSE-UV**. URL: https://www.uv.es/graus/TFG/ETSE/Instrucciones.pdf. [PDF binario ilegible vía WebFetch — existencia confirmada]. ~. Aporta: regulación específica de la escuela.

7. **ETSE-UV. Guía Docente TFG módulo 35303 (curso 2024-25)**. URL: https://webges.uv.es/uvGuiaDocenteWeb/guia?APP=uvGuiaDocenteWeb&ACTION=MOSTRARGUIA.M&MODULO=35303&CURSOACAD=2024&IDIOMA=C. [PDF binario ilegible] ~. Aporta: guía oficial de la asignatura TFG.

8. **Comité de Ética en Investigación en Humanos UV (CEIH-UV). Instrucciones, FAQ y Formularios**. URLs: https://www.uv.es/ethical-commission-experimental-research/en/ethics-research-humans/instruccions.html , https://www.uv.es/ethical-commission-experimental-research/en/ethics-research-humans/frequently-asked-questions.html , https://www.uv.es/ethical-commission-experimental-research/en/ethics-research-humans/forms.html. [FULL TEXT] ✓. Aporta: requisitos éticos y formularios oficiales UV.

9. **CEIH-UV. Modelo de consentimiento informado genérico**. URL: https://www.uv.es/uvetica/docs/ceih/consentimiento_generico.doc. [FULL TEXT vía .doc] ✓. Aporta: plantilla oficial.

10. **Boletín Oficial del Estado. Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)**. BOE-A-2018-16673. URL: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673. [ABSTRACT] ✓. Aporta: marco legal nacional.

11. **CRUE (Conferencia de Rectores de Universidades Españolas). Guía para Delegados de Protección de Datos en Proyectos de Investigación**. URL: https://www.crue.org/wp-content/uploads/2024/09/Doc.-4-Guia-Proyectos-Invest-DPDs.pdf. [PDF binario ilegible] ~. Aporta: guía interuniversitaria sobre proyectos de investigación.

12. **Banco de España. Encuesta de Competencias Financieras 2021**. Informe elaborado por Laura Hospido y colaboradores. URL: https://www.bde.es/f/webbe/SES/AnalisisEconomico/Competencis_Financieras/EncuestaCompetencias_2021.pdf. [PDF binario ilegible — existencia y resumen confirmados vía búsqueda] ~. Aporta: dato macro de competencias financieras España.

13. **CNMV / Banco de España. Plan de Educación Financiera 2022-2025**. URL: https://cnmv.es/DocPortal/Publicaciones/PlanEducacion/Planeducacionfinanciera_22_25es.pdf. [ABSTRACT] ✓. Aporta: marco institucional educación financiera.

14. **RODERIC — Repositorio Institucional UV**. URLs: https://roderic.uv.es/ , https://www.uv.es/uvweb/libraries-documentation-service/en/roderic-uv-digital-production-/what-is-roderic-1285888926835.html. [FULL TEXT] ✓. Aporta: repositorio donde depositar el TFG.

15. **Broz Lofiego, A. R. (2017)**. *Aceptación del pago móvil en España: análisis de la conveniencia y la usabilidad*. Tesis doctoral UV. URL: https://roderic.uv.es/items/530151c3-04ab-46b7-8317-f899d000e06f. [ABSTRACT] ✓. Aporta: precedente UV de investigación con usabilidad.

16. **Díaz Suárez, J. E. (2020)**. *EduBPMN: Un método Basado en Reglas de Transformación para Generar Interfaces Gráficas de Usuario*. Tesis doctoral UV, Dept. Informàtica. URL: https://roderic.uv.es/items/189eff82-22d0-4b16-9f70-3cf92b3ecc1e. [ABSTRACT] ✓. Aporta: precedente UV en interfaces gráficas.

17. **Ye, B. (2024)**. *Aplicación Web para la Gestión de finanzas personales*. TFM Máster Ingeniería Web, UPM. Dir. Santiago Alonso Villaverde. URL: https://oa.upm.es/83052/. [FULL TEXT] ✓. Aporta: precedente español de app financiera personal (sin testing UX — gap a cubrir por el TFG ETSE-UV).

18. **INSST. NTP 544: Estimación de la carga mental de trabajo: el método NASA-TLX**. 2001/2000. URL: https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/16-serie-ntp-numeros-541-a-575-ano-2001/ntp-544-estimacion-de-la-carga-mental-de-trabajo-el-metodo-nasa-tlx-2000. [ABSTRACT] ✓. Aporta: referencia técnica oficial española del NASA-TLX.

19. **Banco de España — Portal Cliente Bancario. Simuladores y Encuesta de Competencias Financieras**. URL: https://clientebancario.bde.es/. [FULL TEXT] ✓. Aporta: herramientas digitales oficiales comparables.

20. **Funcas (2021)**. *Evaluación para la mejora de la formación en educación financiera para universitarios*. URL: https://www.funcas.es/articulos/evaluacion-para-la-mejora-de-la-formacion-en-educacion-financiera-para-universitarios/. [ABSTRACT] ✓. Aporta: caso evaluación intervención educativa financiera con estudiantes UV/UEx.

### N3a — Ponencias de congreso académico

21. **AIPO. Congreso Internacional de Interacción Persona-Ordenador (Interacción)**. Ediciones 2022 (Teruel, U. Zaragoza), 2023 (Lleida, GRIHO/UdL), 2024 (A Coruña), 2025 (Valladolid, ECA-SIMM/UVa). Auspicio AIPO + ACM SIGCHI capítulo español (CHISPA). URLs: https://aipo.es/ , https://interaccion2025.infor.uva.es/. [FULL TEXT] ✓. Aporta: foro nacional de publicación HCI con peer-review.

### N3b — Informes consultoría primer nivel

(No aplica directamente al alcance de esta investigación local; cobertura cubierta por investigación metodológica paralela.)

### N4 — Literatura gris de calidad / asociaciones / libros AIPO

22. **AIPO (Asociación Interacción Persona-Ordenador)**. Fundada 19/06/2000, Facultad de Psicología U. Granada. URL: https://aipo.es/. [FULL TEXT] ✓. Aporta: organización académico-profesional de referencia en HCI España.

23. **Revista Interacción (AIPO)**. ISSN 2695-6578. Semestral, peer-review doble ciego, acceso abierto, en español. URL: https://revista.aipo.es/. [FULL TEXT] ✓. Aporta: vía de publicación derivada del TFG.

24. **Lorés, J. (ed.), Abascal, J., Aedo, I., Cañas, J., Gea, M., Gil, A. B., Martínez, A. B., Ortega, M., Valero, P., & Vélez, M. (2002)**. *La interacción persona-ordenador*. AIPO. URL: https://aipo.es/wp-content/uploads/2022/02/LibroAIPO.pdf. [ABSTRACT — PDF excede maxContentLength en WebFetch] ✓. Aporta: libro fundacional español de HCI.

25. **Hassan-Montero, Y. (2017)**. *Experiencia de Usuario: Principios y Métodos*. Edición de autor. ISBN 978-1520368221. URL: https://yusef.es/Experiencia_de_Usuario.pdf. [ABSTRACT — PDF binario ilegible] ✓. Aporta: manual moderno en castellano.

26. **GRIHO (UdL) — Granollers, T. Modelo MPIu+a**. URL: https://mpiua.invid.udl.cat/ (sitio devolvió ECONNREFUSED, datos vía búsquedas) [ABSTRACT] ✓. Aporta: modelo procesual de evaluación en castellano.

### N5 — Fuentes web generales

27. **Aguayo Blog. La Teoría del Nielsen Norman Group: ¿Por qué solo necesitas testear con 5 usuarios?**. URL: https://aguayo.co/es/blog-aguayo-experiencia-usuario/teoria-nielsen-norman-pruebas-usabilidad-5-usuarios/. [FULL TEXT] ✓. Aporta: explicación divulgativa española de la regla Nielsen (referencia secundaria).

28. **UX Spain — Encuentro de Profesionales UX**. URL: https://uxspain.com/. [ABSTRACT] ✓. Aporta: comunidad profesional.

29. **UXRES — Comunidad de UX Research en Español**. URL: https://uxres.org/. [ABSTRACT] ✓. Aporta: red profesional iberoamericana.

---

## Fortaleza de evidencia

| Conclusión | Fuentes (nivel + stance) | Metodología más alta | Valoración |
|-----------|--------------------------|---------------------|-----------|
| SUS-ES es defendible como instrumento principal de usabilidad cuantitativa | Castilla 2023 (N1 ✓), Sevilla-Gonzalez 2020 (N1 ✓) | Validación psicométrica con N grande | **Sólida** |
| NASA-TLX-ES es defendible para carga cognitiva | Díaz-Ramiro 2010 (N1 ✓), NTP 544 INSST (N2 ✓) | Estudio psicométrico N=398 | **Sólida** |
| UEQ-ES es defendible | Rauschenberger 2013 (N1 ✓) | Validación lingüística + Cronbach | Moderada (un único paper) |
| AttrakDiff-ES NO es defendible sin advertencia explícita | Sin validación peer-reviewed española conocida | — | **Débil** — usar solo con caveat |
| Un Study B con N=5 estudiantes sin datos de salud probablemente NO requiere dictamen CEIH-UV, pero sí RGPD + consentimiento informado | CEIH-UV FAQ (N2 ✓), LOPDGDD (N1 ✓), modelo consentimiento UV (N2 ✓) | Normativa oficial UV | **Sólida pero con zona gris** — verificar con tutor |
| N=5 está respaldado por Nielsen 2000 con caveats de Faulkner 2003 | Nielsen (N1 vía investigación paralela), Faulkner 2003 (referencia N1 a verificar), Aguayo blog (N5 ✓) | Estudio matemático Nielsen original | **Sólida** (literatura externa) |
| AIPO/Interacción/Lorés son la bibliografía canónica española de HCI | Lorés 2002 (N4 ✓), Revista AIPO (N4 ✓), Congreso Interacción (N3a ✓) | Libro multiautor + revista peer-review | **Sólida** |
| El TFG ocupa un nicho real: no hay tesis doctoral española conocida sobre app de planificación financiera personal con evaluación UX | Búsquedas en Dialnet, RODERIC, oa.upm.es | — | Moderada — gap negativo, no se puede probar definitivamente la inexistencia |
| Las competencias financieras españolas son insuficientes y existe respaldo institucional para investigar el tema | Hospido/BdE ECF 2021 (N2 ~), PEF 2022-2025 (N2 ✓), Funcas 2021 (N4 ✓) | Encuesta nacional + plan institucional | **Sólida** |
| El reglamento TFG UV admite trabajos experimentales (modalidad Study B) | UV ACGUV 206/2024 (N2 ✓) | Normativa oficial | **Sólida** |

---

## Aplicabilidad directa al TFG de la ETSE-UV

**Lo que es directamente aplicable**:

1. **SUS y NASA-TLX en versión española peer-reviewed**: el TFG puede usar SUS-ES citando **Castilla et al. 2023** como referencia primaria y **Sevilla-Gonzalez et al. 2020** como secundaria. Para carga cognitiva, citar **Díaz-Ramiro et al. 2010 + NTP 544 INSST**. Estas tres referencias N1/N2 dan validación rigurosa al apartado de instrumentos del cap. 5.

2. **Modelo de consentimiento informado oficial UV**: usar literalmente la plantilla del CEIH-UV (`consentimiento_generico.doc`) adaptada al Study B. Esto resuelve compliance LOPDGDD sin reinventar el documento. El modelo ya incluye derecho de retirada, anonimización, base jurídica y derechos del participante.

3. **Reglamento ACGUV 206/2024**: el TFG debe declarar conformidad con esta norma y con el RD 822/2021 en el cap. introductorio. La modalidad de "trabajo experimental" cubre explícitamente un Study B presencial.

4. **AIPO + Lorés 2002 + Hassan-Montero 2017**: bibliografía obligada para el cap. 5 (Metodología). Lorés es referencia histórica; Hassan-Montero es referencia contemporánea en castellano; Granollers/MPIu+a es referencia procesual.

5. **Banco de España (ECF + PEF + simuladores)** y **Funcas 2021**: bibliografía obligada para el cap. 2 (Marco/Contexto). Establecen magnitud del problema y existencia de iniciativas públicas comparables.

**Advertencias sobre vacíos**:

- **No se ha encontrado precedente RODERIC directo** de TFG de Ingeniería Multimedia de la ETSE-UV con metodología de testing presencial N=5. El TFG no puede apoyarse en "así se hizo en otros TFG de la casa"; debe defender la metodología con literatura externa. Esto es un riesgo menor si la justificación bibliográfica externa (Nielsen, Lorés, Hassan-Montero, GRIHO/Granollers) es sólida.
- **No se ha podido verificar la rúbrica concreta** que aplicará el tribunal ETSE-UV; el TFGista debe pedirla explícitamente al tutor.
- **AttrakDiff carece de validación española peer-reviewed**; si se usa debe marcarse como limitación.
- **Varios PDF institucionales** (instrucciones ETSE-UV, ECF 2021, guía CRUE) no se han podido leer textualmente vía WebFetch porque están comprimidos; el TFGista debe descargarlos manualmente y verificar las citas literales antes de incluirlas en la memoria.

---

## Trámites éticos a verificar

Lista accionable, ordenada por urgencia:

1. **Consulta al tutor ETSE-UV sobre necesidad de dictamen CEIH-UV**. La FAQ oficial del CEIH-UV declara que NO requieren evaluación los TFG no vinculados a programas de doctorado UV y las encuestas de opinión sin información psicológica/sanitaria. El Study B (testing UX, N=5, sin datos de salud) encaja en esta exención, pero la interpretación literal del FAQ tiene zona gris para "interacción con seres humanos" cualitativa. **Confirmar por escrito con el tutor antes de iniciar el trabajo de campo**. Si hubiera duda, presentar formulario EH-1 al CEIH-UV con dos meses de antelación.

2. **Descargar y adaptar el modelo de consentimiento genérico CEIH-UV** (`https://www.uv.es/uvetica/docs/ceih/consentimiento_generico.doc`). Personalizar con: título del estudio, objetivos del Study B, descripción del protocolo (tareas, grabación audio si la hay, duración estimada), riesgos (mínimos), beneficios (educativos, contribución a investigación), datos del responsable (TFGista + tutor), base jurídica (consentimiento + interés público académico), conservación y derechos ARCO/ARSULIPO.

3. **Anonimización y conservación de datos**. Asignar códigos pseudónimos (P01, P02...) a los participantes. Mantener la tabla código-identidad **separada del material de análisis**, según indica el modelo UV. Definir periodo de conservación (típicamente 5 años desde la defensa del TFG; verificar con el DPD UV). Cumplir LOPDGDD 3/2018.

4. **Si hay grabación audio o vídeo**: usar también el formulario de **autorización de imágenes/voz** del CEIH-UV (`autorizacion_imagenes.pdf`). Indicar cifrado en reposo, plataforma de almacenamiento (local o nube cumplidora RGPD), y borrado tras transcripción.

5. **Captura de menores o personas vulnerables**: si en el reclutamiento del Study B aparece algún participante menor de edad, usar la versión específica del consentimiento UV con firma del representante legal. El TFG debería excluir menores en el criterio de inclusión salvo justificación específica.

6. **Conformidad con la ETSE-UV en confidencialidad**: si el código fuente o el dataset del Study B se considera confidencial, seguir el procedimiento ETSE-UV de PDF protegido por contraseña con compromiso de confidencialidad del tribunal.

7. **Declaración de financiación y conflicto de intereses**: aunque el TFG no tenga financiación externa, el consentimiento UV lo exige declarar (incluir "Estudio sin financiación externa, realizado en el contexto académico del Trabajo Fin de Grado en Ingeniería Multimedia de la ETSE-UV").

8. **Citas obligadas en el cap. de Metodología**: LOPDGDD 3/2018, Reglamento TFG UV ACGUV 206/2024, modelo de consentimiento CEIH-UV. Esto cierra la trazabilidad ético-legal del trabajo de campo.
