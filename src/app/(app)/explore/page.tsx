'use client';

import Link from 'next/link';
import { GradientOrb } from '@/components/GradientOrb';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { ASTRO_KNOWLEDGE, ASTRO_COURSES } from '@/content/courses';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { getCurrentSky } from '@/lib/currentSky';
import type { AstralChart } from '@/lib/chartCalculator';
import { planetSvgKey } from '@/lib/planetMeta';
import { CalendarMonthView } from '@/app/explore/CalendarMonthView';
import { STATIONS_2026 } from '@/app/explore/calendarData';

function toAr(n: number | string): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

const PLANET_KEYS_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

const ALL_PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'northNode', 'southNode',
] as const;

function SkySection() {
  const [sky, setSky] = useState<AstralChart | null>(null);

  useEffect(() => {
    setSky(getCurrentSky());
    const id = setInterval(() => setSky(getCurrentSky()), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-cream min-h-screen pb-8">
      <div className="px-5 pt-6 flex items-baseline justify-between">
        <h1 className="font-serif text-2xl text-ink">السماء الآن</h1>
        <div className="text-[11px] text-ink-muted font-mono" dir="ltr">{timeStr}</div>
      </div>
      <div className="text-[11px] text-ink-muted px-5 mb-4">{dateStr} · تحديث كل دقيقة</div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        {/* Left col on desktop: wheel + planet grid */}
        <div>
          {/* Natal-style wheel */}
          <div className="flex justify-center px-2 mb-4 md:max-w-[480px] md:mx-auto">
            <ZoomableWheel size={420} tone="paper" chart={sky} showHouses={false} />
          </div>

          {/* Compact all-planets grid */}
          <div className="px-5">
            <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">مواضع الكواكب</div>
            {!sky && <div className="text-sm text-ink-muted text-center py-4">جارٍ الحساب...</div>}
            {sky && (
              <div className="grid grid-cols-2 gap-2">
                {ALL_PLANETS.map((key) => {
                  const planet = (sky as AstralChart & Record<string, { sign: string; degree: number; minute: number; retrograde?: boolean }>)[key];
                  if (!planet) return null;
                  return (
                    <Link key={key} href={`/explore/sky/${key}`} className="block">
                      <div className="bg-white rounded-[12px] px-3 py-2.5 flex items-center gap-2.5" style={{ border: '1px solid #F0EDE6' }}>
                        <div
                          className="w-5 h-5 shrink-0"
                          style={{
                            WebkitMaskImage: `url('/svg/${planetSvgKey(key)}.svg')`,
                            maskImage: `url('/svg/${planetSvgKey(key)}.svg')`,
                            WebkitMaskSize: 'contain', maskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center', maskPosition: 'center',
                            background: '#E9785E',
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] font-semibold text-ink truncate">{PLANET_KEYS_AR[key]}{planet.retrograde ? ' ℞' : ''}</div>
                          <div className="text-[11px] text-ink-muted truncate">
                            {planet.sign} · {toAr(planet.degree)}°
                          </div>
                        </div>
                        <div className="text-ink-muted text-xs shrink-0">‹</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right col on desktop: calendar + stations */}
        <div>
          {/* Full-year navigable calendar */}
          <div className="px-5 mb-6">
            <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">التقويم الفلكي ٢٠٢٦</div>
            <CalendarMonthView />
          </div>

          {/* 2026 Planetary Motion — stationary points */}
          {(() => {
            const now = new Date();
            const nowYear = now.getFullYear();
            const nowMonth = now.getMonth() + 1; // 1-indexed
            const nowDay = now.getDate();
            const isPast = (month: number, day: number) =>
              nowYear > 2026 ||
              (nowYear === 2026 && (month < nowMonth || (month === nowMonth && day <= nowDay)));
            return (
              <div className="px-5 mb-6">
                <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">محطات الكواكب ٢٠٢٦</div>
                <div className="text-[11px] text-ink-muted mb-3 leading-[1.7]">
                  المحطات هي اللحظات التي يبدو فيها الكوكب ساكنًا قبل أن يغيّر اتجاهه.
                </div>
                <div className="flex flex-col gap-2">
                  {(['mercury','venus','jupiter','saturn','uranus','neptune','pluto'] as const).map(svgKey => {
                    const planetStations = STATIONS_2026.filter(s => s.svgKey === svgKey);
                    if (planetStations.length === 0) return null;
                    return (
                      <div key={svgKey} className="bg-white rounded-[12px] px-3 py-2.5" style={{ border: '1px solid #F0EDE6' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 shrink-0" style={{
                            WebkitMaskImage: `url('/svg/${svgKey}.svg')`, maskImage: `url('/svg/${svgKey}.svg')`,
                            WebkitMaskSize: 'contain', maskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center', maskPosition: 'center',
                            background: '#5C5C7A',
                          }} />
                          <span className="text-[12px] font-semibold text-ink">{planetStations[0].nameAr}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {planetStations.map((s, i) => {
                            const past = isPast(s.month, s.day);
                            return (
                              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: '#fff',
                                  color: past ? '#B0A898' : '#171B3A',
                                  border: '1px solid #E0DBD3',
                                  textDecoration: past ? 'line-through' : 'none',
                                  opacity: past ? 0.6 : 1,
                                }}>
                                {s.type === 'sR' ? 'راجع' : 'مباشر'} · {s.dateLabel}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
        <div className="md:grid md:grid-cols-2 md:gap-2.5 flex flex-col gap-2.5">
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

function CalendarSection() {
  return (
    <div className="px-5 py-6 flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl text-ink -tracking-0.5">تقويم العبورات</h1>
        <p className="text-sm text-ink-muted mt-1">الأحداث الكونية الجماعية للشهر.</p>
      </div>
      <CalendarMonthView />
    </div>
  );
}

export default function ExplorePage() {
  const [view, setView] = useState<'sky' | 'calendar'>('sky');

  return (
    <div className="pb-10">
      {/* Sky / Calendar tab content */}
      {view === 'sky' && <SkySection />}
      {view === 'calendar' && <CalendarSection />}

      {/* Tab switcher — السماء · التقويم only */}
      <div className="px-5 py-4 flex gap-2 justify-center" style={{ scrollbarWidth: 'none' }}>
        {([
          ['sky', 'السماء'],
          ['calendar', 'التقويم'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-5 py-2 rounded-[14px] text-xs font-medium transition-colors whitespace-nowrap ${
              view === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-rule-soft mx-5 my-2" />

      {/* المعرفة — always shown as a separate section below */}
      <KnowledgeSection />
    </div>
  );
}
