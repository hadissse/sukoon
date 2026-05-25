const PREFS_KEY = 'sukoon.notifications';

export interface NotificationPrefs {
  enabled: boolean;
  hour: number;   // 0–23, local time
  minute: number; // 0–59
  lastShown: string | null; // ISO date (date part only)
}

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: false,
  hour: 8,
  minute: 0,
  lastShown: null,
};

export function loadNotificationPrefs(): NotificationPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('/sw.js');
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

// Show a local notification via the service worker
async function showViaSW(title: string, body: string, url: string): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!reg?.active) return;
  reg.active.postMessage({ type: 'SHOW_NOTIFICATION', title, body, url });
}

// Called on each app load — fires today's reminder if it's past the scheduled
// time and hasn't been shown yet today.
export async function checkAndFireDailyReminder(): Promise<void> {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return;
  const prefs = loadNotificationPrefs();
  if (!prefs.enabled) return;

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  if (prefs.lastShown === todayKey) return;

  const scheduledMs = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    prefs.hour,
    prefs.minute,
    0,
  ).getTime();

  if (now.getTime() >= scheduledMs) {
    await showViaSW('سُكون', 'حان وقت لحظتك اليومية — ما الذي تحمله الآن؟', '/today');
    saveNotificationPrefs({ ...prefs, lastShown: todayKey });
  }
}

// Schedule today's notification via setTimeout (fires if tab is open at that time)
export function scheduleLocalReminder(): void {
  if (typeof window === 'undefined') return;
  const prefs = loadNotificationPrefs();
  if (!prefs.enabled || Notification.permission !== 'granted') return;

  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    prefs.hour,
    prefs.minute,
    0,
  );

  // Schedule for tomorrow if today's time has already passed
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();
  setTimeout(async () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const current = loadNotificationPrefs();
    if (!current.enabled || current.lastShown === todayKey) return;
    await showViaSW('سُكون', 'حان وقت لحظتك اليومية — ما الذي تحمله الآن؟', '/today');
    saveNotificationPrefs({ ...current, lastShown: todayKey });
    scheduleLocalReminder(); // reschedule for next day
  }, delay);
}
