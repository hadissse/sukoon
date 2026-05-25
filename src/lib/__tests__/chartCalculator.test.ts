import { describe, it, expect } from 'vitest';
import { calculateChart, getSignNumber, getSignName, getSignGlyph } from '../chartCalculator';

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
    expect(chart).toHaveProperty('lilith');
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
      chart.neptune, chart.pluto, chart.chiron, chart.lilith];
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

  it('Lilith longitude is in 0–360 range and not equal to moon+180', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(chart.lilith.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.lilith.longitude).toBeLessThan(360);
    const wrongLilith = ((chart.moon.longitude + 180) % 360 + 360) % 360;
    // Mean Lilith should differ from the old moon+180 placeholder
    expect(Math.abs(chart.lilith.longitude - wrongLilith)).toBeGreaterThan(0.1);
  });

  it('ASC and MC are different ecliptic points', () => {
    const chart = calculateChart(ARIES_BIRTH);
    expect(Math.abs(chart.asc - chart.mc)).toBeGreaterThan(5);
  });
});
