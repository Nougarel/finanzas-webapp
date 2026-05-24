-- ============================================================
-- Migración 003 — Añadir study_phase a research_sessions
--
-- Contexto: etiquetar cada sesión según la fase del proyecto en que se
-- generó, permitiendo separar análisis del estudio TFG vs producción futura
-- sin duplicar schemas ni BBDDs. El cliente lee la fase de env var
-- NEXT_PUBLIC_RESEARCH_PHASE y la inyecta al insertar.
--
-- Decisión arquitectónica: etiqueta semántica vs separación física
-- (descartadas: dos proyectos Supabase, dos schemas Postgres, mezcla sin distinguir)
-- ============================================================

ALTER TABLE public.research_sessions
  ADD COLUMN study_phase text NOT NULL DEFAULT 'tfg_mvp_study'
  CHECK (study_phase IN (
    'tfg_mvp_study',   -- M-D1: testeo del MVP del TFG
    'production_v1',   -- Post-TFG: primera versión "real" de la app
    'production_v2'    -- (futuras iteraciones)
  ));

COMMENT ON COLUMN public.research_sessions.study_phase IS
'Fase del proyecto en que se generaron los datos. Rellenado por el cliente desde env var NEXT_PUBLIC_RESEARCH_PHASE.';
