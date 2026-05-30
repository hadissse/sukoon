'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBack,
  Orb,
  PrimaryBtn,
} from '@/components/onboarding/PreAppUI';
import { Logo } from '@/components/Logo';
import { SukoonIcon } from '@/components/SukoonIcon';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '@/lib/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Phase types
// ─────────────────────────────────────────────────────────────────────────────
type Phase = 'splash' | 'breathe-in' | 'breathe-out' | 'welcome' | 'signin' | 'signup' | 'reset' | 'verify';

// ─────────────────────────────────────────────────────────────────────────────
// Input field
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[50px] rounded-[14px] bg-cream-soft border border-rule-soft px-4 text-[15px] text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/20 transition-colors"
        style={{ direction: 'ltr' }}
        autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Social auth button
// ─────────────────────────────────────────────────────────────────────────────
function SocialBtn({ onClick, icon, label, loading }: { onClick: () => void; icon: React.ReactNode; label: string; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="h-[52px] rounded-[14px] bg-white border border-rule-soft flex items-center gap-3.5 px-5 hover:bg-cream-soft transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-5 h-5 rounded-full border-2 border-ink/20 border-t-ink animate-spin shrink-0" />
      ) : icon}
      <span className="text-[15px] font-medium text-ink">{loading ? 'جارٍ التحويل...' : label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider with "أو"
// ─────────────────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-rule-soft" />
      <span className="text-[12px] text-ink-muted font-medium">أو</span>
      <div className="flex-1 h-px bg-rule-soft" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Mobile: auto-advance splash → breathe → welcome
  useEffect(() => {
    if (phase === 'splash') {
      const t = setTimeout(() => setPhase('breathe-in'), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 'breathe-in') {
      const t = setTimeout(() => setPhase('breathe-out'), 1200);
      return () => clearTimeout(t);
    }
    if (phase === 'breathe-out') {
      const t = setTimeout(() => setPhase('welcome'), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setAuthError('');
    const { error } = await signInWithGoogle();
    // If we're still here, the redirect didn't happen — show error
    setGoogleLoading(false);
    if (error) setAuthError('تعذّر تسجيل الدخول عبر جوجل — حاول مجدداً');
  };

  const handleReset = async () => {
    if (!email) { setAuthError('يرجى إدخال بريدك الإلكتروني'); return; }
    setAuthLoading(true); setAuthError('');
    await resetPassword(email);
    setAuthLoading(false);
    setPhase('verify');
  };

  // ── Desktop: always show auth card (skip mobile animations) ────────────────
  const isAuthPhase = phase === 'welcome' || phase === 'signin' || phase === 'signup' || phase === 'reset' || phase === 'verify';

  return (
    <div className="flex-1 min-h-dvh flex flex-col relative" dir="rtl">
      {/* ── Full-bleed animated background (desktop + mobile) ── */}
      <img
        src="/media/auth-bg.gif"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Overlay so text/card remain readable */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(240,237,230,0.45)' }} />

      {/* All content above the background */}
      <div className="relative flex-1 flex flex-col" style={{ zIndex: 2 }}>

      {/* ── Desktop top bar: logo top-left (like Headspace) ── */}
      <div className="hidden md:flex items-center gap-2.5 px-10 pt-8">
        <SukoonIcon size={40} />
        <Logo height={20} color="#171B3A" />
      </div>

      {/* ── Mobile: splash + breathe animations ── */}
      <div className="md:hidden flex-1 flex flex-col bg-cream">
        {phase === 'splash' && (
          <button
            type="button"
            onClick={() => setPhase('breathe-in')}
            className="flex-1 flex items-center justify-center px-8 bg-cream"
          >
            <Logo height={320} color="#171B3A" />
          </button>
        )}
        {phase === 'breathe-in' && (
          <>
            <style>{`@keyframes breatheIn{from{transform:scale(0.55)}to{transform:scale(1)}}`}</style>
            <div className="flex-1 flex items-center justify-center bg-cream">
              <div style={{ animation: 'breatheIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards' }}>
                <Orb variant="ember" size={180} />
              </div>
            </div>
          </>
        )}
        {phase === 'breathe-out' && (
          <>
            <style>{`@keyframes breatheOut{from{transform:scale(1)}to{transform:scale(0.55)}}`}</style>
            <div className="flex-1 flex items-center justify-center bg-cream">
              <div style={{ animation: 'breatheOut 0.9s cubic-bezier(0.16,1,0.3,1) forwards' }}>
                <Orb variant="lake" size={180} />
              </div>
            </div>
          </>
        )}

        {/* Mobile auth screens */}
        {isAuthPhase && (
          <MobileAuthCard
            phase={phase}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            authError={authError} authLoading={authLoading}
            setPhase={setPhase}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
            handleReset={handleReset}
            onVerifyDone={() => router.push('/today')}
            onGoogleAuth={handleGoogle}
            googleLoading={googleLoading}
          />
        )}
      </div>

      {/* ── Desktop: centered card ── */}
      <div className="hidden md:flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] bg-white rounded-[28px] shadow-2xl overflow-hidden">
          <DesktopAuthCard
            phase={isAuthPhase ? phase : 'welcome'}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            authError={authError} authLoading={authLoading}
            setPhase={setPhase}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
            handleReset={handleReset}
            onVerifyDone={() => router.push('/today')}
            onGoogleAuth={handleGoogle}
            googleLoading={googleLoading}
          />
        </div>
      </div>

      {/* Desktop footer */}
      <p className="hidden md:block text-center text-[12px] text-ink/60 pb-8">
        © 2026 Arabic Astrology Academy Inc.
      </p>
      </div>{/* end zIndex:2 wrapper */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared auth content props
// ─────────────────────────────────────────────────────────────────────────────
interface AuthProps {
  phase: Phase;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  authError: string; authLoading: boolean;
  setPhase: (p: Phase) => void;
  handleSignIn: () => void;
  handleSignUp: () => void;
  handleReset: () => void;
  onVerifyDone: () => void;
  onGoogleAuth: () => void;
  googleLoading?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop card content
// ─────────────────────────────────────────────────────────────────────────────
function DesktopAuthCard(p: AuthProps) {
  if (p.phase === 'verify') {
    return (
      <div className="p-10 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cream-soft flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FA084" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-ink">تحقّق من بريدك</h1>
        <p className="text-sm text-ink-muted leading-[1.7]">أرسلنا رابط التحقّق. بعد التأكيد، ستنتقل لإضافة خريطتك النجمية.</p>
        <button onClick={p.onVerifyDone} className="mt-2 w-full h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px]">
          متابعة لإعداد خريطتك
        </button>
        <button onClick={() => p.setPhase('welcome')} className="text-sm text-ink-muted">رجوع</button>
      </div>
    );
  }

  if (p.phase === 'signin') {
    return (
      <div className="p-10 flex flex-col gap-5">
        <div>
          <h1 className="font-serif text-2xl text-ink">أهلًا بعودتك</h1>
          <p className="text-sm text-ink-muted mt-1">سجّل الدخول لمتابعة ممارستك.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="••••••••" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <button onClick={p.handleSignIn} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'دخول'}
        </button>
        <div className="flex items-center justify-between text-[13px]">
          <button onClick={() => p.setPhase('reset')} className="text-ink-muted hover:text-ink">نسيت كلمة المرور؟</button>
          <button onClick={() => p.setPhase('welcome')} className="text-coral font-medium">إنشاء حساب</button>
        </div>
      </div>
    );
  }

  if (p.phase === 'signup') {
    return (
      <div className="p-10 flex flex-col gap-5">
        <div>
          <h1 className="font-serif text-2xl text-ink">أنشئ حسابك</h1>
          <p className="text-sm text-ink-muted mt-1">زامن تقدّمك عبر أجهزتك.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="٨ أحرف على الأقل" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <button onClick={p.handleSignUp} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'إنشاء الحساب'}
        </button>
        <p className="text-center text-[13px] text-ink-muted">
          عضو من قبل؟{' '}
          <button onClick={() => p.setPhase('signin')} className="text-ink font-medium">سجّل الدخول</button>
        </p>
      </div>
    );
  }

  if (p.phase === 'reset') {
    return (
      <div className="p-10 flex flex-col gap-5">
        <div>
          <h1 className="font-serif text-2xl text-ink">استعادة كلمة المرور</h1>
          <p className="text-sm text-ink-muted mt-1">سنرسل رابط الاستعادة إلى بريدك.</p>
        </div>
        <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
        {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        <button onClick={p.handleReset} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'إرسال الرابط'}
        </button>
        <button onClick={() => p.setPhase('signin')} className="text-center text-[13px] text-ink-muted">رجوع</button>
      </div>
    );
  }

  // welcome (default)
  return (
    <div className="p-10 flex flex-col gap-5">
      <div className="text-center">
        <h1 className="font-serif text-2xl text-ink">أنشئ حسابًا</h1>
        <p className="text-sm text-ink-muted mt-1">زامن تقدّمك عبر أجهزتك واحفظ خريطتك.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SocialBtn
          onClick={p.onGoogleAuth}
          loading={p.googleLoading}
          label="المتابعة عبر جوجل"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          }
        />
      </div>

      <OrDivider />

      <button
        onClick={() => p.setPhase('signup')}
        className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] hover:bg-ink/90 transition-colors"
      >
        المتابعة بالبريد الإلكتروني
      </button>

      <p className="text-center text-[13px] text-ink-muted">
        عضو من قبل؟{' '}
        <button onClick={() => p.setPhase('signin')} className="text-ink font-medium hover:text-coral transition-colors">
          سجّل الدخول
        </button>
      </p>

      <p className="text-center text-[11px] text-ink-muted leading-[1.6]">
        بالمتابعة، فإنك توافق على{' '}
        <a href="/terms-and-conditions" target="_blank" className="underline">الشروط والأحكام</a>
        {' '}و{' '}
        <a href="/privacy-policy" target="_blank" className="underline">سياسة الخصوصية</a>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile auth card (full-screen, existing UX preserved)
// ─────────────────────────────────────────────────────────────────────────────
function MobileAuthCard(p: AuthProps) {
  if (p.phase === 'verify') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-cream">
        <Orb variant="sage" size={100} />
        <h1 className="font-serif text-[28px] text-ink mt-7 text-center">تحقّق من بريدك</h1>
        <p className="text-sm text-ink-muted mt-2.5 leading-[1.7] text-center">أرسلنا رابط التحقّق. بعد التأكيد، ستنتقل لإضافة خريطتك.</p>
        <div className="mt-8 w-full">
          <PrimaryBtn onClick={p.onVerifyDone}>متابعة لإعداد خريطتك</PrimaryBtn>
        </div>
        <p className="mt-4 text-sm text-ink-muted">إعادة الإرسال خلال ٠:٥٤</p>
      </div>
    );
  }

  if (p.phase === 'signin') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11">
          <IconBack />
        </button>
        <h1 className="font-serif text-[28px] text-ink mt-6">أهلًا بعودتك</h1>
        <p className="text-sm text-ink-muted mt-1.5 leading-[1.7]">سجّل الدخول لمتابعة ممارستك.</p>
        <div className="mt-8 flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="••••••••" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleSignIn} disabled={p.authLoading}>{p.authLoading ? '...' : 'متابعة'}</PrimaryBtn>
        </div>
        <button type="button" onClick={() => p.setPhase('reset')} className="block w-full text-center mt-4 text-sm text-ink-muted">
          نسيت كلمة المرور؟
        </button>
      </div>
    );
  }

  if (p.phase === 'signup') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11">
          <IconBack />
        </button>
        <h1 className="font-serif text-[28px] text-ink mt-6">أنشئ حسابك</h1>
        <div className="mt-7 flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="٨ أحرف على الأقل" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleSignUp} disabled={p.authLoading}>{p.authLoading ? '...' : 'متابعة'}</PrimaryBtn>
        </div>
      </div>
    );
  }

  if (p.phase === 'reset') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('signin')} className="flex items-center h-11">
          <IconBack />
        </button>
        <h1 className="font-serif text-[28px] text-ink mt-[30px]">استعادة كلمة المرور</h1>
        <p className="text-sm text-ink-muted mt-2 leading-[1.7]">سنرسل رابط الاستعادة إلى بريدك.</p>
        <div className="mt-7">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          {p.authError && <p className="text-[13px] text-coral mt-1">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleReset} disabled={p.authLoading}>{p.authLoading ? '...' : 'إرسال الرابط'}</PrimaryBtn>
        </div>
      </div>
    );
  }

  // welcome
  return (
    <div className="flex-1 flex flex-col bg-cream">
      <div className="flex flex-col items-center pt-12 pb-6 px-8 gap-4">
        <SukoonIcon size={56} />
        <Logo height={300} color="#171B3A" />
      </div>
      <div className="px-6 pb-12 flex flex-col gap-3">
        <h2 className="font-serif text-[22px] text-ink mb-1">أنشئ حسابًا</h2>
        <p className="text-sm text-ink-muted mb-2 leading-[1.7]">زامن تقدّمك عبر أجهزتك واحفظ خريطتك النجمية.</p>
        <SocialBtn onClick={p.onGoogleAuth} loading={p.googleLoading} label="المتابعة عبر جوجل" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        } />
        <OrDivider />
        <button type="button" onClick={() => p.setPhase('signup')} className="h-14 rounded-[26px] bg-ink text-cream font-medium text-[15px]">
          المتابعة بالبريد الإلكتروني
        </button>
        <div className="text-center text-[13px] text-ink-muted mt-2">
          عضو من قبل؟{' '}
          <button type="button" onClick={() => p.setPhase('signin')} className="text-ink font-medium">سجّل الدخول</button>
        </div>
      </div>
    </div>
  );
}

