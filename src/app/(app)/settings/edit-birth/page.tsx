'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NatalChartSetupForm } from '@/components/onboarding/NatalChartSetupForm';
import type { AstralChart } from '@/lib/chartCalculator';

export default function EditBirthPage() {
  const router = useRouter();

  function handleComplete(_chart: AstralChart) {
    router.push('/settings/profile');
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-cream" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <Link
          href="/settings/profile"
          className="flex items-center gap-1.5 text-ink-muted text-sm"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          رجوع
        </Link>
      </div>

      <div className="px-5 pb-2">
        <h1 className="font-serif text-2xl text-ink">تعديل بيانات الميلاد</h1>
      </div>

      <NatalChartSetupForm onComplete={handleComplete} />
    </div>
  );
}
