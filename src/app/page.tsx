'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { loadAllRemote } from '@/lib/sync';

const CHART_KEY = 'sukoon.primary-chart.v1';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      // Fast path: chart already in localStorage → go straight to app
      try {
        if (localStorage.getItem(CHART_KEY)) {
          router.replace('/today');
          return;
        }
      } catch {}

      // No local chart — check whether user has a Supabase session
      const sb = getSupabase();
      if (!sb) {
        router.replace('/welcome');
        return;
      }

      const { data } = await sb.auth.getSession();

      if (!data.session) {
        router.replace('/welcome');
        return;
      }

      // Logged in but no local chart (new device / cleared cache) → restore from Supabase
      const { hasChart } = await loadAllRemote();
      router.replace(hasChart ? '/today' : '/onboarding');
    }

    redirect();
  }, [router]);

  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: '#F5F2EA' }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: '#E9785E' }}
      />
    </div>
  );
}
