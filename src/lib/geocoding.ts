import { getSupabase } from './supabase';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
}

const CACHE_KEY_PREFIX = 'sukoon.geocache.';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCachedLocation(query: string): Location | null {
  if (typeof window === 'undefined') return null;

  const cacheKey = CACHE_KEY_PREFIX + query.toLowerCase();
  const cached = localStorage.getItem(cacheKey);

  if (!cached) return null;

  try {
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_EXPIRY_MS) {
      return data.location;
    }
    localStorage.removeItem(cacheKey);
  } catch {}

  return null;
}

function setCachedLocation(query: string, location: Location): void {
  if (typeof window === 'undefined') return;

  const cacheKey = CACHE_KEY_PREFIX + query.toLowerCase();
  const data = {
    location,
    timestamp: Date.now(),
  };
  localStorage.setItem(cacheKey, JSON.stringify(data));
}

function detectLang(query: string): string {
  return /[؀-ۿ]/.test(query) ? 'ar' : 'en';
}

async function searchOpenCage(query: string): Promise<Location[]> {
  const key = process.env.NEXT_PUBLIC_OPENCAGE_KEY;
  if (!key) return [];

  const lang = detectLang(query);
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${key}&limit=10&language=${lang}&no_annotations=0`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('OpenCage request failed');

  const data = await response.json();
  if (!data.results || data.results.length === 0) return [];

  return data.results.map((r: {
    formatted: string;
    geometry: { lat: number; lng: number };
    annotations: { timezone: { name: string } };
    components: { country: string };
  }) => ({
    name: r.formatted,
    latitude: r.geometry.lat,
    longitude: r.geometry.lng,
    timezone: r.annotations?.timezone?.name ?? 'UTC',
    country: r.components?.country ?? '',
  }));
}

async function searchOpenMeteo(query: string): Promise<Location[]> {
  const lang = detectLang(query);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=${lang}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Open-Meteo geocoding failed');

  const data = await response.json();
  if (!data.results || data.results.length === 0) return [];

  return data.results.map((r: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    country: string;
  }) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    country: r.country,
  }));
}

// Routes through the Supabase edge function so the user's IP is never sent
// directly to Open-Meteo. Falls back to direct call if no session.
async function searchViaEdgeFn(query: string): Promise<Location[]> {
  const sb = getSupabase();
  if (!sb) return searchOpenMeteo(query);

  try {
    const { data, error } = await sb.functions.invoke('geocode', {
      body: { q: query, count: 10, locale: detectLang(query) },
    });
    if (error || !data?.results) throw error ?? new Error('no results');

    return (data.results as { name: string; country: string; lat: number; lon: number; timezone: string }[]).map((r) => ({
      name: r.country ? `${r.name}, ${r.country}` : r.name,
      latitude: r.lat,
      longitude: r.lon,
      timezone: r.timezone,
      country: r.country,
    }));
  } catch {
    return searchOpenMeteo(query);
  }
}

export async function searchLocation(query: string): Promise<Location[]> {
  const cached = getCachedLocation(query);
  if (cached) return [cached];

  try {
    const locations = process.env.NEXT_PUBLIC_OPENCAGE_KEY
      ? await searchOpenCage(query)
      : await searchViaEdgeFn(query);

    if (locations.length > 0) {
      setCachedLocation(query, locations[0]);
    }

    return locations;
  } catch {
    try {
      return await searchOpenMeteo(query);
    } catch {
      return [];
    }
  }
}

export async function getTimezoneOffset(timezone: string): Promise<number> {
  try {
    const now = new Date();

    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const getParts = (parts: Intl.DateTimeFormatPart[]) => ({
      year: parseInt(parts.find((p) => p.type === 'year')?.value || '2024'),
      month: parseInt(parts.find((p) => p.type === 'month')?.value || '1'),
      day: parseInt(parts.find((p) => p.type === 'day')?.value || '1'),
      hour: parseInt(parts.find((p) => p.type === 'hour')?.value || '0'),
      minute: parseInt(parts.find((p) => p.type === 'minute')?.value || '0'),
      second: parseInt(parts.find((p) => p.type === 'second')?.value || '0'),
    });

    const utc = getParts(utcFormatter.formatToParts(now));
    const tz = getParts(tzFormatter.formatToParts(now));

    const utcDate = new Date(utc.year, utc.month - 1, utc.day, utc.hour, utc.minute, utc.second);
    const tzDate = new Date(tz.year, tz.month - 1, tz.day, tz.hour, tz.minute, tz.second);

    const offsetMs = tzDate.getTime() - utcDate.getTime();
    return offsetMs / (1000 * 60 * 60);
  } catch {
    return 0;
  }
}
