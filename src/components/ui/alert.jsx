// alert.jsx — Componente de alerta semántica con variantes de estado.
//
// Variantes: success | warning | error | info
// Tamaños: default (bloque completo) | compact (inline)
// Dismissible: prop `onDismiss` activa el botón de cierre
//
// Usa tokens semánticos de globals.css + CVA para variantes.

import * as React from "react";
import { cva } from "class-variance-authority";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const alertVariants = cva(
  // Base común
  "flex gap-3 rounded-lg border text-sm",
  {
    variants: {
      variant: {
        success:
          "border-[color:var(--success)] bg-[color:var(--success-subtle)] text-[color:var(--success-foreground)]",
        warning:
          "border-[color:var(--warning)] bg-[color:var(--warning-subtle)] text-[color:var(--warning-foreground)]",
        error:
          "border-[color:var(--destructive)] bg-destructive/8 text-destructive",
        info:
          "border-[color:var(--info)] bg-[color:var(--info-subtle)] text-[color:var(--info-foreground)]",
      },
      size: {
        default: "p-4",
        compact: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  }
);

const iconVariants = cva("mt-0.5 shrink-0", {
  variants: {
    size: {
      default: "size-5",
      compact: "size-4",
    },
  },
  defaultVariants: { size: "default" },
});

/**
 * Alerta semántica.
 *
 * @param {Object} props
 * @param {"success"|"warning"|"error"|"info"} props.variant
 * @param {"default"|"compact"} props.size
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.children] - Descripción opcional
 * @param {() => void} [props.onDismiss] - Si se pasa, muestra botón de cierre
 * @param {string} [props.className]
 */
function Alert({
  variant = "info",
  size = "default",
  title,
  children,
  onDismiss,
  className,
  role = "alert",
  ...props
}) {
  const Icon = ICONS[variant] ?? Info;

  return (
    <div
      role={role}
      aria-live="polite"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {/* Icono */}
      <Icon className={iconVariants({ size })} aria-hidden />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className={cn(
              "font-medium leading-snug",
              size === "compact" ? "text-xs" : "text-sm"
            )}
          >
            {title}
          </p>
        )}
        {children && (
          <div
            className={cn(
              "text-current/80",
              size === "compact" ? "text-xs mt-0.5" : "text-sm mt-1"
            )}
          >
            {children}
          </div>
        )}
      </div>

      {/* Botón de cierre (opcional) */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar alerta"
          className={cn(
            "shrink-0 rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current transition-opacity",
            size === "compact" ? "mt-0 self-center" : "mt-0.5"
          )}
        >
          <X className={size === "compact" ? "size-3.5" : "size-4"} aria-hidden />
        </button>
      )}
    </div>
  );
}

export { Alert, alertVariants };
