import Link from 'next/link';

export function SettingsSubHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-2 pb-4">
      <Link href="/settings" className="text-ink-muted hover:text-ink transition-colors" aria-label="رجوع">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
      <h1 className="font-serif text-2xl text-ink">{title}</h1>
    </div>
  );
}
