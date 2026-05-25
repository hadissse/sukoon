'use client';

// Scr190 — العناصر الأساسية (atoms)
// Scr191 — المُكوّنات المركّبة (composites)
// Combined design-system showcase.

import { GradientOrb } from '@/components/GradientOrb';

function ShelfLabel({ children }: { children: string }) {
  return <div className="text-[11px] text-coral font-bold tracking-wide mt-[22px] mb-3">{children}</div>;
}

const MINI_GRADIENTS: Record<string, [string, string, boolean]> = {
  dawn: ['#F8D6BE', '#E9785E', false],
  sage: ['#C9D2BE', '#8FA084', true],
  night: ['#1B1F47', '#0A0C20', false],
  ember: ['#FFC78A', '#D4651E', false],
};

function MiniCard({ title, subtitle, variant }: { title: string; subtitle: string; variant: keyof typeof MINI_GRADIENTS; w?: number; h?: number }) {
  const [a, b, darkText] = MINI_GRADIENTS[variant];
  return (
    <div
      className="w-[130px] h-[130px] rounded-[14px] relative overflow-hidden p-3.5 flex flex-col justify-end shrink-0"
      style={{ background: `linear-gradient(135deg, ${a}, ${b})`, color: darkText ? '#171B3A' : '#FFFFFF' }}
    >
      <div
        className="absolute rounded-full"
        style={{ top: -39, insetInlineStart: -39, width: 117, height: 117, background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)' }}
      />
      <div className="font-serif text-[17px] font-medium leading-[1.25] relative">{title}</div>
      <div className="text-[11.5px] opacity-75 mt-1 relative">{subtitle}</div>
    </div>
  );
}

function PrimaryBtn({ children }: { children: string }) {
  return (
    <div className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-base flex items-center justify-center w-full">
      {children}
    </div>
  );
}

function SecondaryBtn({ children }: { children: string }) {
  return (
    <div
      className="h-[52px] rounded-[26px] text-ink font-medium text-base flex items-center justify-center w-full"
      style={{ border: '1.2px solid rgba(23,27,58,0.2)' }}
    >
      {children}
    </div>
  );
}

function Atoms() {
  return (
    <>
      <div className="pt-4 px-5">
        <div className="text-[11px] text-coral font-bold tracking-wide">نظام التصميم</div>
        <div className="font-serif text-[26px] text-ink mt-1.5">العناصر الأساسية</div>
        <div className="text-[13px] text-ink-soft mt-1.5">الذرّات التي يُبنى منها كلُّ شيء.</div>
      </div>

      <div className="px-5">
        <ShelfLabel>الأزرار</ShelfLabel>
        <div className="flex flex-col gap-2.5">
          <PrimaryBtn>زرّ رئيسيّ</PrimaryBtn>
          <SecondaryBtn>زرّ ثانويّ</SecondaryBtn>
        </div>

        <ShelfLabel>الـشَّرائط (Chips)</ShelfLabel>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="px-3.5 py-[9px] rounded-full bg-ink">
            <span className="text-[13px] text-cream font-medium">مُختار</span>
          </div>
          <div className="px-3.5 py-[9px] rounded-full bg-white" style={{ border: '1px solid #E8E2D2' }}>
            <span className="text-[13px] text-ink">متاح</span>
          </div>
          <div className="px-3.5 py-[9px] rounded-full bg-cream-soft opacity-50">
            <span className="text-[13px] text-ink">مُعطَّل</span>
          </div>
        </div>

        <ShelfLabel>الحقول</ShelfLabel>
        <div className="bg-white rounded-[14px] px-4 py-3" style={{ border: '1px solid #E8E2D2' }}>
          <div className="text-[11px] text-ink-soft font-semibold tracking-wide">الاسم</div>
          <div className="font-serif text-[18px] text-ink mt-1">هادي</div>
        </div>
        <div className="bg-white rounded-[14px] px-4 py-3 mt-2" style={{ border: '1.5px solid #E9785E' }}>
          <div className="text-[11px] text-coral font-semibold tracking-wide">البريد · تركيز</div>
          <div className="font-serif text-[18px] text-ink mt-1">hadi@…</div>
        </div>

        <ShelfLabel>المُبدِّلات</ShelfLabel>
        <div className="flex justify-between items-center bg-white rounded-[14px] p-3.5" style={{ border: '1px solid #E8E2D2' }}>
          <span className="text-sm text-ink">التذكير اليومي</span>
          <div className="w-11 h-[26px] rounded-[13px] bg-ink relative">
            <div className="absolute top-0.5 w-[22px] h-[22px] rounded-[11px] bg-cream" style={{ insetInlineStart: 20 }} />
          </div>
        </div>
        <div className="flex justify-between items-center bg-white rounded-[14px] p-3.5 mt-2" style={{ border: '1px solid #E8E2D2' }}>
          <span className="text-sm text-ink">مراجعة المساء</span>
          <div className="w-11 h-[26px] rounded-[13px] relative" style={{ background: '#E8E2D2' }}>
            <div className="absolute top-0.5 w-[22px] h-[22px] rounded-[11px] bg-cream" style={{ insetInlineStart: 2 }} />
          </div>
        </div>

        <ShelfLabel>الكُريّات المُتدرِّجة</ShelfLabel>
        <div className="flex flex-wrap gap-3 items-center">
          {(['dawn', 'sage', 'lake', 'dusk', 'ember', 'night', 'dust'] as const).map((v) => (
            <GradientOrb key={v} variant={v} size={50} />
          ))}
        </div>

        <ShelfLabel>قُطْب · قُطْب (الرياحان)</ShelfLabel>
        <div className="bg-white rounded-[14px] p-3.5" style={{ border: '1px solid #E8E2D2' }}>
          <div className="flex justify-between mb-2.5">
            <span className="text-[10px] text-coral font-bold tracking-wider">حرارة</span>
            <span className="text-[10px] font-bold tracking-wider" style={{ color: '#7E97B8' }}>
              حديد
            </span>
          </div>
          <div
            className="relative h-1.5 rounded-[3px]"
            style={{ background: 'linear-gradient(to right, #E9785E, #F8F8F8, #7E97B8)' }}
          >
            <div
              className="absolute w-4 h-4 rounded-lg bg-ink"
              style={{ insetInlineStart: '62%', top: -5, border: '2px solid #FFFFFF' }}
            />
          </div>
          <div className="text-xs text-ink-soft mt-3">مال إلى الحديد · ٠٫٦٢</div>
        </div>

        <ShelfLabel>شريط التصويت (vote bar)</ShelfLabel>
        <div className="bg-white rounded-[14px] p-3.5" style={{ border: '1px solid #E8E2D2' }}>
          <div className="flex flex-wrap gap-1.5">
            {([['صحيح', true], ['دافئ', false], ['هادئ', false], ['مُحرِّك', false], ['مُسطَّح', false], ['بعيد', false]] as [string, boolean][]).map(
              ([t, sel]) => (
                <div
                  key={t}
                  className="px-2.5 py-1.5 rounded-full"
                  style={{ background: sel ? '#171B3A' : 'transparent', border: `1px solid ${sel ? '#171B3A' : '#E8E2D2'}` }}
                >
                  <span className="text-[10px] tracking-wider font-semibold" style={{ color: sel ? '#fff' : '#5C5C7A' }}>
                    {t}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <ShelfLabel>الفواصل</ShelfLabel>
        <div className="h-px bg-ink opacity-60" />
        <div className="h-px mt-2" style={{ background: '#E8E2D2' }} />
        <div className="mt-2" style={{ borderTop: '1px dashed #E8E2D2' }} />
      </div>
    </>
  );
}

function Composites() {
  return (
    <>
      <div className="pt-8 px-5">
        <div className="text-[11px] text-coral font-bold tracking-wide">نظام التصميم</div>
        <div className="font-serif text-[26px] text-ink mt-1.5">المُكوّنات</div>
        <div className="text-[13px] text-ink-soft mt-1.5">عناصر مُجمّعة جاهزة.</div>
      </div>

      <div className="px-5">
        <ShelfLabel>بطاقة المعايرة</ShelfLabel>
        <div className="bg-white rounded-[14px] p-4" style={{ border: '1px solid #E8E2D2' }}>
          <div className="font-serif text-sm text-ink leading-[1.7]">تتحرّك نحو ما لم يكتمل قبل ما هو مريح.</div>
          <div className="flex gap-2 mt-3.5">
            {([['نعم', true], ['أحيانًا', false], ['ليس أنا', false]] as [string, boolean][]).map(([t, sel]) => (
              <div
                key={t}
                className="flex-1 px-3 py-2.5 rounded-full text-center"
                style={{ background: sel ? '#171B3A' : 'transparent', border: sel ? 'none' : '1px solid #E8E2D2' }}
              >
                <span className="text-xs font-medium" style={{ color: sel ? '#fff' : '#171B3A' }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ShelfLabel>البطاقات الصغيرة</ShelfLabel>
        <div className="flex gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <MiniCard title="نَفَس واحد" subtitle="٣٠ ث" variant="dawn" w={130} h={130} />
          <MiniCard title="مسح للجسد" subtitle="٥ دقائق" variant="sage" w={130} h={130} />
          <MiniCard title="حكاية ليلة" subtitle="٤٥ د" variant="night" w={130} h={130} />
          <MiniCard title="فجرٌ بطيء" subtitle="١٢ دقيقة" variant="ember" w={130} h={130} />
        </div>

        <ShelfLabel>البطاقة البطلة</ShelfLabel>
        <div
          className="rounded-[22px] p-[22px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F8D6BE, #E9785E)' }}
        >
          <div
            className="absolute w-40 h-40 rounded-full"
            style={{ top: -40, insetInlineEnd: -40, background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)' }}
          />
          <div className="relative">
            <div className="text-[11px] font-semibold tracking-wide text-ink/75 uppercase">عبور اليوم</div>
            <div className="font-serif text-[22px] text-ink mt-2 leading-[1.3]">زحل يلتقي شمسك</div>
            <div className="text-xs text-ink/[0.78] mt-1.5">قراءة كاملة · ٧ دقائق</div>
          </div>
        </div>

        <ShelfLabel>صفوف القائمة</ShelfLabel>
        <div className="bg-white rounded-[14px]" style={{ border: '1px solid #E8E2D2' }}>
          {([['الحساب', 'هادي الموسوي'], ['اللغة', 'عربيّة'], ['الإشعارات', 'مفعّلة']] as [string, string][]).map(
            ([k, v], i, a) => (
              <div
                key={k}
                className="p-3.5 flex justify-between items-center"
                style={{ borderBottom: i === a.length - 1 ? 'none' : '1px solid #E8E2D2' }}
              >
                <span className="text-sm text-ink">{k}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[13px] text-ink-soft">{v}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </span>
              </div>
            )
          )}
        </div>

        <ShelfLabel>الشريط العلوي</ShelfLabel>
        <div className="bg-white/95 rounded-[14px] p-3.5 flex justify-between items-center" style={{ border: '1px solid #E8E2D2' }}>
          <div className="font-serif text-[22px] text-ink">اليوم</div>
          <div className="flex gap-3.5 items-center text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171B3A" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19 5l-1.5 1.5M6.5 17.5L5 19M19 19l-1.5-1.5M6.5 6.5L5 5" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171B3A" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.5-4.5" />
            </svg>
            <span className="text-[17px] text-coral">✦</span>
          </div>
        </div>

        <ShelfLabel>شريط التبويب السفلي</ShelfLabel>
        <div
          className="relative bg-white/95 rounded-[14px] px-3.5 py-2.5 flex justify-around items-center"
          style={{ border: '1px solid #E8E2D2' }}
        >
          {([['ذاتك', false], ['استكشاف', false], ['اليوم', true]] as [string, boolean][]).map(([t, a]) => (
            <div key={t} className="flex flex-col items-center gap-1">
              <div
                className="w-[22px] h-[22px] rounded-[11px] flex items-center justify-center text-[11px]"
                style={{ background: a ? '#171B3A' : '#F8F8F8', color: a ? '#fff' : '#171B3A' }}
              >
                ◆
              </div>
              <span className="text-[10px]" style={{ color: a ? '#171B3A' : '#5C5C7A', fontWeight: a ? 600 : 400 }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-12">
      <Atoms />
      <Composites />
    </div>
  );
}
