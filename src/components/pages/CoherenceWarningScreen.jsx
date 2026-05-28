"use client";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { PageShell } from "@/components/ui/page-shell";
import { CATEGORIES_UI } from "@/lib/models/categories";

/**
 * Pantalla intermedia mostrada cuando el calculador inverso detecta que
 * los importes fijados son inconsistentes con el perfil del usuario.
 * No bloqueante: el usuario puede editar el perfil, editar los importes o
 * forzar el cálculo de todas formas.
 */
export default function CoherenceWarningScreen({
  outliers,
  onEditProfile,
  onEditAmounts,
  onForceCalculate,
}) {
  return (
    <main className="flex flex-1 items-center">
      <PageShell variant="form">
        <div className="space-y-8">

          {/* Encabezado */}
          <div className="space-y-3">
            <h1 className="font-display font-black tracking-display text-3xl sm:text-4xl text-foreground">
              Hemos detectado algo que no encaja con tu perfil
            </h1>
            <p className="text-base font-light text-muted-foreground">
              Antes de calcular el ingreso necesario, queremos asegurarnos de que estos importes son los que querías. Pueden inflar el resultado de forma artificial.
            </p>
          </div>

          {/* Lista de outliers — cada uno en su propio Alert warning */}
          <div className="space-y-3" role="list" aria-label="Importes inconsistentes detectados">
            {outliers.map((o) => (
              <Alert
                key={o.catId}
                variant="warning"
                title={`Has fijado ${Math.round(o.amount)}€ en ${getCategoryLabel(o.catId)}`}
                role="listitem"
              >
                <p>{o.inconsistencyMessage}</p>
                <p className="mt-1 font-extralight">{o.inconsistencySuggestion}</p>
              </Alert>
            ))}
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={onEditProfile}
              variant="outline"
              className="flex-1 transition-colors duration-200"
            >
              Editar perfil
            </Button>
            <Button
              onClick={onEditAmounts}
              variant="outline"
              className="flex-1 transition-colors duration-200"
            >
              Editar importes
            </Button>
            <Button
              onClick={onForceCalculate}
              className="flex-1 transition-colors duration-200"
            >
              Calcular igualmente
            </Button>
          </div>

        </div>
      </PageShell>
    </main>
  );
}

function getCategoryLabel(catId) {
  const cat = CATEGORIES_UI.find(c => c.id === catId);
  return cat?.label ?? catId;
}
