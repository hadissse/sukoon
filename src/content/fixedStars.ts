/**
 * Fixed star catalog — 15 classical stars with Arabic names.
 * Tropical ecliptic longitudes at J2000.0 (JD 2451545.0).
 * Precession rate: ~50.29"/yr (~1° per 72 years).
 */

export interface FixedStar {
  nameAr: string;
  translitAr: string;
  nameLatin: string;
  bayer: string;
  lon2000: number;
  lat: number;
  mag: number;
  orb: number;
}

export const FIXED_STARS: FixedStar[] = [
  {
    nameAr: 'رأس الغول',
    translitAr: "Ra's al-Ghul",
    nameLatin: 'Algol',
    bayer: 'β Persei',
    lon2000: 56.17,
    lat: 22.5,
    mag: 2.12,
    orb: 1.0,
  },
  {
    nameAr: 'أم النجوم',
    translitAr: 'Umm al-Nujum',
    nameLatin: 'Alcyone',
    bayer: 'η Tauri',
    lon2000: 59.80,
    lat: 4.03,
    mag: 2.87,
    orb: 2.0,
  },
  {
    nameAr: 'الدبران',
    translitAr: 'ad-Dabaran',
    nameLatin: 'Aldebaran',
    bayer: 'α Tauri',
    lon2000: 69.75,
    lat: -5.47,
    mag: 0.85,
    orb: 2.0,
  },
  {
    nameAr: 'العيوق',
    translitAr: "al-'Ayuq",
    nameLatin: 'Capella',
    bayer: 'α Aurigae',
    lon2000: 81.95,
    lat: 22.86,
    mag: 0.08,
    orb: 1.5,
  },
  {
    nameAr: 'الشعرى اليمانية',
    translitAr: "ash-Shi'ra al-Yamaniyya",
    nameLatin: 'Sirius',
    bayer: 'α Canis Majoris',
    lon2000: 104.08,
    lat: -39.6,
    mag: -1.46,
    orb: 2.0,
  },
  {
    nameAr: 'الشعرى الشامية',
    translitAr: "ash-Shi'ra ash-Shamiyya",
    nameLatin: 'Procyon',
    bayer: 'α Canis Minoris',
    lon2000: 115.82,
    lat: -16.02,
    mag: 0.38,
    orb: 1.0,
  },
  {
    nameAr: 'قلب الأسد',
    translitAr: 'Qalb al-Asad',
    nameLatin: 'Regulus',
    bayer: 'α Leonis',
    lon2000: 149.98,
    lat: 0.46,
    mag: 1.35,
    orb: 2.0,
  },
  {
    nameAr: 'الأيد',
    translitAr: "al-'Ayd",
    nameLatin: 'Alkaid',
    bayer: 'η Ursae Majoris',
    lon2000: 177.12,
    lat: 54.92,
    mag: 1.86,
    orb: 1.0,
  },
  {
    nameAr: 'الغراب',
    translitAr: 'al-Gharab',
    nameLatin: 'Algorab',
    bayer: 'δ Corvi',
    lon2000: 193.45,
    lat: -14.04,
    mag: 2.95,
    orb: 1.0,
  },
  {
    nameAr: 'السنبلة',
    translitAr: 'as-Sunbula',
    nameLatin: 'Spica',
    bayer: 'α Virginis',
    lon2000: 203.84,
    lat: -2.05,
    mag: 0.98,
    orb: 2.0,
  },
  {
    nameAr: 'السماك الأعزل',
    translitAr: "as-Simak al-A'zal",
    nameLatin: 'Arcturus',
    bayer: 'α Bootis',
    lon2000: 204.22,
    lat: 30.73,
    mag: -0.05,
    orb: 1.5,
  },
  {
    nameAr: 'الفكة',
    translitAr: 'al-Fakka',
    nameLatin: 'Alphecca',
    bayer: 'α Coronae Borealis',
    lon2000: 222.32,
    lat: 44.32,
    mag: 2.23,
    orb: 1.0,
  },
  {
    nameAr: 'قلب العقرب',
    translitAr: "Qalb al-'Aqrab",
    nameLatin: 'Antares',
    bayer: 'α Scorpii',
    lon2000: 249.73,
    lat: -4.57,
    mag: 1.06,
    orb: 2.0,
  },
  {
    nameAr: 'النسر الواقع',
    translitAr: 'an-Nasr al-Waqi',
    nameLatin: 'Vega',
    bayer: 'α Lyrae',
    lon2000: 285.26,
    lat: 61.72,
    mag: 0.03,
    orb: 1.5,
  },
  {
    nameAr: 'ذنب الجدي',
    translitAr: 'Dhanab al-Jadi',
    nameLatin: 'Deneb Algedi',
    bayer: 'δ Capricorni',
    lon2000: 323.54,
    lat: -2.69,
    mag: 2.85,
    orb: 1.0,
  },
];

export function fixedStarSlug(nameLatin: string): string {
  const part = nameLatin.split('/').pop()!.trim();
  return part.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
}

const PRECESSION_DEG_PER_YEAR = 50.29 / 3600;
const J2000 = 2451545.0;

export function starLongitudeAtJD(star: FixedStar, jd: number): number {
  const years = (jd - J2000) / 365.25;
  return ((star.lon2000 + years * PRECESSION_DEG_PER_YEAR) % 360 + 360) % 360;
}

export interface StarConjunction {
  star: FixedStar;
  starLon: number;
  natalPlanetKey: string;
  natalPlanetName: string;
  natalPlanetLon: number;
  orb: number;
}

const PLANET_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'northNode', 'southNode',
] as const;

const PLANET_NAMES_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

export function findStarConjunctions(
  chart: Record<string, { longitude: number; name: string } | unknown>,
  jd: number,
  customOrb?: number,
): StarConjunction[] {
  const results: StarConjunction[] = [];

  for (const star of FIXED_STARS) {
    const starLon = starLongitudeAtJD(star, jd);
    const effectiveOrb = customOrb ?? star.orb;

    for (const key of PLANET_KEYS) {
      const planet = chart[key] as { longitude: number; name: string } | undefined;
      if (!planet || typeof planet.longitude !== 'number') continue;

      const diff = Math.abs(((planet.longitude - starLon + 540) % 360) - 180);
      if (diff <= effectiveOrb) {
        results.push({
          star,
          starLon,
          natalPlanetKey: key,
          natalPlanetName: PLANET_NAMES_AR[key] ?? planet.name,
          natalPlanetLon: planet.longitude,
          orb: Math.round(diff * 100) / 100,
        });
      }
    }
  }

  return results.sort((a, b) => a.orb - b.orb);
}
