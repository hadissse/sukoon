'use client';

import { useEffect, useState } from 'react';
import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { Card } from '@/components/Card';
import { Body } from '@/components/Body';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  requestNotificationPermission,
  registerServiceWorker,
  notificationsSupported,
  notificationPermission,
  type NotificationPrefs,
} from '@/lib/notifications';
import { syncPreferences } from '@/lib/sync';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [permission, setPermission] = useState<string>('default');
  const [supported, setSupported] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSupported(notificationsSupported());
    setPermission(notificationPermission());
    setPrefs(loadNotificationPrefs());
  }, []);

  const handleToggle = async () => {
    if (!prefs) return;

    if (!prefs.enabled) {
      // Enable: request permission first
      setRequesting(true);
      const granted = await requestNotificationPermission();
      setRequesting(false);
      setPermission(notificationPermission());

      if (!granted) return;

      await registerServiceWorker();
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      saveNotificationPrefs(updated);
    } else {
      // Disable
      const updated = { ...prefs, enabled: false };
      setPrefs(updated);
      saveNotificationPrefs(updated);
    }
  };

  const handleTimeChange = (field: 'hour' | 'minute', raw: string) => {
    if (!prefs) return;
    const val = parseInt(raw, 10);
    if (isNaN(val)) return;
    const clamped = field === 'hour' ? Math.max(0, Math.min(23, val)) : Math.max(0, Math.min(59, val));
    const updated = { ...prefs, [field]: clamped };
    setPrefs(updated);
    saveNotificationPrefs(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    syncPreferences();
  };

  if (!supported) {
    return (
      <div className="py-4">
        <SettingsSubHeader title="الإشعارات" />
        <div className="px-5 mt-4">
          <Card>
            <Body muted>الإشعارات غير مدعومة في هذا المتصفح.</Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <SettingsSubHeader title="الإشعارات" />
      <div className="px-5 flex flex-col gap-4 mt-2">

        {/* Main toggle */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="font-serif text-base text-ink">التذكير اليومي</div>
              <Body muted className="text-xs">
                {prefs?.enabled ? 'مفعّل' : 'موقف'}
              </Body>
            </div>
            <button
              onClick={handleToggle}
              disabled={requesting || permission === 'denied'}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                prefs?.enabled ? 'bg-coral' : 'bg-rule-soft'
              } disabled:opacity-40`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  prefs?.enabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Permission denied warning */}
        {permission === 'denied' && (
          <div className="rounded-[14px] bg-coral/8 border border-coral/20 p-4">
            <Body muted className="text-sm">
              الإشعارات محظورة في إعدادات المتصفح. افتح إعدادات الموقع وأذِن بالإشعارات.
            </Body>
          </div>
        )}

        {/* Time picker — shown only when enabled */}
        {prefs?.enabled && (
          <Card>
            <div className="flex flex-col gap-3">
              <div className="font-serif text-base text-ink">وقت التذكير</div>
              <div className="flex items-center gap-3 dir-ltr" dir="ltr">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={pad(prefs.hour)}
                  onChange={(e) => handleTimeChange('hour', e.target.value)}
                  className="w-16 h-11 rounded-[10px] bg-cream-soft border border-rule-soft text-center text-lg font-serif text-ink focus:outline-none focus:border-coral"
                />
                <span className="text-xl text-ink-muted font-serif">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={pad(prefs.minute)}
                  onChange={(e) => handleTimeChange('minute', e.target.value)}
                  className="w-16 h-11 rounded-[10px] bg-cream-soft border border-rule-soft text-center text-lg font-serif text-ink focus:outline-none focus:border-coral"
                />
              </div>
              {saved && <Body muted className="text-xs">حُفظ</Body>}
            </div>
          </Card>
        )}

        {/* Explanation */}
        <div className="px-1">
          <Body muted className="text-xs leading-relaxed">
            سيُرسَل إشعار يومي في الوقت المحدد يدعوك للتأمّل أو تسجيل لحظة. يعمل عند تفعيل التطبيق كـ PWA أو عند تصفّحه مفتوحًا في الخلفية.
          </Body>
        </div>
      </div>
    </div>
  );
}
