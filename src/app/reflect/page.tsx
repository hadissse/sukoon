'use client';

// Post-session reflection (Scr62-69). Standalone full-screen flow.
// Default: stepped flow  feeling(62) → mood(64) → note(65) → done(63).
// Extra views via ?v=...:  list(66) · days(67) · week(68) · quick(69).

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientOrb } from '@/components/GradientOrb';
import {
  PrimaryBtn,
  FlowTopBar,
  CheckIcon,
} from '@/components/learn/primitives';

const HOW_OPTIONS = [
  'أشعر بهدوء أكبر',
  'مثل ما كنت',
  'كان عقلي مشغولًا',
  'تشتّت انتباهي',
  'لم أكمل',
];

const MOODS: [string, string][] = [
  ['◉', 'مشرق'],
  ['◎', 'ثابت'],
  ['◌', 'ضبابيّ'],
  ['●', 'ثقيل'],
  ['◆', 'متوتّر'],
];

const WEEK_DAYS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

const REFLECTIONS: [string, string, string][] = [
  ['اليوم', 'صباح هادئ. ساعدني الجرس.', 'dawn'],
  ['الأمس', 'شعرت بالقلق — لم أستقرّ.', 'dusk'],
  ['الثلاثاء 5 مايو', 'أفضل. لاحظت التشتّت أسرع.', 'sage'],
  ['الأحد 3 مايو', 'جلسة طويلة. عدتُ أخفّ.', 'lake'],
];

function ReflectInner() {
  const router = useRouter();
  const params = useSearchParams();
  const v = params.get('v');
  const close = () => router.back();

  const [step, setStep] = useState(1);
  const [how, setHow] = useState(0);
  const [mood, setMood] = useState(1);

  // ── Scr66: reflections list ──
  if (v === 'list') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-2xl mt-4">تأمّلات</div>
        <div className="mt-5 flex flex-col gap-2.5">
          {REFLECTIONS.map(([d, t, variant]) => (
            <div key={d} className="bg-white rounded-[14px] p-4 border border-sand flex gap-3.5">
              <GradientOrb variant={variant} size={40} />
              <div>
                <div className="text-xs text-coral font-semibold">{d}</div>
                <div className="text-sm mt-1 leading-[1.7]">{t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Scr67: days saved ──
  if (v === 'days') {
    return (
      <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-8 max-w-[430px] mx-auto w-full">
        <div className="relative w-[200px] h-[200px]">
          <GradientOrb variant="ember" size={200} />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-[72px] text-cream">14</div>
        </div>
        <div className="font-serif text-[28px] mt-6 text-center">14 يومًا، محفوظة</div>
        <div className="text-sm text-ink-muted mt-2.5 text-center">فوزات هادئة، تتراكم.</div>
        <div className="mt-7 w-full">
          <PrimaryBtn href="/today">أكمل المسير</PrimaryBtn>
        </div>
      </div>
    );
  }

  // ── Scr68: this week ──
  if (v === 'week') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-[28px] mt-4">هذا الأسبوع</div>
        <div className="mt-5 bg-white rounded-[16px] p-[18px] border border-sand">
          <div className="flex justify-between">
            {WEEK_DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-2">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center"
                  style={{ background: i < 5 ? '#E9785E' : 'transparent', border: i < 5 ? 'none' : '1.5px solid #F0F0F0' }}
                >
                  {i < 5 && <CheckIcon size={14} className="text-cream" />}
                </div>
                <div className="text-[11px] text-ink-muted">{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-[18px] pt-[18px] border-t border-sand flex justify-between">
            {[['5', 'جلسات'], ['54 د', 'الإجمالي'], ['12', 'يوم متواصل']].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-[22px]">{n}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Scr65 / Scr69: quick note ──
  if (v === 'quick') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <div className="flex items-center justify-between h-11">
          <button onClick={close} aria-label="إغلاق" className="text-ink-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <button onClick={close} className="text-sm text-coral font-medium">حفظ</button>
        </div>
        <div className="font-serif text-2xl mt-4">ملاحظة سريعة</div>
        <div className="text-[13px] text-ink-muted mt-1">عن جلسة اليوم — لك وحدك</div>
        <textarea
          dir="rtl"
          autoFocus
          placeholder="ما الذي يخطر ببالك؟"
          className="w-full mt-5 bg-white rounded-[16px] border border-sand p-4 min-h-[160px] text-[15px] leading-[1.8] focus:outline-none focus:ring-1 focus:ring-coral/20 placeholder:text-ink-muted placeholder:italic"
        />
      </div>
    );
  }

  // ── Stepped flow ──
  // step 1: how it went (62) · step 2: mood (64) · step 3: note (65) · step 4: done (63)
  if (step === 4) {
    return (
      <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-8 max-w-[430px] mx-auto w-full">
        <GradientOrb variant="sage" size={140} />
        <div className="font-serif text-[28px] mt-6 text-center">أمرٌ يستحقّ الانتباه</div>
        <div className="text-sm text-ink-muted mt-2.5 text-center leading-[1.7]">الهدوء شيء صغير، يتراكم بالتكرار.</div>
        <div className="mt-8 w-full">
          <PrimaryBtn href="/today">تمّ</PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14 relative">
      <FlowTopBar onClose={step === 1 ? close : () => setStep((s) => s - 1)} variant={step === 1 ? 'close' : 'back'} />

      {/* step 1 — how it went (Scr62) */}
      {step === 1 && (
        <>
          <GradientOrb variant="dawn" size={100} className="mx-auto my-6" />
          <div className="font-serif text-[28px] text-center">كيف سارت؟</div>
          <div className="text-sm text-ink-muted mt-2 text-center">فحص سريع يساعدنا في رسم ما يليها.</div>
          <div className="mt-7 flex flex-col gap-2.5">
            {HOW_OPTIONS.map((t, i) => (
              <button
                key={t}
                onClick={() => setHow(i)}
                className="text-right bg-white rounded-[14px] px-[18px] py-4 text-[15px]"
                style={{ border: `1.5px solid ${i === how ? '#171B3A' : '#F0F0F0'}` }}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {/* step 2 — mood (Scr64) */}
      {step === 2 && (
        <>
          <div className="font-serif text-2xl mt-4">كيف حالك الآن؟</div>
          <div className="text-sm text-ink-muted mt-2">كلمة واحدة تكفي.</div>
          <div className="mt-7 grid grid-cols-3 gap-2.5">
            {MOODS.map(([emoji, label], i) => (
              <button
                key={label}
                onClick={() => setMood(i)}
                className="aspect-square rounded-[16px] bg-white flex flex-col items-center justify-center gap-2"
                style={{ border: `1.5px solid ${i === mood ? '#171B3A' : '#F0F0F0'}` }}
              >
                <div className="text-[28px]">{emoji}</div>
                <div className="text-[13px] font-medium">{label}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* step 3 — note (Scr65) */}
      {step === 3 && (
        <>
          <div className="font-serif text-2xl mt-4">دوّن ملاحظة</div>
          <div className="text-sm text-ink-muted mt-2">لك وحدك — لن تُشارَك.</div>
          <textarea
            dir="rtl"
            autoFocus
            placeholder="ما الذي يخطر ببالك؟"
            className="w-full mt-5 bg-white rounded-[16px] border border-sand p-4 min-h-[180px] text-[15px] leading-[1.8] focus:outline-none focus:ring-1 focus:ring-coral/20 placeholder:text-ink-muted placeholder:italic"
          />
        </>
      )}

      <div className="absolute bottom-14 inset-x-5">
        <PrimaryBtn onClick={() => setStep((s) => s + 1)}>{step === 3 ? 'حفظ' : 'متابعة'}</PrimaryBtn>
      </div>
    </div>
  );
}

export default function ReflectPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white" />}>
      <ReflectInner />
    </Suspense>
  );
}
