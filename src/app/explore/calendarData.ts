// Scr220-221 — تقويم العبورات. EXACT Arabic copy ported from design (screens-13).

export type TransitKind = 'lunation' | 'ingress' | 'aspect' | 'station' | 'return';

export interface CalEvent {
  svgKey: string;
  title: string;
  kind: TransitKind;
  color: string;
  time: string;
  body: string;
  exact?: boolean;
}

export const CAL_TRANSITS: Record<number, CalEvent[]> = {
  2: [{ svgKey: 'moon', title: 'القمر يدخل السرطان', kind: 'ingress', color: '#7E97B8', time: '٠٤:٢٠', body: 'قمر مائي. اليوم مناسب للجلسات العائلية والاستراحة.' }],
  6: [
    { svgKey: 'sun', title: 'الشمس △ المشتري', kind: 'aspect', color: '#8FA084', time: '١١:٠٢', body: 'تثليث متناغم. فرصة للتوسّع بهدوء.' },
    { svgKey: 'venus', title: 'الزهرة تدخل الجوزاء', kind: 'ingress', color: '#7E97B8', time: '٢٢:٤٧', body: 'بداية أيام أخفّ في التواصل والمحادثة.' },
  ],
  10: [{ svgKey: 'moon', title: 'بدر القمر · العقرب', kind: 'lunation', color: '#E9785E', time: '١٧:٥٣', body: 'اكتمال قمري في العقرب. لحظة كشف وإغلاق ملف.', exact: true }],
  14: [{ svgKey: 'mercury', title: 'عطارد ساكن', kind: 'station', color: '#D4A04C', time: '٠٣:١٠', body: 'عطارد يقف قبل الرجوع. اليوم مناسب للمراجعة، لا للقرارات الجديدة.' }],
  17: [{ svgKey: 'mars', title: 'المريخ □ زحل', kind: 'aspect', color: '#9A3F30', time: '٠٩:٢٤', body: 'تربيع متوتر. احفظ طاقتك. ٤ أيام يقترب.' }],
  20: [{ svgKey: 'sun', title: 'الشمس تدخل الجوزاء', kind: 'ingress', color: '#7E97B8', time: '١٤:٣٦', body: 'دخول الشمس فصلًا جديدًا. موسم خفيف وحوار.' }],
  24: [
    { svgKey: 'saturn', title: 'زحل ☌ الشمس', kind: 'return', color: '#E9785E', time: 'الآن', body: 'اقتران زحل بالشمس على خريطتك — ١٠ أيام في النشاط.', exact: true },
    { svgKey: 'venus', title: 'الزهرة ☌ المشتري', kind: 'aspect', color: '#8FA084', time: '٠٧:٤٠', body: 'اقتران لطيف. اليوم خصب للعطاء والحب.' },
  ],
  26: [{ svgKey: 'moon', title: 'القمر الجديد · الجوزاء', kind: 'lunation', color: '#E9785E', time: '١٢:٠٢', body: 'بداية دورة قمرية جديدة في الجوزاء. ابذر نيّة.', exact: true }],
  28: [{ svgKey: 'mars', title: 'المريخ يدخل الأسد', kind: 'ingress', color: '#D4A04C', time: '٢٠:١٨', body: 'دخول طاقي حار. خمسة أيام من الحماس.' }],
  30: [{ svgKey: 'moon', title: 'اكتمال القمر في العقرب', kind: 'lunation', color: '#E9785E', time: '٠٦:١٤', body: 'تكرار اكتمال شهري. لحظة هضم وإغلاق.', exact: true }],
};

export const CAL_TODAY = 24;

// Sat, Fri, Thu, Wed, Tue, Mon, Sun (RTL — Sat on the right)
export const WEEK_DAYS = ['س', 'ج', 'خ', 'ر', 'ث', 'ا', 'ح'];
export const WEEK_DAYS_LTR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function kindLabel(kind: TransitKind): string {
  return kind === 'lunation'
    ? 'قمري'
    : kind === 'ingress'
    ? 'دخول'
    : kind === 'aspect'
    ? 'جانب'
    : kind === 'station'
    ? 'محطّ'
    : 'عودة';
}

export function toArabicNum(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

export function buildMonthCells(year: number, month: number, startWeekday: number): (number | null)[] {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
