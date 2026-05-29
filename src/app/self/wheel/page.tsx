'use client';

// Scr216 — fullscreen zoom of the natal wheel.

import { useRouter } from 'next/navigation';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { usePrimaryChart } from '@/lib/usePrimaryChart';
import { formatSignDegree, formatLongitude } from '@/lib/format';

function Leg({ g, name, pos, isAC }: { g: string; name: string; pos: string; isAC?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[80px]">
      <div className="flex items-baseline gap-1.5">
        <span style={{ fontSize: isAC ? 14 : 20, color: '#E9785E', fontWeight: isAC ? 700 : 400, letterSpacing: isAC ? '0.5px' : 0 }}>
          {g}
        </span>
        <span className="text-xs text-ink-muted">{name}</span>
      </div>
      <div className="text-[11px] text-ink-muted font-mono opacity-70">{pos}</div>
    </div>
  );
}

export default function ImmersiveWheelPage() {
  const router = useRouter();
  const natal = usePrimaryChart();

  return (
    <div className="relative min-h-dvh max-w-[430px] mx-auto w-full overflow-hidden bg-[#F8F5EF]">
      {/* top bar */}
      <div className="absolute top-0 inset-x-0 pt-[18px] px-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.back()}
          aria-label="رجوع"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[18px] bg-white/60 text-ink"
        >
          ‹
        </button>
        <div className="text-xs font-mono tracking-wide text-ink-muted opacity-60">
          الخريطة · تكبير
        </div>
        <button
          onClick={() => router.push('/self')}
          aria-label="إغلاق"
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm bg-white/60 text-ink"
        >
          ✕
        </button>
      </div>

      {/* big chart */}
      <div className="absolute inset-x-0 flex items-center justify-center" style={{ top: 72, bottom: 110 }}>
        <ZoomableWheel chart={natal} tone="paper" size={360} />
      </div>

      {/* bottom legend */}
      <div
        className="absolute inset-x-4 rounded-[18px] px-4 py-3.5 flex justify-between items-center z-10 backdrop-blur-md"
        style={{ bottom: 24, background: 'rgba(255,255,255,0.75)', border: '1px solid #E8E2D2' }}
      >
        <Leg g="☉" name="الشمس" pos={natal ? formatSignDegree(natal.sun.sign, natal.sun.degree) : 'الجدي ١٧°'} />
        <div className="w-px h-7 bg-[#E8E2D2]" />
        <Leg g="☽" name="القمر" pos={natal ? formatSignDegree(natal.moon.sign, natal.moon.degree) : 'الميزان ٢٣°'} />
        <div className="w-px h-7 bg-[#E8E2D2]" />
        <Leg g="AC" name="الطالع" pos={natal ? formatLongitude(natal.asc) : 'الميزان ٢٤°'} isAC />
      </div>
    </div>
  );
}
