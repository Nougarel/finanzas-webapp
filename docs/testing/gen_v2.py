import os
out = r"c:\Users\Usuario\Documents\ProyectoManhattan\flouss\docs\testing\test_runner_inverse_v2.py"

lines = []
A = lines.append

A("#!/usr/bin/env python3")
A("# -*- coding: utf-8 -*-")
A("import json, os, sys, time, random, itertools, math, urllib.request, urllib.error")
A("from datetime import datetime")
A("")
A("BASE_URL    = 'http://localhost:3000'")
A("TIMEOUT     = 15")
A("REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'inverse-v2-report.md')")
A("")
A("random.seed(42)")
A("")
A("NEEDS   = ['housing','utilities','groceries','transport','health','education']")
A("WANTS   = ['dining_out','travel','clothing','personal_care','entertainment','hobbies','subscriptions','gifts']")
A("SAVINGS = ['life_insurance','emergency_fund','short_term_savings','long_term_savings','investment','debt_extra']")
A("ALL_CATS = NEEDS + WANTS + SAVINGS")
A("NEEDS_SET   = set(NEEDS)")
A("WANTS_SET   = set(WANTS)")
A("SAVINGS_SET = set(SAVINGS)")
A("")

with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('Generated: ' + out)