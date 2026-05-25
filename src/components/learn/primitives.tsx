'use client';

// Shared primitives for the content / teaching layer screens
// (paywall, course, player, reflection, quotes, explore-depth, search, library).
// Ported from the Sukoon design files. RTL-first; uses the app's Tailwind tokens.

import Link from 'next/link';

// ─── Gradient palettes (mirror GradientOrb / HeroCard) ──────────────
export const GRADS: Record<string, [string, string]> = {
  dawn: ['#F8D6BE', '#E9785E'],
  sage: ['#C9D2BE', '#8FA084'],
  lake: ['#C2D3E2', '#7E97B8'],
  dusk: ['#9C8AB8', '#5A3E7A'],
  night: ['#3A4490', '#1B1F47'],
  ember: ['#FFC78A', '#D4651E'],
  dust: ['#D4C4B0', '#8B7B6B'],
};

export type GradVariant = keyof typeof GRADS;

export const SOLID: Record<string, string> = {
  dawn: '#F8D6BE',
  sage: '#C9D2BE',
  lake: '#C2D3E2',
  dusk: '#9C8AB8',
  night: '#3A4490',
  ember: '#FFC78A',
  dust: '#EBE3D0',
};

export function gradientCss(variant: string, deg = 135) {
  const [a, b] = GRADS[variant] || GRADS.dawn;
  return `linear-gradient(${deg}deg, ${a}, ${b})`;
}

// ─── Buttons ────────────────────────────────────────────────────────
export function PrimaryBtn({
  children,
  onClick,
  href,
  dark = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  dark?: boolean;
  disabled?: boolean;
}) {
  const cls = dark
    ? 'bg-cream text-ink hover:bg-cream/90'
    : 'bg-ink text-cream hover:bg-ink-soft';
  const base = `block w-full text-center py-3.5 rounded-[14px] text-sm font-medium transition-colors ${cls} disabled:opacity-40`;
  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

export function SecondaryBtn({
  children,
  onClick,
  href,
  dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  dark?: boolean;
}) {
  const cls = dark
    ? 'bg-white/15 text-cream border border-white/25 hover:bg-white/25'
    : 'bg-white text-ink border border-rule-soft hover:bg-cream-soft';
  const base = `block w-full text-center py-3.5 rounded-[14px] text-sm font-medium transition-colors ${cls}`;
  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────
type IconProps = { size?: number; className?: string; strokeWidth?: number };

export function CloseIcon({ size = 22, className = '', strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function BackIcon({ size = 22, className = '', strokeWidth = 1.6 }: IconProps) {
  // RTL: "back" chevron points to the right
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronEnd({ size = 18, className = '', strokeWidth = 1.6 }: IconProps) {
  // chevron toward the inline-end (left in RTL)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className = '', strokeWidth = 2.4 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function PlayIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  );
}

export function PauseIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className = '', strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function HeartIcon({ size = 20, className = '', filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function MoreIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

export function DownloadIcon({ size = 22, className = '', strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}

export function FilterIcon({ size = 22, className = '', strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}

// ─── Tile (gradient mini-card used across explore/today/search) ─────
export function GradientTile({
  title,
  subtitle,
  variant = 'dawn',
  height = 140,
  href,
}: {
  title: string;
  subtitle?: string;
  variant?: string;
  height?: number;
  href?: string;
}) {
  const onLight = ['sage', 'ember', 'dust', 'dawn', 'lake'].includes(variant);
  const fg = onLight ? '#171B3A' : '#FFFFFF';
  const inner = (
    <div
      className="rounded-[16px] p-3.5 flex flex-col justify-end w-full"
      style={{ height, background: gradientCss(variant) }}
    >
      <div className="font-serif text-[17px] leading-snug" style={{ color: fg }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs mt-1" style={{ color: fg, opacity: 0.82 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
  if (href) return <Link href={href} className="block">{inner}</Link>;
  return inner;
}

// ─── Top bar (back / title / action) for standalone flows ───────────
export function FlowTopBar({
  onClose,
  closeHref,
  variant = 'close',
  right,
  dark = false,
}: {
  onClose?: () => void;
  closeHref?: string;
  variant?: 'close' | 'back';
  right?: React.ReactNode;
  dark?: boolean;
}) {
  const color = dark ? 'text-cream' : 'text-ink-muted';
  const Icon = variant === 'back' ? BackIcon : CloseIcon;
  const btn = (
    <span className={`${color} hover:opacity-70 transition-opacity`}>
      <Icon />
    </span>
  );
  return (
    <div className="flex items-center justify-between h-11">
      {closeHref ? (
        <Link href={closeHref} aria-label="إغلاق">{btn}</Link>
      ) : (
        <button onClick={onClose} aria-label="إغلاق">{btn}</button>
      )}
      {right}
    </div>
  );
}
