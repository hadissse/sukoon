'use client';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'time';
  className?: string;
}

export function Field({ label, value, onChange, placeholder, type = 'text', className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-ink-soft">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-[14px]
          bg-cream-soft border border-rule-soft
          text-ink placeholder:text-ink-muted
          focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/30
          transition-colors
        "
      />
    </div>
  );
}
