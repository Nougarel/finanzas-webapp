# CLAUDE.md — flouss

## Qué es este proyecto

Planificador financiero personal para usuarios en España. Dado un perfil de usuario (edad, situación laboral, vivienda, deuda, dependientes...) y un ingreso mensual, calcula la distribución óptima del presupuesto en 20 categorías usando programación lineal. Compara con datos del INE y umbrales institucionales (Banco de España, Eurostat, OMS).

**Tres flujos principales:**
1. **Directo** — ingreso → distribución ideal en 20 categorías + score de salud financiera
2. **Diagnóstico** — distribución real del usuario vs distribución recomendada
3. **Inverso** — importes deseados → ingreso mínimo necesario (búsqueda binaria)

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.1.6 — **App Router** |
| UI | React 19.2.3 + TailwindCSS v4 + shadcn/ui (style: new-york) |
| Componentes | JSX (no TypeScript, no TSX) |
| Optimización | `javascript-lp-solver` — Goal Programming para distribución óptima |
| Iconos | `lucide-react` |
| Estilos condicionales | `clsx` + `tailwind-merge` → `cn()` en `@/lib/utils` |
| Linting | ESLint 9 flat config (`eslint.config.mjs`) |
| Tests | **Ninguno configurado** |

## Estructura

```
src/
├── app/
│   ├── layout.js                  # Root layout — Geist fonts, metadata
│   ├── page.js                    # Home — elige flujo directo o inverso
│   ├── globals.css                # TailwindCSS v4 + CSS variables tema
│   ├── api/
│   │   ├── calculate/route.js     # POST — cálculo directo
│   │   ├── calculate-inverse/route.js  # POST — cálculo inverso
│   │   └── diagnose/route.js      # POST — diagnóstico real vs recomendado
│   ├── profile/page.js            # Cuestionario de perfil (4 secciones)
│   ├── calculator/page.js         # Entrada de ingreso mensual/anual
│   ├── results/page.js            # Resultados distribución directa
│   ├── diagnosis-form/page.js     # Entrada de importes reales
│   ├── diagnosis/page.js          # Diagnóstico comparativo
│   ├── inverse-calculator/page.js # Entrada de importes deseados
│   └── inverse-results/page.js    # Ingreso mínimo calculado
├── components/
│   ├── pages/                     # Componentes de página ("use client")
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx        # Cuestionario 4 secciones
│   │   ├── CalculatorPage.jsx     # Toggle mensual/anual
│   │   ├── ResultsPage.jsx        # Tabla categorías + alertas + score
│   │   ├── DiagnosisFormPage.jsx
│   │   ├── DiagnosisPage.jsx
│   │   ├── InverseCalculatorPage.jsx
│   │   └── InverseResultsPage.jsx
│   └── ui/                        # shadcn/ui — Button, Card, Input, Label
└── lib/
    ├── utils.js                   # cn() — merge Tailwind + clsx
    ├── models/
    │   ├── categories.js          # CATEGORIES_CATALOG — 20 categorías con config LP
    │   └── financialModels.js     # LEGACY — modelos 50/30/20 etc. (no se usa)
    └── calculators/
        ├── profileCalculator.js   # calculateTargets() — targets por perfil + OCDE
        ├── distributionEngine.js  # calculateDistribution() + diagnoseDistribution()
        ├── lpSolver.js            # solveDistribution() — programación lineal
        ├── inverseCalculator.js   # calculateIncome() — búsqueda binaria
        ├── evaluator.js           # Funciones de evaluación auxiliares
        └── distributionCalculator.js  # Funciones auxiliares de distribución
```

## Dominio: las 20 categorías

`CATEGORIES_CATALOG` en `src/lib/models/categories.js` es el núcleo del modelo:

- **6 necesidades** (`block: "needs"`): housing, utilities, groceries, transport, health, education
- **8 deseos** (`block: "wants"`): dining_out, travel, clothing, personal_care, entertainment, hobbies, subscriptions, gifts
- **6 ahorros** (`block: "savings"`): life_insurance, emergency_fund, short_term_savings, long_term_savings, investment, debt_extra

Cada categoría define: `factibleMin`, `factibleMax`, `scaling` (por tramos de ingreso), `lpWeight` (prioridad en LP), umbrales de alerta y referencia INE.

## Persistencia

**No hay base de datos ni almacenamiento de servidor.**

| Mecanismo | Qué guarda |
|-----------|-----------|
| `localStorage["userProfile"]` | Respuestas del cuestionario de perfil |
| URL query params | `?income=XXX`, `?amounts=...` (JSON encoded) |
| Estado React (`useState`) | Estado local de formularios y resultados |

## Patrones de arquitectura

- **App Router**: rutas en `src/app/`. Las `page.js` son Server Components que importan Client Components de `src/components/pages/`.
- **Client/Server split**: toda la lógica interactiva vive en `components/pages/*.jsx` con `"use client"`. Los `route.js` en `api/` son Server-only (usan `server-only`).
- **Flujo de datos**: formularios → localStorage/URL params → API route → calculators → JSON response → componente de resultados.
- **shadcn/ui**: los componentes base están en `src/components/ui/`. No modificar directamente — regenerar con `npx shadcn add <componente>`.

## Comandos habituales

```bash
npm run dev       # Servidor de desarrollo en http://localhost:3000
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # ESLint
```

## Convenciones del proyecto

- **JavaScript, no TypeScript** — `.js` y `.jsx`. No introducir `.ts`/`.tsx`.
- **Alias `@/`** apunta a `src/` (definido en `jsconfig.json`).
- **shadcn/ui** con base color `slate` y CSS variables habilitadas.
- **Sin tests** por ahora — si se añaden, usar Vitest (compatible con App Router).
- Los componentes de página siguen la convención: `app/ruta/page.js` (server shell) + `components/pages/NombrePage.jsx` (client logic).
- Los calculadores en `lib/calculators/` son **funciones puras** — no acceden a localStorage ni al DOM. Mantener esa separación.

## Contexto del negocio

El motor financiero está calibrado para España:
- Factores OCDE para equivalencia de hogar (pareja + hijos)
- Referencias INE (gasto medio español por categoría)
- Umbrales institucionales: DTI (Banco de España), seguros (DGS), emergencias (Banco de España)
- Tres perfiles de ingreso con scaling diferente: bajo (<1.500€), medio (1.500–4.000€), alto (>4.000€)

El LP solver usa **Goal Programming**: minimiza desviaciones ponderadas respecto a los targets del perfil, respetando restricciones de bloques (needs ≥ X%, savings ≥ Y%) y límites por categoría.

## Glosario de dominio

- **DTI** — Debt-to-Income ratio: porcentaje del ingreso destinado a deuda. Umbral saludable: < 30% (Banco de España)
- **effectiveIncome** — ingreso neto ajustado por factor OCDE (≠ `income` bruto introducido por el usuario)
- **factor OCDE** — escala el ingreso según tamaño y composición del hogar (pareja + hijos)
- **Goal Programming** — variante de LP que minimiza desviaciones ponderadas respecto a targets, en lugar de optimizar un único objetivo
- **block** — agrupación de categorías: `"needs"`, `"wants"`, `"savings"`
- **healthScore** — puntuación 0–100 de salud financiera calculada sobre la distribución resultante
- **scaling** — ajuste de targets por tramo de ingreso (bajo < 1.500€ / medio 1.500–4.000€ / alto > 4.000€)

## Anti-patrones — no hacer

- **No modificar `src/components/ui/`** directamente. Son componentes shadcn/ui — regenerar con `npx shadcn add <componente>` si necesitan cambios.
- **No importar `financialModels.js`** en código nuevo. Es legacy (modelos 50/30/20 estáticos) reemplazado por `CATEGORIES_CATALOG`. Solo existe por compatibilidad.
- **No añadir efectos secundarios a `lib/calculators/`**. Todas las funciones deben ser puras — sin localStorage, sin fetch, sin DOM. Los tests futuros dependen de esta separación.
- **No introducir TypeScript** (`.ts`/`.tsx`). El proyecto es JavaScript puro; mezclar rompe la configuración de ESLint y shadcn.
- **No añadir persistencia de servidor** sin una decisión explícita. La ausencia de base de datos es intencional: el MVP no requiere cuentas de usuario.

## Decisiones técnicas (el por qué)

- **LP solver en lugar de reglas fijas** — las 20 categorías con pesos, restricciones de bloque y scaling por ingreso hacen que las reglas manuales exploten en combinaciones. El solver encuentra el óptimo global con restricciones duras automáticamente.
- **localStorage en lugar de base de datos** — MVP sin autenticación. El perfil es personal y temporal; no hay necesidad de persistencia entre dispositivos en esta fase.
- **JavaScript, no TypeScript** — decisión inicial de velocidad. El dominio financiero tiene objetos complejos que requerirían tipos elaborados; se puede migrar cuando haya cobertura de tests que actúe de red de seguridad.
- **Sin base de datos de servidor** — todos los cálculos son stateless y deterministas. El servidor solo ejecuta la lógica; el estado vive en el cliente.

## Probar las APIs manualmente

Con el servidor en `http://localhost:3000`:

```bash
# Cálculo directo — perfil joven sin cargas
curl -s -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"profile":{"ageRange":"under35","housingStatus":"rent","geographicZone":"standard","employmentStatus":"permanent","dependents":0,"hasPartner":false,"vehicleStatus":"none","privateHealthInsurance":"none","ownEducation":"none","emergencyFundStatus":"none","housingPurchaseGoal":false,"pensionRegime":"social_security","consumerDebt":"none"},"income":2000}'

# Cálculo inverso — importes deseados → ingreso mínimo
curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":{"ageRange":"under35","housingStatus":"rent","geographicZone":"standard","employmentStatus":"permanent","dependents":0,"hasPartner":false,"vehicleStatus":"none","privateHealthInsurance":"none","ownEducation":"none","emergencyFundStatus":"none","housingPurchaseGoal":false,"pensionRegime":"social_security","consumerDebt":"none"},"specifiedAmounts":{"housing":700,"dining_out":300}}'
```

## Gotchas conocidos

- `useSearchParams()` en Next.js App Router requiere `<Suspense>` en el componente padre — sin él da error en build de producción.
- El LP solver puede devolver `null` si las restricciones son infactibles (ej. ingreso extremadamente bajo). `distributionEngine.js` tiene fallback, pero verificar antes de acceder a propiedades del resultado.
- TailwindCSS v4 no usa `tailwind.config.js` — la configuración del tema va en `src/app/globals.css` con `@theme`. No crear un `tailwind.config.js`.
- `javascript-lp-solver` es síncrono y bloquea el event loop en cálculos complejos. Para perfiles extremos puede tardar. No es problema en uso normal.

## Lo que falta (deuda técnica conocida)

- Sin tests (ni unitarios de calculadores, ni e2e de flujos)
- Sin CI/CD configurado
- README genérico (template de create-next-app)
- `financialModels.js` es legacy — puede eliminarse cuando se confirme que nada lo importa

## Contexto profundo

Para decisiones de arquitectura, historial del proyecto o contexto de negocio más detallado, consultar el vault:
- `KnowledgeBase/01-proyectos/personales/flouss` — contexto del Proyecto Manhattan
- `KnowledgeBase/03-conocimiento/tech/` — decisiones técnicas y ADRs
