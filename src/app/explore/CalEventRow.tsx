'use client';

import { type CalEvent, kindLabel } from './calendarData';

export function CalEventRow({ e }: { e: CalEvent }) {
  return (
    <div
      className="bg-white rounded-xl px-3.5 py-3 flex gap-3 items-center relative overflow-hidden"
      style={{ border: '1px solid #E8E2D2' }}
    >
      <div className="absolute top-0 bottom-0 w-1" style={{ insetInlineStart: 0, background: e.color }} />
      <div className="w-9 h-9 rounded-[18px] bg-cream-soft flex items-center justify-center shrink-0 ms-1">
        <div
          className="w-5 h-5"
          style={{
            WebkitMaskImage: `url('/svg/${e.svgKey}.svg')`,
            maskImage: `url('/svg/${e.svgKey}.svg')`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            background: e.color,
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[14.5px] text-ink leading-[1.3] truncate">
          {e.title}
          {e.exact && <span className="text-coral ms-1.5 text-[11px] font-bold">● مضبوط</span>}
        </div>
        <div className="text-[11px] text-ink-muted mt-0.5">
          {e.time} · {kindLabel(e.kind)}
        </div>
      </div>
      <div className="text-sm text-ink-muted opacity-50">‹</div>
    </div>
  );
}
