'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meta } from '@/components/Meta';
import { Rule } from '@/components/Rule';
import { TransitHeroCard } from '@/components/TransitHeroCard';
import { GradientOrb } from '@/components/GradientOrb';
import { getCosmicStamp, type CosmicStamp } from '@/lib/cosmicStamp';
import { ASTRO_KNOWLEDGE, ASTRO_COURSES } from '@/content/courses';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { getCurrentSky } from '@/lib/currentSky';
import type { AstralChart } from '@/lib/chartCalculator';
import { planetSvgKey } from '@/lib/planetMeta';
import { CalendarMonthView } from '@/app/explore/CalendarMonthView';
import { Card } from '@/components/Card';

// ── Explore section helpers ──────────────────────────────────────────────────

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
  'chiron', 'northNode', 'southNode',
] as const;

// ── Zodiac signs for learn section ──────────────────────────────────────────
const ZODIAC_SIGNS = [
  { slug: 'aries',       svgKey: 'aries',   nameAr: 'الحمل',    elementAr: 'نار',   elementColor: '#E9785E' },
  { slug: 'taurus',      svgKey: 'taurus',  nameAr: 'الثور',    elementAr: 'تراب',  elementColor: '#BDAA82' },
  { slug: 'gemini',      svgKey: 'gemini',  nameAr: 'الجوزاء',  elementAr: 'هواء',  elementColor: '#8BB4C8' },
  { slug: 'cancer',      svgKey: 'cancer',  nameAr: 'السرطان',  elementAr: 'ماء',   elementColor: '#7E97B8' },
  { slug: 'leo',         svgKey: 'leo',     nameAr: 'الأسد',    elementAr: 'نار',   elementColor: '#E9785E' },
  { slug: 'virgo',       svgKey: 'virgo',   nameAr: 'العذراء',  elementAr: 'تراب',  elementColor: '#BDAA82' },
  { slug: 'libra',       svgKey: 'libra',   nameAr: 'الميزان',  elementAr: 'هواء',  elementColor: '#8BB4C8' },
  { slug: 'scorpio',     svgKey: 'scorpio', nameAr: 'العقرب',   elementAr: 'ماء',   elementColor: '#7E97B8' },
  { slug: 'sagittarius', svgKey: 'sag',     nameAr: 'القوس',    elementAr: 'نار',   elementColor: '#E9785E' },
  { slug: 'capricorn',   svgKey: 'cap',     nameAr: 'الجدي',    elementAr: 'تراب',  elementColor: '#BDAA82' },
  { slug: 'aquarius',    svgKey: 'aqua',    nameAr: 'الدلو',    elementAr: 'هواء',  elementColor: '#8BB4C8' },
  { slug: 'pisces',      svgKey: 'pisces',  nameAr: 'الحوت',    elementAr: 'ماء',   elementColor: '#7E97B8' },
];

// ── Sky-to-sky aspect types (mirrors self/page.tsx ASPECTS) ─────────────────

const SKY_ASPECT_DEFS = [
  { angle: 0,   name: 'اقتران', symbol: '☌', orb: 8, color: '#5C5C7A' },
  { angle: 60,  name: 'سُداس',  symbol: '⚹', orb: 6, color: '#4A7FB5' },
  { angle: 90,  name: 'تربيع',  symbol: '▫', orb: 8, color: '#C0392B' },
  { angle: 120, name: 'تثليث',  symbol: '△', orb: 8, color: '#27AE60' },
  { angle: 180, name: 'تقابل',  symbol: '☍', orb: 8, color: '#C0392B' },
] as const;

const SKY_ASPECT_PLANET_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const;

interface SkyAspect {
  label: string;
  symbol: string;
  type: string;
  color: string;
  orb: string;
  orbDeg: number;
}

function calculateSkyAspects(sky: AstralChart): SkyAspect[] {
  const results: SkyAspect[] = [];

  for (let i = 0; i < SKY_ASPECT_PLANET_KEYS.length; i++) {
    for (let j = i + 1; j < SKY_ASPECT_PLANET_KEYS.length; j++) {
      const p1Key = SKY_ASPECT_PLANET_KEYS[i];
      const p2Key = SKY_ASPECT_PLANET_KEYS[j];
      const p1 = (sky as any)[p1Key];
      const p2 = (sky as any)[p2Key];
      if (!p1 || !p2 || typeof p1.longitude !== 'number' || typeof p2.longitude !== 'number') continue;

      const diff = Math.abs(((p1.longitude - p2.longitude + 180) % 360) - 180);

      for (const asp of SKY_ASPECT_DEFS) {
        const orbDeg = Math.abs(diff - asp.angle);
        if (orbDeg <= asp.orb) {
          results.push({
            label: `${PLANET_KEYS_AR[p1Key]} ${asp.symbol} ${PLANET_KEYS_AR[p2Key]}`,
            symbol: asp.symbol,
            type: asp.name,
            color: asp.color,
            orb: `${toAr(orbDeg.toFixed(0))}°`,
            orbDeg,
          });
          break; // only one aspect per pair
        }
      }
    }
  }

  return results.sort((a, b) => a.orbDeg - b.orbDeg);
}

// ── Filter chip order for aspects ───────────────────────────────────────────

const ASPECT_FILTER_CHIPS = [
  { label: 'الكل',   color: null },
  { label: 'تربيع',  color: '#C0392B' },
  { label: 'اقتران', color: '#5C5C7A' },
  { label: 'تثليث',  color: '#27AE60' },
  { label: 'تقابل',  color: '#C0392B' },
] as const;

function SkySection() {
  const [sky, setSky] = useState<AstralChart | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string>('الكل');

  useEffect(() => {
    setSky(getCurrentSky());
    const id = setInterval(() => setSky(getCurrentSky()), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' });

  const skyAspects = sky ? calculateSkyAspects(sky) : [];
  const filteredAspects = aspectFilter === 'الكل'
    ? skyAspects
    : skyAspects.filter((a) => a.type === aspectFilter);

  return (
    <div className="pb-4">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-serif text-2xl text-ink">السماء الآن</h2>
        <div className="text-[11px] text-ink-muted font-mono" dir="ltr">{timeStr}</div>
      </div>
      <div className="text-[11px] text-ink-muted mb-4">{dateStr} · تحديث كل دقيقة</div>

      <div className="w-full mb-4">
        <ZoomableWheel size={9999} tone="paper" chart={sky} showHouses={false} />
      </div>

      <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-2.5">مواضع الكواكب</div>
      {!sky && <div className="text-sm text-ink-muted text-center py-4">جارٍ الحساب...</div>}
      {sky && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                  <div className="text-ink-muted text-xs shrink-0">›</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Sky-to-sky aspects ── */}
      {sky && (
        <div className="mt-6">
          <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-3">جوانب السماء</div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto mb-3" style={{ scrollbarWidth: 'none' }}>
            {ASPECT_FILTER_CHIPS.map(({ label, color }) => (
              <button
                key={label}
                onClick={() => setAspectFilter(label)}
                className="px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0"
                style={{
                  background: aspectFilter === label ? (color ?? '#171B3A') : '#fff',
                  color: aspectFilter === label ? '#F5F2EA' : '#171B3A',
                  border: `1px solid ${aspectFilter === label ? (color ?? '#171B3A') : '#E5E1D8'}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Aspect cards */}
          <div className="flex flex-col gap-3">
            {filteredAspects.length > 0 ? (
              filteredAspects.map((aspect) => (
                <Card key={aspect.label}>
                  <div className="flex items-center gap-3">
                    {/* Aspect symbol badge */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[16px] font-serif"
                      style={{
                        background: `${aspect.color}18`,
                        color: aspect.color,
                        border: `1.5px solid ${aspect.color}40`,
                      }}
                    >
                      {aspect.symbol}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base text-ink">{aspect.label}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px] font-medium" style={{ color: aspect.color }}>{aspect.type}</span>
                        <span className="text-[11px] text-ink-muted font-mono">{aspect.orb}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-ink-muted text-sm">لا توجد جوانب في هذا التصفية</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function KnowledgeSection() {
  return (
    <div className="pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-serif text-2xl text-ink -tracking-0.5">المعرفة</h2>
        <p className="text-sm text-ink-muted mt-1">ابنِ فهمك بدروس موجّهة.</p>
      </div>

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

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="font-serif text-base text-ink">دورات نجمية</div>
          <Link href="/learn" className="text-xs text-coral font-medium">عرض الكل ←</Link>
        </div>
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2">
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

      <Link href="/library" className="flex items-center justify-between p-3.5 rounded-[14px] bg-cream-soft border border-rule-soft">
        <span className="text-sm font-serif text-ink">مكتبتي · المحفوظة والسجل</span>
        <span className="text-coral text-sm">←</span>
      </Link>
    </div>
  );
}

function CalendarSection() {
  return (
    <div className="pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-serif text-2xl text-ink -tracking-0.5">تقويم العبورات</h2>
        <p className="text-sm text-ink-muted mt-1">الأحداث الكونية الجماعية للشهر.</p>
      </div>
      <CalendarMonthView />
    </div>
  );
}

// ── Daily rotating question — advances each day
const DAILY_QUESTIONS = [
  'ما الذي يحتاج منك أن تسمعه اليوم، لا أن تحلّه؟',
  'من أنت حين لا يراك أحد؟',
  'ما الشيء الذي تؤجّله منذ زمن، وما السبب الحقيقي؟',
  'ما الذي تعطيه بسهولة، وما الذي تجد صعوبة في أخذه؟',
  'في أيّ لحظة شعرت اليوم أنك أنت، لا دورك؟',
  'ما الذي ينمو فيك الآن في الصمت؟',
  'ما الحاجة التي لم تقلها بعد؟',
];

function getDailyQuestion(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}

const SKY_ASPECT_TYPES = [
  { angle: 180, orb: 8, name: 'تقابل',  priority: 1 },
  { angle: 0,   orb: 8, name: 'اقتران', priority: 2 },
  { angle: 120, orb: 8, name: 'تثليث',  priority: 3 },
  { angle: 90,  orb: 8, name: 'تربيع',  priority: 4 },
  { angle: 60,  orb: 6, name: 'سُداس',  priority: 5 },
];

const SKY_PLANET_KEYS = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'] as const;

function getSkyAspectText(sky: AstralChart): string | null {
  let best: { p1: string; p2: string; name: string; priority: number } | null = null;
  for (let i = 0; i < SKY_PLANET_KEYS.length; i++) {
    for (let j = i + 1; j < SKY_PLANET_KEYS.length; j++) {
      const a = (sky as any)[SKY_PLANET_KEYS[i]];
      const b = (sky as any)[SKY_PLANET_KEYS[j]];
      if (!a || !b) continue;
      const sep = Math.abs(((a.longitude - b.longitude + 180) % 360) - 180);
      for (const asp of SKY_ASPECT_TYPES) {
        if (Math.abs(sep - asp.angle) <= asp.orb) {
          if (!best || asp.priority < best.priority) {
            best = { p1: PLANET_KEYS_AR[SKY_PLANET_KEYS[i]], p2: PLANET_KEYS_AR[SKY_PLANET_KEYS[j]], name: asp.name, priority: asp.priority };
          }
          break;
        }
      }
    }
  }
  return best ? `${best.p1} ${best.name} ${best.p2}` : null;
}

export default function TodayPage() {
  const [stamp, setStamp] = useState<CosmicStamp | null>(null);
  const [journey1Step, setJourney1Step] = useState<number | null>(null);
  const [heroSky, setHeroSky] = useState<AstralChart | null>(null);

  useEffect(() => {
    setStamp(getCosmicStamp());
    setHeroSky(getCurrentSky());
    try {
      const raw = localStorage.getItem('sukoon.journey1.v1');
      if (raw) {
        const data = JSON.parse(raw);
        setJourney1Step(data.currentStep ?? 0);
      }
    } catch {}
  }, []);

  const question = getDailyQuestion();
  const heroText = heroSky ? getSkyAspectText(heroSky) : null;

  return (
    <div className="pb-24 flex flex-col gap-0">
      {/* ── Sky hero — square on mobile, cinematic banner on desktop ── */}
      <div className="relative w-full aspect-square md:aspect-[16/7] overflow-hidden md:rounded-[28px] md:mt-4" style={{ background: '#1A0C00' }}>
        <img src="/media/match-flame.webp" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(15,18,40,0.60) 0%, rgba(15,18,40,0) 42%, rgba(15,18,40,0.78) 100%)' }} />
        {/* Logo — top right, white */}
        <div className="absolute top-5 right-5 flex items-center gap-2.5">
          <img src="/sukoon-logo-icon.svg" alt="" aria-hidden="true" className="h-10 w-10 invert" />
          <img src="/sukoon-logo-white.svg" alt="سُكون" className="h-7" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {heroText && (
            <div className="font-serif text-2xl text-cream leading-snug">{heroText}</div>
          )}
          {!heroText && stamp && (
            <div className="font-serif text-2xl text-cream leading-snug">{stamp.moonPhase}</div>
          )}
        </div>
      </div>

      <div className="px-5 md:px-0 flex flex-col gap-4 pt-5 md:pt-6 md:grid md:grid-cols-2 md:gap-5 md:items-start">
        {/* ── Sky ── */}
        <div id="today-sky" className="md:col-span-2">
          <SkySection />
        </div>

        <div className="md:col-span-2">
          <Rule />
        </div>

        {/* ── التقويم ── */}
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-4">التقويم</div>
          <CalendarSection />
        </div>

        <div className="md:col-span-2">
          <Rule />
        </div>

        {/* ── المعرفة ── */}
        <div className="md:col-span-2">
          <div className="text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-4">المعرفة</div>
          <KnowledgeSection />
        </div>

        <div className="md:col-span-2">
          <Rule />
        </div>

        {/* Journey card — sage/green box */}
        <Link href="/journey-1" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #C9D2BE 0%, #B8C4AC 100%)' }}>
            <div className="absolute -bottom-8 -left-8 opacity-30">
              <GradientOrb variant="sage" size={120} />
            </div>
            <div className="relative">
              <div className="text-[11px] text-ink/60 font-semibold tracking-wider mb-2">رحلتك الأسبوعية</div>
              {journey1Step !== null ? (
                <>
                  <div className="font-serif text-[17px] text-ink">الخطوة {journey1Step + 1} من ٧</div>
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{ background: i <= journey1Step ? '#171B3A' : 'rgba(23,27,58,0.2)' }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-ink/60 mt-2 font-medium">تابع ←</div>
                </>
              ) : (
                <>
                  <div className="font-serif text-[17px] text-ink">ابدأ المسار الأسبوعي</div>
                  <div className="text-xs text-ink-muted mt-1.5">سبع خطوات عبر خريطتك الداخلية</div>
                  <div className="text-xs text-ink/60 mt-3 font-medium">ابدأ ←</div>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Knowledge box — hidden, re-enable when ready */}

        <div className="md:col-span-2">
          <Rule />
        </div>

        {/* Teaching — square full-bleed */}
        <Link href="/learn" className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-[20px]" style={{ background: '#0F1228' }}>
            <img src="/media/blob-purple.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.74) 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="text-[11px] text-cream/60 font-semibold tracking-wider">تعلّم</div>
              <div>
                <div className="font-serif text-2xl text-cream leading-snug">كيف تقرأ عبورك اليومي؟</div>
                <div className="text-sm text-cream/70 mt-2">ربط السماء بلحظتك الحياتية</div>
                <div className="text-xs text-coral font-medium mt-3">استكشف الدروس ←</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Evening reflection — square full-bleed */}
        <Link href="/evening" className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-[20px]" style={{ background: '#0F1228' }}>
            <img src="/media/moon-flames.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.74) 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="text-[11px] text-cream/60 font-semibold tracking-wider">قبل النوم</div>
              <div>
                <div className="font-serif text-2xl text-cream leading-snug">المراجعة المسائية</div>
                <div className="text-sm text-cream/70 mt-2">ثلاث لحظات من يومك</div>
                <div className="text-xs text-coral font-medium mt-3">ابدأ المراجعة ←</div>
              </div>
            </div>
          </div>
        </Link>
        {/* Zodiac signs — learn section */}
        <div className="md:col-span-2 mt-2">
          <Rule />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div>
            <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-0.5">تعلّم</div>
            <h2 className="font-serif text-2xl text-ink -tracking-0.5">الأبراج والبيوت</h2>
            <p className="text-sm text-ink-muted mt-1">الاثنا عشر برجًا — صفاتها وعناصرها.</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.slug} href={`/self/sign/${sign.slug}`} className="block">
                <div className="rounded-[16px] p-3 flex flex-col items-center gap-2 bg-white border border-rule-soft text-center" style={{ minHeight: 88 }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: sign.elementColor + '22' }}>
                    <div className="w-5 h-5" style={{
                      WebkitMaskImage: `url('/svg/${sign.svgKey}.svg')`,
                      maskImage: `url('/svg/${sign.svgKey}.svg')`,
                      WebkitMaskSize: 'contain', maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center', maskPosition: 'center',
                      background: sign.elementColor,
                    }} />
                  </div>
                  <div>
                    <div className="font-serif text-[13px] text-ink leading-tight">{sign.nameAr}</div>
                    <div className="text-[10px] text-ink-muted mt-0.5">{sign.elementAr}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
