'use client';

// Quotes / wisdom (Scr70-74). Standalone full-screen flow.
// Default: cyclable quote cards (70-72). ?v=intention (73) · ?v=wisdom (74).

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientOrb } from '@/components/GradientOrb';
import {
  PrimaryBtn,
  SecondaryBtn,
  FlowTopBar,
  HeartIcon,
  MoreIcon,
} from '@/components/learn/primitives';

const QUOTES: { text: string; attr: string; variant: string }[] = [
  { text: 'علاج القلق أن تجلس معه.', attr: 'قراءة اليوم', variant: 'dawn' },
  { text: 'حيثما أنت، هناك نقطة البداية.', attr: 'قراءة اليوم', variant: 'sage' },
  { text: 'العقل الهادئ ليس عقلًا فارغًا.', attr: 'قراءة اليوم', variant: 'lake' },
];

function QuotesInner() {
  const router = useRouter();
  const params = useSearchParams();
  const v = params.get('v');
  const close = () => router.back();
  const [idx, setIdx] = useState(0);

  // ── Scr73: intention ──
  if (v === 'intention') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-6 pt-14 relative">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-sm text-coral font-semibold mt-3">نيّة اليوم</div>
        <div className="font-serif text-[30px] mt-3 leading-[1.4]">أن أمشي أبطأ ممّا يطلبه اليوم منّي.</div>
        <div className="mt-6 bg-white p-[18px] rounded-[16px] border border-sand text-sm text-ink-muted leading-[1.8]">
          النيّة ليست هدفًا. هي شمالٌ هادئ — شيء تعود إليه حين يسحبك اليوم بعيدًا.
        </div>
        <div className="absolute bottom-14 inset-x-5">
          <PrimaryBtn href="/today">ابدأ يومك</PrimaryBtn>
        </div>
      </div>
    );
  }

  // ── Scr74: wisdom reading (dark) ──
  if (v === 'wisdom') {
    return (
      <div className="min-h-dvh bg-midnight text-cream max-w-[430px] mx-auto w-full px-6 pt-14">
        <FlowTopBar onClose={close} dark />
        <div className="text-xs font-semibold opacity-65 mt-4">حكمة · قراءة دقيقة واحدة</div>
        <div className="font-serif text-[26px] mt-3 leading-[1.4]">عن العودة</div>
        <div className="text-[15px] mt-4 leading-[1.9] opacity-85">
          الفكرة ليست أن نمنع العقل من التشتّت — هذا سوء فهم. الممارسة أن <em className="italic">نلاحظ</em> التشتّت، برفق، ونعود. العودة هي الممارسة.
          <br /><br />
          ستعود مئة مرّة في عشر دقائق. هذا ليس فشلًا. هي مئة فعل صغير من الانتباه.
        </div>
      </div>
    );
  }

  // ── Scr70-72: quote card ──
  const q = QUOTES[idx];
  return (
    <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-6 pt-14 relative">
      <FlowTopBar
        onClose={close}
        right={
          <div className="flex gap-3.5 text-ink-muted">
            <button aria-label="حفظ"><HeartIcon /></button>
            <MoreIcon />
          </div>
        }
      />
      <GradientOrb variant={q.variant} size={120} className="mx-auto my-8" />
      <button onClick={() => setIdx((i) => (i + 1) % QUOTES.length)} className="block w-full text-center">
        <div className="font-serif italic text-[26px] text-ink leading-[1.5]">&ldquo;{q.text}&rdquo;</div>
        <div className="text-[13px] text-ink-muted mt-[18px]">— {q.attr}</div>
      </button>
      <div className="absolute bottom-14 inset-x-5 flex gap-2.5">
        <SecondaryBtn>حفظ</SecondaryBtn>
        <PrimaryBtn href="/play/quiet-path">تأمّل</PrimaryBtn>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white" />}>
      <QuotesInner />
    </Suspense>
  );
}
