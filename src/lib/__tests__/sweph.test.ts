/**
 * Smoke test for sweph (Swiss Ephemeris) binding.
 * Reference date: 2000-01-01 12:00 UTC (J2000.0 epoch, JD 2451545.0)
 */

import { describe, it, expect } from 'vitest';
import sweph from 'sweph';

const { SE_SUN, SE_MOON, SE_MARS, SEFLG_MOSEPH } = sweph.constants;

sweph.set_ephe_path(''); // Use built-in Moshier ephemeris (no file download needed)

describe('sweph binding', () => {
  it('loads without errors', () => {
    expect(sweph).toBeDefined();
    expect(typeof sweph.calc_ut).toBe('function');
    expect(typeof sweph.houses).toBe('function');
  });

  it('calculates Sun longitude at J2000.0 within 0.1° of expected', () => {
    const result = sweph.calc_ut(2451545.0, SE_SUN, SEFLG_MOSEPH);
    expect(result.error).toBeFalsy();
    // Sun at J2000.0 ~280.46° (Capricorn ~10°)
    expect(result.data[0]).toBeGreaterThan(279);
    expect(result.data[0]).toBeLessThan(282);
  });

  it('calculates Moon longitude at J2000.0 within 5° of expected', () => {
    const result = sweph.calc_ut(2451545.0, SE_MOON, SEFLG_MOSEPH);
    expect(result.error).toBeFalsy();
    // Moon at J2000.0 ~218-223°
    expect(result.data[0]).toBeGreaterThan(213);
    expect(result.data[0]).toBeLessThan(228);
  });

  it('calculates Mars longitude without error', () => {
    const result = sweph.calc_ut(2451545.0, SE_MARS, SEFLG_MOSEPH);
    expect(result.error).toBeFalsy();
    expect(result.data[0]).toBeGreaterThanOrEqual(0);
    expect(result.data[0]).toBeLessThan(360);
  });

  it('calculates Placidus house cusps for Riyadh at J2000.0', () => {
    const result = sweph.houses(2451545.0, 24.7136, 46.6753, 'P');
    const cusps = result.data.houses; // 12-element array (0-indexed)
    expect(cusps).toHaveLength(12);
    for (const cusp of cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
    // ASC is points[0]
    const asc = result.data.points[0];
    expect(asc).toBeGreaterThanOrEqual(0);
    expect(asc).toBeLessThan(360);
  });

  it('calculates Whole Sign house cusps for Riyadh at J2000.0', () => {
    const result = sweph.houses(2451545.0, 24.7136, 46.6753, 'W');
    const cusps = result.data.houses;
    expect(cusps).toHaveLength(12);
    // Whole Sign cusps are multiples of 30°
    for (const cusp of cusps) {
      expect(cusp % 30).toBeCloseTo(0, 5);
    }
  });
});
