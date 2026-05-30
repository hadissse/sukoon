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

export interface StationEvent {
  planet: string;
  nameAr: string;
  svgKey: string;
  month: number;
  day: number;
  type: 'sR' | 'sD';
  dateLabel: string;
}

// 2026 planetary stations — stationary points (change of direction)
export const STATIONS_2026: StationEvent[] = [
  // Mercury (6x)
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 2,  day: 26, type: 'sR', dateLabel: '٢٦ فبراير' },
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 3,  day: 20, type: 'sD', dateLabel: '٢٠ مارس' },
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 6,  day: 29, type: 'sR', dateLabel: '٢٩ يونيو' },
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 7,  day: 23, type: 'sD', dateLabel: '٢٣ يوليو' },
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 10, day: 24, type: 'sR', dateLabel: '٢٤ أكتوبر' },
  { planet: 'Mercury', nameAr: 'عطارد', svgKey: 'mercury', month: 11, day: 13, type: 'sD', dateLabel: '١٣ نوفمبر' },
  // Venus (2x)
  { planet: 'Venus',   nameAr: 'الزهرة', svgKey: 'venus',   month: 10, day: 3,  type: 'sR', dateLabel: '٣ أكتوبر' },
  { planet: 'Venus',   nameAr: 'الزهرة', svgKey: 'venus',   month: 11, day: 14, type: 'sD', dateLabel: '١٤ نوفمبر' },
  // Jupiter (2x)
  { planet: 'Jupiter', nameAr: 'المشتري', svgKey: 'jupiter', month: 3,  day: 11, type: 'sD', dateLabel: '١١ مارس' },
  { planet: 'Jupiter', nameAr: 'المشتري', svgKey: 'jupiter', month: 12, day: 13, type: 'sR', dateLabel: '١٣ ديسمبر' },
  // Saturn (2x)
  { planet: 'Saturn',  nameAr: 'زحل',    svgKey: 'saturn',  month: 7,  day: 26, type: 'sR', dateLabel: '٢٦ يوليو' },
  { planet: 'Saturn',  nameAr: 'زحل',    svgKey: 'saturn',  month: 12, day: 10, type: 'sD', dateLabel: '١٠ ديسمبر' },
  // Uranus (2x)
  { planet: 'Uranus',  nameAr: 'أورانوس', svgKey: 'uranus', month: 2,  day: 4,  type: 'sD', dateLabel: '٤ فبراير' },
  { planet: 'Uranus',  nameAr: 'أورانوس', svgKey: 'uranus', month: 9,  day: 10, type: 'sR', dateLabel: '١٠ سبتمبر' },
  // Neptune (2x)
  { planet: 'Neptune', nameAr: 'نبتون',   svgKey: 'neptune', month: 7,  day: 7,  type: 'sR', dateLabel: '٧ يوليو' },
  { planet: 'Neptune', nameAr: 'نبتون',   svgKey: 'neptune', month: 12, day: 12, type: 'sD', dateLabel: '١٢ ديسمبر' },
  // Pluto (2x)
  { planet: 'Pluto',   nameAr: 'بلوتو',   svgKey: 'pluto',  month: 5,  day: 6,  type: 'sR', dateLabel: '٦ مايو' },
  { planet: 'Pluto',   nameAr: 'بلوتو',   svgKey: 'pluto',  month: 10, day: 16, type: 'sD', dateLabel: '١٦ أكتوبر' },
];

// Build station events as CalEvents keyed by "month-day"
function buildStationCalEvents(): Record<string, CalEvent[]> {
  const result: Record<string, CalEvent[]> = {};
  for (const s of STATIONS_2026) {
    const key = `${s.month}-${s.day}`;
    if (!result[key]) result[key] = [];
    result[key].push({
      svgKey: s.svgKey,
      title: `${s.nameAr} ${s.type === 'sR' ? 'يبدأ الرجوع' : 'يعود مباشرًا'}`,
      kind: 'station',
      color: '#D4A04C',
      time: s.dateLabel,
      body: s.type === 'sR'
        ? `${s.nameAr} يبدأ حركته الراجعة — وقت مراجعة وإعادة نظر.`
        : `${s.nameAr} يستأنف حركته المباشرة — الطاقة تتدفّق للأمام.`,
    });
  }
  return result;
}

// Multi-month event map: key = "month-day" (1-indexed month)
const STATION_EVENTS = buildStationCalEvents();

// Original May 2026 events merged with station events
const MAY_EVENTS: Record<string, CalEvent[]> = {
  '5-2':  [{ svgKey: 'moon',    title: 'القمر يدخل السرطان',   kind: 'ingress', color: '#7E97B8', time: '٠٤:٢٠', body: 'القمر يدخل السرطان، برجٌ مائي حسّاس.' }],
  '5-6':  [
    { svgKey: 'sun',    title: 'الشمس △ المشتري',     kind: 'aspect',  color: '#8FA084', time: '١١:٠٢', body: 'تثليث متناغم. فرصة للتوسّع بهدوء.' },
    { svgKey: 'venus',  title: 'الزهرة تدخل الجوزاء', kind: 'ingress', color: '#7E97B8', time: '٢٢:٤٧', body: 'بداية أيام أخفّ في التواصل والمحادثة.' },
  ],
  '5-10': [{ svgKey: 'moon',    title: 'بدر القمر · العقرب',   kind: 'lunation', color: '#E9785E', time: '١٧:٥٣', body: 'اكتمال قمري في العقرب. لحظة كشف وإغلاق ملف.', exact: true }],
  '5-14': [{ svgKey: 'mercury', title: 'عطارد ساكن',           kind: 'station',  color: '#D4A04C', time: '٠٣:١٠', body: 'عطارد ساكن عند الدرجة الثامنة من الجوزاء قبل الرجوع.' }],
  '5-17': [{ svgKey: 'mars',    title: 'المريخ □ زحل',          kind: 'aspect',   color: '#9A3F30', time: '٠٩:٢٤', body: 'تربيع المريخ وزحل، ضمن درجتين.' }],
  '5-20': [{ svgKey: 'sun',     title: 'الشمس تدخل الجوزاء',   kind: 'ingress',  color: '#7E97B8', time: '١٤:٣٦', body: 'دخول الشمس فصلًا جديدًا. موسم خفيف وحوار.' }],
  '5-24': [
    { svgKey: 'saturn', title: 'زحل ☌ الشمس',          kind: 'return',   color: '#E9785E', time: 'الآن',  body: 'اقتران زحل بالشمس على خريطتك — ١٠ أيام في النشاط.', exact: true },
    { svgKey: 'venus',  title: 'الزهرة ☌ المشتري',     kind: 'aspect',   color: '#8FA084', time: '٠٧:٤٠', body: 'الزهرة والمشتري يلتقيان في الجوزاء.' },
  ],
  '5-26': [{ svgKey: 'moon',    title: 'القمر الجديد · الجوزاء', kind: 'lunation', color: '#E9785E', time: '١٢:٠٢', body: 'بداية دورة قمرية جديدة في الجوزاء. ابذر نيّة.', exact: true }],
  '5-28': [{ svgKey: 'mars',    title: 'المريخ يدخل الأسد',    kind: 'ingress',  color: '#D4A04C', time: '٢٠:١٨', body: 'المريخ يدخل الأسد، حاكم البرج.' }],
  '5-30': [{ svgKey: 'moon',    title: 'اكتمال القمر في العقرب', kind: 'lunation', color: '#E9785E', time: '٠٦:١٤', body: 'تكرار اكتمال شهري. لحظة هضم وإغلاق.', exact: true }],
};

const ALL_2026_EVENTS: Record<string, CalEvent[]> = { ...MAY_EVENTS };
for (const [key, events] of Object.entries(STATION_EVENTS)) {
  if (ALL_2026_EVENTS[key]) {
    ALL_2026_EVENTS[key] = [...ALL_2026_EVENTS[key], ...events];
  } else {
    ALL_2026_EVENTS[key] = events;
  }
}

export function getEvents2026(month: number, day: number): CalEvent[] {
  return ALL_2026_EVENTS[`${month}-${day}`] || [];
}

// Legacy: original flat map for May (backwards compat with any remaining users)
export const CAL_TRANSITS: Record<number, CalEvent[]> = Object.fromEntries(
  Object.entries(MAY_EVENTS)
    .filter(([k]) => k.startsWith('5-'))
    .map(([k, v]) => [parseInt(k.split('-')[1]), v])
);

export const CAL_TODAY = 24;

export const AR_MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// RTL: Sat first
export const WEEK_DAYS = ['س', 'ج', 'خ', 'ر', 'ث', 'ا', 'ح'];
export const WEEK_DAYS_LTR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function kindLabel(kind: TransitKind): string {
  return kind === 'lunation' ? 'قمري'
    : kind === 'ingress' ? 'دخول'
    : kind === 'aspect'  ? 'جانب'
    : kind === 'station' ? 'محطّ'
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

export function getMonthStartWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
