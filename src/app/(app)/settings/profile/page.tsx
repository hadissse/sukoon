'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { loadEvents } from '@/lib/events';

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export default function ProfilePage() {
  const [stats, setStats] = useState({ events: 0, calibrations: 0, hasChart: false });

  useEffect(() => {
    let calibrations = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sukoon.calibration.')) calibrations++;
    }
    setStats({
      events: loadEvents().length,
      calibrations,
      hasChart: !!localStorage.getItem('sukoon.primary-chart.v1'),
    });
  }, []);

  const cells = [
    [toArabicDigits(stats.events), 'أحداث مسجّلة'],
    [toArabicDigits(stats.calibrations), 'معايرات'],
    [stats.hasChart ? 'نعم' : '—', 'خريطتك'],
  ];

  return (
    <div className="py-4 md:max-w-lg md:mx-auto">
      <SettingsSubHeader title="الملف الشخصي" />
      <div className="px-5 flex items-center gap-3.5 mt-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: '#F8D6BE' }}>
          <span className="font-serif text-2xl text-cream">س</span>
        </div>
        <div>
          <div className="font-serif text-[22px] text-ink">رفيق سُكون</div>
          <div className="text-[13px] text-ink-muted mt-0.5">حسابٌ محلي على هذا الجهاز</div>
        </div>
      </div>
      <div className="mx-5 mt-6 rounded-[18px] bg-white border border-rule-soft p-[18px]">
        <div className="flex justify-between md:gap-12">
          {cells.map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-serif text-[26px] text-ink">{n}</div>
              <div className="text-[11px] text-ink-muted mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {stats.hasChart && (
        <div className="mx-5 mt-4">
          <Link
            href="/settings/edit-birth"
            className="flex items-center justify-between p-4 rounded-[14px] bg-white border border-rule-soft"
          >
            <span className="text-sm text-ink">تعديل بيانات الميلاد</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
