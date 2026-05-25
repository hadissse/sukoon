'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Meta } from '@/components/Meta';
import { ZoomableWheel } from '@/components/ZoomableWheel';
import { AstralChart } from '@/lib/chartCalculator';
import { SIGN_SLUGS } from '@/content/placements';
import { loadEvents, STREAM_AR, STREAM_GLYPH, type LoggedEvent } from '@/lib/events';
import { calculateTransits, orbLabel, type Transit } from '@/lib/transits';
import { loadTraits } from '@/lib/traitEngine';

const chartSubtabs = [
  { key: 'planets', label: 'الكواكب' },
  { key: 'elements', label: 'العناصر' },
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
  
  const planetKeys: (keyof AstralChart)[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'lilith'];
  
  return planetKeys.map((key) => {
    const planet = chart[key];
    if (typeof planet === 'object' && planet !== null && 'name' in planet) {
      return {
        name: planet.name,
        position: formatPosition(planet),
        key,
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
  const planetList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  
  const aspectTypes = [
    { angle: 0, name: 'اقتران', symbol: '·', orb: 8 },
    { angle: 60, name: 'سُداس', symbol: '·', orb: 6 },
    { angle: 90, name: 'تربيع', symbol: '·', orb: 8 },
    { angle: 120, name: 'تثليث', symbol: '·', orb: 8 },
    { angle: 180, name: 'تقابل', symbol: '·', orb: 8 },
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
              type: aspectType.name,
              slug: `${planetList[i]}-${planetList[j]}`,
            });
          }
        }
      }
    }
  }
  
  return aspects.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb)).slice(0, 5);
}

function ChartView({ chart }: { chart: AstralChart | null }) {
  const [activeSubtab, setActiveSubtab] = useState<string>('planets');
  const [transits, setTransits] = useState<Transit[]>([]);
  const traits = loadTraits();

  const ELEMENT_COLORS: Record<string, string> = {
    fire: '#E9785E', earth: '#BDAA82', air: '#C2D3E2', water: '#7E97B8',
  };
  const ELEMENT_AR: Record<string, string> = {
    fire: 'نار', earth: 'تراب', air: 'هواء', water: 'ماء',
  };

  const planets = transformChartToPlanets(chart);
  const signs = transformChartToSigns(chart);
  const houses = transformChartToHouses(chart);
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
      {/* Sub-tabs */}
      <div className="px-5 pt-6 overflow-x-auto">
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

      {/* Chart wheel and position chip */}
      {activeSubtab === 'planets' && (
        <>
          <div className="flex justify-center px-2 pt-2">
            <ZoomableWheel size={377} tone="paper" />
          </div>
          <div className="px-5 text-center text-xs text-ink-muted flex flex-col gap-1.5">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <span>الشمس · {chart.sun.sign} {chart.sun.degree}°</span>
              <span className="opacity-40">·</span>
              <span>القمر · {chart.moon.sign} {chart.moon.degree}°</span>
              <span className="opacity-40">·</span>
              <span>طالع · {ZODIAC_NAMES_AR[Math.floor((chart.asc % 360) / 30)]} {Math.floor((chart.asc % 30))}°</span>
            </div>
          </div>
        </>
      )}

      {/* Planets list */}
      {activeSubtab === 'planets' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {planets.map((planet) => (
            <Link key={planet.key} href={`/self/planet/${planet.key}`} className="block">
              <Card>
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 flex-shrink-0 rounded-full bg-cream-soft flex items-center justify-center">
                    <div
                      className="w-6 h-6"
                      style={{
                        WebkitMaskImage: `url('/svg/${planet.key}.svg')`,
                        maskImage: `url('/svg/${planet.key}.svg')`,
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
                    <div className="font-serif text-base text-ink">{planet.name}</div>
                    <div className="text-sm text-ink-muted mt-1">{planet.position}</div>
                  </div>
                  <div className="text-lg text-ink-muted">›</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Elements subtab */}
      {activeSubtab === 'elements' && (
        <div className="px-5 pb-6 flex flex-col gap-4">
          {traits?.elements ? (
            <>
              <div className="text-xs text-ink-muted">توازن العناصر في خريطتك النجمية:</div>
              {(['fire', 'earth', 'air', 'water'] as const).map((el) => {
                const pct = Math.round(traits.elements[el] * 100);
                const color = ELEMENT_COLORS[el];
                return (
                  <Card key={el}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-serif text-lg text-ink">{ELEMENT_AR[el]}</div>
                        <div className="text-xs text-ink-muted mt-1">
                          {traits.elements.dominant === el ? 'السائد' : ''}
                        </div>
                      </div>
                      <div className="font-serif text-lg" style={{ color }}>{pct}%</div>
                    </div>
                    <div className="h-1.5 bg-rule-soft rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </Card>
                );
              })}
              <Link href="/traits" className="text-xs text-coral font-medium text-center mt-1">
                ملفّ السمات الكامل ←
              </Link>
            </>
          ) : (
            <div className="py-12 text-center">
              <Body muted>لم يُحسب ملفّ السمات بعد — أكمل الاستبيان أولاً.</Body>
            </div>
          )}
        </div>
      )}

      {/* Signs list */}
      {activeSubtab === 'signs' && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {signs.map((sign, idx) => (
            <Link key={sign.name} href={`/self/sign/${SIGN_SLUGS[idx]}`} className="block">
              <Card>
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-full bg-cream-soft flex items-center justify-center shrink-0">
                    <div
                      className="w-5 h-5"
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
            <Link key={house.num} href={`/self/house/${idx + 1}`} className="block">
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
            {['الكل', 'رئيسية', 'ثانوية', 'مقتربة'].map((filter, i) => (
              <button
                key={filter}
                className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  i === 0
                    ? 'bg-ink text-cream'
                    : 'bg-white text-ink border border-rule-soft'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="px-5 pb-6 flex flex-col gap-3">
            {aspects.length > 0 ? (
              aspects.map((aspect) => (
                <Link key={aspect.aspect} href={`/self/aspect/${aspect.slug}`} className="block">
                  <Card>
                    <div className="flex justify-between gap-3 mb-2">
                      <div className="font-serif text-base text-ink">{aspect.aspect}</div>
                      <div className="text-xs text-ink-muted font-mono">{aspect.orb}</div>
                    </div>
                    <div className="text-sm text-coral font-medium">{aspect.type}</div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-ink-muted text-sm">لا توجد جوانب رئيسية</div>
            )}
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
                <Link key={t.id} href={`/self/aspect/${t.transitKey}-${t.natalKey}`} className="block">
                  <Card>
                    <div className="flex justify-between items-baseline gap-2 mb-1.5">
                      <div className="font-serif text-base text-ink">
                        {t.transitName} · {t.natalName}
                      </div>
                      <div className="text-xs text-ink-muted font-mono">{orbLabel(t.orb)}</div>
                    </div>
                    <div className="text-sm text-coral font-medium">{t.aspectName}</div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </>
      )}
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
        <div className="px-5 pb-6 py-12 text-center flex flex-col gap-3">
          <Body muted>لم يُحسب ملفّ السمات بعد.</Body>
          <Link href="/quiz" className="text-coral text-sm font-medium">أكمل الاستبيان ←</Link>
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
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: m.color + '33' }}>
                  <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/sun.svg')`, maskImage: `url('/svg/sun.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: m.color }} />
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

const CHART_GUIDE_STEPS = [
  {
    title: 'خريطتك النجمية',
    body: 'هذه الدائرة تمثّل السماء لحظة ميلادك. كل كوكب في موضعه يخبر شيئًا عنك.',
  },
  {
    title: 'الشمس والقمر والطالع',
    body: 'الشمس: جوهرك وهويّتك. القمر: حياتك العاطفية. الطالع: كيف يراك العالم.',
  },
  {
    title: 'البيوت الاثنا عشر',
    body: 'الدائرة مقسّمة إلى بيوت — كل بيت مساحة من حياتك. الكواكب فيها تُنشّطها.',
  },
  {
    title: 'اقرأ بحرية',
    body: 'اضغط على أي كوكب لتتعمّق في معناه. يمكنك التقريب أو التحريك بأصبعين.',
  },
];

function ChartIntroOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = CHART_GUIDE_STEPS[step];

  const next = () => {
    if (step < CHART_GUIDE_STEPS.length - 1) setStep(step + 1);
    else onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(15,18,40,0.72)', backdropFilter: 'blur(2px)' }}>
      <div
        className="bg-cream max-w-[430px] mx-auto w-full rounded-t-[28px] px-6 pt-6 pb-10"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5 justify-center">
          {CHART_GUIDE_STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{ width: i === step ? 24 : 6, background: i <= step ? '#E9785E' : '#E8E2D2' }}
            />
          ))}
        </div>

        <div className="font-serif text-2xl text-ink mb-2 leading-snug">{current.title}</div>
        <div className="text-sm text-ink-muted leading-[1.7]">{current.body}</div>

        <button
          onClick={next}
          className="mt-7 w-full h-[50px] rounded-[25px] bg-ink text-cream text-base font-medium"
        >
          {step < CHART_GUIDE_STEPS.length - 1 ? 'التالي' : 'ابدأ الاستكشاف'}
        </button>
        <button onClick={onDone} className="mt-3 w-full text-center text-sm text-ink-muted py-2">
          تخطّى
        </button>
      </div>
    </div>
  );
}

export default function SelfPage() {
  const [mainTab, setMainTab] = useState<string>('chart');
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        setChart(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse chart from localStorage:', e);
      }
    }
    // Show guide on first visit after onboarding
    if (!localStorage.getItem('sukoon.chart-guide-seen')) {
      setShowGuide(true);
    }
  }, []);

  const dismissGuide = () => {
    localStorage.setItem('sukoon.chart-guide-seen', '1');
    setShowGuide(false);
  };

  return (
    <div className="pb-24">
      {showGuide && <ChartIntroOverlay onDone={dismissGuide} />}
      <div className="pt-6">
        {/* Main tabs */}
        <div className="px-5 mb-6 flex gap-3">
          {[
            { key: 'chart', label: 'الخريطة' },
            { key: 'body', label: 'الجسد' },
            { key: 'saved', label: 'ما حفظت' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                mainTab === tab.key
                  ? 'bg-ink text-cream'
                  : 'bg-white text-ink border border-rule-soft'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mainTab === 'chart' && (
          <>
            <div className="px-5 mb-4">
              <Headline>الخريطة</Headline>
            </div>
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
