'use client';

import { useState, useEffect } from 'react';
import { searchLocation, getTimezoneOffset, type Location } from '@/lib/geocoding';
import { calculateChart, type AstralChart } from '@/lib/chartCalculator';
import { calculateTraits } from '@/lib/traitEngine';
import { syncChart } from '@/lib/sync';

interface NatalChartSetupFormProps {
  onComplete: (chart: AstralChart) => void;
}

function to24h(h: number, ampm: 'AM' | 'PM'): number {
  if (ampm === 'AM') return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
}

const inputCls =
  'w-full px-3 py-2.5 bg-transparent border-b border-stone-200 text-ink text-sm text-center focus:outline-none focus:border-coral/50 transition-colors placeholder:text-ink-muted/50';

const inputFullCls =
  'w-full px-4 py-3 bg-transparent border-b border-stone-200 text-ink text-sm focus:outline-none focus:border-coral/50 transition-colors placeholder:text-ink-muted/50';

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] border border-stone-100 px-5 py-5 flex flex-col gap-4">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-coral tracking-wider uppercase">{children}</span>
  );
}

export function NatalChartSetupForm({ onComplete }: NatalChartSetupFormProps) {
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState('');
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('6');
  const [year, setYear] = useState('1990');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('PM');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try {
        setLocationResults(await searchLocation(locationQuery));
      } catch {
        setLocationResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [locationQuery]);

  const canSubmit = !!name.trim() && !!year && !!month && !!day && !!selectedLocation && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedLocation) return;
    setIsSubmitting(true);
    setError('');
    try {
      const h = timeUnknown ? 12 : to24h(parseInt(hour, 10) || 12, amPm);
      const m = timeUnknown ? 0 : (parseInt(minute, 10) || 0);
      const offset = await getTimezoneOffset(selectedLocation.timezone);
      const birthData = {
        name: name.trim(),
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        hour: h,
        minute: m,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        utcOffsetHours: offset,
        timeUnknown,
      };
      const chart = calculateChart(birthData);
      localStorage.setItem('sukoon.birth-data', JSON.stringify(birthData));
      localStorage.setItem('sukoon.user-name', name.trim());
      localStorage.setItem('sukoon.primary-chart.v1', JSON.stringify(chart));
      calculateTraits(chart, {});
      syncChart();
      onComplete(chart);
    } catch {
      setError('حدث خطأ، حاول مجدداً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-5 pt-6 pb-10 flex flex-col gap-5" dir="rtl">
      <div className="mb-2">
        <h2 className="font-serif text-2xl text-ink mb-1">خريطتك الفلكية</h2>
        <p className="text-sm text-ink-muted">أدخل بيانات ميلادك لتوليد خريطتك</p>
      </div>

      {/* ── Name ── */}
      <SectionCard>
        <SectionLabel>الاسم</SectionLabel>
        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputFullCls}
          dir="rtl"
        />
      </SectionCard>

      {/* ── Birth date ── */}
      <SectionCard>
        <SectionLabel>تاريخ الميلاد</SectionLabel>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[11px] text-ink-muted">اليوم</label>
            <input
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) setDay(String(Math.min(31, Math.max(1, v))));
              }}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[11px] text-ink-muted">الشهر</label>
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) setMonth(String(Math.min(12, Math.max(1, v))));
              }}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[11px] text-ink-muted">السنة</label>
            <input
              type="number"
              min="1900"
              max={currentYear}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) setYear(String(Math.min(currentYear, Math.max(1900, v))));
              }}
              className={inputCls}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Birth time ── */}
      <SectionCard>
        <div className="flex items-center justify-between">
          <SectionLabel>وقت الميلاد</SectionLabel>
          <button
            type="button"
            onClick={() => setTimeUnknown(!timeUnknown)}
            className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${
              timeUnknown
                ? 'border-coral text-coral'
                : 'border-stone-200 text-ink-muted'
            }`}
          >
            لا أعرف وقت ميلادي
          </button>
        </div>
        {!timeUnknown && (
          <div className="flex gap-4 items-end">
            {/* AM/PM — first in JSX = rightmost in RTL */}
            <div className="flex flex-col items-center gap-1">
              <label className="text-[11px] text-ink-muted opacity-0 select-none">—</label>
              <div className="flex rounded-full overflow-hidden border border-stone-200">
                {(['PM', 'AM'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmPm(p)}
                    className={`px-4 py-2 text-xs font-semibold transition-colors ${
                      amPm === p ? 'bg-ink text-cream' : 'bg-white text-ink-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Hour — second in JSX = middle in RTL */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <label className="text-[11px] text-ink-muted">الساعة</label>
              <input
                type="number"
                min="1"
                max="12"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                onBlur={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setHour(String(Math.min(12, Math.max(1, v))));
                }}
                className={inputCls}
              />
            </div>
            {/* Minute — last in JSX = leftmost in RTL */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <label className="text-[11px] text-ink-muted">الدقيقة</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                onBlur={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setMinute(String(v).padStart(2, '0'));
                }}
                className={inputCls}
              />
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Birth location ── */}
      <SectionCard>
        <SectionLabel>مكان الميلاد</SectionLabel>
        {!selectedLocation ? (
          <>
            <input
              type="text"
              placeholder="اكتب اسم المدينة"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setSelectedLocation(null);
              }}
              className={inputFullCls}
            />
            {isSearching && (
              <p className="text-xs text-ink-muted text-center">جاري البحث...</p>
            )}
            {locationResults.length > 0 && (
              <div className="flex flex-col divide-y divide-stone-100 -mx-5 px-5">
                {locationResults.map((loc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationQuery(loc.name);
                      setLocationResults([]);
                    }}
                    className="text-right py-3 text-ink text-sm hover:text-coral transition-colors"
                  >
                    <div className="font-medium">{loc.name}</div>
                    <div className="text-xs text-ink-muted">{loc.country}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-ink">{selectedLocation.name}</div>
              <div className="text-xs text-ink-muted">{selectedLocation.country}</div>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedLocation(null); setLocationQuery(''); }}
              className="text-xs text-coral hover:text-coral/70 transition-colors"
            >
              تغيير
            </button>
          </div>
        )}
      </SectionCard>

      {error && <p className="text-sm text-coral text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-[52px] rounded-[26px] bg-ink text-cream text-base font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? 'جاري الحساب...' : 'أنشئ خريطتي'}
      </button>
    </div>
  );
}
