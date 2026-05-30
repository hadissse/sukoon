'use client';
import Link from 'next/link';

const SUKOON_URL = 'https://sukoon.arabic-astro.com';

function ScreenPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-purple-900/40 bg-gradient-to-b from-[#1a1040] to-[#0d0820] flex flex-col items-center justify-center text-center p-6 aspect-[9/16] max-h-[480px] shadow-xl">
      <div className="w-12 h-1 bg-purple-500/40 rounded-full mb-6" />
      <div className="text-purple-300/50 text-xs leading-relaxed">{label}</div>
      <div className="w-8 h-0.5 bg-purple-500/20 rounded-full mt-6" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-medium text-[#E9785E] bg-[#E9785E]/10 border border-[#E9785E]/20 px-3 py-1 rounded-full mb-4">
      {children}
    </span>
  );
}

export function SukoonApp() {
  return (
    <main dir="rtl" className="bg-[#0d0820] min-h-screen text-white overflow-x-hidden">

      {/* ── 1. Hero / Splash ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #4a1d8a55 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, #7c3aed22 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, #2d1b6922 0%, transparent 55%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/sukoon-logo.png"
              alt="سُكون"
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-arabic, serif)' }}>
            سُكون
          </h1>
          <p className="text-xl md:text-2xl text-purple-200/80 leading-relaxed mb-4 max-w-xl mx-auto">
            يُعيد إليك سُلطتك على نفسك من خلال السماء الحيّة
          </p>
          <p className="text-base text-purple-300/60 leading-relaxed mb-10 max-w-lg mx-auto">
            خريطة ميلادك، وصوتٌ هادئٌ في التأمّل والإرشاد الروحي يصفُ ما تراه قبل أن يُفسّره. لسنا هنا لنُخبرك بما سيحدث، بل لنفتح لك ما يحدث.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`${SUKOON_URL}/welcome`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#E9785E] hover:bg-[#d4684e] text-white px-8 py-3.5 rounded-xl font-medium text-base transition-colors shadow-lg">
              ابدأ مجانًا
            </a>
            <a href={SUKOON_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white px-8 py-3.5 rounded-xl font-medium text-base transition-colors">
              تسجيل الدخول
            </a>
          </div>
        </div>
        {/* Stars decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: 'radial-gradient(1px 1px at 20% 15%, white, transparent), radial-gradient(1px 1px at 80% 25%, white, transparent), radial-gradient(1px 1px at 40% 60%, white, transparent), radial-gradient(1px 1px at 65% 45%, white, transparent), radial-gradient(1.5px 1.5px at 10% 70%, white, transparent), radial-gradient(1px 1px at 90% 80%, white, transparent), radial-gradient(1px 1px at 55% 85%, white, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0d0820)' }} />
      </section>

      {/* ── 2. Philosophy ── */}
      <section className="py-20 px-6 border-t border-purple-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>النيّة</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
            ليس تطبيقَ أبراجٍ عابرًا
          </h2>
          <p className="text-lg text-purple-200/70 leading-loose max-w-2xl mx-auto">
            سُكون تجربةٌ متّجهةٌ إلى الداخل تمزج تقاليد علم الفلك الغربيّ والعربيّ والروحيّ مع التدوين، وسؤالِ الذات، ويقظةِ كلِّ يوم. اسمُ التطبيق وحده بيانُ نيّته: السكينة، الطمأنينة، اللحظةُ الصافية التي تقف فيها أمام سمائك.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-right">
            {[
              { label: 'الفلك الغربيّ', desc: 'خريطة ميلادك الكاملة بالكواكب والبيوت والزوايا بدقة فلكية' },
              { label: 'الفلك العربيّ', desc: 'تقاليد التنجيم العربي والروحي المتجذّر في ثقافتنا' },
              { label: 'التأمّل والتدوين', desc: 'سؤال اليوم، تسجيل اللحظة، والمراجعة المسائية' },
            ].map((t) => (
              <div key={t.label} className="bg-white/5 border border-purple-800/30 rounded-2xl p-6">
                <div className="text-[#E9785E] font-semibold mb-2">{t.label}</div>
                <p className="text-purple-200/60 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Design & Identity ── */}
      <section className="py-20 px-6 bg-[#110c2a]/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>الهويّة البصريّة</SectionLabel>
              <h2 className="text-3xl font-bold mb-6">واجهةٌ عربيةٌ بالكامل</h2>
              <p className="text-purple-200/70 leading-loose mb-6">
                من اليمين إلى اليسار، بهويةٍ بصريّةٍ ناعمةٍ من تدرّجاتِ الموف والأرجوانيّ الترابيّ والطين والميرميّة والبيج الدافئ، مع رسومٍ سماويّةٍ شاعريّة تمنح التجربة طابعًا تأمّليًّا.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { color: '#6B3FA0', label: 'موف' },
                  { color: '#8FA084', label: 'ميرميّة' },
                  { color: '#E9785E', label: 'مرجاني' },
                  { color: '#C4A882', label: 'بيج دافئ' },
                  { color: '#7E97B8', label: 'بحري' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-purple-200/70">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ScreenPlaceholder label="شاشة الافتتاح / الشعار مع الخلفية الليلية المتدرّجة" />
          </div>
        </div>
      </section>

      {/* ── 4. Navigation ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>بنية التنقّل</SectionLabel>
            <h2 className="text-3xl font-bold mb-4">ثلاثة أبواب، عالمٌ واحد</h2>
            <p className="text-purple-200/60 max-w-xl mx-auto">شريط تنقّلٍ سفليٌّ بسيط يُوصلك إلى كل ما تحتاج</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { tab: 'اليوم', icon: '◎', desc: 'الشاشة اليوميّة — السماء الراهنة، عبوراتك الشخصية، سؤال التأمّل، والمراجعة المسائية', color: '#E9785E' },
              { tab: 'استكشاف', icon: '◌', desc: 'خريطة السماء الحيّة، تقويم العبورات الشهري، ومكتبة المعرفة الفلكيّة', color: '#7E97B8' },
              { tab: 'أنت', icon: '◆', desc: 'خريطتك الميلادية الكاملة وتفسيراتها الشخصية التفاعلية', color: '#8FA084' },
            ].map((t) => (
              <div key={t.tab} className="bg-white/5 border border-purple-800/30 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                  style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}40` }}>
                  {t.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: t.color }}>{t.tab}</h3>
                <p className="text-purple-200/60 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <ScreenPlaceholder label="شريط التنقّل السفلي مع الرأس العلوي وزر +" />
          </div>
        </div>
      </section>

      {/* ── 5. Onboarding ── */}
      <section className="py-20 px-6 bg-[#110c2a]/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>الدخول الأول</SectionLabel>
              <h2 className="text-3xl font-bold mb-6">ستّون ثانية إلى خريطتك</h2>
              <p className="text-purple-200/70 leading-loose mb-8">
                إعدادٌ قصير في أربع خطوات: الاسم، تاريخ الميلاد، ساعة الميلاد مع مسارٍ خاصٍّ لمن لا يعرف ساعته، ثمّ مكان الميلاد محدَّدًا جغرافيًا.
              </p>
              <div className="space-y-4">
                {[
                  'تُحسَب خريطتك محليًّا على جهازك دون اتصال بالشبكة',
                  'تشمل الشمس والقمر وعطارد حتى بلوتو',
                  'خيرون والعقدتان والطالع',
                  'الحساب فوريٌّ ومحفوظٌ على جهازك',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-[#8FA084] mt-0.5 text-lg leading-none">·</span>
                    <p className="text-purple-200/70 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['الاسم', 'تاريخ الميلاد', 'ساعة الميلاد', 'مكان الميلاد'].map((step) => (
                <ScreenPlaceholder key={step} label={`شاشة الدخول — ${step}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Today Screen ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>شاشة اليوم</SectionLabel>
            <h2 className="text-3xl font-bold mb-4">قلبُ التطبيق العاطفيّ</h2>
            <p className="text-purple-200/60 max-w-xl mx-auto">تفتح بتحيّةٍ بحسب الوقت ثمّ تعرض السماءَ الراهنة في لافتةٍ عريضةٍ بتدرّجٍ هادئ</p>
          </div>

          {/* Today cards grid */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Sky Now */}
            <div className="bg-gradient-to-br from-[#1a1040] to-[#0d0820] border border-purple-900/40 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">السماء الآن</h3>
                <span className="text-xs text-[#E9785E] border border-[#E9785E]/30 px-2 py-0.5 rounded-full">مباشر</span>
              </div>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-4">
                تنقل اللافتة أهمَّ طاقةٍ فلكيّةٍ تجري في اللحظة — الموضع البُرجيّ واليوم والكوكب الحاكم، مع رابطٍ لاستكشاف السماء.
              </p>
              <div className="mt-4">
                <ScreenPlaceholder label="لافتة السماء الآن مع تدرّج العقرب" />
              </div>
            </div>

            {/* What touches you */}
            <div className="bg-gradient-to-br from-[#1e0e2a] to-[#0d0820] border border-purple-900/40 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">ما يمسّك اليوم</h3>
                <span className="text-xs text-[#8FA084] border border-[#8FA084]/30 px-2 py-0.5 rounded-full">شخصيّ</span>
              </div>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-2">
                القراءة الشخصيّة الأهمّ — أقوى عبورٍ كوكبيٍّ على خريطتك بمقدار الاقتران بالدرجة.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['دافئ', 'هادئ', 'محرّك', 'ساكن'].map((tag) => (
                  <span key={tag} className="text-xs bg-purple-800/40 text-purple-300 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-4">
                <ScreenPlaceholder label="بطاقة ما يمسّك اليوم مع وسوم المزاج ومقدار الاقتران" />
              </div>
            </div>

            {/* Daily Question */}
            <div className="bg-gradient-to-br from-[#1f1508] to-[#0d0820] border border-[#C4A882]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">سؤال اليوم</h3>
              <div className="bg-[#C4A882]/10 border border-[#C4A882]/20 rounded-xl p-4 mb-4">
                <p className="text-[#C4A882] text-base leading-relaxed font-medium">
                  «مَن أنت حين لا يراك أحد؟»
                </p>
              </div>
              <p className="text-purple-200/50 text-sm leading-relaxed">
                سؤالٌ تأمّليٌّ يوميّ بلونٍ طينيٍّ دافئ، مع رابط مباشر لنظام التدوين.
              </p>
              <ScreenPlaceholder label="بطاقة سؤال اليوم بالخلفية الطينية" />
            </div>

            {/* Weekly Journey */}
            <div className="bg-gradient-to-br from-[#0a1a10] to-[#0d0820] border border-[#8FA084]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">رحلتك الأسبوعية</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-4">
                مسارٌ داخليٌّ من سبع خطوات عبر خريطتك — برنامجٌ موجّهٌ يصل موضوعاتِ السماء بتمارينِ التأمّل الشخصيّ.
              </p>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5,6,7].map((n) => (
                  <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= 3 ? 'bg-[#8FA084]' : 'bg-[#8FA084]/20'}`} />
                ))}
              </div>
              <ScreenPlaceholder label="بطاقة رحلتك الأسبوعية بلون الميرميّة" />
            </div>

            {/* Knowledge */}
            <div className="bg-gradient-to-br from-[#1a140a] to-[#0d0820] border border-[#C4A882]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">المعرفة</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-2">
                موضوعٌ معرفيٌّ يجمع تقاليدَ علم الفلك الثلاثة: الغربيّ والعربيّ والروحيّ.
              </p>
              <div className="text-[#C4A882] text-xs mb-4">الأسس · السلاسل · المعلّمون</div>
              <ScreenPlaceholder label="بطاقة المعرفة البيجية" />
            </div>

            {/* Body & Moon */}
            <div className="bg-gradient-to-br from-[#12082a] to-[#0d0820] border border-[#7E97B8]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">الجسد والقمر</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-4">
                تربط موضعَ القمر الراهن بوعيِ الجسد — بطاقةٌ مرسومةٌ بقمرٍ متوهّجٍ في الأرجوانيّ العميق.
              </p>
              <ScreenPlaceholder label="بطاقة الجسد والقمر في العقرب" />
            </div>

          </div>

          {/* Evening Reflection */}
          <div className="mt-8 bg-gradient-to-r from-[#0d0820] via-[#1a1040] to-[#0d0820] border border-purple-900/40 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">المراجعة المسائية</h3>
                <p className="text-purple-200/60 leading-loose">
                  طقسٌ ليليٌّ في ختام شاشة اليوم: <strong className="text-purple-200/80">ثلاث لحظات من يومك</strong> — دعوةٌ قبل النوم لإغلاق يومك بتأمّلٍ مقصود.
                </p>
              </div>
              <ScreenPlaceholder label="بطاقة المراجعة المسائية / قبل النوم" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Explore Screen ── */}
      <section className="py-20 px-6 bg-[#110c2a]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>شاشة استكشاف</SectionLabel>
            <h2 className="text-3xl font-bold mb-4">السماء · التقويم · المعرفة</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white/5 border border-purple-800/30 rounded-2xl p-5">
              <h3 className="text-[#7E97B8] font-bold mb-3">السماء</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-4">
                عجلةٌ فلكيّةٌ حيّةٌ تُظهر مواضعَ الكواكب لحظةً بلحظة مع تحديثٍ كلَّ دقيقة، وجدولٌ مفصّلٌ بمواضع الكواكب.
              </p>
              <ScreenPlaceholder label="عجلة السماء الحيّة مع جدول مواضع الكواكب" />
            </div>

            <div className="bg-white/5 border border-purple-800/30 rounded-2xl p-5">
              <h3 className="text-[#E9785E] font-bold mb-3">التقويم</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-3">
                الأحداث الكونية الجماعية للشهر — بنقاطٍ ملوّنةٍ على الأيّام ذات الأحداث.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  { label: 'اقترانات', color: '#ef4444' },
                  { label: 'منسجمة', color: '#3b82f6' },
                  { label: 'دخول القمر', color: '#22c55e' },
                  { label: 'وقوف', color: '#9ca3af' },
                  { label: 'تثليث', color: '#f97316' },
                ].map((c) => (
                  <span key={c.label} className="flex items-center gap-1 text-xs text-purple-200/60">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </span>
                ))}
              </div>
              <ScreenPlaceholder label="تقويم العبورات الشهري مع دليل الألوان" />
            </div>

            <div className="bg-white/5 border border-purple-800/30 rounded-2xl p-5">
              <h3 className="text-[#8FA084] font-bold mb-3">المعرفة</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed mb-3">
                مكتبةٌ معرفيّةٌ من وحداتٍ مفهوميّة ودوراتٍ نجمية ببرامجَ موجّهةٍ متعدّدةِ الأيّام.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['برجك الشمسي', 'برجك القمري', 'البيوت', 'طالعك', 'أطوار القمر', 'عودة زحل', 'كيرون'].map((t) => (
                  <span key={t} className="text-xs bg-purple-800/30 text-purple-300/70 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <ScreenPlaceholder label="مكتبة المعرفة مع وحداتها وقسم الدورات" />
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. Self Screen ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>شاشة أنت</SectionLabel>
              <h2 className="text-3xl font-bold mb-6">مركزُ خريطتك الشخصيّة</h2>
              <p className="text-purple-200/70 leading-loose mb-6">
                عجلةُ الخريطة الميلادية بارزةٌ، مع بطاقاتٍ قابلةٍ للتمرير لكلِّ كوكب — الخريطة، الجسد، العبورات، القوس.
              </p>
              <p className="text-purple-200/70 leading-loose mb-6">
                نقرُ تفصيلِ أيِّ جانبٍ يفتح صفحته مع <strong className="text-white">فحصِ صدًى</strong>: ينطبق؟ نعم / جزئيًّا / لا — وزرِّ تسجيل حدثٍ مرتبط. الخريطةُ آلةٌ تُعايرها بنفسك لا نصًّا تتلقّاه.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['الكواكب', 'الأبراج', 'البيوت', 'الجوانب', 'النجوم الثابتة'].map((tab) => (
                  <span key={tab} className="text-xs border border-purple-700/50 text-purple-300/70 px-3 py-1.5 rounded-full">{tab}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <ScreenPlaceholder label="شاشة أنت — عجلة الخريطة مع بطاقة تفسير الكوكب" />
              <ScreenPlaceholder label="صفحة تفصيل جانب مع فحص ينطبق؟" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Moment Logging ── */}
      <section className="py-20 px-6 bg-[#110c2a]/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <ScreenPlaceholder label="شاشة تسجيل لحظة — ماذا حدث؟" />
              <ScreenPlaceholder label="صفحة التتبّع اليومي مع تبويب الفئات الفلكية" />
            </div>
            <div>
              <SectionLabel>تسجيل اللحظة</SectionLabel>
              <h2 className="text-3xl font-bold mb-6">لا تشرح، شُمّ.</h2>
              <p className="text-purple-200/70 leading-loose mb-6">
                من زرِّ + تفتح شاشةَ التسجيل بدعوةٍ دافئةٍ بسيطة: <strong className="text-white">ماذا حدث؟</strong> سطرٌ واحدٌ يكفي.
              </p>
              <p className="text-purple-200/70 leading-loose mb-6">
                صفحةُ التتبّع تجمع لحظاتك بحسب فئاتٍ فلكيّة: بالكواكب، بالأبراج، بالبيوت.
              </p>
              <div className="bg-[#1a1040] border border-purple-800/30 rounded-xl p-4">
                <p className="text-purple-200/40 text-sm">لم تسجّل أي لحظات بعد.</p>
                <p className="text-[#E9785E] text-sm mt-1">سجّل أول لحظة لك ←</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Privacy ── */}
      <section className="py-16 px-6 border-t border-purple-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>الخصوصيّة</SectionLabel>
          <h2 className="text-2xl font-bold mb-4">خصوصيّتك جزءٌ من التصميم</h2>
          <p className="text-purple-200/60 leading-loose">
            بياناتك محفوظةٌ محليًّا افتراضيًّا على جهازك. لا تتبّعَ خارجيًّا ولا إعلانات. المزامنة السحابيّة خيارٌ إضافيّ تختاره أنت. الحساب يُحسَب دون اتصالٍ بالشبكة.
          </p>
        </div>
      </section>

      {/* ── 11. Why Sukoon / CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #4a1d8a33 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <SectionLabel>لماذا سُكون</SectionLabel>
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            السماء ليست قَدَرًا يُملى عليك
          </h2>
          <p className="text-xl text-purple-200/70 leading-loose mb-8">
            بل مرآةٌ تنظر فيها فتعرف نفسك أكثر وتختار بحرّية أوسع.
          </p>
          <p className="text-purple-200/50 leading-loose mb-12">
            سُكون يصل التتبّعَ الحيَّ للسماء بتفسيرِ خريطتك، وسؤالِ اليوم، وتدوينِ اللحظة، وتقويمِ العبورات، والمكتبةِ التعليميّة، والرحلاتِ الأسبوعيّة — في منصّةٍ واحدةٍ للنموّ الشخصيّ.
          </p>
          <p className="text-lg text-white/80 font-medium mb-10">
            هذا هو السُكون الذي نقصده: حضورُك أمام سمائك، صافيًا، حُرًّا، صاحبَ الكلمة الأخيرة على حياتك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${SUKOON_URL}/welcome`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#E9785E] hover:bg-[#d4684e] text-white px-10 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg"
            >
              ابدأ رحلتك مجانًا
            </a>
            <a
              href={SUKOON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white px-10 py-4 rounded-xl font-medium text-lg transition-colors"
            >
              sukoon.arabic-astro.com
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
