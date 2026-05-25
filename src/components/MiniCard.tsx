'use client';

export function MiniCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <div className="flex-shrink-0 w-36 snap-start rounded-[14px] bg-sand p-3 flex flex-col gap-2">
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="text-sm font-medium text-ink">{title}</div>
      {subtitle && <div className="text-xs text-ink-muted">{subtitle}</div>}
    </div>
  );
}
