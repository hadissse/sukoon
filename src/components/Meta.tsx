'use client';

interface MetaProps {
  children: React.ReactNode;
  className?: string;
}

export function Meta({ children, className = '' }: MetaProps) {
  return (
    <span className={`text-xs font-medium tracking-widest uppercase text-ink-muted ${className}`}>
      {children}
    </span>
  );
}
