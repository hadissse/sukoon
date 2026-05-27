'use client';

import { useState, useEffect } from 'react';
import { searchLocation, getTimezoneOffset, type Location } from '@/lib/geocoding';
import { calculateChart, type AstralChart } from '@/lib/chartCalculator';
import { calculateTraits } from '@/lib/traitEngine';
import { syncChart } from '@/lib/sync';

interface NatalChartSetupFormProps {
  onComplete: (chart: AstralChart) => void;
}

export function NatalChartSetupForm({ onComplete }: NatalChartSetupFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(async () => {
      if (locationQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          setLocationResults(await searchLocation(locationQuery));
        } catch {
          setLocationResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setLocationResults([]);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [locationQuery]);

  const canSubmit =
    !!year && !!month && !!day && !!selectedLocation && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedLocation) return;
    setIsSubmitting(true);
    setError('');
    try {
      const offset = await getTimezoneOffset(selectedLocation.timezone);
      const birthData = {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        hour: timeUnknown ? 12 : parseInt(hour, 10),
        minute: timeUnknown ? 0 : parseInt(minute, 10),
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        utcOffsetHours: offset,
        timeUnknown,
      };
      const chart = calculateChart(birthData);
      localStorage.setItem('sukoon.birth-data', JSON.stringify(birthData));
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
    <div className="px-5 pt-6 pb-10 flex flex-col gap-7" dir="rtl">
      <div>
        <h2 className="font-serif text-2xl text-ink mb-1">خريطتك النجمية</h2>
        <p className="text-sm text-ink-muted">أدخل بيانات ميلادك لتوليد خريطتك</p>
      </div>

      {/* ── Birth date ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">تاريخ الميلاد</span>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-ink-muted mb-1">اليوم</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-3 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20"
            >
              <option value="">—</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1">الشهر</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20"
            >
              <option value="">—</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1">السنة</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm focus:outline-none focus:ring-1 focus:ring-coral/20"
            >
              <option value="">—</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Birth time ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">وقت الميلاد</span>
        <button
          type="button"
          onClick={() => setTimeUnknown(!timeUnknown)}
          className={`w-full px-4 py-3 rounded-[14px] border text-sm font-medium transition-colors text-right ${
            timeUnknown
              ? 'bg-cream-soft border-coral text-ink'
              : 'bg-white border-rule-soft text-ink-muted'
          }`}
        >
          لا أعرف وقت ميلادي
        </button>
        {!timeUnknown && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ink-muted mb-1">الساعة (٠–٢٣)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 0 && v <= 23) setHour(String(v).padStart(2, '0'));
                }}
                className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm text-center focus:outline-none focus:ring-1 focus:ring-coral/20"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1">الدقيقة</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 0 && v <= 59) setMinute(String(v).padStart(2, '0'));
                }}
                className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm text-center focus:outline-none focus:ring-1 focus:ring-coral/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Birth location ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">مكان الميلاد</span>
        <input
          type="text"
          placeholder="ابحث عن مدينتك..."
          value={locationQuery}
          onChange={(e) => {
            setLocationQuery(e.target.value);
            setSelectedLocation(null);
          }}
          className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink placeholder:text-ink-muted text-sm focus:outline-none focus:ring-1 focus:ring-coral/20"
        />
        {isSearching && (
          <p className="text-xs text-ink-muted text-center">جاري البحث...</p>
        )}
        {locationResults.length > 0 && !selectedLocation && (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {locationResults.map((loc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedLocation(loc);
                  setLocationQuery(loc.name);
                  setLocationResults([]);
                }}
                className="text-right px-4 py-3 rounded-[14px] bg-white border border-rule-soft text-ink text-sm hover:bg-cream-soft transition-colors"
              >
                <div className="font-medium">{loc.name}</div>
                <div className="text-xs text-ink-muted">{loc.country}</div>
              </button>
            ))}
          </div>
        )}
        {selectedLocation && (
          <div className="px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-ink">{selectedLocation.name}</div>
              <div className="text-xs text-ink-muted">{selectedLocation.country}</div>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedLocation(null); setLocationQuery(''); }}
              className="text-ink-muted text-xs hover:text-ink"
            >
              تغيير
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-coral text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-[52px] rounded-[26px] bg-ink text-cream text-base font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'جاري الحساب...' : 'أنشئ خريطتي'}
      </button>
    </div>
  );
}
