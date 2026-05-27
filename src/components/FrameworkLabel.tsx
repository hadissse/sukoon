interface FrameworkLabelProps {
  label?: string;
  className?: string;
}

export function FrameworkLabel({
  label = 'قراءة علم الفلك الغربي الاستوائي',
  className = '',
}: FrameworkLabelProps) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold tracking-widest uppercase text-ink-muted border border-rule-soft rounded-full px-2.5 py-0.5 ${className}`}
    >
      {label}
    </span>
  );
}
