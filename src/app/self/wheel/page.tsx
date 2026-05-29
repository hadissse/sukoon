'use client';

// Scr216 — fullscreen, dark, immersive zoom of the wheel.

import { useRouter } from 'next/navigation';
import { SukoonWheel, defaultSukoonWheel, astralToWheelChart } from '@/components/v2/SukoonWheel';
import { usePrimaryChart } from '@/lib/usePrimaryChart';
import { formatSignDegree, formatLongitude } from '@/lib/format';

function Leg({ g, name, pos, isAC }: { g: string; name: string; pos: string; isAC?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[80px]" style={{ color: '#F2EDDF' }}>
      <div className="flex items-baseline gap-1.5">
        <span
          style={{
            fontSize: isAC ? 14 : 20,
            color: '#E9785E',
            fontWeight: isAC ? 700 : 400,
            letterSpacing: isAC ? '0.5px' : 0,
          }}
        >
          {g}
        </span>
        <span className="text-xs opacity-70">{name}</span>
      </div>
      <div className="text-[11px] opacity-55 font-mono">{pos}</div>
    </div>
  );
}

export default function ImmersiveWheelPage() {
  const router = useRouter();
  const natal = usePrimaryChart();
  const chart = natal ? astralToWheelChart(natal) : defaultSukoonWheel();

  return (
    <div className="relative min-h-dvh max-w-[430px] mx-auto w-full overflow-hidden">
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
        <SukoonWheel chart={chart} size={360} tone="dark" />
      </div>

      {/* bottom legend */}
      <div
        className="absolute inset-x-4 rounded-[18px] px-4 py-3.5 flex justify-between items-center z-10 backdrop-blur-md"
        style={{ bottom: 24, background: 'rgba(255,255,255,0.06)', color: '#F2EDDF' }}
      >
        <Leg g="☉" name="الشمس" pos={natal ? formatSignDegree(natal.sun.sign, natal.sun.degree) : 'الجدي ١٧°'} />
        <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.18)' }} />
        <Leg g="☽" name="القمر" pos={natal ? formatSignDegree(natal.moon.sign, natal.moon.degree) : 'الميزان ٢٣°'} />
        <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.18)' }} />
        <Leg g="AC" name="الطالع" pos={natal ? formatLongitude(natal.asc) : 'الميزان ٢٤°'} isAC />
      </div>
    </div>
  );
}
