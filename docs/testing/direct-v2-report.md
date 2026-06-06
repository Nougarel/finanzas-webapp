# Reporte /api/calculate - sweep directo v2

Generado: 2026-06-05T17:46:10

Servidor: http://localhost:3000

Perfiles: 25  x  Incomes: 29  =  725 llamadas

## Resumen

| Metrica | Valor |
|---------|-------|
| Llamadas HTTP totales | **725** |
| Aserciones evaluadas | **4655** |
| PASS | **4655** |
| FAIL | **0** |
| INFO comportamiento esperado | **60** |
| INFO - income <= 0 | 25 |
| INFO - insolvencyBlock | 35 |
| FAIL CRITICO | **0** |
| FAIL ALTO | **0** |
| FAIL MEDIO | **0** |
| FAIL BAJO | **0** |

## Bugs encontrados

No se encontraron bugs.

## Comportamiento en ingresos extremos - cortes de insolvencia

Para cada perfil: primer income > 0 que devuelve HTTP 200.
Incomes bloqueados: insolvencyBlock=true (comportamiento esperado post-fix).

| Perfil | monthlyDebt | Primer income 200 | Observaciones |
|--------|-------------|-------------------|---------------|
| P01 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P02 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P03 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P04 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P05 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P06 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P07 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P08 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P09 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P10 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P11 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P12 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P13 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P14 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P15 | 100EUR | 200 | 2 incomes bloqueados por insolvencia |
| P16 | 300EUR | 400 | 4 incomes bloqueados por insolvencia |
| P17 | 600EUR | 700 | 7 incomes bloqueados por insolvencia |
| P18 | 1000EUR | 1100 | 11 incomes bloqueados por insolvencia |
| P19 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P20 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P21 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P22 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P23 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P24 | 0EUR | 50 | 0 incomes bloqueados por insolvencia |
| P25 | 1000EUR | 1100 | 11 incomes bloqueados por insolvencia |

## Distribucion de resultados por nivel de ingreso

| Income | HTTP200 | INFO-inc0 | INFO-insolv | FAIL-400 | HTTP500 | FAIL-otro |
|--------|---------|-----------|-------------|----------|---------|-----------|
| 0 | 0 | 25 | 0 | 0 | 0 | 0 |
| 50 | 20 | 0 | 5 | 0 | 0 | 0 |
| 100 | 20 | 0 | 5 | 0 | 0 | 0 |
| 200 | 21 | 0 | 4 | 0 | 0 | 0 |
| 300 | 21 | 0 | 4 | 0 | 0 | 0 |
| 400 | 22 | 0 | 3 | 0 | 0 | 0 |
| 500 | 22 | 0 | 3 | 0 | 0 | 0 |
| 600 | 22 | 0 | 3 | 0 | 0 | 0 |
| 700 | 23 | 0 | 2 | 0 | 0 | 0 |
| 800 | 23 | 0 | 2 | 0 | 0 | 0 |
| 900 | 23 | 0 | 2 | 0 | 0 | 0 |
| 1000 | 23 | 0 | 2 | 0 | 0 | 0 |
| 1100 | 25 | 0 | 0 | 0 | 0 | 0 |
| 1200 | 25 | 0 | 0 | 0 | 0 | 0 |
| 1500 | 25 | 0 | 0 | 0 | 0 | 0 |
| 1800 | 25 | 0 | 0 | 0 | 0 | 0 |
| 2000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 2500 | 25 | 0 | 0 | 0 | 0 | 0 |
| 3000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 3500 | 25 | 0 | 0 | 0 | 0 | 0 |
| 4000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 5000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 7000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 10000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 15000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 20000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 25000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 50000 | 25 | 0 | 0 | 0 | 0 | 0 |
| 100000 | 25 | 0 | 0 | 0 | 0 | 0 |

## Detalle de llamadas fallidas

Ninguna llamada fallida.


---
Generado por test_runner_direct_v2.py el 2026-06-05T17:46:10
