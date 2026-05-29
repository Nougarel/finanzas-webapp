// page-shell.jsx — Wrapper de página que aplica el max-width correcto por contexto.
//
// Variantes:
//   form    → max-w-2xl  — formularios de una columna
//   profile → max-w-3xl  — cuestionario de perfil (más opciones)
//   hero    → max-w-4xl  — landing y páginas hero
//   table   → max-w-5xl  — resultados y tablas densas
//
// Uso:
//   <PageShell variant="form">
//     <FormContent />
//   </PageShell>

import * as React from "react";
import { cn } from "@/lib/utils";

const MAX_WIDTHS = {
  form: "max-w-2xl",
  profile: "max-w-3xl",
  hero: "max-w-4xl",
  table: "max-w-5xl",
};

/**
 * Wrapper de página con max-width semántico.
 *
 * @param {Object} props
 * @param {"form"|"profile"|"hero"|"table"} [props.variant]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
function PageShell({ variant = "hero", className, children }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 sm:py-12",
        MAX_WIDTHS[variant] ?? MAX_WIDTHS.hero,
        className
      )}
    >
      {children}
    </div>
  );
}

export { PageShell };
