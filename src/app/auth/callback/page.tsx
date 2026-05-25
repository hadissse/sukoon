'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { loadAllRemote } from '@/lib/sync';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      router.replace('/today');
      return;
    }

    sb.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { hasChart } = await loadAllRemote();
        router.replace(hasChart ? '/today' : '/onboarding');
      } else {
        router.replace('/welcome');
      }
    });
  }, [router]);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-ink-muted text-sm">جارٍ تسجيل الدخول...</div>
    </div>
  );
}
