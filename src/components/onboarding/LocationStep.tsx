'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchLocation, getTimezoneOffset, type Location } from '@/lib/geocoding';

interface LocationStepProps {
  initialData: {
    latitude: number;
    longitude: number;
    utcOffsetHours: number;
  };
  onComplete: (location: {
    latitude: number;
    longitude: number;
    utcOffsetHours: number;
  }) => void;
}

export function LocationStep({ initialData, onComplete }: LocationStepProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;

    setIsSearching(true);
    try {
      const foundLocations = await searchLocation(query);
      setResults(foundLocations);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = async (location: Location) => {
    setSelectedLocation(location);
    setIsLoading(true);

    try {
      const offset = await getTimezoneOffset(location.timezone);
      onComplete({
        latitude: location.latitude,
        longitude: location.longitude,
        utcOffsetHours: offset,
      });
    } catch {
      onComplete({
        latitude: location.latitude,
        longitude: location.longitude,
        utcOffsetHours: 0,
      });
    }
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

        <h1 className="font-serif text-3xl text-ink mb-2">أين وُلدت؟</h1>
        <p className="text-sm text-ink-muted mb-8">
          المدينة أو المحافظة أو البلد
        </p>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن موقعك..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-ink placeholder:text-ink-muted text-sm focus:outline-none focus:ring-1 focus:ring-coral/20 transition-colors"
            dir="rtl"
          />
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-6 max-h-64 overflow-y-auto flex flex-col gap-2">
            {results.map((location, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLocation(location)}
                disabled={isLoading}
                className="text-right px-4 py-3 rounded-[14px] bg-white border border-rule-soft text-ink text-sm hover:bg-cream-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-ink-muted">
                  {location.country}
                </div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="mb-6 text-center text-sm text-ink-muted">
            جاري البحث...
          </div>
        )}

        {query.trim().length > 2 && results.length === 0 && !isSearching && (
          <div className="mb-6 text-center text-sm text-ink-muted">
            لم يتم العثور على نتائج
          </div>
        )}

        {selectedLocation && (
          <div className="mb-6 p-4 rounded-[14px] bg-cream-soft border border-rule-soft">
            <div className="font-medium text-ink mb-1">{selectedLocation.name}</div>
            <div className="text-xs text-ink-muted">
              {selectedLocation.latitude.toFixed(4)}° {selectedLocation.longitude.toFixed(4)}°
            </div>
          </div>
        )}

        {!selectedLocation && (
          <p className="text-xs text-ink-muted text-center mt-8">
            اختر موقعًا من القائمة أعلاه للمتابعة
          </p>
        )}
      </div>
    </div>
  );
}
