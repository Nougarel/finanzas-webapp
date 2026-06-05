#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, os, sys, time, random, itertools, math, urllib.request, urllib.error
from datetime import datetime

BASE_URL    = 'http://localhost:3000'
TIMEOUT     = 15
REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'inverse-v2-report.md')

random.seed(42)

NEEDS   = ['housing','utilities','groceries','transport','health','education']
WANTS   = ['dining_out','travel','clothing','personal_care','entertainment','hobbies','subscriptions','gifts']
SAVINGS = ['life_insurance','emergency_fund','short_term_savings','long_term_savings','investment','debt_extra']
ALL_CATS = NEEDS + WANTS + SAVINGS
NEEDS_SET   = set(NEEDS)
WANTS_SET   = set(WANTS)
SAVINGS_SET = set(SAVINGS)

def base_profile(**over):
    p = {'ageRange':'under35','housingStatus':'rent','geographicZone':'standard',
         'employmentStatus':'permanent','dependents':0,'hasPartner':False,
         'partnerHasIncome':False,'vehicleStatus':'none','privateHealthInsurance':'none',
         'ownEducation':'none','emergencyFundStatus':'complete','housingPurchaseGoal':False,
         'pensionRegime':'social_security','consumerDebt':'none','monthlyDebtPayment':0,
         'childrenAtUniversity':0,'childrenStudyingAway':0}
    p.update(over); return p

PROFILES = {
    'P01': base_profile(),
    'P02': base_profile(geographicZone='expensive_city'),
    'P03': base_profile(geographicZone='rural'),
    'P04': base_profile(housingStatus='mortgage'),
    'P05': base_profile(housingStatus='owned'),
    'P06': base_profile(housingStatus='family'),
    'P07': base_profile(ageRange='35to50',housingStatus='mortgage',hasPartner=True,partnerHasIncome=True,dependents=3),
    'P08': base_profile(ageRange='35to50',dependents=4,hasPartner=True,partnerHasIncome=False),
    'P09': base_profile(ageRange='35to50',employmentStatus='freelance',geographicZone='expensive_city',pensionRegime='mutual'),
    'P10': base_profile(ageRange='over50',housingStatus='owned'),
    'P11': base_profile(ageRange='over50',housingStatus='mortgage',geographicZone='rural'),
    'P12': base_profile(ageRange='over50',employmentStatus='retired',pensionRegime='none'),
    'P13': base_profile(employmentStatus='temporary'),
    'P14': base_profile(employmentStatus='unemployed',housingStatus='family'),
    'P15': base_profile(consumerDebt='low',monthlyDebtPayment=100),
    'P16': base_profile(ageRange='35to50',housingStatus='mortgage',consumerDebt='medium',monthlyDebtPayment=300),
    'P17': base_profile(ageRange='35to50',consumerDebt='high',monthlyDebtPayment=600),
    'P18': base_profile(consumerDebt='high',monthlyDebtPayment=1000),
    'P19': base_profile(emergencyFundStatus='none'),
    'P20': base_profile(emergencyFundStatus='building'),
    'P21': base_profile(emergencyFundStatus='partial'),
    'P22': base_profile(housingPurchaseGoal=True),
    'P23': base_profile(privateHealthInsurance='complete',vehicleStatus='financed',ownEducation='formal'),
    'P24': base_profile(ageRange='35to50',dependents=3,hasPartner=True,childrenAtUniversity=2,childrenStudyingAway=1),
    'P25': base_profile(ageRange='over50',housingStatus='mortgage',geographicZone='expensive_city',
                        employmentStatus='freelance',dependents=4,hasPartner=True,
                        privateHealthInsurance='complete',vehicleStatus='financed',ownEducation='formal',
                        consumerDebt='high',monthlyDebtPayment=1000,emergencyFundStatus='none'),
}

NEED_AMOUNTS   = [0, 50, 150, 300, 600, 1000, 2000, 5000]
WANT_AMOUNTS   = [0, 30, 100, 250, 500, 1000]
SAVING_AMOUNTS = [0, 30, 100, 250, 500, 1500]
L3_SCALES = {'need':[50,300,1000],'want':[30,150,500],'saving':[30,150,500]}
L6_SCALES = {'need':[100,800],'want':[50,400],'saving':[50,400]}

def cat_type(cat):
    if cat in NEEDS_SET:   return 'need'
    if cat in WANTS_SET:   return 'want'
    return 'saving'

def scale_for_cat(cat, level):
    t = cat_type(cat)
    if level == 'L1': return NEED_AMOUNTS if t=='need' else (WANT_AMOUNTS if t=='want' else SAVING_AMOUNTS)
    if level == 'L3': return L3_SCALES[t]
    if level == 'L6': return L6_SCALES[t]
    return []

CATEGORY_SETS = {
    'L0_empty':  [],
    'L1_need':   ['housing'],
    'L1_want':   ['dining_out'],
    'L1_saving': ['emergency_fund'],
    'L3_mixed':  ['housing','dining_out','emergency_fund'],
    'L3_needs':  ['housing','groceries','transport'],
    'L6_mixed':  ['housing','utilities','dining_out','travel','emergency_fund','investment'],
    'L6_needs':  ['housing','utilities','groceries','transport','health','education'],
    'L12_mixed': ['housing','utilities','groceries','transport','dining_out','travel',
                  'clothing','emergency_fund','short_term_savings','long_term_savings',
                  'investment','debt_extra'],
    'L20_all':   ALL_CATS,
}

def generate_cases(cats):
    n = len(cats)
    cases = []
    if n == 0: return [{}]
    if n == 1:
        for amt in scale_for_cat(cats[0], 'L1'):
            cases.append({cats[0]: amt})
        return cases
    if n <= 3:
        scales = [scale_for_cat(c, 'L3') for c in cats]
        for combo in itertools.product(*scales):
            cases.append(dict(zip(cats, combo)))
        return cases
    if n <= 6:
        scales = [scale_for_cat(c, 'L6') for c in cats]
        for combo in itertools.product(*scales):
            cases.append(dict(zip(cats, combo)))
        return cases
    num_samples = 20 if n == 12 else 10
    rng = random.Random(42)
    for _ in range(num_samples):
        spec = {}
        for cat in cats:
            t = cat_type(cat)
            if t == 'need':   spec[cat] = rng.randint(0, 2000)
            elif t == 'want': spec[cat] = rng.randint(0, 800)
            else:             spec[cat] = rng.randint(0, 800)
        cases.append(spec)
    return cases

ALL_CASES = {sn: generate_cases(cats) for sn, cats in CATEGORY_SETS.items()}

def post(path, payload):
    url  = BASE_URL + path
    data = json.dumps(payload).encode('utf-8')
    req  = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return resp.status, _safe_json(resp.read().decode('utf-8')), None
    except urllib.error.HTTPError as e:
        return e.code, _safe_json(e.read().decode('utf-8')), None
    except urllib.error.URLError as e:
        return None, None, 'URLError:' + str(e.reason)
    except Exception as e:
        return None, None, 'Exception:' + str(e)

def _safe_json(text):
    try:    return json.loads(text)
    except: return {'_raw': text}

def is_num(v):  return isinstance(v, (int,float)) and not isinstance(v, bool)
def finite(v):  return is_num(v) and not math.isnan(v) and not math.isinf(v)

def has_nan_inf(obj, path=''):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return True, path
    if isinstance(obj, dict):
        for k, v in obj.items():
            found, p = has_nan_inf(v, path+'.'+str(k))
            if found: return True, p
    if isinstance(obj, list):
        for i, v in enumerate(obj):
            found, p = has_nan_inf(v, path+'['+str(i)+']')
            if found: return True, p
    return False, ''

class Results:
    def __init__(self):
        self.calls  = 0
        self.passes = 0
        self.fails  = 0
        self.infos  = 0
        self.bugs   = []
        self.feasibility = {sn: {'feasible':0,'infeasible':0,'requiresConfirmation':0,
                                  'http_error':0,'http500':0,'total':0}
                            for sn in CATEGORY_SETS}
    def add_pass(self): self.passes += 1
    def add_info(self): self.infos  += 1
    def add_fail(self, pid, sn, spec, sev, assertion, detail):
        self.fails += 1
        self.bugs.append({
            'pid': pid, 'sn': sn, 'sev': sev, 'assertion': assertion,
            'detail': str(detail)[:300],
            'spec_preview': str({k:v for k,v in list((spec or {}).items())[:5]})[:120],
            'full_spec': {k:v for k,v in list((spec or {}).items())[:20]},
        })
    def rec(self, sn, outcome):
        if sn in self.feasibility:
            self.feasibility[sn]['total'] += 1
            if outcome in self.feasibility[sn]:
                self.feasibility[sn][outcome] += 1

R = Results()

def assert_feasible(pid, sn, spec, body):
    req  = body.get('requiredIncome')
    debt = body.get('monthlyDebtPayment') or 0
    hd   = body.get('healthyDistribution') or {}
    found, path = has_nan_inf(body)
    if found: R.add_fail(pid, sn, spec, 'CRITICO', 'I6-NaN/Inf', 'path:'+path)
    else:     R.add_pass()
    spec_sum = sum(v for v in spec.values() if isinstance(v,(int,float)) and v > 0)
    if finite(req) and req >= spec_sum - 0.5: R.add_pass()
    else: R.add_fail(pid, sn, spec, 'CRITICO', 'I1-req>=specSum', 'req='+str(req)+' specSum='+str(spec_sum))
    if not finite(req):
        R.add_fail(pid, sn, spec, 'CRITICO', 'I2-req-finito', 'req='+str(req))
    elif req >= 2000000:
        R.add_fail(pid, sn, spec, 'ALTO', 'I2-req<2M', 'req='+str(req)+' alcanzo el cap')
    else:
        R.add_pass()
    bad = [cat+'='+str((e or {}).get('amount')) for cat, e in hd.items()
           if not (isinstance(e, dict) and finite(e.get('amount')) and e.get('amount',-1) >= -0.01)]
    if bad: R.add_fail(pid, sn, spec, 'CRITICO', 'I3-amounts>=0', '; '.join(bad[:6]))
    else:   R.add_pass()
    if hd and finite(req):
        hd_sum = sum(e['amount'] for e in hd.values()
                     if isinstance(e, dict) and finite(e.get('amount')))
        # Si allCategoriesFixed, la distribución suma lifestyleCost, no requiredIncome-debt:
        # con las 20 categorías fijadas requiredIncome es el ingreso al que esos
        # importes son saludables en %, así que el invariante correcto es
        # Σ healthyDistribution ≈ lifestyleCost.
        if body.get('allCategoriesFixed'):
            lifestyle = body.get('lifestyleCost', 0)
            tol_lc = max(2.0, lifestyle * 0.003)
            if finite(lifestyle) and abs(hd_sum - lifestyle) <= tol_lc: R.add_pass()
            else: R.add_fail(pid, sn, spec, 'ALTO', 'I4-sumHD~lifestyleCost',
                             'S='+str(round(hd_sum,2))+' lifestyleCost='+str(round(lifestyle,2))+
                             ' diff='+str(round(abs(hd_sum-(lifestyle or 0)),2))+' tol='+str(round(tol_lc,2)))
        else:
            target = req - debt
            tol    = max(3.0, abs(target) * 0.005)
            if abs(hd_sum - target) <= tol: R.add_pass()
            else: R.add_fail(pid, sn, spec, 'ALTO', 'I4-sumHD~req-debt',
                             'S='+str(round(hd_sum,2))+' tgt='+str(round(target,2))+
                             ' diff='+str(round(abs(hd_sum-target),2))+' tol='+str(round(tol,2)))
    else:
        R.add_fail(pid, sn, spec, 'ALTO', 'I4-sumHD~req-debt', 'hd vacio o req no finito')
    if hd and finite(req):
        viol = []
        for cat, amt in spec.items():
            if cat not in NEEDS_SET and cat not in SAVINGS_SET: continue
            if not isinstance(amt, (int,float)) or amt < 0:     continue
            e = hd.get(cat)
            if not isinstance(e, dict): viol.append(cat+':missing'); continue
            hamt = e.get('amount')
            if not finite(hamt) or abs(hamt - amt) > 2.0:
                viol.append(cat+':spec='+str(amt)+' got='+str(hamt))
        if viol: R.add_fail(pid, sn, spec, 'ALTO', 'I5-fixedAmounts~spec', '; '.join(viol[:4]))
        else:    R.add_pass()

def run_sweep():
    total_cases = sum(len(v) for v in ALL_CASES.values()) * len(PROFILES)
    n = 0
    t0 = time.time()
    for sn, cases in ALL_CASES.items():
        for pid, profile in PROFILES.items():
            for spec in cases:
                n += 1
                R.calls += 1
                if n % 100 == 0:
                    el = time.time() - t0
                    rate = n / el if el > 0 else 1
                    eta  = int((total_cases - n) / rate)
                    sys.stdout.write('Progreso: '+str(n)+'/'+str(total_cases)+
                        ' ('+str(round(n/total_cases*100,1))+'%) '+
                        sn+'/'+pid+' ETA:'+str(eta)+'s' + chr(10))
                    sys.stdout.flush()
                status, body, err = post('/api/calculate-inverse',
                                          {'profile': profile, 'specifiedAmounts': spec})
                if err is not None:
                    R.rec(sn, 'http_error')
                    R.add_fail(pid, sn, spec, 'CRITICO', 'conexion', str(err)[:200])
                    continue
                if status == 500:
                    R.rec(sn, 'http500')
                    R.add_fail(pid, sn, spec, 'CRITICO', 'HTTP500',
                               str((body or {}).get('error', str(body)))[:250])
                    continue
                if status == 400:
                    bd = body or {}
                    err_msg = str(bd.get('error',''))
                    if bd.get('insolvencyBlock') is True or 'inv' in err_msg.lower():
                        R.rec(sn, 'infeasible'); R.add_info()
                    else:
                        R.rec(sn, 'http_error')
                        R.add_fail(pid, sn, spec, 'MEDIO', 'HTTP400-inesperado', err_msg[:250])
                    continue
                if status != 200:
                    R.rec(sn, 'http_error')
                    R.add_fail(pid, sn, spec, 'MEDIO',
                               'HTTP'+str(status)+'-inesperado',
                               str((body or {}).get('error',''))[:200])
                    continue
                bd = body or {}
                if bd.get('requiresConfirmation') is True:
                    R.rec(sn, 'requiresConfirmation'); R.add_info()
                    continue
                if bd.get('feasible') is False:
                    R.rec(sn, 'infeasible')
                    spec_sum = sum(v for v in spec.values() if isinstance(v,(int,float)) and v>0)
                    debt     = profile.get('monthlyDebtPayment', 0)
                    if spec_sum > 0 and spec_sum < 2000 and debt == 0:
                        R.add_fail(pid, sn, spec, 'MEDIO', 'feasible-false-spec-razonable',
                                   'specSum='+str(spec_sum)+' err='+str(bd.get('error',''))[:150])
                    else:
                        R.add_info()
                    continue
                R.rec(sn, 'feasible')
                assert_feasible(pid, sn, spec, bd)

def write_report(elapsed):
    NL = chr(10); PIPE = chr(124); BSL = chr(92)
    by_sev = {}
    for b in R.bugs: by_sev.setdefault(b['sev'], []).append(b)
    ta = R.passes + R.fails
    tot_fe  = sum(v['feasible']              for v in R.feasibility.values())
    tot_inf = sum(v['infeasible']             for v in R.feasibility.values())
    tot_rc  = sum(v['requiresConfirmation']   for v in R.feasibility.values())
    tot_err = sum(v['http_error']+v['http500'] for v in R.feasibility.values())
    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    def cell(s): return str(s).replace(PIPE, BSL+PIPE).replace(NL, " ")
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        def w(s=""): f.write(s + NL)
        w("# Reporte /api/calculate-inverse -- sweep exhaustivo v2")
        w(); w("Generado: " + datetime.now().isoformat(timespec="seconds"))
        w(); w("Servidor: " + BASE_URL); w()
        w("## Configuracion del sweep"); w()
        w("| Parametro | Valor |"); w("|-----------|-------|")
        w("| Perfiles | " + str(len(PROFILES)) + " |")
        w("| Category sets | " + str(len(CATEGORY_SETS)) + " |")
        total_cases = sum(len(v) for v in ALL_CASES.values()) * len(PROFILES)
        w("| Llamadas HTTP totales | **" + str(R.calls) + "** (estimado: "+str(total_cases)+") |")
        w("| Tiempo total | " + str(round(elapsed,1)) + "s |"); w()
        w("## Resumen de resultados"); w()
        w("| Metrica | Valor |"); w("|---------|-------|")
        w("| Llamadas HTTP | **" + str(R.calls) + "** |")
        w("| feasible:true | **" + str(tot_fe) + "** |")
        w("| feasible:false | **" + str(tot_inf) + "** |")
        w("| requiresConfirmation | **" + str(tot_rc) + "** |")
        w("| Errores HTTP/500 | **" + str(tot_err) + "** |")
        w("| Aserciones evaluadas | **" + str(ta) + "** |")
        w("| PASS | **" + str(R.passes) + "** |")
        w("| FAIL | **" + str(R.fails) + "** |")
        w("| INFO | **" + str(R.infos) + "** |")
        for sev in ("CRITICO","ALTO","MEDIO","BAJO"):
            w("| FAIL "+sev+" | **"+str(len(by_sev.get(sev,[])))+"** |")
        w()
        w("## Distribucion de feasibility por nivel de cobertura"); w()
        w("| Set | Total | feasible | %feasible | infeasible | requiresConf | err/500 |")
        w("|-----|-------|----------|-----------|------------|--------------|---------|")
        for sn, feas in R.feasibility.items():
            tot  = feas['total']; fe = feas['feasible']
            inf  = feas['infeasible']; rc = feas['requiresConfirmation']
            err  = feas['http_error'] + feas['http500']
            pct  = str(round(fe/tot*100,1))+"%" if tot>0 else "N/A"
            w("| "+sn+" | "+str(tot)+" | "+str(fe)+" | "+pct+
              " | "+str(inf)+" | "+str(rc)+" | "+str(err)+" |")
        w()
        w("## Bugs encontrados"); w()
        if not R.bugs:
            w("No se encontraron bugs."); w()
        else:
            for sev in ("CRITICO","ALTO","MEDIO","BAJO"):
                items = by_sev.get(sev, [])
                if not items: continue
                w("### "+sev+" ("+str(len(items))+")"); w()
                w("| Perfil | Set | Asercion | Spec (preview) | Detalle |")
                w("|--------|-----|----------|----------------|---------|")
                for b in items:
                    det = cell(b['detail']       or '')[:300]
                    sp  = cell(b['spec_preview'] or '')[:120]
                    w('| '+b['pid']+' | '+b['sn']+' | '+b['assertion']+' | '+sp+' | '+det+' |')
                w()
        top = [b for b in R.bugs if b['sev'] in ('CRITICO','ALTO')][:3]
        if top:
            w("## Payloads de reproduccion -- top bugs"); w()
            for i, b in enumerate(top, 1):
                w('### Bug '+str(i)+' -- '+b['sev']+': '+b['assertion']); w()
                w('**Perfil:** '+b['pid']+'  |  **Set:** '+b['sn']); w()
                w('**Detalle:** '+cell(b['detail'] or '')); w()
                profile_json = json.dumps(PROFILES[b['pid']], ensure_ascii=False)
                spec_json    = json.dumps(b['full_spec'],      ensure_ascii=False)
                w("curl -s -X POST http://localhost:3000/api/calculate-inverse \\")
                w("  -H \"Content-Type: application/json\" \\")
                w("  -d \x27{\"profile\":\"" + profile_json + "\",\"specifiedAmounts\":\"" + spec_json + "}\x27")
                w("")
        w("---")
        w("Generado por test_runner_inverse_v2.py el "+datetime.now().isoformat(timespec="seconds"))
    return by_sev

def main():
    SEP = "=" * 65
    print(SEP); print("test_runner_inverse_v2.py -- sweep /api/calculate-inverse"); print(SEP)
    print("Verificando servidor en " + BASE_URL + "...")
    st, body, err = post("/api/calculate-inverse",
                         {"profile": PROFILES["P01"], "specifiedAmounts": {"housing": 700}})
    if err is not None or st is None:
        print("[ABORT] Servidor no responde: " + str(err)); print("Arranca con: npm run dev"); sys.exit(1)
    if st not in (200, 400):
        print("[ABORT] Respuesta inesperada: HTTP "+str(st)); sys.exit(1)
    print("OK -- servidor responde (HTTP " + str(st) + ")")
    total_cases = sum(len(v) for v in ALL_CASES.values()) * len(PROFILES)
    print("Casos a ejecutar: "+str(total_cases)+
          "  (25 perfiles x "+str(sum(len(v) for v in ALL_CASES.values()))+" combis)")
    print("Iniciando sweep..."); print("")
    t0 = time.time()
    run_sweep()
    elapsed = time.time() - t0
    by_sev = write_report(elapsed)
    tot_fe  = sum(v['feasible']              for v in R.feasibility.values())
    tot_inf = sum(v['infeasible']             for v in R.feasibility.values())
    tot_rc  = sum(v['requiresConfirmation']   for v in R.feasibility.values())
    tot_err = sum(v['http_error']+v['http500'] for v in R.feasibility.values())
    print(); print(SEP); print("RESUMEN FINAL"); print(SEP)
    print("Llamadas HTTP     : " + str(R.calls))
    print("  feasible        : " + str(tot_fe))
    print("  infeasible      : " + str(tot_inf))
    print("  requiresConf    : " + str(tot_rc))
    print("  errores         : " + str(tot_err))
    print("Aserciones        : " + str(R.passes+R.fails) +
          "  PASS:" + str(R.passes) + "  FAIL:" + str(R.fails))
    print("CRITICO: " + str(len(by_sev.get("CRITICO",[]))) +
          "  ALTO: "  + str(len(by_sev.get("ALTO",[]))) +
          "  MEDIO: " + str(len(by_sev.get("MEDIO",[]))) +
          "  BAJO: "  + str(len(by_sev.get("BAJO",[]))))
    print("Tiempo            : " + str(round(elapsed,1)) + "s")
    print("Reporte           : " + REPORT_PATH); print(SEP); print("")
    print("Distribucion feasibility por nivel:")
    for sn, feas in R.feasibility.items():
        tot = feas['total']; fe = feas['feasible']
        inf = feas['infeasible']; rc = feas['requiresConfirmation']
        pct = str(round(fe/tot*100,1))+"%" if tot>0 else "N/A"
        print("  "+sn.ljust(16)+" total="+str(tot).rjust(5)+
              " feasible="+str(fe).rjust(5)+"("+pct.rjust(6)+")"
              +" infeas="+str(inf).rjust(4)+" rc="+str(rc).rjust(4))
    print("")
    if by_sev.get("CRITICO"):   print("[!] HAY BUGS CRITICOS -- revisar reporte")
    elif by_sev.get("ALTO"):    print("[!] Hay bugs ALTO -- revisar reporte")
    elif R.fails == 0:          print("[OK] Todos PASS. No se encontraron bugs.")
    else:                       print("[!] Hay FAILs -- revisar reporte")

if __name__ == "__main__":
    main()
