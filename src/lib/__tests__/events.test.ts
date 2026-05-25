import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadEvents, saveEvent, getEvent } from '../events';
import type { LoggedEvent } from '../events';

const makeEvent = (id: string): LoggedEvent => ({
  id,
  text: 'test note',
  date: new Date().toISOString(),
  stream: 'thinking',
  rhythm: 50,
  placement: null,
  stamp: {} as never,
});

// Mock window + localStorage (events.ts guards on typeof window)
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, val: string) => { store[key] = val; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};

vi.stubGlobal('window', { localStorage: localStorageMock });
vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  localStorageMock.clear();
});

describe('loadEvents', () => {
  it('returns empty array when nothing stored', () => {
    expect(loadEvents()).toEqual([]);
  });

  it('returns empty array on malformed JSON', () => {
    store['sukoon.events'] = 'not json';
    expect(loadEvents()).toEqual([]);
  });
});

describe('saveEvent', () => {
  it('saves and retrieves an event', () => {
    const ev = makeEvent('abc');
    saveEvent(ev);
    const events = loadEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('abc');
  });

  it('prepends new events (most recent first)', () => {
    saveEvent(makeEvent('first'));
    saveEvent(makeEvent('second'));
    const events = loadEvents();
    expect(events[0].id).toBe('second');
    expect(events[1].id).toBe('first');
  });

  it('persists multiple events', () => {
    saveEvent(makeEvent('a'));
    saveEvent(makeEvent('b'));
    saveEvent(makeEvent('c'));
    expect(loadEvents()).toHaveLength(3);
  });
});

describe('getEvent', () => {
  it('returns event by id', () => {
    saveEvent(makeEvent('xyz'));
    const ev = getEvent('xyz');
    expect(ev).not.toBeNull();
    expect(ev?.id).toBe('xyz');
  });

  it('returns null for unknown id', () => {
    expect(getEvent('missing')).toBeNull();
  });
});
