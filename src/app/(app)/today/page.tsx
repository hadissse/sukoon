'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meta } from '@/components/Meta';
import { Rule } from '@/components/Rule';
import { TransitHeroCard } from '@/components/TransitHeroCard';
import { GradientOrb } from '@/components/GradientOrb';
import { getCosmicStamp, type CosmicStamp } from '@/lib/cosmicStamp';
import { findPhase as findLunarPhase } from '@/content/lunarJourney';

// Daily rotating question — advances each day
const DAILY_QUESTIONS = [
  'ما الذي يحتاج منك أن تسمعه اليوم — لا أن تحلّه؟',
  'من أنت حين لا يراك أحد؟',
  'ما الشيء الذي تؤجّله منذ زمن — وما السبب الحقيقي؟',
  'ما الذي تعطيه بسهولة، وما الذي تجد صعوبة في أخذه؟',
  'في أيّ لحظة شعرت اليوم أنك أنت — لا دورك؟',
  'ما الذي ينمو فيك الآن في الصمت؟',
  'ما الحاجة التي لم تقلها بعد؟',
];

function getDailyQuestion(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}

export default function TodayPage() {
  const [stamp, setStamp] = useState<CosmicStamp | null>(null);
  const [journey1Step, setJourney1Step] = useState<number | null>(null);

  useEffect(() => {
    setStamp(getCosmicStamp());
    try {
      const raw = localStorage.getItem('sukoon.journey1.v1');
      if (raw) {
        const data = JSON.parse(raw);
        setJourney1Step(data.currentStep ?? 0);
      }
    } catch {}
  }, []);

  const question = getDailyQuestion();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء الخير';

  return (
    <div className="pb-24 flex flex-col gap-0">
      {/* ── Sky hero — square full-bleed ── */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: '#0F1228' }}>
        <img src="/media/blob-purple.webp" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(15,18,40,0.60) 0%, rgba(15,18,40,0) 42%, rgba(15,18,40,0.78) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <h1 className="font-serif text-3xl text-cream">{greeting}</h1>
          {stamp && (
            <div>
              <div className="text-[11px] text-cream/55 font-semibold tracking-wider mb-2">السماء الآن</div>
              <div className="font-serif text-2xl text-cream leading-snug">{stamp.moonPhase}</div>
              <div className="text-sm text-cream/70 mt-1.5">{stamp.sunPosition} · {stamp.dayRuler}</div>
              <Link href="/explore" className="inline-block mt-4 text-xs text-coral font-medium">
                استكشف السماء ←
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 pt-5">
        {/* Active transit */}
        <TransitHeroCard />

        <Rule />

        {/* Daily question — coral-tinted box */}
        <Link href="/log" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #F8D6BE 0%, #F0C0A0 100%)' }}>
            <img src="/media/sun-rings.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" style={{ mixBlendMode: 'multiply' }} />
            <div className="relative">
              <div className="text-[11px] text-coral font-semibold tracking-wider mb-2">سؤال اليوم</div>
              <div className="font-serif text-[17px] text-ink leading-[1.6]">{question}</div>
              <div className="text-xs text-ink-muted mt-3 font-medium">سجّل إجابتك ←</div>
            </div>
          </div>
        </Link>

        {/* Journey card — sage/green box */}
        <Link href="/journey-1" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #C9D2BE 0%, #B8C4AC 100%)' }}>
            <div className="absolute -bottom-8 -left-8 opacity-30">
              <GradientOrb variant="sage" size={120} />
            </div>
            <div className="relative">
              <div className="text-[11px] text-ink/60 font-semibold tracking-wider mb-2">رحلتك الأسبوعية</div>
              {journey1Step !== null ? (
                <>
                  <div className="font-serif text-[17px] text-ink">الخطوة {journey1Step + 1} من ٧</div>
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{ background: i <= journey1Step ? '#171B3A' : 'rgba(23,27,58,0.2)' }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-ink/60 mt-2 font-medium">تابع ←</div>
                </>
              ) : (
                <>
                  <div className="font-serif text-[17px] text-ink">ابدأ المسار الأسبوعي</div>
                  <div className="text-xs text-ink-muted mt-1.5">سبع خطوات عبر خريطتك الداخلية</div>
                  <div className="text-xs text-ink/60 mt-3 font-medium">ابدأ ←</div>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Lunar journey — current moon phase prompt */}
        {stamp && (() => {
          const phase = findLunarPhase(stamp.moonPhase);
          return (
            <Link href="/journey-lunar" className="block">
              <div
                className="relative rounded-[20px] overflow-hidden p-5"
                style={{ background: phase.accent + '18', borderColor: phase.accent + '44', borderWidth: 1 }}
              >
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: phase.accent }} />
                    <div className="text-[11px] font-semibold tracking-wider" style={{ color: phase.accent }}>
                      الرحلة القمريّة · {phase.name}
                    </div>
                  </div>
                  <div className="font-serif text-[16px] text-ink leading-[1.7]">{phase.arcTitle}</div>
                  <div className="text-xs text-ink-muted leading-[1.7]">{phase.essence}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: phase.accent }}>تابع المرحلة ←</div>
                </div>
              </div>
            </Link>
          );
        })()}

        <Rule />

        {/* Body + moon — square full-bleed */}
        <Link href="/self" className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-[20px]" style={{ background: '#0D1B2A' }}>
            <img src="/media/moon-water.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.74) 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="text-[11px] text-cream/60 font-semibold tracking-wider">الجسد والقمر</div>
              <div>
                <div className="font-serif text-2xl text-cream leading-snug">
                  {stamp ? `القمر في ${stamp.moonPhase.split(' في ')[1] ?? 'السماء'}` : 'القمر والجسد'}
                </div>
                <div className="text-sm text-cream/70 mt-2">انتبه إلى ما يحتاجه جسدك اليوم</div>
                <div className="text-xs text-coral font-medium mt-3">افتح خريطتك ←</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Teaching — square full-bleed */}
        <Link href="/learn" className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-[20px]" style={{ background: '#1A0C00' }}>
            <img src="/media/match-flame.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.74) 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="text-[11px] text-cream/60 font-semibold tracking-wider">تعلّم</div>
              <div>
                <div className="font-serif text-2xl text-cream leading-snug">كيف تقرأ عبورك اليومي؟</div>
                <div className="text-sm text-cream/70 mt-2">ربط السماء بلحظتك الحياتية</div>
                <div className="text-xs text-coral font-medium mt-3">استكشف الدروس ←</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Evening reflection — square full-bleed */}
        <Link href="/evening" className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-[20px]" style={{ background: '#0F1228' }}>
            <img src="/media/moon-flames.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.74) 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="text-[11px] text-cream/60 font-semibold tracking-wider">قبل النوم</div>
              <div>
                <div className="font-serif text-2xl text-cream leading-snug">المراجعة المسائية</div>
                <div className="text-sm text-cream/70 mt-2">ثلاث لحظات من يومك</div>
                <div className="text-xs text-coral font-medium mt-3">ابدأ المراجعة ←</div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
