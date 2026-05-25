'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared UI primitives for the pre-app onboarding flows (/welcome and /quiz).
 * Faithful ports of the design-file helpers (GradientOrb, Topo, PrimaryBtn,
 * icons) from `Sukoon - 1/Design Files/brand.jsx`. Kept local to avoid
 * modifying shared components.
 */

// ─── Palette (extras not in the Tailwind @theme) ───────────────────
export const PALETTE = {
  ink: '#171B3A',
  cream: '#FFFFFF',
  inkMuted: '#5C5C7A',
  midnight: '#0F1228',
  amber: '#D4A04C',
  coral: '#E9785E',
} as const;

// ─── Gradient orb (3-stop radial + highlight, matches brand.jsx) ───
const ORB_PALETTES: Record<string, [string, string, string]> = {
  dawn: ['#F8D6BE', '#E9785E', '#9A3F30'],
  dusk: ['#E9785E', '#5A3E7A', '#171B3A'],
  night: ['#3A4490', '#1B1F47', '#0A0C20'],
  sage: ['#D8DFC8', '#8FA084', '#475A3F'],
  lake: ['#C2D3E2', '#7E97B8', '#33485F'],
  ember: ['#FFC78A', '#D4651E', '#5A2710'],
  dust: ['#EBE3D0', '#BDAA82', '#5A4A2A'],
};

export function Orb({
  variant = 'dawn',
  size = 200,
  blur = 0,
  style = {},
}: {
  variant?: keyof typeof ORB_PALETTES;
  size?: number;
  blur?: number;
  style?: CSSProperties;
}) {
  const [hi, mid, lo] = ORB_PALETTES[variant] ?? ORB_PALETTES.dawn;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 25%, ${hi} 0%, ${mid} 50%, ${lo} 100%)`,
        filter: blur ? `blur(${blur}px)` : undefined,
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '12%',
          width: '36%',
          height: '32%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hi}cc 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}

// ─── Topographic line pattern ──────────────────────────────────────
export function Topo({
  color = '#000',
  opacity = 0.08,
  style = {},
}: {
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 400 400" style={style} preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke={color} strokeWidth="1.2" opacity={opacity}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ellipse key={i} cx="200" cy="200" rx={40 + i * 22} ry={28 + i * 16} />
        ))}
      </g>
    </svg>
  );
}

// ─── Buttons ───────────────────────────────────────────────────────
export function PrimaryBtn({
  children,
  onClick,
  disabled,
  dark = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  dark?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[52px] rounded-[26px] text-base font-medium flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: dark ? PALETTE.cream : PALETTE.ink,
        color: dark ? PALETTE.ink : PALETTE.cream,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({
  children,
  onClick,
  dark = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[52px] rounded-[26px] text-base font-medium flex items-center justify-center transition-colors bg-transparent"
      style={{
        border: `1.2px solid ${dark ? 'rgba(241,236,222,0.4)' : 'rgba(23,27,58,0.2)'}`,
        color: dark ? PALETTE.cream : PALETTE.ink,
      }}
    >
      {children}
    </button>
  );
}

// ─── Icons (RTL-aware: back points right, chevron points left) ─────
export function IconBack({ color = PALETTE.ink }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ color = PALETTE.ink }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6l-12 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ color = PALETTE.cream }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12l5 5 11-11" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBell({ color = PALETTE.ink }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 16V10a6 6 0 1112 0v6l2 2H4l2-2zM10 21h4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Progress bar (used by intro + quiz headers) ───────────────────
export function ProgressBar({ value, dark = false }: { value: number; dark?: boolean }) {
  return (
    <div
      className="flex-1 h-[3px] rounded-full overflow-hidden mx-4"
      style={{ background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(23,27,58,0.1)' }}
    >
      <div
        className="h-full transition-all"
        style={{ width: `${value}%`, background: dark ? PALETTE.cream : PALETTE.ink }}
      />
    </div>
  );
}
