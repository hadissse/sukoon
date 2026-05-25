'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const hasChart = !!localStorage.getItem('sukoon.primary-chart.v1');
      router.replace(hasChart ? '/today' : '/welcome');
    } catch {
      router.replace('/welcome');
    }
  }, [router]);

  return null;
}
