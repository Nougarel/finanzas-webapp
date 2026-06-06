#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, os, sys, time, urllib.request, urllib.error
from datetime import datetime

BASE_URL = "http://localhost:3000"
TIMEOUT = 10
TOL = 0.5
TOL_EUR = 1.0
REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "functional-test-report.md")

RESULTS = []
BUGS = []
SEV_CRIT = "CRITICO"
SEV_HIGH = "ALTO"
SEV_MED  = "MEDIO"
SEV_LOW  = "BAJO"

def record(test, ok, severity, detail=""):
    status = "PASS" if ok else "FAIL"
    RESULTS.append({"test": test, "status": status, "severity": severity if not ok else "-", "detail": detail})
    if not ok:
        BUGS.append({"test": test, "severity": severity, "detail": detail})

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
        return None, None, f"URLError: {e.reason}"
    except Exception as e:
        return None, None, f"Exception: {e}"

def _safe_json(text):
    try: return json.loads(text)
    except: return {"_raw": text}

def is_num(v): return isinstance(v, (int, float)) and not isinstance(v, bool)
def finite(v): return is_num(v) and v == v and abs(v) != float("inf")

def base_profile(**over):
    p = {"ageRange":"under35","housingStatus":"rent","geographicZone":"standard",
         "employmentStatus":"permanent","dependents":0,"hasPartner":False,
         "partnerHasIncome":False,"vehicleStatus":"none","privateHealthInsurance":"none",
         "ownEducation":"none","emergencyFundStatus":"complete","housingPurchaseGoal":False,
         "pensionRegime":"social_security","consumerDebt":"none","monthlyDebtPayment":0,
         "childrenAtUniversity":0,"childrenStudyingAway":0}
    p.update(over)
    return p

PROFILES = {
    "P01": base_profile(),
    "P02": base_profile(geographicZone="expensive_city"),
    "P03": base_profile(geographicZone="rural"),
    "P04": base_profile(housingStatus="mortgage"),
    "P05": base_profile(housingStatus="owned"),
    "P06": base_profile(housingStatus="family"),
    "P07": base_profile(ageRange="35to50",housingStatus="mortgage",hasPartner=True,partnerHasIncome=True,dependents=3),
    "P08": base_profile(ageRange="35to50",dependents=4,hasPartner=True,partnerHasIncome=False),
    "P09": base_profile(ageRange="35to50",employmentStatus="freelance",geographicZone="expensive_city",pensionRegime="mutual"),
    "P10": base_profile(ageRange="over50",housingStatus="owned"),
    "P11": base_profile(ageRange="over50",housingStatus="mortgage",geographicZone="rural"),
    "P12": base_profile(ageRange="over50",employmentStatus="retired",pensionRegime="none"),
    "P13": base_profile(employmentStatus="temporary"),
    "P14": base_profile(employmentStatus="unemployed",housingStatus="family"),
    "P15": base_profile(consumerDebt="low",monthlyDebtPayment=100),
    "P16": base_profile(ageRange="35to50",housingStatus="mortgage",consumerDebt="medium",monthlyDebtPayment=300),
    "P17": base_profile(ageRange="35to50",consumerDebt="high",monthlyDebtPayment=600),
    "P18": base_profile(consumerDebt="high",monthlyDebtPayment=1000),
    "P19": base_profile(emergencyFundStatus="none"),
    "P20": base_profile(emergencyFundStatus="building"),
    "P21": base_profile(emergencyFundStatus="partial"),
    "P22": base_profile(housingPurchaseGoal=True),
    "P23": base_profile(privateHealthInsurance="complete",vehicleStatus="financed",ownEducation="formal"),
    "P24": base_profile(ageRange="35to50",dependents=3,hasPartner=True,childrenAtUniversity=2,childrenStudyingAway=1),
    "P25": base_profile(ageRange="over50",housingStatus="mortgage",geographicZone="expensive_city",
                        employmentStatus="freelance",dependents=4,hasPartner=True,
                        privateHealthInsurance="complete",vehicleStatus="financed",ownEducation="formal",
                        consumerDebt="high",monthlyDebtPayment=1000,emergencyFundStatus="none"),
}

INCOMES = [500,700,900,1000,1200,1500,1800,2000,2500,3000,3500,4000,5000,7000,10000,15000]
NEEDS_IDS = ["housing","utilities","groceries","transport","health","education"]
SAVINGS_IDS = ["life_insurance","emergency_fund","short_term_savings","long_term_savings","investment","debt_extra"]
WANTS_IDS = ["dining_out","travel","clothing","personal_care","entertainment","hobbies","subscriptions","gifts"]

FACTIBLE = {
    "housing":(0,35),"utilities":(0,15),"groceries":(3,25),"transport":(0,25),
    "health":(0,15),"education":(0,45),"life_insurance":(0,1.5),"emergency_fund":(0,90),
    "short_term_savings":(0,6),"long_term_savings":(0,12),"investment":(0,15),"debt_extra":(0,10),
}

def assert_direct(tag, profile, income, status, body):
    monthly_debt = profile.get("monthlyDebtPayment", 0)
    if status == 500:
        record(f"{tag} HTTP", False, SEV_CRIT, f"500: {(body or {}).get('error')}"); return
    if status != 200:
        record(f"{tag} HTTP", False, SEV_HIGH, f"status {status}: {(body or {}).get('error')}"); return
    record(f"{tag} HTTP200", True, "-")
    cats = body.get("categories", {})
    eff = body.get("effectiveIncome")
    income_ratio = (eff / income) if (finite(eff) and income > 0) else 1.0
    bad = [f"{cid}(a={c.get('amount')},p={c.get('percentage')})" for cid,c in cats.items()
           if not finite(c.get("amount")) or c.get("amount",0)<-0.001 or not finite(c.get("percentage")) or c.get("percentage",0)<-0.001]
    record(f"{tag} amounts>=0&finitos", len(bad)==0, SEV_CRIT, "; ".join(bad))
    tc = body.get("totalCheck")
    debt_pct = (monthly_debt/income)*100 if income>0 else 0
    ok_tc = finite(tc) and abs((tc+debt_pct)-100) <= TOL+0.5
    record(f"{tag} totalCheck+deuda~100", ok_tc, SEV_CRIT, f"tc={tc} +debt={debt_pct:.2f}={((tc or 0)+debt_pct):.2f}")
    blocks = body.get("blocks",{})
    bsum = sum(blocks.get(k,{}).get("percentage",0) for k in ("needs","wants","savings"))
    record(f"{tag} blocks~totalCheck", finite(tc) and abs(bsum-tc)<=TOL+0.3, SEV_HIGH, f"bsum={bsum:.2f} tc={tc}")
    amt_sum = sum(c.get("amount",0) for c in cats.values() if finite(c.get("amount")))
    record(f"{tag} Samounts~effIncome", finite(eff) and abs(amt_sum-eff)<=max(TOL_EUR,eff*0.002), SEV_CRIT, f"S={amt_sum:.2f} eff={eff}")
    viol=[]
    for cid in NEEDS_IDS+SAVINGS_IDS:
        c=cats.get(cid)
        if not c or not finite(c.get("percentage")): continue
        internal=c["percentage"]/income_ratio if income_ratio else c["percentage"]
        lo,hi=FACTIBLE[cid]
        if internal<lo-0.5 or internal>hi+0.5: viol.append(f"{cid}={internal:.2f}not[{lo},{hi}]")
    record(f"{tag} rango_factible", len(viol)==0, SEV_HIGH, "; ".join(viol))
    sc = body.get("healthScore",{}).get("score")
    record(f"{tag} score[0,100]", is_num(sc) and 0<=sc<=100, SEV_HIGH, f"score={sc}")
    exp_eff = max(income-monthly_debt,200)
    record(f"{tag} effectiveIncome", finite(eff) and abs(eff-exp_eff)<=0.5, SEV_HIGH, f"eff={eff} exp={exp_eff}")
    if profile.get("consumerDebt")=="none":
        de=cats.get("debt_extra",{}).get("amount",0)
        record(f"{tag} debt_extra=0", abs(de)<0.01, SEV_MED, f"debt_extra={de}")
    w=blocks.get("wants",{}).get("percentage",0)
    w_int=w/income_ratio if income_ratio else w
    record(f"{tag} wants[10,80]", 9.5<=w_int<=80.5, SEV_HIGH, f"wants_int={w_int:.2f}")

def run_B():
    print("=== B: Sweep directo ===")
    for pid,prof in PROFILES.items():
        for inc in INCOMES:
            tag=f"[B {pid}@{inc}]"
            st,body,err=post("/api/calculate",{"profile":prof,"income":inc})
            if err: record(f"{tag} conn",False,SEV_CRIT,err); continue
            assert_direct(tag,prof,inc,st,body or {})

def run_B2():
    print("=== B2: Continuidad tramo ===")
    for pid in ["P01","P07","P17","P23"]:
        prof=PROFILES[pid]
        for trio in [(1499,1500,1501),(3999,4000,4001)]:
            scores,needs,sav=[],[],[]
            okall=True
            for inc in trio:
                st,body,err=post("/api/calculate",{"profile":prof,"income":inc})
                if err or st!=200: okall=False; break
                scores.append(body.get("healthScore",{}).get("score",0))
                needs.append(body.get("blocks",{}).get("needs",{}).get("percentage",0))
                sav.append(body.get("blocks",{}).get("savings",{}).get("percentage",0))
            if not okall: record(f"[B2 {pid}@{trio}]",False,SEV_MED,"llamada fallida"); continue
            ok=max(scores)-min(scores)<=8 and max(needs)-min(needs)<=4 and max(sav)-min(sav)<=4
            record(f"[B2 {pid}@{trio}] continuidad",ok,SEV_MED,
                   f"Dsc={max(scores)-min(scores)} Dn={max(needs)-min(needs):.2f} Ds={max(sav)-min(sav):.2f}")

INVERSE_CASES=[
    ("C01","P01",{"housing":700},{}),
    ("C02","P01",{"housing":600,"groceries":300,"transport":150},{}),
    ("C03","P07",{"housing":900,"groceries":600,"investment":400},{}),
    ("C04","P01",{"housing":3000,"travel":2000,"investment":2000},{}),
    ("C05","P25",{"housing":1500,"education":800,"health":400},{}),
    ("C06","P16",{"housing":800,"groceries":400},{}),
    ("C07","P01",{},{}),
    ("C08","P05",{"housing":700},{}),
    ("C09","P05",{"housing":700},{"force":True}),
    ("C10","P01",{"dining_out":300,"travel":200},{}),
    ("C11","P14",{"transport":600},{}),
]

def run_C():
    print("=== C: Inverso ===")
    for cid,pid,spec,extra in INVERSE_CASES:
        tag=f"[{cid} {pid}]"
        payload={"profile":PROFILES[pid],"specifiedAmounts":spec}
        payload.update(extra)
        st,body,err=post("/api/calculate-inverse",payload)
        if err: record(f"{tag} conn",False,SEV_CRIT,err); continue
        if st==500: record(f"{tag} HTTP",False,SEV_CRIT,f"500:{(body or {}).get('error')}"); continue
        if st!=200: record(f"{tag} HTTP",False,SEV_HIGH,f"status {st}"); continue
        record(f"{tag} HTTP200",True,"-")
        if cid=="C08":
            ok=body.get("requiresConfirmation") is True and body.get("feasible") is False
            record(f"{tag} requiresConfirmation",ok,SEV_HIGH,f"feasible={body.get('feasible')} rc={body.get('requiresConfirmation')}"); continue
        if cid=="C09":
            record(f"{tag} force_ok",body.get("feasible") is True,SEV_HIGH,f"feasible={body.get('feasible')}")
        if cid=="C11":
            record(f"{tag} valido",body.get("feasible") in (True,False),SEV_LOW,f"rc={body.get('requiresConfirmation')}")
            if body.get("requiresConfirmation"): continue
        if cid=="C07":
            w=body.get("warnings",[])
            record(f"{tag} warning_vacio",any("especificado" in str(x) for x in w),SEV_MED,f"warnings={w}")
        if not body.get("feasible"):
            record(f"{tag} feasible",False,SEV_MED,f"{body.get('error')}"); continue
        req=body.get("requiredIncome")
        debt=PROFILES[pid].get("monthlyDebtPayment",0)
        hd=body.get("healthyDistribution",{})
        spec_sum=sum(spec.values())
        record(f"{tag} req>=Sspec",finite(req) and req>=spec_sum-0.5,SEV_CRIT,f"req={req} Sspec={spec_sum}")
        record(f"{tag} req<1M",finite(req) and req<1_000_000,SEV_HIGH,f"req={req}")
        bad=[k for k,v in hd.items() if not finite(v.get("amount")) or v.get("amount",0)<-0.01]
        record(f"{tag} amounts_ok",len(bad)==0,SEV_CRIT,"; ".join(bad))
        hsum=sum(v.get("amount",0) for v in hd.values() if finite(v.get("amount")))
        target=req-debt
        record(f"{tag} Shealthy~req-debt",abs(hsum-target)<=max(2.0,target*0.003),SEV_HIGH,f"S={hsum:.2f} tgt={target:.2f}")
        viol=[f"{k}:fij={v}got={hd.get(k,{}).get('amount')}" for k,v in spec.items()
              if (k in NEEDS_IDS or k in SAVINGS_IDS) and (hd.get(k) is None or abs(hd.get(k,{}).get("amount",0)-v)>1.5)]
        record(f"{tag} importes_fijados",len(viol)==0,SEV_HIGH,"; ".join(viol))

def get_direct_amounts(pid,income):
    st,body,err=post("/api/calculate",{"profile":PROFILES[pid],"income":income})
    if err or st!=200: return None,body
    return {cid:c["amount"] for cid,c in body.get("categories",{}).items()},body

def run_D():
    print("=== D: Diagnostico ===")
    for pid,inc in [("P01",2000),("P07",3000),("P17",2500)]:
        tag=f"[D01 {pid}@{inc}]"
        amts,_=get_direct_amounts(pid,inc)
        if amts is None: record(f"{tag} setup",False,SEV_HIGH,"directo fallo"); continue
        st,body,err=post("/api/diagnose",{"profile":PROFILES[pid],"income":inc,"realAmounts":amts})
        if err or st!=200: record(f"{tag} HTTP",False,SEV_CRIT,err or f"status {st}"); continue
        sc=body.get("healthScore",{}).get("score")
        record(f"{tag} score>=85",is_num(sc) and sc>=85,SEV_HIGH,f"score={sc}")
        nan=[f"{cid}.{ff}" for cid,comp in body.get("comparison",{}).items()
             for ff in ("realAmount","healthyAmount","deviation") if not finite(comp.get(ff))]
        record(f"{tag} sinNaN",len(nan)==0,SEV_CRIT,"; ".join(nan))
    for label,frac in [("D02-45pct",0.45),("D03-65pct",0.65)]:
        inc=2000
        amts={cid:0 for cid in NEEDS_IDS+SAVINGS_IDS+WANTS_IDS}
        amts["housing"]=inc*frac; amts["groceries"]=inc*0.10
        tag=f"[{label}]"
        st,body,err=post("/api/diagnose",{"profile":PROFILES["P01"],"income":inc,"realAmounts":amts})
        if err or st!=200: record(f"{tag} HTTP",False,SEV_CRIT,err or f"status {st}"); continue
        record(f"{tag} alerta_housing",body.get("alerts",{}).get("housing") is not None,SEV_HIGH,f"alerts={list(body.get('alerts',{}).keys())}")
        sc=body.get("healthScore",{}).get("score")
        record(f"{tag} score<75",is_num(sc) and sc<75,SEV_MED,f"score={sc}")
    for label,frac in [("D04-50pct",0.50),("D05-150pct",1.50)]:
        inc=2000
        amts={cid:0 for cid in NEEDS_IDS+SAVINGS_IDS+WANTS_IDS}
        per=(inc*frac)/3; amts["housing"]=per; amts["groceries"]=per; amts["dining_out"]=per
        tag=f"[{label}]"
        st,body,err=post("/api/diagnose",{"profile":PROFILES["P01"],"income":inc,"realAmounts":amts})
        if err or st!=200: record(f"{tag} noCrash",False,SEV_CRIT,err or f"status {st}"); continue
        nan=[cid for cid,comp in body.get("comparison",{}).items()
             if not finite(comp.get("realPercentage")) or not finite(comp.get("deviation"))]
        record(f"{tag} sinNaN",len(nan)==0,SEV_CRIT,"; ".join(nan))

def run_E():
    print("=== E: Round-trip ===")
    amts,_=get_direct_amounts("P01",2000)
    if amts:
        spec={k:amts[k] for k in NEEDS_IDS+SAVINGS_IDS if amts.get(k,0)>0}
        st,body,err=post("/api/calculate-inverse",{"profile":PROFILES["P01"],"specifiedAmounts":spec})
        if not err and st==200 and body.get("feasible"):
            req=body.get("requiredIncome")
            record("[E02] req~2000(+-20pct)",finite(req) and 1600<=req<=2400,SEV_MED,f"req={req}")
        else:
            record("[E02] inverso_feasible",False,SEV_MED,f"err={err} st={st}")
    st,body,err=post("/api/calculate-inverse",{"profile":PROFILES["P01"],"specifiedAmounts":{"housing":700}})
    if not err and st==200 and body.get("feasible"):
        req=body.get("requiredIncome")
        amts2,_=get_direct_amounts("P01",round(req))
        if amts2:
            h=amts2.get("housing",0)
            record("[E03] housing~700(+-15pct)",abs(h-700)<=700*0.15,SEV_MED,f"housing={h:.2f} req={req}")

def run_F():
    print("=== F: Limites ===")
    st,body,err=post("/api/calculate",{"profile":PROFILES["P01"],"income":500})
    record("[F01] income500_no500",err is None and st!=500,SEV_CRIT,err or f"status {st}")
    st,body,err=post("/api/calculate",{"profile":PROFILES["P08"],"income":500})
    record("[F02] income500_P08_no500",err is None and st!=500,SEV_HIGH,err or f"status {st}")
    st,body,err=post("/api/calculate",{"profile":PROFILES["P14"],"income":0})
    record("[F03] income0_400",err is None and st==400,SEV_MED,f"status {st}")
    st,body,err=post("/api/calculate-inverse",{"profile":PROFILES["P01"],"specifiedAmounts":{}})
    record("[F04] inverso_vacio_warning",err is None and st==200 and len(body.get("warnings",[]))>0,SEV_MED,err or f"status {st}")
    st,body,err=post("/api/calculate-inverse",{"profile":PROFILES["P05"],"specifiedAmounts":{"housing":700}})
    record("[F05] owned_requiresConfirmation",err is None and st==200 and body.get("requiresConfirmation") is True,SEV_HIGH,f"rc={(body or {}).get('requiresConfirmation')}")
    prof_debt=base_profile(consumerDebt="high",monthlyDebtPayment=1000)
    st,body,err=post("/api/calculate",{"profile":prof_debt,"income":1100})
    if err is None and st==200:
        record("[F06] _debt_block","_debt_block" in body.get("alerts",{}),SEV_MED,f"alerts={list(body.get('alerts',{}).keys())}")
    else: record("[F06] llamada",False,SEV_HIGH,err or f"status {st}")
    prof_x=base_profile(consumerDebt="high",monthlyDebtPayment=2000)
    st,body,err=post("/api/calculate",{"profile":prof_x,"income":1500})
    if err is None and st==200:
        eff=body.get("effectiveIncome")
        bad=[c for c in body.get("categories",{}).values() if not finite(c.get("amount"))]
        record("[F07] deuda>income_graceful",abs(eff-200)<1 and len(bad)==0,SEV_CRIT,f"eff={eff} nan={len(bad)}")
    else: record("[F07] no500",False,SEV_CRIT,err or f"status {st}")
    st,body,err=post("/api/calculate-inverse",{"profile":PROFILES["P01"],"specifiedAmounts":{"housing":50000}})
    if err is None and st==200:
        req=body.get("requiredIncome"); feas=body.get("feasible")
        ok=(feas and finite(req) and req<1_000_000) or (not feas and body.get("error"))
        record("[F08] housing50000_ok",ok,SEV_MED,f"feasible={feas} req={req}")
    else: record("[F08] no500",False,SEV_HIGH,err or f"status {st}")
    st,body,err=post("/api/calculate",{"profile":{"ageRange":"under35"},"income":2000})
    record("[F09] perfil_minimo_no500",err is None and st!=500,SEV_MED,err or f"status {st}")
    st,body,err=post("/api/calculate",{"profile":PROFILES["P10"],"income":15000})
    if err is None and st==200:
        sc=body.get("healthScore",{}).get("score")
        record("[F10] income15000_valido",is_num(sc) and 0<=sc<=100,SEV_LOW,f"score={sc}")
    else: record("[F10] no500",False,SEV_HIGH,err or f"status {st}")

def write_report():
    total=len(RESULTS); fails=[r for r in RESULTS if r["status"]=="FAIL"]; passed=total-len(fails)
    by_sev={}
    for b in BUGS: by_sev.setdefault(b["severity"],[]).append(b)
    os.makedirs(os.path.dirname(REPORT_PATH),exist_ok=True)
    NL = chr(10)
    PIPE = chr(124)
    BSL = chr(92)
    with open(REPORT_PATH,"w",encoding="utf-8") as f:
        f.write("# Reporte de testing funcional -- flouss" + NL + NL)
        f.write("Generado: " + datetime.now().isoformat(timespec="seconds") + NL + NL)
        f.write("Servidor: " + BASE_URL + NL + NL)
        f.write("## Resumen" + NL + NL)
        f.write("- Aserciones totales: **" + str(total) + "**" + NL)
        f.write("- PASS: **" + str(passed) + "**" + NL)
        f.write("- FAIL: **" + str(len(fails)) + "**" + NL)
        for sev in (SEV_CRIT,SEV_HIGH,SEV_MED,SEV_LOW):
            f.write("- " + sev + ": **" + str(len(by_sev.get(sev,[]))) + "**" + NL)
        f.write(NL + "## Bugs por severidad" + NL + NL)
        for sev in (SEV_CRIT,SEV_HIGH,SEV_MED,SEV_LOW):
            items=by_sev.get(sev,[])
            if not items: continue
            f.write("### " + sev + " (" + str(len(items)) + ")" + NL + NL + "| Test | Detalle |" + NL + "|------|----------|" + NL)
            for b in items:
                det=(b["detail"] or "").replace(PIPE,BSL+PIPE).replace(NL," ")[:300]
                f.write("| " + b["test"] + " | " + det + " |" + NL)
            f.write(NL)
        f.write("## Detalle completo" + NL + NL + "| Test | Estado | Sev | Detalle |" + NL + "|------|--------|-----|----------|" + NL)
        for r in RESULTS:
            det=(r["detail"] or "").replace(PIPE,BSL+PIPE).replace(NL," ")[:200]
            f.write("| " + r["test"] + " | " + r["status"] + " | " + r["severity"] + " | " + det + " |" + NL)
    return total,passed,len(fails),by_sev

def main():
    print("Verificando servidor...")
    st,_,err=post("/api/calculate",{"profile":PROFILES["P01"],"income":2000})
    if err is not None or st is None:
        print("[ERROR] Servidor no responde: " + str(err))
        print("Arranca con: npm run dev")
        sys.exit(1)
    print("OK (status " + str(st) + "). Ejecutando suite...")
    t0=time.time()
    run_B(); run_B2(); run_C(); run_D(); run_E(); run_F()
    elapsed=time.time()-t0
    total,passed,fails,by_sev=write_report()
    sep="=" * 55
    print("")
    print(sep)
    print("RESUMEN FINAL")
    print(sep)
    print("Aserciones : " + str(total) + "  PASS:" + str(passed) + "  FAIL:" + str(fails))
    crit=len(by_sev.get(SEV_CRIT,[]))
    alto=len(by_sev.get(SEV_HIGH,[]))
    med=len(by_sev.get(SEV_MED,[]))
    bajo=len(by_sev.get(SEV_LOW,[]))
    print("CRITICO:" + str(crit) + "  ALTO:" + str(alto) + "  MEDIO:" + str(med) + "  BAJO:" + str(bajo))
    print("Tiempo: " + str(round(elapsed,1)) + "s  Reporte: " + REPORT_PATH)
    if by_sev.get(SEV_CRIT): print("[!] Hay bugs CRITICOS.")

if __name__=="__main__":
    main()
