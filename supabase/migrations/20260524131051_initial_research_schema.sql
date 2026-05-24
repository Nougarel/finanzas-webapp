-- ============================================================
-- Migración inicial — Esquema de research M-D1 (M18 Fase 2 Bloque B)
--
-- Decisión arquitectónica: Opción D (ADR-02)
--   - Anonymous Sign-Ins resuelve autoridad (auth.uid() firmado por JWT)
--   - Append-only events (session_events) protege integridad temporal del funnel
--   - UPDATE permitido en metadatos no críticos con RLS estricta
--
-- 5 tablas + 1 vista + RLS estricta + REVOKE explícito (defense in depth)
-- ============================================================

-- ============================================================
-- 1. research_sessions — agregado raíz
-- Una fila por participante anónimo. Todo lo demás cuelga de aquí.
-- ============================================================
CREATE TABLE public.research_sessions (
    -- UUID server-side como red de seguridad. El cliente puede generar y enviar
    -- su propio UUID; el DEFAULT cubre el caso de olvido o null.
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Anclaje estructural a auth.users. Sin esto, RLS no puede saber "es tuya".
    -- CASCADE: GDPR — si el usuario se borra, todo su rastro se va con él atómicamente.
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- timestamptz siempre (almacena en UTC, convierte al leer). Nunca timestamp sin TZ.
    created_at timestamptz NOT NULL DEFAULT now(),

    -- Para auditoría de metadatos. Se actualiza desde cliente o vía trigger futuro.
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- Estado del funnel denormalizado para queries rápidas.
    -- CHECK en lugar de ENUM por flexibilidad ante migraciones futuras.
    status text NOT NULL DEFAULT 'started'
        CHECK (status IN ('started','pretest_done','app_done','completed','abandoned')),

    -- Metadatos no consultados en filtros (user-agent, screen, locale, etc.).
    -- JSONB justificado porque NO haremos WHERE sobre estos campos.
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.research_sessions IS
'Agregado raíz: una fila por participante anónimo del estudio M-D1.';

-- ============================================================
-- 2. pretest_responses — demografía + Big Three (Lusardi & Mitchell)
-- Cardinalidad 1:1 con research_sessions (garantizado por UNIQUE).
-- ============================================================
CREATE TABLE public.pretest_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- UNIQUE: defensa contra doble-click o reintentos del cliente.
    session_id uuid NOT NULL UNIQUE
        REFERENCES public.research_sessions(id) ON DELETE CASCADE,

    created_at timestamptz NOT NULL DEFAULT now(),

    -- Demografía con CHECK para valores cerrados (instrumentos estándar).
    age_range text NOT NULL
        CHECK (age_range IN ('under25','25_34','35_44','45_54','55_64','over65')),

    -- gender nullable: 'no contesta' (NULL) se distingue de 'prefiere no decirlo' (respuesta explícita).
    gender text
        CHECK (gender IN ('male','female','non_binary','prefer_not_to_say')),

    education_level text NOT NULL
        CHECK (education_level IN ('primary','secondary','vocational','bachelor','master','phd')),

    -- Sin CHECK aún: el listado de empleos se cerrará en Fase 3 (diseño de cuestionarios).
    -- Migración aditiva futura: ALTER TABLE ... ADD CONSTRAINT ... CHECK (employment_status IN (...));
    employment_status text NOT NULL,

    -- Big Three (Lusardi & Mitchell): boolean porque para análisis solo importa correcto/incorrecto.
    -- Permite AVG(big_three_q1::int + big_three_q2::int + big_three_q3::int) directo.
    big_three_q1 boolean NOT NULL,
    big_three_q2 boolean NOT NULL,
    big_three_q3 boolean NOT NULL,

    -- Preguntas adicionales cuya forma puede evolucionar entre versiones del cuestionario.
    extra_responses jsonb NOT NULL DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.pretest_responses IS
'Respuestas del cuestionario inicial (demografía + Big Three). 1:1 con research_sessions.';

-- ============================================================
-- 3. app_interactions — registro polimórfico de cálculos
-- Cardinalidad 1:N (una sesión, múltiples cálculos).
-- Modelado: discriminador flow_type + payloads JSONB para flexibilidad por flujo.
-- ============================================================
CREATE TABLE public.app_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Sin UNIQUE: una sesión puede ejecutar múltiples cálculos (directo, inverso, diagnóstico).
    session_id uuid NOT NULL
        REFERENCES public.research_sessions(id) ON DELETE CASCADE,

    created_at timestamptz NOT NULL DEFAULT now(),

    -- Discriminador polimórfico. CHECK cierra los valores válidos.
    flow_type text NOT NULL
        CHECK (flow_type IN ('direct','inverse','diagnosis')),

    -- CRÍTICO para análisis longitudinal: si cambian pesos del LP solver entre versiones,
    -- los resultados antiguos no son comparables. Versionado manual desde el cliente.
    engine_version text NOT NULL,

    -- Snapshot inmutable del perfil en el momento del cálculo.
    -- No referenciamos tabla externa: si el usuario cambia su perfil, perderíamos contexto.
    profile_snapshot jsonb NOT NULL,

    -- Inputs del cálculo (forma exacta varía según flow_type — se define en Fase 5).
    input_payload jsonb NOT NULL,

    -- Resultado completo (distribución, score, alertas).
    output_payload jsonb NOT NULL,

    -- Tiempo de cálculo en cliente. Nullable: no todos los flujos lo miden inicialmente.
    duration_ms integer CHECK (duration_ms >= 0)
);

COMMENT ON TABLE public.app_interactions IS
'Registro polimórfico de cálculos (directo/inverso/diagnóstico) por sesión.';

-- ============================================================
-- 4. posttest_responses — SUS + bloque ad-hoc + cualitativo
-- Cardinalidad 1:1 con research_sessions (garantizado por UNIQUE).
-- ============================================================
CREATE TABLE public.posttest_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id uuid NOT NULL UNIQUE
        REFERENCES public.research_sessions(id) ON DELETE CASCADE,

    created_at timestamptz NOT NULL DEFAULT now(),

    -- SUS estándar (10 preguntas Likert 1-5). Modelado como array JSONB porque NO se
    -- filtra por preguntas individuales — siempre se agrega con fórmula SUS clásica.
    -- CHECK estructural: array de exactamente 10 elementos.
    sus_responses jsonb NOT NULL
        CHECK (jsonb_typeof(sus_responses) = 'array'
               AND jsonb_array_length(sus_responses) = 10),

    -- Preguntas específicas de la app, formato flexible (3-5 ítems Likert).
    adhoc_responses jsonb NOT NULL DEFAULT '{}'::jsonb,

    -- Feedback abierto. Nullable: opcional para el participante.
    qualitative_feedback text,

    -- NPS-lite opcional.
    would_recommend boolean
);

COMMENT ON TABLE public.posttest_responses IS
'Cuestionario final SUS + ad-hoc + cualitativo. 1:1 con research_sessions.';

-- ============================================================
-- 5. session_events — log APPEND-ONLY de hitos del funnel
-- Cardinalidad 1:N. Integridad temporal protegida por RLS (sin UPDATE ni DELETE).
-- ============================================================
CREATE TABLE public.session_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Sin UNIQUE en (session_id, event_type): permite secuencias repetidas en el futuro
    -- (resumed, reentry, etc.). Para 'el primer X' usar MIN(created_at) en vista.
    session_id uuid NOT NULL
        REFERENCES public.research_sessions(id) ON DELETE CASCADE,

    -- Es EL DATO principal, no metadato: cuándo ocurrió el hito.
    created_at timestamptz NOT NULL DEFAULT now(),

    -- Tipos de hito cerrados. Añadir uno requiere migración aditiva.
    event_type text NOT NULL CHECK (event_type IN (
        'session_started',
        'pretest_completed',
        'app_interaction',
        'app_completed',
        'posttest_completed',
        'session_abandoned'
    )),

    -- Detalles opcionales por evento (pantalla de abandono, flow_type de la interacción, etc.).
    payload jsonb NOT NULL DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.session_events IS
'Log APPEND-ONLY de hitos del funnel. Integridad temporal garantizada por RLS.';

-- ============================================================
-- 6. Vista v_session_timeline — reconstrucción de hitos por sesión
-- Hereda RLS de las tablas subyacentes automáticamente.
-- ============================================================
CREATE VIEW public.v_session_timeline AS
SELECT
    rs.id AS session_id,
    rs.created_by,
    rs.status,
    rs.created_at AS session_started_at,

    -- Primer timestamp de cada hito (MIN por si hubiera reentradas futuras).
    MIN(CASE WHEN se.event_type = 'pretest_completed'  THEN se.created_at END) AS pretest_completed_at,
    MIN(CASE WHEN se.event_type = 'app_completed'       THEN se.created_at END) AS app_completed_at,
    MIN(CASE WHEN se.event_type = 'posttest_completed'  THEN se.created_at END) AS posttest_completed_at,
    MIN(CASE WHEN se.event_type = 'session_abandoned'   THEN se.created_at END) AS abandoned_at,

    -- Conteo de cálculos ejecutados.
    COUNT(*) FILTER (WHERE se.event_type = 'app_interaction') AS interaction_count,

    -- Duraciones derivadas en segundos para análisis.
    EXTRACT(EPOCH FROM (
        MIN(CASE WHEN se.event_type = 'pretest_completed' THEN se.created_at END)
        - rs.created_at
    )) AS pretest_duration_seconds,

    EXTRACT(EPOCH FROM (
        MIN(CASE WHEN se.event_type = 'posttest_completed' THEN se.created_at END)
        - MIN(CASE WHEN se.event_type = 'app_completed'    THEN se.created_at END)
    )) AS posttest_duration_seconds
FROM public.research_sessions rs
LEFT JOIN public.session_events se ON se.session_id = rs.id
GROUP BY rs.id, rs.created_by, rs.status, rs.created_at;

COMMENT ON VIEW public.v_session_timeline IS
'Línea temporal por sesión: primer timestamp de cada hito + duraciones derivadas.';

-- ============================================================
-- 7. Índices manuales (los de PK y UNIQUE son automáticos en Postgres)
-- ============================================================

-- Crítico para RLS: cada policy filtra por created_by. Sin índice = seq-scan.
CREATE INDEX idx_research_sessions_created_by
    ON public.research_sessions(created_by);

-- Para fetch de 'todas las interacciones de una sesión' (sin UNIQUE, sin índice automático).
CREATE INDEX idx_app_interactions_session_id
    ON public.app_interactions(session_id);

-- Compuesto: optimiza la vista v_session_timeline (filtro + orden temporal por sesión).
CREATE INDEX idx_session_events_session_id_created_at
    ON public.session_events(session_id, created_at);

-- ============================================================
-- 8. Habilitar Row Level Security en las 5 tablas
-- Estado tras este bloque: nadie (excepto rol postgres admin) puede leer ni escribir.
-- Las policies de la siguiente sección abren accesos controlados.
-- ============================================================
ALTER TABLE public.research_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretest_responses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_interactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posttest_responses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_events      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. POLICIES — 14 en total
--   research_sessions:  3 (SELECT, INSERT, UPDATE)
--   pretest_responses:  3 (SELECT, INSERT, UPDATE)
--   app_interactions:   3 (SELECT, INSERT, UPDATE)
--   posttest_responses: 3 (SELECT, INSERT, UPDATE)
--   session_events:     2 (SELECT, INSERT — append-only)
-- DELETE bloqueado en todas (sin policy = denegado).
-- Rol authenticated (Anonymous Sign-Ins ya activado → participantes usan este rol).
-- ============================================================

-- ---------- research_sessions ----------
CREATE POLICY "sessions_select_own"
    ON public.research_sessions FOR SELECT TO authenticated
    USING (created_by = auth.uid());

CREATE POLICY "sessions_insert_own"
    ON public.research_sessions FOR INSERT TO authenticated
    WITH CHECK (created_by = auth.uid());

-- UPDATE: doble check impide secuestrar filas cambiando created_by.
CREATE POLICY "sessions_update_own"
    ON public.research_sessions FOR UPDATE TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- ---------- pretest_responses (pattern EXISTS) ----------
CREATE POLICY "pretest_select_own"
    ON public.pretest_responses FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = pretest_responses.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "pretest_insert_own"
    ON public.pretest_responses FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = pretest_responses.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "pretest_update_own"
    ON public.pretest_responses FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = pretest_responses.session_id AND rs.created_by = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = pretest_responses.session_id AND rs.created_by = auth.uid()
    ));

-- ---------- app_interactions (pattern EXISTS) ----------
CREATE POLICY "interactions_select_own"
    ON public.app_interactions FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = app_interactions.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "interactions_insert_own"
    ON public.app_interactions FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = app_interactions.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "interactions_update_own"
    ON public.app_interactions FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = app_interactions.session_id AND rs.created_by = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = app_interactions.session_id AND rs.created_by = auth.uid()
    ));

-- ---------- posttest_responses (pattern EXISTS) ----------
CREATE POLICY "posttest_select_own"
    ON public.posttest_responses FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = posttest_responses.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "posttest_insert_own"
    ON public.posttest_responses FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = posttest_responses.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "posttest_update_own"
    ON public.posttest_responses FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = posttest_responses.session_id AND rs.created_by = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = posttest_responses.session_id AND rs.created_by = auth.uid()
    ));

-- ---------- session_events (APPEND-ONLY: solo SELECT + INSERT) ----------
CREATE POLICY "events_select_own"
    ON public.session_events FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = session_events.session_id AND rs.created_by = auth.uid()
    ));

CREATE POLICY "events_insert_own"
    ON public.session_events FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.research_sessions rs
        WHERE rs.id = session_events.session_id AND rs.created_by = auth.uid()
    ));

-- NO se crean policies UPDATE ni DELETE en session_events → append-only por RLS.

-- ============================================================
-- 10. REVOKE explícito — defense in depth
-- RLS filtra filas; REVOKE quita el privilegio SQL crudo. Si en el futuro
-- alguien creara una policy permisiva por error, el REVOKE seguiría protegiendo.
-- ============================================================

-- Revocar DELETE en las 5 tablas para authenticated y anon (segunda capa).
REVOKE DELETE ON public.research_sessions   FROM authenticated, anon;
REVOKE DELETE ON public.pretest_responses   FROM authenticated, anon;
REVOKE DELETE ON public.app_interactions    FROM authenticated, anon;
REVOKE DELETE ON public.posttest_responses  FROM authenticated, anon;
REVOKE DELETE ON public.session_events      FROM authenticated, anon;

-- session_events: además revocar UPDATE para append-only a dos niveles.
REVOKE UPDATE ON public.session_events      FROM authenticated, anon;

-- Revocar TODO al rol anon: solo authenticated trabaja con estas tablas.
REVOKE ALL ON public.research_sessions   FROM anon;
REVOKE ALL ON public.pretest_responses   FROM anon;
REVOKE ALL ON public.app_interactions    FROM anon;
REVOKE ALL ON public.posttest_responses  FROM anon;
REVOKE ALL ON public.session_events      FROM anon;
