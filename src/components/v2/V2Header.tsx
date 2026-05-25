'use client';

/**
 * Large serif page title + global icon cluster, mirroring the design's HeaderV2.
 * Used by the V2 explore/self full-screen views.
 */
export function V2Header({ title }: { title: string }) {
  return (
    <div className="pt-4 px-5 flex justify-between items-center">
      <h1 className="font-serif text-[28px] text-ink font-medium tracking-tight">{title}</h1>
      <div className="flex gap-4 items-center text-ink">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171B3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19 5l-1.5 1.5M6.5 17.5L5 19M19 19l-1.5-1.5M6.5 6.5L5 5" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171B3A" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.5-4.5" />
        </svg>
        <span className="w-[22px] h-[22px] flex items-center justify-center text-[18px] text-coral font-medium">✦</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h12v14H4zM6 9h8M6 13h6" stroke="#171B3A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
