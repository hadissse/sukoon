'use client';

import { useState } from 'react';
import { CalEventRow } from './CalEventRow';
import {
  CAL_TRANSITS,
  CAL_TODAY,
  WEEK_DAYS,
  WEEK_DAYS_LTR,
  buildMonthCells,
  toArabicNum,
} from './calendarData';

const LEGEND: [string, string][] = [
  ['اقتران/عودة', '#E9785E'],
  ['تثليث/تناغم', '#8FA084'],
  ['دخول/قمر', '#7E97B8'],
  ['محطّ/سكون', '#D4A04C'],
  ['تربيع/توتر', '#9A3F30'],
];

function MonthGrid({ selected, onSelect }: { selected: number; onSelect: (d: number) => void }) {
  const cells = buildMonthCells(2026, 4, 5);
  return (
    <div className="bg-white rounded-2xl pt-3 px-2 pb-3.5" style={{ border: '1px solid #E8E2D2' }}>
      <div className="grid grid-cols-7 pb-2 mb-1" style={{ borderBottom: '1px solid #E8E2D2' }}>
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-ink-muted font-semibold tracking-wide">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ rowGap: 2 }}>
        {cells.map((d, i) => {
          if (d == null) return <div key={`b-${i}`} className="h-12" />;
          const events = CAL_TRANSITS[d] || [];
          const isSelected = d === selected;
          const isToday = d === CAL_TODAY;
          const hasExact = events.some((e) => e.exact);
          return (
            <button key={d} onClick={() => onSelect(d)}
              className="h-12 flex flex-col items-center justify-start pt-1.5 relative"
            >
              <div className="w-7 h-7 rounded-[14px] flex items-center justify-center text-sm font-serif" style={{
                background: isSelected ? '#E9785E' : isToday ? '#F8F8F8' : 'transparent',
                color: isSelected ? '#fff' : isToday ? '#E9785E' : '#171B3A',
                fontWeight: isToday || isSelected ? 600 : 400,
                border: isToday && !isSelected ? '1.5px solid #E9785E' : 'none',
              }}>
                {toArabicNum(d)}
              </div>
              {events.length > 0 && (
                <div className="flex gap-[3px] mt-1">
                  {events.slice(0, 3).map((e, ei) => (
                    <div key={ei} className="rounded-full" style={{
                      width: hasExact && e.exact ? 5 : 4,
                      height: hasExact && e.exact ? 5 : 4,
                      background: e.color,
                    }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarMonthView() {
  const [selected, setSelected] = useState(CAL_TODAY);
  const events = CAL_TRANSITS[selected] || [];
  const weekdayLabel = WEEK_DAYS_LTR[(5 + selected - 1) % 7];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-2">
          <div className="font-serif text-[19px] text-ink font-medium">مايو ٢٠٢٦</div>
          <div className="text-[11px] text-ink-muted font-mono">ذو القعدة ١٤٤٧</div>
        </div>
        <button onClick={() => setSelected(CAL_TODAY)}
          className="px-3 py-1.5 rounded-full bg-cream-soft text-xs text-coral font-semibold">
          اليوم
        </button>
      </div>

      <MonthGrid selected={selected} onSelect={setSelected} />

      <div className="flex gap-3 justify-center flex-wrap px-1">
        {LEGEND.map(([label, c]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            <span className="text-[10px] text-ink-muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="pt-3" style={{ borderTop: '1px solid #E8E2D2' }}>
        <div className="flex justify-between items-baseline mb-2.5">
          <div className="font-serif text-[16px] text-ink font-medium">
            {weekdayLabel} {toArabicNum(selected)} مايو
          </div>
          <div className="text-[11px] text-ink-muted font-mono">
            {events.length > 0 ? `${toArabicNum(events.length)} حدث` : 'لا أحداث'}
          </div>
        </div>
        {events.length === 0 ? (
          <div className="p-4 bg-white rounded-xl text-center text-[13px] text-ink-muted" style={{ border: '1px dashed #E8E2D2' }}>
            يوم هادئ على خريطتك.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map((e, i) => <CalEventRow key={i} e={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
