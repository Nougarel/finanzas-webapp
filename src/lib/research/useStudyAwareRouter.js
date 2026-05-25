"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * Wrapper sobre useRouter que prepende "/study" a rutas internas cuando el
 * usuario está navegando dentro del funnel /study. Permite reutilizar las
 * páginas de la app principal sin modificar cada router.push individual a
 * ser consciente del modo.
 *
 * Reglas:
 *   - Si pathname empieza con "/study" Y path es ruta interna ("/algo") que
 *     no empieza ya por "/study", prepende "/study".
 *   - Si path ya empieza por "/study", se respeta tal cual.
 *   - Rutas externas (http://, https://) o el literal "/" (home) se respetan
 *     tal cual también — el botón "Volver al inicio" debe seguir sacando
 *     al usuario del funnel cuando se renderiza en modo normal (en modo
 *     study ya está oculto vía fix previo D5).
 *
 * Query strings y hashes se preservan.
 */
function transformPath(path, isInStudy) {
  if (!isInStudy) return path;
  if (typeof path !== "string") return path;
  if (!path.startsWith("/")) return path;            // externa
  if (path === "/") return path;                      // home explícita
  if (path.startsWith("/study")) return path;        // ya prefijada
  return `/study${path}`;
}

export function useStudyAwareRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const isInStudy = pathname?.startsWith("/study") ?? false;

  return useMemo(() => ({
    push: (path) => router.push(transformPath(path, isInStudy)),
    replace: (path) => router.replace(transformPath(path, isInStudy)),
    back: () => router.back(),
    isInStudy,
  }), [router, isInStudy]);
}

/**
 * Versión para Links: devuelve el href transformado según el contexto.
 * Pensado para que componentes que renderizan <Link> (como HomePage) se
 * adapten al modo /study sin duplicar el componente.
 */
export function useStudyAwareHref(path) {
  const pathname = usePathname();
  const isInStudy = pathname?.startsWith("/study") ?? false;
  return transformPath(path, isInStudy);
}
