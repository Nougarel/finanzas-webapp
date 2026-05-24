"use client";

import { useState, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudySession } from "@/lib/research/useStudySession";
import { createStudyClient } from "@/lib/supabase/studyClient";

/**
 * Página interna de validación empírica de RLS — 8 escenarios.
 *
 * Solo accesible en NODE_ENV !== "production" (gating en page.js).
 * Eliminable tras capturar evidencias para TFG cap. 5.3 (P5 aprobada).
 *
 * Escenarios (E1-E8):
 *   E1 — sin auth → todos los INSERTs deben FAIL
 *   E2 — con auth propia: INSERT a las 4 hijas + UPDATE → PASS
 *   E3 — SELECT cruzado → solo ve la propia, no la ajena
 *   E4 — INSERT en session_events con session_id ajeno → FAIL por EXISTS
 *   E5 — UPDATE en research_sessions ajeno → FAIL por created_by check
 *   E6 — DELETE en cualquier tabla → FAIL por REVOKE
 *   E7 — UPDATE en session_events (cualquier fila propia) → FAIL (no policy + REVOKE)
 *   E8 — SELECT v_session_timeline cruzado → solo ve la propia (verifica SECURITY INVOKER)
 *
 * Para los tests cruzados (E3, E4, E5, E8) el operador necesita un session_id
 * ajeno obtenido desde otro navegador (con sesión auth distinta).
 */
export default function DebugRlsTestPage() {
  const { sessionId, userId, status, isLoading, error, retry } = useStudySession();
  const studyClient = useMemo(() => createStudyClient(), []);
  const [foreignSessionId, setForeignSessionId] = useState("");

  // Estado de resultados por escenario: { [key]: { status, expected, actual, raw } | null }
  const [results, setResults] = useState({});
  const [running, setRunning] = useState({});

  const setResult = useCallback((key, value) => {
    setResults((r) => ({ ...r, [key]: value }));
  }, []);

  const setIsRunning = useCallback((key, value) => {
    setRunning((r) => ({ ...r, [key]: value }));
  }, []);

  const copySessionId = useCallback(async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
    } catch {
      // Silencio: el usuario verá que no pasa nada — entorno sin clipboard API
    }
  }, [sessionId]);

  const pasteForeignSessionId = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setForeignSessionId(text.trim());
    } catch {
      // Silencio: navegadores pueden bloquear readText sin gesture
    }
  }, []);

  // -------------------------------------------------------------------
  // E1 — sin auth (cliente ad-hoc anon) → INSERTs deben FAIL
  // -------------------------------------------------------------------
  const runE1 = useCallback(async () => {
    setIsRunning("e1", true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
      // Cliente nuevo aislado: sin persistencia, sin singleton
      const anonClient = createBrowserClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        isSingleton: false,
      });
      // Garantizar ausencia de sesión: signOut local
      await anonClient.auth.signOut({ scope: "local" }).catch(() => {});

      const fakeUuid = "00000000-0000-0000-0000-000000000000";
      const { data, error: insertError } = await anonClient
        .from("research_sessions")
        .insert({ created_by: fakeUuid })
        .select()
        .maybeSingle();

      const insertBlocked = !data && !!insertError;
      setResult("e1", {
        status: insertBlocked ? "PASS" : "FAIL",
        expected: "INSERT bloqueado sin JWT (rol anon sin privilegios)",
        actual: insertBlocked
          ? `Bloqueado correctamente: ${insertError.message}`
          : `INSERT permitido (data: ${JSON.stringify(data)})`,
        raw: { data, error: insertError },
      });
    } catch (err) {
      setResult("e1", {
        status: "FAIL",
        expected: "INSERT bloqueado sin JWT",
        actual: `Excepción inesperada: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e1", false);
    }
  }, [setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E2 — con auth propia: INSERT en las 4 tablas hijas + UPDATE → PASS
  // -------------------------------------------------------------------
  const runE2 = useCallback(async () => {
    if (!sessionId) {
      setResult("e2", { status: "FAIL", expected: "Sesión propia inicializada",
                        actual: "sessionId aún no disponible", raw: null });
      return;
    }
    setIsRunning("e2", true);
    try {
      const ops = [];

      // 1. pretest_responses — upsert no aplica (UNIQUE session_id), intentamos insert y aceptamos
      //    23505 (ya existe) como prueba indirecta de que la fila propia ya está.
      const pretestRes = await studyClient.from("pretest_responses").insert({
        session_id: sessionId,
        age_range: "25_34",
        gender: "prefer_not_to_say",
        education_level: "bachelor",
        employment_status: "test_employment",
        big_three_q1: true,
        big_three_q2: true,
        big_three_q3: true,
        extra_responses: { test: "e2" },
      }).select().maybeSingle();
      ops.push({ name: "pretest_responses INSERT",
                 ok: !!pretestRes.data || pretestRes.error?.code === "23505",
                 detail: pretestRes.error?.message ?? "ok" });

      // 2. app_interactions
      const interactionRes = await studyClient.from("app_interactions").insert({
        session_id: sessionId,
        flow_type: "direct",
        engine_version: "test-e2",
        profile_snapshot: { test: true },
        input_payload: { income: 2000 },
        output_payload: { ok: true },
      }).select().maybeSingle();
      ops.push({ name: "app_interactions INSERT",
                 ok: !!interactionRes.data,
                 detail: interactionRes.error?.message ?? "ok" });

      // 3. posttest_responses — UNIQUE session_id; aceptar 23505
      const posttestRes = await studyClient.from("posttest_responses").insert({
        session_id: sessionId,
        sus_responses: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        adhoc_responses: { test: "e2" },
      }).select().maybeSingle();
      ops.push({ name: "posttest_responses INSERT",
                 ok: !!posttestRes.data || posttestRes.error?.code === "23505",
                 detail: posttestRes.error?.message ?? "ok" });

      // 4. session_events
      const eventRes = await studyClient.from("session_events").insert({
        session_id: sessionId,
        event_type: "app_interaction",
        payload: { test: "e2" },
      }).select().maybeSingle();
      ops.push({ name: "session_events INSERT",
                 ok: !!eventRes.data,
                 detail: eventRes.error?.message ?? "ok" });

      // 5. UPDATE status en research_sessions propia
      const updateRes = await studyClient.from("research_sessions")
        .update({ status: "started" })
        .eq("id", sessionId)
        .select()
        .maybeSingle();
      ops.push({ name: "research_sessions UPDATE",
                 ok: !!updateRes.data,
                 detail: updateRes.error?.message ?? "ok" });

      const allOk = ops.every((o) => o.ok);
      setResult("e2", {
        status: allOk ? "PASS" : "FAIL",
        expected: "5 operaciones propias deben tener éxito (o 23505 en UNIQUEs)",
        actual: ops.map((o) => `${o.ok ? "OK " : "KO "} ${o.name}: ${o.detail}`).join("\n"),
        raw: ops,
      });
    } catch (err) {
      setResult("e2", {
        status: "FAIL",
        expected: "Operaciones propias permitidas",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e2", false);
    }
  }, [sessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E3 — SELECT cruzado: solo ve la propia, no la ajena
  // -------------------------------------------------------------------
  const runE3 = useCallback(async () => {
    if (!sessionId) {
      setResult("e3", { status: "FAIL", expected: "Sesión propia inicializada",
                        actual: "sessionId aún no disponible", raw: null });
      return;
    }
    if (!foreignSessionId) {
      setResult("e3", { status: "FAIL", expected: "foreignSessionId provisto",
                        actual: "Pega el sessionId del otro navegador", raw: null });
      return;
    }
    setIsRunning("e3", true);
    try {
      const ownRes = await studyClient.from("research_sessions")
        .select("id").eq("id", sessionId).maybeSingle();
      const foreignRes = await studyClient.from("research_sessions")
        .select("id").eq("id", foreignSessionId).maybeSingle();

      const seesOwn = ownRes.data?.id === sessionId;
      const blindToForeign = foreignRes.data === null;
      const pass = seesOwn && blindToForeign;

      setResult("e3", {
        status: pass ? "PASS" : "FAIL",
        expected: "Ver la propia y NO ver la ajena",
        actual: `Propia: ${seesOwn ? "vista" : "NO vista"} | Ajena: ${blindToForeign ? "oculta" : "VISIBLE (FUGA)"}`,
        raw: { own: ownRes, foreign: foreignRes },
      });
    } catch (err) {
      setResult("e3", {
        status: "FAIL",
        expected: "SELECT cruzado controlado por RLS",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e3", false);
    }
  }, [sessionId, foreignSessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E4 — INSERT en session_events con session_id ajeno → FAIL por EXISTS
  // -------------------------------------------------------------------
  const runE4 = useCallback(async () => {
    if (!foreignSessionId) {
      setResult("e4", { status: "FAIL", expected: "foreignSessionId provisto",
                        actual: "Pega el sessionId del otro navegador", raw: null });
      return;
    }
    setIsRunning("e4", true);
    try {
      const { data, error: insertError } = await studyClient.from("session_events").insert({
        session_id: foreignSessionId,
        event_type: "app_interaction",
        payload: { test: "e4-cross-tenant" },
      }).select().maybeSingle();

      const blocked = !data && !!insertError;
      setResult("e4", {
        status: blocked ? "PASS" : "FAIL",
        expected: "INSERT con session_id ajeno bloqueado por policy WITH CHECK (EXISTS ...)",
        actual: blocked
          ? `Bloqueado: ${insertError.message}`
          : `INSERT permitido (data: ${JSON.stringify(data)}) — FUGA`,
        raw: { data, error: insertError },
      });
    } catch (err) {
      setResult("e4", {
        status: "FAIL",
        expected: "INSERT cruzado bloqueado",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e4", false);
    }
  }, [foreignSessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E5 — UPDATE en research_sessions ajeno → FAIL por created_by check
  // -------------------------------------------------------------------
  const runE5 = useCallback(async () => {
    if (!foreignSessionId) {
      setResult("e5", { status: "FAIL", expected: "foreignSessionId provisto",
                        actual: "Pega el sessionId del otro navegador", raw: null });
      return;
    }
    setIsRunning("e5", true);
    try {
      const { data, error: updateError } = await studyClient.from("research_sessions")
        .update({ status: "abandoned" })
        .eq("id", foreignSessionId)
        .select();

      // Para UPDATE bloqueado por RLS: Postgres no devuelve error sino 0 filas afectadas.
      const noRowsAffected = Array.isArray(data) && data.length === 0;
      const explicitError = !!updateError;
      const blocked = noRowsAffected || explicitError;

      setResult("e5", {
        status: blocked ? "PASS" : "FAIL",
        expected: "UPDATE ajeno bloqueado: 0 filas afectadas o error explícito",
        actual: blocked
          ? (explicitError ? `Error: ${updateError.message}` : "0 filas afectadas — bloqueado por RLS USING")
          : `UPDATE aplicado (${data?.length ?? 0} filas) — FUGA`,
        raw: { data, error: updateError },
      });
    } catch (err) {
      setResult("e5", {
        status: "FAIL",
        expected: "UPDATE cruzado bloqueado",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e5", false);
    }
  }, [foreignSessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E6 — DELETE en cualquier tabla → FAIL por REVOKE
  // -------------------------------------------------------------------
  const runE6 = useCallback(async () => {
    if (!sessionId) {
      setResult("e6", { status: "FAIL", expected: "Sesión propia inicializada",
                        actual: "sessionId aún no disponible", raw: null });
      return;
    }
    setIsRunning("e6", true);
    try {
      // Intentar borrar la propia research_session — debe fallar por REVOKE DELETE
      const { data, error: deleteError } = await studyClient.from("research_sessions")
        .delete()
        .eq("id", sessionId)
        .select();

      const noRowsAffected = Array.isArray(data) && data.length === 0;
      const explicitError = !!deleteError;
      const blocked = noRowsAffected || explicitError;

      setResult("e6", {
        status: blocked ? "PASS" : "FAIL",
        expected: "DELETE bloqueado por REVOKE DELETE (sin privilegio SQL)",
        actual: blocked
          ? (explicitError ? `Error: ${deleteError.message}` : "0 filas afectadas — bloqueado")
          : `DELETE aplicado (${data?.length ?? 0} filas) — FUGA CRÍTICA`,
        raw: { data, error: deleteError },
      });
    } catch (err) {
      setResult("e6", {
        status: "FAIL",
        expected: "DELETE bloqueado",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e6", false);
    }
  }, [sessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E7 — UPDATE en session_events propio → FAIL (sin policy UPDATE + REVOKE)
  // -------------------------------------------------------------------
  const runE7 = useCallback(async () => {
    if (!sessionId) {
      setResult("e7", { status: "FAIL", expected: "Sesión propia inicializada",
                        actual: "sessionId aún no disponible", raw: null });
      return;
    }
    setIsRunning("e7", true);
    try {
      // Obtener cualquier evento propio
      const { data: events, error: selectError } = await studyClient.from("session_events")
        .select("id")
        .eq("session_id", sessionId)
        .limit(1);

      if (selectError || !events || events.length === 0) {
        setResult("e7", {
          status: "FAIL",
          expected: "Al menos un evento propio para probar UPDATE",
          actual: selectError ? `Error leyendo eventos: ${selectError.message}` : "No hay eventos en la sesión",
          raw: { events, error: selectError },
        });
        return;
      }

      const eventId = events[0].id;
      const { data, error: updateError } = await studyClient.from("session_events")
        .update({ payload: { tampered: true } })
        .eq("id", eventId)
        .select();

      const noRowsAffected = Array.isArray(data) && data.length === 0;
      const explicitError = !!updateError;
      const blocked = noRowsAffected || explicitError;

      setResult("e7", {
        status: blocked ? "PASS" : "FAIL",
        expected: "UPDATE en session_events bloqueado (append-only por RLS sin policy + REVOKE UPDATE)",
        actual: blocked
          ? (explicitError ? `Error: ${updateError.message}` : "0 filas afectadas — append-only respetado")
          : `UPDATE aplicado (${data?.length ?? 0} filas) — FUGA CRÍTICA (append-only roto)`,
        raw: { data, error: updateError },
      });
    } catch (err) {
      setResult("e7", {
        status: "FAIL",
        expected: "UPDATE en session_events bloqueado",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e7", false);
    }
  }, [sessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // E8 — SELECT v_session_timeline cruzado → solo ve la propia
  // -------------------------------------------------------------------
  const runE8 = useCallback(async () => {
    if (!sessionId) {
      setResult("e8", { status: "FAIL", expected: "Sesión propia inicializada",
                        actual: "sessionId aún no disponible", raw: null });
      return;
    }
    if (!foreignSessionId) {
      setResult("e8", { status: "FAIL", expected: "foreignSessionId provisto",
                        actual: "Pega el sessionId del otro navegador", raw: null });
      return;
    }
    setIsRunning("e8", true);
    try {
      const ownRes = await studyClient.from("v_session_timeline")
        .select("session_id").eq("session_id", sessionId).maybeSingle();
      const foreignRes = await studyClient.from("v_session_timeline")
        .select("session_id").eq("session_id", foreignSessionId).maybeSingle();

      const seesOwn = ownRes.data?.session_id === sessionId;
      const blindToForeign = foreignRes.data === null;
      const pass = seesOwn && blindToForeign;

      setResult("e8", {
        status: pass ? "PASS" : "FAIL",
        expected: "Vista hereda RLS (SECURITY INVOKER): ve la propia, no la ajena",
        actual: `Propia: ${seesOwn ? "vista" : "NO vista"} | Ajena: ${blindToForeign ? "oculta" : "VISIBLE (FUGA — SECURITY DEFINER?)"}`,
        raw: { own: ownRes, foreign: foreignRes },
      });
    } catch (err) {
      setResult("e8", {
        status: "FAIL",
        expected: "Vista respeta RLS de tablas subyacentes",
        actual: `Excepción: ${err?.message ?? String(err)}`,
        raw: err,
      });
    } finally {
      setIsRunning("e8", false);
    }
  }, [sessionId, foreignSessionId, studyClient, setIsRunning, setResult]);

  // -------------------------------------------------------------------
  // Definición declarativa de escenarios para renderizar las tarjetas
  // -------------------------------------------------------------------
  const scenarios = [
    { key: "e1", title: "E1 — Sin auth", needsForeign: false, run: runE1,
      desc: "Cliente anon sin JWT. Todos los INSERTs deben fallar (REVOKE ALL a anon)." },
    { key: "e2", title: "E2 — Auth propia: INSERT + UPDATE", needsForeign: false, run: runE2,
      desc: "Con sesión válida: INSERT en pretest/interactions/posttest/events + UPDATE de status. Todo PASS." },
    { key: "e3", title: "E3 — SELECT cruzado (research_sessions)", needsForeign: true, run: runE3,
      desc: "Lee la sesión propia (OK) y la ajena (debe devolver null por RLS USING)." },
    { key: "e4", title: "E4 — INSERT cruzado (session_events)", needsForeign: true, run: runE4,
      desc: "INSERT con session_id ajeno debe fallar por WITH CHECK (EXISTS ... created_by = auth.uid())." },
    { key: "e5", title: "E5 — UPDATE cruzado (research_sessions)", needsForeign: true, run: runE5,
      desc: "UPDATE de fila ajena: 0 filas afectadas (USING filtra antes de aplicar)." },
    { key: "e6", title: "E6 — DELETE bloqueado", needsForeign: false, run: runE6,
      desc: "DELETE sobre la propia research_session: bloqueado por REVOKE DELETE (sin policy)." },
    { key: "e7", title: "E7 — UPDATE bloqueado en session_events", needsForeign: false, run: runE7,
      desc: "UPDATE sobre evento propio: bloqueado (no hay policy UPDATE + REVOKE UPDATE). Append-only." },
    { key: "e8", title: "E8 — SELECT cruzado en v_session_timeline", needsForeign: true, run: runE8,
      desc: "La vista es SECURITY INVOKER: hereda RLS. Ajena debe devolver null." },
  ];

  return (
    <main className="min-h-screen p-6 bg-background">
      {/* Panel superior fijo */}
      <Card className="mb-6 sticky top-4 z-10 shadow-md">
        <CardHeader>
          <CardTitle>Debug RLS — Validación empírica (M18 Fase 2 Bloque C)</CardTitle>
          <CardDescription>
            Solo disponible en NODE_ENV != production. Ejecuta los 8 escenarios para validar
            las policies y REVOKEs configurados en la BBDD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado de sesión propia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs uppercase">userId (auth.uid)</div>
              <div className="font-mono break-all">{userId ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase">sessionId (research_sessions.id)</div>
              <div className="font-mono break-all">{sessionId ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase">status</div>
              <div className="font-mono">{status ?? "-"}</div>
            </div>
          </div>

          {/* Loading / error de la sesión */}
          {isLoading && <div className="text-sm text-muted-foreground">Inicializando sesión anónima...</div>}
          {error && (
            <div className="text-sm text-destructive border border-destructive/30 rounded p-2 bg-destructive/5">
              <div className="font-semibold">Error de sesión: {error.code}</div>
              <div>{error.message}</div>
              <Button variant="outline" size="sm" className="mt-2" onClick={retry}>Reintentar</Button>
            </div>
          )}

          {/* Controles de session IDs */}
          <div className="flex flex-wrap items-end gap-3">
            <Button size="sm" variant="outline" disabled={!sessionId} onClick={copySessionId}>
              Copiar sessionId propio
            </Button>

            <div className="flex-1 min-w-[280px]">
              <Label htmlFor="foreign-session" className="text-xs uppercase text-muted-foreground">
                Session ID ajeno (otro navegador)
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="foreign-session"
                  value={foreignSessionId}
                  onChange={(e) => setForeignSessionId(e.target.value)}
                  placeholder="UUID de la sesión del otro navegador"
                  className="font-mono"
                />
                <Button size="sm" variant="outline" onClick={pasteForeignSessionId}>
                  Pegar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de escenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((s) => {
          const result = results[s.key];
          const isRunning = !!running[s.key];
          const badgeColor = !result
            ? "bg-muted text-muted-foreground"
            : result.status === "PASS"
              ? "bg-green-600 text-white"
              : "bg-destructive text-destructive-foreground";

          return (
            <Card key={s.key}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${badgeColor}`}>
                    {result?.status ?? "PENDIENTE"}
                  </span>
                </div>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  size="sm"
                  onClick={s.run}
                  disabled={isRunning || (s.needsForeign && !foreignSessionId) || (!s.needsForeign && !sessionId && s.key !== "e1")}
                >
                  {isRunning ? "Ejecutando..." : "Ejecutar"}
                </Button>

                {result && (
                  <div className="text-xs space-y-2">
                    <div>
                      <div className="font-semibold text-muted-foreground">Esperado:</div>
                      <div>{result.expected}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-muted-foreground">Resultado:</div>
                      <pre className="whitespace-pre-wrap break-words bg-muted/50 rounded p-2 max-h-40 overflow-auto">
                        {result.actual}
                      </pre>
                    </div>
                    <details>
                      <summary className="cursor-pointer text-muted-foreground">Ver raw</summary>
                      <pre className="whitespace-pre-wrap break-words bg-muted/30 rounded p-2 max-h-60 overflow-auto text-[10px]">
                        {safeStringify(result.raw)}
                      </pre>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

// Serializador defensivo: los objetos error de Supabase pueden tener referencias cíclicas
function safeStringify(value) {
  const seen = new WeakSet();
  try {
    return JSON.stringify(value, (_, v) => {
      if (typeof v === "object" && v !== null) {
        if (seen.has(v)) return "[Circular]";
        seen.add(v);
      }
      if (v instanceof Error) {
        return { name: v.name, message: v.message, stack: v.stack };
      }
      return v;
    }, 2);
  } catch {
    return String(value);
  }
}
