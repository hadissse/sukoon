'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Meta } from '@/components/Meta';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { AstralChart } from '@/lib/chartCalculator';
import { SIGN_SLUGS, getPlacementContent } from '@/content/placements';
import { loadEvents, STREAM_AR, STREAM_GLYPH, type LoggedEvent } from '@/lib/events';
import { calculateTransits, orbLabel, type Transit } from '@/lib/transits';
import { loadTraits } from '@/lib/traitEngine';
import { NatalChartSetupForm } from '@/components/onboarding/NatalChartSetupForm';
import { CalendarMonthView } from '@/app/explore/CalendarMonthView';
import { FrameworkLabel } from '@/components/FrameworkLabel';
import type { HousePosition } from '@/lib/chartCalculator';
import { planetSvgKey } from '@/lib/planetMeta';

const chartSubtabs = [
  { key: 'planets', label: 'الكواكب' },
  { key: 'signs', label: 'الأبراج' },
  { key: 'houses', label: 'البيوت' },
  { key: 'aspects', label: 'الجوانب' },
  { key: 'active', label: 'التأثيرات النشطة' },
] as const;

const ZODIAC_SVG_KEYS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sag', 'cap', 'aqua', 'pisces'];
const ZODIAC_NAMES_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];

function formatPosition(planet: any): string {
  return `${planet.sign} ${planet.degree}°${planet.minute > 0 ? ` ${planet.minute}′` : ''}`;
}

function transformChartToPlanets(chart: AstralChart | null): any[] {
  if (!chart) return [];

  const planetKeys: (keyof AstralChart)[] = ['saturn', 'northNode', 'southNode', 'jupiter', 'mars', 'venus', 'mercury', 'chiron', 'uranus', 'neptune', 'pluto'];

  return planetKeys.map((key) => {
    const planet = chart[key];
    if (typeof planet === 'object' && planet !== null && 'name' in planet) {
      return {
        name: planet.name,
        position: formatPosition(planet),
        key,
        svgKey: planetSvgKey(key as string),
        retrograde: !!(planet as any).retrograde,
      };
    }
    return null;
  }).filter(Boolean);
}

function transformChartToSigns(chart: AstralChart | null): any[] {
  if (!chart) return [];

  const elements = ['نار', 'تراب', 'هواء', 'ماء'];
  const houseNames = ['بيت الطالع', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع — طالع', 'الثامن', 'التاسع', 'العاشر — الشمس', 'الحادي عشر — عناقيد', 'الثاني عشر'];

  return ZODIAC_NAMES_AR.map((name, idx) => ({
    name,
    svgKey: ZODIAC_SVG_KEYS[idx],
    house: houseNames[idx],
    element: elements[idx % 4],
  }));
}

function transformChartToHouses(chart: AstralChart | null): any[] {
  if (!chart || !chart.houses) return [];
  
  const houseThemes = [
    'الذات · الجسد',
    'المورد · الميدان',
    'العقل · القريب',
    'الأصول · الموقد',
    'الإبداع · الشرارة',
    'العمل · اليومي',
    'الآخر · المرآة',
    'الأعماق · المشترك',
  ];
  
  const houseNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن'];
  
  return chart.houses.slice(0, 8).map((house, idx) => ({
    num: houseNumbers[idx],
    theme: houseThemes[idx],
    cusp: `${house.sign} ${house.degree}°`,
  }));
}

function calculateAspects(chart: AstralChart | null): any[] {
  if (!chart) return [];
  
  const aspects = [];
  const planetList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'northNode', 'southNode'];
  
  const aspectTypes = [
    { angle: 0,   name: 'اقتران', symbol: '·', orb: 8, color: '#5C5C7A' },
    { angle: 60,  name: 'سُداس',  symbol: '×', orb: 6, color: '#4A7FB5' },
    { angle: 90,  name: 'تربيع',  symbol: '▫', orb: 8, color: '#C0392B' },
    { angle: 120, name: 'تثليث',  symbol: '△', orb: 8, color: '#27AE60' },
    { angle: 180, name: 'تقابل',  symbol: '—', orb: 8, color: '#C0392B' },
  ];
  
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const p1Key = planetList[i] as keyof AstralChart;
      const p2Key = planetList[j] as keyof AstralChart;
      const p1 = chart[p1Key];
      const p2 = chart[p2Key];
      
      if (typeof p1 === 'object' && p1 !== null && 'longitude' in p1 && 
          typeof p2 === 'object' && p2 !== null && 'longitude' in p2) {
        const diff = Math.abs((p1.longitude - p2.longitude + 180) % 360 - 180);
        
        for (const aspectType of aspectTypes) {
          const orb = Math.abs(diff - aspectType.angle);
          if (orb <= aspectType.orb) {
            aspects.push({
              aspect: `${p1.name} ${aspectType.symbol} ${p2.name}`,
              orb: `${orb.toFixed(0)}°`,
              orbDeg: orb,
              type: aspectType.name,
              color: aspectType.color,
              slug: `${planetList[i]}-${planetList[j]}`,
            });
          }
        }
      }
    }
  }
  
  return aspects.sort((a, b) => a.orbDeg - b.orbDeg);
}

// Three-card voice intro: shows the user's Sun + Rising + Moon
// with one line of meaning pulled from placements.ts. First-impression
// surface for a newcomer who would otherwise face only a wheel of symbols.
function ChartVoiceIntro({ chart }: { chart: AstralChart }) {
  const sunSlug = SIGN_SLUGS[chart.sun.signNumber];
  const moonSlug = SIGN_SLUGS[chart.moon.signNumber];
  const risingSignNumber = Math.floor((chart.asc % 360) / 30);
  const risingSlug = SIGN_SLUGS[risingSignNumber];
  const risingName = ZODIAC_NAMES_AR[risingSignNumber];

  const sunVoice = getPlacementContent('planet', `sun:${sunSlug}`);
  const moonVoice = getPlacementContent('planet', `moon:${moonSlug}`);
  // Rising has no planet entry — fall back to the sign's own essence.
  const risingVoice = getPlacementContent('sign', risingSlug);

  const items: Array<{ label: string; signName: string; svgKey: string; meaning: string | undefined; bg: string; accent: string }> = [
    {
      label: 'شمسك',
      signName: chart.sun.sign,
      svgKey: 'sun',
      meaning: sunVoice?.mean,
      bg: 'linear-gradient(135deg, #F8D6BE 0%, #F0C0A0 100%)',
      accent: '#9A3F30',
    },
    {
      label: 'طالعك',
      signName: risingName,
      svgKey: risingSlug,
      meaning: risingVoice?.mean,
      bg: 'linear-gradient(135deg, #D8DFC8 0%, #B8C4A8 100%)',
      accent: '#475A3F',
    },
    {
      label: 'قمرك',
      signName: chart.moon.sign,
      svgKey: 'moon',
      meaning: moonVoice?.mean,
      bg: 'linear-gradient(135deg, #C2D3E2 0%, #A8C0D6 100%)',
      accent: '#33485F',
    },
  ];

  return (
    <div className="px-5 flex flex-col gap-3">
      {items.map((it) => (
        <Link
          key={it.label}
          href={it.svgKey === 'sun' || it.svgKey === 'moon' ? `/self/planet/${it.svgKey}` : `/self/sign/${it.svgKey}`}
          className="block"
        >
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: it.bg }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white/60 flex items-center justify-center">
                <div
                  className="w-7 h-7"
                  style={{
                    WebkitMaskImage: `url('/svg/${it.svgKey}.svg')`,
                    maskImage: `url('/svg/${it.svgKey}.svg')`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    background: it.accent,
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: it.accent }}>
                  {it.label} · {it.signName}
                </div>
                <div className="font-serif text-[15px] text-ink leading-[1.55]">
                  {it.meaning ?? 'سيظهر هنا صوت هذا المسار قريبًا.'}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}


function ChartShareButton({ chart }: { chart: AstralChart }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const ZODIAC_AR = ['الحمل','الثور','الجوزاء','السرطان','الأسد','السنبلة','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
    const ascSign = ZODIAC_AR[Math.floor((chart.asc % 360) / 30)];
    const text = [
      `خريطتي الفلكية — سُكون`,
      `الشمس: ${chart.sun.sign} ${chart.sun.degree}°`,
      `القمر: ${chart.moon.sign} ${chart.moon.degree}°`,
      `الطالع: ${ascSign} ${Math.floor(chart.asc % 30)}°`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'خريطتي الفلكية', text });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={share} className="text-xs text-ink-muted hover:text-ink transition-colors">
      {copied ? 'تمّ النسخ ✓' : 'مشاركة الخريطة ←'}
    </button>
  );
}

function ChartView({ chart }: { chart: AstralChart | null }) {
  const [activeSubtab, setActiveSubtab] = useState<string>('planets');
  const [transits, setTransits] = useState<Transit[]>([]);
  const [aspectFilter, setAspectFilter] = useState<string>('الكل');
  const traits = loadTraits();

  const ELEMENT_COLORS: Record<string, string> = {
    fire: '#E9785E', earth: '#BDAA82', air: '#C2D3E2', water: '#7E97B8',
  };
  const ELEMENT_AR: Record<string, string> = {
    fire: 'نار', earth: 'تراب', air: 'هواء', water: 'ماء',
  };

  const planets = transformChartToPlanets(chart);
  const signs = transformChartToSigns(chart);
  const houses = chart ? transformChartToHouses(chart) : [];
  const aspects = calculateAspects(chart);

  useEffect(() => {
    if (chart) setTransits(calculateTransits(chart).slice(0, 8));
  }, [chart]);

  if (!chart) {
    return (
      <div className="px-5 py-12 text-center">
        <Body muted>حمّل خريطتك أولاً من خلال الإدراج</Body>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-tabs + fixed stars link */}
      <div className="px-5 pt-6 flex items-center justify-between">
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {chartSubtabs.map((tab) => (
              <Chip
                key={tab.key}
                active={activeSubtab === tab.key}
                onClick={() => setActiveSubtab(tab.key)}
              >
                {tab.label}
              </Chip>
            ))}
          </div>
        </div>
        <Link href="/self/fixed-stars" className="text-xs text-ink-muted hover:text-ink transition-colors shrink-0 mr-2">
          النجوم الثابتة ←
        </Link>
      </div>

      {/* Chart wheel */}
      {activeSubtab === 'planets' && (
        <>
          <div className="flex justify-center px-2 pt-2">
            <ZoomableWheel size={377} tone="paper" chart={chart} />
          </div>
          <ChartVoiceIntro chart={chart} />
        </>
      )}

      {/* Planets list */}
      {activeSubtab === 'planets' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {planets.map((planet) => (
            <Link key={planet.key} href={`/self/planet/${planet.key}`} className="block" onClick={() => sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY))}>
              <Card>
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 flex-shrink-0 rounded-full bg-cream-soft flex items-center justify-center">
                    <div
                      className="w-6 h-6"
                      style={{
                        WebkitMaskImage: `url('/svg/${planet.svgKey}.svg')`,
                        maskImage: `url('/svg/${planet.svgKey}.svg')`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        background: '#E9785E',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base text-ink">{planet.name}</span>
                      {planet.retrograde && (
                        <span className="text-[10px] font-semibold text-coral border border-coral/40 rounded px-1 py-0.5 leading-none">Rx</span>
                      )}
                    </div>
                    <div className="text-sm text-ink-muted mt-1">{planet.position}</div>
                  </div>
                  <div className="text-lg text-ink-muted">›</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Signs list */}
      {activeSubtab === 'signs' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {signs.map((sign, idx) => (
            <Link key={sign.name} href={`/self/sign/${SIGN_SLUGS[idx]}`} className="block" onClick={() => sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY))}>
              <Card>
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-full bg-cream-soft flex items-center justify-center shrink-0">
                    <div
                      className="w-6 h-6"
                      style={{
                        WebkitMaskImage: `url('/svg/${sign.svgKey}.svg')`,
                        maskImage: `url('/svg/${sign.svgKey}.svg')`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        background: '#5C5C7A',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-serif text-base text-ink">{sign.name}</div>
                    <div className="text-xs text-ink-muted mt-1">{sign.house} · {sign.element}</div>
                  </div>
                  <div className="text-lg text-ink-muted">›</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Houses list */}
      {activeSubtab === 'houses' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {houses.map((house, idx) => (
            <Link key={house.num} href={`/self/house/${idx + 1}`} className="block" onClick={() => sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY))}>
              <Card>
                <div className="flex gap-3 items-start">
                  <div className="font-serif text-lg text-coral w-12">{house.num}</div>
                  <div className="flex-1">
                    <div className="text-sm text-ink">{house.theme}</div>
                  </div>
                  <div className="text-xs text-ink-muted font-mono">{house.cusp}</div>
                </div>
              </Card>
            </Link>
          ))}
          <div className="text-center text-sm text-coral font-medium mt-2">اعرض الاثني عشر ←</div>
        </div>
      )}

      {/* Aspects list */}
      {activeSubtab === 'aspects' && (
        <>
          <div className="px-5 flex gap-2 overflow-x-auto">
            {['الكل', 'رئيسية', 'ثانوية', 'مقتربة'].map((filter) => (
              <button
                key={filter}
                onClick={() => setAspectFilter(filter)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  aspectFilter === filter
                    ? 'bg-ink text-cream'
                    : 'bg-white text-ink border border-rule-soft'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="px-5 pb-6 flex flex-col gap-3">
            {(() => {
              const MAJOR = ['اقتران', 'تربيع', 'تثليث', 'تقابل'];
              const filtered = aspects.filter((a) => {
                if (aspectFilter === 'رئيسية') return MAJOR.includes(a.type);
                if (aspectFilter === 'ثانوية') return !MAJOR.includes(a.type);
                if (aspectFilter === 'مقتربة') return a.orbDeg < 2;
                return true;
              });
              return filtered.length > 0 ? (
                filtered.map((aspect) => (
                  <Link
                    key={aspect.aspect}
                    href={`/self/aspect/${aspect.slug}`}
                    className="block"
                    onClick={() => sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY))}
                  >
                    <Card>
                      <div className="flex justify-between gap-3 mb-2">
                        <div className="font-serif text-base text-ink">{aspect.aspect}</div>
                        <div className="text-xs text-ink-muted font-mono">{aspect.orb}</div>
                      </div>
                      <div className="text-sm font-medium" style={{ color: aspect.color }}>{aspect.type}</div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-ink-muted text-sm">لا توجد جوانب في هذا التصفية</div>
              );
            })()}
          </div>
        </>
      )}

      {/* Active Transits list */}
      {activeSubtab === 'active' && (
        <>
          <div className="px-5 text-xs text-ink-muted">
            ما يلامس خريطتك الآن، مرتّبًا بالقرب.
          </div>
          <div className="px-5 pb-6 flex flex-col gap-2.5">
            {transits.length === 0 ? (
              <Card>
                <div className="text-sm text-ink-muted">لا توجد عبورات نشطة ضمن المدى الآن.</div>
              </Card>
            ) : (
              transits.map((t) => (
                <Link key={t.id} href={`/self/aspect/${t.transitKey}-${t.natalKey}`} className="block" onClick={() => sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY))}>
                  <Card>
                    <div className="flex justify-between items-baseline gap-2 mb-1.5">
                      <div className="font-serif text-base text-ink">
                        {t.transitName} · {t.natalName}
                      </div>
                      <div className="text-xs text-ink-muted font-mono">{orbLabel(t.orb)}</div>
                    </div>
                    <div className="text-sm font-medium" style={{ color: t.aspectColor }}>{t.aspectName}</div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </>
      )}

      {/* Share link */}
      <div className="px-5 pb-6 flex justify-end">
        <ChartShareButton chart={chart} />
      </div>
    </div>
  );
}

const organs = [
  { name: 'القلب · الشمس', status: 'مفتوح ومُضخِّم', color: '#FFC78A' },
  { name: 'الدماغ · القمر', status: 'انعكاسٌ هادئ', color: '#C2D3E2' },
  { name: 'الرئتان · عطارد', status: 'يقظ ومتسائل', color: '#C9D2BE' },
  { name: 'الكليتان · الزهرة', status: 'تليّن اليوم', color: '#F8D6BE' },
  { name: 'المرارة · المريخ', status: 'حدّةٌ تحتاج اتجاهًا', color: '#E9785E' },
  { name: 'الكبد · المشتري', status: 'سعةٌ تطلب حدًّا', color: '#9C8AB8' },
  { name: 'الطحال · زحل', status: 'تأمّلٌ بطيء', color: '#5A3E7A' },
];

const elements = [
  { name: 'نار', planets: 'الشمس · المريخ · المشتري', theme: 'حرارةٌ تتقدّم', color: '#E9785E', pct: 42 },
  { name: 'هواء', planets: 'عطارد · الزهرة · زحل', theme: 'فكرٌ يتحرّك', color: '#C2D3E2', pct: 28 },
  { name: 'ماء', planets: 'القمر · نبتون · بلوتو', theme: 'شعورٌ يتلقّى', color: '#7E97B8', pct: 18 },
  { name: 'تراب', planets: 'أورانوس', theme: 'بنيةٌ تستقرّ', color: '#BDAA82', pct: 12 },
];

const ELEMENT_LABELS: Record<string, { ar: string; color: string; desc: string }> = {
  fire:  { ar: 'نار',   color: '#E9785E', desc: 'حيويّة وإرادة وحضور' },
  earth: { ar: 'تراب',  color: '#BDAA82', desc: 'ثبات وعمل وتجسيد' },
  air:   { ar: 'هواء',  color: '#C2D3E2', desc: 'فكر وتواصل وتنقّل' },
  water: { ar: 'ماء',   color: '#7E97B8', desc: 'حساسية وحدس ومشاعر' },
};

function BodyView() {
  const [activeBodyTab, setActiveBodyTab] = useState<string>('summary');
  const traits = loadTraits();

  const noTraits = !traits;

  const dominant = traits?.elements?.dominant;
  const domLabel = dominant ? ELEMENT_LABELS[dominant] : null;

  const definedCentres = traits?.hdCentres?.filter((c) => c.defined) ?? [];
  const openCentres = traits?.hdCentres?.filter((c) => !c.defined) ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-tabs */}
      <div className="px-5 pt-6 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {[['summary', 'ملخّص'], ['organs', 'الأعضاء'], ['minerals', 'المعادن'], ['hd', 'مراكز HD']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveBodyTab(key)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              activeBodyTab === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {noTraits && (
        <div className="px-5 pb-6 py-12 text-center">
          <Body muted>لم يُحسب ملفّ السمات بعد.</Body>
        </div>
      )}

      {/* Personal summary */}
      {!noTraits && activeBodyTab === 'summary' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {/* Element summary */}
          {domLabel && (
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: domLabel.color + '44', border: `2px solid ${domLabel.color}` }} />
                <div className="flex-1">
                  <div className="font-serif text-base text-ink">طبيعتك السائدة: {domLabel.ar}</div>
                  <div className="text-sm text-ink-muted mt-1">{domLabel.desc}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                {(['fire', 'earth', 'air', 'water'] as const).map((el) => {
                  const pct = Math.round((traits.elements[el] ?? 0) * 100);
                  return (
                    <div key={el} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-rule-soft">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ELEMENT_LABELS[el].color }} />
                      </div>
                      <div className="text-[10px] text-ink-muted">{ELEMENT_LABELS[el].ar}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Top mineral (sun) */}
          {traits.minerals?.slice(0, 1).map((m) => (
            <Card key={m.planet}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: m.color + '33' }}>
                  <div className="w-6 h-6" style={{ WebkitMaskImage: `url('/svg/sun.svg')`, maskImage: `url('/svg/sun.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: m.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-base text-ink">معدن شمسك: {m.mineral}</div>
                  <div className="text-sm text-ink-muted mt-0.5">الجوهر الذي يعكس ضوءك</div>
                </div>
              </div>
            </Card>
          ))}

          {/* HD centres summary */}
          {traits.hdCentres?.length > 0 && (
            <Card>
              <div className="font-serif text-base text-ink mb-2">مراكز HD</div>
              <div className="text-sm text-ink-muted mb-3">
                {definedCentres.length} محدَّد · {openCentres.length} مفتوح
              </div>
              <div className="flex flex-wrap gap-1.5">
                {traits.hdCentres.map((c) => (
                  <span key={c.name} className={`px-2.5 py-1 rounded-full text-xs ${c.defined ? 'bg-ink text-cream' : 'bg-cream-soft text-ink-muted'}`}>
                    {c.name.replace('مركز ', '')}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <Link href="/traits" className="text-xs text-coral font-medium text-center mt-1">
            ملفّ السمات الكامل ←
          </Link>
        </div>
      )}

      {/* Organs view */}
      {!noTraits && activeBodyTab === 'organs' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div className="text-xs text-ink-muted">الكوكب وعضوه في جسدك:</div>
          <FrameworkLabel label="قراءة هرمسية تقليدية" />
          {traits.organs.map((item) => (
            <Card key={item.organ}>
              <div className="flex gap-4 items-center">
                <div className="w-11 h-11 flex-shrink-0 rounded-full bg-cream-soft flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-ink/15" />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-base text-ink">{item.planet} · {item.organ}</div>
                  <div className="text-sm text-ink-muted mt-1">{item.theme}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Planets & Minerals view */}
      {!noTraits && activeBodyTab === 'minerals' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div className="text-xs text-ink-muted">معدن كل كوكب في التقليد الهرمسي:</div>
          <FrameworkLabel label="قراءة هرمسية تقليدية" />
          {traits.minerals.map((m) => (
            <Card key={m.planet}>
              <div className="flex gap-4 items-center">
                <div className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: m.color + '33' }}>
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: m.color + '66' }} />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-base text-ink">{m.planet}</div>
                  <div className="text-sm text-ink-muted mt-1">{m.mineral}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* HD Centers view */}
      {!noTraits && activeBodyTab === 'hd' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div className="text-xs text-ink-muted">
            المراكز المحدَّدة ثابتة فيك · المفتوحة تستقبل من الآخرين:
          </div>
          <FrameworkLabel label="قراءة تصميم إنساني (Human Design)" />
          {traits.hdCentres.map((c) => (
            <Card key={c.name}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-serif text-base text-ink">{c.name}</div>
                  <div className="text-xs text-ink-muted mt-1">{c.keywords}</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${c.defined ? 'bg-ink text-cream' : 'bg-cream-soft text-ink-muted'}`}>
                  {c.defined ? 'محدَّد' : 'مفتوح'}
                </div>
              </div>
            </Card>
          ))}
          <Link href="/traits" className="text-xs text-coral font-medium text-center mt-1">
            ملفّ السمات الكامل ←
          </Link>
        </div>
      )}
    </div>
  );
}

const LIFE_ARC_PHASES = [
  { start: 0, end: 7, name: 'الطفولة الأولى', planet: 'القمر', planetKey: 'moon', desc: 'المرحلة الأولى من الوجود. بناء الجسد وتأسيس العالم الحسّي. القمر يحكم قوى النمو والتكيّف.' },
  { start: 7, end: 14, name: 'الطفولة الثانية', planet: 'عطارد', planetKey: 'mercury', desc: 'النمو الذهني والاجتماعي. اكتساب اللغة والمنطق وأدوات التفكير.' },
  { start: 14, end: 21, name: 'المراهقة', planet: 'الزهرة', planetKey: 'venus', desc: 'الصحوة العاطفية. البحث عن الهوية والجمال والعلاقة بالآخر.' },
  { start: 21, end: 28, name: 'بناء الذات', planet: 'الشمس', planetKey: 'sun', desc: 'بناء هوية مستقلة. الانطلاق نحو العالم بإرادة واعية.' },
  { start: 28, end: 35, name: 'مرحلة المريخ', planet: 'المريخ', planetKey: 'mars', desc: 'قوة الإرادة والصراع. اختبار ما بُني في المرحلة السابقة. الأهداف تُصطدم بالواقع.' },
  { start: 35, end: 42, name: 'مرحلة المشتري', planet: 'المشتري', planetKey: 'jupiter', desc: 'منتصف الحياة. التوسّع أو الانكماش. القدرات النفسية تبلغ ذروتها. عند ~٤٢ تحدث مقابلة أورانوس — لحظة اليقظة التي تسأل: «هل عشت حياتي أم حياة غيري؟»\n\nفي نظام هوبر، النقطة المنخفضة حول سن ٣٦ هي لحظة المراجعة الصامتة — حيث يعيد الإنسان تقييم كل ما بناه.' },
  { start: 42, end: 49, name: 'مرحلة زحل', planet: 'زحل', planetKey: 'saturn', desc: 'العودة إلى الجوهر. الحصاد والتعديل الصعب. ما لا يصمد يتساقط.' },
  { start: 49, end: 56, name: 'مرحلة أورانوس', planet: 'أورانوس', planetKey: 'uranus', desc: 'التحرر من القوالب. ما لم يُقَل يطفو إلى السطح. ثورة داخلية هادئة.' },
  { start: 56, end: 63, name: 'مرحلة نبتون', planet: 'نبتون', planetKey: 'neptune', desc: 'الذوبان والتسامح. البحث عن المعنى الروحي. الحدود بين الأنا والعالم ترقّ.' },
  { start: 63, end: 70, name: 'مرحلة بلوتو', planet: 'بلوتو', planetKey: 'pluto', desc: 'التحول الأخير. مواجهة الموروث والزائل. ما يتبقّى هو الجوهر.' },
];

function toArabicNumStr(n: number): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

function LifeArcView({ chart }: { chart: AstralChart | null }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sukoon.birth-data');
      if (raw) setBirthYear(JSON.parse(raw).year ?? null);
    } catch {}
  }, []);

  const currentAge = birthYear ? new Date().getFullYear() - birthYear : null;

  const currentPhaseIdx = currentAge !== null
    ? LIFE_ARC_PHASES.findIndex(p => currentAge >= p.start && currentAge < p.end)
    : -1;

  const currentPhase = currentPhaseIdx >= 0 ? LIFE_ARC_PHASES[currentPhaseIdx] : null;

  const phaseProgress = currentPhase && currentAge !== null
    ? (currentAge - currentPhase.start) / (currentPhase.end - currentPhase.start)
    : null;

  const midPhaseAge = currentPhase ? (currentPhase.start + currentPhase.end) / 2 : null;

  return (
    <div className="px-5 pb-8 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-coral text-xs font-semibold tracking-wider">✦</span>
          <span className="text-[11px] text-ink-muted font-semibold tracking-wider">السيرة البانورامية</span>
        </div>
        <p className="text-xs text-ink-muted leading-[1.6] mt-1">المراحل السبعينية في حياتك حسب التقليد الأنثروبوصوفي.</p>
      </div>

      <FrameworkLabel label="قراءة العلم الروحاني" />

      {/* Current age + phase summary */}
      {currentAge !== null && currentPhase && phaseProgress !== null ? (
        <div className="bg-white rounded-[18px] p-4 border border-rule-soft">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-0.5">العمر</div>
              <div className="font-serif text-3xl text-ink">{toArabicNumStr(currentAge)} <span className="text-base text-ink-muted font-sans">سنة</span></div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-0.5">المرحلة</div>
              <div className="font-serif text-xl text-coral">{currentPhase.planet}</div>
            </div>
          </div>
          {/* Phase progress bar */}
          <div className="relative h-6 flex items-center mb-1">
            <div className="absolute inset-x-0 h-1 rounded-full bg-cream-soft" />
            <div className="absolute h-1 rounded-full bg-coral" style={{ width: `${phaseProgress * 100}%` }} />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-coral border-2 border-white shadow-sm" style={{ left: `calc(${phaseProgress * 100}% - 5px)` }} />
            <div className="absolute left-0 top-5 text-[10px] text-ink-muted font-mono">{toArabicNumStr(currentPhase.start)}</div>
            <div className="absolute right-0 top-5 text-[10px] text-ink-muted font-mono">{toArabicNumStr(currentPhase.end)}</div>
          </div>
          <div className="mt-5 text-[11px] text-ink-muted text-center">
            منتصف المرحلة · سن ~{toArabicNumStr(Math.round(midPhaseAge!))}
          </div>
        </div>
      ) : (
        <div className="bg-cream-soft rounded-[14px] p-4 text-sm text-ink-muted text-center">
          أدخل بيانات ميلادك لحساب مرحلتك.
        </div>
      )}

      {/* Phases list */}
      <div className="font-serif text-base text-ink mb-1">المراحل السبعينية</div>
      <div className="flex flex-col gap-2">
        {LIFE_ARC_PHASES.map((phase, i) => {
          const status = currentAge === null ? 'unknown'
            : currentAge >= phase.end ? 'past'
            : i === currentPhaseIdx ? 'current'
            : 'future';
          const isExpanded = expanded === i || status === 'current';

          return (
            <button
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`w-full text-right rounded-[14px] p-3.5 border transition-all ${
                status === 'current'
                  ? 'bg-white border-coral/40 shadow-sm'
                  : status === 'past'
                  ? 'bg-white border-rule-soft opacity-50'
                  : 'bg-white border-rule-soft'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: status === 'current' ? '#FFF0EC' : '#F5F2EC' }}
                  >
                    <div
                      className="w-3.5 h-3.5"
                      style={{
                        WebkitMaskImage: `url('/svg/${phase.planetKey}.svg')`,
                        maskImage: `url('/svg/${phase.planetKey}.svg')`,
                        WebkitMaskSize: 'contain', maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center', maskPosition: 'center',
                        background: status === 'current' ? '#E9785E' : '#9A9482',
                      }}
                    />
                  </div>
                  <div>
                    <div className={`font-serif text-sm ${status === 'current' ? 'text-ink' : 'text-ink'}`}>{phase.name}</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">{toArabicNumStr(phase.start)}–{toArabicNumStr(phase.end)} · {phase.planet}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {status === 'current' && currentAge !== null && (
                    <div className="text-[11px] font-mono text-coral font-semibold">{toArabicNumStr(currentAge)}</div>
                  )}
                  <div className={`text-[11px] font-semibold ${
                    status === 'current' ? 'text-coral' : status === 'past' ? 'text-ink-muted' : 'text-ink-muted'
                  }`}>
                    {status === 'current' ? 'أنت هنا' : status === 'past' ? 'مضى' : status === 'future' ? 'التالي' : '‹'}
                  </div>
                  <span className="text-ink-muted text-xs">‹</span>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-rule-soft text-right">
                  {status === 'current' && (
                    <div className="text-[11px] text-coral font-semibold mb-1.5">أنت في هذه المرحلة الآن</div>
                  )}
                  <p className="text-[13px] text-ink leading-[1.8] whitespace-pre-line">{phase.desc}</p>
                  {status === 'current' && (
                    <Link href="/explore/biography" className="inline-flex items-center gap-1 mt-2.5 text-xs text-coral font-medium" onClick={e => e.stopPropagation()}>
                      عرض التفاصيل ←
                    </Link>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-ink-muted pt-2 pb-1">
        ٧٠ سنة · ١٠ مراحل · سَكنٌ كوكبيّ لكل فصل
      </div>
    </div>
  );
}

const grandTransits = [
  { name: 'عودة المشتري الأولى', age: 'حوالي عمر ١٢', status: 'past' },
  { name: 'تقابل زحل', age: 'حوالي عمر ١٤٫٥', status: 'past' },
  { name: 'عودة زحل الأولى', age: 'حوالي عمر ٢٩٫٥', status: 'current' },
  { name: 'تقابل أورانوس', age: 'حوالي عمر ٤٢', status: 'next' },
  { name: 'عودة زحل الثانية', age: 'حوالي عمر ٥٩', status: 'later' },
];

function TransitsView() {
  return (
    <div className="px-5 pb-6 flex flex-col gap-4">
      <div className="font-serif text-2xl text-ink -tracking-0.5">العبورات</div>
      <div className="text-sm text-ink-muted">مسار الكواكب · شهريًا</div>
      <div style={{ background: '#F8F5EF', borderRadius: 18, padding: '14px 12px' }}>
        <CalendarMonthView />
      </div>
      <div className="mt-2">
        <div className="font-serif text-lg text-ink mb-1">العبورات الكبرى</div>
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
                <span className={`text-xs font-semibold whitespace-nowrap ${transit.status === 'current' ? 'text-coral' : 'text-ink-muted'}`}>
                  {transit.status === 'current' ? 'الآن' : transit.status === 'next' ? 'القادم' : transit.status === 'past' ? 'مضى' : 'لاحقًا'}
                </span>
              </div>
              <div className="text-xs text-ink-muted">{transit.age}</div>
            </div>
          ))}
        </div>
        <Link href="/explore/great-transits" className="mt-3 flex items-center justify-between p-3.5 rounded-[14px] bg-cream-soft border border-rule-soft">
          <span className="text-sm font-serif text-ink">العبورات الكبرى</span>
          <span className="text-coral text-sm">←</span>
        </Link>
      </div>
    </div>
  );
}


function SavedView() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  if (events.length === 0) {
    return (
      <div className="px-5 py-12 text-center flex flex-col gap-3">
        <Body muted>لم تسجّل أحداثًا بعد.</Body>
        <Link href="/log" className="text-coral text-sm font-medium">سجّل لحظتك الأولى ←</Link>
      </div>
    );
  }

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long' }).format(new Date(iso));

  return (
    <div className="px-5 pb-6 flex flex-col gap-3">
      {events.map((event) => (
        <Link key={event.id} href={`/event/${event.id}`} className="block">
          <Card>
            <div className="flex justify-between items-start mb-2 gap-3">
              <div className="font-serif text-base text-ink">{event.text}</div>
              <div className="text-xs text-coral font-medium whitespace-nowrap">{fmt(event.date)}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-3 items-center">
              {event.stream && (
                <div className="bg-cream-soft rounded-full px-2.5 py-1 text-xs text-ink-muted">
                  {STREAM_GLYPH[event.stream]} {STREAM_AR[event.stream]}
                </div>
              )}
              {event.placement && (
                <div className="bg-cream-soft rounded-full px-2.5 py-1 text-xs text-ink-muted">
                  {event.placement.label}
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// First-run walkthrough: three personalized screens pulled from the user's
// actual chart + placements.ts. Replaces the old generic "this is a natal
// chart" intro with something that names *this* person — Sun, Rising, Moon.
interface IntroStep {
  label: string;     // small kicker — "شمسك"
  signName: string;  // Arabic sign name
  svgKey: string;    // which SVG glyph to render
  title: string;     // "هذا مسار شمسك"
  body: string;      // one-line meaning from placements.ts
  accent: string;
}

function buildIntroSteps(chart: AstralChart): IntroStep[] {
  const sunSlug = SIGN_SLUGS[chart.sun.signNumber];
  const moonSlug = SIGN_SLUGS[chart.moon.signNumber];
  const risingSignNumber = Math.floor((chart.asc % 360) / 30);
  const risingSlug = SIGN_SLUGS[risingSignNumber];

  const sunVoice = getPlacementContent('planet', `sun:${sunSlug}`);
  const moonVoice = getPlacementContent('planet', `moon:${moonSlug}`);
  const risingVoice = getPlacementContent('sign', risingSlug);

  return [
    {
      label: 'شمسك',
      signName: chart.sun.sign,
      svgKey: 'sun',
      title: 'هذا مسار شمسك',
      body: sunVoice?.mean ?? 'ضوءُك يتشكّل بطريقتك الخاصّة.',
      accent: '#E9785E',
    },
    {
      label: 'طالعك',
      signName: ZODIAC_NAMES_AR[risingSignNumber],
      svgKey: risingSlug,
      title: 'هذا طالعك',
      body: risingVoice?.mean ?? 'هذه الواجهة التي يلمسها العالم فيك أولًا.',
      accent: '#8FA084',
    },
    {
      label: 'قمرك',
      signName: chart.moon.sign,
      svgKey: 'moon',
      title: 'هذا قمرك',
      body: moonVoice?.mean ?? 'ما يتحرّك تحت سطحك يأتي بإيقاعه الخاصّ.',
      accent: '#7E97B8',
    },
  ];
}

function ChartIntroOverlay({ chart, onDone }: { chart: AstralChart; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = buildIntroSteps(chart);
  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(15,18,40,0.72)', backdropFilter: 'blur(2px)' }}>
      <div
        className="bg-cream max-w-[430px] mx-auto w-full rounded-t-[28px] px-6 pt-6 pb-10"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{ width: i === step ? 24 : 6, background: i <= step ? current.accent : '#E8E2D2' }}
            />
          ))}
        </div>

        <div className="flex justify-center mb-3">
        </div>

        {/* Sign glyph in a circle */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: current.accent + '22' }}
          >
            <div
              className="w-11 h-11"
              style={{
                WebkitMaskImage: `url('/svg/${current.svgKey}.svg')`,
                maskImage: `url('/svg/${current.svgKey}.svg')`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                background: current.accent,
              }}
            />
          </div>
        </div>

        <div className="text-center text-[11px] font-semibold tracking-wider mb-1.5" style={{ color: current.accent }}>
          {current.label} · {current.signName}
        </div>
        <div className="font-serif text-2xl text-ink text-center mb-3 leading-snug">{current.title}</div>
        <div className="font-serif text-[15px] text-ink-muted leading-[1.8] text-center">{current.body}</div>

        <button
          onClick={next}
          className="mt-7 w-full h-[50px] rounded-[25px] bg-ink text-cream text-base font-medium"
        >
          {step < steps.length - 1 ? 'تابع' : 'ادخل خريطتك'}
        </button>
        <button onClick={onDone} className="mt-3 w-full text-center text-sm text-ink-muted py-2">
          تخطّى
        </button>
      </div>
    </div>
  );
}

function SelfPageInner() {
  const searchParams = useSearchParams();
  const [mainTab, setMainTab] = useState<string>(searchParams.get('tab') ?? 'chart');
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setChart(parsed);
        if (!localStorage.getItem('sukoon.chart-guide-seen')) {
          setShowGuide(true);
        }
      } catch (e) {
        console.error('Failed to parse chart from localStorage:', e);
      }
    }
    const savedY = sessionStorage.getItem('sukoon.self.scrollY');
    if (savedY) {
      sessionStorage.removeItem('sukoon.self.scrollY');
      requestAnimationFrame(() => window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' }));
    }
  }, []);

  const dismissGuide = () => {
    localStorage.setItem('sukoon.chart-guide-seen', '1');
    setShowGuide(false);
  };

  return (
    <div className="pb-32">
      {showGuide && chart && <ChartIntroOverlay chart={chart} onDone={dismissGuide} />}
      <div className="pt-6">
        {/* Main tabs — fixed bottom bar */}
        <div
          className="fixed bottom-20 left-0 right-0 flex gap-2 justify-center px-5 py-3 overflow-x-auto"
          style={{ scrollbarWidth: 'none', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'transparent' }}
        >
          {[
            { key: 'chart', label: 'الخريطة' },
            { key: 'body', label: 'الجسد' },
            { key: 'transits', label: 'العبورات' },
            { key: 'arc', label: 'القوس' },
            { key: 'saved', label: 'ما حفظت' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`px-4 py-2 rounded-[14px] text-xs font-medium transition-colors whitespace-nowrap ${
                mainTab === tab.key
                  ? 'bg-ink text-cream'
                  : 'bg-white text-ink border border-rule-soft'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily tracking entry — below tabs */}
        <div className="px-5 mb-4">
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

        {mainTab === 'chart' && (
          <>
            {!chart ? (
              <NatalChartSetupForm onComplete={(newChart) => setChart(newChart)} />
            ) : (
              <>
                {/* Journey 1 entry */}
                <div className="px-5 mb-4">
                  <Link href="/journey-1" className="block">
                    <div className="flex items-center justify-between py-3 px-4 rounded-[18px] bg-ink text-cream">
                      <div>
                        <div className="font-serif text-base">الرحلة الأسبوعية</div>
                        <div className="text-xs text-cream/60 mt-0.5">معالجة شخصية · خطوة في اليوم</div>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
                <ChartView chart={chart} />
              </>
            )}
          </>
        )}

        {mainTab === 'body' && (
          <>
            <div className="px-5 mb-4">
              <Headline>الجسد</Headline>
            </div>
            {/* Traits entry */}
            <div className="px-5 mb-4">
              <Link href="/traits" className="block">
                <div className="flex items-center justify-between py-3 px-4 rounded-[18px] border border-rule-soft bg-cream-soft">
                  <div>
                    <div className="font-serif text-base text-ink">ملفّ السمات</div>
                    <div className="text-xs text-ink-muted mt-0.5">العناصر · المعادن · مراكز HD</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
            <BodyView />
          </>
        )}

        {mainTab === 'transits' && (
          <>
            <div className="px-5 mb-4">
              <Headline>العبورات</Headline>
            </div>
            <TransitsView />
          </>
        )}

        {mainTab === 'arc' && (
          <LifeArcView chart={chart} />
        )}

        {mainTab === 'saved' && (
          <>
            <div className="px-5 mb-6">
              <Headline>ما حفظت</Headline>
            </div>
            <SavedView />
          </>
        )}

      </div>
    </div>
  );
}

export default function SelfPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-cream" />}>
      <SelfPageInner />
    </Suspense>
  );
}
