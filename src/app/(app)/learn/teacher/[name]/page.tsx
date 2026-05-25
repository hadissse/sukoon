'use client';

// Scr46 — teacher profile. Tab-level (Header + TabBar from (app)).
// Param-driven; falls back to a default teacher when not matched.

import { use } from 'react';
import Link from 'next/link';
import { GradientTile, BackIcon, gradientCss } from '@/components/learn/primitives';
import { TEACHERS } from '@/content/courses';

const BIOS: Record<string, string> = {
  'مايا كول':
    'تُعلّم مايا الممارسة التأمّليّة منذ أربعة عشر عامًا. صوتها دافئ ومتجذّر، مع روح دعابة هادئة تجدك حين تحتاجها.',
};

export default function TeacherPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const decoded = decodeURIComponent(name);
  const teacher = TEACHERS.find((t) => t.name === decoded) ?? TEACHERS[0];
  const initials = teacher.name.split(' ').map((w) => w[0]).join('.');
  const bio = BIOS[teacher.name] ?? `${teacher.blurb} — ${teacher.count} في سُكون.`;

  return (
    <div className="px-5 pt-4 pb-28">
      <div className="flex items-center h-11">
        <Link href="/learn" className="text-ink-muted hover:text-ink"><BackIcon /></Link>
      </div>

      <div className="mt-3 flex flex-col items-center text-center">
        <div
          className="w-[130px] h-[130px] rounded-full flex items-center justify-center text-cream font-serif text-[38px]"
          style={{ background: gradientCss(teacher.variant) }}
        >
          {initials}
        </div>
        <div className="font-serif text-[26px] mt-[18px]">{teacher.name}</div>
        <div className="text-[13px] text-ink-muted mt-1">معلّمة · بروكلين</div>
      </div>

      <p className="text-sm text-ink-muted mt-[22px] leading-[1.8]">{bio}</p>

      <div className="font-serif text-lg mt-[22px]">مقرّرات</div>
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <GradientTile title="الطريق الهادئ" subtitle="10 أيام" variant="dawn" href="/learn/quiet-path" />
        <GradientTile title="مراسٍ لطيفة" subtitle="5 أيام" variant="sage" href="/learn/gentle-anchors" />
      </div>
    </div>
  );
}
