"use client";

// src/components/study/StudyNavigationGuard.jsx
//
// Bloqueo mínimo de navegación fuera del funnel durante la fase de uso
// de la app. Solo añade un listener beforeunload con el mensaje del
// dossier §11.4 — los navegadores modernos muestran su propio mensaje
// genérico independientemente del texto.
//
// Limitación conocida (deuda técnica documentada en el plan): no se
// interceptan clicks en links <Link href="/..."> que salgan de /study.
// Una versión más completa requeriría un listener delegado en document
// y replicar la heurística de navegación de Next.js, lo que añade riesgo
// de romper la navegación interna del funnel. El beforeunload cubre el
// caso principal (cierre de pestaña / refresh).

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MESSAGES } from "@/lib/research/studyCopy";

// Rutas dentro de /study donde el guard debe estar activo (fase app).
const PATHS_WITHOUT_GUARD = new Set([
  "/study",
  "/study/posttest",
  "/study/expired",
]);

function shouldGuard(pathname) {
  if (!pathname || !pathname.startsWith("/study")) return false;
  if (PATHS_WITHOUT_GUARD.has(pathname)) return false;
  return true;
}

export default function StudyNavigationGuard() {
  const pathname = usePathname();
  const active = shouldGuard(pathname);

  useEffect(() => {
    if (!active) return undefined;
    const handler = (e) => {
      e.preventDefault();
      // Required para que algunos navegadores muestren el diálogo nativo.
      e.returnValue = MESSAGES.beforeUnload;
      return MESSAGES.beforeUnload;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);

  return null;
}
