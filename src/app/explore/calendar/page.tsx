'use client';

import { V2Header } from '@/components/v2/V2Header';
import { FooterTabBar } from '@/components/v2/FooterTabBar';
import { CalendarMonthView } from '../CalendarMonthView';

export default function CalendarPage() {
  return (
    <div className="max-w-[430px] mx-auto w-full pb-28">
      <V2Header title="تقويم العبورات" />
      <div className="px-4 mt-1">
        <CalendarMonthView />
      </div>
      <FooterTabBar active="explore" />
    </div>
  );
}
