'use client';

// Scr182 — Fixed-star detail (ad-Dabaran). Voice arc + active-now marker.

import { useRouter } from 'next/navigation';

interface StarData {
  name: string;
  sub: string;
  activeNote?: string;
  lineage: string;
  obs: string;
  mean: string;
  shadow: string;
  q: string;
  cycles: [string, string][];
}

const STARS: Record<string, StarData> = {
  dabaran: {
    name: 'الدبران',
    sub: 'ad-Dabaran · تابع الثريّا',
    activeNote: 'نشط الآن · يلامس شمسك ضمن ١°',
    lineage:
      'أوّل ظهور موثَّق في كتالوج عبد الرحمن الصُّوفي · «كتاب صُوَر الكواكب الثابتة» ٩٦٤ م. عند بدو الجزيرة: «التابع» لأنّه يلحق بالثُّريّا في صعودها.',
    obs:
      'نجمٌ أحمر بحجم ٤٤ شمسًا، عينُ الثور في كوكبة الثور. يلحق بالثُّريّا في صعودها كأنّه راعٍ يتبع قطيعه.',
    mean:
      'حضور الدبران في خريطتك يربطك بسلالةٍ من الانتباه — أن تتبعَ ما يُضيء، لا ما يُلَمَّع. شعورٌ أنّ ما يستحقّ يأتي ببطء.',
    shadow: 'التبَعيّة دون اختيار — أن تتبع ضوءًا ليس لك لأنّه أسهل من شقّ ضوئك.',
    q: 'من تتبعه الآن، وهل اخترتَه أم اعتدتَه؟',
    cycles: [
      ['موقع الآن', 'الجوزاء ١٠°٠٢′'],
      ['التقاء مع شمسك', 'مايو ٢٠٢٦'],
      ['الانحراف الحالي', '٠٫٠١٤°/سنة'],
    ],
  },
};

function VoiceArc({ obs, mean, shadow, q }: { obs: string; mean: string; shadow: string; q: string }) {
  const rows: [string, string][] = [
    ['الملاحظة', obs],
    ['المعنى', mean],
    ['الظل', shadow],
  ];
  return (
    <div className="px-5 mt-[18px] flex flex-col gap-4">
      {rows.map(([k, t]) => (
        <div key={k}>
          <div className="text-[11px] text-ink-muted tracking-wide font-semibold">{k}</div>
          <div className="text-[15px] text-ink mt-1.5 leading-[1.7]">{t}</div>
        </div>
      ))}
      <div>
        <div className="text-[11px] text-ink-muted tracking-wide font-semibold">سؤال الروح</div>
        <div className="font-serif italic text-[17px] text-ink mt-1.5 leading-[1.5]">{q}</div>
      </div>
    </div>
  );
}

function CycleBlock({ items }: { items: [string, string][] }) {
  return (
    <div className="mx-5 mt-[18px] p-3.5 bg-white rounded-xl" style={{ border: '1px solid #E8E2D2' }}>
      <div className="text-xs text-ink-muted font-semibold tracking-wide">الدورات</div>
      <div className="mt-2 flex flex-col gap-2">
        {items.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-[13px] text-ink-muted">{k}</span>
            <span className="text-[13px] text-ink font-mono">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalibrateBlock() {
  return (
    <div className="mx-5 mt-3.5 p-3.5 bg-white rounded-xl" style={{ border: '1px solid #E8E2D2' }}>
      <div className="text-xs text-ink-muted font-semibold tracking-wide">ينطبق؟</div>
      <div className="flex gap-2 mt-2.5">
        {([['نعم', true], ['جزئيًا', false], ['لا', false]] as [string, boolean][]).map(([t, sel]) => (
          <div
            key={t}
            className="flex-1 py-2.5 rounded-full text-center"
            style={{ background: sel ? '#8FA084' : '#fff', border: sel ? 'none' : '1px solid #E8E2D2' }}
          >
            <span className="text-[13px] font-medium" style={{ color: sel ? '#fff' : '#171B3A' }}>
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FixedStarDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const s = STARS[slug] ?? STARS.dabaran;

  return (
    <div className="max-w-[430px] mx-auto w-full pb-28 relative">
      <div className="pt-4 px-5 flex justify-between items-center">
        <button onClick={() => router.back()} aria-label="إغلاق" className="text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
        <div className="flex gap-3.5 text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-7-4.5-9.5-9.5C.5 7 4 3 7.5 3c2 0 3.5 1 4.5 2.5C13 4 14.5 3 16.5 3 20 3 23.5 7 21.5 11.5 19 16.5 12 21 12 21z" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.6" fill="#171B3A" />
            <circle cx="12" cy="12" r="1.6" fill="#171B3A" />
            <circle cx="19" cy="12" r="1.6" fill="#171B3A" />
          </svg>
        </div>
      </div>

      <div className="px-5 mt-3.5 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-[28px] bg-cream-soft flex items-center justify-center shrink-0">
          <span className="text-2xl text-coral">✦</span>
        </div>
        <div>
          <div className="font-serif text-2xl text-ink">{s.name}</div>
          <div className="text-xs text-ink-muted mt-1 italic">{s.sub}</div>
        </div>
      </div>

      {s.activeNote && (
        <div className="mx-5 mt-3.5 p-2.5 bg-coral rounded-xl text-cream text-xs font-medium text-center">
          {s.activeNote}
        </div>
      )}

      <div className="mx-5 mt-3.5 p-3.5 bg-white rounded-xl" style={{ border: '1px solid #E8E2D2' }}>
        <div className="text-[11px] text-ink-muted font-semibold tracking-wide">السلالة العلميّة</div>
        <div className="text-[13px] text-ink mt-2 leading-[1.7]">{s.lineage}</div>
      </div>

      <VoiceArc obs={s.obs} mean={s.mean} shadow={s.shadow} q={s.q} />
      <CycleBlock items={s.cycles} />
      <CalibrateBlock />

      <div className="px-5 mt-5">
        <button className="w-full h-[52px] rounded-[26px] bg-ink text-cream text-base font-medium">
          سجّل حدثًا مرتبطًا
        </button>
      </div>
    </div>
  );
}
