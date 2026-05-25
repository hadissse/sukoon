'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meta } from '@/components/Meta';
import { Rule } from '@/components/Rule';
import { TodayHeader } from '@/components/TodayHeader';
import { TransitHeroCard } from '@/components/TransitHeroCard';
import { GradientOrb } from '@/components/GradientOrb';
import { getCosmicStamp, type CosmicStamp } from '@/lib/cosmicStamp';

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

  return (
    <div className="pb-24 flex flex-col gap-0">
      {/* ── Sky hero banner ── */}
      <div className="relative overflow-hidden px-5 pt-6 pb-5" style={{ background: '#0F1228' }}>
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => {
            const x = (i * 41) % 380;
            const y = ((i * 57) % 160) + 10;
            const s = (i % 3) + 1;
            return (
              <div key={i} className="absolute rounded-full" style={{ left: x, top: y, width: s, height: s, background: `rgba(255,255,255,${0.3 + (i % 3) * 0.2})` }} />
            );
          })}
        </div>
        <div className="absolute -top-12 -left-12 opacity-50 pointer-events-none">
          <GradientOrb variant="night" size={180} />
        </div>
        <div className="relative">
          <TodayHeader />
          {stamp && (
            <div className="mt-4">
              <div className="text-[11px] text-cream/50 font-semibold tracking-wider mb-1.5">السماء الآن</div>
              <div className="font-serif text-xl text-cream leading-snug">{stamp.moonPhase}</div>
              <div className="text-xs text-cream/60 mt-1">{stamp.sunPosition} · {stamp.dayRuler}</div>
              <Link href="/explore" className="inline-block mt-3 text-xs text-coral font-medium">
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
            <div className="absolute -top-8 -right-8 opacity-30">
              <GradientOrb variant="dawn" size={120} />
            </div>
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

        <Rule />

        {/* Body + moon — lake/blue box */}
        <Link href="/self" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #C2D3E2 0%, #A8C0D6 100%)' }}>
            <div className="absolute -top-6 -right-6 opacity-40">
              <GradientOrb variant="lake" size={110} />
            </div>
            <div className="relative">
              <div className="text-[11px] text-ink/60 font-semibold tracking-wider mb-2">الجسد والقمر</div>
              <div className="font-serif text-[17px] text-ink">
                {stamp ? `القمر في ${stamp.moonPhase.split(' في ')[1] ?? 'السماء'}` : 'القمر والجسد'}
              </div>
              <div className="text-xs text-ink/60 mt-1.5">انتبه إلى ما يحتاجه جسدك اليوم</div>
              <div className="text-xs text-ink/50 mt-3 font-medium">افتح خريطتك ←</div>
            </div>
          </div>
        </Link>

        {/* Teaching — ember/amber box */}
        <Link href="/learn" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #F0C8A0 0%, #E0B080 100%)' }}>
            <div className="absolute -bottom-6 -right-6 opacity-30">
              <GradientOrb variant="ember" size={100} />
            </div>
            <div className="relative">
              <div className="text-[11px] text-ink/60 font-semibold tracking-wider mb-2">تعلّم</div>
              <div className="font-serif text-[17px] text-ink">كيف تقرأ عبورك اليومي؟</div>
              <div className="text-xs text-ink/60 mt-1.5">ربط السماء بلحظتك الحياتية</div>
              <div className="text-xs text-ink/50 mt-3 font-medium">استكشف الدروس ←</div>
            </div>
          </div>
        </Link>

        {/* Evening reflection — dark box */}
        <Link href="/evening" className="block">
          <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: '#0F1228' }}>
            <div className="absolute -top-6 -right-6 opacity-40 pointer-events-none">
              <GradientOrb variant="night" size={100} />
            </div>
            <div className="relative flex items-center gap-4">
              <div>
                <div className="text-[11px] text-cream/50 font-semibold tracking-wider mb-2">قبل النوم</div>
                <div className="font-serif text-[17px] text-cream">المراجعة المسائية</div>
                <div className="text-xs text-cream/55 mt-1.5">ثلاث لحظات من يومك</div>
              </div>
              <div className="mr-auto">
                <span className="text-coral text-sm">←</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
