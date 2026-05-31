"use client";

import Link from "next/link";
import { Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { useStudyAwareHref } from "@/lib/research/useStudyAwareRouter";
import { cn } from "@/lib/utils";

/**
 * Componente de la página de inicio (Home)
 * Muestra las dos opciones de flujo disponibles: cálculo directo e inverso.
 * Cuando se renderiza dentro del funnel /study (vía /study/home), los hrefs
 * se prefijan automáticamente con /study para no salir del modo guiado.
 */
export default function HomePage() {
  const directHref = useStudyAwareHref("/profile");
  const inverseHref = useStudyAwareHref("/profile?mode=inverse");

  return (
    <main className="flex flex-1 items-center">
      <PageShell variant="hero">
        <div className="space-y-10">
          {/* Encabezado */}
          <div className="text-center space-y-3">
            <h1 className="font-display font-black tracking-display text-4xl sm:text-5xl text-foreground">
              Planificador Financiero Personal
            </h1>
            <p className="text-lg font-light text-muted-foreground">
              Elige cómo quieres calcular tu distribución financiera
            </p>
          </div>

          {/* Dos opciones de flujo en grid — columna única en móvil, dos columnas en desktop */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Opción 1: Cálculo directo — card invertida (navy) como camino principal */}
            <Card className="flex flex-col bg-primary border-primary transition-shadow duration-200 ease-out hover:shadow-md">
              <CardHeader className="gap-3">
                <Wallet
                  className="size-6 text-primary-foreground"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <div className="space-y-1">
                  <CardTitle className="text-primary-foreground">Cálculo directo</CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    Tengo un ingreso mensual y quiero saber cómo distribuirlo de forma saludable.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <Button
                  asChild
                  className={cn("w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
                >
                  <Link href={directHref}>
                    Comenzar
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Opción 2: Cálculo inverso */}
            <Card className="flex flex-col transition-shadow duration-200 ease-out hover:shadow-md">
              <CardHeader className="gap-3">
                <Target
                  className="size-6 text-primary"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <div className="space-y-1">
                  <CardTitle>Cálculo inverso</CardTitle>
                  <CardDescription>
                    Quiero saber qué ingreso necesito para sostener el estilo de vida que deseo.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <Button asChild variant="outline" className="w-full">
                  <Link href={inverseHref}>
                    Comenzar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageShell>
    </main>
  );
}
