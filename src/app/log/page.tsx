'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AstralChart } from '@/lib/chartCalculator';
import { getCosmicStamp } from '@/lib/cosmicStamp';
import { saveEvent, STREAM_AR, type LoggedEvent, type StreamKey } from '@/lib/events';
import { syncEvent } from '@/lib/sync';
import { SukoonIcon } from '@/components/SukoonIcon';
import { Logo } from '@/components/Logo';

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
};

const ASPECT_SYMBOLS = [
  { angle: 0, orb: 8 }, { angle: 60, orb: 6 },
  { angle: 90, orb: 8 }, { angle: 120, orb: 8 }, { angle: 180, orb: 8 },
];

interface Suggestion { type: string; key: string; label: string; when: string; }

function topAspectSuggestions(chart: AstralChart | null): Suggestion[] {
  if (!chart) return [];
  const keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
  const found: { slug: string; label: string; orb: number }[] = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = chart[keys[i]], b = chart[keys[j]];
      const sep = Math.abs(((a.longitude - b.longitude + 180) % 360) - 180);
      for (const asp of ASPECT_SYMBOLS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= asp.orb) { found.push({ slug: `${keys[i]}-${keys[j]}`, label: `${PLANET_AR[keys[i]]} · ${PLANET_AR[keys[j]]}`, orb }); break; }
      }
    }
  }
  return found.sort((a, b) => a.orb - b.orb).slice(0, 3)
    .map(f => ({ type: 'aspect', key: f.slug, label: f.label, when: 'في خريطتك' }));
}

function planetPlacementSuggestions(chart: AstralChart | null): Suggestion[] {
  if (!chart) return [];
  return (['sun', 'moon', 'mercury', 'venus', 'mars'] as const).map(key => {
    const p = chart[key];
    return { type: 'planet', key, label: `${PLANET_AR[key]} في ${p.sign}`, when: `${String(p.degree).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])}°` };
  });
}

function toArabicDigits(n: string | number) {
  return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

// ── Stream data ───────────────────────────────────────────────────────────────
const STREAMS: [StreamKey, string, string, string][] = [
  ['thinking', 'معرفة', 'هل اتّضح شيء؟ هل ظهرت لك معرفة جديدة؟', '#7E97B8'],
  ['feeling', 'شعور', 'هل مرّت بك موجة؟ هل اتسع شيء أو انقبض؟', '#D4A04C'],
  ['willing', 'فعل', 'هل فعلتَ، أم تحرّك الفعل بك؟', '#E9785E'],
];

// ── Reusable button components ────────────────────────────────────────────────
function Btn({ children, onClick, disabled, variant = 'primary' }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; variant?: 'primary' | 'ghost';
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[54px] rounded-[16px] text-[15px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-1 ${
        variant === 'primary'
          ? 'bg-ink text-cream hover:bg-ink/90 active:scale-[0.98]'
          : 'bg-white/60 border border-rule-soft text-ink hover:bg-white active:scale-[0.98]'
      }`}
    >
      {children}
    </button>
  );
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
    try { const s = localStorage.getItem('sukoon.primary-chart.v1'); if (s) setChart(JSON.parse(s)); } catch {}
  }, []);

  const suggestions = useMemo(() => {
    const base = [...topAspectSuggestions(chart), ...planetPlacementSuggestions(chart)];
    const qType = searchParams.get('type'), qKey = searchParams.get('key'), qLabel = searchParams.get('label');
    if (qType && qKey && !base.some(s => s.type === qType && s.key === qKey))
      base.unshift({ type: qType, key: qKey, label: qLabel ?? qKey, when: 'من التأثيرات النشطة' });
    return base;
  }, [chart, searchParams]);

  useEffect(() => {
    const qType = searchParams.get('type'), qKey = searchParams.get('key'), qLabel = searchParams.get('label');
    if (qType && qKey && selected === null)
      setSelected({ type: qType, key: qKey, label: qLabel ?? qKey, when: 'من التأثيرات النشطة' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateLabel = new Intl.DateTimeFormat('ar', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);

  const handleSave = () => {
    const event: LoggedEvent = {
      id: `evt_${Date.now()}`, text: text.trim() || '—',
      date: date.toISOString(), stream, rhythm,
      placement: selected ? { type: selected.type, key: selected.key, label: selected.label } : null,
      stamp: getCosmicStamp(date),
    };
    saveEvent(event); syncEvent(event); setSavedEvent(event); setStep(5);
  };

  const STEPS = 5;
  const pct = Math.round((step / STEPS) * 100);

  return (
    <div dir="rtl" className="min-h-dvh flex flex-col relative">
      {/* ── Full-bleed animated GIF background ── */}
      <img
        src="/media/auth-bg.gif"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(240,237,230,0.45)' }} />

      <div className="relative flex-1 flex flex-col" style={{ zIndex: 2 }}>

      {/* ── Desktop logo row ── */}
      <div className="hidden md:flex items-center gap-2.5 px-10 pt-8 pb-2">
        <SukoonIcon size={36} />
        <Logo height={18} color="#171B3A" />
      </div>

      {/* ── Centered card (auto-height, not fixed) ── */}
      <div className="flex-1 flex items-start md:items-center justify-center md:py-8 md:px-6">
        <div className="w-full max-w-[540px] mx-auto flex flex-col min-h-dvh md:min-h-0 bg-cream md:rounded-[28px] md:shadow-2xl md:overflow-hidden">

          {/* Header: close + step indicator */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/70 border border-rule-soft flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i + 1 === step ? 20 : 6,
                    height: 6,
                    background: i + 1 <= step ? '#171B3A' : '#E0DBD3',
                  }}
                />
              ))}
            </div>

            <div className="text-[12px] text-ink-muted font-medium w-9 text-left">
              {toArabicDigits(step)}/{toArabicDigits(STEPS)}
            </div>
          </div>

          {/* Thin progress bar */}
          <div className="h-[2px] bg-rule-soft mx-6 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-ink rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          {/* ── Step content ── */}
          <div className="flex-1 px-6 py-6 flex flex-col">

            {/* Step 1 — What happened */}
            {step === 1 && (
              <div className="flex flex-col flex-1">
                <p className="text-[11px] text-ink-muted font-semibold tracking-widest uppercase mb-3">اللحظة</p>
                <h1 className="font-serif text-[32px] text-ink leading-[1.2] mb-1">ماذا حدث؟</h1>
                <p className="text-sm text-ink-muted mb-6">سطرٌ واحد يكفي. لا تشرح، سَمِّ.</p>

                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  dir="rtl"
                  autoFocus
                  placeholder="قرارٌ صعب جاء في لقاءٍ قصير…"
                  className="flex-1 min-h-[160px] w-full bg-white rounded-[20px] border border-rule-soft p-5 font-serif text-[19px] text-ink leading-[1.8] resize-none focus:outline-none focus:ring-2 focus:ring-ink/10 placeholder:text-ink-muted/40 transition-shadow"
                />

                <div className="flex items-center justify-between mt-4 px-1">
                  <span className="text-[12px] text-ink-muted">{dateLabel}</span>
                  <span className="text-[12px] text-ink-muted">{toArabicDigits(text.length)} حرف</span>
                </div>
              </div>
            )}

            {/* Step 2 — Stream */}
            {step === 2 && (
              <div className="flex flex-col flex-1">
                <p className="text-[11px] text-ink-muted font-semibold tracking-widest uppercase mb-3">التيار</p>
                <h1 className="font-serif text-[28px] text-ink leading-[1.25] mb-1">في أيّ مجرى سرى؟</h1>
                <p className="text-sm text-ink-muted mb-6">اختر الأقرب. لا إجابة خاطئة.</p>

                <div className="flex flex-col gap-3">
                  {STREAMS.map(([key, name, hint, color]) => {
                    const sel = stream === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setStream(key)}
                        className="rounded-[18px] p-4 flex items-center gap-4 text-right transition-all active:scale-[0.98]"
                        style={{
                          background: sel ? `${color}18` : '#fff',
                          border: sel ? `2px solid ${color}` : '1.5px solid #E8E2D8',
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
                          style={{ background: sel ? color : `${color}30` }}
                        >
                          {sel && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-[19px] text-ink">{name} · {STREAM_AR[key]}</div>
                          <div className="text-[12px] text-ink-muted mt-0.5 leading-[1.5]">{hint}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 — Rhythm */}
            {step === 3 && (
              <div className="flex flex-col flex-1">
                <p className="text-[11px] text-ink-muted font-semibold tracking-widest uppercase mb-3">الإيقاع</p>
                <h1 className="font-serif text-[28px] text-ink leading-[1.25] mb-1">كيف كان الإيقاع؟</h1>
                <p className="text-sm text-ink-muted mb-8">اختياري — يمكنك تخطّيه.</p>

                {/* Gradient slider track */}
                <div className="rounded-[20px] bg-white border border-rule-soft p-6">
                  <div className="flex justify-between mb-5">
                    <div className="text-center">
                      <div className="text-[13px] font-semibold" style={{ color: '#E9785E' }}>حرارة</div>
                      <div className="text-[11px] text-ink-muted mt-0.5">توسّع · فتح</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[13px] font-semibold" style={{ color: '#7E97B8' }}>حديد</div>
                      <div className="text-[11px] text-ink-muted mt-0.5">انقباض · حسم</div>
                    </div>
                  </div>

                  <div className="relative h-10 flex items-center">
                    <div
                      className="absolute inset-x-0 h-2 rounded-full"
                      style={{ background: 'linear-gradient(to left, #7E97B8, #D4A04C, #E9785E)' }}
                    />
                    <input
                      type="range" min={0} max={100}
                      value={rhythm ?? 50}
                      onChange={e => setRhythm(Number(e.target.value))}
                      className="relative w-full appearance-none bg-transparent cursor-pointer"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>

                  <style>{`
                    input[type=range]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      width: 28px; height: 28px;
                      border-radius: 50%;
                      background: #171B3A;
                      border: 3px solid #F5F2EA;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                      cursor: pointer;
                    }
                    input[type=range]::-moz-range-thumb {
                      width: 28px; height: 28px;
                      border-radius: 50%;
                      background: #171B3A;
                      border: 3px solid #F5F2EA;
                      cursor: pointer;
                    }
                  `}</style>

                  {rhythm !== null && (
                    <div className="text-center mt-3 text-[13px] text-ink-muted">
                      {toArabicDigits(rhythm)}٪
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4 — Placement */}
            {step === 4 && (
              <div className="flex flex-col flex-1">
                <p className="text-[11px] text-ink-muted font-semibold tracking-widest uppercase mb-3">الموضع</p>
                <h1 className="font-serif text-[28px] text-ink leading-[1.25] mb-1">مع أيّ موضع تربطه؟</h1>
                <p className="text-sm text-ink-muted mb-5">اقتراحات من خريطتك. اختر أو تجاوز.</p>

                {suggestions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-ink-muted text-center">لا اقتراحات — أضف خريطتك أولًا.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 overflow-y-auto">
                    {suggestions.map(s => {
                      const sel = selected?.type === s.type && selected?.key === s.key;
                      return (
                        <button
                          key={`${s.type}:${s.key}`}
                          onClick={() => setSelected(sel ? null : s)}
                          className="rounded-[16px] p-4 flex items-center justify-between text-right transition-all active:scale-[0.98]"
                          style={{
                            background: sel ? '#F5F2EA' : '#fff',
                            border: sel ? '2px solid #E9785E' : '1.5px solid #E8E2D8',
                          }}
                        >
                          <div>
                            <div className="font-serif text-[16px] text-ink">{s.label}</div>
                            <div className="text-[12px] text-ink-muted mt-0.5">{s.when}</div>
                          </div>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 ms-3 transition-all"
                            style={{ background: sel ? '#E9785E' : 'transparent', border: sel ? 'none' : '1.5px solid #C8C2B8' }}
                          >
                            {sel && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 5 — Saved */}
            {step === 5 && savedEvent && (
              <div className="flex flex-col flex-1 items-center justify-center text-center gap-5">
                {/* Animated orb */}
                <div
                  className="w-24 h-24 rounded-full"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #C9D2BE 0%, #8FA084 100%)' }}
                />

                <div>
                  <h1 className="font-serif text-[30px] text-ink">تمّ التسجيل</h1>
                  <p className="text-sm text-ink-muted mt-2 leading-[1.7] max-w-[300px]">
                    {savedEvent.placement
                      ? <>سيبقى مرتبطًا بـ <span className="text-ink font-medium">{savedEvent.placement.label}</span> ويعود حين يلتقيا.</>
                      : 'حُفظت اللحظة مع ختمها الفلكي.'}
                  </p>
                </div>

                {/* Cosmic stamp */}
                <div className="w-full rounded-[18px] bg-white border border-rule-soft p-4 text-right">
                  <p className="text-[10px] text-ink-muted font-semibold tracking-widest uppercase mb-3">الختم الفلكي</p>
                  {[
                    ['يوم الكوكب', savedEvent.stamp.dayRuler],
                    ['طور القمر', savedEvent.stamp.moonPhase],
                    ['درجة الشمس', savedEvent.stamp.sunPosition],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1.5 border-b border-rule-soft/50 last:border-0">
                      <span className="text-[13px] text-ink-muted">{k}</span>
                      <span className="text-[13px] text-ink font-serif">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer CTA ── */}
          <div className="px-6 pb-8 pt-2 flex gap-3">
            {step === 1 && <Btn onClick={() => setStep(2)} disabled={text.trim().length === 0}>متابعة ←</Btn>}
            {step === 2 && <Btn onClick={() => setStep(3)} disabled={!stream}>متابعة ←</Btn>}
            {step === 3 && (
              <>
                <Btn variant="ghost" onClick={() => { setRhythm(null); setStep(4); }}>تخطّي</Btn>
                <Btn onClick={() => setStep(4)}>متابعة ←</Btn>
              </>
            )}
            {step === 4 && (
              <>
                <Btn variant="ghost" onClick={handleSave}>تخطّي</Btn>
                <Btn onClick={handleSave}>حفظ اللحظة</Btn>
              </>
            )}
            {step === 5 && <Btn onClick={() => router.push('/journey-2')}>عرض السجل ←</Btn>}
          </div>
        </div>
      </div>
      </div>{/* end zIndex:2 wrapper */}
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-cream" />}>
      <LogFlow />
    </Suspense>
  );
}
