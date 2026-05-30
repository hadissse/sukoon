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
import { calculateTransits, orbLabel, formatExactDate, type Transit } from '@/lib/transits';
import { loadTraits } from '@/lib/traitEngine';
import { NatalChartSetupForm } from '@/components/onboarding/NatalChartSetupForm';
import { CalendarMonthView } from '@/app/explore/CalendarMonthView';
import { TransitHeroCard } from '@/components/TransitHeroCard';
import { FrameworkLabel } from '@/components/FrameworkLabel';
import {
  ELEMENT_MEANING,
  MINERAL_MEANING,
  ORGAN_SIGNAL,
  HD_CENTRE_MEANING,
} from '@/content/traitsMeaning';
import type { HousePosition } from '@/lib/chartCalculator';
import { planetSvgKey } from '@/lib/planetMeta';
import { FIXED_STARS, findStarConjunctions, starLongitudeAtJD, fixedStarSlug, type StarConjunction } from '@/content/fixedStars';
import { PB_TRANSITS, type GreatTransit } from '@/app/explore/biographyData';

const ZODIAC_SIGNS_AR_FS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
function toAr(n: number | string): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

function lonToSignDeg(lon: number): string {
  const n = ((lon % 360) + 360) % 360;
  const sign = Math.floor(n / 30);
  const deg = Math.floor(n % 30);
  return `${ZODIAC_SIGNS_AR_FS[sign]} ⁦${toAr(deg)}°⁩`;
}

const chartSubtabs = [
  { key: 'planets', label: 'الكواكب' },
  { key: 'signs', label: 'الأبراج' },
  { key: 'houses', label: 'البيوت' },
  { key: 'aspects', label: 'الجوانب' },
  { key: 'stars', label: 'النجوم الثابتة' },
] as const;

const ZODIAC_SVG_KEYS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sag', 'cap', 'aqua', 'pisces'];
const ZODIAC_NAMES_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];

function formatPosition(planet: any): string {
  return `${planet.sign} ⁦${toAr(planet.degree)}°⁩`;
}

const PLANET_DISPLAY_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

function transformChartToPlanets(chart: AstralChart | null): any[] {
  if (!chart) return [];

  const planetKeys: (keyof AstralChart)[] = ['saturn', 'northNode', 'southNode', 'jupiter', 'mars', 'venus', 'mercury', 'uranus', 'neptune', 'pluto'];

  return planetKeys.map((key) => {
    const planet = chart[key];
    if (typeof planet === 'object' && planet !== null && 'name' in planet) {
      // North Node always moves retrograde by definition
      const retrograde = key === 'northNode' ? true : !!(planet as any).retrograde;
      return {
        name: PLANET_DISPLAY_AR[key as string] ?? planet.name,
        position: formatPosition(planet),
        key,
        svgKey: planetSvgKey(key as string),
        retrograde,
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
    'الأفق · المعنى',
    'المهنة · الإرث',
    'المجتمع · الأحلام',
    'الخلوة · اللاوعي',
  ];

  const houseNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

  return chart.houses.map((house, idx) => ({
    num: houseNumbers[idx],
    theme: houseThemes[idx],
    cusp: `${house.sign} ⁦${toAr(house.degree)}°⁩`,
  }));
}

function calculateAspects(chart: AstralChart | null): any[] {
  if (!chart) return [];
  
  const aspects = [];
  const planetList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode', 'southNode'];
  
  const aspectTypes = [
    { angle: 0,   name: 'اقتران', symbol: '☌', orb: 8, color: '#5C5C7A' },
    { angle: 60,  name: 'سُداس',  symbol: '⚹', orb: 6, color: '#4A7FB5' },
    { angle: 90,  name: 'تربيع',  symbol: '▫', orb: 8, color: '#C0392B' },
    { angle: 120, name: 'تثليث',  symbol: '△', orb: 8, color: '#27AE60' },
    { angle: 180, name: 'تقابل',  symbol: '☍', orb: 8, color: '#C0392B' },
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
              orb: `${toAr(orb.toFixed(0))}°`,
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



function FixedStarsView({ chart, onNavigate }: { chart: AstralChart | null; onNavigate: () => void }) {
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [conjunctions, setConjunctions] = useState<StarConjunction[]>([]);

  useEffect(() => {
    if (!chart) return;
    const jd = typeof (chart as any).timestamp === 'number' ? (chart as any).timestamp + 2451545.0 : 2451545.0;
    setConjunctions(findStarConjunctions(chart as unknown as Record<string, { longitude: number; name: string }>, jd, 3));
  }, [chart]);

  const activeStarKeys = new Set(conjunctions.map((c) => c.star.nameLatin));
  const visibleStars = filter === 'active' && conjunctions.length > 0
    ? FIXED_STARS.filter((s) => activeStarKeys.has(s.nameLatin))
    : FIXED_STARS;

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
      {/* Filter chips */}
      <div className="flex gap-2 pt-1">
        {([['active', 'في خريطتي'], ['all', 'الكل']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="px-3.5 py-2 rounded-full text-xs font-medium transition-colors"
            style={{
              background: filter === k ? '#171B3A' : '#fff',
              border: filter === k ? 'none' : '1px solid #E8E2D2',
              color: filter === k ? '#fff' : '#171B3A',
            }}
          >
            {label}
            {k === 'active' && conjunctions.length > 0 && (
              <span className="mr-1 opacity-60">({conjunctions.length})</span>
            )}
          </button>
        ))}
      </div>

      {filter === 'active' && conjunctions.length === 0 && !chart && (
        <p className="text-sm text-ink-muted">حمّل خريطتك لتظهر التلاقيات.</p>
      )}
      {filter === 'active' && chart && conjunctions.length === 0 && (
        <p className="text-sm text-ink-muted">لا تلاقيات ضمن الدرجة المعيارية لكل نجم في هذه الخريطة.</p>
      )}

      {visibleStars.map((star) => {
        const conj = conjunctions.filter((c) => c.star.nameLatin === star.nameLatin);
        const isActive = conj.length > 0;
        const jd = chart && typeof (chart as any).timestamp === 'number' ? (chart as any).timestamp + 2451545.0 : 2451545.0;
        const currentLon = starLongitudeAtJD(star, jd);
        const slug = fixedStarSlug(star.nameLatin);

        return (
          <Link
            key={star.nameLatin}
            href={`/self/fixed-stars/${slug}`}
            className="block"
            onClick={onNavigate}
          >
            <div
              className="bg-white rounded-[14px] p-3.5 flex flex-col gap-2"
              style={{ border: isActive ? '1.5px solid #E9785E' : '1px solid #E8E2D2' }}
            >
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-cream-soft flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[15px]" style={{ color: isActive ? '#E9785E' : '#5C5C7A' }}>✦</span>
                </div>
                <div className="flex-1">
                  <div className="font-serif text-base text-ink font-medium">{star.nameAr}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    <span>{star.translitAr}</span>
                    <span className="mx-1 opacity-40">·</span>
                    {star.nameLatin}
                    <span className="mx-1 opacity-40">·</span>
                    {star.bayer}
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="text-xs text-ink font-serif">{lonToSignDeg(currentLon)}</div>
                  <div className="text-[10px] text-ink-muted mt-0.5">قدر {star.mag.toFixed(1)}</div>
                </div>
              </div>
              {conj.length > 0 && (
                <div className="flex flex-col gap-1 pt-1 border-t border-rule-soft">
                  {conj.map((c) => (
                    <div key={c.natalPlanetKey} className="flex justify-between items-center">
                      <span className="text-xs text-coral font-semibold">تلاقي مع {c.natalPlanetName}</span>
                      <span className="text-[11px] text-ink-muted">بُعد {c.orb}°</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}

    </div>
  );
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#E9785E', earth: '#BDAA82', air: '#C2D3E2', water: '#7E97B8',
};
const ELEMENT_AR: Record<string, string> = {
  fire: 'نار', earth: 'تراب', air: 'هواء', water: 'ماء',
};

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function ChartView({ chart }: { chart: AstralChart | null }) {
  const [activeSubtab, setActiveSubtab] = useState<string>('planets');
  const [transits, setTransits] = useState<Transit[]>([]);
  const [aspectFilter, setAspectFilter] = useState<string>('الكل');
  const [birthData, setBirthData] = useState<{ name?: string; year?: number; month?: number; day?: number; hour?: number; minute?: number; timeUnknown?: boolean } | null>(null);

  const [notedTransitKeys, setNotedTransitKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sukoon.birth-data');
      if (raw) setBirthData(JSON.parse(raw));
    } catch { /* localStorage unavailable */ }
  }, []);

  const planets = transformChartToPlanets(chart);
  const signs = transformChartToSigns(chart);
  const houses = chart ? transformChartToHouses(chart) : [];
  const aspects = calculateAspects(chart);

  // Build set of transit keys that have at least one logged note
  useEffect(() => {
    const events = loadEvents();
    const keys = new Set(
      events
        .filter((e) => e.placement?.type === 'aspect' && e.placement.key)
        .map((e) => e.placement!.key)
    );
    setNotedTransitKeys(keys);
  }, []);

  // Restore subtab when navigating back from a detail page
  useEffect(() => {
    const saved = sessionStorage.getItem('sukoon.self.subtab');
    if (saved) {
      sessionStorage.removeItem('sukoon.self.subtab');
      setActiveSubtab(saved);
    }
  }, []);

  // Save scroll + subtab before leaving to a detail page
  const saveNavState = () => {
    sessionStorage.setItem('sukoon.self.scrollY', String(window.scrollY));
    sessionStorage.setItem('sukoon.self.subtab', activeSubtab);
  };

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
      </div>

      {/* Chart wheel + compact planet grid */}
      {activeSubtab === 'planets' && (() => {
        const angleLon = (lon: number) => {
          const norm = ((lon % 360) + 360) % 360;
          return `${ZODIAC_NAMES_AR[Math.floor(norm / 30)]} ⁦${toAr(Math.floor(norm % 30))}°⁩`;
        };
        const angleSign = (lon: number) => ZODIAC_SVG_KEYS[Math.floor(((lon % 360) + 360) % 360 / 30)];
        const risingIdx = Math.floor(((chart.asc % 360) + 360) % 360 / 30);
        const maskStyle = (svgKey: string) => ({
          WebkitMaskImage: `url('/svg/${svgKey}.svg')`,
          maskImage: `url('/svg/${svgKey}.svg')`,
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
          background: '#E9785E',
        });
        const gridItems = [
          { key: 'sun',       name: 'الشمس',        svgKey: 'sun',                      pos: formatPosition(chart.sun),       href: '/self/planet/sun',       rx: false },
          { key: 'moon',      name: 'القمر',         svgKey: 'moon',                     pos: formatPosition(chart.moon),      href: '/self/planet/moon',      rx: false },
          { key: 'mercury',   name: 'عطارد',         svgKey: 'mercury',                  pos: formatPosition(chart.mercury),   href: '/self/planet/mercury',   rx: !!chart.mercury.retrograde },
          { key: 'venus',     name: 'الزهرة',        svgKey: 'venus',                    pos: formatPosition(chart.venus),     href: '/self/planet/venus',     rx: !!chart.venus.retrograde },
          { key: 'mars',      name: 'المريخ',        svgKey: 'mars',                     pos: formatPosition(chart.mars),      href: '/self/planet/mars',      rx: !!chart.mars.retrograde },
          { key: 'jupiter',   name: 'المشتري',       svgKey: 'jupiter',                  pos: formatPosition(chart.jupiter),   href: '/self/planet/jupiter',   rx: !!chart.jupiter.retrograde },
          { key: 'saturn',    name: 'زحل',           svgKey: 'saturn',                   pos: formatPosition(chart.saturn),    href: '/self/planet/saturn',    rx: !!chart.saturn.retrograde },
          { key: 'uranus',    name: 'أورانوس',       svgKey: 'uranus',                   pos: formatPosition(chart.uranus),    href: '/self/planet/uranus',    rx: !!chart.uranus.retrograde },
          { key: 'neptune',   name: 'نبتون',         svgKey: 'neptune',                  pos: formatPosition(chart.neptune),   href: '/self/planet/neptune',   rx: !!chart.neptune.retrograde },
          { key: 'pluto',     name: 'بلوتو',         svgKey: 'pluto',                    pos: formatPosition(chart.pluto),     href: '/self/planet/pluto',     rx: !!chart.pluto.retrograde },
          { key: 'northNode', name: 'شمال القمر',    svgKey: planetSvgKey('northNode'),  pos: formatPosition(chart.northNode), href: '/self/planet/northNode', rx: true },
          { key: 'southNode', name: 'جنوب القمر',    svgKey: planetSvgKey('southNode'),  pos: formatPosition(chart.southNode), href: '/self/planet/southNode', rx: false },
          ...(!birthData?.timeUnknown ? [
            { key: 'ac', name: 'الطالع (AC)',      svgKey: ZODIAC_SVG_KEYS[risingIdx],       pos: angleLon(chart.asc),              href: '/self/house/1',  rx: false },
            { key: 'ic', name: 'القاع (IC)',        svgKey: angleSign(chart.houses[3].cusp),  pos: angleLon(chart.houses[3].cusp),   href: '/self/house/4',  rx: false },
            { key: 'dc', name: 'الغارب (DC)',       svgKey: angleSign(chart.houses[6].cusp),  pos: angleLon(chart.houses[6].cusp),   href: '/self/house/7',  rx: false },
            { key: 'mc', name: 'وسط السماء (MC)',   svgKey: angleSign(chart.mc),              pos: angleLon(chart.mc),               href: '/self/house/10', rx: false },
          ] : []),
        ];
        // Birth info header
        const bd = birthData;
        const dateStr = bd?.year ? `${toAr(bd.day ?? 0)} ${AR_MONTHS[(bd.month ?? 1) - 1]} ${toAr(bd.year)}` : '';
        const timeStr = bd && !bd.timeUnknown && bd.hour !== undefined
          ? `${toAr(String(bd.hour).padStart(2,'0'))}:${toAr(String(bd.minute ?? 0).padStart(2,'0'))}`
          : '';
        return (
          <>
            {/* Birth info */}
            {bd?.name && (
              <div className="px-5 pt-2 pb-1 flex items-center justify-between">
                <div>
                  <div className="font-serif text-lg text-ink">{bd.name}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {dateStr}{timeStr ? ` · ${timeStr}` : ''}
                  </div>
                </div>
                <Link href="/settings/edit-birth" className="text-[11px] text-ink-muted underline underline-offset-2">
                  تعديل
                </Link>
              </div>
            )}
            <div className="w-full pt-2">
              <ZoomableWheel size={9999} tone="paper" chart={chart} showHouses={!birthData?.timeUnknown} />
            </div>
            <div className="px-5 pb-6">
              <div className="text-[11px] font-semibold tracking-wider text-ink-muted mb-3">مواضع الكواكب</div>
              {/* Gradient cards for Sun / Moon / AC — square, colored fill, white text */}
              {/* Planet color map — gradient fills for luminaries+AC, stroke-only for rest */}
              {(() => {
                // Video only for Sun and Moon
                const VIDEO: Record<string, { src: string; overlay: string }> = {
                  sun:  { src: '/media/planet-bg-1.webm', overlay: 'linear-gradient(to top, rgba(160,60,20,0.65) 0%, rgba(100,40,10,0.2) 60%, transparent 100%)' },
                  moon: { src: '/media/planet-bg-2.webm', overlay: 'linear-gradient(to top, rgba(30,60,110,0.65) 0%, rgba(20,40,80,0.2) 60%, transparent 100%)' },
                };
                // Gradient for all non-video planets — one per planet
                const GRAD: Record<string, string> = {
                  ac:        'linear-gradient(140deg, #C8B8E8 0%, #8B6BB0 100%)',
                  mercury:   'linear-gradient(140deg, #B0C8D8 0%, #507090 100%)',
                  venus:     'linear-gradient(140deg, #F0C8D0 0%, #C87090 100%)',
                  mars:      'linear-gradient(140deg, #F0A878 0%, #C04020 100%)',
                  jupiter:   'linear-gradient(140deg, #C9D2BE 0%, #6A8060 100%)',
                  saturn:    'linear-gradient(140deg, #9B9BB0 0%, #5C5C7A 100%)',
                  uranus:    'linear-gradient(140deg, #B8D8D8 0%, #406878 100%)',
                  neptune:   'linear-gradient(140deg, #B0B0D8 0%, #4040A0 100%)',
                  pluto:     'linear-gradient(140deg, #888898 0%, #404050 100%)',
                  northNode: 'linear-gradient(140deg, #F0D890 0%, #B88820 100%)',
                  southNode: 'linear-gradient(140deg, #D0C8A8 0%, #887850 100%)',
                  ic:        'linear-gradient(140deg, #D8C8F0 0%, #9070B8 100%)',
                  dc:        'linear-gradient(140deg, #D0C0E8 0%, #8060A8 100%)',
                  mc:        'linear-gradient(140deg, #C0B0D8 0%, #705098 100%)',
                };

                const iconStyle = (svgKey: string, color: string) => ({
                  WebkitMaskImage: `url('/svg/${svgKey}.svg')`,
                  maskImage: `url('/svg/${svgKey}.svg')`,
                  WebkitMaskSize: 'contain', maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center', maskPosition: 'center',
                  background: color,
                });

                return (
                  // Single unified grid — all cards same size, same gap
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gridItems.map(item => {
                      const vid = VIDEO[item.key];
                      const grad = GRAD[item.key] ?? 'linear-gradient(140deg, #E8E2D8 0%, #C0B8A8 100%)';

                      return (
                        <Link key={item.key} href={item.href} onClick={saveNavState} className="block">
                          <div
                            className="rounded-[18px] aspect-square flex flex-col justify-end p-4 relative overflow-hidden"
                            style={vid ? undefined : { background: grad }}
                          >
                            {/* Video background for Sun and Moon only */}
                            {vid && (
                              <>
                                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                                  <source src={vid.src} type="video/webm" />
                                </video>
                                <div className="absolute inset-0" style={{ background: vid.overlay }} />
                              </>
                            )}
                            {/* Planet icon */}
                            <div
                              className="absolute top-3 left-3 w-7 h-7 opacity-55 z-10"
                              style={iconStyle(item.svgKey, 'rgba(255,255,255,0.85)')}
                            />
                            <div className="relative z-10 font-serif text-[16px] text-white leading-snug drop-shadow-sm">
                              {item.name}{item.rx ? ' ℞' : ''}
                            </div>
                            <div className="relative z-10 text-[11px] text-white/70 mt-0.5 drop-shadow-sm">{item.pos}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </>
        );
      })()}

      {/* Signs list */}
      {activeSubtab === 'signs' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {signs.map((sign, idx) => (
            <Link key={sign.name} href={`/self/sign/${SIGN_SLUGS[idx]}`} className="block" onClick={saveNavState}>
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
            <Link key={house.num} href={`/self/house/${idx + 1}`} className="block" onClick={saveNavState}>
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
        </div>
      )}

      {/* Aspects list */}
      {activeSubtab === 'aspects' && (
        <>
          <div className="px-5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              { label: 'الكل',    color: null },
              { label: 'تربيع',   color: '#C0392B' },
              { label: 'اقتران',  color: '#5C5C7A' },
              { label: 'سُداس',   color: '#4A7FB5' },
              { label: 'تثليث',   color: '#27AE60' },
              { label: 'تقابل',   color: '#C0392B' },
            ].map(({ label, color }) => (
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
          <div className="px-5 pb-6 flex flex-col gap-3 mt-1">
            {(() => {
              const ASPECT_ORDER: Record<string, number> = {
                'تربيع': 1, 'اقتران': 2, 'سُداس': 3, 'تثليث': 4, 'تقابل': 5,
              };
              const filtered = aspects
                .filter((a) => aspectFilter === 'الكل' || a.type === aspectFilter)
                .sort((a, b) => (ASPECT_ORDER[a.type] ?? 99) - (ASPECT_ORDER[b.type] ?? 99));
              return filtered.length > 0 ? (
                filtered.map((aspect) => (
                  <Link
                    key={aspect.aspect}
                    href={`/self/aspect/${aspect.slug}`}
                    className="block"
                    onClick={saveNavState}
                  >
                    <Card>
                      <div className="flex items-center gap-3">
                        {/* Aspect symbol badge */}
                        {(() => {
                          const sym = aspect.aspect.match(/[☌⚹▫△☍]/)?.[0] ?? '·';
                          return (
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[16px] font-serif"
                              style={{ background: `${aspect.color}18`, color: aspect.color, border: `1.5px solid ${aspect.color}40` }}
                            >
                              {sym}
                            </div>
                          );
                        })()}
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-base text-ink">{aspect.aspect}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[12px] font-medium" style={{ color: aspect.color }}>{aspect.type}</span>
                            <span className="text-[11px] text-ink-muted font-mono">{aspect.orb}</span>
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-30 shrink-0 rotate-180">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
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
      {/* Fixed Stars */}
      {activeSubtab === 'stars' && <FixedStarsView chart={chart} onNavigate={saveNavState} />}

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

function BodyView() {
  const [activeBodyTab, setActiveBodyTab] = useState<string>('elements');
  const traits = loadTraits();

  if (!traits) {
    return (
      <div className="px-5 py-12 text-center flex flex-col gap-3">
        <Body muted>أكمل إدراج بياناتك أولًا لتظهر سماتك.</Body>
        <Link href="/onboarding" className="text-coral text-sm font-medium">ابدأ الإدراج ←</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-tabs */}
      <div className="px-5 pt-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {([['elements', 'العناصر'], ['minerals', 'المعادن'], ['organs', 'الأعضاء'], ['hd', 'مراكز HD']] as const).map(([key, label]) => (
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

      {/* Elements tab */}
      {activeBodyTab === 'elements' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div
            className="rounded-[18px] p-4 mb-1"
            style={{ background: ELEMENT_COLORS[traits.elements.dominant] + '22' }}
          >
            <div className="text-[11px] font-semibold tracking-wider text-ink-muted mb-2">
              عنصرك السائد · {ELEMENT_AR[traits.elements.dominant]}
            </div>
            <div className="font-serif text-[15px] text-ink leading-[1.75] mb-2">
              {ELEMENT_MEANING[traits.elements.dominant].essence}
            </div>
            <Body muted>{ELEMENT_MEANING[traits.elements.dominant].lesson}</Body>
          </div>
          {(['fire', 'earth', 'air', 'water'] as const).map((el) => (
            <Card key={el}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-serif text-base text-ink">{ELEMENT_AR[el]}</div>
                  <div className="text-xs text-ink-muted mt-1">{traits.elements[el]}%</div>
                </div>
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[el] }} />
              </div>
              <div className="h-1.5 bg-rule-soft rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${traits.elements[el]}%`, backgroundColor: ELEMENT_COLORS[el] }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Minerals tab */}
      {activeBodyTab === 'minerals' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <FrameworkLabel label="قراءة هرمسية تقليدية" />
          {traits.minerals.map((m) => (
            <Card key={m.planet}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: m.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-ink-muted">{m.planet}</div>
                  <div className="font-serif text-base text-ink mt-0.5">{m.mineral}</div>
                  {MINERAL_MEANING[m.mineral] && (
                    <div className="text-sm text-ink-muted mt-2 leading-[1.7]">
                      {MINERAL_MEANING[m.mineral]}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Organs tab */}
      {activeBodyTab === 'organs' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <FrameworkLabel label="قراءة هرمسية تقليدية" />
          {traits.organs.map((o) => (
            <Card key={o.planet}>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="font-serif text-base text-ink">{o.organ}</div>
                  <div className="text-xs text-ink-muted mt-1">{o.planet} · {o.theme}</div>
                </div>
                {ORGAN_SIGNAL[o.organ] && (
                  <div className="text-sm text-ink-muted leading-[1.7] mt-1">
                    {ORGAN_SIGNAL[o.organ]}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* HD Centres tab */}
      {activeBodyTab === 'hd' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          <FrameworkLabel label="قراءة تصميم إنساني (Human Design)" />
          <div className="text-xs text-ink-muted mb-1 leading-[1.7]">
            المراكز المُعرَّفة تحمل طاقة ثابتة — غير المُعرَّفة مرنة ومتأثّرة بالمحيط.
          </div>
          {traits.hdCentres.map((c) => {
            const meaning = HD_CENTRE_MEANING[c.name];
            return (
              <Card key={c.name}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base text-ink">{c.name}</div>
                      <div className="text-xs text-ink-muted mt-1">{c.keywords}</div>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: c.defined ? '#E9785E' : '#F0F0F0',
                        color: c.defined ? '#FFFFFF' : '#5C5C7A',
                      }}
                    >
                      {c.defined ? 'مُعرَّف' : 'مفتوح'}
                    </span>
                  </div>
                  {meaning && (
                    <div className="text-sm text-ink-muted leading-[1.7]">
                      {c.defined ? meaning.defined : meaning.open}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
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

const TRANSIT_ESSAY_LINKS = [
  { slug: 'jupiter-return', svgKey: 'jupiter', title: 'عودة المشتري', sub: 'كلّ ١٢ سنةً · التوسّع والأُفق', color: '#9C8AB8', readTime: '٦ دقائق' },
  { slug: 'chiron-return', svgKey: 'chiron',   title: 'عودة كيرون',  sub: 'حوالي سن ٥٠ · الجرح المُعلِّم', color: '#A8A8A8', readTime: '٧ دقائق' },
  { slug: 'uranus-opposition', svgKey: 'uranus', title: 'تقابل أورانوس', sub: 'حوالي سن ٤٢ · يقظة منتصف الحياة', color: '#7E97B8', readTime: '٧ دقائق' },
];

function transitStatusColor(s: GreatTransit['status']): string {
  return s === 'past' ? '#5C5C7A' : '#2A2F66';
}

function TransitRowCollapsed({ t }: { t: GreatTransit }) {
  const maskStyle = (key: string) => ({
    WebkitMaskImage: `url('/svg/${key}.svg')`, maskImage: `url('/svg/${key}.svg')`,
    WebkitMaskSize: 'contain', maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center', maskPosition: 'center',
    background: '#5C5C7A',
  });
  return (
    <div className="bg-white rounded-[14px] px-3.5 py-3 grid items-center gap-3"
      style={{ border: '1px solid #E8E2D2', opacity: t.status === 'past' ? 0.6 : 1, gridTemplateColumns: '36px 1fr auto' }}>
      <div className="w-8 h-8 rounded-2xl bg-cream-soft flex items-center justify-center">
        <div className="w-5 h-5" style={maskStyle(t.svgKey)} />
      </div>
      <div>
        <div className="font-serif text-[14.5px] text-ink leading-[1.3]">{t.name}</div>
        <div className="text-[11px] text-ink-muted mt-0.5 font-mono">{t.year} · {t.age}</div>
      </div>
      <div className="text-[10px] font-semibold tracking-wide" style={{ color: transitStatusColor(t.status) }}>
        {t.status === 'past' ? `مرّت · ${t.age}` : t.status === 'next' ? `قادمة · ${t.age}` : `لاحقًا · ${t.age}`}
      </div>
    </div>
  );
}

function TransitRowExpanded({ t }: { t: GreatTransit }) {
  const maskStyle = (key: string, bg: string) => ({
    WebkitMaskImage: `url('/svg/${key}.svg')`, maskImage: `url('/svg/${key}.svg')`,
    WebkitMaskSize: 'contain', maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center', maskPosition: 'center',
    background: bg,
  });
  return (
    <div className="bg-white rounded-2xl px-4 pt-4 pb-3.5" style={{ border: '1.5px solid #E9785E', boxShadow: '0 0 0 4px rgba(233,120,94,0.06)' }}>
      <div className="flex items-start gap-3">
        <div className="w-[46px] h-[46px] rounded-[23px] flex items-center justify-center shrink-0"
          style={{ background: 'radial-gradient(circle at 30% 25%, #F3B8A6, #E9785E 70%)' }}>
          <div className="w-6 h-6" style={maskStyle(t.svgKey, '#FFFFFF')} />
        </div>
        <div className="flex-1">
          <div className="font-serif text-[18px] text-ink leading-[1.25]">{t.name}</div>
          <div className="text-[11px] text-ink-muted mt-[3px] font-mono">{t.year} · {t.age} · {t.planet}</div>
        </div>
        <div className="text-[10px] font-bold tracking-wide text-coral px-2.5 py-1 rounded-full self-start whitespace-nowrap"
          style={{ background: 'rgba(233,120,94,0.08)' }}>
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

function TransitsView() {
  const expandedName = PB_TRANSITS.find(t => t.status === 'next')?.name
    ?? PB_TRANSITS[PB_TRANSITS.length - 1]?.name;

  return (
    <div className="px-5 pb-6 flex flex-col gap-4">
      <div className="font-serif text-2xl text-ink -tracking-0.5">السيرة البانورامية</div>
      <div className="text-sm text-ink-muted">مسار الكواكب عبر الحياة</div>

      {/* العبورات الكونية — full content from old great-transits page */}
      <div className="mt-2">
        <div className="font-serif text-lg text-ink mb-1">العبورات الكونية</div>
        <p className="text-xs text-ink-muted mb-3 leading-[1.75]">
          خمس لحظات تحوّل كونية يمرّ بها كل إنسان — مبنية على دورات الكواكب البعيدة.
        </p>

        {/* Timeline strip */}
        <div className="px-3 pt-3.5 pb-2.5 bg-white rounded-[14px] mb-3" style={{ border: '1px solid #E8E2D2' }}>
          <div className="grid grid-cols-5 gap-1 relative">
            <div className="absolute top-[18px] h-[1.5px]" style={{ insetInline: 18, background: '#E8E2D2' }} />
            {PB_TRANSITS.map((t) => {
              const isCurrent = t.name === expandedName;
              return (
                <div key={t.name} className="flex flex-col items-center gap-1 relative z-[1]">
                  <div className="w-9 h-9 rounded-[18px] flex items-center justify-center"
                    style={{
                      background: isCurrent ? '#E9785E' : t.status === 'past' ? '#F8F8F8' : '#fff',
                      border: isCurrent ? 'none' : `1.5px solid ${t.status === 'past' ? '#F3B8A6' : '#E8E2D2'}`,
                      boxShadow: isCurrent ? '0 0 0 3px #FFFFFF, 0 0 0 4.5px #E9785E' : 'none',
                    }}>
                    <div className="w-5 h-5" style={{
                      WebkitMaskImage: `url('/svg/${t.svgKey}.svg')`, maskImage: `url('/svg/${t.svgKey}.svg')`,
                      WebkitMaskSize: 'contain', maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center', maskPosition: 'center',
                      background: isCurrent ? '#fff' : t.status === 'past' ? '#E9785E' : '#5C5C7A',
                    }} />
                  </div>
                  <div className="text-[9.5px] text-ink-muted font-mono">{t.age.replace('سن ', '')}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transit cards */}
        <div className="flex flex-col gap-2">
          {PB_TRANSITS.map((t) =>
            t.name === expandedName
              ? <TransitRowExpanded key={t.name} t={t} />
              : <TransitRowCollapsed key={t.name} t={t} />
          )}
        </div>

        <div className="mt-4 mb-2 text-center text-xs text-ink-muted leading-[1.7]">
          خمس عتبات · على مدى ثمانين سنة
        </div>

        {/* Essay links */}
        <div className="mt-4">
          <div className="text-[11px] text-ink-muted font-bold tracking-wide mb-2.5 uppercase">مقالات تأمليّة</div>
          <div className="flex flex-col gap-2">
            {TRANSIT_ESSAY_LINKS.map((e) => (
              <Link key={e.slug} href={`/explore/transits/${e.slug}`}
                className="bg-white rounded-[14px] px-3.5 py-3 grid items-center gap-3 no-underline"
                style={{ border: '1px solid #E8E2D2', gridTemplateColumns: '36px 1fr auto' }}>
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0" style={{ background: e.color }}>
                  <div className="w-5 h-5" style={{
                    WebkitMaskImage: `url('/svg/${e.svgKey}.svg')`, maskImage: `url('/svg/${e.svgKey}.svg')`,
                    WebkitMaskSize: 'contain', maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center', maskPosition: 'center',
                    background: '#FFFFFF',
                  }} />
                </div>
                <div>
                  <div className="font-serif text-[14.5px] text-ink leading-[1.3]">{e.title}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{e.sub}</div>
                </div>
                <div className="text-[10px] text-ink-muted font-mono whitespace-nowrap">{e.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
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

// ── Active Transits — standalone top-level view ───────────────────────────────
function ActiveTransitsView({ chart, onNavigate }: { chart: AstralChart | null; onNavigate: () => void }) {
  const [transits, setTransits] = useState<Transit[]>([]);
  const [notedTransitKeys, setNotedTransitKeys] = useState<Set<string>>(new Set());
  const [aspectFilter, setAspectFilter] = useState<string>('الكل');

  useEffect(() => {
    if (!chart) return;
    setTransits(calculateTransits(chart));
    const events = loadEvents();
    const keys = new Set(
      events
        .filter(e => e.placement?.type === 'aspect' && e.placement.key)
        .map(e => e.placement!.key)
    );
    setNotedTransitKeys(keys);
  }, [chart]);

  const ASPECT_FILTERS = [
    { label: 'الكل', name: null },
    { label: 'اقتران', name: 'اقتران', color: '#5C5C7A' },
    { label: 'سُداس', name: 'سُداس', color: '#4A7FB5' },
    { label: 'تربيع', name: 'تربيع', color: '#C0392B' },
    { label: 'تثليث', name: 'تثليث', color: '#27AE60' },
    { label: 'تقابل', name: 'تقابل', color: '#C0392B' },
  ];

  const filtered = transits.filter(t =>
    aspectFilter === 'الكل' || t.aspectName === aspectFilter
  );

  if (!chart) {
    return (
      <div className="px-5 pt-8 text-center text-sm text-ink-muted">
        أضف خريطتك أولًا لعرض العبورات.
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-8">
      <Headline>العبورات</Headline>
      <p className="text-sm text-ink-muted mt-1 mb-4">ما يلامس خريطتك الآن، مرتّبًا بالقرب.</p>

      {/* Transit hero — same card from Today page, now lives here */}
      <div className="mb-5 -mx-5">
        <TransitHeroCard />
      </div>

      {/* Calendar */}
      <div className="mb-5">
        <div className="text-[11px] font-semibold tracking-wider text-ink-muted mb-2">التقويم الفلكي</div>
        <div style={{ background: '#FFFFFF', borderRadius: 18, padding: '14px 12px', border: '1px solid #E8E2D2' }}>
          <CalendarMonthView />
        </div>
      </div>

      <div className="text-[11px] font-semibold tracking-wider text-ink-muted mb-2">العبورات على خريطتك</div>

      {/* Aspect filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
        {ASPECT_FILTERS.map(f => (
          <button
            key={f.label}
            onClick={() => setAspectFilter(f.label)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0"
            style={{
              background: aspectFilter === f.label ? (f.color ?? '#171B3A') : '#fff',
              color: aspectFilter === f.label ? '#F5F2EA' : '#171B3A',
              border: `1px solid ${aspectFilter === f.label ? (f.color ?? '#171B3A') : '#E8E2D8'}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted text-center py-6">
          {transits.length === 0 ? 'لا توجد عبورات نشطة ضمن المدى الآن.' : 'لا عبورات بهذا النوع حالياً.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((t) => {
            const transitSlug = `${t.transitKey}-${t.natalKey}`;
            const isNoted = notedTransitKeys.has(transitSlug);
            return (
              <Link key={t.id} href={`/self/aspect/${transitSlug}`} className="block" onClick={onNavigate}>
                <div className="bg-white rounded-[20px] border border-rule-soft p-4 flex flex-col items-center text-center gap-3 hover:shadow-sm transition-shadow">
                  {/* Colored orb with symbol */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-[26px] font-serif shrink-0"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${t.aspectColor}55, ${t.aspectColor}CC)`,
                      color: '#fff',
                      boxShadow: `0 4px 16px ${t.aspectColor}30`,
                    }}
                  >
                    {t.aspectSymbol}
                  </div>

                  {/* Planet names */}
                  <div className="flex-1">
                    <div className="font-serif text-[15px] text-ink leading-snug">
                      {t.transitName}
                    </div>
                    <div className="font-serif text-[13px] text-ink-muted leading-snug mt-0.5">
                      {t.natalName}
                    </div>
                  </div>

                  {/* Aspect + orb */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[12px] font-semibold" style={{ color: t.aspectColor }}>
                      {t.aspectName}
                    </span>
                    <span className="text-[11px] text-ink-muted">{orbLabel(t.orb)}</span>
                  </div>

                  {/* Exact hit date */}
                  {t.exactDate && (
                    <div className="text-[11px] text-ink-muted bg-cream-soft rounded-full px-2.5 py-1">
                      {formatExactDate(t.exactDate)}
                    </div>
                  )}

                  {isNoted && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-[#8FA084]">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5.5" stroke="#8FA084" />
                        <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="#8FA084" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      مُدوَّن
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
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
      <div className="pt-0">
        {/* Main tabs — sticky header with underline style (Image #20) */}
        <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-xl border-b border-rule-soft">
          <div className="flex items-baseline justify-between px-5 pt-5 pb-0">
            <div className="font-serif text-[28px] text-ink -tracking-[0.5px]">أنت</div>
            <Link href="/journey-2" className="text-[13px] text-coral font-medium">
              سجلّاتك
            </Link>
          </div>
          <div className="flex gap-0 overflow-x-auto px-5 mt-2" style={{ scrollbarWidth: 'none' }}>
            {[
              { key: 'chart',   label: 'الخريطة' },
              { key: 'active',  label: 'العبورات' },
              { key: 'transits',label: 'السيرة' },
              { key: 'body',    label: 'الجسد' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className="relative px-4 pb-3 pt-1 text-[14px] font-medium whitespace-nowrap transition-colors shrink-0"
                style={{ color: mainTab === tab.key ? '#171B3A' : '#5C5C7A' }}
              >
                {tab.label}
                {mainTab === tab.key && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-ink rounded-full" />
                )}
              </button>
            ))}
          </div>
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
            <div className="px-5 pt-6 mb-2">
              <Headline>الجسد</Headline>
              <p className="text-sm text-ink-muted mt-1">تُحسب من خريطتك مرّة واحدة.</p>
            </div>
            <BodyView />
          </>
        )}

        {mainTab === 'active' && (
          <ActiveTransitsView chart={chart} onNavigate={() => {
            const el = document.documentElement;
            sessionStorage.setItem('sukoon.self.scrollY', String(el.scrollTop || window.scrollY));
          }} />
        )}

        {mainTab === 'transits' && (
          <>
            <div className="px-5 mb-4">
              <Headline>السيرة البانورامية</Headline>
            </div>
            <TransitsView />
            <LifeArcView chart={chart} />
          </>
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
