// Current-sky planetary positions — no birth data needed.
// Returns planet longitudes for RIGHT NOW using astronomy-engine.
// No houses, ASC, or MC — those require location.

import * as Astronomy from 'astronomy-engine';
import { chironLongitude, type AstralChart, type PlanetPosition, type HousePosition } from './chartCalculator';

const ZODIAC_NAMES_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء',
  'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت',
];

function norm360(d: number): number { return ((d % 360) + 360) % 360; }

function longitudeToSignAndDegree(longitude: number) {
  const n = norm360(longitude);
  const signNumber = Math.floor(n / 30);
  const inSign = n - signNumber * 30;
  const degree = Math.floor(inSign);
  const minute = Math.round((inSign - degree) * 60);
  return {
    sign: ZODIAC_NAMES_AR[signNumber],
    signNumber,
    degree: minute === 60 ? degree + 1 : degree,
    minute: minute === 60 ? 0 : minute,
  };
}

function makePlanet(name: string, lon: number, lat: number): PlanetPosition {
  return { name, glyph: '', longitude: lon, latitude: lat, ...longitudeToSignAndDegree(lon) };
}

function meanNorthNodeLongitude(T: number): number {
  return norm360(125.0445479 - 1934.1362608 * T + 0.0020762 * T * T);
}

let _cache: { chart: AstralChart; ts: number } | null = null;
const CACHE_MS = 60_000; // refresh every 60 seconds

export function getCurrentSky(): AstralChart {
  const now = Date.now();
  if (_cache && now - _cache.ts < CACHE_MS) return _cache.chart;

  const astroNow = new Astronomy.AstroTime(new Date());
  const T = astroNow.tt / 36525;

  const PLANETS = [
    { body: Astronomy.Body.Sun,     name: 'الشمس' },
    { body: Astronomy.Body.Moon,    name: 'القمر' },
    { body: Astronomy.Body.Mercury, name: 'عطارد' },
    { body: Astronomy.Body.Venus,   name: 'الزهرة' },
    { body: Astronomy.Body.Mars,    name: 'المريخ' },
    { body: Astronomy.Body.Jupiter, name: 'المشتري' },
    { body: Astronomy.Body.Saturn,  name: 'زحل' },
    { body: Astronomy.Body.Uranus,  name: 'أورانوس' },
    { body: Astronomy.Body.Neptune, name: 'نبتون' },
    { body: Astronomy.Body.Pluto,   name: 'بلوتو' },
  ] as const;

  const p: Record<string, PlanetPosition> = {};
  const keys = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'] as const;
  for (let i = 0; i < PLANETS.length; i++) {
    const geoVec = Astronomy.GeoVector(PLANETS[i].body, astroNow, true);
    const ecl = Astronomy.Ecliptic(geoVec);
    p[keys[i]] = makePlanet(PLANETS[i].name, ecl.elon, ecl.elat);
  }

  p.chiron = makePlanet('كيرون', chironLongitude(astroNow.tt + 2451545.0, astroNow).lon, 0);
  const northNodeLon = meanNorthNodeLongitude(T);
  p.northNode = makePlanet('شمال القمر', northNodeLon, 0);
  p.southNode = makePlanet('جنوب القمر', norm360(northNodeLon + 180), 0);

  // Empty houses — no location needed for the global sky chart
  const emptyHouses: HousePosition[] = Array.from({ length: 12 }, (_, i) => ({
    num: i + 1, cusp: i * 30, sign: ZODIAC_NAMES_AR[i],
    signNumber: i, degree: 0, minute: 0,
  }));

  const chart: AstralChart = {
    asc: 0, mc: 90,
    sun: p.sun, moon: p.moon, mercury: p.mercury, venus: p.venus,
    mars: p.mars, jupiter: p.jupiter, saturn: p.saturn, uranus: p.uranus,
    neptune: p.neptune, pluto: p.pluto, chiron: p.chiron, northNode: p.northNode, southNode: p.southNode,
    houses: emptyHouses,
    timestamp: now,
  };

  _cache = { chart, ts: now };
  return chart;
}
