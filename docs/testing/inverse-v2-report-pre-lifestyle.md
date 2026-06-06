# Reporte /api/calculate-inverse -- sweep exhaustivo v2

Generado: 2026-06-05T16:00:36

Servidor: http://localhost:3000

## Configuracion del sweep

| Parametro | Valor |
|-----------|-------|
| Perfiles | 25 |
| Category sets | 10 |
| Llamadas HTTP totales | **5825** (estimado: 5825) |
| Tiempo total | 150.9s |

## Resumen de resultados

| Metrica | Valor |
|---------|-------|
| Llamadas HTTP | **5825** |
| feasible:true | **3808** |
| feasible:false | **0** |
| requiresConfirmation | **2017** |
| Errores HTTP/500 | **0** |
| Aserciones evaluadas | **22848** |
| PASS | **22842** |
| FAIL | **6** |
| INFO | **2017** |
| FAIL CRITICO | **0** |
| FAIL ALTO | **6** |
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

### ALTO (6)

| Perfil | Set | Asercion | Spec (preview) | Detalle |
|--------|-----|----------|----------------|---------|
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 696, 'utilities': 569, 'groceries': 318, 'transport': 440, 'health': 1960} | S=10120.0 tgt=13067 diff=2947.0 tol=65.34 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1992, 'utilities': 1888, 'groceries': 775, 'transport': 161, 'health': 1130} | S=12132.99 tgt=12587 diff=454.01 tol=62.94 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 548, 'utilities': 135, 'groceries': 432, 'transport': 1870, 'health': 1931} | S=12211.99 tgt=12874 diff=662.01 tol=64.37 |
| P25 | L20_all | I4-sumHD~req-debt | {'housing': 696, 'utilities': 569, 'groceries': 318, 'transport': 440, 'health': 1960} | S=10120.0 tgt=13067 diff=2947.0 tol=65.34 |
| P25 | L20_all | I4-sumHD~req-debt | {'housing': 1992, 'utilities': 1888, 'groceries': 775, 'transport': 161, 'health': 1130} | S=12132.99 tgt=12587 diff=454.01 tol=62.94 |
| P25 | L20_all | I4-sumHD~req-debt | {'housing': 548, 'utilities': 135, 'groceries': 432, 'transport': 1870, 'health': 1931} | S=12211.99 tgt=12874 diff=662.01 tol=64.37 |

## Payloads de reproduccion -- top bugs

### Bug 1 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=10120.0 tgt=13067 diff=2947.0 tol=65.34

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 696, "utilities": 569, "groceries": 318, "transport": 440, "health": 1960, "education": 1563, "dining_out": 344, "travel": 104, "clothing": 94, "personal_care": 389, "entertainment": 99, "hobbies": 367, "subscriptions": 352, "gifts": 618, "life_insurance": 270, "emergency_fund": 44, "short_term_savings": 747, "long_term_savings": 470, "investment": 549, "debt_extra": 127}}'

### Bug 2 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=12132.99 tgt=12587 diff=454.01 tol=62.94

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 1992, "utilities": 1888, "groceries": 775, "transport": 161, "health": 1130, "education": 600, "dining_out": 643, "travel": 633, "clothing": 370, "personal_care": 591, "entertainment": 196, "hobbies": 721, "subscriptions": 71, "gifts": 46, "life_insurance": 677, "emergency_fund": 233, "short_term_savings": 791, "long_term_savings": 296, "investment": 81, "debt_extra": 238}}'

### Bug 3 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=12211.99 tgt=12874 diff=662.01 tol=64.37

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 548, "utilities": 135, "groceries": 432, "transport": 1870, "health": 1931, "education": 1161, "dining_out": 735, "travel": 322, "clothing": 217, "personal_care": 671, "entertainment": 511, "hobbies": 405, "subscriptions": 658, "gifts": 469, "life_insurance": 146, "emergency_fund": 271, "short_term_savings": 142, "long_term_savings": 252, "investment": 762, "debt_extra": 574}}'

---
Generado por test_runner_inverse_v2.py el 2026-06-05T16:00:36
