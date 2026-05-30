'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SukoonWheel, defaultSukoonWheel, type WheelChart } from '@/components/v2/SukoonWheel';
import type { AstralChart } from '@/lib/chartCalculator';

function toAr(n: number): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

function astralToWheelChart(chart: AstralChart): WheelChart {
  return {
    ascLon: chart.asc,
    mcLon: chart.mc,
    planets: [
      { name: 'الشمس',    key: 'sun',       lon: chart.sun.longitude },
      { name: 'القمر',    key: 'moon',      lon: chart.moon.longitude },
      { name: 'عطارد',    key: 'mercury',   lon: chart.mercury.longitude,  isRetrograde: chart.mercury.retrograde },
      { name: 'الزهرة',   key: 'venus',     lon: chart.venus.longitude,    isRetrograde: chart.venus.retrograde },
      { name: 'المريخ',   key: 'mars',      lon: chart.mars.longitude,     isRetrograde: chart.mars.retrograde },
      { name: 'المشتري',  key: 'jupiter',   lon: chart.jupiter.longitude,  isRetrograde: chart.jupiter.retrograde },
      { name: 'زحل',      key: 'saturn',    lon: chart.saturn.longitude,   isRetrograde: chart.saturn.retrograde },
      { name: 'أورانوس',  key: 'uranus',    lon: chart.uranus.longitude,   isRetrograde: chart.uranus.retrograde },
      { name: 'نبتون',    key: 'neptune',   lon: chart.neptune.longitude,  isRetrograde: chart.neptune.retrograde },
      { name: 'بلوتو',    key: 'pluto',     lon: chart.pluto.longitude,    isRetrograde: chart.pluto.retrograde },
      { name: 'شمال القمر', key: 'northNode', lon: chart.northNode.longitude, isRetrograde: true },
    ],
  };
}

function Leg({ svgKey, name, pos, isAC }: { svgKey?: string; name: string; pos: string; isAC?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[72px]" style={{ color: '#F2EDDF' }}>
      <div className="flex items-baseline gap-1.5">
        {svgKey ? (
          <span
            style={{
              display: 'inline-block', width: 20, height: 20,
              backgroundColor: '#F2EDDF',
              maskImage: `url(/svg/${svgKey}.svg)`,
              maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
              WebkitMaskImage: `url(/svg/${svgKey}.svg)`,
              WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center',
            }}
          />
        ) : (
          <span className="text-sm font-bold" style={{ color: '#E9785E' }}>{name}</span>
        )}
        {svgKey && <span className="text-xs opacity-70">{name}</span>}
      </div>
      <div className="text-[11px] opacity-55 font-mono">{pos}</div>
    </div>
  );
}

export default function ImmersiveWheelPage() {
  const router = useRouter();
  const [wheelChart, setWheelChart] = useState<WheelChart>(defaultSukoonWheel());
  const [sunPos, setSunPos] = useState('');
  const [moonPos, setMoonPos] = useState('');
  const [ascPos, setAscPos] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sukoon.primary-chart.v1');
      if (!stored) return;
      const chart: AstralChart = JSON.parse(stored);
      setWheelChart(astralToWheelChart(chart));
      setSunPos(`${chart.sun.sign} ${toAr(chart.sun.degree)}°`);
      setMoonPos(`${chart.moon.sign} ${toAr(chart.moon.degree)}°`);
      const ascSign = chart.houses[0]?.sign ?? '';
      const ascDeg = Math.floor(chart.asc % 30);
      setAscPos(`${ascSign} ${toAr(ascDeg)}°`);
    } catch { /* localStorage unavailable */ }
  }, []);

  return (
    <div className="relative min-h-dvh max-w-[430px] mx-auto w-full overflow-hidden" style={{ background: '#161A38' }}>
      {/* starfield */}
      <svg viewBox="0 0 393 852" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }} aria-hidden>
        {Array.from({ length: 70 }).map((_, i) => {
          const x = (i * 137) % 393;
          const y = (i * 211) % 852;
          const r = i % 5 === 0 ? 1.4 : 0.7;
          return <circle key={i} cx={x} cy={y} r={r} fill="#F2EDDF" opacity={i % 3 === 0 ? 0.5 : 0.25} />;
        })}
      </svg>

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 pt-[18px] px-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.back()}
          aria-label="رجوع"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#F2EDDF' }}
        >
          ‹
        </button>
        <div className="text-xs font-mono tracking-wide" style={{ color: '#F2EDDF', opacity: 0.6 }}>
          الخريطة · تكبير
        </div>
        <button
          onClick={() => router.push('/self')}
          aria-label="إغلاق"
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#F2EDDF' }}
        >
          ✕
        </button>
      </div>

      {/* big chart */}
      <div className="absolute inset-x-0 flex items-center justify-center" style={{ top: 72, bottom: 110 }}>
        <SukoonWheel chart={wheelChart} size={360} tone="dark" />
      </div>

      {/* bottom legend */}
      <div
        className="absolute inset-x-4 rounded-[18px] px-4 py-3.5 flex justify-between items-center z-10 backdrop-blur-md"
        style={{ bottom: 24, background: 'rgba(255,255,255,0.06)', color: '#F2EDDF' }}
      >
        <Leg svgKey="sun"  name="الشمس"  pos={sunPos || '…'} />
        <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.18)' }} />
        <Leg svgKey="moon" name="القمر"  pos={moonPos || '…'} />
        <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.18)' }} />
        <Leg name="AC" pos={ascPos || '…'} isAC />
      </div>
    </div>
  );
}
