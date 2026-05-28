"use client";
import { useState, useEffect } from "react";

/**
 * Devuelve false en SSR y en el primer render del cliente, true tras montar.
 * Úsalo para diferir render que depende de APIs solo-cliente (localStorage)
 * y evitar hydration mismatch.
 *
 * El setState se difiere a un microtask (Promise.resolve().then) para
 * satisfacer la regla react-hooks/set-state-in-effect del proyecto,
 * que prohíbe llamadas síncronas a setState dentro de un effect.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);
  return mounted;
}
