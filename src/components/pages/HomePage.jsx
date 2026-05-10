import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Componente de la página de inicio (Home)
 * Muestra las dos opciones de flujo disponibles: cálculo directo e inverso
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Planificador Financiero Personal
          </h1>
          <p className="text-lg text-muted-foreground">
            Elige cómo quieres calcular tu distribución financiera
          </p>
        </div>

        {/* Dos opciones de flujo en grid — columna única en móvil, dos columnas en desktop */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Opción 1: Cálculo directo */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Cálculo directo</CardTitle>
              <CardDescription>
                Tengo un ingreso mensual y quiero saber cómo distribuirlo de forma saludable.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Button asChild className="w-full">
                <Link href="/profile">
                  Comenzar
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Opción 2: Cálculo inverso */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Cálculo inverso</CardTitle>
              <CardDescription>
                Quiero saber qué ingreso necesito para sostener el estilo de vida que deseo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">
                  Comenzar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
