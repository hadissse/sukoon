'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BirthDateStep } from '@/components/onboarding/BirthDateStep';
import { BirthTimeStep } from '@/components/onboarding/BirthTimeStep';
import { LocationStep } from '@/components/onboarding/LocationStep';
import { calculateChart } from '@/lib/chartCalculator';
import { calculateTraits } from '@/lib/traitEngine';
import { syncChart } from '@/lib/sync';

type Step = 'birth-date' | 'birth-time' | 'location';

export default function EditBirthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('birth-date');
  const [birthData, setBirthData] = useState({
    year: 1990,
    month: 6,
    day: 15,
    hour: 12,
    minute: 0,
    latitude: 24.7136,
    longitude: 46.6753,
    utcOffsetHours: 3,
    timeUnknown: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sukoon.birth-data');
      if (raw) setBirthData(JSON.parse(raw));
    } catch {
      // keep defaults
    }
  }, []);

  const handleBirthDateComplete = (date: { year: number; month: number; day: number }) => {
    setBirthData((prev) => ({ ...prev, ...date }));
    setStep('birth-time');
  };

  const handleBirthTimeComplete = (time: { hour: number; minute: number; timeUnknown?: boolean }) => {
    setBirthData((prev) => ({ ...prev, hour: time.hour, minute: time.minute, timeUnknown: time.timeUnknown || false }));
    setStep('location');
  };

  const handleLocationComplete = async (location: { latitude: number; longitude: number; utcOffsetHours: number }) => {
    const updated = { ...birthData, ...location };
    try {
      const chart = calculateChart(updated);
      let quiz: Record<string, string[]> = {};
      try {
        const raw = localStorage.getItem('sukoon.quiz');
        if (raw) quiz = JSON.parse(raw);
      } catch { /* ignore */ }
      localStorage.setItem('sukoon.birth-data', JSON.stringify(updated));
      localStorage.setItem('sukoon.primary-chart.v1', JSON.stringify(chart));
      calculateTraits(chart, quiz);
      syncChart();
    } catch {
      localStorage.setItem('sukoon.birth-data', JSON.stringify(updated));
    }
    router.push('/self');
  };

  if (step === 'birth-date') {
    return <BirthDateStep initialData={birthData} onComplete={handleBirthDateComplete} />;
  }
  if (step === 'birth-time') {
    return <BirthTimeStep initialData={birthData} onComplete={handleBirthTimeComplete} />;
  }
  return <LocationStep initialData={birthData} onComplete={handleLocationComplete} />;
}
