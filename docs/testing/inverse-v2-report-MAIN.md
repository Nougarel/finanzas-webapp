# Reporte /api/calculate-inverse -- sweep exhaustivo v2

Generado: 2026-06-04T18:09:02

Servidor: http://localhost:3000

## Configuracion del sweep

| Parametro | Valor |
|-----------|-------|
| Perfiles | 25 |
| Category sets | 10 |
| Llamadas HTTP totales | **5825** (estimado: 5825) |
| Tiempo total | 109.0s |

## Resumen de resultados

| Metrica | Valor |
|---------|-------|
| Llamadas HTTP | **5825** |
| feasible:true | **3808** |
| feasible:false | **0** |
| requiresConfirmation | **2017** |
| Errores HTTP/500 | **0** |
| Aserciones evaluadas | **22848** |
| PASS | **22836** |
| FAIL | **12** |
| INFO | **2017** |
| FAIL CRITICO | **0** |
| FAIL ALTO | **12** |
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

### ALTO (12)

| Perfil | Set | Asercion | Spec (preview) | Detalle |
|--------|-----|----------|----------------|---------|
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1309, 'utilities': 228, 'groceries': 51, 'transport': 1518, 'health': 563} | S=8911 tgt=9037 diff=126 tol=45.19 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 476, 'utilities': 1034, 'groceries': 1232, 'transport': 54, 'health': 1149} | S=11117.99 tgt=13679 diff=2561.01 tol=68.39 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 696, 'utilities': 569, 'groceries': 318, 'transport': 440, 'health': 1960} | S=10120.03 tgt=23334 diff=13213.97 tol=116.67 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1992, 'utilities': 1888, 'groceries': 775, 'transport': 161, 'health': 1130} | S=12133.0 tgt=19266 diff=7133.0 tol=96.33 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1774, 'utilities': 206, 'groceries': 778, 'transport': 569, 'health': 928} | S=11610.99 tgt=15489 diff=3878.01 tol=77.45 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1093, 'utilities': 1493, 'groceries': 501, 'transport': 334, 'health': 946} | S=11241.97 tgt=15235 diff=3993.03 tol=76.17 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 548, 'utilities': 135, 'groceries': 432, 'transport': 1870, 'health': 1931} | S=12211.96 tgt=22989 diff=10777.04 tol=114.95 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1103, 'utilities': 538, 'groceries': 1529, 'transport': 1197, 'health': 877} | S=11835.02 tgt=21882 diff=10046.98 tol=109.41 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1622, 'utilities': 1393, 'groceries': 864, 'transport': 1221, 'health': 130} | S=12710.98 tgt=14215 diff=1504.02 tol=71.08 |
| P23 | L20_all | I4-sumHD~req-debt | {'housing': 1574, 'utilities': 1312, 'groceries': 696, 'transport': 228, 'health': 601} | S=11372.99 tgt=13389 diff=2016.01 tol=66.95 |
| P25 | L20_all | I4-sumHD~req-debt | {'housing': 696, 'utilities': 569, 'groceries': 318, 'transport': 440, 'health': 1960} | S=10120.0 tgt=14001 diff=3881.0 tol=70.0 |
| P25 | L20_all | I4-sumHD~req-debt | {'housing': 548, 'utilities': 135, 'groceries': 432, 'transport': 1870, 'health': 1931} | S=12212.01 tgt=13793 diff=1580.99 tol=68.97 |

## Payloads de reproduccion -- top bugs

### Bug 1 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=8911 tgt=9037 diff=126 tol=45.19

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 1309, "utilities": 228, "groceries": 51, "transport": 1518, "health": 563, "education": 501, "dining_out": 228, "travel": 142, "clothing": 754, "personal_care": 104, "entertainment": 692, "hobbies": 758, "subscriptions": 558, "gifts": 89, "life_insurance": 604, "emergency_fund": 432, "short_term_savings": 32, "long_term_savings": 30, "investment": 95, "debt_extra": 223}}'

### Bug 2 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=11117.99 tgt=13679 diff=2561.01 tol=68.39

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 476, "utilities": 1034, "groceries": 1232, "transport": 54, "health": 1149, "education": 407, "dining_out": 733, "travel": 665, "clothing": 718, "personal_care": 558, "entertainment": 429, "hobbies": 225, "subscriptions": 459, "gifts": 603, "life_insurance": 284, "emergency_fund": 6, "short_term_savings": 777, "long_term_savings": 163, "investment": 714, "debt_extra": 432}}'

### Bug 3 -- ALTO: I4-sumHD~req-debt

**Perfil:** P23  |  **Set:** L20_all

**Detalle:** S=10120.03 tgt=23334 diff=13213.97 tol=116.67

curl -s -X POST http://localhost:3000/api/calculate-inverse \
  -H "Content-Type: application/json" \
  -d '{"profile":"{"ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard", "employmentStatus": "permanent", "dependents": 0, "hasPartner": false, "partnerHasIncome": false, "vehicleStatus": "financed", "privateHealthInsurance": "complete", "ownEducation": "formal", "emergencyFundStatus": "complete", "housingPurchaseGoal": false, "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0, "childrenAtUniversity": 0, "childrenStudyingAway": 0}","specifiedAmounts":"{"housing": 696, "utilities": 569, "groceries": 318, "transport": 440, "health": 1960, "education": 1563, "dining_out": 344, "travel": 104, "clothing": 94, "personal_care": 389, "entertainment": 99, "hobbies": 367, "subscriptions": 352, "gifts": 618, "life_insurance": 270, "emergency_fund": 44, "short_term_savings": 747, "long_term_savings": 470, "investment": 549, "debt_extra": 127}}'

---
Generado por test_runner_inverse_v2.py el 2026-06-04T18:09:02
