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
  const [exploreView, setExploreView] = useState<'sky' | 'calendar' | 'knowledge'>('sky');
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
        {/* ── Explore: Sky / Calendar / Knowledge ── */}
        <div id="today-sky" className="md:col-span-2">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {([
              ['sky', 'السماء'],
              ['calendar', 'التقويم'],
              ['knowledge', 'المعرفة'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setExploreView(key)}
                className={`px-4 py-2 rounded-[14px] text-xs font-medium transition-colors whitespace-nowrap ${
                  exploreView === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {exploreView === 'sky' && <SkySection />}
          {exploreView === 'calendar' && <CalendarSection />}
          {exploreView === 'knowledge' && <KnowledgeSection />}
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

        {/* Knowledge — link to learn section */}
        <Link href="/learn" className="block md:col-span-2">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #F8D6BE 0%, #F0C0A0 100%)' }}>
            <img src="/media/sun-rings.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" style={{ mixBlendMode: 'multiply' }} />
            <div className="relative flex flex-col gap-2">
              <div className="text-[11px] text-coral font-semibold tracking-wider">المعرفة</div>
              <div className="font-serif text-[17px] text-ink leading-[1.6]">الأسس · السلاسل · المعلّمون</div>
              <div className="text-xs text-ink-muted leading-[1.7]">تقاليد الفلك الثلاثة — غربي، عربي، روحاني</div>
            </div>
          </div>
        </Link>

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
      </div>
    </div>
  );
}
