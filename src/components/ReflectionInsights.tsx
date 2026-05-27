'use client';

import { useEffect, useState } from 'react';
import { Meta } from '@/components/Meta';
import { Body } from '@/components/Body';
import { loadEvents, STREAM_AR, type StreamKey } from '@/lib/events';
import { computeInsights, type ReflectionInsights as Insights } from '@/lib/insights';

// What does each dominant stream tend to mean for the person living it?
const STREAM_REFLECTION: Record<StreamKey, string> = {
  thinking:
    'تيّارك الغالب هو الفكر — أنت من ينقّب في المعنى ويُسائل قبل أن يتحرّك. أين تذهب طاقتك إلى الإحساس والإرادة؟',
  feeling:
    'تيّارك الغالب هو الشعور — تعيش بالقلب وتقرأ ما تحت السطح. كيف توازن الإحساس بفعلٍ يخدمك؟',
  willing:
    'تيّارك الغالب هو الإرادة — تحرّك ما حولك بفعلٍ صادق. أين تتوقّف لتسمع شعورك وفكرك؟',
};

const STREAM_COLOR: Record<StreamKey, string> = {
  thinking: '#7E97B8',
  feeling: '#E9785E',
  willing: '#8FA084',
};

export function ReflectionInsights() {
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    setInsights(computeInsights(loadEvents()));
  }, []);

  if (!insights) return null;

  // Below the 7-event threshold the pattern isn't trustworthy yet — show a
  // gentle nudge instead of fabricating insight from noise.
  if (insights.totalEvents < 7) {
    const remaining = 7 - insights.totalEvents;
    return (
      <div className="rounded-[20px] bg-cream-soft p-5 border border-rule-soft">
        <Meta>أنماطك</Meta>
        <div className="mt-2">
          <Body muted>
            {remaining === 0
              ? 'سيظهر هنا إيقاع لحظاتك قريبًا.'
              : `سجّل ${remaining} ${remaining === 1 ? 'تأمّلًا إضافيًّا' : 'تأمّلات إضافيّة'} لتبدأ أنماطك في الظهور.`}
          </Body>
        </div>
      </div>
    );
  }

  const stream = insights.dominantStream;
  const balance = insights.averageRhythm;
  const balanceLabel =
    balance === null
      ? null
      : balance < 45
      ? 'مالت إلى التوسّع'
      : balance > 55
      ? 'مالت إلى الانكماش'
      : 'بقيت متوازنة';

  return (
    <div className="rounded-[20px] bg-cream-soft p-5 border border-rule-soft flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Meta>أنماطك</Meta>
        <span className="text-[11px] text-ink-muted">{insights.totalEvents} لحظة</span>
      </div>

      {stream && (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-semibold tracking-wider text-ink-muted">التيّار الغالب</div>
          <div className="font-serif text-[15px] text-ink leading-[1.7]">
            {STREAM_REFLECTION[stream]}
          </div>
          <StreamBar dist={insights.streamDistribution} />
        </div>
      )}

      {balance !== null && balanceLabel && (
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold tracking-wider text-ink-muted">إيقاعك</div>
          <Body>
            أيّامك في هذه الفترة{' '}
            <span className="text-ink font-medium">{balanceLabel}</span> — {insights.expansionPercent}٪ توسّع، {insights.contractionPercent}٪ انكماش.
          </Body>
        </div>
      )}

      {(insights.mostCommonHardSky || insights.mostCommonLightSky) && (
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold tracking-wider text-ink-muted">السماء حين كنتَ</div>
          {insights.mostCommonHardSky && (
            <Body>
              في الانكماش: <span className="text-ink font-medium">{insights.mostCommonHardSky}</span>
            </Body>
          )}
          {insights.mostCommonLightSky && (
            <Body>
              في التوسّع: <span className="text-ink font-medium">{insights.mostCommonLightSky}</span>
            </Body>
          )}
        </div>
      )}
    </div>
  );
}

function StreamBar({ dist }: { dist: Record<StreamKey, number> }) {
  const total = dist.thinking + dist.feeling + dist.willing;
  if (total === 0) return null;
  const segs: Array<{ key: StreamKey; pct: number }> = [
    { key: 'thinking', pct: (dist.thinking / total) * 100 },
    { key: 'feeling', pct: (dist.feeling / total) * 100 },
    { key: 'willing', pct: (dist.willing / total) * 100 },
  ];
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex h-2 rounded-full overflow-hidden bg-rule-soft">
        {segs.map(
          (s) =>
            s.pct > 0 && (
              <div key={s.key} style={{ width: `${s.pct}%`, background: STREAM_COLOR[s.key] }} />
            ),
        )}
      </div>
      <div className="flex justify-between text-[11px] text-ink-muted">
        {segs.map((s) => (
          <span key={s.key}>
            {STREAM_AR[s.key]} {Math.round(s.pct)}٪
          </span>
        ))}
      </div>
    </div>
  );
}
