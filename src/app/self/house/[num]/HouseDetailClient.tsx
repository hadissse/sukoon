'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AstralChart } from '@/lib/chartCalculator';
import { getCurrentSky } from '@/lib/currentSky';
import { planetSvgKey } from '@/lib/planetMeta';
import { PLANET_IN_HOUSE } from '@/content/planetInHouseData';

// ── Arabic helpers ────────────────────────────────────────────────────────────

function toAr(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

const ZODIAC_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء',
  'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت',
];

const ZODIAC_SVG_KEYS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sag', 'cap', 'aqua', 'pisces',
];

function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

function lonToSignDeg(lon: number): string {
  const n = norm360(lon);
  const sign = Math.floor(n / 30);
  const deg = Math.floor(n % 30);
  return `${ZODIAC_AR[sign]} ${toAr(deg)}°`;
}

// ── House metadata ─────────────────────────────────────────────────────────────

const HOUSE_ORDINALS_AR = [
  'بيت ١', 'بيت ٢', 'بيت ٣', 'بيت ٤', 'بيت ٥', 'بيت ٦',
  'بيت ٧', 'بيت ٨', 'بيت ٩', 'بيت ١٠', 'بيت ١١', 'بيت ١٢',
];

const HOUSE_NAMES_AR = [
  'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس',
  'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر',
];

const HOUSE_THEMES_SHORT = [
  'الذات · الجسد',
  'المورد · الميدان',
  'العقل · القريب',
  'الأصول · الموقد',
  'الإبداع · الشرارة',
  'العمل · اليومي',
  'الآخر · المرآة',
  'الأعماق · المشترك',
  'المعنى · البعيد',
  'الذروة · العمل',
  'الجماعة · المستقبل',
  'الخفاء · الانحلال',
];

// Full Arabic descriptions for each house
const HOUSE_FULL_DESCRIPTIONS: string[] = [
  // House 1
  'البيت الأول هو عتبة الذات — الواجهة الأولى التي تظهر بها للعالم، والجسد الذي تسكنه في هذه الحياة. حامل طالع المولد، يكشف هذا البيت عن الانطباع العفوي الذي تتركه في نفوس من يلتقونك للمرة الأولى. هنا يسكن الطريق الذي تبدأ به كلّ مسيرة: كيف تقدّم نفسك، وكيف تختار الظهور. وسيلتك في العيش ومرآتك للوجود.',
  // House 2
  'البيت الثاني يسأل: ما الذي تملكه حقًا؟ — وليس الأموال وحدها، بل القيم التي لا تتنازل عنها، والطاقة التي تنهل منها. هنا يتشكّل علاقتك بالاستحقاق والأمان المادي، وبما تضفيه على العالم بموارد يدك وصوتك وعقلك. ما الذي يعطيك شعورًا بالأمان؟ وما الذي يمكنك أن تعطيه بدوام؟',
  // House 3
  'البيت الثالث هو عقلك في حركته اليومية — الفضول الحيّ الذي يسأل ويتعلّم ويتنقّل. الإخوة والجيران وكلّ من يسكنون دائرتك القريبة ينتمون إلى مداره. هنا يُنسَج التواصل: الكلمة المكتوبة والمنطوقة، الرسالة المرسَلة والفكرة المتداوَلة. السفر القصير والمحادثة العابرة قد يحملان من الوحي أكثر مما تظنّ.',
  // House 4
  'البيت الرابع هو أعمق قرار تسكنه الروح — الجذر الخفيّ الذي تنبثق منه كلّ الفروع. الأسرة والميراث العاطفي والوطن الداخلي كلّها تنبع من هنا. ما الذي تحمله من طفولتك؟ وما الأساس الذي تبني عليه؟ في نهاية العمر، هذا البيت يكشف إلى أين تعود حين يتعب كلّ شيء آخر.',
  // House 5
  'البيت الخامس هو قلب الإبداع النابض — اللهو الذي يصبح فنًا، والحبّ الذي يشعل الحياة. هنا يسكن الطفل الداخلي الذي يصنع لمجرّد متعة الصنع. الأطفال والمحبوبون والمشاريع التي تضع فيها روحك كلّها تنتمي إلى مداره. الجرأة على التعبير والمخاطرة بالظهور — هذا هو اختبار هذا البيت.',
  // House 6
  'البيت السادس هو الانضباط اليومي الذي يُترجم الطموح إلى واقع. الصحة والروتين والعمل التفصيلي يجدون معناهم هنا. كيف تخدم، وكيف تُعتنى بجسدك، وما القيود التي تضعها على نفسك بوعي — كلّ ذلك يُقرأ في هذا البيت. الإتقان يُبنى بالتكرار، والتكرار يصبح محبّةً حين يصدر من بيت السادس الواعي.',
  // House 7
  'البيت السابع هو مرآتك في الآخر — ما تجد فيمن تختارهم شريكًا أو عدوًا. الزواج والشراكة والعلاقات الحميمة الطويلة تُشكَّل في ظلّ هذا البيت. ما تقمعه في نفسك يظهر في الشريك المقابل. التكامل هنا ليس الاندماج بل التقابل: أن تبقى ذاتك وتتّسع في نفس الوقت لأن في الآخر شيئًا تحتاجه.',
  // House 8
  'البيت الثامن هو عالم ما وراء السطح — الموارد المشتركة، والموت والولادة، والتحوّل من خلال الأزمة. هنا تتناغم الروح مع ما هو أعمق من الظاهر: الميراث والديون العاطفية والصلابة التي تُبنى في أشدّ اللحظات. إفلاس الأنا القديمة هو بداية هذا البيت، وما يبقى بعد الحريق هو ما كان حقيقيًا دائمًا.',
  // House 9
  'البيت التاسع هو أفق المعنى — الفلسفة والسفر البعيد والإيمان الذي يوسّع الحدود. هنا يسكن المعلّم والفيلسوف والرحّالة بداخلك. ما الذي تؤمن به حقًا؟ وما الخريطة العقلية التي تسير بها في الحياة؟ الجامعات والنصوص الكبرى والثقافات الأخرى كلّها أبواب يطرقها هذا البيت بحثًا عن الحقيقة الأوسع.',
  // House 10
  'البيت العاشر هو ذروة ما ترى في نفسك وما يراه العالم فيك — المهنة والسمعة والإرث الذي تتركه. هنا يقف الطالع في مواجهة المجتمع: ما الأثر الذي تريد أن تُخلّفه؟ وما الدور الذي اخترته في الصرح الكبير؟ النجاح هنا ليس الشهرة بل الاتّساق بين ما تعمله وما تؤمن به.',
  // House 11
  'البيت الحادي عشر هو فضاء الحلم الجماعي — الأصدقاء والجماعة والأهداف التي تتجاوز الفرد. هنا تلتقي الأرواح المتشابهة وتتشكّل الرؤى للمستقبل. ما الذي تريد أن يكون أفضل للجماعة؟ وما الشبكة التي تسندك وتسندها؟ التغيير الكبير في العالم يبدأ دائمًا من هذا البيت حين يجد أرواحًا متّفقة.',
  // House 12
  'البيت الثاني عشر هو حجرة الأسرار — اللاوعي والعزلة والعالم الخفيّ الذي يعمل تحت السطح. هنا يسكن ما تخشى أن يُرى، وما لم تجد له صوتًا بعد. الروحانية والتأمّل والأحلام جسور نحو هذا البيت. ما لم يُعالَج هنا يشكّل القيود غير المرئية في حياتك. المواجهة الحنونة لما يُخفيه هذا البيت تحرّر طاقة هائلة.',
];

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

const PLANET_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'chiron', 'northNode', 'southNode',
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPlanetsInHouse(chart: AstralChart, houseNum: number): { key: string; planet: AstralChart['sun'] }[] {
  const house = chart.houses[houseNum - 1];
  const nextHouse = chart.houses[houseNum % 12];
  const start = norm360(house.cusp);
  const end = norm360(nextHouse.cusp);
  const result: { key: string; planet: AstralChart['sun'] }[] = [];

  for (const key of PLANET_KEYS) {
    const planet = (chart as unknown as Record<string, AstralChart['sun']>)[key];
    if (!planet || typeof planet.longitude !== 'number') continue;
    const lon = norm360(planet.longitude);
    const inHouse = end > start
      ? lon >= start && lon < end
      : lon >= start || lon < end; // wraps around 0°
    if (inHouse) result.push({ key, planet });
  }
  return result;
}

function getTransitingPlanetsInHouse(sky: AstralChart, chart: AstralChart, houseNum: number): { key: string; planet: AstralChart['sun'] }[] {
  // Use natal house cusps but check sky planet positions
  const house = chart.houses[houseNum - 1];
  const nextHouse = chart.houses[houseNum % 12];
  const start = norm360(house.cusp);
  const end = norm360(nextHouse.cusp);
  const result: { key: string; planet: AstralChart['sun'] }[] = [];

  const transitKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
  for (const key of transitKeys) {
    const planet = (sky as unknown as Record<string, AstralChart['sun']>)[key];
    if (!planet || typeof planet.longitude !== 'number') continue;
    const lon = norm360(planet.longitude);
    const inHouse = end > start
      ? lon >= start && lon < end
      : lon >= start || lon < end;
    if (inHouse) result.push({ key, planet });
  }
  return result;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlanetRow({
  planetKey,
  planet,
  houseNum,
}: {
  planetKey: string;
  planet: AstralChart['sun'];
  houseNum: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const svgKey = planetSvgKey(planetKey);
  const posStr = `${planet.sign} ${toAr(planet.degree)}°`;
  const reading = PLANET_IN_HOUSE[`${planetKey}:${houseNum}`];

  // Helper: get first 2 sentences of a string
  function firstTwoSentences(text: string): string {
    const matches = text.match(/[^.!؟]+[.!؟]+/g);
    if (!matches) return text.slice(0, 200);
    return matches.slice(0, 2).join('');
  }

  return (
    <div className="py-4 border-b border-[#EDE9E0] last:border-b-0">
      {/* Planet header row */}
      <div className="flex gap-3 items-start">
        <div className="shrink-0 w-9 h-9 rounded-full bg-[#F5F0E8] flex items-center justify-center">
          <div
            className="w-5 h-5"
            style={{
              WebkitMaskImage: `url('/svg/${svgKey}.svg')`,
              maskImage: `url('/svg/${svgKey}.svg')`,
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
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-[14px] text-ink">{PLANET_AR[planetKey] ?? planet.name}</span>
            <span className="text-[11px] text-ink-muted">{posStr}</span>
            {planet.retrograde && <span className="text-[10px] text-ink-muted">℞</span>}
          </div>
        </div>
      </div>

      {reading ? (
        <div className="mt-3 flex flex-col gap-3">
          {/* Traditional meaning */}
          <div>
            <div className="text-[10px] text-ink-muted font-semibold tracking-wide mb-1">المعنى التقليدي</div>
            <div className="text-[13px] text-ink leading-[1.7]">
              {expanded ? reading.traditional : firstTwoSentences(reading.traditional)}
            </div>
          </div>
          {/* Evolutionary meaning */}
          <div>
            <div className="text-[10px] text-ink-muted font-semibold tracking-wide mb-1">المعنى التطوري</div>
            <div className="text-[13px] text-ink leading-[1.7]">
              {expanded ? reading.evolutionary : firstTwoSentences(reading.evolutionary)}
            </div>
          </div>
          {/* Developmental task */}
          <div>
            <div className="text-[10px] text-ink-muted font-semibold tracking-wide mb-1">المهمة التطورية</div>
            <div className="text-[13px] text-ink leading-[1.7]">
              {expanded ? reading.task : firstTwoSentences(reading.task)}
            </div>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-[12px] text-ink-muted underline underline-offset-2 mt-0.5"
          >
            {expanded ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        </div>
      ) : (
        <div className="mt-2 text-[13px] text-ink-muted leading-[1.6]">
          {PLANET_AR[planetKey] ?? planet.name} في البيت {HOUSE_NAMES_AR[houseNum - 1]}.
        </div>
      )}
    </div>
  );
}

function TransitRow({
  planetKey,
  planet,
}: {
  planetKey: string;
  planet: AstralChart['sun'];
}) {
  const svgKey = planetSvgKey(planetKey);
  const posStr = `${planet.sign} ${toAr(planet.degree)}°`;

  return (
    <div className="flex gap-3 items-center py-2.5 border-b border-[#EDE9E0] last:border-b-0">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[#EEF4EC] flex items-center justify-center">
        <div
          className="w-4 h-4"
          style={{
            WebkitMaskImage: `url('/svg/${svgKey}.svg')`,
            maskImage: `url('/svg/${svgKey}.svg')`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            background: '#8FA084',
          }}
        />
      </div>
      <div>
        <span className="font-medium text-[13px] text-ink">{PLANET_AR[planetKey] ?? planet.name}</span>
        <span className="text-[11px] text-ink-muted mr-2">{posStr}</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function HouseDetailClient({ num }: { num: number }) {
  const router = useRouter();
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [sky, setSky] = useState<AstralChart | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sukoon.primary-chart.v1');
      if (raw) setChart(JSON.parse(raw));
    } catch {}
    setSky(getCurrentSky());
  }, []);

  const houseIdx = num - 1;
  const isValid = num >= 1 && num <= 12;

  if (!isValid) {
    return (
      <div className="max-w-[430px] mx-auto w-full px-5 py-12 text-center" dir="rtl">
        <div className="text-ink-muted text-sm">رقم البيت غير صحيح.</div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="max-w-[430px] mx-auto w-full pb-28" dir="rtl">
        {/* Header nav */}
        <div className="pt-4 px-5 flex justify-between items-center">
          <button onClick={() => router.back()} aria-label="رجوع" className="text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-xs text-ink-muted">البيوت</div>
          <div className="w-[22px]" />
        </div>
        <div className="px-5 mt-16 text-center">
          <div className="text-ink-muted text-sm leading-[1.7] mb-6">
            لا توجد خريطة فلكية محفوظة. أدخل بيانات الميلاد لتظهر تفاصيل بيتك.
          </div>
          <button
            onClick={() => router.push('/settings/edit-birth')}
            className="px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium"
          >
            إدخال بيانات الميلاد
          </button>
        </div>
      </div>
    );
  }

  const house = chart.houses[houseIdx];
  const signIdx = house ? Math.floor(norm360(house.cusp) / 30) : 0;
  const signName = ZODIAC_AR[signIdx];
  const signSvgKey = ZODIAC_SVG_KEYS[signIdx];
  const cuspDeg = house ? Math.floor(norm360(house.cusp) % 30) : 0;
  const houseLabel = HOUSE_ORDINALS_AR[houseIdx];
  const houseThemeShort = HOUSE_THEMES_SHORT[houseIdx];
  const houseDesc = HOUSE_FULL_DESCRIPTIONS[houseIdx];

  const natalPlanets = getPlanetsInHouse(chart, num);
  const transitingPlanets = sky ? getTransitingPlanetsInHouse(sky, chart, num) : [];

  // House header gradient colours
  const HOUSE_COLORS: Record<number, string> = {
    1: 'linear-gradient(140deg, #F5C0B0 0%, #D06050 100%)',
    2: 'linear-gradient(140deg, #D8C890 0%, #A89050 100%)',
    3: 'linear-gradient(140deg, #B0D8C8 0%, #5090A0 100%)',
    4: 'linear-gradient(140deg, #B0C8D8 0%, #5070A0 100%)',
    5: 'linear-gradient(140deg, #F5D070 0%, #C08030 100%)',
    6: 'linear-gradient(140deg, #C8D8B0 0%, #708050 100%)',
    7: 'linear-gradient(140deg, #D0B0D8 0%, #8050A0 100%)',
    8: 'linear-gradient(140deg, #A08898 0%, #503050 100%)',
    9: 'linear-gradient(140deg, #B8C8E8 0%, #4060A8 100%)',
    10: 'linear-gradient(140deg, #6080C0 0%, #203070 100%)',
    11: 'linear-gradient(140deg, #A0C8C8 0%, #3080A0 100%)',
    12: 'linear-gradient(140deg, #888898 0%, #404050 100%)',
  };

  const headerGrad = HOUSE_COLORS[num] ?? HOUSE_COLORS[1];

  return (
    <div className="max-w-[430px] mx-auto w-full pb-28 relative" dir="rtl">
      {/* Header nav */}
      <div className="pt-4 px-5 flex justify-between items-center">
        <button onClick={() => router.back()} aria-label="رجوع" className="text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-xs text-ink-muted">البيوت الفلكية</div>
        <div className="w-[22px]" />
      </div>

      {/* Identity card */}
      <div className="mx-5 mt-4 rounded-[20px] p-5 relative overflow-hidden" style={{ background: headerGrad }}>
        {/* Sign icon top-left */}
        <div
          className="absolute top-4 left-4 w-8 h-8 opacity-40"
          style={{
            WebkitMaskImage: `url('/svg/${signSvgKey}.svg')`,
            maskImage: `url('/svg/${signSvgKey}.svg')`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            background: 'rgba(255,255,255,0.9)',
          }}
        />
        <div className="font-serif text-3xl text-white leading-tight drop-shadow-sm">{houseLabel}</div>
        <div className="text-sm text-white/80 mt-1">{houseThemeShort}</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="px-2.5 py-1 bg-white/20 rounded-full text-[11px] text-white font-medium">
            {signName} {toAr(cuspDeg)}° — الطالع
          </div>
        </div>
      </div>

      {/* House themes section */}
      <div className="mx-5 mt-4 p-4 bg-white rounded-[14px]" style={{ border: '1px solid #E8E2D2' }}>
        <div className="text-[11px] text-ink-muted font-semibold tracking-wide mb-2">ما يحكمه هذا البيت</div>
        <div className="text-[14px] text-ink leading-[1.7]">{houseDesc}</div>
      </div>

      {/* Natal planets in this house */}
      <div className="mx-5 mt-4">
        <div className="text-[11px] text-ink-muted font-semibold tracking-wide mb-2">كواكب الميلاد في هذا البيت</div>
        {natalPlanets.length === 0 ? (
          <div className="p-4 bg-white rounded-[14px] text-[13px] text-ink-muted text-center" style={{ border: '1px solid #E8E2D2' }}>
            لا توجد كواكب ميلاد في هذا البيت
          </div>
        ) : (
          <div className="bg-white rounded-[14px] px-4" style={{ border: '1px solid #E8E2D2' }}>
            {natalPlanets.map(({ key, planet }) => (
              <PlanetRow key={key} planetKey={key} planet={planet} houseNum={num} />
            ))}
          </div>
        )}
      </div>

      {/* Current transiting planets */}
      <div className="mx-5 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[11px] text-ink-muted font-semibold tracking-wide">العبور الحالي</div>
          <div className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ background: '#8FA084' }}>
            الآن
          </div>
        </div>
        {transitingPlanets.length === 0 ? (
          <div className="p-4 bg-white rounded-[14px] text-[13px] text-ink-muted text-center" style={{ border: '1px solid #E8E2D2' }}>
            لا توجد كواكب عابرة في هذا البيت حاليًا
          </div>
        ) : (
          <div className="bg-white rounded-[14px] px-4" style={{ border: '1px solid #EDE9E0' }}>
            {transitingPlanets.map(({ key, planet }) => (
              <TransitRow key={key} planetKey={key} planet={planet} />
            ))}
          </div>
        )}
      </div>

      {/* Log button */}
      <div className="px-5 mt-5">
        <button
          onClick={() => router.push(`/log?type=house&key=${num}&label=${encodeURIComponent(houseLabel)}`)}
          className="w-full h-[52px] rounded-[26px] bg-ink text-cream text-base font-medium"
        >
          سجّل حدثًا مرتبطًا بهذا البيت
        </button>
      </div>
    </div>
  );
}
