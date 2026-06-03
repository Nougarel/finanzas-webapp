// data-table.jsx — Tabla de datos genérica y responsive.
//
// En desktop (md+): tabla HTML semántica.
// En móvil (<md): cards apiladas (por defecto) o filas horizontales compactas.
//
// API:
//   columns:      Array<{ key: string, header: string, className?: string,
//                         mobileClassName?: string, render?: (value, row) => ReactNode }>
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
//
// Props de layout móvil:
//   mobileMode:     "cards" (default) | "rows" — en "rows" mantiene filas
//                   horizontales compactas en lugar de cards apiladas. Usar
//                   solo en tablas simples de 3 columnas (categoría, importe, %).
//   mobileRowOrder: number[] — orden de índices de columnas para el modo "rows".
//                   Ej: [0, 2, 1] muestra col[0], luego col[2], luego col[1].
//                   Si no se pasa, usa el orden natural (columns.slice(1) precedido
//                   de col[0] como título a la izquierda).
//                   Nota: el índice 0 siempre actúa como título de fila (izquierda);
//                   los índices siguientes se renderizan como celdas adicionales.
//
// Campo opcional en cada objeto de columna:
//   mobileClassName: string — si existe, se usa en lugar de className en modo "rows".
//                    Permite ajustar tipografía/tamaño solo en la vista compacta.

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tabla responsive genérica.
 *
 * @param {Object} props
 * @param {Array<{key: string, header: string, className?: string, mobileClassName?: string, render?: Function}>} props.columns
 * @param {Array<Record<string,any>>} props.data
 * @param {string} [props.caption]
 * @param {string} [props.emptyMessage]
 * @param {string} [props.className]
 * @param {string} [props.rowKey]             — campo usado como id único de fila
 * @param {Function} [props.onRowClick]       — activa las filas como elementos clicables
 * @param {any} [props.activeRowKey]          — valor de rowKey de la fila activa
 * @param {"cards"|"rows"} [props.mobileMode] — layout en móvil: "cards" (default) o "rows"
 * @param {number[]} [props.mobileRowOrder]   — orden de índices de columnas en modo "rows"
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
  mobileMode = "cards",
  mobileRowOrder,
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
                      className={cn("px-4 py-4 text-foreground", col.className)}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? "—"}
                    </td>
                  ))}
                  {/* Chevron solo en filas interactivas — columna extra al final */}
                  {isInteractive && (
                    <td className="px-2 py-4 text-muted-foreground/50 w-6" aria-hidden="true">
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

      {/* ── Cards apiladas en móvil (<md) — solo cuando mobileMode="cards" ── */}
      {mobileMode === "cards" && (
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
                  "rounded-lg border border-border bg-card p-3 text-sm transition-colors",
                  isInteractive && "cursor-pointer hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  // Fila activa móvil: mismo tratamiento que desktop
                  isActive && "border-l-[3px] border-l-primary bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
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
                {columns.slice(1).map((col) => (
                  <div
                    key={col.key}
                    className="flex items-start justify-between gap-2 py-1 border-b border-border last:border-0"
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
      )}

      {/* ── Filas compactas en móvil (<md) — solo cuando mobileMode="rows" ── */}
      {mobileMode === "rows" && (
        <div
          className={cn(
            "md:hidden divide-y divide-border border border-border",
            flushTop ? "rounded-b-lg border-t-0" : "rounded-lg"
          )}
        >
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
                  "grid items-center gap-x-2 px-3 py-3 transition-colors",
                  // 4 cols con chevron si hay onRowClick, 3 sin él
                  isInteractive
                    ? "grid-cols-[1fr_auto_auto_auto]"
                    : "grid-cols-[1fr_auto_auto]",
                  isInteractive && "cursor-pointer hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                  // Fila activa: borde izquierdo primario + bg levemente diferenciado
                  isActive && "border-l-[3px] border-l-primary bg-primary/5"
                )}
              >
                {/* Col 0: texto plano del label — sin descripción ni alertas */}
                <span className="text-sm font-medium text-foreground truncate">
                  {typeof row[columns[0]?.key] === "string"
                    ? row[columns[0]?.key]
                    : row[columns[0]?.key] ?? "—"}
                </span>
                {/* Cols restantes: orden según mobileRowOrder si se pasa, o natural */}
                {(mobileRowOrder
                  ? mobileRowOrder.filter(i => i !== 0).map(i => columns[i]).filter(Boolean)
                  : columns.slice(1)
                ).map((col) => (
                  <span key={col.key} className={cn("text-sm", col.mobileClassName ?? col.className)}>
                    {typeof col.mobileRender === "function"
                      ? col.mobileRender(row[col.key], row)
                      : typeof col.render === "function"
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? "—"}
                  </span>
                ))}
                {/* Chevron si hay onRowClick */}
                {isInteractive && (
                  <ChevronRight
                    className={cn(
                      "size-3.5 text-muted-foreground/50 flex-shrink-0",
                      isActive && "text-primary"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { DataTable };
