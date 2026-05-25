'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 text-center gap-5" dir="rtl">
      <div className="w-16 h-16 rounded-full bg-cream-soft flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E9785E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="font-serif text-xl text-ink">حدث خطأ ما</div>
      <div className="text-sm text-ink-muted">لم نتمكّن من تحميل هذه الصفحة.</div>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-[14px] bg-ink text-cream text-sm font-medium"
      >
        حاول مجدّدًا
      </button>
    </div>
  );
}
