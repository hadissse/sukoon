'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AstralChart } from '@/lib/chartCalculator';
import { getCosmicStamp } from '@/lib/cosmicStamp';
import { saveEvent, STREAM_AR, type LoggedEvent, type StreamKey } from '@/lib/events';
import { syncEvent } from '@/lib/sync';

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
};

const ASPECT_SYMBOLS: { angle: number; symbol: string; orb: number }[] = [
  { angle: 0, symbol: '☌', orb: 8 },
  { angle: 60, symbol: '⚹', orb: 6 },
  { angle: 90, symbol: '□', orb: 8 },
  { angle: 120, symbol: '△', orb: 8 },
  { angle: 180, symbol: '☍', orb: 8 },
];

interface Suggestion {
  type: string;
  key: string;
  label: string;
  when: string;
}

function topAspectSuggestions(chart: AstralChart | null): Suggestion[] {
  if (!chart) return [];
  const keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
  const found: { slug: string; label: string; orb: number }[] = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = chart[keys[i]];
      const b = chart[keys[j]];
      const sep = Math.abs(((a.longitude - b.longitude + 180) % 360) - 180);
      for (const asp of ASPECT_SYMBOLS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= asp.orb) {
          found.push({
            slug: `${keys[i]}-${keys[j]}`,
            label: `${PLANET_AR[keys[i]]} ${asp.symbol} ${PLANET_AR[keys[j]]}`,
            orb,
          });
          break;
        }
      }
    }
  }
  return found
    .sort((x, y) => x.orb - y.orb)
    .slice(0, 3)
    .map((f) => ({ type: 'aspect', key: f.slug, label: f.label, when: 'في خريطتك' }));
}

// Build "By Key" planet-in-sign placement suggestions from the natal chart.
function planetPlacementSuggestions(chart: AstralChart | null): Suggestion[] {
  if (!chart) return [];
  const personalKeys = ['sun', 'moon', 'mercury', 'venus', 'mars'] as const;
  return personalKeys.map((key) => {
    const p = chart[key];
    return {
      type: 'planet',
      key,
      label: `${PLANET_AR[key]} في ${p.sign}`,
      when: `${String(p.degree).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])}° ${p.sign}`,
    };
  });
}

function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 py-3.5 rounded-[14px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-3.5 rounded-[14px] bg-white border border-rule-soft text-ink text-sm font-medium hover:bg-cream-soft transition-colors"
    >
      {children}
    </button>
  );
}

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function LogFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [date] = useState(new Date());
  const [stream, setStream] = useState<StreamKey | null>(null);
  const [rhythm, setRhythm] = useState<number | null>(null);
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [savedEvent, setSavedEvent] = useState<LoggedEvent | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        setChart(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const suggestions = useMemo(() => {
    const aspects = topAspectSuggestions(chart);
    const planets = planetPlacementSuggestions(chart);
    const base = [...aspects, ...planets];
    const qType = searchParams.get('type');
    const qKey = searchParams.get('key');
    const qLabel = searchParams.get('label');
    if (qType && qKey && !base.some((s) => s.type === qType && s.key === qKey)) {
      base.unshift({ type: qType, key: qKey, label: qLabel ?? qKey, when: 'من التأثيرات النشطة' });
    }
    return base;
  }, [chart, searchParams]);

  // Auto-select placement from query params on first load
  useEffect(() => {
    const qType = searchParams.get('type');
    const qKey = searchParams.get('key');
    const qLabel = searchParams.get('label');
    if (qType && qKey && selected === null) {
      setSelected({ type: qType, key: qKey, label: qLabel ?? qKey, when: 'من التأثيرات النشطة' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateLabel = new Intl.DateTimeFormat('ar', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);

  const streams: [StreamKey, string, string][] = [
    ['thinking', 'هل ظهرت لك معرفة؟ هل اتّضح شيء؟', '#7E97B8'],
    ['feeling', 'هل مرّت بك موجة؟ هل اتسع شيءٌ أو انقبض؟', '#D4A04C'],
    ['willing', 'هل فعلتَ، أم تحرّك الفعل بك؟', '#E9785E'],
  ];

  const handleSave = () => {
    const event: LoggedEvent = {
      id: `evt_${Date.now()}`,
      text: text.trim() || '—',
      date: date.toISOString(),
      stream,
      rhythm,
      placement: selected ? { type: selected.type, key: selected.key, label: selected.label } : null,
      stamp: getCosmicStamp(date),
    };
    saveEvent(event);
    syncEvent(event); // fire-and-forget cloud sync
    setSavedEvent(event);
    setStep(5);
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[430px] mx-auto w-full">
      {/* Progress header */}
      <div className="pt-4 px-5">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} aria-label="إغلاق" className="text-ink-muted hover:text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="text-[11px] text-coral font-semibold tracking-wide">{toArabicDigits(step)} / ٥</div>
        </div>
        <div className="mt-3 h-[3px] bg-rule-soft rounded-full overflow-hidden">
          <div className="h-full bg-coral transition-all" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 px-5">
        {/* Stage 1: what happened */}
        {step === 1 && (
          <div className="mt-6">
            <div className="font-serif text-[28px] text-ink tracking-tight">ماذا حدث؟</div>
            <div className="text-sm text-ink-muted mt-2">سطر واحدٌ يكفي. لا تشرح، سَمِّ.</div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir="rtl"
              autoFocus
              placeholder="قرارٌ صعب جاء في لقاءٍ قصير."
              className="w-full mt-6 bg-white rounded-[16px] border border-rule-soft p-4 min-h-[120px] font-serif text-[18px] text-ink leading-[1.7] focus:outline-none focus:ring-1 focus:ring-coral/20 placeholder:text-ink-muted"
            />
            <div className="mt-3.5 flex justify-between items-center">
              <span className="text-[13px] text-ink-muted">التاريخ</span>
              <span className="text-sm text-ink font-medium">{dateLabel}</span>
            </div>
          </div>
        )}

        {/* Stage 2: stream */}
        {step === 2 && (
          <div className="mt-6">
            <div className="font-serif text-[26px] text-ink tracking-tight leading-snug">في أيّ مجرى سرى الحدث؟</div>
            <div className="text-[13px] text-ink-muted mt-2 leading-[1.7]">اختر الأقرب. لا توجد إجابة خاطئة.</div>
            <div className="mt-[18px] flex flex-col gap-2.5">
              {streams.map(([key, hint, color]) => {
                const sel = stream === key;
                return (
                  <button
                    key={key}
                    onClick={() => setStream(key)}
                    className="text-right rounded-[14px] p-3.5 flex gap-3.5 items-center transition-colors"
                    style={{
                      background: sel ? `${color}22` : '#fff',
                      border: sel ? `1.5px solid ${color}` : '1px solid #E5E1D8',
                    }}
                  >
                    <div className="w-9 h-9 rounded-full shrink-0" style={{ background: color }} />
                    <div className="flex-1">
                      <div className="font-serif text-[18px] text-ink">{STREAM_AR[key]}</div>
                      <div className="text-xs text-ink-muted mt-1 leading-[1.5]">{hint}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 3: rhythm */}
        {step === 3 && (
          <div className="mt-6">
            <div className="font-serif text-[26px] text-ink tracking-tight leading-snug">كيف كان الإيقاع؟</div>
            <div className="text-[13px] text-ink-muted mt-2">اختياري. يمكنك تخطّيه.</div>
            <div className="mt-8">
              <div className="flex justify-between mb-3.5">
                <span className="text-[13px] font-medium" style={{ color: '#E9785E' }}>حرارة</span>
                <span className="text-[13px] font-medium" style={{ color: '#7E97B8' }}>حديد</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={rhythm ?? 50}
                onChange={(e) => setRhythm(Number(e.target.value))}
                className="w-full accent-ink"
              />
              <div className="flex justify-between mt-2.5">
                <span className="text-[11px] text-ink-muted">توسّع · فتح</span>
                <span className="text-[11px] text-ink-muted">انقباض · حسم</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: placement */}
        {step === 4 && (
          <div className="mt-6">
            <div className="font-serif text-[26px] text-ink tracking-tight leading-snug">مع أيّ موضع تربطه؟</div>
            <div className="text-[13px] text-ink-muted mt-2 leading-[1.7]">اقتراحاتٌ من السماء النشطة. اختر أو أضف.</div>
            <div className="mt-[18px] flex flex-col gap-2.5">
              {suggestions.length === 0 && (
                <div className="text-sm text-ink-muted text-center py-4">لا توجد اقتراحات — احفظ خريطتك أولًا.</div>
              )}
              {suggestions.map((s) => {
                const sel = selected?.type === s.type && selected?.key === s.key;
                return (
                  <button
                    key={`${s.type}:${s.key}`}
                    onClick={() => setSelected(sel ? null : s)}
                    className="text-right rounded-[14px] p-3.5 flex justify-between items-center transition-colors"
                    style={{
                      background: sel ? '#F5F2EA' : '#fff',
                      border: sel ? '1.5px solid #E9785E' : '1px solid #E5E1D8',
                    }}
                  >
                    <div>
                      <div className="font-serif text-base text-ink">{s.label}</div>
                      <div className="text-xs text-ink-muted mt-1">{s.when}</div>
                    </div>
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: sel ? '#E9785E' : 'transparent', border: sel ? 'none' : '1.5px solid #E5E1D8' }}
                    >
                      {sel && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 5: saved */}
        {step === 5 && savedEvent && (
          <div className="mt-10 text-center">
            <div className="mx-auto w-[120px] h-[120px] rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #C9D2BE, #8FA084)' }} />
            <div className="font-serif text-[28px] text-ink tracking-tight mt-6">تمّ التسجيل.</div>
            <div className="text-sm text-ink-muted mt-2.5 leading-[1.7]">
              {savedEvent.placement ? (
                <>سيبقى هذا الحدث مرتبطًا بـ <span className="text-ink font-medium">{savedEvent.placement.label}</span> ويعود إليك حين يلتقيا ثانية.</>
              ) : (
                <>حُفظ الحدث مع ختمه الفلكي.</>
              )}
            </div>
            <div className="mt-[22px] p-3.5 rounded-[14px] bg-white border border-rule-soft text-right">
              <div className="text-[11px] text-ink-muted font-semibold tracking-wide">الختم الفلكي</div>
              <div className="mt-2 flex flex-col gap-1.5">
                {[
                  ['يوم الكوكب', savedEvent.stamp.dayRuler],
                  ['طور القمر', savedEvent.stamp.moonPhase],
                  ['درجة الشمس', savedEvent.stamp.sunPosition],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-xs text-ink-muted">{k}</span>
                    <span className="text-xs text-ink font-serif">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="px-5 py-6 flex gap-2.5 safe-bottom">
        {step === 1 && <PrimaryBtn onClick={() => setStep(2)} disabled={text.trim().length === 0}>متابعة</PrimaryBtn>}
        {step === 2 && <PrimaryBtn onClick={() => setStep(3)} disabled={!stream}>متابعة</PrimaryBtn>}
        {step === 3 && (
          <>
            <SecondaryBtn onClick={() => { setRhythm(null); setStep(4); }}>تخطّي</SecondaryBtn>
            <PrimaryBtn onClick={() => setStep(4)}>متابعة</PrimaryBtn>
          </>
        )}
        {step === 4 && <PrimaryBtn onClick={handleSave}>متابعة</PrimaryBtn>}
        {step === 5 && <PrimaryBtn onClick={() => router.push('/self')}>تمّ</PrimaryBtn>}
      </div>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <LogFlow />
    </Suspense>
  );
}
