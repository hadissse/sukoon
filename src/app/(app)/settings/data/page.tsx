'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { Card } from '@/components/Card';
import { Body } from '@/components/Body';
import { signOut } from '@/lib/auth';

function collectSukoonData(): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sukoon.')) out[k] = localStorage.getItem(k) || '';
  }
  return out;
}

export default function DataPage() {
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  const handleExport = () => {
    const data = collectSukoonData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sukoon-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!window.confirm('سيُحذف كل ما سجّلته: خريطتك وأحداثك ومعايراتك. لا يمكن التراجع. متابعة؟')) return;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sukoon.')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    signOut(); // clear Supabase session (fire-and-forget)
    setCleared(true);
  };

  return (
    <div className="py-4">
      <SettingsSubHeader title="البيانات" />
      <div className="px-5 flex flex-col gap-3">
        <button onClick={handleExport} className="text-right">
          <Card>
            <div className="flex flex-col gap-1">
              <div className="font-serif text-lg text-ink">تصدير بياناتك</div>
              <Body muted>نزّل نسخةً من خريطتك وأحداثك ومعايراتك بصيغة JSON.</Body>
            </div>
          </Card>
        </button>

        <button onClick={handleClear} className="text-right">
          <div className="rounded-[18px] bg-white border border-coral/30 p-4">
            <div className="flex flex-col gap-1">
              <div className="font-serif text-lg text-coral">حذف كل البيانات</div>
              <Body muted>يمسح كل ما سجّلته على هذا الجهاز. لا يمكن التراجع.</Body>
            </div>
          </div>
        </button>

        {cleared && (
          <div className="mt-2 p-4 rounded-[14px] bg-cream-soft border border-rule-soft text-center flex flex-col gap-3">
            <Body>تم حذف بياناتك.</Body>
            <button onClick={() => router.push('/onboarding')} className="text-coral text-sm font-medium">
              ابدأ من جديد ←
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
