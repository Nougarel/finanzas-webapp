// src/lib/research/useStudySession.js
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createStudyClient } from "@/lib/supabase/studyClient";
import { logEvent } from "@/lib/research/recorder";

/**
 * Hook que orquesta la sesión anónima de research.
 *
 * Ciclo de vida:
 *   1. Comprueba si hay sesión Supabase persistida en localStorage
 *   2. Si no hay → signInAnonymously() crea usuario anónimo
 *   3. Busca o crea fila en research_sessions para ese auth.uid()
 *   4. Si crea una nueva, registra evento 'session_started' automáticamente
 *   5. Suscribe a onAuthStateChange para detectar refresh o sign-out
 *
 * Idempotencia:
 *   - flag `ignore` local previene setState tras unmount o re-run del effect
 *   - SELECT antes de INSERT evita duplicados entre pestañas
 *
 * retry() incrementa `retryTick`, lo que re-ejecuta el effect de forma controlada.
 *
 * Devuelve:
 *   { sessionId, userId, status, isLoading, error, retry }
 */
export function useStudySession() {
  const client = useMemo(() => createStudyClient(), []);

  const [retryTick, setRetryTick] = useState(0);
  const [state, setState] = useState({
    sessionId: null,
    userId: null,
    status: null,
    isLoading: true,
    error: null,
  });

  const retry = useCallback(() => {
    setState({ sessionId: null, userId: null, status: null, isLoading: true, error: null });
    setRetryTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function ensureSession() {
      try {
        // 1. Comprobar sesión existente
        let { data: { session } } = await client.auth.getSession();

        // 2. Si no hay sesión, hacer signInAnonymously
        if (!session) {
          const { data, error } = await client.auth.signInAnonymously();
          if (error) {
            if (ignore) return;
            const code = /anonymous/i.test(error.message) ? 'ANON_DISABLED' : 'UNKNOWN';
            setState({ sessionId: null, userId: null, status: null, isLoading: false,
                       error: { code, message: error.message, raw: error } });
            return;
          }
          session = data.session;
        }

        const userId = session?.user?.id;
        if (!userId) {
          if (ignore) return;
          setState({ sessionId: null, userId: null, status: null, isLoading: false,
                     error: { code: 'UNKNOWN', message: 'No se pudo obtener user.id', raw: null } });
          return;
        }

        // 3. Buscar fila existente en research_sessions
        const phase = process.env.NEXT_PUBLIC_RESEARCH_PHASE ?? 'tfg_mvp_study';
        const { data: existing, error: selectError } = await client
          .from('research_sessions')
          .select('id, status')
          .eq('created_by', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (selectError) {
          if (ignore) return;
          setState({ sessionId: null, userId, status: null, isLoading: false,
                     error: { code: 'UNKNOWN', message: selectError.message, raw: selectError } });
          return;
        }

        if (existing) {
          if (ignore) return;
          setState({ sessionId: existing.id, userId, status: existing.status,
                     isLoading: false, error: null });
          return;
        }

        // 4. No hay sesión: crear una nueva
        const { data: created, error: insertError } = await client
          .from('research_sessions')
          .insert({ created_by: userId, study_phase: phase })
          .select('id, status')
          .single();

        if (insertError) {
          if (ignore) return;
          const code = /network|fetch/i.test(insertError.message) ? 'NETWORK' : 'UNKNOWN';
          setState({ sessionId: null, userId, status: null, isLoading: false,
                     error: { code, message: insertError.message, raw: insertError } });
          return;
        }

        // 5. Registrar evento 'session_started' automáticamente (P10 aprobada)
        await logEvent(client, created.id, 'session_started', { study_phase: phase });

        if (ignore) return;
        setState({ sessionId: created.id, userId, status: created.status,
                   isLoading: false, error: null });

      } catch (err) {
        if (ignore) return;
        setState({ sessionId: null, userId: null, status: null, isLoading: false,
                   error: { code: 'UNKNOWN', message: err?.message ?? String(err), raw: err } });
      }
    }

    ensureSession();

    return () => { ignore = true; };
  }, [client, retryTick]);

  // Escuchar cambios de auth (refresh token, sign out)
  useEffect(() => {
    const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setState((s) => ({ ...s, error: { code: 'SESSION_LOST',
                          message: 'Sesión cerrada inesperadamente', raw: null } }));
      }
    });
    return () => subscription.unsubscribe();
  }, [client]);

  return { ...state, retry };
}
