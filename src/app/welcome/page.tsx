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
import { sendEmailOtp, verifyEmailOtp } from '@/lib/auth';
import { getCurrentSky } from '@/lib/currentSky';

// ─────────────────────────────────────────────────────────────────────────────
// Phase types
// ─────────────────────────────────────────────────────────────────────────────
type Phase = 'splash' | 'breathe-in' | 'breathe-out' | 'welcome' | 'email' | 'otp';

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

  // Scrolling ticker for desktop
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full max-w-[520px]" dir="ltr">
      <style>{`@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div
        className="flex gap-2.5 w-max"
        style={{ animation: 'tickerScroll 28s linear infinite' }}
      >
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
        autoComplete={type === 'email' ? 'email' : 'one-time-code'}
      />
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
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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

  const handleSendOtp = async () => {
    if (!email) { setAuthError('يرجى إدخال بريدك الإلكتروني'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await sendEmailOtp(email);
    setAuthLoading(false);
    if (error) { setAuthError('تعذّر إرسال الرمز — تحقق من البريد وأعد المحاولة'); return; }
    setOtp('');
    setPhase('otp');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) { setAuthError('يرجى إدخال الرمز المكوّن من ٦ أرقام'); return; }
    setAuthLoading(true); setAuthError('');
    const { error } = await verifyEmailOtp(email, otp);
    setAuthLoading(false);
    if (error) { setAuthError('الرمز غير صحيح أو انتهت صلاحيته'); return; }
    router.push('/today');
  };

  const isAuthPhase = phase === 'welcome' || phase === 'email' || phase === 'otp';

  return (
    <div className="flex-1 min-h-dvh flex flex-col relative" dir="rtl">
      {/* ── Full-bleed animated background ── */}
      <img
        src="/media/auth-bg.gif"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(255,255,255,0.62)' }} />

      <div className="relative flex-1 flex flex-col" style={{ zIndex: 2 }}>

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

        {isAuthPhase && (
          <MobileAuthCard
            phase={phase}
            email={email} setEmail={setEmail}
            otp={otp} setOtp={setOtp}
            authError={authError} authLoading={authLoading}
            setPhase={setPhase}
            handleSendOtp={handleSendOtp}
            handleVerifyOtp={handleVerifyOtp}
          />
        )}
      </div>

      {/* ── Desktop: logo + circular card centered ── */}
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
              email={email} setEmail={setEmail}
              otp={otp} setOtp={setOtp}
              authError={authError} authLoading={authLoading}
              setPhase={setPhase}
              handleSendOtp={handleSendOtp}
              handleVerifyOtp={handleVerifyOtp}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared auth content props
// ─────────────────────────────────────────────────────────────────────────────
interface AuthProps {
  phase: Phase;
  email: string; setEmail: (v: string) => void;
  otp: string; setOtp: (v: string) => void;
  authError: string; authLoading: boolean;
  setPhase: (p: Phase) => void;
  handleSendOtp: () => void;
  handleVerifyOtp: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop card content
// ─────────────────────────────────────────────────────────────────────────────
function DesktopAuthCard(p: AuthProps) {
  if (p.phase === 'email') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">أدخل بريدك الإلكتروني</h1>
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

  if (p.phase === 'otp') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl text-ink">أدخل رمز التحقق</h1>
        <p className="text-sm text-ink-muted leading-[1.7]">أرسلنا رمزًا مكوّنًا من ٦ أرقام إلى <span className="text-ink font-medium" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{p.email}</span></p>
        <Field label="رمز التحقق" type="text" value={p.otp} onChange={(v) => p.setOtp(v.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
        {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        <button onClick={p.handleVerifyOtp} disabled={p.authLoading} className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] disabled:opacity-40">
          {p.authLoading ? '...' : 'تأكيد'}
        </button>
        <button onClick={() => { p.setPhase('email'); }} className="text-center text-[13px] text-ink-muted">
          لم يصل الرمز؟ إعادة الإرسال
        </button>
      </div>
    );
  }

  // welcome (default)
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-ink text-center">أنشئ حسابًا</h1>

      {p.authError && <p className="text-[13px] text-coral bg-coral/10 rounded-xl px-3 py-2 text-center">{p.authError}</p>}

      <button
        onClick={() => p.setPhase('email')}
        className="h-[52px] rounded-[26px] bg-ink text-cream font-medium text-[15px] hover:bg-ink/90 transition-colors"
      >
        المتابعة بالبريد الإلكتروني
      </button>

      <p className="text-center text-[13px] text-ink-muted">
        عضو من قبل؟{' '}
        <button onClick={() => p.setPhase('email')} className="text-ink font-medium hover:text-coral transition-colors">
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
// Mobile auth card
// ─────────────────────────────────────────────────────────────────────────────
function MobileAuthCard(p: AuthProps) {
  if (p.phase === 'email') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('welcome')} className="flex items-center h-11">
          <IconBack />
        </button>
        <h1 className="font-serif text-[28px] text-ink mt-6">أدخل بريدك الإلكتروني</h1>
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

  if (p.phase === 'otp') {
    return (
      <div className="flex-1 px-6 pt-14 bg-cream">
        <button type="button" onClick={() => p.setPhase('email')} className="flex items-center h-11">
          <IconBack />
        </button>
        <h1 className="font-serif text-[28px] text-ink mt-6">رمز التحقق</h1>
        <p className="text-sm text-ink-muted mt-1.5 leading-[1.7]">
          أرسلنا رمزًا من ٦ أرقام إلى{' '}
          <span className="text-ink font-medium" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{p.email}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Field label="رمز التحقق" type="text" value={p.otp} onChange={(v) => p.setOtp(v.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
          {p.authError && <p className="text-[13px] text-coral">{p.authError}</p>}
        </div>
        <div className="mt-6">
          <PrimaryBtn onClick={p.handleVerifyOtp} disabled={p.authLoading}>{p.authLoading ? '...' : 'تأكيد'}</PrimaryBtn>
        </div>
        <button type="button" onClick={() => p.setPhase('email')} className="block w-full text-center mt-4 text-sm text-ink-muted">
          لم يصل الرمز؟ إعادة الإرسال
        </button>
      </div>
    );
  }

  // welcome
  return (
    <div className="flex-1 flex flex-col bg-cream">
      <div className="flex-1" />
      <div className="px-6 pb-12 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 mb-1">
          <img src="/sukoon-logo-icon.svg" alt="" aria-hidden="true" className="w-9 h-9" />
          <h2 className="font-serif text-[22px] text-ink">أنشئ حسابًا</h2>
        </div>
        <SkyTicker compact />
        {p.authError && <p className="text-[13px] text-coral bg-coral/10 rounded-xl px-3 py-2">{p.authError}</p>}
        <button type="button" onClick={() => p.setPhase('email')} className="h-14 rounded-[26px] bg-ink text-cream font-medium text-[15px]">
          المتابعة بالبريد الإلكتروني
        </button>
        <div className="text-center text-[13px] text-ink-muted mt-2">
          عضو من قبل؟{' '}
          <button type="button" onClick={() => p.setPhase('email')} className="text-ink font-medium">سجّل الدخول</button>
        </div>
      </div>
    </div>
  );
}
