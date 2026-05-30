'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';

const tabs = [
  { key: 'today', label: 'اليوم', href: '/today', icon: TodayIcon },
  { key: 'self', label: 'أنت', href: '/self', icon: SelfIcon },
] as const;

function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#171B3A' : 'none'} stroke={active ? '#171B3A' : '#5C5C7A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill={active ? '#171B3A' : 'none'} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}


function SelfIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#171B3A' : 'none'} stroke={active ? '#171B3A' : '#5C5C7A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" fill={active ? '#171B3A' : 'none'} />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" fill={active ? '#171B3A' : 'none'} />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:shrink-0 md:w-[248px] lg:w-[272px] md:sticky md:top-0 md:h-dvh border-e border-rule-soft bg-cream-soft/40 backdrop-blur-xl">
      <div className="flex flex-col h-full px-5 py-6">
        {/* Brand */}
        <Link href="/today" className="flex items-center gap-2 px-2 mb-8" aria-label="سُكون">
          <Logo height={65} color="#171B3A" />
        </Link>

        {/* Primary navigation */}
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const active = pathname.startsWith('/' + tab.key);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`flex items-center gap-3 px-3.5 h-11 rounded-[14px] text-[15px] font-medium transition-colors ${
                  active ? 'bg-white text-ink shadow-sm border border-rule-soft' : 'text-ink-muted hover:text-ink hover:bg-white/60'
                }`}
              >
                <Icon active={active} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="h-px bg-rule-soft my-5 mx-2" />

        {/* Quick actions / filters */}
        <div className="flex flex-col gap-1">
          <Link
            href="/log"
            className="flex items-center gap-3 px-3.5 h-11 rounded-[14px] text-[15px] font-medium text-coral hover:bg-white/60 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>تسجيل لحظة</span>
          </Link>
          <Link
            href="/journey-2"
            className="flex items-center gap-3 px-3.5 h-11 rounded-[14px] text-[15px] font-medium text-ink-muted hover:text-ink hover:bg-white/60 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3v18l7-4 7 4V3z" />
            </svg>
            <span>تتبّع وحفظ</span>
          </Link>
        </div>

        <div className="mt-auto pt-5">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3.5 h-11 rounded-[14px] text-[15px] font-medium transition-colors ${
              pathname.startsWith('/settings') ? 'bg-white text-ink shadow-sm border border-rule-soft' : 'text-ink-muted hover:text-ink hover:bg-white/60'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
              <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
              <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
            </svg>
            <span>الإعدادات</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
