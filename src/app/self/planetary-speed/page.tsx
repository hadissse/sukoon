'use client';

// Scr183 — سرعة الكواكب (Planetary Speed panel)

import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';

// [glyph, name, speed, direction, accel, next station]
const PLANETS: [string, string, string, string, string, string][] = [
  ['☽', 'القمر', '١٣٫٢°/يوم', 'مستقيم', 'مُسرِع', '—'],
  ['☿', 'عطارد', '١٫٥°/يوم', 'مستقيم', 'مُتسارع', 'محطّ ٢٤ مايو'],
  ['♀', 'الزهرة', '٠٫٧°/يوم', 'مستقيم', 'ثابت', 'محطّ ٧ يوليو'],
  ['☉', 'الشمس', '٠٫٩٧°/يوم', 'مستقيم', 'ثابت', '—'],
  ['♂', 'المريخ', '٠٫٤°/يوم', 'مستقيم', 'مُبطئ', 'محطّ ١ سبتمبر'],
  ['♃', 'المشتري', '٠٫٢°/يوم', 'مستقيم', 'ثابت', 'محطّ ٤ يوليو'],
  ['♄', 'زحل', '٠٫٠٢°/يوم', 'محطّ', 'بطيء جدًّا', 'يدور ١٤ مايو'],
  ['♅', 'أورانوس', '٠٫٠٤°/يوم', 'رجعي', 'بطيء', 'يستقيم ٢٠ يناير'],
  ['♆', 'نبتون', '٠٫٠٢°/يوم', 'رجعي', 'بطيء', 'يستقيم ٧ ديسمبر'],
  ['♇', 'بلوتو', '٠٫٠١°/يوم', 'رجعي', 'بطيء جدًّا', 'يستقيم ١٢ أكتوبر'],
];

function dirColor(d: string): string {
  return d === 'رجعي' ? '#E9785E' : d === 'محطّ' ? '#D4A04C' : '#8FA084';
}

export default function PlanetarySpeedPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="سرعة الكواكب" />
      <p className="text-[13px] text-ink-muted px-5 mt-1.5 leading-[1.7]">
        ما يمرّ بسرعة عاطفة، وما يستقرّ كجبل.
      </p>

      <div className="px-5 pt-[18px] flex flex-col gap-2">
        {PLANETS.map(([g, n, speed, dir, accel, station]) => (
          <div key={n} className="bg-white rounded-[14px] p-3.5" style={{ border: '1px solid #E8E2D2' }}>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[20px] bg-cream-soft flex items-center justify-center shrink-0 text-xl text-coral">
                {g}
              </div>
              <div className="flex-1">
                <div className="font-serif text-base text-ink">{n}</div>
                <div className="text-[11px] text-ink-muted mt-0.5 font-mono">{speed}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 bg-cream-soft rounded-full"
                  style={{ color: dirColor(dir) }}
                >
                  {dir}
                </span>
                <span className="text-[10px] text-ink-muted">{accel}</span>
              </div>
            </div>
            {station !== '—' && (
              <div
                className="mt-2 pt-2 text-[11px] text-ink-muted"
                style={{ borderTop: '1px dashed #E8E2D2' }}
              >
                المحطّ التالي: <span className="text-ink font-medium">{station}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <FooterTabBar active="self" />
    </div>
  );
}
