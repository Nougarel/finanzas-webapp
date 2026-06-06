# Reporte de testing funcional -- flouss

Generado: 2026-06-04T16:23:42

Servidor: http://localhost:3000

## Resumen

- Aserciones totales: **4017**
- PASS: **4006**
- FAIL: **11**
- CRITICO: **10**
- ALTO: **0**
- MEDIO: **1**
- BAJO: **0**

## Bugs por severidad

### CRITICO (10)

| Test | Detalle |
|------|----------|
| [B P17@500] totalCheck+deuda~100 | tc=40 +debt=120.00=160.00 |
| [B P17@700] totalCheck+deuda~100 | tc=28.57 +debt=85.71=114.28 |
| [B P18@500] totalCheck+deuda~100 | tc=40 +debt=200.00=240.00 |
| [B P18@700] totalCheck+deuda~100 | tc=28.57 +debt=142.86=171.43 |
| [B P18@900] totalCheck+deuda~100 | tc=22.22 +debt=111.11=133.33 |
| [B P18@1000] totalCheck+deuda~100 | tc=20 +debt=100.00=120.00 |
| [B P25@500] totalCheck+deuda~100 | tc=40 +debt=200.00=240.00 |
| [B P25@700] totalCheck+deuda~100 | tc=28.57 +debt=142.86=171.43 |
| [B P25@900] totalCheck+deuda~100 | tc=22.22 +debt=111.11=133.33 |
| [B P25@1000] totalCheck+deuda~100 | tc=20 +debt=100.00=120.00 |

### MEDIO (1)

| Test | Detalle |
|------|----------|
| [E03] housing~700(+-15pct) | housing=500.10 req=2001 |

## Detalle completo

| Test | Estado | Sev | Detalle |
|------|--------|-----|----------|
| [B P01@500] HTTP200 | PASS | - |  |
| [B P01@500] amounts>=0&finitos | PASS | - |  |
| [B P01@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P01@500] rango_factible | PASS | - |  |
| [B P01@500] score[0,100] | PASS | - | score=100 |
| [B P01@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P01@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P01@700] HTTP200 | PASS | - |  |
| [B P01@700] amounts>=0&finitos | PASS | - |  |
| [B P01@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P01@700] rango_factible | PASS | - |  |
| [B P01@700] score[0,100] | PASS | - | score=100 |
| [B P01@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P01@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P01@900] HTTP200 | PASS | - |  |
| [B P01@900] amounts>=0&finitos | PASS | - |  |
| [B P01@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P01@900] rango_factible | PASS | - |  |
| [B P01@900] score[0,100] | PASS | - | score=100 |
| [B P01@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P01@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P01@1000] HTTP200 | PASS | - |  |
| [B P01@1000] amounts>=0&finitos | PASS | - |  |
| [B P01@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P01@1000] rango_factible | PASS | - |  |
| [B P01@1000] score[0,100] | PASS | - | score=100 |
| [B P01@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P01@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P01@1200] HTTP200 | PASS | - |  |
| [B P01@1200] amounts>=0&finitos | PASS | - |  |
| [B P01@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P01@1200] rango_factible | PASS | - |  |
| [B P01@1200] score[0,100] | PASS | - | score=100 |
| [B P01@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P01@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P01@1500] HTTP200 | PASS | - |  |
| [B P01@1500] amounts>=0&finitos | PASS | - |  |
| [B P01@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P01@1500] rango_factible | PASS | - |  |
| [B P01@1500] score[0,100] | PASS | - | score=100 |
| [B P01@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P01@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@1500] wants[10,80] | PASS | - | wants_int=10.04 |
| [B P01@1800] HTTP200 | PASS | - |  |
| [B P01@1800] amounts>=0&finitos | PASS | - |  |
| [B P01@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P01@1800] rango_factible | PASS | - |  |
| [B P01@1800] score[0,100] | PASS | - | score=100 |
| [B P01@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P01@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@1800] wants[10,80] | PASS | - | wants_int=12.34 |
| [B P01@2000] HTTP200 | PASS | - |  |
| [B P01@2000] amounts>=0&finitos | PASS | - |  |
| [B P01@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P01@2000] rango_factible | PASS | - |  |
| [B P01@2000] score[0,100] | PASS | - | score=100 |
| [B P01@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P01@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@2000] wants[10,80] | PASS | - | wants_int=13.50 |
| [B P01@2500] HTTP200 | PASS | - |  |
| [B P01@2500] amounts>=0&finitos | PASS | - |  |
| [B P01@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P01@2500] rango_factible | PASS | - |  |
| [B P01@2500] score[0,100] | PASS | - | score=100 |
| [B P01@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P01@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@2500] wants[10,80] | PASS | - | wants_int=20.60 |
| [B P01@3000] HTTP200 | PASS | - |  |
| [B P01@3000] amounts>=0&finitos | PASS | - |  |
| [B P01@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P01@3000] rango_factible | PASS | - |  |
| [B P01@3000] score[0,100] | PASS | - | score=100 |
| [B P01@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P01@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@3000] wants[10,80] | PASS | - | wants_int=25.42 |
| [B P01@3500] HTTP200 | PASS | - |  |
| [B P01@3500] amounts>=0&finitos | PASS | - |  |
| [B P01@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P01@3500] rango_factible | PASS | - |  |
| [B P01@3500] score[0,100] | PASS | - | score=100 |
| [B P01@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P01@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@3500] wants[10,80] | PASS | - | wants_int=28.92 |
| [B P01@4000] HTTP200 | PASS | - |  |
| [B P01@4000] amounts>=0&finitos | PASS | - |  |
| [B P01@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P01@4000] rango_factible | PASS | - |  |
| [B P01@4000] score[0,100] | PASS | - | score=95 |
| [B P01@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P01@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@4000] wants[10,80] | PASS | - | wants_int=31.58 |
| [B P01@5000] HTTP200 | PASS | - |  |
| [B P01@5000] amounts>=0&finitos | PASS | - |  |
| [B P01@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P01@5000] rango_factible | PASS | - |  |
| [B P01@5000] score[0,100] | PASS | - | score=95 |
| [B P01@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P01@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@5000] wants[10,80] | PASS | - | wants_int=35.37 |
| [B P01@7000] HTTP200 | PASS | - |  |
| [B P01@7000] amounts>=0&finitos | PASS | - |  |
| [B P01@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P01@7000] rango_factible | PASS | - |  |
| [B P01@7000] score[0,100] | PASS | - | score=90 |
| [B P01@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P01@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@7000] wants[10,80] | PASS | - | wants_int=39.81 |
| [B P01@10000] HTTP200 | PASS | - |  |
| [B P01@10000] amounts>=0&finitos | PASS | - |  |
| [B P01@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P01@10000] rango_factible | PASS | - |  |
| [B P01@10000] score[0,100] | PASS | - | score=90 |
| [B P01@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P01@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@10000] wants[10,80] | PASS | - | wants_int=43.26 |
| [B P01@15000] HTTP200 | PASS | - |  |
| [B P01@15000] amounts>=0&finitos | PASS | - |  |
| [B P01@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P01@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P01@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P01@15000] rango_factible | PASS | - |  |
| [B P01@15000] score[0,100] | PASS | - | score=90 |
| [B P01@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P01@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P01@15000] wants[10,80] | PASS | - | wants_int=45.67 |
| [B P02@500] HTTP200 | PASS | - |  |
| [B P02@500] amounts>=0&finitos | PASS | - |  |
| [B P02@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P02@500] rango_factible | PASS | - |  |
| [B P02@500] score[0,100] | PASS | - | score=100 |
| [B P02@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P02@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@700] HTTP200 | PASS | - |  |
| [B P02@700] amounts>=0&finitos | PASS | - |  |
| [B P02@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P02@700] rango_factible | PASS | - |  |
| [B P02@700] score[0,100] | PASS | - | score=100 |
| [B P02@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P02@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@900] HTTP200 | PASS | - |  |
| [B P02@900] amounts>=0&finitos | PASS | - |  |
| [B P02@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P02@900] rango_factible | PASS | - |  |
| [B P02@900] score[0,100] | PASS | - | score=100 |
| [B P02@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P02@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@1000] HTTP200 | PASS | - |  |
| [B P02@1000] amounts>=0&finitos | PASS | - |  |
| [B P02@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P02@1000] rango_factible | PASS | - |  |
| [B P02@1000] score[0,100] | PASS | - | score=100 |
| [B P02@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P02@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@1200] HTTP200 | PASS | - |  |
| [B P02@1200] amounts>=0&finitos | PASS | - |  |
| [B P02@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P02@1200] rango_factible | PASS | - |  |
| [B P02@1200] score[0,100] | PASS | - | score=100 |
| [B P02@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P02@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@1500] HTTP200 | PASS | - |  |
| [B P02@1500] amounts>=0&finitos | PASS | - |  |
| [B P02@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P02@1500] rango_factible | PASS | - |  |
| [B P02@1500] score[0,100] | PASS | - | score=100 |
| [B P02@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P02@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@1800] HTTP200 | PASS | - |  |
| [B P02@1800] amounts>=0&finitos | PASS | - |  |
| [B P02@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P02@1800] rango_factible | PASS | - |  |
| [B P02@1800] score[0,100] | PASS | - | score=100 |
| [B P02@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P02@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P02@2000] HTTP200 | PASS | - |  |
| [B P02@2000] amounts>=0&finitos | PASS | - |  |
| [B P02@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@2000] Samounts~effIncome | PASS | - | S=2000.01 eff=2000 |
| [B P02@2000] rango_factible | PASS | - |  |
| [B P02@2000] score[0,100] | PASS | - | score=100 |
| [B P02@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P02@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@2000] wants[10,80] | PASS | - | wants_int=10.50 |
| [B P02@2500] HTTP200 | PASS | - |  |
| [B P02@2500] amounts>=0&finitos | PASS | - |  |
| [B P02@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P02@2500] rango_factible | PASS | - |  |
| [B P02@2500] score[0,100] | PASS | - | score=100 |
| [B P02@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P02@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@2500] wants[10,80] | PASS | - | wants_int=18.15 |
| [B P02@3000] HTTP200 | PASS | - |  |
| [B P02@3000] amounts>=0&finitos | PASS | - |  |
| [B P02@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@3000] Samounts~effIncome | PASS | - | S=2999.98 eff=3000 |
| [B P02@3000] rango_factible | PASS | - |  |
| [B P02@3000] score[0,100] | PASS | - | score=100 |
| [B P02@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P02@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@3000] wants[10,80] | PASS | - | wants_int=23.34 |
| [B P02@3500] HTTP200 | PASS | - |  |
| [B P02@3500] amounts>=0&finitos | PASS | - |  |
| [B P02@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P02@3500] rango_factible | PASS | - |  |
| [B P02@3500] score[0,100] | PASS | - | score=100 |
| [B P02@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P02@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@3500] wants[10,80] | PASS | - | wants_int=27.11 |
| [B P02@4000] HTTP200 | PASS | - |  |
| [B P02@4000] amounts>=0&finitos | PASS | - |  |
| [B P02@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P02@4000] rango_factible | PASS | - |  |
| [B P02@4000] score[0,100] | PASS | - | score=100 |
| [B P02@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P02@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@4000] wants[10,80] | PASS | - | wants_int=29.97 |
| [B P02@5000] HTTP200 | PASS | - |  |
| [B P02@5000] amounts>=0&finitos | PASS | - |  |
| [B P02@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P02@5000] rango_factible | PASS | - |  |
| [B P02@5000] score[0,100] | PASS | - | score=95 |
| [B P02@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P02@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@5000] wants[10,80] | PASS | - | wants_int=34.05 |
| [B P02@7000] HTTP200 | PASS | - |  |
| [B P02@7000] amounts>=0&finitos | PASS | - |  |
| [B P02@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@7000] Samounts~effIncome | PASS | - | S=6999.99 eff=7000 |
| [B P02@7000] rango_factible | PASS | - |  |
| [B P02@7000] score[0,100] | PASS | - | score=90 |
| [B P02@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P02@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@7000] wants[10,80] | PASS | - | wants_int=38.84 |
| [B P02@10000] HTTP200 | PASS | - |  |
| [B P02@10000] amounts>=0&finitos | PASS | - |  |
| [B P02@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@10000] Samounts~effIncome | PASS | - | S=10000.00 eff=10000 |
| [B P02@10000] rango_factible | PASS | - |  |
| [B P02@10000] score[0,100] | PASS | - | score=90 |
| [B P02@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P02@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@10000] wants[10,80] | PASS | - | wants_int=42.56 |
| [B P02@15000] HTTP200 | PASS | - |  |
| [B P02@15000] amounts>=0&finitos | PASS | - |  |
| [B P02@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P02@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P02@15000] Samounts~effIncome | PASS | - | S=14999.96 eff=15000 |
| [B P02@15000] rango_factible | PASS | - |  |
| [B P02@15000] score[0,100] | PASS | - | score=90 |
| [B P02@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P02@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P02@15000] wants[10,80] | PASS | - | wants_int=45.18 |
| [B P03@500] HTTP200 | PASS | - |  |
| [B P03@500] amounts>=0&finitos | PASS | - |  |
| [B P03@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P03@500] rango_factible | PASS | - |  |
| [B P03@500] score[0,100] | PASS | - | score=100 |
| [B P03@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P03@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P03@700] HTTP200 | PASS | - |  |
| [B P03@700] amounts>=0&finitos | PASS | - |  |
| [B P03@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P03@700] rango_factible | PASS | - |  |
| [B P03@700] score[0,100] | PASS | - | score=100 |
| [B P03@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P03@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P03@900] HTTP200 | PASS | - |  |
| [B P03@900] amounts>=0&finitos | PASS | - |  |
| [B P03@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P03@900] rango_factible | PASS | - |  |
| [B P03@900] score[0,100] | PASS | - | score=100 |
| [B P03@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P03@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P03@1000] HTTP200 | PASS | - |  |
| [B P03@1000] amounts>=0&finitos | PASS | - |  |
| [B P03@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P03@1000] rango_factible | PASS | - |  |
| [B P03@1000] score[0,100] | PASS | - | score=100 |
| [B P03@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P03@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P03@1200] HTTP200 | PASS | - |  |
| [B P03@1200] amounts>=0&finitos | PASS | - |  |
| [B P03@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P03@1200] rango_factible | PASS | - |  |
| [B P03@1200] score[0,100] | PASS | - | score=100 |
| [B P03@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P03@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P03@1500] HTTP200 | PASS | - |  |
| [B P03@1500] amounts>=0&finitos | PASS | - |  |
| [B P03@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@1500] Samounts~effIncome | PASS | - | S=1500.02 eff=1500 |
| [B P03@1500] rango_factible | PASS | - |  |
| [B P03@1500] score[0,100] | PASS | - | score=100 |
| [B P03@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P03@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@1500] wants[10,80] | PASS | - | wants_int=12.04 |
| [B P03@1800] HTTP200 | PASS | - |  |
| [B P03@1800] amounts>=0&finitos | PASS | - |  |
| [B P03@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P03@1800] rango_factible | PASS | - |  |
| [B P03@1800] score[0,100] | PASS | - | score=100 |
| [B P03@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P03@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@1800] wants[10,80] | PASS | - | wants_int=14.34 |
| [B P03@2000] HTTP200 | PASS | - |  |
| [B P03@2000] amounts>=0&finitos | PASS | - |  |
| [B P03@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P03@2000] rango_factible | PASS | - |  |
| [B P03@2000] score[0,100] | PASS | - | score=100 |
| [B P03@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P03@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@2000] wants[10,80] | PASS | - | wants_int=15.50 |
| [B P03@2500] HTTP200 | PASS | - |  |
| [B P03@2500] amounts>=0&finitos | PASS | - |  |
| [B P03@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P03@2500] rango_factible | PASS | - |  |
| [B P03@2500] score[0,100] | PASS | - | score=100 |
| [B P03@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P03@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@2500] wants[10,80] | PASS | - | wants_int=22.13 |
| [B P03@3000] HTTP200 | PASS | - |  |
| [B P03@3000] amounts>=0&finitos | PASS | - |  |
| [B P03@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P03@3000] rango_factible | PASS | - |  |
| [B P03@3000] score[0,100] | PASS | - | score=100 |
| [B P03@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P03@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@3000] wants[10,80] | PASS | - | wants_int=26.65 |
| [B P03@3500] HTTP200 | PASS | - |  |
| [B P03@3500] amounts>=0&finitos | PASS | - |  |
| [B P03@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@3500] Samounts~effIncome | PASS | - | S=3500.01 eff=3500 |
| [B P03@3500] rango_factible | PASS | - |  |
| [B P03@3500] score[0,100] | PASS | - | score=100 |
| [B P03@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P03@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@3500] wants[10,80] | PASS | - | wants_int=29.93 |
| [B P03@4000] HTTP200 | PASS | - |  |
| [B P03@4000] amounts>=0&finitos | PASS | - |  |
| [B P03@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@4000] Samounts~effIncome | PASS | - | S=4000.01 eff=4000 |
| [B P03@4000] rango_factible | PASS | - |  |
| [B P03@4000] score[0,100] | PASS | - | score=95 |
| [B P03@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P03@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@4000] wants[10,80] | PASS | - | wants_int=32.44 |
| [B P03@5000] HTTP200 | PASS | - |  |
| [B P03@5000] amounts>=0&finitos | PASS | - |  |
| [B P03@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@5000] Samounts~effIncome | PASS | - | S=4999.99 eff=5000 |
| [B P03@5000] rango_factible | PASS | - |  |
| [B P03@5000] score[0,100] | PASS | - | score=95 |
| [B P03@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P03@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@5000] wants[10,80] | PASS | - | wants_int=36.01 |
| [B P03@7000] HTTP200 | PASS | - |  |
| [B P03@7000] amounts>=0&finitos | PASS | - |  |
| [B P03@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@7000] Samounts~effIncome | PASS | - | S=6999.99 eff=7000 |
| [B P03@7000] rango_factible | PASS | - |  |
| [B P03@7000] score[0,100] | PASS | - | score=90 |
| [B P03@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P03@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@7000] wants[10,80] | PASS | - | wants_int=40.21 |
| [B P03@10000] HTTP200 | PASS | - |  |
| [B P03@10000] amounts>=0&finitos | PASS | - |  |
| [B P03@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P03@10000] rango_factible | PASS | - |  |
| [B P03@10000] score[0,100] | PASS | - | score=90 |
| [B P03@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P03@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@10000] wants[10,80] | PASS | - | wants_int=43.49 |
| [B P03@15000] HTTP200 | PASS | - |  |
| [B P03@15000] amounts>=0&finitos | PASS | - |  |
| [B P03@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P03@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P03@15000] Samounts~effIncome | PASS | - | S=15000.03 eff=15000 |
| [B P03@15000] rango_factible | PASS | - |  |
| [B P03@15000] score[0,100] | PASS | - | score=90 |
| [B P03@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P03@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P03@15000] wants[10,80] | PASS | - | wants_int=45.78 |
| [B P04@500] HTTP200 | PASS | - |  |
| [B P04@500] amounts>=0&finitos | PASS | - |  |
| [B P04@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P04@500] rango_factible | PASS | - |  |
| [B P04@500] score[0,100] | PASS | - | score=100 |
| [B P04@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P04@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P04@700] HTTP200 | PASS | - |  |
| [B P04@700] amounts>=0&finitos | PASS | - |  |
| [B P04@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P04@700] rango_factible | PASS | - |  |
| [B P04@700] score[0,100] | PASS | - | score=100 |
| [B P04@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P04@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P04@900] HTTP200 | PASS | - |  |
| [B P04@900] amounts>=0&finitos | PASS | - |  |
| [B P04@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P04@900] rango_factible | PASS | - |  |
| [B P04@900] score[0,100] | PASS | - | score=100 |
| [B P04@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P04@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P04@1000] HTTP200 | PASS | - |  |
| [B P04@1000] amounts>=0&finitos | PASS | - |  |
| [B P04@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P04@1000] rango_factible | PASS | - |  |
| [B P04@1000] score[0,100] | PASS | - | score=100 |
| [B P04@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P04@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P04@1200] HTTP200 | PASS | - |  |
| [B P04@1200] amounts>=0&finitos | PASS | - |  |
| [B P04@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P04@1200] rango_factible | PASS | - |  |
| [B P04@1200] score[0,100] | PASS | - | score=100 |
| [B P04@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P04@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P04@1500] HTTP200 | PASS | - |  |
| [B P04@1500] amounts>=0&finitos | PASS | - |  |
| [B P04@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@1500] Samounts~effIncome | PASS | - | S=1500.02 eff=1500 |
| [B P04@1500] rango_factible | PASS | - |  |
| [B P04@1500] score[0,100] | PASS | - | score=100 |
| [B P04@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P04@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@1500] wants[10,80] | PASS | - | wants_int=12.04 |
| [B P04@1800] HTTP200 | PASS | - |  |
| [B P04@1800] amounts>=0&finitos | PASS | - |  |
| [B P04@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P04@1800] rango_factible | PASS | - |  |
| [B P04@1800] score[0,100] | PASS | - | score=100 |
| [B P04@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P04@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@1800] wants[10,80] | PASS | - | wants_int=14.34 |
| [B P04@2000] HTTP200 | PASS | - |  |
| [B P04@2000] amounts>=0&finitos | PASS | - |  |
| [B P04@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P04@2000] rango_factible | PASS | - |  |
| [B P04@2000] score[0,100] | PASS | - | score=100 |
| [B P04@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P04@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@2000] wants[10,80] | PASS | - | wants_int=15.50 |
| [B P04@2500] HTTP200 | PASS | - |  |
| [B P04@2500] amounts>=0&finitos | PASS | - |  |
| [B P04@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@2500] Samounts~effIncome | PASS | - | S=2499.98 eff=2500 |
| [B P04@2500] rango_factible | PASS | - |  |
| [B P04@2500] score[0,100] | PASS | - | score=100 |
| [B P04@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P04@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@2500] wants[10,80] | PASS | - | wants_int=22.24 |
| [B P04@3000] HTTP200 | PASS | - |  |
| [B P04@3000] amounts>=0&finitos | PASS | - |  |
| [B P04@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@3000] Samounts~effIncome | PASS | - | S=2999.99 eff=3000 |
| [B P04@3000] rango_factible | PASS | - |  |
| [B P04@3000] score[0,100] | PASS | - | score=100 |
| [B P04@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P04@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@3000] wants[10,80] | PASS | - | wants_int=26.81 |
| [B P04@3500] HTTP200 | PASS | - |  |
| [B P04@3500] amounts>=0&finitos | PASS | - |  |
| [B P04@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@3500] Samounts~effIncome | PASS | - | S=3500.01 eff=3500 |
| [B P04@3500] rango_factible | PASS | - |  |
| [B P04@3500] score[0,100] | PASS | - | score=95 |
| [B P04@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P04@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@3500] wants[10,80] | PASS | - | wants_int=30.13 |
| [B P04@4000] HTTP200 | PASS | - |  |
| [B P04@4000] amounts>=0&finitos | PASS | - |  |
| [B P04@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@4000] Samounts~effIncome | PASS | - | S=3999.97 eff=4000 |
| [B P04@4000] rango_factible | PASS | - |  |
| [B P04@4000] score[0,100] | PASS | - | score=95 |
| [B P04@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P04@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@4000] wants[10,80] | PASS | - | wants_int=32.65 |
| [B P04@5000] HTTP200 | PASS | - |  |
| [B P04@5000] amounts>=0&finitos | PASS | - |  |
| [B P04@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@5000] Samounts~effIncome | PASS | - | S=5000.00 eff=5000 |
| [B P04@5000] rango_factible | PASS | - |  |
| [B P04@5000] score[0,100] | PASS | - | score=95 |
| [B P04@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P04@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@5000] wants[10,80] | PASS | - | wants_int=36.25 |
| [B P04@7000] HTTP200 | PASS | - |  |
| [B P04@7000] amounts>=0&finitos | PASS | - |  |
| [B P04@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P04@7000] rango_factible | PASS | - |  |
| [B P04@7000] score[0,100] | PASS | - | score=90 |
| [B P04@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P04@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@7000] wants[10,80] | PASS | - | wants_int=40.46 |
| [B P04@10000] HTTP200 | PASS | - |  |
| [B P04@10000] amounts>=0&finitos | PASS | - |  |
| [B P04@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@10000] Samounts~effIncome | PASS | - | S=10000.00 eff=10000 |
| [B P04@10000] rango_factible | PASS | - |  |
| [B P04@10000] score[0,100] | PASS | - | score=90 |
| [B P04@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P04@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@10000] wants[10,80] | PASS | - | wants_int=43.73 |
| [B P04@15000] HTTP200 | PASS | - |  |
| [B P04@15000] amounts>=0&finitos | PASS | - |  |
| [B P04@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P04@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P04@15000] Samounts~effIncome | PASS | - | S=14999.98 eff=15000 |
| [B P04@15000] rango_factible | PASS | - |  |
| [B P04@15000] score[0,100] | PASS | - | score=90 |
| [B P04@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P04@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P04@15000] wants[10,80] | PASS | - | wants_int=45.99 |
| [B P05@500] HTTP200 | PASS | - |  |
| [B P05@500] amounts>=0&finitos | PASS | - |  |
| [B P05@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@500] Samounts~effIncome | PASS | - | S=499.99 eff=500 |
| [B P05@500] rango_factible | PASS | - |  |
| [B P05@500] score[0,100] | PASS | - | score=100 |
| [B P05@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P05@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@500] wants[10,80] | PASS | - | wants_int=22.50 |
| [B P05@700] HTTP200 | PASS | - |  |
| [B P05@700] amounts>=0&finitos | PASS | - |  |
| [B P05@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P05@700] rango_factible | PASS | - |  |
| [B P05@700] score[0,100] | PASS | - | score=100 |
| [B P05@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P05@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@700] wants[10,80] | PASS | - | wants_int=22.50 |
| [B P05@900] HTTP200 | PASS | - |  |
| [B P05@900] amounts>=0&finitos | PASS | - |  |
| [B P05@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P05@900] rango_factible | PASS | - |  |
| [B P05@900] score[0,100] | PASS | - | score=100 |
| [B P05@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P05@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@900] wants[10,80] | PASS | - | wants_int=23.01 |
| [B P05@1000] HTTP200 | PASS | - |  |
| [B P05@1000] amounts>=0&finitos | PASS | - |  |
| [B P05@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@1000] Samounts~effIncome | PASS | - | S=1000.01 eff=1000 |
| [B P05@1000] rango_factible | PASS | - |  |
| [B P05@1000] score[0,100] | PASS | - | score=100 |
| [B P05@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P05@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@1000] wants[10,80] | PASS | - | wants_int=25.25 |
| [B P05@1200] HTTP200 | PASS | - |  |
| [B P05@1200] amounts>=0&finitos | PASS | - |  |
| [B P05@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P05@1200] rango_factible | PASS | - |  |
| [B P05@1200] score[0,100] | PASS | - | score=100 |
| [B P05@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P05@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@1200] wants[10,80] | PASS | - | wants_int=28.63 |
| [B P05@1500] HTTP200 | PASS | - |  |
| [B P05@1500] amounts>=0&finitos | PASS | - |  |
| [B P05@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P05@1500] rango_factible | PASS | - |  |
| [B P05@1500] score[0,100] | PASS | - | score=95 |
| [B P05@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P05@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@1500] wants[10,80] | PASS | - | wants_int=32.04 |
| [B P05@1800] HTTP200 | PASS | - |  |
| [B P05@1800] amounts>=0&finitos | PASS | - |  |
| [B P05@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P05@1800] rango_factible | PASS | - |  |
| [B P05@1800] score[0,100] | PASS | - | score=95 |
| [B P05@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P05@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@1800] wants[10,80] | PASS | - | wants_int=34.34 |
| [B P05@2000] HTTP200 | PASS | - |  |
| [B P05@2000] amounts>=0&finitos | PASS | - |  |
| [B P05@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@2000] Samounts~effIncome | PASS | - | S=2000.01 eff=2000 |
| [B P05@2000] rango_factible | PASS | - |  |
| [B P05@2000] score[0,100] | PASS | - | score=95 |
| [B P05@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P05@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@2000] wants[10,80] | PASS | - | wants_int=35.50 |
| [B P05@2500] HTTP200 | PASS | - |  |
| [B P05@2500] amounts>=0&finitos | PASS | - |  |
| [B P05@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P05@2500] rango_factible | PASS | - |  |
| [B P05@2500] score[0,100] | PASS | - | score=90 |
| [B P05@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P05@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@2500] wants[10,80] | PASS | - | wants_int=39.51 |
| [B P05@3000] HTTP200 | PASS | - |  |
| [B P05@3000] amounts>=0&finitos | PASS | - |  |
| [B P05@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P05@3000] rango_factible | PASS | - |  |
| [B P05@3000] score[0,100] | PASS | - | score=90 |
| [B P05@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P05@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@3000] wants[10,80] | PASS | - | wants_int=42.22 |
| [B P05@3500] HTTP200 | PASS | - |  |
| [B P05@3500] amounts>=0&finitos | PASS | - |  |
| [B P05@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P05@3500] rango_factible | PASS | - |  |
| [B P05@3500] score[0,100] | PASS | - | score=90 |
| [B P05@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P05@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@3500] wants[10,80] | PASS | - | wants_int=44.19 |
| [B P05@4000] HTTP200 | PASS | - |  |
| [B P05@4000] amounts>=0&finitos | PASS | - |  |
| [B P05@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@4000] Samounts~effIncome | PASS | - | S=4000.00 eff=4000 |
| [B P05@4000] rango_factible | PASS | - |  |
| [B P05@4000] score[0,100] | PASS | - | score=90 |
| [B P05@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P05@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@4000] wants[10,80] | PASS | - | wants_int=45.69 |
| [B P05@5000] HTTP200 | PASS | - |  |
| [B P05@5000] amounts>=0&finitos | PASS | - |  |
| [B P05@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@5000] Samounts~effIncome | PASS | - | S=5000.01 eff=5000 |
| [B P05@5000] rango_factible | PASS | - |  |
| [B P05@5000] score[0,100] | PASS | - | score=90 |
| [B P05@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P05@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@5000] wants[10,80] | PASS | - | wants_int=47.82 |
| [B P05@7000] HTTP200 | PASS | - |  |
| [B P05@7000] amounts>=0&finitos | PASS | - |  |
| [B P05@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@7000] Samounts~effIncome | PASS | - | S=6999.99 eff=7000 |
| [B P05@7000] rango_factible | PASS | - |  |
| [B P05@7000] score[0,100] | PASS | - | score=90 |
| [B P05@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P05@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@7000] wants[10,80] | PASS | - | wants_int=50.32 |
| [B P05@10000] HTTP200 | PASS | - |  |
| [B P05@10000] amounts>=0&finitos | PASS | - |  |
| [B P05@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P05@10000] rango_factible | PASS | - |  |
| [B P05@10000] score[0,100] | PASS | - | score=90 |
| [B P05@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P05@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@10000] wants[10,80] | PASS | - | wants_int=52.25 |
| [B P05@15000] HTTP200 | PASS | - |  |
| [B P05@15000] amounts>=0&finitos | PASS | - |  |
| [B P05@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P05@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P05@15000] Samounts~effIncome | PASS | - | S=14999.96 eff=15000 |
| [B P05@15000] rango_factible | PASS | - |  |
| [B P05@15000] score[0,100] | PASS | - | score=90 |
| [B P05@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P05@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P05@15000] wants[10,80] | PASS | - | wants_int=53.44 |
| [B P06@500] HTTP200 | PASS | - |  |
| [B P06@500] amounts>=0&finitos | PASS | - |  |
| [B P06@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@500] Samounts~effIncome | PASS | - | S=499.99 eff=500 |
| [B P06@500] rango_factible | PASS | - |  |
| [B P06@500] score[0,100] | PASS | - | score=100 |
| [B P06@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P06@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@500] wants[10,80] | PASS | - | wants_int=23.50 |
| [B P06@700] HTTP200 | PASS | - |  |
| [B P06@700] amounts>=0&finitos | PASS | - |  |
| [B P06@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P06@700] rango_factible | PASS | - |  |
| [B P06@700] score[0,100] | PASS | - | score=100 |
| [B P06@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P06@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@700] wants[10,80] | PASS | - | wants_int=23.50 |
| [B P06@900] HTTP200 | PASS | - |  |
| [B P06@900] amounts>=0&finitos | PASS | - |  |
| [B P06@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@900] Samounts~effIncome | PASS | - | S=900.02 eff=900 |
| [B P06@900] rango_factible | PASS | - |  |
| [B P06@900] score[0,100] | PASS | - | score=100 |
| [B P06@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P06@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@900] wants[10,80] | PASS | - | wants_int=24.01 |
| [B P06@1000] HTTP200 | PASS | - |  |
| [B P06@1000] amounts>=0&finitos | PASS | - |  |
| [B P06@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P06@1000] rango_factible | PASS | - |  |
| [B P06@1000] score[0,100] | PASS | - | score=100 |
| [B P06@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P06@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@1000] wants[10,80] | PASS | - | wants_int=26.25 |
| [B P06@1200] HTTP200 | PASS | - |  |
| [B P06@1200] amounts>=0&finitos | PASS | - |  |
| [B P06@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@1200] Samounts~effIncome | PASS | - | S=1199.99 eff=1200 |
| [B P06@1200] rango_factible | PASS | - |  |
| [B P06@1200] score[0,100] | PASS | - | score=100 |
| [B P06@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P06@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@1200] wants[10,80] | PASS | - | wants_int=29.63 |
| [B P06@1500] HTTP200 | PASS | - |  |
| [B P06@1500] amounts>=0&finitos | PASS | - |  |
| [B P06@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P06@1500] rango_factible | PASS | - |  |
| [B P06@1500] score[0,100] | PASS | - | score=95 |
| [B P06@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P06@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@1500] wants[10,80] | PASS | - | wants_int=33.04 |
| [B P06@1800] HTTP200 | PASS | - |  |
| [B P06@1800] amounts>=0&finitos | PASS | - |  |
| [B P06@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@1800] Samounts~effIncome | PASS | - | S=1800.01 eff=1800 |
| [B P06@1800] rango_factible | PASS | - |  |
| [B P06@1800] score[0,100] | PASS | - | score=95 |
| [B P06@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P06@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@1800] wants[10,80] | PASS | - | wants_int=35.34 |
| [B P06@2000] HTTP200 | PASS | - |  |
| [B P06@2000] amounts>=0&finitos | PASS | - |  |
| [B P06@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@2000] Samounts~effIncome | PASS | - | S=2000.01 eff=2000 |
| [B P06@2000] rango_factible | PASS | - |  |
| [B P06@2000] score[0,100] | PASS | - | score=95 |
| [B P06@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P06@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@2000] wants[10,80] | PASS | - | wants_int=36.50 |
| [B P06@2500] HTTP200 | PASS | - |  |
| [B P06@2500] amounts>=0&finitos | PASS | - |  |
| [B P06@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@2500] Samounts~effIncome | PASS | - | S=2500.00 eff=2500 |
| [B P06@2500] rango_factible | PASS | - |  |
| [B P06@2500] score[0,100] | PASS | - | score=90 |
| [B P06@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P06@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@2500] wants[10,80] | PASS | - | wants_int=40.51 |
| [B P06@3000] HTTP200 | PASS | - |  |
| [B P06@3000] amounts>=0&finitos | PASS | - |  |
| [B P06@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P06@3000] rango_factible | PASS | - |  |
| [B P06@3000] score[0,100] | PASS | - | score=90 |
| [B P06@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P06@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@3000] wants[10,80] | PASS | - | wants_int=43.22 |
| [B P06@3500] HTTP200 | PASS | - |  |
| [B P06@3500] amounts>=0&finitos | PASS | - |  |
| [B P06@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P06@3500] rango_factible | PASS | - |  |
| [B P06@3500] score[0,100] | PASS | - | score=90 |
| [B P06@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P06@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@3500] wants[10,80] | PASS | - | wants_int=45.19 |
| [B P06@4000] HTTP200 | PASS | - |  |
| [B P06@4000] amounts>=0&finitos | PASS | - |  |
| [B P06@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P06@4000] rango_factible | PASS | - |  |
| [B P06@4000] score[0,100] | PASS | - | score=90 |
| [B P06@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P06@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@4000] wants[10,80] | PASS | - | wants_int=46.69 |
| [B P06@5000] HTTP200 | PASS | - |  |
| [B P06@5000] amounts>=0&finitos | PASS | - |  |
| [B P06@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P06@5000] rango_factible | PASS | - |  |
| [B P06@5000] score[0,100] | PASS | - | score=90 |
| [B P06@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P06@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@5000] wants[10,80] | PASS | - | wants_int=48.82 |
| [B P06@7000] HTTP200 | PASS | - |  |
| [B P06@7000] amounts>=0&finitos | PASS | - |  |
| [B P06@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@7000] Samounts~effIncome | PASS | - | S=7000.00 eff=7000 |
| [B P06@7000] rango_factible | PASS | - |  |
| [B P06@7000] score[0,100] | PASS | - | score=90 |
| [B P06@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P06@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@7000] wants[10,80] | PASS | - | wants_int=51.32 |
| [B P06@10000] HTTP200 | PASS | - |  |
| [B P06@10000] amounts>=0&finitos | PASS | - |  |
| [B P06@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@10000] Samounts~effIncome | PASS | - | S=10000.02 eff=10000 |
| [B P06@10000] rango_factible | PASS | - |  |
| [B P06@10000] score[0,100] | PASS | - | score=90 |
| [B P06@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P06@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@10000] wants[10,80] | PASS | - | wants_int=53.25 |
| [B P06@15000] HTTP200 | PASS | - |  |
| [B P06@15000] amounts>=0&finitos | PASS | - |  |
| [B P06@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P06@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P06@15000] Samounts~effIncome | PASS | - | S=15000.01 eff=15000 |
| [B P06@15000] rango_factible | PASS | - |  |
| [B P06@15000] score[0,100] | PASS | - | score=90 |
| [B P06@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P06@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P06@15000] wants[10,80] | PASS | - | wants_int=54.44 |
| [B P07@500] HTTP200 | PASS | - |  |
| [B P07@500] amounts>=0&finitos | PASS | - |  |
| [B P07@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P07@500] rango_factible | PASS | - |  |
| [B P07@500] score[0,100] | PASS | - | score=100 |
| [B P07@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P07@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@700] HTTP200 | PASS | - |  |
| [B P07@700] amounts>=0&finitos | PASS | - |  |
| [B P07@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P07@700] rango_factible | PASS | - |  |
| [B P07@700] score[0,100] | PASS | - | score=100 |
| [B P07@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P07@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@900] HTTP200 | PASS | - |  |
| [B P07@900] amounts>=0&finitos | PASS | - |  |
| [B P07@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P07@900] rango_factible | PASS | - |  |
| [B P07@900] score[0,100] | PASS | - | score=100 |
| [B P07@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P07@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@1000] HTTP200 | PASS | - |  |
| [B P07@1000] amounts>=0&finitos | PASS | - |  |
| [B P07@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P07@1000] rango_factible | PASS | - |  |
| [B P07@1000] score[0,100] | PASS | - | score=100 |
| [B P07@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P07@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@1200] HTTP200 | PASS | - |  |
| [B P07@1200] amounts>=0&finitos | PASS | - |  |
| [B P07@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P07@1200] rango_factible | PASS | - |  |
| [B P07@1200] score[0,100] | PASS | - | score=100 |
| [B P07@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P07@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@1500] HTTP200 | PASS | - |  |
| [B P07@1500] amounts>=0&finitos | PASS | - |  |
| [B P07@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P07@1500] rango_factible | PASS | - |  |
| [B P07@1500] score[0,100] | PASS | - | score=100 |
| [B P07@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P07@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@1800] HTTP200 | PASS | - |  |
| [B P07@1800] amounts>=0&finitos | PASS | - |  |
| [B P07@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P07@1800] rango_factible | PASS | - |  |
| [B P07@1800] score[0,100] | PASS | - | score=100 |
| [B P07@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P07@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@2000] HTTP200 | PASS | - |  |
| [B P07@2000] amounts>=0&finitos | PASS | - |  |
| [B P07@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P07@2000] rango_factible | PASS | - |  |
| [B P07@2000] score[0,100] | PASS | - | score=100 |
| [B P07@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P07@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@2500] HTTP200 | PASS | - |  |
| [B P07@2500] amounts>=0&finitos | PASS | - |  |
| [B P07@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P07@2500] rango_factible | PASS | - |  |
| [B P07@2500] score[0,100] | PASS | - | score=100 |
| [B P07@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P07@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@3000] HTTP200 | PASS | - |  |
| [B P07@3000] amounts>=0&finitos | PASS | - |  |
| [B P07@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@3000] blocks~totalCheck | PASS | - | bsum=99.99 tc=100 |
| [B P07@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P07@3000] rango_factible | PASS | - |  |
| [B P07@3000] score[0,100] | PASS | - | score=100 |
| [B P07@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P07@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@3000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@3500] HTTP200 | PASS | - |  |
| [B P07@3500] amounts>=0&finitos | PASS | - |  |
| [B P07@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@3500] Samounts~effIncome | PASS | - | S=3499.99 eff=3500 |
| [B P07@3500] rango_factible | PASS | - |  |
| [B P07@3500] score[0,100] | PASS | - | score=100 |
| [B P07@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P07@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P07@4000] HTTP200 | PASS | - |  |
| [B P07@4000] amounts>=0&finitos | PASS | - |  |
| [B P07@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P07@4000] rango_factible | PASS | - |  |
| [B P07@4000] score[0,100] | PASS | - | score=100 |
| [B P07@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P07@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@4000] wants[10,80] | PASS | - | wants_int=10.50 |
| [B P07@5000] HTTP200 | PASS | - |  |
| [B P07@5000] amounts>=0&finitos | PASS | - |  |
| [B P07@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@5000] Samounts~effIncome | PASS | - | S=5000.02 eff=5000 |
| [B P07@5000] rango_factible | PASS | - |  |
| [B P07@5000] score[0,100] | PASS | - | score=100 |
| [B P07@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P07@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@5000] wants[10,80] | PASS | - | wants_int=17.21 |
| [B P07@7000] HTTP200 | PASS | - |  |
| [B P07@7000] amounts>=0&finitos | PASS | - |  |
| [B P07@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P07@7000] rango_factible | PASS | - |  |
| [B P07@7000] score[0,100] | PASS | - | score=100 |
| [B P07@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P07@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@7000] wants[10,80] | PASS | - | wants_int=26.03 |
| [B P07@10000] HTTP200 | PASS | - |  |
| [B P07@10000] amounts>=0&finitos | PASS | - |  |
| [B P07@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@10000] Samounts~effIncome | PASS | - | S=10000.00 eff=10000 |
| [B P07@10000] rango_factible | PASS | - |  |
| [B P07@10000] score[0,100] | PASS | - | score=95 |
| [B P07@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P07@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@10000] wants[10,80] | PASS | - | wants_int=32.93 |
| [B P07@15000] HTTP200 | PASS | - |  |
| [B P07@15000] amounts>=0&finitos | PASS | - |  |
| [B P07@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P07@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P07@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P07@15000] rango_factible | PASS | - |  |
| [B P07@15000] score[0,100] | PASS | - | score=90 |
| [B P07@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P07@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P07@15000] wants[10,80] | PASS | - | wants_int=38.57 |
| [B P08@500] HTTP200 | PASS | - |  |
| [B P08@500] amounts>=0&finitos | PASS | - |  |
| [B P08@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P08@500] rango_factible | PASS | - |  |
| [B P08@500] score[0,100] | PASS | - | score=100 |
| [B P08@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P08@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@700] HTTP200 | PASS | - |  |
| [B P08@700] amounts>=0&finitos | PASS | - |  |
| [B P08@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P08@700] rango_factible | PASS | - |  |
| [B P08@700] score[0,100] | PASS | - | score=100 |
| [B P08@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P08@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@900] HTTP200 | PASS | - |  |
| [B P08@900] amounts>=0&finitos | PASS | - |  |
| [B P08@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P08@900] rango_factible | PASS | - |  |
| [B P08@900] score[0,100] | PASS | - | score=100 |
| [B P08@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P08@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@1000] HTTP200 | PASS | - |  |
| [B P08@1000] amounts>=0&finitos | PASS | - |  |
| [B P08@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P08@1000] rango_factible | PASS | - |  |
| [B P08@1000] score[0,100] | PASS | - | score=100 |
| [B P08@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P08@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@1200] HTTP200 | PASS | - |  |
| [B P08@1200] amounts>=0&finitos | PASS | - |  |
| [B P08@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P08@1200] rango_factible | PASS | - |  |
| [B P08@1200] score[0,100] | PASS | - | score=100 |
| [B P08@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P08@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@1500] HTTP200 | PASS | - |  |
| [B P08@1500] amounts>=0&finitos | PASS | - |  |
| [B P08@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P08@1500] rango_factible | PASS | - |  |
| [B P08@1500] score[0,100] | PASS | - | score=100 |
| [B P08@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P08@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@1800] HTTP200 | PASS | - |  |
| [B P08@1800] amounts>=0&finitos | PASS | - |  |
| [B P08@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P08@1800] rango_factible | PASS | - |  |
| [B P08@1800] score[0,100] | PASS | - | score=100 |
| [B P08@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P08@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@2000] HTTP200 | PASS | - |  |
| [B P08@2000] amounts>=0&finitos | PASS | - |  |
| [B P08@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P08@2000] rango_factible | PASS | - |  |
| [B P08@2000] score[0,100] | PASS | - | score=100 |
| [B P08@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P08@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@2500] HTTP200 | PASS | - |  |
| [B P08@2500] amounts>=0&finitos | PASS | - |  |
| [B P08@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@2500] Samounts~effIncome | PASS | - | S=2500.00 eff=2500 |
| [B P08@2500] rango_factible | PASS | - |  |
| [B P08@2500] score[0,100] | PASS | - | score=100 |
| [B P08@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P08@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@3000] HTTP200 | PASS | - |  |
| [B P08@3000] amounts>=0&finitos | PASS | - |  |
| [B P08@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P08@3000] rango_factible | PASS | - |  |
| [B P08@3000] score[0,100] | PASS | - | score=100 |
| [B P08@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P08@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@3000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@3500] HTTP200 | PASS | - |  |
| [B P08@3500] amounts>=0&finitos | PASS | - |  |
| [B P08@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@3500] Samounts~effIncome | PASS | - | S=3499.99 eff=3500 |
| [B P08@3500] rango_factible | PASS | - |  |
| [B P08@3500] score[0,100] | PASS | - | score=100 |
| [B P08@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P08@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@4000] HTTP200 | PASS | - |  |
| [B P08@4000] amounts>=0&finitos | PASS | - |  |
| [B P08@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P08@4000] rango_factible | PASS | - |  |
| [B P08@4000] score[0,100] | PASS | - | score=100 |
| [B P08@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P08@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@4000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P08@5000] HTTP200 | PASS | - |  |
| [B P08@5000] amounts>=0&finitos | PASS | - |  |
| [B P08@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@5000] Samounts~effIncome | PASS | - | S=5000.02 eff=5000 |
| [B P08@5000] rango_factible | PASS | - |  |
| [B P08@5000] score[0,100] | PASS | - | score=100 |
| [B P08@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P08@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@5000] wants[10,80] | PASS | - | wants_int=11.11 |
| [B P08@7000] HTTP200 | PASS | - |  |
| [B P08@7000] amounts>=0&finitos | PASS | - |  |
| [B P08@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P08@7000] rango_factible | PASS | - |  |
| [B P08@7000] score[0,100] | PASS | - | score=100 |
| [B P08@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P08@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@7000] wants[10,80] | PASS | - | wants_int=21.33 |
| [B P08@10000] HTTP200 | PASS | - |  |
| [B P08@10000] amounts>=0&finitos | PASS | - |  |
| [B P08@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@10000] Samounts~effIncome | PASS | - | S=10000.03 eff=10000 |
| [B P08@10000] rango_factible | PASS | - |  |
| [B P08@10000] score[0,100] | PASS | - | score=100 |
| [B P08@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P08@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@10000] wants[10,80] | PASS | - | wants_int=29.35 |
| [B P08@15000] HTTP200 | PASS | - |  |
| [B P08@15000] amounts>=0&finitos | PASS | - |  |
| [B P08@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P08@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P08@15000] Samounts~effIncome | PASS | - | S=15000.01 eff=15000 |
| [B P08@15000] rango_factible | PASS | - |  |
| [B P08@15000] score[0,100] | PASS | - | score=95 |
| [B P08@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P08@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P08@15000] wants[10,80] | PASS | - | wants_int=35.92 |
| [B P09@500] HTTP200 | PASS | - |  |
| [B P09@500] amounts>=0&finitos | PASS | - |  |
| [B P09@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P09@500] rango_factible | PASS | - |  |
| [B P09@500] score[0,100] | PASS | - | score=100 |
| [B P09@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P09@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@700] HTTP200 | PASS | - |  |
| [B P09@700] amounts>=0&finitos | PASS | - |  |
| [B P09@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P09@700] rango_factible | PASS | - |  |
| [B P09@700] score[0,100] | PASS | - | score=100 |
| [B P09@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P09@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@900] HTTP200 | PASS | - |  |
| [B P09@900] amounts>=0&finitos | PASS | - |  |
| [B P09@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P09@900] rango_factible | PASS | - |  |
| [B P09@900] score[0,100] | PASS | - | score=100 |
| [B P09@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P09@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@1000] HTTP200 | PASS | - |  |
| [B P09@1000] amounts>=0&finitos | PASS | - |  |
| [B P09@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P09@1000] rango_factible | PASS | - |  |
| [B P09@1000] score[0,100] | PASS | - | score=100 |
| [B P09@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P09@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@1200] HTTP200 | PASS | - |  |
| [B P09@1200] amounts>=0&finitos | PASS | - |  |
| [B P09@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P09@1200] rango_factible | PASS | - |  |
| [B P09@1200] score[0,100] | PASS | - | score=100 |
| [B P09@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P09@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@1500] HTTP200 | PASS | - |  |
| [B P09@1500] amounts>=0&finitos | PASS | - |  |
| [B P09@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P09@1500] rango_factible | PASS | - |  |
| [B P09@1500] score[0,100] | PASS | - | score=100 |
| [B P09@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P09@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@1800] HTTP200 | PASS | - |  |
| [B P09@1800] amounts>=0&finitos | PASS | - |  |
| [B P09@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P09@1800] rango_factible | PASS | - |  |
| [B P09@1800] score[0,100] | PASS | - | score=100 |
| [B P09@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P09@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@2000] HTTP200 | PASS | - |  |
| [B P09@2000] amounts>=0&finitos | PASS | - |  |
| [B P09@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P09@2000] rango_factible | PASS | - |  |
| [B P09@2000] score[0,100] | PASS | - | score=100 |
| [B P09@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P09@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P09@2500] HTTP200 | PASS | - |  |
| [B P09@2500] amounts>=0&finitos | PASS | - |  |
| [B P09@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@2500] Samounts~effIncome | PASS | - | S=2500.00 eff=2500 |
| [B P09@2500] rango_factible | PASS | - |  |
| [B P09@2500] score[0,100] | PASS | - | score=100 |
| [B P09@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P09@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@2500] wants[10,80] | PASS | - | wants_int=16.12 |
| [B P09@3000] HTTP200 | PASS | - |  |
| [B P09@3000] amounts>=0&finitos | PASS | - |  |
| [B P09@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@3000] Samounts~effIncome | PASS | - | S=2999.98 eff=3000 |
| [B P09@3000] rango_factible | PASS | - |  |
| [B P09@3000] score[0,100] | PASS | - | score=100 |
| [B P09@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P09@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@3000] wants[10,80] | PASS | - | wants_int=21.64 |
| [B P09@3500] HTTP200 | PASS | - |  |
| [B P09@3500] amounts>=0&finitos | PASS | - |  |
| [B P09@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@3500] Samounts~effIncome | PASS | - | S=3500.01 eff=3500 |
| [B P09@3500] rango_factible | PASS | - |  |
| [B P09@3500] score[0,100] | PASS | - | score=100 |
| [B P09@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P09@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@3500] wants[10,80] | PASS | - | wants_int=25.64 |
| [B P09@4000] HTTP200 | PASS | - |  |
| [B P09@4000] amounts>=0&finitos | PASS | - |  |
| [B P09@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P09@4000] rango_factible | PASS | - |  |
| [B P09@4000] score[0,100] | PASS | - | score=100 |
| [B P09@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P09@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@4000] wants[10,80] | PASS | - | wants_int=28.68 |
| [B P09@5000] HTTP200 | PASS | - |  |
| [B P09@5000] amounts>=0&finitos | PASS | - |  |
| [B P09@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@5000] Samounts~effIncome | PASS | - | S=5000.02 eff=5000 |
| [B P09@5000] rango_factible | PASS | - |  |
| [B P09@5000] score[0,100] | PASS | - | score=95 |
| [B P09@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P09@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@5000] wants[10,80] | PASS | - | wants_int=33.01 |
| [B P09@7000] HTTP200 | PASS | - |  |
| [B P09@7000] amounts>=0&finitos | PASS | - |  |
| [B P09@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@7000] Samounts~effIncome | PASS | - | S=6999.98 eff=7000 |
| [B P09@7000] rango_factible | PASS | - |  |
| [B P09@7000] score[0,100] | PASS | - | score=90 |
| [B P09@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P09@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@7000] wants[10,80] | PASS | - | wants_int=38.08 |
| [B P09@10000] HTTP200 | PASS | - |  |
| [B P09@10000] amounts>=0&finitos | PASS | - |  |
| [B P09@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@10000] Samounts~effIncome | PASS | - | S=10000.03 eff=10000 |
| [B P09@10000] rango_factible | PASS | - |  |
| [B P09@10000] score[0,100] | PASS | - | score=90 |
| [B P09@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P09@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@10000] wants[10,80] | PASS | - | wants_int=42.01 |
| [B P09@15000] HTTP200 | PASS | - |  |
| [B P09@15000] amounts>=0&finitos | PASS | - |  |
| [B P09@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P09@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P09@15000] Samounts~effIncome | PASS | - | S=14999.98 eff=15000 |
| [B P09@15000] rango_factible | PASS | - |  |
| [B P09@15000] score[0,100] | PASS | - | score=90 |
| [B P09@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P09@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P09@15000] wants[10,80] | PASS | - | wants_int=44.81 |
| [B P10@500] HTTP200 | PASS | - |  |
| [B P10@500] amounts>=0&finitos | PASS | - |  |
| [B P10@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@500] Samounts~effIncome | PASS | - | S=499.99 eff=500 |
| [B P10@500] rango_factible | PASS | - |  |
| [B P10@500] score[0,100] | PASS | - | score=100 |
| [B P10@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P10@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@500] wants[10,80] | PASS | - | wants_int=19.50 |
| [B P10@700] HTTP200 | PASS | - |  |
| [B P10@700] amounts>=0&finitos | PASS | - |  |
| [B P10@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@700] Samounts~effIncome | PASS | - | S=699.99 eff=700 |
| [B P10@700] rango_factible | PASS | - |  |
| [B P10@700] score[0,100] | PASS | - | score=100 |
| [B P10@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P10@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@700] wants[10,80] | PASS | - | wants_int=19.50 |
| [B P10@900] HTTP200 | PASS | - |  |
| [B P10@900] amounts>=0&finitos | PASS | - |  |
| [B P10@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P10@900] rango_factible | PASS | - |  |
| [B P10@900] score[0,100] | PASS | - | score=100 |
| [B P10@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P10@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@900] wants[10,80] | PASS | - | wants_int=20.01 |
| [B P10@1000] HTTP200 | PASS | - |  |
| [B P10@1000] amounts>=0&finitos | PASS | - |  |
| [B P10@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@1000] Samounts~effIncome | PASS | - | S=1000.01 eff=1000 |
| [B P10@1000] rango_factible | PASS | - |  |
| [B P10@1000] score[0,100] | PASS | - | score=100 |
| [B P10@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P10@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@1000] wants[10,80] | PASS | - | wants_int=22.25 |
| [B P10@1200] HTTP200 | PASS | - |  |
| [B P10@1200] amounts>=0&finitos | PASS | - |  |
| [B P10@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P10@1200] rango_factible | PASS | - |  |
| [B P10@1200] score[0,100] | PASS | - | score=100 |
| [B P10@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P10@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@1200] wants[10,80] | PASS | - | wants_int=25.63 |
| [B P10@1500] HTTP200 | PASS | - |  |
| [B P10@1500] amounts>=0&finitos | PASS | - |  |
| [B P10@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@1500] Samounts~effIncome | PASS | - | S=1500.00 eff=1500 |
| [B P10@1500] rango_factible | PASS | - |  |
| [B P10@1500] score[0,100] | PASS | - | score=100 |
| [B P10@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P10@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@1500] wants[10,80] | PASS | - | wants_int=29.04 |
| [B P10@1800] HTTP200 | PASS | - |  |
| [B P10@1800] amounts>=0&finitos | PASS | - |  |
| [B P10@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P10@1800] rango_factible | PASS | - |  |
| [B P10@1800] score[0,100] | PASS | - | score=95 |
| [B P10@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P10@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@1800] wants[10,80] | PASS | - | wants_int=31.34 |
| [B P10@2000] HTTP200 | PASS | - |  |
| [B P10@2000] amounts>=0&finitos | PASS | - |  |
| [B P10@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P10@2000] rango_factible | PASS | - |  |
| [B P10@2000] score[0,100] | PASS | - | score=95 |
| [B P10@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P10@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@2000] wants[10,80] | PASS | - | wants_int=32.50 |
| [B P10@2500] HTTP200 | PASS | - |  |
| [B P10@2500] amounts>=0&finitos | PASS | - |  |
| [B P10@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@2500] Samounts~effIncome | PASS | - | S=2500.01 eff=2500 |
| [B P10@2500] rango_factible | PASS | - |  |
| [B P10@2500] score[0,100] | PASS | - | score=95 |
| [B P10@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P10@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@2500] wants[10,80] | PASS | - | wants_int=37.08 |
| [B P10@3000] HTTP200 | PASS | - |  |
| [B P10@3000] amounts>=0&finitos | PASS | - |  |
| [B P10@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P10@3000] rango_factible | PASS | - |  |
| [B P10@3000] score[0,100] | PASS | - | score=90 |
| [B P10@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P10@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@3000] wants[10,80] | PASS | - | wants_int=40.18 |
| [B P10@3500] HTTP200 | PASS | - |  |
| [B P10@3500] amounts>=0&finitos | PASS | - |  |
| [B P10@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P10@3500] rango_factible | PASS | - |  |
| [B P10@3500] score[0,100] | PASS | - | score=90 |
| [B P10@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P10@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@3500] wants[10,80] | PASS | - | wants_int=42.43 |
| [B P10@4000] HTTP200 | PASS | - |  |
| [B P10@4000] amounts>=0&finitos | PASS | - |  |
| [B P10@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P10@4000] rango_factible | PASS | - |  |
| [B P10@4000] score[0,100] | PASS | - | score=90 |
| [B P10@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P10@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@4000] wants[10,80] | PASS | - | wants_int=44.14 |
| [B P10@5000] HTTP200 | PASS | - |  |
| [B P10@5000] amounts>=0&finitos | PASS | - |  |
| [B P10@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@5000] Samounts~effIncome | PASS | - | S=5000.01 eff=5000 |
| [B P10@5000] rango_factible | PASS | - |  |
| [B P10@5000] score[0,100] | PASS | - | score=90 |
| [B P10@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P10@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@5000] wants[10,80] | PASS | - | wants_int=46.56 |
| [B P10@7000] HTTP200 | PASS | - |  |
| [B P10@7000] amounts>=0&finitos | PASS | - |  |
| [B P10@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@7000] Samounts~effIncome | PASS | - | S=6999.99 eff=7000 |
| [B P10@7000] rango_factible | PASS | - |  |
| [B P10@7000] score[0,100] | PASS | - | score=90 |
| [B P10@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P10@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@7000] wants[10,80] | PASS | - | wants_int=49.41 |
| [B P10@10000] HTTP200 | PASS | - |  |
| [B P10@10000] amounts>=0&finitos | PASS | - |  |
| [B P10@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@10000] Samounts~effIncome | PASS | - | S=10000.02 eff=10000 |
| [B P10@10000] rango_factible | PASS | - |  |
| [B P10@10000] score[0,100] | PASS | - | score=90 |
| [B P10@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P10@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@10000] wants[10,80] | PASS | - | wants_int=51.60 |
| [B P10@15000] HTTP200 | PASS | - |  |
| [B P10@15000] amounts>=0&finitos | PASS | - |  |
| [B P10@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P10@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P10@15000] Samounts~effIncome | PASS | - | S=15000.00 eff=15000 |
| [B P10@15000] rango_factible | PASS | - |  |
| [B P10@15000] score[0,100] | PASS | - | score=90 |
| [B P10@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P10@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P10@15000] wants[10,80] | PASS | - | wants_int=53.00 |
| [B P11@500] HTTP200 | PASS | - |  |
| [B P11@500] amounts>=0&finitos | PASS | - |  |
| [B P11@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P11@500] rango_factible | PASS | - |  |
| [B P11@500] score[0,100] | PASS | - | score=100 |
| [B P11@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P11@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P11@700] HTTP200 | PASS | - |  |
| [B P11@700] amounts>=0&finitos | PASS | - |  |
| [B P11@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P11@700] rango_factible | PASS | - |  |
| [B P11@700] score[0,100] | PASS | - | score=100 |
| [B P11@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P11@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P11@900] HTTP200 | PASS | - |  |
| [B P11@900] amounts>=0&finitos | PASS | - |  |
| [B P11@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P11@900] rango_factible | PASS | - |  |
| [B P11@900] score[0,100] | PASS | - | score=100 |
| [B P11@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P11@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P11@1000] HTTP200 | PASS | - |  |
| [B P11@1000] amounts>=0&finitos | PASS | - |  |
| [B P11@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P11@1000] rango_factible | PASS | - |  |
| [B P11@1000] score[0,100] | PASS | - | score=100 |
| [B P11@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P11@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P11@1200] HTTP200 | PASS | - |  |
| [B P11@1200] amounts>=0&finitos | PASS | - |  |
| [B P11@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P11@1200] rango_factible | PASS | - |  |
| [B P11@1200] score[0,100] | PASS | - | score=100 |
| [B P11@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P11@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P11@1500] HTTP200 | PASS | - |  |
| [B P11@1500] amounts>=0&finitos | PASS | - |  |
| [B P11@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@1500] Samounts~effIncome | PASS | - | S=1500.00 eff=1500 |
| [B P11@1500] rango_factible | PASS | - |  |
| [B P11@1500] score[0,100] | PASS | - | score=100 |
| [B P11@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P11@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@1500] wants[10,80] | PASS | - | wants_int=11.04 |
| [B P11@1800] HTTP200 | PASS | - |  |
| [B P11@1800] amounts>=0&finitos | PASS | - |  |
| [B P11@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P11@1800] rango_factible | PASS | - |  |
| [B P11@1800] score[0,100] | PASS | - | score=100 |
| [B P11@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P11@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@1800] wants[10,80] | PASS | - | wants_int=13.34 |
| [B P11@2000] HTTP200 | PASS | - |  |
| [B P11@2000] amounts>=0&finitos | PASS | - |  |
| [B P11@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P11@2000] rango_factible | PASS | - |  |
| [B P11@2000] score[0,100] | PASS | - | score=100 |
| [B P11@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P11@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@2000] wants[10,80] | PASS | - | wants_int=14.50 |
| [B P11@2500] HTTP200 | PASS | - |  |
| [B P11@2500] amounts>=0&finitos | PASS | - |  |
| [B P11@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@2500] Samounts~effIncome | PASS | - | S=2500.02 eff=2500 |
| [B P11@2500] rango_factible | PASS | - |  |
| [B P11@2500] score[0,100] | PASS | - | score=100 |
| [B P11@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P11@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@2500] wants[10,80] | PASS | - | wants_int=21.34 |
| [B P11@3000] HTTP200 | PASS | - |  |
| [B P11@3000] amounts>=0&finitos | PASS | - |  |
| [B P11@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P11@3000] rango_factible | PASS | - |  |
| [B P11@3000] score[0,100] | PASS | - | score=100 |
| [B P11@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P11@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@3000] wants[10,80] | PASS | - | wants_int=26.00 |
| [B P11@3500] HTTP200 | PASS | - |  |
| [B P11@3500] amounts>=0&finitos | PASS | - |  |
| [B P11@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@3500] Samounts~effIncome | PASS | - | S=3499.99 eff=3500 |
| [B P11@3500] rango_factible | PASS | - |  |
| [B P11@3500] score[0,100] | PASS | - | score=100 |
| [B P11@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P11@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@3500] wants[10,80] | PASS | - | wants_int=29.38 |
| [B P11@4000] HTTP200 | PASS | - |  |
| [B P11@4000] amounts>=0&finitos | PASS | - |  |
| [B P11@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@4000] Samounts~effIncome | PASS | - | S=4000.01 eff=4000 |
| [B P11@4000] rango_factible | PASS | - |  |
| [B P11@4000] score[0,100] | PASS | - | score=95 |
| [B P11@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P11@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@4000] wants[10,80] | PASS | - | wants_int=31.96 |
| [B P11@5000] HTTP200 | PASS | - |  |
| [B P11@5000] amounts>=0&finitos | PASS | - |  |
| [B P11@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@5000] Samounts~effIncome | PASS | - | S=5000.01 eff=5000 |
| [B P11@5000] rango_factible | PASS | - |  |
| [B P11@5000] score[0,100] | PASS | - | score=95 |
| [B P11@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P11@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@5000] wants[10,80] | PASS | - | wants_int=35.63 |
| [B P11@7000] HTTP200 | PASS | - |  |
| [B P11@7000] amounts>=0&finitos | PASS | - |  |
| [B P11@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@7000] Samounts~effIncome | PASS | - | S=7000.00 eff=7000 |
| [B P11@7000] rango_factible | PASS | - |  |
| [B P11@7000] score[0,100] | PASS | - | score=90 |
| [B P11@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P11@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@7000] wants[10,80] | PASS | - | wants_int=39.95 |
| [B P11@10000] HTTP200 | PASS | - |  |
| [B P11@10000] amounts>=0&finitos | PASS | - |  |
| [B P11@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@10000] Samounts~effIncome | PASS | - | S=9999.98 eff=10000 |
| [B P11@10000] rango_factible | PASS | - |  |
| [B P11@10000] score[0,100] | PASS | - | score=90 |
| [B P11@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P11@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@10000] wants[10,80] | PASS | - | wants_int=43.31 |
| [B P11@15000] HTTP200 | PASS | - |  |
| [B P11@15000] amounts>=0&finitos | PASS | - |  |
| [B P11@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P11@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P11@15000] Samounts~effIncome | PASS | - | S=14999.98 eff=15000 |
| [B P11@15000] rango_factible | PASS | - |  |
| [B P11@15000] score[0,100] | PASS | - | score=90 |
| [B P11@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P11@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P11@15000] wants[10,80] | PASS | - | wants_int=45.66 |
| [B P12@500] HTTP200 | PASS | - |  |
| [B P12@500] amounts>=0&finitos | PASS | - |  |
| [B P12@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P12@500] rango_factible | PASS | - |  |
| [B P12@500] score[0,100] | PASS | - | score=100 |
| [B P12@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P12@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@700] HTTP200 | PASS | - |  |
| [B P12@700] amounts>=0&finitos | PASS | - |  |
| [B P12@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P12@700] rango_factible | PASS | - |  |
| [B P12@700] score[0,100] | PASS | - | score=100 |
| [B P12@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P12@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@900] HTTP200 | PASS | - |  |
| [B P12@900] amounts>=0&finitos | PASS | - |  |
| [B P12@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P12@900] rango_factible | PASS | - |  |
| [B P12@900] score[0,100] | PASS | - | score=100 |
| [B P12@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P12@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@1000] HTTP200 | PASS | - |  |
| [B P12@1000] amounts>=0&finitos | PASS | - |  |
| [B P12@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P12@1000] rango_factible | PASS | - |  |
| [B P12@1000] score[0,100] | PASS | - | score=100 |
| [B P12@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P12@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@1200] HTTP200 | PASS | - |  |
| [B P12@1200] amounts>=0&finitos | PASS | - |  |
| [B P12@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P12@1200] rango_factible | PASS | - |  |
| [B P12@1200] score[0,100] | PASS | - | score=100 |
| [B P12@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P12@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@1500] HTTP200 | PASS | - |  |
| [B P12@1500] amounts>=0&finitos | PASS | - |  |
| [B P12@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P12@1500] rango_factible | PASS | - |  |
| [B P12@1500] score[0,100] | PASS | - | score=100 |
| [B P12@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P12@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@1800] HTTP200 | PASS | - |  |
| [B P12@1800] amounts>=0&finitos | PASS | - |  |
| [B P12@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P12@1800] rango_factible | PASS | - |  |
| [B P12@1800] score[0,100] | PASS | - | score=100 |
| [B P12@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P12@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P12@2000] HTTP200 | PASS | - |  |
| [B P12@2000] amounts>=0&finitos | PASS | - |  |
| [B P12@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@2000] Samounts~effIncome | PASS | - | S=2000.01 eff=2000 |
| [B P12@2000] rango_factible | PASS | - |  |
| [B P12@2000] score[0,100] | PASS | - | score=100 |
| [B P12@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P12@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@2000] wants[10,80] | PASS | - | wants_int=10.50 |
| [B P12@2500] HTTP200 | PASS | - |  |
| [B P12@2500] amounts>=0&finitos | PASS | - |  |
| [B P12@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@2500] Samounts~effIncome | PASS | - | S=2500.01 eff=2500 |
| [B P12@2500] rango_factible | PASS | - |  |
| [B P12@2500] score[0,100] | PASS | - | score=100 |
| [B P12@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P12@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@2500] wants[10,80] | PASS | - | wants_int=18.17 |
| [B P12@3000] HTTP200 | PASS | - |  |
| [B P12@3000] amounts>=0&finitos | PASS | - |  |
| [B P12@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P12@3000] rango_factible | PASS | - |  |
| [B P12@3000] score[0,100] | PASS | - | score=100 |
| [B P12@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P12@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@3000] wants[10,80] | PASS | - | wants_int=23.38 |
| [B P12@3500] HTTP200 | PASS | - |  |
| [B P12@3500] amounts>=0&finitos | PASS | - |  |
| [B P12@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@3500] Samounts~effIncome | PASS | - | S=3500.02 eff=3500 |
| [B P12@3500] rango_factible | PASS | - |  |
| [B P12@3500] score[0,100] | PASS | - | score=100 |
| [B P12@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P12@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@3500] wants[10,80] | PASS | - | wants_int=27.16 |
| [B P12@4000] HTTP200 | PASS | - |  |
| [B P12@4000] amounts>=0&finitos | PASS | - |  |
| [B P12@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P12@4000] rango_factible | PASS | - |  |
| [B P12@4000] score[0,100] | PASS | - | score=95 |
| [B P12@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P12@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@4000] wants[10,80] | PASS | - | wants_int=30.03 |
| [B P12@5000] HTTP200 | PASS | - |  |
| [B P12@5000] amounts>=0&finitos | PASS | - |  |
| [B P12@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@5000] Samounts~effIncome | PASS | - | S=5000.01 eff=5000 |
| [B P12@5000] rango_factible | PASS | - |  |
| [B P12@5000] score[0,100] | PASS | - | score=95 |
| [B P12@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P12@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@5000] wants[10,80] | PASS | - | wants_int=34.11 |
| [B P12@7000] HTTP200 | PASS | - |  |
| [B P12@7000] amounts>=0&finitos | PASS | - |  |
| [B P12@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@7000] Samounts~effIncome | PASS | - | S=7000.02 eff=7000 |
| [B P12@7000] rango_factible | PASS | - |  |
| [B P12@7000] score[0,100] | PASS | - | score=90 |
| [B P12@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P12@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@7000] wants[10,80] | PASS | - | wants_int=38.90 |
| [B P12@10000] HTTP200 | PASS | - |  |
| [B P12@10000] amounts>=0&finitos | PASS | - |  |
| [B P12@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P12@10000] rango_factible | PASS | - |  |
| [B P12@10000] score[0,100] | PASS | - | score=90 |
| [B P12@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P12@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@10000] wants[10,80] | PASS | - | wants_int=42.61 |
| [B P12@15000] HTTP200 | PASS | - |  |
| [B P12@15000] amounts>=0&finitos | PASS | - |  |
| [B P12@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P12@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P12@15000] Samounts~effIncome | PASS | - | S=15000.01 eff=15000 |
| [B P12@15000] rango_factible | PASS | - |  |
| [B P12@15000] score[0,100] | PASS | - | score=90 |
| [B P12@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P12@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P12@15000] wants[10,80] | PASS | - | wants_int=45.23 |
| [B P13@500] HTTP200 | PASS | - |  |
| [B P13@500] amounts>=0&finitos | PASS | - |  |
| [B P13@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P13@500] rango_factible | PASS | - |  |
| [B P13@500] score[0,100] | PASS | - | score=100 |
| [B P13@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P13@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P13@700] HTTP200 | PASS | - |  |
| [B P13@700] amounts>=0&finitos | PASS | - |  |
| [B P13@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P13@700] rango_factible | PASS | - |  |
| [B P13@700] score[0,100] | PASS | - | score=100 |
| [B P13@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P13@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P13@900] HTTP200 | PASS | - |  |
| [B P13@900] amounts>=0&finitos | PASS | - |  |
| [B P13@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P13@900] rango_factible | PASS | - |  |
| [B P13@900] score[0,100] | PASS | - | score=100 |
| [B P13@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P13@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P13@1000] HTTP200 | PASS | - |  |
| [B P13@1000] amounts>=0&finitos | PASS | - |  |
| [B P13@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P13@1000] rango_factible | PASS | - |  |
| [B P13@1000] score[0,100] | PASS | - | score=100 |
| [B P13@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P13@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P13@1200] HTTP200 | PASS | - |  |
| [B P13@1200] amounts>=0&finitos | PASS | - |  |
| [B P13@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P13@1200] rango_factible | PASS | - |  |
| [B P13@1200] score[0,100] | PASS | - | score=100 |
| [B P13@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P13@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P13@1500] HTTP200 | PASS | - |  |
| [B P13@1500] amounts>=0&finitos | PASS | - |  |
| [B P13@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P13@1500] rango_factible | PASS | - |  |
| [B P13@1500] score[0,100] | PASS | - | score=100 |
| [B P13@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P13@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@1500] wants[10,80] | PASS | - | wants_int=10.04 |
| [B P13@1800] HTTP200 | PASS | - |  |
| [B P13@1800] amounts>=0&finitos | PASS | - |  |
| [B P13@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P13@1800] rango_factible | PASS | - |  |
| [B P13@1800] score[0,100] | PASS | - | score=100 |
| [B P13@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P13@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@1800] wants[10,80] | PASS | - | wants_int=12.34 |
| [B P13@2000] HTTP200 | PASS | - |  |
| [B P13@2000] amounts>=0&finitos | PASS | - |  |
| [B P13@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P13@2000] rango_factible | PASS | - |  |
| [B P13@2000] score[0,100] | PASS | - | score=100 |
| [B P13@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P13@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@2000] wants[10,80] | PASS | - | wants_int=13.50 |
| [B P13@2500] HTTP200 | PASS | - |  |
| [B P13@2500] amounts>=0&finitos | PASS | - |  |
| [B P13@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P13@2500] rango_factible | PASS | - |  |
| [B P13@2500] score[0,100] | PASS | - | score=100 |
| [B P13@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P13@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@2500] wants[10,80] | PASS | - | wants_int=20.60 |
| [B P13@3000] HTTP200 | PASS | - |  |
| [B P13@3000] amounts>=0&finitos | PASS | - |  |
| [B P13@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P13@3000] rango_factible | PASS | - |  |
| [B P13@3000] score[0,100] | PASS | - | score=100 |
| [B P13@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P13@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@3000] wants[10,80] | PASS | - | wants_int=25.42 |
| [B P13@3500] HTTP200 | PASS | - |  |
| [B P13@3500] amounts>=0&finitos | PASS | - |  |
| [B P13@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P13@3500] rango_factible | PASS | - |  |
| [B P13@3500] score[0,100] | PASS | - | score=100 |
| [B P13@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P13@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@3500] wants[10,80] | PASS | - | wants_int=28.92 |
| [B P13@4000] HTTP200 | PASS | - |  |
| [B P13@4000] amounts>=0&finitos | PASS | - |  |
| [B P13@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P13@4000] rango_factible | PASS | - |  |
| [B P13@4000] score[0,100] | PASS | - | score=95 |
| [B P13@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P13@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@4000] wants[10,80] | PASS | - | wants_int=31.58 |
| [B P13@5000] HTTP200 | PASS | - |  |
| [B P13@5000] amounts>=0&finitos | PASS | - |  |
| [B P13@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P13@5000] rango_factible | PASS | - |  |
| [B P13@5000] score[0,100] | PASS | - | score=95 |
| [B P13@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P13@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@5000] wants[10,80] | PASS | - | wants_int=35.37 |
| [B P13@7000] HTTP200 | PASS | - |  |
| [B P13@7000] amounts>=0&finitos | PASS | - |  |
| [B P13@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P13@7000] rango_factible | PASS | - |  |
| [B P13@7000] score[0,100] | PASS | - | score=90 |
| [B P13@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P13@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@7000] wants[10,80] | PASS | - | wants_int=39.81 |
| [B P13@10000] HTTP200 | PASS | - |  |
| [B P13@10000] amounts>=0&finitos | PASS | - |  |
| [B P13@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P13@10000] rango_factible | PASS | - |  |
| [B P13@10000] score[0,100] | PASS | - | score=90 |
| [B P13@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P13@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@10000] wants[10,80] | PASS | - | wants_int=43.26 |
| [B P13@15000] HTTP200 | PASS | - |  |
| [B P13@15000] amounts>=0&finitos | PASS | - |  |
| [B P13@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P13@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P13@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P13@15000] rango_factible | PASS | - |  |
| [B P13@15000] score[0,100] | PASS | - | score=90 |
| [B P13@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P13@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P13@15000] wants[10,80] | PASS | - | wants_int=45.67 |
| [B P14@500] HTTP200 | PASS | - |  |
| [B P14@500] amounts>=0&finitos | PASS | - |  |
| [B P14@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@500] Samounts~effIncome | PASS | - | S=499.99 eff=500 |
| [B P14@500] rango_factible | PASS | - |  |
| [B P14@500] score[0,100] | PASS | - | score=100 |
| [B P14@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P14@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@500] wants[10,80] | PASS | - | wants_int=23.50 |
| [B P14@700] HTTP200 | PASS | - |  |
| [B P14@700] amounts>=0&finitos | PASS | - |  |
| [B P14@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P14@700] rango_factible | PASS | - |  |
| [B P14@700] score[0,100] | PASS | - | score=100 |
| [B P14@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P14@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@700] wants[10,80] | PASS | - | wants_int=23.50 |
| [B P14@900] HTTP200 | PASS | - |  |
| [B P14@900] amounts>=0&finitos | PASS | - |  |
| [B P14@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@900] Samounts~effIncome | PASS | - | S=900.02 eff=900 |
| [B P14@900] rango_factible | PASS | - |  |
| [B P14@900] score[0,100] | PASS | - | score=100 |
| [B P14@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P14@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@900] wants[10,80] | PASS | - | wants_int=24.01 |
| [B P14@1000] HTTP200 | PASS | - |  |
| [B P14@1000] amounts>=0&finitos | PASS | - |  |
| [B P14@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P14@1000] rango_factible | PASS | - |  |
| [B P14@1000] score[0,100] | PASS | - | score=100 |
| [B P14@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P14@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@1000] wants[10,80] | PASS | - | wants_int=26.25 |
| [B P14@1200] HTTP200 | PASS | - |  |
| [B P14@1200] amounts>=0&finitos | PASS | - |  |
| [B P14@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@1200] Samounts~effIncome | PASS | - | S=1199.99 eff=1200 |
| [B P14@1200] rango_factible | PASS | - |  |
| [B P14@1200] score[0,100] | PASS | - | score=100 |
| [B P14@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P14@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@1200] wants[10,80] | PASS | - | wants_int=29.63 |
| [B P14@1500] HTTP200 | PASS | - |  |
| [B P14@1500] amounts>=0&finitos | PASS | - |  |
| [B P14@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P14@1500] rango_factible | PASS | - |  |
| [B P14@1500] score[0,100] | PASS | - | score=95 |
| [B P14@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P14@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@1500] wants[10,80] | PASS | - | wants_int=33.04 |
| [B P14@1800] HTTP200 | PASS | - |  |
| [B P14@1800] amounts>=0&finitos | PASS | - |  |
| [B P14@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@1800] Samounts~effIncome | PASS | - | S=1800.01 eff=1800 |
| [B P14@1800] rango_factible | PASS | - |  |
| [B P14@1800] score[0,100] | PASS | - | score=95 |
| [B P14@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P14@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@1800] wants[10,80] | PASS | - | wants_int=35.34 |
| [B P14@2000] HTTP200 | PASS | - |  |
| [B P14@2000] amounts>=0&finitos | PASS | - |  |
| [B P14@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@2000] Samounts~effIncome | PASS | - | S=2000.01 eff=2000 |
| [B P14@2000] rango_factible | PASS | - |  |
| [B P14@2000] score[0,100] | PASS | - | score=95 |
| [B P14@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P14@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@2000] wants[10,80] | PASS | - | wants_int=36.50 |
| [B P14@2500] HTTP200 | PASS | - |  |
| [B P14@2500] amounts>=0&finitos | PASS | - |  |
| [B P14@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@2500] Samounts~effIncome | PASS | - | S=2500.00 eff=2500 |
| [B P14@2500] rango_factible | PASS | - |  |
| [B P14@2500] score[0,100] | PASS | - | score=90 |
| [B P14@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P14@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@2500] wants[10,80] | PASS | - | wants_int=40.51 |
| [B P14@3000] HTTP200 | PASS | - |  |
| [B P14@3000] amounts>=0&finitos | PASS | - |  |
| [B P14@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P14@3000] rango_factible | PASS | - |  |
| [B P14@3000] score[0,100] | PASS | - | score=90 |
| [B P14@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P14@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@3000] wants[10,80] | PASS | - | wants_int=43.22 |
| [B P14@3500] HTTP200 | PASS | - |  |
| [B P14@3500] amounts>=0&finitos | PASS | - |  |
| [B P14@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P14@3500] rango_factible | PASS | - |  |
| [B P14@3500] score[0,100] | PASS | - | score=90 |
| [B P14@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P14@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@3500] wants[10,80] | PASS | - | wants_int=45.19 |
| [B P14@4000] HTTP200 | PASS | - |  |
| [B P14@4000] amounts>=0&finitos | PASS | - |  |
| [B P14@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P14@4000] rango_factible | PASS | - |  |
| [B P14@4000] score[0,100] | PASS | - | score=90 |
| [B P14@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P14@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@4000] wants[10,80] | PASS | - | wants_int=46.69 |
| [B P14@5000] HTTP200 | PASS | - |  |
| [B P14@5000] amounts>=0&finitos | PASS | - |  |
| [B P14@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P14@5000] rango_factible | PASS | - |  |
| [B P14@5000] score[0,100] | PASS | - | score=90 |
| [B P14@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P14@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@5000] wants[10,80] | PASS | - | wants_int=48.82 |
| [B P14@7000] HTTP200 | PASS | - |  |
| [B P14@7000] amounts>=0&finitos | PASS | - |  |
| [B P14@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@7000] Samounts~effIncome | PASS | - | S=7000.00 eff=7000 |
| [B P14@7000] rango_factible | PASS | - |  |
| [B P14@7000] score[0,100] | PASS | - | score=90 |
| [B P14@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P14@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@7000] wants[10,80] | PASS | - | wants_int=51.32 |
| [B P14@10000] HTTP200 | PASS | - |  |
| [B P14@10000] amounts>=0&finitos | PASS | - |  |
| [B P14@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@10000] Samounts~effIncome | PASS | - | S=10000.02 eff=10000 |
| [B P14@10000] rango_factible | PASS | - |  |
| [B P14@10000] score[0,100] | PASS | - | score=90 |
| [B P14@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P14@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@10000] wants[10,80] | PASS | - | wants_int=53.25 |
| [B P14@15000] HTTP200 | PASS | - |  |
| [B P14@15000] amounts>=0&finitos | PASS | - |  |
| [B P14@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P14@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P14@15000] Samounts~effIncome | PASS | - | S=15000.01 eff=15000 |
| [B P14@15000] rango_factible | PASS | - |  |
| [B P14@15000] score[0,100] | PASS | - | score=90 |
| [B P14@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P14@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P14@15000] wants[10,80] | PASS | - | wants_int=54.44 |
| [B P15@500] HTTP200 | PASS | - |  |
| [B P15@500] amounts>=0&finitos | PASS | - |  |
| [B P15@500] totalCheck+deuda~100 | PASS | - | tc=80 +debt=20.00=100.00 |
| [B P15@500] blocks~totalCheck | PASS | - | bsum=80.00 tc=80 |
| [B P15@500] Samounts~effIncome | PASS | - | S=400.00 eff=400 |
| [B P15@500] rango_factible | PASS | - |  |
| [B P15@500] score[0,100] | PASS | - | score=100 |
| [B P15@500] effectiveIncome | PASS | - | eff=400 exp=400 |
| [B P15@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@700] HTTP200 | PASS | - |  |
| [B P15@700] amounts>=0&finitos | PASS | - |  |
| [B P15@700] totalCheck+deuda~100 | PASS | - | tc=85.71 +debt=14.29=100.00 |
| [B P15@700] blocks~totalCheck | PASS | - | bsum=85.72 tc=85.71 |
| [B P15@700] Samounts~effIncome | PASS | - | S=600.00 eff=600 |
| [B P15@700] rango_factible | PASS | - |  |
| [B P15@700] score[0,100] | PASS | - | score=100 |
| [B P15@700] effectiveIncome | PASS | - | eff=600 exp=600 |
| [B P15@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@900] HTTP200 | PASS | - |  |
| [B P15@900] amounts>=0&finitos | PASS | - |  |
| [B P15@900] totalCheck+deuda~100 | PASS | - | tc=88.89 +debt=11.11=100.00 |
| [B P15@900] blocks~totalCheck | PASS | - | bsum=88.89 tc=88.89 |
| [B P15@900] Samounts~effIncome | PASS | - | S=800.00 eff=800 |
| [B P15@900] rango_factible | PASS | - |  |
| [B P15@900] score[0,100] | PASS | - | score=100 |
| [B P15@900] effectiveIncome | PASS | - | eff=800 exp=800 |
| [B P15@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@1000] HTTP200 | PASS | - |  |
| [B P15@1000] amounts>=0&finitos | PASS | - |  |
| [B P15@1000] totalCheck+deuda~100 | PASS | - | tc=90 +debt=10.00=100.00 |
| [B P15@1000] blocks~totalCheck | PASS | - | bsum=90.00 tc=90 |
| [B P15@1000] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P15@1000] rango_factible | PASS | - |  |
| [B P15@1000] score[0,100] | PASS | - | score=100 |
| [B P15@1000] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P15@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@1200] HTTP200 | PASS | - |  |
| [B P15@1200] amounts>=0&finitos | PASS | - |  |
| [B P15@1200] totalCheck+deuda~100 | PASS | - | tc=91.67 +debt=8.33=100.00 |
| [B P15@1200] blocks~totalCheck | PASS | - | bsum=91.67 tc=91.67 |
| [B P15@1200] Samounts~effIncome | PASS | - | S=1100.02 eff=1100 |
| [B P15@1200] rango_factible | PASS | - |  |
| [B P15@1200] score[0,100] | PASS | - | score=100 |
| [B P15@1200] effectiveIncome | PASS | - | eff=1100 exp=1100 |
| [B P15@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@1500] HTTP200 | PASS | - |  |
| [B P15@1500] amounts>=0&finitos | PASS | - |  |
| [B P15@1500] totalCheck+deuda~100 | PASS | - | tc=93.33 +debt=6.67=100.00 |
| [B P15@1500] blocks~totalCheck | PASS | - | bsum=93.33 tc=93.33 |
| [B P15@1500] Samounts~effIncome | PASS | - | S=1400.00 eff=1400 |
| [B P15@1500] rango_factible | PASS | - |  |
| [B P15@1500] score[0,100] | PASS | - | score=100 |
| [B P15@1500] effectiveIncome | PASS | - | eff=1400 exp=1400 |
| [B P15@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@1800] HTTP200 | PASS | - |  |
| [B P15@1800] amounts>=0&finitos | PASS | - |  |
| [B P15@1800] totalCheck+deuda~100 | PASS | - | tc=94.44 +debt=5.56=100.00 |
| [B P15@1800] blocks~totalCheck | PASS | - | bsum=94.44 tc=94.44 |
| [B P15@1800] Samounts~effIncome | PASS | - | S=1699.99 eff=1700 |
| [B P15@1800] rango_factible | PASS | - |  |
| [B P15@1800] score[0,100] | PASS | - | score=100 |
| [B P15@1800] effectiveIncome | PASS | - | eff=1700 exp=1700 |
| [B P15@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P15@2000] HTTP200 | PASS | - |  |
| [B P15@2000] amounts>=0&finitos | PASS | - |  |
| [B P15@2000] totalCheck+deuda~100 | PASS | - | tc=95 +debt=5.00=100.00 |
| [B P15@2000] blocks~totalCheck | PASS | - | bsum=95.00 tc=95 |
| [B P15@2000] Samounts~effIncome | PASS | - | S=1900.00 eff=1900 |
| [B P15@2000] rango_factible | PASS | - |  |
| [B P15@2000] score[0,100] | PASS | - | score=100 |
| [B P15@2000] effectiveIncome | PASS | - | eff=1900 exp=1900 |
| [B P15@2000] wants[10,80] | PASS | - | wants_int=10.95 |
| [B P15@2500] HTTP200 | PASS | - |  |
| [B P15@2500] amounts>=0&finitos | PASS | - |  |
| [B P15@2500] totalCheck+deuda~100 | PASS | - | tc=96 +debt=4.00=100.00 |
| [B P15@2500] blocks~totalCheck | PASS | - | bsum=96.00 tc=96 |
| [B P15@2500] Samounts~effIncome | PASS | - | S=2400.00 eff=2400 |
| [B P15@2500] rango_factible | PASS | - |  |
| [B P15@2500] score[0,100] | PASS | - | score=100 |
| [B P15@2500] effectiveIncome | PASS | - | eff=2400 exp=2400 |
| [B P15@2500] wants[10,80] | PASS | - | wants_int=17.41 |
| [B P15@3000] HTTP200 | PASS | - |  |
| [B P15@3000] amounts>=0&finitos | PASS | - |  |
| [B P15@3000] totalCheck+deuda~100 | PASS | - | tc=96.67 +debt=3.33=100.00 |
| [B P15@3000] blocks~totalCheck | PASS | - | bsum=96.66 tc=96.67 |
| [B P15@3000] Samounts~effIncome | PASS | - | S=2900.01 eff=2900 |
| [B P15@3000] rango_factible | PASS | - |  |
| [B P15@3000] score[0,100] | PASS | - | score=100 |
| [B P15@3000] effectiveIncome | PASS | - | eff=2900 exp=2900 |
| [B P15@3000] wants[10,80] | PASS | - | wants_int=22.58 |
| [B P15@3500] HTTP200 | PASS | - |  |
| [B P15@3500] amounts>=0&finitos | PASS | - |  |
| [B P15@3500] totalCheck+deuda~100 | PASS | - | tc=97.14 +debt=2.86=100.00 |
| [B P15@3500] blocks~totalCheck | PASS | - | bsum=97.15 tc=97.14 |
| [B P15@3500] Samounts~effIncome | PASS | - | S=3400.03 eff=3400 |
| [B P15@3500] rango_factible | PASS | - |  |
| [B P15@3500] score[0,100] | PASS | - | score=100 |
| [B P15@3500] effectiveIncome | PASS | - | eff=3400 exp=3400 |
| [B P15@3500] wants[10,80] | PASS | - | wants_int=26.30 |
| [B P15@4000] HTTP200 | PASS | - |  |
| [B P15@4000] amounts>=0&finitos | PASS | - |  |
| [B P15@4000] totalCheck+deuda~100 | PASS | - | tc=97.5 +debt=2.50=100.00 |
| [B P15@4000] blocks~totalCheck | PASS | - | bsum=97.49 tc=97.5 |
| [B P15@4000] Samounts~effIncome | PASS | - | S=3899.98 eff=3900 |
| [B P15@4000] rango_factible | PASS | - |  |
| [B P15@4000] score[0,100] | PASS | - | score=100 |
| [B P15@4000] effectiveIncome | PASS | - | eff=3900 exp=3900 |
| [B P15@4000] wants[10,80] | PASS | - | wants_int=29.10 |
| [B P15@5000] HTTP200 | PASS | - |  |
| [B P15@5000] amounts>=0&finitos | PASS | - |  |
| [B P15@5000] totalCheck+deuda~100 | PASS | - | tc=98 +debt=2.00=100.00 |
| [B P15@5000] blocks~totalCheck | PASS | - | bsum=98.00 tc=98 |
| [B P15@5000] Samounts~effIncome | PASS | - | S=4900.00 eff=4900 |
| [B P15@5000] rango_factible | PASS | - |  |
| [B P15@5000] score[0,100] | PASS | - | score=95 |
| [B P15@5000] effectiveIncome | PASS | - | eff=4900 exp=4900 |
| [B P15@5000] wants[10,80] | PASS | - | wants_int=33.06 |
| [B P15@7000] HTTP200 | PASS | - |  |
| [B P15@7000] amounts>=0&finitos | PASS | - |  |
| [B P15@7000] totalCheck+deuda~100 | PASS | - | tc=98.57 +debt=1.43=100.00 |
| [B P15@7000] blocks~totalCheck | PASS | - | bsum=98.57 tc=98.57 |
| [B P15@7000] Samounts~effIncome | PASS | - | S=6900.00 eff=6900 |
| [B P15@7000] rango_factible | PASS | - |  |
| [B P15@7000] score[0,100] | PASS | - | score=95 |
| [B P15@7000] effectiveIncome | PASS | - | eff=6900 exp=6900 |
| [B P15@7000] wants[10,80] | PASS | - | wants_int=37.65 |
| [B P15@10000] HTTP200 | PASS | - |  |
| [B P15@10000] amounts>=0&finitos | PASS | - |  |
| [B P15@10000] totalCheck+deuda~100 | PASS | - | tc=99 +debt=1.00=100.00 |
| [B P15@10000] blocks~totalCheck | PASS | - | bsum=99.01 tc=99 |
| [B P15@10000] Samounts~effIncome | PASS | - | S=9899.99 eff=9900 |
| [B P15@10000] rango_factible | PASS | - |  |
| [B P15@10000] score[0,100] | PASS | - | score=90 |
| [B P15@10000] effectiveIncome | PASS | - | eff=9900 exp=9900 |
| [B P15@10000] wants[10,80] | PASS | - | wants_int=41.18 |
| [B P15@15000] HTTP200 | PASS | - |  |
| [B P15@15000] amounts>=0&finitos | PASS | - |  |
| [B P15@15000] totalCheck+deuda~100 | PASS | - | tc=99.33 +debt=0.67=100.00 |
| [B P15@15000] blocks~totalCheck | PASS | - | bsum=99.33 tc=99.33 |
| [B P15@15000] Samounts~effIncome | PASS | - | S=14900.00 eff=14900 |
| [B P15@15000] rango_factible | PASS | - |  |
| [B P15@15000] score[0,100] | PASS | - | score=90 |
| [B P15@15000] effectiveIncome | PASS | - | eff=14900 exp=14900 |
| [B P15@15000] wants[10,80] | PASS | - | wants_int=43.64 |
| [B P16@500] HTTP200 | PASS | - |  |
| [B P16@500] amounts>=0&finitos | PASS | - |  |
| [B P16@500] totalCheck+deuda~100 | PASS | - | tc=40 +debt=60.00=100.00 |
| [B P16@500] blocks~totalCheck | PASS | - | bsum=40.00 tc=40 |
| [B P16@500] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P16@500] rango_factible | PASS | - |  |
| [B P16@500] score[0,100] | PASS | - | score=100 |
| [B P16@500] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P16@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@700] HTTP200 | PASS | - |  |
| [B P16@700] amounts>=0&finitos | PASS | - |  |
| [B P16@700] totalCheck+deuda~100 | PASS | - | tc=57.14 +debt=42.86=100.00 |
| [B P16@700] blocks~totalCheck | PASS | - | bsum=57.14 tc=57.14 |
| [B P16@700] Samounts~effIncome | PASS | - | S=400.00 eff=400 |
| [B P16@700] rango_factible | PASS | - |  |
| [B P16@700] score[0,100] | PASS | - | score=100 |
| [B P16@700] effectiveIncome | PASS | - | eff=400 exp=400 |
| [B P16@700] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P16@900] HTTP200 | PASS | - |  |
| [B P16@900] amounts>=0&finitos | PASS | - |  |
| [B P16@900] totalCheck+deuda~100 | PASS | - | tc=66.67 +debt=33.33=100.00 |
| [B P16@900] blocks~totalCheck | PASS | - | bsum=66.67 tc=66.67 |
| [B P16@900] Samounts~effIncome | PASS | - | S=600.00 eff=600 |
| [B P16@900] rango_factible | PASS | - |  |
| [B P16@900] score[0,100] | PASS | - | score=100 |
| [B P16@900] effectiveIncome | PASS | - | eff=600 exp=600 |
| [B P16@900] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P16@1000] HTTP200 | PASS | - |  |
| [B P16@1000] amounts>=0&finitos | PASS | - |  |
| [B P16@1000] totalCheck+deuda~100 | PASS | - | tc=70 +debt=30.00=100.00 |
| [B P16@1000] blocks~totalCheck | PASS | - | bsum=70.00 tc=70 |
| [B P16@1000] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P16@1000] rango_factible | PASS | - |  |
| [B P16@1000] score[0,100] | PASS | - | score=100 |
| [B P16@1000] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P16@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@1200] HTTP200 | PASS | - |  |
| [B P16@1200] amounts>=0&finitos | PASS | - |  |
| [B P16@1200] totalCheck+deuda~100 | PASS | - | tc=75 +debt=25.00=100.00 |
| [B P16@1200] blocks~totalCheck | PASS | - | bsum=75.00 tc=75 |
| [B P16@1200] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P16@1200] rango_factible | PASS | - |  |
| [B P16@1200] score[0,100] | PASS | - | score=100 |
| [B P16@1200] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P16@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@1500] HTTP200 | PASS | - |  |
| [B P16@1500] amounts>=0&finitos | PASS | - |  |
| [B P16@1500] totalCheck+deuda~100 | PASS | - | tc=80 +debt=20.00=100.00 |
| [B P16@1500] blocks~totalCheck | PASS | - | bsum=80.00 tc=80 |
| [B P16@1500] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P16@1500] rango_factible | PASS | - |  |
| [B P16@1500] score[0,100] | PASS | - | score=100 |
| [B P16@1500] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P16@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@1800] HTTP200 | PASS | - |  |
| [B P16@1800] amounts>=0&finitos | PASS | - |  |
| [B P16@1800] totalCheck+deuda~100 | PASS | - | tc=83.33 +debt=16.67=100.00 |
| [B P16@1800] blocks~totalCheck | PASS | - | bsum=83.33 tc=83.33 |
| [B P16@1800] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P16@1800] rango_factible | PASS | - |  |
| [B P16@1800] score[0,100] | PASS | - | score=100 |
| [B P16@1800] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P16@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@2000] HTTP200 | PASS | - |  |
| [B P16@2000] amounts>=0&finitos | PASS | - |  |
| [B P16@2000] totalCheck+deuda~100 | PASS | - | tc=85 +debt=15.00=100.00 |
| [B P16@2000] blocks~totalCheck | PASS | - | bsum=85.00 tc=85 |
| [B P16@2000] Samounts~effIncome | PASS | - | S=1699.99 eff=1700 |
| [B P16@2000] rango_factible | PASS | - |  |
| [B P16@2000] score[0,100] | PASS | - | score=100 |
| [B P16@2000] effectiveIncome | PASS | - | eff=1700 exp=1700 |
| [B P16@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P16@2500] HTTP200 | PASS | - |  |
| [B P16@2500] amounts>=0&finitos | PASS | - |  |
| [B P16@2500] totalCheck+deuda~100 | PASS | - | tc=88 +debt=12.00=100.00 |
| [B P16@2500] blocks~totalCheck | PASS | - | bsum=88.00 tc=88 |
| [B P16@2500] Samounts~effIncome | PASS | - | S=2200.01 eff=2200 |
| [B P16@2500] rango_factible | PASS | - |  |
| [B P16@2500] score[0,100] | PASS | - | score=100 |
| [B P16@2500] effectiveIncome | PASS | - | eff=2200 exp=2200 |
| [B P16@2500] wants[10,80] | PASS | - | wants_int=13.64 |
| [B P16@3000] HTTP200 | PASS | - |  |
| [B P16@3000] amounts>=0&finitos | PASS | - |  |
| [B P16@3000] totalCheck+deuda~100 | PASS | - | tc=90 +debt=10.00=100.00 |
| [B P16@3000] blocks~totalCheck | PASS | - | bsum=90.00 tc=90 |
| [B P16@3000] Samounts~effIncome | PASS | - | S=2700.02 eff=2700 |
| [B P16@3000] rango_factible | PASS | - |  |
| [B P16@3000] score[0,100] | PASS | - | score=100 |
| [B P16@3000] effectiveIncome | PASS | - | eff=2700 exp=2700 |
| [B P16@3000] wants[10,80] | PASS | - | wants_int=19.51 |
| [B P16@3500] HTTP200 | PASS | - |  |
| [B P16@3500] amounts>=0&finitos | PASS | - |  |
| [B P16@3500] totalCheck+deuda~100 | PASS | - | tc=91.43 +debt=8.57=100.00 |
| [B P16@3500] blocks~totalCheck | PASS | - | bsum=91.42 tc=91.43 |
| [B P16@3500] Samounts~effIncome | PASS | - | S=3200.02 eff=3200 |
| [B P16@3500] rango_factible | PASS | - |  |
| [B P16@3500] score[0,100] | PASS | - | score=100 |
| [B P16@3500] effectiveIncome | PASS | - | eff=3200 exp=3200 |
| [B P16@3500] wants[10,80] | PASS | - | wants_int=23.61 |
| [B P16@4000] HTTP200 | PASS | - |  |
| [B P16@4000] amounts>=0&finitos | PASS | - |  |
| [B P16@4000] totalCheck+deuda~100 | PASS | - | tc=92.5 +debt=7.50=100.00 |
| [B P16@4000] blocks~totalCheck | PASS | - | bsum=92.50 tc=92.5 |
| [B P16@4000] Samounts~effIncome | PASS | - | S=3700.01 eff=3700 |
| [B P16@4000] rango_factible | PASS | - |  |
| [B P16@4000] score[0,100] | PASS | - | score=100 |
| [B P16@4000] effectiveIncome | PASS | - | eff=3700 exp=3700 |
| [B P16@4000] wants[10,80] | PASS | - | wants_int=26.66 |
| [B P16@5000] HTTP200 | PASS | - |  |
| [B P16@5000] amounts>=0&finitos | PASS | - |  |
| [B P16@5000] totalCheck+deuda~100 | PASS | - | tc=94 +debt=6.00=100.00 |
| [B P16@5000] blocks~totalCheck | PASS | - | bsum=94.00 tc=94 |
| [B P16@5000] Samounts~effIncome | PASS | - | S=4700.00 eff=4700 |
| [B P16@5000] rango_factible | PASS | - |  |
| [B P16@5000] score[0,100] | PASS | - | score=95 |
| [B P16@5000] effectiveIncome | PASS | - | eff=4700 exp=4700 |
| [B P16@5000] wants[10,80] | PASS | - | wants_int=30.87 |
| [B P16@7000] HTTP200 | PASS | - |  |
| [B P16@7000] amounts>=0&finitos | PASS | - |  |
| [B P16@7000] totalCheck+deuda~100 | PASS | - | tc=95.71 +debt=4.29=100.00 |
| [B P16@7000] blocks~totalCheck | PASS | - | bsum=95.72 tc=95.71 |
| [B P16@7000] Samounts~effIncome | PASS | - | S=6699.97 eff=6700 |
| [B P16@7000] rango_factible | PASS | - |  |
| [B P16@7000] score[0,100] | PASS | - | score=95 |
| [B P16@7000] effectiveIncome | PASS | - | eff=6700 exp=6700 |
| [B P16@7000] wants[10,80] | PASS | - | wants_int=35.67 |
| [B P16@10000] HTTP200 | PASS | - |  |
| [B P16@10000] amounts>=0&finitos | PASS | - |  |
| [B P16@10000] totalCheck+deuda~100 | PASS | - | tc=97 +debt=3.00=100.00 |
| [B P16@10000] blocks~totalCheck | PASS | - | bsum=97.00 tc=97 |
| [B P16@10000] Samounts~effIncome | PASS | - | S=9700.00 eff=9700 |
| [B P16@10000] rango_factible | PASS | - |  |
| [B P16@10000] score[0,100] | PASS | - | score=90 |
| [B P16@10000] effectiveIncome | PASS | - | eff=9700 exp=9700 |
| [B P16@10000] wants[10,80] | PASS | - | wants_int=39.27 |
| [B P16@15000] HTTP200 | PASS | - |  |
| [B P16@15000] amounts>=0&finitos | PASS | - |  |
| [B P16@15000] totalCheck+deuda~100 | PASS | - | tc=98 +debt=2.00=100.00 |
| [B P16@15000] blocks~totalCheck | PASS | - | bsum=98.00 tc=98 |
| [B P16@15000] Samounts~effIncome | PASS | - | S=14700.01 eff=14700 |
| [B P16@15000] rango_factible | PASS | - |  |
| [B P16@15000] score[0,100] | PASS | - | score=90 |
| [B P16@15000] effectiveIncome | PASS | - | eff=14700 exp=14700 |
| [B P16@15000] wants[10,80] | PASS | - | wants_int=41.77 |
| [B P17@500] HTTP200 | PASS | - |  |
| [B P17@500] amounts>=0&finitos | PASS | - |  |
| [B P17@500] totalCheck+deuda~100 | FAIL | CRITICO | tc=40 +debt=120.00=160.00 |
| [B P17@500] blocks~totalCheck | PASS | - | bsum=40.00 tc=40 |
| [B P17@500] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P17@500] rango_factible | PASS | - |  |
| [B P17@500] score[0,100] | PASS | - | score=85 |
| [B P17@500] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P17@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@700] HTTP200 | PASS | - |  |
| [B P17@700] amounts>=0&finitos | PASS | - |  |
| [B P17@700] totalCheck+deuda~100 | FAIL | CRITICO | tc=28.57 +debt=85.71=114.28 |
| [B P17@700] blocks~totalCheck | PASS | - | bsum=28.57 tc=28.57 |
| [B P17@700] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P17@700] rango_factible | PASS | - |  |
| [B P17@700] score[0,100] | PASS | - | score=85 |
| [B P17@700] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P17@700] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P17@900] HTTP200 | PASS | - |  |
| [B P17@900] amounts>=0&finitos | PASS | - |  |
| [B P17@900] totalCheck+deuda~100 | PASS | - | tc=33.33 +debt=66.67=100.00 |
| [B P17@900] blocks~totalCheck | PASS | - | bsum=33.33 tc=33.33 |
| [B P17@900] Samounts~effIncome | PASS | - | S=299.99 eff=300 |
| [B P17@900] rango_factible | PASS | - |  |
| [B P17@900] score[0,100] | PASS | - | score=100 |
| [B P17@900] effectiveIncome | PASS | - | eff=300 exp=300 |
| [B P17@900] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P17@1000] HTTP200 | PASS | - |  |
| [B P17@1000] amounts>=0&finitos | PASS | - |  |
| [B P17@1000] totalCheck+deuda~100 | PASS | - | tc=40 +debt=60.00=100.00 |
| [B P17@1000] blocks~totalCheck | PASS | - | bsum=40.00 tc=40 |
| [B P17@1000] Samounts~effIncome | PASS | - | S=400.00 eff=400 |
| [B P17@1000] rango_factible | PASS | - |  |
| [B P17@1000] score[0,100] | PASS | - | score=100 |
| [B P17@1000] effectiveIncome | PASS | - | eff=400 exp=400 |
| [B P17@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@1200] HTTP200 | PASS | - |  |
| [B P17@1200] amounts>=0&finitos | PASS | - |  |
| [B P17@1200] totalCheck+deuda~100 | PASS | - | tc=50 +debt=50.00=100.00 |
| [B P17@1200] blocks~totalCheck | PASS | - | bsum=50.00 tc=50 |
| [B P17@1200] Samounts~effIncome | PASS | - | S=600.00 eff=600 |
| [B P17@1200] rango_factible | PASS | - |  |
| [B P17@1200] score[0,100] | PASS | - | score=100 |
| [B P17@1200] effectiveIncome | PASS | - | eff=600 exp=600 |
| [B P17@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@1500] HTTP200 | PASS | - |  |
| [B P17@1500] amounts>=0&finitos | PASS | - |  |
| [B P17@1500] totalCheck+deuda~100 | PASS | - | tc=60 +debt=40.00=100.00 |
| [B P17@1500] blocks~totalCheck | PASS | - | bsum=60.00 tc=60 |
| [B P17@1500] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P17@1500] rango_factible | PASS | - |  |
| [B P17@1500] score[0,100] | PASS | - | score=100 |
| [B P17@1500] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P17@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@1800] HTTP200 | PASS | - |  |
| [B P17@1800] amounts>=0&finitos | PASS | - |  |
| [B P17@1800] totalCheck+deuda~100 | PASS | - | tc=66.67 +debt=33.33=100.00 |
| [B P17@1800] blocks~totalCheck | PASS | - | bsum=66.67 tc=66.67 |
| [B P17@1800] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P17@1800] rango_factible | PASS | - |  |
| [B P17@1800] score[0,100] | PASS | - | score=100 |
| [B P17@1800] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P17@1800] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P17@2000] HTTP200 | PASS | - |  |
| [B P17@2000] amounts>=0&finitos | PASS | - |  |
| [B P17@2000] totalCheck+deuda~100 | PASS | - | tc=70 +debt=30.00=100.00 |
| [B P17@2000] blocks~totalCheck | PASS | - | bsum=70.00 tc=70 |
| [B P17@2000] Samounts~effIncome | PASS | - | S=1400.00 eff=1400 |
| [B P17@2000] rango_factible | PASS | - |  |
| [B P17@2000] score[0,100] | PASS | - | score=100 |
| [B P17@2000] effectiveIncome | PASS | - | eff=1400 exp=1400 |
| [B P17@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@2500] HTTP200 | PASS | - |  |
| [B P17@2500] amounts>=0&finitos | PASS | - |  |
| [B P17@2500] totalCheck+deuda~100 | PASS | - | tc=76 +debt=24.00=100.00 |
| [B P17@2500] blocks~totalCheck | PASS | - | bsum=76.00 tc=76 |
| [B P17@2500] Samounts~effIncome | PASS | - | S=1900.01 eff=1900 |
| [B P17@2500] rango_factible | PASS | - |  |
| [B P17@2500] score[0,100] | PASS | - | score=100 |
| [B P17@2500] effectiveIncome | PASS | - | eff=1900 exp=1900 |
| [B P17@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P17@3000] HTTP200 | PASS | - |  |
| [B P17@3000] amounts>=0&finitos | PASS | - |  |
| [B P17@3000] totalCheck+deuda~100 | PASS | - | tc=80 +debt=20.00=100.00 |
| [B P17@3000] blocks~totalCheck | PASS | - | bsum=80.00 tc=80 |
| [B P17@3000] Samounts~effIncome | PASS | - | S=2400.01 eff=2400 |
| [B P17@3000] rango_factible | PASS | - |  |
| [B P17@3000] score[0,100] | PASS | - | score=100 |
| [B P17@3000] effectiveIncome | PASS | - | eff=2400 exp=2400 |
| [B P17@3000] wants[10,80] | PASS | - | wants_int=12.56 |
| [B P17@3500] HTTP200 | PASS | - |  |
| [B P17@3500] amounts>=0&finitos | PASS | - |  |
| [B P17@3500] totalCheck+deuda~100 | PASS | - | tc=82.86 +debt=17.14=100.00 |
| [B P17@3500] blocks~totalCheck | PASS | - | bsum=82.86 tc=82.86 |
| [B P17@3500] Samounts~effIncome | PASS | - | S=2900.00 eff=2900 |
| [B P17@3500] rango_factible | PASS | - |  |
| [B P17@3500] score[0,100] | PASS | - | score=100 |
| [B P17@3500] effectiveIncome | PASS | - | eff=2900 exp=2900 |
| [B P17@3500] wants[10,80] | PASS | - | wants_int=17.89 |
| [B P17@4000] HTTP200 | PASS | - |  |
| [B P17@4000] amounts>=0&finitos | PASS | - |  |
| [B P17@4000] totalCheck+deuda~100 | PASS | - | tc=85 +debt=15.00=100.00 |
| [B P17@4000] blocks~totalCheck | PASS | - | bsum=84.99 tc=85 |
| [B P17@4000] Samounts~effIncome | PASS | - | S=3400.02 eff=3400 |
| [B P17@4000] rango_factible | PASS | - |  |
| [B P17@4000] score[0,100] | PASS | - | score=100 |
| [B P17@4000] effectiveIncome | PASS | - | eff=3400 exp=3400 |
| [B P17@4000] wants[10,80] | PASS | - | wants_int=21.69 |
| [B P17@5000] HTTP200 | PASS | - |  |
| [B P17@5000] amounts>=0&finitos | PASS | - |  |
| [B P17@5000] totalCheck+deuda~100 | PASS | - | tc=88 +debt=12.00=100.00 |
| [B P17@5000] blocks~totalCheck | PASS | - | bsum=88.00 tc=88 |
| [B P17@5000] Samounts~effIncome | PASS | - | S=4400.00 eff=4400 |
| [B P17@5000] rango_factible | PASS | - |  |
| [B P17@5000] score[0,100] | PASS | - | score=100 |
| [B P17@5000] effectiveIncome | PASS | - | eff=4400 exp=4400 |
| [B P17@5000] wants[10,80] | PASS | - | wants_int=26.82 |
| [B P17@7000] HTTP200 | PASS | - |  |
| [B P17@7000] amounts>=0&finitos | PASS | - |  |
| [B P17@7000] totalCheck+deuda~100 | PASS | - | tc=91.43 +debt=8.57=100.00 |
| [B P17@7000] blocks~totalCheck | PASS | - | bsum=91.43 tc=91.43 |
| [B P17@7000] Samounts~effIncome | PASS | - | S=6399.99 eff=6400 |
| [B P17@7000] rango_factible | PASS | - |  |
| [B P17@7000] score[0,100] | PASS | - | score=95 |
| [B P17@7000] effectiveIncome | PASS | - | eff=6400 exp=6400 |
| [B P17@7000] wants[10,80] | PASS | - | wants_int=32.43 |
| [B P17@10000] HTTP200 | PASS | - |  |
| [B P17@10000] amounts>=0&finitos | PASS | - |  |
| [B P17@10000] totalCheck+deuda~100 | PASS | - | tc=94 +debt=6.00=100.00 |
| [B P17@10000] blocks~totalCheck | PASS | - | bsum=94.00 tc=94 |
| [B P17@10000] Samounts~effIncome | PASS | - | S=9400.00 eff=9400 |
| [B P17@10000] rango_factible | PASS | - |  |
| [B P17@10000] score[0,100] | PASS | - | score=95 |
| [B P17@10000] effectiveIncome | PASS | - | eff=9400 exp=9400 |
| [B P17@10000] wants[10,80] | PASS | - | wants_int=36.51 |
| [B P17@15000] HTTP200 | PASS | - |  |
| [B P17@15000] amounts>=0&finitos | PASS | - |  |
| [B P17@15000] totalCheck+deuda~100 | PASS | - | tc=96 +debt=4.00=100.00 |
| [B P17@15000] blocks~totalCheck | PASS | - | bsum=96.00 tc=96 |
| [B P17@15000] Samounts~effIncome | PASS | - | S=14399.96 eff=14400 |
| [B P17@15000] rango_factible | PASS | - |  |
| [B P17@15000] score[0,100] | PASS | - | score=90 |
| [B P17@15000] effectiveIncome | PASS | - | eff=14400 exp=14400 |
| [B P17@15000] wants[10,80] | PASS | - | wants_int=39.34 |
| [B P18@500] HTTP200 | PASS | - |  |
| [B P18@500] amounts>=0&finitos | PASS | - |  |
| [B P18@500] totalCheck+deuda~100 | FAIL | CRITICO | tc=40 +debt=200.00=240.00 |
| [B P18@500] blocks~totalCheck | PASS | - | bsum=40.00 tc=40 |
| [B P18@500] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P18@500] rango_factible | PASS | - |  |
| [B P18@500] score[0,100] | PASS | - | score=85 |
| [B P18@500] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P18@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P18@700] HTTP200 | PASS | - |  |
| [B P18@700] amounts>=0&finitos | PASS | - |  |
| [B P18@700] totalCheck+deuda~100 | FAIL | CRITICO | tc=28.57 +debt=142.86=171.43 |
| [B P18@700] blocks~totalCheck | PASS | - | bsum=28.58 tc=28.57 |
| [B P18@700] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P18@700] rango_factible | PASS | - |  |
| [B P18@700] score[0,100] | PASS | - | score=85 |
| [B P18@700] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P18@700] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P18@900] HTTP200 | PASS | - |  |
| [B P18@900] amounts>=0&finitos | PASS | - |  |
| [B P18@900] totalCheck+deuda~100 | FAIL | CRITICO | tc=22.22 +debt=111.11=133.33 |
| [B P18@900] blocks~totalCheck | PASS | - | bsum=22.22 tc=22.22 |
| [B P18@900] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P18@900] rango_factible | PASS | - |  |
| [B P18@900] score[0,100] | PASS | - | score=85 |
| [B P18@900] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P18@900] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P18@1000] HTTP200 | PASS | - |  |
| [B P18@1000] amounts>=0&finitos | PASS | - |  |
| [B P18@1000] totalCheck+deuda~100 | FAIL | CRITICO | tc=20 +debt=100.00=120.00 |
| [B P18@1000] blocks~totalCheck | PASS | - | bsum=20.00 tc=20 |
| [B P18@1000] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P18@1000] rango_factible | PASS | - |  |
| [B P18@1000] score[0,100] | PASS | - | score=85 |
| [B P18@1000] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P18@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P18@1200] HTTP200 | PASS | - |  |
| [B P18@1200] amounts>=0&finitos | PASS | - |  |
| [B P18@1200] totalCheck+deuda~100 | PASS | - | tc=16.67 +debt=83.33=100.00 |
| [B P18@1200] blocks~totalCheck | PASS | - | bsum=16.67 tc=16.67 |
| [B P18@1200] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P18@1200] rango_factible | PASS | - |  |
| [B P18@1200] score[0,100] | PASS | - | score=100 |
| [B P18@1200] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P18@1200] wants[10,80] | PASS | - | wants_int=10.02 |
| [B P18@1500] HTTP200 | PASS | - |  |
| [B P18@1500] amounts>=0&finitos | PASS | - |  |
| [B P18@1500] totalCheck+deuda~100 | PASS | - | tc=33.33 +debt=66.67=100.00 |
| [B P18@1500] blocks~totalCheck | PASS | - | bsum=33.33 tc=33.33 |
| [B P18@1500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P18@1500] rango_factible | PASS | - |  |
| [B P18@1500] score[0,100] | PASS | - | score=100 |
| [B P18@1500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P18@1500] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P18@1800] HTTP200 | PASS | - |  |
| [B P18@1800] amounts>=0&finitos | PASS | - |  |
| [B P18@1800] totalCheck+deuda~100 | PASS | - | tc=44.44 +debt=55.56=100.00 |
| [B P18@1800] blocks~totalCheck | PASS | - | bsum=44.44 tc=44.44 |
| [B P18@1800] Samounts~effIncome | PASS | - | S=800.00 eff=800 |
| [B P18@1800] rango_factible | PASS | - |  |
| [B P18@1800] score[0,100] | PASS | - | score=100 |
| [B P18@1800] effectiveIncome | PASS | - | eff=800 exp=800 |
| [B P18@1800] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P18@2000] HTTP200 | PASS | - |  |
| [B P18@2000] amounts>=0&finitos | PASS | - |  |
| [B P18@2000] totalCheck+deuda~100 | PASS | - | tc=50 +debt=50.00=100.00 |
| [B P18@2000] blocks~totalCheck | PASS | - | bsum=50.00 tc=50 |
| [B P18@2000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P18@2000] rango_factible | PASS | - |  |
| [B P18@2000] score[0,100] | PASS | - | score=100 |
| [B P18@2000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P18@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P18@2500] HTTP200 | PASS | - |  |
| [B P18@2500] amounts>=0&finitos | PASS | - |  |
| [B P18@2500] totalCheck+deuda~100 | PASS | - | tc=60 +debt=40.00=100.00 |
| [B P18@2500] blocks~totalCheck | PASS | - | bsum=60.00 tc=60 |
| [B P18@2500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P18@2500] rango_factible | PASS | - |  |
| [B P18@2500] score[0,100] | PASS | - | score=100 |
| [B P18@2500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P18@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P18@3000] HTTP200 | PASS | - |  |
| [B P18@3000] amounts>=0&finitos | PASS | - |  |
| [B P18@3000] totalCheck+deuda~100 | PASS | - | tc=66.67 +debt=33.33=100.00 |
| [B P18@3000] blocks~totalCheck | PASS | - | bsum=66.67 tc=66.67 |
| [B P18@3000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P18@3000] rango_factible | PASS | - |  |
| [B P18@3000] score[0,100] | PASS | - | score=100 |
| [B P18@3000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P18@3000] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P18@3500] HTTP200 | PASS | - |  |
| [B P18@3500] amounts>=0&finitos | PASS | - |  |
| [B P18@3500] totalCheck+deuda~100 | PASS | - | tc=71.43 +debt=28.57=100.00 |
| [B P18@3500] blocks~totalCheck | PASS | - | bsum=71.43 tc=71.43 |
| [B P18@3500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P18@3500] rango_factible | PASS | - |  |
| [B P18@3500] score[0,100] | PASS | - | score=100 |
| [B P18@3500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P18@3500] wants[10,80] | PASS | - | wants_int=14.60 |
| [B P18@4000] HTTP200 | PASS | - |  |
| [B P18@4000] amounts>=0&finitos | PASS | - |  |
| [B P18@4000] totalCheck+deuda~100 | PASS | - | tc=75 +debt=25.00=100.00 |
| [B P18@4000] blocks~totalCheck | PASS | - | bsum=75.01 tc=75 |
| [B P18@4000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P18@4000] rango_factible | PASS | - |  |
| [B P18@4000] score[0,100] | PASS | - | score=100 |
| [B P18@4000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P18@4000] wants[10,80] | PASS | - | wants_int=19.43 |
| [B P18@5000] HTTP200 | PASS | - |  |
| [B P18@5000] amounts>=0&finitos | PASS | - |  |
| [B P18@5000] totalCheck+deuda~100 | PASS | - | tc=80 +debt=20.00=100.00 |
| [B P18@5000] blocks~totalCheck | PASS | - | bsum=80.00 tc=80 |
| [B P18@5000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P18@5000] rango_factible | PASS | - |  |
| [B P18@5000] score[0,100] | PASS | - | score=100 |
| [B P18@5000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P18@5000] wants[10,80] | PASS | - | wants_int=25.59 |
| [B P18@7000] HTTP200 | PASS | - |  |
| [B P18@7000] amounts>=0&finitos | PASS | - |  |
| [B P18@7000] totalCheck+deuda~100 | PASS | - | tc=85.71 +debt=14.29=100.00 |
| [B P18@7000] blocks~totalCheck | PASS | - | bsum=85.71 tc=85.71 |
| [B P18@7000] Samounts~effIncome | PASS | - | S=6000.01 eff=6000 |
| [B P18@7000] rango_factible | PASS | - |  |
| [B P18@7000] score[0,100] | PASS | - | score=95 |
| [B P18@7000] effectiveIncome | PASS | - | eff=6000 exp=6000 |
| [B P18@7000] wants[10,80] | PASS | - | wants_int=31.94 |
| [B P18@10000] HTTP200 | PASS | - |  |
| [B P18@10000] amounts>=0&finitos | PASS | - |  |
| [B P18@10000] totalCheck+deuda~100 | PASS | - | tc=90 +debt=10.00=100.00 |
| [B P18@10000] blocks~totalCheck | PASS | - | bsum=90.00 tc=90 |
| [B P18@10000] Samounts~effIncome | PASS | - | S=9000.02 eff=9000 |
| [B P18@10000] rango_factible | PASS | - |  |
| [B P18@10000] score[0,100] | PASS | - | score=95 |
| [B P18@10000] effectiveIncome | PASS | - | eff=9000 exp=9000 |
| [B P18@10000] wants[10,80] | PASS | - | wants_int=36.36 |
| [B P18@15000] HTTP200 | PASS | - |  |
| [B P18@15000] amounts>=0&finitos | PASS | - |  |
| [B P18@15000] totalCheck+deuda~100 | PASS | - | tc=93.33 +debt=6.67=100.00 |
| [B P18@15000] blocks~totalCheck | PASS | - | bsum=93.33 tc=93.33 |
| [B P18@15000] Samounts~effIncome | PASS | - | S=14000.03 eff=14000 |
| [B P18@15000] rango_factible | PASS | - |  |
| [B P18@15000] score[0,100] | PASS | - | score=90 |
| [B P18@15000] effectiveIncome | PASS | - | eff=14000 exp=14000 |
| [B P18@15000] wants[10,80] | PASS | - | wants_int=39.38 |
| [B P19@500] HTTP200 | PASS | - |  |
| [B P19@500] amounts>=0&finitos | PASS | - |  |
| [B P19@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P19@500] rango_factible | PASS | - |  |
| [B P19@500] score[0,100] | PASS | - | score=100 |
| [B P19@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P19@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@700] HTTP200 | PASS | - |  |
| [B P19@700] amounts>=0&finitos | PASS | - |  |
| [B P19@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P19@700] rango_factible | PASS | - |  |
| [B P19@700] score[0,100] | PASS | - | score=100 |
| [B P19@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P19@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@900] HTTP200 | PASS | - |  |
| [B P19@900] amounts>=0&finitos | PASS | - |  |
| [B P19@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P19@900] rango_factible | PASS | - |  |
| [B P19@900] score[0,100] | PASS | - | score=100 |
| [B P19@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P19@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@1000] HTTP200 | PASS | - |  |
| [B P19@1000] amounts>=0&finitos | PASS | - |  |
| [B P19@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P19@1000] rango_factible | PASS | - |  |
| [B P19@1000] score[0,100] | PASS | - | score=100 |
| [B P19@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P19@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@1200] HTTP200 | PASS | - |  |
| [B P19@1200] amounts>=0&finitos | PASS | - |  |
| [B P19@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P19@1200] rango_factible | PASS | - |  |
| [B P19@1200] score[0,100] | PASS | - | score=100 |
| [B P19@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P19@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@1500] HTTP200 | PASS | - |  |
| [B P19@1500] amounts>=0&finitos | PASS | - |  |
| [B P19@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P19@1500] rango_factible | PASS | - |  |
| [B P19@1500] score[0,100] | PASS | - | score=100 |
| [B P19@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P19@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@1800] HTTP200 | PASS | - |  |
| [B P19@1800] amounts>=0&finitos | PASS | - |  |
| [B P19@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P19@1800] rango_factible | PASS | - |  |
| [B P19@1800] score[0,100] | PASS | - | score=97 |
| [B P19@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P19@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@2000] HTTP200 | PASS | - |  |
| [B P19@2000] amounts>=0&finitos | PASS | - |  |
| [B P19@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P19@2000] rango_factible | PASS | - |  |
| [B P19@2000] score[0,100] | PASS | - | score=97 |
| [B P19@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P19@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@2500] HTTP200 | PASS | - |  |
| [B P19@2500] amounts>=0&finitos | PASS | - |  |
| [B P19@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@2500] Samounts~effIncome | PASS | - | S=2499.98 eff=2500 |
| [B P19@2500] rango_factible | PASS | - |  |
| [B P19@2500] score[0,100] | PASS | - | score=97 |
| [B P19@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P19@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@3000] HTTP200 | PASS | - |  |
| [B P19@3000] amounts>=0&finitos | PASS | - |  |
| [B P19@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P19@3000] rango_factible | PASS | - |  |
| [B P19@3000] score[0,100] | PASS | - | score=97 |
| [B P19@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P19@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@3000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@3500] HTTP200 | PASS | - |  |
| [B P19@3500] amounts>=0&finitos | PASS | - |  |
| [B P19@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@3500] Samounts~effIncome | PASS | - | S=3499.99 eff=3500 |
| [B P19@3500] rango_factible | PASS | - |  |
| [B P19@3500] score[0,100] | PASS | - | score=97 |
| [B P19@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P19@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@4000] HTTP200 | PASS | - |  |
| [B P19@4000] amounts>=0&finitos | PASS | - |  |
| [B P19@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P19@4000] rango_factible | PASS | - |  |
| [B P19@4000] score[0,100] | PASS | - | score=97 |
| [B P19@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P19@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@4000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@5000] HTTP200 | PASS | - |  |
| [B P19@5000] amounts>=0&finitos | PASS | - |  |
| [B P19@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P19@5000] rango_factible | PASS | - |  |
| [B P19@5000] score[0,100] | PASS | - | score=97 |
| [B P19@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P19@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@5000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P19@7000] HTTP200 | PASS | - |  |
| [B P19@7000] amounts>=0&finitos | PASS | - |  |
| [B P19@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@7000] Samounts~effIncome | PASS | - | S=6999.98 eff=7000 |
| [B P19@7000] rango_factible | PASS | - |  |
| [B P19@7000] score[0,100] | PASS | - | score=97 |
| [B P19@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P19@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@7000] wants[10,80] | PASS | - | wants_int=16.12 |
| [B P19@10000] HTTP200 | PASS | - |  |
| [B P19@10000] amounts>=0&finitos | PASS | - |  |
| [B P19@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P19@10000] Samounts~effIncome | PASS | - | S=9999.98 eff=10000 |
| [B P19@10000] rango_factible | PASS | - |  |
| [B P19@10000] score[0,100] | PASS | - | score=97 |
| [B P19@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P19@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@10000] wants[10,80] | PASS | - | wants_int=23.02 |
| [B P19@15000] HTTP200 | PASS | - |  |
| [B P19@15000] amounts>=0&finitos | PASS | - |  |
| [B P19@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P19@15000] blocks~totalCheck | PASS | - | bsum=99.99 tc=100 |
| [B P19@15000] Samounts~effIncome | PASS | - | S=14999.99 eff=15000 |
| [B P19@15000] rango_factible | PASS | - |  |
| [B P19@15000] score[0,100] | PASS | - | score=97 |
| [B P19@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P19@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P19@15000] wants[10,80] | PASS | - | wants_int=28.21 |
| [B P20@500] HTTP200 | PASS | - |  |
| [B P20@500] amounts>=0&finitos | PASS | - |  |
| [B P20@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P20@500] rango_factible | PASS | - |  |
| [B P20@500] score[0,100] | PASS | - | score=100 |
| [B P20@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P20@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@700] HTTP200 | PASS | - |  |
| [B P20@700] amounts>=0&finitos | PASS | - |  |
| [B P20@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P20@700] rango_factible | PASS | - |  |
| [B P20@700] score[0,100] | PASS | - | score=100 |
| [B P20@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P20@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@900] HTTP200 | PASS | - |  |
| [B P20@900] amounts>=0&finitos | PASS | - |  |
| [B P20@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P20@900] rango_factible | PASS | - |  |
| [B P20@900] score[0,100] | PASS | - | score=100 |
| [B P20@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P20@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@1000] HTTP200 | PASS | - |  |
| [B P20@1000] amounts>=0&finitos | PASS | - |  |
| [B P20@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P20@1000] rango_factible | PASS | - |  |
| [B P20@1000] score[0,100] | PASS | - | score=100 |
| [B P20@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P20@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@1200] HTTP200 | PASS | - |  |
| [B P20@1200] amounts>=0&finitos | PASS | - |  |
| [B P20@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P20@1200] rango_factible | PASS | - |  |
| [B P20@1200] score[0,100] | PASS | - | score=100 |
| [B P20@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P20@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@1500] HTTP200 | PASS | - |  |
| [B P20@1500] amounts>=0&finitos | PASS | - |  |
| [B P20@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P20@1500] rango_factible | PASS | - |  |
| [B P20@1500] score[0,100] | PASS | - | score=100 |
| [B P20@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P20@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@1800] HTTP200 | PASS | - |  |
| [B P20@1800] amounts>=0&finitos | PASS | - |  |
| [B P20@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P20@1800] rango_factible | PASS | - |  |
| [B P20@1800] score[0,100] | PASS | - | score=97 |
| [B P20@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P20@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@2000] HTTP200 | PASS | - |  |
| [B P20@2000] amounts>=0&finitos | PASS | - |  |
| [B P20@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P20@2000] rango_factible | PASS | - |  |
| [B P20@2000] score[0,100] | PASS | - | score=97 |
| [B P20@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P20@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@2500] HTTP200 | PASS | - |  |
| [B P20@2500] amounts>=0&finitos | PASS | - |  |
| [B P20@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@2500] Samounts~effIncome | PASS | - | S=2499.98 eff=2500 |
| [B P20@2500] rango_factible | PASS | - |  |
| [B P20@2500] score[0,100] | PASS | - | score=97 |
| [B P20@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P20@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@3000] HTTP200 | PASS | - |  |
| [B P20@3000] amounts>=0&finitos | PASS | - |  |
| [B P20@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@3000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P20@3000] rango_factible | PASS | - |  |
| [B P20@3000] score[0,100] | PASS | - | score=97 |
| [B P20@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P20@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@3000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@3500] HTTP200 | PASS | - |  |
| [B P20@3500] amounts>=0&finitos | PASS | - |  |
| [B P20@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@3500] Samounts~effIncome | PASS | - | S=3499.99 eff=3500 |
| [B P20@3500] rango_factible | PASS | - |  |
| [B P20@3500] score[0,100] | PASS | - | score=97 |
| [B P20@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P20@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@4000] HTTP200 | PASS | - |  |
| [B P20@4000] amounts>=0&finitos | PASS | - |  |
| [B P20@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P20@4000] rango_factible | PASS | - |  |
| [B P20@4000] score[0,100] | PASS | - | score=97 |
| [B P20@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P20@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@4000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@5000] HTTP200 | PASS | - |  |
| [B P20@5000] amounts>=0&finitos | PASS | - |  |
| [B P20@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P20@5000] rango_factible | PASS | - |  |
| [B P20@5000] score[0,100] | PASS | - | score=97 |
| [B P20@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P20@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@5000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P20@7000] HTTP200 | PASS | - |  |
| [B P20@7000] amounts>=0&finitos | PASS | - |  |
| [B P20@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@7000] Samounts~effIncome | PASS | - | S=6999.98 eff=7000 |
| [B P20@7000] rango_factible | PASS | - |  |
| [B P20@7000] score[0,100] | PASS | - | score=97 |
| [B P20@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P20@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@7000] wants[10,80] | PASS | - | wants_int=16.12 |
| [B P20@10000] HTTP200 | PASS | - |  |
| [B P20@10000] amounts>=0&finitos | PASS | - |  |
| [B P20@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P20@10000] Samounts~effIncome | PASS | - | S=9999.98 eff=10000 |
| [B P20@10000] rango_factible | PASS | - |  |
| [B P20@10000] score[0,100] | PASS | - | score=97 |
| [B P20@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P20@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@10000] wants[10,80] | PASS | - | wants_int=23.02 |
| [B P20@15000] HTTP200 | PASS | - |  |
| [B P20@15000] amounts>=0&finitos | PASS | - |  |
| [B P20@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P20@15000] blocks~totalCheck | PASS | - | bsum=99.99 tc=100 |
| [B P20@15000] Samounts~effIncome | PASS | - | S=14999.99 eff=15000 |
| [B P20@15000] rango_factible | PASS | - |  |
| [B P20@15000] score[0,100] | PASS | - | score=97 |
| [B P20@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P20@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P20@15000] wants[10,80] | PASS | - | wants_int=28.21 |
| [B P21@500] HTTP200 | PASS | - |  |
| [B P21@500] amounts>=0&finitos | PASS | - |  |
| [B P21@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P21@500] rango_factible | PASS | - |  |
| [B P21@500] score[0,100] | PASS | - | score=94 |
| [B P21@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P21@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P21@700] HTTP200 | PASS | - |  |
| [B P21@700] amounts>=0&finitos | PASS | - |  |
| [B P21@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P21@700] rango_factible | PASS | - |  |
| [B P21@700] score[0,100] | PASS | - | score=97 |
| [B P21@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P21@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P21@900] HTTP200 | PASS | - |  |
| [B P21@900] amounts>=0&finitos | PASS | - |  |
| [B P21@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P21@900] rango_factible | PASS | - |  |
| [B P21@900] score[0,100] | PASS | - | score=97 |
| [B P21@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P21@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P21@1000] HTTP200 | PASS | - |  |
| [B P21@1000] amounts>=0&finitos | PASS | - |  |
| [B P21@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P21@1000] rango_factible | PASS | - |  |
| [B P21@1000] score[0,100] | PASS | - | score=97 |
| [B P21@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P21@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P21@1200] HTTP200 | PASS | - |  |
| [B P21@1200] amounts>=0&finitos | PASS | - |  |
| [B P21@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P21@1200] rango_factible | PASS | - |  |
| [B P21@1200] score[0,100] | PASS | - | score=97 |
| [B P21@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P21@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P21@1500] HTTP200 | PASS | - |  |
| [B P21@1500] amounts>=0&finitos | PASS | - |  |
| [B P21@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P21@1500] rango_factible | PASS | - |  |
| [B P21@1500] score[0,100] | PASS | - | score=97 |
| [B P21@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P21@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@1500] wants[10,80] | PASS | - | wants_int=10.04 |
| [B P21@1800] HTTP200 | PASS | - |  |
| [B P21@1800] amounts>=0&finitos | PASS | - |  |
| [B P21@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P21@1800] rango_factible | PASS | - |  |
| [B P21@1800] score[0,100] | PASS | - | score=97 |
| [B P21@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P21@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@1800] wants[10,80] | PASS | - | wants_int=12.34 |
| [B P21@2000] HTTP200 | PASS | - |  |
| [B P21@2000] amounts>=0&finitos | PASS | - |  |
| [B P21@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P21@2000] rango_factible | PASS | - |  |
| [B P21@2000] score[0,100] | PASS | - | score=97 |
| [B P21@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P21@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@2000] wants[10,80] | PASS | - | wants_int=13.50 |
| [B P21@2500] HTTP200 | PASS | - |  |
| [B P21@2500] amounts>=0&finitos | PASS | - |  |
| [B P21@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P21@2500] rango_factible | PASS | - |  |
| [B P21@2500] score[0,100] | PASS | - | score=97 |
| [B P21@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P21@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@2500] wants[10,80] | PASS | - | wants_int=20.60 |
| [B P21@3000] HTTP200 | PASS | - |  |
| [B P21@3000] amounts>=0&finitos | PASS | - |  |
| [B P21@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P21@3000] rango_factible | PASS | - |  |
| [B P21@3000] score[0,100] | PASS | - | score=97 |
| [B P21@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P21@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@3000] wants[10,80] | PASS | - | wants_int=25.42 |
| [B P21@3500] HTTP200 | PASS | - |  |
| [B P21@3500] amounts>=0&finitos | PASS | - |  |
| [B P21@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P21@3500] rango_factible | PASS | - |  |
| [B P21@3500] score[0,100] | PASS | - | score=97 |
| [B P21@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P21@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@3500] wants[10,80] | PASS | - | wants_int=28.92 |
| [B P21@4000] HTTP200 | PASS | - |  |
| [B P21@4000] amounts>=0&finitos | PASS | - |  |
| [B P21@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P21@4000] rango_factible | PASS | - |  |
| [B P21@4000] score[0,100] | PASS | - | score=92 |
| [B P21@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P21@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@4000] wants[10,80] | PASS | - | wants_int=31.58 |
| [B P21@5000] HTTP200 | PASS | - |  |
| [B P21@5000] amounts>=0&finitos | PASS | - |  |
| [B P21@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P21@5000] rango_factible | PASS | - |  |
| [B P21@5000] score[0,100] | PASS | - | score=95 |
| [B P21@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P21@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@5000] wants[10,80] | PASS | - | wants_int=35.37 |
| [B P21@7000] HTTP200 | PASS | - |  |
| [B P21@7000] amounts>=0&finitos | PASS | - |  |
| [B P21@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P21@7000] rango_factible | PASS | - |  |
| [B P21@7000] score[0,100] | PASS | - | score=90 |
| [B P21@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P21@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@7000] wants[10,80] | PASS | - | wants_int=39.81 |
| [B P21@10000] HTTP200 | PASS | - |  |
| [B P21@10000] amounts>=0&finitos | PASS | - |  |
| [B P21@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P21@10000] rango_factible | PASS | - |  |
| [B P21@10000] score[0,100] | PASS | - | score=90 |
| [B P21@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P21@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@10000] wants[10,80] | PASS | - | wants_int=43.26 |
| [B P21@15000] HTTP200 | PASS | - |  |
| [B P21@15000] amounts>=0&finitos | PASS | - |  |
| [B P21@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P21@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P21@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P21@15000] rango_factible | PASS | - |  |
| [B P21@15000] score[0,100] | PASS | - | score=90 |
| [B P21@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P21@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P21@15000] wants[10,80] | PASS | - | wants_int=45.67 |
| [B P22@500] HTTP200 | PASS | - |  |
| [B P22@500] amounts>=0&finitos | PASS | - |  |
| [B P22@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P22@500] rango_factible | PASS | - |  |
| [B P22@500] score[0,100] | PASS | - | score=100 |
| [B P22@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P22@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P22@700] HTTP200 | PASS | - |  |
| [B P22@700] amounts>=0&finitos | PASS | - |  |
| [B P22@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P22@700] rango_factible | PASS | - |  |
| [B P22@700] score[0,100] | PASS | - | score=100 |
| [B P22@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P22@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P22@900] HTTP200 | PASS | - |  |
| [B P22@900] amounts>=0&finitos | PASS | - |  |
| [B P22@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P22@900] rango_factible | PASS | - |  |
| [B P22@900] score[0,100] | PASS | - | score=100 |
| [B P22@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P22@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P22@1000] HTTP200 | PASS | - |  |
| [B P22@1000] amounts>=0&finitos | PASS | - |  |
| [B P22@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P22@1000] rango_factible | PASS | - |  |
| [B P22@1000] score[0,100] | PASS | - | score=100 |
| [B P22@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P22@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P22@1200] HTTP200 | PASS | - |  |
| [B P22@1200] amounts>=0&finitos | PASS | - |  |
| [B P22@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P22@1200] rango_factible | PASS | - |  |
| [B P22@1200] score[0,100] | PASS | - | score=100 |
| [B P22@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P22@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P22@1500] HTTP200 | PASS | - |  |
| [B P22@1500] amounts>=0&finitos | PASS | - |  |
| [B P22@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P22@1500] rango_factible | PASS | - |  |
| [B P22@1500] score[0,100] | PASS | - | score=100 |
| [B P22@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P22@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@1500] wants[10,80] | PASS | - | wants_int=10.04 |
| [B P22@1800] HTTP200 | PASS | - |  |
| [B P22@1800] amounts>=0&finitos | PASS | - |  |
| [B P22@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P22@1800] rango_factible | PASS | - |  |
| [B P22@1800] score[0,100] | PASS | - | score=100 |
| [B P22@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P22@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@1800] wants[10,80] | PASS | - | wants_int=12.34 |
| [B P22@2000] HTTP200 | PASS | - |  |
| [B P22@2000] amounts>=0&finitos | PASS | - |  |
| [B P22@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@2000] Samounts~effIncome | PASS | - | S=2000.00 eff=2000 |
| [B P22@2000] rango_factible | PASS | - |  |
| [B P22@2000] score[0,100] | PASS | - | score=100 |
| [B P22@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P22@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@2000] wants[10,80] | PASS | - | wants_int=13.50 |
| [B P22@2500] HTTP200 | PASS | - |  |
| [B P22@2500] amounts>=0&finitos | PASS | - |  |
| [B P22@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P22@2500] rango_factible | PASS | - |  |
| [B P22@2500] score[0,100] | PASS | - | score=100 |
| [B P22@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P22@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@2500] wants[10,80] | PASS | - | wants_int=20.60 |
| [B P22@3000] HTTP200 | PASS | - |  |
| [B P22@3000] amounts>=0&finitos | PASS | - |  |
| [B P22@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P22@3000] rango_factible | PASS | - |  |
| [B P22@3000] score[0,100] | PASS | - | score=100 |
| [B P22@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P22@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@3000] wants[10,80] | PASS | - | wants_int=25.42 |
| [B P22@3500] HTTP200 | PASS | - |  |
| [B P22@3500] amounts>=0&finitos | PASS | - |  |
| [B P22@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@3500] Samounts~effIncome | PASS | - | S=3500.00 eff=3500 |
| [B P22@3500] rango_factible | PASS | - |  |
| [B P22@3500] score[0,100] | PASS | - | score=100 |
| [B P22@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P22@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@3500] wants[10,80] | PASS | - | wants_int=28.92 |
| [B P22@4000] HTTP200 | PASS | - |  |
| [B P22@4000] amounts>=0&finitos | PASS | - |  |
| [B P22@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@4000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P22@4000] rango_factible | PASS | - |  |
| [B P22@4000] score[0,100] | PASS | - | score=95 |
| [B P22@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P22@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@4000] wants[10,80] | PASS | - | wants_int=31.58 |
| [B P22@5000] HTTP200 | PASS | - |  |
| [B P22@5000] amounts>=0&finitos | PASS | - |  |
| [B P22@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@5000] Samounts~effIncome | PASS | - | S=5000.03 eff=5000 |
| [B P22@5000] rango_factible | PASS | - |  |
| [B P22@5000] score[0,100] | PASS | - | score=95 |
| [B P22@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P22@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@5000] wants[10,80] | PASS | - | wants_int=35.37 |
| [B P22@7000] HTTP200 | PASS | - |  |
| [B P22@7000] amounts>=0&finitos | PASS | - |  |
| [B P22@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@7000] Samounts~effIncome | PASS | - | S=7000.01 eff=7000 |
| [B P22@7000] rango_factible | PASS | - |  |
| [B P22@7000] score[0,100] | PASS | - | score=90 |
| [B P22@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P22@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@7000] wants[10,80] | PASS | - | wants_int=39.81 |
| [B P22@10000] HTTP200 | PASS | - |  |
| [B P22@10000] amounts>=0&finitos | PASS | - |  |
| [B P22@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P22@10000] rango_factible | PASS | - |  |
| [B P22@10000] score[0,100] | PASS | - | score=90 |
| [B P22@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P22@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@10000] wants[10,80] | PASS | - | wants_int=43.26 |
| [B P22@15000] HTTP200 | PASS | - |  |
| [B P22@15000] amounts>=0&finitos | PASS | - |  |
| [B P22@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P22@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P22@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P22@15000] rango_factible | PASS | - |  |
| [B P22@15000] score[0,100] | PASS | - | score=90 |
| [B P22@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P22@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P22@15000] wants[10,80] | PASS | - | wants_int=45.67 |
| [B P23@500] HTTP200 | PASS | - |  |
| [B P23@500] amounts>=0&finitos | PASS | - |  |
| [B P23@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P23@500] rango_factible | PASS | - |  |
| [B P23@500] score[0,100] | PASS | - | score=100 |
| [B P23@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P23@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@700] HTTP200 | PASS | - |  |
| [B P23@700] amounts>=0&finitos | PASS | - |  |
| [B P23@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P23@700] rango_factible | PASS | - |  |
| [B P23@700] score[0,100] | PASS | - | score=100 |
| [B P23@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P23@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@900] HTTP200 | PASS | - |  |
| [B P23@900] amounts>=0&finitos | PASS | - |  |
| [B P23@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P23@900] rango_factible | PASS | - |  |
| [B P23@900] score[0,100] | PASS | - | score=100 |
| [B P23@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P23@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@1000] HTTP200 | PASS | - |  |
| [B P23@1000] amounts>=0&finitos | PASS | - |  |
| [B P23@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P23@1000] rango_factible | PASS | - |  |
| [B P23@1000] score[0,100] | PASS | - | score=100 |
| [B P23@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P23@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@1200] HTTP200 | PASS | - |  |
| [B P23@1200] amounts>=0&finitos | PASS | - |  |
| [B P23@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P23@1200] rango_factible | PASS | - |  |
| [B P23@1200] score[0,100] | PASS | - | score=100 |
| [B P23@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P23@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@1500] HTTP200 | PASS | - |  |
| [B P23@1500] amounts>=0&finitos | PASS | - |  |
| [B P23@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P23@1500] rango_factible | PASS | - |  |
| [B P23@1500] score[0,100] | PASS | - | score=100 |
| [B P23@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P23@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@1800] HTTP200 | PASS | - |  |
| [B P23@1800] amounts>=0&finitos | PASS | - |  |
| [B P23@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P23@1800] rango_factible | PASS | - |  |
| [B P23@1800] score[0,100] | PASS | - | score=100 |
| [B P23@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P23@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@2000] HTTP200 | PASS | - |  |
| [B P23@2000] amounts>=0&finitos | PASS | - |  |
| [B P23@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P23@2000] rango_factible | PASS | - |  |
| [B P23@2000] score[0,100] | PASS | - | score=100 |
| [B P23@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P23@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@2500] HTTP200 | PASS | - |  |
| [B P23@2500] amounts>=0&finitos | PASS | - |  |
| [B P23@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P23@2500] rango_factible | PASS | - |  |
| [B P23@2500] score[0,100] | PASS | - | score=100 |
| [B P23@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P23@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P23@3000] HTTP200 | PASS | - |  |
| [B P23@3000] amounts>=0&finitos | PASS | - |  |
| [B P23@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@3000] Samounts~effIncome | PASS | - | S=2999.99 eff=3000 |
| [B P23@3000] rango_factible | PASS | - |  |
| [B P23@3000] score[0,100] | PASS | - | score=100 |
| [B P23@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P23@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@3000] wants[10,80] | PASS | - | wants_int=12.72 |
| [B P23@3500] HTTP200 | PASS | - |  |
| [B P23@3500] amounts>=0&finitos | PASS | - |  |
| [B P23@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@3500] Samounts~effIncome | PASS | - | S=3500.03 eff=3500 |
| [B P23@3500] rango_factible | PASS | - |  |
| [B P23@3500] score[0,100] | PASS | - | score=100 |
| [B P23@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P23@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@3500] wants[10,80] | PASS | - | wants_int=17.53 |
| [B P23@4000] HTTP200 | PASS | - |  |
| [B P23@4000] amounts>=0&finitos | PASS | - |  |
| [B P23@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@4000] Samounts~effIncome | PASS | - | S=4000.01 eff=4000 |
| [B P23@4000] rango_factible | PASS | - |  |
| [B P23@4000] score[0,100] | PASS | - | score=100 |
| [B P23@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P23@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@4000] wants[10,80] | PASS | - | wants_int=21.22 |
| [B P23@5000] HTTP200 | PASS | - |  |
| [B P23@5000] amounts>=0&finitos | PASS | - |  |
| [B P23@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@5000] Samounts~effIncome | PASS | - | S=5000.00 eff=5000 |
| [B P23@5000] rango_factible | PASS | - |  |
| [B P23@5000] score[0,100] | PASS | - | score=100 |
| [B P23@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P23@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@5000] wants[10,80] | PASS | - | wants_int=26.51 |
| [B P23@7000] HTTP200 | PASS | - |  |
| [B P23@7000] amounts>=0&finitos | PASS | - |  |
| [B P23@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@7000] Samounts~effIncome | PASS | - | S=6999.99 eff=7000 |
| [B P23@7000] rango_factible | PASS | - |  |
| [B P23@7000] score[0,100] | PASS | - | score=95 |
| [B P23@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P23@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@7000] wants[10,80] | PASS | - | wants_int=32.80 |
| [B P23@10000] HTTP200 | PASS | - |  |
| [B P23@10000] amounts>=0&finitos | PASS | - |  |
| [B P23@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@10000] Samounts~effIncome | PASS | - | S=10000.01 eff=10000 |
| [B P23@10000] rango_factible | PASS | - |  |
| [B P23@10000] score[0,100] | PASS | - | score=95 |
| [B P23@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P23@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@10000] wants[10,80] | PASS | - | wants_int=37.76 |
| [B P23@15000] HTTP200 | PASS | - |  |
| [B P23@15000] amounts>=0&finitos | PASS | - |  |
| [B P23@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P23@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P23@15000] Samounts~effIncome | PASS | - | S=14999.99 eff=15000 |
| [B P23@15000] rango_factible | PASS | - |  |
| [B P23@15000] score[0,100] | PASS | - | score=90 |
| [B P23@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P23@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P23@15000] wants[10,80] | PASS | - | wants_int=41.49 |
| [B P24@500] HTTP200 | PASS | - |  |
| [B P24@500] amounts>=0&finitos | PASS | - |  |
| [B P24@500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P24@500] rango_factible | PASS | - |  |
| [B P24@500] score[0,100] | PASS | - | score=100 |
| [B P24@500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P24@500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@700] HTTP200 | PASS | - |  |
| [B P24@700] amounts>=0&finitos | PASS | - |  |
| [B P24@700] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@700] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@700] Samounts~effIncome | PASS | - | S=700.00 eff=700 |
| [B P24@700] rango_factible | PASS | - |  |
| [B P24@700] score[0,100] | PASS | - | score=100 |
| [B P24@700] effectiveIncome | PASS | - | eff=700 exp=700 |
| [B P24@700] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@700] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@900] HTTP200 | PASS | - |  |
| [B P24@900] amounts>=0&finitos | PASS | - |  |
| [B P24@900] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@900] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@900] Samounts~effIncome | PASS | - | S=900.00 eff=900 |
| [B P24@900] rango_factible | PASS | - |  |
| [B P24@900] score[0,100] | PASS | - | score=100 |
| [B P24@900] effectiveIncome | PASS | - | eff=900 exp=900 |
| [B P24@900] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@900] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@1000] HTTP200 | PASS | - |  |
| [B P24@1000] amounts>=0&finitos | PASS | - |  |
| [B P24@1000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@1000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@1000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P24@1000] rango_factible | PASS | - |  |
| [B P24@1000] score[0,100] | PASS | - | score=100 |
| [B P24@1000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P24@1000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@1200] HTTP200 | PASS | - |  |
| [B P24@1200] amounts>=0&finitos | PASS | - |  |
| [B P24@1200] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@1200] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@1200] Samounts~effIncome | PASS | - | S=1200.00 eff=1200 |
| [B P24@1200] rango_factible | PASS | - |  |
| [B P24@1200] score[0,100] | PASS | - | score=100 |
| [B P24@1200] effectiveIncome | PASS | - | eff=1200 exp=1200 |
| [B P24@1200] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@1200] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@1500] HTTP200 | PASS | - |  |
| [B P24@1500] amounts>=0&finitos | PASS | - |  |
| [B P24@1500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@1500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@1500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P24@1500] rango_factible | PASS | - |  |
| [B P24@1500] score[0,100] | PASS | - | score=100 |
| [B P24@1500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P24@1500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@1500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@1800] HTTP200 | PASS | - |  |
| [B P24@1800] amounts>=0&finitos | PASS | - |  |
| [B P24@1800] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@1800] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@1800] Samounts~effIncome | PASS | - | S=1800.00 eff=1800 |
| [B P24@1800] rango_factible | PASS | - |  |
| [B P24@1800] score[0,100] | PASS | - | score=100 |
| [B P24@1800] effectiveIncome | PASS | - | eff=1800 exp=1800 |
| [B P24@1800] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@1800] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@2000] HTTP200 | PASS | - |  |
| [B P24@2000] amounts>=0&finitos | PASS | - |  |
| [B P24@2000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@2000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@2000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P24@2000] rango_factible | PASS | - |  |
| [B P24@2000] score[0,100] | PASS | - | score=100 |
| [B P24@2000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P24@2000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@2500] HTTP200 | PASS | - |  |
| [B P24@2500] amounts>=0&finitos | PASS | - |  |
| [B P24@2500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@2500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@2500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P24@2500] rango_factible | PASS | - |  |
| [B P24@2500] score[0,100] | PASS | - | score=100 |
| [B P24@2500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P24@2500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@3000] HTTP200 | PASS | - |  |
| [B P24@3000] amounts>=0&finitos | PASS | - |  |
| [B P24@3000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@3000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@3000] Samounts~effIncome | PASS | - | S=3000.01 eff=3000 |
| [B P24@3000] rango_factible | PASS | - |  |
| [B P24@3000] score[0,100] | PASS | - | score=100 |
| [B P24@3000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P24@3000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@3000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@3500] HTTP200 | PASS | - |  |
| [B P24@3500] amounts>=0&finitos | PASS | - |  |
| [B P24@3500] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@3500] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@3500] Samounts~effIncome | PASS | - | S=3499.98 eff=3500 |
| [B P24@3500] rango_factible | PASS | - |  |
| [B P24@3500] score[0,100] | PASS | - | score=100 |
| [B P24@3500] effectiveIncome | PASS | - | eff=3500 exp=3500 |
| [B P24@3500] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@4000] HTTP200 | PASS | - |  |
| [B P24@4000] amounts>=0&finitos | PASS | - |  |
| [B P24@4000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@4000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@4000] Samounts~effIncome | PASS | - | S=3999.99 eff=4000 |
| [B P24@4000] rango_factible | PASS | - |  |
| [B P24@4000] score[0,100] | PASS | - | score=100 |
| [B P24@4000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P24@4000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@4000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@5000] HTTP200 | PASS | - |  |
| [B P24@5000] amounts>=0&finitos | PASS | - |  |
| [B P24@5000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@5000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@5000] Samounts~effIncome | PASS | - | S=5000.01 eff=5000 |
| [B P24@5000] rango_factible | PASS | - |  |
| [B P24@5000] score[0,100] | PASS | - | score=100 |
| [B P24@5000] effectiveIncome | PASS | - | eff=5000 exp=5000 |
| [B P24@5000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@5000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P24@7000] HTTP200 | PASS | - |  |
| [B P24@7000] amounts>=0&finitos | PASS | - |  |
| [B P24@7000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@7000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@7000] Samounts~effIncome | PASS | - | S=6999.97 eff=7000 |
| [B P24@7000] rango_factible | PASS | - |  |
| [B P24@7000] score[0,100] | PASS | - | score=100 |
| [B P24@7000] effectiveIncome | PASS | - | eff=7000 exp=7000 |
| [B P24@7000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@7000] wants[10,80] | PASS | - | wants_int=17.76 |
| [B P24@10000] HTTP200 | PASS | - |  |
| [B P24@10000] amounts>=0&finitos | PASS | - |  |
| [B P24@10000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@10000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@10000] Samounts~effIncome | PASS | - | S=9999.98 eff=10000 |
| [B P24@10000] rango_factible | PASS | - |  |
| [B P24@10000] score[0,100] | PASS | - | score=100 |
| [B P24@10000] effectiveIncome | PASS | - | eff=10000 exp=10000 |
| [B P24@10000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@10000] wants[10,80] | PASS | - | wants_int=26.27 |
| [B P24@15000] HTTP200 | PASS | - |  |
| [B P24@15000] amounts>=0&finitos | PASS | - |  |
| [B P24@15000] totalCheck+deuda~100 | PASS | - | tc=100 +debt=0.00=100.00 |
| [B P24@15000] blocks~totalCheck | PASS | - | bsum=100.00 tc=100 |
| [B P24@15000] Samounts~effIncome | PASS | - | S=15000.02 eff=15000 |
| [B P24@15000] rango_factible | PASS | - |  |
| [B P24@15000] score[0,100] | PASS | - | score=95 |
| [B P24@15000] effectiveIncome | PASS | - | eff=15000 exp=15000 |
| [B P24@15000] debt_extra=0 | PASS | - | debt_extra=0 |
| [B P24@15000] wants[10,80] | PASS | - | wants_int=33.33 |
| [B P25@500] HTTP200 | PASS | - |  |
| [B P25@500] amounts>=0&finitos | PASS | - |  |
| [B P25@500] totalCheck+deuda~100 | FAIL | CRITICO | tc=40 +debt=200.00=240.00 |
| [B P25@500] blocks~totalCheck | PASS | - | bsum=40.00 tc=40 |
| [B P25@500] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P25@500] rango_factible | PASS | - |  |
| [B P25@500] score[0,100] | PASS | - | score=55 |
| [B P25@500] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P25@500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@700] HTTP200 | PASS | - |  |
| [B P25@700] amounts>=0&finitos | PASS | - |  |
| [B P25@700] totalCheck+deuda~100 | FAIL | CRITICO | tc=28.57 +debt=142.86=171.43 |
| [B P25@700] blocks~totalCheck | PASS | - | bsum=28.58 tc=28.57 |
| [B P25@700] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P25@700] rango_factible | PASS | - |  |
| [B P25@700] score[0,100] | PASS | - | score=55 |
| [B P25@700] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P25@700] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P25@900] HTTP200 | PASS | - |  |
| [B P25@900] amounts>=0&finitos | PASS | - |  |
| [B P25@900] totalCheck+deuda~100 | FAIL | CRITICO | tc=22.22 +debt=111.11=133.33 |
| [B P25@900] blocks~totalCheck | PASS | - | bsum=22.22 tc=22.22 |
| [B P25@900] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P25@900] rango_factible | PASS | - |  |
| [B P25@900] score[0,100] | PASS | - | score=55 |
| [B P25@900] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P25@900] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P25@1000] HTTP200 | PASS | - |  |
| [B P25@1000] amounts>=0&finitos | PASS | - |  |
| [B P25@1000] totalCheck+deuda~100 | FAIL | CRITICO | tc=20 +debt=100.00=120.00 |
| [B P25@1000] blocks~totalCheck | PASS | - | bsum=20.00 tc=20 |
| [B P25@1000] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P25@1000] rango_factible | PASS | - |  |
| [B P25@1000] score[0,100] | PASS | - | score=55 |
| [B P25@1000] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P25@1000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@1200] HTTP200 | PASS | - |  |
| [B P25@1200] amounts>=0&finitos | PASS | - |  |
| [B P25@1200] totalCheck+deuda~100 | PASS | - | tc=16.67 +debt=83.33=100.00 |
| [B P25@1200] blocks~totalCheck | PASS | - | bsum=16.67 tc=16.67 |
| [B P25@1200] Samounts~effIncome | PASS | - | S=200.01 eff=200 |
| [B P25@1200] rango_factible | PASS | - |  |
| [B P25@1200] score[0,100] | PASS | - | score=70 |
| [B P25@1200] effectiveIncome | PASS | - | eff=200 exp=200 |
| [B P25@1200] wants[10,80] | PASS | - | wants_int=10.02 |
| [B P25@1500] HTTP200 | PASS | - |  |
| [B P25@1500] amounts>=0&finitos | PASS | - |  |
| [B P25@1500] totalCheck+deuda~100 | PASS | - | tc=33.33 +debt=66.67=100.00 |
| [B P25@1500] blocks~totalCheck | PASS | - | bsum=33.33 tc=33.33 |
| [B P25@1500] Samounts~effIncome | PASS | - | S=500.00 eff=500 |
| [B P25@1500] rango_factible | PASS | - |  |
| [B P25@1500] score[0,100] | PASS | - | score=70 |
| [B P25@1500] effectiveIncome | PASS | - | eff=500 exp=500 |
| [B P25@1500] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P25@1800] HTTP200 | PASS | - |  |
| [B P25@1800] amounts>=0&finitos | PASS | - |  |
| [B P25@1800] totalCheck+deuda~100 | PASS | - | tc=44.44 +debt=55.56=100.00 |
| [B P25@1800] blocks~totalCheck | PASS | - | bsum=44.44 tc=44.44 |
| [B P25@1800] Samounts~effIncome | PASS | - | S=800.00 eff=800 |
| [B P25@1800] rango_factible | PASS | - |  |
| [B P25@1800] score[0,100] | PASS | - | score=70 |
| [B P25@1800] effectiveIncome | PASS | - | eff=800 exp=800 |
| [B P25@1800] wants[10,80] | PASS | - | wants_int=9.99 |
| [B P25@2000] HTTP200 | PASS | - |  |
| [B P25@2000] amounts>=0&finitos | PASS | - |  |
| [B P25@2000] totalCheck+deuda~100 | PASS | - | tc=50 +debt=50.00=100.00 |
| [B P25@2000] blocks~totalCheck | PASS | - | bsum=50.00 tc=50 |
| [B P25@2000] Samounts~effIncome | PASS | - | S=999.99 eff=1000 |
| [B P25@2000] rango_factible | PASS | - |  |
| [B P25@2000] score[0,100] | PASS | - | score=70 |
| [B P25@2000] effectiveIncome | PASS | - | eff=1000 exp=1000 |
| [B P25@2000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@2500] HTTP200 | PASS | - |  |
| [B P25@2500] amounts>=0&finitos | PASS | - |  |
| [B P25@2500] totalCheck+deuda~100 | PASS | - | tc=60 +debt=40.00=100.00 |
| [B P25@2500] blocks~totalCheck | PASS | - | bsum=60.00 tc=60 |
| [B P25@2500] Samounts~effIncome | PASS | - | S=1499.99 eff=1500 |
| [B P25@2500] rango_factible | PASS | - |  |
| [B P25@2500] score[0,100] | PASS | - | score=70 |
| [B P25@2500] effectiveIncome | PASS | - | eff=1500 exp=1500 |
| [B P25@2500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@3000] HTTP200 | PASS | - |  |
| [B P25@3000] amounts>=0&finitos | PASS | - |  |
| [B P25@3000] totalCheck+deuda~100 | PASS | - | tc=66.67 +debt=33.33=100.00 |
| [B P25@3000] blocks~totalCheck | PASS | - | bsum=66.67 tc=66.67 |
| [B P25@3000] Samounts~effIncome | PASS | - | S=1999.98 eff=2000 |
| [B P25@3000] rango_factible | PASS | - |  |
| [B P25@3000] score[0,100] | PASS | - | score=70 |
| [B P25@3000] effectiveIncome | PASS | - | eff=2000 exp=2000 |
| [B P25@3000] wants[10,80] | PASS | - | wants_int=10.01 |
| [B P25@3500] HTTP200 | PASS | - |  |
| [B P25@3500] amounts>=0&finitos | PASS | - |  |
| [B P25@3500] totalCheck+deuda~100 | PASS | - | tc=71.43 +debt=28.57=100.00 |
| [B P25@3500] blocks~totalCheck | PASS | - | bsum=71.43 tc=71.43 |
| [B P25@3500] Samounts~effIncome | PASS | - | S=2499.99 eff=2500 |
| [B P25@3500] rango_factible | PASS | - |  |
| [B P25@3500] score[0,100] | PASS | - | score=90 |
| [B P25@3500] effectiveIncome | PASS | - | eff=2500 exp=2500 |
| [B P25@3500] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@4000] HTTP200 | PASS | - |  |
| [B P25@4000] amounts>=0&finitos | PASS | - |  |
| [B P25@4000] totalCheck+deuda~100 | PASS | - | tc=75 +debt=25.00=100.00 |
| [B P25@4000] blocks~totalCheck | PASS | - | bsum=75.00 tc=75 |
| [B P25@4000] Samounts~effIncome | PASS | - | S=3000.00 eff=3000 |
| [B P25@4000] rango_factible | PASS | - |  |
| [B P25@4000] score[0,100] | PASS | - | score=100 |
| [B P25@4000] effectiveIncome | PASS | - | eff=3000 exp=3000 |
| [B P25@4000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@5000] HTTP200 | PASS | - |  |
| [B P25@5000] amounts>=0&finitos | PASS | - |  |
| [B P25@5000] totalCheck+deuda~100 | PASS | - | tc=80 +debt=20.00=100.00 |
| [B P25@5000] blocks~totalCheck | PASS | - | bsum=80.00 tc=80 |
| [B P25@5000] Samounts~effIncome | PASS | - | S=3999.98 eff=4000 |
| [B P25@5000] rango_factible | PASS | - |  |
| [B P25@5000] score[0,100] | PASS | - | score=100 |
| [B P25@5000] effectiveIncome | PASS | - | eff=4000 exp=4000 |
| [B P25@5000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@7000] HTTP200 | PASS | - |  |
| [B P25@7000] amounts>=0&finitos | PASS | - |  |
| [B P25@7000] totalCheck+deuda~100 | PASS | - | tc=85.71 +debt=14.29=100.00 |
| [B P25@7000] blocks~totalCheck | PASS | - | bsum=85.71 tc=85.71 |
| [B P25@7000] Samounts~effIncome | PASS | - | S=6000.02 eff=6000 |
| [B P25@7000] rango_factible | PASS | - |  |
| [B P25@7000] score[0,100] | PASS | - | score=100 |
| [B P25@7000] effectiveIncome | PASS | - | eff=6000 exp=6000 |
| [B P25@7000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@10000] HTTP200 | PASS | - |  |
| [B P25@10000] amounts>=0&finitos | PASS | - |  |
| [B P25@10000] totalCheck+deuda~100 | PASS | - | tc=90 +debt=10.00=100.00 |
| [B P25@10000] blocks~totalCheck | PASS | - | bsum=90.00 tc=90 |
| [B P25@10000] Samounts~effIncome | PASS | - | S=9000.03 eff=9000 |
| [B P25@10000] rango_factible | PASS | - |  |
| [B P25@10000] score[0,100] | PASS | - | score=97 |
| [B P25@10000] effectiveIncome | PASS | - | eff=9000 exp=9000 |
| [B P25@10000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B P25@15000] HTTP200 | PASS | - |  |
| [B P25@15000] amounts>=0&finitos | PASS | - |  |
| [B P25@15000] totalCheck+deuda~100 | PASS | - | tc=93.33 +debt=6.67=100.00 |
| [B P25@15000] blocks~totalCheck | PASS | - | bsum=93.33 tc=93.33 |
| [B P25@15000] Samounts~effIncome | PASS | - | S=14000.00 eff=14000 |
| [B P25@15000] rango_factible | PASS | - |  |
| [B P25@15000] score[0,100] | PASS | - | score=90 |
| [B P25@15000] effectiveIncome | PASS | - | eff=14000 exp=14000 |
| [B P25@15000] wants[10,80] | PASS | - | wants_int=10.00 |
| [B2 P01@(1499, 1500, 1501)] continuidad | PASS | - | Dsc=0 Dn=0.02 Ds=0.00 |
| [B2 P01@(3999, 4000, 4001)] continuidad | PASS | - | Dsc=0 Dn=0.01 Ds=0.00 |
| [B2 P07@(1499, 1500, 1501)] continuidad | PASS | - | Dsc=0 Dn=0.00 Ds=0.00 |
| [B2 P07@(3999, 4000, 4001)] continuidad | PASS | - | Dsc=0 Dn=0.01 Ds=0.00 |
| [B2 P17@(1499, 1500, 1501)] continuidad | PASS | - | Dsc=0 Dn=0.00 Ds=0.04 |
| [B2 P17@(3999, 4000, 4001)] continuidad | PASS | - | Dsc=0 Dn=0.01 Ds=0.01 |
| [B2 P23@(1499, 1500, 1501)] continuidad | PASS | - | Dsc=0 Dn=0.02 Ds=0.02 |
| [B2 P23@(3999, 4000, 4001)] continuidad | PASS | - | Dsc=0 Dn=0.02 Ds=0.00 |
| [C01 P01] HTTP200 | PASS | - |  |
| [C01 P01] req>=Sspec | PASS | - | req=2001 Sspec=700 |
| [C01 P01] req<1M | PASS | - | req=2001 |
| [C01 P01] amounts_ok | PASS | - |  |
| [C01 P01] Shealthy~req-debt | PASS | - | S=2001.02 tgt=2001.00 |
| [C01 P01] importes_fijados | PASS | - |  |
| [C02 P01] HTTP200 | PASS | - |  |
| [C02 P01] req>=Sspec | PASS | - | req=2679 Sspec=1050 |
| [C02 P01] req<1M | PASS | - | req=2679 |
| [C02 P01] amounts_ok | PASS | - |  |
| [C02 P01] Shealthy~req-debt | PASS | - | S=2679.01 tgt=2679.00 |
| [C02 P01] importes_fijados | PASS | - |  |
| [C03 P07] HTTP200 | PASS | - |  |
| [C03 P07] req>=Sspec | PASS | - | req=3118 Sspec=1900 |
| [C03 P07] req<1M | PASS | - | req=3118 |
| [C03 P07] amounts_ok | PASS | - |  |
| [C03 P07] Shealthy~req-debt | PASS | - | S=3117.99 tgt=3118.00 |
| [C03 P07] importes_fijados | PASS | - |  |
| [C04 P01] HTTP200 | PASS | - |  |
| [C04 P01] req>=Sspec | PASS | - | req=8573 Sspec=7000 |
| [C04 P01] req<1M | PASS | - | req=8573 |
| [C04 P01] amounts_ok | PASS | - |  |
| [C04 P01] Shealthy~req-debt | PASS | - | S=8572.99 tgt=8573.00 |
| [C04 P01] importes_fijados | PASS | - |  |
| [C05 P25] HTTP200 | PASS | - |  |
| [C05 P25] req>=Sspec | PASS | - | req=7073 Sspec=2700 |
| [C05 P25] req<1M | PASS | - | req=7073 |
| [C05 P25] amounts_ok | PASS | - |  |
| [C05 P25] Shealthy~req-debt | PASS | - | S=6073.01 tgt=6073.00 |
| [C05 P25] importes_fijados | PASS | - |  |
| [C06 P16] HTTP200 | PASS | - |  |
| [C06 P16] req>=Sspec | PASS | - | req=2785 Sspec=1200 |
| [C06 P16] req<1M | PASS | - | req=2785 |
| [C06 P16] amounts_ok | PASS | - |  |
| [C06 P16] Shealthy~req-debt | PASS | - | S=2485.00 tgt=2485.00 |
| [C06 P16] importes_fijados | PASS | - |  |
| [C07 P01] HTTP200 | PASS | - |  |
| [C07 P01] warning_vacio | PASS | - | warnings=['No has especificado ningún importe. El ingreso mostrado es el mínimo absoluto para una distribución financieramente saludable con tu perfil, pero no representa una situación ideal ni sosten |
| [C07 P01] req>=Sspec | PASS | - | req=891 Sspec=0 |
| [C07 P01] req<1M | PASS | - | req=891 |
| [C07 P01] amounts_ok | PASS | - |  |
| [C07 P01] Shealthy~req-debt | PASS | - | S=890.99 tgt=891.00 |
| [C07 P01] importes_fijados | PASS | - |  |
| [C08 P05] HTTP200 | PASS | - |  |
| [C08 P05] requiresConfirmation | PASS | - | feasible=False rc=True |
| [C09 P05] HTTP200 | PASS | - |  |
| [C09 P05] force_ok | PASS | - | feasible=True |
| [C09 P05] req>=Sspec | PASS | - | req=16668 Sspec=700 |
| [C09 P05] req<1M | PASS | - | req=16668 |
| [C09 P05] amounts_ok | PASS | - |  |
| [C09 P05] Shealthy~req-debt | PASS | - | S=16668.01 tgt=16668.00 |
| [C09 P05] importes_fijados | PASS | - |  |
| [C10 P01] HTTP200 | PASS | - |  |
| [C10 P01] req>=Sspec | PASS | - | req=1426 Sspec=500 |
| [C10 P01] req<1M | PASS | - | req=1426 |
| [C10 P01] amounts_ok | PASS | - |  |
| [C10 P01] Shealthy~req-debt | PASS | - | S=1426.00 tgt=1426.00 |
| [C10 P01] importes_fijados | PASS | - |  |
| [C11 P14] HTTP200 | PASS | - |  |
| [C11 P14] valido | PASS | - | rc=None |
| [C11 P14] req>=Sspec | PASS | - | req=10715 Sspec=600 |
| [C11 P14] req<1M | PASS | - | req=10715 |
| [C11 P14] amounts_ok | PASS | - |  |
| [C11 P14] Shealthy~req-debt | PASS | - | S=10715.01 tgt=10715.00 |
| [C11 P14] importes_fijados | PASS | - |  |
| [D01 P01@2000] score>=85 | PASS | - | score=100 |
| [D01 P01@2000] sinNaN | PASS | - |  |
| [D01 P07@3000] score>=85 | PASS | - | score=100 |
| [D01 P07@3000] sinNaN | PASS | - |  |
| [D01 P17@2500] score>=85 | PASS | - | score=100 |
| [D01 P17@2500] sinNaN | PASS | - |  |
| [D02-45pct] alerta_housing | PASS | - | alerts=['housing', '_savings_block'] |
| [D02-45pct] score<75 | PASS | - | score=48 |
| [D03-65pct] alerta_housing | PASS | - | alerts=['housing', '_savings_block'] |
| [D03-65pct] score<75 | PASS | - | score=48 |
| [D04-50pct] sinNaN | PASS | - |  |
| [D05-150pct] sinNaN | PASS | - |  |
| [E02] req~2000(+-20pct) | PASS | - | req=1923 |
| [E03] housing~700(+-15pct) | FAIL | MEDIO | housing=500.10 req=2001 |
| [F01] income500_no500 | PASS | - | status 200 |
| [F02] income500_P08_no500 | PASS | - | status 200 |
| [F03] income0_400 | PASS | - | status 400 |
| [F04] inverso_vacio_warning | PASS | - | status 200 |
| [F05] owned_requiresConfirmation | PASS | - | rc=True |
| [F06] _debt_block | PASS | - | alerts=['groceries', '_debt_block'] |
| [F07] deuda>income_graceful | PASS | - | eff=200 nan=0 |
| [F08] housing50000_ok | PASS | - | feasible=True req=142858 |
| [F09] perfil_minimo_no500 | PASS | - | status 200 |
| [F10] income15000_valido | PASS | - | score=90 |
