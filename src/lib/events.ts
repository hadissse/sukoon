import type { CosmicStamp } from './cosmicStamp';

export type StreamKey = 'thinking' | 'feeling' | 'willing';

export interface LoggedEvent {
  id: string;
  text: string;
  date: string; // ISO
  stream: StreamKey | null;
  rhythm: number | null; // 0 (حرارة/expansion) … 100 (حديد/contraction)
  placement: { type: string; key: string; label: string } | null;
  stamp: CosmicStamp;
}

const STORAGE_KEY = 'sukoon.events';

export const STREAM_AR: Record<StreamKey, string> = {
  thinking: 'الفكر',
  feeling: 'الشعور',
  willing: 'الإرادة',
};

export const STREAM_GLYPH: Record<StreamKey, string> = {
  thinking: '◎',
  feeling: '◌',
  willing: '◆',
};

export function loadEvents(): LoggedEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoggedEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveEvent(event: LoggedEvent): void {
  if (typeof window === 'undefined') return;
  const events = loadEvents();
  events.unshift(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEvent(id: string): LoggedEvent | null {
  return loadEvents().find((e) => e.id === id) ?? null;
}
