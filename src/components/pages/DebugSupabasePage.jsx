"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

/**
 * Página TEMPORAL de verificación de conectividad con Supabase.
 *
 * Hace una query trivial a una tabla inexistente (`_health`). La respuesta esperada
 * es un error tipo "PGRST205" o "relation does not exist" — ese error confirma que:
 *   - Las env vars NEXT_PUBLIC_SUPABASE_* están cargadas
 *   - El SDK construye el request correctamente
 *   - El endpoint del proyecto Supabase responde
 *
 * Cualquier OTRO error (network, invalid URL, invalid JWT) indica un problema real
 * de configuración a investigar.
 *
 * Esta página se ELIMINA al cerrar la Fase 1 (paso D.4). NO commitear sin etiqueta
 * clara, NO referenciar desde el resto de la app.
 */
export default function DebugSupabasePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePing = async () => {
    setLoading(true);
    setResult(null);
    try {
      const supabase = createClient();
      const response = await supabase.from("_health").select("*").limit(1);
      setResult(response);
    } catch (e) {
      setResult({ thrown: true, message: e?.message ?? String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Debug — Supabase ping</CardTitle>
          <CardDescription>
            Verificación temporal de conectividad. Se espera un error tipo
            <code className="mx-1 px-1 rounded bg-muted">PGRST205</code>
            o &quot;relation does not exist&quot; — ese error confirma que la conexión
            funciona.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handlePing} disabled={loading}>
            {loading ? "Pingeando..." : "Ping Supabase"}
          </Button>
          {result && (
            <pre className="text-xs rounded-md border bg-muted p-4 overflow-auto max-h-96 whitespace-pre-wrap break-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
