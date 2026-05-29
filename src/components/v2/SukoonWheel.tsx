'use client';

/**
 * Self-contained natal-wheel renderer for the V2 immersive views (Scr216/217).
 *
 * The shared ZoomableWheel component loads its chart from localStorage and only
 * supports paper/white tones, so it can't render the design's fixed demo chart
 * on a dark immersive background. This is a standalone SVG built for that.
 */

import type { AstralChart } from '@/lib/chartCalculator';

export interface WheelPlanet {
  name: string;
  glyph: string;
  lon: number; // ecliptic longitude, 0 = 0° Aries
  isRetrograde?: boolean;
}

export interface WheelChart {
  ascLon: number;
  planets: WheelPlanet[];
}

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

/** Fixed demo chart matching the design's defaultSukoonChart(). */
export function defaultSukoonWheel(): WheelChart {
  return {
    ascLon: 204, // Libra 24°
    planets: [
      { name: 'الشمس', glyph: '☉', lon: 287 },
      { name: 'القمر', glyph: '☽', lon: 203 },
      { name: 'عطارد', glyph: '☿', lon: 264 },
      { name: 'الزهرة', glyph: '♀', lon: 300, isRetrograde: true },
      { name: 'المريخ', glyph: '♂', lon: 316 },
      { name: 'المشتري', glyph: '♃', lon: 323 },
      { name: 'زحل', glyph: '♄', lon: 13, isRetrograde: true },
      { name: 'أورانوس', glyph: '♅', lon: 215, isRetrograde: true },
      { name: 'نبتون', glyph: '♆', lon: 299 },
      { name: 'بلوتو', glyph: '♇', lon: 189, isRetrograde: true },
      { name: 'العقدة الشمالية', glyph: '☊', lon: 124, isRetrograde: true },
    ],
  };
}

/** Planets shown on the V2 wheel: 10 classical bodies + the north node. */
const WHEEL_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter',
  'saturn', 'uranus', 'neptune', 'pluto', 'northNode',
] as const;

/** Convert a computed natal chart into the wheel's render shape. */
export function astralToWheelChart(chart: AstralChart): WheelChart {
  return {
    ascLon: chart.asc,
    planets: WHEEL_KEYS.map((k) => {
      const p = chart[k];
      return { name: p.name, glyph: p.glyph, lon: p.longitude, isRetrograde: p.retrograde };
    }),
  };
}

/** Which house (1–12) an ecliptic longitude falls in, using the chart's cusps. */
export function houseOfLongitude(chart: AstralChart, lon: number): number {
  const norm = (d: number) => ((d % 360) + 360) % 360;
  const L = norm(lon);
  for (let i = 0; i < 12; i++) {
    const a = norm(chart.houses[i].cusp);
    const b = norm(chart.houses[(i + 1) % 12].cusp);
    const span = norm(b - a);
    if (norm(L - a) < span) return i + 1;
  }
  return 1;
}

export function SukoonWheel({
  chart,
  size = 360,
  tone = 'paper',
}: {
  chart: WheelChart;
  size?: number;
  tone?: 'paper' | 'dark';
}) {
  const center = size / 2;
  const outerRadius = size / 2 - 6;
  const zodiacRadius = outerRadius - size * 0.085;
  const planetRadius = outerRadius - size * 0.2;

  const dark = tone === 'dark';
  const bg = dark ? '#161A38' : '#FFFFFF';
  const ring = dark ? 'rgba(242,237,223,0.18)' : '#E8DCC8';
  const signColor = dark ? '#F2EDDF' : '#171B3A';
  const spoke = dark ? 'rgba(242,237,223,0.12)' : '#E5E1D8';

  // Same convention as the shared ZoomableWheel: rotate so the Ascendant sits on
  // the left horizon (9 o'clock) and longitude increases counter-clockwise.
  const rot = chart.ascLon;
  const toXY = (lon: number, r: number) => {
    const a = (lon - rot - 180) * (Math.PI / 180);
    return { x: center + r * Math.cos(a), y: center - r * Math.sin(a) };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={center} cy={center} r={outerRadius} fill={bg} stroke={ring} strokeWidth="1" />
      <circle cx={center} cy={center} r={zodiacRadius} fill="none" stroke={ring} strokeWidth="1" />
      <circle cx={center} cy={center} r={planetRadius - size * 0.04} fill="none" stroke={ring} strokeWidth="0.8" strokeDasharray="2 3" />

      {/* Sign spokes + glyphs */}
      {ZODIAC_SIGNS.map((g, i) => {
        const inner = toXY(i * 30, planetRadius);
        const outer = toXY(i * 30, outerRadius);
        const labelR = zodiacRadius + size * 0.045;
        const label = toXY(i * 30 + 15, labelR);
        return (
          <g key={`sign-${i}`}>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={spoke} strokeWidth="0.6" />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dy="0.35em"
              fontSize={size * 0.045}
              fill={signColor}
              opacity={dark ? 0.75 : 1}
            >
              {g}
            </text>
          </g>
        );
      })}

      {/* Planets */}
      {chart.planets.map((p, i) => {
        const { x, y } = toXY(p.lon, planetRadius);
        return (
          <g key={`p-${i}`}>
            <circle cx={x} cy={y} r={size * 0.028} fill="#E9785E" stroke={dark ? '#161A38' : '#FFFFFF'} strokeWidth="1.5" />
            <text x={x} y={y} textAnchor="middle" dy="0.35em" fontSize={size * 0.035} fill="#FFFFFF" fontWeight="bold">
              {p.glyph}
            </text>
          </g>
        );
      })}

      {/* Ascendant */}
      {(() => {
        const { x, y } = toXY(chart.ascLon, zodiacRadius);
        return (
          <g key="asc">
            <line x1={center} y1={center} x2={x} y2={y} stroke={signColor} strokeWidth="2" strokeDasharray="4,2" />
            <text x={x} y={y} dx="6" dy="-6" fontSize={size * 0.03} fill={signColor} fontWeight="bold">
              AC
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
