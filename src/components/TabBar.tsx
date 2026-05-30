'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { key: 'today', label: 'اليوم', href: '/today', icon: TodayIcon },
  { key: 'library', label: 'مكتبتي', href: '/library', icon: LibraryIcon },
  { key: 'self', label: 'أنت', href: '/self', icon: SelfIcon },
] as const;

function TodayIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#171B3A">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#171B3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#171B3A' : '#5C5C7A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={active ? '#171B3A' : 'none'} />
    </svg>
  );
}

function SelfIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#171B3A">
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" fill="#171B3A" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C5C7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-rule-soft safe-bottom z-50">
      <div className="flex items-center justify-around max-w-[430px] mx-auto h-[52px]">
        {tabs.map((tab) => {
          const active = pathname.startsWith('/' + tab.key);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 transition-colors ${
                active ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              <Icon active={active} />
              <span className="text-[10.5px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
