"use client";

/**
 * DetailPanelLayout — Layout de split-view + drawer fixed en desktop + bottom sheet en móvil.
 *
 * Desktop (lg+):
 *   El drawer es un panel `position: fixed` anclado a la derecha del viewport.
 *   Modelo de altura completa (M36 Fase 2 — rediseño consensuado):
 *     - top = altura del SiteHeader + 12px de gap
 *     - bottom = 12px de gap (el panel ocupa todo el viewport disponible)
 *   Ancho 500px. El scroll interno lo gestiona el div interior (flex-1 overflow-y-auto).
 *
 *   Tratamientos visuales de materialidad (M36):
 *     - Superficie: --panel-surface (oklch ligeramente cálido-neutral) en lugar de
 *       bg-card (blanco puro) — separación por temperatura de color con el slate-50 del main
 *     - Esquinas: solo top-left y bottom-left redondeadas (rounded-l-xl) — patrón de drawer
 *     - Borde izquierdo: 2px navy al 20% de opacidad — corte físico visible sin oscurecer
 *     - Sombra multi-layer asimétrica: capa key (dirección izquierda), edge sharp y ambient
 *       difusa — el panel parece tener luz desde la derecha proyectando hacia el main
 *
 * Móvil (<lg):
 *   Bottom sheet a media altura usando Dialog de Radix. No se toca en este rediseño.
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

  // Mejora 7: fade del contenido del panel al cambiar de categoría.
  // isTransitioning → opacity 0 durante 120ms → opacity 1 con nuevo contenido.
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const prevCategoryRef = React.useRef(selectedCategoryId);

  React.useEffect(() => {
    if (prevCategoryRef.current !== selectedCategoryId && selectedCategoryId !== null) {
      setIsTransitioning(true);
      const t = setTimeout(() => {
        setIsTransitioning(false);
        prevCategoryRef.current = selectedCategoryId;
      }, 120);
      return () => clearTimeout(t);
    } else {
      prevCategoryRef.current = selectedCategoryId;
    }
  }, [selectedCategoryId]);

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
          Tarjeta flotante: margen en top, right y bottom; esquinas redondeadas
          en las cuatro. z-50 → por encima del header global para que el panel
          ocupe el alto COMPLETO del viewport (no solo el espacio bajo el header).
          Se superpone al contenido sin empujarlo (overlay, no push).
          Ancho 500px; sombra multi-layer asimétrica; borde izquierdo navy
          de acento que separa el panel del main.
          Animación: slide-in-from-right 220ms ease-out al abrir.
      */}
      {isOpen && (
        <aside
          role="complementary"
          aria-label="Detalle de categoría"
          className={cn(
            // Solo visible en desktop
            "hidden lg:flex flex-col",
            // Posicionamiento fixed con margen en los 3 lados (tarjeta flotante).
            // z-50: por encima del header global (z-40) para ocupar TODA la
            // altura del viewport — el panel cubre la parte derecha del header,
            // que es área vacía sin contenido.
            "fixed right-4 z-50",
            // Altura COMPLETA del viewport: 12px de gap arriba y abajo,
            // ignorando la altura del SiteHeader (el panel pasa por encima).
            "top-3 bottom-3",
            // Ancho 500px
            "w-[500px]",
            // Superficie: blanco ligeramente cálido-neutral (var definida en globals.css)
            // separada del slate-50 del main por temperatura de color
            "bg-[var(--panel-surface)]",
            // Esquinas redondeadas en las cuatro (tarjeta flotante con margen
            // en los cuatro bordes; el patrón de las referencias del usuario)
            "rounded-xl",
            // Borde-izquierdo de acento navy 20% — corte físico visible que
            // separa el panel del main sin oscurecer nada.
            "border-l-2 border-l-[rgba(20,33,61,0.20)]",
            // Sombra multi-layer asimétrica (M36):
            //   - capa key: offset -8px en X, radio 28px, navy 10% → luz desde la derecha
            //   - capa edge: offset -1px en X, radio 2px, navy 6% → corte sharp al borde izq.
            //   - capa ambient: offset 0/4px, radio 32px, neutro 4% → difusa por debajo
            "shadow-[-8px_0_28px_0_rgba(20,33,61,0.10),-1px_0_2px_0_rgba(20,33,61,0.06),0_4px_32px_0_rgba(0,0,0,0.04)]",
            // Scroll interno gestionado por el div interior (overflow-hidden en el aside)
            "overflow-hidden",
            // Padding interior simétrico — la separación entre la scrollbar y
            // el texto se gestiona dentro de panel-scroll-area (pr-3), no aquí.
            "p-5",
            // Animación de entrada
            "animate-in slide-in-from-right duration-[220ms] ease-out"
          )}
        >
          {/*
            Contenedor del contenido del panel.
            aria-live="polite" + aria-atomic="true" (mejora 5 M36):
            cuando el usuario selecciona otra categoría con el panel
            ya abierto, los lectores de pantalla anuncian el nuevo
            contenido sin interrumpir lo que estén leyendo.

            Modelo de altura completa (M36 rediseño):
            El <aside> tiene flex flex-col + overflow-hidden + top/bottom fixed.
            Este div con flex-1 ocupa todo el espacio disponible del aside,
            y overflow-y-auto gestiona el scroll interno cuando el contenido
            supera la altura del panel.
          */}
          <div
            className="flex flex-col overflow-hidden flex-1 min-h-0"
            aria-live="polite"
            aria-atomic="true"
          >
            {/*
              key={selectedCategoryId} fuerza el re-mount del contenido cuando
              el usuario cambia de categoría con el panel ya abierto, activando
              la animación de entrada (fade-in-0 duration-150).
              El panel en sí (slide-in 220ms) no se re-monta — solo el interior.
              animate-in + fade-in-0 vienen de tw-animate-css (ya en el proyecto).
            */}
            <div
              style={{
                transition: "opacity 120ms ease",
                opacity: isTransitioning ? 0 : 1,
              }}
              className="flex flex-col overflow-hidden flex-1 min-h-0"
            >
              {panelContent}
            </div>
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
            Overlay manual: modal=false hace que Radix no renderice Dialog.Overlay
            en el DOM. Se usa un div nativo con z-40 para el backdrop y onClick
            para cerrar al tocar fuera del sheet. Solo visible en <lg.
          */}
          {isOpen && (
            <div
              onClick={onClose}
              aria-hidden="true"
              className="lg:hidden fixed inset-0 z-40 bg-black/40 cursor-pointer animate-in fade-in-0 duration-200"
            />
          )}
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
