import * as Astronomy from 'astronomy-engine';
import type { AstralChart } from './chartCalculator';

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
};

const PLANET_GLYPH: Record<string, string> = {
  sun: '◉', moon: '◌', mercury: '◎', venus: '◇', mars: '◆',
  jupiter: '◈', saturn: '▣', uranus: '▪', neptune: '▫', pluto: '■',
};

const TRANSIT_BODIES: { key: string; body: Astronomy.Body }[] = [
  { key: 'sun', body: Astronomy.Body.Sun },
  { key: 'moon', body: Astronomy.Body.Moon },
  { key: 'mercury', body: Astronomy.Body.Mercury },
  { key: 'venus', body: Astronomy.Body.Venus },
  { key: 'mars', body: Astronomy.Body.Mars },
  { key: 'jupiter', body: Astronomy.Body.Jupiter },
  { key: 'saturn', body: Astronomy.Body.Saturn },
  { key: 'uranus', body: Astronomy.Body.Uranus },
  { key: 'neptune', body: Astronomy.Body.Neptune },
  { key: 'pluto', body: Astronomy.Body.Pluto },
];

const ASPECTS = [
  { angle: 0, name: 'اقتران', symbol: '·', orb: 6 },
  { angle: 60, name: 'سُداس', symbol: '×', orb: 4 },
  { angle: 90, name: 'تربيع', symbol: '▫', orb: 5 },
  { angle: 120, name: 'تثليث', symbol: '△', orb: 5 },
  { angle: 180, name: 'تقابل', symbol: '—', orb: 6 },
];

const NATAL_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;

export interface Transit {
  id: string;
  transitKey: string;
  transitName: string;
  transitGlyph: string;
  natalKey: string;
  natalName: string;
  aspectName: string;
  aspectSymbol: string;
  orb: number; // degrees from exact
  label: string; // "زحل ☌ شمسك"
}

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export function orbLabel(orb: number): string {
  const deg = Math.floor(orb);
  const min = Math.round((orb - deg) * 60);
  return `${toArabicDigits(deg)}°${toArabicDigits(String(min).padStart(2, '0'))}′`;
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
          transits.push({
            id: `${key}-${asp.angle}-${natalKey}`,
            transitKey: key,
            transitName: PLANET_AR[key],
            transitGlyph: PLANET_GLYPH[key],
            natalKey,
            natalName: PLANET_AR[natalKey],
            aspectName: asp.name,
            aspectSymbol: asp.symbol,
            orb,
            label: `${PLANET_AR[key]} ${asp.symbol} ${PLANET_AR[natalKey]}`,
          });
          break;
        }
      }
    }
  }

  return transits.sort((a, b) => a.orb - b.orb);
}
