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

const fieldCls =
  'w-full px-3 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink text-sm text-center focus:outline-none focus:ring-1 focus:ring-coral/20';

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
    }, 250);
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
    <div className="px-5 pt-6 pb-10 flex flex-col gap-7" dir="rtl">
      <div>
        <h2 className="font-serif text-2xl text-ink mb-1">خريطتك الفلكية</h2>
        <p className="text-sm text-ink-muted">أدخل بيانات ميلادك لتوليد خريطتك</p>
      </div>

      {/* ── Name ── */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">الاسم</span>
        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink placeholder:text-ink-muted text-sm focus:outline-none focus:ring-1 focus:ring-coral/20"
          dir="rtl"
        />
      </div>

      {/* ── Birth date ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">تاريخ الميلاد</span>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-ink-muted mb-1 text-center">اليوم</label>
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
              className={fieldCls}
            />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1 text-center">الشهر</label>
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
              className={fieldCls}
            />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1 text-center">السنة</label>
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
              className={fieldCls}
            />
          </div>
        </div>
      </div>

      {/* ── Birth time ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">وقت الميلاد</span>
          <button
            type="button"
            onClick={() => setTimeUnknown(!timeUnknown)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              timeUnknown
                ? 'bg-coral/10 border-coral text-coral'
                : 'bg-white border-rule-soft text-ink-muted'
            }`}
          >
            لا أعرف وقت ميلادي
          </button>
        </div>
        {!timeUnknown && (
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs text-ink-muted mb-1 text-center">الساعة</label>
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
                className={fieldCls}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-ink-muted mb-1 text-center">الدقيقة</label>
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
                className={fieldCls}
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1 text-center opacity-0 select-none">—</label>
              <div className="flex rounded-[14px] overflow-hidden border border-rule-soft">
                {(['AM', 'PM'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmPm(p)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      amPm === p ? 'bg-ink text-cream' : 'bg-cream-soft text-ink-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Birth location ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">مكان الميلاد</span>
        <input
          type="text"
          placeholder="اكتب اسم المدينة بالعربي أو الإنجليزي"
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
