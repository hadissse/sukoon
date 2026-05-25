'use client';

interface PaperProps {
  children: React.ReactNode;
  variant?: 'cream' | 'midnight';
  className?: string;
}

export function Paper({ children, variant = 'cream', className = '' }: PaperProps) {
  const bg = variant === 'cream' ? 'bg-cream text-ink' : 'bg-midnight text-white';
  return (
    <div className={`min-h-dvh ${bg} ${className}`}>
      {children}
    </div>
  );
}
