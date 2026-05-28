#!/usr/bin/env python3
"""
Merge all 33 filled chunk CSVs into placements_master_filled.csv
Run after all chunks in chunks_filled/ are complete.
"""
import csv
import os
import sys
from pathlib import Path

CHUNKS_DIR = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled")
MASTER_SRC = Path("/Users/hadi/Downloads/sukoon-tmp/templates/placements_master.csv")
OUTPUT = Path("/Users/hadi/Downloads/sukoon-tmp/templates/placements_master_filled.csv")

EXPECTED_CHUNKS = [
    "T01a_PlanetInSign_personal.csv",
    "T01b_PlanetInSign_social.csv",
    "T01c_PlanetInSign_outer.csv",
    "T01d_PlanetInSign_karmic.csv",
    "T02a_PlanetInHouse_personal.csv",
    "T02b_PlanetInHouse_social.csv",
    "T02c_PlanetInHouse_outer.csv",
    "T02d_PlanetInHouse_karmic.csv",
    "T03_PlanetConjunctAngle.csv",
    "T04_PlanetConjunctPlanet.csv",
    "T05a_SignOnCusp_1to6.csv",
    "T05b_SignOnCusp_7to12.csv",
    "T06_07_08_misc.csv",
    "T09_Conjunction_aspects.csv",
    "T10_Opposition.csv",
    "T11_Square.csv",
    "T12_Trine.csv",
    "T13_Sextile.csv",
    "T14_18_patterns.csv",
    "T19_22_nodes.csv",
    "T23a_Chiron_signsAriesVirgo.csv",
    "T23b_Chiron_signsLibraPisces.csv",
    "T24a_Pluto_signsAriesVirgo.csv",
    "T24b_Pluto_signsLibraPisces.csv",
    "T25a_Saturn_signsAriesVirgo.csv",
    "T25b_Saturn_signsLibraPisces.csv",
    "T26a_Uranus_signsAriesVirgo.csv",
    "T26b_Uranus_signsLibraPisces.csv",
    "T27a_Neptune_signsAriesVirgo.csv",
    "T27b_Neptune_signsLibraPisces.csv",
    "T28_35_returns.csv",
    "T36_39_relational.csv",
    "T40_48_esoteric.csv",
]

FIELDNAMES = [
    "template_num", "template_name", "category", "body_a", "body_b_or_sign",
    "house_or_aspect", "placement_id", "focus_theme",
    "traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar",
    "key_references", "status", "content_file"
]

def check_missing():
    missing = []
    for chunk in EXPECTED_CHUNKS:
        p = CHUNKS_DIR / chunk
        if not p.exists():
            missing.append(chunk)
    return missing

def load_chunk(path):
    rows = []
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def count_arabic_words(text):
    return len(text.split()) if text else 0

def validate_row(row, source):
    issues = []
    trad = row.get("traditional_meaning_ar", "")
    evo = row.get("evolutionary_meaning_ar", "")
    dev = row.get("developmental_task_ar", "")
    total = count_arabic_words(trad) + count_arabic_words(evo) + count_arabic_words(dev)
    if total < 200:
        issues.append(f"UNDER 200 words ({total})")
    if total > 350:
        issues.append(f"OVER 350 words ({total})")
    if row.get("status") != "filled":
        issues.append(f"status={row.get('status')}")
    # Check for English planet names in Arabic content
    english_names = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
                     "Uranus", "Neptune", "Pluto", "Chiron", "Aries", "Taurus",
                     "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
                     "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    combined = trad + " " + evo + " " + dev
    for name in english_names:
        if name in combined:
            issues.append(f"English name '{name}' in Arabic content")
    if issues:
        pid = row.get("placement_id", "?")
        print(f"  WARN [{source}] {pid}: {'; '.join(issues)}")
    return issues

def main():
    print("=== Sukoon placements merge ===\n")

    missing = check_missing()
    if missing:
        print(f"MISSING {len(missing)} chunks:")
        for m in missing:
            print(f"  - {m}")
        sys.exit(1)

    all_rows = []
    total_issues = 0

    for chunk_name in EXPECTED_CHUNKS:
        path = CHUNKS_DIR / chunk_name
        rows = load_chunk(path)
        chunk_issues = 0
        for row in rows:
            issues = validate_row(row, chunk_name)
            if issues:
                chunk_issues += 1
        all_rows.extend(rows)
        status = "OK" if chunk_issues == 0 else f"{chunk_issues} issues"
        print(f"  {chunk_name}: {len(rows)} rows — {status}")
        total_issues += chunk_issues

    print(f"\nTotal rows: {len(all_rows)}")
    print(f"Total issues: {total_issues}")

    # Write output atomically
    tmp = OUTPUT.with_suffix(".tmp")
    with open(tmp, "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(all_rows)
    os.replace(tmp, OUTPUT)

    print(f"\nWritten: {OUTPUT}")
    print(f"File size: {OUTPUT.stat().st_size / 1024:.0f} KB")

    if total_issues > 0:
        print(f"\nWARNING: {total_issues} rows have issues. Review above.")
    else:
        print("\nAll rows pass validation. Ready for deployment.")

if __name__ == "__main__":
    main()
