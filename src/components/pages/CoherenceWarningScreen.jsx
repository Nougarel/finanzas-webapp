"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
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
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-6 text-amber-500 shrink-0 mt-1" />
            <CardTitle className="text-xl">
              Hemos detectado algo que no encaja con tu perfil
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Antes de calcular el ingreso necesario, queremos asegurarnos de que estos importes son los que querías. Pueden inflar el resultado de forma artificial.
          </p>

          <div className="space-y-4">
            {outliers.map((o) => (
              <div key={o.catId} className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <p className="font-medium text-sm">
                  Has fijado <span className="font-bold">{Math.round(o.amount)}€</span> en <span className="font-bold">{getCategoryLabel(o.catId)}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {o.inconsistencyMessage}
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {o.inconsistencySuggestion}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={onEditProfile} variant="outline" className="flex-1">
              Editar perfil
            </Button>
            <Button onClick={onEditAmounts} variant="outline" className="flex-1">
              Editar importes
            </Button>
            <Button onClick={onForceCalculate} className="flex-1">
              Calcular igualmente
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function getCategoryLabel(catId) {
  const cat = CATEGORIES_UI.find(c => c.id === catId);
  return cat?.label ?? catId;
}
