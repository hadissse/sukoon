'use client';

export function StreakBadge({ count = 3 }: { count?: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[14px] bg-coral/10">
      <span className="text-sm font-semibold text-coral">{count} يومًا</span>
    </div>
  );
}
