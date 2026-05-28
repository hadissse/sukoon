/**
 * Fixed star catalog — Robson (1923) as primary source.
 * Positions are tropical ecliptic longitude at J2000.0 (JD 2451545.0).
 * Source: Vivian Robson, "The Fixed Stars and Constellations in Astrology" (1923).
 *
 * Arabic names are the traditional Arabic designations preserved in modern
 * stellar nomenclature; many are derived directly from the Arabic astronomer
 * tradition (al-Sufi, Ibn Qutayba, al-Battani).
 *
 * Precession rate: ~1° per 72 years (50.29"/yr in ecliptic longitude).
 * Use currentLongitude() to get position at any Julian Day.
 */

export interface FixedStar {
  /** Traditional Arabic name */
  nameAr: string;
  /** Arabic transliteration (original Arabic designation) */
  translitAr: string;
  /** Western/Latinate name */
  nameLatin: string;
  /** Bayer designation (e.g. α Leo) */
  bayer: string;
  /** Tropical longitude at J2000.0 in decimal degrees */
  lon2000: number;
  /** Ecliptic latitude (deg) — small for most, relevant for parallax */
  lat: number;
  /** Magnitude */
  mag: number;
  /** Robson's primary keyword (reference only, not interpretation) */
  robsonKeyword: string;
  /** Conjunction orb in degrees used for detection */
  orb: number;
}

export const FIXED_STARS: FixedStar[] = [
  {
    nameAr: 'رأس الغول',
    translitAr: "Ra's al-Ghul",
    nameLatin: 'Algol',
    bayer: 'β Persei',
    lon2000: 56.15,
    lat: 22.5,
    mag: 2.12,
    robsonKeyword: 'Variable star — winking demon',
    orb: 1.0,
  },
  {
    nameAr: 'الثريّا',
    translitAr: 'ath-Thurayya',
    nameLatin: 'Alcyone / Pleiades',
    bayer: 'η Tauri',
    lon2000: 59.80,
    lat: 4.03,
    mag: 2.87,
    robsonKeyword: 'Cluster — tears, sight',
    orb: 2.0,
  },
  {
    nameAr: 'الدبران',
    translitAr: 'ad-Dabarān',
    nameLatin: 'Aldebaran',
    bayer: 'α Tauri',
    lon2000: 69.75,
    lat: -5.47,
    mag: 0.85,
    robsonKeyword: 'Royal star of East — honor, courage',
    orb: 2.0,
  },
  {
    nameAr: 'رِجل الجوزاء',
    translitAr: 'Rijl al-Jawzā',
    nameLatin: 'Rigel',
    bayer: 'β Orionis',
    lon2000: 76.85,
    lat: -31.12,
    mag: 0.12,
    robsonKeyword: 'Wealth, honor, fortune',
    orb: 1.5,
  },
  {
    nameAr: 'العيّوق',
    translitAr: "al-'Ayyūq",
    nameLatin: 'Capella',
    bayer: 'α Aurigae',
    lon2000: 81.95,
    lat: 22.86,
    mag: 0.08,
    robsonKeyword: 'Honor, eminence, renown',
    orb: 1.5,
  },
  {
    nameAr: 'إبط الجوزاء',
    translitAr: 'Ibt al-Jawzā',
    nameLatin: 'Betelgeuse',
    bayer: 'α Orionis',
    lon2000: 88.73,
    lat: -16.04,
    mag: 0.42,
    robsonKeyword: 'Honor, intellect, success',
    orb: 1.5,
  },
  {
    nameAr: 'الشِّعرى اليمانية',
    translitAr: "ash-Shi'rā al-Yamāniyya",
    nameLatin: 'Sirius',
    bayer: 'α Canis Majoris',
    lon2000: 104.08,
    lat: -39.6,
    mag: -1.46,
    robsonKeyword: 'Wealth, renown, faithfulness',
    orb: 2.0,
  },
  {
    nameAr: 'رأس التوأم المقدِّم',
    translitAr: "Ra's at-Taw'am al-Muqaddim",
    nameLatin: 'Castor',
    bayer: 'α Geminorum',
    lon2000: 110.28,
    lat: 10.05,
    mag: 1.58,
    robsonKeyword: 'Prominence, distinction, sometimes violence',
    orb: 1.0,
  },
  {
    nameAr: 'رأس التوأم المؤخِّر',
    translitAr: "Ra's at-Taw'am al-Mu'akhkhir",
    nameLatin: 'Pollux',
    bayer: 'β Geminorum',
    lon2000: 113.27,
    lat: 6.68,
    mag: 1.14,
    robsonKeyword: 'Craft, tact, caution',
    orb: 1.0,
  },
  {
    nameAr: 'الشِّعرى الشامية',
    translitAr: "ash-Shi'rā ash-Shāmiyya",
    nameLatin: 'Procyon',
    bayer: 'α Canis Minoris',
    lon2000: 115.82,
    lat: -16.02,
    mag: 0.38,
    robsonKeyword: 'Impetuosity, willfulness',
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
    robsonKeyword: 'Royal star — success if revenge avoided',
    orb: 2.0,
  },
  {
    nameAr: 'السِّماك الأعزل',
    translitAr: "as-Simāk al-A'zal",
    nameLatin: 'Spica',
    bayer: 'α Virginis',
    lon2000: 203.84,
    lat: -2.05,
    mag: 0.98,
    robsonKeyword: 'Renown, wealth, brilliance',
    orb: 2.0,
  },
  {
    nameAr: 'السِّماك الرامح',
    translitAr: 'as-Simāk ar-Rāmih',
    nameLatin: 'Arcturus',
    bayer: 'α Bootis',
    lon2000: 204.22,
    lat: 30.73,
    mag: -0.05,
    robsonKeyword: 'Renown, riches, honor',
    orb: 1.5,
  },
  {
    nameAr: 'الزُّبانى',
    translitAr: 'az-Zubānā',
    nameLatin: 'Southern Scale / Zubenelgenubi',
    bayer: 'α Librae',
    lon2000: 224.78,
    lat: 0.77,
    mag: 2.75,
    robsonKeyword: 'Danger, disgrace, loss; favorable in good dignity',
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
    robsonKeyword: 'Royal star of West — rashness, war, honor',
    orb: 2.0,
  },
  {
    nameAr: 'النسر الواقع',
    translitAr: 'an-Nasr al-Wāqi',
    nameLatin: 'Vega',
    bayer: 'α Lyrae',
    lon2000: 285.26,
    lat: 61.72,
    mag: 0.03,
    robsonKeyword: 'Refinement, ideality, artistic gifts',
    orb: 1.5,
  },
  {
    nameAr: 'النسر الطائر',
    translitAr: "an-Nasr at-Ta'ir",
    nameLatin: 'Altair',
    bayer: 'α Aquilae',
    lon2000: 301.70,
    lat: 29.31,
    mag: 0.76,
    robsonKeyword: 'Boldness, ambition, sudden success',
    orb: 1.0,
  },
  {
    nameAr: 'ذنب الدجاجة',
    translitAr: 'Dhanab ad-Dajāja',
    nameLatin: 'Deneb Cygni',
    bayer: 'α Cygni',
    lon2000: 325.08,
    lat: 59.94,
    mag: 1.25,
    robsonKeyword: 'Originality, judgment, faith',
    orb: 1.0,
  },
  {
    nameAr: 'فم الحوت',
    translitAr: 'Fam al-Hūt',
    nameLatin: 'Fomalhaut',
    bayer: 'α Piscis Austrini',
    lon2000: 333.89,
    lat: -21.13,
    mag: 1.16,
    robsonKeyword: 'Royal star of North — eminence, fame',
    orb: 2.0,
  },
  {
    nameAr: 'آخر النهر',
    translitAr: 'Ākhir an-Nahr',
    nameLatin: 'Achernar',
    bayer: 'α Eridani',
    lon2000: 345.30,
    lat: -59.51,
    mag: 0.46,
    robsonKeyword: 'Prominence in religion, philosophy, public affairs',
    orb: 1.0,
  },
];

export function fixedStarSlug(nameLatin: string): string {
  const part = nameLatin.split('/').pop()!.trim();
  return part.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
}

// Precession rate in degrees per year (ecliptic longitude)
const PRECESSION_DEG_PER_YEAR = 50.29 / 3600;
const J2000 = 2451545.0;

/**
 * Returns the precessed tropical longitude of a fixed star at the given Julian Day.
 */
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
  'chiron', 'northNode', 'southNode',
] as const;

const PLANET_NAMES_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

/**
 * Finds all fixed star conjunctions within orb for a given chart.
 * Chart must include a timestamp (Julian Day) for precession correction.
 */
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
