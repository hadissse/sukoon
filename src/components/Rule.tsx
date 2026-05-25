'use client';

interface RuleProps {
  className?: string;
}

export function Rule({ className = '' }: RuleProps) {
  return <hr className={`border-0 h-px bg-rule-soft ${className}`} />;
}
