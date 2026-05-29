import * as Astronomy from 'astronomy-engine';

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  utcOffsetHours: number;
}

export interface PlanetPosition {
  name: string;
  glyph: string;
  longitude: number;
  latitude: number;
  sign: string;
  signNumber: number;
  degree: number;
  minute: number;
  retrograde?: boolean;
}

export interface HousePosition {
  num: number;
  cusp: number;
  sign: string;
  signNumber: number;
  degree: number;
  minute: number;
}

export interface AstralChart {
  asc: number;
  mc: number;
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  chiron: PlanetPosition;
  northNode: PlanetPosition;
  southNode: PlanetPosition;
  houses: HousePosition[];
  timestamp: number;
}

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء',
  'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت',
];

const PLANET_GLYPHS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', northNode: '☊', southNode: '☋',
};

// ── Math helpers ──────────────────────────────────────────────────────────────

const DEG = Math.PI / 180;
function toRad(d: number) { return d * DEG; }
function toDeg(r: number) { return r / DEG; }
function norm360(d: number) { return ((d % 360) + 360) % 360; }
function norm180(d: number) { const r = norm360(d); return r > 180 ? r - 360 : r; }

// Mean obliquity of the ecliptic (degrees), T = Julian centuries from J2000
function meanObliquity(T: number): number {
  return 23.4392911 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
}

// Ecliptic longitude (degrees) → right ascension (degrees)
function eclToRA(lambda: number, eps: number): number {
  return norm360(toDeg(Math.atan2(
    Math.sin(toRad(lambda)) * Math.cos(toRad(eps)),
    Math.cos(toRad(lambda)),
  )));
}

// Right ascension (degrees) → ecliptic longitude (degrees)
function raToEcl(ra: number, eps: number): number {
  return norm360(toDeg(Math.atan2(
    Math.sin(toRad(ra)),
    Math.cos(toRad(ra)) * Math.cos(toRad(eps)),
  )));
}

// Ecliptic longitude → declination (degrees)
function eclToDec(lambda: number, eps: number): number {
  return toDeg(Math.asin(Math.sin(toRad(lambda)) * Math.sin(toRad(eps))));
}

// ── Kepler solver ─────────────────────────────────────────────────────────────

function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 60; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

// ── Chiron — Keplerian propagation ────────────────────────────────────────────
// astronomy-engine has no asteroids, so Chiron (2060) is propagated from its
// osculating elements as a two-body orbit and combined with the engine's Earth
// vector. Elements referenced to the ecliptic of J2000.0 (epoch 2451545.0).
//
// IMPORTANT: the ascending node is ~209.4°. A previous version used 339.31°
// here (which is actually near the argument of perihelion), throwing Chiron
// off by 130–240°. M0 below is calibrated so the propagation reproduces the
// known tropical sign-ingress dates (Cap 2001, Aqu 2005, Pis 2011, Ari 2018)
// to within ~0.4° across 1950–2025.

const CHIRON = {
  a: 13.7000,        // AU (semi-major axis)
  e: 0.3772,         // eccentricity
  i: toRad(6.93),    // inclination
  Om: toRad(209.38), // longitude of ascending node
  om: toRad(339.48), // argument of perihelion
  M0: toRad(28.30),  // mean anomaly at J2000.0 (calibrated to ingress dates)
  n: toRad(360 / (50.71 * 365.25)), // mean motion: period 50.71 yr → deg/day → rad/day
};

export function chironLongitude(jd: number, birthTime: Astronomy.AstroTime): { lon: number; lat: number } {
  const T0 = 2451545.0; // J2000.0
  const d = jd - T0;
  const M = norm360(toDeg(CHIRON.M0 + CHIRON.n * d));
  const Mrad = toRad(M);
  const E = solveKepler(Mrad, CHIRON.e);
  const v = 2 * Math.atan2(
    Math.sqrt(1 + CHIRON.e) * Math.sin(E / 2),
    Math.sqrt(1 - CHIRON.e) * Math.cos(E / 2),
  );
  const r = CHIRON.a * (1 - CHIRON.e * Math.cos(E));

  // Heliocentric ecliptic rectangular coordinates
  const cosOm = Math.cos(CHIRON.Om), sinOm = Math.sin(CHIRON.Om);
  const cosom = Math.cos(CHIRON.om + v), sinom = Math.sin(CHIRON.om + v);
  const cosi = Math.cos(CHIRON.i), sini = Math.sin(CHIRON.i);

  const xH = r * (cosOm * cosom - sinOm * sinom * cosi);
  const yH = r * (sinOm * cosom + cosOm * sinom * cosi);
  const zH = r * sinom * sini;

  // Earth's heliocentric position
  const earthVec = Astronomy.HelioVector(Astronomy.Body.Earth, birthTime);

  const xG = xH - earthVec.x;
  const yG = yH - earthVec.y;
  const zG = zH - earthVec.z;

  const lon = norm360(toDeg(Math.atan2(yG, xG)));
  const dist = Math.sqrt(xG * xG + yG * yG + zG * zG);
  const lat = toDeg(Math.asin(zG / dist));

  return { lon, lat };
}

// ── Mean Lilith — Mean Lunar Apogee ──────────────────────────────────────────
// Meeus "Astronomical Algorithms": ω̄ = 83.3532465 + 40690.1357 × T - 0.0103200 × T²

function meanLilithLongitude(T: number): number {
  const perigee = norm360(83.3532465 + 40690.1357 * T - 0.0103200 * T * T);
  return norm360(perigee + 180);
}

// ── Ascendant ──────────────────────────────────────────────────────────────────
// Ecliptic longitude of the point rising on the eastern horizon (Meeus).
//   λ_ASC = atan2( cos θ , −(sin θ·cos ε + tan φ·sin ε) )      θ = RAMC
// NOTE: the arguments must be (cos θ, −(…)). Using (−cos θ, +(…)) instead — as a
// previous version did — returns the *Descendant*, i.e. the ascendant 180° wrong.
export function computeAscendant(ramc: number, eps: number, latDeg: number): number {
  const ramcR = toRad(ramc);
  const epsR = toRad(eps);
  const phiR = toRad(latDeg);
  return norm360(toDeg(Math.atan2(
    Math.cos(ramcR),
    -(Math.sin(ramcR) * Math.cos(epsR) + Math.tan(phiR) * Math.sin(epsR)),
  )));
}

// ── Placidus houses ───────────────────────────────────────────────────────────

function placidusUpperCusp(ramc: number, fraction: number, eps: number, phi: number): number {
  // Houses 11 (fraction=1/3) and 12 (fraction=2/3): use diurnal semi-arc
  let lambda = norm360(ramc + fraction * 90);
  for (let i = 0; i < 40; i++) {
    const dec = eclToDec(lambda, eps);
    const sinAD = Math.tan(toRad(dec)) * Math.tan(toRad(phi));
    const ad = Math.abs(sinAD) >= 1 ? 90 * Math.sign(sinAD) : toDeg(Math.asin(sinAD));
    const dsa = 90 + ad;
    const targetRA = norm360(ramc + dsa * fraction);
    const newLambda = raToEcl(targetRA, eps);
    const diff = norm180(newLambda - lambda);
    lambda = norm360(lambda + diff * 0.5);
    if (Math.abs(diff) < 0.0001) break;
  }
  return lambda;
}

function placidusLowerCusp(ramc: number, fraction: number, eps: number, phi: number): number {
  // Houses 2 (fraction=1/3) and 3 (fraction=2/3) lie between the ASC and the IC,
  // below the horizon. They are measured back from the IC toward the ASC (i.e.
  // RA decreasing from the IC), spanning (1 - fraction) of the nocturnal arc.
  const ic = norm360(ramc + 180);
  const f = 1 - fraction;
  let lambda = norm360(ic - f * 90);
  for (let i = 0; i < 40; i++) {
    const dec = eclToDec(lambda, eps);
    const sinAD = Math.tan(toRad(dec)) * Math.tan(toRad(phi));
    const ad = Math.abs(sinAD) >= 1 ? 90 * Math.sign(sinAD) : toDeg(Math.asin(sinAD));
    const nsa = 90 - ad;
    const targetRA = norm360(ic - nsa * f);
    const newLambda = raToEcl(targetRA, eps);
    const diff = norm180(newLambda - lambda);
    lambda = norm360(lambda + diff * 0.5);
    if (Math.abs(diff) < 0.0001) break;
  }
  return lambda;
}

// ── Chart calculation ─────────────────────────────────────────────────────────

function decimalToDMS(decimal: number): { degree: number; minute: number } {
  const degree = Math.floor(Math.abs(decimal));
  const minute = Math.round((Math.abs(decimal) - degree) * 60);
  return { degree, minute: minute === 60 ? 0 : minute };
}

function longitudeToSignAndDegree(longitude: number) {
  const normalized = norm360(longitude);
  const signNumber = Math.floor(normalized / 30);
  const inSignDegree = normalized - signNumber * 30;
  const { degree, minute } = decimalToDMS(inSignDegree);
  return { sign: ZODIAC_NAMES_AR[signNumber], signNumber, degree, minute };
}

function makePlanetPosition(
  name: string, glyph: string, lon: number, lat: number,
): PlanetPosition {
  const signData = longitudeToSignAndDegree(lon);
  return { name, glyph, longitude: lon, latitude: lat, ...signData };
}

export function calculateChart(birthData: BirthData): AstralChart {
  // Build exact UTC instant
  const localMs = Date.UTC(birthData.year, birthData.month - 1, birthData.day, birthData.hour, birthData.minute, 0);
  const offsetMinutes = Math.round(birthData.utcOffsetHours * 60);
  const birthTime = new Astronomy.AstroTime(new Date(localMs - offsetMinutes * 60000));

  const jd = birthTime.tt + 2451545.0;
  const T = birthTime.tt / 36525; // Julian centuries from J2000

  // ── Planets (astronomy-engine) ────────────────────────────────────────────
  const planetList = [
    { body: Astronomy.Body.Sun,     key: 'sun',     name: 'الشمس' },
    { body: Astronomy.Body.Moon,    key: 'moon',    name: 'القمر' },
    { body: Astronomy.Body.Mercury, key: 'mercury', name: 'عطارد' },
    { body: Astronomy.Body.Venus,   key: 'venus',   name: 'الزهرة' },
    { body: Astronomy.Body.Mars,    key: 'mars',    name: 'المريخ' },
    { body: Astronomy.Body.Jupiter, key: 'jupiter', name: 'المشتري' },
    { body: Astronomy.Body.Saturn,  key: 'saturn',  name: 'زحل' },
    { body: Astronomy.Body.Uranus,  key: 'uranus',  name: 'أورانوس' },
    { body: Astronomy.Body.Neptune, key: 'neptune', name: 'نبتون' },
    { body: Astronomy.Body.Pluto,   key: 'pluto',   name: 'بلوتو' },
  ] as const;

  const planets: Record<string, PlanetPosition> = {};
  const birthTimePlus1 = new Astronomy.AstroTime(new Date(birthTime.date.getTime() + 3600000));
  for (const { body, key, name } of planetList) {
    const geoVec = Astronomy.GeoVector(body, birthTime, true);
    const ecl = Astronomy.Ecliptic(geoVec);
    const p = makePlanetPosition(name, PLANET_GLYPHS[key], ecl.elon, ecl.elat);
    // Detect retrograde: compare with position 1 day later
    if (body !== Astronomy.Body.Sun && body !== Astronomy.Body.Moon) {
      const geoVec2 = Astronomy.GeoVector(body, birthTimePlus1, true);
      const ecl2 = Astronomy.Ecliptic(geoVec2);
      const motion = norm180(ecl2.elon - ecl.elon);
      p.retrograde = motion < 0;
    }
    planets[key] = p;
  }

  // ── Chiron (Keplerian) ────────────────────────────────────────────────────
  const chiron = chironLongitude(jd, birthTime);
  const chiroPlanet = makePlanetPosition('كيرون', PLANET_GLYPHS.chiron, chiron.lon, chiron.lat);
  // Check chiron retrograde using position 1 hour later (birthTimePlus1 = +1h)
  const chironNext = chironLongitude(jd + (1 / 24), birthTimePlus1);
  chiroPlanet.retrograde = norm180(chironNext.lon - chiron.lon) < 0;
  planets.chiron = chiroPlanet;

  // ── Mean North Node (Mean Lunar Node) ────────────────────────────────────
  const northNodeLon = norm360(125.0445479 - 1934.1362608 * T + 0.0020762 * T * T);
  planets.northNode = makePlanetPosition('شمال القمر', PLANET_GLYPHS.northNode, northNodeLon, 0);
  planets.southNode = makePlanetPosition('جنوب القمر', PLANET_GLYPHS.southNode, norm360(northNodeLon + 180), 0);

  // ── RAMC → MC → ASC (Placidus) ───────────────────────────────────────────
  const eps = meanObliquity(T);

  // GMST from astronomy-engine (hours) → RAMC (degrees)
  const gmst = Astronomy.SiderealTime(birthTime); // 0..24 hours
  const lst = ((gmst + birthData.longitude / 15) % 24 + 24) % 24;
  const ramc = lst * 15; // degrees

  // MC: ecliptic longitude corresponding to RAMC
  const mc = raToEcl(ramc, eps);

  // ASC (Meeus formula): point rising on the eastern horizon.
  const asc = computeAscendant(ramc, eps, birthData.latitude);

  // ── Placidus cusps ────────────────────────────────────────────────────────
  const phi = birthData.latitude;
  const h11 = placidusUpperCusp(ramc, 1 / 3, eps, phi);
  const h12 = placidusUpperCusp(ramc, 2 / 3, eps, phi);
  const h2 = placidusLowerCusp(ramc, 1 / 3, eps, phi);
  const h3 = placidusLowerCusp(ramc, 2 / 3, eps, phi);

  // All 12 cusps: 1=ASC, 4=IC, 7=DSC, 10=MC. Opposite cusps are 180° apart,
  // so 5↔11, 6↔12, 8↔2, 9↔3.
  const cuspLons = [
    asc,                       // 1
    h2,                        // 2
    h3,                        // 3
    norm360(mc + 180),         // 4 (IC)
    norm360(h11 + 180),        // 5  (opposite 11)
    norm360(h12 + 180),        // 6  (opposite 12)
    norm360(asc + 180),        // 7 (DSC)
    norm360(h2 + 180),         // 8  (opposite 2)
    norm360(h3 + 180),         // 9  (opposite 3)
    mc,                        // 10
    h11,                       // 11
    h12,                       // 12
  ];

  const houses: HousePosition[] = cuspLons.map((cusp, idx) => ({
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
    timestamp: birthTime.ut,
  };
}

export function getSignNumber(longitude: number): number {
  return Math.floor(norm360(longitude) / 30);
}

export function getSignName(signNumber: number): string {
  return ZODIAC_NAMES_AR[signNumber % 12];
}

export function getSignGlyph(signNumber: number): string {
  return ZODIAC_SIGNS[signNumber % 12];
}
