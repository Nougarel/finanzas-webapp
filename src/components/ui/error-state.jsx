// error-state.jsx — Estado de error con icono, título, descripción y botón retry.

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Estado de error genérico.
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {() => void} [props.onRetry] - Si se pasa, muestra botón "Reintentar"
 * @param {string} [props.retryLabel]
 * @param {string} [props.className]
 */
function ErrorState({
  title = "Ha ocurrido un error",
  description,
  onRetry,
  retryLabel = "Reintentar",
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-4 text-center",
        className
      )}
    >
      <AlertCircle
        className="size-12 text-destructive"
        aria-hidden
        strokeWidth={1.5}
      />
      <div className="flex flex-col gap-1.5 max-w-sm">
        <p className="text-base font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
