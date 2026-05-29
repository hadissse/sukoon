import { describe, it, expect } from 'vitest';
import { calculateChart, computeAscendant, chironLongitude, getSignNumber, getSignName, getSignGlyph } from '../chartCalculator';
import * as Astronomy from 'astronomy-engine';

// Known reference: Sun at ~15° Aries for Apr 5, 2000 UTC
const ARIES_BIRTH: Parameters<typeof calculateChart>[0] = {
  year: 2000, month: 4, day: 5,
  hour: 12, minute: 0,
  latitude: 35.0, longitude: 36.0,
  utcOffsetHours: 3,
};

describe('getSignNumber', () => {
  it('returns 0 for 0° (Aries)', () => expect(getSignNumber(0)).toBe(0));
  it('returns 0 for 29° (still Aries)', () => expect(getSignNumber(29)).toBe(0));
  it('returns 1 for 30° (Taurus start)', () => expect(getSignNumber(30)).toBe(1));
  it('returns 11 for 330° (Pisces)', () => expect(getSignNumber(330)).toBe(11));
  it('normalizes angles > 360', () => expect(getSignNumber(390)).toBe(1));
  it('normalizes negative angles', () => expect(getSignNumber(-30)).toBe(11));
});

describe('getSignName', () => {
  it('returns Arabic name for Aries', () => expect(getSignName(0)).toBe('الحمل'));
  it('returns Arabic name for Pisces', () => expect(getSignName(11)).toBe('الحوت'));
  it('wraps around at 12', () => expect(getSignName(12)).toBe('الحمل'));
});

describe('getSignGlyph', () => {
  it('returns ♈ for Aries', () => expect(getSignGlyph(0)).toBe('♈'));
  it('returns ♓ for Pisces', () => expect(getSignGlyph(11)).toBe('♓'));
});

describe('calculateChart', () => {
  it('returns a chart object with all required planets', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart).toHaveProperty('sun');
    expect(chart).toHaveProperty('moon');
    expect(chart).toHaveProperty('mercury');
    expect(chart).toHaveProperty('venus');
    expect(chart).toHaveProperty('mars');
    expect(chart).toHaveProperty('jupiter');
    expect(chart).toHaveProperty('saturn');
    expect(chart).toHaveProperty('chiron');
    expect(chart).toHaveProperty('northNode');
    expect(chart).toHaveProperty('southNode');
  });

  it('has 12 houses', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart.houses).toHaveLength(12);
    expect(chart.houses[0].num).toBe(1);
    expect(chart.houses[11].num).toBe(12);
  });

  it('house 1 cusp equals ASC', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart.houses[0].cusp).toBeCloseTo(chart.asc, 3);
  });

  it('house 10 cusp equals MC', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart.houses[9].cusp).toBeCloseTo(chart.mc, 3);
  });

  it('house 7 cusp is DSC (ASC + 180)', () => {
    const chart = calculateChart(ARIES_BIRTH);
    const dsc = ((chart.asc + 180) % 360 + 360) % 360;
    expect(chart.houses[6].cusp).toBeCloseTo(dsc, 3);
  });

  it('Sun is in Aries on Apr 5 2000', () => {
    const chart = calculateChart(ARIES_BIRTH);
    // Around Apr 5 sun should be ~15° Aries
    expect(chart.sun.signNumber).toBe(0); // Aries
    expect(chart.sun.sign).toBe('الحمل');
    expect(chart.sun.degree).toBeGreaterThanOrEqual(14);
    expect(chart.sun.degree).toBeLessThanOrEqual(16);
  });

  it('all planet longitudes are in 0–360 range', () => {
    const chart = calculateChart(ARIES_BIRTH);
    const bodies = [chart.sun, chart.moon, chart.mercury, chart.venus,
      chart.mars, chart.jupiter, chart.saturn, chart.uranus,
      chart.neptune, chart.pluto, chart.chiron, chart.northNode, chart.southNode];
    for (const b of bodies) {
      expect(b.longitude).toBeGreaterThanOrEqual(0);
      expect(b.longitude).toBeLessThan(360);
    }
  });

  it('Chiron longitude differs from placeholder (saturn+uranus)/2', () => {
    const chart = calculateChart(ARIES_BIRTH);
    const wrongChiron = (chart.saturn.longitude + chart.uranus.longitude) / 2;
    expect(Math.abs(chart.chiron.longitude - wrongChiron)).toBeGreaterThan(1);
  });

  it('North Node longitude is in 0–360 range and South Node is exactly opposite', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart.northNode.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.northNode.longitude).toBeLessThan(360);
    const expectedSouth = ((chart.northNode.longitude + 180) % 360 + 360) % 360;
    expect(chart.southNode.longitude).toBeCloseTo(expectedSouth, 1);
  });

  it('ASC and MC are different ecliptic points', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(Math.abs(chart.asc - chart.mc)).toBeGreaterThan(5);
  });
});

describe('computeAscendant (rising point, not the descendant)', () => {
  // Obliquity at J2000 ≈ 23.4393°. At the equator with RAMC=0 the vernal point
  // culminates, so 0° Cancer (90°) rises — NOT 270° (the descendant).
  const EPS = 23.4392911;
  it('equator, RAMC=0 → 90° (0° Cancer), not 270°', () => {
    expect(computeAscendant(0, EPS, 0)).toBeCloseTo(90, 4);
  });
  it('equator, RAMC=90 → 180° (0° Libra)', () => {
    expect(computeAscendant(90, EPS, 0)).toBeCloseTo(180, 4);
  });
  it('northern latitude stays ~90° ahead of the MC region (rising, not setting)', () => {
    // RAMC=0, MC≈0° Aries; the ascendant must be in the rising quadrant (~90–180°).
    const asc = computeAscendant(0, EPS, 40);
    expect(asc).toBeGreaterThan(90);
    expect(asc).toBeLessThan(180);
  });
});

describe('Chiron accuracy (calibrated osculating elements)', () => {
  function chironLonAt(y: number, m: number, d: number): number {
    const t = new Astronomy.AstroTime(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
    return chironLongitude(t.tt + 2451545.0, t).lon;
  }
  // Known tropical sign-ingress dates — Chiron should be within ~1.5° of the cusp.
  it('is near 0° Aquarius (300°) at the Feb 2005 ingress', () => {
    expect(Math.abs(((chironLonAt(2005, 2, 21) - 300 + 540) % 360) - 180)).toBeLessThan(1.5);
  });
  it('is near 0° Aries (0°/360°) at the Apr 2018 ingress', () => {
    expect(Math.abs(((chironLonAt(2018, 4, 17) - 0 + 540) % 360) - 180)).toBeLessThan(1.5);
  });
  it('is NOT near the old buggy value (~0° Virgo) on 2024-01-01', () => {
    // The mislabeled node previously put Chiron at ~150° (0° Virgo); true ≈ 15° Aries.
    const lon = chironLonAt(2024, 1, 1);
    expect(Math.abs(((lon - 150 + 540) % 360) - 180)).toBeGreaterThan(100);
  });
});
