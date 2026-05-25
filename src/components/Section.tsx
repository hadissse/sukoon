'use client';

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );
}
