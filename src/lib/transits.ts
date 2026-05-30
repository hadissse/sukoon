import * as Astronomy from 'astronomy-engine';
import type { AstralChart } from './chartCalculator';

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

const PLANET_GLYPH: Record<string, string> = {
  sun: '◉', moon: '◌', mercury: '◎', venus: '◇', mars: '◆',
  jupiter: '◈', saturn: '▣', uranus: '▪', neptune: '▫', pluto: '■',
};

// Approximate window (days) to search for exact hit per transit planet
const SEARCH_WINDOW: Record<string, number> = {
  moon: 3, sun: 10, mercury: 14, venus: 14, mars: 30,
  jupiter: 120, saturn: 180, uranus: 365, neptune: 500, pluto: 700,
};
// Step size in hours for binary search
const STEP_HOURS: Record<string, number> = {
  moon: 2, sun: 12, mercury: 12, venus: 12, mars: 24,
  jupiter: 72, saturn: 96, uranus: 120, neptune: 168, pluto: 240,
};

const TRANSIT_BODIES: { key: string; body: Astronomy.Body }[] = [
  { key: 'sun',     body: Astronomy.Body.Sun },
  { key: 'moon',    body: Astronomy.Body.Moon },
  { key: 'mercury', body: Astronomy.Body.Mercury },
  { key: 'venus',   body: Astronomy.Body.Venus },
  { key: 'mars',    body: Astronomy.Body.Mars },
  { key: 'jupiter', body: Astronomy.Body.Jupiter },
  { key: 'saturn',  body: Astronomy.Body.Saturn },
  { key: 'uranus',  body: Astronomy.Body.Uranus },
  { key: 'neptune', body: Astronomy.Body.Neptune },
  { key: 'pluto',   body: Astronomy.Body.Pluto },
];

export const ASPECTS = [
  { angle: 0,   name: 'اقتران', symbol: '☌', orb: 6, color: '#5C5C7A' },
  { angle: 60,  name: 'سُداس',  symbol: '⚹', orb: 4, color: '#4A7FB5' },
  { angle: 90,  name: 'تربيع',  symbol: '▫', orb: 5, color: '#C0392B' },
  { angle: 120, name: 'تثليث',  symbol: '△', orb: 5, color: '#27AE60' },
  { angle: 180, name: 'تقابل',  symbol: '☍', orb: 6, color: '#C0392B' },
];

const NATAL_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode', 'southNode'] as const;

export interface Transit {
  id: string;
  transitKey: string;
  transitName: string;
  transitGlyph: string;
  natalKey: string;
  natalName: string;
  aspectName: string;
  aspectSymbol: string;
  aspectColor: string;
  orb: number;
  label: string;
  exactDate: Date | null; // date when orb = 0
}

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export function orbLabel(orb: number): string {
  return `${toArabicDigits(Math.floor(orb))}°`;
}

/** Format a date in Arabic: "٥ يونيو ٢٠٢٦" */
export function formatExactDate(d: Date): string {
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

/** Step through a time window to find the date with smallest orb (closest to exact hit). */
function findExactHit(
  body: Astronomy.Body,
  natalLon: number,
  aspectAngle: number,
  now: Date,
  windowDays: number,
  stepHours: number,
): Date | null {
  const msStep = stepHours * 3600000;
  const msWindow = windowDays * 86400000;
  let bestOrb = Infinity;
  let bestDate: Date | null = null;

  // Search forward and backward
  for (let ms = -msWindow; ms <= msWindow; ms += msStep) {
    const testDate = new Date(now.getTime() + ms);
    try {
      const time = new Astronomy.AstroTime(testDate);
      const lon = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true)).elon;
      const sep = Math.abs(((lon - natalLon + 180) % 360) - 180);
      const orb = Math.abs(sep - aspectAngle);
      if (orb < bestOrb) {
        bestOrb = orb;
        bestDate = testDate;
      }
    } catch { /* skip */ }
  }

  // Only return if the best found is reasonably exact (within 1.5°)
  return bestOrb < 1.5 ? bestDate : null;
}

export function calculateTransits(natal: AstralChart, date: Date = new Date()): Transit[] {
  const transits: Transit[] = [];

  let time: Astronomy.AstroTime;
  try {
    time = new Astronomy.AstroTime(date);
  } catch {
    return [];
  }

  for (const { key, body } of TRANSIT_BODIES) {
    let lon: number;
    try {
      lon = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true)).elon;
    } catch {
      continue;
    }

    for (const natalKey of NATAL_KEYS) {
      const natalPlanet = natal[natalKey];
      if (!natalPlanet) continue;
      const sep = Math.abs(((lon - natalPlanet.longitude + 180) % 360) - 180);

      for (const asp of ASPECTS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= asp.orb) {
          const exactDate = findExactHit(
            body,
            natalPlanet.longitude,
            asp.angle,
            date,
            SEARCH_WINDOW[key] ?? 60,
            STEP_HOURS[key] ?? 48,
          );

          transits.push({
            id: `${key}-${asp.angle}-${natalKey}`,
            transitKey: key,
            transitName: PLANET_AR[key],
            transitGlyph: PLANET_GLYPH[key],
            natalKey,
            natalName: PLANET_AR[natalKey],
            aspectName: asp.name,
            aspectSymbol: asp.symbol,
            aspectColor: asp.color,
            orb,
            label: `${PLANET_AR[key]} ${asp.symbol} ${PLANET_AR[natalKey]}`,
            exactDate,
          });
          break;
        }
      }
    }
  }

  return transits.sort((a, b) => a.orb - b.orb);
}
