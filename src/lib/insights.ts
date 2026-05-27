import type { LoggedEvent, StreamKey } from './events';

export interface ReflectionInsights {
  totalEvents: number;
  streamDistribution: Record<StreamKey, number>;
  dominantStream: StreamKey | null;
  averageRhythm: number | null;
  expansionPercent: number;
  contractionPercent: number;
  mostCommonHardSky: string | null;
  mostCommonLightSky: string | null;
}

// Cosmic stamp moonPhase looks like "هلال متزايد في الجدي" — we just want
// the phase, not the sign, since the sign rotates faster than patterns appear.
function moonPhaseOnly(stamp: string): string {
  return stamp.split(' في ')[0];
}

export function computeInsights(events: LoggedEvent[]): ReflectionInsights {
  const total = events.length;
  const streams: Record<StreamKey, number> = { thinking: 0, feeling: 0, willing: 0 };
  let rhythmSum = 0;
  let rhythmCount = 0;
  let expansion = 0;
  let contraction = 0;
  const hardPhases: Record<string, number> = {};
  const lightPhases: Record<string, number> = {};

  for (const e of events) {
    if (e.stream) streams[e.stream]++;
    if (e.rhythm !== null && e.rhythm !== undefined) {
      rhythmSum += e.rhythm;
      rhythmCount++;
      if (e.rhythm < 40) {
        expansion++;
        const phase = moonPhaseOnly(e.stamp.moonPhase);
        lightPhases[phase] = (lightPhases[phase] ?? 0) + 1;
      } else if (e.rhythm > 60) {
        contraction++;
        const phase = moonPhaseOnly(e.stamp.moonPhase);
        hardPhases[phase] = (hardPhases[phase] ?? 0) + 1;
      }
    }
  }

  const sortedStreams = (Object.entries(streams) as [StreamKey, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  // Only declare a dominant stream if it's actually ahead.
  const dominantStream: StreamKey | null =
    sortedStreams[0] && sortedStreams[0][1] > (sortedStreams[1]?.[1] ?? 0)
      ? sortedStreams[0][0]
      : null;

  const topPhase = (rec: Record<string, number>): string | null => {
    const entries = Object.entries(rec).sort((a, b) => b[1] - a[1]);
    // Require at least 2 occurrences before calling it a pattern.
    if (entries.length === 0 || entries[0][1] < 2) return null;
    return entries[0][0];
  };

  return {
    totalEvents: total,
    streamDistribution: streams,
    dominantStream,
    averageRhythm: rhythmCount > 0 ? rhythmSum / rhythmCount : null,
    expansionPercent: rhythmCount > 0 ? Math.round((expansion / rhythmCount) * 100) : 0,
    contractionPercent: rhythmCount > 0 ? Math.round((contraction / rhythmCount) * 100) : 0,
    mostCommonHardSky: topPhase(hardPhases),
    mostCommonLightSky: topPhase(lightPhases),
  };
}
