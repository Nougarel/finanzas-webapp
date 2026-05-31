// data-table.jsx — Tabla de datos genérica y responsive.
//
// En desktop (md+): tabla HTML semántica.
// En móvil (<md): cards apiladas con label + valor.
//
// API:
//   columns:      Array<{ key: string, header: string, className?: string,
//                         render?: (value, row) => ReactNode }>
//   data:         Array<Record<string, any>>
//   caption:      string (recomendado para accesibilidad)
//   emptyMessage: string (texto cuando data.length === 0)
//   className:    string (wrapper externo)
//
// Props opcionales para filas clicables (M36):
//   rowKey:       string — campo de data usado como identificador único de fila
//   onRowClick:   (row) => void — handler al hacer clic/enter/space en una fila
//   activeRowKey: any — valor de rowKey de la fila actualmente activa (resaltado)
//
// Prop opcional para integración con banner navy de bloque (M36):
//   flushTop:     boolean — si true, la tabla se pega visualmente al banner de
//                 bloque superior: sin border-top, sin radio en las esquinas
//                 superiores, y header con tipografía más sutil para que el
//                 banner navy mantenga la jerarquía de "título de sección"
//                 frente al header como "rótulo de columna".

import * as React from "react";
import { ChevronRight } from "lucide-react";
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
 * @param {string} [props.rowKey]       — campo usado como id único de fila
 * @param {Function} [props.onRowClick] — activa las filas como elementos clicables
 * @param {any} [props.activeRowKey]    — valor de rowKey de la fila activa
 */
function DataTable({
  columns = [],
  data = [],
  caption,
  emptyMessage = "No hay datos disponibles.",
  className,
  rowKey,
  onRowClick,
  activeRowKey,
  flushTop = false,
}) {
  // Las filas son interactivas solo cuando se proveen rowKey y onRowClick.
  const isInteractive = !!(rowKey && onRowClick);
  if (!data.length) {
    return (
      <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* ── Tabla en desktop (md+) ──
          flushTop=true: el banner navy del bloque (M36) ya provee las esquinas
          superiores redondeadas y el border-top. La tabla se pega debajo sin
          duplicarlos para que se lean como una sola unidad visual. */}
      <div
        className={cn(
          "hidden md:block overflow-x-auto border border-border",
          flushTop ? "rounded-b-lg border-t-0" : "rounded-lg"
        )}
      >
        <table className="w-full text-sm">
          {caption && (
            <caption className="sr-only">{caption}</caption>
          )}
          <thead>
            {/* Cuando flushTop, el header pasa a rótulo discreto de columnas:
                tipografía menor y fondo transparente, para no competir con el
                banner navy que ya actúa como cabecera de la sección. */}
            <tr
              className={cn(
                "border-b border-border",
                flushTop ? "bg-transparent" : "bg-muted/50"
              )}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 text-left font-medium text-muted-foreground tracking-meta uppercase",
                    flushTop
                      ? "py-2 text-[10px]"
                      : "py-3 text-xs font-semibold text-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => {
              const key = rowKey ? row[rowKey] : rowIdx;
              const isActive = isInteractive && activeRowKey !== undefined && activeRowKey === key;

              return (
                <tr
                  key={key ?? rowIdx}
                  // Filas interactivas: tabIndex para navegación por teclado.
                  // No se usa role="button" porque <tr> tiene rol implícito "row"
                  // y cambiar el rol rompería la semántica de tabla para AT.
                  // aria-selected es válido en role="row" para indicar selección.
                  tabIndex={isInteractive ? 0 : undefined}
                  aria-selected={isInteractive ? isActive : undefined}
                  onClick={isInteractive ? () => onRowClick(row) : undefined}
                  onKeyDown={isInteractive ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  } : undefined}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    isInteractive
                      ? "cursor-pointer hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                      : "hover:bg-muted/30",
                    // Fila activa: borde izquierdo primario 3px (puente visual con el panel)
                    // + bg-muted/50 inequívocamente distinto del hover (bg-muted/30)
                    isActive && "border-l-[3px] border-l-primary bg-muted/50 hover:bg-muted/60"
                  )}
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
                  {/* Chevron solo en filas interactivas — columna extra al final */}
                  {isInteractive && (
                    <td className="px-2 py-3 text-muted-foreground/50 w-6" aria-hidden="true">
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive && "text-primary"
                        )}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Cards apiladas en móvil (<md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row, rowIdx) => {
          const key = rowKey ? row[rowKey] : rowIdx;
          const isActive = isInteractive && activeRowKey !== undefined && activeRowKey === key;

          return (
            <div
              key={key ?? rowIdx}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              aria-pressed={isInteractive ? isActive : undefined}
              onClick={isInteractive ? () => onRowClick(row) : undefined}
              onKeyDown={isInteractive ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick(row);
                }
              } : undefined}
              className={cn(
                "rounded-lg border border-border bg-card p-4 text-sm transition-colors",
                isInteractive && "cursor-pointer hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                // Fila activa móvil: mismo tratamiento que desktop
                isActive && "border-l-[3px] border-l-primary bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Nombre de la primera columna como título de la card */}
                <span className="font-medium text-foreground text-sm">
                  {row[columns[0]?.key] ?? "—"}
                </span>
                {isInteractive && (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground/50 shrink-0",
                      isActive && "text-primary"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
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
          );
        })}
      </div>
    </div>
  );
}

export { DataTable };
