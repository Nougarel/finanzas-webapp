# M35 Design Tokens — flouss

Fuente de verdad del sistema de diseño implementado en Fase 2 (M35).
Referencia para Fase 3 (rediseño de páginas).

---

## Color

### Primario

| Token CSS | Hex | oklch | Uso |
|-----------|-----|-------|-----|
| `--primary` | `#14213D` | `oklch(0.252 0.0563 264)` | Wordmark, botones, links, acentos |
| `--primary-foreground` | `#F9FAFB` | `oklch(0.984 0.003 247.858)` | Texto sobre fondo primario |

### Semánticos — Success

| Token CSS | Hex aprox | oklch | Uso |
|-----------|-----------|-------|-----|
| `--success` | `#16A34A` | `oklch(0.578 0.1657 145)` | Borde + icono de alertas de éxito |
| `--success-subtle` | — | `oklch(0.960 0.040 145)` | Fondo de alerta de éxito |
| `--success-foreground` | — | `oklch(0.250 0.080 145)` | Texto sobre fondo success-subtle |

### Semánticos — Warning

| Token CSS | Hex aprox | oklch | Uso |
|-----------|-----------|-------|-----|
| `--warning` | `#F59E0B` | `oklch(0.771 0.1770 77)` | Borde + icono de alertas de advertencia |
| `--warning-subtle` | — | `oklch(0.970 0.048 90)` | Fondo de alerta de advertencia |
| `--warning-foreground` | — | `oklch(0.300 0.080 60)` | Texto sobre fondo warning-subtle |

### Semánticos — Info

| Token CSS | Hex aprox | oklch | Uso |
|-----------|-----------|-------|-----|
| `--info` | `#0284C7` | `oklch(0.558 0.1820 233)` | Borde + icono de alertas informativas |
| `--info-subtle` | — | `oklch(0.950 0.042 233)` | Fondo de alerta informativa |
| `--info-foreground` | — | `oklch(0.230 0.075 233)` | Texto sobre fondo info-subtle |

### Destructivo (heredado de shadcn — no duplicar)

| Token CSS | oklch | Uso |
|-----------|-------|-----|
| `--destructive` | `oklch(0.577 0.245 27.325)` | Errores, acciones destructivas |

### Neutros base (heredados de shadcn new-york)

| Token CSS | oklch | Uso |
|-----------|-------|-----|
| `--background` | `oklch(1 0 0)` | Fondo de página |
| `--foreground` | `oklch(0.129 0.042 264.695)` | Texto principal |
| `--muted` | `oklch(0.968 0.007 247.896)` | Fondos secundarios |
| `--muted-foreground` | `oklch(0.554 0.046 257.417)` | Texto secundario / metadatos |
| `--border` | `oklch(0.929 0.013 255.508)` | Bordes |
| `--ring` | `oklch(0.252 0.0563 264)` | Focus ring — primario navy |

### Focus ring

Sobrescrito en `globals.css @layer base`:
```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```
El `--ring` apunta al mismo valor que `--primary` (navy). WCAG AA cumplido.

---

## Tipografía

### Familias

| Variable CSS | Fuente | Pesos disponibles | Uso |
|---|---|---|---|
| `--font-geist` | Geist (variable) | 100–900 | Títulos, wordmark, números hero |
| `--font-inter` | Inter (variable) | 100–900 | Cuerpo, UI, tablas, metadatos |
| `--font-geist-mono` | Geist Mono (variable) | — | Código, valores técnicos |

### Jerarquía de uso

| Nivel | Familia | Peso | Clase Tailwind | Contexto |
|-------|---------|------|----------------|----------|
| Wordmark / hero numbers | Geist | 900 | `font-display font-black` | Logo, cifras grandes en resultado |
| Títulos de sección | Geist | 900 | `font-display font-black text-2xl/3xl` | H1, H2 de página |
| Subtítulos / tagline | Inter | 300 | `font-light` | Tagline header, subtítulos de card |
| Body / párrafos | Inter | 400 | (default) | Texto de formularios y descripción |
| UI / botones / labels | Inter | 500 | `font-medium` | Botones, labels, metadatos |
| Texto auxiliar fino | Inter | 200 | `font-extralight` | Disclaimers, notas muy secundarias |
| Metadatos uppercase | Inter | 500 | `font-medium tracking-meta uppercase text-xs` | Cabeceras de tabla, etiquetas de campo |
| Números monetarios en tabla | Inter | 500 | `tabular-nums font-medium` | Columnas de cifras (MoneyValue) |
| Número hero (resultado) | Geist | 900 | `font-display font-black text-4xl tabular-nums tracking-display` | Ingreso mínimo, total recomendado |

### Utilities globales (definidas en globals.css)

```css
@utility tabular-nums      /* font-variant-numeric: tabular-nums */
@utility font-display      /* font-family: var(--font-geist), ... */
@utility tracking-display  /* letter-spacing: -0.02em — para títulos 3xl+ */
@utility tracking-meta     /* letter-spacing: 0.05em — para metadatos uppercase */
```

### Escala tipográfica (Tailwind nativo)

| Clase | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Metadatos, disclaimer, badge |
| `text-sm` | 14px | Body secundario, tablas |
| `text-base` | 16px | Body principal |
| `text-lg` | 18px | Subtítulos de tarjeta |
| `text-xl` | 20px | Wordmark, títulos menores |
| `text-2xl` | 24px | Títulos de sección |
| `text-3xl` | 30px | H1 de página |
| `text-4xl` | 36px | Hero numbers |
| `text-5xl` | 48px | Número principal de resultado |

---

## Espaciado

Escala base Tailwind (4px). Sin customización. Densidad híbrida:

| Contexto | Padding | Gap |
|---------|---------|-----|
| Formularios (respirado) | `p-6` / `py-8` | `gap-4` / `gap-6` |
| Tablas (denso) | `px-4 py-3` | — |
| Secciones hero | `py-12` / `py-16` | `gap-8` |
| Cards | `p-4` / `p-6` | `gap-3` |

---

## Layout — Max-widths por contexto

Implementados en `PageShell` (variant prop):

| Variante | Max-width | Uso |
|---------|-----------|-----|
| `form` | `max-w-2xl` (672px) | Formularios de una columna |
| `profile` | `max-w-3xl` (768px) | Cuestionario de perfil (4 secciones) |
| `hero` | `max-w-4xl` (896px) | Páginas landing y hero |
| `table` | `max-w-5xl` (1024px) | ResultsPage, DiagnosisPage, InverseResultsPage |

---

## Identidad

- **Nombre:** flouss (siempre lowercase en wordmark)
- **Tagline:** "Distribuye con criterio"
- **Símbolo:** Curva con bifurcación — dos caminos desde un origen (distribución del ingreso)

```svg
<svg viewBox="0 0 32 32" fill="none">
  <path d="M4 16 Q12 16 16 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M4 16 Q12 16 16 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="4" cy="16" r="2" fill="currentColor"/>
  <circle cx="16" cy="8" r="2" fill="currentColor"/>
  <circle cx="16" cy="24" r="2" fill="currentColor"/>
</svg>
```

Usa `currentColor` para heredar el color del contexto (navy en header, blanco en botones inversos).

**Archivos:**
- `public/flouss-symbol.svg` — símbolo en currentColor (para uso en SVG independiente)
- `src/app/icon.svg` — favicon con fondo navy + símbolo blanco (Next.js App Router lo sirve automáticamente)

---

## Radio de bordes

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `0.375rem` | Badges, chips pequeños |
| `--radius-md` | `0.5rem` | Inputs, selects |
| `--radius-lg` | `0.625rem` | Cards, alerts, modales |
| `--radius-xl` | `0.875rem` | Cards prominentes |

---

## Componentes nuevos (Fase 2)

### Alert (`src/components/ui/alert.jsx`)

```jsx
<Alert variant="success" title="Presupuesto equilibrado" onDismiss={() => {}}>
  Tu distribución cumple los umbrales recomendados.
</Alert>

<Alert variant="warning" size="compact">
  Deuda superior al 30% DTI.
</Alert>
```

Props: `variant` (success/warning/error/info), `size` (default/compact), `title`, `children`, `onDismiss`, `className`.

### DataTable (`src/components/ui/data-table.jsx`)

```jsx
const columns = [
  { key: "category", header: "Categoría" },
  { key: "amount", header: "Importe", render: (v) => <MoneyValue amount={v} size="table" /> },
  { key: "pct", header: "%", className: "text-right" },
];

<DataTable columns={columns} data={results} caption="Distribución de presupuesto" />
```

### MoneyValue (`src/components/ui/money-value.jsx`)

```jsx
<MoneyValue amount={1250} size="hero" />   // → 1.250 € (Geist 900, 4xl)
<MoneyValue amount={320} size="table" />    // → 320 € (Inter 500, sm, tabular)
<MoneyValue amount={-50} showSign size="inline" />  // → −50 €
```

### ErrorState (`src/components/ui/error-state.jsx`)

```jsx
<ErrorState
  title="Error al calcular"
  description="Comprueba tu conexión e inténtalo de nuevo."
  onRetry={handleRetry}
/>
```

### EmptyState (`src/components/ui/empty-state.jsx`)

```jsx
<EmptyState
  icon={BarChart3}
  title="Sin resultados"
  description="Completa el perfil para ver tu distribución."
  actionLabel="Ir al perfil"
  onAction={() => router.push("/profile")}
/>
```

### PageShell (`src/components/ui/page-shell.jsx`)

```jsx
<PageShell variant="form">   {/* max-w-2xl */}
<PageShell variant="table">  {/* max-w-5xl */}
```

### SiteHeader / SiteFooter

Se montan en `src/app/layout.js`. Se auto-ocultan en rutas `/study/*` via `usePathname()`.
El header es sticky con backdrop-blur. El footer tiene disclaimer legal.

---

## Modo oscuro

Fuera de scope en M35. El bloque `.dark {}` en `globals.css` existe vacío para no romper referencias de shadcn/ui. No añadir `class="dark"` al `<html>`.
