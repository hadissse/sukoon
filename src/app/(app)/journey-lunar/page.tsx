'use client';

import { useEffect, useState } from 'react';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Meta } from '@/components/Meta';
import { Card } from '@/components/Card';
import { getCosmicStamp } from '@/lib/cosmicStamp';
import { LUNAR_PHASES, findPhase, type LunarPhase } from '@/content/lunarJourney';

const STORAGE_PREFIX = 'sukoon.lunar.v1.';

function loadJournal(key: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_PREFIX + key) ?? '';
  } catch {
    return '';
  }
}

function saveJournal(key: string, text: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, text);
  } catch {
    // ignore
  }
}

export default function JourneyLunarPage() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [journal, setJournalText] = useState('');
  const [saved, setSaved] = useState(false);

  const stamp = getCosmicStamp();
  const currentPhase = findPhase(stamp.moonPhase);
  // Activate the user's current phase by default — first visit lands on
  // whatever the sky is showing right now, not on the first phase of the cycle.
  const active: LunarPhase = activeKey
    ? LUNAR_PHASES.find((p) => p.key === activeKey) ?? currentPhase
    : currentPhase;

  useEffect(() => {
    setJournalText(loadJournal(active.key));
    setSaved(false);
  }, [active.key]);

  const handleSave = () => {
    saveJournal(active.key, journal);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-3">
        <Meta>الرحلة القمرية</Meta>
        <Headline>{active.arcTitle}</Headline>
        <Body muted className="mt-1 text-sm">
          {active.name} · {active.duration}
        </Body>
      </div>

      {/* Current phase hero card */}
      <div className="px-5">
        <div
          className="relative rounded-[20px] overflow-hidden p-5"
          style={{ background: active.accent + '18', borderColor: active.accent + '44', borderWidth: 1 }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full shrink-0"
                style={{ background: active.accent }}
              />
              <div>
                <div className="text-[11px] font-semibold tracking-wider" style={{ color: active.accent }}>
                  {active.key === currentPhase.key ? 'الآن في السماء' : 'مرحلة'}
                </div>
                <div className="font-serif text-base text-ink">{active.name}</div>
              </div>
            </div>
            <div className="font-serif text-[16px] text-ink leading-[1.75]">
              {active.essence}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt + journal */}
      <div className="px-5 mt-4">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold tracking-wider text-ink-muted">سؤال هذه المرحلة</div>
            <div className="font-serif text-[16px] text-ink leading-[1.7]">{active.prompt}</div>
            <textarea
              value={journal}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="اكتب ما يخطر — قليلًا أو كثيرًا، لا فرق."
              rows={6}
              className="w-full mt-2 p-3 rounded-[14px] bg-cream-soft border border-rule-soft text-[15px] text-ink leading-[1.8] focus:outline-none focus:border-coral resize-none"
              dir="rtl"
            />
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-full bg-ink text-cream text-sm font-medium"
              >
                احفظ
              </button>
              {saved && <span className="text-xs text-coral">حُفِظ</span>}
            </div>
          </div>
        </Card>
      </div>

      {/* Practice */}
      <div className="px-5 mt-4">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold tracking-wider text-ink-muted">ممارسة اليوم</div>
            <Body>{active.practice}</Body>
          </div>
        </Card>
      </div>

      {/* All 8 phases — let the user wander through the full cycle */}
      <div className="px-5 mt-6">
        <Meta>الدورة الكاملة</Meta>
        <div className="mt-3 flex flex-col gap-2">
          {LUNAR_PHASES.map((p) => {
            const isActive = p.key === active.key;
            const isCurrent = p.key === currentPhase.key;
            return (
              <button
                key={p.key}
                onClick={() => setActiveKey(p.key)}
                className={`flex items-center gap-3 p-3 rounded-[16px] border text-right transition-colors ${
                  isActive ? 'bg-cream-soft border-coral' : 'bg-white border-rule-soft hover:border-ink-muted'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0"
                  style={{ background: p.accent }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-sm text-ink">{p.arcTitle}</div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    {p.name} · {p.duration}
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-[10px] font-medium text-coral whitespace-nowrap">الآن</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
