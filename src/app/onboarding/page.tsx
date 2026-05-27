'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BirthDateStep } from '@/components/onboarding/BirthDateStep';
import { BirthTimeStep } from '@/components/onboarding/BirthTimeStep';
import { LocationStep } from '@/components/onboarding/LocationStep';
import { calculateChartViaAPI } from '@/lib/chartCalculator';
import { calculateTraits } from '@/lib/traitEngine';
import { syncChart } from '@/lib/sync';

type OnboardingStep = 'welcome' | 'birth-date' | 'birth-time' | 'location';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [birthData, setBirthData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
    latitude: 24.7136,
    longitude: 46.6753,
    utcOffsetHours: 3,
    timeUnknown: false,
  });

  const handleStartOnboarding = () => {
    setStep('birth-date');
  };

  const handleBirthDateComplete = (date: { year: number; month: number; day: number }) => {
    setBirthData((prev) => ({ ...prev, ...date }));
    setStep('birth-time');
  };

  const handleBirthTimeComplete = (time: {
    hour: number;
    minute: number;
    timeUnknown?: boolean;
  }) => {
    setBirthData((prev) => ({
      ...prev,
      hour: time.hour,
      minute: time.minute,
      timeUnknown: time.timeUnknown || false,
    }));
    setStep('location');
  };

  const handleLocationComplete = async (location: {
    latitude: number;
    longitude: number;
    utcOffsetHours: number;
  }) => {
    const completeBirthData = {
      ...birthData,
      ...location,
    };

    setBirthData(completeBirthData);

    try {
      const chart = await calculateChartViaAPI(completeBirthData);
      localStorage.setItem('sukoon.birth-data', JSON.stringify(completeBirthData));
      localStorage.setItem('sukoon.primary-chart.v1', JSON.stringify(chart));

      // Read quiz answers and calculate trait profile in one pass
      let quiz: Record<string, string[]> = {};
      try {
        const raw = localStorage.getItem('sukoon.quiz');
        if (raw) quiz = JSON.parse(raw);
      } catch {
        // ignore — quiz is optional
      }
      calculateTraits(chart, quiz);

      // Fire-and-forget cloud sync
      syncChart();

      router.push('/self');
    } catch {
      localStorage.setItem('sukoon.birth-data', JSON.stringify(completeBirthData));
      router.push('/self');
    }
  };

  if (step === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-5 py-12">
        <div className="text-center max-w-sm">
          <h1 className="font-serif text-4xl text-ink mb-4">سُكون</h1>
          <p className="text-lg text-ink-muted mb-8">خريطتك. سماؤك. سُكونك.</p>
          <p className="text-sm text-ink mb-12 leading-relaxed">
            لنبدأ بفهم خريطتك النجمية. ستحتاج إلى تاريخ ميلادك، ووقته، ومكانه.
          </p>
          <button
            onClick={handleStartOnboarding}
            className="w-full px-6 py-3 rounded-[14px] bg-ink text-cream font-medium transition-colors hover:bg-ink-soft"
          >
            ابدأ الآن
          </button>
          <p className="text-xs text-ink-muted mt-8">
            لا تقلق إذا لم تكن تعرف وقتك بالضبط — يمكنك تركه فارغًا.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'birth-date') {
    return (
      <BirthDateStep
        initialData={birthData}
        onComplete={handleBirthDateComplete}
      />
    );
  }

  if (step === 'birth-time') {
    return (
      <BirthTimeStep
        initialData={birthData}
        onComplete={handleBirthTimeComplete}
      />
    );
  }

  if (step === 'location') {
    return (
      <LocationStep
        initialData={birthData}
        onComplete={handleLocationComplete}
      />
    );
  }

  return null;
}
