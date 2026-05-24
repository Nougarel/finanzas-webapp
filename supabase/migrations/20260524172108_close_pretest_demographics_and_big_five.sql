-- ============================================================
-- Migración 004 — Cierre de demografía + Big Five completo (M18 Fase 3)
--
-- Contexto: Fase 3 ha cerrado los instrumentos del cuestionario M-D1
-- mediante investigación bibliográfica (Hospido et al. 2023 para Big Three,
-- Lusardi & Mitchell 2011 + GFLEC para preguntas adicionales del Big Five,
-- Castilla et al. 2023 para SUS en español, INE EPA 2021 + OECD/INFE 2022
-- para employment_status). Esta migración aterriza esas decisiones en BBDD.
--
-- Cambios (todos sobre pretest_responses):
--   1. Modificar CHECK de age_range para usar nomenclatura final del dossier
--      ('under_25' y '65_plus' en lugar de 'under25' y 'over65').
--   2. Modificar CHECK de gender (4 → 3 valores, sin 'non_binary').
--   3. Modificar CHECK de education_level con 6 valores finales alineados
--      con dossier (separa bachillerato/FP, añade 'no_formal_education').
--   4. Cerrar CHECK de employment_status (9 valores oficiales EPA + OECD/INFE).
--   5. Añadir columna household_composition con CHECK (6 valores del dossier).
--   6. Añadir columna prior_financial_app_use (boolean nullable).
--   7. Añadir columnas big_five_q4 y big_five_q5 (boolean nullable).
--      Las 3 columnas big_three_qN existentes (de migración 001) se mantienen
--      y forman, junto con estas 2, el Big Five completo (3 validadas en ES
--      + 2 traducidas desde versión americana — limitación documentada en
--      el dossier sección 13.2).
--
-- Pre-requisito ejecutado antes de esta migración:
--   TRUNCATE de las 5 tablas para purgar datos dummy del Bloque C de Fase 2
--   (deuda técnica documentada). Sin TRUNCATE, los nuevos CHECKs rechazarían
--   las filas dummy con valores arbitrarios o legacy.
--
-- Decisión arquitectónica: migración aditiva pequeña (ADR-04). El alineamiento
-- con la nomenclatura del dossier prefiere reflejar el contrato del cuestionario
-- antes que mantener nomenclatura técnica anterior.
-- ============================================================

-- ============================================================
-- 0. TRUNCATE PREVENTIVO de las 5 tablas (deuda técnica de Fase 2)
--
-- Los datos dummy generados por los 8 escenarios x 2 navegadores del Bloque C
-- de Fase 2 contienen valores arbitrarios (e.g., gender='non_binary',
-- age_range con nomenclatura legacy) que harían fallar los CHECK nuevos.
-- Decisión documentada: adelantar el TRUNCATE de Fase 5.5 a Fase 3 para
-- desbloquear esta migración.
--
-- CASCADE no es necesario aquí (RESTART IDENTITY tampoco, no usamos secuencias),
-- pero se respeta el patrón documentado en el plan M18 para coherencia.
-- ============================================================
TRUNCATE session_events, posttest_responses, app_interactions, pretest_responses, research_sessions RESTART IDENTITY CASCADE;

-- --- 1. age_range: alinear nomenclatura con dossier -----------
ALTER TABLE pretest_responses DROP CONSTRAINT IF EXISTS pretest_responses_age_range_check;
ALTER TABLE pretest_responses ADD CONSTRAINT age_range_valid
    CHECK (age_range IN ('under_25','25_34','35_44','45_54','55_64','65_plus'));

-- --- 2. gender: 4 → 3 valores (sin non_binary) ----------------
ALTER TABLE pretest_responses DROP CONSTRAINT IF EXISTS pretest_responses_gender_check;
ALTER TABLE pretest_responses ADD CONSTRAINT gender_valid
    CHECK (gender IN ('male','female','prefer_not_to_say'));

-- --- 3. education_level: alinear con dossier (6 valores) ------
ALTER TABLE pretest_responses DROP CONSTRAINT IF EXISTS pretest_responses_education_level_check;
ALTER TABLE pretest_responses ADD CONSTRAINT education_level_valid
    CHECK (education_level IN (
        'no_formal_education',
        'primary',
        'secondary',
        'higher_secondary',
        'university',
        'postgraduate'
    ));

-- --- 4. employment_status: cerrar CHECK (9 valores EPA + OECD) -
ALTER TABLE pretest_responses ADD CONSTRAINT employment_status_valid
    CHECK (employment_status IN (
        'employed_full_time',
        'employed_part_time',
        'self_employed',
        'student',
        'unemployed',
        'retired',
        'homemaker',
        'unable_to_work',
        'other'
    ));

-- --- 5. household_composition: nueva columna con CHECK (6 vals) -
ALTER TABLE pretest_responses ADD COLUMN household_composition text NOT NULL
    DEFAULT 'other'
    CHECK (household_composition IN (
        'living_alone',
        'couple_no_children',
        'couple_with_children',
        'single_parent',
        'shared_housing',
        'with_parents_or_family'
    ));

-- --- 6. prior_financial_app_use: nueva columna boolean --------
ALTER TABLE pretest_responses ADD COLUMN prior_financial_app_use boolean;

-- --- 7. Big Five q4 y q5: nuevas columnas boolean -------------
ALTER TABLE pretest_responses ADD COLUMN big_five_q4 boolean;
ALTER TABLE pretest_responses ADD COLUMN big_five_q5 boolean;

-- ============================================================
-- COMMENT ON COLUMN para las nuevas columnas (material académico)
-- ============================================================
COMMENT ON COLUMN pretest_responses.household_composition IS
  'Composicion del hogar. Preguntado explicitamente al participante (no derivado del perfil de la app, para evitar contaminacion del estudio con datos de pruebas).';

COMMENT ON COLUMN pretest_responses.prior_financial_app_use IS
  'Si el participante ha usado antes alguna aplicacion de finanzas personales. Util para segmentar SUS por experiencia previa con apps similares (analisis estandar HCI).';

COMMENT ON COLUMN pretest_responses.big_five_q4 IS
  'Big Five (Lusardi & Mitchell 2011) - relacion tipo de interes y precio de los bonos. Traduccion desde version americana original (GFLEC), no validada psicometricamente en espanol de Espana (limitacion documentada en dossier seccion 13.2).';

COMMENT ON COLUMN pretest_responses.big_five_q5 IS
  'Big Five (Lusardi & Mitchell 2011) - coste total de hipoteca a 15 vs 30 anos. Traduccion desde version americana original (GFLEC), no validada psicometricamente en espanol de Espana (limitacion documentada en dossier seccion 13.2).';
