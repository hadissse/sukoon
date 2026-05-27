import { NextRequest, NextResponse } from 'next/server';
import sweph from 'sweph';
import type { AstralChart, BirthData, PlanetPosition, HousePosition } from '@/lib/chartCalculator';

// Built-in Moshier ephemeris — no external .se1 files needed.
// Accurate to ~1-2 arcseconds for main planets. Chiron uses a separate Keplerian solver.
sweph.set_ephe_path('');

const {
  SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS,
  SE_JUPITER, SE_SATURN, SE_URANUS, SE_NEPTUNE, SE_PLUTO,
  SE_MEAN_NODE, SEFLG_MOSEPH, SEFLG_SPEED, SE_GREG_CAL,
} = sweph.constants;

const FLAGS = SEFLG_MOSEPH | SEFLG_SPEED;

const ZODIAC_NAMES_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء',
  'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت',
];

const PLANET_GLYPHS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', northNode: '☊', southNode: '☋',
};

const PLANET_NAMES_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'الرأس', southNode: 'الذيل',
};

// ── Math helpers ──────────────────────────────────────────────────────────────

function norm360(d: number) { return ((d % 360) + 360) % 360; }
function norm180(d: number) { const r = norm360(d); return r > 180 ? r - 360 : r; }
const DEG = Math.PI / 180;
function toRad(d: number) { return d * DEG; }
function toDeg(r: number) { return r / DEG; }

function decimalToDMS(decimal: number) {
  const degree = Math.floor(Math.abs(decimal));
  const minuteRaw = Math.round((Math.abs(decimal) - degree) * 60);
  return { degree: minuteRaw === 60 ? degree + 1 : degree, minute: minuteRaw === 60 ? 0 : minuteRaw };
}

function longitudeToSignAndDegree(longitude: number) {
  const n = norm360(longitude);
  const signNumber = Math.floor(n / 30);
  const inSign = n - signNumber * 30;
  const { degree, minute } = decimalToDMS(inSign);
  return { sign: ZODIAC_NAMES_AR[signNumber], signNumber, degree, minute };
}

function makePlanet(key: string, lon: number, lat: number, speedLon?: number): PlanetPosition {
  return {
    name: PLANET_NAMES_AR[key],
    glyph: PLANET_GLYPHS[key],
    longitude: lon,
    latitude: lat,
    ...longitudeToSignAndDegree(lon),
    ...(speedLon !== undefined ? { retrograde: speedLon < 0 } : {}),
  };
}

// ── Chiron — Keplerian propagation ────────────────────────────────────────────
// Osculating elements at J2000.0. Accurate to ~0.1° within ±50 years of J2000.

const CHIRON_ELEMENTS = {
  a: 13.6400, e: 0.38261,
  i: toRad(6.9306),
  Om: toRad(339.31), om: toRad(339.74),
  M0: toRad(28.04), n: toRad(0.019534),
};

function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 60; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

function chironsLongitudeAtJD(jd: number, earthX: number, earthY: number, earthZ: number) {
  const { a, e, i, Om, om, M0, n } = CHIRON_ELEMENTS;
  const d = jd - 2451545.0;
  const M = toRad(norm360(toDeg(M0) + toDeg(n) * d));
  const E = solveKepler(M, e);
  const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const r = a * (1 - e * Math.cos(E));

  const cosOm = Math.cos(Om), sinOm = Math.sin(Om);
  const cosom = Math.cos(om + v), sinom = Math.sin(om + v);
  const cosi = Math.cos(i), sini = Math.sin(i);

  const xH = r * (cosOm * cosom - sinOm * sinom * cosi);
  const yH = r * (sinOm * cosom + cosOm * sinom * cosi);
  const zH = r * sinom * sini;

  const xG = xH - earthX;
  const yG = yH - earthY;
  const zG = zH - earthZ;

  const lon = norm360(toDeg(Math.atan2(yG, xG)));
  const dist = Math.sqrt(xG * xG + yG * yG + zG * zG);
  const lat = toDeg(Math.asin(zG / dist));
  return { lon, lat };
}

function getEarthHelioPos(jd: number): { x: number; y: number; z: number } {
  // Earth heliocentric = negate Sun geocentric (good approximation)
  const sun = sweph.calc_ut(jd, SE_SUN, FLAGS);
  // sweph gives geocentric ecliptic; for Keplerian Chiron we need heliocentric
  // We use the Sun's rectangular components via a second call with SEFLG_XYZ if available,
  // but the simplest approach: convert Sun geocentric ecliptic lon/lat/dist to rectangular
  const lon = toRad(sun.data[0]);
  const lat = toRad(sun.data[1]);
  const dist = sun.data[2]; // AU
  return {
    x: -dist * Math.cos(lat) * Math.cos(lon),
    y: -dist * Math.cos(lat) * Math.sin(lon),
    z: -dist * Math.sin(lat),
  };
}

// ── Main calculation ──────────────────────────────────────────────────────────

function calculateChartServer(bd: BirthData): AstralChart {
  // UTC hour from local time
  const utcHour = bd.hour - bd.utcOffsetHours + bd.minute / 60;
  // Handle day rollover
  let year = bd.year, month = bd.month, day = bd.day;
  let hour = utcHour;
  if (hour < 0) { hour += 24; day -= 1; }
  if (hour >= 24) { hour -= 24; day += 1; }

  const jd = sweph.julday(year, month, day, hour, SE_GREG_CAL);

  const planetDefs: Array<{ key: string; id: number }> = [
    { key: 'sun', id: SE_SUN },
    { key: 'moon', id: SE_MOON },
    { key: 'mercury', id: SE_MERCURY },
    { key: 'venus', id: SE_VENUS },
    { key: 'mars', id: SE_MARS },
    { key: 'jupiter', id: SE_JUPITER },
    { key: 'saturn', id: SE_SATURN },
    { key: 'uranus', id: SE_URANUS },
    { key: 'neptune', id: SE_NEPTUNE },
    { key: 'pluto', id: SE_PLUTO },
  ];

  const planets: Record<string, PlanetPosition> = {};

  for (const { key, id } of planetDefs) {
    const r = sweph.calc_ut(jd, id, FLAGS);
    const lon = r.data[0];
    const lat = r.data[1];
    const speedLon = r.data[3]; // deg/day — negative = retrograde
    planets[key] = makePlanet(key, lon, lat, key !== 'sun' && key !== 'moon' ? speedLon : undefined);
  }

  // Chiron — Keplerian (sweph requires asteroid file for SE_CHIRON)
  const earth = getEarthHelioPos(jd);
  const chiron0 = chironsLongitudeAtJD(jd, earth.x, earth.y, earth.z);
  const earth1 = getEarthHelioPos(jd + 1);
  const chiron1 = chironsLongitudeAtJD(jd + 1, earth1.x, earth1.y, earth1.z);
  const chironRetro = norm180(chiron1.lon - chiron0.lon) < 0;
  planets.chiron = { ...makePlanet('chiron', chiron0.lon, chiron0.lat), retrograde: chironRetro };

  // Mean North Node
  const nodeResult = sweph.calc_ut(jd, SE_MEAN_NODE, FLAGS);
  const northNodeLon = nodeResult.data[0];
  planets.northNode = makePlanet('northNode', northNodeLon, 0);
  planets.southNode = makePlanet('southNode', norm360(northNodeLon + 180), 0);

  // Houses — Placidus ('P') is the stored default; Whole Sign ('W') available via switcher
  const housesResult = sweph.houses(jd, bd.latitude, bd.longitude, 'P');
  const cusps = housesResult.data.houses; // 12-element, 0-indexed
  const points = housesResult.data.points;
  const asc = points[0];
  const mc = points[1];

  const houses: HousePosition[] = cusps.map((cusp: number, idx: number) => ({
    num: idx + 1,
    cusp,
    ...longitudeToSignAndDegree(cusp),
  }));

  return {
    asc,
    mc,
    sun: planets.sun,
    moon: planets.moon,
    mercury: planets.mercury,
    venus: planets.venus,
    mars: planets.mars,
    jupiter: planets.jupiter,
    saturn: planets.saturn,
    uranus: planets.uranus,
    neptune: planets.neptune,
    pluto: planets.pluto,
    chiron: planets.chiron,
    northNode: planets.northNode,
    southNode: planets.southNode,
    houses,
    timestamp: jd,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as BirthData;

    const required = ['year', 'month', 'day', 'hour', 'minute', 'latitude', 'longitude', 'utcOffsetHours'];
    for (const field of required) {
      if (body[field as keyof BirthData] === undefined || body[field as keyof BirthData] === null) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const chart = calculateChartServer(body);
    return NextResponse.json(chart);
  } catch (err) {
    console.error('[calculate-chart]', err);
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
