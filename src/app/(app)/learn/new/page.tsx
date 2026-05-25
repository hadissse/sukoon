'use client';

// Scr92 — الجديد هذا الأسبوع (new this week). Tab-level (Header + TabBar).

import Link from 'next/link';
import { BackIcon, FilterIcon } from '@/components/learn/primitives';

const NEW_ITEMS: [string, string, string][] = [
  ['المرساة اللطيفة', 'دورة · مايا كول', '#C9D2BE'],
  ['صعوبات الراحة', 'سلسلة · جوناس بارك', '#9C8AB8'],
  ['عن الفرح', 'منفردة · ٥ دقائق · بريا', '#F8D6BE'],
  ['المشي اليقظ', 'سلسلة · ثيو', '#C2D3E2'],
];

export default function NewThisWeekPage() {
  return (
    <div className="pb-28">
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/learn" className="text-ink-muted hover:text-ink">
            <BackIcon />
          </Link>
          <h1 className="font-serif text-[26px] text-ink -tracking-[0.5px]">الجديد هذا الأسبوع</h1>
        </div>
        <FilterIcon className="text-ink-muted" />
      </div>

      <div className="px-5 mt-4 flex flex-col gap-3">
        {NEW_ITEMS.map(([t, s, c]) => (
          <div key={t} className="bg-white rounded-[16px] p-3.5 border border-sand flex gap-3.5 items-center">
            <div className="w-[70px] h-[70px] rounded-[12px] shrink-0" style={{ background: c }} />
            <div className="flex-1">
              <div className="text-xs text-coral font-semibold">جديد</div>
              <div className="font-serif text-[17px] text-ink mt-0.5">{t}</div>
              <div className="text-xs text-ink-muted mt-1">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
