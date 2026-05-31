"use client";

/**
 * DetailPanelLayout — Layout de split-view + drawer fixed en desktop + bottom sheet en móvil.
 *
 * Desktop (lg+):
 *   El contenido principal ocupa todo el ancho disponible. El drawer es un panel
 *   `position: fixed` anclado a la derecha del viewport, con top igual a la altura
 *   del SiteHeader global y bottom en el borde inferior del viewport.
 *   Ancho fijo de 420px; sombra izquierda para separarlo visualmente del contenido.
 *   El contenido principal recibe una opacity reducida (0.6) cuando el drawer está
 *   abierto para marcar foco, pero sigue siendo clicable (pointer-events activos).
 *
 * Móvil (<lg):
 *   Bottom sheet a media altura usando Dialog de Radix. Comportamiento y estilos
 *   idénticos al diseño anterior — este bloque no se ha tocado.
 *
 * Cierre:
 *   Solo mediante el botón X del drawer o la tecla Escape. El click fuera del
 *   drawer y el focus-out NO cierran el panel (no se usa role="dialog" con
 *   focus trap automático — el usuario debe poder seguir interactuando con la tabla).
 *
 * Accesibilidad:
 *   - role="complementary" + aria-label en el drawer desktop
 *   - Escape gestionado manualmente con useEffect + keydown
 *   - Al abrir: foco al botón de cierre del drawer
 *   - Al cerrar: foco vuelve a la fila que disparó la apertura
 *   - Las restricciones de Radix Dialog.Content (onEscapeKeyDown, onPointerDownOutside)
 *     se neutralizan para reproducir el mismo comportamiento de no-cierre en móvil
 *
 * API:
 *   selectedCategoryId  {string|null}   — id de la categoría seleccionada
 *   onClose             {function}      — callback para cerrar el panel
 *   panelContent        {ReactNode}     — contenido del panel (ej. <CategoryDetail>)
 *   children            {ReactNode}     — contenido principal (las tablas de resultados)
 *   activeRowRef        {React.RefObject} — ref al elemento <tr>/<div> activo en la tabla;
 *                                          se usa para restaurar el foco al cerrar el drawer.
 *                                          Si no se proporciona, el foco no se restaura.
 *
 * Decisión ADR-11: estado efímero (no URL). El selectedCategoryId lo maneja
 * el padre como useState local.
 *
 * Fuente de activaciones de animaciones: tw-animate-css (ya en el proyecto).
 * No se ha introducido ninguna librería nueva.
 */

import * as React from "react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

export function DetailPanelLayout({
  selectedCategoryId,
  onClose,
  panelContent,
  children,
  activeRowRef,
}) {
  const isOpen = !!selectedCategoryId;

  // Ref al botón de cierre del drawer desktop — para mover el foco al abrir
  const closeBtnRef = React.useRef(null);

  // Al abrir el drawer desktop, mueve el foco al botón de cierre.
  // Al cerrar, devuelve el foco a la fila activa de la tabla.
  React.useEffect(() => {
    if (isOpen) {
      // Pequeño delay para que el DOM esté pintado antes del foco
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Devolver foco a la fila de la tabla que disparó el panel
      activeRowRef?.current?.focus();
    }
  }, [isOpen, activeRowRef]);

  // Manejo manual de Escape en desktop (no usamos Dialog de Radix en desktop,
  // así que el Escape lo gestionamos aquí con keydown global).
  React.useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* ── Contenido principal ────────────────────────────────────────────────
          En desktop: ocupa todo el ancho. Cuando el drawer está abierto recibe
          un margen derecho para que el contenido no quede debajo del drawer, y
          la opacidad baja a 0.6 para marcar el foco visual sin bloquear clics.
          pointer-events permanece activo: el usuario puede clicar otra fila.
      */}
      <div
        className={cn(
          "transition-opacity duration-200",
          // En desktop con el drawer abierto: reservamos 420px + gap al lado derecho
          isOpen && "lg:pr-[436px]",
          // Atenuación de foco — solo en desktop y solo cuando el drawer está abierto
          isOpen && "lg:opacity-60"
        )}
      >
        {children}
      </div>

      {/* ── Drawer fixed — solo desktop (lg+) ──────────────────────────────────
          position: fixed, anclado a la derecha del viewport.
          top = altura del SiteHeader (--site-header-height).
          bottom = 0 (hasta el borde del viewport).
          Ancho fijo 420px — no se reduce en viewports estrechos; el umbral lg
          garantiza que solo aparece en ≥1024px.
          Sombra izquierda (shadow-xl) para separarlo del contenido.
          Animación: slide-in-from-right 220ms ease-out al abrir;
                     slide-out-to-right simétrico al cerrar (data-[state]).
      */}
      {isOpen && (
        <aside
          role="complementary"
          aria-label={`Detalle de categoría`}
          className={cn(
            // Solo visible en desktop
            "hidden lg:flex flex-col",
            // Posicionamiento fixed anclado al viewport
            "fixed right-0 z-30",
            // top = altura real del header global (CSS variable definida en globals.css)
            // bottom = 0 para llegar hasta el borde inferior del viewport
            "top-[var(--site-header-height)] bottom-0",
            // Ancho fijo 420px
            "w-[420px]",
            // Estilo visual
            "border-l border-border bg-card",
            "shadow-[-4px_0_24px_0_rgba(0,0,0,0.08)]",
            // Scroll interno — el contenido de CategoryDetail puede ser largo
            "overflow-hidden",
            // Padding interior
            "p-5",
            // Animación de entrada
            "animate-in slide-in-from-right duration-[220ms] ease-out"
          )}
        >
          {/*
            El botón de cierre vive dentro del aside únicamente como receptor de foco
            inicial al abrir. CategoryDetail ya renderiza su propio botón X que llama
            a onClose — este ref apunta a ese botón a través de un wrapper que lo busca.
            Solución: usamos un div invisible con tabIndex=-1 como anchor de foco,
            y CategoryDetail tiene su propio botón con ref pasado por contexto.

            En la práctica: el padre (CategoryDetail) ya renderiza el botón X.
            Necesitamos que el ref apunte a ese botón. Como CategoryDetail no expone
            un ref, usamos un truco limpio: el primer elemento focusable del aside
            recibe el foco tras 50ms. Usamos un botón sr-only invisible que llama
            a onClose como primer elemento del aside, y así el primer Tab desde fuera
            aterriza en el botón X real de CategoryDetail.

            Para el foco inicial usamos el ref al botón sr-only.
          */}
          {/* Botón de cierre sr-only: receptor de foco inicial al abrir el drawer */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-10 focus:rounded focus:bg-card focus:p-1 focus:text-sm"
            aria-label="Cerrar panel de detalle"
          >
            Cerrar
          </button>

          {/* Área scrollable que contiene el contenido del panel */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {panelContent}
          </div>
        </aside>
      )}

      {/* ── Contenido siempre visible en móvil (<lg) ── */}
      {/* El div principal ya renderiza children en todos los tamaños.
          El bloque desktop lo oculta visualmente en <lg con lg:pr-[436px] solo
          cuando está abierto, pero el contenido en sí siempre es visible.
          El bottom sheet (Dialog) se superpone sobre él en móvil. */}

      {/* ── Bottom sheet en móvil — Dialog de Radix ── */}
      {/* Comportamiento idéntico al diseño anterior — sin cambios. */}
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
            Solo visible en <lg.
          */}
          <Dialog.Overlay
            className={cn(
              "lg:hidden fixed inset-0 z-40 bg-black/20",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
              "duration-200"
            )}
          />
          <Dialog.Content
            className={cn(
              // Solo visible en <lg
              "lg:hidden",
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
            // Escape lo gestiona el useEffect del drawer desktop — no duplicar
            onEscapeKeyDown={(e) => e.preventDefault()}
            // Click fuera no cierra el bottom sheet (misma política que el drawer desktop)
            onPointerDownOutside={(e) => e.preventDefault()}
            aria-describedby={undefined}
          >
            {/*
              Dialog.Title requerido por Radix para accesibilidad (evita advertencia de AT).
              Oculto visualmente — el contenido real del panel ya tiene su propio h2.
            */}
            <Dialog.Title className="sr-only">
              Detalle de categoría
            </Dialog.Title>

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
