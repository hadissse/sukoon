'use client';

interface CTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-coral text-white hover:bg-coral/90 active:bg-coral/80',
  secondary: 'bg-cream-soft text-ink hover:bg-sand active:bg-sand/80',
  ghost: 'bg-transparent text-ink-soft hover:bg-cream-soft active:bg-sand',
} as const;

export function CTA({ children, onClick, variant = 'primary', disabled = false, className = '' }: CTAProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3.5 px-7 rounded-[18px] text-base font-semibold
        transition-colors duration-150
        disabled:opacity-40 disabled:pointer-events-none
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
