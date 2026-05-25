'use client';

const greetings = [
  { time: 0, text: 'صباح الخير' },
  { time: 12, text: 'مساء الخير' },
  { time: 18, text: 'مساء الخير' },
];

export function TodayHeader() {
  const hour = new Date().getHours();
  const greeting = greetings.find((g, i) =>
    hour >= g.time && (!greetings[i + 1] || hour < greetings[i + 1].time)
  ) || greetings[0];

  return (
    <div className="flex items-baseline gap-2">
      <h1 className="text-3xl font-semibold text-ink">{greeting.text}</h1>
    </div>
  );
}
