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

const PLANET_KEYS_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'الرأس', southNode: 'الذيل',
};

const ALL_PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'chiron', 'northNode', 'southNode',
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
        <div className="text-[11px] text-ink-muted font-mono">{timeStr}</div>
      </div>
      <div className="text-[11px] text-ink-muted px-5 mb-4">{dateStr} · تحديث كل دقيقة</div>

      {/* Natal-style wheel */}
      <div className="flex justify-center px-2 mb-4">
        <ZoomableWheel size={377} tone="paper" chart={sky} />
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
                <div key={key} className="bg-white rounded-[12px] px-3 py-2.5 flex items-center gap-2.5" style={{ border: '1px solid #F0EDE6' }}>
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
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-ink truncate">{PLANET_KEYS_AR[key]}{planet.retrograde ? ' ℞' : ''}</div>
                    <div className="text-[11px] text-ink-muted truncate">{planet.sign} · {planet.degree}°{planet.minute > 0 ? `${planet.minute}′` : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
  const [view, setView] = useState<'sky' | 'knowledge'>('sky');

  return (
    <div className="pb-24">
      {view === 'sky' && <SkySection />}
      {view === 'knowledge' && <KnowledgeSection />}

      {/* Navigation buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-5 py-4 flex gap-2 justify-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {([
          ['sky', 'السماء'],
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
