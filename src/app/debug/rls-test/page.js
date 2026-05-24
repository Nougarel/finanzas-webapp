/**
 * ⚠️ PÁGINA INTERNA DE TESTING — NO ELIMINAR sin acuerdo previo.
 *
 * Propósito: validación empírica de las 14 RLS policies del subsistema de
 * research (M-D1) con 8 escenarios automatizados. Generada en M18 Fase 2
 * Bloque C y validada con dos navegadores (PASS en los 8 escenarios).
 *
 * Por qué se mantiene:
 *   - Material reutilizable para validar futuros cambios en policies o
 *     migraciones (regression check manual).
 *   - Evidencia académica para TFG cap. 5.3 (capturas ya tomadas, pero
 *     la página viva permite regenerar capturas si el formato cambia).
 *   - Útil como referencia técnica del patrón "cliente Supabase + RLS"
 *     para futuras integraciones.
 *
 * Seguridad: la ruta está gateada por NODE_ENV !== "production" — devuelve
 * 404 en deploys de Vercel. Solo es accesible desde `npm run dev` local.
 *
 * Si en el futuro se decide eliminar definitivamente:
 *   - Borrar este archivo + src/components/pages/DebugRlsTestPage.jsx
 *   - Commit message sugerido: "chore: remove debug rls-test page (post-validation)"
 */
import { notFound } from "next/navigation";
import DebugRlsTestPage from "@/components/pages/DebugRlsTestPage";

export default function Page() {
  // Gating: solo en dev — devuelve 404 en producción.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <DebugRlsTestPage />;
}
