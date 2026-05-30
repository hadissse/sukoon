'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meta } from '@/components/Meta';
import { Rule } from '@/components/Rule';
import { TransitHeroCard } from '@/components/TransitHeroCard';
import { GradientOrb } from '@/components/GradientOrb';
import { getCosmicStamp, type CosmicStamp } from '@/lib/cosmicStamp';
import { syncAllLocalData } from '@/lib/sync';

function SyncPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sukoon.cloud-sync-consent');
    const dismissed = localStorage.getItem('sukoon.sync-prompt-dismissed');
    if (!consent && !dismissed) setShow(true);
  }, []);

  if (!show) return null;

  const enable = async () => {
    localStorage.setItem('sukoon.cloud-sync-consent', 'true');
    setShow(false);
    // Immediately push all local data to Supabase
    await syncAllLocalData();
  };

  const dismiss = () => {
    localStorage.setItem('sukoon.sync-prompt-dismissed', 'true');
    setShow(false);
  };

  return (
    <div className="mx-5 md:mx-0 mt-4 p-4 rounded-[16px] border border-rule-soft bg-white flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink">احفظ خريطتك سحابيًّا</div>
          <div className="text-xs text-ink-muted mt-1 leading-[1.6]">
            فعّل المزامنة للوصول إلى بياناتك من أي جهاز.
          </div>
        </div>
        <button onClick={dismiss} className="text-ink-muted p-1 -m-1 shrink-0" aria-label="إغلاق">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={enable} className="flex-1 py-2 rounded-full bg-coral text-cream text-xs font-semibold">
          تفعيل المزامنة
        </button>
        <Link href="/settings/privacy" onClick={dismiss} className="flex-1 py-2 rounded-full border border-rule-soft text-ink-muted text-xs font-semibold text-center">
          مزيد من المعلومات
        </Link>
      </div>
    </div>
  );
}

// Daily rotating question — advances each day
const DAILY_QUESTIONS = [
  'ما الذي يحتاج منك أن تسمعه اليوم، لا أن تحلّه؟',
  'من أنت حين لا يراك أحد؟',
  'ما الشيء الذي تؤجّله منذ زمن، وما السبب الحقيقي؟',
  'ما الذي تعطيه بسهولة، وما الذي تجد صعوبة في أخذه؟',
  'في أيّ لحظة شعرت اليوم أنك أنت، لا دورك؟',
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
      {/* ── Sky hero — square on mobile, cinematic banner on desktop ── */}
      <div className="relative w-full aspect-square md:aspect-[16/7] overflow-hidden md:rounded-[28px] md:mt-4" style={{ background: '#0F1228' }}>
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

      <SyncPrompt />

      <div className="px-5 md:px-0 flex flex-col gap-4 pt-5 md:pt-6 md:grid md:grid-cols-2 md:gap-5 md:items-start">
        {/* Active transit */}
        <div className="md:col-span-2">
          <TransitHeroCard />
        </div>

        <div className="md:col-span-2">
          <Rule />
        </div>

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

        {/* Knowledge — link to learn section */}
        <Link href="/learn" className="block md:col-span-2">
          <div className="rounded-[20px] p-5" style={{ background: '#F5F0E8', border: '1px solid #E8E2D2' }}>
            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-ink/50 font-semibold tracking-wider">المعرفة</div>
              <div className="font-serif text-[17px] text-ink leading-[1.6]">الأسس · السلاسل · المعلّمون</div>
              <div className="text-xs text-ink-muted leading-[1.7]">تقاليد الفلك الثلاثة — غربي، عربي، روحاني</div>
              <div className="text-xs text-coral font-medium mt-1">استكشف المعرفة ←</div>
            </div>
          </div>
        </Link>

        <div className="md:col-span-2">
          <Rule />
        </div>

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
                <div className="text-sm text-cream/70 mt-2">القمر في خريطتك وصلته بالجسد</div>
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
