"use client";

/**
 * DetailPanelLayout — Layout de split-view + drawer fixed en desktop + bottom sheet en móvil.
 *
 * Desktop (lg+):
 *   El drawer es un panel `position: fixed` anclado a la derecha del viewport.
 *   Modelo de altura adaptativa (M36 Fase 2 — mejora 1):
 *     - top = altura del SiteHeader + 12px de gap
 *     - height: auto → el panel se ajusta a su contenido
 *     - max-height = 100vh − var(--site-header-height) − 24px (12px arriba + 12px abajo)
 *     - min-height: 300px → evita que el panel parezca "minúsculo" en categorías muy cortas
 *   Cuando el contenido supera max-height, el div interior overflow-y-auto lo maneja.
 *   No se anima el height entre categorías — el salto es intencional (Natural, como Notion/Linear).
 *   Ancho 500px; sombra envolvente; esquinas redondeadas.
 *
 * Móvil (<lg):
 *   Bottom sheet a media altura usando Dialog de Radix. No se toca en esta mejora.
 *
 * Cierre:
 *   Solo mediante el botón X del drawer o la tecla Escape. El click fuera del
 *   drawer y el focus-out NO cierran el panel (no se usa role="dialog" con
 *   focus trap automático — el usuario debe poder seguir interactuando con la tabla).
 *
 * Accesibilidad:
 *   - role="complementary" + aria-label en el drawer desktop
 *   - aria-live="polite" + aria-atomic="true" en el contenedor de contenido (mejora 5)
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

  // Detectar si estamos en viewport desktop (lg+) para evitar montar el
  // Dialog.Root en desktop, donde causa una race condition con el click
  // que abre el panel: Radix detecta el click como pointer-down-outside y,
  // aunque preventDefault esté declarado en Content, en algunos casos cierra
  // el estado antes de que el contenido se monte. Solo necesitamos Dialog
  // para el bottom sheet móvil.
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // El drawer es complementario (NO modal): no roba foco al abrir. El usuario
  // tabula hasta él cuando quiere. Al cerrar, si tenemos referencia a la fila
  // activa, devolvemos el foco allí (mejora navegación por teclado).
  React.useEffect(() => {
    if (!isOpen) {
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
          En desktop NO comprime el ancho cuando el drawer está abierto: el
          drawer es una tarjeta flotante que se superpone, no un panel que
          empuja. La tabla mantiene su composición normal centrada en
          max-w-5xl. El drawer cubre la parte derecha de la tabla mientras
          está abierto — es el trade-off aceptado para evitar layout shift
          y el aire muerto a la izquierda del centrado.
          NO se aplica opacity al contenido: reducir la opacidad del texto
          degrada el contraste de los muted-foreground por debajo del 4.5:1
          (axe AA falla). La señal visual de "foco en el drawer" la da el
          drawer mismo (presencia, sombra, esquinas redondeadas) y el borde
          izquierdo navy en la fila activa de la tabla.
      */}
      <div>{children}</div>

      {/* ── Drawer flotante — solo desktop (lg+) ───────────────────────────────
          position: fixed, anclado a la derecha del viewport CON MARGEN.
          Tarjeta flotante con esquinas redondeadas — no flush con el borde.
          Se superpone al contenido sin empujarlo (no hay pr en el main).
          top = altura del SiteHeader + gap; right/bottom = gap del viewport.
          Ancho 500px; sombra envolvente.
          Animación: slide-in-from-right 220ms ease-out al abrir.
      */}
      {isOpen && (
        <aside
          role="complementary"
          aria-label="Detalle de categoría"
          className={cn(
            // Solo visible en desktop
            "hidden lg:flex flex-col",
            // Posicionamiento fixed con margen del viewport (tarjeta flotante)
            "fixed right-3 z-30",
            // Altura adaptativa (mejora 1 M36):
            //   top = header + 12px gap arriba
            //   h-auto → el panel se ajusta a su contenido natural
            //   max-h = viewport − header − 24px (12px arriba + 12px abajo)
            //   min-h = 300px → evita panel "minúsculo" en categorías muy cortas
            "top-[calc(var(--site-header-height)+12px)]",
            "h-auto",
            "max-h-[calc(100vh-var(--site-header-height)-24px)]",
            "min-h-[300px]",
            // Ancho 500px
            "w-[500px]",
            // Tarjeta: bordes redondeados en las 4 esquinas, borde sutil, fondo card
            "rounded-xl border border-border bg-card",
            // Sombra envolvente más generosa (no solo a la izquierda)
            "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.08)]",
            // Scroll interno
            "overflow-hidden",
            // Padding interior
            "p-5",
            // Animación de entrada
            "animate-in slide-in-from-right duration-[220ms] ease-out"
          )}
        >
          {/*
            Área scrollable que contiene el contenido del panel.
            aria-live="polite" + aria-atomic="true" (mejora 5 M36):
            cuando el usuario selecciona otra categoría con el panel
            ya abierto, los lectores de pantalla anuncian el nuevo
            contenido sin interrumpir lo que estén leyendo.
          */}
          <div
            className="flex-1 overflow-y-auto min-h-0"
            aria-live="polite"
            aria-atomic="true"
          >
            {panelContent}
          </div>
        </aside>
      )}

      {/* ── Contenido siempre visible en móvil (<lg) ── */}
      {/* El div principal ya renderiza children en todos los tamaños.
          El bloque desktop lo oculta visualmente en <lg con lg:pr-[436px] solo
          cuando está abierto, pero el contenido en sí siempre es visible.
          El bottom sheet (Dialog) se superpone sobre él en móvil. */}

      {/* ── Bottom sheet en móvil — Dialog de Radix ──
          Solo se monta cuando isMobile es true. En desktop el Dialog NO existe,
          evitando la race condition con el click de las filas. */}
      {isMobile && (
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
      )}
    </>
  );
}
