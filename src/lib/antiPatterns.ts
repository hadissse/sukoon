/**
 * ANTI-PATTERN REGISTRY — philosophy.md § 1.4 & Appendix B
 *
 * This file exists as a machine-readable and human-readable record of what
 * must never be built. Before adding any new feature, check this list.
 *
 * If a feature request matches any item below, refuse it and cite the section.
 * This file is intentionally imported nowhere — it is a constraint document,
 * not a runtime module. Its presence in src/lib/ ensures it travels with the
 * codebase and appears in editor search results.
 */

export const REFUSED_FEATURES = [
  'daily-horoscope-feed',
  'compatibility-matching',
  'relationship-scoring',
  'gamified-trivia',
  'streak-mechanics',
  'subscription-content-treadmill',
  'push-notification-with-interpretive-content',
  'personality-test-generator',
  'auto-generated-life-advice',
  'founder-as-content-type',
  'co-star-equivalent-feature',
  'third-party-analytics-on-birth-data-pages',
  'birth-data-telemetry-without-consent',
  'sidereal-zodiac',
  'synastry-scoring',
  'composite-chart',
  'progressed-chart',
  'swiss-ephemeris-replacement',
] as const;

export type RefusedFeature = typeof REFUSED_FEATURES[number];

/**
 * Call this in a test or a build check to assert a feature key is not
 * being introduced. Usage:
 *
 *   assertNotRefused('daily-horoscope-feed') // throws if it's on the list
 */
export function assertNotRefused(key: string): void {
  if ((REFUSED_FEATURES as readonly string[]).includes(key)) {
    throw new Error(
      `[philosophy] Feature "${key}" is on the refused list (philosophy.md § 1.4 / Appendix B). ` +
        `Do not build it. If you believe this constraint should change, update philosophy.md first.`,
    );
  }
}
