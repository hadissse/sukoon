'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BirthTimeStepProps {
  initialData: {
    hour: number;
    minute: number;
  };
  onComplete: (time: {
    hour: number;
    minute: number;
    timeUnknown?: boolean;
  }) => void;
}

export function BirthTimeStep({ initialData, onComplete }: BirthTimeStepProps) {
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [hour, setHour] = useState(initialData.hour.toString().padStart(2, '0'));
  const [minute, setMinute] = useState(initialData.minute.toString().padStart(2, '0'));
  const router = useRouter();

  const handleContinue = () => {
    if (timeUnknown) {
      onComplete({ hour: 12, minute: 0, timeUnknown: true });
      return;
    }

    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      alert('الرجاء إدخال وقت صحيح');
      return;
    }

    onComplete({ hour: h, minute: m });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-5 py-12">
      <div className="w-full max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-ink-muted hover:text-ink transition-colors"
        >
          رجوع ›
        </button>

        <h1 className="font-serif text-3xl text-ink mb-2">في أي وقت وُلدت؟</h1>
        <p className="text-sm text-ink-muted mb-8">
          الوقت بالساعات والدقائق، بالتوقيت المحلي
        </p>

        {/* Unknown Time Option */}
        <div className="mb-8">
          <button
            onClick={() => setTimeUnknown(!timeUnknown)}
            className={`w-full px-4 py-3 rounded-[14px] border-2 transition-colors text-sm font-medium ${
              timeUnknown
                ? 'bg-cream-soft border-coral text-ink'
                : 'bg-white border-rule-soft text-ink-muted hover:border-coral/40'
            }`}
          >
            لا أعرف الوقت بالضبط{timeUnknown ? ' ·' : ''}
          </button>
        </div>

        {!timeUnknown && (
          <div className="flex flex-col gap-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              {/* Hour Input */}
              <div>
                <label className="block text-xs text-ink-muted font-semibold mb-2">
                  الساعة
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 0 && val <= 23) {
                      setHour(val.toString().padStart(2, '0'));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm text-center focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
                />
              </div>

              {/* Minute Input */}
              <div>
                <label className="block text-xs text-ink-muted font-semibold mb-2">
                  الدقيقة
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 0 && val <= 59) {
                      setMinute(val.toString().padStart(2, '0'));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm text-center focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
                />
              </div>
            </div>

            <p className="text-xs text-ink-muted">
              التوقيت المحلي في مكان ميلادك، لا التوقيت العالمي.
            </p>
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 rounded-[14px] bg-ink text-cream font-medium transition-colors hover:bg-ink-soft"
        >
          متابعة
        </button>

        {timeUnknown && (
          <p className="text-xs text-ink-muted text-center mt-4">
            سيتم استخدام الظهيرة (١٢:٠٠) كوقت افتراضي. يمكنك تحسين هذا لاحقًا.
          </p>
        )}
      </div>
    </div>
  );
}
