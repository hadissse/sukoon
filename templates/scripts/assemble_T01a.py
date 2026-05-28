#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
import json
import os

SCRIPTS_DIR = "/Users/hadi/Downloads/sukoon-tmp/templates/scripts"
INPUT_CSV = "/Users/hadi/Downloads/sukoon-tmp/templates/chunks/T01a_PlanetInSign_personal.csv"
OUTPUT_CSV = "/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled/T01a_PlanetInSign_personal.csv"

planet_map = {
    "الشمس": "data_sun.json",
    "القمر": "data_moon.json",
    "عطارد": "data_mercury.json",
    "الزهرة": "data_venus.json",
    "المريخ": "data_mars.json",
}

# load
data = {}
for planet, fname in planet_map.items():
    path = os.path.join(SCRIPTS_DIR, fname)
    with open(path, "r", encoding="utf-8") as f:
        data[planet] = json.load(f)

with open(INPUT_CSV, "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

print(f"Loaded {len(rows)} rows. Fields: {fieldnames}")

# fill
for row in rows:
    planet = row["body_a"]
    sign = row["body_b_or_sign"]
    entry = data[planet][sign]
    row["traditional_meaning_ar"] = entry["trad"]
    row["evolutionary_meaning_ar"] = entry["evo"]
    row["developmental_task_ar"] = entry["task"]
    row["key_references"] = entry["refs"]
    row["status"] = "filled"

# write
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
    writer.writeheader()
    for row in rows:
        writer.writerow(row)

# verify
with open(OUTPUT_CSV, "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    out_rows = list(reader)

filled = sum(1 for r in out_rows if r["status"] == "filled")
print(f"Wrote {len(out_rows)} rows, {filled} marked filled")

# word count check
import re
def count_ar_words(s):
    # split on whitespace
    return len([w for w in re.split(r"\s+", s.strip()) if w])

issues = []
for r in out_rows:
    t = count_ar_words(r["traditional_meaning_ar"])
    e = count_ar_words(r["evolutionary_meaning_ar"])
    d = count_ar_words(r["developmental_task_ar"])
    total = t + e + d
    if total < 200 or total > 350:
        issues.append((r["placement_id"], t, e, d, total))

if issues:
    print(f"Word count issues ({len(issues)}):")
    for iid, t, e, d, total in issues:
        print(f"  {iid}: trad={t} evo={e} task={d} total={total}")
else:
    print("All rows within 200-350 word range.")

# forbidden term scan
forbidden = ["أنثروبوصوفيا", "Steiner", "المسيح", "Christ", "إيثيري", "اللوسيفير", "الأهرمان", "Anthroposophy", "الأنثروبوصوفيا"]
for r in out_rows:
    combined = r["traditional_meaning_ar"] + " " + r["evolutionary_meaning_ar"] + " " + r["developmental_task_ar"]
    for term in forbidden:
        if term in combined:
            print(f"FORBIDDEN '{term}' in {r['placement_id']}")

# em-dash scan in content fields
for r in out_rows:
    for field in ["traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar"]:
        if "—" in r[field]:
            print(f"EM-DASH in {r['placement_id']} field {field}")

print(f"Output: {OUTPUT_CSV}")
