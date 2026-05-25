'use client';

import Link from 'next/link';

type TabKey = 'self' | 'explore' | 'today';

const TABS: { key: TabKey; label: string; href: string }[] = [
  { key: 'self', label: 'ذاتك', href: '/self' },
  { key: 'explore', label: 'استكشاف', href: '/explore' },
  { key: 'today', label: 'اليوم', href: '/today' },
];

function Icon({ tab, active, dark }: { tab: TabKey; active: boolean; dark: boolean }) {
  const c = active ? (dark ? '#FFFFFF' : '#171B3A') : dark ? 'rgba(241,236,222,0.45)' : '#5C5C7A';
  if (tab === 'self') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (tab === 'explore') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="7" height="7" />
        <rect x="13" y="4" width="7" height="7" />
        <rect x="4" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11l8-7 8 7v10H4V11z" />
    </svg>
  );
}

/**
 * Standalone bottom tab bar used by the V2 contemplative full-screen views.
 * Mirrors the design's TabBarV2 (ذاتك · استكشاف · اليوم) but is link-based.
 */
export function FooterTabBar({ active = 'today', dark = false }: { active?: TabKey; dark?: boolean }) {
  const bg = dark ? 'rgba(15,18,40,0.85)' : 'rgba(255,255,255,0.96)';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(23,27,58,0.08)';
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 backdrop-blur-xl safe-bottom"
      style={{ background: bg, borderTop: `0.5px solid ${border}` }}
    >
      <div className="flex items-center justify-around max-w-[430px] mx-auto pt-2 pb-1">
        {TABS.map((t) => {
          const isActive = t.key === active;
          const c = isActive ? (dark ? '#FFFFFF' : '#171B3A') : dark ? 'rgba(241,236,222,0.45)' : '#5C5C7A';
          return (
            <Link key={t.key} href={t.href} className="flex flex-col items-center gap-1 px-4 py-1.5">
              <Icon tab={t.key} active={isActive} dark={dark} />
              <span className="text-[10.5px] font-medium" style={{ color: c }}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
