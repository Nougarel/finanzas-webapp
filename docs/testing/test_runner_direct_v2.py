#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, os, sys, time, math, urllib.request, urllib.error
from datetime import datetime

BASE_URL = "http://localhost:3000"
TIMEOUT = 15
REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "direct-v2-report.md")

INCOMES = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
           1100, 1200, 1500, 1800, 2000, 2500, 3000, 3500, 4000,
           5000, 7000, 10000, 15000, 20000, 25000, 50000, 100000]


def base_profile(**over):
    p = {
        "ageRange": "under35", "housingStatus": "rent", "geographicZone": "standard",
        "employmentStatus": "permanent", "dependents": 0, "hasPartner": False,
        "partnerHasIncome": False, "vehicleStatus": "none", "privateHealthInsurance": "none",
        "ownEducation": "none", "emergencyFundStatus": "complete", "housingPurchaseGoal": False,
        "pensionRegime": "social_security", "consumerDebt": "none", "monthlyDebtPayment": 0,
        "childrenAtUniversity": 0, "childrenStudyingAway": 0
    }
    p.update(over)
    return p


PROFILES = {
    "P01": base_profile(),
    "P02": base_profile(geographicZone="expensive_city"),
    "P03": base_profile(geographicZone="rural"),
    "P04": base_profile(housingStatus="mortgage"),
    "P05": base_profile(housingStatus="owned"),
    "P06": base_profile(housingStatus="family"),
    "P07": base_profile(ageRange="35to50", housingStatus="mortgage", hasPartner=True,
                        partnerHasIncome=True, dependents=3),
    "P08": base_profile(ageRange="35to50", dependents=4, hasPartner=True, partnerHasIncome=False),
    "P09": base_profile(ageRange="35to50", employmentStatus="freelance",
                        geographicZone="expensive_city", pensionRegime="mutual"),
    "P10": base_profile(ageRange="over50", housingStatus="owned"),
    "P11": base_profile(ageRange="over50", housingStatus="mortgage", geographicZone="rural"),
    "P12": base_profile(ageRange="over50", employmentStatus="retired", pensionRegime="none"),
    "P13": base_profile(employmentStatus="temporary"),
    "P14": base_profile(employmentStatus="unemployed", housingStatus="family"),
    "P15": base_profile(consumerDebt="low", monthlyDebtPayment=100),
    "P16": base_profile(ageRange="35to50", housingStatus="mortgage",
                        consumerDebt="medium", monthlyDebtPayment=300),
    "P17": base_profile(ageRange="35to50", consumerDebt="high", monthlyDebtPayment=600),
    "P18": base_profile(consumerDebt="high", monthlyDebtPayment=1000),
    "P19": base_profile(emergencyFundStatus="none"),
    "P20": base_profile(emergencyFundStatus="building"),
    "P21": base_profile(emergencyFundStatus="partial"),
    "P22": base_profile(housingPurchaseGoal=True),
    "P23": base_profile(privateHealthInsurance="complete", vehicleStatus="financed",
                        ownEducation="formal"),
    "P24": base_profile(ageRange="35to50", dependents=3, hasPartner=True,
                        childrenAtUniversity=2, childrenStudyingAway=1),
    "P25": base_profile(ageRange="over50", housingStatus="mortgage",
                        geographicZone="expensive_city", employmentStatus="freelance",
                        dependents=4, hasPartner=True, privateHealthInsurance="complete",
                        vehicleStatus="financed", ownEducation="formal",
                        consumerDebt="high", monthlyDebtPayment=1000,
                        emergencyFundStatus="none"),
}


def is_num(v): return isinstance(v, (int, float)) and not isinstance(v, bool)
def finite(v): return is_num(v) and not math.isnan(v) and not math.isinf(v)

def post(path, payload):
    url = BASE_URL + path
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, _safe_json(body), None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, _safe_json(body), None
    except urllib.error.URLError as e:
        return None, None, "URLError: " + str(e.reason)
    except Exception as e:
        return None, None, "Exception: " + str(e)

def _safe_json(text):
    try: return json.loads(text)
    except Exception: return {"_raw": text}

class Results:
    def __init__(self):
        self.calls = 0; self.passes = 0; self.fails = 0; self.infos = 0
        self.bugs = []; self.call_log = []
        self.first_200 = {pid: None for pid in PROFILES}
    def add_pass(self): self.passes += 1
    def add_info(self): self.infos += 1
    def add_fail(self, pid, income, severity, assertion, detail):
        self.fails += 1
        self.bugs.append({"pid": pid, "income": income, "severity": severity,
                           "assertion": assertion, "detail": detail})
    def add_call(self, pid, income, http_status, result, note=""):
        self.calls += 1
        self.call_log.append({"pid": pid, "income": income,
                               "http_status": http_status, "result": result, "note": note})

R = Results()
TOL_PCT = 1.0
TOL_EUR = 2.0

def has_nan_inf(obj, path=""):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)): return True, path
    if isinstance(obj, dict):
        for k, v in obj.items():
            found, p = has_nan_inf(v, path + "." + str(k))
            if found: return True, p
    if isinstance(obj, list):
        for i, v in enumerate(obj):
            found, p = has_nan_inf(v, path + "[" + str(i) + "]")
            if found: return True, p
    return False, ""

def assert_200(pid, income, body):
    monthly_debt = PROFILES[pid].get("monthlyDebtPayment", 0)
    cats   = body.get("categories", {})
    eff    = body.get("effectiveIncome")
    tc     = body.get("totalCheck")
    blocks = body.get("blocks", {})
    health = body.get("healthScore", {})
    # A7 - NaN/Inf
    nan_found, nan_path = has_nan_inf(body)
    if nan_found: R.add_fail(pid, income, "CRITICO", "A7-NaN/Inf", "En: " + nan_path)
    else: R.add_pass()
    # A1 - amounts y percentages >= -0.01 y finitos
    bad = []
    for cid, c in cats.items():
        a = c.get("amount"); p = c.get("percentage")
        if not finite(a) or a < -0.01: bad.append(cid + ":a=" + str(a))
        if not finite(p) or p < -0.01: bad.append(cid + ":p=" + str(p))
    if bad: R.add_fail(pid, income, "CRITICO", "A1-amounts>=0&finitos", "; ".join(bad))
    else: R.add_pass()
    # A2 - tc ~ 100 * effectiveIncome / income (invariante general, cubre floor y caso normal)
    if income > 0 and finite(tc) and finite(eff) and eff > 0:
        expected_tc = 100.0 * eff / income
        if abs(tc - expected_tc) > TOL_PCT:
            R.add_fail(pid, income, "CRITICO", "A2-totalCheck~100*eff/income",
                       "tc=" + str(tc) + " exp=" + str(round(expected_tc,3)) + " d=" + str(round(abs(tc-expected_tc),3)))
        else: R.add_pass()
    elif income > 0: R.add_fail(pid, income, "CRITICO", "A2-totalCheck~100*eff/income", "tc o eff no finito: tc=" + str(tc) + " eff=" + str(eff))
    # A3 - Suma amounts ~ effectiveIncome
    if finite(eff) and eff > 0:
        asum = sum(c.get("amount", 0) for c in cats.values() if finite(c.get("amount")))
        tol3 = max(TOL_EUR, eff * 0.005)
        if abs(asum - eff) > tol3:
            R.add_fail(pid, income, "CRITICO", "A3-Samounts~effIncome",
                       "s=" + str(round(asum,4)) + " eff=" + str(eff) + " d=" + str(round(abs(asum-eff),4)) + " tol=" + str(round(tol3,2)))
        else: R.add_pass()
    else: R.add_fail(pid, income, "CRITICO", "A3-Samounts~effIncome", "eff bad: " + str(eff))
    # A4 - effectiveIncome = max(income - debt, 200)
    eeff = max(income - monthly_debt, 200)
    if finite(eff) and abs(eff - eeff) <= 0.5: R.add_pass()
    else: R.add_fail(pid, income, "ALTO", "A4-effectiveIncome", "got=" + str(eff) + " exp=" + str(eeff) + " inc=" + str(income) + " d=" + str(monthly_debt))
    # A5 - healthScore [0,100]
    sc = health.get("score")
    if is_num(sc) and 0 <= sc <= 100: R.add_pass()
    else: R.add_fail(pid, income, "ALTO", "A5-healthScore[0,100]", "score=" + str(sc))
    # A6 - blocks sum ~ totalCheck
    if finite(tc):
        bsum = sum(blocks.get(k, {}).get("percentage", 0) for k in ("needs", "wants", "savings"))
        if abs(bsum - tc) > TOL_PCT:
            R.add_fail(pid, income, "ALTO", "A6-blocks~totalCheck", "bsum=" + str(round(bsum,4)) + " tc=" + str(tc))
        else: R.add_pass()
    else: R.add_fail(pid, income, "ALTO", "A6-blocks~totalCheck", "tc no finito: " + str(tc))

def run_sweep():
    total = len(PROFILES) * len(INCOMES)
    n = 0
    for pid, profile in PROFILES.items():
        md = profile.get("monthlyDebtPayment", 0)
        for income in INCOMES:
            n += 1
            if n % 50 == 0:
                sys.stdout.write("Progreso: " + str(n) + "/" + str(total) + " (" + pid + "@" + str(income) + ")...\n")
                sys.stdout.flush()
            status, body, err = post("/api/calculate", {"profile": profile, "income": income})
            if err is not None:
                R.add_call(pid, income, None, "conn_error", err)
                R.add_fail(pid, income, "CRITICO", "conexion", err)
                continue
            if status == 500:
                d = (body or {}).get("error", str(body))
                R.add_call(pid, income, 500, "HTTP500", d)
                R.add_fail(pid, income, "CRITICO", "HTTP500", d)
                continue
            if status == 400:
                bd = body or {}
                if income <= 0:
                    R.add_call(pid, income, 400, "INFO-income<=0", bd.get("error", ""))
                    R.add_info(); continue
                if bd.get("insolvencyBlock") is True:
                    R.add_call(pid, income, 400, "INFO-insolvencyBlock", "debt=" + str(md) + " inc=" + str(income))
                    R.add_info(); continue
                R.add_call(pid, income, 400, "FAIL-400-unexpected", bd.get("error", ""))
                R.add_fail(pid, income, "MEDIO", "HTTP400-inesperado",
                           "inc=" + str(income) + " debt=" + str(md) + " err=" + str(bd.get("error", "")))
                continue
            if status == 200:
                R.add_call(pid, income, 200, "OK", "")
                if R.first_200[pid] is None: R.first_200[pid] = income
                assert_200(pid, income, body or {})
                continue
            R.add_call(pid, income, status, "FAIL-status-inesperado", "")
            R.add_fail(pid, income, "MEDIO", "HTTP" + str(status) + "-inesperado", "inc=" + str(income))

def write_report():
    NL = "\n"; PIPE = "|"; BSL = "\\\\"
    ii0 = sum(1 for c in R.call_log if c["result"] == "INFO-income<=0")
    iib = sum(1 for c in R.call_log if c["result"] == "INFO-insolvencyBlock")
    by_sev = {}
    for b in R.bugs: by_sev.setdefault(b["severity"], []).append(b)
    ta = R.passes + R.fails
    cr = []
    for pid in sorted(PROFILES.keys()):
        d = PROFILES[pid].get("monthlyDebtPayment", 0)
        f = R.first_200[pid]
        if f is None: cr.append((pid, d, "N/A", "nunca 200"))
        else:
            nb = sum(1 for inc in INCOMES if inc > 0 and inc < f)
            cr.append((pid, d, f, str(nb) + " incomes bloqueados por insolvencia"))
    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    def cell(s): return str(s).replace(PIPE, BSL + PIPE).replace(NL, " ")
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        def w(s=""): f.write(s + NL)
        w("# Reporte /api/calculate - sweep directo v2")
        w(); w("Generado: " + datetime.now().isoformat(timespec="seconds"))
        w(); w("Servidor: " + BASE_URL)
        w(); w("Perfiles: " + str(len(PROFILES)) + "  x  Incomes: " + str(len(INCOMES)) + "  =  " + str(len(PROFILES)*len(INCOMES)) + " llamadas")
        w(); w("## Resumen"); w()
        w("| Metrica | Valor |"); w("|---------|-------|")
        w("| Llamadas HTTP totales | **" + str(R.calls) + "** |")
        w("| Aserciones evaluadas | **" + str(ta) + "** |")
        w("| PASS | **" + str(R.passes) + "** |")
        w("| FAIL | **" + str(R.fails) + "** |")
        w("| INFO comportamiento esperado | **" + str(R.infos) + "** |")
        w("| INFO - income <= 0 | " + str(ii0) + " |")
        w("| INFO - insolvencyBlock | " + str(iib) + " |")
        for sev in ("CRITICO", "ALTO", "MEDIO", "BAJO"):
            w("| FAIL " + sev + " | **" + str(len(by_sev.get(sev, []))) + "** |")
        w(); w("## Bugs encontrados"); w()
        if not R.bugs: w("No se encontraron bugs."); w()
        else:
            for sev in ("CRITICO", "ALTO", "MEDIO", "BAJO"):
                items = by_sev.get(sev, [])
                if not items: continue
                w("### " + sev + " (" + str(len(items)) + ")"); w()
                w("| Perfil | Income | Asercion | Detalle |"); w("|--------|--------|----------|---------|")
                for b in items:
                    w("| " + b["pid"] + " | " + str(b["income"]) + " | " + b["assertion"] + " | " + cell(b["detail"] or "")[:400] + " |")
                w()
        w("## Comportamiento en ingresos extremos - cortes de insolvencia"); w()
        w("Para cada perfil: primer income > 0 que devuelve HTTP 200.")
        w("Incomes bloqueados: insolvencyBlock=true (comportamiento esperado post-fix)."); w()
        w("| Perfil | monthlyDebt | Primer income 200 | Observaciones |"); w("|--------|-------------|-------------------|---------------|")
        for pid, debt, first, obs in cr:
            w("| " + pid + " | " + str(debt) + "EUR | " + str(first) + " | " + obs + " |")
        w(); w("## Distribucion de resultados por nivel de ingreso"); w()
        w("| Income | HTTP200 | INFO-inc0 | INFO-insolv | FAIL-400 | HTTP500 | FAIL-otro |"); w("|--------|---------|-----------|-------------|----------|---------|-----------|")
        for inc in INCOMES:
            ca = [c for c in R.call_log if c["income"] == inc]
            w("| " + str(inc) + " | " + str(sum(1 for c in ca if c["http_status"]==200)) + " | " + str(sum(1 for c in ca if c["result"]=="INFO-income<=0")) + " | " + str(sum(1 for c in ca if c["result"]=="INFO-insolvencyBlock")) + " | " + str(sum(1 for c in ca if c["result"]=="FAIL-400-unexpected")) + " | " + str(sum(1 for c in ca if c["http_status"]==500)) + " | " + str(sum(1 for c in ca if c["result"].startswith("FAIL-status"))) + " |")
        fe = [c for c in R.call_log if c["result"].startswith("FAIL") or c["http_status"]==500]
        w(); w("## Detalle de llamadas fallidas"); w()
        if not fe: w("Ninguna llamada fallida."); w()
        else:
            w("| Perfil | Income | Status | Resultado | Nota |"); w("|--------|--------|--------|-----------|------|")
            for c in fe[:500]:
                w("| " + c["pid"] + " | " + str(c["income"]) + " | " + str(c["http_status"]) + " | " + c["result"] + " | " + cell(c["note"] or "")[:200] + " |")
        w(); w("---")
        w("Generado por test_runner_direct_v2.py el " + datetime.now().isoformat(timespec="seconds"))
    return by_sev

def main():
    sep = "=" * 60
    print(sep); print("test_runner_direct_v2.py - sweep /api/calculate"); print(sep)
    print("Verificando servidor en " + BASE_URL + "...")
    st, body, err = post("/api/calculate", {"profile": PROFILES["P01"], "income": 2000})
    if err is not None or st is None:
        print("[ABORT] Servidor no responde: " + str(err))
        print("Arranca con: npm run dev")
        sys.exit(1)
    if st not in (200, 400):
        print("[ABORT] Respuesta inesperada: HTTP " + str(st)); sys.exit(1)
    print("OK - servidor responde (HTTP " + str(st) + "). Iniciando sweep...")
    t0 = time.time()
    run_sweep()
    elapsed = time.time() - t0
    by_sev = write_report()
    ii0 = sum(1 for c in R.call_log if c["result"] == "INFO-income<=0")
    iib = sum(1 for c in R.call_log if c["result"] == "INFO-insolvencyBlock")
    n2  = sum(1 for c in R.call_log if c["http_status"] == 200)
    ta  = R.passes + R.fails
    print(); print(sep); print("RESUMEN FINAL"); print(sep)
    print("Llamadas HTTP     : " + str(R.calls))
    print("  INFO income<=0  : " + str(ii0))
    print("  INFO insolvency : " + str(iib))
    print("  HTTP 200        : " + str(n2))
    print("Aserciones        : " + str(ta) + "  PASS:" + str(R.passes) + "  FAIL:" + str(R.fails))
    print("CRITICO: " + str(len(by_sev.get("CRITICO",[]))) + "  ALTO: " + str(len(by_sev.get("ALTO",[]))) + "  MEDIO: " + str(len(by_sev.get("MEDIO",[]))) + "  BAJO: " + str(len(by_sev.get("BAJO",[]))))
    print("Tiempo            : " + str(round(elapsed,1)) + "s")
    print("Reporte           : " + REPORT_PATH)
    print(sep)
    if by_sev.get("CRITICO"): print("[!] HAY BUGS CRITICOS - revisar reporte")
    elif by_sev.get("ALTO"): print("[!] Hay bugs ALTO - revisar reporte")
    elif R.fails == 0: print("[OK] Todos PASS. No se encontraron bugs.")
    else: print("[!] Hay FAILs - revisar reporte")
    print(); print("CORTES DE INSOLVENCIA (primer income con HTTP 200 por perfil):")
    for pid in sorted(PROFILES.keys()):
        d = PROFILES[pid].get("monthlyDebtPayment", 0)
        f = R.first_200[pid]
        if d > 0: print("  " + pid + " (debt=" + str(d) + "EUR): primer 200 @ income=" + str(f))


if __name__ == "__main__":
    main()
