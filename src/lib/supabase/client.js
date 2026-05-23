// src/lib/supabase/client.js
import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase browser-only para el sistema de research M-D1 (Camino A).
 *
 * Decisiones técnicas:
 * - createBrowserClient de @supabase/ssr (patrón canónico oficial para Next.js App Router)
 * - Función factory (no singleton exportado): el SDK ya hace singleton en browser
 *   (isSingleton: true por defecto). Patrón alineado con la doc oficial.
 * - auth.persistSession/autoRefreshToken/detectSessionInUrl desactivados: Camino A no
 *   usa autenticación, solo INSERTs anónimos a tablas con RLS insert-only.
 * - Degradación grácil si faltan env vars: warn en consola en vez de crash. La app
 *   principal sigue operativa con localStorage aunque Supabase no esté configurado;
 *   solo /study fallará (con error claro de Supabase, no por undefined).
 *
 * Uso: solo desde Client Components dentro de la ruta /study (en Fase 4).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no definidas. " +
      "/study no funcionará. La app principal sigue operativa con localStorage."
    );
  }

  return createBrowserClient(url ?? "", key ?? "", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
