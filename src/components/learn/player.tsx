'use client';

// Player chrome for the session player (Scr50-61). UI only — no real media.

import { GradientOrb } from '@/components/GradientOrb';
import { PlayIcon, PauseIcon, MoreIcon } from './primitives';

export const PLAYER_GRADS: Record<string, string> = {
  dawn: 'linear-gradient(180deg, #F8D6BE 0%, #E9785E 60%, #B85940 100%)',
  dusk: 'linear-gradient(180deg, #5A3E7A 0%, #2A2F66 60%, #171B3A 100%)',
  night: 'linear-gradient(180deg, #1B1F47 0%, #0F1228 100%)',
  sage: 'linear-gradient(180deg, #C9D2BE 0%, #8FA084 60%, #5C6D55 100%)',
  ember: 'linear-gradient(180deg, #FFC78A 0%, #D4651E 60%, #7A350F 100%)',
};

export function PlayerShell({
  bg = 'dusk',
  children,
}: {
  bg?: keyof typeof PLAYER_GRADS;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh relative max-w-[430px] mx-auto w-full" style={{ background: PLAYER_GRADS[bg] }}>
      {children}
    </div>
  );
}

export function PlayerHeader({
  course = 'الطريق الهادئ',
  day = 'اليوم 3',
  onClose,
}: {
  course?: string;
  day?: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex justify-between items-center px-5 pt-14 pb-0 h-[100px] box-border text-cream">
      <button onClick={onClose} aria-label="إغلاق" className="opacity-90 hover:opacity-70">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="text-center">
        <div className="text-[11px] font-semibold opacity-70">{course}</div>
        <div className="text-sm mt-0.5">{day}</div>
      </div>
      <MoreIcon className="opacity-90" />
    </div>
  );
}

export function PlayerControls({
  playing = false,
  onToggle,
}: {
  playing?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-9" dir="ltr">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-cream"><path d="M19 5v14M14 12L5 5v14l9-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-cream"><path d="M2 12a10 10 0 1010-10v3M2 12l3-3M2 12l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <button
        onClick={onToggle}
        aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل'}
        className="w-[76px] h-[76px] rounded-full bg-cream flex items-center justify-center hover:scale-[1.03] transition-transform"
      >
        {playing ? <PauseIcon size={30} className="text-ink" /> : <PlayIcon size={30} className="text-ink" />}
      </button>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-cream"><path d="M22 12a10 10 0 11-10-10v3M22 12l-3-3M22 12l-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-cream"><path d="M5 5v14M10 12l9-7v14l-9-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
    </div>
  );
}

export function PlayerArt({ variant = 'dawn', size = 250 }: { variant?: string; size?: number }) {
  return (
    <div className="flex justify-center mt-6">
      <GradientOrb variant={variant} size={size} />
    </div>
  );
}
