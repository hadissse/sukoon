import React from 'react';

interface LogoProps {
  height?: number;
  color?: string;
  className?: string;
}

// Logo uses CSS mask-image so it can be tinted any color.
// Aspect ratio 1.77× (2447 ÷ 1383) — sukoon typo v2.svg
export function Logo({ height = 28, color = 'currentColor', className }: LogoProps) {
  const width = Math.round(height * 1.77);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width,
        height,
        backgroundColor: color,
        maskImage: 'url(/sukoon-logo.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/sukoon-logo.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        flexShrink: 0,
      }}
      aria-label="سُكون"
      role="img"
    />
  );
}
