'use client';

import { GradientOrb } from './GradientOrb';

const gradients: Record<string, [string, string]> = {
  dawn: ['#F8D6BE', '#E9785E'],
  sage: ['#C9D2BE', '#8FA084'],
  lake: ['#C2D3E2', '#7E97B8'],
  dusk: ['#9C8AB8', '#5A3E7A'],
  night: ['#3A4490', '#1B1F47'],
  ember: ['#F5A584', '#D4704A'],
  dust: ['#D4C4B0', '#8B7B6B'],
};

export function HeroCard({
  eyebrow,
  title,
  subtitle,
  variant = 'dawn',
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  variant?: keyof typeof gradients;
}) {
  const [a, b] = gradients[variant] || gradients.dawn;
  const onDark = ['dusk', 'night'].includes(variant);
  const fg = onDark ? '#FFFFFF' : '#171B3A';

  return (
    <div
      className="mx-5 mt-4.5 rounded-[22px] overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${a}, ${b})`,
        padding: 22,
      }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)',
      }} />

      <div className="relative z-10">
        <div
          className="text-xs font-semibold tracking-[0.18em] uppercase"
          style={{ color: fg, opacity: 0.75 }}
        >
          {eyebrow}
        </div>

        <div
          className="text-2xl mt-2 leading-tight font-semibold"
          style={{ color: fg }}
        >
          {title}
        </div>

        <div
          className="text-sm mt-1.5"
          style={{ color: fg, opacity: 0.78 }}
        >
          {subtitle}
        </div>

        <div className="mt-4.5 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-cream">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          <div className="text-sm" style={{ color: fg, opacity: 0.85 }}>
            مايا كول · ١٠ دقائق
          </div>
        </div>
      </div>
    </div>
  );
}
