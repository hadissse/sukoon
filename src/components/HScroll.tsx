'use client';

export function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5">
      {children}
    </div>
  );
}
