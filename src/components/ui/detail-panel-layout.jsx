"use client";

/**
 * DetailPanelLayout — Layout de split-view + bottom sheet para el panel de detalle (M36).
 *
 * Desktop (md+):
 *   Dos columnas dentro del mismo flujo de la página. La columna de contenido
 *   ocupa 3/5 cuando el panel está cerrado (ancho normal) o 3/5 cuando está
 *   abierto. El panel derecho (2/5) es sticky dentro del viewport.
 *   Cuando no hay categoría seleccionada, el panel no ocupa espacio.
 *
 * Móvil (<md):
 *   Bottom sheet a media altura usando Dialog de Radix (sin overlay oscuro completo,
 *   con overlay translúcido para que el usuario vea qué fila activó el panel).
 *   Se anima desde abajo con tw-animate-css.
 *
 * API:
 *   selectedCategoryId  {string|null}   — id de la categoría seleccionada
 *   onClose             {function}      — callback para cerrar el panel
 *   panelContent        {ReactNode}     — contenido del panel (ej. <CategoryDetail>)
 *   children            {ReactNode}     — contenido principal (las tablas de resultados)
 *
 * Decisión ADR-11: estado efímero (no URL). El selectedCategoryId lo maneja
 * el padre como useState local.
 */

import * as React from "react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

export function DetailPanelLayout({
  selectedCategoryId,
  onClose,
  panelContent,
  children,
}) {
  const isOpen = !!selectedCategoryId;

  return (
    <>
      {/* ── Layout desktop (md+) ── */}
      <div
        className={cn(
          "hidden md:flex gap-6 items-start",
          // Cuando el panel está abierto, usamos flex; en caso contrario
          // el contenedor ocupa todo el ancho (el panel no existe en DOM)
          !isOpen && "md:block"
        )}
      >
        {/* Columna principal — contenido (tablas, etc.) */}
        <div className={cn("min-w-0", isOpen ? "flex-[3]" : "w-full")}>
          {children}
        </div>

        {/* Panel derecho — sticky en viewport, animado con opacity/translate */}
        {isOpen && (
          <aside
            className={cn(
              "flex-[2] sticky top-6 self-start",
              // Altura máxima = viewport menos el top sticky, con scroll interno
              "max-h-[calc(100vh-3rem)] overflow-hidden",
              "rounded-lg border border-border bg-card p-5 shadow-sm",
              "animate-in fade-in-0 slide-in-from-right-4 duration-200"
            )}
            aria-label="Detalle de categoría"
          >
            {panelContent}
          </aside>
        )}
      </div>

      {/* ── Contenido siempre visible en móvil ── */}
      <div className="md:hidden">
        {children}
      </div>

      {/* ── Bottom sheet en móvil — Dialog de Radix ── */}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => { if (!open) onClose(); }}
        modal={false}
      >
        <Dialog.Portal>
          {/*
            Overlay translúcido (no oscuro completo) para que el usuario siga
            viendo qué fila disparó el panel. modal=false para no bloquear
            interacciones con el fondo — el usuario puede tocar otra fila.
          */}
          <Dialog.Overlay
            className={cn(
              "md:hidden fixed inset-0 z-40 bg-black/20",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
              "duration-200"
            )}
          />
          <Dialog.Content
            className={cn(
              // Solo visible en móvil
              "md:hidden",
              // Posicionado en la parte inferior del viewport
              "fixed bottom-0 left-0 right-0 z-50",
              // Media altura del viewport
              "h-[55vh]",
              "rounded-t-xl border-t border-border bg-card px-4 pt-3 pb-6",
              "shadow-[0_-4px_24px_0_rgba(0,0,0,0.08)]",
              // Animación slide desde abajo
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
              "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom",
              "duration-300 ease-out",
              // Sin focus ring en el contenedor — el botón de cierre ya tiene el suyo
              "outline-none"
            )}
            aria-label="Detalle de categoría"
            // Dialog.Title es requerido por accesibilidad en Radix; lo ponemos en el contenido
            aria-describedby={undefined}
          >
            {/* Indicador de arrastre visual */}
            <div className="flex justify-center mb-3" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            {/* Área scrollable para el contenido del panel */}
            <div className="h-full overflow-y-auto">
              {panelContent}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
