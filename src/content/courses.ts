// Course / series content for the teaching layer (Scr42-49, 94).
// Static seed data ported from the Sukoon design files.

export interface Course {
  id: string;
  title: string;
  course: string; // eyebrow, e.g. "مقرّر · 10 أيام"
  variant: string;
  teacher: string;
  blurb: string;
  tags: string[];
  lessons: string[];
}

export const COURSES: Course[] = [
  {
    id: 'first-breath',
    title: 'أول نَفَس',
    course: 'سلسلة · 3 أيام',
    variant: 'dawn',
    teacher: 'بريا شاه',
    blurb: 'ثلاث جلسات تبني أول جسر بينك وبين نَفَسك — اللحظة الأكثر حضورًا في يومك.',
    tags: ['3 جلسات', '7 دقائق لكل واحدة', 'بريا شاه'],
    lessons: ['نَفَس البداية', 'النَفَس الواعي', 'الحضور في الجسد'],
  },
  {
    id: 'home-return',
    title: 'العودة إلى البيت',
    course: 'سلسلة · 4 أيام',
    variant: 'lake',
    teacher: 'آشا باوين',
    blurb: 'أربع جلسات تعيدك إلى نفسك — حين تضيع الطريق وتحتاج إلى مرساة.',
    tags: ['4 جلسات', '9 دقائق لكل واحدة', 'آشا باوين'],
    lessons: ['ما معنى البيت؟', 'حين تضيع الطريق', 'الجسد مأوى', 'كل مكان مرساة'],
  },
  {
    id: 'open-awareness',
    title: 'الوعي المفتوح',
    course: 'مقرّر · 8 أيام',
    variant: 'dust',
    teacher: 'جوناس بارك',
    blurb: 'ثماني جلسات تفتح الوعي ما وراء الأفكار — الفسحة التي تحتوي كل شيء.',
    tags: ['8 جلسات', '12 دقيقة لكل واحدة', 'جوناس بارك'],
    lessons: [
      'من أنا؟',
      'الشاهد الداخلي',
      'الأفكار تمرّ',
      'المشاعر تمرّ',
      'لا مكان تذهب إليه',
      'الفسحة الكبرى',
      'الوعي بلا شكل',
      'العودة إلى الحياة',
    ],
  },
  {
    id: 'quiet-path',
    title: 'الطريق الهادئ',
    course: 'مقرّر · 10 أيام',
    variant: 'dawn',
    teacher: 'مايا كول',
    blurb:
      'عشر جلسات لتسكين العقل. مصمّمة لمن هم جدد على التأمّل — أو يعودون إليه بعد انقطاع.',
    tags: ['10 جلسات', '10 دقائق لكل واحدة', 'مايا كول'],
    lessons: [
      'الجلسة الأولى',
      'الحضور في الجسد',
      'حين يتشتّت العقل',
      'المرساة اللطيفة',
      'الفسحة',
      'تسمية ما يحدث',
      'الإمساك برفق',
      'ممارسة في الحركة',
      'الأقلّ أكثر',
      'العودة إلى الحياة',
    ],
  },
  {
    id: 'gentle-anchors',
    title: 'مراسٍ لطيفة',
    course: 'مقرّر · 5 أيام',
    variant: 'sage',
    teacher: 'مايا كول',
    blurb: 'خمس جلسات قصيرة تبني مرساةً تعود إليها في أي وقت من اليوم.',
    tags: ['5 جلسات', '7 دقائق لكل واحدة', 'مايا كول'],
    lessons: ['أول نَفَس', 'النَفَس مرساة', 'يد على القلب', 'مسح الجسد', 'العودة برفق'],
  },
  {
    id: 'letting-go',
    title: 'الإفلات برفق',
    course: 'سلسلة · 7 أيام',
    variant: 'dusk',
    teacher: 'جوناس بارك',
    blurb: 'سبع جلسات للتخفّف من شدّ اليوم، خطوةً خطوة.',
    tags: ['7 جلسات', '10 دقائق لكل واحدة', 'جوناس بارك'],
    lessons: [
      'تخفيف القبضة',
      'تنفّس من خلاله',
      'ارخِ الفك',
      'ما لا تملكه',
      'الفسحة قبل الفعل',
      'الراحة المسموحة',
      'ابدأ من جديد',
    ],
  },
];

// Course-detail "what you'll learn" cards (Scr43)
export const COURSE_OUTCOMES: [string, string][] = [
  ['الانتباه إلى النفس', 'مأوى موثوق لانتباهك.'],
  ['تخفيف الاندفاع', 'مساحة بين الشعور والفعل.'],
  ['احملها معك', 'مارس اليقظة في اللحظات العاديّة.'],
];

// Foundations grid (Scr49) — [title, duration label, variant, courseId]
export const FOUNDATIONS: [string, string, string, string][] = [
  ['الطريق الهادئ', '10 أيام', 'dawn', 'quiet-path'],
  ['مراسٍ لطيفة', '5 أيام', 'sage', 'gentle-anchors'],
  ['الإفلات', '7 أيام', 'dusk', 'letting-go'],
  ['العودة إلى البيت', '4 أيام', 'lake', 'home-return'],
  ['أول نَفَس', '3 أيام', 'ember', 'first-breath'],
  ['الوعي المفتوح', '8 أيام', 'dust', 'open-awareness'],
];

// Teachers (Scr46-47, 93)
export const TEACHERS: { name: string; variant: string; blurb: string; count: string }[] = [
  { name: 'مايا كول', variant: 'sage', blurb: 'دافئة ومتجذّرة', count: '١٢ جلسة' },
  { name: 'جوناس بارك', variant: 'dusk', blurb: 'هادئ ورحب', count: '٨ جلسات' },
  { name: 'بريا شاه', variant: 'dawn', blurb: 'مشرقة ومفعمة', count: '١٥ جلسة' },
  { name: 'ثيو ريد', variant: 'lake', blurb: 'بطيء وثابت', count: '٦ جلسات' },
  { name: 'آشا باوين', variant: 'ember', blurb: 'صافية وحاضرة', count: '٩ جلسات' },
  { name: 'إيكو ساتو', variant: 'dust', blurb: 'لطيفة ودقيقة', count: '١١ جلسة' },
];

// Series & courses list (Scr94)
export const SERIES: { id: string; title: string; sub: string; color: string; progress: number }[] = [
  { id: 'quiet-path', title: 'الدرب الهادئ', sub: '١٠ أيام · للمبتدئين', color: '#F8D6BE', progress: 30 },
  { id: 'letting-go', title: 'الإفلات برفق', sub: '٧ أيام · التوتر', color: '#9C8AB8', progress: 57 },
  { id: 'about-sleep', title: 'عن النوم', sub: '٥ أيام · النوم', color: '#3A4490', progress: 0 },
  { id: 'gentle-anchors', title: 'مراسي لطيفة', sub: '٥ أيام · للمبتدئين', color: '#C9D2BE', progress: 100 },
];

// ─── Astrology courses ────────────────────────────────────────────────────────

export const ASTRO_COURSES: Course[] = [
  {
    id: 'natal-chart-basics',
    title: 'خريطتك النجمية',
    course: 'مقرّر · ٧ أيام',
    variant: 'dawn',
    teacher: 'بريا شاه',
    blurb: 'سبع جلسات تأخذك من صفحة بيضاء إلى قراءة خريطتك بعيون جديدة.',
    tags: ['٧ جلسات', '١٢ دقيقة لكل واحدة', 'بريا شاه'],
    lessons: [
      'ما هي الخريطة؟',
      'الشمس — جوهرك',
      'القمر — صدى روحك',
      'الطالع — كيف تظهر',
      'عطارد والزهرة والمريخ',
      'الكواكب البطيئة',
      'كيف تقرأ خريطتك كاملة',
    ],
  },
  {
    id: 'twelve-houses',
    title: 'البيوت الاثنا عشر',
    course: 'مقرّر · ١٢ يومًا',
    variant: 'lake',
    teacher: 'ثيو ريد',
    blurb: 'كل بيت قصة. تعلّم كيف تقرأ مساحات حياتك من خريطتك.',
    tags: ['١٢ جلسة', '١٠ دقائق لكل واحدة', 'ثيو ريد'],
    lessons: [
      'البيت الأول — أنت',
      'البيت الثاني — مواردك',
      'البيت الثالث — صوتك',
      'البيت الرابع — جذورك',
      'البيت الخامس — فرحك',
      'البيت السادس — يومك',
      'البيت السابع — علاقاتك',
      'البيت الثامن — تحوّلك',
      'البيت التاسع — معناك',
      'البيت العاشر — مسارك',
      'البيت الحادي عشر — رؤيتك',
      'البيت الثاني عشر — خلوتك',
    ],
  },
  {
    id: 'four-elements',
    title: 'العناصر الأربعة',
    course: 'سلسلة · ٤ أيام',
    variant: 'ember',
    teacher: 'آشا باوين',
    blurb: 'النار والتراب والهواء والماء — كيف تتوازن في خريطتك وحياتك.',
    tags: ['٤ جلسات', '١٥ دقيقة لكل واحدة', 'آشا باوين'],
    lessons: [
      'النار — الإرادة والرؤية',
      'التراب — الجسد والثبات',
      'الهواء — العقل والتواصل',
      'الماء — المشاعر والحدس',
    ],
  },
  {
    id: 'reading-transits',
    title: 'قراءة العبورات',
    course: 'مقرّر · ٥ أيام',
    variant: 'dust',
    teacher: 'إيكو ساتو',
    blurb: 'خمس جلسات تعلّمك كيف تتابع السماء الآن وتربطها بلحظتك الحياتية.',
    tags: ['٥ جلسات', '١٢ دقيقة لكل واحدة', 'إيكو ساتو'],
    lessons: [
      'ما هو العبور؟',
      'كواكب السرعة والكواكب البطيئة',
      'الجوانب الحية',
      'عبورات تحوّل الحياة',
      'تقويمك السماوي',
    ],
  },
  {
    id: 'saturn-return',
    title: 'عودة زحل',
    course: 'سلسلة · ٣ أيام',
    variant: 'sage',
    teacher: 'ثيو ريد',
    blurb: 'عتبة الثلاثين — ما تعنيه، كيف تعيشها، وما تطلبه منك.',
    tags: ['٣ جلسات', '١٨ دقيقة لكل واحدة', 'ثيو ريد'],
    lessons: [
      'ما هي عودة زحل؟',
      'ما الذي ينهار وما الذي يُبنى',
      'الخروج من العتبة',
    ],
  },
  {
    id: 'moon-cycles',
    title: 'دورة القمر',
    course: 'سلسلة · ٨ أيام',
    variant: 'dawn',
    teacher: 'مايا كول',
    blurb: 'من الهلال إلى البدر وعودة — كيف ترافق دورة القمر في حياتك اليومية.',
    tags: ['٨ جلسات', '٨ دقائق لكل واحدة', 'مايا كول'],
    lessons: [
      'الهلال الجديد — البذرة',
      'الهلال المتزايد — الحركة',
      'التربيع الأول — القرار',
      'الأحدب — الدفع',
      'البدر — الاكتمال',
      'الأحدب المتناقص — الحصاد',
      'التربيع الأخير — الإفراج',
      'الهلال المتناقص — الراحة',
    ],
  },
  {
    id: 'twelve-signs',
    title: 'البروج الاثنا عشر',
    course: 'مقرّر · ١٢ يومًا',
    variant: 'ember',
    teacher: 'بريا شاه',
    blurb: 'جولة عبر الاثني عشر برجًا — طاقة كل برج، كيف يعمل، وكيف يظهر في حياتك.',
    tags: ['١٢ جلسة', '١٠ دقائق لكل واحدة', 'بريا شاه'],
    lessons: [
      'الحمل — البداية والقيادة',
      'الثور — الجسد والجمال',
      'الجوزاء — الفكر والتواصل',
      'السرطان — الجذور والحماية',
      'الأسد — الإبداع والحضور',
      'العذراء — التدقيق والخدمة',
      'الميزان — التوازن والعلاقات',
      'العقرب — التحوّل والعمق',
      'القوس — المعنى والحرية',
      'الجدي — الانضباط والصعود',
      'الدلو — الرؤية والجماعة',
      'الحوت — الذوبان والإيمان',
    ],
  },
  {
    id: 'aspects-deep',
    title: 'الجوانب الفلكية',
    course: 'مقرّر · ٥ أيام',
    variant: 'lake',
    teacher: 'إيكو ساتو',
    blurb: 'خمس جلسات تكشف لغة الزوايا — كيف تتحدّث الكواكب مع بعضها في خريطتك.',
    tags: ['٥ جلسات', '١٢ دقيقة لكل واحدة', 'إيكو ساتو'],
    lessons: [
      'ما هو الجانب الفلكي؟',
      'الاقتران — اندماج القوتين',
      'التثليث والسداسي — الانسياب',
      'التربيع والتقابل — التوتر المنتج',
      'قراءة جوانب خريطتك كاملة',
    ],
  },
  {
    id: 'chiron-wound',
    title: 'كيرون والجرح المعلّم',
    course: 'سلسلة · ٣ أيام',
    variant: 'sage',
    teacher: 'آشا باوين',
    blurb: 'ثلاث جلسات تستكشف جرحك الأوّلي في الخريطة — وكيف يصبح بوصلة للشفاء.',
    tags: ['٣ جلسات', '١٥ دقيقة لكل واحدة', 'آشا باوين'],
    lessons: [
      'الجرح الذي يُعلّم',
      'من جريح إلى معالج',
      'هبة كيرون في خريطتك',
    ],
  },
  {
    id: 'mercury-retrograde',
    title: 'عطارد الراجع',
    course: 'سلسلة · ٣ أيام',
    variant: 'dusk',
    teacher: 'جوناس بارك',
    blurb: 'عطارد لا يتراجع — لكنّه يُبطّئ ليمنحك فرصة المراجعة. ثلاث جلسات لفهم هذا الإيقاع.',
    tags: ['٣ جلسات', '١٠ دقائق لكل واحدة', 'جوناس بارك'],
    lessons: [
      'ما يحدث حين يبطؤ عطارد',
      'فرصة المراجعة والتصحيح',
      'اليقظة في أوقات عطارد',
    ],
  },
];

// Combined list of all courses
export const ALL_COURSES: Course[] = [...COURSES, ...ASTRO_COURSES];

// Astrology knowledge base articles (for Explore tab)
// svgKey: planet/zodiac SVG from /public/svg/ — use mask-image rendering; null = use icon text
export const ASTRO_KNOWLEDGE: { id: string; title: string; subtitle: string; svgKey: string | null; icon: string; courseId: string }[] = [
  { id: 'sun-sign', title: 'برجك الشمسي', subtitle: 'جوهر هويّتك', svgKey: 'sun', icon: '◉', courseId: 'natal-chart-basics' },
  { id: 'moon-sign', title: 'برجك القمري', subtitle: 'حياتك العاطفية', svgKey: 'moon', icon: '◌', courseId: 'natal-chart-basics' },
  { id: 'rising-sign', title: 'طالعك', subtitle: 'كيف يراك العالم', svgKey: null, icon: '↑', courseId: 'natal-chart-basics' },
  { id: 'houses', title: 'البيوت الاثنا عشر', subtitle: 'مساحات حياتك', svgKey: null, icon: '▦', courseId: 'twelve-houses' },
  { id: 'elements', title: 'العناصر الأربعة', subtitle: 'نارك وترابك وهواؤك وماؤك', svgKey: null, icon: '◈', courseId: 'four-elements' },
  { id: 'transits', title: 'العبورات الحية', subtitle: 'السماء الآن وخريطتك', svgKey: 'saturn', icon: '◎', courseId: 'reading-transits' },
  { id: 'saturn-return', title: 'عودة زحل', subtitle: 'عتبة الثلاثين', svgKey: 'saturn', icon: '◎', courseId: 'saturn-return' },
  { id: 'moon-phases', title: 'أطوار القمر', subtitle: 'إيقاع شهري تعيشه', svgKey: 'moon', icon: '◌', courseId: 'moon-cycles' },
  { id: 'twelve-signs', title: 'البروج الاثنا عشر', subtitle: 'طاقة كل برج وصفاته', svgKey: null, icon: '◇', courseId: 'twelve-signs' },
  { id: 'aspects', title: 'الجوانب الفلكية', subtitle: 'لغة الزوايا في خريطتك', svgKey: null, icon: '×', courseId: 'aspects-deep' },
  { id: 'chiron', title: 'كيرون', subtitle: 'الجرح الذي يُعلّم', svgKey: 'chiron', icon: '◎', courseId: 'chiron-wound' },
  { id: 'mercury-rx', title: 'عطارد الراجع', subtitle: 'فرصة المراجعة', svgKey: 'mercury', icon: '◎', courseId: 'mercury-retrograde' },
];

export function getCourse(id: string): Course | undefined {
  return ALL_COURSES.find((c) => c.id === id);
}
