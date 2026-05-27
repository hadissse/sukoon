'use client';

import { useState, useEffect } from 'react';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';

function CloudSyncToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem('sukoon.cloud-sync-consent') === 'true');
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      localStorage.setItem('sukoon.cloud-sync-consent', 'true');
    } else {
      localStorage.removeItem('sukoon.cloud-sync-consent');
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-ink">مزامنة الخريطة سحابيًّا</div>
        <div className="text-xs text-ink-muted mt-0.5">يتيح الوصول من أجهزة متعددة</div>
      </div>
      <button
        onClick={toggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-coral' : 'bg-rule-soft'}`}
        aria-label="تبديل المزامنة السحابية"
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: enabled ? 'translateX(-1.25rem)' : 'translateX(-0.125rem)' }}
        />
      </button>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="py-4">
      <SettingsSubHeader title="سياسة الخصوصية" />
      <div className="px-5 flex flex-col gap-4 text-sm text-ink-muted leading-[1.8] mt-2">
        <p>
          خصوصيتك أساسٌ في سُكون. تُحفظ بيانات ميلادك وخريطتك وأحداثك على جهازك أولًا،
          ولا تُشارك دون إذنك.
        </p>
        <p>
          قبل تسجيل الدخول: تُحسب خريطتك محليًّا ولا تُرسل إلى أي خادم.
        </p>
        <p>
          بعد تسجيل الدخول مع تفعيل المزامنة: تُحفَظ خريطتك وبياناتها الفلكية على خوادم آمنة لتتمكّن من الوصول إليها من أجهزة متعددة.
        </p>
        <p>
          يمكنك تصدير بياناتك أو حذفها في أي وقت من شاشة «البيانات».
        </p>
        <div className="border-t border-sand pt-2">
          <CloudSyncToggle />
        </div>
        <p className="text-ink">
          باستخدامك سُكون فأنت توافق على هذه السياسة. نحدّثها عند الحاجة وننبّهك بأي تغيير جوهري.
        </p>
      </div>
    </div>
  );
}
