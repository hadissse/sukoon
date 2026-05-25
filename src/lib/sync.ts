import { getSupabase } from './supabase';
import { getUser } from './auth';
import type { LoggedEvent } from './events';
import type { TraitProfile } from './traitEngine';

const CHART_KEY = 'sukoon.primary-chart.v1';
const QUIZ_KEY = 'sukoon.quiz';
const JOURNEY_KEY = 'sukoon.journey1.v1';
const TRAITS_KEY = 'sukoon.traits.v1';
const NOTIF_KEY = 'sukoon.notifications';

// ─── Chart ───────────────────────────────────────────────────────────────────

export async function syncChart(): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    const raw = localStorage.getItem(CHART_KEY);
    if (!raw) return;
    const chart = JSON.parse(raw);

    await sb.from('charts').upsert({
      user_id: user.id,
      label: 'natal',
      birth_date: chart.birthDate ?? null,
      birth_time: chart.birthTime ?? null,
      birth_place: chart.birthPlace ?? '',
      latitude: chart.latitude ?? 0,
      longitude: chart.longitude ?? 0,
      timezone: chart.timezone ?? 'UTC',
      chart_json: chart,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,label' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncChart:', e);
  }
}

export async function loadRemoteChart(): Promise<boolean> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return false;
  if (typeof window !== 'undefined' && localStorage.getItem(CHART_KEY)) return false;

  try {
    const { data, error } = await sb
      .from('charts')
      .select('chart_json')
      .eq('user_id', user.id)
      .eq('label', 'natal')
      .maybeSingle();
    if (error || !data?.chart_json) return false;
    localStorage.setItem(CHART_KEY, JSON.stringify(data.chart_json));
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteChart:', e);
    return false;
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function syncEvent(event: LoggedEvent): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('events').upsert({
      id: event.id,
      user_id: user.id,
      created_at: event.date,
      note: event.text,
      mood: null,
      energy: null,
      tags: [],
      placement_key: event.placement?.key ?? null,
      extra: { stream: event.stream, rhythm: event.rhythm, stamp: event.stamp, placement: event.placement },
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncEvent:', e);
  }
}

export async function loadRemoteEvents(): Promise<LoggedEvent[]> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return [];

  try {
    const { data, error } = await sb
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      text: row.note ?? '',
      date: row.created_at,
      stream: row.extra?.stream ?? null,
      rhythm: row.extra?.rhythm ?? null,
      placement: row.extra?.placement ?? (row.placement_key ? { key: row.placement_key, type: 'planet', label: row.placement_key } : null),
      stamp: row.extra?.stamp ?? {},
    })) as LoggedEvent[];
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteEvents:', e);
    return [];
  }
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export async function syncQuiz(): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    if (!raw) return;
    const answers = JSON.parse(raw);

    await sb.from('quiz_answers').upsert({
      user_id: user.id,
      answers,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncQuiz:', e);
  }
}

export async function loadRemoteQuiz(): Promise<boolean> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return false;
  if (typeof window !== 'undefined' && localStorage.getItem(QUIZ_KEY)) return false;

  try {
    const { data, error } = await sb
      .from('quiz_answers')
      .select('answers')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data?.answers) return false;
    localStorage.setItem(QUIZ_KEY, JSON.stringify(data.answers));
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteQuiz:', e);
    return false;
  }
}

// ─── Journey ─────────────────────────────────────────────────────────────────

export async function syncJourney(weekStart: string, state: object): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('journey_progress').upsert({
      user_id: user.id,
      week_start: weekStart,
      state_json: state,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,week_start' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncJourney:', e);
  }
}

export async function loadRemoteJourney(weekStart: string): Promise<object | null> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return null;

  try {
    const { data, error } = await sb
      .from('journey_progress')
      .select('state_json')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .maybeSingle();
    if (error || !data?.state_json) return null;
    return data.state_json;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteJourney:', e);
    return null;
  }
}

// ─── Traits ──────────────────────────────────────────────────────────────────

export async function syncTraits(profile: TraitProfile): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('traits').upsert({
      user_id: user.id,
      profile_json: profile,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncTraits:', e);
  }
}

export async function loadRemoteTraits(): Promise<boolean> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return false;
  if (typeof window !== 'undefined' && localStorage.getItem(TRAITS_KEY)) return false;

  try {
    const { data, error } = await sb
      .from('traits')
      .select('profile_json')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data?.profile_json) return false;
    localStorage.setItem(TRAITS_KEY, JSON.stringify(data.profile_json));
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteTraits:', e);
    return false;
  }
}

// ─── Calibration ─────────────────────────────────────────────────────────────

export async function syncCalibration(calType: string, calKey: string, value: string): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('calibrations').upsert({
      user_id: user.id,
      cal_type: calType,
      cal_key: calKey,
      planet: calKey,
      degree_offset: 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,cal_type,cal_key' });
    // Store the value (yes/partial/no) in extra — update the row
    await sb.from('calibrations')
      .update({ degree_offset: value === 'yes' ? 1 : value === 'partial' ? 0.5 : 0 })
      .eq('user_id', user.id)
      .eq('cal_type', calType)
      .eq('cal_key', calKey);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncCalibration:', e);
  }
}

export async function loadRemoteCalibrations(): Promise<boolean> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return false;

  try {
    const { data, error } = await sb
      .from('calibrations')
      .select('cal_type, cal_key, degree_offset')
      .eq('user_id', user.id);
    if (error || !data || data.length === 0) return false;

    for (const row of data) {
      const value = row.degree_offset >= 1 ? 'yes' : row.degree_offset >= 0.5 ? 'partial' : 'no';
      localStorage.setItem(`sukoon.calibration.${row.cal_type}:${row.cal_key}`, value);
    }
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteCalibrations:', e);
    return false;
  }
}

// ─── Transit Feedback ────────────────────────────────────────────────────────

export interface TransitFeedback {
  transitId: string;
  transitType: 'great' | 'live' | 'essay';
  rating?: number;
  reflection?: string;
}

export async function syncTransitFeedback(fb: TransitFeedback): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('transit_feedback').upsert({
      user_id: user.id,
      transit_id: fb.transitId,
      transit_type: fb.transitType,
      rating: fb.rating ?? null,
      reflection: fb.reflection ?? null,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id,transit_id' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncTransitFeedback:', e);
  }
}

export async function loadRemoteTransitFeedback(): Promise<Record<string, TransitFeedback>> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return {};

  try {
    const { data, error } = await sb
      .from('transit_feedback')
      .select('transit_id, transit_type, rating, reflection')
      .eq('user_id', user.id);
    if (error || !data) return {};

    const result: Record<string, TransitFeedback> = {};
    for (const row of data) {
      result[row.transit_id] = {
        transitId: row.transit_id,
        transitType: row.transit_type,
        rating: row.rating,
        reflection: row.reflection,
      };
    }
    return result;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemoteTransitFeedback:', e);
    return {};
  }
}

// ─── User Preferences ────────────────────────────────────────────────────────

export async function syncPreferences(): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    const notifRaw = localStorage.getItem(NOTIF_KEY);
    const notifications = notifRaw ? JSON.parse(notifRaw) : {};

    const uiFlags: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k === 'sukoon.chart-guide-seen')) {
        uiFlags[k] = localStorage.getItem(k) ?? '';
      }
    }

    await sb.from('user_preferences').upsert({
      user_id: user.id,
      notifications_json: notifications,
      ui_flags: uiFlags,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncPreferences:', e);
  }
}

export async function loadRemotePreferences(): Promise<boolean> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return false;

  try {
    const { data, error } = await sb
      .from('user_preferences')
      .select('notifications_json, ui_flags')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data) return false;

    if (data.notifications_json && !localStorage.getItem(NOTIF_KEY)) {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(data.notifications_json));
    }
    if (data.ui_flags) {
      for (const [k, v] of Object.entries(data.ui_flags)) {
        if (!localStorage.getItem(k)) localStorage.setItem(k, v as string);
      }
    }
    return true;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('loadRemotePreferences:', e);
    return false;
  }
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function syncProfile(): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    const raw = localStorage.getItem(CHART_KEY);
    if (!raw) return;
    const chart = JSON.parse(raw);

    await sb.from('profiles').upsert({
      id: user.id,
      birth_date: chart.birthDate ?? null,
      birth_time: chart.birthTime ?? null,
      birth_place: chart.birthPlace ?? null,
      birth_lat: chart.latitude ?? null,
      birth_lng: chart.longitude ?? null,
      tz: chart.timezone ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncProfile:', e);
  }
}

// ─── Votes ───────────────────────────────────────────────────────────────────

export async function syncVote(args: {
  cardId: string;
  vote: 'true' | 'warm' | 'quiet' | 'stirring' | 'flat' | 'off';
  note?: string;
  transitPlanet?: string;
  natalPlanet?: string;
}): Promise<void> {
  const sb = getSupabase();
  const user = await getUser();
  if (!sb || !user) return;

  try {
    await sb.from('sukoon_votes').insert({
      user_id: user.id,
      card_id: args.cardId,
      vote: args.vote,
      note: args.note ?? null,
      transit_planet: args.transitPlanet ?? null,
      natal_planet: args.natalPlanet ?? null,
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('syncVote:', e);
  }
}

// ─── Load All (called on auth restore) ───────────────────────────────────────

export async function loadAllRemote(): Promise<{ hasChart: boolean }> {
  const [chartRestored] = await Promise.all([
    loadRemoteChart(),
    loadRemoteEvents().then(async (remoteEvents) => {
      if (remoteEvents.length === 0) return;
      const { saveEvent } = await import('./events');
      const existing = new Set<string>(
        JSON.parse(localStorage.getItem('sukoon.events') ?? '[]').map((e: { id: string }) => e.id)
      );
      for (const evt of remoteEvents) {
        if (!existing.has(evt.id)) saveEvent(evt);
      }
    }),
    loadRemoteQuiz(),
    loadRemoteTraits(),
    loadRemoteCalibrations(),
    loadRemotePreferences(),
    syncProfile(),
  ]);

  const hasChart = !!localStorage.getItem(CHART_KEY);
  return { hasChart };
}
