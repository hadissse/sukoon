'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvent, STREAM_AR, type LoggedEvent } from '@/lib/events';

const RHYTHM_LABEL = (r: number): string => {
  if (r < 35) return 'مالَ إلى الحرارة';
  if (r > 65) return 'مالَ إلى الحديد';
  return 'متوازن';
};

export function EventDetailClient({ id }: { id: string }) {
  const [event, setEvent] = useState<LoggedEvent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEvent(getEvent(id));
    setLoaded(true);
  }, [id]);

  if (loaded && !event) {
    return (
      <div className="max-w-[430px] mx-auto w-full px-5 py-16 text-center flex flex-col gap-4">
        <div className="text-ink-muted text-sm">لم يُعثر على هذا الحدث.</div>
        <Link href="/self" className="text-coral text-sm font-medium">العودة ←</Link>
      </div>
    );
  }

  if (!event) return <div className="min-h-dvh" />;

  const dt = new Date(event.date);
  const dateLabel = new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dt);

  return (
    <div className="max-w-[430px] mx-auto w-full pb-10">
      <div className="pt-4 px-5 flex justify-between">
        <Link href="/self" className="text-ink-muted hover:text-ink" aria-label="إغلاق">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </Link>
      </div>

      <div className="px-5 mt-[18px]">
        <div className="text-xs text-coral font-semibold tracking-wide">{dateLabel}</div>
        <div className="font-serif text-2xl text-ink mt-2 leading-[1.4]">{event.text}</div>
      </div>

      <div className="mx-5 mt-[18px] p-3.5 rounded-[14px] bg-white border border-rule-soft flex justify-between">
        <div>
          <div className="text-[11px] text-ink-muted font-semibold">المجرى</div>
          <div className="text-sm text-ink mt-1">{event.stream ? STREAM_AR[event.stream] : '—'}</div>
        </div>
        <div className="text-left">
          <div className="text-[11px] text-ink-muted font-semibold">الإيقاع</div>
          <div className="text-sm mt-1" style={{ color: '#7E97B8' }}>
            {event.rhythm === null ? '—' : RHYTHM_LABEL(event.rhythm)}
          </div>
        </div>
      </div>

      <div className="mx-5 mt-3.5 p-3.5 rounded-[14px] bg-white border border-rule-soft">
        <div className="text-[11px] text-ink-muted font-semibold tracking-wide">السياق الفلكي</div>
        <div className="mt-2.5 flex flex-col gap-2">
          {[
            ['يوم الكوكب', event.stamp.dayRuler],
            ['طور القمر', event.stamp.moonPhase],
            ['درجة الشمس', event.stamp.sunPosition],
            ...(event.placement ? [['الموضع المرتبط', event.placement.label] as [string, string]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-[13px] text-ink-muted">{k}</span>
              <span className="text-[13px] text-ink font-serif">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {event.placement && (
        <div className="px-5 mt-5">
          <Link
            href={`/self/${event.placement.type}/${encodeURIComponent(event.placement.key)}`}
            className="block w-full text-center py-3.5 rounded-[14px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition-colors"
          >
            افتح الموضع
          </Link>
        </div>
      )}
    </div>
  );
}
