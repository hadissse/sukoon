'use client';

// Course / series overview list — tab-level screen (Header + TabBar from (app)).
// Covers: Scr49 (الأسس / foundations), Scr94 (السلاسل والدورات), Scr93 (المعلمون).

import { useState } from 'react';
import Link from 'next/link';
import { GradientTile, ChevronEnd, SearchIcon } from '@/components/learn/primitives';
import { GRADS } from '@/components/learn/primitives';
import { FOUNDATIONS, SERIES, TEACHERS } from '@/content/courses';

type Tab = 'foundations' | 'series' | 'teachers';

const SERIES_FILTERS = ['الكل', 'للمبتدئين', 'التوتر', 'النوم', 'التركيز', 'الذات'];

export default function LearnPage() {
  const [tab, setTab] = useState<Tab>('foundations');

  return (
    <div className="pb-28">
      {/* heading */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <h1 className="font-serif text-[28px] text-ink -tracking-[0.5px]">تعلّم</h1>
        <Link href="/search" className="text-ink-muted hover:text-ink">
          <SearchIcon />
        </Link>
      </div>

      {/* segmented tabs */}
      <div className="px-5 mt-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {([
          ['foundations', 'الأسس'],
          ['series', 'السلاسل والدورات'],
          ['teachers', 'المعلمون'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium whitespace-nowrap transition-colors ${
              tab === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scr49 — foundations grid */}
      {tab === 'foundations' && (
        <div className="px-5 mt-5">
          <p className="text-sm text-ink-muted">ابدأ من هنا. ثبّت الأساس.</p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {FOUNDATIONS.map(([t, s, v, id]) => (
              <GradientTile
                key={t}
                title={t}
                subtitle={s}
                variant={v}
                height={180}
                href={`/learn/${id}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scr94 — series & courses */}
      {tab === 'series' && (
        <div className="mt-4">
          <div className="px-5 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {SERIES_FILTERS.map((c, i) => (
              <span
                key={c}
                className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap ${
                  i === 0 ? 'bg-ink text-cream' : 'bg-white text-ink border border-sand'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="px-5 mt-5 md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-3">
            {SERIES.map((s) => (
              <Link
                key={s.id}
                href={`/learn/${s.id}`}
                className="bg-white rounded-[16px] p-3.5 border border-sand flex gap-3.5 md:flex-row"
              >
                <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-[12px] shrink-0" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="font-serif text-[17px] text-ink">{s.title}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{s.sub}</div>
                  {s.progress > 0 && (
                    <div className="mt-3">
                      <div className="h-1 rounded-full bg-sand overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.progress}%`,
                            background: s.progress === 100 ? '#8FA084' : '#E9785E',
                          }}
                        />
                      </div>
                      <div className="text-[11px] text-ink-muted mt-1.5">
                        {s.progress === 100 ? 'مكتملة' : `${s.progress}% مكتملة`}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Scr93 — teachers grid */}
      {tab === 'teachers' && (
        <div className="px-5 mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEACHERS.map((t) => (
            <div key={t.name} className="rounded-[16px] bg-white border border-sand p-3.5">
              <div
                className="w-[60px] h-[60px] rounded-full"
                style={{ background: `linear-gradient(135deg, ${GRADS[t.variant][0]}, ${GRADS[t.variant][1]})` }}
              />
              <div className="font-serif text-[17px] text-ink mt-3">{t.name}</div>
              <div className="text-xs text-ink-muted mt-0.5">{t.count}</div>
              <div className="text-xs text-ink-muted mt-0.5">{t.blurb}</div>
            </div>
          ))}
        </div>
      )}

      {/* "new this week" link (Scr92) */}
      <div className="px-5 mt-7">
        <Link
          href="/learn/new"
          className="flex items-center justify-between bg-cream-soft rounded-[14px] px-4 py-3.5"
        >
          <span className="text-sm text-ink font-medium">الجديد هذا الأسبوع</span>
          <ChevronEnd className="text-ink-muted" />
        </Link>
      </div>
    </div>
  );
}
