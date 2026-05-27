'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ParaPart, TransitEssay } from './transitData';
import { syncTransitFeedback } from '@/lib/sync';

function Para({ parts }: { parts: ParaPart[] }) {
  return (
    <p className="text-[14.5px] text-ink leading-[1.95] mb-3.5 text-justify">
      {parts.map((p, i) =>
        typeof p === 'string' ? <span key={i}>{p}</span> : <em key={i}>{p.em}</em>
      )}
    </p>
  );
}

function Sub({ children }: { children: string }) {
  return (
    <div className="text-[11px] text-coral font-bold tracking-wide mt-[18px] mb-2">{children}</div>
  );
}

export function TransitEssayView({ essay }: { essay: TransitEssay }) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    syncTransitFeedback({ transitId: essay.slug, transitType: 'essay', rating: rating ?? undefined, reflection: reflection || undefined });
    setSaved(true);
  };

  return (
    <div className="max-w-[430px] mx-auto w-full pb-8">
      {/* header */}
      <div className="pt-4 px-5 flex justify-between items-center">
        <button onClick={() => router.back()} aria-label="إغلاق" className="text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
        <div className="flex gap-3.5 text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-7-4.5-9.5-9.5C.5 7 4 3 7.5 3c2 0 3.5 1 4.5 2.5C13 4 14.5 3 16.5 3 20 3 23.5 7 21.5 11.5 19 16.5 12 21 12 21z" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.6" fill="#171B3A" />
            <circle cx="12" cy="12" r="1.6" fill="#171B3A" />
            <circle cx="19" cy="12" r="1.6" fill="#171B3A" />
          </svg>
        </div>
      </div>

      <div className="px-5 mt-4 flex items-center gap-3.5">
        <div
          className="w-14 h-14 rounded-[28px] bg-cream-soft flex items-center justify-center shrink-0"
        >
          <div className="w-8 h-8" style={{ WebkitMaskImage: `url('/svg/${essay.svgKey}.svg')`, maskImage: `url('/svg/${essay.svgKey}.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: essay.color }} />
        </div>
        <div>
          <div className="font-serif text-[22px] text-ink leading-[1.3]">{essay.title}</div>
          <div className="text-xs text-ink-muted mt-1">{essay.sub}</div>
        </div>
      </div>

      <div className="flex gap-3.5 px-5 mt-3 text-[11px] text-ink-soft tracking-wide font-mono">
        <span>قراءة · {essay.readTime}</span>
        <span className="opacity-50">—</span>
        <span>{essay.words} كلمة</span>
      </div>


      <div className="px-5 pt-2">
        {essay.blocks.map((b, i) => {
          if ('sub' in b) return <Sub key={i}>{b.sub}</Sub>;
          if ('para' in b) return <Para key={i} parts={b.para} />;
          if ('callout' in b)
            return (
              <div
                key={i}
                className="mt-3.5 mb-1 p-2.5 bg-coral rounded-xl text-cream text-xs font-medium text-center"
              >
                {b.callout}
              </div>
            );
          return (
            <div key={i} className="mt-3.5 p-3.5 bg-cream-soft rounded-xl text-xs text-ink-soft leading-[1.7]">
              {b.note}
            </div>
          );
        })}
      </div>

      <div className="px-5 mt-[18px] pb-6">
        <div className="p-4 bg-white rounded-[16px] border border-rule-soft">
          <div className="text-xs text-ink-muted font-semibold tracking-wide mb-3">هل ينطبق هذا عليك الآن؟</div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: rating === n ? '#E9785E' : '#F8F8F8',
                  color: rating === n ? '#fff' : '#5C5C7A',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="اكتب ملاحظتك..."
            className="w-full h-[80px] rounded-xl bg-cream-soft border border-rule-soft px-3.5 py-2.5 text-sm text-ink resize-none focus:outline-none focus:border-coral"
            dir="rtl"
          />
          <button
            onClick={handleSave}
            disabled={saved}
            className="mt-3 w-full h-[48px] rounded-[24px] text-base font-medium transition-colors"
            style={{ background: saved ? '#8FA084' : '#171B3A', color: '#F5F2EA' }}
          >
            {saved ? 'حُفظ' : 'احفظ تأمّلك'}
          </button>
        </div>
      </div>
    </div>
  );
}
