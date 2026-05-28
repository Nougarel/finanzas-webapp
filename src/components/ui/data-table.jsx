// data-table.jsx — Tabla de datos genérica y responsive.
//
// En desktop (md+): tabla HTML semántica.
// En móvil (<md): cards apiladas con label + valor.
//
// API:
//   columns: Array<{ key: string, header: string, className?: string,
//                    render?: (value, row) => ReactNode }>
//   data:    Array<Record<string, any>>
//   caption: string (recomendado para accesibilidad)
//   emptyMessage: string (texto cuando data.length === 0)
//   className: string (wrapper externo)

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tabla responsive genérica.
 *
 * @param {Object} props
 * @param {Array<{key: string, header: string, className?: string, render?: Function}>} props.columns
 * @param {Array<Record<string,any>>} props.data
 * @param {string} [props.caption]
 * @param {string} [props.emptyMessage]
 * @param {string} [props.className]
 */
function DataTable({
  columns = [],
  data = [],
  caption,
  emptyMessage = "No hay datos disponibles.",
  className,
}) {
  if (!data.length) {
    return (
      <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* ── Tabla en desktop (md+) ── */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          {caption && (
            <caption className="sr-only">{caption}</caption>
          )}
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-meta uppercase",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-foreground", col.className)}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Cards apiladas en móvil (<md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="rounded-lg border border-border bg-card p-4 text-sm"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex items-start justify-between gap-2 py-1.5 border-b border-border last:border-0"
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-meta shrink-0">
                  {col.header}
                </span>
                <span className={cn("text-right text-foreground", col.className)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] ?? "—"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { DataTable };
