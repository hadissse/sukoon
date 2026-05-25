'use client';

// Scr184 — Settings · About (friendly version)

import { useRouter } from 'next/navigation';
import { GradientOrb } from '@/components/GradientOrb';

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="max-w-[430px] mx-auto w-full pb-20">
      <div className="pt-4 px-5 flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="رجوع" className="text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="font-serif text-[22px] text-ink">عن التطبيق</div>
      </div>

      <div className="flex justify-center mt-9">
        <GradientOrb variant="dawn" size={100} />
      </div>

      <div className="px-5 mt-[22px] text-center">
        <div className="font-serif text-[32px] text-ink tracking-tight">سُكون</div>
        <div className="text-[13px] text-ink-muted mt-1">أداةٌ لميدانك الداخلي</div>
      </div>

      <div
        className="mx-5 mt-[26px] p-[18px] bg-white rounded-[14px] text-center"
        style={{ border: '1px solid #E8E2D2' }}
      >
        <div className="text-[11px] text-ink-muted font-semibold tracking-wide">الإصدار</div>
        <div className="font-serif text-[22px] text-ink mt-2">v٠٫٤</div>
        <div className="text-[13px] text-coral mt-1 font-medium">حلقة التأمل اليومية</div>
        <div className="text-[11px] text-ink-muted mt-3 leading-[1.7]">مايو ٢٠٢٦ · بُنيت في بيروت ولشبونة</div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-2.5">
        {['شروط الخدمة', 'سياسة الخصوصية', 'شكر وتقدير', 'رخص المكتبات'].map((t) => (
          <div
            key={t}
            className="bg-white rounded-[14px] px-4 py-3.5 flex justify-between items-center"
            style={{ border: '1px solid #E8E2D2' }}
          >
            <span className="text-sm text-ink">{t}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </div>
        ))}
      </div>

      <div className="px-5 mt-[22px] text-center text-[11px] text-ink-muted leading-[1.7]">
        © ٢٠٢٦ هادي الموسوي · جميع الحقوق محفوظة
      </div>
    </div>
  );
}
