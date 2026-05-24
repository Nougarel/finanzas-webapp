"use client";

// src/lib/research/useStudyRecorder.js

import { useCallback, useMemo } from "react";
import { createStudyClient } from "@/lib/supabase/studyClient";
import { useStudyContext } from "@/lib/research/useStudyContext";
import * as recorder from "@/lib/research/recorder";

/**
 * Hook que expone las funciones del recorder ya enlazadas al sessionId
 * del contexto. El cliente Supabase se crea una vez por consumidor
 * (memoizado) y se reutiliza entre llamadas.
 *
 * No expone el cliente Supabase directamente: cualquier escritura tiene
 * que pasar por una de estas funciones (defense in depth).
 */
export function useStudyRecorder() {
  const { sessionId } = useStudyContext();
  const client = useMemo(() => createStudyClient(), []);

  const submitPretest = useCallback(
    (data) => recorder.submitPretest(client, sessionId, data),
    [client, sessionId]
  );

  const recordInteraction = useCallback(
    (flowType, profileSnapshot, input, output, durationMs = null) =>
      recorder.recordInteraction(client, sessionId, {
        flowType,
        profileSnapshot,
        input,
        output,
        durationMs,
      }),
    [client, sessionId]
  );

  const submitPosttest = useCallback(
    (data) => recorder.submitPosttest(client, sessionId, data),
    [client, sessionId]
  );

  const logEvent = useCallback(
    (eventType, payload = {}) =>
      recorder.logEvent(client, sessionId, eventType, payload),
    [client, sessionId]
  );

  const updateSessionStatus = useCallback(
    (newStatus) => recorder.updateSessionStatus(client, sessionId, newStatus),
    [client, sessionId]
  );

  return { submitPretest, recordInteraction, submitPosttest, logEvent, updateSessionStatus };
}
