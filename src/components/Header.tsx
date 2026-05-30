'use client';

import Link from 'next/link';
import { SukoonIcon } from './SukoonIcon';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl safe-top">
      <div className="flex items-center justify-between max-w-[430px] mx-auto h-12 px-5">
        {/* Left: settings */}
        <Link href="/settings" className="p-1 -m-1 text-ink-muted hover:text-ink transition-colors" aria-label="الإعدادات">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
            <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
          </svg>
        </Link>

        {/* Center: logo */}
        <Link href="/today" aria-label="سُكون">
          <SukoonIcon size={44} />
        </Link>

        {/* Right: plus */}
        <Link
          href="/log"
          className="p-1 -m-1 text-coral hover:text-coral/80 transition-colors"
          aria-label="تسجيل لحظة"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
