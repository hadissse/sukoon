import { describe, it, expect } from 'vitest';
import { REFUSED_FEATURES, assertNotRefused } from '../antiPatterns';

describe('anti-pattern registry', () => {
  it('contains all required refusals from philosophy.md § 1.4', () => {
    const required = [
      'daily-horoscope-feed',
      'compatibility-matching',
      'push-notification-with-interpretive-content',
      'third-party-analytics-on-birth-data-pages',
      'swiss-ephemeris-replacement',
    ];
    for (const key of required) {
      expect(REFUSED_FEATURES).toContain(key);
    }
  });

  it('assertNotRefused throws for a refused feature', () => {
    expect(() => assertNotRefused('daily-horoscope-feed')).toThrow(/refused list/);
  });

  it('assertNotRefused passes for an unknown feature key', () => {
    expect(() => assertNotRefused('transit-calendar')).not.toThrow();
  });
});
