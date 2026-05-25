'use client';

// EXPLORE depth — chip-filtered catalogue (Scr85-90) + topic detail (Scr91).
// Tab-level screen (Header + TabBar from (app)).

import { useState } from 'react';
import Link from 'next/link';
import { GradientTile, SearchIcon, HeartIcon } from '@/components/learn/primitives';
import {
  EXPLORE_CHIPS,
  EXPLORE_CARDS,
  EXPLORE_DEFAULT,
  STRESS_DETAIL,
} from '@/content/exploreDepth';

export default function ExploreDepthPage() {
  const [chip, setChip] = useState('مختارات');
  const [detail, setDetail] = useState(false);
  const cards = EXPLORE_CARDS[chip] ?? EXPLORE_DEFAULT;

  // Scr91 — topic detail (التوتر والإرهاق)
  if (detail) {
    return (
      <div className="pb-28">
        <div className="px-5 pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setDetail(false)} className="text-ink-muted hover:text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
            <h1 className="font-serif text-[26px] text-ink">التوتر والإرهاق</h1>
          </div>
          <p className="text-sm text-ink-muted mt-2">٣٤ جلسة لأيام الكتفين المشدودتين.</p>
        </div>
        <div className="px-5 mt-5">
          <GradientTile title="ضبط يوم مشدود" subtitle="مختارة · ٥ دقائق" variant="dawn" height={200} />
        </div>
        <h2 className="px-5 mt-6 font-serif text-xl text-ink">جلسات منفردة</h2>
        <div className="px-5 mt-3 flex flex-col gap-2.5">
          {STRESS_DETAIL.map(([t, d]) => (
            <div key={t} className="bg-white rounded-[14px] p-3 border border-sand flex gap-3 items-center">
              <div className="w-[50px] h-[50px] rounded-lg bg-[#F8D6BE] shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-ink font-medium">{t}</div>
                <div className="text-xs text-ink-muted mt-0.5">{d}</div>
              </div>
              <button aria-label="حفظ" className="text-ink-muted">
                <HeartIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="px-5 pt-4 flex items-center justify-between">
        <h1 className="font-serif text-[30px] text-ink -tracking-[0.5px]">اكتشف</h1>
        <Link href="/search" className="text-ink-muted hover:text-ink">
          <SearchIcon />
        </Link>
      </div>

      {/* chips */}
      <div className="px-5 py-[18px] flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {EXPLORE_CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            className={`px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap ${
              c === chip ? 'bg-ink text-cream' : 'bg-white text-ink border border-sand'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {cards.map(([t, s, v], i) => (
          <button
            key={`${t}-${i}`}
            onClick={() => chip === 'التوتر' && setDetail(true)}
            className="block text-start"
          >
            <GradientTile title={t} subtitle={s} variant={v} height={180} />
          </button>
        ))}
      </div>

      {chip !== 'التوتر' && (
        <p className="px-5 mt-5 text-xs text-ink-muted text-center">
          اختر &ldquo;التوتر&rdquo; لعرض تفصيل الموضوع.
        </p>
      )}
    </div>
  );
}
