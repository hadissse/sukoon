#!/usr/bin/env python3
"""
Import placements_master_filled.csv → src/content/placements.ts additions.

Reads the filled CSV and outputs TypeScript entries for content that is
MISSING from placements.ts. Existing entries are never overwritten.

Run:  python3 templates/import_to_placements.py
Output: templates/placements_additions.ts  (review before merging)
"""
import csv
import re
import sys
from pathlib import Path

CSV_PATH = Path(__file__).parent / "placements_master_filled.csv"
TS_PATH  = Path(__file__).parent.parent / "src/content/placements.ts"
OUT_PATH = Path(__file__).parent / "placements_additions.ts"

# ── Arabic → English slug maps ──────────────────────────────────────────────
PLANET_MAP = {
    'الشمس': 'sun',
    'القمر': 'moon',
    'عطارد': 'mercury',
    'الزهرة': 'venus',
    'المريخ': 'mars',
    'المشتري': 'jupiter',
    'زحل': 'saturn',
    'أورانوس': 'uranus',
    'نبتون': 'neptune',
    'بلوتو': 'pluto',
    'كيرون': 'chiron',
    'شمال القمر': 'northNode',
    'العقدة الشمالية': 'northNode',
    'جنوب القمر': 'southNode',
    'العقدة الجنوبية': 'southNode',
}

SIGN_MAP = {
    'الحمل': 'aries',
    'الثور': 'taurus',
    'الجوزاء': 'gemini',
    'السرطان': 'cancer',
    'الأسد': 'leo',
    'العذراء': 'virgo',
    'الميزان': 'libra',
    'العقرب': 'scorpio',
    'القوس': 'sagittarius',
    'الجدي': 'capricorn',
    'الدلو': 'aquarius',
    'الحوت': 'pisces',
}

SIGN_Q_MAP = {
    'aries':       'ما الذي تبدأه الآن دون أن تعرف كيف سينتهي؟',
    'taurus':      'ما الذي تتمسّك به لأنّه يغذّيك — لا لأنّك تخاف من الفراغ بعده؟',
    'gemini':      'ما السؤال الذي تدور حوله هذه الأيام دون أن تجد إجابة؟',
    'cancer':      'من تحتاج أن تُحاط به الآن — وهل تسمح لنفسك بذلك؟',
    'leo':         'في أيّ لحظة أضأت هذا الأسبوع دون أن تنتظر إذنًا؟',
    'virgo':       'أين تبحث عن الكمال في مكان يكفيه الوجود؟',
    'libra':       'ما الذي تُرجئه خوفًا من إخلال التوازن؟',
    'scorpio':     'ما الذي يحتاج أن يتحوّل فيك — وأنت تعرف ذلك؟',
    'sagittarius': 'ما المعنى الذي يحرّكك الآن فعلًا؟',
    'capricorn':   'ما الذي تبنيه — ولمن؟',
    'aquarius':    'كيف تخدم ما هو أكبر منك دون أن تفقد نفسك؟',
    'pisces':      'ما الحدّ الفاصل بينك وبين الآخر الآن؟',
}

HOUSE_Q_MAP = {
    1:  'ما الذي يراه الناس فيك قبل أن تتكلّم؟',
    2:  'ما الذي تُقدّره في نفسك فعلًا — بعيدًا عمّا تملكه؟',
    3:  'ما الذي تحتاج أن تقوله — ببطء أكثر؟',
    4:  'أين تجد أرضًا صلبة تنطلق منها؟',
    5:  'ما الذي تخلقه حين لا يراك أحد؟',
    6:  'كيف يخدم يومك الأصغر المشروع الأكبر؟',
    7:  'ما الذي يعكسه الآخر فيك الآن؟',
    8:  'ما الذي تخشى أن تعرفه عن نفسك؟',
    9:  'ما المعتقد الذي آن أوان مراجعته؟',
    10: 'ما الأثر الذي تريد أن تتركه — ليس ما تريد أن تحقّقه؟',
    11: 'كيف تنتمي إلى جماعة دون أن تذوب فيها؟',
    12: 'ما الذي تحمله في صمت — ويستحقّ أن يُرى؟',
}

ASPECT_TYPE_MAP = {
    'Conjunction (0°)':  'conjunction',
    'Opposition (180°)': 'opposition',
    'Square (90°)':      'square',
    'Trine (120°)':      'trine',
    'Sextile (60°)':     'sextile',
    'Planet Conjunct Planet': 'conjunction',
}

ASPECT_Q = {
    'conjunction': 'كيف تجمع هاتين الطاقتين في اتجاه واحد؟',
    'opposition':  'ما الجسر الذي تبنيه بين هذين القطبين؟',
    'square':      'أين يدفعك هذا التوتّر نحو نموّ حقيقي؟',
    'trine':       'كيف تستعمل هذه السهولة بدل أن تأخذها مسلّمًا؟',
    'sextile':     'ما الفرصة التي تفتحها هذه الطاقة الآن؟',
}


def escape_ts(text: str) -> str:
    """Escape text for TypeScript template literal / single-quoted string."""
    text = text.strip()
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    return text


def ts_entry(key: str, obs: str, mean: str, shadow: str, q: str,
             practice: str = '', cycles: list = None) -> str:
    lines = [f"  '{key}': {{"]
    lines.append(f"    obs: '{escape_ts(obs)}',")
    lines.append(f"    mean: '{escape_ts(mean)}',")
    lines.append(f"    shadow: '{escape_ts(shadow)}',")
    lines.append(f"    q: '{escape_ts(q)}',")
    if practice:
        lines.append(f"    practice: '{escape_ts(practice)}',")
    if cycles:
        cyc_str = ', '.join(f"['{escape_ts(k)}', '{escape_ts(v)}']" for k, v in cycles)
        lines.append(f"    cycles: [{cyc_str}],")
    lines.append("  },")
    return '\n'.join(lines)


def house_num_from_str(s: str):
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else None


def load_existing_keys(ts_path: Path) -> set:
    src = ts_path.read_text(encoding='utf-8')
    return set(re.findall(r"'([a-z][^']+)':", src))


def main():
    if not CSV_PATH.exists():
        print(f"ERROR: {CSV_PATH} not found")
        sys.exit(1)

    existing = load_existing_keys(TS_PATH)
    print(f"Existing placements.ts keys: {len(existing)}")

    rows = []
    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    print(f"CSV rows: {len(rows)}")

    new_entries = {}   # key → ts_entry string
    skipped = []
    unmapped = []

    for row in rows:
        tname    = row['template_name']
        body_a   = row['body_a'].strip()
        body_b   = row['body_b_or_sign'].strip()
        house_or = row['house_or_aspect'].strip()
        trad     = row['traditional_meaning_ar'].strip()
        evo      = row['evolutionary_meaning_ar'].strip()
        dev      = row['developmental_task_ar'].strip()

        if not trad or not evo or not dev:
            continue

        # ── T01: Planet in Sign ──────────────────────────────────────────────
        if tname == 'Planet in Sign':
            planet = PLANET_MAP.get(body_a)
            sign   = SIGN_MAP.get(body_b)
            if not planet or not sign:
                unmapped.append(f"T01: planet='{body_a}' sign='{body_b}'")
                continue
            key = f'planet:{planet}:{sign}'
            q   = SIGN_Q_MAP.get(sign, 'ما الذي تتعلّمه من هذه الوضعية الآن؟')

        # ── T05: Sign on House Cusp ──────────────────────────────────────────
        elif tname == 'Sign on House Cusp':
            sign    = SIGN_MAP.get(body_a)
            house_n = house_num_from_str(house_or)
            if not sign or not house_n:
                unmapped.append(f"T05: sign='{body_a}' house='{house_or}'")
                continue
            key = f'house-sign:{sign}:{house_n}'
            q   = HOUSE_Q_MAP.get(house_n, 'ما الذي يكشفه هذا البيت عن طريقتك في الحياة؟')

        # ── T09–T13 & T04: Aspects ──────────────────────────────────────────
        elif tname in ASPECT_TYPE_MAP:
            p1 = PLANET_MAP.get(body_a)
            p2 = PLANET_MAP.get(body_b)
            if not p1 or not p2:
                unmapped.append(f"{tname}: a='{body_a}' b='{body_b}'")
                continue
            atype = ASPECT_TYPE_MAP[tname]
            key   = f'aspect:{p1}-{p2}:{atype}'
            q     = ASPECT_Q.get(atype, 'كيف تعمل مع هذه الطاقة المشتركة؟')

        # ── T02: Planet in House ─────────────────────────────────────────────
        elif tname == 'Planet in House':
            planet  = PLANET_MAP.get(body_a)
            house_n = house_num_from_str(house_or)
            if not planet or not house_n:
                unmapped.append(f"T02: planet='{body_a}' house='{house_or}'")
                continue
            key = f'planet-house:{planet}:{house_n}'
            q   = HOUSE_Q_MAP.get(house_n, 'كيف يعمل هذا الكوكب في هذا الميدان؟')

        else:
            # Other types not yet wired to the app — skip for now
            continue

        if key in existing or key in new_entries:
            skipped.append(key)
            continue

        entry = ts_entry(key, trad, evo, dev, q)
        new_entries[key] = entry

    print(f"\nSkipped (already exist): {len(skipped)}")
    print(f"Unmapped rows: {len(unmapped)}")
    for u in unmapped[:10]:
        print(f"  {u}")
    print(f"\nNew entries to add: {len(new_entries)}")

    # Group by type for the output file
    groups = {
        'planet': [],
        'planet-house': [],
        'house-sign': [],
        'aspect': [],
        'other': [],
    }
    for key, entry in sorted(new_entries.items()):
        prefix = key.split(':')[0]
        if prefix in groups:
            groups[prefix].append((key, entry))
        else:
            groups['other'].append((key, entry))

    lines = [
        "// AUTO-GENERATED by templates/import_to_placements.py",
        "// Review each section and merge into src/content/placements.ts",
        "// Keys are ONLY entries not already in placements.ts",
        "",
    ]

    for gname, gentries in groups.items():
        if not gentries:
            continue
        lines.append(f"// ── {gname} ({len(gentries)} entries) ──────────────────────────────")
        for key, entry in gentries:
            lines.append(f"\n  // {key}")
            lines.append(entry)
        lines.append("")

    OUT_PATH.write_text('\n'.join(lines), encoding='utf-8')
    print(f"\nWritten to: {OUT_PATH}")
    print(f"Size: {OUT_PATH.stat().st_size / 1024:.0f} KB")

    # Summary by group
    print("\nBreakdown:")
    for gname, gentries in groups.items():
        if gentries:
            print(f"  {gname}: {len(gentries)} new entries")


if __name__ == '__main__':
    main()
