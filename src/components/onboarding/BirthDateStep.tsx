'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BirthDateStepProps {
  initialData: {
    year: number;
    month: number;
    day: number;
  };
  onComplete: (date: { year: number; month: number; day: number }) => void;
}

export function BirthDateStep({ initialData, onComplete }: BirthDateStepProps) {
  const [year, setYear] = useState(initialData.year.toString());
  const [month, setMonth] = useState(initialData.month.toString().padStart(2, '0'));
  const [day, setDay] = useState(initialData.day.toString().padStart(2, '0'));
  const router = useRouter();

  const handleContinue = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      alert('الرجاء إدخال تاريخ صحيح');
      return;
    }

    onComplete({ year: y, month: m, day: d });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-5 py-12">
      <div className="w-full max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-ink-muted hover:text-ink transition-colors"
        >
          رجوع ›
        </button>

        <h1 className="font-serif text-3xl text-ink mb-2">متى وُلدت؟</h1>
        <p className="text-sm text-ink-muted mb-8">
          تاريخ ميلادك بالتقويم الميلادي
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {/* Year Input */}
          <div>
            <label className="block text-xs text-ink-muted font-semibold mb-2">
              السنة
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
            >
              <option value="">اختر السنة</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Input */}
          <div>
            <label className="block text-xs text-ink-muted font-semibold mb-2">
              الشهر
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
            >
              <option value="">اختر الشهر</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m.toString().padStart(2, '0')}>
                  {m.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          {/* Day Input */}
          <div>
            <label className="block text-xs text-ink-muted font-semibold mb-2">
              اليوم
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
            >
              <option value="">اختر اليوم</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d.toString().padStart(2, '0')}>
                  {d.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 rounded-[14px] bg-ink text-cream font-medium transition-colors hover:bg-ink-soft disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!year || !month || !day}
        >
          متابعة
        </button>
      </div>
    </div>
  );
}
