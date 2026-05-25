'use client';

import { useRouter } from 'next/navigation';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import { Card } from '@/components/Card';
import { Rule } from '@/components/Rule';
import { signOut } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';

const settingsItems = [
  { label: 'الملف الشخصي', href: '/settings/profile' },
  { label: 'الإشعارات', href: '/settings/notifications' },
  { label: 'المعايرة', href: '/settings/calibration' },
  { label: 'الاستشارات والممارسة', href: '/settings/practice' },
  { label: 'البيانات', href: '/settings/data' },
  { label: 'عن سُكون', href: '/settings/about' },
  { label: 'سياسة الخصوصية', href: '/settings/privacy' },
];

export default function SettingsPage() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!window.confirm('هل أنت متأكد؟ سيُحذف حسابك وجميع بياناتك بشكل نهائي.')) return;
    try {
      const sb = getSupabase();
      if (sb) await sb.functions.invoke('delete-account');
    } catch { /* ignore — we still clear local data */ }
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sukoon.')) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    router.push('/welcome');
  };

  const handleSignOut = async () => {
    await signOut();
    // Clear all local Sukoon data so a new user starts fresh
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sukoon.')) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    router.push('/welcome');
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link href="/today" className="text-ink-muted hover:text-ink transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Headline>الإعدادات</Headline>
      </div>

      <Card>
        <div className="flex flex-col">
          {settingsItems.map((item, i) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-3.5 text-ink hover:text-coral transition-colors"
              >
                <span className="text-base">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 rotate-180">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
              {i < settingsItems.length - 1 && <Rule />}
            </div>
          ))}
        </div>
      </Card>

      <button onClick={handleSignOut} className="text-right">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-base text-coral">تسجيل الخروج</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E9785E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
        </Card>
      </button>

      <button onClick={handleDeleteAccount} className="text-right">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-base text-ink-muted">حذف الحساب</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </div>
        </Card>
      </button>

      <div className="pt-2 text-center">
        <Body muted className="text-sm">سُكون · الإصدار ٠.١</Body>
      </div>
    </div>
  );
}
