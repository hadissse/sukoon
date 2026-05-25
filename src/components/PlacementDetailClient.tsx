'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AstralChart } from '@/lib/chartCalculator';
import { getPlacementContent, SIGN_SLUGS, type VoiceContent } from '@/content/placements';
import { syncCalibration } from '@/lib/sync';

const ZODIAC_SVG_KEYS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sag', 'cap', 'aqua', 'pisces'];
const ZODIAC_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const SIGN_ELEMENT_AR = ['نار', 'تراب', 'هواء', 'ماء', 'نار', 'تراب', 'هواء', 'ماء', 'نار', 'تراب', 'هواء', 'ماء'];
const HOUSE_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
const HOUSE_THEMES = ['الذات · الجسد', 'المورد · الميدان', 'العقل · القريب', 'الأصول · الموقد', 'الإبداع · الشرارة', 'العمل · اليومي', 'الآخر · المرآة', 'الأعماق · المشترك', 'المعنى · البعيد', 'الذروة · العمل', 'الجماعة · المستقبل', 'الخفاء · الانحلال'];

const PLANET_AR: Record<string, string> = {
  sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ',
  jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو',
  chiron: 'كيرون', lilith: 'الجزء الأسود',
};

const ELEMENT_AR: Record<string, { name: string; glyph: string }> = {
  fire: { name: 'عنصر النار', glyph: '▲' },
  air: { name: 'عنصر الهواء', glyph: '◇' },
  water: { name: 'عنصر الماء', glyph: '▽' },
  earth: { name: 'عنصر التراب', glyph: '■' },
};

const ASPECTS: Record<number, { name: string; symbol: string; orb: number }> = {
  0: { name: 'اقتران', symbol: '·', orb: 8 },
  60: { name: 'سُداس', symbol: '×', orb: 6 },
  90: { name: 'تربيع', symbol: '▫', orb: 8 },
  120: { name: 'تثليث', symbol: '△', orb: 8 },
  180: { name: 'تقابل', symbol: '—', orb: 8 },
};

function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

interface HeaderData {
  glyph: string;
  svgKey?: string; // if set, render as mask-image SVG instead of text
  title: string;
  meta: string;
  color: string;
}

function buildHeaderAndContent(
  type: string,
  key: string,
  chart: AstralChart | null,
): { header: HeaderData; content: VoiceContent | null } {
  const coral = '#E9785E';
  const lake = '#7E97B8';

  if (type === 'planet' && chart) {
    const p = (chart as unknown as Record<string, AstralChart['sun']>)[key];
    if (p) {
      const slug = SIGN_SLUGS[p.signNumber];
      const houseNum = Math.floor((((p.longitude - chart.asc) % 360) + 360) % 360 / 30) + 1;
      return {
        header: {
          glyph: '',
          svgKey: key,
          title: `${PLANET_AR[key] ?? p.name} في ${ZODIAC_AR[p.signNumber]} · ${toArabicDigits(p.degree)}°`,
          meta: `البيت ${HOUSE_ORDINALS[houseNum - 1]} · ${HOUSE_THEMES[houseNum - 1]}`,
          color: coral,
        },
        content: getPlacementContent('planet', `${key}:${slug}`),
      };
    }
  }

  if (type === 'sign') {
    const idx = SIGN_SLUGS.indexOf(key as (typeof SIGN_SLUGS)[number]);
    if (idx >= 0) {
      return {
        header: {
          glyph: '',
          svgKey: ZODIAC_SVG_KEYS[idx],
          title: ZODIAC_AR[idx],
          meta: `البرج ${HOUSE_ORDINALS[idx]} · ${SIGN_ELEMENT_AR[idx]}`,
          color: coral,
        },
        content: getPlacementContent('sign', key),
      };
    }
  }

  if (type === 'house') {
    const num = parseInt(key, 10);
    if (num >= 1 && num <= 12) {
      const cusp = chart?.houses?.[num - 1];
      return {
        header: {
          glyph: toArabicDigits(num),
          title: `البيت ${HOUSE_ORDINALS[num - 1]}`,
          meta: cusp ? `${HOUSE_THEMES[num - 1]} · ${cusp.sign} ${toArabicDigits(cusp.degree)}°` : HOUSE_THEMES[num - 1],
          color: lake,
        },
        content: getPlacementContent('house', key),
      };
    }
  }

  if (type === 'aspect' && chart) {
    const [a, b] = key.split('-');
    const pa = (chart as unknown as Record<string, AstralChart['sun']>)[a];
    const pb = (chart as unknown as Record<string, AstralChart['sun']>)[b];
    if (pa && pb) {
      const sep = Math.abs(((pa.longitude - pb.longitude + 180) % 360) - 180);
      let best = { name: '', symbol: '·', orb: 99, angle: 0 };
      for (const angle of [0, 60, 90, 120, 180]) {
        const def = ASPECTS[angle];
        const orb = Math.abs(sep - angle);
        if (orb <= def.orb && orb < best.orb) best = { ...def, orb, angle };
      }
      return {
        header: {
          glyph: best.symbol,
          title: `${PLANET_AR[a] ?? a} ${best.symbol} ${PLANET_AR[b] ?? b}`,
          meta: best.name ? `${best.name} · فرق ${toArabicDigits(best.orb.toFixed(0))}°` : 'جانب',
          color: coral,
        },
        content: getPlacementContent('aspect', key),
      };
    }
  }

  if (type === 'element') {
    const el = ELEMENT_AR[key];
    if (el) {
      return {
        header: { glyph: el.glyph, title: el.name, meta: 'عنصر في خريطتك', color: coral },
        content: getPlacementContent('element', key),
      };
    }
  }

  return {
    header: { glyph: '✦', title: 'وضعية', meta: '', color: coral },
    content: null,
  };
}

function CalibrateBlock({ storageKey }: { storageKey: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(localStorage.getItem(storageKey));
  }, [storageKey]);

  const choose = (v: string) => {
    setSelected(v);
    localStorage.setItem(storageKey, v);
    // storageKey = "sukoon.calibration.{type}:{key}"
    const raw = storageKey.replace('sukoon.calibration.', '');
    const colonIdx = raw.indexOf(':');
    if (colonIdx > -1) {
      syncCalibration(raw.slice(0, colonIdx), raw.slice(colonIdx + 1), v);
    }
  };

  return (
    <div className="mx-5 mt-3.5 p-3.5 rounded-[12px] bg-white border border-rule-soft">
      <div className="text-xs text-ink-muted font-semibold tracking-wide">ينطبق؟</div>
      <div className="flex gap-2 mt-2.5">
        {[['نعم', 'yes'], ['جزئيًا', 'partial'], ['لا', 'no']].map(([label, v]) => {
          const sel = selected === v;
          return (
            <button
              key={v}
              onClick={() => choose(v)}
              className={`flex-1 py-2.5 rounded-full text-center text-[13px] font-medium transition-colors ${
                sel ? 'text-cream' : 'text-ink border border-rule-soft bg-white'
              }`}
              style={sel ? { backgroundColor: '#8FA084' } : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PlacementDetailClient({ type, decodedKey }: { type: string; decodedKey: string }) {
  const [chart, setChart] = useState<AstralChart | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sukoon.primary-chart.v1');
    if (stored) {
      try {
        setChart(JSON.parse(stored));
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.error('Failed to parse chart:', e);
      }
    }
  }, []);

  const { header, content } = buildHeaderAndContent(type, decodedKey, chart);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Link href="/self" className="text-ink-muted hover:text-ink transition-colors" aria-label="إغلاق">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Link>
        </div>
        <div className="flex gap-3.5 items-center mt-3">
          <div
            className="w-14 h-14 rounded-full bg-cream-soft flex items-center justify-center shrink-0 text-2xl font-serif"
            style={{ color: header.color }}
          >
            {header.svgKey ? (
              <div
                className="w-8 h-8"
                style={{
                  WebkitMaskImage: `url('/svg/${header.svgKey}.svg')`,
                  maskImage: `url('/svg/${header.svgKey}.svg')`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  background: header.color,
                }}
              />
            ) : header.glyph}
          </div>
          <div>
            <div className="font-serif text-[22px] text-ink leading-snug">{header.title}</div>
            {header.meta && <div className="text-xs text-ink-muted mt-1">{header.meta}</div>}
          </div>
        </div>
      </div>

      {content ? (
        <>
          {/* Voice arc */}
          <div className="px-5 mt-[18px] flex flex-col gap-4">
            {[
              ['الملاحظة', content.obs],
              ['المعنى', content.mean],
              ['الظل', content.shadow],
            ].map(([k, t]) => (
              <div key={k}>
                <div className="text-[11px] text-ink-muted tracking-wide font-semibold">{k}</div>
                <div className="text-[15px] text-ink mt-1.5 leading-[1.7]">{t}</div>
              </div>
            ))}
            <div>
              <div className="text-[11px] text-ink-muted tracking-wide font-semibold">سؤال الروح</div>
              <div className="font-serif italic text-[17px] text-ink mt-1.5 leading-[1.5]">{content.q}</div>
            </div>
          </div>

          {content.practice && (
            <div className="mx-5 mt-[18px] p-3.5 rounded-[12px]" style={{ backgroundColor: '#C9D2BE' }}>
              <div className="text-xs text-ink font-semibold tracking-wide">ممارسة</div>
              <div className="text-sm text-ink mt-1.5 leading-[1.7]">{content.practice}</div>
            </div>
          )}

          {content.cycles && content.cycles.length > 0 && (
            <div className="mx-5 mt-[18px] p-3.5 rounded-[12px] bg-white border border-rule-soft">
              <div className="text-xs text-ink-muted font-semibold tracking-wide">الدورات</div>
              <div className="mt-2 flex flex-col gap-2">
                {content.cycles.map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[13px] text-ink-muted">{k}</span>
                    <span className="text-[13px] text-ink font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mx-5 mt-[18px] p-4 rounded-[12px] bg-cream-soft border border-rule-soft">
          <div className="text-sm text-ink-muted leading-[1.7]">
            المحتوى التفصيلي لهذه الوضعية قيد الإعداد. ستظهر هنا الملاحظة والمعنى والظل وسؤال الروح.
          </div>
        </div>
      )}

      <CalibrateBlock storageKey={`sukoon.calibration.${type}:${decodedKey}`} />

      {/* CTA */}
      <div className="px-5 mt-5">
        <Link
          href={`/log?type=${type}&key=${encodeURIComponent(decodedKey)}`}
          className="block w-full text-center py-3.5 rounded-[14px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition-colors"
        >
          سجّل حدثًا مرتبطًا
        </Link>
      </div>
    </div>
  );
}
