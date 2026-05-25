'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-[18px] p-5
        shadow-[0_1px_3px_rgba(23,27,58,0.06)]
        ${onClick ? 'cursor-pointer hover:shadow-[0_2px_8px_rgba(23,27,58,0.1)] transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
