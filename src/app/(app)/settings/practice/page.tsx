'use client';

import Link from 'next/link';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { Card } from '@/components/Card';
import { Body } from '@/components/Body';

const CONSULTATION_URL = process.env.NEXT_PUBLIC_CONSULTATION_URL ?? '';

export default function PracticePage() {
  return (
    <div className="py-4 md:max-w-lg md:mx-auto">
      <SettingsSubHeader title="الاستشارات والممارسة" />
      <div className="px-5 flex flex-col gap-4">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="font-serif text-lg text-ink">جلسة مع مُرشد</div>
            <Body muted>محادثةٌ هادئة حول خريطتك مع أحد المرشدين.</Body>
            {CONSULTATION_URL ? (
              <Link
                href={CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start px-4 py-2 rounded-[14px] bg-ink text-cream text-sm font-medium"
              >
                احجز جلسة
              </Link>
            ) : (
              <span className="text-sm text-ink-muted">تُفتح الحجوزات قريبًا.</span>
            )}
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-2">
            <div className="font-serif text-lg text-ink">ممارستك اليومية</div>
            <Body muted>
              تتبّع جلساتك وتأمّلاتك. سيظهر هنا سجلّ ممارستك مع الوقت.
            </Body>
          </div>
        </Card>
      </div>
    </div>
  );
}
