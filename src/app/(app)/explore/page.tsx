'use client';

import Link from 'next/link';
import { GradientOrb } from '@/components/GradientOrb';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { ASTRO_KNOWLEDGE, ASTRO_COURSES } from '@/content/courses';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { getCurrentSky } from '@/lib/currentSky';
import type { AstralChart } from '@/lib/chartCalculator';

const lifeArcPhases = [
  { years: '٠-٧', name: 'الطفولة', status: 'past' },
  { years: '٧-١٤', name: 'تشكّل الأنا', status: 'past' },
  { years: '١٤-٢١', name: 'تسمية الذات', status: 'past' },
  { years: '٢١-٢٨', name: 'الاستقلال الأول', status: 'past' },
  { years: '٢٨-٣٥', name: 'بناء الشكل', status: 'current' },
  { years: '٣٥-٤٢', name: 'إرث العمل', status: 'next' },
  { years: '٤٢-٤٩', name: 'منتصف الحياة', status: 'later' },
  { years: '٤٩-٥٦', name: 'حصاد المعنى', status: 'later' },
];

const grandTransits = [
  { name: 'عودة المشتري الأولى', age: 'حوالي عمر ١٢', status: 'past' },
  { name: 'تقابل زحل', age: 'حوالي عمر ١٤٫٥', status: 'past' },
  { name: 'عودة زحل الأولى', age: 'حوالي عمر ٢٩٫٥', status: 'current' },
  { name: 'تقابل أورانوس', age: 'حوالي عمر ٤٢', status: 'next' },
  { name: 'عودة زحل الثانية', age: 'حوالي عمر ٥٩', status: 'later' },
];

const PLANET_KEYS_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
};

const VISIBLE_PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;

function SkySection() {
  const [sky, setSky] = useState<AstralChart | null>(null);

  useEffect(() => {
    setSky(getCurrentSky());
    // Refresh every 60s for live moon movement
    const id = setInterval(() => setSky(getCurrentSky()), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ background: '#0F1228' }} className="min-h-screen pb-8">
      {/* Stars */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-52 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => {
            const x = (i * 37) % 380;
            const y = ((i * 53) % 200) + 10;
            const s = (i % 3) + 1;
            return (
              <div key={i} className="absolute rounded-full" style={{ left: x, top: y, width: s, height: s, background: `rgba(255,255,255,${0.3 + (i % 4) * 0.15})` }} />
            );
          })}
        </div>

        <div className="relative px-5 pt-6">
          <div className="text-[11px] text-cream/50 font-semibold tracking-wider mb-1">{dateStr}</div>
          <h1 className="font-serif text-2xl text-cream mb-0.5">السماء الآن</h1>
          <p className="text-sm text-cream/60 mb-4">الكواكب في مواضعها الحقيقية · تحديث كل دقيقة</p>

          {/* Live wheel */}
          <div className="flex justify-center -mx-2 mb-4">
            <ZoomableWheel
              size={350}
              tone="white"
              chart={sky}
            />
          </div>

          {/* Time badge */}
          <div className="flex justify-center mb-5">
            <div className="px-3 py-1.5 rounded-full text-xs text-cream/70" style={{ background: 'rgba(255,255,255,0.07)' }}>
              آخر تحديث · {timeStr}
            </div>
          </div>
        </div>
      </div>

      {/* Live planet positions list */}
      <div className="px-5">
        <div className="text-[11px] text-cream/50 font-semibold tracking-wider mb-3">مواضع الكواكب الحية</div>
        <div className="flex flex-col gap-2">
          {sky && VISIBLE_PLANETS.map((key) => {
            const planet = sky[key];
            return (
              <div key={key} className="flex items-center gap-3 rounded-[14px] px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-4 h-4"
                    style={{
                      WebkitMaskImage: `url('/svg/${key}.svg')`,
                      maskImage: `url('/svg/${key}.svg')`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      background: '#C2D3E2',
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-cream font-medium">{PLANET_KEYS_AR[key]}</div>
                  <div className="text-xs text-cream/55 mt-0.5">{planet.sign} · {planet.degree}°{planet.minute > 0 ? ` ${planet.minute}′` : ''}</div>
                </div>
              </div>
            );
          })}
          {!sky && (
            <div className="text-sm text-cream/40 text-center py-4">جارٍ الحساب...</div>
          )}
        </div>

        {/* Transit calendar link */}
        <Link href="/explore/calendar" className="mt-4 flex items-center justify-between px-4 py-3.5 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div className="text-sm text-cream font-medium">تقويم العبورات</div>
            <div className="text-xs text-cream/50 mt-0.5">مسار الكواكب · شهريًا</div>
          </div>
          <span className="text-coral text-sm">←</span>
        </Link>
      </div>
    </div>
  );
}

function LifeArcSection() {
  return (
    <div className="px-5 py-6 flex flex-col gap-3">
      <h1 className="font-serif text-2xl text-ink -tracking-0.5">القوس الحياتي</h1>
      <p className="text-sm text-ink-muted mb-3">
        سبع سنوات في كل طور — حياتك مَبنيّة من فصول.
      </p>
      <div className="flex flex-col gap-2">
        {lifeArcPhases.map((phase) => (
          <div
            key={phase.years}
            className={`bg-white rounded-[14px] p-3.5 border border-rule-soft transition-opacity ${
              phase.status === 'past' ? 'opacity-55' : 'opacity-100'
            }`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-xs text-coral font-semibold font-serif">{phase.years}</span>
              <span className="text-xs text-ink-muted font-semibold tracking-wide">
                {phase.status === 'current'
                  ? 'الآن'
                  : phase.status === 'next'
                    ? 'التالي'
                    : phase.status === 'past'
                      ? 'مضى'
                      : 'لاحقًا'}
              </span>
            </div>
            <div className="font-serif text-base text-ink">{phase.name}</div>
            {phase.status === 'current' && (
              <div className="flex gap-1 mt-2">
                {['#C2D3E2', '#D4A04C', '#E9785E', '#D4A04C', '#C2D3E2'].map((color, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link href="/explore/biography" className="mt-3 flex items-center justify-between p-3.5 rounded-[14px] bg-cream-soft border border-rule-soft">
        <span className="text-sm font-serif text-ink">السيرة البانورامية الكاملة</span>
        <span className="text-coral text-sm">←</span>
      </Link>
    </div>
  );
}

function GrandTransitsSection() {
  return (
    <div className="px-5 py-6 flex flex-col gap-3">
      <h1 className="font-serif text-2xl text-ink -tracking-0.5">العبورات الكبرى</h1>
      <p className="text-sm text-ink-muted mb-3 leading-relaxed">
        خمس عتباتٍ تَحدُث في كل حياة. متى وصلتَ إلى عتبتك؟
      </p>
      <div className="flex flex-col gap-2.5">
        {grandTransits.map((transit) => (
          <div
            key={transit.name}
            className={`rounded-[14px] p-3.5 border transition-all ${
              transit.status === 'current'
                ? 'bg-cream-soft border-coral border-1.5'
                : 'bg-white border-rule-soft'
            } ${transit.status === 'past' ? 'opacity-55' : 'opacity-100'}`}
          >
            <div className="flex justify-between items-baseline gap-2 mb-1">
              <span className="font-serif text-base text-ink">{transit.name}</span>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  transit.status === 'current' ? 'text-coral' : 'text-ink-muted'
                }`}
              >
                {transit.status === 'current'
                  ? 'الآن'
                  : transit.status === 'next'
                    ? 'القادم'
                    : transit.status === 'past'
                      ? 'مضى'
                      : 'لاحقًا'}
              </span>
            </div>
            <div className="text-xs text-ink-muted">{transit.age}</div>
          </div>
        ))}
      </div>
      <Link href="/explore/great-transits" className="mt-3 flex items-center justify-between p-3.5 rounded-[14px] bg-cream-soft border border-rule-soft">
        <span className="text-sm font-serif text-ink">العبورات الكونية الكبرى</span>
        <span className="text-coral text-sm">←</span>
      </Link>
    </div>
  );
}

function KnowledgeSection() {
  return (
    <div className="px-5 py-6 flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl text-ink -tracking-0.5">المعرفة</h1>
        <p className="text-sm text-ink-muted mt-1">ابنِ فهمك بدروس موجّهة.</p>
      </div>

      {/* Knowledge topics grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {ASTRO_KNOWLEDGE.map((item) => (
          <Link key={item.id} href={`/learn/${item.courseId}`} className="block">
            <div className="bg-white rounded-[16px] border border-rule-soft p-3.5 flex flex-col gap-2">
              {item.svgKey ? (
                <div className="w-6 h-6" style={{ WebkitMaskImage: `url('/svg/${item.svgKey}.svg')`, maskImage: `url('/svg/${item.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#171B3A' }} />
              ) : (
                <span className="text-xl text-ink">{item.icon}</span>
              )}
              <div>
                <div className="font-serif text-sm text-ink">{item.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">{item.subtitle}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured astrology courses */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="font-serif text-base text-ink">دورات نجمية</div>
          <Link href="/learn" className="text-xs text-coral font-medium">عرض الكل ←</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {ASTRO_COURSES.slice(0, 4).map((c) => (
            <Link key={c.id} href={`/learn/${c.id}`} className="block">
              <div className="bg-white rounded-[16px] border border-rule-soft p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] shrink-0" style={{
                  background: c.variant === 'dawn' ? 'linear-gradient(135deg,#F8D6BE,#E9785E)'
                    : c.variant === 'lake' ? 'linear-gradient(135deg,#C2D3E2,#7E97B8)'
                    : c.variant === 'ember' ? 'linear-gradient(135deg,#F0C8A0,#D4804C)'
                    : c.variant === 'dust' ? 'linear-gradient(135deg,#D8D4C8,#9A9482)'
                    : 'linear-gradient(135deg,#C9D2BE,#8FA084)',
                }} />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-sm text-ink truncate">{c.title}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{c.course} · {c.teacher}</div>
                </div>
                <span className="text-coral text-sm shrink-0">←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Library link */}
      <Link href="/library" className="mx-5 mt-2 flex items-center justify-between p-3.5 rounded-[14px] bg-cream-soft border border-rule-soft">
        <span className="text-sm font-serif text-ink">مكتبتي · المحفوظة والسجل</span>
        <span className="text-coral text-sm">←</span>
      </Link>
    </div>
  );
}

export default function ExplorePage() {
  const [view, setView] = useState<'sky' | 'arc' | 'transits' | 'knowledge'>('sky');

  return (
    <div className="pb-24">
      {/* Journey 2 entry — always visible at the top */}
      <div className="px-5 pt-5 pb-3">
        <Link href="/journey-2" className="block">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-serif text-base text-ink">التتبّع اليومي</div>
                <div className="text-xs text-ink-muted mt-0.5">لحظاتك · السماء الآن · التسجيل</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        </Link>
      </div>

      {view === 'sky' && <SkySection />}
      {view === 'arc' && <LifeArcSection />}
      {view === 'transits' && <GrandTransitsSection />}
      {view === 'knowledge' && <KnowledgeSection />}

      {/* Navigation buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-5 py-4 flex gap-2 justify-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {([
          ['sky', 'السماء'],
          ['arc', 'القوس'],
          ['transits', 'العبورات'],
          ['knowledge', 'المعرفة'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-4 py-2 rounded-[14px] text-xs font-medium transition-colors whitespace-nowrap ${
              view === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
