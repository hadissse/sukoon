'use client';

// Scr180 — Nightly backward review (3-moments flow): walk backward through the
// day, naming three moments. Dark, contemplative.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveEvent } from '@/lib/events';
import { syncEvent } from '@/lib/sync';
import { getCosmicStamp } from '@/lib/cosmicStamp';
import type { StreamKey } from '@/lib/events';

const STREAMS: { key: StreamKey; label: string; color: string }[] = [
  { key: 'thinking', label: 'فكر', color: '#7E97B8' },
  { key: 'feeling', label: 'شعور', color: '#D4A04C' },
  { key: 'willing', label: 'إرادة', color: '#E9785E' },
];

const MOMENT_LABELS = ['اللحظة الأولى — قبل قليل', 'اللحظة الثانية — منتصف اليوم', 'اللحظة الثالثة — أوّل اليوم'];

function NightStars({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute top-0 inset-x-0 h-[280px] overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 37) % 380;
        const y = ((i * 53) % 200) + 30;
        const s = (i % 3) + 1;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ insetInlineStart: x, top: y, width: s, height: s, background: 'rgba(255,255,255,0.7)' }}
          />
        );
      })}
    </div>
  );
}

function toArabicNum(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

export default function EveningPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..2
  const [moments, setMoments] = useState<string[]>(['', '', '']);
  const [streams, setStreams] = useState<(StreamKey | null)[]>([null, null, null]);
  const [done, setDone] = useState(false);

  const setMoment = (v: string) =>
    setMoments((prev) => prev.map((m, i) => (i === step ? v : m)));
  const setStream = (k: StreamKey) =>
    setStreams((prev) => prev.map((s, i) => (i === step ? k : s)));

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Save all three moments as events
      const stamp = getCosmicStamp();
      const now = new Date().toISOString();
      moments.forEach((text, i) => {
        if (!text.trim()) return;
        const event = {
          id: `evening-${Date.now()}-${i}`,
          text: text.trim(),
          date: now,
          stream: streams[i],
          rhythm: null,
          placement: { type: 'evening', key: 'evening', label: 'مراجعة مسائية' },
          stamp,
        };
        saveEvent(event);
        syncEvent(event); // fire-and-forget
      });
      setDone(true);
    }
  };

  return (
    <div className="relative min-h-dvh max-w-[430px] mx-auto w-full">
      <NightStars count={20} />

      <div className="relative">
        {/* Progress header */}
        <div className="pt-4 px-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="إغلاق"
            className="text-cream/90 hover:text-cream"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
          <div className="text-[11px] text-coral font-semibold tracking-wide">
            المراجعة المسائية · {toArabicNum(step + 1)} / ٣
          </div>
          {/* progress dots */}
          <div className="flex gap-1.5 mr-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i <= step ? '#E9785E' : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>

        {!done ? (
          <>
            <div className="px-5 mt-[22px]">
              <div className="font-serif text-[26px] text-cream tracking-tight leading-[1.4]">
                امشِ ببطء، إلى الوراء.
              </div>
              <div className="text-sm text-cream/70 mt-2.5 leading-[1.7]">
                من آخر ما حدث اليوم إلى أوّله. ثلاث لحظات تستحقّ أن تُسمّى.
              </div>
            </div>

            <div
              className="mx-5 mt-7 rounded-2xl p-[18px] min-h-[120px]"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div className="text-[11px] text-cream/60 font-semibold tracking-wide">
                {MOMENT_LABELS[step]}
              </div>
              <textarea
                value={moments[step]}
                onChange={(e) => setMoment(e.target.value)}
                dir="rtl"
                autoFocus
                placeholder="سَمِّ اللحظة بسطرٍ واحد."
                className="w-full mt-2.5 bg-transparent font-serif italic text-[18px] text-cream leading-[1.7] focus:outline-none resize-none placeholder:text-cream/35"
                rows={2}
              />
            </div>

            {/* stream selector */}
            <div className="px-5 mt-4 flex gap-2">
              {STREAMS.map((s) => {
                const sel = streams[step] === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStream(s.key)}
                    className="flex-1 py-2.5 rounded-full text-center"
                    style={{
                      background: sel ? s.color : 'rgba(255,255,255,0.06)',
                      border: sel ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: sel ? '#171B3A' : '#FFFFFF' }}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-5 mt-10">
              <button
                onClick={next}
                disabled={moments[step].trim().length === 0}
                className="w-full h-[52px] rounded-[26px] bg-cream text-ink text-base font-medium disabled:opacity-40"
              >
                {step < 2 ? 'اللحظة التالية' : 'أنهِ المراجعة'}
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 mt-12 text-center">
            <div
              className="mx-auto w-[110px] h-[110px] rounded-full"
              style={{ background: 'radial-gradient(circle at 35% 35%, #3A4490, #1B1F47)' }}
            />
            <div className="font-serif text-[28px] text-cream mt-7 tracking-tight">طابت ليلتك.</div>
            <div className="text-sm text-cream/70 mt-2.5 leading-[1.7]">
              ثلاث لحظات سُمّيت. تنام الآن وقد عُدتَ يومك إلى الوراء.
            </div>
            <div className="mt-7">
              <button
                onClick={() => router.push('/today')}
                className="w-full h-[52px] rounded-[26px] bg-cream text-ink text-base font-medium"
              >
                تمّ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
