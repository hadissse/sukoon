'use client';

export interface WheelPlanet {
  name: string;
  key: string;
  lon: number;
  isRetrograde?: boolean;
}

export interface WheelChart {
  ascLon: number;
  mcLon: number;
  planets: WheelPlanet[];
}

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const PLANET_SVG_KEYS: Record<string, string> = {
  sun: 'sun', moon: 'moon', mercury: 'mercury', venus: 'venus', mars: 'mars',
  jupiter: 'jupiter', saturn: 'saturn', uranus: 'uranus', neptune: 'neptune',
  pluto: 'pluto', chiron: 'chiron', northNode: 'southnode', southNode: 'northnode',
};

const ASPECT_TYPES = [
  { angle: 0,   orb: 8, color: '#9C8AB8' },
  { angle: 60,  orb: 5, color: '#7E97B8' },
  { angle: 90,  orb: 7, color: '#E9785E' },
  { angle: 120, orb: 7, color: '#8FA084' },
  { angle: 180, orb: 8, color: '#5A3E7A' },
];

export function defaultSukoonWheel(): WheelChart {
  return {
    ascLon: 204,
    mcLon: 294,
    planets: [
      { name: 'الشمس',   key: 'sun',       lon: 287 },
      { name: 'القمر',   key: 'moon',      lon: 203 },
      { name: 'عطارد',   key: 'mercury',   lon: 264 },
      { name: 'الزهرة',  key: 'venus',     lon: 300, isRetrograde: true },
      { name: 'المريخ',  key: 'mars',      lon: 316 },
      { name: 'المشتري', key: 'jupiter',   lon: 323 },
      { name: 'زحل',     key: 'saturn',    lon:  13, isRetrograde: true },
      { name: 'أورانوس', key: 'uranus',    lon: 215, isRetrograde: true },
      { name: 'نبتون',   key: 'neptune',   lon: 299 },
      { name: 'بلوتو',   key: 'pluto',     lon: 189, isRetrograde: true },
      { name: 'شمال القمر', key: 'northNode', lon: 124, isRetrograde: true },
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
  const C = size / 2;
  const R_OUTER   = C - 6;
  const R_ZOD_OUT = R_OUTER - size * 0.085;
  const R_ZOD_IN  = R_ZOD_OUT - size * 0.10;
  const R_PLANET  = R_ZOD_IN - size * 0.07;
  const R_INNER   = size * 0.13;

  const dark = tone === 'dark';
  const bg        = dark ? '#161A38' : '#FFFFFF';
  const ring      = dark ? 'rgba(242,237,223,0.22)' : '#B0A898';
  const lightRing = dark ? 'rgba(242,237,223,0.12)' : '#D0C9BE';
  const signColor = dark ? 'rgba(242,237,223,0.75)' : '#3A3550';
  const mutedColor = dark ? 'rgba(242,237,223,0.40)' : '#9A9A9A';

  // ASC-relative coords: ASC is always at LEFT (9 o'clock), zodiac increases CCW
  function toXY(lon: number, r: number): { x: number; y: number } {
    const a = (180 + lon - chart.ascLon) * (Math.PI / 180);
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  }

  // Aspect lines (exclude nodes)
  const main = chart.planets.filter(p => p.key !== 'northNode' && p.key !== 'southNode');
  const aspectLines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < main.length; i++) {
    for (let j = i + 1; j < main.length; j++) {
      const sep = Math.abs(((main[i].lon - main[j].lon + 180) % 360) - 180);
      for (const a of ASPECT_TYPES) {
        if (Math.abs(sep - a.angle) <= a.orb) {
          const p1 = toXY(main[i].lon, R_INNER + 4);
          const p2 = toXY(main[j].lon, R_INNER + 4);
          aspectLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: a.color });
          break;
        }
      }
    }
  }

  // Planet collision spreading
  const spread = chart.planets.map(p => ({ key: p.key, lon: p.lon, dispLon: p.lon }));
  spread.sort((a, b) => a.lon - b.lon);
  const minGap = 14;
  for (let i = 1; i < spread.length; i++) {
    const diff = ((spread[i].lon - spread[i-1].dispLon) % 360 + 360) % 360;
    if (diff < minGap) spread[i].dispLon = spread[i-1].dispLon + minGap;
  }

  const glyphFont = 'Cambria, "Times New Roman", "Noto Sans Symbols 2", "Segoe UI Symbol", serif';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Background */}
      <circle cx={C} cy={C} r={R_OUTER} fill={bg} stroke={ring} strokeWidth="1" />

      {/* Zodiac band */}
      <circle cx={C} cy={C} r={R_ZOD_OUT} fill="none" stroke={ring} strokeWidth="0.8" />
      <circle cx={C} cy={C} r={R_ZOD_IN}  fill="none" stroke={ring} strokeWidth="0.8" />

      {/* Planet ring + inner circle */}
      <circle cx={C} cy={C} r={R_PLANET} fill="none" stroke={lightRing} strokeWidth="0.6" strokeDasharray="2 3" />
      <circle cx={C} cy={C} r={R_INNER}  fill="none" stroke={lightRing} strokeWidth="0.8" />

      {/* Zodiac sign dividers + glyphs */}
      {ZODIAC_SIGNS.map((g, i) => {
        const spokeStart = toXY(i * 30, R_ZOD_IN);
        const spokeEnd   = toXY(i * 30, R_ZOD_OUT);
        const mid        = toXY(i * 30 + 15, (R_ZOD_IN + R_ZOD_OUT) / 2);
        return (
          <g key={`sign-${i}`}>
            <line x1={spokeStart.x} y1={spokeStart.y} x2={spokeEnd.x} y2={spokeEnd.y}
              stroke={lightRing} strokeWidth="0.6" />
            <text x={mid.x} y={mid.y} textAnchor="middle" dy="0.35em"
              fontSize={size * 0.048} fill={signColor}
              style={{ fontFamily: glyphFont, fontVariantEmoji: 'text' }}>
              {g}︎
            </text>
          </g>
        );
      })}

      {/* 12 equal house lines from ASC */}
      {Array.from({ length: 12 }, (_, i) => {
        const lon = chart.ascLon + i * 30;
        const inner = toXY(lon, R_INNER);
        const outer = toXY(lon, R_ZOD_IN);
        const isAsc = i === 0;
        return (
          <line key={`house-${i}`}
            x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke={isAsc ? ring : lightRing}
            strokeWidth={isAsc ? 1.6 : 0.7}
            opacity={isAsc ? 1 : 0.7}
          />
        );
      })}

      {/* House numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const midLon = chart.ascLon + i * 30 + 15;
        const { x, y } = toXY(midLon, (R_INNER + R_PLANET) / 2);
        return (
          <text key={`hn-${i}`} x={x} y={y} textAnchor="middle" dy="0.35em"
            fontSize={size * 0.036} fill={mutedColor}
            style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
            {i + 1}
          </text>
        );
      })}

      {/* MC line */}
      {(() => {
        const inner = toXY(chart.mcLon, R_INNER);
        const outer = toXY(chart.mcLon, R_ZOD_IN);
        const lp    = toXY(chart.mcLon, R_ZOD_IN - size * 0.04);
        return (
          <g>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke={ring} strokeWidth="1.2" opacity={0.8} />
            <text x={lp.x} y={lp.y} textAnchor="middle" dy="0.35em"
              fontSize={size * 0.032} fill={mutedColor}
              style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
              MC
            </text>
          </g>
        );
      })()}

      {/* AC label */}
      {(() => {
        const lp = toXY(chart.ascLon, R_ZOD_IN - size * 0.04);
        return (
          <text x={lp.x} y={lp.y} textAnchor="middle" dy="0.35em"
            fontSize={size * 0.032} fontWeight="600" fill={ring}
            style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
            AC
          </text>
        );
      })()}

      {/* Aspect lines */}
      <g opacity={0.45}>
        {aspectLines.map((l, i) => (
          <line key={`asp-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.color} strokeWidth="0.8" />
        ))}
      </g>

      {/* Planets */}
      {chart.planets.map((p, i) => {
        const s = spread.find(s => s.key === p.key);
        const { x, y } = toXY(s?.dispLon ?? p.lon, R_PLANET);
        const svgKey = PLANET_SVG_KEYS[p.key] ?? p.key;
        const gs = size * 0.12;
        return (
          <g key={`p-${i}`}>
            <image href={`/svg/${svgKey}.svg`}
              x={x - gs / 2} y={y - gs / 2}
              width={gs} height={gs}
              style={dark ? { filter: 'invert(1)' } : undefined}
              opacity={0.9}
            />
            {p.isRetrograde && (
              <text x={x + gs * 0.32} y={y + gs * 0.32}
                fontSize={size * 0.022} fill="#E9785E" textAnchor="middle" dy="0.35em">
                ℞
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
