'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadTraits, type TraitProfile } from '@/lib/traitEngine';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Headline } from '@/components/Headline';
import { Body } from '@/components/Body';

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
            <div className="text-xs text-ink-muted mb-1">
              العنصر السائد: <span className="font-semibold text-ink">{ELEMENT_AR[traits.elements.dominant]}</span>
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
          <div className="grid grid-cols-2 gap-3">
            {traits.minerals.map((m) => (
              <Card key={m.planet}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <div>
                    <div className="text-xs text-ink-muted">{m.planet}</div>
                    <div className="font-serif text-sm text-ink mt-0.5">{m.mineral}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Organs tab */}
        {tab === 'organs' && traits.organs.map((o) => (
          <Card key={o.planet}>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <div className="font-serif text-base text-ink">{o.organ}</div>
                <div className="text-xs text-ink-muted mt-1">{o.planet} · {o.theme}</div>
              </div>
            </div>
          </Card>
        ))}

        {/* HD Centres tab */}
        {tab === 'hd' && (
          <>
            <div className="text-xs text-ink-muted mb-1">
              المراكز المُعرَّفة تحمل طاقة ثابتة — غير المُعرَّفة مرنة ومتأثّرة بالمحيط.
            </div>
            {traits.hdCentres.map((c) => (
              <Card key={c.name}>
                <div className="flex justify-between items-center gap-3">
                  <div>
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
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
