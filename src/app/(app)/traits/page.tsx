'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadTraits, type TraitProfile } from '@/lib/traitEngine';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';
import {
  ELEMENT_MEANING,
  MINERAL_MEANING,
  ORGAN_SIGNAL,
  HD_CENTRE_MEANING,
} from '@/content/traitsMeaning';
import { FrameworkLabel } from '@/components/FrameworkLabel';

type TabKey = 'elements' | 'minerals' | 'organs' | 'hd';

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#E9785E', earth: '#BDAA82', air: '#C2D3E2', water: '#7E97B8',
};
const ELEMENT_AR: Record<string, string> = {
  fire: 'النار', earth: 'التراب', air: 'الهواء', water: 'الماء',
};

export default function TraitsPage() {
  const [traits, setTraits] = useState<TraitProfile | null>(null);
  const [tab, setTab] = useState<TabKey>('elements');

  useEffect(() => {
    setTraits(loadTraits());
  }, []);

  if (!traits) {
    return (
      <div className="px-5 py-16 flex flex-col items-center gap-5 text-center">
        <Headline>ملفّ السمات</Headline>
        <Body muted>أكمل إدراج بياناتك أولًا لتظهر سماتك.</Body>
        <Link href="/onboarding" className="text-coral text-sm font-medium">ابدأ الإدراج ←</Link>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'elements', label: 'العناصر' },
    { key: 'minerals', label: 'المعادن' },
    { key: 'organs', label: 'الأعضاء' },
    { key: 'hd', label: 'مراكز HD' },
  ];

  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-4">
        <Headline>ملفّ السمات</Headline>
        <Body muted className="mt-1 text-sm">تُحسب من خريطتك مرّة واحدة.</Body>
      </div>

      {/* Tabs */}
      <div className="px-5 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>

      <div className="px-5 mt-4 flex flex-col gap-3">
        {/* Elements tab */}
        {tab === 'elements' && (
          <>
            <div className="rounded-[18px] p-4 mb-1" style={{ background: ELEMENT_COLORS[traits.elements.dominant] + '22' }}>
              <div className="text-[11px] font-semibold tracking-wider text-ink-muted mb-2">
                عنصرك السائد · {ELEMENT_AR[traits.elements.dominant]}
              </div>
              <div className="font-serif text-[15px] text-ink leading-[1.75] mb-2">
                {ELEMENT_MEANING[traits.elements.dominant].essence}
              </div>
              <Body muted>{ELEMENT_MEANING[traits.elements.dominant].lesson}</Body>
            </div>
            {(['fire', 'earth', 'air', 'water'] as const).map((el) => (
              <Card key={el}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-serif text-base text-ink">{ELEMENT_AR[el]}</div>
                    <div className="text-xs text-ink-muted mt-1">{traits.elements[el]}%</div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: ELEMENT_COLORS[el] }}
                  />
                </div>
                <div className="h-1.5 bg-rule-soft rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${traits.elements[el]}%`, backgroundColor: ELEMENT_COLORS[el] }}
                  />
                </div>
              </Card>
            ))}
          </>
        )}

        {/* Minerals tab */}
        {tab === 'minerals' && (
          <div className="flex flex-col gap-3">
            <FrameworkLabel label="قراءة هرمسية تقليدية" />
            {traits.minerals.map((m) => (
              <Card key={m.planet}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: m.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ink-muted">{m.planet}</div>
                    <div className="font-serif text-base text-ink mt-0.5">{m.mineral}</div>
                    {MINERAL_MEANING[m.mineral] && (
                      <div className="text-sm text-ink-muted mt-2 leading-[1.7]">
                        {MINERAL_MEANING[m.mineral]}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Organs tab */}
        {tab === 'organs' && (
          <>
            <FrameworkLabel label="قراءة هرمسية تقليدية" />
            {traits.organs.map((o) => (
              <Card key={o.planet}>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="font-serif text-base text-ink">{o.organ}</div>
                    <div className="text-xs text-ink-muted mt-1">{o.planet} · {o.theme}</div>
                  </div>
                  {ORGAN_SIGNAL[o.organ] && (
                    <div className="text-sm text-ink-muted leading-[1.7] mt-1">
                      {ORGAN_SIGNAL[o.organ]}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </>
        )}

        {/* HD Centres tab */}
        {tab === 'hd' && (
          <>
            <FrameworkLabel label="قراءة تصميم إنساني (Human Design)" />
            <div className="text-xs text-ink-muted mb-1 leading-[1.7]">
              المراكز المُعرَّفة تحمل طاقة ثابتة — غير المُعرَّفة مرنة ومتأثّرة بالمحيط.
            </div>
            {traits.hdCentres.map((c) => {
              const meaning = HD_CENTRE_MEANING[c.name];
              return (
                <Card key={c.name}>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-base text-ink">{c.name}</div>
                        <div className="text-xs text-ink-muted mt-1">{c.keywords}</div>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          background: c.defined ? '#E9785E' : '#F0F0F0',
                          color: c.defined ? '#FFFFFF' : '#5C5C7A',
                        }}
                      >
                        {c.defined ? 'مُعرَّف' : 'مفتوح'}
                      </span>
                    </div>
                    {meaning && (
                      <div className="text-sm text-ink-muted leading-[1.7]">
                        {c.defined ? meaning.defined : meaning.open}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
