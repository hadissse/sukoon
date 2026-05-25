'use client';

// Scr218 — السيرة البانورامية (Panoramic Biography)

import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';
import { PB_PHASES, pbStatus, statusColor, statusLabel, type Phase } from '../biographyData';

const CURRENT_AGE = 36;

function LifeArcStrip({ currentAge = CURRENT_AGE, max = 70 }: { currentAge?: number; max?: number }) {
  const pos = (a: number) => (a / max) * 100;
  return (
    <div className="relative h-7 mt-1.5 mx-1">
      <div className="absolute inset-x-0 top-[13px] h-[1.5px]" style={{ background: '#E8E2D2' }} />
      <div
        className="absolute top-[12.5px] h-[2.5px]"
        style={{ insetInlineEnd: 0, width: `${pos(currentAge)}%`, background: '#E9785E', opacity: 0.55 }}
      />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((a) => (
        <div
          key={a}
          className="absolute top-2 w-2 h-2 rounded-full"
          style={{
            insetInlineEnd: `calc(${pos(a)}% - 4px)`,
            background: a <= currentAge ? '#F3B8A6' : '#fff',
            border: `1.5px solid ${a <= currentAge ? '#E9785E' : '#E8E2D2'}`,
          }}
        />
      ))}
      {[0, 35, 70].map((a) => (
        <div
          key={`l-${a}`}
          className="absolute top-[21px] text-[9px] text-ink-muted font-mono w-5 text-center"
          style={{ insetInlineEnd: `calc(${pos(a)}% - 10px)` }}
        >
          {a === 0 ? '٠' : a === 35 ? '٣٥' : '٧٠'}
        </div>
      ))}
      <div
        className="absolute top-1.5 w-3 h-3 rounded-full"
        style={{
          insetInlineEnd: `calc(${pos(currentAge)}% - 6px)`,
          background: '#E9785E',
          boxShadow: '0 0 0 4px #FFFFFF, 0 0 0 5.5px #E9785E',
        }}
      />
    </div>
  );
}

function PhaseCollapsed({ p, status }: { p: Phase; status: ReturnType<typeof pbStatus> }) {
  return (
    <div
      className="bg-white rounded-[14px] px-3.5 py-3 grid items-center gap-3"
      style={{
        border: '1px solid #E8E2D2',
        opacity: status === 'past' ? 0.58 : 1,
        gridTemplateColumns: '36px 1fr auto 16px',
      }}
    >
      <div className="w-8 h-8 rounded-2xl bg-cream-soft flex items-center justify-center">
        <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/${p.svgKey}.svg')`, maskImage: `url('/svg/${p.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#E9785E' }} />
      </div>
      <div>
        <div className="font-serif text-[15px] text-ink leading-[1.3]">{p.name}</div>
        <div className="text-[11px] text-ink-muted mt-0.5 font-mono">
          {p.range} · {p.planet}
        </div>
      </div>
      <div
        className="text-[10px] font-semibold tracking-wide px-2 py-[3px] rounded-full"
        style={{ color: statusColor(status), background: status === 'current' ? 'rgba(233,120,94,0.08)' : 'transparent' }}
      >
        {statusLabel(status)}
      </div>
      <div className="text-sm text-ink-muted opacity-50 rotate-180">‹</div>
    </div>
  );
}

function PhaseExpanded({ p }: { p: Phase }) {
  return (
    <div
      className="bg-white rounded-2xl px-4 pt-4 pb-3.5 relative"
      style={{ border: '1.5px solid #E9785E', boxShadow: '0 0 0 4px rgba(233,120,94,0.06)' }}
    >
      <div
        className="absolute bg-coral text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
        style={{ top: -10, insetInlineEnd: 14 }}
      >
        أنت في هذه المرحلة الآن
      </div>

      <div className="flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-[22px] flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 30% 25%, #F3B8A6, #E9785E 70%)' }}
        >
          <div className="w-6 h-6" style={{ WebkitMaskImage: `url('/svg/${p.svgKey}.svg')`, maskImage: `url('/svg/${p.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#FFFFFF' }} />
        </div>
        <div className="flex-1">
          <div className="font-serif text-[19px] text-ink leading-[1.2]">{p.name}</div>
          <div className="text-xs text-ink-muted mt-[3px] font-mono">
            {p.range} · {p.planet}
          </div>
        </div>
        {p.currentAge && (
          <div className="text-center">
            <div className="font-serif text-[22px] text-coral leading-none">٣٦</div>
            <div className="text-[9px] text-ink-muted mt-0.5 tracking-wide">سنّك</div>
          </div>
        )}
      </div>

      <div className="text-[11px] text-coral font-semibold tracking-wide mt-3.5 mb-1.5 uppercase">{p.theme}</div>
      <div className="text-[13.5px] text-ink leading-[1.85] whitespace-pre-line">{p.body}</div>

      <div className="mt-3.5 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid #E8E2D2' }}>
        <div className="text-[11px] text-ink-muted font-mono">منتصف المرحلة · سن ~٣٨٫٥</div>
        <div className="text-[13px] text-coral font-medium">عرض التفاصيل ←</div>
      </div>
    </div>
  );
}

export default function BiographyPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="السيرة البانورامية" />

      <div className="px-5 mt-1">
        <div className="text-xs text-ink-muted leading-[1.7]">
          المراحل السبعينية في حياتك حسب التقليد الأنثروبوصوفي.
        </div>

        <div className="mt-3.5 p-3.5 rounded-[14px] bg-white" style={{ border: '1px solid #E8E2D2' }}>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-[10px] text-ink-muted tracking-wide font-semibold">العمر</div>
              <div className="font-serif text-[28px] text-ink mt-0.5 leading-none">
                ٣٦ <span className="text-[13px] text-ink-muted">سنة</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-ink-muted tracking-wide font-semibold">المرحلة</div>
              <div className="font-serif text-[18px] text-coral mt-1 flex items-center gap-1.5">
                <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/jupiter.svg')`, maskImage: `url('/svg/jupiter.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#E9785E' }} />
                المشتري
              </div>
            </div>
          </div>
          <LifeArcStrip />
        </div>

        <div className="mt-5 mb-2.5 text-[11px] text-ink-muted font-semibold tracking-wider">المراحل السبعينية</div>

        <div className="flex flex-col gap-2">
          {PB_PHASES.slice(0, 8).map((p) => {
            const s = pbStatus(p);
            return s === 'current' ? (
              <PhaseExpanded key={p.range} p={p} />
            ) : (
              <PhaseCollapsed key={p.range} p={p} status={s} />
            );
          })}
        </div>

        <div className="mt-[18px] mb-2.5 text-center text-xs text-ink-muted">
          ٧٠ سنة · ١٠ مراحل · سَكنٌ كوكبيّ لكل فصل
        </div>
      </div>

      <FooterTabBar active="explore" />
    </div>
  );
}
