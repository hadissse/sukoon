'use client';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active = false, onClick, className = '' }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-[14px] text-sm font-medium
        transition-colors duration-150
        ${active
          ? 'bg-ink text-cream'
          : 'bg-cream-soft text-ink-soft hover:bg-sand'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
