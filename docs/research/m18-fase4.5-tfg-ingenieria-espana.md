---
title: "M18 Fase 4.5 — Pruebas UX en TFGs de Ingeniería ETSE-UV / España"
date: 2026-05-25
type: research
phase: m18-fase4.5
scope: "Proyecto desarrollo software ingenieril, no investigación académica"
related: [m18-fase4.5-pruebas-aceptacion-ingenieria, framing-tfg]
---

# Pruebas UX en TFGs de Ingeniería — ETSE-UV / España

## Nota metodológica previa

Investigación realizada con scope cerrado: testing UX típico de proyectos de desarrollo de software universitarios, no investigación académica primaria. Fuentes verificadas con WebFetch o búsqueda web; cuando el contenido del PDF no fue parseable, se indica explícitamente. Las URLs `webges.uv.es` de las guías docentes UV devuelven PDF cifrado y no pudieron leerse en texto plano — se obtuvieron los metadatos vía búsqueda y descripciones del sistema; la bibliografía específica del módulo 34839 no pudo confirmarse textualmente.

---

## Q1. Asignaturas universitarias españolas relevantes

### ETSE-UV — Grado en Ingeniería Multimedia (plan confirmado)

El plan de estudios oficial del Grado en Ingeniería Multimedia de la Universitat de València incluye **tres asignaturas obligatorias clave para el TFG de desarrollo software**:

| Código | Asignatura | Curso | ECTS | Carácter |
|--------|------------|-------|------|----------|
| **34839** | Interacción Persona-Ordenador (Human-Computer Interaction) | 2º | 6 | Obligatoria |
| **34851** | Diseño de Proyectos Interactivos (Design of Interactive Projects) | 2º | 6 | Obligatoria |
| **34840** | Ingeniería del Software (Software Engineering I) | 3º | 6 | Obligatoria |
| **34841** | Gestión de Proyectos (Project Management) | 3º | 6 | Obligatoria |
| **34862** | Aspectos Legales de las TIC (Legal Aspects of ICT) | 4º | 6 | Obligatoria |

Fuente: web oficial UV [N2 ✓ FULL TEXT].

El sistema de guías docentes (`webges.uv.es`) confirma la existencia de la asignatura **34839 "Interacción Persona-Ordenador"**, descrita como cubriendo "el desarrollo de productos multimedia en un contexto real de uso aplicando soluciones apropiadas", con resultados de aprendizaje sobre "diseñar, desarrollar, evaluar y asegurar la accesibilidad, ergonomía, usabilidad y seguridad de sistemas multimedia". El contenido completo de la guía está en PDF cifrado no parseable.

La asignatura **34840 "Ingeniería del Software"** está descrita como "específicación, diseño, implementación, despliegue y evaluación de soluciones de sistemas multimedia", siguiendo el Proceso Unificado de Desarrollo.

### Comparativa con otras universidades españolas

Universidades de referencia con asignaturas equivalentes localizadas: **URJC, UPM, UGR, UVa, UdL, UJaén, UOC, UNIR, UPC, USC**. La asignatura "Interacción Persona-Ordenador" es estructuralmente similar en todas: 6 ECTS, obligatoria, con tres bloques típicos (proceso de DCU, usabilidad/accesibilidad, evaluación de interfaces).

### UGR — Diseño de Interfaces de Usuario (referencia con bibliografía confirmada)

La guía docente de "Diseño de Interfaces de Usuario" (296114E) del Grado en Ingeniería Informática (especialidad Ingeniería del Software) de la UGR, leída en texto completo, especifica:
- **6 ECTS, obligatoria, tercer curso, segundo semestre**
- Bibliografía fundamental: **Lorés et al. (2001), Shneiderman & Plaisant (2006), Dix et al. (2003)**
- Evaluación: 50% proyecto práctico (5 entregables), 25% trabajo autónomo, 25% examen
- Menciona explícitamente "cuestionarios" y "user testing" en seminarios

Fuente: UGR Lenguajes y Sistemas Informáticos [N2 ✓ FULL TEXT].

### UNIR — Interacción Persona-Ordenador (bibliografía confirmada)

La guía docente accesible en HTML de UNIR (Grado en Ingeniería Informática, 6 ECTS, primer curso) ofrece el listado más completo de bibliografía y métodos enseñados en el currículum español:

- **Temario en 10 temas**: incluye explícitamente "Proceso de diseño (III): evaluación"
- **Métodos cubiertos**:
  - Evaluación heurística (Hassan & Martín, 2003)
  - Pruebas de usabilidad (Krug, 2001)
  - Métodos con y sin usuarios
  - Estándares WCAG 2.0/2.1
- **Bibliografía recomendada explícita**:
  - Lorés, J. (Ed.). (2002). *La interacción persona-ordenador*. AIPO
  - Hassan, Y. & Martín, F. J. (2003). *Guía de Evaluación Heurística de Sitios Web*
  - Krug, S. (2001). *No me hagas pensar*
  - Nielsen, J. (1995). *How to Conduct a Heuristic Evaluation*

Fuente: UNIR [N2 ✓ FULL TEXT].

**Esta es la fuente más representativa del canon docente español**: confirma que la bibliografía nuclear que un estudiante de ingeniería español encuentra para pruebas de aceptación UX es Lorés/AIPO + Hassan-Montero + Nielsen + Krug.

---

## Q2. TFGs públicos en RODERIC / Riunet / UPCommons

Los repositorios institucionales españoles (RODERIC-UV, Riunet-UPV, UPCommons-UPC, UVaDOC-UVa, Riuma-UMA) contienen miles de TFGs de Ingeniería Informática/Multimedia con capítulos de pruebas UX. La búsqueda directa con operadores `site:` está limitada por la indexación parcial. Localicé referencias concretas pero la mayoría de PDFs no fueron parseables vía WebFetch (PDF binario sin capa de texto extraíble).

### Referencias localizadas vía búsqueda

| # | Autor | Año | Universidad | Título | URL | Estado |
|---|-------|-----|------------|--------|-----|--------|
| 1 | Sánchez Cervera, V. | 2025 | UPV | "Desarrollo de una aplicación web para la gestión de pistas y eventos de un club de pádel" | [riunet.upv.es](https://riunet.upv.es/server/api/core/bitstreams/ba078ce5-eefe-46e8-b3ff-4a8201b91d85/content) | Metadatos confirmados; PDF parcialmente leído. La descripción del snippet confirma "validación con usuarios reales basada en escenarios definidos y evaluación heurística según las diez heurísticas de Nielsen" [N2 ~ ABSTRACT] |
| 2 | (sin identificar) | s/f | UV | TFG en RODERIC | [roderic.uv.es](https://roderic.uv.es/rest/api/core/bitstreams/9dcf50af-d9f8-4863-bcfd-c3af171fdfb2/content) | 401 Unauthorized; no accesible |
| 3 | Giménez Hernández, D. | s/f | UPM | TFG software con capítulo 6 de pruebas | [oa.upm.es](https://oa.upm.es/90125/1/TFG_DAVID_GIMENEZ_HERNANDEZ.pdf) | Snippet confirma "Capítulo 6 Pruebas" sobre software/desarrollo [N2 ~ ABSTRACT] |
| 4 | Ayries Rubio, A. | s/f | UPM | "Trabajo Fin de Grado Aplicación Web" | [oa.upm.es](https://oa.upm.es/72353/1/TFG_ARTURO_AYRIES_RUBIO.pdf) | 3.7 MB PDF no parseable |
| 5 | Compendio INTERACCIÓN 2025 | 2025 | UVa | "XXV Congreso Internacional de Interacción Persona-Ordenador" | [uvadoc.uva.es](https://uvadoc.uva.es/handle/10324/77999) | [N3a ✓ FULL TEXT] — 17 artículos publicados, premios a TFGs de HCI |

### Hallazgo importante sobre tamaños de muestra

Aunque no pude leer los TFGs completos vía WebFetch, los snippets y la literatura docente convergen en el **canon Nielsen 5 usuarios**:

> "Nielsen publicó un estudio en 2000 con Tom Landauer demostrando que testar con 5 usuarios permite detectar el 85% de los problemas de usabilidad en una interfaz. Tras el quinto participante los beneficios adicionales decrecen significativamente, y con cinco usuarios es probable capturar al menos el 85% de los problemas más importantes" — fuente NN/g vía blog Aguayo [N5 ✓ FULL TEXT].

Crítica registrada al canon (no se citará como ataque, sino como matización):
> "Gilbert Cockton (2003) menciona que solo los problemas más simples aparecen con una muestra tan pequeña y muchos otros pueden no encontrarse. Estudios de Laura Faulkner (2003) demuestran que con 5 personas se detecta el 85% en promedio, pero el rango varía del 55% al 100%, por lo que es posible tener una muestra débil" [N5 ~ FULL TEXT].

**Práctica habitual en TFGs españoles** (inferida del contenido docente y los snippets): N=5–10 usuarios para test de usabilidad + N=3 evaluadores expertos para heurísticas. No se encontró un benchmark cuantitativo riguroso de la distribución real de N en TFGs ETSE-UV; este es un vacío del scope cerrado.

### Estructura típica del capítulo 6 "Pruebas y Resultados" en TFGs de software

Inferida a partir de la estructura UV genérica para TFG ([uv.es](https://www.uv.es/uv-teaching/en/subject-planning/degree-final-project/atencio-i-guia-a-l-estudiantat/estructura-tfg.html) [N2 ✓ FULL TEXT]) y los snippets de los TFGs ingenieriles encontrados:

1. Introducción al capítulo y objetivos de las pruebas
2. Tipos de pruebas realizadas (unitarias, integración, sistema, aceptación)
3. Pruebas con usuarios: muestra (N, perfil), condiciones (lugar, dispositivo), tareas
4. Resultados cuantitativos (SUS, tiempos, tasas de éxito)
5. Resultados cualitativos (observación, think-aloud, comentarios)
6. Verificación de RNF (¿se cumplen los requisitos no funcionales declarados en cap. 3?)
7. Discusión y propuestas de mejora

---

## Q3. Material docente español canónico

### Hassan-Montero, Y. (2015) — "Experiencia de Usuario: Principios y Métodos"

- **Autor**: Yusef Hassan Montero (yusef.es)
- **Año**: 2015
- **Páginas**: ~140-152
- **Editorial**: autoedición Amazon (ISBN 978-1520368221) + PDF gratuito en yusef.es
- **Disponibilidad**: PDF libre en [yusef.es/Experiencia_de_Usuario.pdf](https://yusef.es/Experiencia_de_Usuario.pdf)

Estructura (3 grandes secciones, según reseña verificada de Olga Carreras):
1. **Conceptos fundamentales** — usabilidad, accesibilidad, arquitectura de información, DCU
2. **Principios de diseño** — clasificación, color, Gestalt, jerarquía visual
3. **Métodos** — incluye **evaluación heurística, pruebas con usuarios, pruebas A/B** (no menciona explícitamente SUS ni think-aloud en la reseña; el PDF completo no fue parseable vía WebFetch).

Reseña de Olga Carreras [N5 ✓ FULL TEXT]: lo describe como referencia "tanto para quienes quieren introducirse en el diseño UX como para uso como referencia por profesionales".

### Lorés, J. (Ed.) (2001/2002) — "La Interacción Persona-Ordenador"

- **Editor**: Jesús Lorés Vidal
- **Autores capítulos**: Julio Abascal, Ignacio Aedo, José J. Cañas, Miguel Gea, Ana B. Gil, Jesús Lorés, Ana B. Martínez, Manuel Ortega, Pedro Valero, Manuel Vélez
- **Editorial**: AIPO (Asociación Interacción Persona-Ordenador)
- **Año**: diciembre 2001
- **ISBN**: 84-607-2255-4
- **Ciudad**: Lleida

Iniciativa abierta de AIPO publicada en Internet por capítulos. Cubre: introducción a la IPO, factor humano, metáforas, estilos y paradigmas, evaluación, diseño, dispositivos, accesibilidad, internacionalización, estándares, diseño gráfico, CSCW, sistemas de ayuda en línea, y **evaluación heurística**. Es el libro fundacional citado en la mayoría de guías docentes españolas de IPO (UGR, UNIR, etc.).

### Granollers, Lorés & Cañas (2005) — "Diseño de sistemas interactivos centrados en el usuario"

- **Autores**: Toni Granollers i Saltiveri, Jesús Lorés Vidal, José Juan Cañas Delgado
- **Editorial**: UOC (Editorial Universitat Oberta de Catalunya)
- **Año**: 2005
- **Páginas**: 277
- **ISBN**: 84-9788-320-7

Manual canónico DCU en castellano. Combina ingeniería del software, IPO y accesibilidad (precursor del MPIu+a).

### MPIu+a — Modelo de Proceso de la Ingeniería de la Usabilidad y de la Accesibilidad

- **Creador**: Toni Granollers, GRIHO (UdL)
- **Origen**: tesis doctoral Granollers (2004)
- **Web actual**: [mpiua.invid.udl.cat](https://mpiua.invid.udl.cat/) — curso de IPO online, abierto, en castellano
- **Grupo**: GRIHO (HCI and Data Integration Research Group), Universitat de Lleida
- Contiene fichas específicas de [Evaluación Heurística](https://mpiua.invid.udl.cat/evaluacion-heuristica-2/) y [Thinking Aloud](https://mpiua.invid.udl.cat/pensando-en-voz-alta-thinking-aloud/) (URLs verificadas vía búsqueda, fetch directo falló con ECONNREFUSED en varios intentos — recurso valencioso pero con problemas de disponibilidad puntuales)

### Hassan-Montero, Y. & Ortega-Santamaría, S. (2009) — "Informe APEI sobre Usabilidad"

- **Autores**: Yusef Hassan Montero y Sergio Ortega Santamaría
- **Año**: 2009
- **Editor**: APEI (Asociación Profesional de Especialistas en Información)
- **Acceso**: Dialnet ([dialnet.unirioja.es/servlet/libro?codigo=376173](https://dialnet.unirioja.es/servlet/libro?codigo=376173))

Manual previo del autor en castellano, citado en docencia de UNIR y otras.

### AIPO — Asociación Interacción Persona-Ordenador

- **Web**: [aipo.es](https://aipo.es)
- **Congreso anual**: Interacción (XXV edición en 2025, Valladolid; XXVI prevista en 2026, Albacete)
- **Revista**: *Interacción, Revista Digital de AIPO* (ISSN 2695-6578), peer-reviewed, semestral
- **Compendio Interacción 2025** verificado [N3a ✓ FULL TEXT]: editores Rodríguez-Triana, Muñoz-Cristóbal, Cardeñoso-Payo, Martínez-Monés, Gallardo; 34 contribuciones, 17 artículos en CEUR-WS

AIPO concede anualmente **premios al mejor TFG en HCI** (X edición confirmada en 2024-2025) — esto sitúa los TFGs de HCI en un ecosistema académico estructurado.

---

## Q4. Evaluación heurística en clase española

Las 10 heurísticas de Nielsen son el material universal en la docencia española de IPO. El curso MPIu+a de GRIHO ([mpiua.invid.udl.cat/evaluacion-heuristica-2/](https://mpiua.invid.udl.cat/evaluacion-heuristica-2/)) ofrece una plantilla basada en las 10 reglas de Nielsen con variaciones para evaluadores.

**Las 10 heurísticas canónicas** (validadas en docencia española):
1. Visibilidad del estado del sistema
2. Similitud con el mundo real
3. Control y libertad del usuario
4. Consistencia y estándares
5. Prevención de errores
6. Reconocimiento en lugar de memorización
7. Eficiencia y flexibilidad de uso
8. Diseño estético y minimalista
9. Ayuda al usuario para diagnosticar errores
10. Ayuda y documentación

**Material español específico**:
- Hassan, Y. & Martín, F. J. (2003) "Guía de Evaluación Heurística de Sitios Web" — citada explícitamente en la guía docente UNIR de IPO [N2 ✓ FULL TEXT].
- MPIu+a ofrece adaptación en castellano lista para usar como plantilla en TFG.

**Tamaño de muestra de evaluadores**: el canon Nielsen pide **3-5 evaluadores expertos**. No localicé una crítica/adaptación local relevante a la heurística que diverja del estándar Nielsen — la práctica española es Nielsen "as is".

**Combinación con tests con usuarios**: práctica explícita en TFGs ingenieriles (el TFG Sánchez Cervera 2025 confirma "validación con usuarios reales + evaluación heurística según las diez heurísticas de Nielsen").

---

## Q5. Think-aloud en clase española

**Origen metodológico**: Ericsson & Simon (1993) clasifican los protocolos en simultáneos y retrospectivos.

**Adaptación al currículum español de ingeniería** (no específicamente psicología cognitiva): el think-aloud es introducido como técnica práctica simple, no protocolizada al nivel de Ericsson & Simon. El curso MPIu+a (UdL) ofrece una ficha específica "Pensando en voz alta (Thinking Aloud)" como recurso docente abierto.

**Versión típica enseñada en TFGs**:
- Versión simple (no protocolizada): el usuario verbaliza pensamientos mientras realiza tareas predefinidas; el observador toma notas.
- Sin distinción entre concurrent vs retrospective en la mayoría del material docente español.
- Material complementario español: Torresburriel Estudio publica artículos sobre "ventajas y desventajas" y "cómo preparar el test Think Aloud" usados como referencia en blogs UX en castellano [N5 ✓ snippets].

**Limitación del think-aloud según práctica española**:
> "Respecto a los tres aspectos estrictamente relacionados con usabilidad —efectividad, eficiencia y satisfacción— Think Aloud no cubre lo relacionado con eficiencia, ya que las condiciones de ejecución del test influyen en el rendimiento del usuario" [N5 ✓ snippet].

Por tanto, en TFG la combinación recomendada es **think-aloud (cualitativo) + SUS (satisfacción) + métricas de tiempo/error registradas por separado (eficiencia/efectividad)**.

---

## Q6. SUS y cuestionarios en TFGs españoles

### SUS castellano validado — Sevilla-González et al. (2020)

- **Cita completa**: Sevilla-Gonzalez MDR, Moreno Loaeza L, Lazaro-Carrera LS, Bourguet Ramirez B, Vázquez Rodríguez A, Peralta-Pedrero ML, Almeda-Valdes P (2020). "Spanish Version of the System Usability Scale for the Assessment of Electronic Tools: Development and Validation". *JMIR Human Factors* 7(4):e21161.
- **DOI**: 10.2196/21161
- **URL**: [humanfactors.jmir.org/2020/4/e21161/](https://humanfactors.jmir.org/2020/4/e21161/)
- **Nivel**: N1 (paper peer-reviewed, JMIR Human Factors)
- **Metodología**: traducción directa e inversa según directrices OMS (9 pasos), validación con 10 expertos + 10 usuarios + 88 usuarios para confiabilidad
- **Resultados psicométricos**: alfa de Cronbach 0.812 (IC 95% 0.748-0.866; P<.001); índice validez de contenido 0.92; validez facial 0.94
- **Disponibilidad**: los 10 ítems en español están en el Multimedia Appendix 2 (DOCX descargable)

Esta es **la versión castellana validada con publicación N1**. Es la que un TFG debe citar (no traducciones informales).

### Interpretación de la puntuación SUS — Sauro & Lewis (2016)

> "Sauro y Lewis (2016) crearon una escala curva de calificación usando datos de 241 estudios de usabilidad, en la cual una puntuación SUS de 68 corresponde a una calificación C, que es promedio (percentil 50). Un SUS por encima de 68 está por encima de la media y por debajo de 68 está por debajo de la media" [N5 ✓ FULL TEXT vía MeasuringU].

**Benchmarks prácticos para RNF de TFG**:
- SUS ≥ 68 = "above average" (objetivo mínimo razonable)
- SUS ≥ 72.6 = grado B (bueno)
- SUS ≥ 80.7 = grado A (excelente)

### Cuestionarios alternativos en TFGs españoles

- **UEQ-S (User Experience Questionnaire Short)** — versión española de Rauschenberger et al. 2013, validada; 8 ítems, dimensiones pragmática + hedónica.
- **CSUQ (Computer System Usability Questionnaire)** — adaptación al español validada (ResearchGate).

**No localicé** uso documentado masivo de UEQ-S/CSUQ en TFGs ingenieriles ETSE-UV específicamente; SUS es el cuestionario dominante.

---

## Q7. RNF de usabilidad en TFGs ETSE-UV

No se localizó una guía oficial ETSE-UV específica sobre cómo redactar RNF de usabilidad. La estructura general UV ([uv.es estructura TFG](https://www.uv.es/uv-teaching/en/subject-planning/degree-final-project/atencio-i-guia-a-l-estudiantat/estructura-tfg.html)) pide "metodología" y "resultados y conclusiones" sin más especificación, dejando al tutor el detalle.

**Formato recomendado de RNF de usabilidad** (basado en la práctica ingenieril estándar y la literatura docente española):

```
RNF-USA-01 (Aprendibilidad): Un usuario sin experiencia previa
    completará la tarea principal en menos de 3 minutos en su
    primer intento.

RNF-USA-02 (Satisfacción): El sistema obtendrá una puntuación
    SUS ≥ 68 (umbral "above average" según Sauro & Lewis 2016)
    en el test con usuarios.

RNF-USA-03 (Eficacia): ≥ 80% de los usuarios completará la
    tarea principal sin asistencia externa.

RNF-USA-04 (Errores críticos): No se identificarán problemas
    de usabilidad de severidad alta (≥ 3 en escala Nielsen 0-4)
    en la evaluación heurística por 3 evaluadores.

RNF-USA-05 (Accesibilidad): Cumplimiento de pautas WCAG 2.1
    nivel AA en las páginas principales.
```

**Ejemplo simple existente** (extraído de literatura general española sobre RNF, [pmoinformatica.com](https://www.pmoinformatica.com/2015/05/requerimientos-no-funcionales-ejemplos.html) [N5 ✓ FULL TEXT]):
> "Los nuevos usuarios podrán completar el registro en menos de tres minutos, utilizando como máximo dos pantallas consecutivas."

---

## Q8. Mínimos legales LOPDGDD para TFG (no investigación académica)

**Marco normativo**:
- **RGPD (UE) 2016/679** — Reglamento General de Protección de Datos
- **LOPDGDD 3/2018** — Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales (España)
- **Autoridad**: Agencia Española de Protección de Datos (AEPD)

**Requisitos confirmados del consentimiento RGPD válido** (AEPD FAQ-0211, [aepd.es](https://www.aepd.es/preguntas-frecuentes/2-rgpd/4-consentimiento-de-los-interesados/FAQ-0211-segun-el-rgpd-como-debe-solicitarse-el-consentimiento-de-los-interesados-para-tratar-sus-datos-personales) [N1 ✓ FULL TEXT]):
- **Inequívoco**: manifestación explícita o acción afirmativa clara (NO casillas premarcadas)
- **Libre e informado**
- **Revocable**
- **Documentado**: el responsable debe poder probar que se obtuvo
- **Lenguaje claro**: simple y comprensible
- Cuando va en una declaración escrita más amplia, **el apartado de datos debe estar claramente diferenciado** del resto

**La AEPD no establece un procedimiento simplificado específico para "investigación de bajo riesgo / test de usabilidad"** — la regla general aplica.

### Modelo simplificado de consentimiento para TFG (síntesis práctica)

Para una sesión de test de usabilidad de un TFG ingenieril (no es investigación clínica ni psicológica formal, sino validación de un producto software desarrollado por el estudiante), el consentimiento mínimo debe incluir:

1. **Identidad del responsable** (estudiante + tutor + universidad)
2. **Finalidad**: validación de la usabilidad de la aplicación X como parte del TFG
3. **Datos tratados**: respuestas a cuestionarios, grabación de audio/pantalla (si aplica), datos demográficos no identificativos
4. **Base jurídica**: consentimiento expreso del interesado (Art. 6.1.a RGPD)
5. **Conservación**: hasta defensa del TFG + 1 año (justificable como periodo de evaluación)
6. **Derechos**: acceso, rectificación, supresión, oposición, portabilidad (Art. 15-22 RGPD)
7. **Anonimización**: compromiso de no publicar datos identificativos en la memoria
8. **Firma del participante** y fecha

**Diferenciación clave**:
- **NO es investigación académica formal** → no requiere paso por CEIH-UV (Comité Ético de Investigación en Humanos).
- **SÍ es tratamiento de datos personales** → aplica RGPD/LOPDGDD íntegramente.
- La UCM, UGR, UV y otras universidades publican modelos de consentimiento para TFG/TFM ([guía DPD UCM](https://www.ucm.es/dpd/file/guia-actuaciontratamiento-datos-personales-tesis-tfg-y-tfm) referenciada [N2 ~ ABSTRACT], PDF no parseable).

**Conservación de datos**: buenas prácticas no normativas en TFG:
- Audios/transcripciones: anonimizar inmediatamente tras transcribir; destruir los originales tras la defensa.
- Datos cuantitativos (SUS, tiempos): conservar en formato agregado para reproducibilidad.
- Nunca incluir vídeos/audios con caras o voces identificables en la memoria pública.

---

## Bibliografía clasificada

### N1 — Papers peer-reviewed / Normativa con valor de ley

| # | Cita | URL | Aporte |
|---|------|-----|--------|
| 1 | Sevilla-González MDR et al. (2020). "Spanish Version of the System Usability Scale for the Assessment of Electronic Tools". *JMIR Human Factors* 7(4):e21161. DOI: 10.2196/21161 | [humanfactors.jmir.org](https://humanfactors.jmir.org/2020/4/e21161/) | Validación N1 del SUS castellano |
| 2 | AEPD (s/f). "FAQ-0211: Según el RGPD, ¿cómo debe solicitarse el consentimiento?" | [aepd.es](https://www.aepd.es/preguntas-frecuentes/2-rgpd/4-consentimiento-de-los-interesados/FAQ-0211-segun-el-rgpd-como-debe-solicitarse-el-consentimiento-de-los-interesados-para-tratar-sus-datos-personales) | Requisitos legales del consentimiento RGPD |

### N2 — Instituciones oficiales (universidades españolas, AEPD)

| # | Cita | URL | Aporte |
|---|------|-----|--------|
| 3 | Universitat de València (s/f). "Plan de estudios Grado en Ingeniería Multimedia" | [uv.es](https://www.uv.es/uvweb/college/en/undergraduate-studies/undergraduate-studies-/degree-programmes-offered/degree-multimedia-engineering-1285846094474/Titulacio.html?id=1286036744473&p2=2) | Plan oficial confirmado: IPO 34839 (2º curso, 6 ECTS), Diseño de Proyectos Interactivos 34851, Ingeniería del Software 34840 |
| 4 | UNIR (2024-25). "Guía docente Interacción Persona-Ordenador, Grado Ingeniería Informática" | [unir.net](https://static.unir.net/guias_espana/gii19_interaccion_persona_ordenador.htm) | Bibliografía canónica española confirmada en texto: Lorés/AIPO, Hassan & Martín, Krug, Nielsen |
| 5 | Universidad de Granada (s/f). "Guía Docente Diseño de Interfaces de Usuario 296114E" | [grados.ugr.es](https://grados.ugr.es/ramas/ingenieria-arquitectura/grado-ingenieria-informatica/diseno-interfaces-usuario-especialidad-ingenieria-del-software/guia-docente) | Bibliografía: Lorés 2001, Shneiderman 2006, Dix 2003 |
| 6 | UV. "Estructura del TFG" | [uv.es](https://www.uv.es/uv-teaching/en/subject-planning/degree-final-project/atencio-i-guia-a-l-estudiantat/estructura-tfg.html) | Estructura genérica UV: 8 secciones obligatorias |
| 7 | URJC (2024-25). "Guía docente Interacción Persona-Ordenador" | [urjc.es](https://servicios.urjc.es/guiasdocentes/pdfGuia.jsp?txtAsignatura=2032024&txtTitulacion=2032&txtCursoAcademico=2024-25) | Asignatura organizada en 3 bloques: DCU, usabilidad/accesibilidad, evaluación |
| 8 | UV (s/f). "Course Guide 34839 Human Computer Interaction" | [webges.uv.es](https://webges.uv.es/uvGuiaDocenteWeb/guia?APP=uvGuiaDocenteWeb&ACTION=MOSTRARGUIA.M&MODULO=34839&CURSOACAD=2024&IDIOMA=I) | Existencia de la guía confirmada vía metadatos; contenido PDF no parseable. |
| 9 | UV (s/f). "Guía Docente 34840 Ingeniería del Software" | [webges.uv.es](https://webges.uv.es/uvGuiaDocenteWeb/guia?APP=uvGuiaDocenteWeb&ACTION=MOSTRARGUIA.M&MODULO=34840&CURSOACAD=2019&IDIOMA=C) | Confirma proceso unificado de desarrollo; PDF no parseable |
| 10 | AEPD. "Guía para el cumplimiento del deber de informar" | [aepd.es](https://www.aepd.es/guias/guia-modelo-clausula-informativa.pdf) | Modelo cláusula informativa RGPD; PDF no parseable |
| 11 | UCM Delegado Protección de Datos. "Guía de actuación para tratamiento de datos personales en tesis, TFG y TFM" | [ucm.es](https://www.ucm.es/dpd/file/guia-actuaciontratamiento-datos-personales-tesis-tfg-y-tfm) | Guía universitaria específica TFG/TFM |

### N3a — Ponencias de congreso académico

| # | Cita | URL | Aporte |
|---|------|-----|--------|
| 12 | Rodríguez-Triana MJ, Muñoz-Cristóbal JA, Cardeñoso-Payo V, Martínez-Monés A, Gallardo J (eds.) (2025). "Compendio de Comunicaciones del XXV Congreso Internacional de Interacción Persona-Ordenador (INTERACCIÓN 2025)". UVa, Valladolid | [uvadoc.uva.es](https://uvadoc.uva.es/handle/10324/77999) | Compendio oficial del congreso anual AIPO 2025 |
| 13 | AIPO. "Revista Interacción" (ISSN 2695-6578). Vol 5 No 1 (2024) | [revista.aipo.es](https://revista.aipo.es/index.php/INTERACCION/issue/view/9) | Revista peer-reviewed española de IPO |

### N4 — Manuales castellanos canónicos (literatura gris de calidad)

| # | Cita | URL | Aporte |
|---|------|-----|--------|
| 14 | Hassan-Montero, Y. (2015). *Experiencia de Usuario: Principios y Métodos*. Autoedición. 140 pp. ISBN 978-1520368221 | [yusef.es](https://yusef.es/Experiencia_de_Usuario.pdf) | Manual UX más citado en castellano. PDF libre. Contiene capítulos sobre evaluación heurística y pruebas con usuarios. |
| 15 | Lorés, J. (Ed.) (2001). *La Interacción Persona-Ordenador*. AIPO, Lleida. ISBN 84-607-2255-4 | Referenciado en [mpiua.invid.udl.cat](https://mpiua.invid.udl.cat/la-interaccion-persona-ordenador/) | Libro fundacional AIPO, citado en docencia UNIR, UGR |
| 16 | Granollers T, Lorés J, Cañas JJ (2005). *Diseño de sistemas interactivos centrados en el usuario*. Editorial UOC, Barcelona. 277 pp. ISBN 84-9788-320-7 | [editorial UOC](https://www.torrossa.com/en/resources/an/2515479) | Manual DCU castellano canónico. Origen del MPIu+a |
| 17 | Granollers T, GRIHO (s/f). "Curso de Interacción Persona-Ordenador / MPIu+a" | [mpiua.invid.udl.cat](https://mpiua.invid.udl.cat/) | Curso online abierto en castellano; recurso docente español de referencia. Incluye fichas de evaluación heurística y think-aloud. |
| 18 | Hassan-Montero Y, Ortega-Santamaría S (2009). *Informe APEI sobre Usabilidad*. APEI | [dialnet](https://dialnet.unirioja.es/servlet/libro?codigo=376173) | Manual previo en castellano, también citado en docencia universitaria |
| 19 | Casado C, Garreta M, Hassan-Montero Y, Martínez L, Mor E (2011). *Interacción Persona-Ordenador*. FUOC | [academia.edu](https://www.academia.edu/31347135/Interaccion_Persona_Ordenador) | Material docente UOC en 4 módulos |
| 20 | Hassan Y & Martín FJ (2003). "Guía de Evaluación Heurística de Sitios Web" | (citada en guía UNIR) | Adaptación temprana de Nielsen al castellano |

### N5 — Web/blogs especializados

| # | Cita | URL | Aporte |
|---|------|-----|--------|
| 21 | Olga Carreras (2015). "Reseña Experiencia de Usuario: Principios y Métodos" (Blog Usable y accesible) | [olgacarreras.blogspot.com](https://olgacarreras.blogspot.com/2015/02/resena-experiencia-de-usuario.html) | Reseña detallada del libro de Hassan-Montero |
| 22 | MeasuringU — "5 Ways to Interpret a SUS Score" | [measuringu.com](https://measuringu.com/interpret-sus-score/) | Benchmarks SUS de Sauro & Lewis 2016 |
| 23 | Aguayo blog — "Por qué solo necesitas testear con 5 usuarios" (Nielsen) | [aguayo.co](https://aguayo.co/es/blog-aguayo-experiencia-usuario/teoria-nielsen-norman-pruebas-usabilidad-5-usuarios/) | Divulgación canónica de la regla Nielsen 5 usuarios en castellano |
| 24 | Torresburriel Estudio — "Think Aloud: ventajas y desventajas" | [torresburriel.com](https://torresburriel.com/weblog/test-think-aloud-ventajas-y-desventajas/) | Material práctico think-aloud en castellano |
| 25 | Sánchez Cervera V (2025). TFG "Desarrollo de una aplicación web para la gestión de pistas y eventos de un club de pádel". UPV | [riunet.upv.es](https://riunet.upv.es/server/api/core/bitstreams/ba078ce5-eefe-46e8-b3ff-4a8201b91d85/content) | TFG ingenieril español con evaluación heurística Nielsen + validación con usuarios (snippet confirmado, PDF parcial) |

---

## Fortaleza de evidencia

| Conclusión | Fuentes (nivel + stance) | Metodología más alta | Valoración |
|-----------|--------------------------|---------------------|-----------|
| La asignatura IPO existe en el plan ETSE-UV con código 34839, 6 ECTS, 2º curso | N2 ✓ (UV plan oficial), N2 ✓ (webges) | Documento oficial UV | Sólida |
| El canon docente español incluye Lorés/AIPO, Hassan-Montero, Nielsen, Krug | N2 ✓ (UNIR), N2 ✓ (UGR), N4 ✓ (Hassan) | Múltiples guías docentes oficiales convergentes | Sólida |
| El SUS castellano validado es Sevilla-González 2020 | N1 ✓ (JMIR Human Factors) | Paper peer-reviewed con análisis psicométrico | Sólida |
| Umbral SUS ≥ 68 = "above average" | N5 ✓ (Sauro & Lewis vía MeasuringU) | Estudio con 241 productos (Sauro & Lewis 2016, fuente original no leída) | Moderada — la cita original es N1, pero solo se accedió vía resumen N5 |
| Regla Nielsen 5 usuarios = 85% problemas | N5 ✓ múltiples blogs | NN/g whitepaper 2000 (no leído directo) | Moderada — fuente original es NN/g; aquí solo divulgaciones |
| MPIu+a es referencia docente española en castellano | N4 ✓ (web GRIHO), N2 ~ (citado en guías) | Curso online abierto + tesis Granollers 2004 | Sólida para uso docente; weak ECONNREFUSED en algunos fetches |
| TFGs ingenieriles españoles usan habitualmente Nielsen heurísticas + test usuarios | N2 ~ (TFG Sánchez Cervera 2025 snippet), N5 ✓ (literatura docente) | Snippet de TFG + currículum docente | Moderada — falta benchmark cuantitativo de TFGs ETSE-UV |
| RGPD aplica a TFG con datos personales sin procedimiento simplificado oficial | N1 ✓ (AEPD FAQ-0211) | FAQ oficial AEPD | Sólida |
| AIPO concede premios anuales a TFGs de HCI | N2 ✓ (web AIPO) | Web institucional | Sólida |

---

## Aplicabilidad directa al TFG

**Para el capítulo 3 (Marco teórico / Estado del arte)** del TFG en la ETSE-UV, las fuentes citables directamente con peso académico son:

1. **Lorés, J. (Ed.) (2001/2002). *La interacción persona-ordenador*. AIPO. ISBN 84-607-2255-4.** — la cita canónica para fundamentar IPO en castellano. Es el equivalente español al "Dix et al." inglés y aparece en casi toda guía docente española.

2. **Granollers, T., Lorés, J. & Cañas, J. J. (2005). *Diseño de sistemas interactivos centrados en el usuario*. Editorial UOC.** — manual de DCU específicamente español. Útil para justificar el enfoque metodológico DCU del proyecto.

3. **Hassan-Montero, Y. (2015). *Experiencia de Usuario: Principios y Métodos*. PDF libre en yusef.es.** — el manual de UX en castellano más citado en el ecosistema profesional español. Combina rigor y accesibilidad. Útil para justificar conceptos de UX más allá de la usabilidad clásica.

4. **Sevilla-González MDR et al. (2020). "Spanish Version of the System Usability Scale". *JMIR Human Factors* 7(4):e21161.** — única cita N1 (peer-reviewed) para justificar el uso del SUS castellano. Imprescindible si se administra el SUS.

5. **Granollers, T. y GRIHO (UdL). MPIu+a — Modelo de Proceso de la Ingeniería de la Usabilidad y de la Accesibilidad. https://mpiua.invid.udl.cat** — útil como modelo de proceso citable para justificar la integración Ingeniería del Software + IPO + Accesibilidad (alineamiento natural con un TFG de Ingeniería Multimedia ETSE-UV).

**Para el capítulo 6 (Pruebas y Resultados)**:

- El diseño que cita Nielsen NN/g (5 usuarios = 85% problemas) debe **acompañarse con cita académica si es posible**: el paper original es Nielsen & Landauer (1993) o Virzi (1992); los snippets divulgativos N5 solo deben usarse como contexto, no como fuente principal.
- El umbral SUS ≥ 68 debe citarse como **Sauro & Lewis (2016). *Quantifying the User Experience*. Morgan Kaufmann.** (la fuente primaria, aunque no fue leída en esta investigación — se accedió vía MeasuringU). Si se cita N5 solamente, indicar la limitación.

---

## Trámites mínimos a considerar

Lista accionable, sin protocolos académicos formales (no es CEIH-UV, no es IRB):

1. **Hoja de información al participante (1 página)** que incluya: quién (estudiante + tutor + universidad), qué (test de usabilidad de la app del TFG), para qué (validación), datos que se recogen, duración estimada, voluntariedad, derecho a retirarse.

2. **Cláusula de consentimiento RGPD diferenciada** (no embebida en otras frases): "He sido informado/a y consiento expresamente el tratamiento de mis datos para los fines descritos. ☐ Sí". Firma y fecha.

3. **Apartado específico de grabación** si aplica: "Consiento que se grabe el audio de la sesión (think-aloud) con la finalidad de transcribirlo. La grabación será destruida tras la transcripción. ☐ Sí ☐ No".

4. **Anonimización del set de datos**: los participantes son P01, P02... en la memoria. Ningún nombre, ningún rostro, ningún audio identificable en la versión pública del TFG.

5. **Mención al tutor en la información**: legitima el ejercicio académico ante el participante.

6. **Conservación**: archivar el consentimiento firmado (físico o digital) hasta defensa + 1 año. Destruir audios originales tras transcripción. Los datos cuantitativos agregados (SUS scores, tiempos) pueden conservarse indefinidamente al no ser identificativos.

7. **No es necesario pasar por CEIH-UV** (Comité Ético de Investigación en Humanos) si el TFG se enmarca como **proyecto de desarrollo de software** y no como **investigación con sujetos humanos**. La línea es: si los datos del usuario son medios para validar el producto (objetivo: mejorar la app), es desarrollo; si los datos del usuario son el objeto del estudio (objetivo: producir conocimiento generalizable sobre el comportamiento humano), es investigación. La diferencia se justifica en la metodología del TFG.

8. **No publicar datos identificables en RODERIC**: cuando el TFG se deposite en RODERIC, asegurar que la memoria no contiene datos personales de los participantes. Anexos sensibles (consentimientos firmados originales) NO se incluyen en el documento público; se entregan separadamente al tutor.
