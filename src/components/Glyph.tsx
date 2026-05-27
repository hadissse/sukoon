import React from 'react';

interface GlyphProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Maps common planet/sign names to their SVG filenames.
const GLYPH_ALIASES: Record<string, string> = {
  aquarius: 'aqua',
  sagittarius: 'sag',
  capricorn: 'cap',
  'north-node': 'northnode',
  'south-node': 'southnode',
  northNode: 'northnode',
  southNode: 'southnode',
};

export function Glyph({ name, size = 24, color = 'currentColor', className }: GlyphProps) {
  const slug = GLYPH_ALIASES[name] ?? name;
  const src = `/svg/${slug}.svg`;

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: color,
        maskImage: `url(${src})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}
