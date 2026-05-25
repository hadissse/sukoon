'use client';

// Scr181 — النجوم الثابتة (Fixed Stars list)

import Link from 'next/link';
import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';

const STARS: [string, string, string, boolean, string?][] = [
  ['الدبران', 'ad-Dabaran · تابع الثريّا', 'الجوزاء ١٠°', true, 'dabaran'],
  ['فم الحوت', 'Fam al-Hut · فم الحوت الجنوبي', 'الحوت ٤°', true],
  ['الجنب', 'al-Janb · جنب الفرس المجنّح', 'الحمل ٩°', false],
  ['العقرب', "al-'Aqrab · قلب العقرب", 'القوس ١٠°', false],
  ['رأس الغول', "Ra's al-Ghul · رأس الجنّية", 'الثور ٢٧°', false],
  ['النسر الواقع', 'an-Nasr al-Waqi · فيغا', 'الجدي ١٥°', true],
  ['الطير الواقع', 'ad-Dhanab · ذنب الدّجاجة', 'الدلو ٥°', false],
  ['السماك الرامح', 'as-Simak ar-Ramih · أركتروس', 'الميزان ٢٤°', false],
  ['السماك الأعزل', "as-Simak al-A'zal · السنبلة", 'الميزان ٢٤°', false],
  ['الشعرى اليمانية', "ash-Shi'ra · سيريوس", 'السرطان ١٤°', false],
  ['الزُّبانى', 'az-Zubana · كفّتا الميزان', 'العقرب ١٥°', false],
  ['قلب الأسد', 'Qalb al-Asad · ريغولوس', 'الأسد ٢٩°', false],
];

const FILTERS: [string, boolean][] = [
  ['نشطة في خريطتي', true],
  ['الكل', false],
  ['بالكوكبة', false],
];

export default function FixedStarsPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="النجوم الثابتة" />
      <p className="text-[13px] text-ink-muted px-5 mt-1.5 leading-[1.7]">
        أسماءٌ عربية حافظت على نفسها في كتالوجات السماء الحديثة. تنحرف ~١° كل ٧٢ سنة.
      </p>

      <div className="flex gap-2 px-5 pt-3.5">
        {FILTERS.map(([t, a]) => (
          <div
            key={t}
            className="px-3.5 py-2 rounded-full"
            style={{ background: a ? '#171B3A' : '#fff', border: a ? 'none' : '1px solid #E8E2D2' }}
          >
            <span className="text-xs font-medium" style={{ color: a ? '#fff' : '#171B3A' }}>
              {t}
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 pt-4 flex flex-col gap-2">
        {STARS.map(([n, l, pos, active, slug]) => {
          const inner = (
            <div
              className="bg-white rounded-[14px] p-3 flex gap-3.5 items-center"
              style={{ border: active ? '1.5px solid #E9785E' : '1px solid #E8E2D2' }}
            >
              <div className="w-9 h-9 rounded-[18px] bg-cream-soft flex items-center justify-center shrink-0">
                <span className="text-base" style={{ color: active ? '#E9785E' : '#5C5C7A' }}>
                  ✦
                </span>
              </div>
              <div className="flex-1">
                <div className="font-serif text-base text-ink font-medium">{n}</div>
                <div className="text-[11px] text-ink-muted mt-0.5 italic">{l}</div>
              </div>
              <div className="text-end shrink-0">
                <div className="text-xs text-ink font-serif">{pos}</div>
                {active && (
                  <div className="text-[10px] text-coral font-semibold mt-1 tracking-wide">تلامس الشمس</div>
                )}
              </div>
            </div>
          );
          return slug ? (
            <Link key={n} href={`/self/fixed-stars/${slug}`}>
              {inner}
            </Link>
          ) : (
            <div key={n}>{inner}</div>
          );
        })}
      </div>

      <FooterTabBar active="self" />
    </div>
  );
}
