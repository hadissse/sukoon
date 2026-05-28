#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build T26b_Uranus_signsLibraPisces.csv with filled Arabic content."""

import csv
import os

OUTPUT = "/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled/T26b_Uranus_signsLibraPisces.csv"

FIELDS = [
    "template_num", "template_name", "category",
    "body_a", "body_b_or_sign", "house_or_aspect",
    "placement_id", "focus_theme",
    "traditional_meaning_ar", "evolutionary_meaning_ar", "developmental_task_ar",
    "key_references", "status", "content_file",
]

# Sign-level generational themes (Uranus through Libra-Pisces)
SIGNS = {
    "الميزان": {
        "en": "Libra",
        "gen": "جيل يعيد تعريف العدالة والعلاقة، حيث ينكسر العقد الاجتماعي القديم لصالح أشكال أكثر مساواة ومرونة في الزواج والصداقة والقانون",
        "field": "حقل العلاقة والتوازن",
        "shock": "صدمة في معنى الالتزام والشراكة",
        "vector": "تحرير العلاقة من شكلها التعاقدي الجامد ودخولها كحوار حر بين كيانين مستقلين",
        "shadow": "الخوف من المواجهة والميل إلى التوافق الزائف",
    },
    "العقرب": {
        "en": "Scorpio",
        "gen": "جيل يفجر طبقات المحرمات ويكشف ما كان مخفياً في علاقات السلطة والجنس والموت، فيُعاد تشكيل علم النفس العميق وموازين السيطرة المالية المشتركة",
        "field": "حقل العمق المحرم",
        "shock": "صدمة كاشفة في الباطن وفي ما اتُفق على إخفائه",
        "vector": "تحويل الطاقة المكبوتة إلى قوة شفاء واعية دون الانجراف في الفتنة بالظلام",
        "shadow": "الانجذاب إلى الأزمة والاندفاع نحو الكشف العنيف",
    },
    "القوس": {
        "en": "Sagittarius",
        "gen": "جيل يثور على المؤسسات الدينية والفلسفية الموروثة بحثاً عن معنى حر يتجاوز الحدود الجغرافية والثقافية، ويعيد فتح سؤال الحقيقة دون إذن من السلطة",
        "field": "حقل المعنى والرؤية الكبرى",
        "shock": "صدمة في منظومة الإيمان والقناعات الفلسفية",
        "vector": "بناء رؤية شخصية حية تتجدد دون أن تتحول إلى دوغما جديدة",
        "shadow": "التيه بين العقائد أو التعصب لقناعة بديلة",
    },
    "الجدي": {
        "en": "Capricorn",
        "gen": "جيل يهز أسس السلطة والدولة والمؤسسة، فتُعاد كتابة قواعد العمل والاقتصاد والقيادة، وتتفكك هياكل قديمة كانت تبدو راسخة إلى الأبد",
        "field": "حقل البنية والسلطة",
        "shock": "صدمة في الهياكل الراسخة والمسؤولية الاجتماعية",
        "vector": "بناء أشكال جديدة من السلطة المسؤولة تجمع بين الانضباط والابتكار",
        "shadow": "إما الجمود الدفاعي وإما هدم البنية بلا بديل",
    },
    "الدلو": {
        "en": "Aquarius",
        "gen": "جيل يحمل توقيع أورانوس في بيته الطبيعي، إذ يصير الإيقاظ الجمعي شأناً يومياً ويُعاد اختراع معنى الجماعة والتقدم وعلاقة الفرد بالشبكة الإنسانية الأوسع",
        "field": "حقل الجماعة والمستقبل",
        "shock": "صدمة في معنى الانتماء الجمعي والمشروع المستقبلي",
        "vector": "بناء جماعة حرة تحترم الفردانية دون أن تذوب الذات في الجمهور",
        "shadow": "الانعزال الفكري أو الذوبان في أيديولوجيا جماعية باردة",
    },
    "الحوت": {
        "en": "Pisces",
        "gen": "جيل تنفتح فيه الحدود بين الواقع والخيال، وتتفكك المنظومات الروحية القديمة لصالح بحث حر عن المعنى الباطن، فيُعاد تعريف الإيمان والرحمة والتلاشي",
        "field": "حقل اللانهائي والذوبان",
        "shock": "صدمة في الحدود بين الذات وما يتجاوزها",
        "vector": "تحرير الحس الروحي من التشتت والذوبان وإيجاد قناة واعية لاستقباله",
        "shadow": "الهروب إلى أوهام روحية أو الذوبان في فوضى داخلية",
    },
}

# House-level personal field
HOUSES = {
    "البيت 1": {
        "field": "الهوية والمظهر والحضور الأول في العالم",
        "personal": "في الجسد المرئي والإطلالة الأولى التي يقدمها الإنسان للعالم",
        "task": "أن يصير الحضور الشخصي قناة لإيقاظ جيل بأكمله دون أن يتحول إلى استعراض",
        "rigid": "تطويع المظهر لتوقعات البيئة وقمع نبض التجدد حتى يتجمد الحضور",
        "inflated": "بناء هوية مبنية على الغرابة لذاتها فتتحول الفرادة إلى استعراض مستهلك",
        "balance": "أن يصير الجسد مرآة هادئة لطاقة جيلية تتدفق من خلاله دون أن يدّعي ملكيتها",
    },
    "البيت 2": {
        "field": "الموارد والقيم والعلاقة بالمادة",
        "personal": "في كيفية كسب الرزق وبناء الإحساس بالقيمة الذاتية",
        "task": "أن يكتشف الإنسان قيمة تتجاوز ما يملك وتستجيب لإيقاع الجيل",
        "rigid": "التشبث بالأمان المادي الموروث رغم نداء التجدد فينفجر الاستقرار بصورة مفاجئة",
        "inflated": "الزهو بالتخفف من المادة إلى حد إنكار الجسد وحاجاته الأرضية",
        "balance": "أن يبني الإنسان قاعدة مادية تكفيه وتترك مساحة للتجربة الحرة",
    },
    "البيت 3": {
        "field": "الذهن والكلام والمحيط القريب",
        "personal": "في طريقة التفكير والتعبير والعلاقة بالإخوة والجيران",
        "task": "أن يصير الذهن قناة لأفكار جيلية تكسر اللغة الموروثة وتفتح معاني جديدة",
        "rigid": "كبت حدة البديهة تحت لغة موروثة فتتحول الذهنية إلى نقد عقيم",
        "inflated": "القفز السطحي بين الأفكار دون هضم ولا تمحيص",
        "balance": "أن يجمع الإنسان بين سرعة الإدراك وعمق المتابعة المنطقية",
    },
    "البيت 4": {
        "field": "البيت والأصل والجذور",
        "personal": "في العلاقة بالأم والأب وبالأرض النفسية التي تكونت في الطفولة",
        "task": "أن يقطع الإنسان حلقة موروثة عن سلالته ويبني بيتاً يحمل طاقة الجيل",
        "rigid": "تكرار النمط العائلي الذي حاول الهرب منه فيصير البيت قفصاً بارداً",
        "inflated": "الهروب الأبدي من فكرة البيت باسم الحرية فتفقد الجذور",
        "balance": "أن يبني الإنسان أرضاً انفعالية تتنفس وتفتح نوافذها للهواء الجديد",
    },
    "البيت 5": {
        "field": "الإبداع واللعب والحب الرومانسي",
        "personal": "في التعبير الفني والعلاقات العاطفية والصلة بالأبناء",
        "task": "أن يحرر الإنسان قلبه ليصير الإبداع لحظة انبثاق حرة تخدم نبض الجيل",
        "rigid": "تنظيم الحياة العاطفية بصورة آمنة فيجف الداخل وتفقد العلاقات حرارتها",
        "inflated": "مطاردة الإثارة من علاقة إلى أخرى دون أن ينضج شيء",
        "balance": "أن يلتزم الإنسان بما يحب مع احتفاظه بحق التجدد داخل الالتزام",
    },
    "البيت 6": {
        "field": "العمل اليومي والصحة والروتين",
        "personal": "في إيقاع العمل ونمط الجسد والممارسات اليومية",
        "task": "أن يصير العمل اليومي ساحة لتجريب نمط حياة يحمل بصمة الجيل",
        "rigid": "قبول وظيفة قاتلة باسم الأمان فيتراكم التوتر في الأعصاب",
        "inflated": "القفز من مهنة إلى مهنة باسم الحرية فلا تنضج خبرة",
        "balance": "أن يختار الإنسان حقلاً يلتزم به ويعيد تشكيله من الداخل",
    },
    "البيت 7": {
        "field": "الشريك والعلاقات الرسمية",
        "personal": "في اختيار الشريك وفي طريقة الدخول في العقود والمواجهات",
        "task": "أن يدخل الإنسان شراكة حية تترك مساحة لكل طرف ليتغير مع الجيل",
        "rigid": "الإصرار على شراكة آمنة تقليدية حتى ينفجر العقد بعد سنوات من التجمد",
        "inflated": "الهروب من كل التزام باسم الاستقلال فتُقطف العلاقات قبل نضجها",
        "balance": "أن يبني الإنسان عقداً متجدداً يتسع للحرية وللوفاء معاً",
    },
    "البيت 8": {
        "field": "التحول العميق والموارد المشتركة",
        "personal": "في الأزمات الكبرى وفي العلاقة الحميمة وفي الموارد الجماعية",
        "task": "أن يخوض الإنسان التحول الجذري دون مقاومة ويستخرج منه قوة شفاء",
        "rigid": "إنكار الحاجة إلى التحول والتمسك بأمان زائف حتى تأتي الأزمة عنيفة",
        "inflated": "مطاردة الخطر والكثافة باسم اليقظة فتُستدرج الفوضى",
        "balance": "أن يدخل الإنسان العمق بوعي حين ينضج ويميز بين الأزمة الحقيقية وهياج النفس",
    },
    "البيت 9": {
        "field": "المعنى الكبير والسفر والفلسفة",
        "personal": "في القناعات الفلسفية والرحلات والتعليم العالي",
        "task": "أن يبني الإنسان رؤية شخصية حرة تخدم بحث الجيل عن المعنى",
        "rigid": "اتخاذ قناعة فلسفية مغلقة باسم الأصالة فيصير التمرد عقيدة جامدة",
        "inflated": "القفز من فلسفة إلى أخرى دون تعميق فيتحول البحث إلى استهلاك",
        "balance": "أن يلتزم الإنسان بمنهج بحث صادق يفتح للسؤال دون أن يفقد البوصلة",
    },
    "البيت 10": {
        "field": "المهنة والمكانة الاجتماعية والسلطة",
        "personal": "في المسار المهني والصورة العامة وعلاقة الإنسان بالسلطة",
        "task": "أن يصير المسار المهني قناة لتجسيد ثورة الجيل في فضاء عام",
        "rigid": "تطويع المسيرة لمعايير اجتماعية موروثة فتختنق الدعوة الحقيقية",
        "inflated": "رفض السلطة من حيث المبدأ فيُحرم الإنسان من إنجاز مرئي",
        "balance": "أن يبني الإنسان مكانة مسؤولة تحمل بصمة التجديد دون فقدان الرسوخ",
    },
    "البيت 11": {
        "field": "الجماعة والصداقات والمشروع المستقبلي",
        "personal": "في الانتماء إلى جماعات وفي بناء شبكة الأصدقاء والآمال البعيدة",
        "task": "أن يصير الإنسان نقطة لقاء بين الفرد الحر وحركة الجيل الأوسع",
        "rigid": "الانتماء إلى جماعة تذيب الفردية باسم القضية المشتركة",
        "inflated": "الانعزال النخبوي ورفض كل جماعة تحت ذريعة الاستقلال",
        "balance": "أن يجد الإنسان جماعة حرة يلتقي فيها أنداداً يساهمون في حلم مشترك",
    },
    "البيت 12": {
        "field": "اللاوعي والانسحاب والاتصال بما يتجاوز الذات",
        "personal": "في الحياة الباطنية وفي العزلة الواعية وفي الصلة بما هو أوسع من الفرد",
        "task": "أن يصبح الباطن قناة تستقبل نبض الجيل قبل أن يصل إلى السطح",
        "rigid": "كبت الحساسية الباطنية فتتحول إلى قلق مزمن لا يجد مخرجاً",
        "inflated": "الانسحاب الكامل من الواقع باسم الباطن فيُفقد الجسر إلى الحياة",
        "balance": "أن يبني الإنسان ممارسة باطنية منتظمة تربط ما يستقبله بالعمل اليومي",
    },
}

# Reference pool (pick by topic — see style brief)
REFS = {
    "default": "Howard Sasportas — The Gods of Change; Liz Greene — The Outer Planets and Their Cycles",
    "house_inner": "Robert Hand — Horoscope Symbols; Deborah Houlding — The Houses",
    "evolutionary": "Stephen Arroyo — Astrology, Karma & Transformation; Howard Sasportas — The Gods of Change",
    "aspect": "Bil Tierney — Dynamics of Aspect Analysis; Liz Greene — The Outer Planets and Their Cycles",
    "scorpio": "Liz Greene — The Outer Planets and Their Cycles; Howard Sasportas — The Gods of Change; Stephen Arroyo — Astrology, Karma & Transformation",
}

# Per-(sign, house) ref selection
def pick_refs(sign_ar, house_ar):
    h = house_ar
    # Map by house resonance to vary references
    if h in ("البيت 1", "البيت 5", "البيت 10"):
        return "Liz Greene — The Outer Planets and Their Cycles; Robert Hand — Horoscope Symbols"
    if h in ("البيت 2", "البيت 6", "البيت 11"):
        return "Howard Sasportas — The Gods of Change; Deborah Houlding — The Houses"
    if h in ("البيت 3", "البيت 9"):
        return "Robert Hand — Horoscope Symbols; Howard Sasportas — The Gods of Change"
    if h in ("البيت 4", "البيت 12"):
        return "Stephen Arroyo — Astrology, Karma & Transformation; Howard Sasportas — The Gods of Change"
    if h in ("البيت 7",):
        return "Liz Greene — The Outer Planets and Their Cycles; Bil Tierney — Dynamics of Aspect Analysis"
    if h in ("البيت 8",):
        return "Howard Sasportas — The Gods of Change; Stephen Arroyo — Astrology, Karma & Transformation; Liz Greene — The Outer Planets and Their Cycles"
    return REFS["default"]


def build_traditional(sign_ar, house_ar):
    s = SIGNS[sign_ar]
    h = HOUSES[house_ar]
    return (
        f"يحمل هذا الموضع توقيع {s['gen']}، ويتركز هذا التيار الجيلي في {h['field']}، "
        f"فيصبح {h['personal']} ساحة لحدوث {s['shock']}. "
        f"التراث الفلكي يصف وجود أورانوس في {sign_ar} بوصفه دفقة إيقاظ تكسر العقد القديم في {s['field']}، "
        f"وحين يقع هذا الكوكب في {house_ar} فإن هذه الموجة الجمعية تجد لها منفذاً شخصياً يحمله صاحب الخريطة في حياته اليومية. "
        f"يأخذ الإيقاع هنا طابعاً متقطعاً، فترات هدوء طويلة يقطعها تحول مفاجئ، وكأن الجيل بأكمله يتحرك من خلال هذا الفرد حين يحين الوقت."
    )


def build_evolutionary(sign_ar, house_ar):
    s = SIGNS[sign_ar]
    h = HOUSES[house_ar]
    return (
        f"على المستوى العميق، اختارت هذه النفس أن تكون نقطة التقاء بين موجة جيلية أوسع وبين تجربتها الفردية في {h['field']}. "
        f"المهمة التطورية لا تتعلق بالشخص وحده، بل بدوره بوصفه قناة لإيقاظ يخص جيلاً كاملاً يحمل عبء {s['vector']}. "
        f"الكرما الجماعية ترتبط بفكّ تماهٍ موروث، فالنفس جاءت محملة بذاكرة قديمة من {s['shadow']}، "
        f"والمطلوب أن تتعلم كيف تستقبل نبضة التغيير الجمعية وتعبر بها من خلال {h['personal']} دون أن تتحول إلى أداة عمياء للتيار. "
        f"كل أزمة في هذا المجال هي دعوة لإعادة كتابة العلاقة بين الفرد والجيل، فيتعلم الإنسان أن استقلاله الحقيقي يولد حين يخدم تطور وعي أوسع منه. "
        f"الحرية الناضجة هنا ليست انفصالاً عن الجماعة بل قدرة على حمل صوتها دون أن يفقد صوته الخاص."
    )


def build_task(sign_ar, house_ar):
    s = SIGNS[sign_ar]
    h = HOUSES[house_ar]
    return (
        f"المهمة المركزية أن يتعلم الإنسان حمل طاقة الجيل بوعي شخصي في {h['field']}. "
        f"الخطر المتصلب أن {h['rigid']}، فيصبح المجال موضع ركود يقاوم النداء الجمعي. "
        f"الخطر الوهمي أن {h['inflated']}، فيتحول التمرد إلى استعراض فارغ يكرر شكل الثورة دون مضمونها. "
        f"التوازن الحي يولد حين {h['balance']}، فتتدفق طاقة أورانوس في {sign_ar} من خلال {house_ar} بصورة تخدم تطور الوعي الفردي والجمعي معاً. "
        f"عند هذه النقطة تصير الأنا الحرة واسطة بين التيار الجمعي والتعبير الفردي، فتعطي طاقة الجيل شكلاً إنسانياً قابلاً للحياة."
    )


def word_count_ar(text):
    return len(text.split())


def main():
    rows = []
    sign_order = ["الميزان", "العقرب", "القوس", "الجدي", "الدلو", "الحوت"]
    sign_en = {
        "الميزان": "Libra", "العقرب": "Scorpio", "القوس": "Sagittarius",
        "الجدي": "Capricorn", "الدلو": "Aquarius", "الحوت": "Pisces",
    }
    house_order = [f"البيت {i}" for i in range(1, 13)]
    house_en_num = {f"البيت {i}": i for i in range(1, 13)}

    for sign_ar in sign_order:
        for house_ar in house_order:
            pid = f"T26_Uranus_{sign_en[sign_ar]}_H{house_en_num[house_ar]}"
            theme = f"Uranus in {sign_en[sign_ar]} House {house_en_num[house_ar]}"
            trad = build_traditional(sign_ar, house_ar)
            evol = build_evolutionary(sign_ar, house_ar)
            task = build_task(sign_ar, house_ar)
            refs = pick_refs(sign_ar, house_ar)
            total = word_count_ar(trad) + word_count_ar(evol) + word_count_ar(task)
            # Sanity guard
            if total < 200 or total > 350:
                print(f"WARN {pid}: total words {total}")
            row = {
                "template_num": "26",
                "template_name": "Uranus by Sign + House",
                "category": "Nodes/Chiron/Karmic",
                "body_a": "أورانوس",
                "body_b_or_sign": sign_ar,
                "house_or_aspect": house_ar,
                "placement_id": pid,
                "focus_theme": theme,
                "traditional_meaning_ar": trad,
                "evolutionary_meaning_ar": evol,
                "developmental_task_ar": task,
                "key_references": refs,
                "status": "filled",
                "content_file": "",
            }
            rows.append(row)

    assert len(rows) == 72, f"expected 72 rows got {len(rows)}"

    with open(OUTPUT, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

    # Verify
    with open(OUTPUT, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        count = sum(1 for _ in reader)
    print(f"Wrote {count} rows to {OUTPUT}")


if __name__ == "__main__":
    main()
