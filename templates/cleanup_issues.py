#!/usr/bin/env python3
"""
Fix two classes of issues in chunks_filled/:
1. English planet/sign names in Arabic content columns → replace with Arabic
2. Word-count overflows in T25b (480-500 words) and T26b (351-375 words) → trim
"""
import csv
import os
import re
from pathlib import Path

CHUNKS_DIR = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled")

FIELDNAMES = [
    "template_num", "template_name", "category", "body_a", "body_b_or_sign",
    "house_or_aspect", "placement_id", "focus_theme",
    "traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar",
    "key_references", "status", "content_file"
]

# English → Arabic replacements for use inside Arabic prose
EN_TO_AR = {
    # Planets
    "Sun": "الشمس",
    "Moon": "القمر",
    "Mercury": "عطارد",
    "Venus": "الزهرة",
    "Mars": "المريخ",
    "Jupiter": "المشتري",
    "Saturn": "زحل",
    "Uranus": "أورانوس",
    "Neptune": "نبتون",
    "Pluto": "بلوتو",
    "Chiron": "كيرون",
    "North Node": "العقدة الشمالية",
    "South Node": "العقدة الجنوبية",
    # Signs
    "Aries": "الحمل",
    "Taurus": "الثور",
    "Gemini": "الجوزاء",
    "Cancer": "السرطان",
    "Leo": "الأسد",
    "Virgo": "العذراء",
    "Libra": "الميزان",
    "Scorpio": "العقرب",
    "Sagittarius": "القوس",
    "Capricorn": "الجدي",
    "Aquarius": "الدلو",
    "Pisces": "الحوت",
}

CONTENT_COLS = ["traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar"]


def replace_english_names(text):
    """Replace English planet/sign names with Arabic equivalents in Arabic prose."""
    for en, ar in EN_TO_AR.items():
        # Word-boundary match, case-sensitive
        text = re.sub(r'\b' + re.escape(en) + r'\b', ar, text)
    return text


def trim_to_target(text, max_words=320):
    """Trim text to approximately max_words by cutting whole sentences."""
    words = text.split()
    if len(words) <= max_words:
        return text
    # Cut at sentence boundary (Arabic period/full stop)
    sentences = re.split(r'(?<=[.،؟!])\s+', text)
    result = []
    count = 0
    for sent in sentences:
        w = len(sent.split())
        if count + w > max_words and result:
            break
        result.append(sent)
        count += w
    return ' '.join(result)


def process_file(path, fix_english=False, fix_wordcount=False, target_per_col=None):
    rows = []
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if fix_english:
                for col in CONTENT_COLS:
                    row[col] = replace_english_names(row.get(col, ''))
            if fix_wordcount and target_per_col:
                for col, max_w in zip(CONTENT_COLS, target_per_col):
                    row[col] = trim_to_target(row.get(col, ''), max_w)
            rows.append(row)

    tmp = path.with_suffix('.tmp')
    with open(tmp, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)
    os.replace(tmp, path)
    print(f"Fixed: {path.name} ({len(rows)} rows)")


def verify_file(path):
    issues = 0
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            combined = ' '.join(row.get(c, '') for c in CONTENT_COLS)
            total = len(combined.split())
            if total > 350:
                issues += 1
            for en in EN_TO_AR:
                if re.search(r'\b' + re.escape(en) + r'\b', combined):
                    issues += 1
                    break
    return issues


# Files with English name leakage (aspects T09-T13 + T10-T13 etc.)
english_leak_files = [
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
    "T03_PlanetConjunctAngle.csv",
    "T04_PlanetConjunctPlanet.csv",
    "T05a_SignOnCusp_1to6.csv",
    "T05b_SignOnCusp_7to12.csv",
    "T28_35_returns.csv",
    "T36_39_relational.csv",
    "T40_48_esoteric.csv",
]

print("=== Fixing English name leakage ===")
for fname in english_leak_files:
    p = CHUNKS_DIR / fname
    if p.exists():
        process_file(p, fix_english=True)

# T25b: way over (480-500 words) — trim each column hard
print("\n=== Trimming T25b word counts (480-500 → ~280 target) ===")
process_file(
    CHUNKS_DIR / "T25b_Saturn_signsLibraPisces.csv",
    fix_english=True,
    fix_wordcount=True,
    target_per_col=[95, 110, 95]  # ~300 total
)

# T26b: slightly over (350-375) — light trim
print("\n=== Trimming T26b word counts (350-375 → ~310 target) ===")
process_file(
    CHUNKS_DIR / "T26b_Uranus_signsLibraPisces.csv",
    fix_english=True,
    fix_wordcount=True,
    target_per_col=[100, 115, 100]  # ~315 total
)

# Also fix English in remaining files that might have it
print("\n=== Fixing English in remaining files ===")
for p in CHUNKS_DIR.glob("*.csv"):
    if p.name not in english_leak_files and "T25b" not in p.name and "T26b" not in p.name:
        process_file(p, fix_english=True)

print("\n=== Post-fix verification ===")
total_issues = 0
for p in sorted(CHUNKS_DIR.glob("*.csv")):
    n = verify_file(p)
    if n:
        print(f"  STILL HAS ISSUES: {p.name} ({n} rows)")
        total_issues += n

if total_issues == 0:
    print("All files clean.")
else:
    print(f"\nRemaining issues: {total_issues} rows")
