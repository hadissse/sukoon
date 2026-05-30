'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AstralChart } from '@/lib/chartCalculator';
import { COURSES } from '@/content/courses';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Chip } from '@/components/Chip';
import { syncJourney } from '@/lib/sync';

const STORAGE_KEY = 'sukoon.journey1.v1';

interface StepProgress {
  stepIndex: number;
  journal: string;
  completed: boolean;
  completedAt?: string;
}

interface Journey1State {
  weekStart: string; // ISO date of Monday
  steps: StepProgress[];
}

function getCurrentWeekMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function loadJourney(): Journey1State {
  if (typeof window === 'undefined') return { weekStart: getCurrentWeekMonday(), steps: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Journey1State;
      // Reset if we're in a new week
      if (parsed.weekStart !== getCurrentWeekMonday()) {
        return { weekStart: getCurrentWeekMonday(), steps: [] };
      }
      return parsed;
    }
  } catch {
    // corrupt state — reset
  }
  return { weekStart: getCurrentWeekMonday(), steps: [] };
}

function saveJourney(state: Journey1State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const STEP_THEMES = [
  { title: 'البداية — من أنا؟', subtitle: 'الشمس في خريطتك', course: 'quiet-path', lesson: 0 },
  { title: 'الجسد — أين أسكن؟', subtitle: 'الطالع والبيت الأول', course: 'gentle-anchors', lesson: 0 },
  { title: 'العقل — كيف أُفكّر؟', subtitle: 'عطارد وبيته', course: 'quiet-path', lesson: 1 },
  { title: 'القلب — كيف أُحبّ؟', subtitle: 'الزهرة في خريطتك', course: 'gentle-anchors', lesson: 1 },
  { title: 'الإرادة — كيف أُريد؟', subtitle: 'المريخ وطاقته', course: 'quiet-path', lesson: 2 },
  { title: 'الظل — ما أتهرّب منه', subtitle: 'البيت الثاني عشر', course: 'gentle-anchors', lesson: 2 },
  { title: 'المراجعة الأسبوعية', subtitle: 'توحيد ما تعلّمت', course: 'quiet-path', lesson: 9 },
];

const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع'];

export default function Journey1Page() {
  const [chart, setChart] = useState<AstralChart | null>(null);
  const [journey, setJourney] = useState<Journey1State>(() => loadJourney());
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [journal, setJournal] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sukoon.primary-chart.v1');
      if (raw) setChart(JSON.parse(raw));
    } catch {
      // no chart
    }
  }, []);

  const getStepStatus = (i: number): 'completed' | 'active' | 'upcoming' => {
    const prog = journey.steps.find((s) => s.stepIndex === i);
    if (prog?.completed) return 'completed';
    const prevDone = i === 0 || journey.steps.find((s) => s.stepIndex === i - 1)?.completed;
    if (prevDone) return 'active';
    return 'upcoming';
  };

  const openStep = (i: number) => {
    const prog = journey.steps.find((s) => s.stepIndex === i);
    setJournal(prog?.journal ?? '');
    setActiveStep(i);
  };

  const completeStep = () => {
    if (activeStep === null) return;
    const updated: Journey1State = {
      ...journey,
      steps: [
        ...journey.steps.filter((s) => s.stepIndex !== activeStep),
        { stepIndex: activeStep, journal, completed: true, completedAt: new Date().toISOString() },
      ],
    };
    saveJourney(updated);
    setJourney(updated);
    setActiveStep(null);
    syncJourney(updated.weekStart, updated);
  };

  const saveJournalDraft = () => {
    if (activeStep === null) return;
    const updated: Journey1State = {
      ...journey,
      steps: [
        ...journey.steps.filter((s) => s.stepIndex !== activeStep),
        { stepIndex: activeStep, journal, completed: false },
      ],
    };
    saveJourney(updated);
    setJourney(updated);
    syncJourney(updated.weekStart, updated);
  };

  const completedCount = journey.steps.filter((s) => s.completed).length;

  // Step detail view — mobile only (hidden on md+)
  if (activeStep !== null) {
    const step = STEP_THEMES[activeStep];
    const course = COURSES.find((c) => c.id === step.course);
    return (
      <div className="pb-32 px-5 pt-4 md:hidden">
        <button
          onClick={() => { saveJournalDraft(); setActiveStep(null); }}
          className="flex items-center gap-1 text-ink-muted mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="text-sm">الرحلة الأسبوعية</span>
        </button>

        <div className="text-xs text-coral font-medium mb-1">الخطوة {ORDINALS[activeStep]}</div>
        <Headline>{step.title}</Headline>
        <Body muted className="mt-1 text-sm">{step.subtitle}</Body>

        {/* Teaching card */}
        {course && (
          <Link href={`/play/${course.id}?lesson=${step.lesson}`} className="block mt-5">
            <Card>
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E9785E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" fill="#E9785E" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-ink-muted">{course.title}</div>
                  <div className="font-serif text-sm text-ink mt-0.5">{course.lessons[step.lesson]}</div>
                </div>
                <span className="text-xs text-ink-muted">استمع ←</span>
              </div>
            </Card>
          </Link>
        )}

        {/* Journal */}
        <div className="mt-5">
          <div className="text-sm text-ink font-medium mb-2">يوميّاتك</div>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="اكتب هنا ما يراودك حول هذا الموضوع…"
            className="w-full min-h-[140px] rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm p-4 placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-coral/20 resize-none leading-[1.8]"
            dir="rtl"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={saveJournalDraft}
            className="flex-1 py-3 rounded-[14px] bg-white border border-rule-soft text-ink text-sm font-medium"
          >
            حفظ مسوّدة
          </button>
          <button
            onClick={completeStep}
            className="flex-1 py-3 rounded-[14px] bg-ink text-cream text-sm font-medium"
          >
            أكملت هذه الخطوة
          </button>
        </div>
      </div>
    );
  }

  // Main journey list view
  return (
    <div className="pb-24 md:max-w-4xl md:mx-auto">
      <div className="px-5 pt-6 pb-2">
        <Headline>الرحلة الأسبوعية</Headline>
        <Body muted className="mt-1 text-sm">
          {completedCount} من {STEP_THEMES.length} خطوات مكتملة هذا الأسبوع
        </Body>
      </div>

      {/* Progress bar */}
      <div className="px-5 mt-3 mb-5">
        <div className="h-1.5 bg-rule-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-coral rounded-full transition-all"
            style={{ width: `${(completedCount / STEP_THEMES.length) * 100}%` }}
          />
        </div>
      </div>

      {!chart && (
        <div className="px-5 mb-4">
          <Card>
            <Body muted className="text-sm text-center">
              أكمل إدراج بياناتك لتُخصَّص الخطوات لخريطتك.{' '}
              <Link href="/onboarding" className="text-coral">ابدأ ←</Link>
            </Body>
          </Card>
        </div>
      )}

      <div className="px-5 md:grid md:grid-cols-[3fr_2fr] md:gap-8 md:items-start md:pt-6">
        {/* Left col: step list */}
        <div className="flex flex-col gap-3">
          {STEP_THEMES.map((step, i) => {
            const status = getStepStatus(i);
            return (
              <div
                key={i}
                onClick={() => status !== 'upcoming' ? openStep(i) : undefined}
                className={`text-right w-full${status === 'upcoming' ? ' opacity-50' : ' cursor-pointer'}`}
              >
                <Card>
                  <div className="flex gap-3 items-center">
                    {/* Status indicator */}
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        background: status === 'completed' ? '#E9785E' : status === 'active' ? '#171B3A' : '#F0F0F0',
                      }}
                    >
                      {status === 'completed' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: status === 'active' ? '#FFFFFF' : '#9A9A9A' }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-serif text-base ${status === 'upcoming' ? 'text-ink-muted' : 'text-ink'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5">{step.subtitle}</div>
                    </div>
                    <Chip active={status === 'active'} className="text-[11px] shrink-0">
                      {status === 'completed' ? 'مكتمل' : status === 'active' ? 'نشط' : 'قادم'}
                    </Chip>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Right col: journal (desktop only) */}
        <div className="md:sticky md:top-24 hidden md:block">
          {activeStep !== null ? (() => {
            const step = STEP_THEMES[activeStep];
            const course = COURSES.find((c) => c.id === step.course);
            return (
              <>
                <div className="text-xs text-coral font-medium mb-1">الخطوة {ORDINALS[activeStep]}</div>
                <div className="font-serif text-base text-ink mb-1">{step.title}</div>
                <div className="text-xs text-ink-muted mb-4">{step.subtitle}</div>

                {course && (
                  <Link href={`/play/${course.id}?lesson=${step.lesson}`} className="block mb-4">
                    <Card>
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E9785E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" fill="#E9785E" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-ink-muted">{course.title}</div>
                          <div className="font-serif text-sm text-ink mt-0.5">{course.lessons[step.lesson]}</div>
                        </div>
                        <span className="text-xs text-ink-muted">استمع ←</span>
                      </div>
                    </Card>
                  </Link>
                )}

                <div className="text-sm text-ink font-medium mb-2">يوميّاتك</div>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="اكتب هنا ما يراودك حول هذا الموضوع…"
                  className="w-full min-h-[140px] rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm p-4 placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-coral/20 resize-none leading-[1.8]"
                  dir="rtl"
                />

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={saveJournalDraft}
                    className="flex-1 py-3 rounded-[14px] bg-white border border-rule-soft text-ink text-sm font-medium"
                  >
                    حفظ مسوّدة
                  </button>
                  <button
                    onClick={completeStep}
                    className="flex-1 py-3 rounded-[14px] bg-ink text-cream text-sm font-medium"
                  >
                    أكملت هذه الخطوة
                  </button>
                </div>
              </>
            );
          })() : (
            <div className="text-sm text-ink-muted text-center py-12 opacity-50">
              اختر خطوة لتبدأ الكتابة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
