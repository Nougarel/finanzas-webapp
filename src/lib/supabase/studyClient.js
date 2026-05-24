// src/lib/supabase/studyClient.js
import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase específico para el subsistema de research M-D1.
 *
 * A diferencia de src/lib/supabase/client.js (Fase 1, auth desactivada),
 * este cliente activa Anonymous Sign-Ins y persistencia de sesión:
 *   - persistSession: true → guarda JWT en localStorage para reutilizar entre recargas
 *   - autoRefreshToken: true → refresca el JWT antes de expirar (1h por defecto)
 *   - detectSessionInUrl: false → no usamos OAuth, no hay callback con tokens en URL
 *
 * Decisión arquitectónica (P1 aprobada por el usuario): cliente separado para
 * mantener aislamiento entre app principal (sin auth) y modo research (con auth).
 *
 * Uso: solo desde Client Components dentro de /study o /debug/rls-test.
 */
export function createStudyClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn(
      "[studyClient] NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no definidas. " +
      "El sistema de research no funcionará."
    );
  }

  return createBrowserClient(url ?? "", key ?? "", {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
