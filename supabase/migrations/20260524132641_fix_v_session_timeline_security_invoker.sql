-- ============================================================
-- Migración 002 — Fix: v_session_timeline a SECURITY INVOKER (M18 Fase 2)
--
-- Contexto: el Security Advisor de Supabase detectó que la vista
-- v_session_timeline (creada en la migración 001) se creó con la propiedad
-- SECURITY DEFINER por defecto de PostgreSQL. Ese modo ejecuta la vista
-- con permisos del creador (rol postgres admin), bypassando RLS de las
-- tablas subyacentes.
--
-- Para nuestro modelo arquitectónico de Opción D (ADR-02), donde RLS
-- estructural basada en auth.uid() es el cierre de la falsificación de
-- propiedad, la vista DEBE ejecutarse con SECURITY INVOKER. De ese modo
-- las policies de research_sessions y session_events se aplican al
-- consultar la vista, garantizando que un usuario authenticated solo
-- ve sus propias sesiones.
--
-- Detectado por: Security Advisor de Supabase, regla 0010_security_definer_view
-- Referencia: https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view
-- ============================================================

ALTER VIEW public.v_session_timeline SET (security_invoker = on);

COMMENT ON VIEW public.v_session_timeline IS
'Línea temporal por sesión: primer timestamp de cada hito + duraciones derivadas. SECURITY INVOKER: respeta RLS de las tablas subyacentes.';
