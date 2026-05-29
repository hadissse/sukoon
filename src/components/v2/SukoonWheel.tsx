'use client';

/**
 * Self-contained natal-wheel renderer for the V2 immersive views (Scr216/217).
 *
 * The shared ZoomableWheel component loads its chart from localStorage and only
 * supports paper/white tones, so it can't render the design's fixed demo chart
 * on a dark immersive background. This is a standalone SVG built for that.
 */

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

const ASPECT_TYPES = [
  { angle: 0, orb: 8, color: '#9C8AB8' },
  { angle: 60, orb: 5, color: '#7E97B8' },
  { angle: 90, orb: 7, color: '#E9785E' },
  { angle: 120, orb: 7, color: '#8FA084' },
  { angle: 180, orb: 8, color: '#5A3E7A' },
];

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

  // Same convention as the shared ZoomableWheel: 0° Aries at 9 o'clock (left),
  // ecliptic longitude increasing counter-clockwise. Keeps every chart in the
  // app spinning the same way.
  const toXY = (lon: number, r: number) => {
    const a = (lon - 180) * (Math.PI / 180);
    return { x: center + r * Math.cos(a), y: center - r * Math.sin(a) };
  };

  // Aspect lines between the 10 main planets (exclude the lunar node).
  const main = chart.planets.filter((p) => p.glyph !== '☊');
  const aspectLines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < main.length; i++) {
    for (let j = i + 1; j < main.length; j++) {
      const sep = Math.abs(((main[i].lon - main[j].lon + 180) % 360) - 180);
      for (const a of ASPECT_TYPES) {
        if (Math.abs(sep - a.angle) <= a.orb) {
          const p1 = toXY(main[i].lon, planetRadius);
          const p2 = toXY(main[j].lon, planetRadius);
          aspectLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: a.color });
          break;
        }
      }
    }
  }

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

      {/* Aspect lines */}
      <g opacity={dark ? 0.45 : 0.5}>
        {aspectLines.map((l, i) => (
          <line key={`asp-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1" />
        ))}
      </g>

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
