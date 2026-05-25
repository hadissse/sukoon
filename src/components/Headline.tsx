'use client';

interface HeadlineProps {
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
}

const sizeClasses = {
  lg: 'text-3xl font-bold',
  md: 'text-2xl font-semibold',
  sm: 'text-xl font-semibold',
} as const;

export function Headline({ children, size = 'md', className = '' }: HeadlineProps) {
  return (
    <h2 className={`${sizeClasses[size]} text-ink leading-snug ${className}`}>
      {children}
    </h2>
  );
}
