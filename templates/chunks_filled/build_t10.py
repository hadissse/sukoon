#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate T10_Opposition.csv (opposition aspects, 180°) by filling Arabic
content into the pending chunk. Voice mirrors T09 (conjunction) but adapted
to opposition: karmic polarity, mirror dynamic, projection, integration
across a divide.
"""

import csv
from pathlib import Path

CHUNK_IN = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks/T10_Opposition.csv")
CHUNK_OUT = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled/T10_Opposition.csv")

# Arabic name lookup. The CSV body_a / body_b_or_sign columns already use
# Arabic names. We add normalized keys for safe lookup.
AR_NAMES = {
    "الشمس": "الشمس",
    "القمر": "القمر",
    "عطارد": "عطارد",
    "الزهرة": "الزهرة",
    "المريخ": "المريخ",
    "المشتري": "المشتري",
    "زحل": "زحل",
    "أورانوس": "أورانوس",
    "نبتون": "نبتون",
    "بلوتو": "بلوتو",
    "كيرون": "كيرون",
    "العقدة الشمالية": "العقدة الشمالية",
    "العقدة الجنوبية": "العقدة الجنوبية",
}

# Principle phrase (what the planet IS, used in traditional reading).
PRINCIPLE = {
    "الشمس": "جوهر الهوية وإرادة الأنا المركزية",
    "القمر": "الحياة الشعورية والذاكرة العاطفية والحاجة إلى الانتماء",
    "عطارد": "العقل اليقظ والكلمة والربط بين المعاني",
    "الزهرة": "الحب والجمال وقيمة الأشياء والانجذاب",
    "المريخ": "الإرادة الفاعلة والرغبة والشجاعة وفعل القرار",
    "المشتري": "التوسع والمعنى والإيمان والبحث الفلسفي",
    "زحل": "البنية والحد والزمن والمسؤولية والانضباط",
    "أورانوس": "الكسر والومضة والحرية والأصالة الفردية",
    "نبتون": "الإذابة والحلم والشفافية والاتصال بما هو وراء الحدود",
    "بلوتو": "الموت والولادة والسلطة العميقة والتحول الجذري",
    "كيرون": "الجرح الذي لا يندمل ومنه يفيض الشفاء للآخر",
    "العقدة الشمالية": "اتجاه النمو في هذه الحياة والأرض التي لم تُسكن بعد",
    "العقدة الجنوبية": "ما حُمل من حيوات سابقة من ملكات وعادات",
}

# Evolutionary depth-phrase (the soul/karmic register of the planet).
EVO = {
    "الشمس": "نواة الذات التي تختار أن تتجسد لتصبح حاضرة في العالم",
    "القمر": "السجل العاطفي الذي تحمله النفس من حيوات سابقة وعادات الأمان القديمة",
    "عطارد": "الوظيفة الرسولية للذهن التي تنقل ما تدركه الروح إلى لغة قابلة للتداول",
    "الزهرة": "القدرة على بناء الصلة الحية بين الكائن وما يحبه ويقدّره",
    "المريخ": "القوة التي تحول النية إلى حركة ملموسة في العالم المادي",
    "المشتري": "الانفتاح الذي يربط الفرد بنظام أكبر من الكون والمعنى",
    "زحل": "حارس العتبة الذي يفرض على النفس أن تتجسد في إطار وتلتزم بثمن التجسد",
    "أورانوس": "القوة التي توقظ الفرد من تواطؤ الجماعة وتطالبه بصوته الحر",
    "نبتون": "الانحلال الذي يهيّئ النفس للاتصال بطبقات الروح خارج صورتها المنفصلة",
    "بلوتو": "القوة التي تهدم الصور البالية في النفس لتسمح بميلاد طبقة جديدة من الكائن",
    "كيرون": "العتبة بين النظام الأرضي والنظام الأبعد حيث يتحول الألم القديم إلى ينبوع خدمة",
    "العقدة الشمالية": "المهمة التي اختارتها النفس قبل التجسد بوصفها حافة تطورها",
    "العقدة الجنوبية": "الأرض المألوفة التي يجب أن تُستوعب وتُترك لا أن تُكرر",
}

# Rigid-distortion phrase (الخطر المتصلب) per planet.
RIGID = {
    "الشمس": "تحجر صورة ذاتية مغلقة لا تسمح بتدفق حي من القلب",
    "القمر": "تشبث بأنماط شعورية موروثة لا تخدم الحاضر",
    "عطارد": "جمود الفكر في صيغ منطقية باردة منقطعة عن الحياة",
    "الزهرة": "تجميد القيم في صورة جمالية أو علاقاتية مغلقة",
    "المريخ": "عدوانية متيبسة أو كبت يحوّل الإرادة إلى مرض داخلي",
    "المشتري": "عقيدة جامدة تختزل المعنى في صيغة واحدة",
    "زحل": "انكماش خوفي وقمع يقطع الحيوية باسم الواجب",
    "أورانوس": "تمرد قسري آلي يكسر فقط من أجل الكسر",
    "نبتون": "هروب وضباب وفقدان للحدود يمحو الذات",
    "بلوتو": "هوس بالسيطرة وتشبث بالقديم خوفاً من الفناء",
    "كيرون": "تجمد في صورة الضحية المزمنة",
    "العقدة الشمالية": "رفض الجديد والعودة إلى المعتاد",
    "العقدة الجنوبية": "إدمان نفسي على ما عرفته الروح سابقاً",
}

# Inflated-distortion phrase (الخطر الوهمي) per planet.
INFLATED = {
    "الشمس": "تضخم الأنا حتى تبتلع كل شيء وتتحول إلى مركز وهمي",
    "القمر": "انجراف في موجات عاطفية بلا مرساة واعية",
    "عطارد": "تشتت ذهني يقفز بين الأفكار دون استقرار",
    "الزهرة": "ذوبان في الجاذبية حتى فقدان الذات في الآخر",
    "المريخ": "اندفاع بلا تمييز يحرق ما حوله",
    "المشتري": "تفاؤل وهمي وتضخم يفقد التماس مع الواقع",
    "زحل": "ادعاء سلطة وحكمة قبل أوانهما",
    "أورانوس": "انفصال فوقي يعتقد نفسه فوق كل قانون",
    "نبتون": "ادعاء روحاني وتماهٍ مع المنقذ الكوني",
    "بلوتو": "إغراق في الظلال والهاوية بوصفهما هوية",
    "كيرون": "ادعاء دور المعالج المخلِّص دون مرور بالعمل الداخلي",
    "العقدة الشمالية": "قفز إلى المستقبل دون دفع ثمن التحول",
    "العقدة الجنوبية": "استثمار في موهبة قديمة بوصفها كل الهوية",
}

# References: pick author/title combos per planet involvement.
def references_for(a, b):
    refs = []
    pair = {a, b}
    # Saturn cases get Greene.
    if "زحل" in pair:
        refs.append("Greene — Saturn: A New Look at an Old Devil")
    # Chiron cases get Reinhart.
    if "كيرون" in pair:
        refs.append("Reinhart — Chiron and the Healing Journey")
    # Nodes / Pluto / outer karmic cases get Arroyo.
    if pair & {"العقدة الشمالية", "العقدة الجنوبية", "بلوتو", "نبتون"}:
        refs.append("Arroyo — Astrology, Karma & Transformation")
    # Outer / hard aspect interpretive: Hand for nodes & outer planets.
    if pair & {"العقدة الشمالية", "العقدة الجنوبية", "أورانوس", "نبتون", "بلوتو", "كيرون"}:
        if "Hand — Horoscope Symbols" not in refs:
            refs.append("Hand — Horoscope Symbols")
    # Inner-planet midpoint / synastry orientation gets Ebertin sometimes.
    inner = {"الشمس", "القمر", "عطارد", "الزهرة", "المريخ"}
    if pair <= inner:
        refs.append("Ebertin — Combination of Stellar Influences")
    # Always anchor with at least one of Tompkins / Tierney.
    # Prefer Tierney for opposition (he wrote on aspect dynamics).
    if not refs:
        refs.append("Tierney — Dynamics of Aspect Analysis")
        refs.append("Tompkins — Aspects in Astrology")
    else:
        # Add one anchor.
        anchor = "Tierney — Dynamics of Aspect Analysis"
        if anchor not in refs:
            refs.append(anchor)
        # If only 2 so far, optionally add Tompkins for variety.
        if len(refs) < 3 and "Tompkins — Aspects in Astrology" not in refs:
            # Add Tompkins only when there's room.
            if len(refs) == 2:
                refs.append("Tompkins — Aspects in Astrology")
    # Cap at 3.
    return "; ".join(refs[:3])


def trad(a, b):
    pa = PRINCIPLE[a]
    pb = PRINCIPLE[b]
    return (
        f"مقابلة {a} مع {b} تضع {pa} في مواجهة مباشرة مع {pb} على طرفي محور واحد، "
        f"فيرى كل قطب الآخر مرآة لما يحمله في عمقه. يقرأ التقليد هذا التركيب توتراً "
        f"قطبياً يطلب التكامل عبر المسافة، إذ تسعى كل قوة إلى استكمال ذاتها بالقوة "
        f"المقابلة وتنفر منها في الآن نفسه. يعيش الشخص طرفاً من المحور داخله بينما "
        f"يلتقي الطرف الآخر خارجاً، في الشريك أو الخصم الذي يفرض ما لم يُعترف به. "
        f"التوتر محور يُعاش بوعي حتى يكشف كل قطب الكمال في الآخر."
    )


def evo(a, b):
    ea = EVO[a]
    eb = EVO[b]
    return (
        f"على المستوى التطوري، تشير المقابلة إلى أن النفس جاءت وقد فُصلت فيها قوتا "
        f"{a} و{b} إلى قطبين، فحُمل كل قطب بمعزل عن الآخر في طبقات السيرة الكرمية. "
        f"يلتقي {ea} في طرف من المحور، ويلتقي {eb} في الطرف المقابل، وتحمل النفس "
        f"ميلاً قديماً إلى الاستيطان في أحد القطبين وإسقاط الآخر على العالم. ما يُنفى "
        f"في الذات يظهر في الشريك أو الخصم حتى يُلتقط الدرس. تطلب الكرما أن يُستعاد "
        f"القطب المُسقَط ويُعترف به نصفاً تُرك في الظل، فيعود المحور إلى داخل الكائن."
    )


def task(a, b):
    pa = PRINCIPLE[a]
    pb = PRINCIPLE[b]
    ra = RIGID[a]
    rb = RIGID[b]
    ia = INFLATED[a]
    ib = INFLATED[b]
    return (
        f"المهمة أن يحمل الإنسان {pa} و{pb} طرفي محور واحد، فيستعيد ما يُسقطه على "
        f"الآخر ويعترف به نصفاً من ذاته. الخطر المتصلب يظهر حين يتمسك بقطب ويرفض "
        f"المقابل، فيغرق في {ra} ويرى {rb} في الآخرين دون أن يراه في نفسه. الخطر "
        f"الوهمي يظهر حين يحسم التوتر بالقفز إلى قطب والمبالغة فيه، فيقع في {ia} أو "
        f"في {ib} ويخلط حدة الانفعال بالحقيقة. التوازن الحي وعي يحمل القطبين على "
        f"مسافة واحدة من القلب، فيتحرك بينهما بحرية ويصير المحور موقعه الواعي."
    )


def main():
    with CHUNK_IN.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    assert len(rows) == 78, f"Expected 78 rows, got {len(rows)}"

    for row in rows:
        a = row["body_a"].strip()
        b = row["body_b_or_sign"].strip()
        assert a in PRINCIPLE, f"Unknown body_a: {a}"
        assert b in PRINCIPLE, f"Unknown body_b: {b}"
        row["traditional_meaning_ar"] = trad(a, b)
        row["evolutionary_meaning_ar"] = evo(a, b)
        row["developmental_task_ar"] = task(a, b)
        row["key_references"] = references_for(a, b)
        row["status"] = "filled"

    CHUNK_OUT.parent.mkdir(parents=True, exist_ok=True)
    with CHUNK_OUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Word-count sanity check on a sample row.
    sample = rows[0]
    total_words = sum(
        len(sample[col].split())
        for col in ("traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar")
    )
    print(f"Wrote {len(rows)} rows to {CHUNK_OUT}")
    print(f"Sample row T10_Sun_Moon total words: {total_words}")

    # Verify constraints across all rows.
    min_w = 10**9
    max_w = 0
    for row in rows:
        t = sum(
            len(row[col].split())
            for col in ("traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar")
        )
        min_w = min(min_w, t)
        max_w = max(max_w, t)
        # No em-dash inside the three content columns.
        for col in ("traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar"):
            assert "—" not in row[col], f"Em-dash found in {row['placement_id']} / {col}"
        # No English planet names in Arabic prose.
        forbidden_en = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter",
                        "Saturn", "Uranus", "Neptune", "Pluto", "Chiron",
                        "North Node", "South Node"]
        for col in ("traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar"):
            for term in forbidden_en:
                assert term not in row[col], f"English term '{term}' in {row['placement_id']} / {col}"
    print(f"Min total words: {min_w}, Max: {max_w}")


if __name__ == "__main__":
    main()
