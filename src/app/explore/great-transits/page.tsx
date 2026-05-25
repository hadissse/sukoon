'use client';

// Scr219 — العبورات الكونية الكبرى (Great Cosmic Transits)

import Link from 'next/link';
import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';
import { PB_TRANSITS, type GreatTransit } from '../biographyData';

interface EssayLink {
  slug: string;
  svgKey: string;
  title: string;
  sub: string;
  color: string;
  readTime: string;
}

const ESSAY_LINKS: EssayLink[] = [
  {
    slug: 'jupiter-return',
    svgKey: 'jupiter',
    title: 'عودة المشتري',
    sub: 'كلّ ١٢ سنةً · التوسّع والأُفق',
    color: '#9C8AB8',
    readTime: '٦ دقائق',
  },
  {
    slug: 'chiron-return',
    svgKey: 'chiron',
    title: 'عودة كيرون',
    sub: 'حوالي سن ٥٠ · الجرح المُعلِّم',
    color: '#A8A8A8',
    readTime: '٧ دقائق',
  },
  {
    slug: 'uranus-opposition',
    svgKey: 'uranus',
    title: 'تقابل أورانوس',
    sub: 'حوالي سن ٤٢ · يقظة منتصف الحياة',
    color: '#7E97B8',
    readTime: '٧ دقائق',
  },
];

// The most recent past transit (Saturn Return I) is the active reflection.
const EXPANDED_NAME = 'عودة زحل الأولى';

// statusColor for transits — matches the design (past=muted, others=inkSoft).
function transitStatusColor(s: GreatTransit['status']): string {
  return s === 'past' ? '#5C5C7A' : '#2A2F66';
}

function TransitRowCollapsed({ t }: { t: GreatTransit }) {
  return (
    <div
      className="bg-white rounded-[14px] px-3.5 py-3 grid items-center gap-3"
      style={{ border: '1px solid #E8E2D2', opacity: t.status === 'past' ? 0.6 : 1, gridTemplateColumns: '36px 1fr auto' }}
    >
      <div className="w-8 h-8 rounded-2xl bg-cream-soft flex items-center justify-center">
        <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/${t.svgKey}.svg')`, maskImage: `url('/svg/${t.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#5C5C7A' }} />
      </div>
      <div>
        <div className="font-serif text-[14.5px] text-ink leading-[1.3]">{t.name}</div>
        <div className="text-[11px] text-ink-muted mt-0.5 font-mono">
          {t.year} · {t.age}
        </div>
      </div>
      <div className="text-[10px] font-semibold tracking-wide" style={{ color: transitStatusColor(t.status) }}>
        {t.status === 'past' ? `مرّت · ${t.age}` : t.status === 'next' ? `قادمة · ${t.age}` : `لاحقًا · ${t.age}`}
      </div>
    </div>
  );
}

function TransitRowExpanded({ t }: { t: GreatTransit }) {
  return (
    <div
      className="bg-white rounded-2xl px-4 pt-4 pb-3.5"
      style={{ border: '1.5px solid #E9785E', boxShadow: '0 0 0 4px rgba(233,120,94,0.06)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-[46px] h-[46px] rounded-[23px] flex items-center justify-center shrink-0"
          style={{ background: 'radial-gradient(circle at 30% 25%, #F3B8A6, #E9785E 70%)' }}
        >
          <div className="w-6 h-6" style={{ WebkitMaskImage: `url('/svg/${t.svgKey}.svg')`, maskImage: `url('/svg/${t.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#FFFFFF' }} />
        </div>
        <div className="flex-1">
          <div className="font-serif text-[18px] text-ink leading-[1.25]">{t.name}</div>
          <div className="text-[11px] text-ink-muted mt-[3px] font-mono">
            {t.year} · {t.age} · {t.planet}
          </div>
        </div>
        <div
          className="text-[10px] font-bold tracking-wide text-coral px-2.5 py-1 rounded-full self-start whitespace-nowrap"
          style={{ background: 'rgba(233,120,94,0.08)' }}
        >
          {t.status === 'next' ? 'قادمة' : t.status === 'past' ? 'مرّت' : 'لاحقًا'}
        </div>
      </div>

      <div className="text-[13px] text-ink leading-[1.9] mt-3.5 whitespace-pre-line">{t.intro}</div>
      <div className="text-[12.5px] text-ink-soft leading-[1.9] mt-2.5 whitespace-pre-line">{t.body}</div>

      <div className="mt-4 p-3.5 bg-cream-soft rounded-xl" style={{ borderInlineStart: '3px solid #E9785E' }}>
        <div className="text-[10px] text-coral font-bold tracking-wide mb-1.5">تأمل</div>
        <div className="text-[13.5px] text-ink leading-[1.8] font-serif">{t.prompt}</div>
      </div>
    </div>
  );
}

export default function GreatTransitsPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="العبورات الكونية" />

      <div className="px-5 mt-1">
        <div className="text-xs text-ink-muted leading-[1.75]">
          خمس لحظات تحوّل كونية يمرّ بها كل إنسان — مبنية على دورات الكواكب البعيدة.
        </div>

        {/* horizon strip — five glyphs on a line */}
        <div className="mt-3.5 px-3 pt-3.5 pb-2.5 bg-white rounded-[14px]" style={{ border: '1px solid #E8E2D2' }}>
          <div className="grid grid-cols-5 gap-1 relative">
            <div className="absolute top-[18px] h-[1.5px]" style={{ insetInline: 18, background: '#E8E2D2' }} />
            {PB_TRANSITS.map((t) => {
              const isCurrent = t.name === EXPANDED_NAME;
              return (
                <div key={t.name} className="flex flex-col items-center gap-1 relative z-[1]">
                  <div
                    className="w-9 h-9 rounded-[18px] flex items-center justify-center"
                    style={{
                      background: isCurrent ? '#E9785E' : t.status === 'past' ? '#F8F8F8' : '#fff',
                      border: isCurrent ? 'none' : `1.5px solid ${t.status === 'past' ? '#F3B8A6' : '#E8E2D2'}`,
                      boxShadow: isCurrent ? '0 0 0 3px #FFFFFF, 0 0 0 4.5px #E9785E' : 'none',
                    }}
                  >
                    <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/${t.svgKey}.svg')`, maskImage: `url('/svg/${t.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: isCurrent ? '#fff' : t.status === 'past' ? '#E9785E' : '#5C5C7A' }} />
                  </div>
                  <div className="text-[9.5px] text-ink-muted font-mono">{t.age.replace('سن ', '')}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* list with one expanded */}
        <div className="mt-4 flex flex-col gap-2">
          {PB_TRANSITS.map((t) =>
            t.name === EXPANDED_NAME ? (
              <TransitRowExpanded key={t.name} t={t} />
            ) : (
              <TransitRowCollapsed key={t.name} t={t} />
            )
          )}
        </div>

        <div className="mt-[18px] mb-2.5 text-center text-xs text-ink-muted leading-[1.7]">
          خمس عتبات · على مدى ثمانين سنة
        </div>

        {/* essay links — contemplative long-reads */}
        <div className="mt-6">
          <div className="text-[11px] text-ink-muted font-bold tracking-wide mb-2.5 uppercase">
            مقالات تأمليّة
          </div>
          <div className="flex flex-col gap-2">
            {ESSAY_LINKS.map((e) => (
              <Link
                key={e.slug}
                href={`/explore/transits/${e.slug}`}
                className="bg-white rounded-[14px] px-3.5 py-3 grid items-center gap-3 no-underline"
                style={{ border: '1px solid #E8E2D2', gridTemplateColumns: '36px 1fr auto' }}
              >
                <div
                  className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: e.color }}
                >
                  <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/${e.svgKey}.svg')`, maskImage: `url('/svg/${e.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#FFFFFF' }} />
                </div>
                <div>
                  <div className="font-serif text-[14.5px] text-ink leading-[1.3]">{e.title}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{e.sub}</div>
                </div>
                <div className="text-[10px] text-ink-muted font-mono whitespace-nowrap">
                  {e.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FooterTabBar active="explore" />
    </div>
  );
}
