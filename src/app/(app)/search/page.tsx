'use client';

// SEARCH (Scr95-102) — tab-level screen (Header + TabBar from (app)).
// One interactive page covering: default(95), suggestions(96), results(97),
// filters(98), search-by-feeling(99), no-results(100), teacher results(101),
// list view(102).

import { useMemo, useState } from 'react';
import { GradientOrb } from '@/components/GradientOrb';
import {
  SearchIcon,
  CloseIcon,
  ChevronEnd,
  PlayIcon,
  FilterIcon,
  gradientCss,
} from '@/components/learn/primitives';

const RECENT = ['نوم', 'الإفلات', '٥ دقائق', 'تنفّس', 'مايا كول'];
const POPULAR = ['للمبتدئين', '٣ دقائق', 'مسح الجسد', 'المشي', 'حكايات النوم', 'التوتر'];

const SUGGESTIONS = ['حكايات النوم', 'موسيقى النوم', 'نوم للأطفال', 'نوم + توتر', 'قصص النوم'];

const SLEEP_RESULTS: [string, string, string][] = [
  ['المنارة البطيئة', 'حكاية · ٤٥ دقيقة', '#3A4490'],
  ['نوم بلا فشل', 'منفردة · ٣ دقائق', '#5A3E7A'],
  ['مطر ناعم', 'مشهد صوتي', '#C2D3E2'],
  ['من الجسد إلى السرير', 'منفردة · ١٠ دقائق', '#9C8AB8'],
  ['عن النوم', 'سلسلة · ٥ أيام', '#3A4490'],
];

const FEELINGS: [string, string, boolean][] = [
  ['مشدود', 'dawn', false],
  ['متعب', 'dusk', false],
  ['متوتر', 'ember', true],
  ['ضبابي', 'lake', true],
  ['ثقيل', 'night', false],
  ['متّسع', 'sage', true],
  ['قلق', 'dust', true],
  ['رقيق', 'dawn', false],
];

const BREATH_LIST: [string, string][] = [
  ['نَفَس الصندوق', '٥ دقائق'],
  ['تنفّس من خلاله', '١٠ دقائق'],
  ['نَفَس واحد', '٣٠ ث'],
  ['النَفَس مرساة', '٧ دقائق'],
];

const TEACHER_SESSIONS: [string, string][] = [
  ['الدرب الهادئ · اليوم ١', '١٠ دقائق'],
  ['مراسي لطيفة', '٧ دقائق'],
  ['عن العودة', '٥ دقائق'],
];

const FILTER_GROUPS: [string, string[], number][] = [
  ['المدة', ['أقل من ٥ دقائق', '٥–١٠', '١٠–٢٠', '٢٠+'], 1],
  ['النوع', ['تأمل', 'حكاية نوم', 'مشهد صوتي', 'قراءة'], 0],
  ['المعلم', ['أي', 'مايا كول', 'جوناس بارك', 'بريا شاه', 'ثيو ريد'], 1],
];

function ResultRow({ title, sub, color }: { title: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-[14px] p-3 border border-sand flex gap-3 items-center">
      <div className="w-14 h-14 rounded-[10px] shrink-0" style={{ background: color }} />
      <div className="flex-1">
        <div className="text-sm text-ink font-medium">{title}</div>
        <div className="text-xs text-ink-muted mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState(false);
  const [feelings, setFeelings] = useState(false);
  const [filters, setFilters] = useState(false);

  // which result-state to show based on the committed query
  const state = useMemo<'sleep' | 'teacher' | 'breath' | 'empty'>(() => {
    const q = query.trim();
    if (q.includes('نوم')) return 'sleep';
    if (q.includes('مايا')) return 'teacher';
    if (q.includes('تنفّس') || q.includes('نفس')) return 'breath';
    return 'empty';
  }, [query]);

  const showSuggestions = query.trim().length > 0 && !committed;

  // ── Scr98: filters panel ──
  if (filters) {
    return (
      <div className="pb-28 px-5 pt-4 relative min-h-[80vh]">
        <div className="flex justify-between items-center">
          <h1 className="font-serif text-[22px] text-ink">الفلاتر</h1>
          <button className="text-sm text-coral font-medium" onClick={() => setFilters(false)}>إعادة ضبط</button>
        </div>
        <div className="mt-5 flex flex-col gap-[22px]">
          {FILTER_GROUPS.map(([h, opts, sel]) => (
            <div key={h}>
              <div className="text-[13px] text-ink-muted font-semibold mb-3">{h}</div>
              <div className="flex flex-wrap gap-2">
                {opts.map((t, i) => (
                  <span
                    key={t}
                    className={`px-3.5 py-2 rounded-full text-[13px] ${
                      i === sel ? 'bg-ink text-cream' : 'bg-white text-ink border border-sand'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-24 inset-x-0 px-5 max-w-[430px] mx-auto">
          <button
            onClick={() => setFilters(false)}
            className="block w-full text-center py-3.5 rounded-[14px] bg-ink text-cream text-sm font-medium"
          >
            اعرض ٨ نتائج
          </button>
        </div>
      </div>
    );
  }

  // ── Scr99: search by feeling ──
  if (feelings) {
    return (
      <div className="pb-28 px-5 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-[28px] text-ink -tracking-[0.5px]">ابحث بالشعور</h1>
          <button className="text-sm text-coral font-medium" onClick={() => setFeelings(false)}>رجوع</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {FEELINGS.map(([l, v, onLight]) => (
            <div
              key={l}
              className="h-[100px] rounded-[16px] p-4 flex items-end font-serif text-[18px]"
              style={{ background: gradientCss(v), color: onLight ? '#171B3A' : '#FFFFFF' }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 px-5 pt-4">
      {!committed && query.trim().length === 0 && (
        <h1 className="font-serif text-[28px] text-ink mb-3.5 -tracking-[0.5px]">بحث</h1>
      )}

      {/* search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2.5 bg-white rounded-[12px] px-3.5 py-2.5 border border-sand">
          <span className="text-ink-muted"><SearchIcon /></span>
          <input
            dir="rtl"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCommitted(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setCommitted(true)}
            placeholder="بحث"
            className="flex-1 bg-transparent text-[15px] text-ink focus:outline-none placeholder:text-ink-muted"
          />
          {query && (
            <button onClick={() => { setQuery(''); setCommitted(false); }} aria-label="مسح" className="text-ink-muted">
              <CloseIcon size={18} />
            </button>
          )}
        </div>
        {(query || committed) && (
          <button onClick={() => { setQuery(''); setCommitted(false); }} className="text-sm text-coral font-medium shrink-0">
            إلغاء
          </button>
        )}
      </div>

      {/* Scr95 — default (recent + popular + feeling entry) */}
      {!showSuggestions && !committed && query.trim().length === 0 && (
        <div className="mt-6">
          <div className="text-[13px] text-ink-muted font-semibold">الأخيرة</div>
          <div className="mt-3 flex flex-col gap-1.5">
            {RECENT.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); setCommitted(true); }}
                className="py-3 px-1 flex items-center justify-between text-start"
              >
                <span className="text-[15px] text-ink">{t}</span>
                <span className="text-ink-muted"><CloseIcon size={18} /></span>
              </button>
            ))}
          </div>
          <div className="text-[13px] text-ink-muted font-semibold mt-4">الأكثر شيوعًا</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); setCommitted(true); }}
                className="px-4 py-2 rounded-full bg-cream-soft text-ink-soft text-sm hover:bg-sand"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFeelings(true)}
            className="mt-6 w-full flex items-center justify-between bg-cream-soft rounded-[14px] px-4 py-3.5"
          >
            <span className="text-sm text-ink font-medium">ابحث بالشعور</span>
            <ChevronEnd className="text-ink-muted" />
          </button>
        </div>
      )}

      {/* Scr96 — suggestions while typing */}
      {showSuggestions && (
        <div className="mt-5">
          <div className="text-[13px] text-ink-muted font-semibold">اقتراحات</div>
          <div className="mt-3">
            {SUGGESTIONS.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); setCommitted(true); }}
                className="w-full py-3.5 border-b border-sand flex items-center justify-between text-start"
              >
                <span className="text-[15px] text-ink">{t}</span>
                <ChevronEnd className="text-ink-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* committed results */}
      {committed && (
        <div className="mt-5">
          {/* filter trigger */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] text-ink-muted">
              {state === 'sleep' && `١٤ نتيجة لـ "${query.trim()}"`}
              {state === 'breath' && `٨ نتائج لـ "${query.trim()}"`}
              {state === 'teacher' && 'نتائج'}
              {state === 'empty' && ' '}
            </span>
            <button onClick={() => setFilters(true)} className="text-ink-muted" aria-label="الفلاتر">
              <FilterIcon size={20} />
            </button>
          </div>

          {/* Scr97 — card results (sleep) */}
          {state === 'sleep' && (
            <div className="flex flex-col gap-2.5">
              {SLEEP_RESULTS.map(([t, s, c], i) => (
                <ResultRow key={i} title={t} sub={s} color={c} />
              ))}
            </div>
          )}

          {/* Scr101 — teacher results */}
          {state === 'teacher' && (
            <div className="flex flex-col gap-2.5">
              <div className="text-[13px] text-ink-muted font-semibold">المعلمون</div>
              <div className="bg-white rounded-[14px] p-3.5 border border-sand flex gap-3.5 items-center">
                <div className="w-[50px] h-[50px] rounded-full bg-[#C9D2BE]" />
                <div className="flex-1">
                  <div className="text-[15px] text-ink font-medium">مايا كول</div>
                  <div className="text-xs text-ink-muted mt-0.5">١٢ جلسة · دافئة ومتجذّرة</div>
                </div>
                <ChevronEnd className="text-ink-muted" />
              </div>
              <div className="text-[13px] text-ink-muted font-semibold mt-3">الجلسات</div>
              {TEACHER_SESSIONS.map(([t, d]) => (
                <div key={t} className="bg-white rounded-[14px] p-3 border border-sand flex gap-3 items-center">
                  <div className="w-[50px] h-[50px] rounded-[10px] bg-[#F8D6BE]" />
                  <div className="flex-1">
                    <div className="text-sm text-ink font-medium">{t}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{d} · مايا كول</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scr102 — compact list (breath) */}
          {state === 'breath' && (
            <div>
              {BREATH_LIST.map(([t, d]) => (
                <div key={t} className="py-2.5 border-b border-sand flex justify-between items-center">
                  <div>
                    <div className="text-sm text-ink font-medium">{t}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{d}</div>
                  </div>
                  <span className="text-ink"><PlayIcon size={18} /></span>
                </div>
              ))}
            </div>
          )}

          {/* Scr100 — no results */}
          {state === 'empty' && (
            <div className="pt-14 flex flex-col items-center px-8">
              <GradientOrb variant="dust" size={100} />
              <div className="font-serif text-[22px] text-ink mt-6 -tracking-[0.3px]">لا نتائج بعد</div>
              <div className="text-sm text-ink-muted mt-2 text-center leading-[1.6]">جرّب شعورًا، أو مدة، أو اسم معلم.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
