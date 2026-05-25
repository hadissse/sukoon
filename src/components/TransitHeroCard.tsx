'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Meta } from '@/components/Meta';
import type { AstralChart } from '@/lib/chartCalculator';
import { calculateTransits, orbLabel, type Transit } from '@/lib/transits';

const ASPECT_GLOSS: Record<string, string> = {
  اقتران: 'يلتقيان في نقطة واحدة — تتكثّف طاقتهما معًا وتطلب انتباهك.',
  سُداس: 'زاوية ميسّرة تفتح فرصةً لطيفة إن بادرت إليها.',
  تربيع: 'توتّرٌ يطلب فعلًا — احتكاكٌ يدفعك إلى النمو لا إلى الجمود.',
  تثليث: 'انسجامٌ يسري بسهولة — وقتٌ ملائم للثقة بما تحمله دون أن تحكم عليه.',
  تقابل: 'قطبان يتواجهان — يدعوك إلى التوازن بين طرفين فيك.',
};

const VOTES = ['دافئ', 'هادئ', 'محرّك', 'ساكن'];

export function TransitHeroCard() {
  const [transit, setTransit] = useState<Transit | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [vote, setVote] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const voteKey = `sukoon.vote.transit.${today}`;

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        const chart: AstralChart = JSON.parse(stored);
        const transits = calculateTransits(chart);
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
          <Meta>العبور</Meta>
          <Body muted>لا توجد عبورات قوية اليوم — أو لم تُحمّل خريطتك بعد.</Body>
        </div>
      </Card>
    );
  }

  if (!transit) {
    return (
      <Card>
        <Meta>العبور</Meta>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Meta>العبور الأقوى الآن</Meta>
          <span className="text-xs text-coral font-medium">{transit.aspectSymbol} {orbLabel(transit.orb)}</span>
        </div>
        <Headline size="sm">
          {transit.transitName} {transit.aspectName} {transit.natalName}
        </Headline>
        <Body>{ASPECT_GLOSS[transit.aspectName] ?? 'عبورٌ نشطٌ يلامس خريطتك الآن.'}</Body>
        <div className="flex gap-2 mt-2">
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
    </Card>
  );
}
