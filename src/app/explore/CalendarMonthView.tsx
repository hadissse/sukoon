'use client';

import { useState } from 'react';
import { CalEventRow } from './CalEventRow';
import {
  getEvents2026,
  AR_MONTH_NAMES,
  WEEK_DAYS,
  WEEK_DAYS_LTR,
  buildMonthCells,
  getMonthStartWeekday,
  toArabicNum,
} from './calendarData';

const LEGEND: [string, string][] = [
  ['اقتران/عودة', '#E9785E'],
  ['تثليث/تناغم', '#8FA084'],
  ['دخول/قمر', '#7E97B8'],
  ['محطّ/سكون', '#D4A04C'],
  ['تربيع/توتر', '#9A3F30'],
];

const TODAY = new Date();
const TODAY_YEAR = TODAY.getFullYear();
const TODAY_MONTH = TODAY.getMonth(); // 0-indexed
const TODAY_DAY = TODAY.getDate();

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  selected: number | null;
  onSelect: (d: number) => void;
}

function MonthGrid({ year, month, selected, onSelect }: MonthGridProps) {
  const startWeekday = getMonthStartWeekday(year, month);
  const cells = buildMonthCells(year, month, startWeekday);
  const m1 = month + 1; // 1-indexed for event lookup

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
          const events = getEvents2026(m1, d);
          const isSelected = d === selected;
          const isToday = year === TODAY_YEAR && month === TODAY_MONTH && d === TODAY_DAY;
          const hasExact = events.some((e) => e.exact);
          return (
            <button key={d} onClick={() => onSelect(d)}
              className="h-12 flex flex-col items-center justify-start pt-1.5 relative">
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

interface CalendarMonthViewProps {
  initialYear?: number;
  initialMonth?: number; // 0-indexed
}

export function CalendarMonthView({ initialYear = 2026, initialMonth = TODAY_MONTH }: CalendarMonthViewProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth); // 0-indexed
  const [selected, setSelected] = useState<number | null>(
    initialYear === TODAY_YEAR && initialMonth === TODAY_MONTH ? TODAY_DAY : null
  );

  const goPrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const goNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  };
  const goToday = () => {
    setYear(TODAY_YEAR); setMonth(TODAY_MONTH); setSelected(TODAY_DAY);
  };

  const m1 = month + 1;
  const events = selected ? getEvents2026(m1, selected) : [];
  const dayOfWeek = selected ? new Date(year, month, selected).getDay() : null;
  const weekdayLabel = dayOfWeek !== null ? WEEK_DAYS_LTR[dayOfWeek] : '';

  return (
    <div className="flex flex-col gap-3">
      {/* Month header with navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={goPrev}
            className="w-7 h-7 rounded-full bg-cream-soft flex items-center justify-center text-ink-muted text-sm">
            ›
          </button>
          <div className="font-serif text-[19px] text-ink font-medium min-w-[120px] text-center">
            {AR_MONTH_NAMES[month]} {toArabicNum(year)}
          </div>
          <button onClick={goNext}
            className="w-7 h-7 rounded-full bg-cream-soft flex items-center justify-center text-ink-muted text-sm">
            ‹
          </button>
        </div>
        <button onClick={goToday}
          className="px-3 py-1.5 rounded-full bg-cream-soft text-xs text-coral font-semibold">
          اليوم
        </button>
      </div>

      <MonthGrid year={year} month={month} selected={selected} onSelect={setSelected} />

      <div className="flex gap-3 justify-center flex-wrap px-1">
        {LEGEND.map(([label, c]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            <span className="text-[10px] text-ink-muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="pt-3" style={{ borderTop: '1px solid #E8E2D2' }}>
        {selected ? (
          <>
            <div className="flex justify-between items-baseline mb-2.5">
              <div className="font-serif text-[16px] text-ink font-medium">
                {weekdayLabel} {toArabicNum(selected)} {AR_MONTH_NAMES[month]}
              </div>
              <div className="text-[11px] text-ink-muted font-mono">
                {events.length > 0 ? `${toArabicNum(events.length)} حدث` : 'لا أحداث'}
              </div>
            </div>
            {events.length === 0 ? (
              <div className="p-4 bg-white rounded-xl text-center text-[13px] text-ink-muted" style={{ border: '1px dashed #E8E2D2' }}>
                يوم هادئ.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {events.map((e, i) => <CalEventRow key={i} e={e} />)}
              </div>
            )}
          </>
        ) : (
          <div className="p-4 bg-white rounded-xl text-center text-[13px] text-ink-muted" style={{ border: '1px dashed #E8E2D2' }}>
            اضغط على يوم لعرض أحداثه.
          </div>
        )}
      </div>
    </div>
  );
}
