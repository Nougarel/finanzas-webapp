# Reporte /api/calculate-inverse -- sweep exhaustivo v2

Generado: 2026-06-05T17:45:46

Servidor: http://localhost:3000

## Configuracion del sweep

| Parametro | Valor |
|-----------|-------|
| Perfiles | 25 |
| Category sets | 10 |
| Llamadas HTTP totales | **5825** (estimado: 5825) |
| Tiempo total | 167.3s |

## Resumen de resultados

| Metrica | Valor |
|---------|-------|
| Llamadas HTTP | **5825** |
| feasible:true | **3808** |
| feasible:false | **0** |
| requiresConfirmation | **2017** |
| Errores HTTP/500 | **0** |
| Aserciones evaluadas | **22848** |
| PASS | **22848** |
| FAIL | **0** |
| INFO | **2017** |
| FAIL CRITICO | **0** |
| FAIL ALTO | **0** |
| FAIL MEDIO | **0** |
| FAIL BAJO | **0** |

## Distribucion de feasibility por nivel de cobertura

| Set | Total | feasible | %feasible | infeasible | requiresConf | err/500 |
|-----|-------|----------|-----------|------------|--------------|---------|
| L0_empty | 25 | 25 | 100.0% | 0 | 0 | 0 |
| L1_need | 200 | 186 | 93.0% | 0 | 14 | 0 |
| L1_want | 150 | 150 | 100.0% | 0 | 0 | 0 |
| L1_saving | 150 | 150 | 100.0% | 0 | 0 | 0 |
| L3_mixed | 675 | 639 | 94.7% | 0 | 36 | 0 |
| L3_needs | 675 | 433 | 64.1% | 0 | 242 | 0 |
| L6_mixed | 1600 | 1472 | 92.0% | 0 | 128 | 0 |
| L6_needs | 1600 | 556 | 34.8% | 0 | 1044 | 0 |
| L12_mixed | 500 | 174 | 34.8% | 0 | 326 | 0 |
| L20_all | 250 | 23 | 9.2% | 0 | 227 | 0 |

## Bugs encontrados

No se encontraron bugs.

---
Generado por test_runner_inverse_v2.py el 2026-06-05T17:45:46
