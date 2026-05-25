'use client';

interface BodyProps {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}

export function Body({ children, muted = false, className = '' }: BodyProps) {
  return (
    <p className={`text-base leading-relaxed ${muted ? 'text-ink-muted' : 'text-ink'} ${className}`}>
      {children}
    </p>
  );
}
