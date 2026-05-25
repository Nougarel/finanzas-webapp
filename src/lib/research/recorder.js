// src/lib/research/recorder.js

/**
 * Recorder: funciones puras de escritura para el sistema de research M-D1.
 *
 * Contrato:
 *   - Recibe el cliente Supabase como argumento (no lo importa internamente)
 *   - Devuelve { data, error } estilo Supabase (no lanza excepciones)
 *   - Validación mínima estructural (sessionId no vacío, enums, longitudes de arrays)
 *   - La autoridad final es la BBDD (defense in depth: RLS + CHECK)
 *
 * Mapeo de errores a códigos propios:
 *   - { code: 'INVALID_INPUT', message, raw: null } — validación cliente
 *   - { code: 'RLS_DENIED', message, raw }         — Postgres devuelve null sin error
 *   - { code: 'CONSTRAINT_VIOLATION', message, raw } — Postgres 23505/23514
 *   - { code: 'NETWORK', message, raw }            — fetch falla
 *   - { code: 'UNKNOWN', message, raw }            — cualquier otro
 */

const FLOW_TYPES = ['direct', 'inverse', 'diagnosis'];
const EVENT_TYPES = [
  'session_started',
  'pretest_completed',
  'app_interaction',
  'app_completed',
  'posttest_completed',
  'session_abandoned',
];
const SESSION_STATUSES = ['started', 'pretest_done', 'app_done', 'completed', 'abandoned'];

function makeError(code, message, raw = null) {
  return { code, message, raw };
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.length > 0;
}

function mapSupabaseError(error) {
  if (!error) return null;
  if (error.code === '23505' || error.code === '23514') {
    return makeError('CONSTRAINT_VIOLATION', error.message, error);
  }
  if (error.code === '42501') {
    return makeError('RLS_DENIED', error.message, error);
  }
  if (error.message && /fetch|network/i.test(error.message)) {
    return makeError('NETWORK', error.message, error);
  }
  return makeError('UNKNOWN', error.message ?? 'Unknown error', error);
}

/**
 * Inserta una fila en pretest_responses.
 * @param {object} client - cliente Supabase con auth activa
 * @param {string} sessionId - UUID de la sesión asociada
 * @param {object} data - { age_range, gender, education_level, employment_status,
 *                          big_three_q1, big_three_q2, big_three_q3, extra_responses }
 */
export async function submitPretest(client, sessionId, data) {
  if (!isNonEmptyString(sessionId)) {
    return { data: null, error: makeError('INVALID_INPUT', 'sessionId vacío o inválido') };
  }
  // UPSERT en lugar de INSERT: pretest_responses tiene UNIQUE(session_id).
  // Si el participante reintenta tras un error o reabre la sesión Supabase
  // persistida en localStorage, la 2ª escritura sería un 23505. Idempotente
  // por diseño: la última respuesta válida sobrescribe la anterior.
  const { data: row, error } = await client
    .from('pretest_responses')
    .upsert({ session_id: sessionId, ...data }, { onConflict: 'session_id' })
    .select()
    .single();

  if (error) return { data: null, error: mapSupabaseError(error) };
  if (!row) return { data: null, error: makeError('RLS_DENIED', 'Upsert devolvió null sin error') };
  return { data: row, error: null };
}

/**
 * Inserta una fila en app_interactions.
 * @param {object} client
 * @param {string} sessionId
 * @param {object} payload - { flowType, profileSnapshot, input, output, durationMs }
 */
export async function recordInteraction(client, sessionId, payload) {
  if (!isNonEmptyString(sessionId)) {
    return { data: null, error: makeError('INVALID_INPUT', 'sessionId vacío o inválido') };
  }
  const { flowType, profileSnapshot, input, output, durationMs } = payload ?? {};
  if (!FLOW_TYPES.includes(flowType)) {
    return { data: null, error: makeError('INVALID_INPUT', `flowType debe ser uno de ${FLOW_TYPES.join(', ')}`) };
  }
  // Import dinámico para evitar ciclo con calculators/version
  const { ENGINE_VERSION } = await import('@/lib/calculators/version');
  const { data: row, error } = await client
    .from('app_interactions')
    .insert({
      session_id: sessionId,
      flow_type: flowType,
      engine_version: ENGINE_VERSION,
      profile_snapshot: profileSnapshot ?? {},
      input_payload: input ?? {},
      output_payload: output ?? {},
      duration_ms: typeof durationMs === 'number' ? durationMs : null,
    })
    .select()
    .single();

  if (error) return { data: null, error: mapSupabaseError(error) };
  if (!row) return { data: null, error: makeError('RLS_DENIED', 'Insert devolvió null sin error') };
  return { data: row, error: null };
}

/**
 * Inserta una fila en posttest_responses.
 * @param {object} client
 * @param {string} sessionId
 * @param {object} data - { sus_responses (array de 10 enteros 1-5), adhoc_responses,
 *                          qualitative_feedback, would_recommend }
 */
export async function submitPosttest(client, sessionId, data) {
  if (!isNonEmptyString(sessionId)) {
    return { data: null, error: makeError('INVALID_INPUT', 'sessionId vacío o inválido') };
  }
  if (!Array.isArray(data?.sus_responses) || data.sus_responses.length !== 10) {
    return { data: null, error: makeError('INVALID_INPUT', 'sus_responses debe ser array de 10 elementos') };
  }
  // UPSERT por la misma razón que submitPretest: posttest_responses tiene
  // UNIQUE(session_id) y queremos tolerar reintentos / sesiones reusadas.
  const { data: row, error } = await client
    .from('posttest_responses')
    .upsert({ session_id: sessionId, ...data }, { onConflict: 'session_id' })
    .select()
    .single();

  if (error) return { data: null, error: mapSupabaseError(error) };
  if (!row) return { data: null, error: makeError('RLS_DENIED', 'Upsert devolvió null sin error') };
  return { data: row, error: null };
}

/**
 * Inserta un evento en session_events (append-only).
 * @param {object} client
 * @param {string} sessionId
 * @param {string} eventType - uno de EVENT_TYPES
 * @param {object} payload - metadata opcional del evento
 */
export async function logEvent(client, sessionId, eventType, payload = {}) {
  if (!isNonEmptyString(sessionId)) {
    return { data: null, error: makeError('INVALID_INPUT', 'sessionId vacío o inválido') };
  }
  if (!EVENT_TYPES.includes(eventType)) {
    return { data: null, error: makeError('INVALID_INPUT', `eventType debe ser uno de ${EVENT_TYPES.join(', ')}`) };
  }
  const { data: row, error } = await client
    .from('session_events')
    .insert({ session_id: sessionId, event_type: eventType, payload })
    .select()
    .single();

  if (error) return { data: null, error: mapSupabaseError(error) };
  if (!row) return { data: null, error: makeError('RLS_DENIED', 'Insert devolvió null sin error') };
  return { data: row, error: null };
}

/**
 * Actualiza el status en research_sessions (único UPDATE permitido para metadatos no críticos).
 * @param {object} client
 * @param {string} sessionId
 * @param {string} newStatus - uno de SESSION_STATUSES
 */
export async function updateSessionStatus(client, sessionId, newStatus) {
  if (!isNonEmptyString(sessionId)) {
    return { data: null, error: makeError('INVALID_INPUT', 'sessionId vacío o inválido') };
  }
  if (!SESSION_STATUSES.includes(newStatus)) {
    return { data: null, error: makeError('INVALID_INPUT', `newStatus debe ser uno de ${SESSION_STATUSES.join(', ')}`) };
  }
  const { data: row, error } = await client
    .from('research_sessions')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) return { data: null, error: mapSupabaseError(error) };
  if (!row) return { data: null, error: makeError('RLS_DENIED', 'Update devolvió null sin error') };
  return { data: row, error: null };
}
