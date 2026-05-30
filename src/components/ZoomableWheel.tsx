'use client';

import { useEffect, useState } from 'react';
import type { AstralChart } from '@/lib/chartCalculator';
import { planetSvgKey } from '@/lib/planetMeta';

const VB = 1000;
const C = 500;
const R_ZODIAC_OUT = 440;
const R_ZODIAC_IN = 380;
const R_PLANET_RING = 320;
const R_PLANET_INNER = 270;
const R_CENTER = 70;

const COLOR_CORAL = '#E9785E';
const COLOR_SAGE = '#8FA084';
const COLOR_LAKE = '#7E97B8';

const TEXT_VS = '︎';
const ZODIAC_GLYPHS = [
  '♈'+TEXT_VS, '♉'+TEXT_VS, '♊'+TEXT_VS, '♋'+TEXT_VS,
  '♌'+TEXT_VS, '♍'+TEXT_VS, '♎'+TEXT_VS, '♏'+TEXT_VS,
  '♐'+TEXT_VS, '♑'+TEXT_VS, '♒'+TEXT_VS, '♓'+TEXT_VS,
];
const GLYPH_FONT = 'Cambria, "Times New Roman", "Noto Sans Symbols 2", "Segoe UI Symbol", serif';

const ASPECT_TYPES = [
  { angle: 0,   orb: 8, color: 'rgba(0,0,0,0)', opacity: 0 },
  { angle: 60,  orb: 6, color: '#4A7FB5',        opacity: 0.25 },
  { angle: 90,  orb: 8, color: '#C0392B',        opacity: 0.28 },
  { angle: 120, orb: 8, color: '#27AE60',        opacity: 0.30 },
  { angle: 180, orb: 8, color: '#C0392B',        opacity: 0.32 },
];

// Element color for each zodiac sign (0=Aries … 11=Pisces)
const ZODIAC_ELEMENT_COLORS = [
  '#E9785E', '#A07840', '#8FA084', '#7E97B8', // Aries, Taurus, Gemini, Cancer
  '#E9785E', '#A07840', '#8FA084', '#7E97B8', // Leo, Virgo, Libra, Scorpio
  '#E9785E', '#A07840', '#8FA084', '#7E97B8', // Sagittarius, Capricorn, Aquarius, Pisces
];

const PLANET_SIZES: Record<string, number> = {
  sun: 38, moon: 48, mercury: 38, venus: 38, mars: 38,
  jupiter: 38, saturn: 42, uranus: 38, neptune: 38, pluto: 38,
  northNode: 34, southNode: 34,
};


const PLANET_KEYS = [
  'sun','moon','mercury','venus','mars','jupiter',
  'saturn','uranus','neptune','pluto','northNode','southNode',
] as const;

// 0° Aries at 9 o'clock; longitude increases CCW visually
function toXY(lon: number, r: number): { x: number; y: number } {
  const rad = ((lon - 180) * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C - r * Math.sin(rad) };
}

function lonToAngleDeg(lon: number): number { return lon - 180; }

// Planet collision spreading — shifts display angle to avoid overlap
function spreadAngles(
  positions: { lon: number; angle: number }[],
  minSep: number,
): { lon: number; angle: number }[] {
  if (positions.length === 0) return positions;
  const sorted = positions
    .map((p, i) => ({ ...p, orig: i }))
    .sort((a, b) => a.angle - b.angle);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].angle - sorted[i - 1].angle < minSep)
      sorted[i].angle = sorted[i - 1].angle + minSep;
  }
  const overflow = sorted[sorted.length - 1].angle - (sorted[0].angle + 360);
  if (overflow > -minSep) {
    const shift = (minSep + overflow) / 2;
    for (const p of sorted) p.angle -= shift;
  }
  const result = new Array(positions.length);
  for (const p of sorted) result[p.orig] = { lon: p.lon, angle: p.angle };
  return result;
}

interface ZoomableWheelProps {
  size?: number;
  tone?: 'paper' | 'white';
  chart?: AstralChart | null;
  showHouses?: boolean;
}

export function ZoomableWheel({ size = 377, tone = 'paper', chart: chartProp, showHouses = true }: ZoomableWheelProps) {
  const [chart, setChart] = useState<AstralChart | null>(chartProp ?? null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (chartProp !== undefined) { setChart(chartProp); return; }
    try {
      const stored = localStorage.getItem('sukoon.primary-chart.v1');
      if (stored) setChart(JSON.parse(stored));
    } catch { /* localStorage unavailable */ }
  }, [chartProp]);

  const isDark = tone === 'white';
  const bg = isDark ? 'transparent' : '#FFFFFF';
  const strokeColor = isDark ? 'rgba(255,255,255,0.28)' : '#7A7A7A';
  const lightColor  = isDark ? 'rgba(255,255,255,0.18)' : '#C7C0AE';
  const mutedColor  = isDark ? 'rgba(255,255,255,0.45)' : '#9A9A9A';
  const wedgeFill   = isDark ? 'none'                   : '#FFFFFF';
  const planetHalo  = isDark ? 'rgba(255,255,255,0.07)' : (tone === 'paper' ? '#FFFFFF' : '#FFFFFF');

  // Alternating zodiac wedge arcs — decorative shading
  const zodiacWedges = Array.from({ length: 12 }, (_, i) => {
    const a1 = ((i * 30 - 180) * Math.PI) / 180;
    const a2 = (((i + 1) * 30 - 180) * Math.PI) / 180;
    const p1o = { x: C + R_ZODIAC_OUT * Math.cos(a1), y: C - R_ZODIAC_OUT * Math.sin(a1) };
    const p2o = { x: C + R_ZODIAC_OUT * Math.cos(a2), y: C - R_ZODIAC_OUT * Math.sin(a2) };
    const p2i = { x: C + R_ZODIAC_IN * Math.cos(a2), y: C - R_ZODIAC_IN * Math.sin(a2) };
    const p1i = { x: C + R_ZODIAC_IN * Math.cos(a1), y: C - R_ZODIAC_IN * Math.sin(a1) };
    const d = [
      `M ${p1o.x} ${p1o.y}`,
      `A ${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 0 0 ${p2o.x} ${p2o.y}`,
      `L ${p2i.x} ${p2i.y}`,
      `A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 0 1 ${p1i.x} ${p1i.y}`,
      'Z',
    ].join(' ');
    return { d, alt: i % 2 === 0 };
  });

  // Aspect lines through inner ring
  const aspectLines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number }[] = [];
  if (chart) {
    for (let i = 0; i < PLANET_KEYS.length; i++) {
      for (let j = i + 1; j < PLANET_KEYS.length; j++) {
        const a = chart[PLANET_KEYS[i]];
        const b = chart[PLANET_KEYS[j]];
        if (!a || !b) continue;
        const sep = Math.abs(((a.longitude - b.longitude + 180) % 360) - 180);
        for (const asp of ASPECT_TYPES) {
          if (asp.opacity === 0) continue;
          if (Math.abs(sep - asp.angle) <= asp.orb) {
            const p1 = toXY(a.longitude, R_PLANET_INNER);
            const p2 = toXY(b.longitude, R_PLANET_INNER);
            aspectLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: asp.color, opacity: asp.opacity });
            break;
          }
        }
      }
    }
  }

  // Planet spread positions
  const planetInputs = PLANET_KEYS.map(key => ({
    lon: chart?.[key]?.longitude ?? 0,
    angle: lonToAngleDeg(chart?.[key]?.longitude ?? 0),
  }));
  const minSep = (34 / R_PLANET_RING) * (180 / Math.PI);
  const spread = spreadAngles(planetInputs, minSep);

  return (
    <div
      style={{
        width: '100%', maxWidth: size, aspectRatio: '1 / 1',
        overflow: 'hidden', position: 'relative',
        borderRadius: '50%', userSelect: 'none',
      }}
    >
      <svg
          width="100%" height="100%" viewBox={`0 0 ${VB} ${VB}`}
          role="img" aria-label="الخريطة الفلكية"
          style={{ display: 'block' }}
        >
          {/* Background fill — only inside zodiac ring (no outer degree arc) */}
          <circle cx={C} cy={C} r={R_ZODIAC_OUT} fill={isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF'} />

          {/* Zodiac wedge backgrounds */}
          {zodiacWedges.map((w, i) => (
            <path key={`wedge-${i}`} d={w.d} fill={wedgeFill} stroke="none" />
          ))}

          {/* Concentric structural circles — no outer arc */}
          <circle cx={C} cy={C} r={R_ZODIAC_OUT}  fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <circle cx={C} cy={C} r={R_ZODIAC_IN}   fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <circle cx={C} cy={C} r={R_PLANET_INNER} fill="none" stroke={lightColor} strokeWidth="1" />
          <circle cx={C} cy={C} r={R_CENTER}       fill={isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'} stroke={lightColor} strokeWidth="1.2" />

          {/* Zodiac sign glyphs — colored by element */}
          {ZODIAC_GLYPHS.map((glyph, i) => {
            const midLon = i * 30 + 15;
            const { x, y } = toXY(midLon, (R_ZODIAC_OUT + R_ZODIAC_IN) / 2);
            return (
              <text key={`zodiac-${i}`} x={x} y={y}
                textAnchor="middle" dominantBaseline="central"
                fontSize="38" fill={isDark ? 'rgba(255,255,255,0.6)' : ZODIAC_ELEMENT_COLORS[i]}
                style={{ fontFamily: GLYPH_FONT, fontVariantEmoji: 'text' as React.CSSProperties['fontVariantEmoji'] }}>
                {glyph}
              </text>
            );
          })}

          {/* Sign boundary lines every 30° */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i * 30 - 180) * Math.PI) / 180;
            return (
              <line key={`sign-bound-${i}`}
                x1={C + R_ZODIAC_IN * Math.cos(a)} y1={C - R_ZODIAC_IN * Math.sin(a)}
                x2={C + R_ZODIAC_OUT * Math.cos(a)} y2={C - R_ZODIAC_OUT * Math.sin(a)}
                stroke={strokeColor} strokeWidth="1.2" />
            );
          })}

          {/* Aspect lines */}
          {aspectLines.map((l, i) => (
            <line key={`asp-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke={l.color} strokeWidth="0.8" opacity={l.opacity} />
          ))}

          {/* House cusps + numbers */}
          {showHouses && chart && chart.houses.map((house, i) => {
            const inner = toXY(house.cusp, R_CENTER);
            const outer = toXY(house.cusp, R_ZODIAC_IN);
            const isAsc = house.num === 1;
            const nextCusp = chart.houses[(i + 1) % 12].cusp;
            const midLon = house.cusp + ((((nextCusp - house.cusp) % 360) + 360) % 360) / 2;
            const numPos = toXY(midLon, (R_CENTER + R_PLANET_INNER) / 2);
            return (
              <g key={`house-${i}`}>
                <line
                  x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke={lightColor}
                  strokeWidth={isAsc ? '1.8' : '0.8'}
                  opacity={isAsc ? 1 : 0.55}
                />
                <text x={numPos.x} y={numPos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="6" fill={mutedColor} opacity={0.5}
                  style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
                  {house.num}
                </text>
              </g>
            );
          })}
          {/* MC line + label */}
          {showHouses && chart && (() => {
            const inner = toXY(chart.mc, R_CENTER);
            const outer = toXY(chart.mc, R_ZODIAC_IN);
            const labelPos = toXY(chart.mc, R_ZODIAC_IN - 22);
            return (
              <g>
                <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke={lightColor} strokeWidth="1.5" opacity={0.9} />
                <text x={labelPos.x} y={labelPos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="15" fontWeight="600" fill={mutedColor}
                  style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
                  MC
                </text>
              </g>
            );
          })()}
          {/* AC label */}
          {showHouses && chart && (() => {
            const labelPos = toXY(chart.asc, R_ZODIAC_IN - 22);
            return (
              <text x={labelPos.x} y={labelPos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize="15" fontWeight="600" fill={mutedColor}
                style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
                AC
              </text>
            );
          })()}

          {/* Planets: tick at true longitude + icon at spread position */}
          {chart && PLANET_KEYS.map((key, idx) => {
            const planet = chart[key];
            if (!planet) return null;
            const glyphSize = PLANET_SIZES[key] ?? 28;
            const trueOuter = toXY(planet.longitude, R_PLANET_INNER + 8);
            const trueInner = toXY(planet.longitude, R_PLANET_INNER);
            const spreadAngle = spread[idx]?.angle ?? lonToAngleDeg(planet.longitude);
            const spreadRad = (spreadAngle * Math.PI) / 180;
            const sx = C + R_PLANET_RING * Math.cos(spreadRad);
            const sy = C - R_PLANET_RING * Math.sin(spreadRad);
            const isHov = hovered === key;
            const svgFile = planetSvgKey(key);

            return (
              <g key={`planet-${key}`}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* True-position tick */}
                <line x1={trueOuter.x} y1={trueOuter.y} x2={trueInner.x} y2={trueInner.y}
                  stroke={isDark ? 'rgba(255,255,255,0.5)' : '#2A2A2A'} strokeWidth="0.9" opacity="0.7" />
                {/* Halo behind icon */}
                <circle cx={sx} cy={sy} r={glyphSize / 2 + 3} fill={planetHalo} opacity={isHov ? 1 : 0.8} />
                {/* Planet SVG icon */}
                <image
                  href={`/svg/${svgFile}.svg`}
                  x={sx - glyphSize / 2} y={sy - glyphSize / 2}
                  width={glyphSize} height={glyphSize}
                  opacity={isHov ? 1 : 0.85}
                  style={isDark ? { filter: 'invert(1)' } : undefined}
                />
                {/* Invisible hit target */}
                <circle cx={sx} cy={sy} r={glyphSize / 2 + 8} fill="transparent" />
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hovered && chart && (() => {
            const planet = chart[hovered as (typeof PLANET_KEYS)[number]];
            if (!planet) return null;
            const toAr = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
            const label = `${planet.name} · ${toAr(planet.degree)}° ${planet.sign}`;
            const idx = PLANET_KEYS.indexOf(hovered as typeof PLANET_KEYS[number]);
            const spreadAngle = spread[idx]?.angle ?? lonToAngleDeg(planet.longitude);
            const spreadRad = (spreadAngle * Math.PI) / 180;
            const px = C + R_PLANET_RING * Math.cos(spreadRad);
            const py = C - R_PLANET_RING * Math.sin(spreadRad);
            const tipAngle = Math.atan2(C - py, px - C);
            const tipDist = R_PLANET_RING + 90;
            let tx = C + tipDist * Math.cos(tipAngle) - 130;
            let ty = C - tipDist * Math.sin(tipAngle) - 22;
            tx = Math.max(8, Math.min(VB - 268, tx));
            ty = Math.max(8, Math.min(VB - 52, ty));
            return (
              <g pointerEvents="none">
                <rect x={tx} y={ty} width={260} height={44} rx={12}
                  fill="#111827" opacity={0.92} />
                <text x={tx + 130} y={ty + 22}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={20} fill="#fff"
                  style={{ fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif' }}>
                  {label}
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}
