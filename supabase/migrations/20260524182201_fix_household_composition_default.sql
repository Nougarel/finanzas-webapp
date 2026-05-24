-- ============================================================
-- Migración 005 — Fix: eliminar DEFAULT inválido de household_composition (M18 Fase 3)
--
-- Contexto: la migración 004 creó la columna household_composition con
-- DEFAULT 'other' + CHECK que NO incluye 'other'. La incongruencia no rompió
-- la migración (la tabla quedó vacía tras TRUNCATE) pero hace que cualquier
-- INSERT futuro sin especificar la columna falle con:
--   "violates check constraint pretest_responses_household_composition_check"
-- Detectado por la regression check de /debug/rls-test tras aplicar 004.
--
-- Fix: eliminar el DEFAULT. La columna sigue siendo NOT NULL — los inserts
-- futuros DEBEN especificar un valor explícito de los 6 válidos
-- (living_alone, couple_no_children, couple_with_children, single_parent,
--  shared_housing, with_parents_or_family). El cuestionario M-D1 lo recoge
-- como pregunta obligatoria (dossier sección 4.5), así que en producción
-- el cliente siempre envía un valor válido.
--
-- Por qué no añadir 'other' al CHECK como alternativa: el dossier no incluye
-- 'other' como opción del cuestionario (a diferencia de employment_status,
-- que sí lo tiene como válvula de escape). Las 6 opciones cubren los casos
-- principales de composición del hogar en España.
--
-- Lección documentable (TFG cap. 5.3): un DEFAULT debe siempre satisfacer
-- el CHECK de su propia columna. Si no, queda como bug latente que solo
-- aparece al insertar sin especificar el campo.
-- ============================================================

ALTER TABLE pretest_responses ALTER COLUMN household_composition DROP DEFAULT;

COMMENT ON COLUMN pretest_responses.household_composition IS
  'Composicion del hogar. Preguntado explicitamente al participante (no derivado del perfil de la app, para evitar contaminacion del estudio con datos de pruebas). NOT NULL sin DEFAULT: el cliente debe especificar siempre un valor de los 6 validos del CHECK.';
