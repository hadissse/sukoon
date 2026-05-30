'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadEvents, STREAM_AR, STREAM_GLYPH, type LoggedEvent, type StreamKey } from '@/lib/events';
import { getCosmicStamp } from '@/lib/cosmicStamp';
import type { AstralChart } from '@/lib/chartCalculator';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';

type FilterKey = 'all' | 'planets' | 'signs' | 'houses';

const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'الكل',
  planets: 'بالكواكب',
  signs: 'بالأبراج',
  houses: 'بالبيوت',
};

function formatDateAr(iso: string): string {
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', weekday: 'short' }).format(new Date(iso));
}

export default function Journey2Page() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [chart, setChart] = useState<AstralChart | null>(null);

  useEffect(() => {
    setEvents(loadEvents());
    try {
      const raw = localStorage.getItem('sukoon.primary-chart.v1');
      if (raw) setChart(JSON.parse(raw));
    } catch {
      // no chart
    }
  }, []);

  const stamp = getCosmicStamp();

  const filtered = events.filter((e) => {
    if (filter === 'all') return true;
    if (!e.placement) return false;
    if (filter === 'planets') return e.placement.type === 'planet';
    if (filter === 'signs') return e.placement.type === 'sign';
    if (filter === 'houses') return e.placement.type === 'house';
    return true;
  });

  return (
    <div className="pb-24 md:pb-10 md:max-w-4xl md:mx-auto">
      {/* Header — full width, outside grid */}
      <div className="px-5 pt-6 pb-3">
        <div className="text-xs text-ink-muted mb-1">{formatDateAr(new Date().toISOString())}</div>
        <Headline>التتبّع اليومي</Headline>
        <Body muted className="mt-1 text-sm">السماء الآن × خريطتك الداخلية</Body>
      </div>

      {/* Two-column grid on desktop: sky card on right, events on left */}
      <div className="md:grid md:grid-cols-[1fr_280px] md:gap-8 md:px-0 md:pt-4">
        {/* Right col (DOM-first for mobile stacking): sky card + log CTA */}
        <div className="md:sticky md:top-20 md:flex md:flex-col md:gap-3 md:col-start-2 md:row-start-1">
          {/* Today's sky card */}
          <div className="px-5 mb-4 md:px-0 md:mb-0">
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-midnight flex items-center justify-center shrink-0">
                  <div className="w-5 h-5" style={{ WebkitMaskImage: `url('/svg/moon.svg')`, maskImage: `url('/svg/moon.svg')`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', background: '#F5F2EA' }} />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-sm text-ink">
                    {stamp.moonPhase} · {stamp.sunPosition}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    حاكم اليوم: {stamp.dayRuler}
                  </div>
                </div>
                <Link href="/explore" className="text-xs text-coral font-medium whitespace-nowrap">
                  الكل ←
                </Link>
              </div>
            </Card>
          </div>

          {/* Log CTA */}
          <div className="px-5 mb-4 md:px-0 md:mb-0">
            <Link href="/log">
              <div className="flex items-center gap-3 py-3.5 px-4 rounded-[18px] border-2 border-dashed border-rule-soft text-ink-muted hover:border-coral hover:text-coral transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-sm font-medium">سجّل لحظة</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Left col: filter chips + events list */}
        <div className="md:col-start-1 md:row-start-1">
          {/* Filter chips */}
          <div className="px-5 flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(FILTER_LABELS) as FilterKey[]).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {FILTER_LABELS[f]}
              </Chip>
            ))}
          </div>

          {/* Events list */}
          <div className="px-5 mt-4 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Body muted>
                  {filter === 'all'
                    ? 'لم تسجّل أي لحظات بعد. سجّل أول لحظة لك.'
                    : 'لا لحظات مُصنَّفة بهذا الفلتر.'}
                </Body>
              </div>
            ) : (
              filtered.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`} className="block">
                  <Card>
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div className="font-serif text-base text-ink leading-snug flex-1">{event.text}</div>
                      <div className="text-xs text-coral font-medium whitespace-nowrap shrink-0">
                        {formatDateAr(event.date)}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap items-center mt-2">
                      {event.stream && (
                        <span className="bg-cream-soft rounded-full px-2.5 py-1 text-xs text-ink-muted">
                          {STREAM_GLYPH[event.stream as StreamKey]} {STREAM_AR[event.stream as StreamKey]}
                        </span>
                      )}
                      {event.placement && (
                        <span className="bg-cream-soft rounded-full px-2.5 py-1 text-xs text-coral font-medium">
                          {event.placement.label}
                        </span>
                      )}
                      {event.stamp?.moonPhase && (
                        <span className="text-xs text-ink-muted">{event.stamp.moonPhase}</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
