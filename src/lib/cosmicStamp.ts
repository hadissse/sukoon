import * as Astronomy from 'astronomy-engine';

const ZODIAC_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const DAY_NAMES_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_RULERS_AR = ['الشمس', 'القمر', 'المريخ', 'عطارد', 'المشتري', 'الزهرة', 'زحل'];

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function signAndDegree(longitude: number): { sign: string; degree: number } {
  const n = ((longitude % 360) + 360) % 360;
  const i = Math.floor(n / 30);
  return { sign: ZODIAC_AR[i], degree: Math.floor(n - i * 30) };
}

function moonPhaseName(angle: number): string {
  // angle: 0 = new, 90 = first quarter, 180 = full, 270 = last quarter
  if (angle < 45) return 'هلال جديد';
  if (angle < 90) return 'هلال متزايد';
  if (angle < 135) return 'تربيع أول';
  if (angle < 180) return 'أحدب متزايد';
  if (angle < 225) return 'بدر';
  if (angle < 270) return 'أحدب متناقص';
  if (angle < 315) return 'تربيع أخير';
  return 'هلال متناقص';
}

export interface CosmicStamp {
  dayRuler: string;   // "السبت · زحل"
  moonPhase: string;  // "هلال متزايد في الجدي"
  sunPosition: string; // "٢٧° الثور"
}

export function getCosmicStamp(date: Date = new Date()): CosmicStamp {
  const dow = date.getDay();

  try {
    const time = new Astronomy.AstroTime(date);
    const sunLon = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, time, true)).elon;
    const moonLon = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, time, true)).elon;
    const sun = signAndDegree(sunLon);
    const moon = signAndDegree(moonLon);
    const phase = moonPhaseName(Astronomy.MoonPhase(time));

    return {
      dayRuler: `${DAY_NAMES_AR[dow]} · ${DAY_RULERS_AR[dow]}`,
      moonPhase: `${phase} في ${moon.sign}`,
      sunPosition: `${toArabicDigits(sun.degree)}° ${sun.sign}`,
    };
  } catch {
    return {
      dayRuler: `${DAY_NAMES_AR[dow]} · ${DAY_RULERS_AR[dow]}`,
      moonPhase: '—',
      sunPosition: '—',
    };
  }
}
