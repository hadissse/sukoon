#!/usr/bin/env python3
"""Generate T24b Pluto in signs Libra..Pisces × 12 houses chunk."""
import csv
import os
import tempfile

SRC = "/Users/hadi/Downloads/sukoon-tmp/templates/chunks/T24b_Pluto_signsLibraPisces.csv"
DST = "/Users/hadi/Downloads/sukoon-tmp/templates/chunks_filled/T24b_Pluto_signsLibraPisces.csv"

SIGNS = {
    "الميزان": {
        "intro": "بلوتو في الميزان يحمل توقيع جيل، حقبة هزت أسس الزواج والشراكة والعدالة، وأعادت تعريف معنى الحب والاتفاق بين الأنداد",
        "shadow": "الظل الجيلي وهو تجميل القسوة بقناع التهذيب، وإخفاء صراع السلطة تحت لغة التوازن",
        "evo_task": "إعادة بناء معنى العلاقة على أساس المساواة الحقيقية لا التبادل المقنّع",
        "gift": "حساسية عميقة لميزان القوة في كل لقاء، وقدرة على شفاء العلاقة من جذورها",
    },
    "العقرب": {
        "intro": "بلوتو في العقرب يحمل توقيع جيل ولد في برج سيادته الطبيعية، فجاءت قوته في أنقى صورها وأكثرها كثافة، حقبة كسرت المحرمات حول الجنس والموت والمال المشترك",
        "shadow": "الظل الجيلي وهو الإفراط في الانجذاب إلى الهاوية، والخلط بين الكثافة وبين الحقيقة",
        "evo_task": "حمل قوة بلوتو في أنقى أشكالها دون أن تتحول إلى استعراض للظلام أو إدمان للأزمة",
        "gift": "قدرة استثنائية على الاختراق إلى جوهر الأمور، وشفاء جذري لما اعتُبر ميؤوساً منه",
    },
    "القوس": {
        "intro": "بلوتو في القوس يحمل توقيع جيل، حقبة هزت المعتقدات الكبرى والمؤسسات الدينية والفلسفية، وكشفت ما خفي تحت الحقائق المعلنة",
        "shadow": "الظل الجيلي وهو التعصب باسم الحرية، وتحويل البحث عن المعنى إلى دوغمائية جديدة",
        "evo_task": "تطهير الرؤية الكبرى من التعصب وفتح أبواب معنى لم يدنسها التملك",
        "gift": "بصيرة فلسفية تنفذ إلى ما وراء الأقنعة العقائدية وتحمل الحقيقة دون استبداد",
    },
    "الجدي": {
        "intro": "بلوتو في الجدي يحمل توقيع جيل، حقبة هدمت بنى السلطة والدولة والمال الكبيرة، وأعادت توزيع خرائط النفوذ في العالم",
        "shadow": "الظل الجيلي وهو الإفراط في تمجيد البنية، وتثبيت سلطة جديدة لا تختلف جوهرياً عن القديمة",
        "evo_task": "هدم البنى التي فقدت روحها وإعادة بناء سلطة تخدم الحياة لا تخنقها",
        "gift": "قدرة على بناء ما يدوم من رماد ما انهار، وحمل المسؤولية بنضج عميق",
    },
    "الدلو": {
        "intro": "بلوتو في الدلو يحمل توقيع جيل، حقبة هزت بنى الجماعة والتكنولوجيا، وأعادت تعريف معنى الفرد داخل الشبكة وحدود الحرية الجمعية",
        "shadow": "الظل الجيلي وهو ذوبان الفرد في الجماعة الرقمية، أو الانعزال المتعالي باسم التميز",
        "evo_task": "اختراع شكل جديد من الانتماء يحرر الفرد دون أن يعزله، ويربط الجماعة دون أن يذيبها",
        "gift": "رؤية تنفذ إلى منطق الأنظمة الكبرى، وقدرة على تحويل البنى الجمعية من الداخل",
    },
    "الحوت": {
        "intro": "بلوتو في الحوت يحمل توقيع جيل، حقبة تذوب فيها الحدود بين الواقعي والافتراضي، وتعود إلى السطح طبقات اللاوعي الجمعي القديمة",
        "shadow": "الظل الجيلي وهو الذوبان في وهم جماعي يبتلع البصيرة، أو الاستسلام لتيار يفقد الكائن ملامحه",
        "evo_task": "تنقية اللاوعي الجمعي من رواسبه، وحمل البصيرة الروحانية دون الذوبان فيها",
        "gift": "حساسية للطبقات المخفية وراء العالم المرئي، وقدرة على الشفاء عبر الرحمة العميقة",
    },
}

HOUSES = {
    "البيت 1": {
        "domain": "الجسد والحضور الأول",
        "anchor": "تتجسد هذه الحفرة في صلب هوية الكائن، فتطبع على حضوره طابعاً كثيفاً يشعر به الآخرون قبل أن يفهموه",
        "lived": "تكون هناك ولادة صعبة أو طفولة تحمل شعوراً بأن للحضور وزناً غير عادي",
        "task": "يبني الإنسان هويته من أعماقه لا من قشرة المظهر، وأن يدع الوجه القديم يموت ليولد وجه أصدق",
    },
    "البيت 2": {
        "domain": "الموارد والقيم والأمان المادي",
        "anchor": "تنزل المهمة في علاقة الكائن بالمال والممتلكات، فيصبح حقل القيم ساحة تحول كثيفة",
        "lived": "تكون هناك أزمات مالية أو خسائر تكسر العلاقة القديمة بالأمان، تعقبها إعادة بناء جذري",
        "task": "يكتشف الإنسان قيمته تحت ما يملك، وأن يحرر شعوره بالاستحقاق من تعلقه بأي شيء خارجي",
    },
    "البيت 3": {
        "domain": "الذهن والكلام والإخوة",
        "anchor": "تنحدر القوة إلى الفكر واللسان، فيصير الكلام عند هذا الإنسان أداة كشف لا مجرد تواصل",
        "lived": "تكون هناك تجربة مبكرة من إسكات أو سر عائلي ثقيل، أو علاقة مكثفة بأخ يحمل ظل الكائن",
        "task": "يستخدم الإنسان كلمته لإخراج المكبوت إلى النور دون أن يتحول الكلام إلى سلاح يجرح",
    },
    "البيت 4": {
        "domain": "الجذور والبيت والأم الداخلية",
        "anchor": "تستقر المهمة في أعمق طبقة من الكائن، في علاقته بالأصل والذاكرة العائلية الممتدة",
        "lived": "تكون هناك أسرار عائلية ثقيلة، أو خسارة مبكرة، أو جو منزلي يحمل سلطة خفية كثيفة",
        "task": "يدخل الإنسان قبو السيرة العائلية بشجاعة، يحرر شجرة الأسلاف من اللعنات الصامتة، ويبني بيتاً داخلياً جديداً",
    },
    "البيت 5": {
        "domain": "الإبداع والحب الرومانسي والأبناء",
        "anchor": "تنزل القوة إلى ساحة الإبداع والعشق، فيصير اللعب مكثفاً والحب مغامرة وجودية",
        "lived": "تكون هناك علاقات عاطفية قاتلة الكثافة، أو موهبة فنية تظهر كقوة لا يستطيع الإنسان السيطرة عليها",
        "task": "يضع الإنسان قوته الإبداعية في خدمة شيء أكبر من زهو الذات، وأن يحب دون أن يحول الحبيب إلى ساحة سيطرة",
    },
    "البيت 6": {
        "domain": "العمل اليومي والصحة والخدمة",
        "anchor": "تتجسد القوة في تفاصيل الحياة اليومية، في العمل والصحة وعلاقة الإنسان بجسده",
        "lived": "تكون هناك أزمة صحية كبرى أو خبرة عمل مكثفة تجبر على إعادة بناء العلاقة بالجسد والعادات",
        "task": "يجعل الإنسان من العمل اليومي ممارسة تحول واعٍ، وأن يحرر الخدمة من شكلها المنهك",
    },
    "البيت 7": {
        "domain": "الشريك والعلاقة المرئية",
        "anchor": "تنزل القوة إلى حقل العلاقة الواحد لواحد، فيصير الشريك مرآة تعكس ما يطلب التحول",
        "lived": "تكون هناك شراكة تحمل قوة سيطرة أو هوس متبادل، أو سلسلة علاقات تكشف كل واحدة طبقة أعمق",
        "task": "يلتقي الإنسان شريكاً بوصفه كائناً مستقلاً لا امتداداً لرغبته، ويحرر العلاقة من حلقات السيطرة",
    },
    "البيت 8": {
        "domain": "التحول والموت والجنس والأموال المشتركة",
        "anchor": "هنا يقع بلوتو في بيت سيادته الطبيعية، فتأخذ المهمة شكلها الأنقى ويصير التحول قانون الحياة",
        "lived": "تكون هناك خسارات كبرى أو خبرات اقتراب من الموت، أو علاقات حميمة تكسر بنية الواقع",
        "task": "يدخل الإنسان دائرة الموت والولادة الرمزية بوعي، ويجعل من الانكسارات بوابات تحول لا جروحاً تستعاد",
    },
    "البيت 9": {
        "domain": "المعنى الأكبر والفلسفة والاعتقاد",
        "anchor": "ترتفع القوة إلى حقل الرؤية الكبرى، فتطلب من الإنسان أن يهدم بنيته الفلسفية القديمة ويبني واحدة حية",
        "lived": "تكون هناك أزمة إيمان كبرى، أو سفر يقلب الهوية، أو لقاء بمعلم يكسر كل ما كان مسلَّماً به",
        "task": "يبني الإنسان رؤيته من تجربة حية لا من إرث جاهز، ويحمل الحقيقة دون أن يتحول إلى مبشر متعصب",
    },
    "البيت 10": {
        "domain": "المهنة والسلطة العامة",
        "anchor": "تتجسد المهمة في علاقة الكائن بالسلطة والمكانة، فيصبح المسار المهني ساحة تحول وكشف",
        "lived": "تكون هناك صعود وسقوط مهني، أو علاقة مكثفة بالأب، أو موقع عام يحمل وزناً أثقل من المعتاد",
        "task": "يحمل الإنسان السلطة بوصفها أمانة لا مكافأة للأنا، ويقبل أن المسار العام قد يطلب موتاً واحداً أو أكثر",
    },
    "البيت 11": {
        "domain": "الجماعة والأصدقاء والآمال البعيدة",
        "anchor": "تنزل القوة إلى الحقل الجماعي، فيصير الانتماء للأصدقاء والحركات حقل تحول ومواجهة",
        "lived": "تكون هناك خبرة مكثفة مع جماعة تحمل قوة سيطرة، أو صداقات تتفجر، أو رؤية مستقبلية تطلب التزاماً ثقيلاً",
        "task": "يحمل الإنسان رؤيته الجمعية دون أن يذوب في الجماعة، ويدخل في عمل مشترك واعٍ يحرر لا يستعبد",
    },
    "البيت 12": {
        "domain": "اللاوعي والعزلة والمخفي",
        "anchor": "تستقر القوة في أعمق طبقة باطنية، فيصير الكائن حاملاً لشيء يأتي من اللاوعي الجمعي ذاته",
        "lived": "تكون هناك خبرة عزلة أو فترة اختفاء، أو حساسية مفرطة لما هو مخفي تجعل الإنسان يقرأ ما لا يُقال",
        "task": "يصبح الإنسان واعياً بالطبقات المخفية التي تحركه، ويحول قوة اللاوعي إلى قناة شفاء لا فيضاناً غامضاً يبتلعه",
    },
}

REF_POOL = [
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Stephen Arroyo — Astrology, Karma and Transformation",
    "Steven Forrest — The Book of Pluto; Liz Greene — The Outer Planets and Their Cycles",
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Howard Sasportas — The Gods of Change",
    "Steven Forrest — The Book of Pluto; Robert Hand — Horoscope Symbols",
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Deborah Houlding — The Houses",
    "Steven Forrest — The Book of Pluto; Stephen Arroyo — Astrology, Karma and Transformation",
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Liz Greene — The Outer Planets and Their Cycles",
    "Steven Forrest — The Book of Pluto; Howard Sasportas — The Gods of Change",
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Robert Hand — Horoscope Symbols",
    "Steven Forrest — The Book of Pluto; Deborah Houlding — The Houses",
    "Jeff Green — Pluto: The Evolutionary Journey of the Soul; Howard Sasportas — The Gods of Change",
    "Steven Forrest — The Book of Pluto; Stephen Arroyo — Astrology, Karma and Transformation",
]

HOUSE_ORDER = [f"البيت {i}" for i in range(1, 13)]


def build_traditional(sign, house):
    s = SIGNS[sign]
    h = HOUSES[house]
    return (
        f"{s['intro']}. تنزل هذه القوة في مجال {h['domain']}, وتطبع كثافة واضحة على الكائن. "
        f"{h['anchor']}. "
        f"التقليد يرى في موقع بلوتو حفرة من العمل التطوري، فحيثما يقع يطلب موتاً وولادة. "
        f"كثيراً ما {h['lived']}, وتترك بصمة على علاقة الكائن بالقوة. "
        f"{s['shadow']} يجد هنا ساحته الأقرب ليتجلى أو يتحول."
    )


def build_evolutionary(sign, house):
    s = SIGNS[sign]
    h = HOUSES[house]
    return (
        f"على المستوى التطوري، تأتي هذه النفس وقد عرفت في خبرات سابقة صوراً كثيفة من القوة في مجال {h['domain']}. "
        f"تحمل ذاكرة كرمية ثقيلة، خبرة احتجاز أو فقدان أو سيطرة، تطلب الآن الحل. "
        f"المهمة الجيلية وهي {s['evo_task']} تتركز هنا في حقل ضيق، فيحمل الكائن وزن جيله في قطعة من سيرته. "
        f"أن {h['task']}. "
        f"التحول لا يأتي بقرار بسيط بل عبر انكسارات تنزع ما تعلق به الإنسان حتى يكتشف تحت كل خسارة طبقة أعمق. "
        f"الهدية التي تنبع وهي {s['gift']} تظهر بعد بوابات من فقد ما كان يظنه هويته."
    )


def build_task(sign, house):
    h = HOUSES[house]
    return (
        f"الخطر المتصلب هو الأكثر إغراءً هنا، وهو ميل بلوتو الجوهري. "
        f"يأخذ شكل إنكار للتحول، فيتمسك الإنسان بمكان قوته في مجال {h['domain']} ويحول الكثافة إلى صلابة دفاعية تكتم النبض ثم تنفجر بعد سنوات في أزمة. "
        f"الخطر الوهمي يأخذ شكل افتتان بالظلام والقوة، فيطارد الإنسان الأزمات بحثاً عن إثبات أنه حي. "
        f"التوازن الحي يولد حين تدخل الأنا الواعية حفرة التحول طوعاً، تترك ما يحتاج إلى الموت أن يموت، وتحمل القوة بوصفها أمانة لخدمة الحياة."
    )


def word_count(text):
    return len(text.split())


def main():
    with open(SRC, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    assert len(rows) == 72, f"Expected 72 rows, got {len(rows)}"

    for idx, row in enumerate(rows):
        sign = row["body_b_or_sign"]
        house = row["house_or_aspect"]
        assert sign in SIGNS, f"Unknown sign at row {idx}: {sign}"
        assert house in HOUSES, f"Unknown house at row {idx}: {house}"

        trad = build_traditional(sign, house)
        evo = build_evolutionary(sign, house)
        task = build_task(sign, house)

        total = word_count(trad) + word_count(evo) + word_count(task)
        if total < 200 or total > 350:
            print(f"WARN row {idx} {sign} {house}: word count {total}")

        row["traditional_meaning_ar"] = trad
        row["evolutionary_meaning_ar"] = evo
        row["developmental_task_ar"] = task
        house_idx = HOUSE_ORDER.index(house)
        row["key_references"] = REF_POOL[house_idx]
        row["status"] = "filled"

    dst_dir = os.path.dirname(DST)
    fd, tmp_path = tempfile.mkstemp(prefix=".T24b_tmp_", dir=dst_dir, suffix=".csv")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()
            writer.writerows(rows)
        os.replace(tmp_path, DST)
    except Exception:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise

    with open(DST, encoding="utf-8", newline="") as f:
        verify_rows = list(csv.DictReader(f))
    print(f"Wrote {len(verify_rows)} rows to {DST}")
    filled = sum(1 for r in verify_rows if r["status"] == "filled")
    print(f"Rows with status=filled: {filled}")

    for sample_idx in [0, 12, 24, 36, 48, 60, 71]:
        r = verify_rows[sample_idx]
        wc = word_count(r["traditional_meaning_ar"]) + word_count(r["evolutionary_meaning_ar"]) + word_count(r["developmental_task_ar"])
        print(f"  row {sample_idx} {r['body_b_or_sign']} {r['house_or_aspect']}: {wc} words")


if __name__ == "__main__":
    main()
