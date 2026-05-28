'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentSky } from '@/lib/currentSky';
import { SIGN_SLUGS, getPlacementContent } from '@/content/placements';
import { planetSvgKey } from '@/lib/planetMeta';
import { FrameworkLabel } from '@/components/FrameworkLabel';
import type { AstralChart } from '@/lib/chartCalculator';

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', northNode: 'شمال القمر', southNode: 'جنوب القمر',
};

const ZODIAC_NAMES_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];

function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

export default function SkyPlanetPage({ params }: { params: { key: string } }) {
  const router = useRouter();
  const planetKey = params.key;
  const [sky, setSky] = useState<AstralChart | null>(null);

  useEffect(() => {
    setSky(getCurrentSky());
  }, []);

  const planet = sky ? (sky as AstralChart & Record<string, { sign: string; signNumber: number; degree: number; minute: number; retrograde?: boolean }>)[planetKey] : null;

  const signSlug = planet ? SIGN_SLUGS[planet.signNumber] : null;
  const content = signSlug ? getPlacementContent('planet', `${planetKey}:${signSlug}`) : null;

  const planetName = PLANET_AR[planetKey] ?? planetKey;
  const signName = planet ? ZODIAC_NAMES_AR[planet.signNumber] : '…';
  const degreeStr = planet ? `${toArabicDigits(planet.degree)}°${planet.minute > 0 ? `${toArabicDigits(planet.minute)}′` : ''}` : '';

  return (
    <div className="max-w-[430px] mx-auto w-full pb-28" dir="rtl">
      {/* Back */}
      <div className="px-5 pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          رجوع
        </button>
      </div>

      {/* Hero */}
      <div className="px-5 pt-4 pb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cream-soft flex items-center justify-center shrink-0">
          <div
            className="w-8 h-8"
            style={{
              WebkitMaskImage: `url('/svg/${planetSvgKey(planetKey)}.svg')`,
              maskImage: `url('/svg/${planetSvgKey(planetKey)}.svg')`,
              WebkitMaskSize: 'contain', maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center', maskPosition: 'center',
              background: '#E9785E',
            }}
          />
        </div>
        <div>
          <div className="font-serif text-[22px] text-ink leading-snug">
            {planetName} في {signName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span dir="ltr" className="text-xs text-ink-muted font-mono">{degreeStr}</span>
            {planet?.retrograde && (
              <span className="text-[10px] font-semibold text-coral border border-coral/40 rounded px-1 py-0.5 leading-none">℞</span>
            )}
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">السماء الجماعية الآن</div>
        </div>
      </div>

      <div className="px-5">
        <FrameworkLabel label="قراءة علم الفلك الغربي الاستوائي" />
      </div>

      {/* Content */}
      {content ? (
        <div className="px-5 mt-4 flex flex-col gap-5">
          {[
            ['الملاحظة', content.obs],
            ['المعنى الجماعي', content.mean],
            ['الظل الجماعي', content.shadow],
          ].map(([label, text]) => (
            <div key={label}>
              <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-1.5">{label}</div>
              <div className="flex flex-col gap-2">
                {(text as string).split('\n\n').map((para, i) => (
                  <p key={i} className="text-[15px] text-ink leading-[1.75] m-0">{para}</p>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="text-[11px] text-ink-muted font-semibold tracking-wider mb-1.5">تساؤل هذه المرحلة</div>
            <div className="font-serif text-[17px] text-ink leading-[1.5]">{content.q}</div>
          </div>
        </div>
      ) : (
        <div className="mx-5 mt-4 p-4 rounded-[14px] bg-cream-soft border border-rule-soft">
          {!sky ? (
            <div className="text-sm text-ink-muted">جارٍ تحميل السماء…</div>
          ) : (
            <div className="text-sm text-ink-muted leading-[1.7]">
              المحتوى التفصيلي لهذا الموضع قيد الإعداد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
