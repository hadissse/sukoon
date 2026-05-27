'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBack,
  Orb,
  PALETTE,
  PrimaryBtn,
  ProgressBar,
} from '@/components/onboarding/PreAppUI';
import { Logo } from '@/components/Logo';
import { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail, resetPassword } from '@/lib/auth';

/**
 * /welcome — pre-app intro flow covering design screens Scr01–Scr18.
 *
 * Phases:
 *   splash       Scr01      logo
 *   breathe-in   Scr02      استنشِق + large orb
 *   breathe-out  Scr03      ازفِر + small orb
 *   welcome      Scr04/05   single circle + logo + auth providers inline
 *   auth: signin Scr07      email sign-in form
 *   auth: signup Scr08      sign-up form
 *   auth: reset  Scr09      password reset
 *   auth: verify Scr10      verification sent
 *   intro 0..7   Scr11–18   about carousel (progress bar)
 *
 * NOTE: auth screens are local UI only — no real authentication or account
 * creation. The app uses anonymous local storage. Buttons advance the flow.
 */

type Phase =
  | 'splash'
  | 'breathe-in'
  | 'breathe-out'
  | 'welcome'
  | 'signin'
  | 'signup'
  | 'reset'
  | 'verify'
  | 'intro';

interface IntroSlide {
  orb: 'dawn' | 'sage' | 'lake' | 'ember' | 'night' | 'dusk';
  media?: string;
  title: string;
  subtitle: string;
  cta?: string;
  dark?: boolean;
}

// Scr11–18 — exact copy from the design.
const INTRO_SLIDES: IntroSlide[] = [
  {
    orb: 'dawn',
    title: 'سكون لكل لحظة',
    subtitle: 'دقائق من اليقظة — بين الاجتماعات، قبل النوم، أو حين تعلو ضوضاء الحياة.',
  },
  {
    orb: 'sage',
    title: 'مبنيّة على البحث',
    subtitle: 'تستند ممارساتنا إلى ثلاثة عقود من العمل السريري على اليقظة، وأكثر من 150 دراسة محكّمة.',
  },
  {
    orb: 'lake',
    title: 'مفصّلة على يومك',
    subtitle: 'ممارسة تتكيّف مع مزاجك، وطاقتك، والوقت المتاح لديك.',
  },
  {
    orb: 'ember',
    title: 'شاهد رحلتك تتفتّح',
    subtitle: 'سلاسل من الأيام، وتأمّلات، وسجلّ هادئ لحضورك.',
  },
  {
    orb: 'night',
    title: 'انجرف إلى النوم',
    subtitle: 'حكايات للنوم، ومشاهد صوتية، وقصص بطيئة تعينك على الراحة.',
    dark: true,
  },
  {
    orb: 'dusk',
    title: 'وتحدّث إلى أحدهم كذلك',
    subtitle: 'حين تحتاج إلى أكثر من التأمّل، معالجونا المعتمدون على بُعد لمسة.',
  },
  {
    orb: 'sage',
    media: '/media/crowd.jpg',
    title: 'لستَ وحدك',
    subtitle: 'أكثر من 80 مليون شخص يمارسون مع سُكون — في كل منطقة زمنية.',
  },
  {
    orb: 'dawn',
    media: '/media/color-wheel.webp',
    title: 'لنبدأ',
    subtitle: 'بضعة أسئلة سريعة لنرسم ممارستك.',
    cta: 'ابدأ الآن',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('splash');
  const [introStep, setIntroStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Auto-advance splash → breathe-in → breathe-out → welcome.
  useEffect(() => {
    if (phase === 'splash') {
      const t = setTimeout(() => setPhase('breathe-in'), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 'breathe-in') {
      const t = setTimeout(() => setPhase('breathe-out'), 2600);
      return () => clearTimeout(t);
    }
    if (phase === 'breathe-out') {
      const t = setTimeout(() => setPhase('welcome'), 2600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const startIntro = () => {
    setIntroStep(0);
    setPhase('intro');
  };

  const handleSignIn = async () => {
    if (!email || !password) { setAuthError('يرجى إدخال البريد وكلمة المرور'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await signInWithEmail(email, password);
    setAuthLoading(false);
    if (error) { setAuthError('بيانات الدخول غير صحيحة'); return; }
    router.push('/today');
  };

  const handleSignUp = async () => {
    if (!email || !password) { setAuthError('يرجى إدخال البريد وكلمة المرور'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await signUpWithEmail(email, password);
    setAuthLoading(false);
    if (error) { setAuthError('تعذّر إنشاء الحساب — تحقق من بريدك'); return; }
    setPhase('verify');
  };

  const handleReset = async () => {
    if (!email) { setAuthError('يرجى إدخال بريدك الإلكتروني'); return; }
    setAuthLoading(true); setAuthError('');
    await resetPassword(email);
    setAuthLoading(false);
    setPhase('verify');
  };

  const advanceIntro = () => {
    if (introStep >= INTRO_SLIDES.length - 1) {
      router.push('/onboarding');
    } else {
      setIntroStep((s) => s + 1);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col relative" dir="rtl">
      {/* ── Scr01: Splash ── */}
      {phase === 'splash' && (
        <button
          type="button"
          onClick={() => setPhase('breathe-in')}
          className="flex-1 flex items-center justify-center px-8"
          aria-label="سُكون"
        >
          <Logo height={90} color="#171B3A" />
        </button>
      )}

      {/* ── Scr02: Breathe in ── */}
      {phase === 'breathe-in' && (
        <>
          <style>{`@keyframes breatheIn{from{transform:scale(0.55)}to{transform:scale(1)}}`}</style>
          <div className="flex-1 flex items-center justify-center">
            <div style={{ animation: 'breatheIn 2.4s cubic-bezier(0.4,0,0.2,1) forwards' }}>
              <Orb variant="ember" size={180} />
            </div>
          </div>
        </>
      )}

      {/* ── Scr03: Breathe out ── */}
      {phase === 'breathe-out' && (
        <>
          <style>{`@keyframes breatheOut{from{transform:scale(1)}to{transform:scale(0.55)}}`}</style>
          <div className="flex-1 flex items-center justify-center">
            <div style={{ animation: 'breatheOut 2.4s cubic-bezier(0.4,0,0.2,1) forwards' }}>
              <Orb variant="lake" size={180} />
            </div>
          </div>
        </>
      )}

      {/* ── Scr04/05: Welcome — circle + logo + auth ── */}
      {phase === 'welcome' && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center pt-14 pb-6 px-8 gap-5">
            <Orb variant="dusk" size={150} />
            <Logo height={90} color="#171B3A" />
          </div>
          <div className="px-6 pb-14 flex flex-col">
            <h2 className="font-serif text-[22px] text-ink mb-1">أنشئ حسابًا</h2>
            <p className="text-sm text-ink-muted mb-6 leading-[1.7]">
              زامن تقدّمك عبر أجهزتك واحفظ نسخة من ممارستك.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="h-14 rounded-2xl bg-white border flex items-center px-5 gap-3.5"
                style={{ borderColor: '#E8E2D2' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium text-base text-ink">المتابعة عبر جوجل</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithApple()}
                className="h-14 rounded-2xl bg-white border flex items-center px-5 gap-3.5"
                style={{ borderColor: '#E8E2D2' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-ink">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium text-base text-ink">المتابعة عبر Apple</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('signup')}
                className="h-14 rounded-2xl bg-white border flex items-center px-5 gap-3.5"
                style={{ borderColor: '#E8E2D2' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-muted">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span className="font-medium text-base text-ink">المتابعة بالبريد الإلكتروني</span>
              </button>
            </div>
            <div className="mt-7 text-center text-[13px] text-ink-muted">
              عضو من قبل؟{' '}
              <button type="button" onClick={() => setPhase('signin')} className="text-ink font-medium">
                سجّل الدخول
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Scr07: Email sign-in ── */}
      {phase === 'signin' && (
        <div className="flex-1 px-6 pt-[60px]">
          <button type="button" onClick={() => setPhase('welcome')} aria-label="رجوع" className="flex items-center h-11">
            <IconBack />
          </button>
          <h1 className="font-serif text-[28px] text-ink mt-6">أهلًا بعودتك</h1>
          <p className="text-sm text-ink-muted mt-1.5 leading-[1.7]">سجّل الدخول لمتابعة ممارستك.</p>
          <div className="mt-8">
            <RealField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} />
            <RealField label="كلمة المرور" type="password" value={password} onChange={setPassword} />
            {authError && <p className="text-[13px] text-coral mt-1">{authError}</p>}
            <p className="text-[13px] text-ink-muted mt-1">
              بتسجيل الدخول، فإنك توافق على الشروط وسياسة الخصوصية.
            </p>
          </div>
          <div className="mt-6">
            <PrimaryBtn onClick={handleSignIn} disabled={authLoading}>{authLoading ? '...' : 'متابعة'}</PrimaryBtn>
          </div>
          <button
            type="button"
            onClick={() => setPhase('reset')}
            className="block w-full text-center mt-4 text-sm text-ink-muted"
          >
            نسيت كلمة المرور؟
          </button>
        </div>
      )}

      {/* ── Scr08: Sign-up form ── */}
      {phase === 'signup' && (
        <div className="flex-1 px-6 pt-[60px]">
          <button type="button" onClick={() => setPhase('welcome')} aria-label="رجوع" className="flex items-center h-11">
            <IconBack />
          </button>
          <h1 className="font-serif text-[28px] text-ink mt-6">أنشئ حسابك</h1>
          <div className="mt-7 flex flex-col gap-3">
            <RealField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} />
            <RealField label="كلمة المرور" type="password" value={password} onChange={setPassword} />
            {authError && <p className="text-[13px] text-coral">{authError}</p>}
          </div>
          <div className="mt-6">
            <PrimaryBtn onClick={handleSignUp} disabled={authLoading}>{authLoading ? '...' : 'متابعة'}</PrimaryBtn>
          </div>
        </div>
      )}

      {/* ── Scr09: Password reset ── */}
      {phase === 'reset' && (
        <div className="flex-1 px-6 pt-[60px]">
          <button type="button" onClick={() => setPhase('signin')} aria-label="رجوع" className="flex items-center h-11">
            <IconBack />
          </button>
          <h1 className="font-serif text-[28px] text-ink mt-[30px]">استعادة كلمة المرور</h1>
          <p className="text-sm text-ink-muted mt-2 leading-[1.7]">سنرسل رابط الاستعادة إلى بريدك.</p>
          <div className="mt-7">
            <RealField label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} />
            {authError && <p className="text-[13px] text-coral mt-1">{authError}</p>}
          </div>
          <div className="mt-6">
            <PrimaryBtn onClick={handleReset} disabled={authLoading}>{authLoading ? '...' : 'إرسال الرابط'}</PrimaryBtn>
          </div>
        </div>
      )}

      {/* ── Scr10: Verification sent ── */}
      {phase === 'verify' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <Orb variant="sage" size={120} />
          <h1 className="font-serif text-[28px] text-ink mt-7 text-center">تحقّق من بريدك</h1>
          <p className="text-sm text-ink-muted mt-2.5 leading-[1.7] text-center">
            أرسلنا رابط تحقّق إلى <span className="text-ink font-medium">alex.river@email.com</span>
          </p>
          <div className="mt-8 w-full">
            <PrimaryBtn onClick={startIntro}>فتح البريد</PrimaryBtn>
          </div>
          <p className="mt-4 text-sm text-ink-muted">إعادة الإرسال خلال 0:54</p>
        </div>
      )}

      {/* ── Scr11–18: Intro carousel ── */}
      {phase === 'intro' && (
        <IntroCarousel
          slide={INTRO_SLIDES[introStep]}
          progress={Math.round(((introStep + 1) / INTRO_SLIDES.length) * 100)}
          onBack={() => (introStep === 0 ? setPhase('welcome') : setIntroStep((s) => s - 1))}
          onSkip={() => setPhase('welcome')}
          onNext={advanceIntro}
        />
      )}
    </div>
  );
}

const SLIDE_BG: Record<string, string> = {
  dawn:  '#F0E4D5',
  sage:  '#D8E3D4',
  lake:  '#CCDBE8',
  ember: '#F0D8B8',
  night: '#0F1228',
  dusk:  '#DDD0E8',
};

const MEDIA_BG: Record<string, string> = {
  '/media/crowd.jpg':        '#5C4530',
  '/media/color-wheel.webp': '#1C1030',
};

function IntroCarousel({
  slide,
  progress,
  onBack,
  onSkip,
  onNext,
}: {
  slide: IntroSlide;
  progress: number;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  const hasMedia = !!slide.media;
  const dark = slide.dark ?? hasMedia;
  const txt = dark ? PALETTE.cream : PALETTE.ink;
  const mute = dark ? 'rgba(241,236,222,0.65)' : PALETTE.inkMuted;

  const slideBg = hasMedia
    ? (MEDIA_BG[slide.media!] ?? '#1a1025')
    : (slide.dark ? PALETTE.midnight : (SLIDE_BG[slide.orb] ?? '#F5F2EA'));

  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{ background: slideBg }}
    >
      {hasMedia && (
        <>
          <img
            src={slide.media!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.68) 100%)' }}
          />
        </>
      )}

      <div className="relative flex-1 px-6 pt-[60px] flex flex-col">
        <div className="flex items-center justify-between h-11">
          <button type="button" onClick={onBack} aria-label="رجوع">
            <IconBack color={txt} />
          </button>
          <ProgressBar value={progress} dark={dark} />
          <button type="button" onClick={onSkip} className="text-sm" style={{ color: mute }}>
            تخطّي
          </button>
        </div>

        {!hasMedia && (
          <div className="h-[280px] mt-[30px] flex items-center justify-center">
            <Orb variant={slide.orb} size={220} />
          </div>
        )}

        <div className={hasMedia ? 'mt-auto pb-4' : 'mt-6'}>
          <h1 className="font-serif text-[30px] leading-[1.3]" style={{ color: txt }}>
            {slide.title}
          </h1>
          <p className="text-[15px] mt-3 leading-[1.7]" style={{ color: mute }}>
            {slide.subtitle}
          </p>
        </div>
      </div>

      <div className="relative px-5 pb-14">
        <PrimaryBtn dark={dark} onClick={onNext}>
          {slide.cta ?? 'متابعة'}
        </PrimaryBtn>
      </div>
    </div>
  );
}

function RealField({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3.5">
      <div className="text-xs text-ink-muted mb-1.5 font-medium">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[50px] rounded-xl bg-white border px-4 text-base text-ink focus:outline-none focus:border-coral"
        style={{ borderColor: '#E8E2D2' }}
        dir="ltr"
        autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
      />
    </div>
  );
}
