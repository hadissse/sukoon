'use client';

import { useEffect, useState } from 'react';
import type { AstralChart } from './chartCalculator';

/** localStorage key the onboarding flow writes the computed natal chart to. */
export const PRIMARY_CHART_KEY = 'sukoon.primary-chart.v1';

/**
 * Loads the user's saved natal chart from localStorage (client-only).
 * Returns null until it has loaded, or when no chart has been saved yet.
 */
export function usePrimaryChart(): AstralChart | null {
  const [chart, setChart] = useState<AstralChart | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRIMARY_CHART_KEY);
      if (stored) setChart(JSON.parse(stored));
    } catch {
      /* localStorage unavailable */
    }
  }, []);
  return chart;
}
