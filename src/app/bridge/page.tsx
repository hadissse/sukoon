'use client';

// Scr222 — جسر · حسابك جاهز · لنتعرّف عليك
// Bridge between account creation and the short natal flow.

import Link from 'next/link';

const FIELD_ICONS = [
  <svg key="date" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  <svg key="time" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  <svg key="place" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 4.5-7 13-7 13S5 13.5 5 9a7 7 0 0 1 7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
];

const FIELDS: { label: string; sub: string }[] = [
  { label: 'تاريخ الميلاد', sub: 'اليوم والشهر والسنة' },
  { label: 'وقت الميلاد', sub: 'بدقّة الدقائق إن أمكن — لا بأس بالتقريب' },
  { label: 'مكان الميلاد', sub: 'المدينة فقط — لا نسأل عن العنوان' },
];

export default function BridgePage() {
  return (
    <div className="min-h-dvh flex flex-col max-w-[430px] mx-auto w-full">
      {/* eyebrow */}
      <div className="pt-[18px] px-6 flex justify-between items-center">
        <div className="text-[11px] text-ink-muted tracking-wide font-semibold font-mono">٢ / ٢ · بيانات الميلاد</div>
        <div className="text-[11px] text-ink-muted tracking-wide">تخطّي</div>
      </div>

      {/* progress bar */}
      <div className="mx-6 mt-2.5 h-[3px] rounded-sm relative overflow-hidden" style={{ background: '#E8E2D2' }}>
        <div className="absolute top-0 bottom-0 bg-ink" style={{ insetInlineEnd: 0, width: '50%' }} />
      </div>

      {/* hero */}
      <div className="px-7 pt-9 flex flex-col items-center">
        <div
          className="w-[84px] h-[84px] rounded-[42px] flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 30% 25%, #C9D2BE, #8FA084 70%)', boxShadow: '0 8px 24px rgba(143,160,132,0.2)' }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="font-serif text-[30px] text-ink mt-[22px] font-medium text-center leading-[1.2]">حسابك جاهز</div>
        <div className="text-[14.5px] text-ink-muted mt-2 leading-[1.7] text-center max-w-[300px]">
          الآن لنتعرّف على <span className="text-ink font-medium">خريطتك الرئيسية</span>.
        </div>
      </div>

      {/* fields preview */}
      <div className="mx-5 mt-7">
        <div className="bg-white rounded-2xl px-1 py-2" style={{ border: '1px solid #E8E2D2' }}>
          {FIELDS.map((row, i, arr) => (
            <div
              key={row.label}
              className="flex items-center gap-3.5 px-4 py-3"
              style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F8F8F8' }}
            >
              <div className="w-9 h-9 rounded-xl bg-cream-soft flex items-center justify-center shrink-0">
                {FIELD_ICONS[i]}
              </div>
              <div className="flex-1">
                <div className="text-[14.5px] text-ink font-medium">{row.label}</div>
                <div className="text-[11.5px] text-ink-muted mt-0.5 leading-[1.5]">{row.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3.5 px-1">
          <div className="text-[11px] text-coral font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(233,120,94,0.08)' }}>
            ٣ أسئلة · ٦٠ ثانية
          </div>
          <div className="text-[11px] text-ink-muted flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>لا تُشارَك مع أحد</span>
          </div>
        </div>
      </div>

      {/* secondary charts note */}
      <div
        className="mx-5 mt-[18px] px-3.5 py-3 bg-white rounded-xl text-[12.5px] text-ink-soft leading-[1.7]"
        style={{ borderInlineStart: '3px solid #7E97B8' }}
      >
        هذه خريطتك أنت. يمكنك إضافة آخرين لاحقًا — شريك، أبناء، أصدقاء — من تبويب «ذاتك».
      </div>

      <div className="flex-1" />

      {/* actions */}
      <div className="px-5 pb-9 pt-4 flex flex-col gap-2.5">
        <Link
          href="/onboarding"
          className="w-full h-[52px] rounded-[26px] bg-ink text-cream text-base font-medium flex items-center justify-center"
        >
          ابدأ
        </Link>
        <div className="text-center py-2.5 text-sm text-ink-muted font-medium">لاحقًا في الإعدادات</div>
      </div>
    </div>
  );
}
