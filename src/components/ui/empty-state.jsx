// empty-state.jsx — Estado vacío con icono lucide, título, descripción y acción opcional.

import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Estado vacío genérico.
 *
 * @param {Object} props
 * @param {React.ElementType} [props.icon] - Icono lucide (por defecto Inbox)
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.actionLabel] - Texto del botón de acción
 * @param {() => void} [props.onAction] - Callback del botón de acción
 * @param {string} [props.className]
 */
function EmptyState({
  icon: Icon = Inbox,
  title = "Nada por aquí",
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-4 text-center",
        className
      )}
    >
      <Icon
        className="size-12 text-muted-foreground/60"
        aria-hidden
        strokeWidth={1.5}
      />
      <div className="flex flex-col gap-1.5 max-w-sm">
        <p className="text-base font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
