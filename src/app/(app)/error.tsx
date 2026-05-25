'use client';

import { useEffect } from 'react';

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 text-center gap-4" dir="rtl">
      <div className="font-serif text-lg text-ink">لم تُحمَّل الصفحة</div>
      <div className="text-sm text-ink-muted">حاول مجدّدًا أو ارجع للصفحة الرئيسية.</div>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-[14px] bg-ink text-cream text-sm font-medium"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
