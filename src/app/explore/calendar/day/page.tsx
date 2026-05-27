'use client';

// Scr221 — تفاصيل اليوم — Single day detail with full transit cards + actions.

import Link from 'next/link';
import { FooterTabBar } from '@/components/v2/FooterTabBar';
import { CalEventRow } from '../../CalEventRow';
import { CAL_TRANSITS, toArabicNum } from '../../calendarData';

const DAY = 24;

const DAY_FLOW: [string, string][] = [
  ['٠٧:٤٠', 'الزهرة ☌ المشتري · في الجوزاء، درجة ١٢'],
  ['١٢:١٥', 'زحل ☌ الشمس · مضبوط عند درجة ٤ الحوت'],
  ['١٧:٣٠', 'القمر يدخل العقرب · البرج المائي الثامن'],
];

export default function DayDetailPage() {
  const events = CAL_TRANSITS[DAY];
  const main = events[0]; // Saturn ☌ Sun — exact
  const minor = events.slice(1);

  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      {/* compact day header */}
      <div className="pt-4 px-4 pb-3 bg-white" style={{ borderBottom: '1px solid #E8E2D2' }}>
        <div className="flex items-center justify-between">
          <Link href="/explore/calendar" className="flex items-center gap-2 text-coral text-sm">
            <span className="text-lg">›</span>
            <span>مايو</span>
          </Link>
          <div className="flex gap-2.5 text-lg text-coral">
            <span>⌕</span>
            <span>＋</span>
          </div>
        </div>
        <div className="mt-3.5 flex items-baseline gap-3">
          <div className="font-serif text-[38px] text-coral font-medium leading-none">{toArabicNum(DAY)}</div>
          <div>
            <div className="font-serif text-[18px] text-ink">الأحد · مايو ٢٠٢٦</div>
            <div className="text-xs text-ink-muted mt-0.5 font-mono">٧ ذو القعدة · القمر في الميزان</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3.5">
        {/* main exact transit card */}
        <div
          className="bg-white rounded-2xl px-4 pt-4 pb-3.5 relative"
          style={{ border: `1.5px solid ${main.color}`, boxShadow: `0 0 0 4px ${main.color}10` }}
        >
          <div
            className="absolute text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
            style={{ top: -10, insetInlineEnd: 14, background: main.color }}
          >
            ● مضبوط الآن
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center shrink-0"
              style={{ background: `radial-gradient(circle at 30% 25%, #F3B8A6, ${main.color} 70%)` }}
            >
              <div className="w-7 h-7" style={{ WebkitMaskImage: `url('/svg/${main.svgKey}.svg')`, maskImage: `url('/svg/${main.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#FFFFFF' }} />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xl text-ink leading-[1.25]">{main.title}</div>
              <div className="text-xs text-ink-muted mt-1">{main.time} · مدة النشاط ١٠ أيام · يبدأ ٢٠ مايو</div>
            </div>
          </div>

          {/* duration timeline */}
          <div className="mt-3.5 mb-3">
            <div className="relative h-[22px]">
              <div className="absolute inset-x-1.5 top-2.5 h-0.5 rounded-sm" style={{ background: '#E8E2D2' }} />
              <div className="absolute inset-x-1.5 top-2.5 h-0.5 rounded-sm" style={{ background: main.color, width: '50%' }} />
              <div
                className="absolute top-[5px] w-3 h-3 rounded-md"
                style={{ left: '50%', transform: 'translateX(-50%)', background: main.color, boxShadow: `0 0 0 3px #FFFFFF, 0 0 0 4.5px ${main.color}` }}
              />
              <div className="absolute top-1.5 w-2.5 h-2.5 rounded-md" style={{ insetInlineStart: 0, background: '#fff', border: '1.5px solid #E8E2D2' }} />
              <div className="absolute top-1.5 w-2.5 h-2.5 rounded-md" style={{ insetInlineEnd: 0, background: '#fff', border: '1.5px solid #E8E2D2' }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-ink-muted font-mono">
              <span>٢٠ مايو · يقترب</span>
              <span className="font-semibold" style={{ color: main.color }}>اليوم · ٢٤</span>
              <span>٢٩ مايو · يبتعد</span>
            </div>
          </div>

          <div className="text-[13.5px] text-ink leading-[1.85] mt-1.5">{main.body}</div>

          <div className="mt-3.5 p-3 bg-cream-soft rounded-[10px]" style={{ borderInlineStart: `3px solid ${main.color}` }}>
            <div className="text-[10px] font-bold tracking-wide mb-1.5" style={{ color: main.color }}>
              ✦ ما يلاحظه الممارسون
            </div>
            <div className="text-[13px] text-ink leading-[1.8] font-serif">
              زحل والشمس في اقتران: لحظة توقف وتقييم في التقليد الغربي. بعض الممارسين يصفه بثقل الوضوح.
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-2 mt-3.5">
            <Link
              href="/self"
              className="flex-1 px-3 py-[11px] rounded-[10px] bg-ink text-white text-center text-[13px] font-medium"
            >
              افتح في ذاتك
            </Link>
            <div className="w-11 py-[11px] rounded-[10px] bg-white text-center text-sm text-ink" style={{ border: '1px solid #E8E2D2' }}>
              ♡
            </div>
            <div className="w-11 py-[11px] rounded-[10px] bg-white text-center text-sm text-ink" style={{ border: '1px solid #E8E2D2' }}>
              ⌫
            </div>
          </div>
        </div>

        {/* also today */}
        {minor.length > 0 && (
          <div className="mt-5">
            <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">أيضًا اليوم</div>
            <div className="flex flex-col gap-2">
              {minor.map((e, i) => (
                <CalEventRow key={i} e={e} />
              ))}
            </div>
          </div>
        )}

        {/* day flow */}
        <div className="mt-5">
          <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">مَجرى اليوم</div>
          <div className="bg-white rounded-xl px-3.5 py-3 flex flex-col gap-2" style={{ border: '1px solid #E8E2D2' }}>
            {DAY_FLOW.map(([t, label], i) => (
              <div key={i} className="flex items-baseline gap-2.5">
                <div className="text-[11px] text-ink-muted font-mono w-[50px] text-center shrink-0">{t}</div>
                <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: '#E8E2D2' }} />
                <div className="text-[13px] text-ink leading-[1.5]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterTabBar active="explore" />
    </div>
  );
}
