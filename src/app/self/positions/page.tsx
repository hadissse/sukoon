'use client';

// Scr217 — wheel + positions sidebar (compact, scannable cross-reference).

import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';
import { SukoonWheel, defaultSukoonWheel } from '@/components/v2/SukoonWheel';

// [glyph, name, position, house, retrograde]
const ROWS: [string, string, string, string, boolean][] = [
  ['☉', 'الشمس', 'الجدي ١٧°', '١٠', false],
  ['☽', 'القمر', 'الميزان ٢٣°', '١', false],
  ['☿', 'عطارد', 'القوس ٢٤°', '٣', false],
  ['♀', 'الزهرة', 'الدلو ٠°', '٤', true],
  ['♂', 'المريخ', 'الدلو ١٦°', '٥', false],
  ['♃', 'المشتري', 'الدلو ٢٣°', '٥', false],
  ['♄', 'زحل', 'الحمل ١٣°', '٧', true],
  ['♅', 'أورانوس', 'العقرب ٥°', '٢', true],
  ['♆', 'نبتون', 'الجدي ٢٩°', '٤', false],
  ['♇', 'بلوتو', 'الميزان ٩°', '١', true],
];

const SELF_TABS: [string, boolean][] = [
  ['الخريطة', true],
  ['الجسد', false],
  ['ما حفظت', false],
];

export default function PositionsPage() {
  const chart = defaultSukoonWheel();
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="الخريطة" />

      {/* sub tabs */}
      <div className="flex gap-2 px-5 pt-3.5">
        {SELF_TABS.map(([t, a]) => (
          <div
            key={t}
            className="px-4 py-2.5 rounded-full"
            style={{ background: a ? '#171B3A' : '#fff', border: a ? 'none' : '1px solid #E8E2D2' }}
          >
            <span className="text-[13px] font-medium" style={{ color: a ? '#fff' : '#171B3A' }}>
              {t}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 px-2 flex justify-center">
        <SukoonWheel chart={chart} size={332} tone="paper" />
      </div>

      <div className="px-4 mt-1.5">
        <div className="flex items-baseline justify-between px-1 pt-2 pb-1.5" style={{ borderBottom: '1px solid #E8E2D2' }}>
          <div className="text-[11px] text-ink-muted tracking-wide font-semibold">المواقع</div>
          <div className="text-[11px] text-coral font-medium">كلها ←</div>
        </div>

        <div
          className="bg-white rounded-[14px] mt-2 overflow-y-auto"
          style={{ border: '1px solid #E8E2D2', maxHeight: 168 }}
        >
          {ROWS.map(([g, name, pos, house, retro], i) => (
            <div
              key={name}
              className="grid items-center gap-2.5 px-3.5 py-[7px]"
              style={{
                gridTemplateColumns: '28px 1fr auto 24px',
                borderBottom: i === ROWS.length - 1 ? 'none' : '1px solid #F8F8F8',
              }}
            >
              <span className="text-base text-coral">{g}</span>
              <div className="text-[13px] text-ink">{name}</div>
              <div className="text-xs text-ink-muted font-mono">
                {pos}
                {retro ? ' ℞' : ''}
              </div>
              <div className="text-[11px] text-ink-muted text-center opacity-70">{house}</div>
            </div>
          ))}
        </div>
      </div>

      <FooterTabBar active="self" />
    </div>
  );
}
