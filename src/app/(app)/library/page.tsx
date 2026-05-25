'use client';

// LIBRARY — مكتبتي (Scr103-110). Tab-level screen (Header + TabBar from (app)).
// Tabs: المحفوظة(103) · التنزيلات(104) · السجل(105) · الملاحظات(106).
// Plus: empty(107), collections(108), collection detail(109), note detail(110).

import { useState } from 'react';
import { GradientOrb } from '@/components/GradientOrb';
import {
  HeartIcon,
  PlayIcon,
  BackIcon,
  SOLID,
} from '@/components/learn/primitives';

type Tab = 'saved' | 'downloads' | 'history' | 'notes';
const TABS: [Tab, string][] = [
  ['saved', 'المحفوظة'],
  ['downloads', 'التنزيلات'],
  ['history', 'السجل'],
  ['notes', 'الملاحظات'],
];

const SAVED: [string, string, string][] = [
  ['الدرب الهادئ · اليوم ٣', 'دورة', 'dawn'],
  ['المنارة البطيئة', 'حكاية نوم', 'night'],
  ['عن العودة', 'منفردة · ٥ دقائق', 'sage'],
  ['نَفَس الصندوق', 'منفردة · ٥ دقائق', 'lake'],
  ['الإفلات برفق', 'سلسلة', 'dusk'],
];

const DOWNLOADS: [string, string][] = [
  ['المنارة البطيئة', '٤٥ دقيقة'],
  ['نوم بلا فشل', '٣ دقائق'],
  ['مطر ناعم', 'مشهد صوتي'],
  ['نَفَس الصندوق', '٥ دقائق'],
];

const HISTORY: [string, [string, string][]][] = [
  ['اليوم', [['حين يتشتّت العقل', '١٠ دقائق · مايا'], ['مطر ناعم', '٧ دقائق']]],
  ['أمس', [['نَفَس الصندوق', '٥ دقائق'], ['عن العودة', '٥ دقائق']]],
  ['٨ مايو', [['المنارة البطيئة', '٤٥ دقيقة']]],
];

const NOTES: [string, string, string][] = [
  ['اليوم', 'صباح هادئ. ساعدني الجرس على الاستقرار.', 'dawn'],
  ['١١ مايو', 'شعرت بالاضطراب. لم أستقر. بدأت رغم ذلك.', 'dusk'],
  ['٨ مايو', 'جلسة طويلة. عدت أخفّ مما بدأت.', 'sage'],
  ['٥ مايو', 'جرّبت ممارسة المشي — فاجأني كم هي مُثبِّتة.', 'lake'],
];

const COLLECTIONS: [string, string, string, boolean][] = [
  ['الصباحات', '٦ جلسات', 'dawn', false],
  ['النوم', '١٢', 'night', false],
  ['استراحات القهوة', '٤', 'ember', false],
  ['الأيام المشدودة', '٥', 'dusk', false],
  ['المشي', '٣', 'sage', false],
  ['+ جديدة', '', 'dust', true],
];

const COLLECTION_SESSIONS: [string, string][] = [
  ['نَفَس واحد', '٣٠ ث'],
  ['حضور القهوة', '٥ دقائق'],
  ['تحية الشمس', '٧ دقائق'],
  ['دقيقة هدوء', 'دقيقة'],
  ['أول نَفَس في اليوم', '٣ دقائق'],
  ['مشي يقظ', '٨ دقائق'],
];

function LibItem({ title, sub, variant, right }: { title: string; sub: string; variant: string; right?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[14px] p-3 border border-sand flex gap-3 items-center">
      <div className="w-14 h-14 rounded-[10px] shrink-0" style={{ background: SOLID[variant] || SOLID.dawn }} />
      <div className="flex-1">
        <div className="text-sm text-ink font-medium">{title}</div>
        <div className="text-xs text-ink-muted mt-0.5">{sub}</div>
      </div>
      {right}
    </div>
  );
}

export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>('saved');
  const [view, setView] = useState<'tabs' | 'collections' | 'collectionDetail' | 'noteDetail' | 'empty'>('tabs');

  // Scr109 — collection detail
  if (view === 'collectionDetail') {
    return (
      <div className="pb-28 pt-4">
        <div className="px-5 flex items-center gap-2.5">
          <button onClick={() => setView('collections')} className="text-ink-muted hover:text-ink"><BackIcon /></button>
          <div className="font-serif text-[22px] text-ink">الصباحات</div>
        </div>
        <div className="px-5 text-[13px] text-ink-muted mt-2">٦ جلسات · ٣٨ دقيقة إجمالًا</div>
        <div className="px-5 mt-5 flex flex-col gap-2">
          {COLLECTION_SESSIONS.map(([t, d]) => (
            <div key={t} className="bg-white rounded-[14px] p-3 border border-sand flex gap-3 items-center">
              <div className="w-3 h-3 rounded-full bg-coral" />
              <div className="flex-1">
                <div className="text-sm text-ink font-medium">{t}</div>
                <div className="text-xs text-ink-muted mt-0.5">{d}</div>
              </div>
              <span className="text-ink"><PlayIcon size={18} /></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Scr108 — collections grid
  if (view === 'collections') {
    return (
      <div className="pb-28 pt-4">
        <div className="px-5">
          <div className="font-serif text-[26px] text-ink -tracking-[0.4px]">المجموعات</div>
          <div className="text-[13px] text-ink-muted mt-1">اجمع الجلسات بحسب المزاج أو الموضوع</div>
        </div>
        <div className="px-5 mt-5 flex flex-wrap gap-2.5">
          {COLLECTIONS.map(([t, s, v, isNew]) => {
            const onLight = ['sage', 'ember', 'dust', 'dawn'].includes(v);
            const fg = onLight ? '#171B3A' : '#FFFFFF';
            return (
              <button
                key={t}
                onClick={() => !isNew && setView('collectionDetail')}
                className="rounded-[16px] p-3.5 flex flex-col text-start"
                style={{
                  width: 'calc(50% - 5px)',
                  height: 140,
                  background: isNew ? 'transparent' : SOLID[v],
                  border: isNew ? '1.5px dashed #F0F0F0' : 'none',
                  justifyContent: isNew ? 'center' : 'flex-end',
                  alignItems: isNew ? 'center' : 'flex-start',
                }}
              >
                {isNew ? (
                  <span className="text-sm text-ink-muted">+ مجموعة جديدة</span>
                ) : (
                  <>
                    <div className="font-serif text-[17px]" style={{ color: fg }}>{t}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: fg, opacity: 0.8 }}>{s}</div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Scr110 — note detail
  if (view === 'noteDetail') {
    return (
      <div className="pb-28 pt-4">
        <div className="px-5 flex items-center gap-2.5">
          <button onClick={() => { setTab('notes'); setView('tabs'); }} className="text-ink-muted hover:text-ink"><BackIcon /></button>
          <div className="font-serif text-[28px] text-ink -tracking-[0.5px]">الملاحظات</div>
        </div>
        <div className="px-5 mt-5">
          <div className="text-xs text-ink-muted font-semibold tracking-wide">١٤ مايو</div>
          <div className="mt-2.5 bg-white rounded-[16px] p-4 border border-sand">
            <div className="text-xs text-coral font-semibold">بعد · حين يتشتّت العقل</div>
            <div className="text-[15px] text-ink mt-2 leading-[1.7]">
              كانت الدقائق الثلاث الأولى مضطربة. ثم — بين نَفَس وآخر — لان شيء ما. لم أحاول الإمساك به، بل كان.
            </div>
            <div className="mt-3.5 flex gap-1.5">
              {['أهدأ', '١٠ دقائق'].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-cream-soft rounded-full text-[11px] text-ink-muted">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scr107 — empty state
  if (view === 'empty') {
    return (
      <div className="pb-28 pt-4">
        <div className="font-serif text-[28px] text-ink px-5 -tracking-[0.5px]">مكتبتي</div>
        <div className="mt-3.5"><LibTabsBar tab="saved" onTab={() => setView('tabs')} /></div>
        <div className="pt-10 px-8 flex flex-col items-center">
          <GradientOrb variant="dust" size={100} />
          <div className="font-serif text-[22px] text-ink mt-5">لا شيء محفوظ بعد</div>
          <div className="text-sm text-ink-muted mt-2 text-center leading-[1.6]">اضغط على القلب لكل ما تودّ العودة إليه.</div>
          <button onClick={() => setView('tabs')} className="mt-6 bg-ink rounded-[14px] px-7 py-3.5 text-cream text-[15px] font-semibold">
            تصفّح التأمّلات
          </button>
        </div>
      </div>
    );
  }

  // main tabbed view
  return (
    <div className="pb-28 pt-4">
      <div className="flex items-center justify-between px-5">
        <div className="font-serif text-[28px] text-ink -tracking-[0.5px]">مكتبتي</div>
        <button onClick={() => setView('collections')} className="text-sm text-coral font-medium">المجموعات</button>
      </div>
      <div className="mt-3.5">
        <LibTabsBar tab={tab} onTab={setTab} />
      </div>

      {/* Scr103 — saved */}
      {tab === 'saved' && (
        <div className="px-5 mt-3.5 flex flex-col gap-2.5">
          {SAVED.map(([t, s, v]) => (
            <LibItem key={t} title={t} sub={s} variant={v} right={<span className="text-coral"><HeartIcon filled /></span>} />
          ))}
        </div>
      )}

      {/* Scr104 — downloads */}
      {tab === 'downloads' && (
        <div className="px-5 mt-3.5">
          <div className="flex justify-between items-center py-2.5 border-b border-sand mb-3.5">
            <div className="text-[13px] text-ink-muted">٤ جلسات · ١٣٢ م.ب</div>
            <div className="text-[13px] text-coral font-medium">إدارة</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {DOWNLOADS.map(([t, d]) => (
              <LibItem key={t} title={t} sub={d} variant="night" />
            ))}
          </div>
        </div>
      )}

      {/* Scr105 — history */}
      {tab === 'history' && (
        <div>
          {HISTORY.map(([day, items]) => (
            <div key={day} className="px-5 pt-3.5">
              <div className="text-xs text-ink-muted font-semibold tracking-wide">{day}</div>
              <div className="mt-2.5 flex flex-col gap-2">
                {items.map(([t, d]) => (
                  <div key={t} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F8D6BE]" />
                    <div className="flex-1">
                      <div className="text-sm text-ink font-medium">{t}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scr106 — notes */}
      {tab === 'notes' && (
        <div className="px-5 mt-3.5 flex flex-col gap-2.5">
          {NOTES.map(([day, text, v]) => (
            <button key={day} onClick={() => setView('noteDetail')} className="bg-white rounded-[14px] p-3.5 border border-sand text-start">
              <div className="flex items-center gap-2">
                <GradientOrb variant={v} size={24} />
                <div className="text-xs text-coral font-semibold">{day}</div>
              </div>
              <div className="text-sm text-ink mt-2 leading-[1.6]">{text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LibTabsBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div className="flex gap-[18px] px-5 border-b border-sand">
      {TABS.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onTab(key)}
          className="pb-2.5"
          style={{ borderBottom: tab === key ? '2px solid #171B3A' : '2px solid transparent' }}
        >
          <span className={`text-sm ${tab === key ? 'text-ink font-semibold' : 'text-ink-muted'}`}>{label}</span>
        </button>
      ))}
    </div>
  );
}
