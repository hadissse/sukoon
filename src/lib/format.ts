// Unified number / degree formatting for the Arabic (RTL) UI.
//
// Numbers are ALWAYS written left-to-right, even inside right-to-left Arabic
// text: "١٧°" must read ١ ٧ ° from left to right, never "°١٧". When a numeric
// token (digits + the ° / ′ symbols + a sign name) sits inside an RTL run, the
// Unicode bidi algorithm can reorder the neutral ° symbol relative to the
// digits, which is why the same value looked correct on one screen and mirrored
// on another. Wrapping the token in a Left-to-Right Isolate (U+2066 … U+2069)
// pins its internal order regardless of the surrounding direction.
//
// Use these helpers everywhere a degree / measured number is shown so the whole
// app renders identically.

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const LRI = '⁦'; // Left-to-Right Isolate
const PDI = '⁩'; // Pop Directional Isolate

/** Convert Western digits in a string/number to Arabic-Indic digits. */
export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

/** Wrap a token so it always renders left-to-right inside RTL text. */
export function ltrIsolate(s: string): string {
  return `${LRI}${s}${PDI}`;
}

/** Format a whole-degree value, e.g. 17 → "‹١٧°›" (bidi-isolated). */
export function formatDegree(deg: number | string): string {
  return ltrIsolate(`${toArabicDigits(deg)}°`);
}

/** Format degrees + optional arc-minutes, e.g. 17°23′ (bidi-isolated). */
export function formatDegreeMinute(deg: number, minute?: number): string {
  const body = `${toArabicDigits(deg)}°${minute && minute > 0 ? ` ${toArabicDigits(minute)}′` : ''}`;
  return ltrIsolate(body);
}

/** Format "‹sign› ‹deg°min′›" with the degree token bidi-isolated. */
export function formatSignDegree(sign: string, deg: number, minute?: number): string {
  return `${sign} ${formatDegreeMinute(deg, minute)}`;
}

/** Format an ecliptic longitude (0–360) as "‹sign› ‹deg°min′›". */
const ZODIAC_NAMES_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء',
  'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت',
];
export function formatLongitude(lon: number): string {
  const n = ((lon % 360) + 360) % 360;
  const sign = Math.floor(n / 30);
  const inSign = n - sign * 30;
  const deg = Math.floor(inSign);
  const min = Math.round((inSign - deg) * 60);
  return formatSignDegree(ZODIAC_NAMES_AR[sign], min === 60 ? deg + 1 : deg, min === 60 ? 0 : min);
}
