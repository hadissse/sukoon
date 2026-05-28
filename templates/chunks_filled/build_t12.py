#!/usr/bin/env python3
"""Build T12_Trine.csv from chunks/T12_Trine.csv."""
import csv
from pathlib import Path

SRC = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks/T12_Trine.csv")
DST = Path("/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled/T12_Trine.csv")

# Arabic name normalization (the source already uses Arabic in body_a/body_b)
# Principle phrase per body (used in traditional_meaning_ar)
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

# Karmic / evolutionary resource phrase per body (what was "earned" that flows)
KARMIC = {
    "الشمس": "نواة ذاتٍ راسخة تعرف كيف تتجسد في إرادة مركزية واضحة",
    "القمر": "حساسية شعورية مصقولة وذاكرة باطنية تعرف ما تحتاجه النفس لتستقر",
    "عطارد": "ذكاء متيقظ وقدرة على الربط بين المعاني وصياغتها في كلمة",
    "الزهرة": "ذوق ناضج وحس بالقيمة وقدرة على بناء صلات حية",
    "المريخ": "إرادة فاعلة مدربة على تحويل النية إلى حركة محسوبة",
    "المشتري": "ثقة بالمعنى ورؤية تتسع وتربط الفرد بنظام أكبر",
    "زحل": "انضباط داخلي وقدرة على البناء في الزمن وتحمل ثمن التجسد",
    "أورانوس": "حرية داخلية وقدرة على رؤية ما هو جديد وأصيل قبل غيره",
    "نبتون": "نفاذية روحية وقدرة على الاتصال بما هو وراء الحدود المرئية",
    "بلوتو": "قدرة على الدخول إلى الأعماق والخروج منها متجدداً",
    "كيرون": "حكمة الجرح التي تتحول إلى ينبوع شفاء للآخر",
    "العقدة الشمالية": "حدس بالاتجاه الذي تسير إليه النفس في هذه الحياة",
    "العقدة الجنوبية": "ملكة قديمة محكمة تأتي من أرضٍ سكنتها النفس طويلاً",
}

# Rigid danger per body (الخطر المتصلب) — when the trine ease hardens into habit
RIGID = {
    "الشمس": "تصلب صورة الذات في وضعها المريح وعدم اختبارها في الواقع",
    "القمر": "ركون إلى الراحة العاطفية القديمة ورفض ما يزعزع المألوف",
    "عطارد": "اكتفاء بسلاسة الكلام دون اختبار صدقه أو عمقه",
    "الزهرة": "إدمان الجمال والتناغم السطحي على حساب الحقيقة الخشنة",
    "المريخ": "إنفاق الطاقة الفاعلة في مسارات سهلة لا تواجه مقاومة حقيقية",
    "المشتري": "اطمئنان إلى رؤية متسعة لم تُختبر بضيق الواقع",
    "زحل": "اتكاء على بنية قديمة محكمة ورفض ما يطلب بناءً جديداً",
    "أورانوس": "تكرار شكل من أشكال التميز الفردي حتى يصبح هو نفسه قالباً",
    "نبتون": "ذوبان لطيف في الأجواء الروحية دون التزام بصورة ملموسة",
    "بلوتو": "استخدام النفاذ إلى الأعماق دون دفع كامل ثمن التحول",
    "كيرون": "ارتداء صورة المعالج الحاذق دون مراجعة الجرح الخاص",
    "العقدة الشمالية": "اعتقاد أن الاتجاه قد تحقق لمجرد أنه واضح في الذهن",
    "العقدة الجنوبية": "استرسال في الموهبة القديمة بوصفها كل الطريق",
}

# Inflated danger per body (الخطر الوهمي) — using the ease as escape / inflation
INFLATED = {
    "الشمس": "تضخم بصورة ذاتٍ موهوبة بطبيعتها لا تحتاج إلى عمل",
    "القمر": "انجراف عاطفي بوصفه إلهاماً لا يخطئ",
    "عطارد": "ثقة مفرطة بالعقل تجعله يدّعي ما لم يعِشه",
    "الزهرة": "ادعاء أن الجاذبية وحدها دليل على القيمة",
    "المريخ": "اندفاع يظن نفسه شجاعة لمجرد أنه يجد منفذاً سهلاً",
    "المشتري": "تفاؤل وهمي وتضخم في الرؤية يفقد التماس مع الواقع",
    "زحل": "ادعاء سلطة وحكمة قبل أوانهما بحجة الاستحقاق الفطري",
    "أورانوس": "انفصال فوقي يعتقد نفسه فوق كل قانون لمجرد أنه يومض",
    "نبتون": "ادعاء روحاني وتماهٍ مع رسالة كونية لم تُختبر",
    "بلوتو": "إغراء بالقوة العميقة دون مساءلة لاستخدامها",
    "كيرون": "ادعاء دور المخلِّص الجريح دون مرور بالعمل الداخلي",
    "العقدة الشمالية": "قفز إلى صورة المستقبل دون دفع ثمن الانتقال",
    "العقدة الجنوبية": "استثمار في المجد القديم بوصفه كل الهوية",
}

# References per pair (varied by what the pair calls for)
def refs_for(a, b):
    pair = {a, b}
    if "زحل" in pair:
        return "Greene — Saturn: A New Look at an Old Devil; Tompkins — Aspects in Astrology"
    if "كيرون" in pair:
        return "Reinhart — Chiron and the Healing Journey; Tierney — Dynamics of Aspect Analysis"
    if "بلوتو" in pair:
        return "Arroyo — Astrology, Karma & Transformation; Hand — Horoscope Symbols"
    if "العقدة الشمالية" in pair or "العقدة الجنوبية" in pair:
        return "Arroyo — Astrology, Karma & Transformation; Hand — Horoscope Symbols; Tompkins — Aspects in Astrology"
    if "نبتون" in pair:
        return "Tompkins — Aspects in Astrology; Hand — Horoscope Symbols"
    if "أورانوس" in pair:
        return "Hand — Horoscope Symbols; Tierney — Dynamics of Aspect Analysis"
    if "المشتري" in pair:
        return "Tompkins — Aspects in Astrology; Ebertin — Combination of Stellar Influences"
    return "Tompkins — Aspects in Astrology; Tierney — Dynamics of Aspect Analysis"


def traditional(a, b):
    pa, pb = PRINCIPLE[a], PRINCIPLE[b]
    return (
        f"تثليث {a} مع {b} يربط {pa} مع {pb} برباطٍ سَلِس متدفق. "
        f"يقرأ التقليد التثليث ملكةً جاهزة لا تحتاج استدعاءً عنيفاً، إذ تتعاون القوتان دون احتكاك ظاهر. "
        f"حيث تتحرك إحداهما تجد الأخرى مكانها فيها، فيبدو فعلهما المشترك كأنه مكتسب منذ زمن. "
        f"يميل صاحب التركيب إلى التعبير عن {pa} بنبرة {pb} دون مجهود مرئي، فيستقبله الآخرون موهبةً طبيعية في المجال الذي يقع فيه."
    )


def evolutionary(a, b):
    ka, kb = KARMIC[a], KARMIC[b]
    return (
        f"على المستوى التطوري، يشير تثليث {a} مع {b} إلى رصيدٍ كرميٍّ مكتسب في حيواتٍ سابقة وما زال متدفقاً اليوم. "
        f"حملت النفس {ka}، والتقت بها {kb}، فتشكّل بينهما تفاهم داخلي صار متاحاً بلا جهد. "
        f"تُعطى هذه القدرة أرضاً ثابتة، لا مهمةً تُكتسب من جديد. "
        f"غير أن الكرما تطلب توظيف الموهبة الموروثة في خدمة عملٍ جديد، لا استهلاكها في تكرار النفس على ذاتها. "
        f"المخاطرة أن يتحول الرصيد إلى وسادة مريحة فيُؤجَّل العمل الأصعب الذي جاءت النفس من أجله."
    )


def developmental(a, b):
    pa, pb = PRINCIPLE[a], PRINCIPLE[b]
    ra, rb = RIGID[a], RIGID[b]
    ia, ib = INFLATED[a], INFLATED[b]
    return (
        f"المهمة أن يحمل الإنسان يسر {pa} وسلاسة {pb} بوعيٍ يقظ يمنع تحولهما إلى راحةٍ مغلقة. "
        f"الخطر المتصلب يظهر حين يصير التدفق عادة لا تُساءل، فيتقاطع {ra} مع {rb}، ويدور المرء في فلكٍ مألوف لا ينمو. "
        f"الخطر الوهمي يظهر حين يُفسَّر اليسر دليلاً على الاستحقاق الفطري، فيُغذَّى {ia} بـ {ib}، ويصير التثليث مأوى من الاختبار الحقيقي. "
        f"التوازن الحي يطلب أن يُؤخذ هذا التدفق رصيداً يُنفَق على الجبهات الصعبة في الخريطة، فيتحول من نعمةٍ مكتفية بنفسها إلى أداةٍ تختارها الأنا الحرة بقصد."
    )


def main():
    with SRC.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    assert len(rows) == 78, f"expected 78 rows, got {len(rows)}"

    for row in rows:
        a = row["body_a"].strip()
        b = row["body_b_or_sign"].strip()
        if a not in PRINCIPLE or b not in PRINCIPLE:
            raise ValueError(f"unknown body: {a!r} / {b!r}")
        row["traditional_meaning_ar"] = traditional(a, b)
        row["evolutionary_meaning_ar"] = evolutionary(a, b)
        row["developmental_task_ar"] = developmental(a, b)
        row["key_references"] = refs_for(a, b)
        row["status"] = "filled"

    DST.parent.mkdir(parents=True, exist_ok=True)
    with DST.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # word count check
    import re
    counts = []
    for row in rows:
        text = " ".join([row["traditional_meaning_ar"], row["evolutionary_meaning_ar"], row["developmental_task_ar"]])
        words = len(re.findall(r"\S+", text))
        counts.append(words)
    print(f"Wrote {len(rows)} rows to {DST}")
    print(f"Word count min/max/avg: {min(counts)} / {max(counts)} / {sum(counts)//len(counts)}")
    # forbidden checks
    forbidden = ["—", "Anthrop", "Steiner", "المسيح", "Christ", "Lucifer", "Ahriman"]
    for row in rows:
        joined = " ".join([row["traditional_meaning_ar"], row["evolutionary_meaning_ar"], row["developmental_task_ar"]])
        for f_tok in forbidden:
            if f_tok in joined:
                print(f"WARNING forbidden token {f_tok!r} in {row['placement_id']}")


if __name__ == "__main__":
    main()
