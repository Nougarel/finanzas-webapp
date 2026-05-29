# M36 — Transparencia y fiabilidad del resultado

> Estado: **Fase 0 (contrato y decisiones)** · Rama `feat/m36-transparency` · Inicio 2026-05-29

## Motivación

La app se ha alejado de los modelos estáticos (50/30/20) hacia soluciones
personalizadas: un motor de optimización por **programación lineal (método
símplex)** que itera hasta encontrar la mejor distribución para cada usuario,
con 20 categorías calibradas una a una y respaldo de fuentes institucionales
(INE, Banco de España, Eurostat, OCDE, OMS, DGS).

**El problema:** toda esa complejidad y fiabilidad es invisible en la interfaz.
El cálculo se resuelve al instante y parece "cuatro cuentas simples", así que el
usuario puede pensar que el resultado es genérico. M36 busca **transmitir el
rigor y la fiabilidad** del resultado sin abrumar y sin revelar la lógica de
negocio.

## Principios que gobiernan el milestone

1. **Por capas** — resultado limpio por defecto; la profundidad siempre bajo
   demanda. No romper la limpieza visual de M35.
2. **Secreto de la lógica** — el motor emite *efectos cualitativos* (tokens),
   nunca operandos (números, pesos, fórmulas). Frontera de seguridad explícita.
3. **Calculadores puros** — todo lo nuevo es aditivo al JSON de salida; cero
   efectos secundarios en `lib/calculators/`.
4. **Iteración por página** — piloto en `ResultsPage`, luego `DiagnosisPage` e
   `InverseResultsPage`. Un commit por pieza, con screenshot.
5. **Rama nueva desde `main`** — `feat/m36-transparency`; merge `--no-ff` tras QA.

## Decisiones de arquitectura (contrato)

Formalizadas como ADR-10 y ADR-11 en el vault (`arquitectura/decisiones-diseno.md`).

### El *explanation object* (ADR-10 — frontera del secreto)

El motor emite, por categoría, una estructura **user-safe**:

```
explanation: {
  housing: {
    drivers:   ["RENT_STATUS", "ZONE_STANDARD", "OCDE_HOUSEHOLD"],  // tokenIds
    direction: "raised" | "lowered" | "neutral",                    // ternario, sin delta
    sources:   ["INE", "BDE_DTI"]                                   // tokenIds
  },
  ...
}
```

- `drivers` y `sources` son **identificadores de un diccionario cerrado**. El
  cliente solo tiene el diccionario de *etiquetas legibles*, nunca los
  coeficientes.
- `direction` es **ternaria** (sube / baja / neutral), nunca un delta numérico.
- La narrativa ("Tu situación de alquiler en zona estándar elevó este margen")
  se compone en el cliente a partir de los tokens.

**Lo que NUNCA sale del servidor:** `lpWeight`, `factibleMin/Max`, factores
OCDE, deltas numéricos, el orden de aplicación de modificadores, `rawTargets`
crudos (vector de reconstrucción por resta) y el valor objetivo del LP (suma
ponderada de desviaciones).

**Riesgo residual honesto:** un adversario con muchos perfiles podría inferir
correlaciones cualitativas. El secreto es *disuasión*, no garantía
criptográfica. Defendible para el TFG; no se vende como inviolable.

### Estado del panel de detalle (ADR-11 — efímero vs URL)

El detalle por categoría es **estado de UI efímero** (`selectedCategory`), no
recurso navegable: no se mete en la URL ni se crea una ruta. Vive como estado
local dentro de un componente compartido `<DetailPanelLayout>`, reutilizado por
las 3 páginas de resultados. El shell global de M35 (header+main+footer) queda
intacto; el split vive *dentro* de `main`.

## Fases

### Fase 0 — Contrato y decisiones (sin código)
- ADR-10 (frontera del secreto) y ADR-11 (estado efímero) en el vault.
- Diccionario de tokens (`M36-token-dictionary.md`) — vocabulario de `drivers` y
  `sources` con su traducción semántica legible.
- Spec visual de las animaciones → **diferida al inicio de Fase 3** (no bloquea
  nada y evita rediseñar algo que se construye más tarde).
- **Salida:** plan + ADRs + diccionario aprobados antes de tocar código.

### Fase 1 — Panel de fuentes (victoria barata y segura) · frontend
- Componente compartido **`<DetailPanelLayout>`**: split-view en desktop (app a
  la izquierda, nota a la derecha, panel sticky + fila activa resaltada),
  **bottom sheet** en móvil.
- Filas de tabla clicables (toda la fila + chevron discreto).
- Panel capa 1: procedencia **reformulada semánticamente** (no "Fuente: INE"
  sino su significado) + indicador de fiabilidad + comparación INE. **Datos que
  ya existen** (`referenceSource`, `referenceReliability`, `ineComparison`).
- Health score → desplegable secundario (bajar protagonismo en el DOM).
- Piloto en `ResultsPage` → validar → extender a `DiagnosisPage` e
  `InverseResultsPage`. Commit + screenshot por página.

### Fase 2 — Drivers cualitativos (la joya del TFG) · backend + frontend
- **Backend:** instrumentar las ~12 funciones `calc*Target` para devolver
  `{ target, drivers, direction }` (condición y etiqueta **juntas**). Emitir
  `drivers`/`direction`/`sources` por categoría en las 3 APIs (aditivo).
- **Seguridad:** dejar de enviar `rawTargets` crudos al cliente.
- **Frontend:** capa 2 del panel — narrativa "por qué este valor para ti"
  compuesta desde el diccionario de tokens.
- **Validación:** confirmar que ningún número de la lógica se filtra al cliente.

### Fase 3 — Animaciones y pedagogía · frontend + backend (mínimo)
- **Backend:** emitir `solveMeta` (nº de variables y restricciones reales). Nada
  de iteraciones falsas (la librería no las expone de forma fiable).
- **Frontend:** `<CalculatingGate minMs≈2500>` que desacopla la animación del
  cálculo real → **barras buscando equilibrio** como pantalla de carga (legible,
  fiel, saltable, gating "primera vez").
- **Frontend:** ilustración del **politopo del símplex** dentro del panel "cómo
  se calcula esto" (pedagógica, bajo demanda).

### Fase 4 — QA + cierre · tester + cerebro
- Re-auditoría AA del panel y animaciones (axe), responsive desktop+móvil.
- **Verificación anti-fuga:** inspeccionar el JSON real de las APIs.
- Smoke test de los 3 flujos + funnel `/study`.
- Documentar cierre en el vault (cerebro) + merge `--no-ff` a `main`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Fuga de lógica (Fase 2) | Contrato de tokens + no enviar `rawTargets` + verificación en Fase 4 |
| Sobrecarga cognitiva | Principio de capas; cada pieza prescindible; default limpio |
| Animación que canse/confunda | Barras-equilibrio (legibles) + politopo solo bajo demanda + saltable |
| Coste de mantenimiento de drivers | Condición + etiqueta acopladas en cada `calc*Target` |

## NO scope

- No revelar la lógica de negocio (fórmulas, pesos, deltas).
- No falsear datos de proceso (contadores de iteraciones inventados).
- No tocar la lógica de cálculo (solo añadir salida aditiva).
- No introducir TypeScript ni cambiar de librería de componentes.
- No modo oscuro (sigue fuera de scope desde M35).

## Archivos clave

- `src/lib/calculators/profileCalculator.js` — instrumentación de `drivers` (Fase 2)
- `src/lib/calculators/distributionEngine.js` — ya emite fuentes/diagnóstico
- `src/lib/calculators/lpSolver.js` — origen de `solveMeta` (Fase 3)
- `src/lib/models/categories.js` — `referenceSource`, `referenceReliability`
- `src/components/ui/` — nuevo `DetailPanelLayout` y `CalculatingGate`
- `src/components/pages/ResultsPage.jsx`, `DiagnosisPage.jsx`, `InverseResultsPage.jsx`
- `docs/m36/M36-token-dictionary.md` — diccionario de tokens
