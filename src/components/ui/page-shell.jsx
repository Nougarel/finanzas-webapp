// page-shell.jsx — Wrapper de página que aplica el max-width correcto por contexto.
//
// Variantes:
//   form      → max-w-2xl  — formularios de una columna
//   profile   → max-w-3xl  — cuestionario de perfil (más opciones)
//   hero      → max-w-4xl  — landing y páginas hero
//   table     → max-w-5xl  — resultados y tablas densas
//   dashboard → max-w-7xl  — páginas de resultados con DashboardPanel en col 2 (M37).
//               Activa un grid de 12 columnas en xl+ (≥1280px). En viewports menores,
//               los children se apilan verticalmente (grid colapsa a 1 col).
//               Uso:
//                 <PageShell variant="dashboard">
//                   <div className="col-span-12 xl:col-span-7"> {/* col 1 */}
//                     ...contenido actual...
//                   </div>
//                   <aside className="col-span-12 xl:col-span-5 xl:sticky xl:top-[calc(var(--site-header-height)+1.5rem)]">
//                     <DashboardPanel ... />
//                   </aside>
//                 </PageShell>
//               Nota: el sticky + max-h + overflow de col 2 lo aplica F3 en el aside,
//               no PageShell — porque depende de la estructura interna de cada página.

import * as React from "react";
import { cn } from "@/lib/utils";

const MAX_WIDTHS = {
  form: "max-w-2xl",
  profile: "max-w-3xl",
  hero: "max-w-4xl",
  table: "max-w-5xl",
  dashboard: "max-w-7xl",
};

// El variant dashboard activa el grid xl en el contenedor interior.
// Los otros variants no tienen grid — solo max-width.
const GRID_VARIANTS = {
  dashboard: "xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start",
};

/**
 * Wrapper de página con max-width semántico.
 *
 * @param {Object} props
 * @param {"form"|"profile"|"hero"|"table"|"dashboard"} [props.variant]
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
      {/* El variant dashboard aplica grid 12-col en xl+; el resto un div plano */}
      {variant === "dashboard" ? (
        <div className={GRID_VARIANTS.dashboard}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export { PageShell };
