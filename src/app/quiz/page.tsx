'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBack,
  IconBell,
  IconCheck,
  Orb,
  PALETTE,
  PrimaryBtn,
  ProgressBar,
} from '@/components/onboarding/PreAppUI';
import { syncQuiz } from '@/lib/sync';

/**
 * /quiz — pre-app onboarding quiz covering design screens Scr19–Scr33.
 *
 *   Q1..Q10  Scr19–28   selectable option cards (some multi-select)
 *   notify   Scr29      notifications permission card
 *   loading  Scr30      "نُعدّ خطّتك" progress
 *   plan     Scr31      personalised plan summary
 *   trial    Scr32      free-trial timeline
 *   reminder Scr33      trial-reminder bottom sheet → routes to /onboarding
 *
 * Answers persist to localStorage key `sukoon.quiz`. No backend / no real
 * subscription — trial screens are local UI only.
 */

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: string[];
  multi?: boolean;
}

// Scr19–28 — exact copy from the design.
// Questions feed the trait engine: element/modality/HD centre inclinations.
const QUESTIONS: Question[] = [
  {
    id: 'element_pull',
    title: 'أيّ صورة تستهويك أكثر؟',
    subtitle: 'اختر ما يلامسك — لا إجابة خاطئة.',
    options: ['النار — الاندفاع والبدايات', 'التراب — البناء والثبات', 'الهواء — الفكر والتواصل', 'الماء — الشعور والعمق'],
  },
  {
    id: 'modality',
    title: 'كيف تتعامل مع التغيير؟',
    options: ['أُشعل التغيير وأبدأه', 'أُثبّت ما بُني وأصونه', 'أتكيّف وأجد طرقًا جديدة'],
  },
  {
    id: 'energy_source',
    title: 'من أين تأتي طاقتك؟',
    options: ['من داخلي — أحتاج وقتًا بمفردي', 'من الآخرين — أزدهر في التواصل', 'يتفاوت — حسب اليوم والمزاج'],
  },
  {
    id: 'decision_style',
    title: 'كيف تتخذ قراراتك؟',
    options: ['أتبع ما يقوله عقلي', 'أتبع ما يقوله قلبي', 'أنتظر حتى يستقرّ الشعور', 'أتصرّف ثم أفكّر'],
  },
  {
    id: 'body_wisdom',
    title: 'كيف تعرف أن شيئًا ما صحيح؟',
    options: ['أشعر به في جسدي', 'أرى منطقه بوضوح', 'أعرف دون أن أعرف كيف', 'أحتاج إلى التجربة أولًا'],
  },
  {
    id: 'life_theme',
    title: 'ما الموضوع الذي يتكرّر في حياتك؟',
    subtitle: 'اختر ما يُصدمك بالتعرّف.',
    multi: true,
    options: ['الهوية — من أنا حقًّا؟', 'العلاقات — كيف أُحبّ وأُحَبّ؟', 'القوة — كيف أؤثّر في العالم؟', 'المعنى — لماذا أنا هنا؟', 'الحرية — كيف أعيش بصدق؟'],
  },
  {
    id: 'shadow_pattern',
    title: 'أيّ نمط تعيد تكراره رغمك؟',
    options: ['أتحكّم أكثر مما ينبغي', 'أفقد نفسي في الآخرين', 'أؤجّل ما يهمّني فعلًا', 'أشعل النزاعات دون قصد'],
  },
  {
    id: 'growth_edge',
    title: 'ما أصعب شيء تتعلّمه الآن؟',
    options: ['الانتظار دون قلق', 'طلب المساعدة', 'وضع حدود واضحة', 'الاعتراف بما أشعر به'],
  },
  {
    id: 'hd_authority',
    title: 'عندما تواجه قرارًا صعبًا، ما الذي تثق به أكثر؟',
    options: ['رأيي بعد التفكير العميق', 'ما يشعر به قلبي في اللحظة', 'ما يقوله جسدي', 'الانتظار حتى تتضح الصورة'],
  },
  {
    id: 'astro_entry',
    title: 'ما بابك إلى معرفة نفسك؟',
    options: ['الخريطة الفلكية والكواكب', 'الأرقام والأنماط', 'الأحلام والرموز', 'المشاعر اليومية وتتبّعها'],
  },
];

type Phase = 'questions' | 'notify' | 'loading';

export default function QuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('questions');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const persist = (next: Record<string, string[]>) => {
    setAnswers(next);
    try {
      localStorage.setItem('sukoon.quiz', JSON.stringify(next));
    } catch {
      // localStorage unavailable — ignore (UI-only flow).
    }
  };

  const question = QUESTIONS[qIndex];
  const selected = answers[question?.id] ?? [];

  const toggleOption = (opt: string) => {
    if (!question) return;
    const current = answers[question.id] ?? [];
    let next: string[];
    if (question.multi) {
      next = current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt];
    } else {
      next = [opt];
    }
    persist({ ...answers, [question.id]: next });
  };

  const nextQuestion = () => {
    if (qIndex >= QUESTIONS.length - 1) {
      setPhase('notify');
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const backQuestion = () => {
    if (qIndex === 0) {
      router.push('/welcome');
    } else {
      setQIndex((i) => i - 1);
    }
  };

  // Brief "preparing" animation → onboarding. Sync quiz answers to Supabase.
  useEffect(() => {
    if (phase === 'loading') {
      syncQuiz();
      const t = setTimeout(() => router.push('/onboarding'), 2400);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  return (
    <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col relative" dir="rtl">
      {/* ── Scr19–28: Questions ── */}
      {phase === 'questions' && question && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-6 pt-[60px]">
            <div className="flex items-center justify-between h-11">
              <button type="button" onClick={backQuestion} aria-label="رجوع">
                <IconBack />
              </button>
              <ProgressBar value={Math.round(((qIndex + 1) / QUESTIONS.length) * 100)} />
              <button type="button" onClick={nextQuestion} className="text-sm text-ink-muted">
                تخطّي
              </button>
            </div>
            <h1 className="font-serif text-[28px] text-ink mt-7 leading-[1.3]">{question.title}</h1>
            {question.subtitle && <p className="text-sm text-ink-muted mt-2">{question.subtitle}</p>}

            <div className="mt-6 flex flex-col gap-2.5">
              {question.options.map((opt) => {
                const sel = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleOption(opt)}
                    className="h-14 rounded-[14px] px-[18px] flex items-center justify-between text-base font-medium transition-colors"
                    style={{
                      background: sel ? PALETTE.ink : '#fff',
                      color: sel ? PALETTE.cream : PALETTE.ink,
                      border: `1px solid ${sel ? PALETTE.ink : '#E8E2D2'}`,
                    }}
                  >
                    <span>{opt}</span>
                    {question.multi && (
                      <span
                        className="w-[22px] h-[22px] rounded-md flex items-center justify-center"
                        style={{
                          border: `1.5px solid ${sel ? PALETTE.cream : '#E8E2D2'}`,
                          background: sel ? PALETTE.cream : 'transparent',
                        }}
                      >
                        {sel && <IconCheck color={PALETTE.ink} />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-5 pb-14">
            <PrimaryBtn onClick={nextQuestion} disabled={selected.length === 0 && !question.multi}>
              متابعة
            </PrimaryBtn>
          </div>
        </div>
      )}

      {/* ── Scr29: Notifications permission ── */}
      {phase === 'notify' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-6 pt-[60px]">
            <div className="h-11" />
            <div className="flex justify-center mt-6">
              <Orb variant="sage" size={120} />
            </div>
            <h1 className="font-serif text-[26px] text-ink mt-[30px] text-center">ابقَ قريبًا من ممارستك</h1>
            <p className="text-sm text-ink-muted mt-2.5 leading-[1.7] text-center">
              تنبيه لطيف — مرّة في اليوم، إن أردتَه فقط.
            </p>
            <div className="mt-[30px] bg-white rounded-2xl p-5 border" style={{ borderColor: '#E8E2D2' }}>
              <div className="flex items-center gap-3">
                <IconBell />
                <div className="flex-1">
                  <div className="font-medium text-[15px]">تذكير يومي</div>
                  <div className="text-[13px] text-ink-muted mt-0.5">7:00 صباحًا، أيام الأسبوع</div>
                </div>
                <div className="w-11 h-[26px] rounded-[13px] relative" style={{ background: PALETTE.ink }}>
                  <div className="absolute right-0.5 top-0.5 w-[22px] h-[22px] rounded-full" style={{ background: PALETTE.cream }} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 pb-14">
            <PrimaryBtn onClick={() => setPhase('loading')}>متابعة</PrimaryBtn>
          </div>
        </div>
      )}

      {/* Loading: brief animation then → /onboarding */}
      {phase === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
          <Orb variant="dawn" size={140} />
          <h1 className="font-serif text-2xl text-ink text-center">نُحسب خريطتك</h1>
          <div className="w-[200px] h-1 rounded-full overflow-hidden" style={{ background: 'rgba(23,27,58,0.1)' }}>
            <div className="h-full quiz-prepare-bar" style={{ background: PALETTE.ink }} />
          </div>
          <p className="text-[13px] text-ink-muted">نُهيّئ ملفّك الفلكي…</p>
          <style>{`
            @keyframes quizPrepare { from { width: 8%; } to { width: 100%; } }
            .quiz-prepare-bar { width: 60%; animation: quizPrepare 2.2s ease-in-out forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
}
