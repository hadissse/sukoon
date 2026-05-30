'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  IconBack,
  Orb,
  PrimaryBtn,
} from '@/components/onboarding/PreAppUI';
import { Logo } from '@/components/Logo';
import { SukoonIcon } from '@/components/SukoonIcon';
import { sendEmailOtp, verifyEmailOtp, signInWithEmail, signUpWithEmail, resetPassword } from '@/lib/auth';
import { getCurrentSky } from '@/lib/currentSky';

const HCAPTCHA_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001';

// ─────────────────────────────────────────────────────────────────────────────
// Phase types
// ─────────────────────────────────────────────────────────────────────────────
type Phase = 'splash' | 'breathe-in' | 'breathe-out' | 'welcome'
  | 'otp-email' | 'otp-code'
  | 'signin' | 'signup' | 'reset' | 'verify';

// ─────────────────────────────────────────────────────────────────────────────
// Sky ticker — live planetary positions
// ─────────────────────────────────────────────────────────────────────────────
const TICKER_PLANETS = [
  { key: 'sun',     symbol: '☉', label: 'الشمس' },
  { key: 'moon',    symbol: '☽', label: 'القمر' },
  { key: 'mercury', symbol: '☿', label: 'عطارد' },
  { key: 'venus',   symbol: '♀', label: 'الزهرة' },
  { key: 'mars',    symbol: '♂', label: 'المريخ' },
  { key: 'jupiter', symbol: '♃', label: 'المشتري' },
  { key: 'saturn',  symbol: '♄', label: 'زحل' },
] as const;

function toEastern(n: number) {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

function SkyTicker({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState<Array<{ symbol: string; label: string; sign: string; degree: number }>>([]);

  useEffect(() => {
    const sky = getCurrentSky();
    setItems(TICKER_PLANETS.map(p => ({
      symbol: p.symbol,
      label: p.label,
      sign: (sky as any)[p.key].sign,
      degree: (sky as any)[p.key].degree,
    })));
  }, []);

  if (!items.length) return null;

  const pills = items.map(p => (
    <span key={p.label} className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1 rounded-full bg-white/60 border border-white/80 text-ink text-[12px] font-medium backdrop-blur-sm">
      <span className="text-[13px] opacity-70">{p.symbol}</span>
      <span>{p.label}</span>
      <span className="opacity-50 mx-0.5">•</span>
      <span className="text-coral/90">{p.sign}</span>
      <span className="opacity-60">{toEastern(p.degree)}°</span>
    </span>
  ));

  if (compact) {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {pills}
      </div>
    );
  }

  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full max-w-[520px]" dir="ltr">
      <style>{`@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="flex gap-2.5 w-max" style={{ animation: 'tickerScroll 28s linear infinite' }}>
        {doubled.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full bg-white/65 border border-white/80 text-ink text-[12px] font-medium backdrop-blur-sm">
            <span className="text-[13px] opacity-60">{p.symbol}</span>
            <span dir="rtl">{p.label}</span>
            <span className="opacity-40 mx-0.5">•</span>
            <span className="text-coral/80" dir="rtl">{p.sign}</span>
            <span className="opacity-55">{toEastern(p.degree)}°</span>
          </span>
        ))}
      </div>
    </div>
  );
}

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
        autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'one-time-code'}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider
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
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

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

  const handleSendOtp = async () => {
    if (!email) { setAuthError('يرجى إدخال بريدك الإلكتروني'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await sendEmailOtp(email);
    setAuthLoading(false);
    if (error) { setAuthError('تعذّر إرسال الرمز — تحقق من البريد وأعد المحاولة'); return; }
    setOtp('');
    setPhase('otp-code');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) { setAuthError('يرجى إدخال الرمز المكوّن من ٦ أرقام'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await verifyEmailOtp(email, otp);
    setAuthLoading(false);
    if (error) { setAuthError('الرمز غير صحيح أو انتهت صلاحيته'); return; }
    router.push('/today');
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
    if (!captchaToken) { setAuthError('يرجى إكمال التحقق أولاً'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await signUpWithEmail(email, password, captchaToken);
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);
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

  const isAuthPhase = !['splash', 'breathe-in', 'breathe-out'].includes(phase);

  return (
    <div className="flex-1 min-h-dvh flex flex-col relative" dir="rtl">
      <img src="/media/auth-bg.gif" alt="" aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(255,255,255,0.62)' }} />

      <div className="relative flex-1 flex flex-col" style={{ zIndex: 2 }}>

        {/* ── Mobile ── */}
        <div className="md:hidden flex-1 flex flex-col bg-cream">
          {phase === 'splash' && (
            <button type="button" onClick={() => setPhase('breathe-in')}
              className="flex-1 flex items-center justify-center px-8 bg-cream">
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
          {isAuthPhase && (
            <MobileAuthCard
              phase={phase as any} setPhase={setPhase as any}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              otp={otp} setOtp={setOtp}
              authError={authError} authLoading={authLoading}
              handleSendOtp={handleSendOtp} handleVerifyOtp={handleVerifyOtp}
              handleSignIn={handleSignIn} handleSignUp={handleSignUp} handleReset={handleReset}
              onVerifyDone={() => router.push('/today')}
              captchaRef={captchaRef} onCaptchaVerify={setCaptchaToken}
            />
          )}
        </div>

        {/* ── Desktop ── */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-5 px-6">
          <div className="flex items-center gap-3">
            <SukoonIcon size={72} />
            <img src="/sukoon-wordmark-black.svg" style={{ height: 40, width: 'auto' }} alt="سُكون" />
          </div>
          <SkyTicker />
          <div className="w-[520px] h-[520px] flex items-center justify-center" style={{ clipPath: 'circle(50%)' }}>
            <div className="w-[340px]">
              <DesktopAuthCard
                phase={isAuthPhase ? phase : 'welcome'}
                setPhase={setPhase as any}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                otp={otp} setOtp={setOtp}
                authError={authError} authLoading={authLoading}
                handleSendOtp={handleSendOtp} handleVerifyOtp={handleVerifyOtp}
                handleSignIn={handleSignIn} handleSignUp={handleSignUp} handleReset={handleReset}
                onVerifyDone={() => router.push('/today')}
                captchaRef={captchaRef} onCaptchaVerify={setCaptchaToken}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared props
// ─────────────────────────────────────────────────────────────────────────────
interface AuthProps {
  phase: Phase;
  setPhase: (p: Phase) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  otp: string; setOtp: (v: string) => void;
  authError: string; authLoading: boolean;
  handleSendOtp: () => void; handleVerifyOtp: () => void;
  handleSignIn: () => void; handleSignUp: () => void; handleReset: () => void;
  onVerifyDone: () => void;
  captchaRef?: React.RefObject<HCaptcha | null>;
  onCaptchaVerify?: (token: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop card
// ─────────────────────────────────────────────────────────────────────────────
function DesktopAuthCard(p: AuthProps) {
  if (p.phase === 'verify') {
    return (
      <div className="flex flex-col items-center text-center gap-4">
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

  if (p.phase === 'otp-email') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">أدخل بريدك</h1>
        <p className="text-sm text-ink-muted">سنرسل رمز التحقق إلى بريدك.</p>
        <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
        {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        <button onClick={p.handleSendOtp} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'إرسال الرمز'}
        </button>
        <button onClick={() => p.setPhase('welcome')} className="text-center text-[13px] text-ink-muted">رجوع</button>
      </div>
    );
  }

  if (p.phase === 'otp-code') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">رمز التحقق</h1>
        <p className="text-sm text-ink-muted leading-[1.7]">أرسلنا رمزًا من ٦ أرقام إلى <span className="text-ink font-medium" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{p.email}</span></p>
        <Field label="الرمز" type="text" value={p.otp} onChange={(v) => p.setOtp(v.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
        {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        <button onClick={p.handleVerifyOtp} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'تأكيد'}
        </button>
        <button onClick={() => p.setPhase('otp-email')} className="text-center text-[13px] text-ink-muted">لم يصل الرمز؟ إعادة الإرسال</button>
      </div>
    );
  }

  if (p.phase === 'signin') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">أهلًا بعودتك</h1>
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
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">أنشئ حسابك</h1>
        <div className="flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="٨ أحرف على الأقل" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="flex justify-center">
          <HCaptcha ref={p.captchaRef ?? null} sitekey={HCAPTCHA_SITE_KEY} onVerify={(token) => p.onCaptchaVerify?.(token)} />
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
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">استعادة كلمة المرور</h1>
        <p className="text-sm text-ink-muted mt-1">سنرسل رابط الاستعادة إلى بريدك.</p>
        <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
        {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        <button onClick={p.handleReset} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'إرسال الرابط'}
        </button>
        <button onClick={() => p.setPhase('signin')} className="text-center text-[13px] text-ink-muted">رجوع</button>
      </div>
    );
  }

  // welcome
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-serif text-2xl text-ink text-center">أنشئ حسابًا</h1>
      {p.authError && <p className="text-[13px] text-coral bg-coral/10 rounded-xl px-3 py-2 text-center">{p.authError}</p>}

      <button onClick={() => p.setPhase('otp-email')}
        className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] hover:bg-ink/90 transition-colors">
        دخول برمز التحقق
      </button>

      <OrDivider />

      <button onClick={() => p.setPhase('signup')}
        className="h-[52px] rounded-[26px] border border-ink text-ink font-medium text-[15px] hover:bg-ink/5 transition-colors">
        إنشاء حساب بكلمة مرور
      </button>

      <p className="text-center text-[13px] text-ink-muted mt-1">
        عضو من قبل؟{' '}
        <button onClick={() => p.setPhase('signin')} className="text-ink font-medium hover:text-coral transition-colors">سجّل الدخول</button>
      </p>

      <p className="text-center text-[11px] text-ink-muted leading-[1.6] mt-1">
        بالمتابعة، فإنك توافق على{' '}
        <a href="/terms-and-conditions" target="_blank" className="underline">الشروط والأحكام</a>
        {' '}و{' '}
        <a href="/privacy-policy" target="_blank" className="underline">سياسة الخصوصية</a>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile card
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
      </div>
    );
  }

  if (p.phase === 'otp-email') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11"><IconBack /></button>
        <h1 className="font-serif text-[28px] text-ink mt-6">أدخل بريدك</h1>
        <p className="text-sm text-ink-muted mt-1.5 leading-[1.7]">سنرسل رمز التحقق إلى بريدك.</p>
        <div className="mt-8 flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleSendOtp} disabled={p.authLoading}>{p.authLoading ? '...' : 'إرسال الرمز'}</PrimaryBtn>
        </div>
      </div>
    );
  }

  if (p.phase === 'otp-code') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('otp-email')} className="flex items-center h-11"><IconBack /></button>
        <h1 className="font-serif text-[28px] text-ink mt-6">رمز التحقق</h1>
        <p className="text-sm text-ink-muted mt-1.5 leading-[1.7]">
          أرسلنا رمزًا من ٦ أرقام إلى <span className="text-ink font-medium" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{p.email}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Field label="رمز التحقق" type="text" value={p.otp} onChange={(v) => p.setOtp(v.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleVerifyOtp} disabled={p.authLoading}>{p.authLoading ? '...' : 'تأكيد'}</PrimaryBtn>
        </div>
        <button type="button" onClick={() => p.setPhase('otp-email')} className="block w-full text-center mt-4 text-sm text-ink-muted">
          لم يصل الرمز؟ إعادة الإرسال
        </button>
      </div>
    );
  }

  if (p.phase === 'signin') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11"><IconBack /></button>
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
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11"><IconBack /></button>
        <h1 className="font-serif text-[28px] text-ink mt-6">أنشئ حسابك</h1>
        <div className="mt-7 flex flex-col gap-3">
          <Field label="البريد الإلكتروني" type="email" value={p.email} onChange={p.setEmail} placeholder="name@example.com" />
          <Field label="كلمة المرور" type="password" value={p.password} onChange={p.setPassword} placeholder="٨ أحرف على الأقل" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-4 flex justify-center">
          <HCaptcha ref={p.captchaRef ?? null} sitekey={HCAPTCHA_SITE_KEY} onVerify={(token) => p.onCaptchaVerify?.(token)} />
        </div>
        <div className="mt-4">
          <PrimaryBtn onClick={p.handleSignUp} disabled={p.authLoading}>{p.authLoading ? '...' : 'متابعة'}</PrimaryBtn>
        </div>
      </div>
    );
  }

  if (p.phase === 'reset') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('signin')} className="flex items-center h-11"><IconBack /></button>
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
      {/* Centered logo block — matches desktop */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
        <img src="/sukoon-logo-icon.svg" alt="" aria-hidden="true" className="w-20 h-20" />
        <img src="/sukoon-wordmark-black.svg" alt="سُكون" style={{ height: 36, width: 'auto' }} />
        <SkyTicker compact />
      </div>

      {/* Form anchored to bottom */}
      <div className="px-6 pb-12 flex flex-col gap-3">
        {p.authError && <p className="text-[13px] text-coral bg-coral/10 rounded-xl px-3 py-2">{p.authError}</p>}

        <button type="button" onClick={() => p.setPhase('otp-email')}
          className="h-14 rounded-[26px] bg-ink text-cream font-medium text-[15px]">
          دخول برمز التحقق
        </button>

        <OrDivider />

        <button type="button" onClick={() => p.setPhase('signup')}
          className="h-14 rounded-[26px] border border-ink text-ink font-medium text-[15px]">
          إنشاء حساب بكلمة مرور
        </button>

        <div className="text-center text-[13px] text-ink-muted mt-1">
          عضو من قبل؟{' '}
          <button type="button" onClick={() => p.setPhase('signin')} className="text-ink font-medium">سجّل الدخول</button>
        </div>
      </div>
    </div>
  );
}
