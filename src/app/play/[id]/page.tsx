'use client';

// Session player (Scr50-61) plus chooser (47) & complete (48/58) & settings panels.
// Standalone full-screen flow. UI chrome only — a styled play button, no real media.
// Variant selected via ?screen=...:
//   play(50) · breath(54) · chapters(55) · quote(56) · paused(57)
//   waveform(60) · animation(61) · complete(58/48) · chooser(47)
//   duration(52) · settings(53) · sounds(59)

import { use, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientOrb } from '@/components/GradientOrb';
import {
  PlayerShell,
  PlayerHeader,
  PlayerControls,
  PlayerArt,
} from '@/components/learn/player';
import {
  PrimaryBtn,
  SecondaryBtn,
  FlowTopBar,
  CheckIcon,
  gradientCss,
} from '@/components/learn/primitives';
import { getCourse, TEACHERS } from '@/content/courses';

const DURATIONS = ['3 دقائق', '5 دقائق', '10 دقائق', '15 دقيقة', '20 دقيقة', '30 دقيقة'];
const CHAPTERS: [string, string][] = [
  ['الاستقرار', '0:00'],
  ['أول نَفَس', '1:30'],
  ['الملاحظة', '4:00'],
  ['العودة', '7:00'],
  ['الختام', '9:00'],
];
const SETTINGS: [string, string | null, boolean][] = [
  ['أصوات خلفية', 'صوت مطر', true],
  ['جرس في البداية', null, true],
  ['جرس في النهاية', null, true],
  ['التشغيل التلقائي', null, false],
];
const SOUNDS: [string, string][] = [
  ['مطر', 'sage'],
  ['غابة', 'sage'],
  ['محيط', 'lake'],
  ['نار متّقدة', 'ember'],
  ['نسيم', 'lake'],
  ['حشرات الليل', 'night'],
];

function Toggle({ on }: { on: boolean }) {
  return (
    <div className="w-11 h-[26px] rounded-full relative shrink-0" style={{ background: on ? '#171B3A' : '#F0F0F0' }}>
      <div className="absolute top-0.5 w-[22px] h-[22px] rounded-full bg-cream" style={{ insetInlineStart: on ? 20 : 2 }} />
    </div>
  );
}

function PlayerInner({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const screen = params.get('screen') || 'play';
  const course = getCourse(id);
  const [playing, setPlaying] = useState(true);
  const close = () => router.back();

  const title = course?.lessons[2] ?? 'حين يتشتّت العقل';
  const teacher = course?.teacher ?? 'مايا كول';

  // ── Scr52: duration picker (light) ──
  if (screen === 'duration') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-[22px] mt-4">مدّة الجلسة</div>
        <div className="mt-5 flex flex-col gap-2">
          {DURATIONS.map((t, i) => (
            <div
              key={t}
              className="bg-white rounded-[14px] px-[18px] py-4 flex justify-between items-center"
              style={{ border: `1.5px solid ${i === 2 ? '#171B3A' : '#F0F0F0'}` }}
            >
              <span className="text-[15px]">{t}</span>
              {i === 2 && <CheckIcon className="text-ink" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Scr53: player settings (light) ──
  if (screen === 'settings') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-[22px] mt-4">إعدادات المشغّل</div>
        <div className="mt-5 bg-white rounded-[16px] border border-sand">
          {SETTINGS.map(([l, d, on], i) => (
            <div
              key={l}
              className="px-[18px] py-4 flex items-center"
              style={{ borderBottom: i === SETTINGS.length - 1 ? 'none' : '1px solid #F0F0F0' }}
            >
              <div className="flex-1">
                <div className="text-[15px]">{l}</div>
                {d && <div className="text-xs text-ink-muted mt-0.5">{d}</div>}
              </div>
              <Toggle on={on} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Scr59: background sounds (light) ──
  if (screen === 'sounds') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14">
        <FlowTopBar onClose={close} />
        <div className="font-serif text-[22px] mt-4">أصوات خلفية</div>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {SOUNDS.map(([t, v]) => {
            const onLight = ['sage', 'lake', 'ember'].includes(v);
            return (
              <div
                key={t}
                className="rounded-[14px] h-[110px] p-3.5 flex items-end font-serif text-[17px]"
                style={{ background: gradientCss(v), color: onLight ? '#171B3A' : '#FFFFFF' }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Scr47: choose teacher (light) ──
  if (screen === 'chooser') {
    return (
      <div className="min-h-dvh bg-cream max-w-[430px] mx-auto w-full px-5 pt-14 pb-24 relative">
        <FlowTopBar onClose={close} variant="back" />
        <div className="font-serif text-[26px] mt-4">اختر معلّمك</div>
        <div className="text-sm text-ink-muted mt-1.5">يمكنك التبديل في أي وقت.</div>
        <div className="mt-5 flex flex-col gap-2.5">
          {TEACHERS.slice(0, 4).map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-[14px] px-4 py-3.5 flex items-center gap-3.5"
              style={{ border: `1.5px solid ${i === 0 ? '#171B3A' : '#F0F0F0'}` }}
            >
              <div className="w-11 h-11 rounded-full" style={{ background: gradientCss(t.variant) }} />
              <div className="flex-1">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-ink-muted mt-0.5">{t.blurb}</div>
              </div>
              {i === 0 && (
                <div className="w-[22px] h-[22px] rounded-full bg-ink flex items-center justify-center">
                  <CheckIcon size={13} className="text-cream" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 inset-x-5">
          <PrimaryBtn href={`/play/${id}`}>ابدأ الجلسة</PrimaryBtn>
        </div>
      </div>
    );
  }

  // ── Scr58 / Scr48: session complete (dawn) ──
  if (screen === 'complete') {
    return (
      <PlayerShell bg="dawn">
        <div className="px-5 pt-14">
          <FlowTopBar onClose={close} dark right={<span className="text-cream"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg></span>} />
          <GradientOrb variant="dawn" size={140} className="mx-auto my-9" />
          <div className="text-cream text-center">
            <div className="font-serif text-[28px]">أحسنت</div>
            <div className="text-sm opacity-85 mt-2">10 دقائق هادئة — وهي الثالثة على التوالي.</div>
          </div>
          <div className="mt-6 bg-white/[0.18] backdrop-blur-xl rounded-[18px] p-4 text-cream flex justify-between">
            <div>
              <div className="text-[11px] opacity-70">السلسلة</div>
              <div className="font-serif text-[28px] mt-1">3 أيام</div>
            </div>
            <div>
              <div className="text-[11px] opacity-70">هذا الأسبوع</div>
              <div className="font-serif text-[28px] mt-1">34 دقيقة</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-14 inset-x-5 flex flex-col gap-2.5">
          <PrimaryBtn dark href="/reflect">كيف سارت؟</PrimaryBtn>
          <SecondaryBtn dark href="/today">تمّ</SecondaryBtn>
        </div>
      </PlayerShell>
    );
  }

  // ── Scr54: box breathing (night) ──
  if (screen === 'breath') {
    return (
      <PlayerShell bg="night">
        <PlayerHeader course="تأمّل فردي" day="نَفَس الصندوق" onClose={close} />
        <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] rounded-[32px] border-[1.5px] border-cream/35 flex items-center justify-center">
          <div className="text-cream font-serif text-[26px]">استنشِق</div>
        </div>
        <div className="absolute bottom-[130px] inset-x-0 text-center text-cream text-[13px] opacity-70" dir="ltr">4 · 4 · 4 · 4</div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr55: chapters panel (dusk) ──
  if (screen === 'chapters') {
    return (
      <PlayerShell bg="dusk">
        <PlayerHeader onClose={close} />
        <div className="px-6 pt-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 text-cream">
            <div className="text-[11px] font-semibold opacity-70">الفصول</div>
            {CHAPTERS.map(([t, time], i) => (
              <div key={t} className="flex justify-between items-center mt-4" style={{ opacity: i === 1 ? 1 : 0.6 }}>
                <div className={`text-[15px] ${i === 1 ? 'font-semibold' : ''}`}>{t}</div>
                <div className="text-[13px]" dir="ltr">{time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr56: floating quote (dusk) ──
  if (screen === 'quote') {
    return (
      <PlayerShell bg="dusk">
        <PlayerHeader onClose={close} />
        <div className="absolute top-[200px] inset-x-0 text-center text-cream px-8">
          <div className="font-serif text-[22px] opacity-60 italic">&ldquo;لاحظ، دون حكم.&rdquo;</div>
        </div>
        <div className="absolute bottom-[200px] inset-x-0 flex justify-center gap-8">
          {['−15ث', '+15ث'].map((l) => (
            <div key={l} className="w-14 h-14 rounded-full bg-white/[0.18] flex items-center justify-center">
              <span className="text-cream text-base font-semibold">{l}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr57: paused overlay (dusk) ──
  if (screen === 'paused') {
    return (
      <PlayerShell bg="dusk">
        <PlayerHeader onClose={close} />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <div className="absolute top-[280px] inset-x-0 text-center text-cream">
          <div className="font-serif text-[28px]">متوقّف</div>
          <div className="text-sm opacity-70 mt-1.5">خذ وقتك.</div>
        </div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={false} onToggle={() => router.replace(`/play/${id}`)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr60: sleep waveform (night) ──
  if (screen === 'waveform') {
    return (
      <PlayerShell bg="night">
        <PlayerHeader course="جلسة نوم" day="المنارة البطيئة" onClose={close} />
        <div className="absolute top-[240px] inset-x-0 text-center text-cream">
          <div className="font-serif text-[22px]">المنارة البطيئة</div>
          <div className="text-[13px] opacity-60 mt-1.5">بريا شاه · 45 دقيقة</div>
        </div>
        <div className="absolute bottom-[200px] inset-x-9 flex items-center gap-[2px] h-8">
          {Array.from({ length: 40 }).map((_, i) => {
            const h = 4 + Math.abs(Math.sin(i * 0.6)) * 28;
            return <div key={i} className="flex-1 rounded-[1px]" style={{ height: h, background: i < 16 ? '#FFFFFF' : 'rgba(255,255,255,0.25)' }} />;
          })}
        </div>
        <div className="absolute bottom-[160px] inset-x-9 flex justify-between text-xs text-cream/65" dir="ltr">
          <span>18:24</span><span>−26:36</span>
        </div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr61: animated scene (sage) ──
  if (screen === 'animation') {
    return (
      <PlayerShell bg="sage">
        <PlayerHeader course="رسم متحرّك" day="نزهة في الغابة" onClose={close} />
        <div
          className="absolute top-[140px] inset-x-[30px] h-[340px] rounded-[24px] overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #C9D2BE 0%, #8FA084 60%, #4A5C40 100%)' }}
        >
          <div className="absolute top-5 end-[30px] w-[50px] h-[50px] rounded-full bg-[#F1ECDE]" />
          <div className="absolute bottom-0 inset-x-0 h-[60px] bg-[#2A3A22]" />
          <div className="absolute bottom-[60px] inset-x-0 h-[200px]">
            {[0, 30, 60, 90, 130, 180, 230].map((x, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  bottom: i % 2 ? 40 : 20,
                  width: 0,
                  height: 0,
                  borderLeft: '24px solid transparent',
                  borderRight: '24px solid transparent',
                  borderBottom: `${80 + (i % 3) * 20}px solid #3A4A30`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[70px] inset-x-0">
          <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </div>
      </PlayerShell>
    );
  }

  // ── Scr50 (default): standard player (dusk) ──
  return (
    <PlayerShell bg="dusk">
      <PlayerHeader course={course?.title ?? 'الطريق الهادئ'} day="اليوم 3" onClose={close} />
      <PlayerArt variant={course?.variant ?? 'dawn'} />
      <div className="text-center text-cream mt-8 px-8">
        <div className="font-serif text-2xl">{title}</div>
        <div className="text-[13px] opacity-70 mt-1.5">{teacher} · 10 دقائق</div>
      </div>
      <div className="absolute bottom-[130px] inset-x-9">
        <div className="h-[3px] rounded-full bg-cream/20 relative">
          <div className="h-full rounded-full bg-cream" style={{ width: '32%' }} />
          <div className="absolute top-[-4px] w-[11px] h-[11px] rounded-full bg-cream -translate-x-1/2" style={{ insetInlineStart: '32%' }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-cream/70" dir="ltr">
          <span>3:12</span><span>10:00</span>
        </div>
      </div>
      <div className="absolute bottom-[70px] inset-x-0">
        <PlayerControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
      </div>
    </PlayerShell>
  );
}

export default function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="min-h-dvh bg-ink" />}>
      <PlayerInner id={id} />
    </Suspense>
  );
}
