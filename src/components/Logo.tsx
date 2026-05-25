import React from 'react';

interface LogoProps {
  height?: number;
  color?: string;
  className?: string;
}

// Logo uses CSS mask-image so it can be tinted any color.
// Aspect ratio 4.2× width per height (logo is wide).
export function Logo({ height = 28, color = 'currentColor', className }: LogoProps) {
  const width = Math.round(height * 4.2);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width,
        height,
        backgroundColor: color,
        maskImage: 'url(/sukoon-logo.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/sukoon-logo.png)',
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
