'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Meta } from '@/components/Meta';
import type { AstralChart } from '@/lib/chartCalculator';
import { calculateTransits, orbLabel, type Transit } from '@/lib/transits';
import { SIGN_SLUGS, getPlacementContent } from '@/content/placements';

// Felt-experience of an aspect — what the geometry tends to feel like in life.
const ASPECT_FEEL: Record<string, string> = {
  اقتران: 'يلتقيان في نقطة واحدة، تتكثّف طاقتهما وتطلب انتباهك.',
  سُداس: 'زاوية ميسّرة تفتح فرصةً لطيفة إن بادرت إليها.',
  تربيع: 'توتّرٌ يطلب فعلًا، احتكاكٌ يدفعك إلى النمو لا إلى الجمود.',
  تثليث: 'انسجامٌ يسري بسهولة، وقتٌ ملائم للثقة بما تحمله دون أن تحكم عليه.',
  تقابل: 'قطبان يتواجهان، يدعوك إلى التوازن بين طرفين فيك.',
};

// Voice of each transiting body — what its visit tends to ask of you.
const TRANSIT_FLAVOR: Record<string, string> = {
  sun: 'التفاتٌ نحو ما تُضيئه، هويّةٌ تُسأَل أن تحضر.',
  mercury: 'حركةٌ في الذهن واللسان، أفكارٌ تطلب أن تُقال أو تُكتب.',
  venus: 'لمسةٌ من القيمة والرفق، يدعوك إلى ما يستحقّ.',
  mars: 'شرارةٌ في الإرادة، دفعٌ نحو الفعل.',
  jupiter: 'توسعةٌ ودعوةٌ لمعنى أكبر، البابُ مفتوحٌ على رحابة.',
  saturn: 'امتحانُ ما بُني، يُسأَل البناءُ إن كان حقيقيًّا.',
  uranus: 'كسرٌ يطلب نمطًا جديدًا، حركةٌ مفاجئة لا تستأذن.',
  neptune: 'ذوبانٌ في الحدود، صفاءٌ أو ضباب، حسب ما تختار.',
  pluto: 'عمقٌ يدعو إلى تحوّلٍ جذري، لا يُخفى ما يُكشَف هنا.',
  chiron: 'لمسٌ على الجرح القديم، مكانٌ يطلب الرفق والاعتراف.',
};

// Possessive name of the natal planet — "your Sun", "your Moon".
const NATAL_POSSESSIVE: Record<string, string> = {
  sun: 'شمسك',
  moon: 'قمرك',
  mercury: 'عطاردك',
  venus: 'زهرتك',
  mars: 'مرّيخك',
  jupiter: 'المشتري في خريطتك',
  saturn: 'زحل في خريطتك',
  uranus: 'أورانوس في خريطتك',
  neptune: 'نبتون في خريطتك',
  pluto: 'بلوتو في خريطتك',
  northNode: 'رأسك القمري',
  southNode: 'ذيلك القمري',
};

const VOTES = ['دافئ', 'هادئ', 'محرّك', 'ساكن'];

export function TransitHeroCard() {
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [transit, setTransit] = useState<Transit | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [showReading, setShowReading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const voteKey = `sukoon.vote.transit.${today}`;

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        const parsed: AstralChart = JSON.parse(stored);
        setChart(parsed);
        // Moon-as-transitor is too fast to be a daily anchor — skip it.
        const transits = calculateTransits(parsed).filter((t) => t.transitKey !== 'moon');
        setTransit(transits[0] ?? null);
      } catch {}
    }
    setVote(localStorage.getItem(voteKey));
    setLoaded(true);
  }, [voteKey]);

  const castVote = (v: string) => {
    setVote(v);
    localStorage.setItem(voteKey, v);
  };

  if (loaded && !transit) {
    return (
      <Card>
        <div className="flex flex-col gap-2">
          <Meta>ما يمسّك اليوم</Meta>
          <Body muted>
            {chart
              ? 'لا يوجد عبور قويّ يلامس خريطتك اليوم — يومٌ هادئٌ نسبيًّا.'
              : 'حمّل خريطتك لترى ما يمسّ سماءَك الداخلية اليوم.'}
          </Body>
        </div>
      </Card>
    );
  }

  if (!transit || !chart) {
    return (
      <Card>
        <Meta>ما يمسّك اليوم</Meta>
      </Card>
    );
  }

  // Pull the natal placement's own observation — gives the user a felt sense
  // of *which part of them* is being touched. This is the personalization
  // the daily page was missing.
  const natalPlanet = (chart as unknown as Record<string, AstralChart['sun']>)[transit.natalKey];
  const natalSlug = natalPlanet ? SIGN_SLUGS[natalPlanet.signNumber] : null;
  const natalVoice = natalSlug
    ? getPlacementContent('planet', `${transit.natalKey}:${natalSlug}`)
    : null;

  const possessive = NATAL_POSSESSIVE[transit.natalKey] ?? transit.natalName;
  const flavor = TRANSIT_FLAVOR[transit.transitKey] ?? 'عبورٌ نشطٌ يلامس خريطتك الآن.';
  const feel = ASPECT_FEEL[transit.aspectName] ?? '';

  return (
    <div className="relative rounded-[20px] overflow-hidden p-5 bg-white border border-rule-soft">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Meta>ما يمسّك اليوم</Meta>
          <span className="text-xs font-medium" style={{ color: transit.aspectColor }}>
            {transit.aspectSymbol} {orbLabel(transit.orb)}
          </span>
        </div>
        <Headline size="sm">
          {transit.transitName} {transit.aspectName} {possessive}
        </Headline>

        {!showReading ? (
          <button
            onClick={() => setShowReading(true)}
            className="text-xs text-coral font-medium mt-1 text-right"
          >
            اقرأ القراءة ←
          </button>
        ) : (
          <>
            <Body>{flavor}</Body>
            {natalVoice && (
              <div className="rounded-[14px] bg-cream-soft px-4 py-3 text-[14px] text-ink leading-[1.7] font-serif">
                {natalVoice.obs}
              </div>
            )}
            {feel && <Body muted>{feel}</Body>}
          </>
        )}

        <div className="flex gap-2 mt-1">
          {VOTES.map((v) => (
            <button
              key={v}
              onClick={() => castVote(v)}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-medium transition-colors ${
                vote === v ? 'bg-ink text-cream' : 'bg-cream-soft text-ink-muted hover:bg-sand'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <Link
          href={`/self/aspect/${transit.transitKey}-${transit.natalKey}`}
          className="text-xs text-coral font-medium mt-1"
        >
          اقرأ المزيد ←
        </Link>
      </div>
    </div>
  );
}
