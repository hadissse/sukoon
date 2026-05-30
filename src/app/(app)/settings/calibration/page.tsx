'use client';

import { useEffect, useState } from 'react';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { Body } from '@/components/Body';

const TYPE_AR: Record<string, string> = {
  planet: 'كوكب',
  sign: 'برج',
  house: 'بيت',
  aspect: 'جانب',
  element: 'عنصر',
};

const VALUE_AR: Record<string, string> = { yes: 'نعم', partial: 'جزئيًا', no: 'لا' };

interface CalEntry {
  label: string;
  value: string;
}

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export default function CalibrationPage() {
  const [entries, setEntries] = useState<CalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const out: CalEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sukoon.calibration.')) {
        const raw = k.replace('sukoon.calibration.', ''); // type:key
        const [type, key] = raw.split(':');
        const value = localStorage.getItem(k) || '';
        out.push({ label: `${TYPE_AR[type] ?? type} · ${key}`, value });
      }
    }
    setEntries(out);
    setLoaded(true);
  }, []);

  const yesCount = entries.filter((e) => e.value === 'yes').length;
  const total = entries.length;

  return (
    <div className="py-4 md:max-w-lg md:mx-auto">
      <SettingsSubHeader title="المعايرة" />
      {loaded && total === 0 ? (
        <div className="px-5 py-12 text-center">
          <Body muted>لم تعايِر أي وضعية بعد. افتح وضعيةً من خريطتك واختر «ينطبق؟».</Body>
        </div>
      ) : (
        <>
          <div className="mx-5 mt-2 p-5 bg-white rounded-[16px] border border-rule-soft text-center">
            <div className="font-serif text-[44px] text-ink leading-none">
              {toArabicDigits(yesCount)} / {toArabicDigits(total)}
            </div>
            <div className="text-[13px] text-ink-muted mt-2">ينطبق · من {toArabicDigits(total)} مواضع</div>
          </div>
          <div className="px-5 mt-5 flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-2">
            {entries.map((e) => {
              const color = e.value === 'yes' ? '#8FA084' : e.value === 'no' ? '#E9785E' : '#5C5C7A';
              return (
                <div key={e.label} className="bg-white rounded-[12px] p-3 border border-rule-soft flex justify-between items-center">
                  <div className="font-serif text-sm text-ink">{e.label}</div>
                  <div className="text-xs font-semibold" style={{ color }}>{VALUE_AR[e.value] ?? e.value}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
