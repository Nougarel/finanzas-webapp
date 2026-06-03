"use client";

import { useState } from "react";

/**
 * CollapsibleHint — texto colapsable para guías de lectura largas (3-5 líneas).
 *
 * Colapsado: limita a 2 líneas + enlace "Ver más ↓"
 * Expandido: muestra el contenido completo + enlace "Ver menos ↑"
 *
 * Estado local, no persiste entre montajes.
 * Acepta children JSX arbitrario (spans con énfasis incluidos).
 */
export function CollapsibleHint({ children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-1">
      <div className={expanded ? undefined : "line-clamp-2 overflow-hidden"}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-expanded={expanded}
      >
        {expanded ? "Ver menos ↑" : "Ver más ↓"}
      </button>
    </div>
  );
}
